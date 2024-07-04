
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CONFIG } from 'src/app/common/utils/constantes';
import { HandlerExceptions } from 'src/app/common/utils/handlerexception';   
import { IArchivoCampo, IArchivoCampoDTO } from '../../../modelo/tipoArchivos/archivoCampos';

@Injectable({
  providedIn: 'root'
})
export class ServiciosArchivoCampos {

  constructor(private http: HttpClient) { 
    // Esto es intencional
  }
  
  obtener(): Observable<IArchivoCampo[]> {

    return this.http.get<IArchivoCampo[]>(`${CONFIG.WS_END_POINT}tipoArchivoCampo/obtener`)
      .pipe(
        map(
          (response) => response),
        catchError(e => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }
  obtenerDTO (id: number):  Observable<IArchivoCampoDTO[]> {
    return this.http.get<IArchivoCampoDTO[]>(`${CONFIG.WS_END_POINT}tipoArchivoCampo/obtenerPorIdDTO/`+ id).pipe(
        map(
          (response) => response),
        catchError(e => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  actualizar(archivosConfigurados: IArchivoCampo): Observable<IArchivoCampo> { 
    return this.http.post<IArchivoCampo>(CONFIG.WS_END_POINT + 'tipoArchivoCampo/actualizar', archivosConfigurados).pipe(
      catchError(e => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    );
  }

 
  obtenerPorId(id: number): Observable<IArchivoCampo> {
    return this.http.get<IArchivoCampo>(CONFIG.WS_END_POINT + 'tipoArchivoCampo/obtenerPorId/' + id).pipe(
      catchError(e => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    );
  }

  crear(archivosConfigurados: IArchivoCampo): Observable<IArchivoCampo> {
    return this.http.post<IArchivoCampo>(CONFIG.WS_END_POINT + 'tipoArchivoCampo/crear', archivosConfigurados).pipe(
      catchError(e => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    );
  }

  eliminar(id: number): Observable<IArchivoCampo> {
    return this.http
      .post<IArchivoCampo>(
        CONFIG.WS_END_POINT + 'tipoArchivoCampo/eliminar/' + id,null      
      )
      .pipe(
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }


}
