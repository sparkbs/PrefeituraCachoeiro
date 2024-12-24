import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { BoletimMedicaoModel } from 'src/app/modelsBoletim/boletim-models/boletim-medicao.model';
import { BoletimService } from 'src/app/services/boletins/boletim.service';
import { BoletimBase } from 'src/app/modelsBoletim/boletim-models/boletim-base.model';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-boletim-medicao',
  templateUrl: './boletim-medicao.component.html',
  styleUrls: ['./boletim-medicao.component.scss']
})
export class BoletimMedicaoComponent implements OnInit {

  @ViewChild('content', { static: false }) element!: ElementRef;

  // Dados para armazenar o boletim retornado do backend  
  dataSource: BoletimBase[] | undefined = [];
  boletimCabecalho!: BoletimMedicaoModel['boletimMedicaoCabecalho'];
  logoTipoImgUrl: string = ''; // URL tratada da imagem do logotipo
  nomeUnidade!: string | undefined;
  valorTotalMedicao!: number;

  // Variável para gerenciar estado de carregamento e erros
  isLoading = true;
  errorMessage = '';

  constructor(private boletimService: BoletimService) {}

  ngOnInit(): void {
    this.carregarBoletinsMedicao();
    
  }

  // Método para carregar os dados do boletim de medição
  carregarBoletinsMedicao(): void {
    this.boletimService.getBoletinsMedicao().subscribe({
      next: (dados) => {
        if (dados) {
          this.boletimCabecalho = dados.boletimMedicaoCabecalho;

          // Verificar o tipo do campo logoTipoImg
          const logoTipoImg = this.boletimCabecalho?.logoTipoImg;

          if (logoTipoImg instanceof File) {
            // Se for um arquivo, converte para URL acessível
            this.logoTipoImgUrl = URL.createObjectURL(logoTipoImg);
          } else if (typeof logoTipoImg === 'string') {
            // Se for uma string, usa diretamente
            this.logoTipoImgUrl = logoTipoImg;
          }

          this.nomeUnidade = this.boletimCabecalho?.nomeUnidade;
          this.valorTotalMedicao = dados.valorTotalMedicao;
          this.dataSource = dados.subBoletins;
        }
        this.isLoading = false;
      },
      error: (erro) => {
        const message = 'Erro ao carregar os dados do boletim: '
        console.error(message, erro);
        this.isLoading = false;
      }
    });
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
