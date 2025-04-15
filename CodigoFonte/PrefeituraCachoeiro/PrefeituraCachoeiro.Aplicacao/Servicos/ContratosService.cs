using AutoMapper;
using ExcelDataReader;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using PrefeituraCachoeiro.Aplicacao.Dtos.Requisicoes;
using PrefeituraCachoeiro.Aplicacao.Dtos.Requisicoes.Validacoes;
using PrefeituraCachoeiro.Aplicacao.Dtos.Respostas;
using PrefeituraCachoeiro.Aplicacao.Interfaces;
using PrefeituraCachoeiro.Dados.Filtros;
using PrefeituraCachoeiro.Dados.Interfaces;
using PrefeituraCachoeiro.Dominio.Entidades;
using PrefeituraCachoeiro.Dominio.Errors;
using PrefeituraCachoeiro.Dominio.Modelos;
using PrefeituraCachoeiro.TratadorControlador.ObjetosValor;
using System.Data;

namespace PrefeituraCachoeiro.Aplicacao.Servicos
{
    public class ContratosService : IContratosService
    {
        private const string QUANTIDADE_M = @"M";
        private const string QUANTIDADE_M2 = @"M2";
        private const string QUANTIDADE_KM = @"KM";

        private readonly IMapper _mapper;
        private readonly ILogger _logger;
        private readonly IContratosRepository _contratosRepository;
        private readonly IItemRepository _itemRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ISequenceService _sequenceService;
        private readonly IS3Service _s3Service;
        private readonly IProjetoRepository _projetoRepository;
        private readonly IOrigemRepository _origemRepository;
        private readonly IQuantidadeRepository _quantidadeRepository;
        private readonly ITemplateRepository _templateRepository;
        private readonly IItemsContratoRepository _itemsContratoRepository;
        private readonly IArquivosContratoRepository _arquivosContratoRepository;
        private readonly IAditivosRepository _aditivosRepository;
        private readonly IApplicationUser _applicationUser;
        private readonly IUsuariosRepository _usuariosRepository;

