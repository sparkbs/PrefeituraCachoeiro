using AutoMapper;
using FluentValidation;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using PrefeituraCachoeiro.Aplicacao.Dtos.Requisicoes;
using PrefeituraCachoeiro.Aplicacao.Dtos.Requisicoes.Validacoes;
using PrefeituraCachoeiro.Aplicacao.Dtos.Respostas;
using PrefeituraCachoeiro.Aplicacao.Interfaces;
using PrefeituraCachoeiro.Dados.Filtros;
using PrefeituraCachoeiro.Dados.Interfaces;
using PrefeituraCachoeiro.Dominio.Entidades;
using PrefeituraCachoeiro.Dominio.Enumeradores;
using PrefeituraCachoeiro.Dominio.Errors;
using PrefeituraCachoeiro.TratadorControlador.ObjetosValor;
using System.Net;
using System.Net.Mail;
using System.Text;

namespace PrefeituraCachoeiro.Aplicacao.Servicos
{
    public class MedicoesProjetoService : IMedicoesProjetoService
    {
        private const int JANEIRO = 1;
        private const int FEVEREIRO = 2;
        private const int MARCO = 3;
        private const int ABRIL = 4;
        private const int MAIO = 5;
        private const int JUNHO = 6;
        private const int JULHO = 7;
        private const int AGOSTO = 8;
        private const int SETEMBRO = 9;
        private const int OUTUBRO = 10;
        private const int NOVEMBRO = 11;

        private const string MES_JANEIRO = "Janeiro";
        private const string MES_FEVEREIRO = "Fevereiro";
        private const string MES_MARCO = "Março";
        private const string MES_ABRIL = "Abril";
        private const string MES_MAIO = "Maio";
        private const string MES_JUNHO = "Junho";
        private const string MES_JULHO = "Julho";
        private const string MES_AGOSTO = "Agosto";
        private const string MES_SETEMBRO = "Setembro";
        private const string MES_OUTUBRO = "Outubro";
        private const string MES_NOVEMBRO = "Novembro";
        private const string MES_DEZEMBRO = "Dezembro";

        private const string FORMATAR_DATA = @"dd/MM/yyyy";

        private const string HOST_SERVIDOR_EMAIL = @"HostServidorEmail";
        private const string NUMERO_PORTA_SERVIDOR_EMAIL = @"NumeroPortaServidorEmail";
        private const string NOME_USUARIO_SERVIDOR_EMAIL = @"NomeUsuarioServidorEmail";
        private const string SENHA_USUARIO_SERVIDOR_EMAIL = @"SenhaUsuarioServidorEmail";
        private const string EMAIL_ORIGEM_MEDICAO = @"EmailOrigemMedicao";
        private const string ASSUNTO_EMAIL_APROVACAO_MEDICAO = @"AssuntoEmailAprovacaoMedicao";
        private const string EMAIL_DESTINO_PROJETA = @"EmailDestinoProjeta";

        private readonly IMapper _mapper;
        private readonly ILogger _logger;
        private readonly IMedicoesProjetoRepository _medicoesProjetoRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogStatusMedicaoRepository _logStatusMedicaoRepository;
        private readonly IContratosRepository _contratosRepository;
        private readonly IApplicationUser _applicationUser;
        private readonly IItemsMedicoesProjetoRepository _itemsMedicoesProjetoRepository;
        private readonly IS3Service _s3Service;
        private readonly IArquivosMedicoesProjetoRepository _arquivosMedicoesProjetoRepository;
        private readonly IProjetoRepository _projetoRepository;
        private readonly IUsuariosRepository _usuariosRepository;
        private readonly IAditivosRepository _aditivosRepository;
        private readonly IItemsAditivoRepository _itemsAditivoRepository;
        private readonly IItemsContratoRepository _itemsContratoRepository;
        private readonly IConfiguration _configuration;
        private readonly IPrefeituraRepository _prefeituraRepository;

        public MedicoesProjetoService(IMapper mapper, ILoggerFactory loggerFactory,
            IMedicoesProjetoRepository medicoesProjetoRepository,
            IUnitOfWork unitOfWork, ILogStatusMedicaoRepository logStatusMedicaoRepository,
            IContratosRepository contratosRepository, IApplicationUser applicationUser,
            IItemsMedicoesProjetoRepository itemsMedicoesProjetoRepository, IS3Service s3Service,
            IArquivosMedicoesProjetoRepository arquivosMedicoesProjetoRepository, IProjetoRepository projetoRepository,
            IUsuariosRepository usuariosRepository, IAditivosRepository aditivosRepository,
            IItemsAditivoRepository itemsAditivoRepository, IItemsContratoRepository itemsContratoRepository,
            IConfiguration configuration, IPrefeituraRepository prefeituraRepository)
        {
            _mapper = mapper;
            _logger = loggerFactory.CreateLogger<MedicoesProjetoService>();
            _medicoesProjetoRepository = medicoesProjetoRepository;
            _unitOfWork = unitOfWork;
            _logStatusMedicaoRepository = logStatusMedicaoRepository;
            _contratosRepository = contratosRepository;
            _applicationUser = applicationUser;
            _itemsMedicoesProjetoRepository = itemsMedicoesProjetoRepository;
            _s3Service = s3Service;
            _arquivosMedicoesProjetoRepository = arquivosMedicoesProjetoRepository;
            _projetoRepository = projetoRepository;
            _usuariosRepository = usuariosRepository;
            _aditivosRepository = aditivosRepository;
            _itemsAditivoRepository = itemsAditivoRepository;
            _itemsContratoRepository = itemsContratoRepository;
            _configuration = configuration;
            _prefeituraRepository = prefeituraRepository;
        }

        private async Task<List<MedicoesProjetoEntidade>> FiltrarMedicoesProjetoParaProjetosAtivos(List<MedicoesProjetoEntidade> medicoes,
            CancellationToken cancellationToken)
        {
            var _resultado = new List<MedicoesProjetoEntidade>();

            for (var i = 0; i <= medicoes.Count - 1; i++)
            {
                if (medicoes[i].IdProjeto.HasValue)
                {
                    //Verifica se o projeto associado existe
                    var _projeto = await this._projetoRepository.BuscarPorIdAsync(medicoes[i].IdProjeto.Value, cancellationToken);

                    if (_projeto != null)
                        _resultado.Add(medicoes[i]);
                }
            }

            return (_resultado);
        }

