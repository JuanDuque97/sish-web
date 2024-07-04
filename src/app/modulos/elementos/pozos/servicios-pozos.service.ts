import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CONFIG } from 'src/app/common/utils/constantes';
import { HandlerExceptions } from 'src/app/common/utils/handlerexception'; 
import { IDepartamento } from 'src/app/modelo/configuracion/departamento';
import { IMunicipio } from 'src/app/modelo/configuracion/municipio';
import { IPozos, IPozosDTO } from 'src/app/modelo/configuracion/pozo';
import Swal from 'sweetalert2';
@Injectable({
  providedIn: 'root'
})
export class ServiciosPozosService {
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
  


  obtener(): Observable<IPozos[]> {
    return this.http
      .get<IPozos[]>(`${CONFIG.WS_END_POINT}pozo/obtenerPozos`)
      .pipe(
        map((response) => response),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  } 
  obtenerPorId(id: number): Observable<IPozos> {
    return this.http.get<IPozos>(CONFIG.WS_END_POINT + 'pozo/obtenerPorId/' + id).pipe(
      catchError(e => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    );
  }

  obtenerPozosDTO(): Observable<IPozosDTO[]> {
    return this.http 
      .get<IPozosDTO[]>(`${CONFIG.WS_END_POINT}pozo/obtenerPozosDTO`)
      .pipe(
        map((response) => response),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  } 

  crear(
    IPozos: IPozos
  ): Observable<IPozos> {
    return this.http
      .post<IPozos>(
        CONFIG.WS_END_POINT + 'pozo/crear',
        IPozos
      )
      .pipe(
        catchError((e) => {
          if(e.ok === false){
            this.toast.fire({
              icon: 'error',
              title:
                'El nombre del pozo  o el código ya esta registrados!',
            });
            return throwError(e.ok);
          }else{
            HandlerExceptions.validarExcepcionesHTTP(e);
           
            return throwError(e);
          }
        })
      );
      
    }

  actualizar(IPozos: IPozos): Observable<IPozos> { 
    return this.http
      .post<IPozos>(CONFIG.WS_END_POINT + 'pozo/actualizar', IPozos)
      .pipe(
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }
  
  obtenerMunicipioPorId(id: number): Observable<any> {
    return this.http
      .get<IMunicipio>(
        CONFIG.WS_END_POINT + 'municipio/obtenerPorIdMunicipio/' + id
      )
      .pipe(
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  obtenerMunicipiosPorIdDepartamento(id: number): Observable<any> {
    return this.http
      .get<IMunicipio>(
        CONFIG.WS_END_POINT + 'municipio/obtenerPorIdDepartamento/' + id 
      )
      .pipe(
        map((r: any) =>
          r.map((d: IMunicipio) => ({
            id: d.idMunicipio,
            text: d.municipio,
            disabled: false
          }))
        ),

        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  obtenerDepartamentos(): Observable<any> {
    return this.http
      .get<IDepartamento>(
        CONFIG.WS_END_POINT + 'departamento/obtenerDepartamento' 
      )
      .pipe(
        map((r: any) =>
          r.map((d: IDepartamento) => ({
            id: d.idDepartamento,
            text: d.departamento,
            disabled: false
          }))
        ),

        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }



}
