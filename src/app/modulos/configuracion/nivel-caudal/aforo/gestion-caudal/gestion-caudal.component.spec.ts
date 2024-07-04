import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionCaudalComponent } from './gestion-caudal.component';
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
import { ServiciosArchivoCampos } from '../../../tipo-archivos/servicios-archivo-campos.service';
import { ServiciosObservacionesEstacionService } from '../servicios-observaciones-estacion.service';
import { ServiciosObservacionesEmbalsesService } from '../servicios-observaciones-embalses.service';
import { ServiciosObservacionesPozosService } from '../servicios-observaciones-pozos.service';
import { of } from 'rxjs';
import { ServiciosPozosService } from '../../../../elementos/pozos/servicios-pozos.service';
import { ServiciosEmbalcesService } from '../../../../elementos/embalses/servicios-embalses.service';
import { ServiciosEstacionesService } from '../../../../elementos/estaciones/servicios-estaciones.service';
import { ServiciosParametrosEstacionesService } from '../../../../elementos/estaciones/servicios-parametros-estaciones.service';
import { ServiciosParametrosEmbalseService } from '../../../../elementos/embalses/servicios-parametros-embalse.service';
import { ServiciosParametrosPozosService } from '../../../../elementos/pozos/servicios-parametros-pozos.service';
import Swal from 'sweetalert2';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('GestionCaudalComponent', () => {
  let component: GestionCaudalComponent;
  let fixture: ComponentFixture<GestionCaudalComponent>;
  const formBuilder: FormBuilder = new FormBuilder();
  const fb = jasmine.createSpyObj('FormBuilder', ['group']);
  const formGroup = new FormGroup({
    identityVerificationDocumentTypeId: new FormControl(
      'formularioArchivoCampos'
    ),
  });
  (<jasmine.Spy>fb.group).and.returnValue(formGroup);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          {
            path: 'configuracion/gestionObservaciones',
            component: GestionCaudalComponent,
          },
        ]),
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
        NgSelect2Module,
      ],
      providers: [
        ServiciosArchivoCampos,
        ServiciosObservacionesEstacionService,
        ServiciosObservacionesEmbalsesService,
        ServiciosObservacionesPozosService,

        {
          provider: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ te: '1', ac: 'E', id: '1' }),
            },
          },
        },
        {
          provide: FormBuilder,
          useValue: formBuilder,
        },
      ],
      declarations: [GestionCaudalComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionCaudalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('ngOnInit', () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
  });
  it('obtenerElemento Estaciones', () => {
    const serviciosObservacionesEstacionService =
      fixture.debugElement.injector.get<ServiciosObservacionesEstacionService>(
        ServiciosObservacionesEstacionService as any
      );
    // Estaciones
    spyOn(
      serviciosObservacionesEstacionService,
      'obtenerPorIdDTO'
    ).and.returnValue(
      of([
        {
          activo: 'string',
          descripcion: 'string',
          estacion: 'string',
          estadoObservacion: 'string',
          fecha: '01/15/2016 20:05:53 GMT-0400',
          fechaCargue: 'string',
          fechaCreacion: 'string',
          fechaEstado: 'string',
          fechaModificacion: 'string',
          idEstacion: 1,
          idEstadoObservacion: 1,
          idObservacionXEstacionInicial: 1,
          idParametro: 1,
          idParametroXEstacion: 1,
          idTipoOrigenObservacion: 1,
          origen: 'string',
          tipoOrigenObservacion: 'string',
          usuarioCargue: 'string',
          usuarioCreacion: 'string',
          usuarioEstado: 'string',
          usuarioModificacion: 'string',
          valor: 1,
          frecuencia: 155,
          idFlagObservacion: 1,
        },
      ])
    );


    spyOn(component, 'obtenerElemento');

    component.te = '1';
    component.id = '1';
    component.ac = 'E';

    component.obtenerElemento();

    console.log('Llego', component.te);
    expect(component.obtenerElemento).toHaveBeenCalled();

  });
  it('obtenerElemento Embalse', () => {
    const serviciosObservacionesEmbalsesService =
      fixture.debugElement.injector.get<ServiciosObservacionesEmbalsesService>(
        ServiciosObservacionesEmbalsesService as any
      );
    // Estaciones
    spyOn(
      serviciosObservacionesEmbalsesService,
      'obtenerPorIdDTO'
    ).and.returnValue(
      of([
        {
          idEmbalse: 1,
          activo: 'String',
          descripcion: 'String',
          estacion: 'String',
          estadoObservacion: 'String',
          fecha: 'YYYY-MM-DD hh:mm:ss',
          fechaCargue: 'String',
          fechaCreacion: 'String',
          fechaEstado: 'String',
          fechaModificacion: 'String',
          idEstacion: 1,
          idEstadoObservacion: 1,
          idParametro: 1,

          idObservacionXEmbalseInicial: 1,
          idParametroXEmbalse: 1,

          idTipoOrigenObservacion: 1,
          origen: 'String',
          tipoOrigenObservacion: 'String',
          usuarioCargue: 'String',
          usuarioCreacion: 'String',
          usuarioEstado: 'String',
          usuarioModificacion: 'String',
          valor: 1,
          frecuencia: 155,
          idFlagObservacion: 1,
        },
      ])
    );

    component.te = '2';
    component.id = '2';
    component.ac = 'E';

    spyOn(component, 'obtenerElemento');
    component.obtenerElemento();

    // console.log('Llego',component.formularioObservaciones.value)
    expect(component.obtenerElemento).toHaveBeenCalled();
  });
  it('obtenerElemento Pozos', () => {
    const serviciosObservacionesPozosService =
      fixture.debugElement.injector.get<ServiciosObservacionesPozosService>(
        ServiciosObservacionesPozosService as any
      );
    // Estaciones
    spyOn(
      serviciosObservacionesPozosService,
      'obtenerPorIdDTO'
    ).and.returnValue(
      of([
        {
          fecha: 'YYYY-MM-DD hh:mm:ss',
          activo: 'String',
          descripcion: 'String',
          estacion: 'String',
          estadoObservacion: 'String',
          fechaCargue: 'String',
          fechaCreacion: 'String',
          fechaEstado: 'String',
          fechaModificacion: 'String',
          idPozo: 1,
          idEstadoObservacion: 1,
          idParametro: 1,
          idObservacionXPozoInicial: 1,
          idParametroXPozo: 1,
          idTipoOrigenObservacion: 1,
          origen: 'String',
          tipoOrigenObservacion: 'String',
          usuarioCargue: 'String',
          usuarioCreacion: 'String',
          usuarioEstado: 'String',
          usuarioModificacion: 'String',
          valor: 1,
          frecuencia: 155,
          idFlagObservacion: 1,
        },
      ])
    );

    component.te = '2';
    component.id = '3';
    component.ac = 'E';

    spyOn(component, 'obtenerElemento');
    component.obtenerElemento();

    // console.log('Llego',component.formularioObservaciones.value)
    expect(component.obtenerElemento).toHaveBeenCalled();
  });
  it('obtenerElementos Pozos', () => {
    const serviciosPozosService =
      fixture.debugElement.injector.get<ServiciosPozosService>(
        ServiciosPozosService as any
      );
    // Estaciones
    spyOn(serviciosPozosService, 'obtenerPozosDTO').and.returnValue(
      of([
        {
          activo: 'string',
          areaHidrografica: 'string',
          categoria: 'string',
          condicion: 'string',
          cotaBoca: 1,
          cotaMedidor: 1,
          cuenca: 'string',
          departamento: 'string',
          fechaCreacion: 1,
          fechaEstado: 1,
          fechaInicioOperacion: 1,
          fechaModificacion: 1,
          idAreaHidrografica: 'string',
          idCategoria: 1,
          idCondicion: 1,
          idCuenca: 'string',
          idDepartamento: 1,
          idMicroCuenca: 'string',
          idMunicipio: 1,
          idPozo: 1,
          idSubCuenca: 'string',
          idSubZonaHidrografica: 'string',
          idTipoCoordenada: 1,
          idTipoPozo: 1,
          idZonaHidrografica: 'string',
          latitud: 1,
          longitud: 1,
          microcuenca: 'string',
          municipio: 'string',
          nivelSubsiguiente: 'string',
          pozo: 'string',
          profundidad: 1,
          subCuenca: 'string',
          subZonaHidrografica: 'string',
          tipoCoordenada: 'string',
          tipoPozo: 'string',
          usuarioCreacion: 'string',
          usuarioEstado: 'string',
          usuarioModificacion: 'string',
          zonaHidrografica: 'string',
          zonaOperativaEaab: 'string',
        },
      ])
    );

    var even = '3';
    spyOn(component, 'obtenerElemento');
    component.obtenerElementos(even);

    expect(Swal.isVisible()).toBeTruthy();
    Swal.clickConfirm();
    expect(component.listaElemento.length).toEqual(1);

    // console.log('Llego',component.formularioObservaciones.value)
  });
  it('obtenerElementos Embalse', () => {
    const serviciosEmbalcesService =
      fixture.debugElement.injector.get<ServiciosEmbalcesService>(
        ServiciosEmbalcesService as any
      );
    // Estaciones
    spyOn(serviciosEmbalcesService, 'obtenerEembalsesDTO').and.returnValue(
      of([
        {
          activo: 'string',
          alturaPresa: 1,
          anchoCresta: 1,
          areaHidrografica: 'string',
          cuenca: 'string',
          elevacion: 1,
          embalse: 'string',
          entidad: 'string',
          fechaCreacion: 1,
          fechaEstado: 1,
          fechaInicioOperacion: "1",
          fechaModificacion: 1,
          idAreaHidrografica: 'string',
          idCuenca: 'string',
          idEmbalse: 1,
          idEntidad: 1,
          idMicroCuenca: 'string',
          idMunicipio: 1,
          idSubCuenca: 'string',
          idSubZonaHidrografica: 'string',
          idZonaHidrografica: 'string',
          longitudCresta: 1,
          microcuenca: 'string',
          municipio: 'string',
          nivelSubsiguiente: 'string',
          subCuenca: 'string',
          subZonaHidrografica: 'string',
          usuarioCreacion: 'string',
          usuarioEstado: 'string',
          usuarioModificacion: 'string',
          volumenMuerto: 1,
          volumenTotal: 1,
          volumenUtil: 1,
          zonaHidrografica: 'string',
          zonaOperativaEaab: 'string',
        },
      ])
    );

    var even = '2';
    spyOn(component, 'obtenerElemento');
    component.obtenerElementos(even);
    expect(Swal.isVisible()).toBeTruthy();
    Swal.clickConfirm();
    expect(component.listaElemento.length).toEqual(1);
  });
  it('obtenerElementos Estaciones', () => {
    const serviciosEstacionesService =
      fixture.debugElement.injector.get<ServiciosEstacionesService>(
        ServiciosEstacionesService as any
      );
    // Estaciones
    spyOn(serviciosEstacionesService, 'obtenerEstaciones').and.returnValue(
      of([
        {
          activo: 'string',
          altitud: 1,
          areaHidrografica: 'string',
          categoria: 'string',
          codigoEstacionEaab: 'string',
          codigoEstacionIdeam: 'string',
          corriente: 'string',
          cuenca: 'string',
          departamento: 'string',
          entidad: 'string',
          estacion: 'string',
          estado: 'string',
          este: 1,
          fechaCreacion: 1,
          fechaEstado: 1,
          fechaInstalacion: 1,
          fechaModificacion: 1,
          idAreaHidrografica: 'string',
          idCategoria: 1,
          idCorriente: 1,
          idCuenca: 'string',
          idDepartamento: 1,
          idEntidad: 1,
          idEstacion: 1,
          idEstado: 1,
          idMicroCuenca: 'string',
          idMunicipio: 1,
          idSubCuenca: 'string',
          idSubZonaHidrografica: 'string',
          idTecnologia: 1,
          idTipoCoordenadas: 1,
          idTipoEstacion: 1,
          idZonaHidrografica: 'string',
          latitud: 1,
          longitud: 1,
          microCuenca: 'string',
          municipio: 'string',
          nivelSubSiguiente: 'string',
          norte: 1,
          subCuenca: 'string',
          subZonaHidrografica: 'string',
          tecnologia: 'string',
          tipoCoordenadas: 'string',
          tipoEstacion: 'string',
          usuarioCreacion: 'string',
          usuarioEstado: 'string',
          usuarioModificacion: 'string',
          zonaHidrografica: 'string',
          zonaOperativaEaab: 'string',
        },
        {  activo: 'string',
        altitud: 1,
        areaHidrografica: 'string',
        categoria: 'string',
        codigoEstacionEaab: 'string',
        codigoEstacionIdeam: 'string',
        corriente: 'string',
        cuenca: 'string',
        departamento: 'string',
        entidad: 'string',
        estacion: 'string',
        estado: 'string',
        este: 1,
        fechaCreacion: 1,
        fechaEstado: 1,
        fechaInstalacion: 1,
        fechaModificacion: 1,
        idAreaHidrografica: 'string',
        idCategoria: 1,
        idCorriente: 1,
        idCuenca: 'string',
        idDepartamento: 1,
        idEntidad: 1,
        idEstacion: 1,
        idEstado: 1,
        idMicroCuenca: 'string',
        idMunicipio: 1,
        idSubCuenca: 'string',
        idSubZonaHidrografica: 'string',
        idTecnologia: 1,
        idTipoCoordenadas: 1,
        idTipoEstacion: 1,
        idZonaHidrografica: 'string',
        latitud: 1,
        longitud: 1,
        microCuenca: 'string',
        municipio: 'string',
        nivelSubSiguiente: 'string',
        norte: 1,
        subCuenca: 'string',
        subZonaHidrografica: 'string',
        tecnologia: 'string',
        tipoCoordenadas: 'string',
        tipoEstacion: 'string',
        usuarioCreacion: 'string',
        usuarioEstado: 'string',
        usuarioModificacion: 'string',
        zonaHidrografica: 'string',
        zonaOperativaEaab: 'string',}
      ])
    );

    var even = '1';
    spyOn(component, 'obtenerElementos');
    component.obtenerElementos(even); 
    expect(component.listaElemento.length).toEqual(0);
  });
  it('obtenerParametrosElemento Estaciones', () => {
    const serviciosParametrosEstacionesService =
      fixture.debugElement.injector.get<ServiciosParametrosEstacionesService>(
        ServiciosParametrosEstacionesService as any
      );
    // Estaciones
    spyOn(
      serviciosParametrosEstacionesService,
      'obtenerListaParametros'
    ).and.returnValue(
      of([
        {
          idParametroXEstacion: 1,
          idParametro: 1,
          idEstacion: 1,
          descripcionParametro: 'String',
          idPeriodo: 1,
          codigo: 'Codigo 01',
        },
      ])
    );

    var even = '2';
    var mecanismo = '1';

    console.log('enviando');
    component.obtenerParametrosElemento(even, mecanismo);

    expect(component.NombresParametros.length).toEqual(1);
    expect(component.CodigoParametros.length).toEqual(1);
  });
  it('obtenerParametrosElemento Embalse', () => {
    const serviciosParametrosEmbalseService =
      fixture.debugElement.injector.get<ServiciosParametrosEmbalseService>(
        ServiciosParametrosEmbalseService as any
      );
    // Estaciones
    spyOn(
      serviciosParametrosEmbalseService,
      'obtenerListaParametrosXEmbalse'
    ).and.returnValue(
      of([
        {
          idEmbalse: 1,
          idParametro: 1,
          idParametroXEmbalse: 1,
          descripcionParametro: 'String',
          codigo: 'Codigo 01',
          activo: 'S',
        },
      ])
    );

    var even = '2';
    var mecanismo = '2';

    console.log('enviando');
    component.obtenerParametrosElemento(even, mecanismo);

    expect(component.NombresParametros.length).toEqual(1);
    expect(component.CodigoParametros.length).toEqual(1);
  });
  it('obtenerParametrosElemento Pozos', () => {
    const serviciosParametrosPozosService =
      fixture.debugElement.injector.get<ServiciosParametrosPozosService>(
        ServiciosParametrosPozosService as any
      );
    // Estaciones
    spyOn(
      serviciosParametrosPozosService,
      'obtenerListaParametrosXPozo'
    ).and.returnValue(
      of([
        {
          idParametro: 1,
          idParametroXPozo: 1,
          idPozo: 1,
          descripcionParametro: 'String',
          idPeriodo: 1,
          codigo: 'Codigo 01',
          activo: 'S',
        },
      ])
    );

    var even = '3';
    var mecanismo = '3';

    console.log('enviando');
    component.obtenerParametrosElemento(even, mecanismo);

    expect(component.NombresParametros.length).toEqual(1);
    expect(component.CodigoParametros.length).toEqual(1);
  });
  it('agregarlista', () => {
    (component.idParametro = 1),
      (component.fechaObservacion = 1),
      (component.valor = 1),
      (component.flag = 1),
      (component.idfrecuencia = 151),
      (component.fecha = '01/15/2016 20:05:53 GMT-0400'),
      (component.origen = 'ORIGUEN MANUAL'),
    expect(component.datosFilter.length).toEqual(1);
  });
  it('guardar Estacion', () => {
    component.datosFilter = [
      {
        idParametro: 1,
        idParametroXEstacion: 1,
        idObservacionXEstacionInicial: 1,
        fechaObservacion: 1,
        valor: 1,
        flag: 1,
        idfrecuencia: 151,
        fecha: '01/15/2016 20:05:53 GMT-0400',
        origen: 'ORIGUEN MANUAL',
      },
    ];

    const serviciosObservacionesEstacionService =
      fixture.debugElement.injector.get<ServiciosObservacionesEstacionService>(
        ServiciosObservacionesEstacionService as any
      );
    // Estaciones
    spyOn(
      serviciosObservacionesEstacionService,
      'creacionMasiva'
    ).and.returnValue(
      of([
        {
          map(
            arg0: (p: {
              [x: string]: any;
              idObservacionXEstacionInicial: any;
            }) => { [x: string]: any; idObservacionXEstacionInicial: any }
          ): any {},
          activo: 'string',
          fecha: 'String',
          fechaCargue: 'String',
          fechaCreacion: 'String',
          fechaEstado: 'String',
          fechaModificacion: 'String',
          flagInsert: true,
          idEstadoObservacion: 1,
          idFlagObservacion: 1,
          idObservacionXEstacionInicial: 1,
          idParametroXEstacion: 1,
          idTipoOrigenObservacion: 1,
          origen: 'String',
          usuarioCargue: 'String',
          usuarioCreacion: 'String',
          usuarioEstado: 'String',
          usuarioModificacion: 'String',
          valor: 1,
          idEstacion: 1,
        },
      ])
    );

    var mecanismo = '1';
    component.guardar(mecanismo);
    expect(Swal.isVisible()).toBeTruthy();
    Swal.clickConfirm();

    expect(component.guardar).toBeTruthy();
  });
  it('guardar Embalses', () => {
    component.datosFilter = [
      {
        idParametro: 1,
        idParametroXEmbalse: 1,
        idObservacionXEmbalseInicial: 1,
        fechaObservacion: 1,
        valor: 1,
        flag: 1,
        idfrecuencia: 151,
        fecha: '01/15/2016 20:05:53 GMT-0400',
        origen: 'ORIGUEN MANUAL',
      },
    ];

    const serviciosObservacionesEmbalsesService =
      fixture.debugElement.injector.get<ServiciosObservacionesEmbalsesService>(
        ServiciosObservacionesEmbalsesService as any
      );
    // Estaciones
    spyOn(
      serviciosObservacionesEmbalsesService,
      'creacionMasiva'
    ).and.returnValue(
      of([
        {
          activo: 'String',
          fecha: 'String',
          fechaCargue: 'String',
          fechaCreacion: 'String',
          fechaEstado: 'String',
          fechaModificacion: 'String',
          flagInsert: true,
          idEstadoObservacion: 1,
          idFlagObservacion: 1,
          idObservacionXEmbalseInicial: 1,
          idParametroXEmbalse: 1,
          idTipoOrigenObservacion: 1,
          origen: 'String',
          usuarioCargue: 'String',
          usuarioCreacion: 'String',
          usuarioEstado: 'String',
          usuarioModificacion: 'String',
          valor: 1,
          idEmbalse: 1,
        },
      ])
    );

    var mecanismo = '2';
    component.guardar(mecanismo);
    expect(Swal.isVisible()).toBeTruthy();
    Swal.clickConfirm();

    expect(component.guardar).toBeTruthy();
  });
  it('guardar Pozos', () => {
    component.datosFilter = [
      {
        idParametro: 1,
        idParametroXEmbalse: 1,
        idObservacionXEmbalseInicial: 1,
        fechaObservacion: 1,
        valor: 1,
        flag: 1,
        idfrecuencia: 151,
        fecha: '01/15/2016 20:05:53 GMT-0400',
        origen: 'ORIGUEN MANUAL',
      },
    ];

    const serviciosObservacionesPozosService =
      fixture.debugElement.injector.get<ServiciosObservacionesPozosService>(
        ServiciosObservacionesPozosService as any
      );
    // Pozos
    spyOn(serviciosObservacionesPozosService, 'creacionMasiva').and.returnValue(
      of([
        {
          activo: 'String',
          fecha: 'String',
          fechaCargue: 'String',
          fechaCreacion: 'String',
          fechaEstado: 'String',
          fechaModificacion: 'String',
          flagInsert: true,
          idEstadoObservacion: 1,
          idFlagObservacion: 1,
          idObservacionXPozoInicial: 1,
          idParametroXPozo: 1,
          idTipoOrigenObservacion: 1,
          origen: 'String',
          usuarioCargue: 'String',
          usuarioCreacion: 'String',
          usuarioEstado: 'String',
          usuarioModificacion: 'String',
          valor: 1,
        },
      ])
    );

    var mecanismo = '3';
    component.guardar(mecanismo);
    expect(Swal.isVisible()).toBeTruthy();
    Swal.clickConfirm();

    expect(component.guardar).toBeTruthy();
  });

  it('Actualizar Estacion', () => {
    component.te = '1';
    const serviciosObservacionesEstacionService =
      fixture.debugElement.injector.get<ServiciosObservacionesEstacionService>(
        ServiciosObservacionesEstacionService as any
      );
    // Estaciones
    spyOn(serviciosObservacionesEstacionService, 'actualizar').and.returnValue(
      of({
        map(
          arg0: (p: {
            [x: string]: any;
            idObservacionXEstacionInicial: any;
          }) => { [x: string]: any; idObservacionXEstacionInicial: any }
        ): any {},
        activo: 'string',
        fecha: 'String',
        fechaCargue: 'String',
        fechaCreacion: 'String',
        fechaEstado: 'String',
        fechaModificacion: 'String',
        flagInsert: true,
        idEstadoObservacion: 1,
        idFlagObservacion: 1,
        idObservacionXEstacionInicial: 1,
        idParametroXEstacion: 1,
        idTipoOrigenObservacion: 1,
        origen: 'String',
        usuarioCargue: 'String',
        usuarioCreacion: 'String',
        usuarioEstado: 'String',
        usuarioModificacion: 'String',
        valor: 1,
        idEstacion: 1,
      })
    );

    component.Actualizar();
    expect(Swal.isVisible()).toBeTruthy();
    Swal.clickConfirm();
  });

  it('Actualizar Embalses', () => {
    component.te = '2';
    const serviciosObservacionesEmbalsesService =
      fixture.debugElement.injector.get<ServiciosObservacionesEmbalsesService>(
        ServiciosObservacionesEmbalsesService as any
      );
    // Estaciones
    spyOn(serviciosObservacionesEmbalsesService, 'actualizar').and.returnValue(
      of({
        activo: 'String',
        fecha: 'String',
        fechaCargue: 'String',
        fechaCreacion: 'String',
        fechaEstado: 'String',
        fechaModificacion: 'String',
        flagInsert: true,
        idEstadoObservacion: 1,
        idFlagObservacion: 1,
        idObservacionXEmbalseInicial: 1,
        idParametroXEmbalse: 1,
        idTipoOrigenObservacion: 1,
        origen: 'String',
        usuarioCargue: 'String',
        usuarioCreacion: 'String',
        usuarioEstado: 'String',
        usuarioModificacion: 'String',
        valor: 1,
        idEmbalse: 1,
      })
    );

    component.Actualizar();
    expect(Swal.isVisible()).toBeTruthy();
    Swal.clickConfirm();
  });
  it('Actualizar Pozos', () => {
    component.te = '3';
    const serviciosObservacionesPozosService =
      fixture.debugElement.injector.get<ServiciosObservacionesPozosService>(
        ServiciosObservacionesPozosService as any
      );


    // Estaciones
    spyOn(serviciosObservacionesPozosService, 'actualizar').and.returnValue(
      of({
        activo: 'String',
        fecha: 'String',
        fechaCargue: 'String',
        fechaCreacion: 'String',
        fechaEstado: 'String',
        fechaModificacion: 'String',
        flagInsert: true,
        idEstadoObservacion: 1,
        idFlagObservacion: 1,
        idObservacionXPozoInicial: 1,
        idParametroXPozo: 1,
        idTipoOrigenObservacion: 1,
        origen: 'String',
        usuarioCargue: 'String',
        usuarioCreacion: 'String',
        usuarioEstado: 'String',
        usuarioModificacion: 'String',
        valor: 1,
      })
    );

    component.Actualizar();
    expect(Swal.isVisible()).toBeTruthy();
    Swal.clickConfirm();

    expect(component.Actualizar).toBeTruthy();

  });