        public async Task<Result<BoletimMedicaoResponse>> BuscarBoletimMedicaoAsync(int idMedicao, CancellationToken cancellationToken)
        {
            var _medicoes = await this.FiltrarMedicoesProjetoParaProjetosAtivos(
                await this._medicoesProjetoRepository.BuscarBoletimMedicaoAsync(idMedicao, 
                await this.GetUsuarioLogado(cancellationToken), cancellationToken), cancellationToken);

            var _result = new BoletimMedicaoResponse()
            {
                BoletimMedicaoCabecalho = new BoletimMedicaoCabecalhoResponse()
                {
                    NomePrefeitura = "PREFEITURA MUNICIPAL DE CACHOEIRO DE ITAPEMIRIM",
                    NomeUnidade = "SECRETARIA MUNICIPAL DE OBRAS - SEMO",
                    TipoBoletimEmissao = CriarTipoBoletimEmissao()
                },
                Detalhes = new List<BoletimDetalheMedicaoResponse>(),
                ValorTotalMedicao = 0
            };

            //Processa a lista de medições retornadas
            foreach (var _medicao in _medicoes)
            {
                var _detalheMedicao = new BoletimDetalheMedicaoResponse()
                {
                    DataMedicao = _medicao.DataMedicao,
                    NumeroMedicao = _medicao.NumeroMedicao,
                    SubCabecalho = $"BOLETIM DEMEDIÇÃO: MEDIÇÃO {_medicao.NumeroMedicao}",
                    SubBoletins = new List<BoletimMedicaoDetalheResponse>()
                };

                if (_medicao.Projeto != null)
                {
                    _detalheMedicao.Projeto = _medicao.Projeto.NomeProjeto;
                    _detalheMedicao.IdProjeto = _medicao.Projeto.IdProjeto;
                }

                _detalheMedicao.Secretaria = _medicao.Secretaria;
                _detalheMedicao.IdEmpresa = _medicao.Contratos.Empresa.EmpresaId;
                _detalheMedicao.Empresa = _medicao.Contratos.Empresa.Nome;

                //Processa os items de cada medição
                foreach (var _itemMedicao in _medicao.Items)
                {
                    var _subBoletim = new BoletimMedicaoDetalheResponse()
                    {
                        CodigoAta = _itemMedicao.ItemsContrato.Item.Codigo,
                        Numero = _itemMedicao.ItemsContrato.Item.Identificador,
                        Descricao = _itemMedicao.ItemsContrato.Item.Descricao,
                        Quantidade = _itemMedicao.ItemsContrato.QuantidadeId,
                        Unidade = _itemMedicao.Unidade.ToString(),
                        QuantidadeResponse = new QuantidadeResponse()
                        {
                            IdQuantidade = _itemMedicao.ItemsContrato.QuantidadeId,
                            Nome = _itemMedicao.ItemsContrato.Quantidade.Nome
                        }
                    };

                    if (_itemMedicao.ItemsContrato.Item.ValorComBdi.HasValue)
                        _subBoletim.PrecoComBdi = _itemMedicao.ItemsContrato.Item.ValorComBdi.Value;

                    if (_itemMedicao.ItemsContrato.Item.ValorSemBdi.HasValue)
                        _subBoletim.PrecoSemBdi = _itemMedicao.ItemsContrato.Item.ValorSemBdi.Value;

                    if (_itemMedicao.ItemsContrato.Item.ValorTotalComBdi.HasValue)
                        _subBoletim.ValorTotal = _itemMedicao.ItemsContrato.Item.ValorTotalComBdi.Value;

                    if (_subBoletim.PrecoComBdi.HasValue && _subBoletim.PrecoSemBdi.HasValue)
                        _subBoletim.Bdi = Math.Round(((_subBoletim.PrecoComBdi.Value / _subBoletim.PrecoSemBdi.Value) * 100) - 100, 2);

                    _detalheMedicao.SubBoletins.Add(_subBoletim);

                    if (_subBoletim.ValorTotal.HasValue)
                        _result.ValorTotalMedicao += _subBoletim.ValorTotal.Value;
                }

                _result.Detalhes.Add(_detalheMedicao);
            }

            return Result<BoletimMedicaoResponse>.Success(_result);
        }

        public async Task<Result<BoletimMedicaoDetalhadoResponse>> BuscarBoletimMedicaoDetalhadoAsync(int idMedicao, CancellationToken cancellationToken)
        {
            var _medicoes = await this.FiltrarMedicoesProjetoParaProjetosAtivos(
                await this._medicoesProjetoRepository.BuscarBoletimMedicaoDetalhadoAsync(idMedicao, 
                await this.GetUsuarioLogado(cancellationToken), cancellationToken), cancellationToken);

            var _result = new BoletimMedicaoDetalhadoResponse()
            {
                BoletimDetalhadoCabecalho = new BoletimDetalhadoCabecalhoResponse()
                {
                    NomePrefeitura = "PREFEITURA MUNICIPAL DE CACHOEIRO DE ITAPEMIRIM",
                    NomeUnidade = "SECRETARIA MUNICIPAL DE OBRAS - SEMO",
                    TipoBoletimEmissao = CriarTipoBoletimEmissao()
                },
                Detalhes = new List<BoletimDetalheMedicaoDetalhadoResponse>(),
                ValorTotalMedicao = 0
            };

            //Processa a lista de medições retornadas
            foreach (var _medicao in _medicoes)
            {
                var _detalheMedicao = new BoletimDetalheMedicaoDetalhadoResponse()
                {
                    DataMedicao = _medicao.DataMedicao,
                    NumeroMedicao = _medicao.NumeroMedicao,
                    SubCabecalho = $"BOLETIM DEMEDIÇÃO: MEDIÇÃO {_medicao.NumeroMedicao}",
                    SubBoletins = new List<BoletimMedicaoDetalheDetalhadoResponse>()
                };

                if (_medicao.Projeto != null)
                {
                    _detalheMedicao.Projeto = _medicao.Projeto.NomeProjeto;
                    _detalheMedicao.IdProjeto = _medicao.Projeto.IdProjeto;
                }

                _detalheMedicao.Secretaria = _medicao.Secretaria;
                _detalheMedicao.IdEmpresa = _medicao.Contratos.Empresa.EmpresaId;
                _detalheMedicao.Empresa = _medicao.Contratos.Empresa.Nome;

                //Processa os items de cada medição
                foreach (var _itemMedicao in _medicao.Items)
                {
                    var _subBoletim = new BoletimMedicaoDetalheDetalhadoResponse()
                    {
                        CodigoAta = _itemMedicao.ItemsContrato.Item.Codigo,
                        Numero = _itemMedicao.ItemsContrato.Item.Identificador,
                        Descricao = _itemMedicao.ItemsContrato.Item.Descricao,
                        Quantidade = _itemMedicao.ItemsContrato.QuantidadeId,
                        Unidade = _itemMedicao.Unidade.ToString(),
                        QuantidadeResponse = new QuantidadeResponse()
                        {
                            IdQuantidade = _itemMedicao.ItemsContrato.QuantidadeId,
                            Nome = _itemMedicao.ItemsContrato.Quantidade.Nome
                        }
                    };

                    if (_itemMedicao.ItemsContrato.Item.ValorComBdi.HasValue)
                        _subBoletim.PrecoComBdi = _itemMedicao.ItemsContrato.Item.ValorComBdi.Value;

                    if (_itemMedicao.ItemsContrato.Item.ValorSemBdi.HasValue)
                        _subBoletim.PrecoSemBdi = _itemMedicao.ItemsContrato.Item.ValorSemBdi.Value;

                    if (_itemMedicao.ItemsContrato.Item.ValorTotalComBdi.HasValue)
                        _subBoletim.ValorTotal = _itemMedicao.ItemsContrato.Item.ValorTotalComBdi.Value;

                    if (_subBoletim.PrecoComBdi.HasValue && _subBoletim.PrecoSemBdi.HasValue)
                        _subBoletim.Bdi = Math.Round(((_subBoletim.PrecoComBdi.Value / _subBoletim.PrecoSemBdi.Value) * 100) - 100, 2);

                    _detalheMedicao.SubBoletins.Add(_subBoletim);

                    if (_subBoletim.ValorTotal.HasValue)
                        _result.ValorTotalMedicao += _subBoletim.ValorTotal.Value;
                }

                _result.Detalhes.Add(_detalheMedicao);
            }

            return Result<BoletimMedicaoDetalhadoResponse>.Success(_result);
        }

