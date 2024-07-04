import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { CONFIG } from 'src/app/common/utils/constantes';
import { HandlerExceptions } from 'src/app/common/utils/handlerexception';  
import { IParametro, IParametroDto } from 'src/app/modelo/configuracion/parametro';
import { IParametroXOperaciones,IParametroXOperacionesDTO } from 'src/app/modelo/configuracion/parametroXOperaciones';

import { IValidaObervacion } from 'src/app/modelo/configuracion/validarObservacion';

@Injectable({
  providedIn: 'root'
})
export class ServiciosParametrosService {


  private toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
  });

  actualizar(parametro: IParametro): Observable<IParametro> { 
    return this.http.post<IParametro>(CONFIG.WS_END_POINT + 'parametros/actualizar', parametro).pipe(
      catchError(e => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    );
  }

  actualizarOrigen(parametro: IParametro): Observable<IParametro> { 
    return this.http.post<IParametro>(CONFIG.WS_END_POINT + 'parametros/actualizarOrigen', parametro).pipe(
      catchError(e => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    );
  }

  constructor(private http: HttpClient) {
    // Esto es intencional
  }

  obtener(): Observable<IParametro[]> {

    return this.http.get<IParametro[]>(`${CONFIG.WS_END_POINT}parametros/obtener`)
      .pipe(
        map(
          (response) => response),
        catchError(e => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  obtenerPorId(id: number): Observable<IParametro> {
    return this.http.get<IParametro>(CONFIG.WS_END_POINT + 'parametros/obtenerPorId/' + id).pipe(
      catchError(e => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    );
  }
  obtenerPorIdCodigo(id: number): Observable<IParametro> {
    return this.http.get<IParametro>(CONFIG.WS_END_POINT + 'parametros/obtenerPorIdCodigo/' + id).pipe(
      catchError(e => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    );
  }
  crear(parametro: IParametro): Observable<IParametro> {
    return this.http.post<IParametro>(CONFIG.WS_END_POINT + 'parametros/crear', parametro).pipe(
      catchError(e => {
        if(e.ok === false){
          this.toast.fire({
            icon: 'error',
            title:
              'El parámetro que intenta crear ya existe en el SISH. Código del parámetro: '+parametro.codigo+' !',
          });
          return throwError(e.ok);
        }else{
          HandlerExceptions.validarExcepcionesHTTP(e);
         
          return throwError(e);
        }
       
      }
      
      )
    );
  }
  /***
   * Obtiene la lista de los páramtros para la consulta
   **/

  obtenerListaParametros(): Observable<IParametroDto[]> {

    return this.http.get<IParametroDto[]>(`${CONFIG.WS_END_POINT}parametros/obtenerDTO`)
      .pipe(
        map(
          (response) => response),
        catchError(e => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  obtenerValoresParametros(): Observable<any[]> {
    return this.http.get<IParametro[]>(`${CONFIG.WS_END_POINT}parametros/obtener`).pipe(
        map((r: any) => r.map((d: any) => (
          {
             [d.idParametro]:d.descripcion, 
        }
        ))
        ),
        catchError(e => {
            HandlerExceptions.validarExcepcionesHTTP(e);
            return throwError(e);
        })
    );
}
  obtenerValoresParametrosSelect2(): Observable<any[]> {
    return this.http.get<IParametro[]>(`${CONFIG.WS_END_POINT}parametros/obtener`).pipe(
          map((r: any) =>
            r.map((d: IParametro) => ({
              id: d.idParametro,
              text: d.descripcion,
              idOrigen:d.codigoOrigen,
              idUnidadMedida: d.idUnidadMedida,
              disabled: d.activo == 'S' ? false : true,
            }))
          ),

        catchError(e => {
            HandlerExceptions.validarExcepcionesHTTP(e);
            return throwError(e);
        })
    );
}


obtenerValoresOrigen(): Observable<any[]> {
  return this.http.get<IParametro[]>(`${CONFIG.WS_END_POINT}parametros/obtener`).pipe(
        map((r: any) =>
          r.map((d: IParametro) => ({
            id: d.codigo,
            text: d.descripcion,
            idOrigen:d.codigoOrigen,
            idUnidadMedida: d.idUnidadMedida,
            disabled: d.activo == 'S' ? false : true,
          }))
        ),

      catchError(e => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
      })
  );
}
pametroOrigen(): Observable<any[]> {
  return this.http.get<IParametro[]>(`${CONFIG.WS_END_POINT}parametros/pametroOrigen`).pipe(
        map((r: any) =>
          r.map((d: IParametro) => ({
            id: d.idParametro,
            text: d.descripcion,
            idOrigen: d.codigoOrigen,
            disabled: d.activo == 'S' ? false : true,
          }))
        ),

      catchError(e => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
      })
  );
}

parametroxFrecuencia(Iparametro: IParametro): Observable<IParametro> { 
  return this.http
      .post<IParametro>(CONFIG.WS_END_POINT + 'pruebasBondad/obtenerValorPrueba', Iparametro)
      .pipe(
        map((response) => response),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
}
obtenerOrgine(): Observable<any[]> {
  return this.http.get<IParametro[]>(`${CONFIG.WS_END_POINT}parametros/obtenerOrigen`).pipe(
        map((r: any) =>
          r.map((d: IParametro) => ({
            id: d.idParametro,
            text: d.descripcion,
            idOrigen: d.codigoOrigen,
            disabled: d.activo == 'S' ? false : true,
          }))
        ),

      catchError(e => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
      })
  );
}
obtenerConfigPorId(id: number): Observable<IParametroXOperaciones> {
  return this.http.get<IParametroXOperaciones>(CONFIG.WS_END_POINT + 'ParametroXOperaciones/obtenerPorId/' + id).pipe(
    catchError(e => {
      HandlerExceptions.validarExcepcionesHTTP(e);
      return throwError(e);
    })
  );
}

obtenerConfigPorIdParametro(id: number): Observable<IParametroXOperaciones> {
  return this.http.get<IParametroXOperaciones>(CONFIG.WS_END_POINT + 'ParametroXOperaciones/obteneridParametro/' + id).pipe(
    catchError(e => {
      HandlerExceptions.validarExcepcionesHTTP(e);
      return throwError(e);
    })
  );
}
  obtenerValoresParametrosFiltrar(params: any): Observable<any[]>{
    return this.http.get<IParametro[]>(`${CONFIG.WS_END_POINT}parametros/filtrar`,{params: params}).pipe(
      map((r: any) =>
      r.map((d: IParametro) => ({
        id: d.idParametro,
        text: d.descripcion,
      }))
    ),

    catchError(e => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    );
  }



  crearValidacionObervacion(validaObervaciones: IValidaObervacion): Observable<IValidaObervacion> {
    return this.http.post<IValidaObervacion>(CONFIG.WS_END_POINT + 'validaObervacion/crearValidacion', validaObervaciones).pipe(
      catchError(e => {
     
          HandlerExceptions.validarExcepcionesHTTP(e);
         
          return throwError(e);
        
       
      }
      
      )
    );
  }
  validaObervacionesId(id: number): Observable<IValidaObervacion> {
    return this.http.get<IValidaObervacion>(CONFIG.WS_END_POINT + 'validaObervacion/obtenerPorId/' + id).pipe(
      catchError(e => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    );
  }

  validaObervacionesIdAlerta(id: number, elemento: number): Observable<IValidaObervacion> {
    return this.http.get<IValidaObervacion>(CONFIG.WS_END_POINT + 'validaObervacion/obtenerPorId/' + id + '/idElemento/' + elemento).pipe(
      catchError(e => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    );
  }

  validaObervacionesIdestado(id: number): Observable<IValidaObervacion> {
    return this.http.get<IValidaObervacion>(CONFIG.WS_END_POINT + 'validaObervacion/obtenerPorIdEstado/' + id)
    .pipe(
      
      catchError((e) => {
      
        if(e.ok  === false ){

       
          this.toast.fire({
            icon: 'error',
            title:
              'No hay información!',
          });
          return throwError(e.ok);
        }else{
          HandlerExceptions.validarExcepcionesHTTP(e);
         
          return throwError(e);
        }
      } )
    );
}

  

  actualizarEstado(estado:any,id: any){
    return this.http.post<IValidaObervacion>(CONFIG.WS_END_POINT + 'validaObervacion/actualizarEstado?estado='+estado+'&id='+id,0 ).pipe(
        catchError(e => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
}

crearParametroXOperaciones(IParametroXOperaciones: IParametroXOperaciones): Observable<IParametroXOperaciones> {
  return this.http.post<IParametroXOperaciones>(CONFIG.WS_END_POINT + 'ParametroXOperaciones/crear', IParametroXOperaciones).pipe(
    catchError(e => {
   
        HandlerExceptions.validarExcepcionesHTTP(e);
       
        return throwError(e);
      
     
    }
    
    )
  );
}

obtenerPorIdElemento(id: any): Observable<IParametroXOperaciones> {
  return this.http.get<IParametroXOperaciones>(CONFIG.WS_END_POINT + 'ParametroXOperaciones/obtenerPorId/' + id).pipe(
    catchError(e => {
      HandlerExceptions.validarExcepcionesHTTP(e);
      return throwError(e);
    })
  );
}

obtenerParametroXOperaciones(): Observable<IParametroXOperacionesDTO[]> {

  return this.http.get<IParametroXOperacionesDTO[]>(`${CONFIG.WS_END_POINT}ParametroXOperaciones/obtener`)
    .pipe(
      map(
        (response) => response),
      catchError(e => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    );
}



eliminarParametroXOperacion(id: number): Observable<IParametroXOperacionesDTO> {
  return this.http
    .post<IParametroXOperacionesDTO>(
      CONFIG.WS_END_POINT + 'ParametroXOperaciones/eliminar/' + id,null      
    )
    .pipe(
      catchError((e) => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    );
}

}


