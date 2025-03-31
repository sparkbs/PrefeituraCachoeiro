import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { BoletimDetalhadoModel } from 'src/app/modelsBoletim/boletim-models/boletim-detalhado';
import { BoletimBase } from 'src/app/modelsBoletim/boletim-models/boletim-base.model';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { MedicoesService } from 'src/app/services/medicoes.service';
import { ContratosService } from 'src/app/services/contratos.service';
import { BuscarContratosRequest } from 'src/app/request/ContratoRequest/buscarContratosRequest';
import { ToastService } from 'src/app/services/toast.service';
import { ContratosResponse } from 'src/app/response/contratosResponse/todosContratosResponse';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MedicoesRequest } from 'src/app/request/MedicoesRequest/medicoesRequest';
import { BoletimMedicoesResponse, MedicoesResponse } from 'src/app/response/medicoesResponse/medicoesResponse';
import { PrefeituraService } from 'src/app/services/prefeitura.service';
import { BoletimDetalhadoResponse, BoletimProjetoCabecalho, BoletimResponse, SubBoletim } from 'src/app/response/BoletimResponse/boletimResponse';
import { BoletimService } from 'src/app/services/boletim.service';
import { BuscarBoletimDetalhadoRequest } from 'src/app/request/BoletimRequest/boletimDetalhadoRequest';
import { ProjetoResponse } from 'src/app/response/projetoResponse/projetoResponse';
import { ActivatedRoute } from '@angular/router';
import { PrefeituraFilter, PrefeituraResponse } from 'src/app/response/prefeituraResponse/prefeituraResponse';
import { AuthService } from 'src/app/services/auth.service';
import { AESEncryptDecriptService } from 'src/app/shared/aesEncryptDecript.service';

@Component({
  selector: 'app-boletim-detalhado',
  templateUrl: './boletim-detalhado.component.html',
  styleUrls: ['./boletim-detalhado.component.scss']
})
export class BoletimDetalhadoComponent implements OnInit {

  @ViewChild('content', { static: false }) element!: ElementRef;

  // Dados para armazenar o boletim retornado do backend
  dataSource: SubBoletim[] = [];
  boletimCabecalho: BoletimProjetoCabecalho;
  logoTipoImgUrl: string = ''; // URL tratada da imagem do logotipo
  nomeUnidade!: string | undefined;
  valorTotalMedicao!: number;
  listaContratos: ContratosResponse[] = [];
  listaMedicoes: MedicoesResponse[] = [];
  form: FormGroup;
  contratoSelecionado: ContratosResponse;
  boletim: BoletimDetalhadoResponse;
  contratoSelecionadoPesquisa: number;
  prefeituraSelecionadoPesquisa: number;
  nomePrefeitura: string = ''; // URL tratada da imagem do logotipo
  listaMedicoesAgrupados: BoletimMedicoesResponse[] =[];
  listaMedicoesSelecionadasAgrupados: BoletimMedicoesResponse;
  dadosSeparadosProjeto: SubBoletim[] =[];
  listaPrefeitura: PrefeituraResponse[] = [];
  projetosNome?: string = '';

  // Variável para gerenciar estado de carregamento e erros
  isLoading = false;
  errorMessage = '';
  contratoId = '0';
  clienteId = '0';
  medicaoId = '0';
  medicaoSelecionado: number;
  enableMedicao: boolean = false;
  enableContrato: boolean = false;
  isEnabledInputs: boolean = false;

  constructor(
    private _medicaoControllerService: MedicoesService,
    private _contratoControllerService: ContratosService,
    private fb: FormBuilder,
    private _toastService: ToastService,
    public _boletimControllerService: BoletimService,
    private _prefeituraControllerService: PrefeituraService,
    private route: ActivatedRoute,
    private auth: AuthService,
    private readonly aesEncryptDecript: AESEncryptDecriptService
  ) {}

  async ngOnInit() {
    this.isLoading = true;

    this.route.paramMap.subscribe(params => {
      this.clienteId = params.get('clienteId')!;
      this.contratoId = params.get('contratoId')!;
      this.medicaoId = params.get('medicaoId')!;
    });


    var idPrefeituraUser = this.auth.getCookie("_idPrefeitura");

    if(idPrefeituraUser){
      idPrefeituraUser = this.aesEncryptDecript.decrypt(idPrefeituraUser);
      if(idPrefeituraUser){
        await this.buscarPrefeitura(Number(idPrefeituraUser));
      }
      else{
        await this.buscarPrefeituras();
      }
    }else{
      await this.buscarPrefeituras();
    }

    //await this.buscarListaContratos();
    await this.onSelectionClienteChange(Number(this.clienteId));

    await this.onSelectionChange(Number(this.contratoId));

    if(this.contratoId != '0' && this.medicaoId != '0'){
      this.prefeituraSelecionadoPesquisa = Number(this.clienteId);
      this.contratoSelecionadoPesquisa = Number(this.contratoId);
      this.medicaoSelecionado = Number(this.medicaoId);
      this.isEnabledInputs = true;
    }
    this.enableMedicao = false;
    this.enableContrato = false;
    //this.createForm(Number(this.contratoId),Number(this.medicaoId));
    this.isLoading = false;
  }

