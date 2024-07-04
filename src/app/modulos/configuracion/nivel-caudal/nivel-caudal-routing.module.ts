import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { CargarAforoNuevoComponent } from './aforo/cargar-aforo/cargar-aforo-nuevo.component';
import {CargarAforoComponent } from './aforo/cargar-aforo/cargar-aforo.component';

const routeaforo : Routes = [
  {
    path:'aforo/cargaraforo',
    component: CargarAforoComponent,canActivate:[AuthGuard]
  }, 
  {
    path:'aforo/cargaraforonuevo',
    component: CargarAforoNuevoComponent, canActivate:[AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routeaforo) ], 
  exports:[RouterModule]
})

export class SeriestiempoRoutingModule { }
