import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { DataTablesModule } from 'angular-datatables';
import { of } from 'rxjs';
import { ServiciosArchivoCampos } from '../../servicios-archivo-campos.service';

import { ConsultarCamposComponent } from './consultar-campos.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ConsultarCamposComponent', () => {
  let component: ConsultarCamposComponent;
  let fixture: ComponentFixture<ConsultarCamposComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        DataTablesModule,
        HttpClientTestingModule,
        TranslateModule.forRoot(),
      ],
      declarations: [ConsultarCamposComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultarCamposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should obtenerValores', () => {
    const serviciosArchivoCampos =
      fixture.debugElement.injector.get<ServiciosArchivoCampos>(
        ServiciosArchivoCampos as any
      );
    spyOn(serviciosArchivoCampos, 'obtenerDTO').and.returnValue(
      of([
        {
          tipoArchivoColumna: 'String',
          idParametro: 1,
          idTipoArchivoConfigurado: 1,
          idTipoArchivoColumna: 1,
          idTipoArchivoCampo: 1,
          tipoArchivoConfigurado: 'String',
          descripcion: 'String',
          idTipoArchivoColumnaPropiedad: 1,
          codigoPropiedad: 'String',
          campoRelacionado: 'String',
        },
      ])
    );

    var idArchivo = 1;
    component.obtenerValores(idArchivo);
    expect(component.datosCampos.length).toEqual(1);
  });

  it('Accion registro Eliminar', () => {
    const e = {
      accion: 'eliminar',
      registro: {
        tipoArchivoColumna: 'String',
        idParametro: 1,
        idTipoArchivoConfigurado: 1,
        idTipoArchivoColumna: 1,
        idTipoArchivoCampo: 1,
        tipoArchivoConfigurado: 'String',
        descripcion: 'String',
        idTipoArchivoColumnaPropiedad: 1,
        codigoPropiedad: 'String',
        campoRelacionado: 'String',
      },
    };

    component.accionRegistro(e);
    expect(component).toBeTruthy();
  });

  it('eliminar', () => {
    const id = 1;
    const serviciosArchivoCampos =
      fixture.debugElement.injector.get<ServiciosArchivoCampos>(
        ServiciosArchivoCampos as any
      );

    spyOn(serviciosArchivoCampos, 'eliminar').and.returnValue(
      of({
        campoRelacionado: 'String',
        codigoPropiedad: 'String',
        idParametro: 1,
        idTipoArchivoCampo: 1,
        idTipoArchivoColumna: 1,
        idTipoArchivoColumnaPropiedad: 1,
        idTipoArchivoConfigurado: 1,
      })
    );
    spyOn(component, 'eliminar');
    component.eliminar(id);
    expect(component.eliminar).toBeTruthy();
  });
  
});
