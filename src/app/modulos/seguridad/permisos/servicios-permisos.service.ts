import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CONFIG } from 'src/app/common/utils/constantes';
import { HandlerExceptions } from 'src/app/common/utils/handlerexception';
import { IPermiso } from 'src/app/modelo/seguridad/permiso';

@Injectable({
  providedIn: 'root'
})

export class ServiciosPermisos {

  constructor(private http: HttpClient) { 
    
  }
  
  obtener(): Observable<IPermiso[]> {
    return this.http.get<IPermiso[]>(`${CONFIG.WS_END_POINT}permiso/obtener`)
      .pipe(
        map(
          (response) => response),
        catchError(e => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  obtenerPermisos(): Observable<IPermiso[]> {
    return this.http.get<IPermiso[]>(`${CONFIG.WS_END_POINT}permiso/obtenerPermisos`)
      .pipe(
        map(
          (response) => response),
        catchError(e => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  obtenerPorId(permisoId : number) {
    return this.http.get<IPermiso>(`${CONFIG.WS_END_POINT}permiso/obtenerPorId/` + permisoId)
      .pipe(
        map(
          (response) => response),
        catchError(e => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  obtenerDTOPorId(permisoId : number) {
    return this.http.get<IPermiso>(`${CONFIG.WS_END_POINT}permiso/obtenerDTOPorId/` + permisoId)
      .pipe(
        map(
          (response) => response),
        catchError(e => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  crear(parametro: IPermiso): Observable<IPermiso> {
    return this.http.post<IPermiso>(CONFIG.WS_END_POINT + 'permiso/crear', parametro).pipe(
      catchError(e => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    );
  }

  actualizar(parametro: IPermiso): Observable<IPermiso> {
    return this.http.post<IPermiso>(CONFIG.WS_END_POINT + 'permiso/actualizar', parametro).pipe(
      catchError(e => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    );
  }

  obtenerListaPermisos(): Observable<any[]> {
    return this.http.get<IPermiso[]>(`${CONFIG.WS_END_POINT}permiso/obtener`).pipe(
        map((r: any) => r.map((d: any) => (
          {
             [d.idPermiso]:d.permiso, 
        }
        ))
        ),
        catchError(e => {
            HandlerExceptions.validarExcepcionesHTTP(e);
            return throwError(e);
        })
    );
  }

  obtenerPermisosFaltantes(idRol : number) : Observable<any[]> {
    return this.http.get<IPermiso[]>(`${CONFIG.WS_END_POINT}permiso/obtenerPermisosFaltantes/` + idRol).pipe(
      map((r: any) => r.map((d: any) => (
        {
           [d.idPermiso]:d.permiso, 
      }
      ))
      ),
      catchError(e => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
      })
  );
  }
}
