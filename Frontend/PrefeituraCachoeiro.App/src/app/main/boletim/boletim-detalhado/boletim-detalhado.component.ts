import { Component, OnInit } from '@angular/core';
import { ElementRef, ViewChild } from '@angular/core';
import { jsPDF } from 'jspdf';
import { BoletimDetalhadoModel } from 'src/app/modelsBoletim/boletim-models/boletim-detalhado.model';
import { BoletimMedicaoResponse, BoletimProjetoCabecalho, BoletimResponse, SubBoletim } from 'src/app/response/BoletimResponse/boletimResponse';
import { ContratosResponse } from 'src/app/response/contratosResponse/todosContratosResponse';
import { MedicoesResponse } from 'src/app/response/medicoesResponse/medicoesResponse';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MedicoesService } from 'src/app/services/medicoes.service';
import { ContratosService } from 'src/app/services/contratos.service';
import { PrefeituraService } from 'src/app/services/prefeitura.service';
import { ToastService } from 'src/app/services/toast.service';
import { BuscarBoletimMedicaoRequest } from 'src/app/request/BoletimRequest/boletimMedicaoRequest';
import { BoletimService } from 'src/app/services/boletim.service';
import { BuscarContratosRequest } from 'src/app/request/ContratoRequest/buscarContratosRequest';
import { MedicoesRequest } from 'src/app/request/MedicoesRequest/medicoesRequest';

@Component({
  selector: 'app-boletim-detalhado',
  templateUrl: './boletim-detalhado.component.html',
  styleUrls: ['./boletim-detalhado.component.scss']
})
export class BoletimDetalhadoComponent implements OnInit {

  @ViewChild('content', { static: false }) element!: ElementRef;

  dataSource: SubBoletim[] = [];
  boletimCabecalho: BoletimProjetoCabecalho;
  valorTotalMedicao: number = 0;
  nomeUnidade!: string | undefined;
  logoTipoImgUrl: string = '';
  listaContratos: ContratosResponse[] = [];
  listaMedicoes: MedicoesResponse[] = [];
  form: FormGroup;
  contratoSelecionado: ContratosResponse;
  boletim: BoletimMedicaoResponse;

  // Variáveis de controle de carregamento e erros
  isLoading = true;
  errorMessage = '';

  constructor(
    private _medicaoControllerService: MedicoesService,
    private _contratoControllerService: ContratosService,
    private fb: FormBuilder,
    private _toastService: ToastService,
    public _boletimControllerService: BoletimService,
    private _prefeituraControllerService: PrefeituraService
  ) {}

  ngOnInit() {
    this.createForm();
    this.buscarListaContratos();
  }

  createForm(){
        this.form = this.fb.group({
          contratoId: [{ value: 0}, Validators.required],
          medicaoId: [{ value: 0, disabled: true }, Validators.required]
        });
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
      })
      .catch((erro) => {
        console.error(erro);
        this._toastService.mensagemError('Erro ao buscar medições!');
      });
  }

  async onSelectionChange(contratoId: number) {
    this.form.get('medicaoId').enable();
    this.contratoSelecionado = this.listaContratos.find(res => res.idContrato == contratoId);
    await this.buscarMedicoes(contratoId);
  }

  async onSelectionChangeMedicao(medicaoId: number) {
    this.carregarBoletinsDetalhados(medicaoId);
  }

  carregarBoletinsDetalhados(medicaoId: number): void {
    var boletimMedicaoRequest: BuscarBoletimMedicaoRequest = {
          idMedicao: medicaoId
        }

        this._boletimControllerService.BuscarBoletimMedicao(boletimMedicaoRequest)
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
          this._toastService.mensagemError('Erro ao buscar boletins!');
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

  // Método para gerar o PDF
  async generatePDF() {
    const pdf = new jsPDF('landscape', 'pt', 'a4');
    pdf.html(this.element.nativeElement, {
      callback: (doc) => {
        doc.save('boletim-detalhado.pdf');
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
