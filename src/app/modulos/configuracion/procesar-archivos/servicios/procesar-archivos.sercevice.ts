import { EventEmitter, Injectable, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CONFIG } from 'src/app/common/utils/constantes';
import { HandlerExceptions } from 'src/app/common/utils/handlerexception';
import { IArchivosConfigurados } from 'src/app/modelo/tipoArchivos/archivosConfigurados';
import { IEstacion } from 'src/app/modelo/configuracion/estacion';
import { ITipoArchivoConfigurado } from 'src/app/modelo/configuracion/tipoArchivoConfiguracion';
import { ICriterioValidacion } from 'src/app/modelo/configuracion/criterioValidacion';
import { IArchivoDato , IArchivoDatoDTO} from 'src/app/modelo/configuracion/archivoDato';
import { IArchivo, IArchivoDTO, FormatoConfigDTO } from 'src/app/modelo/configuracion/archivo';
import { ITipoArchivoColumna } from 'src/app/modelo/configuracion/tipoArchivoColumna';
import { IPozosDTO } from 'src/app/modelo/configuracion/pozo';
import { IEmbalce, IEmbalceDTO } from 'src/app/modelo/configuracion/embalce';
import { ITipoArchivoCampo, ITipoArchivoCampoDTO } from 'src/app/modelo/configuracion/tipoArchivoColumnaCampo';

@Injectable({
  providedIn: 'root'
})
export class ProcesarArchivosService {

  @Output() listaArchivosService: EventEmitter<any> = new EventEmitter();  
  constructor(private http: HttpClient) { }

  obtenerTipoArchioConfigurado() {
   return this.http
      .get<ITipoArchivoConfigurado[]>(`${CONFIG.WS_END_POINT}tipoArchivoConfigurado/obtenerActivos`)
      .pipe(
        map((r: any) =>
        r.map((d: ITipoArchivoConfigurado) => ({
          id: d.idTipoArchivoConfigurado,
          text: d.tipoArchivoConfigurado,
          disabled: false
        }))
      ),
        catchError((e) => {
         // HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  obtenerTipoArchioConfiguradoPorId(id:number) {
    return this.http
       .get<ITipoArchivoConfigurado>(`${CONFIG.WS_END_POINT}tipoArchivoConfigurado/obtenerPorId/`+id)
       .pipe(
         map((response) => response),
         catchError((e) => {
          // HandlerExceptions.validarExcepcionesHTTP(e);
           return throwError(e);
         })
       );
   }

  obtenerEstacion() {
    return this.http
       .get<IEstacion[]>(`${CONFIG.WS_END_POINT}estacion/obtenerActivos`)
       .pipe(
         map((r: any) =>
         r.map((d: IEstacion) => ({
           id: d.idEstacion,
           text: d.estacion,
           disabled: false
         }))
       ),
         catchError((e) => {
           HandlerExceptions.validarExcepcionesHTTP(e);
           return throwError(e);
         })
       );
   }

   obtenerEstacionesPorFormato(tipoFormato : number, tipoFrecuencia : number) {
    return this.http
       .get<IEstacion[]>(`${CONFIG.WS_END_POINT}estacion/obtenerPorFormato/` + tipoFormato + `/` + tipoFrecuencia)
       .pipe(
         map((r: any) =>
         r.map((d: IEstacion) => ({
           id: d.idEstacion,
           text: d.estacion,
           disabled: false
         }))
       ),
         catchError((e) => {
           HandlerExceptions.validarExcepcionesHTTP(e);
           return throwError(e);
         })
       );
   }

   obtenerPozosDTO() {
    return this.http 
      .get<IPozosDTO[]>(`${CONFIG.WS_END_POINT}pozo/obtenerPozosDTO`)
      .pipe(
        map((r: any) =>
         r.map((d: any) => ({
           id: d.idPozo,
           text: d.pozo,
           disabled: false
         }))
       ),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  obtenerPozosPorFormato(formatoId : number, frecuenciaId : number) {
    return this.http 
      .get<IPozosDTO[]>(`${CONFIG.WS_END_POINT}pozo/obtenerPorFormato/` + formatoId + `/` + frecuenciaId)
      .pipe(
        map((r: any) =>
         r.map((d: any) => ({
           id: d.idPozo,
           text: d.pozo,
           disabled: false
         }))
       ),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  } 

  obtenerEembalsesDTO() {
    return this.http
      .get<IEmbalceDTO[]>(`${CONFIG.WS_END_POINT}Embalse/obtenerEmbalsesDTO`)
      .pipe(
        map((r: any) =>
         r.map((d: any) => ({
           id: d.idEmbalse,
           text: d.embalse,
           disabled: false
         }))
       ),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  } 

  obtenerEmbalsesPorFormato(formatoId : number, frecuenciaId : number) {
    return this.http
      .get<IEmbalceDTO[]>(`${CONFIG.WS_END_POINT}Embalse/obtenerPorFormato/` + formatoId + `/` + frecuenciaId)
      .pipe(
        map((r: any) =>
         r.map((d: any) => ({
           id: d.idEmbalse,
           text: d.embalse,
           disabled: false
         }))
       ),
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

   obtenerTipoArchivoColumna(id:number){
    return this.http
    .get<ITipoArchivoColumna[]>(`${CONFIG.WS_END_POINT}tipoArchivoColumna/obtenerPorIdDTO/`+id)
    .pipe(
      map((response) => response),
      catchError((e) => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    );
   }

   obtenerTipoArchivoCampo(id:number){
    return this.http
    .get<ITipoArchivoCampoDTO[]>(`${CONFIG.WS_END_POINT}tipoArchivoCampo/obtenerPorIdDTO/`+id)
    .pipe(
      map((response) => response),
      catchError((e) => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    );
   }

   crearArchivoDato(archivoDato:IArchivoDato[]){ 
    return this.http.post<boolean>(CONFIG.WS_END_POINT + 'archivoDato/creacionMasiva', archivoDato).pipe(
      catchError(e => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    );
   }

   crearArchivo(archivo:IArchivo): Observable<IArchivo>{ 
    return this.http.post<IArchivo>(CONFIG.WS_END_POINT + 'archivo/crear', archivo).pipe(
      catchError(e => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    );
   }

   obtenerArchivosDTO(){
    return this.http
    .get<IArchivoDTO[]>(`${CONFIG.WS_END_POINT}archivo/obtenerDTO/`)
    .pipe(
      map((response) => response),
      catchError((e) => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    );
   }

   obtenerArchivoDatosDTO(idArchivo:number){
    return this.http
    .get<IArchivoDatoDTO[]>(`${CONFIG.WS_END_POINT}archivoDato/obtenerDTO/`+idArchivo)
    .pipe(
      map((response) => response),
      catchError((e) => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    );
   }

   valorExistente(archivo:string){
    return this.http
    .get<boolean>(`${CONFIG.WS_END_POINT}archivo/valorExistente/`+archivo)
    .pipe(
      map((response) => response),
      catchError((e) => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    );
   }

   actualizarArchivo(archivoModel:IArchivo){
    return this.http
    .put<IArchivo>(CONFIG.WS_END_POINT + 'archivo/actualizar', archivoModel)
    .pipe(
      catchError((e) => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    );
   }

   obtenerFormatoConfigDTO(idFormato: number, idFrecuencia : number) {
    return this.http.get<FormatoConfigDTO>(CONFIG.WS_END_POINT + 'archivo/obtenerFormatoConfigDTO/' + idFormato + '/' + idFrecuencia)
    .pipe(
      catchError((e) => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    );
   }
}
