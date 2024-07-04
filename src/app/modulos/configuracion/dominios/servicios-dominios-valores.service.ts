import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { CONFIG } from 'src/app/common/utils/constantes';
import { HandlerExceptions } from 'src/app/common/utils/handlerexception';
import { catchError, map } from 'rxjs/operators';
import { IDominioValor } from 'src/app/modelo/configuracion/dominioValor';
import { dominiosEnum } from 'src/app/modelo/enum/dominios-enum';

@Injectable({
  providedIn: 'root',
})
export class ServiciosDominiosValoresService {
  constructor(private http: HttpClient) {
    //Esto es intencional
  }

  /**Obtiene los valores de un dominio por identificador del dominio */
  obtenerValoresPorIdDominio(id: number): Observable<any> {
    return this.http
      .get<IDominioValor>(
        CONFIG.WS_END_POINT + 'dominioValor/obtenerValoresPorIdDominio/' + id
      )
      .pipe(
        map((r: any) =>
          r.map((d: IDominioValor) => ({
            id: d.idDominioValor,
            text: d.dominioValor,
            disabled: d.activo == 'S' ? false : true,
          }))
        ),

        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  obtenerValoresPorIdDominioid(id: number): Observable<any> {
    return this.http.get<IDominioValor>(CONFIG.WS_END_POINT + 'dominioValor/obtenerPorId/' + id).pipe(
      catchError(e => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    );
  }
  obtenerTotalValoresPorIdDominio(id: number): Observable<any> {
    return this.http
      .get<IDominioValor>(
        CONFIG.WS_END_POINT + 'dominioValor/obtenerValoresPorIdDominio/' + id
      )
      .pipe(
        map((r: any) =>
          r.map((d: IDominioValor) => ({
            id: d.idDominioValor,
            text: d.dominioValor, 
          }))
        ),

        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }
  /**Obtiene los valores activos de un dominio por identificador del dominio */
  obtenerValoresActivosPorIdDominio(id: dominiosEnum): Observable<any> {
    return this.http
      .get<IDominioValor>(
        CONFIG.WS_END_POINT +
          'dominioValor/obtenerValoresActivosPorIdDominio/' +
          id
      )
      .pipe(
        map((r: any) =>
          r.map((d: IDominioValor) => ({
            id: d.idDominioValor,
            text: d.dominioValor,
          }))
        ),

        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  obtenerListadoMetodoxTipo(id: any): Observable<any> {
    return this.http
      .get<IDominioValor>(
        CONFIG.WS_END_POINT +
          'metodoXtipoParametro/obtenerDTO/' +
          id
      )
      .pipe(
        map((r: any) =>
          r.map((d: any) => ({
            id: d.idMetodo,
            text: d.metodo,
          }))
        ),

        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  obtenerValorDominio(id: number): Observable<IDominioValor[]> {
    return this.http
      .get<IDominioValor[]>(
        CONFIG.WS_END_POINT + 'dominioValor/obtenerValoresPorIdDominio/' + id
      )
      .pipe(
        map((response) => response),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  crear(dominioValor: IDominioValor): Observable<IDominioValor> {
    return this.http
      .post<IDominioValor>(
        CONFIG.WS_END_POINT + 'dominioValor/crear',
        dominioValor
      )
      .pipe(
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  actualizar(dominioValor: IDominioValor): Observable<IDominioValor> {
    return this.http
      .post<IDominioValor>(
        CONFIG.WS_END_POINT + 'dominioValor/actualizar',
        dominioValor
      )
      .pipe(
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }
  obtenerPorId(id: number): Observable<any> {
    return this.http.get<IDominioValor>(CONFIG.WS_END_POINT + 'dominioValor/obtenerPorId/' + id).pipe(
      catchError(e => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    );
  }


}
