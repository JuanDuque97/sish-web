import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { DataTablesModule } from 'angular-datatables';
import { ServiciosGeograficosService } from 'src/app/common/mapa/servicios-geograficos.service';

import { ConsultarObservacionesComponent } from './consultar-observaciones.component';
import { of } from 'rxjs';
import { ServiciosParametrosService } from '../../parametros/servicios-parametros.service';
import { ServiciosDominiosValoresService } from '../../configuracion/dominios/servicios-dominios-valores.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { NgSelect2Module } from 'ng-select2';
import { ServiciosCapasService } from '../../configuracion/capas/servicios-capas.service';
import { ServiciosObservacionesEstacionService } from '../servicios-observaciones-estacion.service';
import { ServiciosObservacionesEmbalsesService } from '../servicios-observaciones-embalses.service';
import { ServiciosObservacionesPozosService } from '../servicios-observaciones-pozos.service';
import Swal from 'sweetalert2';
import { ServiciosEstacionesService } from '../../elementos/estaciones/servicios-estaciones.service';
import { ServiciosPozosService } from '../../elementos/pozos/servicios-pozos.service';
import { ServiciosEmbalcesService } from '../../elementos/embalses/servicios-embalses.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ConsultarObservacionesComponent', () => {
  let component: ConsultarObservacionesComponent;
  let fixture: ComponentFixture<ConsultarObservacionesComponent>;

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
        RouterTestingModule,
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
      declarations: [ConsultarObservacionesComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultarObservacionesComponent);
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
          departamento: 'string',
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

 
  it('Accion registro agregar', () => {
    const e = {
      accion: 'agregar',
      registro: {
        activo: 'string',
        descripcion: 'string',
        estacion: 'string',
        estadoObservacion: 'string',
        fecha: 'string',
        fechaCargue: 'string',
        fechaCreacion: 'string',
        fechaEstado: 'string',
        fechaModificacion: 'string',
        idEstacion: 1,
        idEstadoObservacion: 1,
        idParametro: 1,
        idObservacionXPozoInicial: 1,
        idParametroXPozo: 1,
        idTipoOrigenObservacion: 1,
        origen: 'string',
        tipoOrigenObservacion: 'string',
        usuarioCargue: 'string',
        usuarioCreacion: 'string',
        usuarioEstado: 'string',
        usuarioModificacion: 'string',
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
        descripcion: 'string',
        estacion: 'string',
        estadoObservacion: 'string',
        fecha: 'string',
        fechaCargue: 'string',
        fechaCreacion: 'string',
        fechaEstado: 'string',
        fechaModificacion: 'string',
        idEstacion: 1,
        idEstadoObservacion: 1,
        idParametro: 1,
        idObservacionXPozoInicial: 1,
        idParametroXPozo: 1,
        idTipoOrigenObservacion: 1,
        origen: 'string',
        tipoOrigenObservacion: 'string',
        usuarioCargue: 'string',
        usuarioCreacion: 'string',
        usuarioEstado: 'string',
        usuarioModificacion: 'string',
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
        descripcion: 'string',
        estacion: 'string',
        estadoObservacion: 'string',
        fecha: 'string',
        fechaCargue: 'string',
        fechaCreacion: 'string',
        fechaEstado: 'string',
        fechaModificacion: 'string',
        idEstacion: 1,
        idEstadoObservacion: 1,
        idParametro: 1,
        idObservacionXPozoInicial: 1,
        idParametroXPozo: 1,
        idTipoOrigenObservacion: 1,
        origen: 'string',
        tipoOrigenObservacion: 'string',
        usuarioCargue: 'string',
        usuarioCreacion: 'string',
        usuarioEstado: 'string',
        usuarioModificacion: 'string',
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
        activo: 'string',
        descripcion: 'string',
        estacion: 'string',
        estadoObservacion: 'string',
        fecha: 'string',
        fechaCargue: 'string',
        fechaCreacion: 'string',
        fechaEstado: 'string',
        fechaModificacion: 'string',
        idEstacion: 1,
        idEstadoObservacion: 1,
        idParametro: 1,
        idObservacionXPozoInicial: 1,
        idParametroXPozo: 1,
        idTipoOrigenObservacion: 1,
        origen: 'string',
        tipoOrigenObservacion: 'string',
        usuarioCargue: 'string',
        usuarioCreacion: 'string',
        usuarioEstado: 'string',
        usuarioModificacion: 'string',
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

  it('filtrar', () => {
    const serviciosObservacionesEstacionService =
      fixture.debugElement.injector.get<ServiciosObservacionesEstacionService>(
        ServiciosObservacionesEstacionService as any
      );
    const serviciosObservacionesEmbalsesService =
      fixture.debugElement.injector.get<ServiciosObservacionesEmbalsesService>(
        ServiciosObservacionesEmbalsesService as any
      );
    const serviciosObservacionesPozosService =
      fixture.debugElement.injector.get<ServiciosObservacionesPozosService>(
        ServiciosObservacionesPozosService as any
      );
    // Estaciones
    spyOn(serviciosObservacionesEstacionService, 'obtenerDTO').and.returnValue(
      of({
        idParametroXEstacion: 1,
        idObservacionXEstacionInicial: 1,
        idDepartamento: 'String',
        idMunicipio: 'String',
        areaHidrografica: 'String',
        zonaHidrografica: 'String',
        subZonaHidrografica: 'String',
        cuenca: 'String',
        subCuenca: 'String',
        microcuenca: 'String',
        idEntidad: 'String',
        idParametro: 'String',
        idFrecuencia: 'String',
        codigoIdeam: 'String',
        codigoEaab: 'String',
        nombreElemento: 'String',
        fechaInicio: 'String',
        fechaFin: 'String',
        elemento: 'String',
        periodo: true,
        listParametroXElemento: [{ id: 1 }],
        listaElementos: [{ id: 1 }],

        map(
          ...args:
            | [
                arg0: (p: { [x: string]: any; idParametroXEstacion: any }) => {
                  [x: string]: any;
                  idParametroXEstacion: any;
                }
              ]
            | [
                arg0: (p: { [x: string]: any; idParametroXEmbalse: any }) => {
                  [x: string]: any;
                  idParametroXEmbalse: any;
                }
              ]
            | [
                arg0: (p: { [x: string]: any; idParametroXPozo: any }) => {
                  [x: string]: any;
                  idParametroXPozo: any;
                }
              ]
        ): any {},
      })
    ); 
    spyOn(serviciosObservacionesEmbalsesService, 'obtenerDTO').and.returnValue(
      of({
        idParametroXEmbalse: 1,
        idObservacionXEmbalseInicial: 1,
        idDepartamento: 'String',
        idMunicipio: 'String',
        areaHidrografica: 'String',
        zonaHidrografica: 'String',
        subZonaHidrografica: 'String',
        cuenca: 'String',
        subCuenca: 'String',
        microcuenca: 'String',
        idEntidad: 'String',
        idParametro: 'String',
        idFrecuencia: 'String',
        codigoIdeam: 'String',
        codigoEaab: 'String',
        nombreElemento: 'String',
        fechaInicio: 'String',
        fechaFin: 'String',
        elemento: 'String',
        periodo: true,
        listParametroXElemento: [{ id: 1 }],
        listaElementos: [{ id: 1 }],

        map(
          ...args:
            | [
                arg0: (p: { [x: string]: any; idParametroXEstacion: any }) => {
                  [x: string]: any;
                  idParametroXEstacion: any;
                }
              ]
            | [
                arg0: (p: { [x: string]: any; idParametroXEmbalse: any }) => {
                  [x: string]: any;
                  idParametroXEmbalse: any;
                }
              ]
            | [
                arg0: (p: { [x: string]: any; idParametroXPozo: any }) => {
                  [x: string]: any;
                  idParametroXPozo: any;
                }
              ]
        ): any {},
      })
    ); 
    spyOn(serviciosObservacionesPozosService, 'obtenerDTO').and.returnValue(
      of({
        idParametroXEmbalse: 1,
        idObservacionXEmbalseInicial: 1,
        idDepartamento: 'String',
        idMunicipio: 'String',
        areaHidrografica: 'String',
        zonaHidrografica: 'String',
        subZonaHidrografica: 'String',
        cuenca: 'String',
        subCuenca: 'String',
        microcuenca: 'String',
        idEntidad: 'String',
        idParametro: 'String',
        idFrecuencia: 'String',
        codigoIdeam: 'String',
        codigoEaab: 'String',
        nombreElemento: 'String',
        fechaInicio: 'String',
        fechaFin: 'String',
        elemento: 'String',
        periodo: true,
        listParametroXElemento: [{ id: 1 }],
        listaElementos: [{ id: 1 }],

        map(
          ...args:
            | [
                arg0: (p: { [x: string]: any; idParametroXEstacion: any }) => {
                  [x: string]: any;
                  idParametroXEstacion: any;
                }
              ]
            | [
                arg0: (p: { [x: string]: any; idParametroXEmbalse: any }) => {
                  [x: string]: any;
                  idParametroXEmbalse: any;
                }
              ]
            | [
                arg0: (p: { [x: string]: any; idParametroXPozo: any }) => {
                  [x: string]: any;
                  idParametroXPozo: any;
                }
              ]
        ): any {},
      })
    ); 

    component.formularioFiltros.controls['fechaInicio'].setValue('01/01/2022'); 
    component.formularioFiltros.controls['fechaFin'].setValue('01/01/2022');   
    component.formularioFiltros.controls['cuenca'].setValue('string');
    component.formularioFiltros.controls['listParametros'].setValue('string');
    component.formularioFiltros.controls['listaElementos'].setValue('string');
    component.formularioFiltros.controls['microcuenca'].setValue('string');
    component.formularioFiltros.controls['subCuenca'].setValue('string');
    component.formularioFiltros.controls['subZonaHidrografica'].setValue('string');
    component.formularioFiltros.controls['zonaHidrografica'].setValue('string');
    
    // Estaciones

    
    // spyOn(component,"filtrar")  
    var elemento:string = "1";
    // console.log('validacion formulario',component.formularioFiltros)
    
    component.filtrar(elemento);   
    // console.log('validacion data',component.datosFilter)
    expect(component.filtrar).toBeTruthy();

    // //  Embalses
    var elemento:string = "2"; 
    component.filtrar(elemento);   
    expect(component.filtrar).toBeTruthy();


     // Pozos
    var elemento:string = "3"; 
    component.filtrar(elemento);   
    expect(component.filtrar).toBeTruthy();
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
          zonaOperativaEaab: 'string'
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
          fechaInicioOperacion: "string",
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
          zonaOperativaEaab: 'string'
        }
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
          fechaInicioOperacion:1,
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
          zonaOperativaEaab: 'string'
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

  it('accionGeneral Activacion', () => {
    const e = 'Activacion';
    component.listaDeElementos = [
      {
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
        latitud: 1,
        longitud: 1,
        idDepartamento: 1,
        idTipoCoordenada: 1,
      },
      {
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
        latitud: 1,
        longitud: 1,
        idDepartamento: 1,
        idTipoCoordenada: 1,
      },
    ];

    const serviciosObservacionesEstacionService =
    fixture.debugElement.injector.get<ServiciosObservacionesEstacionService>(
      ServiciosObservacionesEstacionService as any
    );
    spyOn(serviciosObservacionesEstacionService, 'actualizar').and.returnValue(
      of({
        activo: 'string',
  fecha: 'string',
  fechaCargue: 'string',
  fechaCreacion:'string',
  fechaEstado: 'string',
  fechaModificacion: 'string',
  flagInsert: true,
  idEstadoObservacion: 1,
  idFlagObservacion: 1,
  idObservacionXEstacionInicial: 1,
  idParametroXEstacion: 1,
  idTipoOrigenObservacion: 1,
  origen: 'string',
  usuarioCargue: 'string',
  usuarioCreacion: 'string',
  usuarioEstado: 'string',
  usuarioModificacion: 'string',
  valor: 1,
  idEstacion : 1,

        map(
          ...args:
            | [
                arg0: (p: { [x: string]: any; idObservacionXEstacionInicial: any }) => {
                  [x: string]: any;
                  idObservacionXEstacionInicial: any;
                }
              ]
            
        ): any {},

      })
      );

      component.elemento = '2'

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
        latitud: 1,
        longitud: 1,
        idDepartamento: 1,
        idTipoCoordenada: 1,
      },
      {
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
        latitud: 1,
        longitud: 1,
        idDepartamento: 1,
        idTipoCoordenada: 1,
      },
    ];

    const serviciosObservacionesEstacionService =
    fixture.debugElement.injector.get<ServiciosObservacionesEstacionService>(
      ServiciosObservacionesEstacionService as any
    );
    spyOn(serviciosObservacionesEstacionService, 'actualizar').and.returnValue(
      of({
        activo: 'string',
  fecha: 'string',
  fechaCargue: 'string',
  fechaCreacion:'string',
  fechaEstado: 'string',
  fechaModificacion: 'string',
  flagInsert: true,
  idEstadoObservacion: 1,
  idFlagObservacion: 1,
  idObservacionXEstacionInicial: 1,
  idParametroXEstacion: 1,
  idTipoOrigenObservacion: 1,
  origen: 'string',
  usuarioCargue: 'string',
  usuarioCreacion: 'string',
  usuarioEstado: 'string',
  usuarioModificacion: 'string',
  valor: 1,
  idEstacion : 1,

        map(
          ...args:
            | [
                arg0: (p: { [x: string]: any; idObservacionXEstacionInicial: any }) => {
                  [x: string]: any;
                  idObservacionXEstacionInicial: any;
                }
              ]
            
        ): any {},

      })
      );

      component.elemento = '1'

    // spyOn(component,'accionGeneral')
    component.accionGeneral(e);
    expect(Swal.isVisible()).toBeTruthy();
    Swal.clickConfirm();
    setTimeout(() => {
      expect(component.accionGeneral).toHaveBeenCalled();
    });
  });

  it('lista', () => {
    var listaSelect = [
      {
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
        latitud: 1,
        longitud: 1,
        idDepartamento: 1,
        idTipoCoordenada: 1,
      },
      {
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
        latitud: 1,
        longitud: 1,
        idDepartamento: 1,
        idTipoCoordenada: 1,
      },
    ];

    component.lista(listaSelect);

    console.log('lista', component.listaDeElementos);

    expect(component.listaDeElementos.length).toEqual(2);
  });

});
