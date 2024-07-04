import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CONFIG } from 'src/app/common/utils/constantes';
import { HandlerExceptions } from 'src/app/common/utils/handlerexception';
import {
  IMetodoTipoParametro,
  IParametro,
  IParametroDto,
} from 'src/app/modelo/configuracion/parametro';
import { IRol } from 'src/app/modelo/seguridad/rol';

@Injectable({
  providedIn: 'root',
})
export class ServiciosMetodoXtipoParametroService {
  actualizar(parametro: IParametro): Observable<IParametro> {
    console.log('Actualizar ', parametro);
    return this.http
      .post<IParametro>(CONFIG.WS_END_POINT + 'parametros/actualizar', parametro)
      .pipe(
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  constructor(private http: HttpClient) {
    // Esto es intencional
  }

  obtener(): Observable<IParametro[]> {
    return this.http
      .get<IParametro[]>(`${CONFIG.WS_END_POINT}parametros/obtener`)
      .pipe(
        map((response) => response),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  obtenertipoParametros(id: number): Observable<IMetodoTipoParametro> {
    return this.http
      .get<IMetodoTipoParametro>(
        CONFIG.WS_END_POINT +
          'metodoXtipoParametro/obtenerDTO/' +
          id
      )
      .pipe(
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  eliminaripoParametros(id: number): Observable<any> {


    return this.http
      .post<IMetodoTipoParametro>(  CONFIG.WS_END_POINT +  'metodoXtipoParametro/eliminar/' + id ,0  )
      .pipe(
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }
 

  

  crear(
    metodoTipoParametro: IMetodoTipoParametro
  ): Observable<IMetodoTipoParametro> {
    return this.http
      .post<IMetodoTipoParametro>(
        CONFIG.WS_END_POINT + 'metodoXtipoParametro/crear',
        metodoTipoParametro
      )
      .pipe(
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  // Obtener Lista Parametros
  obtenerListaParametros(): Observable<IParametroDto[]> {
    return this.http
      .get<IParametroDto[]>(
        `${CONFIG.WS_END_POINT}parametros/obtenerListaParametros`
      )
      .pipe(
        map((response) => response),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  obtenerValoresParametros(): Observable<any[]> {
    return this.http
      .get<IParametro[]>(`${CONFIG.WS_END_POINT}parametros/obtener`)
      .pipe(
        map((r: any) =>
          r.map((d: any) => ({
            [d.idParametro]: d.parametro,
          }))
        ),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }
}
