import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelect2Module } from 'ng-select2';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../procesar-archivos/procesar-archivos.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DataTableModule } from 'src/app/common/tables/datatable.module';
import { routing } from '../configuracion-routing.module';
import {SeriestiempoRoutingModule} from './nivel-caudal-routing.module';
import { CalcularAforoComponent } from './aforo/calcular-aforo/calcular-aforo.component';



@NgModule({

  imports: [
    SeriestiempoRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelect2Module,
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
export class NivelCaudalModule { }
