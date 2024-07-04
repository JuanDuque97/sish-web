import { CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { routing } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './common/layout/header/header.component';
import { FooterComponent } from './common/layout/footer/footer.component';
import { NavbarComponent } from './common/layout/navbar/navbar.component';
import { MenuIzquierdoComponent } from './common/layout/menu-izquierdo/menu-izquierdo.component';
import { InicioComponent } from './inicio/inicio.component';
import { PageNotFoundComponent } from './pagenotfound/pagenotfound.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpConfigInterceptor } from './common/interceptors/httpconfig.interceptor'; 
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ProcesarArchivosModule} from './modulos/configuracion/procesar-archivos/procesar-archivos.module';
import { DatatableComponent } from './common/tables/datatable.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SeriestiempoModule } from './modulos/seriestiempo/seriestiempo.module';
import { AnalisisConsistenciaModule } from './modulos/analisisconsistencia/analisisconsistencia.module';
import { NgApexchartsModule } from "ng-apexcharts";
 
import { NivelCaudalModule } from './modulos/configuracion/nivel-caudal/nivel-caudal.module'; 
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode'; 
import { NgSelect2Module } from 'ng-select2';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { PublicacionInformacionModule } from './modulos/Publicacion-informacion/publicacion-Informacion.module'; 
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http,'./assets/i18n/','.json');
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    NavbarComponent,
    MenuIzquierdoComponent,
    InicioComponent,
    PageNotFoundComponent,  
  
  ],
  imports: [
    BrowserModule,
    RouterModule,
    routing,
    FontAwesomeModule,
    FormsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: (HttpLoaderFactory),
          deps: [HttpClient]
      }
  }),
  ProcesarArchivosModule,
  NgxChartsModule,
  BrowserAnimationsModule,  
  SeriestiempoModule,
  AnalisisConsistenciaModule,
  NgxQRCodeModule,
  NivelCaudalModule,
  NgSelect2Module,
  PublicacionInformacionModule,
  NgApexchartsModule 

  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'en' },
    { provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true },
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  //exports:[DatatableComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
})

export class AppModule {}