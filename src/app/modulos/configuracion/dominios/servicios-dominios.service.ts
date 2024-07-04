import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { CONFIG } from 'src/app/common/utils/constantes';
import { HandlerExceptions } from 'src/app/common/utils/handlerexception';
import { IDominio } from 'src/app/modelo/configuracion/dominio';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ServiciosDominiosService {
  constructor(private http: HttpClient) {
    //Esto es intencional
  }

 /**Obtiene la lista de todos los dominios */
  obtener(): Observable<IDominio[]> {  
    return this.http.get<any>(`${CONFIG.WS_END_POINT}dominio/obtener`)
      .pipe(
        map((response) => response),
        catchError(e => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  /**Obtiene un dominio por identificador */
  obtenerPorId(id: number): Observable<any> {
    return this.http.get<IDominio>(CONFIG.WS_END_POINT + 'dominio/obtenerPorId/' + id).pipe(
      catchError(e => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    );
  }

  /**Crea un dominio */
  crear(dominio: IDominio): Observable<IDominio> {
    const payLoad = { data: dominio };    
    return this.http.post<IDominio>(CONFIG.WS_END_POINT + 'dominio/crear', payLoad).pipe(
      catchError(e => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    );
  }

  /**Actualizar un dominio */
  actualizar(dominio: IDominio): Observable<IDominio> { 
    return this.http.post<IDominio>(CONFIG.WS_END_POINT + 'dominio/actualizar', dominio).pipe(
      catchError(e => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    );
  }
    
}
