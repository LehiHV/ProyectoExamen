import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AgregaProductoPageRoutingModule } from './agrega-producto-routing.module';

import { AgregaProductoPage } from './agrega-producto.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgregaProductoPageRoutingModule
  ],
  declarations: [AgregaProductoPage]
})
export class AgregaProductoPageModule {}