it('validarObservacion',()=>{

component.datosFilter = [
 {
  idParametroElemento:1, 
 },
 {
  idParametroElemento:2, 
 }
]

 var observacionParametros = {
    idObservacionXElemento: 0,
    idParametroElemento: 1,
    fecha: "2022-01-01T05:04:30Z",
    valor: 2,
    idFlagObservacion: 1,
    flagInsert: true,
    flagExistente: false,
    origen: 1,
    // valores fijos
    idEstadoObservacion: 266,
    idTipoOrigen: 262,
    activo: 'S',
    idTipoOrigenObservacion: 1,
    // Valores auditoria
    fechaCargue: null,
    fechaCreacion: null,
    fechaEstado: null,
    fechaModificacion: null,
    usuarioCargue: "usuario",
    usuarioCreacion: "usuario",
    usuarioEstado: null,
    usuarioModificacion: null,
  };
  

  component.datosFilter = [
    {
      idParametro: 1,
      idParametroXEmbalse: 1,
      idObservacionXEmbalseInicial: 1,
      fechaObservacion: 1,
      valor: 1,
      flag: 1,
      idfrecuencia: 151,
      fecha: "2022-01-01T05:04:30Z",
      origen: 'ORIGUEN MANUAL',
    },
  ];
 
})

this.servicioAforo
.obtenerCurvaCaudal(this.tempIdCurva)
.subscribe((response) => {

  this.listParametro_eje = response;

  var dataset = [];
  var cantidad = [];
  var categories = [];
  var cantidad2 = [];
  var x = [];
  var y = [];
  var cantidadNivel = [];
  for (let i = 0; i < this.listParametro_eje.length; i++) {
    var ejeY = this.listParametro_eje[i]['caudal'];
    var ejeX = this.listParametro_eje[i]['nivel'];
    var y2 = parseFloat(this.listParametro_eje[i]['caudal']).toFixed(2);
    var x2 = parseFloat(this.listParametro_eje[i]['nivel']).toFixed(2);
    cantidad.push({
      x: x2,
      y: this.listParametro_eje[i]['caudal']
    });
    categories.push(this.listParametro_eje[i]['caudal']);
    cantidad2.push(this.listParametro_eje[i]['nivel'], this.listParametro_eje[i]['caudal']);
    dataset.push({
      actual: ejeX,
      predicted: this.listParametro_eje[i]['caudal']
    });
    x.push(ejeX);
    y.push(this.listParametro_eje[i]['caudal']);
  }

  var rmse = RMSE.rmse(dataset);
  this.rmse = rmse.toFixed(2);
  var listaR = this.linearRegression2(x, y);
  var listaRegresion = listaR['y_hat'];
  var listaRe = [];


  for (let i = 0; i < listaRegresion.length; i++) {

    listaRe.push(x[i],
      listaRegresion[i]
    );

  }

  var accumulator;
  var v1;
  var v2;
  var i;

  // Initialize an accumulator:
  accumulator = incrmae();

  // For each simulated datum, update the mean absolute error...
  for (i = 0; i < cantidad.length; i++) {
    v1 = cantidad[i].x;

});
