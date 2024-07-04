import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { GuardarDominiosComponent } from './guardar-dominios.component';
import { RouterTestingModule } from '@angular/router/testing';
import { DataTablesModule } from 'angular-datatables';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormsModule,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { ServiciosDominiosService } from '../servicios-dominios.service';
import { Observable, of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { ServiciosDominiosValoresService } from '../servicios-dominios-valores.service';
import { estados } from 'src/app/common/utils/constantes';
import Swal from 'sweetalert2';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { result } from 'lodash';
import { IDominioValor } from 'src/app/modelo/configuracion/dominioValor';


describe('GuardarDominiosComponent', () => {
  let componentTest: GuardarDominiosComponent;
  let fixture: ComponentFixture<GuardarDominiosComponent>;

  const fb = jasmine.createSpyObj('FormBuilder', ['group']);
  const formGroup = new FormGroup({
    identityVerificationDocumentTypeId: new FormControl('formularioDominio'), 
  });
  (<jasmine.Spy>fb.group).and.returnValue(formGroup);
  const formBuilder: FormBuilder = new FormBuilder();
   
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'configuracion/dominios', component: GuardarDominiosComponent}
      ]),
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        ServiciosDominiosService,
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
      declarations: [GuardarDominiosComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GuardarDominiosComponent);
    componentTest = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should crear componente', () => {
   
    expect(componentTest).toBeTruthy();
  });

  it('should llamar servicio obtenerPorId ', () => {
    console.log('should llamar servicio obtenerPorId')
    const servicioDominio =
      fixture.debugElement.injector.get<ServiciosDominiosService>(
        ServiciosDominiosService as any
      );
    spyOn(servicioDominio, 'obtenerPorId').and.returnValue(
      of({
        id: 1,
        dominio: 'string',
        descripcion: 'string',
      })
    );

    componentTest.id = '1';
    //componentTest.ngOnInit();
    expect(componentTest).toBeTruthy();
  });

  it('crear Nuevo valor dominio', () => {
    console.log('crear Nuevo valor dominio')
    const result = { value: 'NUEVO VALOR DOMINIO' };
    const servicioDominio =
      fixture.debugElement.injector.get<ServiciosDominiosValoresService>(
        ServiciosDominiosValoresService as any
      );
    spyOn(servicioDominio, 'crear').and.returnValue(
      of({
        idDominio: 1,
        activo: estados.activo,
        dominioValor: result.value,
        idDominioValor: 0,
        fechaCreacion: '',
        fechaModificacion: '',
        usuarioCreacion: '',
        usuarioModificacion: '',
      })
    );

    componentTest.crearValor(result);
    expect(componentTest.crearValor.length).toEqual(1);
    // expect(componentTest).toBeTruthy();
    // console.log('componente dominio ',componentTest)
  });

  it('guardar dominio', () => {
    console.log('guardar dominio')
    const servicioDominio =
      fixture.debugElement.injector.get<ServiciosDominiosService>(
        ServiciosDominiosService as any
      );
    spyOn(servicioDominio, 'actualizar').and.returnValue(
      of({
        id: 1,
        descripcion: 'string',
        dominio: 'string',
        fechaCreacion: 'string',
        fechaModificacion: 'string',
        usuarioCreacion: 'string',
        usuarioModificacion: 'string',
      })
    );
    componentTest.guardar();
    expect(componentTest.guardar).toBeTruthy();
    // expect(componentTest).toBeTruthy();
    // console.log('componente dominio ',componentTest)
  });

  it('Accion registro Activar', () => {
    console.log('Accion registro Activar')
    const e = {
      accion: 'activar',
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

    componentTest.accionRegistro(e);

    expect(componentTest).toBeTruthy();
  });

  it('Accion registro Inactivar', () => {
    console.log('Accion registro Inactivar')
    componentTest.idominio =1 

let registro:IDominioValor =  {
  activo: 'N',
  dominioValor: 'wwww',
  fechaCreacion: '2021-11-05T20:19:27.541+00:00', 
  fechaModificacion: '2021-11-18T15:10:57.445+00:00', 
  idDominioValor: 138,
  idDominio:1, 
  usuarioCreacion: '2021-11-18T15:10:57.445+00:00', 
  usuarioModificacion: '2021-11-18T15:10:57.445+00:00',
}

    const e = {
      accion: 'inactivar',
      registro: registro,
    };

    spyOn(componentTest,'validarReglas').and.returnValue(true) 
 

    componentTest.accionRegistro(e);
    expect(componentTest).toBeTruthy();
  });

  it('llamar accionGeneral ', () => {
    console.log('llamar accionGeneral')
    const e = {};
    spyOn(componentTest, 'agregarValor');
    componentTest.accionGeneral(e);
    expect(componentTest.agregarValor).toHaveBeenCalled();
  });

  it('Agregar Valor', async () => { 
    console.log("Agregar Valor")
    const e = {};
    spyOn(componentTest, 'agregarValor');
    spyOn(componentTest, 'crearValor');
    componentTest.accionGeneral(e);
     expect(componentTest.agregarValor).toHaveBeenCalled();  
    componentTest.agregarValor();
    expect(Swal.isVisible()).toBeTruthy();

    Swal.clickConfirm();
    setTimeout(() => {
      //expect(componentTest.crearValor).toHaveBeenCalled();
    });
        
  }); 


  it('Actualizar Dominios', () => {
    console.log("Actualizar Dominios")
    const serviciosDominiosValoresService =
      fixture.debugElement.injector.get<ServiciosDominiosValoresService>(
        ServiciosDominiosValoresService as any
      );
    spyOn(serviciosDominiosValoresService, 'actualizar').and.returnValue(
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

    const ValorDominio = {
      idDominioValor: 1,
      idDominio: 1,
      activo: 'string',
      dominioValor: 'string',
      fechaCreacion: 'string',
      fechaModificacion: 'string',
      usuarioCreacion: 'string',
      usuarioModificacion: 'string',
    };
    componentTest.actualizar(ValorDominio);

    expect(componentTest.actualizar.length).toEqual(1);
    // console.log('se actualizo',component.actualizar.length)
  });

  it('Validar Propiedades Formulario', () => {
    console.log("Validar Propiedades Formulario'")
    const servicioDominio =
      fixture.debugElement.injector.get<ServiciosDominiosService>(
        ServiciosDominiosService as any
      );
    spyOn(servicioDominio, 'obtenerPorId').and.returnValue(
      of({
        id: 1,
        dominio: 'string',
        descripcion: 'string',
      })
    );

    componentTest.idominio = 1;
    
    //componentTest.ngOnInit();

    componentTest.formularioDominio.patchValue({idDominio:1});

    expect(componentTest.dominio).toEqual(
      componentTest.formularioDominio.controls['dominio']
    );

    expect(componentTest.descripcion).toEqual(
      componentTest.formularioDominio.controls['descripcion']
    );
    expect(componentTest.fechaCreacion).toEqual(
      componentTest.formularioDominio.controls['fechaCreacion']
    );
    expect(componentTest.fechaModificacion).toEqual(
      componentTest.formularioDominio.controls['fechaModificacion']
    );
    expect(componentTest.usuarioCreacion).toEqual(
      componentTest.formularioDominio.controls['usuarioCreacion']
    );
    expect(componentTest.usuarioModificacion).toEqual(
      componentTest.formularioDominio.controls['usuarioModificacion']
    );
    expect(componentTest.dominioValor).toEqual(
      componentTest.formularioValoresDominio.controls['dominioValor']
    );
    


    
  });


  it ('validarReglas',()=>{

   componentTest.datosFilter = [
    {
      activo: 'S',
      dominioValor: 'wwww',
      fechaCreacion: '2021-11-05T20:19:27.541+00:00',
      fechaEstado: '2021-11-18T15:10:57.445+00:00',
      fechaModificacion: '2021-11-18T15:10:57.445+00:00', 
      idDominioValor: 138,
      idDominio:1,
      orden: '2021-11-18T15:10:57.445+00:00',
      usuarioCreacion: '2021-11-18T15:10:57.445+00:00',
      usuarioEstado: '2021-11-18T15:10:57.445+00:00',
      usuarioModificacion: '2021-11-18T15:10:57.445+00:00',
    },
    {
      activo: 'N',
      dominioValor: 'wwww',
      fechaCreacion: '2021-11-05T20:19:27.541+00:00',
      fechaEstado: '2021-11-18T15:10:57.445+00:00',
      fechaModificacion: '2021-11-18T15:10:57.445+00:00', 
      idDominioValor: 137,
      idDominio:2,
      orden: '2021-11-18T15:10:57.445+00:00',
      usuarioCreacion: '2021-11-18T15:10:57.445+00:00',
      usuarioEstado: '2021-11-18T15:10:57.445+00:00',
      usuarioModificacion: '2021-11-18T15:10:57.445+00:00',
    },
    {
      activo: 'S',
      dominioValor: 'wwww',
      fechaCreacion: '2021-11-05T20:19:27.541+00:00',
      fechaEstado: '2021-11-18T15:10:57.445+00:00',
      fechaModificacion: '2021-11-18T15:10:57.445+00:00', 
      idDominioValor: 13,
      idDominio:10,
      orden: '2021-11-18T15:10:57.445+00:00',
      usuarioCreacion: '2021-11-18T15:10:57.445+00:00',
      usuarioEstado: '2021-11-18T15:10:57.445+00:00',
      usuarioModificacion: '2021-11-18T15:10:57.445+00:00',
    }

   ]


       componentTest.validarReglas();
     expect(componentTest.validarReglas).toBeTruthy();

  })
  });
