import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgregaProductoPage } from './agrega-producto.page';

describe('AgregaProductoPage', () => {
  let component: AgregaProductoPage;
  let fixture: ComponentFixture<AgregaProductoPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AgregaProductoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
