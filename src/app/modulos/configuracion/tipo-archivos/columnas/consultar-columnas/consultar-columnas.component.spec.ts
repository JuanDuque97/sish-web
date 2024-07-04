import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { DataTablesModule } from 'angular-datatables';
import { of } from 'rxjs';
import { ServiciosArchivoColumnas } from '../../servicios-archivo-columnas.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { ConsultarColumnasComponent } from './consultar-columnas.component';
import Swal from 'sweetalert2';

describe('ConsultarColumnasComponent', () => {
  let component: ConsultarColumnasComponent;
  let fixture: ComponentFixture<ConsultarColumnasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        DataTablesModule,
        HttpClientTestingModule,
        TranslateModule.forRoot(),
      ],
      declarations: [ConsultarColumnasComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultarColumnasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should obtenerValores', () => {
    const serviciosArchivoColumnas =
      fixture.debugElement.injector.get<ServiciosArchivoColumnas>(
        ServiciosArchivoColumnas as any
      );
    spyOn(serviciosArchivoColumnas, 'obtenerDTO').and.returnValue(
      of([
        {
          tipoDato: 'String',
          tipoArchivoColumna: 'String',
          tipoContenido: 'String',
          idTipoArchivoConfigurado: 1,
          idTipoArchivoColumna: 1,
          tipoArchivoConfigurado: 'String',
          numeroColumna: 1,
          idTipoDato: 1,
          formatoOrigen: 'String',
          formatoDestino: 'String',
          posicionInicial: 1,
          posicionFinal: 1,
          idTipoContenido: 1,
          separador: 'String',
        },
      ])
    );
    
    var idArchivo:number = 1; 
    component.obtenerValores(idArchivo); 
    expect(component.datosFilter.length).toEqual(1);
  });

  it('Accion registro Eliminar', () => {
    const e = {
      accion: 'eliminar',
      registro: {
        tipoDato: 'String',
        tipoArchivoColumna: 'String',
        tipoContenido: 'String',
        idTipoArchivoConfigurado: 1,
        idTipoArchivoColumna: 1,
        tipoArchivoConfigurado: 'String',
        numeroColumna: 1,
        idTipoDato: 1,
        formatoOrigen: 'String',
        formatoDestino: 'String',
        posicionInicial: 1,
        posicionFinal: 1,
        idTipoContenido: 1,
        separador: 'String',
      },
    };

    component.accionRegistroColumnas(e);
    expect(component).toBeTruthy();
  });

  it('eliminar', () => {
    const id = 1;
    const serviciosArchivoColumnas =
      fixture.debugElement.injector.get<ServiciosArchivoColumnas>(
        ServiciosArchivoColumnas as any
      );

    spyOn(serviciosArchivoColumnas, 'eliminar').and.returnValue(
      of({
        idTipoArchivoColumna: 1,
        tipoArchivosColumna: 'String',
        idTipoArchivoConfigurado: 1,
        numeroColumna: 1,
        idTipoDato: 1,
        formatoOrigen: 'String',
        formatoDestino: 'String',
        posicionInicial: 1,
        posicionFinal: 1,
        idTipoContenido: 1,
      })
    );

    spyOn(component, 'eliminar');
    component.eliminar(id);
    expect(Swal.isVisible()).toBeTruthy();
    Swal.clickConfirm();
    setTimeout(() => {
      
    expect(component.eliminar).toBeTruthy();
    });
    
  });
});
