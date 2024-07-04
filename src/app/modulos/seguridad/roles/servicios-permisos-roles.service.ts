import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CONFIG } from 'src/app/common/utils/constantes';
import { HandlerExceptions } from 'src/app/common/utils/handlerexception';
import { IRol } from 'src/app/modelo/seguridad/rol';
import { IPermisoXRol, IObtenerPermisosRequest, IObtenerPermisosResponse } from '../../../modelo/seguridad/rol';

@Injectable({
  providedIn: 'root',
})
export class ServiciosPermisosRolesService {
  constructor(private http: HttpClient) {}

  /**Crea un PermisoXRol */
  crear(permisoXRol: IPermisoXRol): Observable<IPermisoXRol> {
    return this.http
      .post<IPermisoXRol>(
        CONFIG.WS_END_POINT + 'permisosXRol/crear',
        permisoXRol
      )
      .pipe(
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }
 
  eliminar(id: number): Observable<IPermisoXRol> {
    return this.http
      .post<IPermisoXRol>(
        CONFIG.WS_END_POINT + 'permisosXRol/eliminar/' + id,null      
      )
      .pipe(
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  /**Obtiene la lista de todos los PermisosXRol */
  obtener(): Observable<IRol[]> {
    return this.http
      .get<IRol[]>(`${CONFIG.WS_END_POINT}permisosXRol/obtener`)
      .pipe(
        map((response) => response),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  /**Obtiene un PermisoXRol por identificador */
  obtenerListaPermisosXRolId(id: number): Observable<IRol> {
    return this.http
      .get<IRol>(
        CONFIG.WS_END_POINT + 'permisosXRol/obtenerPorIdDTO/' + id
      )
      .pipe(
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  /**Actualizar un PermisoXRol */
  actualizar(permisoXRol: IPermisoXRol): Observable<IRol> { 
    return this.http
      .post<IRol>(CONFIG.WS_END_POINT + 'permisosXRol/actualizar', permisoXRol)
      .pipe(
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  /*
  obtenerPermisos(request : string[]): Observable<string[]> {
    return this.http.get<string[]>(CONFIG.WS_END_POINT + 'permisosXRol/obtenerPermisos', {params: request})
      .pipe(
        map((response) => response), 
        catchError(e => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        });
      );
  }
  */
}
