import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeriestiempoRoutingModule } from './seriestiempo-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelect2Module } from 'ng-select2';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { DataTableModule } from 'src/app/common/tables/datatable.module';
import { HttpLoaderFactory } from '../configuracion/procesar-archivos/procesar-archivos.module';
import { CargarSerieComponent } from './componentes/cargar-serie/cargar-serie.component';
import { ConsultarSerieComponent } from './componentes/consultar-serie/consultar-serie.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { GuardarSerieTiempoComponent } from './componentes/guardar-serie-tiempo/guardar-serie-tiempo.component';
import { ConsultarSerieTiempoComponent } from './componentes/consultar-serie-tiempo/consultar-serie-tiempo.component';
import { GenerarSerieMixtaComponent } from './componentes/generar-serie-mixta/generar-serie-mixta.component';
import { ConsultarSerieMixtaComponent } from './componentes/consultar-serie-mixta/consultar-serie-mixta.component';
import { MapaModule } from 'src/app/common/mapa/mapa.module'; 
import { NgApexchartsModule } from "ng-apexcharts";
import { HighchartsChartModule } from 'highcharts-angular';
import {scaleLinear} from "d3-scale";
import {brush} from "d3-brush";

@NgModule({
  declarations: [CargarSerieComponent, ConsultarSerieComponent, GuardarSerieTiempoComponent,ConsultarSerieTiempoComponent, GenerarSerieMixtaComponent, ConsultarSerieMixtaComponent  ],
  imports: [
    CommonModule,
    HighchartsChartModule,
    SeriestiempoRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelect2Module,
    NgApexchartsModule,
    HttpClientModule,
    TranslateModule.forChild({
      loader: {
          provide: TranslateLoader,
          useFactory: (HttpLoaderFactory),
          deps: [HttpClient]
      }
  }),NgxChartsModule,
  DataTableModule,
  MapaModule,
  ]
})
export class SeriestiempoModule { }
data: [12, 34, 34, 333, 12, 13, 23, 34, 34, 34, 45, 32, 32, 32, 32, 32, 32, 32, -1, 32, 4, 4, 4, 78, 34, 34, 34, 34, 34, 34, 6, 6, 13, 13, 13, 13, 13, 13, 23, 23, 12, 13, -33, 57, 37, 37, 37, 37, 37, 37, 37, 89, 35, 35, 35, 36, 30, 30, 30, 33, 23, 34, 34, 34, 45, 32, 32, 32, 32, 32, 32, 32, -1, 32, 4, 4, 4, 78, 34, 34, 34, 34, 34, 34, 6, 6, 13, 13, 13, 13, 13, 13, 23, 23, 12, 13, -33, 57, 37, 37]
        categories: ['2022-10-31T18:30:05.546+00:00', '2022-10-31T18:30:05.546+00:00', '2022-10-31T18:30:05.546+00:00', '2022-10-31T18:30:05.546+00:00', '2022-10-31T18:30:05.546+00:00', '2022-10-31T18:30:05.546+00:00', '2022-10-31T18:30:05.546+00:00', '2022-10-31T18:30:05.546+00:00', '2022-10-31T18:30:05.546+00:00', '2022-10-31T18:30:05.546+00:00', '2022-10-31T18:30:05.546+00:00', '2022-10-31T18:30:05.546+00:00', '2022-10-31T18:30:05.546+00:00', '2022-10-31T18:30:05.546+00:00', '2022-10-31T18:30:05.546+00:00', '2022-10-31T18:30:05.546+00:00', '2022-10-31T18:30:05.546+00:00', '2022-10-31T18:30:05.546+00:00', '2022-10-31T18:30:05.546+00:00', '2022-10-31T18:30:05.546+00:00', '2022-10-31T18:30:05.546+00:00', '2022-10-31T18:30:05.546+00:00', '2022-10-31T18:30:05.546+00:00', '2022-10-31T18:30:05.546+00:00', '2022-10-31T18:30:05.546+00:00', '2022-10-31T18:30:05.546+00:00', '2022-10-31T18:30:05.546+00:00', '2022-10-31T18:30:05.546+00:00', '2022-10-31T18:30:05.546+00:00', '2022-10-31T18:30:05.546+00:00', '2022-10-31T18:30:05.546+00:00', '2022-10-31T18:30:05.546+00:00', '2022-10-31T18:30:05.546+00:00', '2022-10-31T18:30:05.546+00:00', '2022-10-31T18:30:05.546+00:00', '2022-10-31T18:30:05.546+00:00', '2022-10-31T18:30:05.546+00:00', '2022-10-31T18:30:05.546+00:00', '2022-10-31T18:30:05.546+00:00', '2022-10-31T18:30:05.546+00:00', '2022-10-31T18:30:05.546+00:00', '2022-10-31T18:30:05.546+00:00', '2022-10-31T18:30:05.546+00:00', '2022-10-31T18:30:05.546+00:00', '2022-10-31T18:30:05.546+00:00', '2022-10-31T18:30:05.546+00:00', '2022-10-31T18:30:05.546+00:00', '2022-10-31T18:30:05.546+00:00', '2022-10-31T18:30:05.546+00:00', '2022-10-31T18:30:05.546+00:00', '2022-10-31T18:30:05.546+00:00', '2022-10-31T18:30:05.546+00:00', '2022-10-31T18:30:05.546+00:00', '2022-10-31T18:30:05.546+00:00', '2022-10-31T18:30:05.546+00:00', '2022-10-31T18:30:05.546+00:00', '2022-10-31T18:30:05.546+00:00', '2022-10-31T18:30:05.546+00:00', '2022-10-31T18:30:05.546+00:00', '2022-10-31T18:30:05.546+00:00', '2022-10-20T01:08:01.505+00:00', '2022-10-20T01:08:01.505+00:00', '2022-10-20T01:08:01.505+00:00', '2022-10-20T01:08:01.505+00:00', '2022-10-20T01:08:01.505+00:00', '2022-10-20T01:08:01.505+00:00', '2022-10-20T01:08:01.505+00:00', '2022-10-20T01:08:01.505+00:00', '2022-10-20T01:08:01.505+00:00', '2022-10-20T01:08:01.505+00:00', '2022-10-20T01:08:01.505+00:00', '2022-10-20T01:08:01.505+00:00', '2022-10-20T01:08:01.505+00:00', '2022-10-20T01:08:01.505+00:00', '2022-10-20T01:08:01.505+00:00', '2022-10-20T01:08:01.505+00:00', '2022-10-20T01:08:01.505+00:00', '2022-10-20T01:08:01.505+00:00', '2022-10-20T01:08:01.505+00:00', '2022-10-20T01:08:01.505+00:00', '2022-10-20T01:08:01.505+00:00', '2022-10-20T01:08:01.505+00:00', '2022-10-20T01:08:01.505+00:00', '2022-10-20T01:08:01.505+00:00', '2022-10-20T01:08:01.505+00:00', '2022-10-20T01:08:01.505+00:00', '2022-10-20T01:08:01.505+00:00', '2022-10-20T01:08:01.505+00:00', '2022-10-20T01:08:01.505+00:00', '2022-10-20T01:08:01.505+00:00', '2022-10-20T01:08:01.505+00:00', '2022-10-20T01:08:01.505+00:00', '2022-10-20T01:08:01.505+00:00', '2022-10-20T01:08:01.505+00:00', '2022-10-20T01:08:01.505+00:00', '2022-10-20T01:08:01.505+00:00', '2022-10-20T01:08:01.505+00:00', '2022-10-20T01:08:01.505+00:00', '2022-10-20T01:08:01.505+00:00', '2022-10-20T01:08:01.505+00:00']