        public async Task<Result<BoletimProjetoResponse>> BuscarBoletimProjetoAsync(int idMedicao, int idProjeto, CancellationToken cancellationToken)
        {
            var _medicoes = await this.FiltrarMedicoesProjetoParaProjetosAtivos(
                await this._medicoesProjetoRepository.BuscarBoletimProjetoAsync(idMedicao, idProjeto, 
                await this.GetUsuarioLogado(cancellationToken), cancellationToken), cancellationToken);
            var _projeto = await this._projetoRepository.BuscarPorIdAsync(idProjeto, cancellationToken);
            var _result = new BoletimProjetoResponse()
            {
                BoletimProjetoCabecalho = new BoletimProjetoCabecalhoResponse()
                {
                    NomePrefeitura = "PREFEITURA MUNICIPAL DE CACHOEIRO DE ITAPEMIRIM",
                    NomeUnidade = "SECRETARIA MUNICIPAL DE OBRAS - SEMO",
                    TipoBoletimEmissao = CriarTipoBoletimEmissao(),
                    NomeProjeto = _projeto.NomeProjeto
                },
                Detalhes = new List<BoletimDetalheProjetoResponse>(),
                ValorTotalMedicao = 0,
                ProjetoId = idProjeto
            };

            //Processa a lista de medições retornadas
            foreach (var _medicao in _medicoes)
            {
                var _detalheMedicao = new BoletimDetalheProjetoResponse()
                {
                    DataMedicao = _medicao.DataMedicao,
                    NumeroMedicao = _medicao.NumeroMedicao,
                    SubCabecalho = $"BOLETIM DEMEDIÇÃO: MEDIÇÃO {_medicao.NumeroMedicao}",
                    SubBoletins = new List<BoletimProjetoDetalheResponse>(),
                    IdContrato = _medicao.IdContrato
                };

                if (_medicao.Projeto != null)
                    _detalheMedicao.Projeto = _medicao.Projeto.NomeProjeto;

                _detalheMedicao.Secretaria = _medicao.Secretaria;
                _detalheMedicao.IdEmpresa = _medicao.Contratos.Empresa.EmpresaId;
                _detalheMedicao.Empresa = _medicao.Contratos.Empresa.Nome;

                //Processa os items de cada medição
                foreach (var _itemMedicao in _medicao.Items)
                {
                    var _subBoletim = new BoletimProjetoDetalheResponse()
                    {
                        CodigoAta = _itemMedicao.ItemsContrato.Item.Codigo,
                        Numero = _itemMedicao.ItemsContrato.Item.Identificador,
                        Descricao = _itemMedicao.ItemsContrato.Item.Descricao,
                        Quantidade = _itemMedicao.ItemsContrato.QuantidadeId,
                        Unidade = _itemMedicao.Unidade.ToString(),
                        QuantidadeResponse = new QuantidadeResponse()
                        {
                            IdQuantidade = _itemMedicao.ItemsContrato.QuantidadeId,
                            Nome = _itemMedicao.ItemsContrato.Quantidade.Nome
                        }
                    };

                    if (_itemMedicao.ItemsContrato.Item.ValorComBdi.HasValue)
                        _subBoletim.PrecoComBdi = _itemMedicao.ItemsContrato.Item.ValorComBdi.Value;

                    if (_itemMedicao.ItemsContrato.Item.ValorSemBdi.HasValue)
                        _subBoletim.PrecoSemBdi = _itemMedicao.ItemsContrato.Item.ValorSemBdi.Value;

                    if (_itemMedicao.ItemsContrato.Item.ValorTotalComBdi.HasValue)
                        _subBoletim.ValorTotal = _itemMedicao.ItemsContrato.Item.ValorTotalComBdi.Value;

                    if (_subBoletim.PrecoComBdi.HasValue && _subBoletim.PrecoSemBdi.HasValue)
                        _subBoletim.Bdi = Math.Round(((_subBoletim.PrecoComBdi.Value / _subBoletim.PrecoSemBdi.Value) * 100) - 100, 2);

                    _detalheMedicao.SubBoletins.Add(_subBoletim);

                    if (_subBoletim.ValorTotal.HasValue)
                        _result.ValorTotalMedicao += _subBoletim.ValorTotal.Value;
                }

                _result.Detalhes.Add(_detalheMedicao);
            }

            return Result<BoletimProjetoResponse>.Success(_result);
        }

        private string CriarTipoBoletimEmissao()
        {
            return ($"BOLETIM DE MEDIÇÃO EMITIDO NO MÊS DE {BuscarNomeMes(DateTime.Now.Month)}/{DateTime.Now.Year.ToString()}");
        }

        private string BuscarNomeMes(int mes)
        {
            switch (mes)
            {
                case JANEIRO:
                    return (MES_JANEIRO);
                case FEVEREIRO:
                    return (MES_FEVEREIRO);
                case MARCO:
                    return (MES_MARCO);
                case ABRIL:
                    return (MES_ABRIL);
                case MAIO:
                    return (MES_MAIO);
                case JUNHO:
                    return (MES_JUNHO);
                case JULHO:
                    return (MES_JULHO);
                case AGOSTO:
                    return (MES_AGOSTO);
                case SETEMBRO:
                    return (MES_SETEMBRO);
                case OUTUBRO:
                    return (MES_OUTUBRO);
                case NOVEMBRO:
                    return (MES_NOVEMBRO);
                default:
                    return (MES_DEZEMBRO);
            }
        }

        public async Task<Result<MedicoesProjetoDataResponse>> BuscarTodosAsync(MedicoesProjetoFilter filter, CancellationToken cancellationToken)
        {
            var medicoesProjetoFound = await _medicoesProjetoRepository.BuscarTodosAsync(
                    filter, await this.GetUsuarioLogado(cancellationToken), cancellationToken);

            if (medicoesProjetoFound.TotalRegistros is 0)
                return Result<MedicoesProjetoDataResponse>.Failure(new NoRecordsError(Compartilhado.MedicoesProjeto.MedicoesProjetoNaoEncontrados));

            foreach (var _item in medicoesProjetoFound.Items)
                _item.ArquivosMedicoesProjeto = _item.ArquivosMedicoesProjeto.Where(i => i.DataDelecao == null).ToList();

            var _medicoesResultado = await this.FiltrarMedicoesProjetoParaProjetosAtivos(medicoesProjetoFound.Items.ToList(), cancellationToken);
            var mapped = _mapper.Map<List<MedicoesProjetoResponse>>(_medicoesResultado);
            var result = new MedicoesProjetoDataResponse
            {
                Data = mapped,
                TotalRegisters = medicoesProjetoFound.TotalRegistros,
            };

            return Result<MedicoesProjetoDataResponse>.Success(result);
        }

        public async Task<Result<MedicoesProjetoResponse>> BuscarPorIdAsync(int idMedicoesProjeto, CancellationToken cancellationToken)
        {
            var medicoesProjetoFound = await _medicoesProjetoRepository.BuscarPorIdAsync(idMedicoesProjeto, await this.GetUsuarioLogado(cancellationToken), cancellationToken);

            if (medicoesProjetoFound is null)
                return Result<MedicoesProjetoResponse>.Failure(new NoRecordsError(Compartilhado.MedicoesProjeto.MedicoesProjetoIdNaoEncontrado));

            //Verifica se o projeto associado a medição está ativo
            var _projetoEncontrado = await this._projetoRepository.BuscarPorIdAsync(medicoesProjetoFound.IdProjeto.Value, cancellationToken);

            if (_projetoEncontrado == null)
                return Result<MedicoesProjetoResponse>.Failure(new NoRecordsError(Compartilhado.MedicoesProjeto.MedicoesProjetoIdNaoEncontrado));

            medicoesProjetoFound.ArquivosMedicoesProjeto = medicoesProjetoFound.ArquivosMedicoesProjeto.Where(i => i.DataDelecao == null).ToList();

            var result = _mapper.Map<MedicoesProjetoResponse>(medicoesProjetoFound);
            return Result<MedicoesProjetoResponse>.Success(result);
        }

