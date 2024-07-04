import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { DoblesMasasComponent } from './componentes/dobles-masas/dobles-masas.component';
import { PruebasBondadComponent } from './componentes/pruebasBondad/pruebas-bondad.component';
const routesAnalisisCon : Routes = [

  { path: 'analisisconsistencia/doblesmasas', component: DoblesMasasComponent ,canActivate:[AuthGuard]},
  { path: 'analisisconsistencia/pruebasbondad', component: PruebasBondadComponent ,canActivate:[AuthGuard]}
  


];


@NgModule({
  imports: [RouterModule.forChild(routesAnalisisCon) ], 
  exports:[RouterModule]
})
export class AnalisisConsistenciaRoutingModule { }
