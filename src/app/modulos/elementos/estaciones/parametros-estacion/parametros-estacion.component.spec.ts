import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
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
import { of } from 'rxjs';
import Swal from 'sweetalert2';
import { ServiciosParametrosService } from '../../../parametros/servicios-parametros.service';
import { ServiciosEstacionesService } from '../servicios-estaciones.service';
import { ServiciosParametrosEstacionesService } from '../servicios-parametros-estaciones.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { ParametrosEstacionComponent } from './parametros-estacion.component';

describe('ParametrosEstacionComponent', () => {
  let component: ParametrosEstacionComponent;
  let fixture: ComponentFixture<ParametrosEstacionComponent>;

  const formBuilder: FormBuilder = new FormBuilder();
  const fb = jasmine.createSpyObj('FormBuilder', ['group']);
  const formGroup = new FormGroup({
    identityVerificationDocumentTypeId: new FormControl('formularioParametros'),
  });
  (<jasmine.Spy>fb.group).and.returnValue(formGroup);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
        NgSelect2Module,
      ],
      providers: [
        ServiciosParametrosService,
        ServiciosParametrosEstacionesService,
        ServiciosEstacionesService,
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
      declarations: [ParametrosEstacionComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParametrosEstacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should obtencion parametro', () => {
    const serviciosParametrosService =
      fixture.debugElement.injector.get<ServiciosParametrosService>(
        ServiciosParametrosService as any
      );
    spyOn(
      serviciosParametrosService,
      'obtenerValoresParametros'
    ).and.returnValue(
      of([
        {
          id: 1,
          text: 'Prueba',
          disabled: false,
        },
      ])
    );

    const sercioparametrosestacion =
      fixture.debugElement.injector.get<ServiciosParametrosEstacionesService>(
        ServiciosParametrosEstacionesService as any
      );

    spyOn(sercioparametrosestacion, 'obtenerListaParametros').and.returnValue(
      of([
        {
          idParametroXestacion: 1,
          idParametro: 1,
          idEstacion: 1,
        },
      ])
    );

    component.ngOnInit();

    expect(component).toBeTruthy();
  });

  it('crearValor', () => {
    const result: any = {
      value: 1,
    };

    const serviciosParametrosEstacionesService =
      fixture.debugElement.injector.get<ServiciosParametrosEstacionesService>(
        ServiciosParametrosEstacionesService as any
      );
    spyOn(serviciosParametrosEstacionesService, 'crear').and.returnValue(
      of({ idParametroXEstacion: 1, idParametro: 1, idEstacion: 1 })
    );

    component.crearValor(result);
    expect(Swal.isVisible()).toBeTruthy();
    Swal.clickConfirm();
    expect(serviciosParametrosEstacionesService.crear).toHaveBeenCalled();
  });

  it('accionGeneral', () => {
    const Dato: any = {
      value: 1,
    };
    component.accionGeneral(Dato);
    expect(component).toBeTruthy();
  });

  it('Accion registro Eliminar', () => {
    const e = {
      accion: 'eliminar',
      registro: {
        idParametroXEstacion:1,
        idParametro:2,
        idEstacion:2
      },
    };
    component.accionRegistro(e);
    expect(component).toBeTruthy();
  });


  it('eliminar', () => {
    const id = 1;
    const sercioparametrosestacion =
    fixture.debugElement.injector.get<ServiciosParametrosEstacionesService>(
      ServiciosParametrosEstacionesService as any
    );

    spyOn(sercioparametrosestacion, 'eliminar').and.returnValue(
      of({
        idParametroXEstacion:1,
        idParametro:1,
        idEstacion:1
      })
    );
    spyOn(component, 'eliminar');
    component.eliminar(id);
    expect(component.eliminar).toBeTruthy();
  });
  
  it('llamar accionGeneral ', () => {
    const e = {};
    spyOn(component, 'agregarValor');
    component.accionGeneral(e);
    expect(component.agregarValor).toHaveBeenCalled();
  });

});
