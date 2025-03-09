using AutoMapper;
using ExcelDataReader;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using PrefeituraCachoeiro.Aplicacao.Dtos.Requisicoes;
using PrefeituraCachoeiro.Aplicacao.Dtos.Requisicoes.Validacoes;
using PrefeituraCachoeiro.Aplicacao.Dtos.Respostas;
using PrefeituraCachoeiro.Aplicacao.Interfaces;
using PrefeituraCachoeiro.Compartilhado;
using PrefeituraCachoeiro.Dados.Filtros;
using PrefeituraCachoeiro.Dados.Interfaces;
using PrefeituraCachoeiro.Dominio.Entidades;
using PrefeituraCachoeiro.Dominio.Errors;
using PrefeituraCachoeiro.Dominio.Modelos;
using PrefeituraCachoeiro.TratadorControlador.ObjetosValor;
using System.Data;

namespace PrefeituraCachoeiro.Aplicacao.Servicos
{
    public class AditivosService : IAditivosService
    {
        private readonly IMapper _mapper;
        private readonly ILogger _logger;
        private readonly IContratosRepository _contratosRepository;
        private readonly IItemRepository _itemRepository;
        private readonly ISequenceService _sequenceService;
        private readonly IS3Service _s3Service;
        private readonly IOrigemRepository _origemRepository;
        private readonly IQuantidadeRepository _quantidadeRepository;
        private readonly ITemplateRepository _templateRepository;
        private readonly IItemsAditivoRepository _itemsAditivoRepository;
        private readonly IAditivosRepository _aditivosRepository;
        private readonly IItemsContratoRepository _itemsContratoRepository;
        private readonly IMedicoesProjetoRepository _medicoesProjetoRepository;
        private readonly IApplicationUser _applicationUser;
        private readonly IUsuariosRepository _usuariosRepository;

        public AditivosService(IMapper mapper, ILoggerFactory loggerFactory,
            IContratosRepository contratosRepository, IItemRepository itemRepository,
            ISequenceService sequenceService, IS3Service s3Service,
            IOrigemRepository origemRepository, IQuantidadeRepository quantidadeRepository,
            ITemplateRepository templateRepository, IItemsAditivoRepository itemsAditivoRepository, 
            IAditivosRepository aditivosRepository, IItemsContratoRepository itemsContratoRepository, 
            IMedicoesProjetoRepository medicoesProjetoRepository, IUsuariosRepository usuariosRepository,
            IApplicationUser applicationUser)
        {
            _mapper = mapper;
            _logger = loggerFactory.CreateLogger<ContratosService>();
            _contratosRepository = contratosRepository;
            _itemRepository = itemRepository;
            _sequenceService = sequenceService;
            _s3Service = s3Service;
            _origemRepository = origemRepository;
            _quantidadeRepository = quantidadeRepository;
            _templateRepository = templateRepository;
            _itemsAditivoRepository = itemsAditivoRepository;
            _aditivosRepository = aditivosRepository;
            _itemsContratoRepository = itemsContratoRepository;
            _medicoesProjetoRepository = medicoesProjetoRepository;
            _usuariosRepository = usuariosRepository;
            _applicationUser = applicationUser;
        }

