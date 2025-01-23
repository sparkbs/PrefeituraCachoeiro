import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BoletimProjetoModel } from 'src/app/modelsBoletim/boletim-models/boletim-projeto.model';
import { BoletimBase } from 'src/app/modelsBoletim/boletim-models/boletim-base.model';
import { ProjetoBaseModel } from 'src/app/modelsBoletim/projeto-models/projeto-base.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { jsPDF } from 'jspdf';
import { ProjetoRequest } from 'src/app/request/ProjetoRequest/projetoRequest';
import { ToastService } from 'src/app/services/toast.service';
import { MedicoesResponse } from 'src/app/response/medicoesResponse/medicoesResponse';
import { MedicoesService } from 'src/app/services/medicoes.service';
import { MedicoesRequest } from 'src/app/request/MedicoesRequest/medicoesRequest';
import { ProjetoResponse } from 'src/app/response/projetoResponse/projetoResponse';
import { ProjetoService } from 'src/app/services/projeto.service';
import { BoletimService } from 'src/app/services/boletim.service';
import { BuscarBoletimProjetoRequest } from 'src/app/request/BoletimRequest/boletimProjetoRequest';
import { BoletimProjetoCabecalho, BoletimResponse, SubBoletim } from 'src/app/response/BoletimResponse/boletimResponse';
import { PrefeituraService } from 'src/app/services/prefeitura.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-boletim-projeto',
  templateUrl: './boletim-projeto.component.html',
  styleUrls: ['./boletim-projeto.component.scss']
})
export class BoletimProjetoComponent implements OnInit {

  @ViewChild('content', { static: false }) element!: ElementRef;

  boletimCabecalho: BoletimProjetoCabecalho;
  boletim: BoletimResponse;
  logoTipoImgUrl: string = ''; // URL tratada da imagem do logotipo
  dataSource: SubBoletim[] = [];
  nomeUnidade: string = '';
  valorTotalMedicao: number = 0;
  listaProjetos: ProjetoResponse[] = [];
  listaMedicoes: MedicoesResponse[] = [];
  projetoSelecionado: ProjetoResponse;

  projetos: ProjetoBaseModel[] = [];
  projetoItemSelecionado: ProjetoBaseModel = new ProjetoBaseModel();

  form: FormGroup;

  // Variável para gerenciar estado de carregamento e erros
  isLoading = true;
  errorMessage = '';
  parametro1 = '';
  parametro2 = '';

