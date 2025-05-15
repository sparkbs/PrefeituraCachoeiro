import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { StatusMedicaoEnum } from 'src/app/enums/statusMedicao';
import { InserirMedicao } from 'src/app/request/MedicoesRequest/medicoesRequest';
import { MedicoesModel, MedicoesResponse } from 'src/app/response/medicoesResponse/medicoesResponse';
import { MedicoesService } from 'src/app/services/medicoes.service';
import { ProjetoService } from 'src/app/services/projeto.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-modalReaproveitarMedicao',
  templateUrl: './modalReaproveitarMedicao.component.html',
  styleUrls: ['./modalReaproveitarMedicao.component.scss']
})
export class ModalReaproveitarMedicaoComponent implements OnInit {
  isLoading = false;
  medicoesReaproveitadas: MedicoesResponse[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { medicoesProjetos: MedicoesModel[], numeroMedicao: number, projetos: MedicoesResponse[] },
    private readonly api: ProjetoService,
    private dialogRef: MatDialogRef<ModalReaproveitarMedicaoComponent>,
    private _toastService: ToastService,
    private readonly apiMed: MedicoesService,
  ) { 
  }


  ngOnInit() {
    const idsProjetosJaListados = this.data.projetos
    .map(d => d.idProjeto);

    console.log(this.data.medicoesProjetos)

    console.log(idsProjetosJaListados)

    const projetosUnicos = this.data.medicoesProjetos.filter(medicao => {
      return medicao.data.some(d => !idsProjetosJaListados.includes(d.idProjeto) && d.statusMedicao.idStatusMedicao == StatusMedicaoEnum.Recusada);
    });

    console.log(projetosUnicos)


    const teste: MedicoesResponse[] = projetosUnicos
    .flatMap(x => x.data) // Junta todos os MedicoesResponse
    .filter(y => !idsProjetosJaListados.includes(y.idProjeto)); // Fica só com os que têm idProjeto único
    
    console.log(teste);

    var medicoesPodemSerReaproveitadas = teste.filter(x => x.numeroMedicao != this.data.numeroMedicao);

    medicoesPodemSerReaproveitadas.forEach(async x => {
      x.nomeProjeto = await this.BuscarProjeto(x.idProjeto);

      if(this.medicoesReaproveitadas){
        this.medicoesReaproveitadas = this.medicoesReaproveitadas.concat(x);
      }
      else{
        this.medicoesReaproveitadas.push(x);
      }
    })
  }

  async salvar(){
    this.isLoading = true;
    let medicaoRequest = new InserirMedicao();
    console.log(this.data.projetos)

    var medicoesQueVamosReaproveitar = this.medicoesReaproveitadas.filter(x => x.selecionado == true)

    medicoesQueVamosReaproveitar.forEach(async x => {
      medicaoRequest.idMedicoesProjeto = x.idMedicoesProjeto;
      medicaoRequest.dataMedicao = new Date();
      medicaoRequest.idContrato = x.idContrato;
      medicaoRequest.idProjeto = x.idProjeto;
      medicaoRequest.secretaria = this.data.projetos[0].secretaria ?? "";
      medicaoRequest.items = x.items.map(item => ({
        idItemContrato: item.idItemContrato,
        unidade: item.unidade
      }));
      medicaoRequest.numeroMedicao = this.data.numeroMedicao;
      medicaoRequest.resumo = this.data.projetos[0].resumo;
      medicaoRequest.observacao = this.data.projetos[0].observacao;
      console.log(medicaoRequest)

      await this.apiMed.CriarMedicoes(medicaoRequest)
      .then(async (result) => {
        await this.apiMed.DeletarMedicao(medicaoRequest.idMedicoesProjeto)
        .then( () => {
            this._toastService.mensagemSuccess("Medição arrastada com sucesso.");
            this.dialogRef.close(result.idMedicoesProjeto);
        })
        .catch((err) => {
            this._toastService.mensagemError(err.error.message);
            this.isLoading = false;
        })
      })
      .catch((err) =>
      {
        this._toastService.mensagemError(err.error.message);
      })
      .finally(() => {
        this.isLoading = false;
      });
    })
  }

  voltar(){
    this.dialogRef.close();
  }

  async BuscarProjeto(id: number){
    var nome = "";
    await this.api.BuscarProjeto(id)
    .then((result) => {
      nome = result.nomeProjeto
    });

    return nome;
  }
}
