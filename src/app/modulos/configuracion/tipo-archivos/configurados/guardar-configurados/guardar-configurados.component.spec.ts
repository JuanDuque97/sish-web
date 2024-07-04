import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, convertToParamMap,Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NgSelect2Module } from 'ng-select2';
import { of } from 'rxjs';
import Swal from 'sweetalert2';
import { ServiciosDominiosValoresService } from '../../../dominios/servicios-dominios-valores.service';
import { ServiciosArchivoCampos } from '../../servicios-archivo-campos.service';
import { ServiciosArchivoColumnas } from '../../servicios-archivo-columnas.service';
import { ServiciosArchivoConfigurado } from '../servicios-archivo-configurado.service';

import { GuardarConfiguradosComponent } from './guardar-configurados.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { time } from 'console';

describe('GuardarConfiguradosComponent', () => {
  let component: GuardarConfiguradosComponent;
  let fixture: ComponentFixture<GuardarConfiguradosComponent>;

  const fb = jasmine.createSpyObj('FormBuilder', ['group']);
  const formGroup = new FormGroup({
    identityVerificationDocumentTypeId: new FormControl('formularioDominio'),
  });
  (<jasmine.Spy>fb.group).and.returnValue(formGroup);
  const formBuilder: FormBuilder = new FormBuilder();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(
          [{path:'configuracion/tipoarchivos/configurados',component: ServiciosArchivoConfigurado}]
        ),
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
        NgSelect2Module,
      ],
      providers: [
        ServiciosDominiosValoresService,
        ServiciosArchivoConfigurado,
        ServiciosArchivoColumnas,
        ServiciosArchivoCampos,
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
      declarations: [GuardarConfiguradosComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GuardarConfiguradosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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

    spyOn(
      serviciosDominiosValoresService,
      'obtenerValoresPorIdDominio'
    ).and.returnValue(
      of({
        idDominioValor: 1,
        idDominio: 1,
        activo: 'string',
        dominioValor: 'string',
        fechaCreacion: 'string',
        fechaModificacion: 'string',
        usuarioCreacion: 'string',
        usuarioModificacion: 'string',
      })
    );

    expect(component.tipoArchivoConfigurado).toEqual(
      component.formularioArchivoConfigurados.controls['tipoArchivoConfigurado']
    );

    expect(component.idTipoArchivo).toEqual(
      component.formularioArchivoConfigurados.controls['idTipoArchivo']
    );
    expect(component.idTipoFraccionamiento).toEqual(
      component.formularioArchivoConfigurados.controls['idTipoFraccionamiento']
    );
    expect(component.separador).toEqual(
      component.formularioArchivoConfigurados.controls['separador']
    );
    expect(component.calificadorTexto).toEqual(
      component.formularioArchivoConfigurados.controls['calificadorTexto']
    );
    expect(component.contieneEncabezado).toEqual(
      component.formularioArchivoConfigurados.controls['contieneEncabezado']
    );
    expect(component.contieneResumen).toEqual(
      component.formularioArchivoConfigurados.controls['contieneResumen']
    );
    expect(component.separadorDecimal).toEqual(
      component.formularioArchivoConfigurados.controls['separadorDecimal']
    );
    expect(component.intervaloFrecuenciaTemporal).toEqual(
      component.formularioArchivoConfigurados.controls[
        'intervaloFrecuenciaTemporal'
      ]
    );

    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  it('guardar Columnas crear', () => {
    const serviciosArchivoConfigurado =
      fixture.debugElement.injector.get<ServiciosArchivoConfigurado>(
        ServiciosArchivoConfigurado as any
      );
    /*spyOn(serviciosArchivoConfigurado, 'crear').and.returnValue(
      of({
        idTipoArchivoConfigurado: 1,
        tipoarchivoconfigurado: 1,
        idTipoArchivo: 1,
        idTipoFraccionamiento: 1,
        idUbicacionDatos: 1,
        separador: 'STRING',
        calificadorTexto: 'STRING',
        contieneEncabezado: 'STRING',
        contieneResumen: 'STRING',
        separadorDecimal: 'STRING',
        idFrecuenciaTemporal: 1,
        intervaloFrecuenciaTemporal: 1,
        idTipoCodificacion: 1,
        activo: 'STRING',
        fechaCreacion: 'STRING',
        fechaEstado: 'STRING',
        fechaModificacion: 'STRING',
        usuarioCreacion: 'STRING',
        usuarioEstado: 'STRING',
        usuarioModificacion: 'STRING',
        calificacionTexto: 'string',
      })
    ); */
    component.id = "0";
    component.formularioArchivoConfigurados.controls['tipoArchivoConfigurado'].setValue('configurado')  
    component.formularioArchivoConfigurados.controls['idTipoArchivo'].setValue(1)  
    component.formularioArchivoConfigurados.controls['idTipoFraccionamiento']. setValue(1)  
    component.formularioArchivoConfigurados.controls['idUbicacionDatos']. setValue(1)
    component.formularioArchivoConfigurados.controls['separador']. setValue(',')
    component.formularioArchivoConfigurados.controls['calificadorTexto']. setValue('text')  
    component.formularioArchivoConfigurados.controls['contieneEncabezado']. setValue('prueba')  
    component.formularioArchivoConfigurados.controls['contieneResumen']. setValue('resumen')  
    component.formularioArchivoConfigurados.controls['separadorDecimal']. setValue(';')  
    component.formularioArchivoConfigurados.controls['idFrecuenciaTemporal']. setValue(1) 
    component.formularioArchivoConfigurados.controls['intervaloFrecuenciaTemporal']. setValue('decimal')  
    
    let ob:any= of(component.formularioArchivoConfigurados.value)
    let spyCrear = spyOn(serviciosArchivoConfigurado,'crear').and.callFake(() =>{
      return ob})
    ob.subscribe(()=>{console.log("subscribe")})

    component.guardar();
    expect(Swal.isVisible()).toBeTruthy();

    Swal.clickConfirm();
    //setTimeout(() => {
      expect(spyCrear).toHaveBeenCalled();
    //});
  });
  it('guardar Columnas Actualizar', async () => {
    const serviciosArchivoConfigurado =
      fixture.debugElement.injector.get<ServiciosArchivoConfigurado>(
        ServiciosArchivoConfigurado as any
      );
    spyOn(serviciosArchivoConfigurado, 'crear').and.returnValue(
      of({
        idTipoArchivoConfigurado: 1,
        tipoarchivoconfigurado: 1,
        idTipoArchivo: 1,
        idTipoFraccionamiento: 1,
        idUbicacionDatos: 1,
        separador: 'STRING',
        calificadorTexto: 'STRING',
        contieneEncabezado: 'STRING',
        contieneResumen: 'STRING',
        separadorDecimal: 'STRING',
        idFrecuenciaTemporal: 1,
        intervaloFrecuenciaTemporal: 1,
        idTipoCodificacion: 1,
        activo: 'STRING',
        fechaCreacion: 'STRING',
        fechaEstado: 'STRING',
        fechaModificacion: 'STRING',
        usuarioCreacion: 'STRING',
        usuarioEstado: 'STRING',
        usuarioModificacion: 'STRING',
        calificacionTexto: 'string',
      })
    );

    component.formularioArchivoConfigurados.controls['tipoArchivoConfigurado'].setValue('configurado')  
    component.formularioArchivoConfigurados.controls['idTipoArchivo'].setValue(1)  
    component.formularioArchivoConfigurados.controls['idTipoFraccionamiento']. setValue(1)  
    component.formularioArchivoConfigurados.controls['idUbicacionDatos']. setValue(1)
    component.formularioArchivoConfigurados.controls['separador']. setValue(',')
    component.formularioArchivoConfigurados.controls['calificadorTexto']. setValue('text')  
    component.formularioArchivoConfigurados.controls['contieneEncabezado']. setValue('prueba')  
    component.formularioArchivoConfigurados.controls['contieneResumen']. setValue('resumen')  
    component.formularioArchivoConfigurados.controls['separadorDecimal']. setValue(';')  
    component.formularioArchivoConfigurados.controls['idFrecuenciaTemporal']. setValue(1) 
    component.formularioArchivoConfigurados.controls['intervaloFrecuenciaTemporal']. setValue('decimal')  
    component.id = '1'
    let ob:any= of(component.formularioArchivoConfigurados.value)
    spyOn(serviciosArchivoConfigurado,'actualizar').and.callFake(() =>{
      return ob})
    ob.subscribe(()=>{console.log("subscribe")})
  
    component.guardar();
    expect(serviciosArchivoConfigurado.actualizar).toHaveBeenCalled();
    expect(Swal.isVisible()).toBeTruthy();
    Swal.clickConfirm();
  });
});
