import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { CONFIG } from 'src/app/common/utils/constantes';
import { HandlerExceptions } from 'src/app/common/utils/handlerexception'; 
import { catchError, map } from 'rxjs/operators';
import { IObservacionesConsulta } from 'src/app/modelo/observaciones/observacionesConsulta';
import { IValorConsultaOXP } from 'src/app/modelo/observaciones/valorObservacionXparaemtro';
import { IValorConsulta } from 'src/app/modelo/observaciones/valorObservacion';
import { IautoCompletado } from 'src/app/modelo/observaciones/autocompletado';
import { IAfotoCantidad } from 'src/app/modelo/configuracion/aforo';
import { Idfs } from 'src/app/modelo/configuracion/idfs';

let headersReq = new HttpHeaders({
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Allow-Origin': '*'
  })
@Injectable({
    providedIn: 'root'
  })


  export class ServiciosAnalisisCon{
    constructor(private http: HttpClient ){

    }

    obtenerFiltro(param: any):Observable<any[]>{
        return this.http.get<any>(`${CONFIG.WS_END_POINT}estacion/filtrar`,{params: param})
        .pipe(
          map((response) => {return response}),
          catchError(e => {
            HandlerExceptions.validarExcepcionesHTTP(e);
            return throwError(e);
          })
        );
    }
    //analisis/dobles-masas/estacion-origen/
    estacionOrigen(param:any):Observable<any[]>{
        //return this.http.post<any>(`${CONFIG.WS_END_POINT}analisis/dobles-masas/estacion-origen`,{param},{headers:headersReq})
        return this.http.post<any>(`${CONFIG.WS_END_POINT}analisis/dobles-masas`,param)
            .pipe(
                //map((res) => res),
                catchError(e =>{
                    HandlerExceptions.validarExcepcionesHTTP(e);
                    return throwError(e);                    
                })
            )
        }

        analisisDobleMasas(IObservacionesConsulta: IObservacionesConsulta): Observable<IautoCompletado> { 
          return this.http
            .post<IautoCompletado>(CONFIG.WS_END_POINT + 'analisis/analisisDobleMasas', IObservacionesConsulta)
            .pipe(
              map((response) => response),
              catchError((e) => {
                HandlerExceptions.validarExcepcionesHTTP(e);
                return throwError(e);
              })
            );
        }

        cantidad(IObservacionesConsulta: IObservacionesConsulta): Observable<IAfotoCantidad> { 
          return this.http
            .post<IAfotoCantidad>(CONFIG.WS_END_POINT + 'analisis/cantidad-obervaciones-id-fecha', IObservacionesConsulta)
            .pipe(
              map((response) => response),
              catchError((e) => {
                HandlerExceptions.validarExcepcionesHTTP(e);
                return throwError(e);
              })
            );
        }
      
        prueba(IObservacionesConsulta: Idfs): Observable<Idfs> { 
          return this.http
            .post<Idfs>(CONFIG.WS_END_POINT + 'contenedorDatos/obtenerIdf', IObservacionesConsulta)
            .pipe(
              map((response) => response),
              catchError((e) => {
                HandlerExceptions.validarExcepcionesHTTP(e);
                return throwError(e);
              })
            );
        }

        obtener(): Observable<Idfs[]> {

          return this.http.get<Idfs[]>(`${CONFIG.WS_END_POINT}consultaIdfs/traerDatos`)
            .pipe(
              map(
                (response) => response),
              catchError(e => {
                HandlerExceptions.validarExcepcionesHTTP(e);
                return throwError(e);
              })
            );
        }



  }