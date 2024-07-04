import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsultarPrecipitacionComponent } from './Precipitacion/consultar-precipitacion/consultar-precipitacion.component';

const routeseries: Routes = [
  { path: 'consultarPrecipitacion', component: ConsultarPrecipitacionComponent },
];
  
@NgModule({
  imports: [RouterModule.forChild(routeseries)],
  exports: [RouterModule],
})
export class PublicacionInformacionRoutingModule {}