        public async Task<Result<CriarAditivoResponse>> InserirAsync(CriarAditivoRequest requisicao, CancellationToken cancellationToken)
        {
            try
            {
                var validation = await new CriarAditivoValidacao().ValidateAsync(requisicao, cancellationToken);

                if (!validation.IsValid)
                    return Result<CriarAditivoResponse>.Failure(new ValidationError(validation.Errors));

                try
                {
                    //Busca o contrato original
                    var _contratoOriginal = await this._contratosRepository.BuscarPorIdAsync(requisicao.ContratoId, cancellationToken);

                    //Verifica se o contrato original não foi encontrado
                    if (_contratoOriginal == null)
                        return Result<CriarAditivoResponse>.Failure(new NumeroContratoNaoEncontradoError(Contratos.IdContratoNaoEncontrado));

                    //Verifica se a data de validade do aditivo é superior a data final do contrato
                    if (requisicao.DataValidadeAditivo <= _contratoOriginal.DataTermino.Value)
                        return Result<CriarAditivoResponse>.Failure(new DataValidadeAditivoNaoValidaError(Aditivos.DataValidadeAditivoInferiorADataTerminoContrato));

                    //Faz a leitura do arquivo excel associado ao projeto que está sendo criado
                    var _listaItems = await ProcessarArquivoTemplateProjeto(requisicao);

                    //Realizar a preparação de dados para poder realizar a importação do aditivo
                    await this.PrepararDadosImportacaoAditivo(_listaItems, cancellationToken);

                    //Busca todos os items do contrato original
                    var _itemsContratoOriginal = await this._itemsContratoRepository.BuscarTodosItemsContratosAsync(requisicao.ContratoId, cancellationToken);

                    decimal _totalComBdiPlanilha = 0;

                    //Faz a verificação para verificar se todos os items que foram extraídos da planilha existem no contrato original
                    foreach (var _itemPlanilha in _listaItems)
                    {
                        //Verifica se o item da planilha dever ser considerado para ser procurado
                        if (!string.IsNullOrEmpty(_itemPlanilha.Un) && !string.IsNullOrWhiteSpace(_itemPlanilha.Un) &&
                            !string.IsNullOrEmpty(_itemPlanilha.Qntd) && !string.IsNullOrWhiteSpace(_itemPlanilha.Qntd))
                        {
                            //Verifica se o item existe na lista de items do contrato
                            var _itemExistente = _itemsContratoOriginal.Where(i => i.Item.Identificador == _itemPlanilha.Item).FirstOrDefault();

                            if (_itemExistente == null)
                                return Result<CriarAditivoResponse>.Failure(
                                    new ItemPlanilhaImportadorNaoEncontadoContratoOriginalError(
                                        string.Format(Compartilhado.Contratos.ItemImportadorNaPlanilhaNaoExistemItemsContratoOriginal, _itemPlanilha.Item)));

                            //Soma o valor total com bdi do item
                            _totalComBdiPlanilha += Convert.ToDecimal(_itemPlanilha.ValorCBdi) * Convert.ToDecimal(_itemPlanilha.Un);
                        }
                    }

                    //Verifica se todos os items somados do aditivo superam 25% do valor total do contrato
                    decimal _valorMaximo = Convert.ToDecimal((_contratoOriginal.ValorTotalPrevisto * 25) / 100);

                    if (_totalComBdiPlanilha > _valorMaximo)
                    {
                        return Result<CriarAditivoResponse>.Failure(
                            new QuantidadeItemPlanilhaSuperiorMaximoPermitidoImportacaoAditivoError(
                                string.Format(Aditivos.AditivoExtrapolouLimite,_valorMaximo)));
                    }

                    //Insere o aditivo na tabela para históricos de aditivos
                    var _aditivo = new AditivosEntidade()
                    {
                        ContratoId = requisicao.ContratoId,
                        DataAssinatura = requisicao.DataAssinaturaAditivo.ToUniversalTime(),
                        DataValidade = requisicao.DataValidadeAditivo.ToUniversalTime(),
                        TipoAditivo = requisicao.TipoAditivo
                    };

                    _aditivo = await this._aditivosRepository.InserirAsync(_aditivo, cancellationToken);

                    //Atualiza no contrato somente as informações do último aditivo que foi importado
                    _contratoOriginal.Aditivo = requisicao.ContratoId;
                    _contratoOriginal.TipoAditivo = requisicao.TipoAditivo;
                    _contratoOriginal.DataAssinaturaAditivo = requisicao.DataAssinaturaAditivo.ToUniversalTime();
                    _contratoOriginal.DataValidadeAditivo = requisicao.DataValidadeAditivo.ToUniversalTime();
                    _contratoOriginal.DataTermino = requisicao.DataValidadeAditivo.ToUniversalTime();

                    //Atualiza o contrato no banco de dados
                    await this._contratosRepository.AtualizarAsync(_contratoOriginal, cancellationToken);

                    //Processa todos os items e atualiza os valores do contrato original
                    foreach (var _itemPlanilha in _listaItems)
                    {
                        //Busca item do contrato original
                        var _itemExistente = _itemsContratoOriginal.Where(i => i.Item.Identificador == _itemPlanilha.Item).FirstOrDefault();

                        if (_itemExistente != null)
                        {
                            //Atualiza a quantidade do contrato original com a quantidade que está sendo aditivada
                            _itemExistente.Unidade += Convert.ToDecimal(_itemPlanilha.Un);

                            //Armazena numa variável o valor original do valor total com bdi
                            var _valorTotalComBdiOriginal = _itemExistente.ValorTotalComBdi;

                            //Recalcula o valor total com bdi
                            _itemExistente.ValorTotalComBdi = _itemExistente.ValorComBdi * _itemExistente.Unidade;

                            //Atualiza o valor do item do contrato
                            await this._itemsContratoRepository.AtualizarAsync(_itemExistente, cancellationToken);

                            //Obtém a diferença sobre o valor total com bdi
                            var _diferencaValorTotalComBdi = _itemExistente.ValorTotalComBdi - _valorTotalComBdiOriginal;

                            //Atualiza o saldo do contrato com a diferença que foi aditivada
                            _contratoOriginal.ValorSaldoRestante += _diferencaValorTotalComBdi;
                            _contratoOriginal.ValorTotalSolicitado += _diferencaValorTotalComBdi;
                            _contratoOriginal.ValorTotalPrevisto += _diferencaValorTotalComBdi;
                            _contratoOriginal.Valor += _diferencaValorTotalComBdi;

                            //Atualiza o contrato
                            await this._contratosRepository.AtualizarAsync(_contratoOriginal, cancellationToken);
                        }
                    }

                    //Cria um template para o aditivo
                    var _novoTemplate = new TemplateEntidade()
                    {
                        Nome = $"Template do Aditivo Número {_aditivo.IdAditivo}"
                    };

                    //Inseri o novo template no banco de dados
                    _novoTemplate = await this._templateRepository.InserirAsync(_novoTemplate, cancellationToken);

                    //Processa agora a lista de items para serem inseridos no banco de dados associados ao novo template
                    var _contador = 0;
                    ModeloTemplate _item;

                    while (_contador <= _listaItems.Count() - 1)
                    {
                        _item = _listaItems[_contador];

                        //Verifica se a origem obtida existe no banco de dados
                        var _origemBancoDeDados = await this._origemRepository.BuscarPorNomeAsync(_item.Origem, cancellationToken);

                        QuantidadeEntidade _quantidadeBancoDeDados = null;

                        //Verifica se a quantidade foi informada
                        if (!string.IsNullOrWhiteSpace(_item.Qntd))
                        {
                            //Verifica se a quantidade obtida existe no banco de dados
                            _quantidadeBancoDeDados = await this._quantidadeRepository.BuscarPorNomeAsync(_item.Qntd, cancellationToken);
                        }

                        //Cria uma variável local para acessar o item temporário que está sendo lido no momento
                        var _localItemTemp = _listaItems[_contador];

                        //Criar o item a ser inserido na tabela de items
                        var _itemPai = await CriarItemEntidade(_localItemTemp, _origemBancoDeDados, 1, _novoTemplate.IdTemplate, new Nullable<int>(), cancellationToken);
                        var _ordemFilho = 0;

                        while (++_contador <= _listaItems.Count() - 1 && _listaItems[_contador].Item.StartsWith(_item.Item))
                        {
                            //Realiza a criação dos items filhos
                            var _novoItemFilho = await this.ProcessarItemFilho(_listaItems[_contador], ++_ordemFilho, _novoTemplate.IdTemplate, _itemPai.IdItem, cancellationToken);
                        }
                    }

                    //Preenche a tabela de items do aditivo
                    var _itemsAditivo = await this._itemRepository.BuscarTodosAsync(_novoTemplate.IdTemplate, cancellationToken);

                    //Processa todos os items e associa ao aditivo
                    foreach (var _itemAditivo in _itemsAditivo)
                    {
                        if (_itemAditivo.QuantidadeId.HasValue)
                        {
                            var _novoItemAditivo = new ItemsAditivoEntidade()
                            {
                                AditivoId = _aditivo.IdAditivo,
                                ItemId = _itemAditivo.IdItem,
                            };

                            if (_itemAditivo.QuantidadeId.HasValue)
                                _novoItemAditivo.QuantidadeId = _itemAditivo.QuantidadeId.Value;

                            if (_itemAditivo.Unidade.HasValue)
                                _novoItemAditivo.Unidade = _itemAditivo.Unidade.Value;

                            if (_itemAditivo.ValorComBdi.HasValue)
                                _novoItemAditivo.ValorComBdi = _itemAditivo.ValorComBdi.Value;

                            if (_itemAditivo.ValorSemBdi.HasValue)
                                _novoItemAditivo.ValorSemBdi = _itemAditivo.ValorSemBdi.Value;

                            if (_itemAditivo.ValorTotalComBdi.HasValue)
                                _novoItemAditivo.ValorTotalComBdi = _itemAditivo.ValorTotalComBdi.Value;
                            
                            await this._itemsAditivoRepository.InserirAsync(_novoItemAditivo, cancellationToken);
                        }
                    }

                    var result = _mapper.Map<CriarAditivoResponse>(_aditivo);

                    return Result<CriarAditivoResponse>.Success(result);
                }
                catch (Exception Ex)
                {
                    throw Ex;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);

                return Result<CriarAditivoResponse>.Failure(new UnknownError(ex.Message));
            }
        }

        private async Task<ItemEntidade> CriarItemEntidade(ModeloTemplate localItemTemp, OrigemEntidade origemBancoDeDados, int ordem,
            int idTemplate, int? idItemPai, CancellationToken cancellationToken)
        {
            //Criar o item a ser inserido na tabela de items
            var _novoItem = new ItemEntidade()
            {
                Identificador = localItemTemp.Item,
                Codigo = localItemTemp.Codigo,
                OrigemId = origemBancoDeDados.IdOrigem,
                Descricao = localItemTemp.Descricao,
                Ordem = ordem,
                IdTemplate = idTemplate,
            };

            //Verifica se a unidade está preenchida
            if (!string.IsNullOrWhiteSpace(localItemTemp.Un))
                _novoItem.Unidade = Convert.ToDecimal(localItemTemp.Un);

            //Verifica se a quantidade está preenchida
            if (!string.IsNullOrWhiteSpace(localItemTemp.Qntd))
            {
                //Verifica se a quantidade obtida existe no banco de dados
                var _quantidadeBancoDeDados = await this._quantidadeRepository.BuscarPorNomeAsync(localItemTemp.Qntd, cancellationToken);

                _novoItem.QuantidadeId = _quantidadeBancoDeDados.IdQuantidade;
            }

            //Verificar se o valor sem bdi está preenchido
            if (!string.IsNullOrWhiteSpace(localItemTemp.ValorSBdi))
                _novoItem.ValorSemBdi = Convert.ToDecimal(localItemTemp.ValorSBdi);

            //Verificar se o valor com bdi está preenchido
            if (!string.IsNullOrWhiteSpace(localItemTemp.ValorCBdi))
                _novoItem.ValorComBdi = Convert.ToDecimal(localItemTemp.ValorCBdi);

            //Verificar se o valor está preenchido
            if (!string.IsNullOrWhiteSpace(localItemTemp.Valor))
                _novoItem.ValorTotalComBdi = Convert.ToDecimal(localItemTemp.Valor);

            //Verificase pode ser atribuído o item pai
            if (_novoItem.Unidade.HasValue && _novoItem.QuantidadeId.HasValue && _novoItem.ValorSemBdi.HasValue && _novoItem.ValorComBdi.HasValue && _novoItem.ValorTotalComBdi.HasValue)
                _novoItem.IdItemPai = idItemPai;

            //Insere o item pai no banco de dados
            _novoItem = await this._itemRepository.InserirAsync(_novoItem, cancellationToken);

            return (_novoItem);
        }

