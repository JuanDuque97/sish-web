import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CONFIG } from 'src/app/common/utils/constantes';
import { HandlerExceptions } from 'src/app/common/utils/handlerexception';    
import { IValorParametroXCriterio } from 'src/app/modelo/configuracion/criterioValidacion';
import { IrequesInventario, IinventarioElementos } from 'src/app/modelo/observaciones/inventarioElementos';
import { IObservacionesConsulta } from 'src/app/modelo/observaciones/observacionesConsulta';
import { IObservacionesPozos, IObservacionesPozosDTO, ICarguePozoRespuesta } from 'src/app/modelo/observaciones/observacionesPozos';

@Injectable({
  providedIn: 'root'
})
export class ServiciosObservacionesPozosService {

  constructor(private http: HttpClient) {
    // Esto es intencional
  } 
  obtener(): Observable<IObservacionesPozos[]> {
    return this.http
      .get<IObservacionesPozos[]>(`${CONFIG.WS_END_POINT}observacionesXPozoInicial/obtener`)
      .pipe(
        map((response) => response),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  } 
  obtenerPorId(id: number): Observable<IObservacionesPozos> {
    return this.http.get<IObservacionesPozos>(CONFIG.WS_END_POINT + 'observacionesXPozoInicial/obtenerPorId/' + id).pipe(
      catchError(e => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    );
  }
 

  obtenerPorIdDTO(id: number): Observable<IObservacionesPozosDTO> {
    return this.http.get<IObservacionesPozosDTO>(CONFIG.WS_END_POINT + 'observacionesXPozoInicial/obtenerDTOById/' + id)
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
      .post<IObservacionesConsulta>(CONFIG.WS_END_POINT + 'observacionesXPozoInicial/obtenerDTO', IObservacionesConsulta)
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
      .post<IValorParametroXCriterio>(CONFIG.WS_END_POINT + 'observacionesXPozoInicial/obtenerValoresDTO', IObservacionesConsulta)
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
      .post<IinventarioElementos>(CONFIG.WS_END_POINT + 'observacionesXPozoInicial/InventarioDTO', requesInventario)
      .pipe(
        map((response) => response),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }
 
  creacionMasiva(
    IObservacionesPozos: IObservacionesPozos
  ): Observable<IObservacionesPozos[]> {
    return this.http
      .post<IObservacionesPozos[]>(
        CONFIG.WS_END_POINT + 'observacionesXPozoInicial/creacionMasiva',
        IObservacionesPozos
      )
      .pipe(
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  cargueRapido(
    IObservacionesPozos: IObservacionesPozos
  ): Observable<ICarguePozoRespuesta> {
    return this.http
      .post<ICarguePozoRespuesta>(
        CONFIG.WS_END_POINT + 'observacionesXPozoInicial/cargueRapido',
        IObservacionesPozos
      )
      .pipe(
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  crear(
    IObservacionesPozos: IObservacionesPozos
  ): Observable<IObservacionesPozos[]> {
    return this.http
      .post<IObservacionesPozos[]>(
        CONFIG.WS_END_POINT + 'observacionesXPozoInicial/crear',
        IObservacionesPozos
      )
      .pipe(
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  actualizar(IObservacionesPozos: IObservacionesPozos): Observable<IObservacionesPozos> { 
    return this.http
      .post<IObservacionesPozos>(CONFIG.WS_END_POINT + 'observacionesXPozoInicial/actualizar', IObservacionesPozos)
      .pipe(
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }



}
