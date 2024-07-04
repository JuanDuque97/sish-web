import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { DataTablesModule } from 'angular-datatables';
import { of } from 'rxjs';
import { ServiciosPermisos } from '../servicios-permisos.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { ConsultarPermisosComponent } from './consultar-permisos.component'; 

describe('ConsultarPermisosComponent', () => {
  let component: ConsultarPermisosComponent;
  let fixture: ComponentFixture<ConsultarPermisosComponent>; 
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
        imports: [
          RouterTestingModule ,
          DataTablesModule,
          HttpClientTestingModule,
          TranslateModule.forRoot()
        ],
        providers: [ ServiciosPermisos ] ,
      declarations: [ ConsultarPermisosComponent ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents();
  });


  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultarPermisosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('obtener permisos', () => {
    const serviciosPermisos =
      fixture.debugElement.injector.get<ServiciosPermisos>(
        ServiciosPermisos as any
      );
    spyOn(serviciosPermisos, 'obtener').and.returnValue(
      of([
        {
          idpermiso: 1,
          permiso: 'string',
          descripcion: 'string',
          activo: 'string',
          fechaEstado: 'string',
          usuarioEstado: 'string',
        },
      ])
    );
    component.ngOnInit();
    expect(component.datosFilter.length).toEqual(1);
  });

  it('Accion registro Activar', () => {
    const e = {
      accion: 'activar',
      registro: {
        idpermiso: 1,
        permiso: 'string',
        descripcion: 'string',
        activo:'S', 
        fechaEstado: 'string', 
        usuarioEstado: 'string' 
      },
    };

    component.accionRegistro(e);
    expect(component).toBeTruthy();
  });

  it('Accion registro Inactivar', () => {
    const e = {
      accion: 'inactivar',
      registro: {
        idpermiso: 1,
        permiso: 'string',
        descripcion: 'string',
        activo:'N', 
        fechaEstado: 'string', 
        usuarioEstado: 'string' 
      },
    };

    component.accionRegistro(e);
    expect(component).toBeTruthy();
  });

  it('Actualizar permisos', () => {


    const serviciosPermisos =
    fixture.debugElement.injector.get<ServiciosPermisos>(
      ServiciosPermisos as any
    );
  spyOn(serviciosPermisos, 'actualizar').and.returnValue(
    of({
      idpermiso: 1,
      permiso: 'N',
      descripcion: 'string',
      activo: 'string',
      fechaEstado: 'string',
      usuarioEstado: 'string',
    })
  );

    const permiso = {
      idpermiso: 1,
      permiso: 'S',
      descripcion: 'string',
      activo: 'string',
      fechaEstado: 'string',
      usuarioEstado: 'string',
    }; 
    component.actualizar(permiso); 

    spyOn(component, 'obtener');
    component.obtener();

    expect(component.obtener).toHaveBeenCalled(); 
    expect(component.actualizar.length).toEqual(1);
    // console.log('se actualizo',component.actualizar.length)
  });

  

});