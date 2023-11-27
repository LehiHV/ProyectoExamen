import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VentasProductosPage } from './ventas-productos.page';

const routes: Routes = [
  {
    path: '',
    component: VentasProductosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VentasProductosPageRoutingModule {}
