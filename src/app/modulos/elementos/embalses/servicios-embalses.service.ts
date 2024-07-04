import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CONFIG } from 'src/app/common/utils/constantes';
import { HandlerExceptions } from 'src/app/common/utils/handlerexception';
import { IDepartamento } from 'src/app/modelo/configuracion/departamento';
import { IMunicipio } from 'src/app/modelo/configuracion/municipio';
import { IEmbalce, IEmbalceDTO } from '../../../modelo/configuracion/embalce';
import Swal from 'sweetalert2';


@Injectable({
  providedIn: 'root',
})
export class ServiciosEmbalcesService { 
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
  constructor(private http: HttpClient) {
    // Esto es intencional
  }
  


  obtener(): Observable<IEmbalce[]> {
    return this.http
      .get<IEmbalce[]>(`${CONFIG.WS_END_POINT}Embalse/obtenerEembalses`)
      .pipe(
        map((response) => response),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  } 
  obtenerPorId(id: number): Observable<IEmbalce> {
    return this.http.get<IEmbalce>(CONFIG.WS_END_POINT + 'Embalse/obtenerPorId/' + id).pipe(
      catchError(e => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    );
  }

  obtenerEembalsesDTO(): Observable<IEmbalceDTO[]> {
    return this.http
      .get<IEmbalceDTO[]>(`${CONFIG.WS_END_POINT}Embalse/obtenerEmbalsesDTO`)
      .pipe(
        map((response) => response),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  } 

  crear(
    embalce: IEmbalce
  ): Observable<IEmbalce> {
    return this.http
      .post<IEmbalce>(
        CONFIG.WS_END_POINT + 'Embalse/crear',
        embalce
      )
      .pipe(
        catchError((e) => {
          if(e.ok === false){
            this.toast.fire({
              icon: 'error',
              title:
                'El nombre de la embalse o el código ya esta registrados!',
            });
            return throwError(e.ok);
          }else{
            HandlerExceptions.validarExcepcionesHTTP(e);
           
            return throwError(e);
          }
        })
      );
      
    }

  actualizar(embalce: IEmbalce): Observable<IEmbalce> { 
    return this.http
      .post<IEmbalce>(CONFIG.WS_END_POINT + 'Embalse/actualizar', embalce)
      .pipe(
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }
 
  

}
