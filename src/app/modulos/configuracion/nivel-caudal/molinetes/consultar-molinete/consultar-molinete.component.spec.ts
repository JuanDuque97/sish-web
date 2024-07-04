import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { DataTablesModule } from 'angular-datatables';
import { of } from 'rxjs';
import { ServiciosMolineteService } from '../servicios-molinetes.service';
import { ConsultarMolineteComponent } from './consultar-molinete.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import Swal from 'sweetalert2';

describe('ConsultarMolineteComponent', () => {
  let component: ConsultarMolineteComponent;
  let fixture: ComponentFixture<ConsultarMolineteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        DataTablesModule,
        HttpClientTestingModule,
        TranslateModule.forRoot(),
      ],

      providers: [ServiciosMolineteService],
      declarations: [ConsultarMolineteComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultarMolineteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('obtener Molinete', () => {
    const serviciosMolineteService =
      fixture.debugElement.injector.get<ServiciosMolineteService>(
        ServiciosMolineteService as any
      );
    spyOn(serviciosMolineteService, 'obtenerDTO').and.returnValue(
      of([
        {
          activo: 'string',
          certificacoUltimaCalibracion: 'string',
          descripcion: 'string',
          fechaAdquisicion: 'string',
          fechaCreacion: 'string',
          fechaEstado: 'string',
          fechaModificacion: 'string',
          fechaUltimaCalibracion: 'string',
          flagMigracion: 'string',
          idCertificadoUltimaCalibracion: 1,
          idImagen: 1,
          idMolinete: 1,
          idPeriodoSugeridoCalibracion: 1,
          idTipoMolinete: 1,
          identificacionMolinete: 'string',
          imangen: 'string',
          marca: 'string',
          periodoSugeridoCalibracion: 'string',
          serie: 'string',
          tipoMolinete: 'string',
          usuarioCreacion: 'string',
          usuarioEstado: 'string',
          usuarioModificacion: 'string',
        },
      ])
    );
    component.ngOnInit();
    expect(component.datosFilter.length).toEqual(1);
  });

  it('Accion registro Activar', () => {
    const e = {
      accion: 'activar',
      registro: {
        activo: 'string',
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
    };

    component.accionRegistro(e);
    expect(component).toBeTruthy();
  });

  it('Accion registro Inactivar', () => {
    const e = {
      accion: 'inactivar',
      registro: {
        activo: 'string',
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
    };

    component.accionRegistro(e);
    expect(component).toBeTruthy();
  });

  it('Actualizar Molinete', () => {
    const serviciosMolineteService =
      fixture.debugElement.injector.get<ServiciosMolineteService>(
        ServiciosMolineteService as any
      );
    spyOn(serviciosMolineteService, 'actualizar').and.returnValue(
      of({
        activo: 'string',
        descripcion: 'string',
        fechaAdquisicion: 'string',
        fechaCreacion: 'string',
        fechaEstado: 'string',
        fechaModificacion: 'string',
        fechaUltimaCalibracion: 'string',
        idMolinete: 1,
        idPeriodoSugeridoCalibracion: 1,
        idTipoMolinete: 1,
        idImagen: 1,
        idCertificadoUltimaCalibracion: 1,
        marca: 'string',
        serie: 'string',
        usuarioCreacion: 'string',
        usuarioEstado: 'string',
        usuarioModificacion: 'string',
        identificacionMolinete: 'string',
      })
    );

    const molinete = {
      activo: 'string',
      descripcion: 'string',
      fechaAdquisicion: 'string',
      fechaCreacion: 'string',
      fechaEstado: 'string',
      fechaModificacion: 'string',
      fechaUltimaCalibracion: 'string',
      idMolinete: 1,
      idPeriodoSugeridoCalibracion: 1,
      idTipoMolinete: 1,
      idImagen: 1,
      idCertificadoUltimaCalibracion: 1,
      marca: 'string',
      serie: 'string',
      usuarioCreacion: 'string',
      usuarioEstado: 'string',
      usuarioModificacion: 'string',
      identificacionMolinete: 'string',
    };
    component.actualizar(molinete);
    expect(component.actualizar.length).toEqual(1);
    // console.log('se actualizo',component.actualizar.length)
  });

  it('accionGeneral Activacion', () => {
    const e = 'Activacion';
    component.listaDeElementos = [
      {
        activo: 'S',
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
        activo: 'S',
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

    const serviciosMolineteService =
      fixture.debugElement.injector.get<ServiciosMolineteService>(
        ServiciosMolineteService as any
      );
    spyOn(serviciosMolineteService, 'actualizar').and.returnValue(
      of({
        activo: 'string',
        descripcion: 'string',
        fechaAdquisicion: 'string',
        fechaCreacion: 'string',
        fechaEstado: 'string',
        fechaModificacion: 'string',
        fechaUltimaCalibracion: 'string',
        idMolinete: 1,
        idPeriodoSugeridoCalibracion: 1,
        idTipoMolinete: 1,
        idImagen: 1,
        idCertificadoUltimaCalibracion: 1,
        marca: 'string',
        serie: 'string',
        usuarioCreacion: 'string',
        usuarioEstado: 'string',
        usuarioModificacion: 'string',
        identificacionMolinete: 'string',
      })
    );
    // spyOn(component, 'accionGeneral');
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

    const serviciosMolineteService =
      fixture.debugElement.injector.get<ServiciosMolineteService>(
        ServiciosMolineteService as any
      );
    spyOn(serviciosMolineteService, 'actualizar').and.returnValue(
      of({
        activo: 'string',
        descripcion: 'string',
        fechaAdquisicion: 'string',
        fechaCreacion: 'string',
        fechaEstado: 'string',
        fechaModificacion: 'string',
        fechaUltimaCalibracion: 'string',
        idMolinete: 1,
        idPeriodoSugeridoCalibracion: 1,
        idTipoMolinete: 1,
        idImagen: 1,
        idCertificadoUltimaCalibracion: 1,
        marca: 'string',
        serie: 'string',
        usuarioCreacion: 'string',
        usuarioEstado: 'string',
        usuarioModificacion: 'string',
        identificacionMolinete: 'string',
      })
    );
    // spyOn(component, 'accionGeneral');
    component.accionGeneral(e);
    expect(Swal.isVisible()).toBeTruthy();
    Swal.clickConfirm();
    setTimeout(() => {
      expect(component.accionGeneral).toBeTruthy();
    });
  });
  it('accionGeneral Inactivar falla', () => {
    const e = 'Inactivar';
    component.listaDeElementos = [
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
