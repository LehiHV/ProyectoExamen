import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResumenTicketPage } from './resumen-ticket.page';

describe('ResumenTicketPage', () => {
  let component: ResumenTicketPage;
  let fixture: ComponentFixture<ResumenTicketPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ResumenTicketPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
