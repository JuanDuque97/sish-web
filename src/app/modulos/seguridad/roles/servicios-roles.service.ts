import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CONFIG } from 'src/app/common/utils/constantes';
import { HandlerExceptions } from 'src/app/common/utils/handlerexception';
import { IRol } from 'src/app/modelo/seguridad/rol';

@Injectable({
  providedIn: 'root'
})
export class ServiciosRolesService {

  constructor(
    private http: HttpClient) {
  }

  /**Obtiene la lista de todos los roles */
  obtener(): Observable<IRol[]> {
    return this.http.get<IRol[]>(`${CONFIG.WS_END_POINT}rol/obtener`)
      .pipe(
        map((response) => response),
        catchError(e => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }
  
  /**Obtiene la lista de los roles activos */
  obtenerActivos(): Observable<IRol[]> {
    return this.http.get<IRol[]>(`${CONFIG.WS_END_POINT}rol/obtenerActivos`)
      .pipe(
        map((response) => response),
        catchError(e => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  /**Obtiene un rol por identificador */
  obtenerPorId(id: number): Observable<IRol> {
    return this.http.get<IRol>(CONFIG.WS_END_POINT + 'rol/obtenerPorId/' + id).pipe(
      catchError(e => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    );
  }

  /**Crea un rol */
  crear(rol: IRol): Observable<IRol> {
    
    return this.http.post<IRol>(CONFIG.WS_END_POINT + 'rol/crear', rol).pipe(
      catchError(e => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    );
  }

  /**Actualizar un rol */
  actualizar(rol: IRol): Observable<IRol> {
    console.log("Actualizar ",rol)
    return this.http.post<IRol>(CONFIG.WS_END_POINT + 'rol/actualizar', rol).pipe(
      catchError(e => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    );
  }

}



