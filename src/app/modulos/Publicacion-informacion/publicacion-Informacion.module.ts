import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicacionInformacionRoutingModule } from './publicacion-Informacion-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelect2Module } from 'ng-select2';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { DataTableModule } from 'src/app/common/tables/datatable.module';
import { HttpLoaderFactory } from '../configuracion/procesar-archivos/procesar-archivos.module';

import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ConsultarPrecipitacionComponent } from './Precipitacion/consultar-precipitacion/consultar-precipitacion.component';
import { MapaModule } from 'src/app/common/mapa/mapa.module'; 


 
@NgModule({
  declarations: [   
    ConsultarPrecipitacionComponent, 
   ],
  imports: [
    CommonModule, 
    PublicacionInformacionRoutingModule,   
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
   MapaModule,
   
 
  
  ]
})
export class PublicacionInformacionModule { }
