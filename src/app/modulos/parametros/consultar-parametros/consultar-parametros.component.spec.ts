import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'; 
import { RouterTestingModule } from '@angular/router/testing';
import { DataTablesModule } from 'angular-datatables';
import { TranslateModule } from '@ngx-translate/core';
import { ServiciosParametrosService } from '../servicios-parametros.service'; 
import { ConsultarParametrosComponent } from './consultar-parametros.component';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ConsultarParametrosComponent', () => {
  let component: ConsultarParametrosComponent;
  let fixture: ComponentFixture<ConsultarParametrosComponent>; 
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
        imports: [
          RouterTestingModule ,
          DataTablesModule,
          HttpClientTestingModule,
          TranslateModule.forRoot()
        ],
        providers: [ ServiciosParametrosService ] ,
      declarations: [ ConsultarParametrosComponent ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents();
  });


  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultarParametrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Obtener Lista Parametros', () => {
    const serviciosParametrosService =
    fixture.debugElement.injector.get<ServiciosParametrosService>(
      ServiciosParametrosService as any
    );
    spyOn(serviciosParametrosService, 'obtenerListaParametros').and.returnValue(
      of([
        {
          idParametro: 1,
          activo:'string',
          codigo:1,
          descripcion:'string',
          fechaCreacion:'string',
          fechaEstado:'string',
          fechaModificacion:'string',
          idMetodo: 1,
          idPeriodo:1,
          idTipoParametro: 1,
          idUnidadMedida: 1,
          parametro:'string',
          usuarioCreacion:'string',
          usuarioEstado:'string',
          usuarioModificacion:'string',
          nombreMetodo: 'string',
          nombreTipoParametro: 'string',
          nombreUnidadMedida: 'string'
        },
      ])
    );
    component.obtenerListaParametros();
    expect(component.datosFilter.length).toEqual(1); 
  });

  it('Accion registro Activar', () => {
    const e = {
      accion: 'activar',
      registro: {
        idParametro: 1,
          activo:'S',
          codigo:1,
          descripcion:'string',
          fechaCreacion:'string',
          fechaEstado:'string',
          fechaModificacion:'string',
          idMetodo: 1,
          idPeriodo:1,
          idTipoParametro: 1,
          idUnidadMedida: 1,
          parametro:'string',
          usuarioCreacion:'string',
          usuarioEstado:'string',
          usuarioModificacion:'string',
          nombreMetodo: 'string',
          nombreTipoParametro: 'string',
          nombreUnidadMedida: 'string'
      },
    };

    component.accionRegistro(e);
    expect(component).toBeTruthy();
  });
  it('Accion registro Inactivar', () => {
    const e = {
      accion: 'inactivar',
      registro: {
        idParametro: 1,
        activo:'N',
        codigo:1,
        descripcion:'string',
        fechaCreacion:'string',
        fechaEstado:'string',
        fechaModificacion:'string',
        idMetodo: 1,
        idPeriodo:1,
        idTipoParametro: 1,
        idUnidadMedida: 1,
        parametro:'string',
        usuarioCreacion:'string',
        usuarioEstado:'string',
        usuarioModificacion:'string',
        nombreMetodo: 'string',
        nombreTipoParametro: 'string',
        nombreUnidadMedida: 'string'
      },
    };

    component.accionRegistro(e);
    expect(component).toBeTruthy();
  });

  it('actualizar parametro',()=>{
    const serviciosParametrosService =
    fixture.debugElement.injector.get<ServiciosParametrosService>(
      ServiciosParametrosService as any
    );
  spyOn(serviciosParametrosService, 'actualizar').and.returnValue(
    of({
      idParametro: 1,
      idVariable:1,
      activo:'string',
      codigo:'string',
      descripcion:'string',
      fechaCreacion:'string',
      fechaEstado:'string',
      fechaModificacion:'string',
      idMetodo: 1,
      idTipoParametro: 1,
      idUnidadMedida: 1,
      idPeriodo: 1,
      usuarioCreacion:'string',
      usuarioEstado:'string',
      usuarioModificacion:'string' 
    })
  );

  const parametro = {
    idParametro: 1,
    idVariable:1,
    activo:'string',
    codigo:'string',
    descripcion:'string',
    fechaCreacion:'string',
    fechaEstado:'string',
    fechaModificacion:'string',
    idMetodo: 1,
    idTipoParametro: 1,
    idUnidadMedida: 1,
    idPeriodo: 1,
    usuarioCreacion:'string',
    usuarioEstado:'string',
    usuarioModificacion:'string' 
  };
  component.actualizar(parametro);

  expect(component.actualizar.length).toEqual(1);
  });

});

 
