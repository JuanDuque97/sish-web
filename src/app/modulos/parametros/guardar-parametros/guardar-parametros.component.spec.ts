import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormControl,
} from '@angular/forms';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NgSelect2Module } from 'ng-select2';
import { GuardarParametrosComponent } from './guardar-parametros.component';
import { ServiciosParametrosService } from '../servicios-parametros.service';
import { of } from 'rxjs';
import { ServiciosDominiosValoresService } from '../../configuracion/dominios/servicios-dominios-valores.service';
import Swal from 'sweetalert2';

describe('GuardarParametrosComponent', () => {
  let componentTest: GuardarParametrosComponent;
  let fixture: ComponentFixture<GuardarParametrosComponent>;

  const formBuilder: FormBuilder = new FormBuilder();
  const fb = jasmine.createSpyObj('FormBuilder', ['group']);
  const formGroup = new FormGroup({
    identityVerificationDocumentTypeId: new FormControl('formularioParametros'),
    addressVerificationDocumentTypeId: new FormControl('test!'),
  });
  (<jasmine.Spy>fb.group).and.returnValue(formGroup);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'configuracion/parametros', component: GuardarParametrosComponent}
      ]),
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
        NgSelect2Module,
      ],
      providers: [
        ServiciosParametrosService,
        ServiciosDominiosValoresService,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ id: '1', ac: 'E' }),
            },
          },
        },
        {
          provide: FormBuilder,
          useValue: formBuilder,
        },
      ],
      declarations: [GuardarParametrosComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GuardarParametrosComponent);
    componentTest = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should obtencion parametro', () => {
    const serviciosDominiosValoresService =
      fixture.debugElement.injector.get<ServiciosDominiosValoresService>(
        ServiciosDominiosValoresService as any
      );
    spyOn(
      serviciosDominiosValoresService,
      'obtenerValoresPorIdDominio'
    ).and.returnValue(
      of([
        {
          id: 1,
          text: 'Prueba',
          disabled: false,
        },
      ])
    );

    expect(componentTest.codigo).toEqual(
      componentTest.formularioParametros.controls['codigo']
    );
    expect(componentTest.idMetodo).toEqual(
      componentTest.formularioParametros.controls['idMetodo']
    );
    expect(componentTest.idTipoParametro).toEqual(
      componentTest.formularioParametros.controls['idTipoParametro']
    );
    expect(componentTest.idUnidadMedida).toEqual(
      componentTest.formularioParametros.controls['idUnidadMedida']
    );
    expect(componentTest.activo).toEqual(
      componentTest.formularioParametros.controls['activo']
    );
    expect(componentTest.descripcion).toEqual(
      componentTest.formularioParametros.controls['descripcion']
    );
    expect(componentTest.parametro).toEqual(
      componentTest.formularioParametros.controls['idVariable']
    );

    componentTest.ngOnInit();

    expect(componentTest).toBeTruthy();
  });

  it('should guaradar new Parámetro', () => {
    const serviciosParametrosService =
      fixture.debugElement.injector.get<ServiciosParametrosService>(
        ServiciosParametrosService as any
      );
    spyOn(serviciosParametrosService, 'crear').and.returnValue(
      of({
        idParametro: 1,
        idVariable: 1,
        activo: 'string',
        codigo: 'string',
        descripcion: 'string',
        fechaCreacion: 'string',
        fechaEstado: 'string',
        fechaModificacion: 'string',
        idMetodo: 1,
        idTipoParametro: 1,
        idUnidadMedida: 1,
        idPeriodo: 1,
        usuarioCreacion: 'string',
        usuarioEstado: 'string',
        usuarioModificacion: 'string',
      })
    );
    spyOn(serviciosParametrosService, 'obtenerPorId').and.returnValue(
      of({
        idParametro: 1,
        idVariable: 1,
        activo: 'string',
        codigo: 'string',
        descripcion: 'string',
        fechaCreacion: 'string',
        fechaEstado: 'string',
        fechaModificacion: 'string',
        idMetodo: 1,
        idTipoParametro: 1,
        idUnidadMedida: 1,
        idPeriodo: 1,
        usuarioCreacion: 'string',
        usuarioEstado: 'string',
        usuarioModificacion: 'string',
      })
    );
    spyOn(componentTest, 'ngOnInit');
    componentTest.ngOnInit();
    componentTest.id = '0';
    componentTest.formularioParametros.controls['idParametro'].setValue(0);
    componentTest.formularioParametros.controls['idVariable'].setValue(1);
    componentTest.formularioParametros.controls['idUnidadMedida'].setValue(2);
    componentTest.formularioParametros.controls['idTipoParametro'].setValue(3);
    componentTest.formularioParametros.controls['idMetodo'].setValue(4);
    componentTest.formularioParametros.controls['codigo'].setValue(5);
    expect(componentTest.ngOnInit).toHaveBeenCalled();

    componentTest.guardar();
    expect(Swal.isVisible()).toBeTruthy();
    Swal.clickConfirm();
    expect(serviciosParametrosService.crear).toHaveBeenCalled();
  });

  it('should guaradar actualizar Parámetro', () => {
    const serviciosParametrosService =
      fixture.debugElement.injector.get<ServiciosParametrosService>(
        ServiciosParametrosService as any
      );
    spyOn(serviciosParametrosService, 'actualizar').and.returnValue(
      of({
        idParametro: 1,
        idVariable: 1,
        activo: 'string',
        codigo: 'string',
        descripcion: 'string',
        fechaCreacion: 'string',
        fechaEstado: 'string',
        fechaModificacion: 'string',
        idMetodo: 1,
        idTipoParametro: 1,
        idUnidadMedida: 1,
        idPeriodo: 1,
        usuarioCreacion: 'string',
        usuarioEstado: 'string',
        usuarioModificacion: 'string',
      })
    );

    spyOn(componentTest, 'ngOnInit');
    componentTest.ngOnInit();
    componentTest.id = '1';
    componentTest.formularioParametros.controls['idParametro'].setValue(0);
    componentTest.formularioParametros.controls['idVariable'].setValue(1);
    componentTest.formularioParametros.controls['idUnidadMedida'].setValue(2);
    componentTest.formularioParametros.controls['idTipoParametro'].setValue(3);
    componentTest.formularioParametros.controls['idMetodo'].setValue(4);
    componentTest.formularioParametros.controls['codigo'].setValue(5);
    expect(componentTest.ngOnInit).toHaveBeenCalled();
    componentTest.guardar();
    expect(serviciosParametrosService.actualizar).toHaveBeenCalled();
    // expect(componentTest.guardar.length).toEqual(1);
  });

  it('tipoModelo', () => {
    const serviciosDominiosValoresService =
      fixture.debugElement.injector.get<ServiciosDominiosValoresService>(
        ServiciosDominiosValoresService as any
      );
    spyOn(
      serviciosDominiosValoresService,
      'obtenerValoresPorIdDominio'
    ).and.returnValue(
      of([
        {
          id: 1,
          text: 'Prueba',
          disabled: false,
        },
      ])
    );
    const tipoSelected = 37;
    componentTest.tipoModelo(tipoSelected);
    expect(
      serviciosDominiosValoresService.obtenerListadoMetodoxTipo.length
    ).toEqual(1);
  });
});
