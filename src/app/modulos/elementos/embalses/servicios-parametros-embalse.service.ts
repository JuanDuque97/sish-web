import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CONFIG } from 'src/app/common/utils/constantes';
import { HandlerExceptions } from 'src/app/common/utils/handlerexception';
import { IParametro } from 'src/app/modelo/configuracion/parametro';
import { IParametrosEmbalse } from '../../../modelo/configuracion/embalce';
import Swal from 'sweetalert2';
@Injectable({
  providedIn: 'root',
})
export class ServiciosParametrosEmbalseService {

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
  constructor(private http: HttpClient) { }

  /**Crea un parametrosEmbalse */
  crear(parametrosEmbalse: IParametrosEmbalse): Observable<IParametrosEmbalse> {
    return this.http
      .post<IParametrosEmbalse>(
        CONFIG.WS_END_POINT + 'parametroXEmbalse/crear',
        parametrosEmbalse
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

  eliminar(id: number): Observable<IParametrosEmbalse> {
    return this.http
      .post<IParametrosEmbalse>(
        CONFIG.WS_END_POINT + 'parametroXEmbalse/eliminar/' + id, null
      )
      .pipe(
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  /**Obtiene la lista de todos los parametroXEmbalse */
  obtener(): Observable<IParametrosEmbalse[]> {
    return this.http
      .get<IParametrosEmbalse[]>(`${CONFIG.WS_END_POINT}parametroXEmbalse/obtener`)
      .pipe(
        map((response) => response),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  /**Obtiene un parametrosEmbalse por identificador */
  obtenerListaParametrosXEmbalse(id: number): Observable<IParametrosEmbalse[]> {
    return this.http
      .get<IParametrosEmbalse[]>(
        CONFIG.WS_END_POINT + 'parametroXEmbalse/obtenerDTO/' + id
      )
      .pipe(
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
  
  /**Actualizar un parametrosEmbalse */
  actualizar(parametrosEmbalse: IParametrosEmbalse): Observable<IParametrosEmbalse> {
    return this.http
      .post<IParametrosEmbalse>(CONFIG.WS_END_POINT + 'parametroXEmbalse/actualizar', parametrosEmbalse)
      .pipe(
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }
}
