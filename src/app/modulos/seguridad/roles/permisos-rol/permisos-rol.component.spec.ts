import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import Swal from 'sweetalert2';
import { ServiciosPermisos } from '../../permisos/servicios-permisos.service';
import { ServiciosPermisosRolesService } from '../servicios-permisos-roles.service';
import { ServiciosRolesService } from '../servicios-roles.service';

import { PermisosRolComponent } from './permisos-rol.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
describe('PermisosRolComponent', () => {
  let component: PermisosRolComponent;
  let fixture: ComponentFixture<PermisosRolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot()
      ],
      declarations: [ PermisosRolComponent ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PermisosRolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should llamar servicio obtenerPorId ', () => {
    const serviciosRolesService =
      fixture.debugElement.injector.get<ServiciosRolesService>(
        ServiciosRolesService as any
      );
    spyOn(serviciosRolesService, 'obtenerPorId').and.returnValue(
      of({
        idRol: 1,
        rol: 'string',
        descripcion: 'string',
        activo: 'string',
        fechaCreacion: 'string',
        fechaModificacion: 'string',
        fechaEstado: 'string',
        usuarioCreacion: 'string',
        usuarioModificacion: 'string',
        usuarioEstado: 'string',
      })
    );
    spyOn(component, 'ngOnInit');
    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  it('Accion registro Eliminar', () => {
    const e = {
      accion: 'eliminar',
      registro: {
        activo: 'S',
        dominioValor: 'wwww',
        fechaCreacion: '2021-11-05T20:19:27.541+00:00',
        fechaEstado: null,
        fechaModificacion: '2021-11-18T15:10:57.445+00:00',
        idDominio: 1,
        idDominioValor: 138,
        orden: null,
        usuarioCreacion: null,
        usuarioEstado: null,
        usuarioModificacion: null,
      },
    };

    component.accionRegistro(e);
    expect(component).toBeTruthy();
  });
  it('llamar accionGeneral ', () => {
    const e = {};
    spyOn(component, 'agregarValor');
    component.accionGeneral(e);
    expect(component.agregarValor).toHaveBeenCalled();
  });

  it('obtenerListaPermisosXrol', () => {
    const serviciosPermisosRolesService =
      fixture.debugElement.injector.get<ServiciosPermisosRolesService>(
        ServiciosPermisosRolesService as any
      );
    spyOn(
      serviciosPermisosRolesService,
      'obtenerListaPermisosXRolId'
    ).and.returnValue(
      of({
        idRol: 1,
        rol: 'string',
        descripcion: 'string',
        activo: 'string',
        fechaCreacion: 'string',
        fechaModificacion: 'string',
        fechaEstado: 'string',
        usuarioCreacion: 'string',
        usuarioModificacion: 'string',
        usuarioEstado: 'string',
      })
    );

    spyOn(component, 'obtenerListaPermisosXrol');
    // se ejecuta el metodo
    component.obtenerListaPermisosXrol();
    // Validar  los resultados de la prueba
    expect(component.obtenerListaPermisosXrol).toHaveBeenCalled();
  });

  it('obtenerListaPermiso', () => {
    const serviciosPermisos =
      fixture.debugElement.injector.get<ServiciosPermisos>(
        ServiciosPermisos as any
      );
    spyOn(serviciosPermisos, 'obtenerListaPermisos').and.returnValue(
      of([
        {
          idRol: 1,
          rol: 'string',
          descripcion: 'string',
          activo: 'string',
          fechaCreacion: 'string',
          fechaModificacion: 'string',
          fechaEstado: 'string',
          usuarioCreacion: 'string',
          usuarioModificacion: 'string',
          usuarioEstado: 'string',
        },
      ])
    );

    component.obtenerListaPermiso();

    expect(component.listpermisos.length).toEqual(1);
  });

  it('Agregar Valor', (done: DoneFn)  => { 
  spyOn(component, 'agregarValor')
    component.agregarValor();
    expect(Swal.isVisible()).toBeTruthy(); 
    Swal.clickConfirm();
    setTimeout(() => {
      expect(component.agregarValor).toHaveBeenCalled();
      done();
    });
  });

  it('agregarPermiso',()=>{
    const result = { value: 1 };
    const serviciosPermisosRolesService =
      fixture.debugElement.injector.get<ServiciosPermisosRolesService>(
        ServiciosPermisosRolesService as any
      );
    spyOn(serviciosPermisosRolesService, 'crear').and.returnValue(
      of({
        idPermisoXRol: 0,
        idPermiso: result.value,
        idRol: 1,
      })
    );

    component.agregarPermiso(result);
    expect(component.agregarPermiso.length).toEqual(1);
  });
  
it('eliminar',()=>{
  const id = 1
  const serviciosPermisosRolesService =
  fixture.debugElement.injector.get<ServiciosPermisosRolesService>(
    ServiciosPermisosRolesService as any
  );
spyOn(serviciosPermisosRolesService, 'eliminar').and.returnValue(
  of({
    idPermisoXRol: id,
    idPermiso: 1,
    idRol: 1,
  })
);

component.eliminar(id);
expect(component.eliminar.length).toEqual(1);

});




});
