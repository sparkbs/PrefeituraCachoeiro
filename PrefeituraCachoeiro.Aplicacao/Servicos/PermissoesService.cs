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
    public class PermissoesService : IPermissoesService
    {
        private readonly IMapper _mapper;
        private readonly ILogger _logger;
        private readonly IPermissoesRepository _permissoesRepository;

        public PermissoesService(IMapper mapper, ILoggerFactory loggerFactory, IPermissoesRepository permissoesRepository)
        {
            _mapper = mapper;
            _logger = loggerFactory.CreateLogger<PermissoesService>();
            _permissoesRepository = permissoesRepository;
        }

        public async Task<Result<List<TiposPermissoesResponse>>> BuscarPermissoesPorGrupoIdAsync(CriarBuscarPermissoesPorGrupoIdRequest requisicao, CancellationToken cancellationToken)
        {
            var permissoes = await _permissoesRepository.BuscarPermissoesPorGrupoIdAsync(requisicao.GrupoId, cancellationToken);
            var result = _mapper.Map<List<TiposPermissoesResponse>>(permissoes);

            return Result<List<TiposPermissoesResponse>>.Success(result);
        }

        public async Task<Result<CriarPermissoesResponse>> InserirAsync(CriarPermissoesRequest requisicao, CancellationToken cancellationToken)
        {
            try
            {
                var permissao = await this._permissoesRepository.BuscarPermissaoGruposAsync(
                    requisicao.GrupoId, requisicao.TipoPermissaoId, cancellationToken);

                if (permissao != null)
                    return Result<CriarPermissoesResponse>.Failure(new PermissaoGrupoJaExistenteError(Compartilhado.Permissao.PermissaoGrupoDuplicada));

                var permissaoGravada = new PermissoesEntidade(requisicao.TipoPermissaoId, requisicao.GrupoId);
                permissaoGravada = await _permissoesRepository.InserirAsync(permissaoGravada, cancellationToken);
                var result = _mapper.Map<CriarPermissoesResponse>(permissaoGravada);

                return Result<CriarPermissoesResponse>.Success(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);

                return Result<CriarPermissoesResponse>.Failure(new UnknownError(ex.Message));
            }
        }

        public async Task<Result<DeletarPermissaoResponse>> DeletarAsync(DeletarPermissaoRequest requisicao, CancellationToken cancellationToken)
        {
            try
            {
                var permissaoFound = await _permissoesRepository.BuscarPermissaoGruposAsync(
                    requisicao.GrupoId, requisicao.TipoPermissaoId, cancellationToken);

                if (permissaoFound is null)
                    return Result<DeletarPermissaoResponse>.Failure(new GrupoPermissaoNaoEncontradoError(Compartilhado.Permissao.GrupoPermissaoNaoEncontrado));

                permissaoFound.Delete();
                await _permissoesRepository.DeletarAsync(permissaoFound, cancellationToken);
                var result = new DeletarPermissaoResponse(Compartilhado.Permissao.PermissaoDeletada);

                return Result<DeletarPermissaoResponse>.Success(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);

                return Result<DeletarPermissaoResponse>.Failure(new UnknownError(ex.Message));
            }
        }
    }
}