/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AditivosContratosComponent } from './aditivos-contratos.component';

describe('AditivosContratosComponent', () => {
  let component: AditivosContratosComponent;
  let fixture: ComponentFixture<AditivosContratosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AditivosContratosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AditivosContratosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