        private async Task PrepararDadosImportacaoAditivo(List<ModeloTemplate> listaItems, CancellationToken cancellationToken)
        {
            //Cria um dicionário de origem localmente para usar como cache
            var _dicOrigem = new Dictionary<string, OrigemEntidade>();

            //Cria um dicionário de quantidade localmente para usar como cache]
            var _dicQuantidade = new Dictionary<string, QuantidadeEntidade>();

            //Verifica se algumas informações existentes no items que foram informadas são válidas
            foreach (var _itemLocal in listaItems)
            {
                if (!_dicOrigem.ContainsKey(_itemLocal.Origem))
                {
                    //Verifica se a origem obtida existe no banco de dados
                    var _origemBancoDeDados = await this._origemRepository.BuscarPorNomeAsync(_itemLocal.Origem, cancellationToken);

                    if (_origemBancoDeDados == null)
                    {
                        //Insere a origem
                        _origemBancoDeDados = new OrigemEntidade()
                        {
                            IdOrigem = await this._origemRepository.CriarNovoId(cancellationToken),
                            Nome = _itemLocal.Origem
                        };

                        await this._origemRepository.InserirAsync(_origemBancoDeDados, cancellationToken);
                    }

                    _dicOrigem.Add(_itemLocal.Origem, _origemBancoDeDados);
                }

                //Verificar se a quantidade foi informada
                if (!string.IsNullOrWhiteSpace(_itemLocal.Qntd))
                {
                    if (!_dicQuantidade.ContainsKey(_itemLocal.Qntd))
                    {
                        //Verifica se a quantidade obtida existe no banco de dados
                        var _quantidadeBancoDeDados = await this._quantidadeRepository.BuscarPorNomeAsync(_itemLocal.Qntd, cancellationToken);

                        if (_quantidadeBancoDeDados == null)
                        {
                            //Insere a quantidade
                            _quantidadeBancoDeDados = new QuantidadeEntidade()
                            {
                                IdQuantidade = await this._quantidadeRepository.CriarNovoId(cancellationToken),
                                Nome = _itemLocal.Qntd
                            };

                            await this._quantidadeRepository.InserirAsync(_quantidadeBancoDeDados, cancellationToken);
                        }

                        _dicQuantidade.Add(_itemLocal.Qntd, _quantidadeBancoDeDados);
                    }
                }

                //Remove os símbolos de dinheiros dos campos de valor monetário
                _itemLocal.Valor = _itemLocal.Valor.Replace("R$", "");
                _itemLocal.ValorCBdi = _itemLocal.ValorCBdi.Replace("R$", "");
                _itemLocal.ValorSBdi = _itemLocal.ValorSBdi.Replace("R$", "");
            }
        }