        public async Task<Result<ResultadoRegistrarAprovacaoMedicaoResponse>> RegistrarAprovacao(RegistrarAprovacaoMedicaoRequest requisicao, CancellationToken cancellationToken)
        {
            try
            {
                //Busca a medição original
                var _medicaoProjeto = await this._medicoesProjetoRepository.BuscarPorIdAsync(requisicao.IdMedicoesProjeto, await this.GetUsuarioLogado(cancellationToken), cancellationToken);

                if (_medicaoProjeto == null)
                    return Result<ResultadoRegistrarAprovacaoMedicaoResponse>.Failure(new NoRecordsError(Compartilhado.MedicoesProjeto.MedicoesProjetoIdNaoEncontrado));

                //Verifica se a medição está no status de enviada
                if (_medicaoProjeto.IdStatusMedicao != (int)StatusMedicao.SMEnviada)
                    return Result<ResultadoRegistrarAprovacaoMedicaoResponse>.Failure(new MedicaoNaoPodeSerAprovadaError(Compartilhado.MedicoesProjeto.MedicaoNaoPodeSerAprovada));

                //Obtém o contrato associado a medição
                var _contrato = await this._contratosRepository.BuscarPorIdAsync(_medicaoProjeto.IdContrato, cancellationToken);

                if (_contrato == null)
                    return Result<ResultadoRegistrarAprovacaoMedicaoResponse>.Failure(new NoRecordsError(Compartilhado.Contratos.IdContratoNaoEncontrado));

                //Obtém o usuário logado
                var _usuarioLogado = await this.GetUsuarioLogado(cancellationToken);

                //Verifica se o contrato informado pertence a mesma prefeitura do usuário logado
                if (_contrato.PrefeituraId != _usuarioLogado.PrefeituraId)
                    return Result<ResultadoRegistrarAprovacaoMedicaoResponse>.Failure(new AcessoInvalidoUsuarioError(Compartilhado.Contratos.ContratoNaoPertenceAMesmaPrefeituraDoUsuarioLogado));

                var _prefeituraId = 0;

                //Verifica se o usuário tem prefeitura
                if (_usuarioLogado.PrefeituraId.HasValue)
                    _prefeituraId = _usuarioLogado.PrefeituraId.Value;
                else
                {
                    //Verifica se o contrato tem prefeitura associada
                    if (_contrato.PrefeituraId.HasValue)
                        _prefeituraId = _contrato.PrefeituraId.Value;
                }

                var _emailPrefeitura = string.Empty;

                //Verifica se há número de prefeitura para a sessão corrente
                if (_prefeituraId != 0)
                {
                    var _prefeitura = await this._prefeituraRepository.BuscarPorIdAsync(_prefeituraId, cancellationToken);

                    if (_prefeitura != null)
                        _emailPrefeitura = _prefeitura.Email;
                }

                //Atualizar o status da medição para aprovado
                _medicaoProjeto.IdStatusMedicao = (int)StatusMedicao.SMAprovada;
                _medicaoProjeto.Resumo = requisicao.Resumo;


                try
                {
                    //Abre uma transação com o banco de dados
                    await _unitOfWork.BeginTransaction();

                    try
                    {
                        //Atualizar a medição no banco de dados
                        _medicaoProjeto = await _medicoesProjetoRepository.AtualizarAsync(_medicaoProjeto, cancellationToken);

                        //Atualiza do total da unidade do contrato a quantidade referente a unidade que foi aprovada
                        foreach (var _itemMedicao in _medicaoProjeto.Items)
                        {
                            //Procura na lista de items do contrato o item da medição que acabou de ser aprovado
                            var _itemContrato = _contrato.Items.Where(i => i.IdItemContrato == _itemMedicao.IdItemContrato).FirstOrDefault();

                            if (_itemContrato != null)
                            {
                                _itemContrato.ValorTotalComBdi = _itemContrato.ValorComBdi * _itemContrato.Unidade;
                                _itemContrato.Unidade = _itemContrato.Unidade - _itemMedicao.Unidade;

                                //Atualizar no banco de dados a informação do item do contrato
                                await this._itemsContratoRepository.AtualizarAsync(_itemContrato, cancellationToken);
                            }
                        }

                        //Atualiza o contrato
                        await this._contratosRepository.AtualizarAsync(_contrato, cancellationToken);

                        //Insere o registro de log para mudança de status da medição
                        await this.InserirLogStatusMedicao(_medicaoProjeto.IdMedicoesProjeto, StatusMedicao.SMAprovada, cancellationToken);

                        //Verifica se foram informados arquivos no momento da aprovação
                        if (requisicao.Arquivos != null)
                        {
                            foreach (var _arquivo in requisicao.Arquivos)
                            {
                                //Faz primeiro o upload do logo da empresa.
                                var _upload = await _s3Service.UploadLogoAsync(_arquivo);

                                //Registra no banco de dados que o arquivo foi feito o download junto com a medição que está sendo aprovada.
                                var _arquivoMedicaoProjeto = new ArquivosMedicoesProjetoEntidade(requisicao.IdMedicoesProjeto, _upload)
                                {
                                    IdOrigemArquivo = (int)OrigemArquivoMedicaoProjeto.OAAprovacao
                                };

                                await this._arquivosMedicoesProjetoRepository.InserirAsync(_arquivoMedicaoProjeto, cancellationToken);
                            }
                        }

                        /*Processa todos os items associados a medição para atualizar os valores medidos e gastos do contrato*/
                        var _totalItemsMedicao = ProcessarItemsMedicaoProjeto(_medicaoProjeto, cancellationToken);

                        //Atualiza as informações de consumo, medições e gastos do contrato
                        _contrato.ValorSaldoRestante -= _totalItemsMedicao.Data.ValorTotalMedido;
                        _contrato.ValorTotalMedido += _totalItemsMedicao.Data.ValorTotalMedido;
                        _contrato.ValorTotalSolicitado -= _totalItemsMedicao.Data.ValorTotalMedido;

                        //Atualizar o contrato no banco de dados
                        await _contratosRepository.AtualizarAsync(_contrato, cancellationToken);

                        //Confirma as operações no banco de dados
                        await _unitOfWork.Commit();
                    }
                    catch (Exception Ex)
                    {
                        //Desfaz a transação com o banco de dados
                        await _unitOfWork.Rollback();
                        throw Ex;
                    }

                    //Enviar o e-mail confirmando a aprovação
                    this.EnviarEmailAprovacaoMedicao(_emailPrefeitura);

                    var result = new ResultadoRegistrarAprovacaoMedicaoResponse(true, string.Empty);

                    return Result<ResultadoRegistrarAprovacaoMedicaoResponse>.Success(result);
                }
                catch (Exception Ex)
                {
                    throw Ex;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);

                return Result<ResultadoRegistrarAprovacaoMedicaoResponse>.Failure(new UnknownError(ex.Message));
            }
        }

