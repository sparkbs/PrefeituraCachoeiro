/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { Editar_criar_empresaComponent } from './editar_criar_empresa.component';

describe('Editar_criar_prefeituraComponent', () => {
  let component: Editar_criar_empresaComponent;
  let fixture: ComponentFixture<Editar_criar_empresaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Editar_criar_empresaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Editar_criar_empresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
