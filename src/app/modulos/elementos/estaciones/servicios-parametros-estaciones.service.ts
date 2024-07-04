import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CONFIG } from 'src/app/common/utils/constantes';
import { HandlerExceptions } from 'src/app/common/utils/handlerexception';
import {  IParametrosCFrecuencias, IParametrosEstaciones } from 'src/app/modelo/configuracion/estacion';
import { IParametro } from 'src/app/modelo/configuracion/parametro';
import Swal from 'sweetalert2';
@Injectable({
  providedIn: 'root'
})
export class ServiciosParametrosEstacionesService {

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
  constructor(private http: HttpClient) {
    // Esto es intencional
  } 

 
  
 /**Obtiene la lista de todos los parametros por estacion */
 obtener(): Observable<IParametrosEstaciones[]> {  
  return this.http.get<any>(`${CONFIG.WS_END_POINT}parametroXEstacion/obtener`)
    .pipe(
      map((response) => response),
      catchError(e => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    );
}

/**Obtiene un parametro por estacion por identificador */
obtenerPorId(id: number): Observable<any> {
  return this.http.get<IParametrosEstaciones>(CONFIG.WS_END_POINT + 'parametroXEstacion/obtenerPorId/' + id).pipe(
    catchError(e => {
      HandlerExceptions.validarExcepcionesHTTP(e);
      return throwError(e);
    })
  );
}
 

obtenerListaParametros(id: number): Observable<any> {
  return this.http.get<IParametrosEstaciones>(CONFIG.WS_END_POINT + 'parametroXEstacion/obtenerDTO/' + id).pipe(
    catchError(e => {
      HandlerExceptions.validarExcepcionesHTTP(e);
      return throwError(e);
    })
  );
}

obtenerListaParametrosPorFrecuencias(parametrosXFrecuencias : IParametrosCFrecuencias): Observable<any> {
  return this.http.post<IParametrosEstaciones>(CONFIG.WS_END_POINT + 'parametros/parametrosxfrecuencia/', parametrosXFrecuencias).pipe(
    catchError(e => {
      HandlerExceptions.validarExcepcionesHTTP(e);
      return throwError(e);
    })
  );
}


obtenerListaParametrosPorFrecuenciasDobleMasas(parametrosXFrecuencias : IParametrosCFrecuencias): Observable<any> {
  return this.http.post<IParametrosEstaciones>(CONFIG.WS_END_POINT + 'parametros/parametrosxfrecuencia/', parametrosXFrecuencias).pipe(
    catchError(e => {
      HandlerExceptions.validarExcepcionesHTTP(e);
      return throwError(e);
    })
  );
}

obtenerListaParametrosEstacion(parametroestacion: IParametrosEstaciones): Observable<IParametrosEstaciones> { 
  return this.http.post<IParametrosEstaciones>(CONFIG.WS_END_POINT + 'parametroXEstacion/obtenerParametroEstacion', parametroestacion).pipe(
    catchError(e => {
      HandlerExceptions.validarExcepcionesHTTP(e);
      return throwError(e);
    })
  );
}



/**Crea un parametro por estacion */
crear(parametroestacion: IParametrosEstaciones): Observable<IParametrosEstaciones> { 
  return this.http.post<IParametrosEstaciones>(CONFIG.WS_END_POINT + 'parametroXEstacion/crear', parametroestacion).pipe(
    catchError(e => {

      if(e.ok === false){
        this.toast.fire({
          icon: 'error',
          title:
            'El parametro ya esta asociado!',
        });
        return throwError(e.ok);
      }else{
        HandlerExceptions.validarExcepcionesHTTP(e);
       
        return throwError(e);
      }
      

    })
  );
}

/**Actualizar un parametroestacion */
actualizar(parametroestacion: IParametrosEstaciones): Observable<IParametrosEstaciones> { 
  return this.http.post<IParametrosEstaciones>(CONFIG.WS_END_POINT + 'parametroXEstacion/actualizar', parametroestacion).pipe(
    catchError(e => {
      HandlerExceptions.validarExcepcionesHTTP(e);
      return throwError(e);
    })
  );
}
  
eliminar(id: number): Observable<IParametrosEstaciones> {
  return this.http
    .post<IParametrosEstaciones>(
      CONFIG.WS_END_POINT + 'parametroXEstacion/eliminar/' + id,
      null
    )
    .pipe(
      catchError((e) => {
       

        if(e.ok === false){
          this.toast.fire({
            icon: 'error',
            title:
              'No se puede eliminar tiene datos asociados!!!',
          });
          return throwError(e.ok);
        }else{
          HandlerExceptions.validarExcepcionesHTTP(e);
         
          return throwError(e);
        }


      })
    );
}

obtenerPorIdCriterioDTO(id: number): Observable<any[]> {
  return this.http.get<IParametro[]>(`${CONFIG.WS_END_POINT}parametros/obtenerCriterioDTO/` + id).pipe(
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


}
