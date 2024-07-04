 import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs'; 
import { result } from 'lodash';
import { ServiciosParametrosEmbalseService } from './servicios-parametros-embalse.service';

describe('ServiciosParametrosEmbalseService', () => {
  let service: ServiciosParametrosEmbalseService;
  let servicePost: ServiciosParametrosEmbalseService;
  let HttpClientSpy: { post: jasmine.Spy };
  let HttpClientSpyGet: { get: jasmine.Spy };

  beforeEach(() => {
    HttpClientSpy = jasmine.createSpyObj('HttpClient', ['post']);
    HttpClientSpyGet = jasmine.createSpyObj('HttpClient', ['get']);
    servicePost = new ServiciosParametrosEmbalseService(HttpClientSpy as any);
    service = new ServiciosParametrosEmbalseService(HttpClientSpyGet as any);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  }); 

  it('deberia crear ParametrosEmbalseService', (done: DoneFn) => {
    const mokresul = {
      idEmbalse: 1,
      idParametro: 1,
      idParametroXEmbalse: 1,  
    };

    const mokCrear = {
      idEmbalse: 1,
    idParametro: 1,
    idParametroXEmbalse: 1,  
    };

    HttpClientSpy.post.and.returnValue(of(mokresul));

    var id = 1;

    servicePost.crear(mokCrear).subscribe((result:any) => {
      expect(result).toEqual(mokresul);
      done();
    });
  });

  it('deberia Eliminar ParametrosEmbalseService', (done: DoneFn) => {
    const mokresul = {
      idEmbalse: 1,
      idParametro: 1,
      idParametroXEmbalse: 1,  
    }; 
    HttpClientSpy.post.and.returnValue(of(mokresul));

    var id = 1;

    servicePost.eliminar(id).subscribe((result:any) => {
      expect(result).toEqual(mokresul);
      done();
    });
  });

  it('deberia obtener los ParametrosEmbalseService', (done: DoneFn) => {
    const mokresulObtener = [
      {
        idEmbalse: 1,
        idParametro: 1,
        idParametroXEmbalse: 1,  
      },
    ];

    HttpClientSpyGet.get.and.returnValues(of(mokresulObtener));

    service.obtener().subscribe((result:any) => {
      expect(result).toEqual(mokresulObtener);
      done();
    });
  });

  

  it('deberia obtenerPorId los ParametrosEmbalseService', (done: DoneFn) => {
    const mokresulObtener = {
      idEmbalse: 1,
        idParametro: 1,
        idParametroXEmbalse: 1,  
    };
    HttpClientSpyGet.get.and.returnValues(of(mokresulObtener));
    var id = 1;

    service.obtenerListaParametrosXEmbalse(id).subscribe((result:any) => {
      expect(result).toEqual(mokresulObtener);
      done();
    });
  });
  
  it('deberia actualizar ParametrosEmbalseService', (done: DoneFn) => {
    const mokresul = {
      idEmbalse: 1,
        idParametro: 1,
        idParametroXEmbalse: 1,  
    };

    const mokActualizar = {
      idEmbalse: 1,
      idParametro: 1,
      idParametroXEmbalse: 1,  
    };

    HttpClientSpy.post.and.returnValues(of(mokresul));

    var id = 1;

    servicePost.crear(mokActualizar).subscribe((result:any) => {
      expect(result).toEqual(mokresul);
      done();
    });
  });
  
});
