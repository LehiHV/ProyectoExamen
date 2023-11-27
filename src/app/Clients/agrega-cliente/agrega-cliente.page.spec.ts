import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgregaClientePage } from './agrega-cliente.page';

describe('AgregaClientePage', () => {
  let component: AgregaClientePage;
  let fixture: ComponentFixture<AgregaClientePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AgregaClientePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
