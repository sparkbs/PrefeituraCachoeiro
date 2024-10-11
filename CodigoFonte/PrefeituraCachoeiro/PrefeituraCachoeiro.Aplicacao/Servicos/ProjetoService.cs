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
    public class ProjetoService : IProjetoService
    {
        private readonly IMapper _mapper;
        private readonly ILogger _logger;
        private readonly IProjetoRepository _projetoRepository;

        public ProjetoService(IMapper mapper,ILoggerFactory loggerFactory, IProjetoRepository projetoRepository)
        {
            _mapper = mapper;
            _logger = loggerFactory.CreateLogger<ProjetoService>();
            _projetoRepository = projetoRepository;
        }

        public async Task<Result<ProjetoResponse>> BuscarPorIdAsync(int id, CancellationToken cancellationToken)
        {
            var projetoFound = await _projetoRepository.BuscarPorIdAsync(id, cancellationToken);

            if (projetoFound is null)
                return Result<ProjetoResponse>.Failure(new NoRecordsError(Compartilhado.Projetos.ProjetoIdNaoEncontrado));

            var result = _mapper.Map<ProjetoResponse>(projetoFound);
            return Result<ProjetoResponse>.Success(result);
        }

        public async Task<Result<ProjetoDataResponse>> BuscarTodosAsync(ProjetosFilter filter, CancellationToken cancellationToken)
        {
            var projetosFound = await _projetoRepository.BuscarTodosAsync(filter, cancellationToken);

            if (projetosFound.TotalRegistros is 0)
                return Result<ProjetoDataResponse>.Failure(new NoRecordsError(Compartilhado.Projetos.ProjetosNaoEncontrado));

            var mapped = _mapper.Map<List<ProjetoResponse>>(projetosFound.Items);
            var result = new ProjetoDataResponse
            {
                Data = mapped,
                TotalRegisters = projetosFound.TotalRegistros,
            };

            return Result<ProjetoDataResponse>.Success(result);
        }

        public async Task<Result<CriarProjetoResponse>> InserirAsync(CriarProjetoRequest requisicao, CancellationToken cancellationToken)
        {
            try
            {
                var validation = await new CriarProjetoValidacao().ValidateAsync(requisicao, cancellationToken);

                if (!validation.IsValid)
                    return Result<CriarProjetoResponse>.Failure(new ValidationError(validation.Errors));

                var projeto = new ProjetoEntidade(requisicao.Nome);
                projeto =  await _projetoRepository.InserirAsync(projeto, cancellationToken);
                var result = _mapper.Map<CriarProjetoResponse>(projeto);

                return Result<CriarProjetoResponse>.Success(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);

                return Result<CriarProjetoResponse>.Failure(new UnknownError(ex.Message));
            }
        }

        public async Task<Result<AtualizarProjetoResponse>> AtualizarAsync(AtualizarProjetoRequest requisicao, CancellationToken cancellationToken)
        {
            try
            {
                var validation = await new AtualizarProjetoValidacao().ValidateAsync(requisicao, cancellationToken);

                if (!validation.IsValid)
                    return Result<AtualizarProjetoResponse>.Failure(new ValidationError(validation.Errors));

                var projetoFound = await _projetoRepository.BuscarPorIdAsync(requisicao.Id, cancellationToken);

                if (projetoFound is null)
                    return Result<AtualizarProjetoResponse>.Failure(new NotFoundError(Compartilhado.Projetos.ProjetoIdNaoEncontrado));

                projetoFound.NomeProjeto = requisicao.Nome;
                await _projetoRepository.AtualizarAsync(projetoFound, cancellationToken);
                var result = _mapper.Map<AtualizarProjetoResponse>(projetoFound);

                return Result<AtualizarProjetoResponse>.Success(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);

                return Result<AtualizarProjetoResponse>.Failure(new UnknownError(ex.Message));
            }
        }

        public async Task<Result<DeletarProjetoResponse>> DeletarAsync(int id, CancellationToken cancellationToken)
        {
            try
            {
                var projetoFound = await _projetoRepository.BuscarPorIdAsync(id, cancellationToken);

                if (projetoFound is null)
                    return Result<DeletarProjetoResponse>.Failure(new NoRecordsError(Compartilhado.Projetos.ProjetoIdNaoEncontrado));

                if (projetoFound.Contratos.Count() > 0)
                    return Result<DeletarProjetoResponse>.Failure(new ProjetoTemContratoAssociadoError(Compartilhado.Projetos.ProjetoTemContratoAssociado));

                projetoFound.Delete();
                await _projetoRepository.DeletarAsync(projetoFound, cancellationToken);

                var result = new DeletarProjetoResponse { Mensagem = Compartilhado.Projetos.ProjetoDeletado };

                return Result<DeletarProjetoResponse>.Success(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);

                return Result<DeletarProjetoResponse>.Failure(new UnknownError(ex.Message));
            }
        }
    }
}