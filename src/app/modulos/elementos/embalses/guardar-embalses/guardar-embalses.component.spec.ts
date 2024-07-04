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
import { ServiciosDominiosValoresService } from '../../../configuracion/dominios/servicios-dominios-valores.service';
import { ServiciosEmbalcesService } from '../servicios-embalses.service';
import { GuardarEmbalsesComponent } from './guardar-embalses.component';
import { ServiciosCapasService } from 'src/app/modulos/configuracion/capas/servicios-capas.service';
import { ServiciosGeograficosService } from 'src/app/common/mapa/servicios-geograficos.service';
import { analyzeAndValidateNgModules } from '@angular/compiler';
class RouterStub {
  url = 'configuracion/embalses';
  navigate(commands: any[], extras?: any) { }
}
describe('GuardarEmbalsesComponent', () => {
  let component: GuardarEmbalsesComponent;
  let fixture: ComponentFixture<GuardarEmbalsesComponent>;
  const formBuilder: FormBuilder = new FormBuilder();
  const fb = jasmine.createSpyObj('FormBuilder', ['group']);
  const formGroup = new FormGroup({
    identityVerificationDocumentTypeId: new FormControl('formularioEmbalse'),
  });
  (<jasmine.Spy>fb.group).and.returnValue(formGroup);
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(
          [
            { path:'configuracion/embalses', component: RouterStub},
            { path: 'configuracion/ParametrosEmbalses/1', component: RouterStub}
        ]
        ),
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
        NgSelect2Module,
      ],
      providers: [
        ServiciosEmbalcesService,
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
      declarations: [GuardarEmbalsesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GuardarEmbalsesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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

    expect(component.idEmbalse).toEqual(
      component.formularioEmbalse.controls['idEmbalse']
    );
    expect(component.embalse).toEqual(
      component.formularioEmbalse.controls['embalse']
    );
    expect(component.idEntidad).toEqual(
      component.formularioEmbalse.controls['idEntidad']
    );
    expect(component.zonaOperativaEaab).toEqual(
      component.formularioEmbalse.controls['zonaOperativaEaab']
    );
    expect(component.fechaInicioOperacion).toEqual(
      component.formularioEmbalse.controls['fechaInicioOperacion']
    );
    expect(component.volumenTotal).toEqual(
      component.formularioEmbalse.controls['volumenTotal']
    );
    expect(component.elevacion).toEqual(
      component.formularioEmbalse.controls['elevacion']
    );
    expect(component.volumenUtil).toEqual(
      component.formularioEmbalse.controls['volumenUtil']
    );

    component.ngOnInit();

    expect(component).toBeTruthy();
  });
  it('should guaradar new Embalse', () => {
    const serviciosEmbalcesService =
      fixture.debugElement.injector.get<ServiciosEmbalcesService>(
        ServiciosEmbalcesService as any
      );
    spyOn(serviciosEmbalcesService, 'crear').and.returnValue(
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
        zonaOperativaEaab: 'string',
        activo: 'string',
        fechaEstado: 'string',
        usuarioEstado: 'string',
        idDepartamento: 1,
      })
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
        zonaOperativaEaab: 'string',
        activo: 'string',
        fechaEstado: 'string',
        usuarioEstado: 'string',
        idDepartamento: 1,
      })
    ).and.callFake((x)=>{return of({idMunicipio:1}) as any})

    component.id = '0';

    component.formularioEmbalse.controls['embalse'].setValue('embalse');
    component.formularioEmbalse.controls['idEntidad'].setValue(1);
    component.formularioEmbalse.controls['zonaOperativaEaab'].setValue('zona1');
    component.formularioEmbalse.controls['elevacion'].setValue(1);
    component.formularioEmbalse.controls['volumenTotal'].setValue(1);
    component.formularioEmbalse.controls['volumenUtil'].setValue(1);
    component.formularioEmbalse.controls['volumenMuerto'].setValue(1);
    component.formularioEmbalse.controls['anchoCresta'].setValue(1);
    component.formularioEmbalse.controls['alturaPresa'].setValue(1);
    component.formularioEmbalse.controls['longitudCresta'].setValue(1);
    component.formularioEmbalse.controls['fechaInicioOperacion'].setValue(
      '01/04/2021'
    );

    component.guardar();
    expect(Swal.isVisible()).toBeTruthy();
    Swal.clickConfirm();
    expect(serviciosEmbalcesService.crear).toHaveBeenCalled();
    // expect(component.guardar).toHaveBeenCalled();
  });

  it('should guaradar actualizar embalse', () => {
    const serviciosEmbalcesService =
      fixture.debugElement.injector.get<ServiciosEmbalcesService>(
        ServiciosEmbalcesService as any
      );
    const serviciosGeograficosService =
      fixture.debugElement.injector.get<ServiciosGeograficosService>(
        ServiciosGeograficosService as any
      );
    spyOn(serviciosEmbalcesService, 'actualizar').and.returnValue(
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
        zonaOperativaEaab: 'string',
        activo: 'string',
        fechaEstado: 'string',
        usuarioEstado: 'string',
        idDepartamento: 1,
      })
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
        zonaOperativaEaab: 'string',
        activo: 'string',
        fechaEstado: 'string',
        usuarioEstado: 'string',
        idDepartamento: 1,
      })
    );
    spyOn(serviciosGeograficosService, 'obtenerMunicipioPorId').and.returnValue(
      of({
        idMunicipio: 1,
        municipio: 'string',
        idDepartamento: 1,
      })
    );

    component.id = '12';
    component.ngOnInit();

    component.formularioEmbalse.controls['embalse'].setValue('embalse');
    component.formularioEmbalse.controls['idEntidad'].setValue(1);
    component.formularioEmbalse.controls['zonaOperativaEaab'].setValue('zona1');
    component.formularioEmbalse.controls['elevacion'].setValue(1);
    component.formularioEmbalse.controls['volumenTotal'].setValue(1);
    component.formularioEmbalse.controls['volumenUtil'].setValue(1);
    component.formularioEmbalse.controls['volumenMuerto'].setValue(1);
    component.formularioEmbalse.controls['anchoCresta'].setValue(1);
    component.formularioEmbalse.controls['alturaPresa'].setValue(1);
    component.formularioEmbalse.controls['longitudCresta'].setValue(1);
    component.formularioEmbalse.controls['fechaInicioOperacion'].setValue(
      '01/04/2021'
    );

    component.guardar();
    expect(Swal.isVisible()).toBeTruthy();
    Swal.clickConfirm();
    expect(serviciosEmbalcesService.actualizar).toHaveBeenCalled();
  });

  it('AsignarNombres', () => {
    component.ngOnInit();
    component.formularioEmbalse.controls['idCuenca'].setValue('1');
    component.formularioEmbalse.controls['idAreaHidrografica'].setValue('1');
    component.formularioEmbalse.controls['idZonaHidrografica'].setValue('1');
    component.formularioEmbalse.controls['idSubZonaHidrografica'].setValue('1');
    component.formularioEmbalse.controls['idSubCuenca'].setValue('1');
    component.formularioEmbalse.controls['idMicroCuenca'].setValue('1');
    component.formularioEmbalse.controls['longitudCresta'].setValue(1);
    component.formularioEmbalse.controls['idMicroCuenca'].setValue('1'); 
    //spyOn(component.listaCuenca.find,"find").and.returnValue(component.formularioEmbalse.controls['id']).and.callFake(()=>{console.log();return true})
    component.listaCuenca = [{test:"text",id:'1'} as never];
    component.listaAreaHidrografica = [{test:"text",id:'1'} as never];
    component.listaZonaHidrografica = [{test:"text",id:'1'} as never];
    component.listasubZonaHidrografica = [{test:"text",id:'1'} as never];
    component.listaSubcuenca = [{test:"text",id:'1'} as never];
    component.listaMicrocuenca = [{test:"text",id:'1'} as never];
    component.AsignarNombres();
    component.clickMapa('event');

    expect(component.AsignarNombres).toBeTruthy();
  });

  it('seleccionMapa', () => {
    spyOn(component, 'seleccionMapa');
    const ubicacion: any = {
      ubicacion: { longitude: 1, latitude: 1, y: 1, x: 1 },
    };
    component.seleccionMapa(ubicacion);
    expect(component.seleccionMapa).toHaveBeenCalled();
  });

  it('should cargar Capas', () => {
    const serviciosCapasService =
      fixture.debugElement.injector.get<ServiciosCapasService>(
        ServiciosCapasService as any
      );
      const serviciosGeograficosService =
      fixture.debugElement.injector.get<ServiciosGeograficosService>(
        ServiciosGeograficosService as any
      );
    spyOn(serviciosCapasService, 'obtenerPorId').and.returnValue(
      of({
        capa: 'string',
        fechaCreacion: 'string',
        fechaModificacion: 'string',
        idCapa: 1,
        identificador: 'string',
        nombreServicio: 'string',
        urlActualizar: 'string',
        urlBorrar: 'string',
        urlConsulta: 'string',
        urlCrear: 'string',
        urlVisualizar: 'string',
        usuarioCreacion: 'string',
        usuarioModificacion: 'string',
      })
    ).and.callFake((x)=>{return of({urlVisualizar:"test"}) as any});

    const ubicacion: any = {
      ubicacion: { longitude: 1, latitude: 1, y: 1, x: 1 },
    };

    spyOn(component, 'cargarCuenca');
    spyOn(component, 'cargarSubcuenca');
    spyOn(component, 'cargarMicroCuenca');
    spyOn(component, 'seleccionMapa');

    component.seleccionMapa(ubicacion);
    spyOn(serviciosGeograficosService,"consultarDatosCapa").and.callFake(()=>{
      return Promise.resolve({
        features: [
          {attributes:[
            {CODMC:1,NOMBMC:"test"},
            {CODSCH:2,NOMSCH:"test2"},
            {CODCH:3,NOMBCH:"test3"},
            {CODAH:4,NOMBAH:"test3"},
            {CODAH:5,NOMBAH:"test3"}
          ]}]})
    })
    component.cargarCuenca();
    component.cargarSubcuenca();
    component.cargarMicroCuenca();
    component.cargarZonaHidrografica();
    component.cargarSubZonaHidrografica();
    component.cargarAreaHidrografica();

    expect(component.seleccionMapa).toHaveBeenCalled();
    expect(component.cargarCuenca).toHaveBeenCalled();
    expect(component.cargarSubcuenca).toHaveBeenCalled();
  });

  it('cargarCapas', () => {
    const serviciosCapasService =
      fixture.debugElement.injector.get<ServiciosCapasService>(
        ServiciosCapasService as any
      );
    spyOn(serviciosCapasService, 'obtenerPorId').and.returnValue(
      of({
        capa: 'string',
        fechaCreacion: 'string',
        fechaModificacion: 'string',
        idCapa: 1,
        identificador: 'string',
        nombreServicio: 'string',
        urlActualizar: 'string',
        urlBorrar: 'string',
        urlConsulta: 'string',
        urlCrear: 'string',
        urlVisualizar: 'string',
        usuarioCreacion: 'string',
        usuarioModificacion: 'string',
      })
      ).and.callFake((x)=>{return of({urlVisualizar:"test"}) as any})
    const serviciosGeograficosService =
      fixture.debugElement.injector.get<ServiciosGeograficosService>(
        ServiciosGeograficosService as any
      );
    spyOn(serviciosGeograficosService, 'obtenerMunicipioPorId').and.returnValue(
      of({
        idMunicipio: 1,
        municipio: 'string',
        idDepartamento: 1,
      })
    );
    spyOn(serviciosGeograficosService, 'consultarDatosCapa').and.returnValue(
      Promise.resolve(true)
    );

    
    component.cargarCapas();
    expect(component.capas.length).toBeGreaterThan(1);
  });
});
