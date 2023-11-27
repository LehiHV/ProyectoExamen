import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AgregaClientePage } from './agrega-cliente.page';

const routes: Routes = [
  {
    path: '',
    component: AgregaClientePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgregaClientePageRoutingModule {}
