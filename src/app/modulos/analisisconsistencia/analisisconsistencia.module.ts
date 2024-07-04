import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalisisConsistenciaRoutingModule } from './analisisconsistencia-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelect2Module } from 'ng-select2';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { DataTableModule } from 'src/app/common/tables/datatable.module';
import { HttpLoaderFactory } from '../configuracion/procesar-archivos/procesar-archivos.module';
import { DoblesMasasComponent } from './componentes/dobles-masas/dobles-masas.component';
import { PruebasBondadComponent } from './componentes/pruebasBondad/pruebas-bondad.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgApexchartsModule } from "ng-apexcharts";
import {KatexModule} from 'ng-katex';
import { HighchartsChartModule } from 'highcharts-angular';


@NgModule({
  declarations: [DoblesMasasComponent ,PruebasBondadComponent],
  imports: [
    HighchartsChartModule,
    CommonModule,
    AnalisisConsistenciaRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelect2Module,
    NgApexchartsModule,
    KatexModule,
    HttpClientModule,
    TranslateModule.forChild({
      loader: {
          provide: TranslateLoader,
          useFactory: (HttpLoaderFactory),
          deps: [HttpClient]
      }
  }),NgxChartsModule,
  DataTableModule,
  ]
})
export class AnalisisConsistenciaModule { }
