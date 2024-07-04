import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CONFIG } from 'src/app/common/utils/constantes';
import { HandlerExceptions } from 'src/app/common/utils/handlerexception';     
import { IPublicarIndormacion } from 'src/app/modelo/configuracion/publicarInformacion';

@Injectable({
  providedIn: 'root'
})
export class ServiciosPublicarInformacionService {

  constructor(private http: HttpClient) {
    // Esto es intencional
  } 
   
  obtenerDTO(IObservacionesConsulta: IPublicarIndormacion): Observable<IPublicarIndormacion> { 
    return this.http
      .post<IPublicarIndormacion>(CONFIG.WS_END_POINT + 'tablaControl/obtenetDTO', IObservacionesConsulta)
      .pipe(
        map((response) => response),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }
  obtenerPromedio(IObservacionesConsulta: IPublicarIndormacion): Observable<IPublicarIndormacion> { 
    return this.http
      .post<IPublicarIndormacion>(CONFIG.WS_END_POINT + 'tablaControl/obtenetDTOPromedio', IObservacionesConsulta)
      .pipe(
        map((response) => response),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }
  obtenetDTOFechas(IObservacionesConsulta: IPublicarIndormacion): Observable<IPublicarIndormacion> { 
    return this.http
      .post<IPublicarIndormacion>(CONFIG.WS_END_POINT + 'tablaControl/obtenetDTOFechas', IObservacionesConsulta)
      .pipe(
        map((response) => response),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

 

}
