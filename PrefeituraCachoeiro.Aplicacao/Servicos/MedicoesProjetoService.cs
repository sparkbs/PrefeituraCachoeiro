using AutoMapper;
using FluentValidation;
using Microsoft.Extensions.Logging;
using PrefeituraCachoeiro.Aplicacao.Dtos.Requisicoes;
using PrefeituraCachoeiro.Aplicacao.Dtos.Requisicoes.Validacoes;
using PrefeituraCachoeiro.Aplicacao.Dtos.Respostas;
using PrefeituraCachoeiro.Aplicacao.Interfaces;
using PrefeituraCachoeiro.Dados.Filtros;
using PrefeituraCachoeiro.Dados.Interfaces;
using PrefeituraCachoeiro.Dominio.Dto;
using PrefeituraCachoeiro.Dominio.Entidades;
using PrefeituraCachoeiro.Dominio.Enumeradores;
using PrefeituraCachoeiro.Dominio.Errors;
using PrefeituraCachoeiro.TratadorControlador.ObjetosValor;

namespace PrefeituraCachoeiro.Aplicacao.Servicos
{
    public class MedicoesProjetoService : IMedicoesProjetoService
    {
        private const string QUANTIDADE_M = @"M";
        private const string QUANTIDADE_M2 = @"M2";
        private const string QUANTIDADE_KM = @"KM";

        private readonly IMapper _mapper;
        private readonly ILogger _logger;
        private readonly IMedicoesProjetoRepository _medicoesProjetoRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogStatusMedicaoRepository _logStatusMedicaoRepository;
        private readonly IContratosRepository _contratosRepository;
        private readonly IApplicationUser _applicationUser;
        private readonly IItemsMedicoesProjetoRepository _itemsMedicoesProjetoRepository;

        public MedicoesProjetoService(IMapper mapper, ILoggerFactory loggerFactory,
            IMedicoesProjetoRepository medicoesProjetoRepository,
            IUnitOfWork unitOfWork, ILogStatusMedicaoRepository logStatusMedicaoRepository,
            IContratosRepository contratosRepository, IApplicationUser applicationUser,
            IItemsMedicoesProjetoRepository itemsMedicoesProjetoRepository)
        {
            _mapper = mapper;
            _logger = loggerFactory.CreateLogger<MedicoesProjetoService>();
            _medicoesProjetoRepository = medicoesProjetoRepository;
            _unitOfWork = unitOfWork;
            _logStatusMedicaoRepository = logStatusMedicaoRepository;
            _contratosRepository = contratosRepository;
            _applicationUser = applicationUser;
            _itemsMedicoesProjetoRepository = itemsMedicoesProjetoRepository;
        }

        public async Task<Result<MedicoesProjetoDataResponse>> BuscarTodosAsync(MedicoesProjetoFilter filter, CancellationToken cancellationToken)
        {
            var medicoesProjetoFound = await _medicoesProjetoRepository.BuscarTodosAsync(filter, cancellationToken);

            if (medicoesProjetoFound.TotalRegistros is 0)
                return Result<MedicoesProjetoDataResponse>.Failure(new NoRecordsError(Compartilhado.MedicoesProjeto.MedicoesProjetoNaoEncontrados));

            var mapped = _mapper.Map<List<MedicoesProjetoResponse>>(medicoesProjetoFound.Items);
            var result = new MedicoesProjetoDataResponse
            {
                Data = mapped,
                TotalRegisters = medicoesProjetoFound.TotalRegistros,
            };

            return Result<MedicoesProjetoDataResponse>.Success(result);
        }

        public async Task<Result<MedicoesProjetoResponse>> BuscarPorIdAsync(int idMedicoesProjeto, CancellationToken cancellationToken)
        {
            var medicoesProjetoFound = await _medicoesProjetoRepository.BuscarPorIdAsync(idMedicoesProjeto, cancellationToken);

            if (medicoesProjetoFound is null)
                return Result<MedicoesProjetoResponse>.Failure(new NoRecordsError(Compartilhado.MedicoesProjeto.MedicoesProjetoIdNaoEncontrado));

            var result = _mapper.Map<MedicoesProjetoResponse>(medicoesProjetoFound);
            return Result<MedicoesProjetoResponse>.Success(result);
        }

