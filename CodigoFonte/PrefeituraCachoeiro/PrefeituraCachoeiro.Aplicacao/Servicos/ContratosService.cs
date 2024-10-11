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
    public class ContratosService: IContratosService
    {
        private const string QUANTIDADE_M  = @"M";
        private const string QUANTIDADE_M2 = @"M2";
        private const string QUANTIDADE_KM = @"KM";

        private readonly IMapper _mapper;
        private readonly ILogger _logger;
        private readonly IContratosRepository _contratosRepository;
        private readonly IItemRepository _itemRepository;
        private readonly IUnitOfWork _unitOfWork;

        public ContratosService(IMapper mapper, ILoggerFactory loggerFactory, 
            IContratosRepository contratosRepository, IItemRepository itemRepository, 
            IUnitOfWork unitOfWork)
        {
            _mapper = mapper;
            _logger = loggerFactory.CreateLogger<GruposService>();
            _contratosRepository = contratosRepository;
            _itemRepository = itemRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result<ContratosDataResponse>> BuscarTodosAsync(ContratosFilter filter, CancellationToken cancellationToken)
        {
            var gruposFound = await _contratosRepository.BuscarTodosAsync(filter, cancellationToken);

            if (gruposFound.TotalRegistros is 0)
                return Result<ContratosDataResponse>.Failure(new NoRecordsError(Compartilhado.Contratos.ContratosNaoEncontrados));

            var mapped = _mapper.Map<List<ContratosResponse>>(gruposFound.Items);
            var result = new ContratosDataResponse
            {
                Data = mapped,
                TotalRegisters = gruposFound.TotalRegistros,
            };

            return Result<ContratosDataResponse>.Success(result);
        }

        public async Task<Result<ContratosResponse>> BuscarPorIdAsync(int idContrato, CancellationToken cancellationToken)
        {
            var projetoFound = await _contratosRepository.BuscarPorIdAsync(idContrato, cancellationToken);

            if (projetoFound is null)
                return Result<ContratosResponse>.Failure(new NoRecordsError(Compartilhado.Grupos.GrupoIdNaoEncontrado));

            var result = _mapper.Map<ContratosResponse>(projetoFound);
            return Result<ContratosResponse>.Success(result);
        }

        public async Task<Result<CriarContratoResponse>> InserirAsync(CriarContratoRequest requisicao, CancellationToken cancellationToken)
        {
            try
            {
                var validation = await new CriarContratoValidacao().ValidateAsync(requisicao, cancellationToken);

                if (!validation.IsValid)
                    return Result<CriarContratoResponse>.Failure(new ValidationError(validation.Errors));

                var _contratoProjeto = await this._contratosRepository.BuscarPorIdProjetoAsync(
                    requisicao.IdProjeto, cancellationToken);

                if (_contratoProjeto != null)
                    return Result<CriarContratoResponse>.Failure(new ProjetoJaTemContratoExistenteError(Compartilhado.Contratos.ProjetoJaTemContratoCriado));

                var _items = await this._itemRepository.BuscarTodosAsync(cancellationToken);

                _items = _items.Where(i => i.IdItemPai.HasValue).ToList();

                decimal _totalPrevisto = 0;
                decimal _totalSolicitado = _totalPrevisto;
                decimal _totalRestante = _totalSolicitado;
                decimal _totalMedido = 0;

                if (_items != null && _items.Count > 0)
                {
                    decimal? _valorTotalPrevisto = _items.Sum(i => i.ValorTotalComBdi);

                    if (_valorTotalPrevisto.HasValue)
                        _totalPrevisto = _valorTotalPrevisto.Value;

                    _totalSolicitado = _totalPrevisto;
                    _totalRestante = _totalSolicitado;

                    var _itemSomar = _items.Where(i => (i.Quantidade.Nome == QUANTIDADE_KM ||
                                                        i.Quantidade.Nome == QUANTIDADE_M ||
                                                        i.Quantidade.Nome == QUANTIDADE_M2));

                    if (_itemSomar != null)
                    {
                        _itemSomar = _itemSomar.ToList();

                        var _valorTotalMedido = _itemSomar.Sum(i => i.Unidade);

                        if (_valorTotalMedido.HasValue)
                            _totalMedido = _valorTotalMedido.Value;
                    }
                }

                await _unitOfWork.BeginTransaction();

                try
                {
                    var _contrato = new ContratosEntidade(requisicao.IdProjeto, requisicao.DataContrato.ToUniversalTime(),
                        "Contrato1", _totalPrevisto, _totalSolicitado, _totalMedido, _totalRestante);

                    _contrato.Items = new List<ItemsContratoEntidade>();

                    if (_items != null && _items.Count > 0)
                    {
                        var _itemProcessarContrato = _items.Where(i => i.IdItemPai.HasValue).AsEnumerable();

                        foreach (var _item in _itemProcessarContrato)
                        {
                            var _itemContrato = new ItemsContratoEntidade( 
                                _contrato.IdContrato, _item.IdItem, _item.QuantidadeIdQuantidade.Value,
                                _item.Unidade.Value, _item.ValorSemBdi.Value, _item.ValorComBdi.Value,
                                _item.ValorTotalComBdi.Value);

                            _contrato.Items.Add(_itemContrato);
                        }
                    }

                    _contrato = await _contratosRepository.InserirAsync(_contrato, cancellationToken);

                    await _unitOfWork.Commit();

                    var result = _mapper.Map<CriarContratoResponse>(_contrato);

                    return Result<CriarContratoResponse>.Success(result);
                }
                catch (Exception Ex)
                {
                    await _unitOfWork.Rollback();
                    throw Ex;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);

                return Result<CriarContratoResponse>.Failure(new UnknownError(ex.Message));
            }
        }

        public async Task<Result<AtualizarContratosResponse>> AtualizarAsync(AtualizarContratosRequest requisicao, CancellationToken cancellationToken)
        {
            try
            {
                var validation = await new AtualizarContratoValidacao().ValidateAsync(requisicao, cancellationToken);

                if (!validation.IsValid)
                    return Result<AtualizarContratosResponse>.Failure(new ValidationError(validation.Errors));

                var contratoFound = await _contratosRepository.BuscarPorIdAsync(requisicao.IdContrato, cancellationToken);

                if (contratoFound is null)
                    return Result<AtualizarContratosResponse>.Failure(new NotFoundError(Compartilhado.Contratos.IdContratoNaoEncontrado));

                contratoFound.DataContrato = requisicao.DataContrato.ToUniversalTime();
                contratoFound.NumeroContrato = requisicao.NumeroContrato;
                contratoFound.ValorSaldoRestante = requisicao.ValorSaldoRestante;

                await _contratosRepository.AtualizarAsync(contratoFound, cancellationToken);
                var result = _mapper.Map<AtualizarContratosResponse>(contratoFound);

                return Result<AtualizarContratosResponse>.Success(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);

                return Result<AtualizarContratosResponse>.Failure(new UnknownError(ex.Message));
            }
        }
    }
}