import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { routing } from './configuracion-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConsultarEjemploComponent } from './ejemplo/consultar-ejemplo/consultar-ejemplo.component';
import { GuardarEjemploComponent } from './ejemplo/guardar-ejemplo/guardar-ejemplo.component';
import { ConsultarDominiosComponent } from './dominios/consultar-dominios/consultar-dominios.component';
import { GuardarDominiosComponent } from './dominios/guardar-dominios/guardar-dominios.component';
import { GuardarEstacionesComponent } from '../elementos/estaciones/guardar-estaciones/guardar-estaciones.component';
import { ConsultarEstacionesComponent } from '../elementos/estaciones/consultar-estaciones/consultar-estaciones.component';
import { ConsultarParametrosComponent } from '../parametros/consultar-parametros/consultar-parametros.component';
import { GuardarParametrosComponent } from '../parametros/guardar-parametros/guardar-parametros.component';
import { GuardarRolesComponent } from '../seguridad/roles/guardar-roles/guardar-roles.component';
import { ConsultarRolesComponent } from '../seguridad/roles/consultar-roles/consultar-roles.component';
import { ConfiguracionComponent } from './configuracion.component';
import { NgSelect2Module } from 'ng-select2';
 
import { LabelControl } from 'src/app/common/directives/labelControl.directive';
import {  HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core'; 
import { ParametrosEstacionComponent } from '../elementos/estaciones/parametros-estacion/parametros-estacion.component';
import { PermisosRolComponent } from '../seguridad/roles/permisos-rol/permisos-rol.component';
import { ConsultarPermisosComponent } from '../seguridad/permisos/consultar-permisos/consultar-permisos.component';
import { GuardarPermisosComponent } from '../seguridad/permisos/guardar-permisos/guardar-permisos.component';
import { ConsultarConfiguradosComponent } from './tipo-archivos/configurados/consultar-configurados/consultar-configurados.component';
import { GuardarConfiguradosComponent } from './tipo-archivos/configurados/guardar-configurados/guardar-configurados.component';
import { ConsultarTiposParametroComponent } from './tipos-Parametros/consultar-tipos-parametro/consultar-tipos-parametro.component';
import { GuardarTiposParametroComponent } from './tipos-Parametros/guardar-tipos-parametro/guardar-tipos-parametro.component';
import { ConsultarEmbalsesComponent } from '../elementos/embalses/consultar-embalses/consultar-embalses.component';
import { GuardarEmbalsesComponent } from '../elementos/embalses/guardar-embalses/guardar-embalses.component';
import { ConsultarPozosComponent } from '../elementos/pozos/consultar-pozos/consultar-pozos.component'; 
import { GuardarPozosComponent } from '../elementos/pozos/guardar-pozos/guardar-pozos.component';
import { EsriMapComponent } from 'src/app/common/mapa/mapa.component'; 
import { ParametrosEmbalseComponent } from '../elementos/embalses/parametros-embalse/parametros-embalse.component';
import { ParametrosPozosComponent } from '../elementos/pozos/parametros-pozos/parametros-pozos.component';
import { ConsultarCapasComponent } from './capas/consultar-capas/consultar-capas.component';
import { GuardarCapasComponent } from './capas/guardar-capas/guardar-capas.component';
import { GuardarColumnasComponent } from './tipo-archivos/columnas/guardar-columnas/guardar-columnas.component';
import { GuardarCamposComponent } from './tipo-archivos/campos/guardar-campos/guardar-campos.component';
import { ConsultarObservacionesComponent } from '../observaciones/consultar-observaciones/consultar-observaciones.component';
import { GuardarObsercacionesComponent } from '../observaciones/guardar-obsercaciones/guardar-obsercaciones.component';
import { ModelSelectComponent } from 'src/app/common/modal-select/modal-select.component';
import { ConsultarCamposComponent } from './tipo-archivos/campos/consultar-campos/consultar-campos.component';
import { ConsultarColumnasComponent } from './tipo-archivos/columnas/consultar-columnas/consultar-columnas.component';
import { DataTableModule } from 'src/app/common/tables/datatable.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ConsultarAforoComponent } from './nivel-caudal/aforo/consultar-aforo/consultar-aforo.component';
import { GuardarAforoComponent } from './nivel-caudal/aforo/guardar-aforo/guardar-aforo.component'; 
import { GuardarMolineteComponent } from './nivel-caudal/molinetes/guardar-molinete/guardar-molinete.component';
import { GestionTablasComponent } from './nivel-caudal/aforo/gestion-tablas/gestion-tablas.component';
import { GestionRegresionComponent } from './nivel-caudal/aforo/gestion-regresion/gestion-regresion.component';
import { GestionCaudalComponent } from './nivel-caudal/aforo/gestion-caudal/gestion-caudal.component';
import { ConsultarMolineteComponent } from './nivel-caudal/molinetes/consultar-molinete/consultar-molinete.component';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { CargarAforoComponent } from './nivel-caudal/aforo/cargar-aforo/cargar-aforo.component';
import { MapaModule } from '../../common/mapa/mapa.module';
import { ConsultarReportesComponent } from '../gestionReportes/consultar-reportes/consultar-reportes.component';
import { GuardarReportesComponent } from '../gestionReportes/guardar-reportes/guardar-reportes.component';
  import { ScrollingModule} from '@angular/cdk/scrolling'
import { ConsultarCirteriosComponent } from '../gestionHidrologica/cirterios/consultar-cirterios/consultar-cirterios.component';
import { GuardarCirteriosComponent } from '../gestionHidrologica/cirterios/guardar-cirterios/guardar-cirterios.component';
import { ConsultarAlertasComponent } from '../gestionHidrologica/consultar-alertas/consultar-alertas.component';
import { VerAforoComponent } from './nivel-caudal/aforo/gestion-tablas/var-aforo.component';
import { ValidarAforoComponent } from './nivel-caudal/aforo/validar-aforo/validar-aforo.component';
import { CalcularAforoComponent } from './nivel-caudal/aforo/calcular-aforo/calcular-aforo.component';
import { ConsultarValidacionObervacionComponent } from '../gestionHidrologica/consulta-valida-obervacion/consultar-valida-obervacion.component';
import { GestionAgregacionComponent } from '../observaciones/gestión-agregacion/gestion-agregacion.component';
import { ConfuguracionParametroComponent } from '../observaciones/configuracion-parametros/configuracion-parametro.component';

import { ConsultarInventarioDatosComponent } from '../gestionHidrologica/consultar-inventario-datos/consultar-inventario-datos.component';
import { NgApexchartsModule } from "ng-apexcharts";
import { ConsultarReportesPozoComponent } from '../gestionReportes/consultar-datos-reportes/reporte-pozo/consultar-datos-reportes-pozo.component';

import { ConsultarDatosReporteEstacionComponent } from '../gestionReportes/consultar-datos-reportes/reporte-estacion/consultar-datos-reportes-estacion.component';
import { CaudalesAforadosComponent } from 'src/app/modulos/gestionReportes/reportes-estaticos/caudales-aforados/caudales-aforados.component';
import { ReporteFuentesSuperficialesComponent } from 'src/app/modulos/gestionReportes/reportes-estaticos/fuentes-superficiales/fuentes-superficiales.component';
import { ReportePrecipitacionComponent } from 'src/app/modulos/gestionReportes/reportes-estaticos/precipitacion/precipitacion.component';
import { ReporteNivelesComponent } from 'src/app/modulos/gestionReportes/reportes-estaticos/Niveles/niveles.component';
import { ReportesEstaticosComponent } from 'src/app/modulos/gestionReportes/reportes-estaticos/reportes-estaticos.component';
import { ConsultarReportesEmbalseComponent } from '../gestionReportes/consultar-datos-reportes/reporte-embalse/consultar-datos-reportes-embalse.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { CurvaDuracionComponent } from 'src/app/modulos/configuracion/nivel-caudal/aforo/curva-duracion/curva-duracion.component';
import { CurvaDuracionAjusteComponent } from './nivel-caudal/aforo/curva-duracion-ajuste/curva-duracion-ajuste.component';
import { CargarAforoNuevoComponent } from './nivel-caudal/aforo/cargar-aforo/cargar-aforo-nuevo.component';
import { ConsultaIdfsComponent } from 'src/app/modulos/IDFs/consultar-idfs/consultar-idfs.component';
import { IdfsComponent } from 'src/app/modulos/IDFs/idfs/idfs.component';
import {KatexModule} from 'ng-katex';

@NgModule({
  declarations: [
    ConfiguracionComponent,
    ConsultarEjemploComponent,
    GuardarEjemploComponent,
    ConsultarDominiosComponent,
    GuardarDominiosComponent,
    GuardarEstacionesComponent,
    ConsultarEstacionesComponent,
    ConsultarParametrosComponent,
    GuardarParametrosComponent,
    GuardarRolesComponent,
    ConsultarRolesComponent,
    LabelControl,
    ParametrosEstacionComponent,
    PermisosRolComponent,
    ConsultarPermisosComponent,
    GuardarPermisosComponent,
    ConsultarConfiguradosComponent,
    GuardarConfiguradosComponent,
    ConsultarTiposParametroComponent,
    GuardarTiposParametroComponent,
    ConsultarEmbalsesComponent,
    GuardarEmbalsesComponent,
    ConsultarPozosComponent, 
    GuardarPozosComponent,
    ConsultarReportesPozoComponent,
    ConsultarDatosReporteEstacionComponent,
    ConsultarReportesEmbalseComponent,
    //  EsriMapComponent, 
    ParametrosEmbalseComponent, ParametrosPozosComponent, ConsultarCapasComponent, GuardarCapasComponent, GuardarColumnasComponent, GuardarCamposComponent, ConsultarObservacionesComponent, GuardarObsercacionesComponent, 
    ModelSelectComponent, ConsultarCamposComponent, ConsultarColumnasComponent, ConsultarAforoComponent, GuardarAforoComponent, GuardarMolineteComponent,ConsultarMolineteComponent, CargarAforoComponent, CargarAforoNuevoComponent, 
    ConsultarReportesComponent,
    GuardarReportesComponent,
    ConsultarCirteriosComponent,
    ReportesEstaticosComponent,
    CaudalesAforadosComponent,
    ReporteFuentesSuperficialesComponent,
    ReportePrecipitacionComponent,
    ReporteNivelesComponent,
    GuardarCirteriosComponent,
    ConsultarAlertasComponent,
    GestionRegresionComponent,
    GestionTablasComponent,
    GestionCaudalComponent,
    ConsultarInventarioDatosComponent,
    ConfuguracionParametroComponent,
    VerAforoComponent,
    ValidarAforoComponent,
    ConsultarValidacionObervacionComponent,
    GestionAgregacionComponent,
    CalcularAforoComponent, 
    CurvaDuracionComponent,
    CurvaDuracionAjusteComponent,
    ConsultaIdfsComponent,IdfsComponent
  ],

  imports: [
    CommonModule,
    RouterModule,
    HighchartsChartModule,
    routing,
    DataTableModule,
    NgSelect2Module,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    TranslateModule,
    NgxChartsModule,
    NgxQRCodeModule,
    MapaModule,
    NgApexchartsModule,
    ScrollingModule,
    KatexModule
  
    
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ConfiguracionModule { }