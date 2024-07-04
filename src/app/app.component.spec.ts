import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { DataTablesModule } from 'angular-datatables';
import { AppComponent } from './app.component';
import { FooterComponent } from './common/layout/footer/footer.component';
import { HeaderComponent } from './common/layout/header/header.component';
import { MenuIzquierdoComponent } from './common/layout/menu-izquierdo/menu-izquierdo.component';
import { NavbarComponent } from './common/layout/navbar/navbar.component';
import { InicioComponent } from './inicio/inicio.component';
import { PageNotFoundComponent } from './pagenotfound/pagenotfound.component';
import { BrowserTestingModule } from '@angular/platform-browser/testing';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
//import { ProcesarArchivosComponent } from './modulos/configuracion/procesar-archivos/procesar-archivos.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgSelect2Module } from 'ng-select2';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        DataTablesModule,
        HttpClientTestingModule, 
        TranslateModule.forRoot(),
        BrowserTestingModule,
        FontAwesomeModule,
        FormsModule,
        NgxChartsModule,
        NgSelect2Module

      ],
      declarations: [
        AppComponent,
    HeaderComponent,
    FooterComponent,
    NavbarComponent,
    MenuIzquierdoComponent,
    InicioComponent,
    PageNotFoundComponent,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  // it('should render title', () => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   fixture.detectChanges();
  //   const compiled = fixture.nativeElement as HTMLElement;
  //   expect(compiled.querySelector('.content span')?.textContent).toContain('sish-frontend app is running!');
  // });
});
