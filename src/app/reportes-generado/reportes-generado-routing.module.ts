import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportesGeneradoPage } from './reportes-generado.page';

const routes: Routes = [
  {
    path: '',
    component: ReportesGeneradoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportesGeneradoPageRoutingModule {}
