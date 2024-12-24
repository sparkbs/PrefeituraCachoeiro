import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BoletimService } from 'src/app/services/boletins/boletim.service';
import { BoletimProjetoModel } from 'src/app/modelsBoletim/boletim-models/boletim-projeto.model';
import { BoletimBase } from 'src/app/modelsBoletim/boletim-models/boletim-base.model';
import { ProjetoBaseModel } from 'src/app/modelsBoletim/projeto-models/projeto-base.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { jsPDF } from 'jspdf';


@Component({
  selector: 'app-boletim-projeto',
  templateUrl: './boletim-projeto.component.html',
  styleUrls: ['./boletim-projeto.component.scss']
})
export class BoletimProjetoComponent implements OnInit {

  @ViewChild('content', { static: false }) element!: ElementRef;
  
  boletimCabecalho!: BoletimProjetoModel['boletimProjetoCabecalho'];
  logoTipoImgUrl: string = ''; // URL tratada da imagem do logotipo
  dataSource: BoletimBase[] = [];
  nomeUnidade: string = '';
  valorTotalMedicao: number = 0;

  projetos: ProjetoBaseModel[] = [];
  projetoItemSelecionado: ProjetoBaseModel = new ProjetoBaseModel();

  formProjeto: FormGroup = this.formBuilder.group({});

  // Variável para gerenciar estado de carregamento e erros
  isLoading = true;
  errorMessage = '';

  constructor(
    private boletimService: BoletimService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.createForm();
    this.buscarProjetos();
  }
  
  createForm(){
    const { required } = Validators;
    this.formProjeto = new FormGroup({
      projetoId: new FormControl('', required),
    })
  }

  buscarProjetos() {
    this.boletimService.getBuscarProjetos().subscribe({
      next: (dados) => {
        this.projetos = dados; // Agora 'dados' é um array de objetos
        console.log('Projetos: ', this.projetos);
      },
      error: (err) => {
        console.log("Falha ao buscar os projetos!", err);
      }
    });
  }

  projetoSelecionadoForm(event: any, projeto: ProjetoBaseModel) {
    if(event.isUserInput){
      this.projetoItemSelecionado = new ProjetoBaseModel();
      
      this.projetoItemSelecionado = projeto;

      this.buscarBoletinsPorProjetoId(this.projetoItemSelecionado.id);
    }
  }

  // Método para filtrar dados (simulado por enquanto)
  private buscarBoletinsPorProjetoId(projetoId: number) {
    this.boletimService.getBoletinsPorProjetoId(projetoId).subscribe({
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
    })
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