        private async Task<List<ModeloTemplate>> ProcessarArquivoTemplateProjeto(IFormFile arquivoTemplate)
        {
            try
            {
                using (var stream = new MemoryStream())
                {
                    await arquivoTemplate.CopyToAsync(stream);
                    stream.Position = 0; // Garantir que a posição no stream seja zero antes de carregar

                    // Usando ExcelDataReader para ler o arquivo .xlsb
                    using (var reader = ExcelReaderFactory.CreateReader(stream))
                    {
                        var dataset = reader.AsDataSet();
                        var worksheet = dataset.Tables.Cast<DataTable>()
                            .FirstOrDefault(dt => dt.TableName.Equals("BASE DE DADOS", StringComparison.OrdinalIgnoreCase));

                        // Processamento dos dados da planilha "BASE DE DADOS"
                        var modelosTemplate = new List<ModeloTemplate>();

                        for (var i = 1; i <= worksheet.Rows.Count - 1; i++)
                        {
                            var row = worksheet.Rows[i];
                            var modelo = new ModeloTemplate
                            {
                                Item = row[0]?.ToString().Trim(),
                                Codigo = row[1]?.ToString().Trim(),
                                Origem = row[2]?.ToString().Trim(),
                                Descricao = row[3]?.ToString().Trim(),
                                Un = row[4]?.ToString().Trim(),
                                Qntd = row[5]?.ToString().Trim(),
                                ValorSBdi = row[6]?.ToString().Trim(),
                                ValorCBdi = row[7]?.ToString().Trim(),
                                Valor = row[8]?.ToString().Trim()
                            };

                            modelosTemplate.Add(modelo);
                        }

                        // Retornar sucesso com a lista de modelos
                        return (modelosTemplate.OrderBy(i => i.Item).ToList());
                    }
                }
            }
            catch (Exception Ex)
            {
                throw new Exception($"Ocorreu o seguinte erro ao tentar processar o arquivo.Erro: {Ex.Message}");
            }
        }

