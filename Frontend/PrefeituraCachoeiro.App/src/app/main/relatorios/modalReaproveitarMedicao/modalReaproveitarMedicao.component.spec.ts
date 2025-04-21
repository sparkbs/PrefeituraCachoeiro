/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ModalReaproveitarMedicaoComponent } from './modalReaproveitarMedicao.component';

describe('ModalReaproveitarMedicaoComponent', () => {
  let component: ModalReaproveitarMedicaoComponent;
  let fixture: ComponentFixture<ModalReaproveitarMedicaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalReaproveitarMedicaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalReaproveitarMedicaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
