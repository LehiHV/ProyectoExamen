import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AgregaClientePageRoutingModule } from './agrega-cliente-routing.module';

import { AgregaClientePage } from './agrega-cliente.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgregaClientePageRoutingModule
  ],
  declarations: [AgregaClientePage]
})
export class AgregaClientePageModule {}
