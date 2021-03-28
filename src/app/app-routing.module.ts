import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import { ClienteComponent } from './pages/cliente/cliente.component';
import { ArticuloComponent } from './pages/articulo/articulo.component';
import { OrdenComponent } from './pages/orden/orden.component';

const routes: Routes = [
	{ path: 'inicio', component: InicioComponent},
	{ path: 'cliente', component: ClienteComponent},
	{ path: 'articulo', component: ArticuloComponent},
	{ path: 'orden', component: OrdenComponent},
	{ path: '**', pathMatch: 'full', redirectTo:'inicio'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
