import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

export interface PeriodicElement {
  recurso: string;
  valor: number;
  icon?: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {recurso: 'Recurso 1', valor: 10},
  {recurso: 'Recurso 2', valor: 15},
  {recurso: 'Recurso 3', valor: 10},
  {recurso: 'Recurso 4', valor: 15},
  {recurso: 'Recurso 5', valor: 10},
  {recurso: 'Recurso 6', valor: 15},
  {recurso: 'Recurso 7', valor: 10},
  {recurso: 'Recurso 8', valor: 15},
];

@Component({
  selector: 'app-incluir-editar-medicao',
  templateUrl: './incluir-editar-medicao.component.html',
  styleUrls: ['./incluir-editar-medicao.component.scss']
})
export class IncluirEditarMedicaoComponent {
  displayedColumns: string[] = ['recurso', 'valor', 'icon'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  states: string[] = [
    'Aberto',
    'Finalizado',
  ];

  recursos: string[] = [
    'Engenheiro/Arquiteto Consultor',
    'Projeto Elétrico',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(
    public dialogRef: MatDialogRef<IncluirEditarMedicaoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { edicao: boolean }
  ) {}
}
