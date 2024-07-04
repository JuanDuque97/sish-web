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
import { ServiciosArchivoCampos } from 'src/app/modulos/configuracion/tipo-archivos/servicios-archivo-campos.service';
import { ServiciosEmbalcesService } from 'src/app/modulos/elementos/embalses/servicios-embalses.service';
import { ServiciosParametrosEmbalseService } from 'src/app/modulos/elementos/embalses/servicios-parametros-embalse.service';
import { ServiciosEstacionesService } from 'src/app/modulos/elementos/estaciones/servicios-estaciones.service';
import { ServiciosParametrosEstacionesService } from 'src/app/modulos/elementos/estaciones/servicios-parametros-estaciones.service';
import { ServiciosParametrosPozosService } from 'src/app/modulos/elementos/pozos/servicios-parametros-pozos.service';
import { ServiciosPozosService } from 'src/app/modulos/elementos/pozos/servicios-pozos.service';
import { ServiciosObservacionesEmbalsesService } from 'src/app/modulos/observaciones/servicios-observaciones-embalses.service';
import { ServiciosObservacionesEstacionService } from 'src/app/modulos/observaciones/servicios-observaciones-estacion.service';
import { ServiciosObservacionesPozosService } from 'src/app/modulos/observaciones/servicios-observaciones-pozos.service';
import Swal from 'sweetalert2';
import { ServiciosSerieTiempoService } from '../../servicios/servicios-serie-tiempo.service';

import { GuardarSerieTiempoComponent } from './guardar-serie-tiempo.component';
import { ServiciosDominiosValoresService } from '../../../configuracion/dominios/servicios-dominios-valores.service';
import { OnInit } from '@angular/core';

