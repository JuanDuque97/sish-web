import {NgModule } from '@angular/core';
import {RouterModule, Routes } from '@angular/router';
import { ConsultarDatosReporteEstacionComponent } from './consultar-datos-reportes/reporte-estacion/consultar-datos-reportes-estacion.component';

const routereportes : Routes = [
    {
        path:'/consultar-datos-reportes-estacion.html',
        component: ConsultarDatosReporteEstacionComponent
    },
];

@NgModule({
    imports: [RouterModule.forChild(routereportes) ], 
    exports:[RouterModule]
})

export class ReportesRoutingModule { 

}