  async buscarPrefeitura(id: number){
    await this._prefeituraControllerService.BuscarPrefeitura(id)
    .then((result) => {
      this.listaPrefeitura = [];
      this.listaPrefeitura.push(result);
    })
    .catch(() => {
      this._toastService.mensagemError("Erro ao buscar prefeitura!");
    });
  }

  async buscarPrefeituras() {
    var prefeituraRequest : PrefeituraFilter = new PrefeituraFilter();

    prefeituraRequest.itemsPorPagina = 1000000;
    prefeituraRequest.pagina = 1
    prefeituraRequest.nome = "";

    await this._prefeituraControllerService.BuscarTodasPrefeituras(prefeituraRequest)
    .then((result) => {
      this.listaPrefeitura = result.data;
    })
    .catch(() => {
      this._toastService.mensagemError("Erro ao buscar prefeitura!");
    });
  }

  createForm(contratoId: number, medicaoId:number){

    this.form = this.fb.group({
      contratoId: [{ value: contratoId}, Validators.required],
      medicaoId: [{ value: medicaoId, disabled: true }, Validators.required]
    });
    this.form.get('contratoId')?.setValue(contratoId);
    this.form.get('medicaoId')?.setValue(medicaoId);
  }

  async buscarListaContratos() {
    var contratosFilter : BuscarContratosRequest = new BuscarContratosRequest();
        contratosFilter.itemsPorPagina = 1000000;
        contratosFilter.IdProjeto = null;
        contratosFilter.pagina = 1;

    await this._contratoControllerService.BuscarTodosContratos(contratosFilter)
    .then((res) => {
      this.listaContratos = res.data;
    })
    .catch((erro) => {
      console.error(erro);
      this._toastService.mensagemError('Erro ao buscar medições!');
    });
  }

  async buscarMedicoes(contratoId: number) {
    var medicoesRequest : MedicoesRequest = new MedicoesRequest();
    medicoesRequest.idContrato = contratoId;
    medicoesRequest.itemsPorPagina = 1000000;
    medicoesRequest.pagina = 1;

    await this._medicaoControllerService.BuscarTodasMedicoes(medicoesRequest)
    .then((res) => {
      this.listaMedicoes = res.data;

      this.groupMedicoes();
    })
    .catch((erro) => {
      this.isLoading = false;
      console.error(erro);
      this._toastService.mensagemError('Erro ao buscar medições!');
    });
  }


  groupMedicoes() {
    const grouped = this.listaMedicoes.reduce((acc, current) => {
      const numeroMedicao = current.numeroMedicao;

      // Se ainda não existir um grupo para esse numeroMedicao, cria um novo
      if (!acc[numeroMedicao]) {
        acc[numeroMedicao] = {
          numeroMedicao: numeroMedicao,
          medicaoResponse: []
        };
      }

      // Adiciona o MedicoesResponse ao grupo correspondente
      acc[numeroMedicao].medicaoResponse.push(current);
      return acc;
    }, {});

    // Agora, agrupamos os dados em um array de BoletimMedicoesResponse
    this.listaMedicoesAgrupados = Object.values(grouped);

  }

  async onSelectionChange(contratoId: number) {
    //this.form.get('medicaoId').enable();
    this.enableMedicao = true;
    this.contratoSelecionado = this.listaContratos.find(res => res.idContrato == contratoId);
    if(contratoId != undefined && contratoId != null && contratoId != 0)
      await this.buscarMedicoes(contratoId);
  }

  async onSelectionChangeMedicao(medicaoId: number) {
    this.projetosNome = "";
    await this.carregarBoletinsMedicao(medicaoId);
  }

