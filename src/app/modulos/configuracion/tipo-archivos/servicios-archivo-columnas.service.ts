import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CONFIG } from 'src/app/common/utils/constantes';
import { HandlerExceptions } from 'src/app/common/utils/handlerexception';
import { IArchivoColumna } from 'src/app/modelo/tipoArchivos/archivoColumna';
import { IArchivoColumnaDTO } from '../../../modelo/tipoArchivos/archivoColumna';

@Injectable({
  providedIn: 'root',
})
export class ServiciosArchivoColumnas {
  constructor(private http: HttpClient) {
    // Esto es intencional
  }

  obtener(): Observable<IArchivoColumna[]> {
    return this.http
      .get<IArchivoColumna[]>(
        `${CONFIG.WS_END_POINT}tipoArchivoColumna/obtener`
      )
      .pipe(
        map((response) => response),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }
  obtenerDTO(id: number): Observable<IArchivoColumnaDTO[]> {
    return this.http
      .get<IArchivoColumnaDTO[]>(
        `${CONFIG.WS_END_POINT}tipoArchivoColumna/obtenerPorIdDTO/` + id
      )
      .pipe(
        map((response) => response),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  actualizar(
    archivosConfigurados: IArchivoColumna
  ): Observable<IArchivoColumna> {
    return this.http
      .post<IArchivoColumna>(
        CONFIG.WS_END_POINT + 'tipoArchivoColumna/actualizar',
        archivosConfigurados
      )
      .pipe(
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  obtenerPorId(id: number): Observable<IArchivoColumna> {
    return this.http
      .get<IArchivoColumna>(
        CONFIG.WS_END_POINT + 'tipoArchivoColumna/obtenerPorId/' + id
      )
      .pipe(
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  crear(archivosConfigurados: IArchivoColumna): Observable<IArchivoColumna> {
    return this.http
      .post<IArchivoColumna>(
        CONFIG.WS_END_POINT + 'tipoArchivoColumna/crear',
        archivosConfigurados
      )
      .pipe(
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  eliminar(id: number): Observable<IArchivoColumna> {
    return this.http
      .post<IArchivoColumna>(
        CONFIG.WS_END_POINT + 'tipoArchivoColumna/eliminar/' + id,
        null
      )
      .pipe(
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  obtenerColumnasSelect2(id: number): Observable<IArchivoColumnaDTO[]> {
    return this.http
      .get<IArchivoColumnaDTO[]>(
        `${CONFIG.WS_END_POINT}tipoArchivoColumna/obtenerPorIdDTO/` + id
      )
      .pipe(
        map((r: any) =>
          r.map((d: IArchivoColumnaDTO) => ({
            id: d.idTipoArchivoColumna,
            text: d.tipoArchivoColumna,
          }))
        ),

        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }
}
