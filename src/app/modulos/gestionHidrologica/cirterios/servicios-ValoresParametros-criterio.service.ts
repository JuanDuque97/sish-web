import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CONFIG } from 'src/app/common/utils/constantes';
import { HandlerExceptions } from 'src/app/common/utils/handlerexception'; 
import { IValorParametroXCriterio } from 'src/app/modelo/configuracion/criterioValidacion';

@Injectable({
  providedIn: 'root',
})
export class ServiciosvalorParametroXCriterio {
  constructor(private http: HttpClient) { }

  /**Crea un valorParametroXCriterio */
  crear(ValorParametroXCriterio: IValorParametroXCriterio): Observable<IValorParametroXCriterio> {
    return this.http
      .post<IValorParametroXCriterio>(
        CONFIG.WS_END_POINT + 'valorParametroXCriterio/crear',
        ValorParametroXCriterio
      )
      .pipe(
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  eliminar(id: number): Observable<IValorParametroXCriterio> {
    return this.http
      .post<IValorParametroXCriterio>(
        CONFIG.WS_END_POINT + 'valorParametroXCriterio/eliminar/' + id, null
      )
      .pipe(
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

 

  /**Obtiene un parametrosCriterio por identificador */
  obtenerListaParametrosXCriterio(id: number): Observable<IValorParametroXCriterio> {
    return this.http
      .get<IValorParametroXCriterio>(
        CONFIG.WS_END_POINT + 'valorParametroXCriterio/obtenerPorId/' + id
      )
      .pipe(
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }
  /**Obtiene un parametrosCriterio por identificador */
  obtenerValoresXParametrosDeCriterio(id: number,creterio: number): Observable<IValorParametroXCriterio> {
    return this.http
      .get<IValorParametroXCriterio>(
        CONFIG.WS_END_POINT + 'valorParametroXCriterio/obtenerValoresCriterioXidParametro/' + id+'/' +creterio,
      )
      .pipe( 
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

   
  /**Actualizar un parametrosCriterio */
  actualizar(ValorParametroXCriterio: IValorParametroXCriterio): Observable<IValorParametroXCriterio> {
    return this.http
      .post<IValorParametroXCriterio>(CONFIG.WS_END_POINT + 'valorParametroXCriterio/actualizar', ValorParametroXCriterio)
      .pipe(
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }
}