        public ContratosService(IMapper mapper, ILoggerFactory loggerFactory,
            IContratosRepository contratosRepository, IItemRepository itemRepository,
            IUnitOfWork unitOfWork, ISequenceService sequenceService, IS3Service s3Service,
            IProjetoRepository projetoRepository, IOrigemRepository origemRepository, IQuantidadeRepository quantidadeRepository,
            ITemplateRepository templateRepository, IItemsContratoRepository itemsContratoRepository, IArquivosContratoRepository arquivosContratoRepository,
            IAditivosRepository aditivosRepository, IApplicationUser applicationUser, IUsuariosRepository usuariosRepository)
        {
            _mapper = mapper;
            _logger = loggerFactory.CreateLogger<ContratosService>();
            _contratosRepository = contratosRepository;
            _itemRepository = itemRepository;
            _unitOfWork = unitOfWork;
            _sequenceService = sequenceService;
            _s3Service = s3Service;
            _projetoRepository = projetoRepository;
            _origemRepository = origemRepository;
            _quantidadeRepository = quantidadeRepository;
            _templateRepository = templateRepository;
            _itemsContratoRepository = itemsContratoRepository;
            _arquivosContratoRepository = arquivosContratoRepository;
            _aditivosRepository = aditivosRepository;
            _applicationUser = applicationUser;
            _usuariosRepository = usuariosRepository;
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

        public async Task<Result<List<ContratosResponse>>> BuscarTodosAditivosAsync(int idContrato, CancellationToken cancellationToken)
        {
            var contratos = await _contratosRepository.BuscarTodosAditivosAsync(idContrato, cancellationToken);
            var result = _mapper.Map<List<ContratosResponse>>(contratos);

            return Result<List<ContratosResponse>>.Success(result);
        }

        public async Task<Result<ContratosResponse>> BuscarPorIdAsync(int idContrato, CancellationToken cancellationToken)
        {
            var projetoFound = await _contratosRepository.BuscarPorIdAsync(idContrato, cancellationToken);

            if (projetoFound is null)
                return Result<ContratosResponse>.Failure(new NoRecordsError(Compartilhado.Contratos.IdContratoNaoEncontrado));

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

                decimal _totalPrevisto = 0;
                decimal _totalSolicitado = 0;
                decimal _totalRestante = 0;
                decimal _totalMedido = 0;

                try
                {
                    //Faz a leitura do arquivo excel associado ao projeto que está sendo criado
                    var _listaItems = await ProcessarArquivoTemplateProjeto(requisicao);

                    //Cria um dicionário de origem localmente para usar como cache
                    var _dicOrigem = new Dictionary<string, OrigemEntidade>();

                    //Cria um dicionário de quantidade localmente para usar como cache]
                    var _dicQuantidade = new Dictionary<string, QuantidadeEntidade>();

                    //Verifica se algumas informações existentes no items que foram informadas são válidas
                    foreach (var _itemLocal in _listaItems)
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

                    //Cria um template para o nome do projeto
                    var _novoTemplate = new TemplateEntidade()
                    {
                        Nome = $"Template do Contrato Número {requisicao.NumeroContrato}"
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

                    var _contrato = new ContratosEntidade(requisicao.DataContrato.ToUniversalTime(),
                        requisicao.NumeroContrato, _totalPrevisto, _totalSolicitado, _totalMedido, _totalRestante)
                    {
                        DataInicio = requisicao.DataInicio.ToUniversalTime(),
                        DataTermino = requisicao.DataTermino.ToUniversalTime(),
                        EmpresaId = requisicao.EmpresaId,
                        Gerente = requisicao.Gerente,
                        PrefeituraId = requisicao.PrefeituraId,
                        TipoContratacao = requisicao.TipoContratacao,
                        IdTemplate = _novoTemplate.IdTemplate,
                        Valor = 0,
                        DataTerminoAtualizada = requisicao.DataTermino.ToUniversalTime()
                    };

                    _contrato = await _contratosRepository.InserirAsync(_contrato, cancellationToken);

                    //Preenche a tabela de items de projeto
                    var _itemsContrato = await this._itemRepository.BuscarTodosAsync(_novoTemplate.IdTemplate, cancellationToken);

                    //Processa todos os items e associa ao contrato
                    foreach (var _itemContrato in _itemsContrato)
                    {
                        var _novoItemContrato = new ItemsContratoEntidade()
                        {
                            ContratosId = _contrato.IdContrato,
                            ItemId = _itemContrato.IdItem,
                        };

                        if (_itemContrato.QuantidadeId.HasValue)
                            _novoItemContrato.QuantidadeId = _itemContrato.QuantidadeId.Value;

                        if (_itemContrato.Unidade.HasValue)
                        {
                            _novoItemContrato.Unidade = _itemContrato.Unidade.Value;
                            _novoItemContrato.UnidadeOriginal = _novoItemContrato.Unidade;
                        }

                        if (_itemContrato.ValorComBdi.HasValue)
                            _novoItemContrato.ValorComBdi = _itemContrato.ValorComBdi.Value;

                        if (_itemContrato.ValorSemBdi.HasValue)
                            _novoItemContrato.ValorSemBdi = _itemContrato.ValorSemBdi.Value;

                        if (_itemContrato.ValorTotalComBdi.HasValue)
                            _novoItemContrato.ValorTotalComBdi = _itemContrato.ValorTotalComBdi.Value;

                        await this._itemsContratoRepository.InserirAsync(_novoItemContrato, cancellationToken);
                    }

                    //Verifica se foram informados arquivos junto com o contrato
                    if (requisicao.Arquivos != null)
                    {
                        foreach (var _arquivo in requisicao.Arquivos)
                        {
                            //Faz primeiro o upload do logo da empresa.
                            var _upload = await _s3Service.UploadLogoAsync(_arquivo);

                            //Cria um objeto de arquivo do contrato para ser gravado junto com o contrato
                            var _arquivoContrato = new ArquivosContratosEntidade()
                            {
                                ArquivoContrato = _upload,
                                IdContratos = _contrato.IdContrato
                            };

                            if (_contrato.ArquivosContratos == null)
                                _contrato.ArquivosContratos = new List<ArquivosContratosEntidade>();

                            await _arquivosContratoRepository.InserirAsync(_arquivoContrato, cancellationToken);
                        }
                    }

                    //Atualiza os valores do contrato
                    await this.AtualizarInformacoesCabecalhoContrato(_contrato.IdContrato, cancellationToken);

                    //await _unitOfWork.Commit();

                    var result = _mapper.Map<CriarContratoResponse>(_contrato);

                    return Result<CriarContratoResponse>.Success(result);
                }
                catch (Exception Ex)
                {
                    //await _unitOfWork.Rollback();
                    throw Ex;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);

                return Result<CriarContratoResponse>.Failure(new UnknownError(ex.Message));
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

        private async Task<List<ModeloTemplate>> ProcessarArquivoTemplateProjeto(CriarContratoRequest requisicao)
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
                contratoFound.DataInicio = requisicao.DataInicio.ToUniversalTime();
                contratoFound.DataTermino = requisicao.DataTermino.ToUniversalTime();
                contratoFound.EmpresaId = requisicao.EmpresaId;
                contratoFound.Gerente = requisicao.Gerente;
                contratoFound.PrefeituraId = requisicao.PrefeituraId;
                contratoFound.TipoContratacao = requisicao.TipoContratacao;

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

        public async Task<Result<DeletarContratoResponse>> DeletarAsync(int id, CancellationToken cancellationToken)
        {
            try
            {
                var contratoFound = await _contratosRepository.BuscarPorIdAsync(id, cancellationToken);

                if (contratoFound is null)
                    return Result<DeletarContratoResponse>.Failure(new NoRecordsError(Compartilhado.Contratos.IdContratoNaoEncontrado));

                contratoFound.Delete();
                await _contratosRepository.DeletarAsync(contratoFound, cancellationToken);

                var result = new DeletarContratoResponse { Mensagem = Compartilhado.Contratos.ContratoDeletado };

                return Result<DeletarContratoResponse>.Success(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);

                return Result<DeletarContratoResponse>.Failure(new UnknownError(ex.Message));
            }
        }

        public async Task<Result<RemoverProjetoContratoResponse>> RemoverProjetoContratoAsync(RemoverProjetoContratoRequest request, CancellationToken cancellationToken)
        {
            try
            {
                //Busca no banco de dados o objeto de contrato/projeto
                var _contratoProjeto = await this._contratosRepository.BuscarProjetoInContratoAsync(request.IdContrato, request.IdProjeto, cancellationToken); ;

                //Verifica se existe o projeto associado ao contrato
                if (_contratoProjeto != null)
                {
                    //Remover do banco de dados
                    await this._contratosRepository.RemoverProjetoContratoAsync(_contratoProjeto, cancellationToken);

                    return (Result<RemoverProjetoContratoResponse>.Success(
                        new RemoverProjetoContratoResponse()
                        {
                            IsSucesso = true,
                            Mensagem = Compartilhado.Contratos.ProjetoRemovidoContrato
                        }));
                }

                return (Result<RemoverProjetoContratoResponse>.Success(
                    new RemoverProjetoContratoResponse()
                    {
                        IsSucesso = false,
                        Mensagem = Compartilhado.Contratos.ProjetoNaoAssociadoContrato
                    }));
            }
            catch (Exception Ex)
            {
                _logger.LogError(Ex.Message);

                return Result<RemoverProjetoContratoResponse>.Failure(new UnknownError(Ex.Message));
            }
        }

        public async Task<Result<AdicionarProjetoContratoResponse>> AdicionarProjetoContratoAsync(AdicionarProjetoContratoRequest request, CancellationToken cancellationToken)
        {
            try
            {
                //Verificar se esse projeto já está associado a esse contrato
                if (await this._contratosRepository.VerificarProjetoAssociadoContratoAsync(request.IdContrato, request.IdProjeto, cancellationToken))
                    return Result<AdicionarProjetoContratoResponse>.Failure(new NoRecordsError(Compartilhado.Contratos.ProjetoJaAssociadoContrato));

                //Criar o objeto para gravar no banco de dados
                var _contratoprojeto = new ContratosProjetosEntidade()
                {
                    IdContrato = request.IdContrato,
                    IdProjeto = request.IdProjeto
                };

                //Salvar no banco de dados
                await this._contratosRepository.AdicionarProjetoContratoAsync(_contratoprojeto, cancellationToken);

                return (Result<AdicionarProjetoContratoResponse>.Success(
                    new AdicionarProjetoContratoResponse()
                    {
                        IsSucesso = true,
                        Mensagem = Compartilhado.Contratos.ProjetoAdicionadoContrato
                    }));
            }
            catch (Exception Ex)
            {
                _logger.LogError(Ex.Message);

                return Result<AdicionarProjetoContratoResponse>.Failure(new UnknownError(Ex.Message));
            }
        }

        private async Task AtualizarInformacoesCabecalhoContrato(int idContrato, CancellationToken cancellationToken)
        {
            decimal _totalPrevisto = 0;
            decimal _totalSolicitado = 0;
            decimal _totalRestante = 0;

            var _contratoBancoDeDados = await this._contratosRepository.BuscarPorIdAsync(idContrato, cancellationToken);

            decimal? _valorTotalPrevisto = _contratoBancoDeDados.Items.Sum(i => i.ValorTotalComBdi);

            if (_valorTotalPrevisto.HasValue)
                _totalPrevisto = _valorTotalPrevisto.Value;

            _totalRestante = _totalPrevisto;

            if (_contratoBancoDeDados != null)
            {
                _contratoBancoDeDados.Valor += _totalPrevisto;
                _contratoBancoDeDados.ValorTotalPrevisto += _totalPrevisto;
                _contratoBancoDeDados.ValorTotalSolicitado = _totalSolicitado;
                _contratoBancoDeDados.ValorSaldoRestante += _totalRestante;
                _contratoBancoDeDados.ValorAtualContrato = 0;
                _contratoBancoDeDados.ValorAtualContrato += _totalPrevisto;

                //Atualizar o contrato no banco de dados
                await this._contratosRepository.AtualizarAsync(_contratoBancoDeDados, cancellationToken);
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

        public async Task<Result<DeletarArquivoContratoResponse>> DeletarArquivoAnexadoAsync(int id, CancellationToken cancellationToken)
        {
            try
            {
                //Busca o arquivo de contrato associado ao id
                var _arquivoContrato = await this._arquivosContratoRepository.BuscarPorIdAsync(id, cancellationToken);

                if (_arquivoContrato == null)
                    return Result<DeletarArquivoContratoResponse>.Failure(new NoRecordsError(Compartilhado.Contratos.ArquivoContatoNaoEncontrado));

                await _arquivosContratoRepository.DeletarAsync(_arquivoContrato, cancellationToken);

                //Apaga primeira o arquivo no bucket na aws
                await this._s3Service.ApagarLogo(_arquivoContrato.ArquivoContrato);

                var result = new DeletarArquivoContratoResponse { Mensagem = Compartilhado.Contratos.ArquivoContratoDeletado };

                return Result<DeletarArquivoContratoResponse>.Success(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);

                return Result<DeletarArquivoContratoResponse>.Failure(new UnknownError(ex.Message));
            }
        }

        public async Task<Result<RegistrarDocumentosContratoResponse>> RegistrarDocumentosAsync(RegistrarDocumentosContratoRequest requisicao, CancellationToken cancellationToken)
        {
            try
            {
                //Busca o contrato original
                var _contratoOriginal = await this._contratosRepository.BuscarPorIdAsync(requisicao.IdContrato,cancellationToken);

                if (_contratoOriginal == null)
                    return Result<RegistrarDocumentosContratoResponse>.Failure(new NoRecordsError(Compartilhado.Contratos.IdContratoNaoEncontrado));

                //Obtém o usuário logado
                var _usuarioLogado = await this.GetUsuarioLogado(cancellationToken);

                //Verifica se o contrato informado pertence a mesma prefeitura do usuário logado
                if (_usuarioLogado.PrefeituraId != null && _contratoOriginal.PrefeituraId != _usuarioLogado.PrefeituraId)
                    return Result<RegistrarDocumentosContratoResponse>.Failure(new AcessoInvalidoUsuarioError(Compartilhado.Contratos.ContratoNaoPertenceAMesmaPrefeituraDoUsuarioLogado));

                var _listaIds = new List<IdDocumentoContratoRegistradoResponse>();

                try
                {
                    //Verifica se foram informados arquivos no momento da aprovação
                    if (requisicao.Arquivos != null)
                    {
                        foreach (var _arquivo in requisicao.Arquivos)
                        {
                            //Faz primeiro o upload do contrato
                            var _upload = await _s3Service.UploadLogoAsync(_arquivo);

                            //Registra no banco de dados que o arquivo foi feito o download junto com o contrato
                            var _arquivoContrato = new ArquivosContratosEntidade(requisicao.IdContrato, _upload);

                            _arquivoContrato = await this._arquivosContratoRepository.InserirAsync(_arquivoContrato, cancellationToken);

                            _listaIds.Add(new IdDocumentoContratoRegistradoResponse(_arquivoContrato.Id, _arquivoContrato.ArquivoContrato)
                            {
                                 Arquivo = Path.GetFileName(_arquivoContrato.ArquivoContrato)
                            });
                        }
                    }

                    var result = new RegistrarDocumentosContratoResponse(true, string.Empty)
                    {
                        Ids = _listaIds
                    };

                    return Result<RegistrarDocumentosContratoResponse>.Success(result);
                }
                catch (Exception Ex)
                {
                    throw Ex;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);

                return Result<RegistrarDocumentosContratoResponse>.Failure(new UnknownError(ex.Message));
            }
        }

        private async Task<UsuariosEntidade?> GetUsuarioLogado(CancellationToken cancellationToken)
        {
            var _userId = _applicationUser.UserId;
            var _usuario = await this._usuariosRepository.BuscarPorIdAsync(_userId, cancellationToken);

            return (_usuario);
        }

        public async Task<MemoryStream> DownloadArquivoContrato(int id, CancellationToken cancellationToken)
        {
            try
            {
                var _arquivo = await _arquivosContratoRepository.BuscarPorIdAsync(id, cancellationToken);
                var _nomeArquivo = this._s3Service.ExtractFileNameFromUrl(_arquivo.ArquivoContrato);
                var _stream = await this._s3Service.DownloadFileFromS3Async(_nomeArquivo);

                return (_stream);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}