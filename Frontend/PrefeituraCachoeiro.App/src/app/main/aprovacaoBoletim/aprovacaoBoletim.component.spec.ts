/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AprovacaoBoletimComponent } from './aprovacaoBoletim.component';

describe('AprovacaoBoletimComponent', () => {
  let component: AprovacaoBoletimComponent;
  let fixture: ComponentFixture<AprovacaoBoletimComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AprovacaoBoletimComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AprovacaoBoletimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
