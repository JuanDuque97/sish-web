import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CONFIG } from 'src/app/common/utils/constantes';
import { HandlerExceptions } from 'src/app/common/utils/handlerexception';    
import { IValorParametroXCriterio } from 'src/app/modelo/configuracion/criterioValidacion'; 
import { IinventarioElementos, IrequesInventario } from 'src/app/modelo/observaciones/inventarioElementos';
import { IObservacionesConsulta } from 'src/app/modelo/observaciones/observacionesConsulta';
import { IObservacionesEmbalses, IObservacionesEmbalsesDTO } from 'src/app/modelo/observaciones/observacionesEmbalse';
 
@Injectable({
  providedIn: 'root'
})
export class ServiciosObservacionesEmbalsesService {

  constructor(private http: HttpClient) {
    // Esto es intencional
  } 
  obtener(): Observable<IObservacionesEmbalses[]> {
    return this.http
      .get<IObservacionesEmbalses[]>(`${CONFIG.WS_END_POINT}observacionesXEmbalseInicial/obtener`)
      .pipe(
        map((response) => response),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  } 
  obtenerPorId(id: number): Observable<IObservacionesEmbalses> {
    return this.http.get<IObservacionesEmbalses>(CONFIG.WS_END_POINT + 'observacionesXEmbalseInicial/obtenerPorId/' + id).pipe(
      catchError(e => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    );
  }


  obtenerPorIdDTO(id: number): Observable<IObservacionesEmbalsesDTO> {
    return this.http.get<IObservacionesEmbalsesDTO>(CONFIG.WS_END_POINT + 'observacionesXEmbalseInicial/obtenerDTOById/' + id)
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
      .post<IObservacionesConsulta>(CONFIG.WS_END_POINT + 'observacionesXEmbalseInicial/obtenerDTO', IObservacionesConsulta)
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
      .post<IValorParametroXCriterio>(CONFIG.WS_END_POINT + 'observacionesXEmbalseInicial/obtenerValoresDTO', IObservacionesConsulta)
      .pipe(
        map((response) => response),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }
  obtenerInventario(IrequesInventario: IrequesInventario): Observable<IinventarioElementos> {  
    return this.http
      .post<IinventarioElementos>(CONFIG.WS_END_POINT + 'observacionesXEmbalseInicial/InventarioDTO', IrequesInventario)
      .pipe(
        map((response) => response),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  creacionMasiva(
    IObservacionesEmbalses: IObservacionesEmbalses
  ): Observable<IObservacionesEmbalses[]> {
    return this.http
      .post<IObservacionesEmbalses[]>(
        CONFIG.WS_END_POINT + 'observacionesXEmbalseInicial/creacionMasiva',
        IObservacionesEmbalses
      )
      .pipe(
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }
  crear(
    IObservacionesEmbalses: IObservacionesEmbalses
  ): Observable<IObservacionesEmbalses[]> {
    return this.http
      .post<IObservacionesEmbalses[]>(
        CONFIG.WS_END_POINT + 'observacionesXEmbalseInicial/crear',
        IObservacionesEmbalses
      )
      .pipe(
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  actualizar(IObservacionesEmbalses: IObservacionesEmbalses): Observable<IObservacionesEmbalses> { 
    return this.http
      .post<IObservacionesEmbalses>(CONFIG.WS_END_POINT + 'observacionesXEmbalseInicial/actualizar', IObservacionesEmbalses)
      .pipe(
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }



}