  // Método para carregar os dados do boletim de medição
  async carregarBoletinsMedicao(medicaoId: number) {
    // this.boletimService.getBoletinsMedicao().subscribe({
    //   next: (dados) => {
    //     if (dados) {
    //       this.boletimCabecalho = dados.boletimMedicaoCabecalho;

    //       // Verificar o tipo do campo logoTipoImg
    //       const logoTipoImg = this.boletimCabecalho?.logoTipoImg;

    //       if (logoTipoImg instanceof File) {
    //         // Se for um arquivo, converte para URL acessível
    //         this.logoTipoImgUrl = URL.createObjectURL(logoTipoImg);
    //       } else if (typeof logoTipoImg === 'string') {
    //         // Se for uma string, usa diretamente
    //         this.logoTipoImgUrl = logoTipoImg;
    //       }

    //       this.nomeUnidade = this.boletimCabecalho?.nomeUnidade;
    //       this.valorTotalMedicao = dados.valorTotalMedicao;
    //       this.dataSource = dados.subBoletins;
    //     }
    //     this.isLoading = false;
    //   },
    //   error: (erro) => {
    //     const message = 'Erro ao carregar os dados do boletim: '
    //     console.error(message, erro);
    //     this.isLoading = false;
    //   }
    // });
    this.dadosSeparadosProjeto = [];
    this.listaMedicoesSelecionadasAgrupados = this.listaMedicoesAgrupados.filter(x => x.numeroMedicao == this.medicaoSelecionado)[0];

    this.listaMedicoesSelecionadasAgrupados.medicaoResponse.forEach(async element => {
      var boletimDetalhadoRequest: BuscarBoletimDetalhadoRequest = {
        idMedicao: element.idMedicoesProjeto
      }

      await this._boletimControllerService.BuscarBoletimDetalhado(boletimDetalhadoRequest)
      .then(async (dados) => {
        if (dados.detalhes.length != 0) {
          this.boletim = dados;
          this.boletimCabecalho = dados.boletimMedicaoCabecalho;

          // Verificar o tipo do campo logoTipoImg
          await this.RetornarLogoCliente(this.contratoSelecionado.prefeituraId);

          /*if (logoTipoImg instanceof File) {
            // Se for um arquivo, converte para URL acessível
            this.logoTipoImgUrl = URL.createObjectURL(logoTipoImg);
          } else if (typeof logoTipoImg === 'string') {
            // Se for uma string, usa diretamente
            this.logoTipoImgUrl = logoTipoImg;
          }*/
          dados.detalhes[0].subBoletins = (dados.detalhes[0].subBoletins.filter(x => parseFloat(x.unidade) != 0));
          this.dataSource = dados.detalhes.length == 0 ? [] : dados.detalhes[0].subBoletins;
          debugger
          var projeto = new SubBoletim();
          projeto.descricao = dados.detalhes[0].projeto;
          projeto.precoComBdi = 0.0;
          projeto.valorTotal = 0.0;

          dados.detalhes[0].subBoletins.forEach(subBoletim => {
            var quantidadeItem = parseFloat(subBoletim.unidade);
            projeto.precoComBdi += subBoletim.precoComBdi;
            projeto.valorTotal += (subBoletim.precoComBdi * quantidadeItem);
          });

          this.projetosNome += this.projetosNome == '' ? projeto.descricao :', '+projeto.descricao;
          this.dataSource.unshift(projeto);

          this.dadosSeparadosProjeto = this.dadosSeparadosProjeto.concat(this.dataSource);
          console.log(this.dadosSeparadosProjeto);

          this.nomeUnidade = this.boletimCabecalho?.nomeUnidade || '';
          this.valorTotalMedicao = dados.valorTotalMedicao || 0;
        }
        else {
          this._toastService.messageWarning('Sem medição para apresentar!');
        }
      })
      .catch((erro) => {
        console.error(erro);
        this._toastService.mensagemError('Erro ao buscar boletins!');
      });

    });
  }

  async RetornarLogoCliente(clienteId: number): Promise<void> {
    await this._prefeituraControllerService.BuscarPrefeitura(clienteId)
    .then((res) => {
      if (res) {
        this.logoTipoImgUrl = res.logo;
        this.nomePrefeitura = res.nome;
      }
    })
    .catch((erro) => {
      console.error(erro);
      this._toastService.mensagemError('Erro ao buscar logo cliente!');
    });
  }

  calcularValorTotalItemBoletim(unidade: string, precoComBdi: number, valorTotal: number){
    if (!unidade) {
      return valorTotal.toFixed(2);
    }
    var quantidadeItem = parseFloat(unidade);
    return (precoComBdi * quantidadeItem).toFixed(2);
  }

  calcularSomaValorTotal(){
    let valorSaldoSomado = 0;
    this.dadosSeparadosProjeto.forEach( x => {
      if(x.precoComBdi && x.unidade){
        var quantidadeItem = parseFloat(x.unidade);
        valorSaldoSomado += quantidadeItem * x.precoComBdi;
      }
    })

    return valorSaldoSomado.toFixed(2);
  }

  //Método para gerar o PDF
  async generatePDF() {
    const pdf = new jsPDF('landscape', 'pt', 'a4');
    pdf.html(this.element.nativeElement, {
      callback: (doc) => {
        doc.save(`boletim-medicao.pdf`);
      },
      x: 15,
      y: 13,
      html2canvas: {
        scale: 0.55,
        useCORS: true,
        logging: true,
        letterRendering: true
      }
    });
  }

  async onSelectionClienteChange(prefeituraId: number) {
    this.enableContrato = true;
    await this.buscarListaContratosPrefeituraId(prefeituraId);
  }

  async buscarListaContratosPrefeituraId(prefeituraId: number){
    var contratosFilter : BuscarContratosRequest = new BuscarContratosRequest();
    contratosFilter.itemsPorPagina = 1000000;
    contratosFilter.IdProjeto = null;
    contratosFilter.pagina = 1;
    await this._contratoControllerService.BuscarTodosContratos(contratosFilter)
    .then((result) => {
      this.listaContratos = result.data.filter(x => x.prefeituraId == prefeituraId);
    })
    .catch(() =>{
      this.isLoading = false;
    });
  }

}
