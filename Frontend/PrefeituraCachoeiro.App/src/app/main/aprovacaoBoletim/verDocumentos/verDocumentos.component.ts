import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ArquivosMedicoesProjetoResponse } from 'src/app/response/medicoesResponse/medicoesResponse';
import { MedicoesService } from 'src/app/services/medicoes.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-verDocumentos',
  templateUrl: './verDocumentos.component.html',
  styleUrls: ['./verDocumentos.component.scss']
})
export class VerDocumentosComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: ArquivosMedicoesProjetoResponse[],
  private readonly apiMedicao: MedicoesService,
  private _toastService: ToastService, 
  ) { }

  ngOnInit() {
  }

  async downloadDocumento(idDocumento: number, arquivo:string) {
    // Filtra os documentos, removendo o que for igual ao item a ser deletado
    await this.apiMedicao.DownloadArquivoMedicao(idDocumento)
    .then((result) => {
      const url = window.URL.createObjectURL(result);
      const a = document.createElement('a');
      a.href = url;
      a.download = arquivo;  // Você pode definir o nome do arquivo
      a.click();
      window.URL.revokeObjectURL(url);  // Limpar a URL após o download
      this._toastService.mensagemSuccess("Download realizado com sucesso.");
    })
    .catch(() =>
    {
      this._toastService.mensagemError("Erro ao realizar download documento.");
    })
    .finally(()=>{
    });
  }

}
