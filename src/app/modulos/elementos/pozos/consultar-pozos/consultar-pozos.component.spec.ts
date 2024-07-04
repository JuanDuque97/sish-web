import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { DataTablesModule } from 'angular-datatables';
import { ServiciosPozosService } from '../servicios-pozos.service';

import { ConsultarPozosComponent } from './consultar-pozos.component';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import Swal from 'sweetalert2';
import { ServiciosCapasService } from 'src/app/modulos/configuracion/capas/servicios-capas.service';
import { ServiciosGeograficosService } from 'src/app/common/mapa/servicios-geograficos.service';

describe('ConsultarPozosComponent', () => {
  let component: ConsultarPozosComponent;
  let fixture: ComponentFixture<ConsultarPozosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        DataTablesModule,
        HttpClientTestingModule,
        TranslateModule.forRoot(),
      ],
      providers: [ServiciosPozosService],
      declarations: [ConsultarPozosComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultarPozosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should obtenerListaPozoz', () => {
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

    component.obtenerListaPozoz();
    expect(component.datosFilter.length).toEqual(1);
  });

  it('Accion registro Activar', () => {
    const e = {
      accion: 'activar',
      registro: {
        activo: 'S',
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
        idMunicipio: 'string',
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
        idtipocoodenadas: 1,
        latitud: 1,
        longitud: 1,
      },
    };

    component.accionRegistro(e);
    expect(component).toBeTruthy();
  });
  it('Accion registro Inactivar', () => {
    const e = {
      accion: 'inactivar',
      registro: {
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
        idMunicipio: 'string',
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
        idtipocoodenadas: 1,
        latitud: 1,
        longitud: 1,
      },
    };

    component.accionRegistro(e);
    expect(component).toBeTruthy();
  });
  it('Accion registro parametros', () => {
    const e = {
      accion: 'parametros',
      registro: {
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
        idMunicipio: 'string',
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
        idtipocoodenadas: 1,
        latitud: 1,
        longitud: 1,
      },
    };

    component.accionRegistro(e);
    expect(component).toBeTruthy();
  });

  it('actualizar parametro', () => {
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
        latitud: 1,
        longitud: 1,
        idDepartamento: 1,
        idTipoCoordenada: 1,
      })
    );

    const pozo = {
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
      latitud: 1,
      longitud: 1,
      idDepartamento: 1,
      idTipoCoordenada: 1,
    };
    component.actualizar(pozo);
    expect(component.actualizar.length).toEqual(1);
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
        latitud: 1,
        longitud: 1,
        idDepartamento: 1,
        idTipoCoordenada: 1,
      })
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
        latitud: 1,
        longitud: 1,
        idDepartamento: 1,
        idTipoCoordenada: 1,
      })
    );

    // spyOn(component,'accionGeneral')
    component.accionGeneral(e);
    expect(Swal.isVisible()).toBeTruthy();
    Swal.clickConfirm();
    setTimeout(() => {
      expect(component.accionGeneral).toBeTruthy();
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