        private void EnviarEmailAprovacaoMedicao(string emailPrefeitura)
        {
            var _hostServidorEmail = _configuration[HOST_SERVIDOR_EMAIL];
            var _numeroPortaServidorEmail = Convert.ToInt32(_configuration[NUMERO_PORTA_SERVIDOR_EMAIL]);
            var _nomeUsuarioServidorEmail = _configuration[NOME_USUARIO_SERVIDOR_EMAIL];
            var _senhaUsuarioServidorEmail = _configuration[SENHA_USUARIO_SERVIDOR_EMAIL];
            var _emailOrigemMedicao = _configuration[EMAIL_ORIGEM_MEDICAO];
            var _assuntoAprovacaoMedicao = _configuration[ASSUNTO_EMAIL_APROVACAO_MEDICAO];
            var _emailDestinoProjeta = emailPrefeitura;

            //Verifica se a prefeitura não tem e-mail associado
            if (_emailDestinoProjeta == null || string.IsNullOrEmpty(_emailDestinoProjeta))
                _emailDestinoProjeta = _configuration[EMAIL_DESTINO_PROJETA];

            var _mensagemEmail = new MailMessage()
            {
                Body = this.CriarCorpoEmailAprovacaoMedicao(),
                From = new MailAddress(_emailOrigemMedicao, "Projeta Engenharia"),
                IsBodyHtml = true,
                Subject = _assuntoAprovacaoMedicao
            };

            _mensagemEmail.To.Add(new MailAddress(_emailDestinoProjeta));

            var _clienteEmail = new System.Net.Mail.SmtpClient(_hostServidorEmail);

            _clienteEmail.Port = _numeroPortaServidorEmail;
            _clienteEmail.Credentials = new NetworkCredential(_nomeUsuarioServidorEmail, _senhaUsuarioServidorEmail);

            _clienteEmail.Send(_mensagemEmail);
        }

        private string CriarCorpoEmailAprovacaoMedicao()
        {
            var _corpo = new StringBuilder();

            _corpo.AppendLine("<html>");
            _corpo.AppendLine("<body>");
            _corpo.AppendLine("<table width='100%' height='100%'>");
            _corpo.AppendLine("<tr>");
            _corpo.AppendLine("<td>");
            _corpo.AppendLine("Prezado,");
            _corpo.AppendLine("</td>");
            _corpo.AppendLine("</tr>");
            _corpo.AppendLine("<tr>");
            _corpo.AppendLine("<td>");
            _corpo.AppendLine("A medição foi atualizada no sistema.");
            _corpo.AppendLine("</td>");
            _corpo.AppendLine("</tr>");
            _corpo.AppendLine("<tr>");
            _corpo.AppendLine("<td>");
            _corpo.AppendLine("Aguardo a análise e me coloco à disposição para melhores esclarecimentos, caso necessário.");
            _corpo.AppendLine("</td>");
            _corpo.AppendLine("</tr>");
            _corpo.AppendLine("<tr>");
            _corpo.AppendLine("<td>");
            _corpo.AppendLine("Muito obrigado!");
            _corpo.AppendLine("</td");
            _corpo.AppendLine("</tr>");
            _corpo.AppendLine("</table>");
            _corpo.AppendLine("</body>");
            _corpo.AppendLine("</html>");

            return (_corpo.ToString());
        }

        public async Task<Result<RegistrarDocumentosMedicaoResponse>> RegistrarDocumentosAsync(RegistrarDocumentosMedicaoRequest requisicao, CancellationToken cancellationToken)
        {
            try
            {
                //Busca a medição original
                var _medicaoProjeto = await this._medicoesProjetoRepository.BuscarPorIdAsync(requisicao.IdMedicoesProjeto, await this.GetUsuarioLogado(cancellationToken), cancellationToken);

                if (_medicaoProjeto == null)
                    return Result<RegistrarDocumentosMedicaoResponse>.Failure(new NoRecordsError(Compartilhado.MedicoesProjeto.MedicoesProjetoIdNaoEncontrado));

                //Obtém o contrato associado a medição
                var _contrato = await this._contratosRepository.BuscarPorIdAsync(_medicaoProjeto.IdContrato, cancellationToken);

                if (_contrato == null)
                    return Result<RegistrarDocumentosMedicaoResponse>.Failure(new NoRecordsError(Compartilhado.Contratos.IdContratoNaoEncontrado));

                //Obtém o usuário logado
                var _usuarioLogado = await this.GetUsuarioLogado(cancellationToken);

                //Verifica se o contrato informado pertence a mesma prefeitura do usuário logado
                if (_usuarioLogado.PrefeituraId != null && _contrato.PrefeituraId != _usuarioLogado.PrefeituraId)
                    return Result<RegistrarDocumentosMedicaoResponse>.Failure(new AcessoInvalidoUsuarioError(Compartilhado.Contratos.ContratoNaoPertenceAMesmaPrefeituraDoUsuarioLogado));

                var _listaIds = new List<IdDocumentoRegistradoResponse>();

                try
                {
                    //Verifica se foram informados arquivos no momento da aprovação
                    if (requisicao.Arquivos != null)
                    {
                        foreach (var _arquivo in requisicao.Arquivos)
                        {
                            //Faz primeiro o upload do logo da empresa.
                            var _upload = await _s3Service.UploadLogoAsync(_arquivo);

                            //Registra no banco de dados que o arquivo foi feito o download junto com a medição que está sendo aprovada.
                            var _arquivoMedicaoProjeto = new ArquivosMedicoesProjetoEntidade(requisicao.IdMedicoesProjeto, _upload)
                            {
                                IdOrigemArquivo = (int)OrigemArquivoMedicaoProjeto.OAMedicaoProjeto
                            };

                            _arquivoMedicaoProjeto = await this._arquivosMedicoesProjetoRepository.InserirAsync(_arquivoMedicaoProjeto, cancellationToken);

                            _listaIds.Add(new IdDocumentoRegistradoResponse(_arquivoMedicaoProjeto.Id, _arquivoMedicaoProjeto.ArquivoMedicao)
                            {
                                 Arquivo = Path.GetFileName(_arquivoMedicaoProjeto.ArquivoMedicao)
                            });
                        }
                    }

                    var result = new RegistrarDocumentosMedicaoResponse(true, string.Empty)
                    {
                        Ids = _listaIds
                    };

                    return Result<RegistrarDocumentosMedicaoResponse>.Success(result);
                }
                catch (Exception Ex)
                {
                    throw Ex;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);

                return Result<RegistrarDocumentosMedicaoResponse>.Failure(new UnknownError(ex.Message));
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
                    return Result<TotalProcessamentoDosItemsMedicoesProjetoResponse>.Failure(new NoRecordsError(Compartilhado.Projetos.IdItemProjetoNaoEncontrado));

                if (_itemIdContrato.ValorComBdi.HasValue)
                {
                    //Já faz a apuração do total que foi apontado na medição
                    _resultado.ValorTotalMedido += (_itemIdContrato.ValorComBdi.Value * _item.Unidade);
                }
            }

            return (Result<TotalProcessamentoDosItemsMedicoesProjetoResponse>.Success(_resultado));
        }

