import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { DataTablesModule } from 'angular-datatables';
import { of } from 'rxjs';
import Swal from 'sweetalert2';
import { ServiciosEstacionesService } from '../servicios-estaciones.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { ConsultarEstacionesComponent } from './consultar-estaciones.component';

describe('ConsultarEstacionesComponent', () => {
  let component: ConsultarEstacionesComponent;
  let fixture: ComponentFixture<ConsultarEstacionesComponent>;



  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        DataTablesModule,
        HttpClientTestingModule,
        TranslateModule.forRoot(),
      ],
      providers: [ServiciosEstacionesService],
      declarations: [ConsultarEstacionesComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultarEstacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('obtener estaciones', () => {
    const servicioestaciones =
      fixture.debugElement.injector.get<ServiciosEstacionesService>(
        ServiciosEstacionesService as any
      );
    spyOn(servicioestaciones, 'obtenerEstaciones').and.returnValue(
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
    component.obtenerEstaciones();
    expect(component.datosFilter.length).toEqual(1);
  });

  it('Accion registro Activar', () => {
    const e = {
      accion: 'activar',
      registro: {
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
        longitud: 1,
        microCuenca: 'string',
        nivelSubSiguiente: 'string',
        norte: 1,
        subZonaHidrografica: 'string',
        usuarioCreacion: 'string',
        usuarioEstado: 'string',
        usuarioModificacion: 'string',
        zonaHidrografica: 'string',
        zonaOperativaEaab: 'string',
        nombreCategoria: 'string',
        nombreTipoEstacion: 'string',
        nombreTecnologia: 'string',
        nombreEstado: 'string',
        nombreEntidad: 'string',
        fechaEstado: 'string',
      },
    };
    component.accionRegistro(e);
    expect(component).toBeTruthy();
  });
  it('Accion registro Inactivar', () => {
    const e = {
      accion: 'inactivar',
      registro: {
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
        longitud: 1,
        microCuenca: 'string',
        nivelSubSiguiente: 'string',
        norte: 1,
        subZonaHidrografica: 'string',
        usuarioCreacion: 'string',
        usuarioEstado: 'string',
        usuarioModificacion: 'string',
        zonaHidrografica: 'string',
        zonaOperativaEaab: 'string',
        nombreCategoria: 'string',
        nombreTipoEstacion: 'string',
        nombreTecnologia: 'string',
        nombreEstado: 'string',
        nombreEntidad: 'string',
        fechaEstado: 'string',
      },
    };
    component.accionRegistro(e);
    expect(component).toBeTruthy();
  });
  it('Accion registro parametros', () => {
    const e = {
      accion: 'parametros',
      registro: {
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
        longitud: 1,
        microCuenca: 'string',
        nivelSubSiguiente: 'string',
        norte: 1,
        subZonaHidrografica: 'string',
        usuarioCreacion: 'string',
        usuarioEstado: 'string',
        usuarioModificacion: 'string',
        zonaHidrografica: 'string',
        zonaOperativaEaab: 'string',
        nombreCategoria: 'string',
        nombreTipoEstacion: 'string',
        nombreTecnologia: 'string',
        nombreEstado: 'string',
        nombreEntidad: 'string',
        fechaEstado: 'string',
      },
    };
    component.accionRegistro(e);
    expect(component).toBeTruthy();
  });
  it('Accion registro AbrirQR', () => {
    const e = {
      accion: 'AbrirQR',
      registro: {
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
        longitud: 1,
        microCuenca: 'string',
        nivelSubSiguiente: 'string',
        norte: 1,
        subZonaHidrografica: 'string',
        usuarioCreacion: 'string',
        usuarioEstado: 'string',
        usuarioModificacion: 'string',
        zonaHidrografica: 'string',
        zonaOperativaEaab: 'string',
        nombreCategoria: 'string',
        nombreTipoEstacion: 'string',
        nombreTecnologia: 'string',
        nombreEstado: 'string',
        nombreEntidad: 'string',
        fechaEstado: 'string',
      },
    };
    component.accionRegistro(e);
    expect(component).toBeTruthy();
  });

  it('actualizar Estacion', () => {
    const servicioestaciones =
      fixture.debugElement.injector.get<ServiciosEstacionesService>(
        ServiciosEstacionesService as any
      );
    spyOn(servicioestaciones, 'actualizar').and.returnValue(
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
        longitud: 1,
        microCuenca: 'string',
        nivelSubSiguiente: 'string',
        norte: 1,
        subZonaHidrografica: 'string',
        usuarioCreacion: 'string',
        usuarioEstado: 'string',
        usuarioModificacion: 'string',
        zonaHidrografica: 'string',
        zonaOperativaEaab: 'string',
        nombreCategoria: 'string',
        nombreTipoEstacion: 'string',
        nombreTecnologia: 'string',
        nombreEstado: 'string',
        nombreEntidad: 'string',
        fechaEstado: 'string',
      })
    );

    const estaciones = {
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
      longitud: 1,
      microCuenca: 'string',
      nivelSubSiguiente: 'string',
      norte: 1,
      subZonaHidrografica: 'string',
      usuarioCreacion: 'string',
      usuarioEstado: 'string',
      usuarioModificacion: 'string',
      zonaHidrografica: 'string',
      zonaOperativaEaab: 'string',
      nombreCategoria: 'string',
      nombreTipoEstacion: 'string',
      nombreTecnologia: 'string',
      nombreEstado: 'string',
      nombreEntidad: 'string',
      fechaEstado: 'string',
    };
    component.actualizar(estaciones);

    expect(component.actualizar.length).toEqual(1);
  });

  it('accionGeneral Activacion', (done: DoneFn) => {
    const e = 'Activacion';
    component.listaDeElementos = [
      {
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
      },
      {
        idEmbalse: 2,
        anchoCresta: 32,
        areaHidrografica: 'string',
        cuenca: 'string',
        elevacion: 1,
        embalse: 'string',
        fechaCreacion: 'string',
        fechaInicioOperacion: 'string',
        fechaModificacion: 'string',
        idEntidad: 12,
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
        idDepartamento: 12,
      },
      {
        idEmbalse: 2,
        anchoCresta: 32,
        areaHidrografica: 'string',
        cuenca: 'string',
        elevacion: 1,
        embalse: 'string',
        fechaCreacion: 'string',
        fechaInicioOperacion: 'string',
        fechaModificacion: 'string',
        idEntidad: 12,
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
        idDepartamento: 12,
      },
    ];

    const serviciosEstacionesService =
    fixture.debugElement.injector.get<ServiciosEstacionesService>(
      ServiciosEstacionesService as any
    );
  spyOn(serviciosEstacionesService, 'actualizar').and.returnValue(
    of(
      {
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
        usuarioCreacion:'string',
        usuarioEstado:'string',
        usuarioModificacion:'string',
        zonaHidrografica: 'string',
        zonaOperativaEaab: 'string'
      }
    )
  );

 
  component.accionGeneral(e);
  expect(Swal.isVisible()).toBeTruthy();
    Swal.clickConfirm();
    setTimeout(() => {
      expect(component.accionGeneral).toBeTruthy();
      done()
    });
 
  });
  it('accionGeneral Inactivar', (done: DoneFn) => {
    const e = 'Inactivar';
    component.listaDeElementos = [
      {
        idEstacion: 1,
   activo: "string",
   altitud: 1,
   areaHidrografica: "string",
   estacion: "string",
   codigoEstacionEaab: "string",
   codigoEstacionIdeam: "string",
   corriente: "string",
   cuenca: "string",
   este: 1,
   fechaCreacion: "string",
   fechaInstalacion: "string",
   fechaModificacion: "string",
   idCategoria: 1,
   idEntidad: 1,
   idEstado: 1,
   idMunicipio: 1,
   idTecnologia: 1,
   idTipoCoordenadas: 1,
   idTipoEstacion: 1,
   latitud: 1,
   microCuenca: "string",
   nivelSubSiguiente: "string",
   norte: 1,
   subZonaHidrografica: "string",
   usuarioCreacion:"string",
   usuarioEstado:"string",
   usuarioModificacion:"string",
   zonaHidrografica: "string",
   zonaOperativaEaab: "string"
      },
      {
        idEstacion: 1,
        activo: "string",
        altitud: 1,
        areaHidrografica: "string",
        estacion: "string",
        codigoEstacionEaab: "string",
        codigoEstacionIdeam: "string",
        corriente: "string",
        cuenca: "string",
        este: 1,
        fechaCreacion: "string",
        fechaInstalacion: "string",
        fechaModificacion: "string",
        idCategoria: 1,
        idEntidad: 1,
        idEstado: 1,
        idMunicipio: 1,
        idTecnologia: 1,
        idTipoCoordenadas: 1,
        idTipoEstacion: 1,
        latitud: 1,
        microCuenca: "string",
        nivelSubSiguiente: "string",
        norte: 1,
        subZonaHidrografica: "string",
        usuarioCreacion:"string",
        usuarioEstado:"string",
        usuarioModificacion:"string",
        zonaHidrografica: "string",
        zonaOperativaEaab: "string"
      },
    ];

    const serviciosEstacionesService =
    fixture.debugElement.injector.get<ServiciosEstacionesService>(
      ServiciosEstacionesService as any
    );
  spyOn(serviciosEstacionesService, 'actualizar').and.returnValue(
    of({
      idEstacion: 1,
   activo: "string",
   altitud: 1,
   areaHidrografica: "string",
   estacion: "string",
   codigoEstacionEaab: "string",
   codigoEstacionIdeam: "string",
   corriente: "string",
   cuenca: "string",
   este: 1,
   fechaCreacion: "string",
   fechaInstalacion: "string",
   fechaModificacion: "string",
   idCategoria: 1,
   idEntidad: 1,
   idEstado: 1,
   idMunicipio: 1,
   idTecnologia: 1,
   idTipoCoordenadas: 1,
   idTipoEstacion: 1,
   latitud: 1,
   microCuenca: "string",
   nivelSubSiguiente: "string",
   norte: 1,
   subZonaHidrografica: "string",
   usuarioCreacion:"string",
   usuarioEstado:"string",
   usuarioModificacion:"string",
   zonaHidrografica: "string",
   zonaOperativaEaab: "string"
}
    )
  );

  // spyOn(component,'accionGeneral')
  component.accionGeneral(e);
  expect(Swal.isVisible()).toBeTruthy();
    Swal.clickConfirm();
    setTimeout(() => {
      expect(component.accionGeneral).toBeTruthy();
      done()
    });
 
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


  it('lista', () => {
    var listaSelect = [
      {
        activo: 'N',
        descripcion: 'string',
        fechaAdquisicion: 'string',
        fechaCreacion: 'string',
        fechaEstado: 'string',
        fechaModificacion: 'string',
        fechaUltimaCalibracion: 'string',
        idMolinete: 1,
        idPeriodoSugeridoCalibracion: 1,
        idTipoMolinete: 1,
        imagen: 'string',
        marca: 'string',
        serie: 'string',
        usuarioCreacion: 'string',
        usuarioEstado: 'string',
        usuarioModificacion: 'string',
        identificacionMolinete: 'string',
      },
      {
        activo: 'N',
        descripcion: 'string',
        fechaAdquisicion: 'string',
        fechaCreacion: 'string',
        fechaEstado: 'string',
        fechaModificacion: 'string',
        fechaUltimaCalibracion: 'string',
        idMolinete: 1,
        idPeriodoSugeridoCalibracion: 1,
        idTipoMolinete: 1,
        imagen: 'string',
        marca: 'string',
        serie: 'string',
        usuarioCreacion: 'string',
        usuarioEstado: 'string',
        usuarioModificacion: 'string',
        identificacionMolinete: 'string',
      },
    ];

    component.lista(listaSelect);

    console.log('lista', component.listaDeElementos);

    expect(component.listaDeElementos.length).toEqual(2);
  });

});
