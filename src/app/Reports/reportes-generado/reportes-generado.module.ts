import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReportesGeneradoPageRoutingModule } from './reportes-generado-routing.module';

import { ReportesGeneradoPage } from './reportes-generado.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReportesGeneradoPageRoutingModule
  ],
  declarations: [ReportesGeneradoPage]
})
export class ReportesGeneradoPageModule {}
