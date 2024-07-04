import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CONFIG } from 'src/app/common/utils/constantes';
import { HandlerExceptions } from 'src/app/common/utils/handlerexception';   
import { IValorParametroXCriterio } from 'src/app/modelo/configuracion/criterioValidacion';
import { IinventarioElementos, IrequesInventario } from 'src/app/modelo/observaciones/inventarioElementos';
import { IObservacionesConsulta } from 'src/app/modelo/observaciones/observacionesConsulta';
import { IObservacionesEstacion } from 'src/app/modelo/observaciones/observacionesEstacion';
import { IObservacionesEstacionDTO } from '../../../../modelo/observaciones/observacionesEstacion';

@Injectable({
  providedIn: 'root'
})
export class ServiciosObservacionesEstacionService {

  constructor(private http: HttpClient) {
    // Esto es intencional
  } 
  obtener(): Observable<IObservacionesEstacion[]> {
    return this.http
      .get<IObservacionesEstacion[]>(`${CONFIG.WS_END_POINT}observacionesXEstacionInicial/obtener`)
      .pipe(
        map((response) => response),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  } 
  obtenerPorId(id: number): Observable<IObservacionesEstacion> {
    return this.http.get<IObservacionesEstacion>(CONFIG.WS_END_POINT + 'observacionesXEstacionInicial/obtenerPorId/' + id)
    .pipe(
      map((response) => response),
      catchError(e => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    );
  }
  obtenerPorIdDTO(id: number): Observable<IObservacionesEstacionDTO> {
    return this.http.get<IObservacionesEstacionDTO>(CONFIG.WS_END_POINT + 'observacionesXEstacionInicial/obtenerDTOById/' + id)
    .pipe(
      map((response) => response),
      catchError(e => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    );
  }
  
  obtenerDTO(IObservacionesConsulta: IObservacionesConsulta): Observable<IObservacionesConsulta> { 
    return this.http
      .post<IObservacionesConsulta>(CONFIG.WS_END_POINT + 'observacionesXEstacionInicial/obtenerDTO', IObservacionesConsulta)
      .pipe(
        map((response) => response),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }
  obtenerValoresDTO(IObservacionesConsulta: IObservacionesConsulta): Observable<IValorParametroXCriterio> { 
    return this.http
      .post<IValorParametroXCriterio>(CONFIG.WS_END_POINT + 'observacionesXEstacionInicial/obtenerValoresDTO', IObservacionesConsulta)
      .pipe(
        map((response) => response),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  obtenerInventario(requesInventario: IrequesInventario): Observable<IinventarioElementos> {  
    return this.http
      .post<IinventarioElementos>(CONFIG.WS_END_POINT + 'observacionesXEstacionInicial/InventarioDTO', requesInventario)
      .pipe(
        map((response) => response),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  creacionMasiva(
    IObservacionesEstacion: IObservacionesEstacion
  ): Observable<IObservacionesEstacion[]> {
    return this.http
      .post<IObservacionesEstacion[]>(
        CONFIG.WS_END_POINT + 'observacionesXEstacionInicial/creacionMasiva',
        IObservacionesEstacion
      )
      .pipe(
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }
  crear(
    IObservacionesEstacion: IObservacionesEstacion
  ): Observable<IObservacionesEstacion[]> {
    return this.http
      .post<IObservacionesEstacion[]>(
        CONFIG.WS_END_POINT + 'observacionesXEstacionInicial/crear',
        IObservacionesEstacion
      )
      .pipe(
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  actualizar(IObservacionesEstacion: IObservacionesEstacion): Observable<IObservacionesEstacion> { 
    return this.http
      .post<IObservacionesEstacion>(CONFIG.WS_END_POINT + 'observacionesXEstacionInicial/actualizar', IObservacionesEstacion)
      .pipe(
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }



}
