/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RelatorioProjetosPorMedicaoComponent } from './relatorioProjetosPorMedicao.component';

describe('RelatorioProjetosPorMedicaoComponent', () => {
  let component: RelatorioProjetosPorMedicaoComponent;
  let fixture: ComponentFixture<RelatorioProjetosPorMedicaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelatorioProjetosPorMedicaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelatorioProjetosPorMedicaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