        public async Task<Result<ResultadoRegistrarReprovacaoMedicaoResponse>> RegistrarReprovacao(
            RegistrarReprovacaoMedicaoRequest requisicao, CancellationToken cancellationToken)
        {
            try
            {
                //Busca a medição original
                var _medicaoProjeto = await this._medicoesProjetoRepository.BuscarPorIdAsync(requisicao.IdMedicoesProjeto, await this.GetUsuarioLogado(cancellationToken), cancellationToken);

                if (_medicaoProjeto == null)
                    return Result<ResultadoRegistrarReprovacaoMedicaoResponse>.Failure(new NoRecordsError(Compartilhado.MedicoesProjeto.MedicoesProjetoIdNaoEncontrado));

                //Verifica se a medição está no status de enviada
                if (_medicaoProjeto.IdStatusMedicao != (int)StatusMedicao.SMEnviada)
                    return Result<ResultadoRegistrarReprovacaoMedicaoResponse>.Failure(new MedicaoNaoPodeSerReprovadaError(Compartilhado.MedicoesProjeto.MedicaoNaoPodeSerReprovada));

                //Obtém o contrato associado a medição
                var _contrato = await this._contratosRepository.BuscarPorIdAsync(_medicaoProjeto.IdContrato, cancellationToken);

                if (_contrato == null)
                    return Result<ResultadoRegistrarReprovacaoMedicaoResponse>.Failure(new NoRecordsError(Compartilhado.Contratos.IdContratoNaoEncontrado));

                //Obtém o usuário logado
                var _usuarioLogado = await this.GetUsuarioLogado(cancellationToken);

                //Verifica se o contrato informado pertence a mesma prefeitura do usuário logado
                if (_contrato.PrefeituraId != _usuarioLogado.PrefeituraId)
                    return Result<ResultadoRegistrarReprovacaoMedicaoResponse>.Failure(new AcessoInvalidoUsuarioError(Compartilhado.Contratos.ContratoNaoPertenceAMesmaPrefeituraDoUsuarioLogado));

                //Atualizar o status da medição para reprovado
                _medicaoProjeto.IdStatusMedicao = (int)StatusMedicao.SMReprovada;
                _medicaoProjeto.Resumo = requisicao.Resumo;

                //Abre uma transação com o banco de dados
                await _unitOfWork.BeginTransaction();

                try
                {
                    /*Processa todos os items associados a medição para atualizar o valor total solicitado*/
                    var _totalItemsMedicao = ProcessarItemsMedicaoProjeto(_medicaoProjeto, cancellationToken);

                    _contrato.ValorTotalSolicitado -= _totalItemsMedicao.Data.ValorTotalMedido;

                    //Atualiza o contrato
                    await this._contratosRepository.AtualizarAsync(_contrato, cancellationToken);

                    //Atualizar a medição no banco de dados
                    _medicaoProjeto = await _medicoesProjetoRepository.AtualizarAsync(_medicaoProjeto, cancellationToken);

                    //Processa todos os items relacionados a medição
                    foreach (var _itemMedicao in _medicaoProjeto.Items)
                    {
                        //Localiza o item da medição no item do contrato
                        var _itemContrato = _contrato.Items.Where(i => i.IdItemContrato == _itemMedicao.IdItemContrato).FirstOrDefault();

                        if (_itemContrato != null)
                        {
                            _itemContrato.ValorTotalComBdi = _itemContrato.ValorComBdi * _itemContrato.Unidade;

                            //Atualizar o item do contrato
                            await this._itemsContratoRepository.AtualizarAsync(_itemContrato, cancellationToken);
                        }
                    }

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

                //Verifica se o projeto informado está associado ao contrato
                if (!_contrato.Projetos.Where(i => i.IdProjeto == requisicao.IdProjeto).Any())
                    return Result<CriarMedicoesProjetoResponse>.Failure(new ProjetoNaoAssociadoAContratoError(Compartilhado.Contratos.ProjetoNaoAssociadoContrato));

                //Verifica se o contrato não expirou
                if (_contrato.DataTerminoAtualizada < DateTime.Today)
                    return Result<CriarMedicoesProjetoResponse>.Failure(new ContratoExpirouError(Compartilhado.Contratos.ContratoExpirado));

                //Verifica se o projeto informado está ativo
                var _projeto = await this._projetoRepository.BuscarPorIdAsync(requisicao.IdProjeto.Value, cancellationToken);

                if (_projeto == null)
                    return Result<CriarMedicoesProjetoResponse>.Failure(new NoRecordsError(Compartilhado.Projetos.ProjetoIdNaoEncontrado));

                //Obtém o usuário logado
                var _usuarioLogado = await this.GetUsuarioLogado(cancellationToken);

                //Verifica se o contrato informado pertence a mesma prefeitura do usuário logado
                if (_usuarioLogado.PrefeituraId != null && _contrato.PrefeituraId != _usuarioLogado.PrefeituraId)
                    return Result<CriarMedicoesProjetoResponse>.Failure(new AcessoInvalidoUsuarioError(Compartilhado.Contratos.ContratoNaoPertenceAMesmaPrefeituraDoUsuarioLogado));

                //Busca a lista de medições atuais que estão no status de criada
                var _medicoesFilterCriada = new MedicoesProjetoFilter(requisicao.IdContrato, StatusMedicao.SMCriada)
                {
                    ItemsPorPagina = 100000,
                    Pagina = 1
                };

                var _listaMedicoesCriada = await this._medicoesProjetoRepository.BuscarTodosAsync(_medicoesFilterCriada, 
                    await this.GetUsuarioLogado(cancellationToken), cancellationToken);

                //Busca a lista de medições atuais que estão no status de enviada
                var _medicoesFilterEnviadas = new MedicoesProjetoFilter(requisicao.IdContrato, StatusMedicao.SMEnviada)
                {
                    ItemsPorPagina = 1000000,
                    Pagina = 1
                };

                var _listaMedicoesEnviadas = await this._medicoesProjetoRepository.BuscarTodosAsync(_medicoesFilterEnviadas, await this.GetUsuarioLogado(cancellationToken), cancellationToken);

                //Realiza o processamento dos items da requisição
                var _itemProcessamentoItems = await ProcessarItemsRequisicao(requisicao, _contrato, _listaMedicoesEnviadas, _listaMedicoesCriada, cancellationToken);

                if (_itemProcessamentoItems.Error != null)
                    return (Result<CriarMedicoesProjetoResponse>.Failure(_itemProcessamentoItems.Error));

                var _prefeituraId = 0;

                //Verifica se o usuário tem prefeitura
                if (_usuarioLogado.PrefeituraId.HasValue)
                    _prefeituraId = _usuarioLogado.PrefeituraId.Value;
                else
                {
                    //Verifica se o contrato tem prefeitura associada
                    if (_contrato.PrefeituraId.HasValue)
                        _prefeituraId = _contrato.PrefeituraId.Value;
                }

                var _emailPrefeitura = string.Empty;

                //Verifica se há número de prefeitura para a sessão corrente
                if (_prefeituraId != 0)
                {
                    var _prefeitura = await this._prefeituraRepository.BuscarPorIdAsync(_prefeituraId, cancellationToken);

                    if (_prefeitura != null)
                        _emailPrefeitura = _prefeitura.Email;
                }

                //Cria o objeto de medição a ser gravado no banco de dados
                var _medicaoProjeto = this.CriarMedicoesProjeto(requisicao, cancellationToken);


                try
                {
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
                    }
                    catch (Exception Ex)
                    {
                        //Desfaz a transação com o banco de dados
                        await _unitOfWork.Rollback();
                        throw Ex;
                    }

                    //Enviar o e-mail confirmando a criação
                    this.EnviarEmailAprovacaoMedicao(_emailPrefeitura);

                    var result = _mapper.Map<CriarMedicoesProjetoResponse>(_medicaoProjeto);

                    return Result<CriarMedicoesProjetoResponse>.Success(result);
                }
                catch (Exception Ex)
                {
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
                var _medicao = await this._medicoesProjetoRepository.BuscarPorIdAsync(requisicao.IdMedicoesProjeto, await this.GetUsuarioLogado(cancellationToken), cancellationToken);

                if (_medicao == null)
                    return Result<AtualizarMedicoesProjetoResponse>.Failure(new NoRecordsError(Compartilhado.MedicoesProjeto.MedicoesProjetoIdNaoEncontrado));

                //Verifica se a medição está no status de criada
                if (_medicao.IdStatusMedicao != (int)StatusMedicao.SMCriada)
                    return Result<AtualizarMedicoesProjetoResponse>.Failure(new MedicaoNaoPodeSerAlteradaError(Compartilhado.MedicoesProjeto.MedicaoNaoPodeSerAlterada));

                //Busca o contrato original
                var _contrato = await this._contratosRepository.BuscarPorIdAsync(requisicao.IdContrato, cancellationToken);

                if (_contrato == null)
                    return Result<AtualizarMedicoesProjetoResponse>.Failure(new NoRecordsError(Compartilhado.Contratos.IdContratoNaoEncontrado));

                //Verifica se o projeto informado está associado ao contrato
                if (!_contrato.Projetos.Where(i => i.IdProjeto == requisicao.IdProjeto).Any())
                    return Result<AtualizarMedicoesProjetoResponse>.Failure(new ProjetoNaoAssociadoAContratoError(Compartilhado.Contratos.ProjetoNaoAssociadoContrato));

                //Verifica se o contrato não expirou
                if (_contrato.DataTerminoAtualizada < DateTime.Today)
                    return Result<AtualizarMedicoesProjetoResponse>.Failure(new ContratoExpirouError(Compartilhado.Contratos.ContratoExpirado));

                //Verifica se o projeto informado está ativo
                var _projeto = await this._projetoRepository.BuscarPorIdAsync(requisicao.IdProjeto.Value, cancellationToken);

                if (_projeto == null)
                    return Result<AtualizarMedicoesProjetoResponse>.Failure(new NoRecordsError(Compartilhado.Projetos.ProjetoIdNaoEncontrado));

                //Obtém o usuário logado
                var _usuarioLogado = await this.GetUsuarioLogado(cancellationToken);

                //Verifica se o contrato informado pertence a mesma prefeitura do usuário logado
                if (_usuarioLogado.PrefeituraId != null && _contrato.PrefeituraId != _usuarioLogado.PrefeituraId)
                    return Result<AtualizarMedicoesProjetoResponse>.Failure(new AcessoInvalidoUsuarioError(Compartilhado.Contratos.ContratoNaoPertenceAMesmaPrefeituraDoUsuarioLogado));

                //Busca a lista de medições atuais que estão no status de criada
                var _medicoesFilterCriada = new MedicoesProjetoFilter(requisicao.IdContrato, StatusMedicao.SMCriada, requisicao.IdMedicoesProjeto);
                var _listaMedicoesCriada = await this._medicoesProjetoRepository.BuscarTodosAsync(_medicoesFilterCriada, await this.GetUsuarioLogado(cancellationToken), cancellationToken);

                //Busca a lisat de medições atuais que estão no status de aprovada
                var _medicoesFilterAprovada = new MedicoesProjetoFilter(requisicao.IdContrato, StatusMedicao.SMAprovada);
                var _listaMedicoesAprovada = await this._medicoesProjetoRepository.BuscarTodosAsync(_medicoesFilterAprovada, await this.GetUsuarioLogado(cancellationToken), cancellationToken);

                //Realiza o processamento dos items da requisição
                var _itemProcessamentoItems = await ProcessarItemsRequisicao(requisicao, _contrato, _listaMedicoesAprovada, _listaMedicoesCriada, cancellationToken);

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

        private async Task<decimal> GetTotalUnidade(ContratosEntidade contrato, ItemMedicoesProjetoRequest item,
            CancellationToken cancellationToken)
        {
            //Localiza no contrato o iditemcontrato informado
            var _itemIdContrato = contrato.Items.Where(i => i.IdItemContrato == item.IdItemContrato).SingleOrDefault();

            //Armazena inicialmente o total da unidade associado ao item do contrato
            decimal _unidadeTotal = 0;

            if (_itemIdContrato.Unidade != null && _itemIdContrato.Unidade.HasValue)
                _unidadeTotal = _itemIdContrato.Unidade.Value;

            return (_unidadeTotal);
        }

        private async Task<Result<TotalProcessamentoDosItemsMedicoesProjetoResponse>> ProcessarItemsRequisicao(
            BaseMedicoesProjetoRequest requisicao, ContratosEntidade contrato, PaginatedEntity<MedicoesProjetoEntidade> listaMedicoesEnviadas,
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

                /*Soma os totais associados a medições criadas e enviadas*/
                _totalUnidade += SomarTotalUnidade(listaMedicoesCriada, listaMedicoesEnviadas, _item.IdItemContrato);

                /*Atualiza o total máximo do item do contrato que pode ser aceito. Será considerado o total do item mais
                 * o total de todos os aditivos que foram importados.*/
                var _totalUnidadeMaxima = await this.GetTotalUnidade(contrato, _item, cancellationToken);

                //Verifica se a quantidade informada extrapola o máximo aceito pelo item do projeto
                if ((_totalUnidade + _item.Unidade) > _totalUnidadeMaxima)
                {
                    decimal _totalMaximo = 0;

                    if (_itemIdContrato.Unidade.HasValue)
                        _totalMaximo = (_totalUnidadeMaxima - _totalUnidade);

                    /*Retorna para o usuário um erro informando a quantidade máxima que ele pode informar para o item de contrato*/
                    _resultado.Erro = new ValorUnidadeInformadoExcedeLimitePermitidoError(
                        CriarMensagemErroRegistroItemMedicao(_itemIdContrato.Item.Descricao, _totalMaximo));
                    return (Result<TotalProcessamentoDosItemsMedicoesProjetoResponse>.Failure(_resultado.Erro));
                }
                else
                {
                    if (_itemIdContrato.ValorComBdi.HasValue)
                    {
                        //Já faz a apuração do total que foi contabilizado
                        _resultado.ValorTotalMedido += _itemIdContrato.ValorComBdi.Value * _item.Unidade;
                    }
                }
            }

            return (Result<TotalProcessamentoDosItemsMedicoesProjetoResponse>.Success(_resultado));
        }

        private LogStatusMedicaoEntidade CriarLogStatusMedicaoEntidade(int idMedicaoProjeto, StatusMedicao status)
        {
            var _userId = _applicationUser.UserId;

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

        private async Task<UsuariosEntidade?> GetUsuarioLogado(CancellationToken cancellationToken)
        {
            var _userId = _applicationUser.UserId;
            var _usuario = await this._usuariosRepository.BuscarPorIdAsync(_userId, cancellationToken);

            return (_usuario);
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
                Items = new List<ItemsMedicoesProjetoEntidade>(),
                IdProjeto = request.IdProjeto,
                Observacao = request.Observacao,
                Secretaria = request.Secretaria
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
            medicoesProjeto.IdProjeto = request.IdProjeto;
            medicoesProjeto.Observacao = request.Observacao;
            medicoesProjeto.Secretaria = request.Secretaria;

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

            /*Soma na lista de medições aprovadas a quantidade que já foi aprovada para este item de contrato*/
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
            {
                var _itemLocal = item.Items.Where(i => i.IdItemContrato == idItemContrato);

                if (_itemLocal != null)
                    _unidadeSomada += _itemLocal.Sum(i => i.Unidade);
            }

            return (_unidadeSomada);
        }

        public async Task<Result<MedicoesProjetoResponse>> BuscarUltimaMedicaoPorContratoIdAsync(int idContrato, CancellationToken cancellationToken)
        {
            var _ultimaMedicao = await _medicoesProjetoRepository.BuscarUltimaMedicaoPorContratoIdAsync(idContrato, await this.GetUsuarioLogado(cancellationToken), cancellationToken);

            if (_ultimaMedicao is null)
                return Result<MedicoesProjetoResponse>.Failure(new NoRecordsError(Compartilhado.MedicoesProjeto.NaoFoiEncontradaNenhumaMedicao));

            _ultimaMedicao.ArquivosMedicoesProjeto = _ultimaMedicao.ArquivosMedicoesProjeto.Where(i => i.DataDelecao == null).ToList();

            var result = _mapper.Map<MedicoesProjetoResponse>(_ultimaMedicao);
            return Result<MedicoesProjetoResponse>.Success(result);
        }

        public async Task<Result<ResultadoRegistrarEnvioMedicaoClienteResponse>> RegistrarEnvioMedicaoClienteAsync(
            RegistrarEnvioMedicaoClienteRequest requisicao, CancellationToken cancellationToken)
        {
            try
            {
                //Busca a medição original
                var _medicaoProjeto = await this._medicoesProjetoRepository.BuscarPorIdAsync(requisicao.IdMedicoesProjeto, await this.GetUsuarioLogado(cancellationToken), cancellationToken);

                if (_medicaoProjeto == null)
                    return Result<ResultadoRegistrarEnvioMedicaoClienteResponse>.Failure(new NoRecordsError(Compartilhado.MedicoesProjeto.MedicoesProjetoIdNaoEncontrado));

                //Verifica se a medição está no status de criada
                if (_medicaoProjeto.IdStatusMedicao != (int)StatusMedicao.SMCriada)
                    return Result<ResultadoRegistrarEnvioMedicaoClienteResponse>.Failure(new MedicaoNaoPodeSerEnviadaClienteError(Compartilhado.MedicoesProjeto.MedicaoNaoPodeSerEnviadaAoCliente));

                //Obtém o contrato associado a medição
                var _contrato = await this._contratosRepository.BuscarPorIdAsync(_medicaoProjeto.IdContrato, cancellationToken);

                if (_contrato == null)
                    return Result<ResultadoRegistrarEnvioMedicaoClienteResponse>.Failure(new NoRecordsError(Compartilhado.Contratos.IdContratoNaoEncontrado));

                //Obtém o usuário logado
                var _usuarioLogado = await this.GetUsuarioLogado(cancellationToken);

                //Verifica se o contrato informado pertence a mesma prefeitura do usuário logado
                if (_usuarioLogado.PrefeituraId != null && _contrato.PrefeituraId != _usuarioLogado.PrefeituraId)
                    return Result<ResultadoRegistrarEnvioMedicaoClienteResponse>.Failure(new AcessoInvalidoUsuarioError(Compartilhado.Contratos.ContratoNaoPertenceAMesmaPrefeituraDoUsuarioLogado));

                //Atualizar o status da medição para enviado para o cliente
                _medicaoProjeto.IdStatusMedicao = (int)StatusMedicao.SMEnviada;

                //Abre uma transação com o banco de dados
                await _unitOfWork.BeginTransaction();

                try
                {
                    //Percorre todos os items da medição que foram enviados ao cliente
                    decimal _totalItemsMedicao = 0;

                    foreach (var _itemsMedicao in _medicaoProjeto.Items)
                    {
                        if (_itemsMedicao.ItemsContrato.ValorComBdi.HasValue)
                        {
                            //Calcula o valor do item que foi medido
                            var _valorItemMedido = (_itemsMedicao.ItemsContrato.ValorComBdi.Value * _itemsMedicao.Unidade);

                            //Totaliza o valor do item que foi medido
                            _totalItemsMedicao += _valorItemMedido;
                        }
                    }

                    //Atualiza no contrato o valor total que foi solicitado
                    _contrato.ValorTotalSolicitado += _totalItemsMedicao;

                    //Atualiza o contrato no banco de dados
                    await this._contratosRepository.AtualizarAsync(_contrato, cancellationToken);

                    //Atualizar a medição no banco de dados
                    _medicaoProjeto = await _medicoesProjetoRepository.AtualizarAsync(_medicaoProjeto, cancellationToken);

                    //Insere o registro de log para mudança de status da medição
                    await this.InserirLogStatusMedicao(_medicaoProjeto.IdMedicoesProjeto, StatusMedicao.SMReprovada, cancellationToken);

                    //Confirma as operações no banco de dados
                    await _unitOfWork.Commit();

                    var result = new ResultadoRegistrarEnvioMedicaoClienteResponse(true, string.Empty);

                    return Result<ResultadoRegistrarEnvioMedicaoClienteResponse>.Success(result);
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

                return Result<ResultadoRegistrarEnvioMedicaoClienteResponse>.Failure(new UnknownError(ex.Message));
            }
        }

        public async Task<Result<DeletarMedicaoResponse>> DeletarAsync(int id, CancellationToken cancellationToken)
        {
            try
            {
                //Obtém o usuário logado 
                var _usuarioLogado = await this.GetUsuarioLogado(cancellationToken);
                var _medicaoFound = await _medicoesProjetoRepository.BuscarPorIdAsync(id, _usuarioLogado, cancellationToken);

                if (_medicaoFound is null)
                    return Result<DeletarMedicaoResponse>.Failure(new NoRecordsError(Compartilhado.MedicoesProjeto.MedicoesProjetoIdNaoEncontrado));

                //Verifica se a medição já está no status de enviada
                if (_medicaoFound.StatusMedicao.IdStatusMedicao == (int)StatusMedicao.SMEnviada)
                    return Result<DeletarMedicaoResponse>.Failure(new MedicaoEnviadaNaoPodeSerExcluidaError(Compartilhado.MedicoesProjeto.MedicaoEnviadaNaoPodeSerExcluida));

                //Verifica se a medição já está no status de aprovada
                if (_medicaoFound.StatusMedicao.IdStatusMedicao == (int)StatusMedicao.SMAprovada)
                    return Result<DeletarMedicaoResponse>.Failure(new MedicaoAprovadaNaoPodeSerExcluidaError(Compartilhado.MedicoesProjeto.MedicaoAprovadaNaoPodeSerExcluida));

                //Verifica se a medição já está no status de reprovada
                if (_medicaoFound.StatusMedicao.IdStatusMedicao == (int)StatusMedicao.SMReprovada)
                    return Result<DeletarMedicaoResponse>.Failure(new MedicaoReprovadaNaoPodeSerExcluidaError(Compartilhado.MedicoesProjeto.MedicaoReprovadaNaoPodeSerExcluida));

                //Realiza a exclusão da medição

                _medicaoFound.Delete();
                await _medicoesProjetoRepository.DeletarAsync(_medicaoFound, cancellationToken);

                var result = new DeletarMedicaoResponse { Mensagem = Compartilhado.MedicoesProjeto.MedicaoProjetoIdExcluida };

                return Result<DeletarMedicaoResponse>.Success(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);

                return Result<DeletarMedicaoResponse>.Failure(new UnknownError(ex.Message));
            }
        }
    }
}