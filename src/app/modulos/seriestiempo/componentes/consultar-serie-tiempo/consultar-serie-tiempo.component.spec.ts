import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { DataTablesModule } from 'angular-datatables';
import { ServiciosDominiosValoresService } from '../../../configuracion/dominios/servicios-dominios-valores.service';

import { ConsultarSerieTiempoComponent } from './consultar-serie-tiempo.component';
import { ServiciosGeograficosService } from '../../../../common/mapa/servicios-geograficos.service';
import { ServiciosSerieTiempoService } from '../../servicios/servicios-serie-tiempo.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { NgSelect2Module } from 'ng-select2';
import { ServiciosParametrosService } from '../../../parametros/servicios-parametros.service';
import { of } from 'rxjs';
import { ServiciosCapasService } from '../../../configuracion/capas/servicios-capas.service';
import Swal from 'sweetalert2';
import { ServiciosObservacionesEstacionService } from '../../../observaciones/servicios-observaciones-estacion.service';
import { ServiciosObservacionesEmbalsesService } from '../../../observaciones/servicios-observaciones-embalses.service';
import { ServiciosEstacionesService } from '../../../elementos/estaciones/servicios-estaciones.service';
import { ServiciosEmbalcesService } from '../../../elementos/embalses/servicios-embalses.service';
import { ServiciosPozosService } from '../../../elementos/pozos/servicios-pozos.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ConsultarSerieTiempoComponent', () => {
  let component: ConsultarSerieTiempoComponent;
  let fixture: ComponentFixture<ConsultarSerieTiempoComponent>;

  const formBuilder: FormBuilder = new FormBuilder();
  const fb = jasmine.createSpyObj('FormBuilder', ['group']);
  const formGroup = new FormGroup({
    identityVerificationDocumentTypeId: new FormControl('formularioFiltros'),
  });
  (<jasmine.Spy>fb.group).and.returnValue(formGroup);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DataTablesModule,
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes([
          {
            path: 'seriestiempo/consultarserie',
            component: ConsultarSerieTiempoComponent,
          },
        ]),
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
        NgSelect2Module,
      ],
      providers: [
        ServiciosParametrosService,
        {
          provide: FormBuilder,
          useValue: formBuilder,
        },
      ],
      declarations: [ConsultarSerieTiempoComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultarSerieTiempoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('iniciar listas ', () => {
    // departamentos
    const serviciosGeograficosService =
      fixture.debugElement.injector.get<ServiciosGeograficosService>(
        ServiciosGeograficosService as any
      );

    spyOn(serviciosGeograficosService, 'obtenerDepartamentos').and.returnValue(
      of([
        {
          idDepartamento: 1,
          departamento: '"String"',
        },
      ])
    );
    // parametros

    const serviciosParametrosService =
      fixture.debugElement.injector.get<ServiciosParametrosService>(
        ServiciosParametrosService as any
      );

    spyOn(
      serviciosParametrosService,
      'obtenerValoresParametrosSelect2'
    ).and.returnValue(
      of([
        {
          id: 1,
          text: 'TEST',
          disabled: false,
        },
      ])
    );

    // ENTIDAD
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
          text: 'TEST',
          disabled: false,
        },
      ])
    );

    spyOn(component, 'ngOnInit');
    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  it('cargar Capas', () => {
    const serviciosCapasService =
      fixture.debugElement.injector.get<ServiciosCapasService>(
        ServiciosCapasService as any
      );
    spyOn(serviciosCapasService, 'obtenerPorId').and.returnValue(
      of([
        {
          capa: '"String"',
          fechaCreacion: '"String"',
          fechaModificacion: '"String"',
          idCapa: 1,
          identificador: '"String"',
          nombreServicio: '"String"',
          urlActualizar: '"String"',
          urlBorrar: '"String"',
          urlConsulta: '"String"',
          urlCrear: '"String"',
          urlVisualizar: '"String"',
          usuarioCreacion: '"String"',
          usuarioModificacion: '"String"',
        },
      ])
    );

    component.cargarCapas();

    expect(component.capas.length).toBeGreaterThan(1);
  });
  it('Accion registro agregar', () => {
    const e = {
      accion: 'agregar',
      registro: {
        activo: '"String"',
        descripcion: '"String"',
        estacion: '"String"',
        estadoObservacion: '"String"',
        fecha: '"String"',
        fechaCargue: '"String"',
        fechaCreacion: '"String"',
        fechaEstado: '"String"',
        fechaModificacion: '"String"',
        idEstacion: 1,
        idEstadoObservacion: 1,
        idParametro: 1,
        idObservacionXPozoInicial: 1,
        idParametroXPozo: 1,
        idTipoOrigenObservacion: 1,
        origen: '"String"',
        tipoOrigenObservacion: '"String"',
        usuarioCargue: '"String"',
        usuarioCreacion: '"String"',
        usuarioEstado: '"String"',
        usuarioModificacion: '"String"',
        valor: 1,
      },
    };

    component.accionRegistroModal(e);
    expect(component).toBeTruthy();
    expect(component.listaBusqueda.length).toEqual(1);
  });
  it('Accion registro Activar', () => {
    const e = {
      accion: 'activar',
      registro: {
        activo: 'S',
        descripcion: '"String"',
        estacion: '"String"',
        estadoObservacion: '"String"',
        fecha: '"String"',
        fechaCargue: '"String"',
        fechaCreacion: '"String"',
        fechaEstado: '"String"',
        fechaModificacion: '"String"',
        idEstacion: 1,
        idEstadoObservacion: 1,
        idParametro: 1,
        idObservacionXPozoInicial: 1,
        idParametroXPozo: 1,
        idTipoOrigenObservacion: 1,
        origen: '"String"',
        tipoOrigenObservacion: '"String"',
        usuarioCargue: '"String"',
        usuarioCreacion: '"String"',
        usuarioEstado: '"String"',
        usuarioModificacion: '"String"',
        valor: 1,
      },
    };

    component.accionRegistro(e);
    expect(component).toBeTruthy();
    expect(component.listaBusqueda.length).toEqual(0);
  });
  it('Accion registro Inactivar', () => {
    const e = {
      accion: 'inactivar',
      registro: {
        activo: 'S',
        descripcion: '"String"',
        estacion: '"String"',
        estadoObservacion: '"String"',
        fecha: '"String"',
        fechaCargue: '"String"',
        fechaCreacion: '"String"',
        fechaEstado: '"String"',
        fechaModificacion: '"String"',
        idEstacion: 1,
        idEstadoObservacion: 1,
        idParametro: 1,
        idObservacionXPozoInicial: 1,
        idParametroXPozo: 1,
        idTipoOrigenObservacion: 1,
        origen: '"String"',
        tipoOrigenObservacion: '"String"',
        usuarioCargue: '"String"',
        usuarioCreacion: '"String"',
        usuarioEstado: '"String"',
        usuarioModificacion: '"String"',
        valor: 1,
      },
    };

    component.accionRegistro(e);
    expect(component).toBeTruthy();
    expect(component.listaBusqueda.length).toEqual(0);
  });
  it('obtenerElementos', () => {
    const elemento: 1 = 1;

    component.datosFilter = [
      {
        activo: '"String"',
        descripcion: '"String"',
        estacion: '"String"',
        estadoObservacion: '"String"',
        fecha: '"String"',
        fechaCargue: '"String"',
        fechaCreacion: '"String"',
        fechaEstado: '"String"',
        fechaModificacion: '"String"',
        idEstacion: 1,
        idEstadoObservacion: 1,
        idParametro: 1,
        idObservacionXPozoInicial: 1,
        idParametroXPozo: 1,
        idTipoOrigenObservacion: 1,
        origen: '"String"',
        tipoOrigenObservacion: '"String"',
        usuarioCargue: '"String"',
        usuarioCreacion: '"String"',
        usuarioEstado: '"String"',
        usuarioModificacion: '"String"',
        valor: 1,
      },
    ];

    component.obtenerElementos(elemento);
    expect(Swal.isVisible()).toBeTruthy();
    Swal.clickConfirm();
    setTimeout(() => {
      expect(component.datosFilter.length).toEqual(0);
    });
  });
  it('obtener ELmentos', () => {
    // estaciones
    const serviciosEstacionesService =
      fixture.debugElement.injector.get<ServiciosEstacionesService>(
        ServiciosEstacionesService as any
      );
    spyOn(serviciosEstacionesService, 'obtenerEstaciones').and.returnValue(
      of([
        {
          activo: '"String"',
          altitud: 1,
          areaHidrografica: '"String"',
          categoria: '"String"',
          codigoEstacionEaab: '"String"',
          codigoEstacionIdeam: '"String"',
          corriente: '"String"',
          cuenca: '"String"',
          departamento: '"String"',
          entidad: '"String"',
          estacion: '"String"',
          estado: '"String"',
          este: 1,
          fechaCreacion: 1,
          fechaEstado: 1,
          fechaInstalacion: 1,
          fechaModificacion: 1,
          idAreaHidrografica: '"String"',
          idCategoria: 1,
          idCorriente: 1,
          idCuenca: '"String"',
          idDepartamento: 1,
          idEntidad: 1,
          idEstacion: 1,
          idEstado: 1,
          idMicroCuenca: '"String"',
          idMunicipio: 1,
          idSubCuenca: '"String"',
          idSubZonaHidrografica: '"String"',
          idTecnologia: 1,
          idTipoCoordenadas: 1,
          idTipoEstacion: 1,
          idZonaHidrografica: '"String"',
          latitud: 1,
          longitud: 1,
          microCuenca: '"String"',
          municipio: '"String"',
          nivelSubSiguiente: '"String"',
          norte: 1,
          subCuenca: '"String"',
          subZonaHidrografica: '"String"',
          tecnologia: '"String"',
          tipoCoordenadas: '"String"',
          tipoEstacion: '"String"',
          usuarioCreacion: '"String"',
          usuarioEstado: '"String"',
          usuarioModificacion: '"String"',
          zonaHidrografica: '"String"',
          zonaOperativaEaab: '"String"',
        },
      ])
    );

    const serviciosEmbalcesService =
      fixture.debugElement.injector.get<ServiciosEmbalcesService>(
        ServiciosEmbalcesService as any
      );
    // embalses
    spyOn(serviciosEmbalcesService, 'obtenerEembalsesDTO').and.returnValue(
      of([
        {
          activo: '"String"',
          alturaPresa: 1,
          anchoCresta: 1,
          areaHidrografica: '"String"',
          cuenca: '"String"',
          elevacion: 1,
          embalse: '"String"',
          entidad: '"String"',
          fechaCreacion: 1,
          fechaEstado: 1,
          fechaInicioOperacion: "1",
          fechaModificacion: 1,
          idAreaHidrografica: '"String"',
          idCuenca: '"String"',
          idEmbalse: 1,
          idEntidad: 1,
          idMicroCuenca: '"String"',
          idMunicipio: 1,
          idSubCuenca: '"String"',
          idSubZonaHidrografica: '"String"',
          idZonaHidrografica: '"String"',
          longitudCresta: 1,
          microcuenca: '"String"',
          municipio: '"String"',
          nivelSubsiguiente: '"String"',
          subCuenca: '"String"',
          subZonaHidrografica: '"String"',
          usuarioCreacion: '"String"',
          usuarioEstado: '"String"',
          usuarioModificacion: '"String"',
          volumenMuerto: 1,
          volumenTotal: 1,
          volumenUtil: 1,
          zonaHidrografica: '"String"',
          zonaOperativaEaab: '"String"',
        },
      ])
    );

    // pozoz
    const serviciosPozosService =
      fixture.debugElement.injector.get<ServiciosPozosService>(
        ServiciosPozosService as any
      );
    spyOn(serviciosPozosService, 'obtenerPozosDTO').and.returnValue(
      of([
        {
          activo: '"String"',
          areaHidrografica: '"String"',
          categoria: '"String"',
          condicion: '"String"',
          cotaBoca: 1,
          cotaMedidor: 1,
          cuenca: '"String"',
          departamento: '"String"',
          fechaCreacion: 1,
          fechaEstado: 1,
          fechaInicioOperacion: 1,
          fechaModificacion: 1,
          idAreaHidrografica: '"String"',
          idCategoria: 1,
          idCondicion: 1,
          idCuenca: '"String"',
          idDepartamento: 1,
          idMicroCuenca: '"String"',
          idMunicipio: 1,
          idPozo: 1,
          idSubCuenca: '"String"',
          idSubZonaHidrografica: '"String"',
          idTipoCoordenada: 1,
          idTipoPozo: 1,
          idZonaHidrografica: '"String"',
          latitud: 1,
          longitud: 1,
          microcuenca: '"String"',
          municipio: '"String"',
          nivelSubsiguiente: '"String"',
          pozo: '"String"',
          profundidad: 1,
          subCuenca: '"String"',
          subZonaHidrografica: '"String"',
          tipoCoordenada: '"String"',
          tipoPozo: '"String"',
          usuarioCreacion: '"String"',
          usuarioEstado: '"String"',
          usuarioModificacion: '"String"',
          zonaHidrografica: '"String"',
          zonaOperativaEaab: '"String"',
        },
      ])
    );

    component.obtenerEstaciones();
    component.obtenerEmbalses();
    component.obtenerPozos();

    expect(component.datosFilterEstaciones.length).toEqual(1);
    expect(component.datosFilterEmbalses.length).toEqual(1);
    expect(component.datosFilterPozos.length).toEqual(1);
  });

  it('agregarlistaParametros', () => {
    var elemento = '70';
    component.agregarlistaParametros(elemento);
    expect(component.listParametroXElemento.length).toEqual(1);
  });

  it('eliminarListaParametros', () => {
    spyOn(component, 'listParametroXElemento');
    component.listParametroXElemento = [{ id: 31 }, { id: 32 }, { id: 33 }];
    spyOn(component, 'eliminarListaParametros');

    component.eliminarListaParametros(31);

    expect(component.eliminarListaParametros).toBeTruthy();
  });

  it('eliminarLista', () => {
    spyOn(component, 'eliminarLista');
    component.listaBusqueda = [{ id: 31 }, { id: 32 }, { id: 33 }];

    component.eliminarLista(31);

    expect(component.eliminarLista).toBeTruthy();
  });

  it('filtrar Serie Tiempo ', () => {
    component.elemento = 466;
    component.listParametroXElemento = [662, 2];

    component.formularioFiltros.controls['fechaInicio'].setValue('2022-04-06');
    component.formularioFiltros.controls['fechaFin'].setValue('2022-01-06');
    component.formularioFiltros.controls['cuenca'].setValue('string');
    component.formularioFiltros.controls['listParametros'].setValue('string');
    component.formularioFiltros.controls['listaElementos'].setValue('string');
    component.formularioFiltros.controls['microcuenca'].setValue('string');
    component.formularioFiltros.controls['subCuenca'].setValue('string');
    component.formularioFiltros.controls['subZonaHidrografica'].setValue(
      'string'
    );
    component.formularioFiltros.controls['zonaHidrografica'].setValue('string');

    const serviciosSerieTiempoService =
      fixture.debugElement.injector.get<ServiciosSerieTiempoService>(
        ServiciosSerieTiempoService as any
      );

    spyOn(serviciosSerieTiempoService, 'obtenerDTO').and.returnValue(
      of([
        {
          activo: 'String',
          areaHidrografica: 'String',
          categoria: 'String',
          condicion: 'String',
          cotaBoca: 1,
          cotaMedidor: 1,
          cuenca: 'String',
          departamento: 'String',
          fechaCreacion: 'String',
          fechaEstado: 'String',
          fechaInicioOperacion: 'String',
          fechaModificacion: 'String',
          idAreaHidrografica: 1,
          idCategoria: 1,
          idCondicion: 1,
          idCuenca: 1,
          idDepartamento: 1,
          idMicroCuenca: 1,
          idMunicipio: 1,
          idPozo: 1,
          idSubCuenca: 1,
          idSubZonaHidrografica: 1,
          idTipoCoordenada: 1,
          idTipoPozo: 1,
          idZonaHidrografica: 1,
          latitud: 1,
          longitud: 1,
          microcuenca: 'String',
          municipio: 'String',
          nivelSubsiguiente: 'String',
          pozo: 'String',
          profundidad: 1,
          subCuenca: 'String',
          subZonaHidrografica: 'String',
          tipoCoordenada: 'String',
          tipoPozo: 'String',
          usuarioCreacion: 1,
          usuarioEstado: 1,
          usuarioModificacion: 'String',
          zonaHidrografica: 'String',
          zonaOperativaEaab: 'String',
        },
      ])
    );

    spyOn(
      serviciosSerieTiempoService,
      'obtenerDTOPromedioAnio'
    ).and.returnValue(
      of([
        {
          anio: 1,
          idSerieTiempoElemento: 1,
          mes: 1,
          promedio: 1,
          valorMaximo: 1,
          valorMinimo: 0,
        },
      ])
    );
    spyOn(serviciosSerieTiempoService, 'obtenerDTOPromedioMes').and.returnValue(
      of([
        {
          anio: 1,
          idSerieTiempoElemento: 1,
          mes: 1,
          promedio: 1,
          valorMaximo: 1,
          valorMinimo: 0,
        },
      ])
    );

    spyOn(component, 'filtrar');
    // Estaciones
    var elemento = 466;
    component.filtrar(elemento);
    expect(component.filtrar).toBeTruthy();

    // //  Embalses
    var elemento = 467;
    component.filtrar(elemento);
    expect(component.filtrar).toHaveBeenCalled();

    // // pozos
    var elemento = 468;
    component.filtrar(elemento);
    expect(component.filtrar).toHaveBeenCalled();
  });

  it('datosGrafico', () => {
    component.datosSerieAnio = [
      {
        anio: 2022,
        idSerieTiempoElemento: 249,
        promedio: 211,
        valorMaximo: 213,
        valorMinimo: 210,
      },
      {
        anio: 2022,
        promedio: 311,
        valorMinimo: 56,
        valorMaximo: 566,
        idSerieTiempoElemento: 253,
      },
    ];
    component.datosSerieMes = [
      {
        anio: 2022,
        idSerieTiempoElemento: 221,
        mes: 3,
        promedio: 45,
        valorMaximo: 45,
        valorMinimo: 45,
      },
      {
        anio: 2022,
        idSerieTiempoElemento: 249,
        mes: 3,
        promedio: 211,
        valorMaximo: 213,
        valorMinimo: 210,
      },
    ];

    component.datosGrafico();

    expect(component.Anual.length).toBeGreaterThan(1);
    expect(component.Mensual.length).toBeGreaterThan(1);
  });

  it('eliminarListaParametros', () => {
    spyOn(component, 'listParametroXElemento');
    component.listParametroXElemento = [{ id: 31 }, { id: 32 }, { id: 33 }];
    spyOn(component, 'eliminarListaParametros');

    component.eliminarListaParametros(31);

    expect(component.eliminarListaParametros).toBeTruthy();
  });

  it('eliminarLista', () => {
    spyOn(component, 'eliminarLista');
    component.listaBusqueda = [{ id: 31 }, { id: 32 }, { id: 33 }];

    component.eliminarLista(31);

    expect(component.eliminarLista).toBeTruthy();
  });




  it('accionGeneral Activacion', () => {
    const e = 'Activacion';
    component.listaDeElementos = [
     { 
       activo: "String",
      codigoEaab: "String",
      codigoIdeam: "String",
      fechaCreacion: "String",
      fechaEstado: "String",
      fechaModificacion: "String",
      idElemento: 1,
      idFrecuencia: 1,
      idMecanismo: 1,
      idParametroXElemento: 1,
      idSerieTiempoElemento: 1,
      idTipoRegistro: 1,
      usuarioCreacion: "String",
      usuarioEstado: "String",
      usuarioModificacion: "String",
      idTipoElemento: 1,
      flagInsert:"string",
    },{
      activo: "String",
      codigoEaab: "String",
      codigoIdeam: "String",
      fechaCreacion: "String",
      fechaEstado: "String",
      fechaModificacion: "String",
      idElemento: 1,
      idFrecuencia: 1,
      idMecanismo: 1,
      idParametroXElemento: 1,
      idSerieTiempoElemento: 1,
      idTipoRegistro: 1,
      usuarioCreacion: "String",
      usuarioEstado: "String",
      usuarioModificacion: "String",
      idTipoElemento: 1,
      flagInsert:"string",
    }
    ];

    const serviciosSerieTiempoService =
    fixture.debugElement.injector.get<ServiciosSerieTiempoService>(
      ServiciosSerieTiempoService as any
    );

    spyOn(serviciosSerieTiempoService, 'actualizarElemento').and.returnValue(
      of(
          {
        activo: "String",
        codigoEaab: "String",
        codigoIdeam: "String",
        fechaCreacion: "String",
        fechaEstado: "String",
        fechaModificacion: "String",
        idElemento: 1,
        idFrecuencia: 1,
        idMecanismo: 1,
        idParametroXElemento: 1,
        idSerieTiempoElemento: 1,
        idTipoRegistro: 1,
        usuarioCreacion: "String",
        usuarioEstado: "String",
        usuarioModificacion: "String",
        idTipoElemento: 1,
        flagInsert:"string",
      }   )
      ); 

    // spyOn(component,'accionGeneral')
    component.accionGeneral(e);
    expect(Swal.isVisible()).toBeTruthy();
    Swal.clickConfirm();
    setTimeout(() => {
      expect(component.accionGeneral).toHaveBeenCalled();
    });
  });

  it('accionGeneral Inactivar', () => {
    const e = 'Inactivar';
    component.listaDeElementos = [
      { 
        activo: "String",
       codigoEaab: "String",
       codigoIdeam: "String",
       fechaCreacion: "String",
       fechaEstado: "String",
       fechaModificacion: "String",
       idElemento: 1,
       idFrecuencia: 1,
       idMecanismo: 1,
       idParametroXElemento: 1,
       idSerieTiempoElemento: 1,
       idTipoRegistro: 1,
       usuarioCreacion: "String",
       usuarioEstado: "String",
       usuarioModificacion: "String",
       idTipoElemento: 1,
       flagInsert:"string",
     },{
       activo: "String",
       codigoEaab: "String",
       codigoIdeam: "String",
       fechaCreacion: "String",
       fechaEstado: "String",
       fechaModificacion: "String",
       idElemento: 1,
       idFrecuencia: 1,
       idMecanismo: 1,
       idParametroXElemento: 1,
       idSerieTiempoElemento: 1,
       idTipoRegistro: 1,
       usuarioCreacion: "String",
       usuarioEstado: "String",
       usuarioModificacion: "String",
       idTipoElemento: 1,
       flagInsert:"string",
     },
     { 
      activo: "String",
     codigoEaab: "String",
     codigoIdeam: "String",
     fechaCreacion: "String",
     fechaEstado: "String",
     fechaModificacion: "String",
     idElemento: 1,
     idFrecuencia: 1,
     idMecanismo: 1,
     idParametroXElemento: 1,
     idSerieTiempoElemento: 1,
     idTipoRegistro: 1,
     usuarioCreacion: "String",
     usuarioEstado: "String",
     usuarioModificacion: "String",
     idTipoElemento: 1,
     flagInsert:"string",
   },{
     activo: "String",
     codigoEaab: "String",
     codigoIdeam: "String",
     fechaCreacion: "String",
     fechaEstado: "String",
     fechaModificacion: "String",
     idElemento: 1,
     idFrecuencia: 1,
     idMecanismo: 1,
     idParametroXElemento: 1,
     idSerieTiempoElemento: 1,
     idTipoRegistro: 1,
     usuarioCreacion: "String",
     usuarioEstado: "String",
     usuarioModificacion: "String",
     idTipoElemento: 1,
     flagInsert:"string",
   }
     ];
     const serviciosSerieTiempoService =
     fixture.debugElement.injector.get<ServiciosSerieTiempoService>(
       ServiciosSerieTiempoService as any
     );
    spyOn(serviciosSerieTiempoService, 'actualizarElemento').and.returnValue(
      of(
          {
        activo: "String",
        codigoEaab: "String",
        codigoIdeam: "String",
        fechaCreacion: "String",
        fechaEstado: "String",
        fechaModificacion: "String",
        idElemento: 1,
        idFrecuencia: 1,
        idMecanismo: 1,
        idParametroXElemento: 1,
        idSerieTiempoElemento: 1,
        idTipoRegistro: 1,
        usuarioCreacion: "String",
        usuarioEstado: "String",
        usuarioModificacion: "String",
        idTipoElemento: 1,
        flagInsert:"string",
      }   )
      ); 
 

    spyOn(component,'accionGeneral')
    component.accionGeneral(e);
    expect(Swal.isVisible()).toBeTruthy();
    Swal.clickConfirm();
    setTimeout(() => {
      expect(component.accionGeneral).toHaveBeenCalled();
    });
  });

  
});


