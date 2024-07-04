import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
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
import { ServiciosEmbalcesService } from '../servicios-embalses.service';
import { ServiciosParametrosEmbalseService } from '../servicios-parametros-embalse.service';

import { ParametrosEmbalseComponent } from './parametros-embalse.component';
import { of, Observable, from, isObservable, ObservableInput } from 'rxjs';
import Swal from 'sweetalert2';
import { NO_ERRORS_SCHEMA } from '@angular/core';
//const httpClientSpy = jasmine.createSpyObj('HttpClient', ['post', 'get']);
class ServiciosParametrosEmbalseService2 {
  obtenerListaParametros():Observable<any> {return new Observable}
  obtenerListaParametrosXEmbalse(){}
  crear(){}
  eliminar(){}
}
class RouterStub {
  url = 'configuracion/embalses';
  navigate(commands: any[], extras?: any) { }
}

describe('ParametrosEmbalseComponent', () => {
  let component: ParametrosEmbalseComponent;
  let fixture: ComponentFixture<ParametrosEmbalseComponent>;
  //let httpMock: HttpTestingController;
  const fb = jasmine.createSpyObj('FormBuilder', ['group']);
  const formGroup = new FormGroup({
    identityVerificationDocumentTypeId: new FormControl('formularioEmbalse'),
  });
  (<jasmine.Spy>fb.group).and.returnValue(formGroup);
  const formBuilder: FormBuilder = new FormBuilder();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes(
          [
            { path:'configuracion/embalses', component: RouterStub}
        ]
        ),
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        ServiciosEmbalcesService,
        ServiciosParametrosEmbalseService,
        //{ provide: HttpClient, useValue: httpClientSpy },
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
      declarations: [ParametrosEmbalseComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParametrosEmbalseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should llamar servicio obtenerPorId ', () => {
    const serviciosEmbalcesService =
      fixture.debugElement.injector.get<ServiciosEmbalcesService>(
        ServiciosEmbalcesService as any
      );
    spyOn(serviciosEmbalcesService, 'obtenerPorId').and.returnValue(
      of({
                
  idEmbalse: 1,
  anchoCresta: 1,
  areaHidrografica: 'string',
  cuenca: 'string',
  elevacion: 1,
  embalse: 'string',
  fechaCreacion: 'string',
  fechaInicioOperacion: 'string',
  fechaModificacion: 'string',
  idEntidad: 1,
  idMunicipio: 1,
  logintudCresta: 1,
  microcuenca: 'string',
  nivelSubsiguiente: 'string',
  subZonaHidrografica: 'string',
  usuarioCreacion: 'string',
  usuarioModificacion: 'string',
  volumenMuerto: 1,
  volumenTotal: 1,
  volumenUtil: 1,
  zonaHidrografica: 'string',
  zonaOperativaEaab: 'string' ,
  activo:'string',
  fechaEstado: 'string',
  usuarioEstado: 'string',
  idDepartamento : 1
      })
    );

    spyOn(component, 'ngOnInit');
    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  it('Accion registro Eliminar', () => {
    const e = {
      accion: 'eliminar',
      registro: {
        idEmbalse: 1,
        idParametro: 1,
        idParametroXEmbalse: 1,
      },
    };

    component.accionRegistro(e);
    expect(component).toBeTruthy();
  });

  it('llamar accionGeneral ', () => {
    const e = {};
    spyOn(component, 'agregarValor');
    component.accionGeneral(e);
    expect(component.agregarValor).toHaveBeenCalled();
    
  });

  it('obtenerListaParametrosXEmbalse', async () => {
    const id = 13;
    const serviciosParametrosEmbalseService =
      fixture.debugElement.injector.get<ServiciosParametrosEmbalseService>(
        ServiciosParametrosEmbalseService as any
      );
    spyOn( 
      serviciosParametrosEmbalseService,
      'obtenerListaParametrosXEmbalse'
    ).and.returnValue(
      of([{  idEmbalse: 1,
        idParametro: 1,
        idParametroXEmbalse: 1,
      }]) as any);

 
  

    let embalse = await spyOn(component, 'obtenerListaParametrosXEmbalse');
    // se ejecuta el metodo
    await component.obtenerListaParametrosXEmbalse(id);
    // Validar  los resultados de la prueba
    await expect(embalse).toHaveBeenCalled();
  });

  it('obtenerListaPermiso', async () => {
    const serviciosParametrosEmbalseService =
      fixture.debugElement.injector.get<ServiciosParametrosEmbalseService>(
        ServiciosParametrosEmbalseService as any
      );
      //let ser = new ServiciosParametrosEmbalseService(httpClientSpy);
    spyOn(
      serviciosParametrosEmbalseService,
      'obtenerListaParametros'
    ).and.returnValue(
      of([
        {
          id: 1,
        },
      ]) as any
    );

    component.obtenerListaPermiso();
    expect(component.listaparametros.length).toEqual(1);
  });

  it('Agregar Valor', async () => { 
    
    component.agregarValor();
    let spyParam = spyOn(component,"agregarParametro");
    /*spyOn(Swal,"fire").and.callFake((q:any) => {return Promise.resolve({
      buttonsStyling: false,
      title: 'Nuevo Permiso',
      input: 'select',
      //inputOptions: this.listaparametros,
      showCancelButton: true,
      inputPlaceholder: 'seleccione un permiso...',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
      allowOutsideClick: false,
    }as any)});*/
    await expect(Swal.isVisible()).toBeTruthy();
    await Swal.clickConfirm();  
    await expect(spyParam).toHaveBeenCalled();
  }); 
  
  it('agregarPermiso', () => {
    const result = { value: 1 };
    const serviciosParametrosEmbalseService =
      fixture.debugElement.injector.get<ServiciosParametrosEmbalseService>(
        ServiciosParametrosEmbalseService as any
      );
    spyOn(serviciosParametrosEmbalseService, 'crear').and.returnValue(
      of({
        idEmbalse: 1,
        idParametro: 1,
        idParametroXEmbalse: 0,
      }) as any
    );

    component.agregarParametro(result);
    expect(component.agregarParametro.length).toEqual(1);
  });

  it('eliminar', () => {
    const id = 1;
    const serviciosParametrosEmbalseService =
      fixture.debugElement.injector.get<ServiciosParametrosEmbalseService>(
        ServiciosParametrosEmbalseService as any
      );

    spyOn(serviciosParametrosEmbalseService, 'eliminar').and.returnValue(
      of({
        idEmbalse: 1,
        idParametro: 1,
        idParametroXEmbalse: 0,
      }) as any
    );
    spyOn(component, 'eliminar');
    component.eliminar(id); 
    expect(component.eliminar).toBeTruthy();

  });
});