  constructor(
    public _projetoControllerService: ProjetoService,
    private _toastService: ToastService,
    private readonly apiMedicoes: MedicoesService,
    private fb: FormBuilder,
    public _boletimControllerService: BoletimService,
    private _prefeituraControllerService: PrefeituraService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.parametro1 = params.get('contratoId')!;
      this.parametro2 = params.get('projetoId')!;
    });
    console.log(this.parametro1);
    console.log(this.parametro2);
    
    this.createForm();
    this.buscarProjetos();
  }

  createForm(){
    this.form = this.fb.group({
      projetoId: [{ value: 0}, Validators.required],
      medicaoId: [{ value: 0, disabled: true }, Validators.required]
    });
  }

  async buscarProjetos() {
    const projetoRequest: ProjetoRequest = {
          nome: '',
          pagina: 1,
          itemsPorPagina: 10000
    };

    await this._projetoControllerService.BuscarTodosProjetos(projetoRequest)
    .then((res) => {
      this.listaProjetos = res.data;
    })
    .catch((erro) => {
      console.error(erro);
      this._toastService.mensagemError('Erro ao buscar projetos!');
    });
  }

  async onSelectionChange(projetoId: number){
    this.form.get('medicaoId').enable();
    this.projetoSelecionado = this.listaProjetos.find(res => res.idProjeto == projetoId);

    await this.buscarMedicoes(this.projetoSelecionado.contratos[0].idContrato);
  }

  async buscarMedicoes(contratoId: number) {
    var medicoesRequest : MedicoesRequest = new MedicoesRequest();
    medicoesRequest.idContrato = contratoId;
    medicoesRequest.itemsPorPagina = 1000000;
    medicoesRequest.pagina = 1;

    await this.apiMedicoes.BuscarTodasMedicoes(medicoesRequest)
    .then((res) => {
      this.listaMedicoes = res.data;

      if (this.listaMedicoes.length == 0) {
        this.form.get('medicaoId').disable();
        this._toastService.mensagemError('Lista de medições vazia!');
      }
    })
    .catch((erro) => {
      console.error(erro);
      this._toastService.mensagemError('Erro ao buscar medições!');
    });
  }

  async onSelectionChangeMedicao(medicaoId: number) {
    await this.buscarBoletinsPorProjetoId(this.projetoSelecionado.idProjeto, medicaoId);
  }

  // Método para filtrar dados (simulado por enquanto)
  private async buscarBoletinsPorProjetoId(projetoId: number, medicaoId: number) {
    /*this.boletimService.getBoletinsPorProjetoId(projetoId).subscribe({
      next: dados => {
        if (dados) {
          this.boletimCabecalho = dados.boletimProjetoCabecalho;


          // Verificar o tipo do campo logoTipoImg
          const logoTipoImg = this.boletimCabecalho?.logoTipoImg;

          if (logoTipoImg instanceof File) {
            // Se for um arquivo, converte para URL acessível
            this.logoTipoImgUrl = URL.createObjectURL(logoTipoImg);
          } else if (typeof logoTipoImg === 'string') {
            // Se for uma string, usa diretamente
            this.logoTipoImgUrl = logoTipoImg;
          }

          this.dataSource = dados.subBoletins || [];
          this.nomeUnidade = this.boletimCabecalho?.nomeUnidade || '';
          this.valorTotalMedicao = dados.valorTotalMedicao || 0;
        }
      },
      error: err => {
        const message = "Falha ao buscar os Boletins pelo Id do Projeto Selecionado! ";
        console.log(message, err);
      }
    });*/
    var boletimProjetoRequest: BuscarBoletimProjetoRequest = {
      idProjeto: projetoId,
      idMedicao: medicaoId
    }

    this._boletimControllerService.BuscarBoletimProjeto(boletimProjetoRequest)
    .then(async (dados) => {
      if (dados.detalhes.length != 0) {
        this.boletim = dados;
        this.boletimCabecalho = dados.boletimProjetoCabecalho;

        // Verificar o tipo do campo logoTipoImg
        await this.RetornarLogoCliente(this.projetoSelecionado.contratos[0].contratos.prefeituraId);

        /*if (logoTipoImg instanceof File) {
          // Se for um arquivo, converte para URL acessível
          this.logoTipoImgUrl = URL.createObjectURL(logoTipoImg);
        } else if (typeof logoTipoImg === 'string') {
          // Se for uma string, usa diretamente
          this.logoTipoImgUrl = logoTipoImg;
        }*/
        this.dataSource = dados.detalhes.length == 0 ? [] : dados.detalhes[0].subBoletins;
        this.nomeUnidade = this.boletimCabecalho?.nomeUnidade || '';
        this.valorTotalMedicao = dados.valorTotalMedicao || 0;
      }
      else {
        this._toastService.messageWarning('Sem medição para apresentar!');
      }
    })
    .catch((erro) => {
      console.error(erro);
      this._toastService.mensagemError('Erro ao buscar medições!');
    });
  }

  async RetornarLogoCliente(clienteId: number): Promise<void> {
    await this._prefeituraControllerService.BuscarPrefeitura(clienteId)
    .then((res) => {
      if (res) {
        this.logoTipoImgUrl = res.logo;
      }
    })
    .catch((erro) => {
      console.error(erro);
      this._toastService.mensagemError('Erro ao buscar logo cliente!');
    });
  }

  // Método para gerar PDF
  async generatePDF() {
    const pdf = new jsPDF('landscape', 'pt', 'a4');
    pdf.html(this.element.nativeElement, {
      callback: (doc) => {
        doc.save(`boletim-${this.projetoItemSelecionado.name}.pdf`);
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
