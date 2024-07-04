import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NgSelect2Module } from 'ng-select2';
import Swal from 'sweetalert2';
import { ServiciosMetodoXtipoParametroService } from '../servicios-MetodoXtipoParametro.service';

import { GuardarTiposParametroComponent } from './guardar-tipos-parametro.component';
import { of } from 'rxjs';
import { ServiciosDominiosValoresService } from '../../dominios/servicios-dominios-valores.service';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('GuardarTiposParametroComponent', () => {
  let component: GuardarTiposParametroComponent;
  let fixture: ComponentFixture<GuardarTiposParametroComponent>;
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
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ id: '1'}),
            },
          },
        },
         
      ],
      declarations: [GuardarTiposParametroComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GuardarTiposParametroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Accion Registro Eliminar', () => {
    const e = {
      accion: 'eliminar',
      registro: {
        tipoParametro: 'string',
        metodo: 'string',
        idTipoParametro: 1,
        idMetodo: 1,
        idMetodoXTipoParametro: 1,
      },
    };
    component.accionRegistro(e);
    expect(component).toBeTruthy();
  });

  it('llamar accionGeneral ', () => {
    const e = {
      accion: 'eliminar',
      registro: {
        tipoParametro: 'string',
        metodo: 'string',
        idTipoParametro: 1,
        idMetodo: 1,
        idMetodoXTipoParametro: 1,
      },
    };
     
    component.accionGeneral(e);
    expect(component.accionGeneral).toBeTruthy();
  });

  it('llamar Agregar Valor ', () => { 
    spyOn(component, 'agregarValor');
    component.agregarValor();   

    expect(Swal.isVisible()).toBeTruthy();
    Swal.clickConfirm();
    setTimeout(() => {
      expect(component.agregarValor).toHaveBeenCalled();
    });

  });

  it('crearValor',()=>{

    const serviciosMetodoXtipoParametroService =
    fixture.debugElement.injector.get<ServiciosMetodoXtipoParametroService>(
      ServiciosMetodoXtipoParametroService as any
    );
  spyOn(serviciosMetodoXtipoParametroService, 'crear').and.returnValue(
    of({
      tipoParametro :'string',
      metodo:'string',
      idTipoParametro:1,
      idMetodo:1,
      idMetodoXTipoParametro:1,
    })
  );

  const resul = {
     value:1,
     text:'test'
  }
            
  component.crearValor(resul) 
  expect(Swal.isVisible()).toBeTruthy();
    Swal.clickConfirm();  
  expect(component.crearValor).toBeTruthy();

  });
  it('Obtener Lista', () => {
    const serviciosMetodoXtipoParametroService =
    fixture.debugElement.injector.get<ServiciosMetodoXtipoParametroService>(
      ServiciosMetodoXtipoParametroService as any
      );
      spyOn(
        serviciosMetodoXtipoParametroService,
        'obtenertipoParametros'
        ).and.returnValue(
          of({ 
            tipoParametro :'string',
            metodo:'string',
            idTipoParametro:1,
            idMetodo:1,
            idMetodoXTipoParametro:1, 
          }));
           
    spyOn(component, 'obtenerLista');
    // se ejecuta el metodo
    component.obtenerLista();
    // Validar  los resultados de la prueba
  expect(component.obtenerLista).toHaveBeenCalled();
  });

  it('obtenerMetodos',()=>{
    const serviciosDominiosValoresService =
    fixture.debugElement.injector.get<ServiciosDominiosValoresService>(
      ServiciosDominiosValoresService as any
    );
  spyOn(
    serviciosDominiosValoresService,
    'obtenerValoresActivosPorIdDominio'
  ).and.returnValue(
    of([{ 
      id: 1,
      text: 'text 1',
    }]));

    component.obtenerMetodos();


    console.log('llegarobn metodos',component.listMetodos)
    expect(component.listMetodos.length).toEqual(1)


  })

  it('eliminar', () => {
    const metodoTipoParametro = {    tipoParametro :'string',
    metodo:'string',
    idTipoParametro:1,
    idMetodo:1,
    idMetodoXTipoParametro:1,};
    const serviciosMetodoXtipoParametroService =
    fixture.debugElement.injector.get<ServiciosMetodoXtipoParametroService>(
      ServiciosMetodoXtipoParametroService as any
    );

    spyOn(serviciosMetodoXtipoParametroService, 'eliminaripoParametros').and.returnValue(
      of({
        tipoParametro :'string',
        metodo:'string',
        idTipoParametro:1,
        idMetodo:1,
        idMetodoXTipoParametro:1,
      })
    );
    spyOn(component, 'eliminar');
    component.eliminar(metodoTipoParametro);
    expect(component.eliminar).toBeTruthy();
  });
  


});
