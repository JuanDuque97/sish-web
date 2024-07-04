import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CONFIG } from 'src/app/common/utils/constantes';
import { HandlerExceptions } from 'src/app/common/utils/handlerexception';
import { IserieConsulta, IserieConsultaDTO, IserieTiempoElemento, IserieTiempoPromedioAnio } from 'src/app/modelo/configuracion/seriesTiempo';
import { IserieTiempoDetalle } from '../../../modelo/configuracion/seriesTiempo';

@Injectable({
  providedIn: 'root',
})
export class ServiciosSerieTiempoService {
  constructor(private http: HttpClient) {
    // Esto es intencional
  }

  obtener(): Observable<IserieTiempoElemento[]> {
    return this.http
      .get<IserieTiempoElemento[]>(
        `${CONFIG.WS_END_POINT}serieTiempoElemento/obtenerPozos`
      )
      .pipe(
        map((response) => response),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }
  obtenerSeriePorId(id: number): Observable<IserieTiempoElemento> {
    return this.http
      .get<IserieTiempoElemento>(
        CONFIG.WS_END_POINT + 'serieTiempoElemento/obtenerPorId/' + id
      )
      .pipe(
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

   
  

  crearElemento(
    IserieTiempoElemento: IserieTiempoElemento
  ): Observable<IserieTiempoElemento> {
    return this.http
      .post<IserieTiempoElemento>(
        CONFIG.WS_END_POINT + 'serieTiempoElemento/crear',
        IserieTiempoElemento
      )
      .pipe(
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  crearDobleMasas(
    IserieTiempoElemento: IserieTiempoElemento
  ): Observable<IserieTiempoElemento> {
    return this.http
      .post<IserieTiempoElemento>(
        CONFIG.WS_END_POINT + 'serieTiempoElemento/crearDobleMasas',
        IserieTiempoElemento
      )
      .pipe(
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }


  

  actualizarElemento(
    IserieTiempoElemento: IserieTiempoElemento
  ): Observable<IserieTiempoElemento> {
    return this.http
      .post<IserieTiempoElemento>(
        CONFIG.WS_END_POINT + 'serieTiempoElemento/actualizar',
        IserieTiempoElemento
      )
      .pipe(
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  //   Serie Tiempo Detalle
  crearDetalle(
    IserieTiempoDetalle: IserieTiempoDetalle
  ): Observable<IserieTiempoDetalle[]> {
    return this.http
      .post<IserieTiempoDetalle[]>(
        CONFIG.WS_END_POINT + 'serieTiempoDetalle/crearListSerie',
        IserieTiempoDetalle
      )
      .pipe(
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  obtenerSerieDetallePorId(id: number): Observable<IserieTiempoDetalle[]> {
    return this.http
      .get<IserieTiempoDetalle[]>(
        CONFIG.WS_END_POINT + 'serieTiempoDetalle/obtenerPorIdElemento/' + id
      )
      .pipe(
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  } 


  obtenerConceptivo(id: number,idp:number): Observable<IserieTiempoElemento[]> {
    return this.http
      .get<IserieTiempoElemento[]>(
        CONFIG.WS_END_POINT + 'serieTiempoElemento/obtenerConceptivo/' + id+"/"+idp
      )
       .pipe(
         map((r: any) =>
         r.map((d: IserieTiempoElemento) => ({
          id: d.conceptivo,
          text:'Estación #'+ d.idElemento+ ' -  Consecutivo #   ' + d.conceptivo,
          disabled: false
         }))
       ),
         catchError((e) => {
           HandlerExceptions.validarExcepcionesHTTP(e);
           return throwError(e);
         })
       );
   }
 


  eliminarSerieDetalle(id: number): Observable<IserieTiempoDetalle> {
    return this.http
      .get<IserieTiempoDetalle>(
        CONFIG.WS_END_POINT + 'serieTiempoDetalle/eliminar/' + id      
      )
      .pipe(
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  obtenerDTO(IObservacionesConsulta: IserieConsultaDTO[]): Observable<IserieConsultaDTO[]> { 
    return this.http
      .post<IserieConsultaDTO[]>(CONFIG.WS_END_POINT + 'serieTiempoDetalle/obtenerDTO', IObservacionesConsulta)
      .pipe(
        map((response) => response),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  obtenerDTOPromedioAnio(IObservacionesConsulta: IserieConsulta): Observable<IserieTiempoPromedioAnio[]> { 
    return this.http
      .post<IserieTiempoPromedioAnio[]>(CONFIG.WS_END_POINT + 'serieTiempoDetalle/obtenerDTOPromedioAnio', IObservacionesConsulta)
      .pipe(
        map((response) => response),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }
  obtenerDTOPromedioMes(IObservacionesConsulta: IserieConsulta): Observable<IserieTiempoPromedioAnio[]> { 
    return this.http
      .post<IserieTiempoPromedioAnio[]>(CONFIG.WS_END_POINT + 'serieTiempoDetalle/obtenerDTOPromedioMes', IObservacionesConsulta)
      .pipe(
        map((response) => response),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }
 
}
