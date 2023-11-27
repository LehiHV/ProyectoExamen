import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VentasProductosPageRoutingModule } from './ventas-productos-routing.module';

import { VentasProductosPage } from './ventas-productos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VentasProductosPageRoutingModule
  ],
  declarations: [VentasProductosPage]
})
export class VentasProductosPageModule {}