describe('GuardarSerieTiempoComponent', () => {
  let component: GuardarSerieTiempoComponent;
  let fixture: ComponentFixture<GuardarSerieTiempoComponent>;

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
          { path: 'seriestiempo/consultarserie', component: GuardarSerieTiempoComponent}
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
      declarations: [GuardarSerieTiempoComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GuardarSerieTiempoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should ngOnInit ac = c', () => {
    component.ac = 'C';

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
          idDominioValor: 1,
          idDominio: 1,
          activo: 'string',
          dominioValor: 'string',
          fechaCreacion: 'string',
          fechaModificacion: 'string',
          usuarioCreacion: 'string',
          usuarioModificacion: 'string',
        },
      ])
    );

    spyOn(component, 'ngOnInit');
    component.ngOnInit();

    console.log('llego lista', component.listaflag);

    expect(component.ngOnInit).toHaveBeenCalled();
  });

  it('obtenerSerie', () => {
    component.id = '1';
    component.te = '466';
    const serviciosSerieTiempoService =
      fixture.debugElement.injector.get<ServiciosSerieTiempoService>(
        ServiciosSerieTiempoService as any
      );

    spyOn(serviciosSerieTiempoService, 'obtenerSeriePorId').and.returnValue(
      of({
        activo: 'String',
        codigoEaab: 'String',
        codigoIdeam: 'String',
        fechaCreacion: 'String',
        fechaEstado: 'String',
        fechaModificacion: 'String',
        idElemento: 1,
        idFrecuencia: 1,
        idMecanismo: 1,
        idParametroXElemento: 1,
        idSerieTiempoElemento: 1,
        idTipoRegistro: 1,
        usuarioCreacion: 'String',
        usuarioEstado: 'String',
        usuarioModificacion: 'String',
        idTipoElemento: 1,
        flagInsert: 'true',
      })
    );

    component.obtenerSerie();
    expect(component.idParametroXElemento).toEqual(1);
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

    var even = '468';
    component.obtenerElementos(even);

    // console.log('Llego',component.formularioObservaciones.value)
    expect(component.listaElemento.length).toEqual(1);
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
          flagInsert: 'false',
        },
      ])
    );

    var even = '467';
    component.obtenerElementos(even);
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
      ])
    );

    var even = '466';
    component.obtenerElementos(even);
    expect(component.listaElemento.length).toEqual(1);
  });

  it('crearSerie', () => {
    const serviciosSerieTiempoService =
      fixture.debugElement.injector.get<ServiciosSerieTiempoService>(
        ServiciosSerieTiempoService as any
      );

    spyOn(serviciosSerieTiempoService, 'crearElemento').and.returnValue(
      of({
        activo: 'String',
        codigoEaab: 'String',
        codigoIdeam: 'String',
        fechaCreacion: 'String',
        fechaEstado: 'String',
        fechaModificacion: 'String',
        idElemento: 1,
        idFrecuencia: 1,
        idMecanismo: 1,
        idParametroXElemento: 1,
        idSerieTiempoElemento: 1,
        idTipoRegistro: 1,
        usuarioCreacion: 'String',
        usuarioEstado: 'String',
        usuarioModificacion: 'String',
        idTipoElemento: 1,
        flagInsert: 'true',
      })
    );

    component.formularioSerieTiempo.controls['idElemento'].setValue(1);
    component.formularioSerieTiempo.controls['idTipoElemento'].setValue(1);
    component.formularioSerieTiempo.controls['idMecanismo'].setValue(1);
    component.formularioSerieTiempo.controls['idTipoRegistro'].setValue(1);
    component.formularioSerieTiempo.controls['idFrecuencia'].setValue(1);

    component.id = '0';
    component.idMecanismo.value = 469;

    component.crearSerie();
    expect(serviciosSerieTiempoService.crearElemento).toHaveBeenCalled();
  });

  it('crearSerie Actualizar', () => {
    const serviciosSerieTiempoService =
      fixture.debugElement.injector.get<ServiciosSerieTiempoService>(
        ServiciosSerieTiempoService as any
      );

    spyOn(serviciosSerieTiempoService, 'actualizarElemento').and.returnValue(
      of({
        activo: 'String',
        codigoEaab: 'String',
        codigoIdeam: 'String',
        fechaCreacion: 'String',
        fechaEstado: 'String',
        fechaModificacion: 'String',
        idElemento: 1,
        idFrecuencia: 1,
        idMecanismo: 1,
        idParametroXElemento: 1,
        idSerieTiempoElemento: 1,
        idTipoRegistro: 1,
        usuarioCreacion: 'String',
        usuarioEstado: 'String',
        usuarioModificacion: 'String',
        idTipoElemento: 1,
        flagInsert: 'true',
      })
    );

    component.formularioSerieTiempo.controls['idElemento'].setValue(1);
    component.formularioSerieTiempo.controls['idTipoElemento'].setValue(1);
    component.formularioSerieTiempo.controls['idMecanismo'].setValue(1);
    component.formularioSerieTiempo.controls['idTipoRegistro'].setValue(1);
    component.formularioSerieTiempo.controls['idFrecuencia'].setValue(1);

    component.id = '1';
    component.idMecanismo.value = 469;

    component.crearSerie();
    expect(serviciosSerieTiempoService.actualizarElemento).toHaveBeenCalled();
  });
  it('calcularFechas Anio', () => {
    component.idFrecuencia = 155;
    component.fechaAno = 2022;

    component.calcularFechas();

    console.log('llego la fecha', component.fechaObservacion);

    expect(component.fechaObservacion).toBeTruthy();
  });
  it('calcularFechas Mes', () => {
    component.idFrecuencia = 154;
    component.fechaAno = 2022;
    component.fechaMes = 11;
    component.calcularFechas();
    expect(component.fechaObservacion).toBeTruthy();
  });
  it('calcularFechas dia', () => {
    component.idFrecuencia = 154;
    component.fecha = '2022-01-01T05:04:30Z';

    component.calcularFechas();
    expect(component.fechaObservacion).toBeTruthy();
  });

  it('agregarLista', () => {
    component.idSerieTiempo = 1;
    component.valor = 2552;
    component.fechaObservacion = new Date();
    component.flag = 12;

    component.agregarLista();
    expect(component.datosFilter.length).toEqual(1);
  });

  it('guardar', () => {
    component.datosFilter = [
      {
        fecha: '2022-01-01T05:04:30Z',
        hora: '2022-01-01T05:04:30Z',
        idFlag: 1,
        idSerieTiempoDetalle: 1,
        idSerieTiempoElemento: 1,
        idTipoFormato: 1,
        valor: 1,
        anio: 1,
        dia: 1,
        mes: 1,
      },
      {
        fecha: '2022-01-01T05:04:30Z',
        hora: '2022-01-01T05:04:30Z',
        idFlag: 2,
        idSerieTiempoDetalle: 2,
        idSerieTiempoElemento: 2,
        idTipoFormato: 2,
        valor: 2,
        anio: 2,
        dia: 2,
        mes: 3,
      },
    ];
    component.id = '0';
    const serviciosSerieTiempoService =
      fixture.debugElement.injector.get<ServiciosSerieTiempoService>(
        ServiciosSerieTiempoService as any
      );
    spyOn(serviciosSerieTiempoService, 'crearDetalle').and.returnValue(
      of([
        {
          fecha: '2022-01-01T05:04:30Z',
          hora: '2022-01-01T05:04:30Z',
          idFlag: 1,
          idSerieTiempoDetalle: 1,
          idSerieTiempoElemento: 1,
          idTipoFormato: 1,
          valor: 1,
          anio: 1,
          dia: 1,
          mes: 1,
        },
        {
          fecha: '2022-01-01T05:04:30Z',
          hora: '2022-01-01T05:04:30Z',
          idFlag: 2,
          idSerieTiempoDetalle: 2,
          idSerieTiempoElemento: 2,
          idTipoFormato: 2,
          valor: 2,
          anio: 2,
          dia: 2,
          mes: 3,
        },
      ])
    );

    component.guardar();
    // spyOn(component, 'guardar');
    expect(Swal.isVisible()).toBeTruthy();
    Swal.clickConfirm();
    expect(component.guardar).toBeTruthy();
  });
  it('guardar Actualizar Detalle Serie ', () => {
    component.datosFilter = [
      {
        fecha: '2022-01-01T05:04:30Z',
        hora: '2022-01-01T05:04:30Z',
        idFlag: 1,
        idSerieTiempoDetalle: 1,
        idSerieTiempoElemento: 1,
        idTipoFormato: 1,
        valor: 1,
        anio: 1,
        dia: 1,
        mes: 1,
      },
      {
        fecha: '2022-01-01T05:04:30Z',
        hora: '2022-01-01T05:04:30Z',
        idFlag: 2,
        idSerieTiempoDetalle: 2,
        idSerieTiempoElemento: 2,
        idTipoFormato: 2,
        valor: 2,
        anio: 2,
        dia: 2,
        mes: 3,
      },
    ];
    component.id = '1';

    const serviciosSerieTiempoService =
      fixture.debugElement.injector.get<ServiciosSerieTiempoService>(
        ServiciosSerieTiempoService as any
      );
    spyOn(serviciosSerieTiempoService, 'eliminarSerieDetalle').and.returnValue(
      of({
        fecha: '2022-01-01T05:04:30Z',
        hora: '2022-01-01T05:04:30Z',
        idFlag: 1,
        idSerieTiempoDetalle: 1,
        idSerieTiempoElemento: 1,
        idTipoFormato: 1,
        valor: 1,
        anio: 1,
        dia: 1,
        mes: 1,
      })
    );

    spyOn(serviciosSerieTiempoService, 'crearDetalle').and.returnValue(
      of([
        {
          fecha: '2022-01-01T05:04:30Z',
          hora: '2022-01-01T05:04:30Z',
          idFlag: 1,
          idSerieTiempoDetalle: 1,
          idSerieTiempoElemento: 1,
          idTipoFormato: 1,
          valor: 1,
          anio: 1,
          dia: 1,
          mes: 1,
        },
        {
          fecha: '2022-01-01T05:04:30Z',
          hora: '2022-01-01T05:04:30Z',
          idFlag: 2,
          idSerieTiempoDetalle: 2,
          idSerieTiempoElemento: 2,
          idTipoFormato: 2,
          valor: 2,
          anio: 2,
          dia: 2,
          mes: 3,
        },
      ])
    );

    component.guardar();

    expect(Swal.isVisible()).toBeTruthy();
    Swal.clickConfirm();
    expect(component.guardar).toBeTruthy();
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
    var mecanismo = '466';

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
    var mecanismo = '467';

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
    var mecanismo = '468';

    console.log('enviando');
    component.obtenerParametrosElemento(even, mecanismo);

    expect(component.NombresParametros.length).toEqual(1);
    expect(component.CodigoParametros.length).toEqual(1);
  });

  it('eliminarLista', () => {
    spyOn(component, 'eliminarLista');
    component.datosFilter = [{ id: 31 }, { id: 32 }, { id: 33 }];

    component.eliminarLista(31);

    expect(component.eliminarLista).toBeTruthy();
  });
  it('filtrarFrecuencias', () => {
     
    component.NombresParametros = [
      {
        id: 31,
        text: 'periodo',
        idPeriodo: 31,
      },
      { id: 32, text: 'periodo', idPeriodo: 1 },
      { id: 33, text: 'periodo', idPeriodo: 31 },
    ];
    component.CodigoParametros = [
      {
        id: 31,
        text: 'periodo',
        idPeriodo: 31,
      },
      { id: 32, text: 'periodo', idPeriodo: 1 },
      { id: 33, text: 'periodo', idPeriodo: 31 },
    ];

    var frecuencia:number =31
    component.filtrarFrecuencias(frecuencia); 
    expect(component.listaNombreParametros.length).toBeGreaterThan(1);
  });
});
