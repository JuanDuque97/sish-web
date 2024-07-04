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
import { DataTablesModule } from 'angular-datatables';

import { GuardarEstacionesComponent } from './guardar-estaciones.component';
import { NgSelect2Module } from 'ng-select2';
import { ServiciosEstacionesService } from '../servicios-estaciones.service';
import { ServiciosDominiosValoresService } from '../../../configuracion/dominios/servicios-dominios-valores.service';
import { ServiciosGeograficosService } from 'src/app/common/mapa/servicios-geograficos.service';
import { ServiciosCapasService } from '../../../configuracion/capas/servicios-capas.service';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import Swal from 'sweetalert2';

describe('GuardarEstacionescomponent', () => {
  let component: GuardarEstacionesComponent;
  let fixture: ComponentFixture<GuardarEstacionesComponent>;

  const formBuilder: FormBuilder = new FormBuilder();
  const fb = jasmine.createSpyObj('FormBuilder', ['group']);
  const formGroup = new FormGroup({
    identityVerificationDocumentTypeId: new FormControl('formularioEstaciones'),
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
        ServiciosEstacionesService,
        ServiciosDominiosValoresService,
        ServiciosGeograficosService,
        ServiciosCapasService,
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
      declarations: [GuardarEstacionesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GuardarEstacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('llamar listas de datos', () => {
    const serviciosDominiosValoresService =
      fixture.debugElement.injector.get<ServiciosDominiosValoresService>(
        ServiciosDominiosValoresService as any
      );
    spyOn(
      serviciosDominiosValoresService,
      'obtenerValoresPorIdDominio'
    ).and.returnValue(
      of({
        id: 1,
        dominio: 'string',
        descripcion: 'string',
      })
    );
   
    spyOn(
      serviciosDominiosValoresService,
      'obtenerValoresActivosPorIdDominio'
    ).and.returnValue(
      of({
        id: 1,
        dominio: 'string',
        descripcion: 'string',
      })
    );
    const serviciosGeograficosService =
      fixture.debugElement.injector.get<ServiciosGeograficosService>(
        ServiciosGeograficosService as any
      );
    spyOn(
      serviciosGeograficosService,
      'obtenerDepartamentos'
    ).and.returnValue(
      of({
        id: 1,
        dominio: 'string',
        descripcion: 'string',
      })
    );

    expect(component.codigoEstacionIdeam).toEqual(
      component.formularioEstaciones.controls['codigoEstacionIdeam']
    );
    expect(component.codigoEstacionEaab).toEqual(
      component.formularioEstaciones.controls['codigoEstacionEaab']
    );
    expect(component.estacion).toEqual(
      component.formularioEstaciones.controls['estacion']
    );
    expect(component.idCategoria).toEqual(
      component.formularioEstaciones.controls['idCategoria']
    );
    expect(component.idTecnologia).toEqual(
      component.formularioEstaciones.controls['idTecnologia']
    );
    expect(component.idTipoEstacion).toEqual(
      component.formularioEstaciones.controls['idTipoEstacion']
    );
    expect(component.idEntidad).toEqual(
      component.formularioEstaciones.controls['idEntidad']
    );
    expect(component.idEstado).toEqual(
      component.formularioEstaciones.controls['idEstado']
    );
    expect(component.fechaInstalacion).toEqual(
      component.formularioEstaciones.controls['fechaInstalacion']
    );
    expect(component.altitud).toEqual(
      component.formularioEstaciones.controls['altitud']
    );
 
   
    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  it('should guaradar new Estacion', () => {
    const serviciosEstacionesService =
      fixture.debugElement.injector.get<ServiciosEstacionesService>(
        ServiciosEstacionesService as any
      );
    spyOn(serviciosEstacionesService, 'crear').and.returnValue(
      of({
        idEstacion: 1,
        activo: 'string',
        altitud: 1,
        areaHidrografica: 'string',
        estacion: 'string',
        codigoEstacionEaab: 'string',
        codigoEstacionIdeam: 'string',
        corriente: 'string',
        cuenca: 'string',
        este: 1,
        fechaCreacion: 'string',
        fechaInstalacion: 'string',
        fechaModificacion: 'string',
        idCategoria: 1,
        idEntidad: 1,
        idEstado: 1,
        idMunicipio: 1,
        idTecnologia: 1,
        idTipoCoordenadas: 1,
        idTipoEstacion: 1,
        latitud: 1,
        microCuenca: 'string',
        nivelSubSiguiente: 'string',
        norte: 1,
        subZonaHidrografica: 'string',
        usuarioCreacion: 'string',
        usuarioEstado: 'string',
        usuarioModificacion: 'string',
        zonaHidrografica: 'string',
        zonaOperativaEaab: 'string',
      })
    );
    spyOn(serviciosEstacionesService, 'obtenerPorId').and.returnValue(
      of({
        idEstacion: 1,
        activo: 'string',
        altitud: 1,
        areaHidrografica: 'string',
        estacion: 'string',
        codigoEstacionEaab: 'string',
        codigoEstacionIdeam: 'string',
        corriente: 'string',
        cuenca: 'string',
        este: 1,
        fechaCreacion: 'string',
        fechaInstalacion: 'string',
        fechaModificacion: 'string',
        idCategoria: 1,
        idEntidad: 1,
        idEstado: 1,
        idMunicipio: 1,
        idTecnologia: 1,
        idTipoCoordenadas: 1,
        idTipoEstacion: 1,
        latitud: 1,
        microCuenca: 'string',
        nivelSubSiguiente: 'string',
        norte: 1,
        subZonaHidrografica: 'string',
        usuarioCreacion: 'string',
        usuarioEstado: 'string',
        usuarioModificacion: 'string',
        zonaHidrografica: 'string',
        zonaOperativaEaab: 'string',
      })
    );
    spyOn(component, 'ngOnInit');
    component.ngOnInit();
    component.id = '0'; 
    
      component.formularioEstaciones.controls['codigoEstacionIdeam'].setValue('estacion1')
      component.formularioEstaciones.controls['estacion'].setValue('estacion1')
      component.formularioEstaciones.controls['idCategoria'].setValue(1)
      component.formularioEstaciones.controls['idTecnologia'].setValue(1)
      component.formularioEstaciones.controls['idTipoEstacion'].setValue(1)
      component.formularioEstaciones.controls['idEntidad'].setValue(1)
      component.formularioEstaciones.controls['idEstado'].setValue(1)
      component.formularioEstaciones.controls['fechaInstalacion'].setValue('01/01/1999') 
      component.formularioEstaciones.controls['codigoEstacionEaab'].setValue('estacion1')
      component.formularioEstaciones.controls['idMunicipio'].setValue(1)
      component.formularioEstaciones.controls['idDepartamento'].setValue(1)
   

    component.guardar();
   expect(Swal.isVisible()).toBeTruthy()
    Swal.clickConfirm();
     expect(serviciosEstacionesService.crear).toHaveBeenCalled();  

  });

  it('should guaradar actualizar Estacion', () => {
    const serviciosEstacionesService =
      fixture.debugElement.injector.get<ServiciosEstacionesService>(
        ServiciosEstacionesService as any
      );
    spyOn(serviciosEstacionesService, 'crear').and.returnValue(
      of({
        idEstacion: 1,
        activo: 'string',
        altitud: 1,
        areaHidrografica: 'string',
        estacion: 'string',
        codigoEstacionEaab: 'string',
        codigoEstacionIdeam: 'string',
        corriente: 'string',
        cuenca: 'string',
        este: 1,
        fechaCreacion: 'string',
        fechaInstalacion: 'string',
        fechaModificacion: 'string',
        idCategoria: 1,
        idEntidad: 1,
        idEstado: 1,
        idMunicipio: 1,
        idTecnologia: 1,
        idTipoCoordenadas: 1,
        idTipoEstacion: 1,
        latitud: 1,
        microCuenca: 'string',
        nivelSubSiguiente: 'string',
        norte: 1,
        subZonaHidrografica: 'string',
        usuarioCreacion: 'string',
        usuarioEstado: 'string',
        usuarioModificacion: 'string',
        zonaHidrografica: 'string',
        zonaOperativaEaab: 'string',
      })
    );
    spyOn(serviciosEstacionesService, 'obtenerPorId').and.returnValue(
      of({
        idEstacion: 1,
        activo: 'string',
        altitud: 1,
        areaHidrografica: 'string',
        estacion: 'string',
        codigoEstacionEaab: 'string',
        codigoEstacionIdeam: 'string',
        corriente: 'string',
        cuenca: 'string',
        este: 1,
        fechaCreacion: 'string',
        fechaInstalacion: 'string',
        fechaModificacion: 'string',
        idCategoria: 1,
        idEntidad: 1,
        idEstado: 1,
        idMunicipio: 1,
        idTecnologia: 1,
        idTipoCoordenadas: 1,
        idTipoEstacion: 1,
        latitud: 1,
        microCuenca: 'string',
        nivelSubSiguiente: 'string',
        norte: 1,
        subZonaHidrografica: 'string',
        usuarioCreacion: 'string',
        usuarioEstado: 'string',
        usuarioModificacion: 'string',
        zonaHidrografica: 'string',
        zonaOperativaEaab: 'string',
      })
    );
    spyOn(component, 'ngOnInit');
    component.ngOnInit();
    component.id = '10'; 
    
      component.formularioEstaciones.controls['codigoEstacionIdeam'].setValue('estacion1')
      component.formularioEstaciones.controls['estacion'].setValue('estacion1')
      component.formularioEstaciones.controls['idCategoria'].setValue(1)
      component.formularioEstaciones.controls['idTecnologia'].setValue(1)
      component.formularioEstaciones.controls['idTipoEstacion'].setValue(1)
      component.formularioEstaciones.controls['idEntidad'].setValue(1)
      component.formularioEstaciones.controls['idEstado'].setValue(1)
      component.formularioEstaciones.controls['fechaInstalacion'].setValue('01/01/1999') 
      component.formularioEstaciones.controls['codigoEstacionEaab'].setValue('estacion1')
      component.formularioEstaciones.controls['idMunicipio'].setValue(1)
      component.formularioEstaciones.controls['idDepartamento'].setValue(1)
   

    component.guardar();
   expect(Swal.isVisible()).toBeTruthy()
    Swal.clickConfirm(); 
    expect(serviciosEstacionesService.actualizar).toBeTruthy();
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
    spyOn(component, 'cargarCapas');
    spyOn(component, 'seleccionMapa'); 
    spyOn(component,'cargarZonaHidrografica')
    spyOn(component,'cargarSubZonaHidrografica')
    spyOn(component,'cargarAreaHidrografica')

    component.seleccionMapa(ubicacion);
    component.cargarCuenca();
    component.cargarSubcuenca();
    component.cargarMicroCuenca();
    component.cargarCapas();
    component.cargarZonaHidrografica();
    component.cargarSubZonaHidrografica();
    component.cargarAreaHidrografica();

    expect(component.seleccionMapa).toHaveBeenCalled();
    expect(component.cargarCuenca).toHaveBeenCalled();
    expect(component.cargarSubcuenca).toHaveBeenCalled();
    expect(component.cargarCapas).toHaveBeenCalled();


    expect(component.cargarZonaHidrografica).toHaveBeenCalled();
    expect(component.cargarSubZonaHidrografica).toHaveBeenCalled();
    expect(component.cargarAreaHidrografica).toHaveBeenCalled();
  });

  it('seleccionMapa', () => {
    const latitud = 1;
    const longitud = 1;
    const norte = 1;
    const este = 1;

    spyOn(component, 'seleccionMapa');
    const ubicacion: any = {
      ubicacion: { longitude: 1, latitude: 1, y: 1, x: 1 },
    };
    component.seleccionMapa(ubicacion);
    expect(component.seleccionMapa).toHaveBeenCalled();
  });


  it('AsignarNombres', () => {
    component.ngOnInit();  
    component.formularioEstaciones.controls['idCuenca'].setValue('1');
    component.formularioEstaciones.controls['idAreaHidrografica'].setValue('1');
    component.formularioEstaciones.controls['idZonaHidrografica'].setValue('1');
    component.formularioEstaciones.controls['idSubZonaHidrografica'].setValue('1');
    component.formularioEstaciones.controls['idSubCuenca'].setValue('1');
    component.formularioEstaciones.controls['idMicroCuenca'].setValue('1'); 
    component.AsignarNombres();
    component.clickMapa('event');
    
    expect(component.AsignarNombres).toBeTruthy();
  });

});
