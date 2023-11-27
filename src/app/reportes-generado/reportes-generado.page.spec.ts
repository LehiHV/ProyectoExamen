import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportesGeneradoPage } from './reportes-generado.page';

describe('ReportesGeneradoPage', () => {
  let component: ReportesGeneradoPage;
  let fixture: ComponentFixture<ReportesGeneradoPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ReportesGeneradoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
