import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VentasProductosPage } from './ventas-productos.page';

describe('VentasProductosPage', () => {
  let component: VentasProductosPage;
  let fixture: ComponentFixture<VentasProductosPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(VentasProductosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
