import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'registro',
    loadChildren: () => import('./registro/registro.module').then( m => m.RegistroPageModule)
  },
  {
    path: 'tienda',
    loadChildren: () => import('./tienda/tienda.module').then( m => m.TiendaPageModule)
  },
  {
    path: 'clientes',
    loadChildren: () => import('./clientes/clientes.module').then( m => m.ClientesPageModule)
  },
  {
    path: 'productos',
    loadChildren: () => import('./productos/productos.module').then( m => m.ProductosPageModule)
  },
  {
    path: 'ventas',
    loadChildren: () => import('./ventas/ventas.module').then( m => m.VentasPageModule)
  },
  {
    path: 'reportes',
    loadChildren: () => import('./reportes/reportes.module').then( m => m.ReportesPageModule)
  },
  {
    path: 'agrega-cliente',
    loadChildren: () => import('./agrega-cliente/agrega-cliente.module').then( m => m.AgregaClientePageModule)
  },
  {
    path: 'agrega-producto',
    loadChildren: () => import('./agrega-producto/agrega-producto.module').then( m => m.AgregaProductoPageModule)
  },
  {
    path: 'ventas-productos',
    loadChildren: () => import('./ventas-productos/ventas-productos.module').then( m => m.VentasProductosPageModule)
  },
  {
    path: 'resumen-ticket',
    loadChildren: () => import('./resumen-ticket/resumen-ticket.module').then( m => m.ResumenTicketPageModule)
  },
  {
    path: 'reportes-generado',
    loadChildren: () => import('./reportes-generado/reportes-generado.module').then( m => m.ReportesGeneradoPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