        public async Task<Result<ResultadoRegistrarAprovacaoMedicaoResponse>> RegistrarAprovacao(RegistrarAprovacaoMedicaoRequest requisicao, CancellationToken cancellationToken)
        {
            try
            {
                //Busca a medição original
                var _medicaoProjeto = await this._medicoesProjetoRepository.BuscarPorIdAsync(requisicao.IdMedicoesProjeto, cancellationToken);

                if (_medicaoProjeto == null)
                    return Result<ResultadoRegistrarAprovacaoMedicaoResponse>.Failure(new NoRecordsError(Compartilhado.MedicoesProjeto.MedicoesProjetoIdNaoEncontrado));

                //Verifica se a medição está no status de criada
                if (_medicaoProjeto.IdStatusMedicao != (int)StatusMedicao.SMCriada)
                    return Result<ResultadoRegistrarAprovacaoMedicaoResponse>.Failure(new MedicaoNaoPodeSerAprovadaError(Compartilhado.MedicoesProjeto.MedicaoNaoPodeSerAprovada));

                //Obtém o contrato associado a medição
                var _contrato = await this._contratosRepository.BuscarPorIdAsync(_medicaoProjeto.IdContrato, cancellationToken);

                if (_contrato == null)
                    return Result<ResultadoRegistrarAprovacaoMedicaoResponse>.Failure(new NoRecordsError(Compartilhado.Contratos.IdContratoNaoEncontrado));

                //Atualizar o status da medição para aprovado
                _medicaoProjeto.IdStatusMedicao = (int)StatusMedicao.SMAprovada;
                _medicaoProjeto.Resumo = requisicao.Resumo;

                //Abre uma transação com o banco de dados
                await _unitOfWork.BeginTransaction();

                try
                {
                    //Atualizar a medição no banco de dados
                    _medicaoProjeto = await _medicoesProjetoRepository.AtualizarAsync(_medicaoProjeto, cancellationToken);

                    //Insere o registro de log para mudança de status da medição
                    await this.InserirLogStatusMedicao(_medicaoProjeto.IdMedicoesProjeto, StatusMedicao.SMAprovada, cancellationToken);

                    /*Processa todos os items associados a medição para atualizar os valores medidos e
                     * gastos do contrato*/
                    var _totalItemsMedicao = ProcessarItemsMedicaoProjeto(_medicaoProjeto, cancellationToken);

                    //Atualiza as informações de consumo, medições e gastos do contrato
                    _contrato.ValorSaldoRestante -= _totalItemsMedicao.Data.ValorTotalApurado;
                    _contrato.ValorTotalMedido += _totalItemsMedicao.Data.ValorTotalMedido;

                    //Atualizar o contrato no banco de dados
                    await _contratosRepository.AtualizarAsync(_contrato, cancellationToken);

                    //Confirma as operações no banco de dados
                    await _unitOfWork.Commit();

                    var result = new ResultadoRegistrarAprovacaoMedicaoResponse(true, string.Empty);

                    return Result<ResultadoRegistrarAprovacaoMedicaoResponse>.Success(result);
                }
                catch (Exception Ex)
                {
                    //Desfaz a transação com o banco de dados
                    await _unitOfWork.Rollback();
                    throw Ex;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);

                return Result<ResultadoRegistrarAprovacaoMedicaoResponse>.Failure(new UnknownError(ex.Message));
            }
        }

        private Result<TotalProcessamentoDosItemsMedicoesProjetoResponse> ProcessarItemsMedicaoProjeto(
           MedicoesProjetoEntidade medicaoProjeto, CancellationToken cancellationToken)
        {
            var _resultado = new TotalProcessamentoDosItemsMedicoesProjetoResponse();

            foreach (var _item in medicaoProjeto.Items)
            {
                //Localiza no contrato o iditemcontrato informado
                var _itemIdContrato = medicaoProjeto.Contratos.Items.Where(i => i.IdItemContrato == _item.IdItemContrato).SingleOrDefault();

                if (_itemIdContrato == null)
                    return Result<TotalProcessamentoDosItemsMedicoesProjetoResponse>.Failure(new NoRecordsError(Compartilhado.Contratos.IdItemContratoNaoEncontrado));

                //Já faz a apuração do total que foi apontado na medição
                _resultado.ValorTotalApurado += _itemIdContrato.ValorTotalComBdi;

                /*Verifica se a unidade associada ao item é uma unidade que está associada a
                  medição de tamanho*/
                if (IsQuantidadeAssociadaMetros(_itemIdContrato.Quantidade))
                    _resultado.ValorTotalMedido += _item.Unidade;
            }

            return (Result<TotalProcessamentoDosItemsMedicoesProjetoResponse>.Success(_resultado));
        }

        public async Task<Result<ResultadoRegistrarReprovacaoMedicaoResponse>> RegistrarReprovacao(
            RegistrarReprovacaoMedicaoRequest requisicao, CancellationToken cancellationToken)
        {
            try
            {
                //Busca a medição original
                var _medicaoProjeto = await this._medicoesProjetoRepository.BuscarPorIdAsync(requisicao.IdMedicoesProjeto, cancellationToken);

                if (_medicaoProjeto == null)
                    return Result<ResultadoRegistrarReprovacaoMedicaoResponse>.Failure(new NoRecordsError(Compartilhado.MedicoesProjeto.MedicoesProjetoIdNaoEncontrado));

                //Verifica se a medição está no status de criada
                if (_medicaoProjeto.IdStatusMedicao != (int)StatusMedicao.SMCriada)
                    return Result<ResultadoRegistrarReprovacaoMedicaoResponse>.Failure(new MedicaoNaoPodeSerReprovadaError(Compartilhado.MedicoesProjeto.MedicaoNaoPodeSerReprovada));

                //Atualizar o status da medição para reprovado
                _medicaoProjeto.IdStatusMedicao = (int)StatusMedicao.SMReprovada;
                _medicaoProjeto.Resumo = requisicao.Resumo;

                //Abre uma transação com o banco de dados
                await _unitOfWork.BeginTransaction();

                try
                {
                    //Atualizar a medição no banco de dados
                    _medicaoProjeto = await _medicoesProjetoRepository.AtualizarAsync(_medicaoProjeto, cancellationToken);

                    //Insere o registro de log para mudança de status da medição
                    await this.InserirLogStatusMedicao(_medicaoProjeto.IdMedicoesProjeto, StatusMedicao.SMReprovada, cancellationToken);

                    //Confirma as operações no banco de dados
                    await _unitOfWork.Commit();

                    var result = new ResultadoRegistrarReprovacaoMedicaoResponse(true, string.Empty);

                    return Result<ResultadoRegistrarReprovacaoMedicaoResponse>.Success(result);
                }
                catch (Exception Ex)
                {
                    //Desfaz a transação com o banco de dados
                    await _unitOfWork.Rollback();
                    throw Ex;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);

                return Result<ResultadoRegistrarReprovacaoMedicaoResponse>.Failure(new UnknownError(ex.Message));
            }
        }

        public async Task<Result<CriarMedicoesProjetoResponse>> InserirAsync(CriarMedicoesProjetoRequest requisicao, CancellationToken cancellationToken)
        {
            try
            {
                var validation = await new CriarMedicoesProjetoValidacao().ValidateAsync(requisicao, cancellationToken);

                if (requisicao.Items.Count == 0)
                    return Result<CriarMedicoesProjetoResponse>.Failure(new ApontamentoMedicaoRequerPeloMenosUmItemError(Compartilhado.MedicoesProjeto.ApontamentoMedicaoProjetoRequerPeloMenosUmItem));

                //Busca o contrato original
                var _contrato = await this._contratosRepository.BuscarPorIdAsync(requisicao.IdContrato, cancellationToken);

                if (_contrato == null)
                    return Result<CriarMedicoesProjetoResponse>.Failure(new NoRecordsError(Compartilhado.Contratos.IdContratoNaoEncontrado));

                //Busca a lista de medições atuais que estão no status de criada
                var _medicoesFilterCriada = new MedicoesProjetoFilter(requisicao.IdContrato, Dominio.Enumeradores.StatusMedicao.SMCriada);
                var _listaMedicoesCriada = await this._medicoesProjetoRepository.BuscarTodosAsync(_medicoesFilterCriada, cancellationToken);

                //Busca a lista de medições atuais que estão no status de aprovada
                var _medicoesFilterAprovada = new MedicoesProjetoFilter(requisicao.IdContrato, Dominio.Enumeradores.StatusMedicao.SMAprovada);
                var _listaMedicoesAprovada = await this._medicoesProjetoRepository.BuscarTodosAsync(_medicoesFilterAprovada, cancellationToken);

                //Realiza o processamento dos items da requisição
                var _itemProcessamentoItems = ProcessarItemsRequisicao(requisicao, _contrato, _listaMedicoesAprovada,
                    _listaMedicoesCriada, cancellationToken);

                if (_itemProcessamentoItems.Error != null)
                    return (Result<CriarMedicoesProjetoResponse>.Failure(_itemProcessamentoItems.Error));

                //Cria o objeto de medição a ser gravado no banco de dados
                var _medicaoProjeto = this.CriarMedicoesProjeto(requisicao, cancellationToken);

                //Abre uma transação com o banco de dados
                await _unitOfWork.BeginTransaction();

                try
                {
                    //Insere a medição no banco de dados
                    _medicaoProjeto = await _medicoesProjetoRepository.InserirAsync(_medicaoProjeto, cancellationToken);

                    //Insere o registro de log para mudança de status da medição
                    await this.InserirLogStatusMedicao(_medicaoProjeto.IdMedicoesProjeto, StatusMedicao.SMCriada, cancellationToken);

                    //Confirma as operações no banco de dados
                    await _unitOfWork.Commit();

                    var result = _mapper.Map<CriarMedicoesProjetoResponse>(_medicaoProjeto);

                    return Result<CriarMedicoesProjetoResponse>.Success(result);
                }
                catch (Exception Ex)
                {
                    //Desfaz a transação com o banco de dados
                    await _unitOfWork.Rollback();
                    throw Ex;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);

                return Result<CriarMedicoesProjetoResponse>.Failure(new UnknownError(ex.Message));
            }
        }

        public async Task<Result<AtualizarMedicoesProjetoResponse>> AtualizarAsync(AtualizarMedicoesProjetoRequest requisicao, CancellationToken cancellationToken)
        {
            try
            {
                var validation = await new AtualizarMedicoesProjetoValidacao().ValidateAsync(requisicao, cancellationToken);

                if (requisicao.Items.Count == 0)
                    return Result<AtualizarMedicoesProjetoResponse>.Failure(new ApontamentoMedicaoRequerPeloMenosUmItemError(Compartilhado.MedicoesProjeto.ApontamentoMedicaoProjetoRequerPeloMenosUmItem));

                //Busca a medição
                var _medicao = await this._medicoesProjetoRepository.BuscarPorIdAsync(requisicao.IdMedicoesProjeto, cancellationToken);

                if (_medicao == null)
                    return Result<AtualizarMedicoesProjetoResponse>.Failure(new NoRecordsError(Compartilhado.MedicoesProjeto.MedicoesProjetoIdNaoEncontrado));

                //Verifica se a medição está no status de criada
                if (_medicao.IdStatusMedicao != (int)StatusMedicao.SMCriada)
                    return Result<AtualizarMedicoesProjetoResponse>.Failure(new MedicaoNaoPodeSerAlteradaError(Compartilhado.MedicoesProjeto.MedicaoNaoPodeSerAlterada));

                //Busca o contrato original
                var _contrato = await this._contratosRepository.BuscarPorIdAsync(requisicao.IdContrato, cancellationToken);

                if (_contrato == null)
                    return Result<AtualizarMedicoesProjetoResponse>.Failure(new NoRecordsError(Compartilhado.Contratos.IdContratoNaoEncontrado));

                //Busca a lista de medições atuais que estão no status de criada
                var _medicoesFilterCriada = new MedicoesProjetoFilter(requisicao.IdContrato, StatusMedicao.SMCriada, requisicao.IdMedicoesProjeto);
                var _listaMedicoesCriada = await this._medicoesProjetoRepository.BuscarTodosAsync(_medicoesFilterCriada, cancellationToken);

                //Busca a lisat de medições atuais que estão no status de aprovada
                var _medicoesFilterAprovada = new MedicoesProjetoFilter(requisicao.IdContrato, StatusMedicao.SMAprovada);
                var _listaMedicoesAprovada = await this._medicoesProjetoRepository.BuscarTodosAsync(_medicoesFilterAprovada, cancellationToken);

                //Realiza o processamento dos items da requisição
                var _itemProcessamentoItems = ProcessarItemsRequisicao(requisicao, _contrato, _listaMedicoesAprovada,
                    _listaMedicoesCriada, cancellationToken);

                if (_itemProcessamentoItems.Error != null)
                    return (Result<AtualizarMedicoesProjetoResponse>.Failure(_itemProcessamentoItems.Error));

                //Abre uma transação com o banco de dados
                await _unitOfWork.BeginTransaction();

                //Apagar primeiro todos os items da medição que foram registrados anteriormente
                await this._itemsMedicoesProjetoRepository.DeletarAsync(requisicao.IdMedicoesProjeto, cancellationToken);

                //Cria o objeto de medição a ser gravado no banco de dados
                var _medicaoProjeto = this.AtualizarMedicoesProjeto(requisicao, _medicao, cancellationToken);

                try
                {
                    //Atualiza a medição no banco de dados
                    _medicaoProjeto = await _medicoesProjetoRepository.AtualizarAsync(_medicaoProjeto, cancellationToken);

                    await _unitOfWork.Commit();

                    var result = _mapper.Map<AtualizarMedicoesProjetoResponse>(_medicaoProjeto);

                    return Result<AtualizarMedicoesProjetoResponse>.Success(result);
                }
                catch (Exception Ex)
                {
                    //Desfaz a transação com o banco de dados
                    await _unitOfWork.Rollback();
                    throw Ex;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);

                return Result<AtualizarMedicoesProjetoResponse>.Failure(new UnknownError(ex.Message));
            }
        }

