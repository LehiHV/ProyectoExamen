import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResumenTicketPageRoutingModule } from './resumen-ticket-routing.module';

import { ResumenTicketPage } from './resumen-ticket.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResumenTicketPageRoutingModule
  ],
  declarations: [ResumenTicketPage]
})
export class ResumenTicketPageModule {}
