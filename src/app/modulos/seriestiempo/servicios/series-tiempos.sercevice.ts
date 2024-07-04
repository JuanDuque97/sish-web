import { EventEmitter, Injectable, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CONFIG } from 'src/app/common/utils/constantes';
import { HandlerExceptions } from 'src/app/common/utils/handlerexception';
import { ITipoArchivoConfigurado } from 'src/app/modelo/configuracion/tipoArchivoConfiguracion';
import { ITipoFormatoSerieColumna } from 'src/app/modelo/configuracion/tipoFormatoSerieColumna';
import {  ITipoFormatoSerie} from 'src/app/modelo/configuracion/tipoFormatoSerie';
import { ICriterioValidacion } from 'src/app/modelo/configuracion/criterioValidacion';
import { ISerieTiempoCargueArchivo } from 'src/app/modelo/configuracion/serieTiempoCargueArchivo';
import { ISerieTiempoDetalle } from 'src/app/modelo/configuracion/serieTiempoDetalle';

@Injectable({
  providedIn: 'root'
})
export class SeriesTiempoArchivos {

  @Output() listaArchivosService: EventEmitter<any> = new EventEmitter();  
  constructor(private http: HttpClient) { }

  obtenerTipoFormatoSerie() {
    return this.http
       .get<ITipoFormatoSerie[]>(`${CONFIG.WS_END_POINT}tipoFormato/obtener`)
       .pipe(
        map((response) => response),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
   }

  obtenerTipoFormatoSerieLista() {
   return this.http
      .get<ITipoFormatoSerie>(`${CONFIG.WS_END_POINT}tipoFormato/obtener`)
      .pipe(
        map((r: any) =>
        r.map((d: ITipoFormatoSerie) => ({
          id: d.idTipoFormato,
          text: d.tipoFormato,
          disabled: false
        }))
      ),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  obtenerTipoFormatoSerieColumna(idTipoFormato:number) {
    return this.http
       .get<ITipoFormatoSerieColumna[]>(`${CONFIG.WS_END_POINT}tipoFormatoColumna/obtenerPorIdFormato/`+idTipoFormato)
       .pipe(
        map((response) => response),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
   }

   obtenerExpresiones() {
    return this.http
       .get<ICriterioValidacion[]>(`${CONFIG.WS_END_POINT}criterioValidacion/obtenerActivo`)
       .pipe(
         map((response) => response),
         catchError((e) => {
           HandlerExceptions.validarExcepcionesHTTP(e);
           return throwError(e);
         })
       );
   }

   crearSerieDeTiempoAchivo(serieDeTiempoArchivo:ISerieTiempoCargueArchivo) {
    return this.http.post<ISerieTiempoCargueArchivo>(CONFIG.WS_END_POINT + 'serieTiempoCargueArchivo/crear', serieDeTiempoArchivo).pipe(
      catchError(e => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    );
   }

   crearSerieDeTiempoDetalle(serieTiempoDetalle:ISerieTiempoDetalle[]) {
    return this.http.post<ISerieTiempoCargueArchivo>(CONFIG.WS_END_POINT + 'serieTiempoDetalle/crearList', serieTiempoDetalle).pipe(
      catchError(e => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    );
   }

   obtenerSeriesTiempoCargueArchvo(){
      return this.http
      .get<ISerieTiempoCargueArchivo[]>(`${CONFIG.WS_END_POINT}serieTiempoCargueArchivo/obtener`)
      .pipe(
      map((response) => response),
      catchError((e) => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    );
   }

   actualizarSerie(serieTiempo:ISerieTiempoCargueArchivo){
     console.log(JSON.stringify(serieTiempo));
    return this.http
    .put<ISerieTiempoCargueArchivo>(CONFIG.WS_END_POINT + 'serieTiempoCargueArchivo/actualizar', serieTiempo)
    .pipe(
      catchError((e) => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    );
   }

   obtenerPorIdCargueArchivo(id:number) {
    return this.http
       .get<ISerieTiempoDetalle[]>(`${CONFIG.WS_END_POINT}serieTiempoDetalle/obtenerPorIdCargueArchivo/`+id)
       .pipe(
        map((response) => response),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
   }
}
