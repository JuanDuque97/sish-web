import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NgSelect2Module } from 'ng-select2';
import { of } from 'rxjs';
import Swal from 'sweetalert2';
import { ServiciosPermisos } from '../servicios-permisos.service';
import { GuardarPermisosComponent } from './guardar-permisos.component';

describe('GuardarPermisosComponent', () => {
  let component: GuardarPermisosComponent;
  let fixture: ComponentFixture<GuardarPermisosComponent>;

  const formBuilder: FormBuilder = new FormBuilder();
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        NgSelect2Module,
      ],
      providers: [
        ServiciosPermisos,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ id: '1' }),
            },
          },
        },
        {
          provide: FormBuilder,
          useValue: formBuilder,
        },
      ],
      declarations: [GuardarPermisosComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GuardarPermisosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {  
      const serviciosPermisosService =
      fixture.debugElement.injector.get<ServiciosPermisos>(
        ServiciosPermisos as any
      ); 

    spyOn(serviciosPermisosService, 'obtenerPorId').and.returnValue(
      of({
        idPermiso: 1,
        permiso: 'string',
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

    expect(component.permiso).toEqual(component.formularioPermiso.controls['permiso']);
    expect(component.descripcion).toEqual(
      component.formularioPermiso.controls['descripcion']
    );
    expect(component.activo).toEqual(
      component.formularioPermiso.controls['activo']
    );

    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  it('guaradar new Permiso', () => {
    const serviciosPermisoService =
      fixture.debugElement.injector.get<ServiciosPermisos>(
        ServiciosPermisos as any
      );
    spyOn(serviciosPermisoService, 'crear').and.returnValue(
      of({
        idPermiso: 1,
        permiso: 'string',
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

    component.ngOnInit();
    component.id = '0';
    component.formularioPermiso.controls['idRol'].setValue(0);
    component.formularioPermiso.controls['rol'].setValue('ROL');
    component.formularioPermiso.controls['descripcion'].setValue('TEST');
    component.formularioPermiso.controls['activo'].setValue('S');

    component.guardar();
    expect(Swal.isVisible()).toBeTruthy();
    Swal.clickConfirm();
    expect(serviciosPermisoService.crear).toHaveBeenCalled();
  });

  it('guaradar actualizar Permiso', () => {
    const serviciosPermisoService =
      fixture.debugElement.injector.get<ServiciosPermisos>(
        ServiciosPermisos as any
      );
    spyOn(serviciosPermisoService, 'actualizar').and.returnValue(
      of({
        idPermiso: 1,
        permiso: 'string',
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

    component.id = '1';
    component.formularioPermiso.controls['idPermiso'].setValue(0);
    component.formularioPermiso.controls['permiso'].setValue('ROL');
    component.formularioPermiso.controls['descripcion'].setValue('TEST');
    component.formularioPermiso.controls['activo'].setValue('S');

    expect(component.ngOnInit).toHaveBeenCalled();
    component.guardar();

    expect(Swal.isVisible()).toBeTruthy();
    Swal.clickConfirm();
    expect(serviciosPermisoService.actualizar).toHaveBeenCalled();
  });
});
