import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CONFIG } from 'src/app/common/utils/constantes';
import { HandlerExceptions } from 'src/app/common/utils/handlerexception';
import { IParametrosCriterio } from 'src/app/modelo/configuracion/criterioValidacion';
import { IParametro } from 'src/app/modelo/configuracion/parametro'; 

@Injectable({
  providedIn: 'root',
})
export class ServiciosParametrosCriterio {
  constructor(private http: HttpClient) { }

  /**Crea un parametrosCriterio */
  crear(parametrosCriterio: IParametrosCriterio): Observable<IParametrosCriterio> {
    return this.http
      .post<IParametrosCriterio>(
        CONFIG.WS_END_POINT + 'parametroXCriterio/crear',
        parametrosCriterio
      )
      .pipe(
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  eliminar(id: number): Observable<IParametrosCriterio> {
    return this.http
      .post<IParametrosCriterio>(
        CONFIG.WS_END_POINT + 'parametroXCriterio/eliminar/' + id, null
      )
      .pipe(
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  /**Obtiene la lista de todos los parametroXCriterio */
  obtener(): Observable<IParametrosCriterio[]> {
    return this.http
      .get<IParametrosCriterio[]>(`${CONFIG.WS_END_POINT}parametroXCriterio/obtener`)
      .pipe(
        map((response) => response),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  /**Obtiene un parametrosCriterio por identificador */
  obtenerListaParametrosXCriterio(id: number): Observable<IParametrosCriterio[]> {
    return this.http
      .get<IParametrosCriterio[]>(
        CONFIG.WS_END_POINT + 'parametroXCriterio/obtenerDTO/' + id
      )
      .pipe(
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }


  obtenerListaCriterioXParametros(id: number): Observable<IParametrosCriterio[]> {
    return this.http
      .get<IParametrosCriterio[]>(
        CONFIG.WS_END_POINT + 'parametroXCriterio/obtenerXParametro/' + id
      )
      .pipe(
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  obtenerListaParametros(): Observable<any[]> {
    return this.http
      .get<IParametro[]>(`${CONFIG.WS_END_POINT}parametros/obtener`)
      .pipe(
        map((r: any) =>
          r.map((d: any) => ({
            [d.idParametro]: d.descripcion,
          }))
        ),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }
  obtenerListaParametrosSelect2(): Observable<any[]> {
    return this.http
      .get<IParametro[]>(`${CONFIG.WS_END_POINT}parametros/obtener`)
      .pipe(
        map((r: any) =>
          r.map((d: any) => ({
           
            id: d.idParametro,
            text: d.descripcion,


          }))
        ),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }
  
  /**Actualizar un parametrosCriterio */
  actualizar(parametrosCriterio: IParametrosCriterio): Observable<IParametrosCriterio> {
    return this.http
      .post<IParametrosCriterio>(CONFIG.WS_END_POINT + 'parametroXCriterio/actualizar', parametrosCriterio)
      .pipe(
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }
}
