import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { InicioComponent } from './pages/inicio/inicio.component';
import { ClienteComponent } from './pages/cliente/cliente.component';
import { ArticuloComponent } from './pages/articulo/articulo.component';
import { ComponentsModule } from './components/components.module';
import { OrdenComponent } from './pages/orden/orden.component';

@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    ClienteComponent,
    ArticuloComponent,
    OrdenComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
	ComponentsModule,
	HttpClientModule,
	FormsModule,
	ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
