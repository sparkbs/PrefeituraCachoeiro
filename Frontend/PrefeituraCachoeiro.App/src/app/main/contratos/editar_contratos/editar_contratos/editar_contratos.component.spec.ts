/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Editar_contratosComponent } from './editar_contratos.component';

describe('Editar_contratosComponent', () => {
  let component: Editar_contratosComponent;
  let fixture: ComponentFixture<Editar_contratosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Editar_contratosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Editar_contratosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
