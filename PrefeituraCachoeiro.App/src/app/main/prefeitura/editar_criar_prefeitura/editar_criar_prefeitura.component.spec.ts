/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Editar_criar_prefeituraComponent } from './editar_criar_prefeitura.component';

describe('Editar_criar_prefeituraComponent', () => {
  let component: Editar_criar_prefeituraComponent;
  let fixture: ComponentFixture<Editar_criar_prefeituraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Editar_criar_prefeituraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Editar_criar_prefeituraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
