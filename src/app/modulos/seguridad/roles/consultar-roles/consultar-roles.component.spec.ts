import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConsultarRolesComponent } from './consultar-roles.component';
import { RouterTestingModule } from '@angular/router/testing';
import { DataTablesModule } from 'angular-datatables';
import { TranslateModule } from '@ngx-translate/core';
import { ServiciosRolesService } from '../servicios-roles.service';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ConsultarRolesComponent', () => {
  let component: ConsultarRolesComponent;
  let fixture: ComponentFixture<ConsultarRolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule ,
        DataTablesModule,
        HttpClientTestingModule,
        TranslateModule.forRoot(),
      ],
      providers: [ServiciosRolesService],
      declarations: [ConsultarRolesComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultarRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('obtener Roles', () => {
    // se crean los objetnos que se necesiten
    const serviciosRolesService =
      fixture.debugElement.injector.get<ServiciosRolesService>(
        ServiciosRolesService as any
      );
    spyOn(serviciosRolesService, 'obtener').and.returnValue(
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
    // se ejecuta el metodo
    component.ngOnInit();
    // Validar  los resultados de la prueba
    expect(component.datosFilter.length).toEqual(1);
  });

  it('Accion registro Activar', () => {
    const e = {
      accion: 'activar',
      registro: {
        idRol: 1,
        rol: 'string',
        descripcion: 'string',
        activo:'S',
        fechaCreacion: 'string',
        fechaModificacion: 'string',
        fechaEstado: 'string',
        usuarioCreacion:'string',
        usuarioModificacion: 'string',
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
        idRol: 1,
        rol: 'string',
        descripcion: 'string',
        activo:'N',
        fechaCreacion: 'string',
        fechaModificacion: 'string',
        fechaEstado: 'string',
        usuarioCreacion:'string',
        usuarioModificacion: 'string',
        usuarioEstado: 'string'
      },
    };

    component.accionRegistro(e);
    expect(component).toBeTruthy();
  });
  it('Accion registro permisos', () => {
    const e = {
      accion: 'permisos',
      registro: {
        idRol: 1,
        rol: 'string',
        descripcion: 'string',
        activo:'N',
        fechaCreacion: 'string',
        fechaModificacion: 'string',
        fechaEstado: 'string',
        usuarioCreacion:'string',
        usuarioModificacion: 'string',
        usuarioEstado: 'string'
      },
    };

    component.accionRegistro(e);
    expect(component).toBeTruthy();
  });


  it('Actualizar Rol', () => {
    const serviciosRolesService =
      fixture.debugElement.injector.get<ServiciosRolesService>(
        ServiciosRolesService as any
      );
    spyOn(serviciosRolesService, 'actualizar').and.returnValue(
      of({
        idRol: 1,
        rol: 'string',
        descripcion: 'string',
        activo: 'S',
        fechaCreacion: 'string',
        fechaModificacion: 'string',
        fechaEstado: 'string',
        usuarioCreacion: 'string',
        usuarioModificacion: 'string',
        usuarioEstado: 'string',
      })
    );

    const Rol = {
      idRol: 1,
      rol: 'string',
      descripcion: 'string',
      activo: 'N',
      fechaCreacion: 'string',
      fechaModificacion: 'string',
      fechaEstado: 'string',
      usuarioCreacion: 'string',
      usuarioModificacion: 'string',
      usuarioEstado: 'string',
    }; 
    component.actualizar(Rol);
    expect(component.actualizar.length).toEqual(1);
    // console.log('se actualizo',component.actualizar.length)  
  });
});
