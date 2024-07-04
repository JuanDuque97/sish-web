import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { DataTablesModule } from 'angular-datatables';
import { of } from 'rxjs';
import { ServiciosArchivoConfigurado } from '../servicios-archivo-configurado.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { ConsultarConfiguradosComponent } from './consultar-configurados.component';

describe('ConsultarConfiguradosComponent', () => {
  let component: ConsultarConfiguradosComponent;
  let fixture: ComponentFixture<ConsultarConfiguradosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        DataTablesModule,
        HttpClientTestingModule,
        TranslateModule.forRoot()
      ],
      providers:[ServiciosArchivoConfigurado],
      declarations: [ ConsultarConfiguradosComponent ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultarConfiguradosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it ('obtener Archivos' ,() =>{
    const serviciosArchivoConfigurado =
        fixture.debugElement.injector.get<ServiciosArchivoConfigurado>(
          ServiciosArchivoConfigurado as any
        );
      spyOn(serviciosArchivoConfigurado, 'obtenerDTO').and.returnValue(
        of([
          {
            fechaCreacion :'string',
            idTipoArchivo: 0,
            idTipoFraccionamiento: 0,
            idUbicacionDatos: 0,
            separador :'string',
            contieneEncabezado:'string',
            contieneResumen:'string',
            separadorDecimal :'string',
            idFrecuenciaTemporal: 0,
            intervaloFrecuenciaTemporal :'string',
            idTipoCodificacion:0,
            activo:'string',
            fechaEstado:'string',
            usuarioEstado :'string',
            fechaModificacion:'string',
            usuarioCreacion :'string',
            usuarioModificacion :'string',
            calificadorTexto :'string',
            tipoCodificacion:'string',
            tipoFraccionamiento:'string',
            frecuenciaTemporal:'string',
            tipoArchivo:'string',
            ubicacionDatos:'string',
            idTipoArchivoConfigurado : 0,
            tipoArchivoConfigurado :'string',
          },
        ])
      );
      component.ngOnInit();
      expect(component.datosFilter.length).toEqual(1);
   }
   
   );
  

   it('Accion registro Activar', () => {
    const e = {
      accion: 'activar',
      registro: {
        idParametro: 1,
        idTipoArchivoConfigurado:0,
        tipoarchivoconfigurado:0,
        idTipoArchivo:0,
        idTipoFraccionamiento:0,
        idUbicacionDatos:0,
        separador: 'string',
        calificadorTexto: 'string',
        contieneEncabezado: 'string',
        contieneResumen: 'string',
        separadorDecimal: 'string',
        idFrecuenciaTemporal:0,
        intervaloFrecuenciaTemporal:0,
        idTipoCodificacion:0,
        activo: 'S',
        fechaCreacion: 'string',
        fechaEstado: 'string',
        fechaModificacion: 'string',
        usuarioCreacion: 'string',
        usuarioEstado: 'string',
        usuarioModificacion: 'string',
        calificacionTexto:'string',
      },
    };

    component.accionRegistro(e);
    expect(component).toBeTruthy();
  });
  it('Accion registro Inactivar', () => {
    const e = {
      accion: 'inactivar',
      registro: {
        idTipoArchivoConfigurado:0,
        tipoarchivoconfigurado:0,
        idTipoArchivo:0,
        idTipoFraccionamiento:0,
        idUbicacionDatos:0,
        separador: 'string',
        calificadorTexto: 'string',
        contieneEncabezado: 'string',
        contieneResumen: 'string',
        separadorDecimal: 'string',
        idFrecuenciaTemporal:0,
        intervaloFrecuenciaTemporal:0,
        idTipoCodificacion:0,
        activo: 'N',
        fechaCreacion: 'string',
        fechaEstado: 'string',
        fechaModificacion: 'string',
        usuarioCreacion: 'string',
        usuarioEstado: 'string',
        usuarioModificacion: 'string',
        calificacionTexto:'string',
      },
    };

    component.accionRegistro(e);
    expect(component).toBeTruthy();
  });

   it('Actualizar Configurados', () => {
    const serviciosArchivoConfigurado =
      fixture.debugElement.injector.get<ServiciosArchivoConfigurado>(
        ServiciosArchivoConfigurado as any
      );
    spyOn(serviciosArchivoConfigurado, 'actualizar').and.returnValue(
      of({
        idTipoArchivoConfigurado:0,
        tipoarchivoconfigurado:0,
        idTipoArchivo:0,
        idTipoFraccionamiento:0,
        idUbicacionDatos:0,
        separador: 'string',
        calificadorTexto: 'string',
        contieneEncabezado: 'string',
        contieneResumen: 'string',
        separadorDecimal: 'string',
        idFrecuenciaTemporal:0,
        intervaloFrecuenciaTemporal:0,
        idTipoCodificacion:0,
        activo: 'string',
        fechaCreacion: 'string',
        fechaEstado: 'string',
        fechaModificacion: 'string',
        usuarioCreacion: 'string',
        usuarioEstado: 'string',
        usuarioModificacion: 'string',
        calificacionTexto:'string',
      })
    );
  
    const archivosConfigurados = {
      idTipoArchivoConfigurado:0,
      tipoarchivoconfigurado:0,
      idTipoArchivo:0,
      idTipoFraccionamiento:0,
      idUbicacionDatos:0,
      separador: 'string',
      calificadorTexto: 'string',
      contieneEncabezado: 'string',
      contieneResumen: 'string',
      separadorDecimal: 'string',
      idFrecuenciaTemporal:0,
      intervaloFrecuenciaTemporal:0,
      idTipoCodificacion:0,
      activo: 'string',
      fechaCreacion: 'string',
      fechaEstado: 'string',
      fechaModificacion: 'string',
      usuarioCreacion: 'string',
      usuarioEstado: 'string',
      usuarioModificacion: 'string',
      calificacionTexto:'string',
    }; 
    component.actualizar(archivosConfigurados);
    expect(component.actualizar.length).toEqual(1);
    // console.log('se actualizo',component.actualizar.length)
  });

});
