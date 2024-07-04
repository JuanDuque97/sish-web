import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CONFIG } from 'src/app/common/utils/constantes';
import { HandlerExceptions } from 'src/app/common/utils/handlerexception';   
import { IValorParametroXCriterio } from 'src/app/modelo/configuracion/criterioValidacion';
import { IinventarioElementos, IrequesInventario } from 'src/app/modelo/observaciones/inventarioElementos';
import { IObservacionesConsulta } from 'src/app/modelo/observaciones/observacionesConsulta';
import { IValorConsultaOXP } from 'src/app/modelo/observaciones/valorObservacionXparaemtro';
import { IPruebaBondadGeneralRequest, IPruebaBondadGeneralResponse, IResultadoPrueba, IValorConsulta, IVCramerRequest, IVCramerResponse, limiteSuperior } from 'src/app/modelo/observaciones/valorObservacion';
import { IautoCompletado } from 'src/app/modelo/observaciones/autocompletado';

import { IObservacionesEstacion, ICargueEstacionRespuesta } from 'src/app/modelo/observaciones/observacionesEstacion';
import { IObservacionesEstacionDTO } from '../../../modelo/observaciones/observacionesEstacion';
import { IPruebasBondad } from 'src/app/modelo/configuracion/pruebasBondad';

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
  seriemixtavalor(IObservacionesConsulta: IObservacionesConsulta): Observable<IValorConsultaOXP> { 
    return this.http
      .post<IValorConsultaOXP>(CONFIG.WS_END_POINT + 'observacionesXEstacionInicial/seriemixtavalor', IObservacionesConsulta)
      .pipe(
        map((response) => response),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }


  autocompletadoDatos(IObservacionesConsulta: IObservacionesConsulta): Observable<IautoCompletado> { 
    return this.http
      .post<IautoCompletado>(CONFIG.WS_END_POINT + 'observacionesXEstacionInicial/autocompletadoDatos', IObservacionesConsulta)
      .pipe(
        map((response) => response),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }
  prueba(IObservacionesConsulta: IObservacionesConsulta): Observable<IObservacionesConsulta> { 
    return this.http
      .post<IObservacionesConsulta>(CONFIG.WS_END_POINT + 'observacionesXEstacionInicial/prueba', IObservacionesConsulta)
      .pipe(
        map((response) => response),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  obtenerDTOAgregacion(IValorConsulta: IValorConsulta): Observable<IValorConsulta> { 
    return this.http
      .post<IValorConsulta>(CONFIG.WS_END_POINT + 'observacionesXEstacionInicial/obtenerDTOAgregacion', IValorConsulta)
      .pipe(
        map((response) => response),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  obtenerValorPruebaBondad(IValorConsulta: IPruebaBondadGeneralRequest): Observable<IResultadoPrueba[]> { 
    return this.http
      .post<IResultadoPrueba[]>(CONFIG.WS_END_POINT + 'pruebasBondad/obtenerValor', IValorConsulta)
      .pipe(
        map((response) => response),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  obtenerValorPrueba(IValorConsulta: IPruebaBondadGeneralRequest): Observable<IPruebaBondadGeneralResponse[]> { 
    return this.http
      .post<IPruebaBondadGeneralResponse[]>(CONFIG.WS_END_POINT + 'pruebasBondad/obtenerValor', IValorConsulta)
      .pipe(
        map((response) => response),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }
  obtenerValorMax(IValorConsulta: IPruebaBondadGeneralRequest): Observable<IPruebaBondadGeneralResponse[]> { 
    return this.http
      .post<IPruebaBondadGeneralResponse[]>(CONFIG.WS_END_POINT + 'pruebasBondad/obtenerValorMax', IValorConsulta)
      .pipe(
        map((response) => response),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }
  obtenerValorMin(IValorConsulta: IPruebaBondadGeneralRequest): Observable<IPruebaBondadGeneralResponse[]> { 
    return this.http
      .post<IPruebaBondadGeneralResponse[]>(CONFIG.WS_END_POINT + 'pruebasBondad/obtenerValorMin', IValorConsulta)
      .pipe(
        map((response) => response),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }
  obtenerValorRango(IValorConsulta: IPruebaBondadGeneralRequest): Observable<IPruebaBondadGeneralResponse[]> { 
    return this.http
      .post<IPruebaBondadGeneralResponse[]>(CONFIG.WS_END_POINT + 'pruebasBondad/obtenerValorRango', IValorConsulta)
      .pipe(
        map((response) => response),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  obtenerValorCantidad(IValorConsulta: IPruebaBondadGeneralRequest): Observable<IPruebaBondadGeneralResponse[]> { 
    return this.http
      .post<IPruebaBondadGeneralResponse[]>(CONFIG.WS_END_POINT + 'pruebasBondad/obtenerValorCantidad', IValorConsulta)
      .pipe(
        map((response) => response),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  obtenerValorRaiz(IValorConsulta: IPruebaBondadGeneralRequest): Observable<IPruebaBondadGeneralResponse[]> { 
    return this.http
      .post<IPruebaBondadGeneralResponse[]>(CONFIG.WS_END_POINT + 'pruebasBondad/obtenerValorRaiz', IValorConsulta)
      .pipe(
        map((response) => response),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }
  obtenerValorIntervalo(IValorConsulta: IPruebaBondadGeneralRequest): Observable<IPruebaBondadGeneralResponse[]> { 
    return this.http
      .post<IPruebaBondadGeneralResponse[]>(CONFIG.WS_END_POINT + 'pruebasBondad/obtenerValorIntervalo', IValorConsulta)
      .pipe(
        map((response) => response),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  obtenerValorDesviacion(IValorConsulta: IPruebaBondadGeneralRequest): Observable<IPruebaBondadGeneralResponse[]> { 
    return this.http
      .post<IPruebaBondadGeneralResponse[]>(CONFIG.WS_END_POINT + 'pruebasBondad/obtenerValorDesviacion', IValorConsulta)
      .pipe(
        map((response) => response),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  obtenerValorListas(IValorConsulta: IPruebaBondadGeneralRequest): Observable<IPruebaBondadGeneralResponse[]> { 
    return this.http
      .post<IPruebaBondadGeneralResponse[]>(CONFIG.WS_END_POINT + 'pruebasBondad/obtenerValorListas', IValorConsulta)
      .pipe(
        map((response) => response),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  obtenerFrecuenciaObservada(IValorConsulta: limiteSuperior): Observable<IPruebaBondadGeneralResponse[]> { 
    return this.http
      .post<IPruebaBondadGeneralResponse[]>(CONFIG.WS_END_POINT + 'pruebasBondad/obtenerFrecuenciaObservada', IValorConsulta)
      .pipe(
        map((response) => response),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  obtenerValorPruebaCramer(requestDTO: IVCramerRequest): Observable<IVCramerResponse> { 
    return this.http
      .post<IVCramerResponse>(CONFIG.WS_END_POINT + 'pruebasBondad/vCramer', requestDTO)
      .pipe(
        map((response) => response),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  valorPruebaCalidad(IValorConsulta: IValorConsulta): Observable<IValorConsulta> { 
    return this.http
      .post<IValorConsulta>(CONFIG.WS_END_POINT + 'observacionesXEstacionInicial/valorPruebaCalidad', IValorConsulta)
      .pipe(
        map((response) => response),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  obtenerDTOXParametro(IObservacionesConsulta: IObservacionesConsulta): Observable<number> { 
    return this.http
      .post<number>(CONFIG.WS_END_POINT + 'observacionesXEstacionInicial/obtenerDTOXParametro', IObservacionesConsulta)
      .pipe(
        map((response) => response),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  obtenerDTOXParametroMini(IObservacionesConsulta: IObservacionesConsulta): Observable<number> { 
    return this.http
      .post<number>(CONFIG.WS_END_POINT + 'observacionesXEstacionInicial/obtenerDTOXParametroMini', IObservacionesConsulta)
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

  cargueRapido(IObservacionesEstacion: any): Observable<ICargueEstacionRespuesta> {
    return this.http
      .post<ICargueEstacionRespuesta>(
        CONFIG.WS_END_POINT + 'observacionesXEstacionInicial/cargueRapido',
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

  crearPruebasBondad(
    IPruebasBondad: IPruebasBondad
  ): Observable<IPruebasBondad[]> {
    return this.http
      .post<IPruebasBondad[]>(
        CONFIG.WS_END_POINT + 'pruebasBondad/crear',
        IPruebasBondad
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
  actualizarEstado(actualizar:any  ): Observable<IObservacionesEstacion> { 
    return this.http
      .post<IObservacionesEstacion>(CONFIG.WS_END_POINT + 'observacionesXEstacionInicial/actualizar', actualizar)
      .pipe(
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  actualizarEstadoObservacion(estado:any,id: any){
    return this.http.post<boolean>(CONFIG.WS_END_POINT + 'observacionesXEstacionInicial/actualizarEstado?estado='+estado+'&id='+id,0 ).pipe(
        catchError(e => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
}


}
