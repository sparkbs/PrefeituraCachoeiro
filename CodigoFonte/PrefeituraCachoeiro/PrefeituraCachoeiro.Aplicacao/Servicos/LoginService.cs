using AutoMapper;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using PrefeituraCachoeiro.Aplicacao.Dtos.Requisicoes;
using PrefeituraCachoeiro.Aplicacao.Dtos.Respostas;
using PrefeituraCachoeiro.Aplicacao.Interfaces;
using PrefeituraCachoeiro.Dados.Interfaces;
using PrefeituraCachoeiro.Dominio.Entidades;
using PrefeituraCachoeiro.Dominio.Errors;
using PrefeituraCachoeiro.Environment;
using PrefeituraCachoeiro.TratadorControlador.ObjetosValor;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace PrefeituraCachoeiro.Aplicacao.Servicos
{
    public class LoginService : ILoginService
    {
        private const string DATE_FORMAT = "yyy-MM-dd HH:mm:ss";

        private readonly IMapper _mapper;
        private readonly ILogger _logger;
        private readonly IUsuariosRepository _usuariosRepository;
        private readonly ISegurancaService _segurancaService;
        private readonly AppSettings _appSettings;

        public LoginService(IMapper mapper, ILoggerFactory loggerFactory, IUsuariosRepository usuariosRepository,
            ISegurancaService segurancaService, AppSettings appSettings)
        {
            _mapper = mapper;
            _logger = loggerFactory.CreateLogger<LoginService>();
            _usuariosRepository = usuariosRepository;
            _segurancaService = segurancaService;
            _appSettings = appSettings;
        }

        public async Task<Result<VerificarLoginResponse>> VerificarLoginAsync(VerificarLoginRequest request, CancellationToken cancellationToken)
        {
            var usuarioFound = await _usuariosRepository.BuscarPorLogingAsync(request.Login, cancellationToken);

            if (usuarioFound is null)
                return Result<VerificarLoginResponse>.Failure(new LoginNaoEncontradoError(Compartilhado.Usuarios.LoginNaoEncontrado));

            var _hashSenhaLocal = this._segurancaService.GerarHashSenha(request.Senha);

            if (_hashSenhaLocal == usuarioFound.Senha)
            {
                var claims = GerarClaims(usuarioFound);
                var accessToken = GerarAccessToken(claims);
                var refreshToken = GerarRefreshToken();
                var _token = GerarAuthToken(DateTime.Now, refreshToken, accessToken, usuarioFound);
                var _verificarLoginResponse = new VerificarLoginResponse(request.Login, _token.Authenticated, _token);

                return Result<VerificarLoginResponse>.Success(_verificarLoginResponse);
            }

            return Result<VerificarLoginResponse>.Failure(new LoginOrSenhaInvalidosError(Compartilhado.Login.LoginOuSenhaInvalidos));
        }

        private AccessTokenResponse GerarAuthToken(DateTime dataCriacao, string refreshToken, string accessToken, UsuariosEntidade usuario)
        {
            return new AccessTokenResponse
            {
                RefreshToken = refreshToken,
                Expiration = dataCriacao.AddMinutes(_appSettings.TokenConfiguration.Minutes).ToString(DATE_FORMAT),
                AccessToken = accessToken,
                Authenticated = true,
                Created = dataCriacao.ToString(DATE_FORMAT),
                Login = usuario.Login,
                IdUsuario = usuario.IdUsuario,
                Nome = usuario.Nome
            };
        }

        private string GerarAccessToken(IEnumerable<Claim> claims)
        {
            var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_appSettings.TokenConfiguration.Secret));
            var signinCredenctials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
            var options = new JwtSecurityToken(
                issuer: _appSettings.TokenConfiguration.Issuer,
                audience: _appSettings.TokenConfiguration.Audience,
                claims: claims,
                expires: DateTime.Now.AddMinutes(_appSettings.TokenConfiguration.Minutes),
                signingCredentials: signinCredenctials
                );

            return new JwtSecurityTokenHandler().WriteToken(options);
        }

        private string GerarRefreshToken()
        {
            var randomNumber = new byte[32];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomNumber);

                return Convert.ToBase64String(randomNumber);
            }
        }

        private List<Claim> GerarClaims(UsuariosEntidade usuario)
        {
            return new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString("N")),
                new Claim(JwtRegisteredClaimNames.UniqueName, usuario.Login)
            };
        }
    }
}