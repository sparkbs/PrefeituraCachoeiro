using AutoMapper;
using Microsoft.Extensions.Logging;
using PrefeituraCachoeiro.Aplicacao.Dtos.Requisicoes;
using PrefeituraCachoeiro.Aplicacao.Dtos.Requisicoes.Validacoes;
using PrefeituraCachoeiro.Aplicacao.Dtos.Respostas;
using PrefeituraCachoeiro.Aplicacao.Interfaces;
using PrefeituraCachoeiro.Dados.Filtros;
using PrefeituraCachoeiro.Dados.Interfaces;
using PrefeituraCachoeiro.Dominio.Entidades;
using PrefeituraCachoeiro.Dominio.Errors;
using PrefeituraCachoeiro.TratadorControlador.ObjetosValor;

namespace PrefeituraCachoeiro.Aplicacao.Servicos
{
    public class UsuariosService : IUsuariosService
    {
        private readonly IMapper _mapper;
        private readonly ILogger _logger;
        private readonly IUsuariosRepository _usuariosRepository;
        private readonly ISegurancaService _segurancaService;

        public UsuariosService(IMapper mapper, ILoggerFactory loggerFactory,
            IUsuariosRepository usuariosRepository, ISegurancaService segurancaService)
        {
            _mapper = mapper;
            _logger = loggerFactory.CreateLogger<UsuariosService>();
            _usuariosRepository = usuariosRepository;
            _segurancaService = segurancaService;
        }

        public async Task<Result<UsuariosResponse>> BuscarPorIdAsync(int id, CancellationToken cancellationToken)
        {
            var usuarioFound = await _usuariosRepository.BuscarPorIdAsync(id, cancellationToken);

            if (usuarioFound is null)
                return Result<UsuariosResponse>.Failure(new NoRecordsError(Compartilhado.Usuarios.UsuarioIdNaoEncontrado));

            var result = _mapper.Map<UsuariosResponse>(usuarioFound);
            return Result<UsuariosResponse>.Success(result);
        }

        public async Task<Result<UsuariosDataResponse>> BuscarTodosAsync(UsuariosFilter filter, CancellationToken cancellationToken)
        {
            var usuariosFound = await _usuariosRepository.BuscarTodosAsync(filter, cancellationToken);

            if (usuariosFound.TotalRegistros is 0)
                return Result<UsuariosDataResponse>.Failure(new NoRecordsError(Compartilhado.Usuarios.UsuariosNaoEncontrado));

            var mapped = _mapper.Map<List<UsuariosResponse>>(usuariosFound.Items);
            var result = new UsuariosDataResponse
            {
                Data = mapped,
                TotalRegisters = usuariosFound.TotalRegistros,
            };

            return Result<UsuariosDataResponse>.Success(result);
        }

        public async Task<Result<CriarUsuarioResponse>> InserirAsync(CriarUsuarioRequest requisicao, CancellationToken cancellationToken)
        {
            try
            {
                var validation = await new CriarUsuarioValidacao().ValidateAsync(requisicao, cancellationToken);

                if (!validation.IsValid)
                    return Result<CriarUsuarioResponse>.Failure(new ValidationError(validation.Errors));

                var _loginExiste = await this._usuariosRepository.BuscarPorLogingAsync(requisicao.Login, cancellationToken);

                if (_loginExiste != null)
                    return Result<CriarUsuarioResponse>.Failure(new LoginDuplicadoError(Compartilhado.Usuarios.LoginExistente));

                var usuario = new UsuariosEntidade(requisicao.Login,
                    requisicao.Nome, this._segurancaService.GerarHashSenha(requisicao.Senha));
                usuario = await _usuariosRepository.InserirAsync(usuario, cancellationToken);
                var result = _mapper.Map<CriarUsuarioResponse>(usuario);

                return Result<CriarUsuarioResponse>.Success(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);

                return Result<CriarUsuarioResponse>.Failure(new UnknownError(ex.Message));
            }
        }

        public async Task<Result<AtualizarUsuarioResponse>> AtualizarAsync(AtualizarUsuarioRequest requisicao, CancellationToken cancellationToken)
        {
            try
            {
                var validation = await new AtualizarUsuarioValidacao().ValidateAsync(requisicao, cancellationToken);

                if (!validation.IsValid)
                    return Result<AtualizarUsuarioResponse>.Failure(new ValidationError(validation.Errors));

                var usuarioFound = await _usuariosRepository.BuscarPorIdAsync(requisicao.Id, cancellationToken);

                if (usuarioFound is null)
                    return Result<AtualizarUsuarioResponse>.Failure(new NotFoundError(Compartilhado.Usuarios.UsuarioIdNaoEncontrado));

                var _loginExiste = await this._usuariosRepository.BuscarPorLogingAsync(requisicao.Login, cancellationToken);

                if (_loginExiste != null && _loginExiste.IdUsuario != usuarioFound.IdUsuario)
                    return Result<AtualizarUsuarioResponse>.Failure(new LoginDuplicadoError(Compartilhado.Usuarios.LoginExistente));

                usuarioFound.Nome = requisicao.Nome;
                usuarioFound.Login = requisicao.Login;
                usuarioFound.Senha = this._segurancaService.GerarHashSenha(requisicao.Senha);

                await _usuariosRepository.AtualizarAsync(usuarioFound, cancellationToken);
                var result = _mapper.Map<AtualizarUsuarioResponse>(usuarioFound);

                return Result<AtualizarUsuarioResponse>.Success(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);

                return Result<AtualizarUsuarioResponse>.Failure(new UnknownError(ex.Message));
            }
        }

        public async Task<Result<DeletarUsuarioResponse>> DeletarAsync(int id, CancellationToken cancellationToken)
        {
            try
            {
                var usuarioFound = await _usuariosRepository.BuscarPorIdAsync(id, cancellationToken);

                if (usuarioFound is null)
                    return Result<DeletarUsuarioResponse>.Failure(new NoRecordsError(Compartilhado.Usuarios.UsuarioIdNaoEncontrado));

                usuarioFound.Delete();
                await _usuariosRepository.DeletarAsync(usuarioFound, cancellationToken);

                var result = new DeletarUsuarioResponse { Mensagem = Compartilhado.Usuarios.UsuarioDeletado };

                return Result<DeletarUsuarioResponse>.Success(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);

                return Result<DeletarUsuarioResponse>.Failure(new UnknownError(ex.Message));
            }
        }
    }
}