import { ServiciosEmbalcesService } from './servicios-embalses.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

describe('ServiciosEmbalcesService', () => {
  let service: ServiciosEmbalcesService;
  let servicePost: ServiciosEmbalcesService;
  let HttpClientSpy: { post: jasmine.Spy };
  let HttpClientSpyGet: { get: jasmine.Spy };

  beforeEach(() => {
    HttpClientSpy = jasmine.createSpyObj('HttpClient', ['post']);
    HttpClientSpyGet = jasmine.createSpyObj('HttpClient', ['get']);
    servicePost = new ServiciosEmbalcesService(HttpClientSpy as any);
    service = new ServiciosEmbalcesService(HttpClientSpyGet as any);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('deberia obtener los embalses', (done: DoneFn) => {
    const mokresulObtener = [
      {
        idEmbalse: 1,
        anchoCresta: 1,
        areaHidrografica: 'String',
        cuenca: 'String',
        elevacion: 1,
        embalse: 'String',
        fechaCreacion: 'String',
        fechaInicioOperacion: 'String',
        fechaModificacion: 'String',
        idEntidad: 1,
        idMunicipio: 1,
        logintudCresta: 1,
        microcuenca: 'String',
        nivelSubsiguiente: 'String',
        subZonaHidrografica: 'String',
        usuarioCreacion: 'String',
        usuarioModificacion: 'String',
        volumenMuerto: 1,
        volumenTotal: 1,
        volumenUtil: 1,
        zonaHidrografica: 'String',
        zonaOperativaEaab: 'String',
        activo: 'String',
        fechaEstado: 'String',
        usuarioEstado: 'String',
        idDepartamento: 1,
      },
    ];

    HttpClientSpyGet.get.and.returnValues(of(mokresulObtener));

    service.obtener().subscribe((result) => {
      expect(result).toEqual(mokresulObtener);
      done();
    });
  });

//   it('deberia obtener ERROR  los embalses', (done: DoneFn) => {
//     const mokresulError = [
//       {
//        error:'error servidor',
//        status:404,
//        statusText:'Not Found'
//       },
//     ];

//     HttpClientSpyGet.get.and.returnValues(of(mokresulError)); 
//     service.obtener().subscribe((result) => { 
//       debugger
     
//     }, error =>{
// debugger
//       console.log('error Obtener',error)
//       expect(error.status).toEqual(404)
//       done()
//     }
    
    
//     );
//   });



  it('deberia obtenerEembalsesDTO los embalses', (done: DoneFn) => {
    const mokresulObtener = [
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
    ];

    HttpClientSpyGet.get.and.returnValues(of(mokresulObtener));

    service.obtenerEembalsesDTO().subscribe((result) => {
      expect(result).toEqual(mokresulObtener);
      done();
    });
  });
  it('deberia obtenerPorId los embalses', (done: DoneFn) => {
    const mokresulObtener = {
      idEmbalse: 1,
      anchoCresta: 1,
      areaHidrografica: 'String',
      cuenca: 'String',
      elevacion: 1,
      embalse: 'String',
      fechaCreacion: 'String',
      fechaInicioOperacion: 'String',
      fechaModificacion: 'String',
      idEntidad: 1,
      idMunicipio: 1,
      logintudCresta: 1,
      microcuenca: 'String',
      nivelSubsiguiente: 'String',
      subZonaHidrografica: 'String',
      usuarioCreacion: 'String',
      usuarioModificacion: 'String',
      volumenMuerto: 1,
      volumenTotal: 1,
      volumenUtil: 1,
      zonaHidrografica: 'String',
      zonaOperativaEaab: 'String',
      activo: 'String',
      fechaEstado: 'String',
      usuarioEstado: 'String',
      idDepartamento: 1,
    };
    HttpClientSpyGet.get.and.returnValues(of(mokresulObtener));
    var id = 1;

    service.obtenerPorId(id).subscribe((result) => {
      expect(result).toEqual(mokresulObtener);
      done();
    });
  });
  it('deberia crear embalses', (done: DoneFn) => {
    const mokresul = {
      idEmbalse: 1,
      anchoCresta: 1,
      areaHidrografica: 'String',
      cuenca: 'String',
      elevacion: 1,
      embalse: 'String',
      fechaCreacion: 'String',
      fechaInicioOperacion: 'String',
      fechaModificacion: 'String',
      idEntidad: 1,
      idMunicipio: 1,
      logintudCresta: 1,
      microcuenca: 'String',
      nivelSubsiguiente: 'String',
      subZonaHidrografica: 'String',
      usuarioCreacion: 'String',
      usuarioModificacion: 'String',
      volumenMuerto: 1,
      volumenTotal: 1,
      volumenUtil: 1,
      zonaHidrografica: 'String',
      zonaOperativaEaab: 'String',
      activo: 'String',
      fechaEstado: 'String',
      usuarioEstado: 'String',
      idDepartamento: 1,
    };

    const mokCrear = {
      idEmbalse: 0,
      anchoCresta: 1,
      areaHidrografica: 'String',
      cuenca: 'String',
      elevacion: 1,
      embalse: 'String',
      fechaCreacion: 'String',
      fechaInicioOperacion: 'String',
      fechaModificacion: 'String',
      idEntidad: 1,
      idMunicipio: 1,
      logintudCresta: 1,
      microcuenca: 'String',
      nivelSubsiguiente: 'String',
      subZonaHidrografica: 'String',
      usuarioCreacion: 'String',
      usuarioModificacion: 'String',
      volumenMuerto: 1,
      volumenTotal: 1,
      volumenUtil: 1,
      zonaHidrografica: 'String',
      zonaOperativaEaab: 'String',
      activo: 'String',
      fechaEstado: 'String',
      usuarioEstado: 'String',
      idDepartamento: 1,
    };

    HttpClientSpy.post.and.returnValue(of(mokresul));

    var id = 1;

    servicePost.crear(mokCrear).subscribe((result) => {
      expect(result).toEqual(mokresul);
      done();
    });
  });
  it('deberia actualizar embalses', (done: DoneFn) => {
    const mokresul = {
      idEmbalse: 1,
      anchoCresta: 1,
      areaHidrografica: 'String',
      cuenca: 'String',
      elevacion: 1,
      embalse: 'String',
      fechaCreacion: 'String',
      fechaInicioOperacion: 'String',
      fechaModificacion: 'String',
      idEntidad: 1,
      idMunicipio: 1,
      logintudCresta: 1,
      microcuenca: 'String',
      nivelSubsiguiente: 'String',
      subZonaHidrografica: 'String',
      usuarioCreacion: 'String',
      usuarioModificacion: 'String',
      volumenMuerto: 1,
      volumenTotal: 1,
      volumenUtil: 1,
      zonaHidrografica: 'String',
      zonaOperativaEaab: 'String',
      activo: 'String',
      fechaEstado: 'String',
      usuarioEstado: 'String',
      idDepartamento: 1,
    };

    const mokActualizar = {
      idEmbalse: 0,
      anchoCresta: 1,
      areaHidrografica: 'String',
      cuenca: 'String',
      elevacion: 1,
      embalse: 'String',
      fechaCreacion: 'String',
      fechaInicioOperacion: 'String',
      fechaModificacion: 'String',
      idEntidad: 1,
      idMunicipio: 1,
      logintudCresta: 1,
      microcuenca: 'String',
      nivelSubsiguiente: 'String',
      subZonaHidrografica: 'String',
      usuarioCreacion: 'String',
      usuarioModificacion: 'String',
      volumenMuerto: 1,
      volumenTotal: 1,
      volumenUtil: 1,
      zonaHidrografica: 'String',
      zonaOperativaEaab: 'String',
      activo: 'String',
      fechaEstado: 'String',
      usuarioEstado: 'String',
      idDepartamento: 1,
    };

    HttpClientSpy.post.and.returnValues(of(mokresul));

    var id = 1;

    servicePost.crear(mokActualizar).subscribe((result) => {
      expect(result).toEqual(mokresul);
      done();
    });
  });
  
});