        private async Task<List<ModeloTemplate>> ProcessarArquivoTemplateProjeto(CriarAditivoRequest requisicao)
        {
            try
            {
                return (await this.ProcessarArquivoTemplateProjeto(requisicao.ArquivoTemplate));
            }
            catch (Exception Ex)
            {
                throw new Exception($"Ocorreu o seguinte erro ao tentar processar o arquivo.Erro: {Ex.Message}");
            }
        }

        private async Task<ItemEntidade> ProcessarItemFilho(ModeloTemplate itemFilho, int ordemFilho, int idTemplate, int idItemPai, CancellationToken cancellationToken)
        {
            //Verifica se a origem obtida existe no banco de dados
            var _origemBancoDeDadosFilho = await this._origemRepository.BuscarPorNomeAsync(itemFilho.Origem, cancellationToken);

            QuantidadeEntidade _quantidadeBancoDeDadosFilho = null;

            //Verifica se a quantidade foi informada
            if (!string.IsNullOrWhiteSpace(itemFilho.Qntd))
            {
                //Verifica se a quantidade obtida existe no banco de dados
                _quantidadeBancoDeDadosFilho = await this._quantidadeRepository.BuscarPorNomeAsync(itemFilho.Qntd, cancellationToken);
            }

            //Criar o novo item filho a ser inserido na tabela de items
            var _novoItemFilho = await CriarItemEntidade(itemFilho, _origemBancoDeDadosFilho, ordemFilho, idTemplate, idItemPai, cancellationToken);

            return (_novoItemFilho);
        }

        public async Task<Result<AditivosDataResponse>> BuscarTodosAsync(AditivosContratoFilter filter, CancellationToken cancellationToken)
        {
            //Verifica se o número do contrato não existe
            var _contratoInformado = await this._contratosRepository.BuscarPorIdAsync(filter.IdContrato, cancellationToken);

            if (_contratoInformado == null)
                return Result<AditivosDataResponse>.Failure(new NoRecordsError(Contratos.IdContratoNaoEncontrado));

            var _aditivos = await _aditivosRepository.BuscarTodosAsync(filter.IdContrato, cancellationToken);

            if (_aditivos.Count is 0)
                return Result<AditivosDataResponse>.Failure(new NoRecordsError(Aditivos.NenhumAditivoEncontradoParaoContratoInformado));

            var mapped = _mapper.Map<List<AditivosResponse>>(_aditivos);
            var result = new AditivosDataResponse
            {
                Data = mapped,
                TotalRegisters = _aditivos.Count,
            };

            return Result<AditivosDataResponse>.Success(result);
        }

        public async Task<Result<AditivosResponse>> BuscarPorIdAsync(int idAditivo, CancellationToken cancellationToken)
        {
            var aditivoFound = await _aditivosRepository.BuscarPorIdAsync(idAditivo, cancellationToken);

            if (aditivoFound is null)
                return Result<AditivosResponse>.Failure(new NoRecordsError(Aditivos.IdAditivoNaoEncontrado));

            var result = _mapper.Map<AditivosResponse>(aditivoFound);
            return Result<AditivosResponse>.Success(result);
        }

