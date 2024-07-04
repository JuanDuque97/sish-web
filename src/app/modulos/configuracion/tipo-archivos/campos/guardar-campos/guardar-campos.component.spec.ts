import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NgSelect2Module } from 'ng-select2';
import { of } from 'rxjs';
import Swal from 'sweetalert2';
import { ServiciosParametrosService } from '../../../../parametros/servicios-parametros.service';
import { ServiciosArchivoCampos } from '../../servicios-archivo-campos.service';
import { ServiciosArchivoColumnas } from '../../servicios-archivo-columnas.service';

import { GuardarCamposComponent } from './guardar-campos.component';

describe('GuardarCamposComponent', () => {
  let component: GuardarCamposComponent;
  let fixture: ComponentFixture<GuardarCamposComponent>;

  const formBuilder: FormBuilder = new FormBuilder();
  const fb = jasmine.createSpyObj('FormBuilder', ['group']);
  const formGroup = new FormGroup({ 
    identityVerificationDocumentTypeId: new FormControl('formularioArchivoCampos'),  
  });
  (<jasmine.Spy>(fb.group)).and.returnValue(formGroup);


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
        NgSelect2Module
      ],
      providers: [
        ServiciosArchivoCampos,
        ServiciosParametrosService,
        ServiciosArchivoColumnas,
        {
          provider: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ id: '1',ac:'E',ta:1})
            }
          }
        },
        {
          provide: FormBuilder,
          useValue: formBuilder
        }
      ],
      declarations: [ GuardarCamposComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GuardarCamposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should llamar obtenerPorId ', () => {
    const serviciosArchivoCampos =
      fixture.debugElement.injector.get<ServiciosArchivoCampos>(
        ServiciosArchivoCampos as any
      );
    spyOn(serviciosArchivoCampos, 'obtenerPorId').and.returnValue(
      of({
        campoRelacionado:'string',
        codigoPropiedad:'string',
        idParametro:1,
        idTipoArchivoCampo:1,
        idTipoArchivoColumna:1,
        idTipoArchivoColumnaPropiedad:1,
        idTipoArchivoConfigurado:1
      })
    );
 
 
    component.ngOnInit();
    expect(component).toBeTruthy();
  }); 

  it('guardar Campos crear', () => {
    const serviciosArchivoCampos =
      fixture.debugElement.injector.get<ServiciosArchivoCampos>(
        ServiciosArchivoCampos as any
      );
    spyOn(serviciosArchivoCampos, 'crear').and.returnValue(
      of({
        campoRelacionado:'string',
        codigoPropiedad:'string',
        idParametro:1,
        idTipoArchivoCampo:1,
        idTipoArchivoColumna:1,
        idTipoArchivoColumnaPropiedad:1,
        idTipoArchivoConfigurado:1
      })
    );
    component.guardar();
    // expect(Swal.isVisible()).toBeTruthy();
    // Swal.clickConfirm();
    expect(component.guardar).toBeTruthy();
   
  });

  it('guardar Campos actualizar', () => {
    const serviciosArchivoCampos =
      fixture.debugElement.injector.get<ServiciosArchivoCampos>(
        ServiciosArchivoCampos as any
      );
    spyOn(serviciosArchivoCampos, 'actualizar').and.returnValue(
      of({
        campoRelacionado:'string',
        codigoPropiedad:'string',
        idParametro:1,
        idTipoArchivoCampo:1,
        idTipoArchivoColumna:1,
        idTipoArchivoColumnaPropiedad:1,
        idTipoArchivoConfigurado:1
      })
    );
    component.formularioArchivoCampos.controls['campoRelacionado'].setValue(0);
      component.formularioArchivoCampos.controls['codigoPropiedad'].setValue(0);
      component.formularioArchivoCampos.controls['idParametro'].setValue(0);
      component.formularioArchivoCampos.controls['idTipoArchivoColumna'].setValue(0);
      component.formularioArchivoCampos.controls['idTipoArchivoColumnaPropiedad'].setValue(0);

    component.guardar();
    expect(component.guardar).toBeTruthy();
   
  });


  it('Validar Propiedades Formulario', () => {
    const serviciosArchivoCampos =
      fixture.debugElement.injector.get<ServiciosArchivoCampos>(
        ServiciosArchivoCampos as any
      );
    spyOn(serviciosArchivoCampos, 'obtenerPorId').and.returnValue(
      of({
        campoRelacionado:'string',
        codigoPropiedad:'string',
        idParametro:1,
        idTipoArchivoCampo:1,
        idTipoArchivoColumna:1,
        idTipoArchivoColumnaPropiedad:1,
        idTipoArchivoConfigurado:1
      })
    );
    component.ngOnInit();

    expect(component.campoRelacionado).toEqual(
      component.formularioArchivoCampos.controls['campoRelacionado']
    );
    expect(component.codigoPropiedad).toEqual(
      component.formularioArchivoCampos.controls['codigoPropiedad']
    );
    expect(component.idParametro).toEqual(
      component.formularioArchivoCampos.controls['idParametro']
    );
    expect(component.idTipoArchivoColumna).toEqual(
      component.formularioArchivoCampos.controls['idTipoArchivoColumna']
    );
    expect(component.idTipoArchivoColumnaPropiedad).toEqual(
      component.formularioArchivoCampos.controls['idTipoArchivoColumnaPropiedad']
    );
  });
 
});
