import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CONFIG } from 'src/app/common/utils/constantes';
import { HandlerExceptions } from 'src/app/common/utils/handlerexception'; 
import { IEstacion, IEstacionDTO, IFiltrosEstacion } from 'src/app/modelo/configuracion/estacion'; 
import Swal from 'sweetalert2';
@Injectable({
  providedIn: 'root'
})
export class ServiciosEstacionesService {
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

  obtenerPorId(id: number): Observable<any> {
    return this.http.get<IEstacion>(CONFIG.WS_END_POINT + 'estacion/obtenerPorId/' + id).pipe(
      catchError(e => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    );
  }

  obtenerEstaciones(): Observable<IEstacionDTO[]> {
    return this.http.get<IEstacionDTO[]>(`${CONFIG.WS_END_POINT}estacion/obtenerDTO`)
      .pipe(
        map(
          (response) => response),
        catchError(e => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  obtenerEstacionDTOPorId(id : number): Observable<IEstacionDTO> {
    return this.http.get<IEstacionDTO>(`${CONFIG.WS_END_POINT}estacion/obtenerDTOPorId/` + id)
      .pipe(
        map(
          (response) => response),
        catchError(e => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  crear(estacion: IEstacion): Observable<IEstacion> {
    return this.http.post<IEstacion>(CONFIG.WS_END_POINT + 'estacion/crear', estacion).pipe(
      catchError((e) => {
        if(e.ok === false){
          this.toast.fire({
            icon: 'error',
            title:
              'El nombre de la estación o el código ya esta registrados!',
          });
          return throwError(e.ok);
        }else{
          HandlerExceptions.validarExcepcionesHTTP(e);
         
          return throwError(e);
        }
      })
    );
    
  }

  actualizar(estacion: IEstacion): Observable<IEstacion> {
    return this.http.post<IEstacion>(CONFIG.WS_END_POINT + 'estacion/actualizar', estacion).pipe(
      catchError(e => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    );
  }

  obtenerEstacionesPorCodigoParametros(filtros: IFiltrosEstacion): Observable<IEstacionDTO[]> {
    return this.http.post<IEstacionDTO[]>(CONFIG.WS_END_POINT + 'estacion/obtenerPorCodigoParametros', filtros).pipe(
      map((response) => response),
      catchError(e => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    );
  }
}
