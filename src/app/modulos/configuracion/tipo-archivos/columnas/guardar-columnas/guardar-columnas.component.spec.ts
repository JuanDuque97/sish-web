import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GuardarColumnasComponent } from './guardar-columnas.component';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NgSelect2Module } from 'ng-select2';
import { ServiciosParametrosService } from '../../../../parametros/servicios-parametros.service';
import { ServiciosArchivoColumnas } from '../../servicios-archivo-columnas.service';
import { of } from 'rxjs';
import Swal from 'sweetalert2';
import { ServiciosDominiosValoresService } from '../../../dominios/servicios-dominios-valores.service';

describe('GuardarColumnasComponent', () => {
  let component: GuardarColumnasComponent;
  let fixture: ComponentFixture<GuardarColumnasComponent>;

  const formBuilder: FormBuilder = new FormBuilder();
  const fb = jasmine.createSpyObj('FormBuilder', ['group']);
  const formGroup = new FormGroup({
    identityVerificationDocumentTypeId: new FormControl(
      'formularioArchivoColumnas'
    ),
  });
  (<jasmine.Spy>fb.group).and.returnValue(formGroup);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
        NgSelect2Module,
      ],
      providers: [
        ServiciosArchivoColumnas,
        ServiciosParametrosService,
        {
          provider: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ id: '1', ac: 'E',  ta :'1' }),
            },
          },
        },
        {
          provide: FormBuilder,
          useValue: formBuilder,
        },
      ],
      declarations: [GuardarColumnasComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GuardarColumnasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should llamar obtenerPorId ', () => {
    const serviciosArchivoColumnas =
      fixture.debugElement.injector.get<ServiciosArchivoColumnas>(
        ServiciosArchivoColumnas as any
      );
    spyOn(serviciosArchivoColumnas, 'obtenerPorId').and.returnValue(
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

    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  it('guardar Columnas crear', () => {

    component.formularioArchivoColumnas.controls['separador'].setValue(',');

    const serviciosArchivoColumnas =
      fixture.debugElement.injector.get<ServiciosArchivoColumnas>(
        ServiciosArchivoColumnas as any
      );
    spyOn(serviciosArchivoColumnas, 'crear').and.returnValue(
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
component.guardar();
    expect(Swal.isVisible()).toBeTruthy(); 
    Swal.clickConfirm();
    setTimeout(() => {
      expect(component.guardar).toHaveBeenCalled();
    });
 
  });

  it('guardar Columnas actualizar', () => {
    const serviciosArchivoColumnas =
      fixture.debugElement.injector.get<ServiciosArchivoColumnas>(
        ServiciosArchivoColumnas as any
      );
    spyOn(serviciosArchivoColumnas, 'actualizar').and.returnValue(
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

    component.formularioArchivoColumnas.controls[
      'idTipoArchivoConfigurado'
    ].setValue(1);
    component.formularioArchivoColumnas.controls[
      'idTipoArchivoColumna'
    ].setValue(1);
    component.formularioArchivoColumnas.controls['formatoDestino'].setValue(1);
    component.formularioArchivoColumnas.controls['formatoOrigen'].setValue(1);
    component.formularioArchivoColumnas.controls['idTipoContenido'].setValue(1);
    component.formularioArchivoColumnas.controls['idTipoDato'].setValue(1);
    component.formularioArchivoColumnas.controls['numeroColumna'].setValue(1);
    component.formularioArchivoColumnas.controls['posicionFinal'].setValue(1);
    component.formularioArchivoColumnas.controls['posicionInicial'].setValue(1);
    component.formularioArchivoColumnas.controls['separador'].setValue(',');
    component.formularioArchivoColumnas.controls[
      'tipoArchivosColumna'
    ].setValue(1);

    component.id = '1'
    component.guardar();
    expect(component.guardar).toBeTruthy();
  });

  it('Validar Propiedades Formulario', () => {
    const serviciosArchivoColumnas =
      fixture.debugElement.injector.get<ServiciosArchivoColumnas>(
        ServiciosArchivoColumnas as any
      );
    spyOn(serviciosArchivoColumnas, 'obtenerPorId').and.returnValue(
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
    

    const serviciosDominiosValoresService =
    fixture.debugElement.injector.get<ServiciosDominiosValoresService>(
      ServiciosDominiosValoresService as any
    );

    spyOn(serviciosDominiosValoresService, 'obtenerValoresPorIdDominio').and.returnValue(
      of({
        idDominioValor: 1,
        idDominio: 1,
        activo:"string",
        dominioValor: "string",
        fechaCreacion: 'string',
        fechaModificacion: 'string',
        usuarioCreacion:'string',
        usuarioModificacion: 'string'
      })
    );

    


    expect(component.formatoDestino).toEqual(
      component.formularioArchivoColumnas.controls['formatoDestino']
    );
    expect(component.formatoOrigen).toEqual(
      component.formularioArchivoColumnas.controls['formatoOrigen']
    );
    expect(component.idTipoContenido).toEqual(
      component.formularioArchivoColumnas.controls['idTipoContenido']
    );
    expect(component.idTipoDato).toEqual(
      component.formularioArchivoColumnas.controls['idTipoDato']
    );
    expect(component.numeroColumna).toEqual(
      component.formularioArchivoColumnas.controls['numeroColumna']
    );
    expect(component.posicionFinal).toEqual(
      component.formularioArchivoColumnas.controls['posicionFinal']
    );
    expect(component.posicionInicial).toEqual(
      component.formularioArchivoColumnas.controls['posicionInicial']
    );
    expect(component.separador).toEqual(
      component.formularioArchivoColumnas.controls['separador']
    );
    expect(component.tipoArchivosColumna).toEqual(
      component.formularioArchivoColumnas.controls['tipoArchivosColumna']
    );


    component.ngOnInit();

  });
});