        private Result<TotalProcessamentoDosItemsMedicoesProjetoResponse> ProcessarItemsRequisicao(
            BaseMedicoesProjetoRequest requisicao, ContratosEntidade contrato, PaginatedEntity<MedicoesProjetoEntidade> listaMedicoesAprovada,
            PaginatedEntity<MedicoesProjetoEntidade> listaMedicoesCriada, CancellationToken cancellationToken)
        {
            var _resultado = new TotalProcessamentoDosItemsMedicoesProjetoResponse();

            /*Processa todos os items que foram informados na medição e verifica se o valor informado para a unidade pode ser aceito.*/
            foreach (var _item in requisicao.Items)
            {
                decimal _totalUnidade = 0;

                //Localiza no contrato o iditemcontrato informado
                var _itemIdContrato = contrato.Items.Where(i => i.IdItemContrato == _item.IdItemContrato).SingleOrDefault();

                if (_itemIdContrato == null)
                    return Result<TotalProcessamentoDosItemsMedicoesProjetoResponse>.Failure(new NoRecordsError(Compartilhado.Contratos.IdItemContratoNaoEncontrado));

                /*Soma os totais associados a medições criadas e aprovadas*/
                _totalUnidade += SomarTotalUnidade(listaMedicoesAprovada, listaMedicoesCriada, _item.IdItemContrato);

                //Verifica se a quantidade informada extrapola o máximo aceito pelo contrato
                if (_totalUnidade > _item.Unidade)
                {
                    /*Retorna para o usuário um erro informando a quantidade máxima que ele pode informar para o item de contrato*/
                    _resultado.Erro = new ValorUnidadeInformadoExcedeLimitePermitidoError(
                        CriarMensagemErroRegistroItemMedicao(_itemIdContrato.Item.Descricao, _item.Unidade - _totalUnidade));
                    return (Result<TotalProcessamentoDosItemsMedicoesProjetoResponse>.Success(_resultado));
                }
                else
                {
                    //Já faz a apuração do total que foi contabilizado
                    _resultado.ValorTotalApurado += _itemIdContrato.ValorTotalComBdi;

                    /*Verifica se a unidade associada ao item é uma unidade que está associada a
                     * medição de tamanho*/
                    if (IsQuantidadeAssociadaMetros(_itemIdContrato.Quantidade))
                        _resultado.ValorTotalMedido += _item.Unidade;
                }
            }

            return (Result<TotalProcessamentoDosItemsMedicoesProjetoResponse>.Success(_resultado));
        }

        private bool IsQuantidadeAssociadaMetros(QuantidadeEntidade quantidade)
        {
            if (quantidade.Nome == QUANTIDADE_M || quantidade.Nome == QUANTIDADE_M2 || quantidade.Nome == QUANTIDADE_KM)
                return (true);

            return (false);
        }

        private LogStatusMedicaoEntidade CriarLogStatusMedicaoEntidade(int idMedicaoProjeto, StatusMedicao status)
        {
            var _userId = 1; //remover _applicationUser.UserId;

            //Registra uma entrada no log de status de medição
            var _logStatusMedicao = new LogStatusMedicaoEntidade()
            {
                IdMedicoesProjeto = idMedicaoProjeto,
                DataLog = DateTime.UtcNow,
                IdUsuario = _userId,
                IdStatusMedicao = (int)status
            };

            return (_logStatusMedicao);
        }

