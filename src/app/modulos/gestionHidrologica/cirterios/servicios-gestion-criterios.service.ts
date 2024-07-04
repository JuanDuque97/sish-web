import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CONFIG } from 'src/app/common/utils/constantes';
import { HandlerExceptions } from 'src/app/common/utils/handlerexception';
import { IPublicarIndormacion } from 'src/app/modelo/configuracion/publicarInformacion';  
import { IcriteriosAceptacion } from 'src/app/modelo/criteriosAceptacion/criterios-Aceptacion';

@Injectable({
  providedIn: 'root',
})
export class ServiciosCriteriosAceptacion {
  constructor(private http: HttpClient) {
    // Esto es intencional
  }

  crear(criteriosAceptacion: IcriteriosAceptacion): Observable<IcriteriosAceptacion> {
    return this.http
      .post<IcriteriosAceptacion>(
        CONFIG.WS_END_POINT + 'criteriosAceptacion/crear',
        criteriosAceptacion
      )
      .pipe(
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }
  actualizar(criteriosAceptacion: IcriteriosAceptacion): Observable<IcriteriosAceptacion> {
    return this.http
      .post<IcriteriosAceptacion>(
        CONFIG.WS_END_POINT + 'criteriosAceptacion/actualizar',
        criteriosAceptacion
      )
      .pipe(
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  obtener(): Observable<IcriteriosAceptacion[]> {
    return this.http
      .get<IcriteriosAceptacion[]>(`${CONFIG.WS_END_POINT}criteriosAceptacion/obtener`)
      .pipe(
        map((response) => response),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  } 
 
  obtenerPorId(id: number): Observable<IcriteriosAceptacion> {
    return this.http.get<IcriteriosAceptacion>(CONFIG.WS_END_POINT + 'criteriosAceptacion/obtenerPorId/' + id).pipe(
      catchError(e => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    );
  }

}
