/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { VerAnexosAditivosComponent } from './ver-anexos-aditivos.component';


describe('AditivosContratosComponent', () => {
  let component: VerAnexosAditivosComponent;
  let fixture: ComponentFixture<VerAnexosAditivosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerAnexosAditivosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerAnexosAditivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
