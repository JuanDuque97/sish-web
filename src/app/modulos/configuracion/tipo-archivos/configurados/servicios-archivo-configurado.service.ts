
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CONFIG } from 'src/app/common/utils/constantes';
import { HandlerExceptions } from 'src/app/common/utils/handlerexception'; 
import { IArchivosConfigurados } from 'src/app/modelo/tipoArchivos/archivosConfigurados';
import { IArchivosConfiguradosDTO } from '../../../../modelo/tipoArchivos/archivosConfigurados';

@Injectable({
  providedIn: 'root'
})
export class ServiciosArchivoConfigurado {

  constructor(private http: HttpClient) { 
    // Esto es intencional
  }
  
  obtener(): Observable<IArchivosConfigurados[]> {

    return this.http.get<IArchivosConfigurados[]>(`${CONFIG.WS_END_POINT}tipoArchivoConfigurado/obtener`)
      .pipe(
        map(
          (response) => response),
        catchError(e => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }
  obtenerDTO(): Observable<IArchivosConfiguradosDTO[]> {

    return this.http.get<IArchivosConfiguradosDTO[]>(`${CONFIG.WS_END_POINT}tipoArchivoConfigurado/obtenerTipoArchivoConfiguradoDTO`)
      .pipe(
        map(
          (response) => response),
        catchError(e => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  actualizar(archivosConfigurados: IArchivosConfigurados): Observable<IArchivosConfigurados> { 
    return this.http.post<IArchivosConfigurados>(CONFIG.WS_END_POINT + 'tipoArchivoConfigurado/actualizar', archivosConfigurados).pipe(
      catchError(e => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    );
  }

 
  obtenerPorId(id: number): Observable<IArchivosConfigurados> {
    return this.http.get<IArchivosConfigurados>(CONFIG.WS_END_POINT + 'tipoArchivoConfigurado/obtenerPorId/' + id).pipe(
      catchError(e => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    );
  }

  crear(archivosConfigurados: IArchivosConfigurados): Observable<IArchivosConfigurados> {
    return this.http.post<IArchivosConfigurados>(CONFIG.WS_END_POINT + 'tipoArchivoConfigurado/crear', archivosConfigurados).pipe(
      catchError(e => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    );
  }


}
