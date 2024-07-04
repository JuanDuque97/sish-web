import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NgSelect2Module } from 'ng-select2';
import { of } from 'rxjs';
import Swal from 'sweetalert2';
import { ServiciosDominiosValoresService } from '../../../configuracion/dominios/servicios-dominios-valores.service';
import { ServiciosRolesService } from '../servicios-roles.service';

import { GuardarRolesComponent } from './guardar-roles.component';

describe('GuardarRolesComponent', () => {
  let component: GuardarRolesComponent;
  let fixture: ComponentFixture<GuardarRolesComponent>;

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
        ServiciosRolesService,
        ServiciosDominiosValoresService,
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
      declarations: [GuardarRolesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GuardarRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {  
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

    expect(component.rol).toEqual(component.formularioRol.controls['rol']);
    expect(component.descripcion).toEqual(
      component.formularioRol.controls['descripcion']
    );
    expect(component.activo).toEqual(
      component.formularioRol.controls['activo']
    );

    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  it('guaradar new Rol', () => {
    const serviciosRolesService =
      fixture.debugElement.injector.get<ServiciosRolesService>(
        ServiciosRolesService as any
      );
    spyOn(serviciosRolesService, 'crear').and.returnValue(
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

    component.ngOnInit();
    component.id = '0';
    component.formularioRol.controls['idRol'].setValue(0);
    component.formularioRol.controls['rol'].setValue('ROL');
    component.formularioRol.controls['descripcion'].setValue('TEST');
    component.formularioRol.controls['activo'].setValue('S');

    component.guardar();
    expect(Swal.isVisible()).toBeTruthy();
    Swal.clickConfirm();
    expect(serviciosRolesService.crear).toHaveBeenCalled();
  });

  it('guaradar actualizar Rol', () => {
    const serviciosRolesService =
      fixture.debugElement.injector.get<ServiciosRolesService>(
        ServiciosRolesService as any
      );
    spyOn(serviciosRolesService, 'actualizar').and.returnValue(
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

    component.id = '1';
    component.formularioRol.controls['idRol'].setValue(0);
    component.formularioRol.controls['rol'].setValue('ROL');
    component.formularioRol.controls['descripcion'].setValue('TEST');
    component.formularioRol.controls['activo'].setValue('S');

    expect(component.ngOnInit).toHaveBeenCalled();
    component.guardar();

    expect(Swal.isVisible()).toBeTruthy();
    Swal.clickConfirm();
    expect(serviciosRolesService.actualizar).toHaveBeenCalled();
  });
});
