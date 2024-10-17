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
    public class GruposService : IGruposService
    {
        private readonly IMapper _mapper;
        private readonly ILogger _logger;
        private readonly IGruposRepository _gruposRepository;

        public GruposService(IMapper mapper, ILoggerFactory loggerFactory, IGruposRepository gruposRepository)
        {
            _mapper = mapper;
            _logger = loggerFactory.CreateLogger<GruposService>();
            _gruposRepository = gruposRepository;
        }

        public async Task<Result<GruposResponse>> BuscarPorIdAsync(int id, CancellationToken cancellationToken)
        {
            var projetoFound = await _gruposRepository.BuscarPorIdAsync(id, cancellationToken);

            if (projetoFound is null)
                return Result<GruposResponse>.Failure(new NoRecordsError(Compartilhado.Grupos.GrupoIdNaoEncontrado));

            var result = _mapper.Map<GruposResponse>(projetoFound);
            return Result<GruposResponse>.Success(result);
        }

        public async Task<Result<GruposDataResponse>> BuscarTodosAsync(GruposFilter filter, CancellationToken cancellationToken)
        {
            var gruposFound = await _gruposRepository.BuscarTodosAsync(filter, cancellationToken);

            if (gruposFound.TotalRegistros is 0)
                return Result<GruposDataResponse>.Failure(new NoRecordsError(Compartilhado.Grupos.GruposNaoEncontrado));

            var mapped = _mapper.Map<List<GruposResponse>>(gruposFound.Items);
            var result = new GruposDataResponse
            {
                Data = mapped,
                TotalRegisters = gruposFound.TotalRegistros,
            };

            return Result<GruposDataResponse>.Success(result);
        }

        public async Task<Result<CriarGrupoResponse>> InserirAsync(CriarGrupoRequest requisicao, CancellationToken cancellationToken)
        {
            try
            {
                var validation = await new CriarGrupoValidacao().ValidateAsync(requisicao, cancellationToken);

                if (!validation.IsValid)
                    return Result<CriarGrupoResponse>.Failure(new ValidationError(validation.Errors));

                var grupo = new GruposEntidade(requisicao.Nome);
                grupo = await _gruposRepository.InserirAsync(grupo, cancellationToken);
                var result = _mapper.Map<CriarGrupoResponse>(grupo);

                return Result<CriarGrupoResponse>.Success(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);

                return Result<CriarGrupoResponse>.Failure(new UnknownError(ex.Message));
            }
        }

        public async Task<Result<AtualizarGrupoResponse>> AtualizarAsync(AtualizarGrupoRequest requisicao, CancellationToken cancellationToken)
        {
            try
            {
                var validation = await new AtualizarGrupoValidacao().ValidateAsync(requisicao, cancellationToken);

                if (!validation.IsValid)
                    return Result<AtualizarGrupoResponse>.Failure(new ValidationError(validation.Errors));

                var grupoFound = await _gruposRepository.BuscarPorIdAsync(requisicao.Id, cancellationToken);

                if (grupoFound is null)
                    return Result<AtualizarGrupoResponse>.Failure(new NotFoundError(Compartilhado.Grupos.GrupoIdNaoEncontrado));

                grupoFound.Nome = requisicao.Nome;
                await _gruposRepository.AtualizarAsync(grupoFound, cancellationToken);
                var result = _mapper.Map<AtualizarGrupoResponse>(grupoFound);

                return Result<AtualizarGrupoResponse>.Success(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);

                return Result<AtualizarGrupoResponse>.Failure(new UnknownError(ex.Message));
            }
        }

        public async Task<Result<DeletarGrupoResponse>> DeletarAsync(int id, CancellationToken cancellationToken)
        {
            try
            {
                var grupoFound = await _gruposRepository.BuscarPorIdAsync(id, cancellationToken);

                if (grupoFound is null)
                    return Result<DeletarGrupoResponse>.Failure(new NoRecordsError(Compartilhado.Grupos.GrupoIdNaoEncontrado));

                if (grupoFound.Permissoes.Count() > 0)
                    return Result<DeletarGrupoResponse>.Failure(new GrupoTemPermissoesAssociadasError(Compartilhado.Grupos.GrupoTemPermissoesAssociadas));

                grupoFound.Delete();
                await _gruposRepository.DeletarAsync(grupoFound, cancellationToken);

                var result = new DeletarGrupoResponse { Mensagem = Compartilhado.Grupos.GrupoDeletado };

                return Result<DeletarGrupoResponse>.Success(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);

                return Result<DeletarGrupoResponse>.Failure(new UnknownError(ex.Message));
            }
        }
    }
}