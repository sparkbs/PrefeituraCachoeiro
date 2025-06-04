/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BoletimProjetoRejeitadasComponent } from './boletim-projeto-rejeitadas.component';

describe('BoletimProjetoRejeitadasComponent', () => {
  let component: BoletimProjetoRejeitadasComponent;
  let fixture: ComponentFixture<BoletimProjetoRejeitadasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoletimProjetoRejeitadasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoletimProjetoRejeitadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
