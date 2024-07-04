import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CONFIG } from 'src/app/common/utils/constantes';
import { HandlerExceptions } from 'src/app/common/utils/handlerexception';
import { IParametro } from 'src/app/modelo/configuracion/parametro';
import { IParametrosPozos } from '../../../modelo/configuracion/pozo';
import Swal from 'sweetalert2';
@Injectable({
  providedIn: 'root',
})
export class ServiciosParametrosPozosService {
  private toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
  });
  constructor(private http: HttpClient) {}

  /**Crea un parametrosPozos */
  crear(parametrosPozos: IParametrosPozos): Observable<IParametrosPozos> {
    return this.http
      .post<IParametrosPozos>(
        CONFIG.WS_END_POINT + 'parametroXPozo/crear',
        parametrosPozos
      )
      .pipe(
        catchError((e) => {
          if(e.ok === false){
            this.toast.fire({
              icon: 'error',
              title:
                'El parametro ya esta asociado!',
            });
            return throwError(e.ok);
          }else{
            HandlerExceptions.validarExcepcionesHTTP(e);
           
            return throwError(e);
          }
        })
      );
  }

  eliminar(id: number): Observable<IParametrosPozos> {
    return this.http
      .post<IParametrosPozos>(
        CONFIG.WS_END_POINT + 'parametroXPozo/eliminar/' + id,
        null
      )
      .pipe(
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  /**Obtiene la lista de todos los parametroXPozo */
  obtener(): Observable<IParametrosPozos[]> {
    return this.http
      .get<IParametrosPozos[]>(`${CONFIG.WS_END_POINT}parametroXPozo/obtener`)
      .pipe(
        map((response) => response),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  /**Obtiene un parametrosPozos por identificador */
  obtenerListaParametrosXPozo(id: number): Observable<IParametrosPozos[]> {
    return this.http
      .get<IParametrosPozos[]>(
        CONFIG.WS_END_POINT + 'parametroXPozo/obtenerDTO/' + id
      ).pipe(
        map((response) => response),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
       
  }

  obtenerListaParametros(): Observable<any[]> {
    return this.http
      .get<IParametro[]>(`${CONFIG.WS_END_POINT}parametros/obtener`)
      .pipe(
        map((r: any) =>
          r.map((d: any) => ({
            [d.idParametro]: d.descripcion,
          }))
        ),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  /**Actualizar un parametrosPozos */
  actualizar(parametrosPozos: IParametrosPozos): Observable<IParametrosPozos> {
    return this.http
      .post<IParametrosPozos>(
        CONFIG.WS_END_POINT + 'parametroXPozo/actualizar',
        parametrosPozos
      )
      .pipe(
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }
}
