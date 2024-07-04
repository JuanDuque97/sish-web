import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { CONFIG } from 'src/app/common/utils/constantes';
import { HandlerExceptions } from 'src/app/common/utils/handlerexception';
import { Login, Usuario } from "src/app/modelo/seguridad/usuario";
import { catchError, map, timeout } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ServiciosAutenticacionService {

  constructor(private http: HttpClient) {
  }

  /**Autenticación */
  datosSesion(): Observable<any> {

    return this.http
    .get<string>(
      CONFIG.WS_END_POINT + 'datosSesion'
    ).pipe(
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
     );


  }


  autenticacion(login: Login): Observable<any> {

    return this.http
    .post<string>(
      CONFIG.WS_END_POINT + 'autenticacion',login
    ).pipe(
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
     );


  }


  /**Obtiene el usuario autenticado */
  obtenerUsuarioAutenticado(): Observable<Usuario> {
    return this.http
      .get<Usuario>(
        CONFIG.WS_END_POINT + 'autenticacion/obtenerUsuarioAutenticado'
      )
      .pipe(
        catchError((e) => {
         // HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  estaAutenticado(): boolean {
    var token = sessionStorage.token;

    if ( undefined==token || null==token ) {
      return false;
    }

    return sessionStorage.token.length > 2;
  }

  logout() {
   sessionStorage.clear();
  }
}