        private async Task InserirLogStatusMedicao(int idMedicaoProjeto, StatusMedicao status, CancellationToken cancellationToken)
        {
            var _logStatusMedicao = CriarLogStatusMedicaoEntidade(idMedicaoProjeto, status);

            //Registra uma entrada no log de status de medição
            await this._logStatusMedicaoRepository.InserirAsync(_logStatusMedicao, cancellationToken);
        }

        private MedicoesProjetoEntidade CriarMedicoesProjetoEntidade(CriarMedicoesProjetoRequest request, StatusMedicao status)
        {
            //Transforma a requisição em um registro de medição de projeto
            var _medicoesProjeto = new MedicoesProjetoEntidade()
            {
                DataMedicao = request.DataMedicao.ToUniversalTime(),
                IdContrato = request.IdContrato,
                IdStatusMedicao = (int)status,
                NumeroMedicao = request.NumeroMedicao,
                Resumo = request.Resumo,
                Items = new List<ItemsMedicoesProjetoEntidade>()
            };

            return (_medicoesProjeto);
        }

        private MedicoesProjetoEntidade AtualizarMedicoesProjetoEntidade(AtualizarMedicoesProjetoRequest request,
            MedicoesProjetoEntidade medicoesProjeto)
        {
            //Transforma a requisição em um registro de medição de projeto
            medicoesProjeto.DataMedicao = request.DataMedicao.ToUniversalTime();
            medicoesProjeto.IdContrato = request.IdContrato;
            medicoesProjeto.NumeroMedicao = request.NumeroMedicao;
            medicoesProjeto.Resumo = request.Resumo;
            medicoesProjeto.Items = new List<ItemsMedicoesProjetoEntidade>();

            return (medicoesProjeto);
        }

        private MedicoesProjetoEntidade CriarMedicoesProjeto(CriarMedicoesProjetoRequest request, CancellationToken cancellationToken)
        {
            //Transforma a requisição em um registro de medição de projeto
            var _medicoesProjeto = CriarMedicoesProjetoEntidade(request, StatusMedicao.SMCriada);

            //Transforma a lista de items da requisição em lista de items para a medição do projeto
            foreach (var _itemRequest in request.Items)
            {
                var _novoItemMedicao = new ItemsMedicoesProjetoEntidade(_itemRequest.IdItemContrato, _itemRequest.Unidade);

                _medicoesProjeto.Items.Add(_novoItemMedicao);
            }

            return (_medicoesProjeto);
        }

        private MedicoesProjetoEntidade AtualizarMedicoesProjeto(AtualizarMedicoesProjetoRequest request,
            MedicoesProjetoEntidade medicoesProjeto, CancellationToken cancellationToken)
        {
            //Atualiza as informações da requisição na entidade de medições de projeto
            var _medicoesProjeto = AtualizarMedicoesProjetoEntidade(request, medicoesProjeto);

            //Transforma a lista de items da requisição em lista de items para a medição do projeto
            foreach (var _itemRequest in request.Items)
            {
                var _novoItemMedicao = new ItemsMedicoesProjetoEntidade(_itemRequest.IdItemContrato, _itemRequest.Unidade);

                _medicoesProjeto.Items.Add(_novoItemMedicao);
            }

            return (_medicoesProjeto);
        }

        private string CriarMensagemErroRegistroItemMedicao(string descricao, decimal limite)
        {
            return ($"Você só pode informar para o item {descricao} o valor máximo de {limite}");
        }

        private decimal SomarTotalUnidade(PaginatedEntity<MedicoesProjetoEntidade> itemsAprovados,
            PaginatedEntity<MedicoesProjetoEntidade> itemsCriados, int idItemContrato)
        {
            decimal _totalUnidade = 0;

            /*Soma na lista de medições aprovadas a quantidade que já foi aprovada para 
             * este item de contrato*/
            _totalUnidade += SomarTotalUnidade(itemsAprovados, idItemContrato);

            /*Soma na lista de medições criadas a quantidade que já foi criada e que ainda
             * não foi aprovada*/
            _totalUnidade += SomarTotalUnidade(itemsCriados, idItemContrato);

            return (_totalUnidade);
        }

        private decimal SomarTotalUnidade(PaginatedEntity<MedicoesProjetoEntidade> items, int idItemContrato)
        {
            decimal _unidadeSomada = 0;

            foreach (var item in items.Items.ToList())
                _unidadeSomada += item.Items.Where(i => i.IdItemContrato == idItemContrato).Sum(i => i.Unidade);

            return (_unidadeSomada);
        }
    }
}