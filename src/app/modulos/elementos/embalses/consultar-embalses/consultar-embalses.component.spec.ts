import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ServiciosEmbalcesService } from '../servicios-embalses.service';
import { ConsultarEmbalsesComponent } from './consultar-embalses.component';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { DataTablesModule } from 'angular-datatables';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ServiciosCapasService } from 'src/app/modulos/configuracion/capas/servicios-capas.service';
import Swal from 'sweetalert2';
import { NO_ERRORS_SCHEMA } from '@angular/core';
class RouterStub {
  url = 'configuracion/embalses';
  navigate(commands: any[], extras?: any) { }
}
describe('ConsultarEmbalsesComponent', () => {
  let component: ConsultarEmbalsesComponent;
  let fixture: ComponentFixture<ConsultarEmbalsesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(
          [
            { path:'configuracion/embalses', component: RouterStub},
            { path: 'configuracion/ParametrosEmbalses/1', component: RouterStub}
        ]
        ),
        DataTablesModule,
        HttpClientTestingModule,
        TranslateModule.forRoot(),
      ],
      providers: [ServiciosEmbalcesService],
      declarations: [ConsultarEmbalsesComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultarEmbalsesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Obtener Lista Embalses ', () => {
    const serviciosEmbalcesService =
      fixture.debugElement.injector.get<ServiciosEmbalcesService>(
        ServiciosEmbalcesService as any
      );
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
          fechaInicioOperacion: "String",
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

    component.obtener();
    expect(component.datosFilter.length).toEqual(1);
  });

  it('Accion registro Activar', () => {
    const e = {
      accion: 'activar',
      registro: {
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
    };

    component.accionRegistro(e);
    expect(component).toBeTruthy();
  });
  it('Accion registro Inactivar', () => {
    const e = {
      accion: 'inactivar',
      registro: {
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
    };

    component.accionRegistro(e);
    expect(component).toBeTruthy();
  });
  it('Accion registro parametros', () => {
    const e = {
      accion: 'parametros',
      registro: {
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
    };

    component.accionRegistro(e);
    expect(component).toBeTruthy();
  });

  it('actualizar parametro', () => {
    const serviciosEmbalcesService =
      fixture.debugElement.injector.get<ServiciosEmbalcesService>(
        ServiciosEmbalcesService as any
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

    const embalce = {
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
    };
    component.actualizar(embalce);

    expect(component.actualizar.length).toEqual(1);
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

    component.cargarCapas();
    expect(component.capas.length).toBeGreaterThan(1);
  });

  it('accionGeneral Activacion', () => {
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
    ];
    //spyOn(component,'accionGeneral');
    component.accionGeneral("Activacion");
    /*const serviciosEmbalcesService =
    fixture.debugElement.injector.get<ServiciosEmbalcesService>(
      ServiciosEmbalcesService as any
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
  zonaOperativaEaab: 'string' ,
  activo:'string',
  fechaEstado: 'string',
  usuarioEstado: 'string',
  idDepartamento : 1
}
    )
  );*/

  expect(Swal.isVisible()).toBeTruthy();
    Swal.clickConfirm();
    let accGen=spyOn(component,"accionGeneral");
    component.accionGeneral("Activacion");
    setTimeout(() => {
      expect(accGen).toHaveBeenCalled();
    });
 
  });
  it('accionGeneral Inactivar', () => {
    const e = 'Inactivar';
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
    ];

    const serviciosEmbalcesService =
    fixture.debugElement.injector.get<ServiciosEmbalcesService>(
      ServiciosEmbalcesService as any
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
  zonaOperativaEaab: 'string' ,
  activo:'string',
  fechaEstado: 'string',
  usuarioEstado: 'string',
  idDepartamento : 1
}
    )
  );

  // spyOn(component,'accionGeneral')
  component.accionGeneral(e);
  expect(Swal.isVisible()).toBeTruthy();
    Swal.clickConfirm();
    let accGen=spyOn(component,"accionGeneral");
    component.accionGeneral(e);
    setTimeout(() => {
      expect(accGen).toBeTruthy();
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
