import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CargarSerieComponent } from './componentes/cargar-serie/cargar-serie.component';
import { GuardarSerieTiempoComponent} from './componentes/guardar-serie-tiempo/guardar-serie-tiempo.component';
import { ConsultarSerieTiempoComponent} from './componentes/consultar-serie-tiempo/consultar-serie-tiempo.component';
import { ConsultarSerieMixtaComponent} from './componentes/consultar-serie-mixta/consultar-serie-mixta.component';
import { GenerarSerieMixtaComponent } from './componentes/generar-serie-mixta/generar-serie-mixta.component';
import { AuthGuard } from 'src/app/guards/auth.guard';


const routeseries : Routes = [
  {
    path:'procesararchivos/cargararchivos/:ac/:id',
    component: CargarSerieComponent ,canActivate:[AuthGuard]
  },
  {
    path:'seriestiempo/cargarserie',
    component: CargarSerieComponent,canActivate:[AuthGuard]
  },
  { path: 'seriestiempo/consultarserie', component: ConsultarSerieTiempoComponent ,canActivate:[AuthGuard]},
  { path: 'seriestiempo/guardarserie/:te/:ac/:id', component: GuardarSerieTiempoComponent ,canActivate:[AuthGuard]}
  ,
  {
    path:'seriestiempo/consultarseriemixta',
    component: ConsultarSerieMixtaComponent,canActivate:[AuthGuard]
  },
  {
    path:'seriestiempo/generarseriemixta',
    component: GenerarSerieMixtaComponent,canActivate:[AuthGuard]
  }

  
];

@NgModule({
  imports: [RouterModule.forChild(routeseries) ], 
  exports:[RouterModule]
})
export class SeriestiempoRoutingModule { }
