using AutoMapper;
using Microsoft.Extensions.Logging;
using PrefeituraCachoeiro.Aplicacao.Dtos.Requisicoes;
using PrefeituraCachoeiro.Aplicacao.Dtos.Respostas;
using PrefeituraCachoeiro.Aplicacao.Interfaces;
using PrefeituraCachoeiro.Dados.Interfaces;
using PrefeituraCachoeiro.Dominio.Entidades;
using PrefeituraCachoeiro.Dominio.Errors;
using PrefeituraCachoeiro.TratadorControlador.ObjetosValor;

namespace PrefeituraCachoeiro.Aplicacao.Servicos
{
    public class UsuariosGruposService: IUsuariosGruposService
    {
        private readonly IMapper _mapper;
        private readonly ILogger _logger;
        private readonly IUsuariosGruposRepository _usuariosGruposRepository;

        public UsuariosGruposService(IMapper mapper, ILoggerFactory loggerFactory, IUsuariosGruposRepository usuariosGruposRepository)
        {
            _mapper = mapper;
            _logger = loggerFactory.CreateLogger<UsuariosGruposService>();
            _usuariosGruposRepository = usuariosGruposRepository;
        }

        public async Task<Result<List<GruposResponse>>> BuscarGruposPorUsuarioIdAsync(BuscarGruposPorUsuarioIdRequest requisicao, CancellationToken cancellationToken)
        {
            var gruposFound = await _usuariosGruposRepository.BuscarGruposPorUsuarioIdAsync(requisicao.UsuarioId, cancellationToken);
            var result = _mapper.Map<List<GruposResponse>>(gruposFound);

            return Result<List<GruposResponse>>.Success(result);
        }

        public async Task<Result<List<GruposResponse>>> BuscarGruposDisponiveisPorUsuarioIdAsync(BuscarGruposDisponiveisPorUsuarioIdRequest requisicao, CancellationToken cancellationToken)
        {
            var gruposFound = await _usuariosGruposRepository.BuscarGruposDisponiveisPorUsuarioIdAsync(requisicao.UsuarioId, cancellationToken);
            var result = _mapper.Map<List<GruposResponse>>(gruposFound);

            return Result<List<GruposResponse>>.Success(result);
        }

        public async Task<Result<CriarUsuariosGruposResponse>> InserirAsync(CriarUsuariosGruposRequest requisicao, CancellationToken cancellationToken)
        {
            try
            {
                var usuarioGrupo = await this._usuariosGruposRepository.BuscarUsuarioGruposAsync(
                    requisicao.UsuarioId, requisicao.GrupoId, cancellationToken);

                if (usuarioGrupo != null)
                    return Result<CriarUsuariosGruposResponse>.Failure(new UsuarioGrupoJaExistenteError(Compartilhado.UsuarioGrupo.UsuarioGrupoExistente));

                var grupo = new UsuariosGruposEntidade(requisicao.UsuarioId, requisicao.GrupoId);
                grupo = await _usuariosGruposRepository.InserirAsync(grupo, cancellationToken);
                var result = _mapper.Map<CriarUsuariosGruposResponse>(grupo);

                return Result<CriarUsuariosGruposResponse>.Success(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);

                return Result<CriarUsuariosGruposResponse>.Failure(new UnknownError(ex.Message));
            }
        }

        public async Task<Result<DeletarUsuarioGrupoResponse>> DeletarAsync(DeletarUsuarioGrupoRequest requisicao, CancellationToken cancellationToken)
        {
            try
            {
                var grupoFound = await _usuariosGruposRepository.BuscarUsuarioGruposAsync(
                    requisicao.UsuarioId, requisicao.GrupoId, cancellationToken);

                if (grupoFound is null)
                    return Result<DeletarUsuarioGrupoResponse>.Failure(new UsuarioGrupoNaoEncontradoError(Compartilhado.UsuarioGrupo.UsuarioGrupoNaoEncontrado));

                grupoFound.Delete();
                await _usuariosGruposRepository.DeletarAsync(grupoFound, cancellationToken);
                var result = new DeletarUsuarioGrupoResponse(Compartilhado.UsuarioGrupo.UsuarioGrupoDeletado);

                return Result<DeletarUsuarioGrupoResponse>.Success(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);

                return Result<DeletarUsuarioGrupoResponse>.Failure(new UnknownError(ex.Message));
            }
        }
    }
}