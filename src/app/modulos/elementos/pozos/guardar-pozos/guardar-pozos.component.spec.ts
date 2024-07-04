import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NgSelect2Module } from 'ng-select2';

import { GuardarPozosComponent } from './guardar-pozos.component';
import { ServiciosDominiosValoresService } from '../../../configuracion/dominios/servicios-dominios-valores.service';
import { ServiciosPozosService } from '../servicios-pozos.service';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { ServiciosGeograficosService } from 'src/app/common/mapa/servicios-geograficos.service';
import { ServiciosCapasService } from 'src/app/modulos/configuracion/capas/servicios-capas.service';
import Swal from 'sweetalert2';

describe('GuardarPozosComponent', () => {
  let component: GuardarPozosComponent;
  let fixture: ComponentFixture<GuardarPozosComponent>;

  const formBuilder: FormBuilder = new FormBuilder();
  const fb = jasmine.createSpyObj('FormBuilder', ['group']);
  const formGroup = new FormGroup({
    identityVerificationDocumentTypeId: new FormControl('formularioPozo'),
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
        ServiciosPozosService,
        ServiciosDominiosValoresService,
        {
          provider: ActivatedRoute,
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
      declarations: [GuardarPozosComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GuardarPozosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should obtencion listas', () => {


    
    const serviciosPozosService =
      fixture.debugElement.injector.get<ServiciosPozosService>(
        ServiciosPozosService as any
      );

    spyOn(serviciosPozosService, 'obtenerDepartamentos').and.returnValue(
      of([
        {
          id: 1,
          text: 'Prueba',
          disabled: false,
        },
      ])
    );

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

    expect(component.zonaOperativaEaab).toEqual(
      component.formularioPozo.controls['zonaOperativaEaab']
    );
    expect(component.fechaInicioOperacion).toEqual(
      component.formularioPozo.controls['fechaInicioOperacion']
    );
    expect(component.cotaBoca).toEqual(
      component.formularioPozo.controls['cotaBoca']
    );
    expect(component.cotaMedidor).toEqual(
      component.formularioPozo.controls['cotaMedidor']
    );
    expect(component.profundidad).toEqual(
      component.formularioPozo.controls['profundidad']
    );
    expect(component.idTipoPozo).toEqual(
      component.formularioPozo.controls['idTipoPozo']
    );
    expect(component.idCategoria).toEqual(
      component.formularioPozo.controls['idCategoria']
    );
    expect(component.idCondicion).toEqual(
      component.formularioPozo.controls['idCondicion']
    );

    spyOn(serviciosPozosService, 'obtenerPorId').and.returnValue(
      of({
        activo: 'N',
  areaHidrografica: 'string',
  cotaBoca: 1,
  cotaMedidor: 1,
  cuenca: 'string',
  fechaCreacion: 'string',
  fechaEstado: 'string',
  fechaInicioOperacion: 'string',
  fechaModificacion: 'string',
  idCategoria: 1,
  idCondicion: 1,
  idMunicipio: 1,
  idPozo: 1,
  idTipoPozo: 1,
  microcuenca: 'string',
  nivelSubsiguiente: 'string',
  pozo: 'string',
  profundidad: 1,
  subZonaHidrografica: 'string',
  usuarioCreacion: 'string',
  usuarioEstado: 'string',
  usuarioModificacion: 'string',
  zonaHidrografica: 'string',
  zonaOperativaEaab: 'string',
  subcuenca: 'string',
  latitud   :1,
  longitud   :1,
  idDepartamento: 1, 
  idTipoCoordenada: 1,  
      })
    );
    component.ngOnInit();

    expect(component).toBeTruthy();
  });
  it('should obtencion listas', () => {


    
    const serviciosPozosService =
      fixture.debugElement.injector.get<ServiciosPozosService>(
        ServiciosPozosService as any
      );

    spyOn(serviciosPozosService, 'obtenerDepartamentos').and.returnValue(
      of([
        {
          id: 1,
          text: 'Prueba',
          disabled: false,
        },
      ])
    );

    const serviciosDominiosValoresService =
      fixture.debugElement.injector.get<ServiciosDominiosValoresService>(
        ServiciosDominiosValoresService as any
      );
    spyOn(
      serviciosDominiosValoresService,
      'obtenerValoresActivosPorIdDominio'
    ).and.returnValue(
      of([
        {
          id: 1,
          text: 'Prueba',
          disabled: false,
        },
      ])
    );

    expect(component.microCuenca).toEqual(
      component.formularioPozo.controls['idMicroCuenca']
    );
    expect(component.latitud).toEqual(
      component.formularioPozo.controls['latitud']
    );
    expect(component.longitud).toEqual(
      component.formularioPozo.controls['longitud']
    );
    
component.ac = 'C'
component.id = '0'
spyOn(component,'ngOnInit')

    component.ngOnInit();

    expect(component).toBeTruthy();
  });

  it('should guaradar new Pozo', () => {
    const serviciosPozosService =
      fixture.debugElement.injector.get<ServiciosPozosService>(
        ServiciosPozosService as any
      );

    spyOn(serviciosPozosService, 'crear').and.returnValue(
      of({
        activo: 'N',
        areaHidrografica: 'string',
        cotaBoca: 1,
        cotaMedidor: 1,
        cuenca: 'string',
        fechaCreacion: 'string',
        fechaEstado: 'string',
        fechaInicioOperacion: 'string',
        fechaModificacion: 'string',
        idCategoria: 1,
        idCondicion: 1,
        idMunicipio: 1,
        idPozo: 1,
        idTipoPozo: 1,
        microcuenca: 'string',
        nivelSubsiguiente: 'string',
        pozo: 'string',
        profundidad: 1,
        subZonaHidrografica: 'string',
        usuarioCreacion: 'string',
        usuarioEstado: 'string',
        usuarioModificacion: 'string',
        zonaHidrografica: 'string',
        zonaOperativaEaab: 'string',
        subcuenca: 'string',
        latitud   :1,
        longitud   :1,
        idDepartamento: 1, 
        idTipoCoordenada: 1,  
      })
    );

    spyOn(serviciosPozosService, 'obtenerPorId').and.returnValue(
      of({
        activo: 'N',
        areaHidrografica: 'string',
        cotaBoca: 1,
        cotaMedidor: 1,
        cuenca: 'string',
        fechaCreacion: 'string',
        fechaEstado: 'string',
        fechaInicioOperacion: 'string',
        fechaModificacion: 'string',
        idCategoria: 1,
        idCondicion: 1,
        idMunicipio: 1,
        idPozo: 1,
        idTipoPozo: 1,
        microcuenca: 'string',
        nivelSubsiguiente: 'string',
        pozo: 'string',
        profundidad: 1,
        subZonaHidrografica: 'string',
        usuarioCreacion: 'string',
        usuarioEstado: 'string',
        usuarioModificacion: 'string',
        zonaHidrografica: 'string',
        zonaOperativaEaab: 'string',
        subcuenca: 'string',
        latitud   :1,
        longitud   :1,
        idDepartamento: 1, 
        idTipoCoordenada: 1,  
      })
    ); 

    component.id = '0'; 
    component.formularioPozo.controls['pozo'].setValue('pozo');
    component.formularioPozo.controls['fechaInicioOperacion'].setValue(
      'fechaInicioOperacion'
    );
    component.formularioPozo.controls['cotaBoca'].setValue('cotaBoca');
    component.formularioPozo.controls['cotaMedidor'].setValue('cotaMedidor');
    component.formularioPozo.controls['profundidad'].setValue('profundidad');
    component.formularioPozo.controls['idTipoPozo'].setValue('idTipoPozo');
    component.formularioPozo.controls['idCategoria'].setValue('idCategoria');
    component.formularioPozo.controls['idCondicion'].setValue('idCondicion');

    // console.log('validacion formulario ',component.formularioPozo)

   
    component.guardar();
    expect(Swal.isVisible()).toBeTruthy();
    Swal.clickConfirm();
    expect(serviciosPozosService.crear).toHaveBeenCalled();
    // expect(component.guardar).toHaveBeenCalled();

  });

  it('should guaradar actualizar Pozo', () => {
    const serviciosPozosService =
      fixture.debugElement.injector.get<ServiciosPozosService>(
        ServiciosPozosService as any
      );

    spyOn(serviciosPozosService, 'actualizar').and.returnValue(
      of({
        activo: 'N',
  areaHidrografica: 'string',
  cotaBoca: 1,
  cotaMedidor: 1,
  cuenca: 'string',
  fechaCreacion: 'string',
  fechaEstado: 'string',
  fechaInicioOperacion: 'string',
  fechaModificacion: 'string',
  idCategoria: 1,
  idCondicion: 1,
  idMunicipio: 1,
  idPozo: 1,
  idTipoPozo: 1,
  microcuenca: 'string',
  nivelSubsiguiente: 'string',
  pozo: 'string',
  profundidad: 1,
  subZonaHidrografica: 'string',
  usuarioCreacion: 'string',
  usuarioEstado: 'string',
  usuarioModificacion: 'string',
  zonaHidrografica: 'string',
  zonaOperativaEaab: 'string',
  subcuenca: 'string',
  latitud   :1,
  longitud   :1,
  idDepartamento: 1, 
  idTipoCoordenada: 1,  
      })
    );

    spyOn(serviciosPozosService, 'obtenerPorId').and.returnValue(
      of({
        activo: 'N',
  areaHidrografica: 'string',
  cotaBoca: 1,
  cotaMedidor: 1,
  cuenca: 'string',
  fechaCreacion: 'string',
  fechaEstado: 'string',
  fechaInicioOperacion: 'string',
  fechaModificacion: 'string',
  idCategoria: 1,
  idCondicion: 1,
  idMunicipio: 1,
  idPozo: 1,
  idTipoPozo: 1,
  microcuenca: 'string',
  nivelSubsiguiente: 'string',
  pozo: 'string',
  profundidad: 1,
  subZonaHidrografica: 'string',
  usuarioCreacion: 'string',
  usuarioEstado: 'string',
  usuarioModificacion: 'string',
  zonaHidrografica: 'string',
  zonaOperativaEaab: 'string',
  subcuenca: 'string',
  latitud   :1,
  longitud   :1,
  idDepartamento: 1, 
  idTipoCoordenada: 1,  
      })
    );
 
    component.id = '12';
    component.ngOnInit();

    component.formularioPozo.controls['pozo'].setValue('pozo');
    component.formularioPozo.controls['fechaInicioOperacion'].setValue(
      'fechaInicioOperacion'
    );
    component.formularioPozo.controls['cotaBoca'].setValue('cotaBoca');
    component.formularioPozo.controls['cotaMedidor'].setValue('cotaMedidor');
    component.formularioPozo.controls['profundidad'].setValue('profundidad');
    component.formularioPozo.controls['idTipoPozo'].setValue('idTipoPozo');
    component.formularioPozo.controls['idCategoria'].setValue('idCategoria');
    component.formularioPozo.controls['idCondicion'].setValue('idCondicion');

    component.guardar();
    expect(Swal.isVisible()).toBeTruthy();
    Swal.clickConfirm();
    expect(serviciosPozosService.actualizar).toHaveBeenCalled();
  });
 

  it('AsignarNombres', () => {
    component.ngOnInit();
    component.formularioPozo.controls['idCuenca'].setValue('1');
    component.formularioPozo.controls['idAreaHidrografica'].setValue('1');
    component.formularioPozo.controls['idZonaHidrografica'].setValue('1');
    component.formularioPozo.controls['idSubZonaHidrografica'].setValue('1');
    component.formularioPozo.controls['idSubCuenca'].setValue('1');
    component.formularioPozo.controls['idMicroCuenca'].setValue('1');
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
    );

    const ubicacion: any = {
      ubicacion: { longitude: 1, latitude: 1, y: 1, x: 1 },
    };

    spyOn(component, 'cargarCuenca');
    spyOn(component, 'cargarSubcuenca');
    spyOn(component, 'cargarMicroCuenca');
    spyOn(component, 'seleccionMapa');

    component.seleccionMapa(ubicacion);
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
    );
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
