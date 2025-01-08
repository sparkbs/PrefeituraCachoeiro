import { Component, OnInit } from '@angular/core';
import { ElementRef, ViewChild } from '@angular/core';
import { jsPDF } from 'jspdf';
import { BoletimDetalhadoModel } from 'src/app/modelsBoletim/boletim-models/boletim-detalhado.model';
import { BoletimBase } from 'src/app/modelsBoletim/boletim-models/boletim-base.model';
import { BoletimService } from 'src/app/services/boletins/boletim.service';

@Component({
  selector: 'app-boletim-detalhado',
  templateUrl: './boletim-detalhado.component.html',
  styleUrls: ['./boletim-detalhado.component.scss']
})
export class BoletimDetalhadoComponent implements OnInit {

  @ViewChild('content', { static: false }) element!: ElementRef;

  boletimCabecalho!: BoletimDetalhadoModel['boletimDetalhadoCabecalho'];
  logoTipoImgUrl: string = ''; // URL tratada da imagem do logotipo
  dataSource: BoletimBase[] = [];
  valorTotalMedicao: number = 0;
  nomeUnidade!: string | undefined;
  
  // Variáveis de controle de carregamento e erros
  isLoading = true;
  errorMessage = '';

  constructor(private boletimService: BoletimService) {}

  ngOnInit() {
    this.carregarBoletinsDetalhados();
  }

  carregarBoletinsDetalhados(): void {
    this.boletimService.getBoletinsDetalhados().subscribe({
      next: (dados) => {
        if (dados) {
          this.boletimCabecalho = dados.boletimDetalhadoCabecalho;

          
          // Verificar o tipo do campo logoTipoImg
          const logoTipoImg = this.boletimCabecalho?.logoTipoImg;

          if (logoTipoImg instanceof File) {
            // Se for um arquivo, converte para URL acessível
            this.logoTipoImgUrl = URL.createObjectURL(logoTipoImg);
          } else if (typeof logoTipoImg === 'string') {
            // Se for uma string, usa diretamente
            this.logoTipoImgUrl = logoTipoImg;
          }

          this.nomeUnidade = this.boletimCabecalho?.nomeUnidade || '';
          this.dataSource = dados.boletins || [];
          this.valorTotalMedicao = dados.valorTotalMedicao || 0;
        }
        this.isLoading = false;
      },
      error: (erro) => {
        console.error('Erro ao carregar os dados do boletim detalhado:', erro);
        this.errorMessage = 'Erro ao carregar os dados do boletim detalhado.';
        this.isLoading = false;
      }
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
