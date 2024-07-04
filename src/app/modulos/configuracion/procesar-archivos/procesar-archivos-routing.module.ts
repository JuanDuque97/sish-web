import {NgModule } from '@angular/core';
import {RouterModule, Routes } from '@angular/router';
import {ConsultarArchivosComponent } from './componentes/consultar-archivos/consultar-archivos.component';
import { CargararchivoComponent } from './componentes/cargar-archivo/cargararchivo.component';
import { CargarapidaComponent } from './componentes/cargar-archivo/cargarapida.component';
import { CargaformatoComponent } from './componentes/cargar-archivo/cargaformato.component';
import { ParametrosComponent } from './componentes/parametros/parametros.component';


const routesobservaciones : Routes = [
    {
        path:'procesararchivos/cargararchivos/:ac/:id',
        component: CargararchivoComponent
    },
    {
        path:'procesararchivos/cargarapida',
        component: CargarapidaComponent
    },
    {
        path:'procesararchivos/cargaformato',
        component: CargaformatoComponent
    },
    {
        path:'procesararchivos/consultararchivos',
        component: ConsultarArchivosComponent
    },
    {
        path:'procesararchivos/parametros',
        component: ParametrosComponent
    },
];

@NgModule({
    imports: [RouterModule.forChild(routesobservaciones) ], 
    exports:[RouterModule]
})

export class ProcesarArchivosRoutingModule { }