import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { BoletimMedicaoModel } from 'src/app/modelsBoletim/boletim-models/boletim-medicao.model';
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
import { BoletimMedicaoResponse, BoletimProjetoCabecalho, BoletimResponse, SubBoletim } from 'src/app/response/BoletimResponse/boletimResponse';
import { BoletimService } from 'src/app/services/boletim.service';
import { BuscarBoletimMedicaoRequest } from 'src/app/request/BoletimRequest/boletimMedicaoRequest';
import { ProjetoResponse } from 'src/app/response/projetoResponse/projetoResponse';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-boletim-medicao',
  templateUrl: './boletim-medicao.component.html',
  styleUrls: ['./boletim-medicao.component.scss']
})
export class BoletimMedicaoComponent implements OnInit {

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
  boletim: BoletimMedicaoResponse;
  contratoSelecionadoPesquisa: number;
  nomePrefeitura: string = ''; // URL tratada da imagem do logotipo
  listaMedicoesAgrupados: BoletimMedicoesResponse[] =[];
  listaMedicoesSelecionadasAgrupados: BoletimMedicoesResponse;
  dadosSeparadosProjeto: SubBoletim[] =[];

  // Variável para gerenciar estado de carregamento e erros
  isLoading = true;
  errorMessage = '';
  contratoId = '0';
  medicaoId = '0';
  medicaoSelecionado: number;
  enableMedicao: boolean = false;
  isEnabledInputs: boolean = false;

  constructor(
    private _medicaoControllerService: MedicoesService,
    private _contratoControllerService: ContratosService,
    private fb: FormBuilder,
    private _toastService: ToastService,
    public _boletimControllerService: BoletimService,
    private _prefeituraControllerService: PrefeituraService,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.contratoId = params.get('contratoId')!;
      this.medicaoId = params.get('medicaoId')!;
    });
    
    await this.buscarListaContratos();
    await this.onSelectionChange(Number(this.contratoId));

    if(this.contratoId != '0' && this.medicaoId != '0'){
      this.contratoSelecionadoPesquisa = Number(this.contratoId);
      this.medicaoSelecionado = Number(this.medicaoId);
      this.isEnabledInputs = true;
    }
    this.enableMedicao = false;
    //this.createForm(Number(this.contratoId),Number(this.medicaoId));

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

    console.log(this.listaMedicoesAgrupados);  // Exibindo a estrutura final
  }

  async onSelectionChange(contratoId: number) {
    //this.form.get('medicaoId').enable();
    this.enableMedicao = true;
    this.contratoSelecionado = this.listaContratos.find(res => res.idContrato == contratoId);
    console.log(contratoId);
    if(contratoId != undefined && contratoId != null && contratoId != 0)
      await this.buscarMedicoes(contratoId);
  }

  async onSelectionChangeMedicao(medicaoId: number) {
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
    console.log(this.listaMedicoesSelecionadasAgrupados);
    
    this.listaMedicoesSelecionadasAgrupados.medicaoResponse.forEach(async element => {    
      var boletimMedicaoRequest: BuscarBoletimMedicaoRequest = {
        idMedicao: element.idMedicoesProjeto
      }
      
      await this._boletimControllerService.BuscarBoletimMedicao(boletimMedicaoRequest)
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

          var projeto = new SubBoletim();
          projeto.descricao = dados.detalhes[0].projeto;
          console.log(projeto);
          this.dataSource.unshift(projeto);

          this.dadosSeparadosProjeto = this.dadosSeparadosProjeto.concat(this.dataSource);

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

      console.log(this.dadosSeparadosProjeto);
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

  calcularValorTotalItemBoletim(unidade: string, precoComBdi: number){
    var quantidadeItem = parseFloat(unidade);
    return precoComBdi * quantidadeItem;
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

}
