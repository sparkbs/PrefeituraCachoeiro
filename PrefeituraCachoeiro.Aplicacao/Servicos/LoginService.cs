using AutoMapper;
using Microsoft.Extensions.Logging;
using PrefeituraCachoeiro.Aplicacao.Dtos.Requisicoes;
using PrefeituraCachoeiro.Aplicacao.Interfaces;
using PrefeituraCachoeiro.Dados.Interfaces;
using PrefeituraCachoeiro.Dominio.Errors;
using PrefeituraCachoeiro.TratadorControlador.ObjetosValor;

namespace PrefeituraCachoeiro.Aplicacao.Servicos
{
    public class LoginService : ILoginService
    {
        private readonly IMapper _mapper;
        private readonly ILogger _logger;
        private readonly IUsuariosRepository _usuariosRepository;
        private readonly ISegurancaService _segurancaService;
        private readonly ITokenService _tokenService;

        public LoginService(IMapper mapper, ILoggerFactory loggerFactory, IUsuariosRepository usuariosRepository,
            ISegurancaService segurancaService, ITokenService tokenService)
        {
            _mapper = mapper;
            _logger = loggerFactory.CreateLogger<LoginService>();
            _usuariosRepository = usuariosRepository;
            _segurancaService = segurancaService;
            _tokenService = tokenService;
        }

        public async Task<Result<VerificarLoginResponse>> VerificarLoginAsync(VerificarLoginRequest request, CancellationToken cancellationToken)
        {
            var usuarioFound = await _usuariosRepository.BuscarPorLogingAsync(request.Login, cancellationToken);

            if (usuarioFound is null)
                return Result<VerificarLoginResponse>.Failure(new LoginNaoEncontradoError(Compartilhado.Usuarios.LoginNaoEncontrado));

            var _hashSenhaLocal = this._segurancaService.GerarHashSenha(request.Senha);

            if (_hashSenhaLocal == usuarioFound.Senha)
                return Result<VerificarLoginResponse>.Success(
                    await VerificarLoginSucesso(request, cancellationToken));

            return Result<VerificarLoginResponse>.Failure(new LoginOrSenhaInvalidosError(Compartilhado.Login.LoginOuSenhaInvalidos));
        }

        private async Task<VerificarLoginResponse> VerificarLoginSucesso(VerificarLoginRequest request, CancellationToken cancellationToken)
        {
            var _accessToken = await _tokenService.GerarToken(request, cancellationToken);

            return new VerificarLoginResponse(request.Login, true, _accessToken.AccessToken);
        }
    }
}