        public async Task<Result<DeletarAditivoResponse>> DeletarAsync(int id, CancellationToken cancellationToken)
        {
            try
            {
                var _aditivoFound = await _aditivosRepository.BuscarPorIdAsync(id, cancellationToken);

                if (_aditivoFound is null)
                    return Result<DeletarAditivoResponse>.Failure(new NoRecordsError(Aditivos.IdAditivoNaoEncontrado));

                //Verifica se já existe alguma medição para o contrato associado ao aditivo que foi posterior a data de assinatura do aditivo
                var _ultimaMedicao = await this._medicoesProjetoRepository.BuscarUltimaMedicaoPorContratoIdAsync(_aditivoFound.ContratoId,
                    await this.GetUsuarioLogado(cancellationToken), cancellationToken);

                if (_ultimaMedicao != null)
                {
                    //Verifica se a data da medição é igual ou maior a data de assinatura do aditivo
                    if (_ultimaMedicao.DataMedicao >= _aditivoFound.DataAssinatura)
                        return Result<DeletarAditivoResponse>.Failure(new AditivoNaoPodeSerExcluirError(Aditivos.AditivoNaoPodeSerExcluido));
                }

                //Obtém o contrato associado]
                var _contratoOriginal = await this._contratosRepository.BuscarPorIdAsync(_aditivoFound.ContratoId, cancellationToken);

                //Busca todos os items associados ao aditivo
                var _itemsAditivo = await this._itemsAditivoRepository.BuscarTodosItemsAditivosAsync(id, cancellationToken);

                //Busca todos os items do contrato original
                var _itemsContratoOriginal = await this._itemsContratoRepository.BuscarTodosItemsContratosAsync(_aditivoFound.ContratoId, cancellationToken);

                //Percorre todos os items do aditivo para realizar as devidas extrações
                foreach (var _itemAditivo in _itemsAditivo)
                {
                    //Busca item do contrato original
                    var _itemExistente = _itemsContratoOriginal.Where(i => i.Item.Identificador == _itemAditivo.Item.Identificador).FirstOrDefault();

                    if (_itemExistente != null)
                    {
                        //Atualiza a quantidade do contrato original removendo a quantidade que havia sido adicionada pelo aditivo
                        _itemExistente.Unidade = _itemExistente.Unidade - _itemAditivo.Unidade;

                        //Armazena numa variável o valor original do valor total com bdi
                        var _valorTotalComBdiOriginal = _itemExistente.ValorTotalComBdi;

                        //Recalcula o valor total com bdi
                        _itemExistente.ValorTotalComBdi = _itemExistente.ValorComBdi * _itemExistente.Unidade;

                        //Atualiza o valor do item do contrato
                        await this._itemsContratoRepository.AtualizarAsync(_itemExistente, cancellationToken);

                        //Obtém a diferença sobre o valor total com bdi
                        var _diferencaValorTotalComBdi = _valorTotalComBdiOriginal - _itemExistente.ValorTotalComBdi ;

                        //Atualiza o saldo do contrato com a diferença que foi aditivada
                        _contratoOriginal.ValorSaldoRestante = _contratoOriginal.ValorSaldoRestante -  _diferencaValorTotalComBdi;
                        _contratoOriginal.ValorTotalSolicitado = _contratoOriginal.ValorTotalSolicitado - _diferencaValorTotalComBdi;
                        _contratoOriginal.ValorTotalPrevisto = _contratoOriginal.ValorTotalPrevisto - _diferencaValorTotalComBdi;

                        //Atualiza o contrato
                        await this._contratosRepository.AtualizarAsync(_contratoOriginal, cancellationToken);
                    }
                }

                //Exclui o aditivo
                _aditivoFound.Delete();
                await _aditivosRepository.DeletarAsync(_aditivoFound, cancellationToken);

                var result = new DeletarAditivoResponse { Mensagem = Aditivos.AditivoDeletado };

                return Result<DeletarAditivoResponse>.Success(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);

                return Result<DeletarAditivoResponse>.Failure(new UnknownError(ex.Message));
            }
        }

        private async Task<UsuariosEntidade?> GetUsuarioLogado(CancellationToken cancellationToken)
        {
            var _userId = _applicationUser.UserId;
            var _usuario = await this._usuariosRepository.BuscarPorIdAsync(_userId, cancellationToken);

            return (_usuario);
        }
    }
}