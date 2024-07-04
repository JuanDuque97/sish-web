import { NgModule, CUSTOM_ELEMENTS_SCHEMA,  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProcesarArchivosComponent } from './procesar-archivos.component';
import { ProcesarArchivosRoutingModule } from './procesar-archivos-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelect2Module } from 'ng-select2';
import { CargararchivoComponent } from './componentes/cargar-archivo/cargararchivo.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ConsultarArchivosComponent } from './componentes/consultar-archivos/consultar-archivos.component';
import { DataTableModule } from 'src/app/common/tables/datatable.module';
import { ParametrosComponent } from './componentes/parametros/parametros.component';
import { CargarapidaComponent } from './componentes/cargar-archivo/cargarapida.component';
import { CargaformatoComponent } from './componentes/cargar-archivo/cargaformato.component';

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http,'./assets/i18n/','.json');
}

@NgModule({
  declarations: [
    ProcesarArchivosComponent, 
    CargararchivoComponent, 
    CargarapidaComponent,
    CargaformatoComponent,
    ConsultarArchivosComponent, ParametrosComponent,
    ],
  imports: [  
    
    CommonModule,
    ProcesarArchivosRoutingModule,
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
  }),
  DataTableModule,
  ],
   exports:[ProcesarArchivosComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProcesarArchivosModule { }
