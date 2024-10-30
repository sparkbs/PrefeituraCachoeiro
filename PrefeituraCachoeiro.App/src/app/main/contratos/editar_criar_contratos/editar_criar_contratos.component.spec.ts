/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Editar_criar_contratosComponent } from './editar_criar_contratos.component';

describe('Editar_criar_contratosComponent', () => {
  let component: Editar_criar_contratosComponent;
  let fixture: ComponentFixture<Editar_criar_contratosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Editar_criar_contratosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Editar_criar_contratosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
