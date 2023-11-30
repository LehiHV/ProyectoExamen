import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./Menus/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./Menus/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'registro',
    loadChildren: () => import('./Menus/registro/registro.module').then( m => m.RegistroPageModule)
  },
  {
    path: 'tienda',
    loadChildren: () => import('./Menus/tienda/tienda.module').then( m => m.TiendaPageModule)
  },
  {
    path: 'clientes',
    loadChildren: () => import('./Clients/clientes/clientes.module').then( m => m.ClientesPageModule)
  },
  {
    path: 'productos',
    loadChildren: () => import('./Products/productos/productos.module').then( m => m.ProductosPageModule)
  },
  {
    path: 'ventas',
    loadChildren: () => import('./Sells/ventas/ventas.module').then( m => m.VentasPageModule)
  },
  {
    path: 'reportes',
    loadChildren: () => import('./Reports/reportes/reportes.module').then( m => m.ReportesPageModule)
  },
  {
    path: 'agrega-cliente',
    loadChildren: () => import('./Clients/agrega-cliente/agrega-cliente.module').then( m => m.AgregaClientePageModule)
  },
  {
    path: 'agrega-producto',
    loadChildren: () => import('./Products/agrega-producto/agrega-producto.module').then( m => m.AgregaProductoPageModule)
  },
  {
    path: 'ventas-productos',
    loadChildren: () => import('./Sells/ventas-productos/ventas-productos.module').then( m => m.VentasProductosPageModule)
  },
  {
    path: 'resumen-ticket',
    loadChildren: () => import('./Sells/resumen-ticket/resumen-ticket.module').then( m => m.ResumenTicketPageModule)
  },
  {
    path: 'reportes-generado',
    loadChildren: () => import('./Reports/reportes-generado/reportes-generado.module').then( m => m.ReportesGeneradoPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
