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
        private readonly IQuantidadeRepository _quantidadeRepository;
        private readonly IPrefeituraRepository _prefeituraRepository;
        private readonly IEmpresaRepository _empresaRepository;
        private readonly IOrigemRepository _origemRepository;

        public ProjetoService(IMapper mapper, ILoggerFactory loggerFactory, IProjetoRepository projetoRepository, IQuantidadeRepository quantidadeRepository
            , IPrefeituraRepository prefeituraRepository, IEmpresaRepository empresaRepository, IOrigemRepository origemRepository)
        {
            _mapper = mapper;
            _logger = loggerFactory.CreateLogger<ProjetoService>();
            _projetoRepository = projetoRepository;
            _quantidadeRepository = quantidadeRepository;
            _prefeituraRepository = prefeituraRepository;
            _empresaRepository = empresaRepository;
            _origemRepository = origemRepository;
        }

        public async Task<Result<ProjetoResponse>> BuscarPorIdAsync(int id, CancellationToken cancellationToken)
        {
            var projetoFound = await _projetoRepository.BuscarPorIdAsync(id, cancellationToken);

            if (projetoFound is null)
                return Result<ProjetoResponse>.Failure(new NoRecordsError(Compartilhado.Projetos.ProjetoIdNaoEncontrado));

            var _result = this._mapper.Map<ProjetoResponse>(projetoFound);

            return Result<ProjetoResponse>.Success(_result);
        }

        public async Task<Result<ProjetoDataResponse>> BuscarTodosAsync(ProjetosFilter filter, CancellationToken cancellationToken)
        {
            var projetosFound = await _projetoRepository.BuscarTodosAsync(filter, cancellationToken);

            if (projetosFound.TotalRegistros is 0)
                return Result<ProjetoDataResponse>.Failure(new NoRecordsError(Compartilhado.Projetos.ProjetosNaoEncontrado));

            var _resultList = this._mapper.Map<List<ProjetoResponse>>(projetosFound.Items);

            var result = new ProjetoDataResponse
            {
                Data = _resultList,
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

                //Verifica se o código do projeto informado já existe
                var _codigoProjetoExistente = await this._projetoRepository.BuscarPorCodigoProjetoAsync(requisicao.CodigoProjeto, cancellationToken);

                if (_codigoProjetoExistente != null)
                    return Result<CriarProjetoResponse>.Failure(new CodigoProjetoExistenteError(Compartilhado.Projetos.CodigoProjetoExistente));

                var projeto = new ProjetoEntidade(requisicao.Nome)
                {
                    CodigoProjeto = requisicao.CodigoProjeto
                };

                projeto = await _projetoRepository.InserirAsync(projeto, cancellationToken);

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

                //Verifica se o código do projeto informado já existe
                var _codigoProjetoExistente = await this._projetoRepository.BuscarPorCodigoProjetoAsync(requisicao.CodigoProjeto,requisicao.Id, cancellationToken);

                if (_codigoProjetoExistente != null)
                    return Result<AtualizarProjetoResponse>.Failure(new CodigoProjetoExistenteError(Compartilhado.Projetos.CodigoProjetoExistente));

                var projetoFound = await _projetoRepository.BuscarPorIdAsync(requisicao.Id, cancellationToken);

                if (projetoFound is null)
                    return Result<AtualizarProjetoResponse>.Failure(new NotFoundError(Compartilhado.Projetos.ProjetoIdNaoEncontrado));

                projetoFound.NomeProjeto = requisicao.Nome;
                projetoFound.CodigoProjeto = requisicao.CodigoProjeto;

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