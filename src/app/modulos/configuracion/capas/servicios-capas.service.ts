import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { CONFIG } from 'src/app/common/utils/constantes';
import { HandlerExceptions } from 'src/app/common/utils/handlerexception';
import { catchError, map } from 'rxjs/operators';
import { ICapa } from '../../../modelo/configuracion/capa';
import { loadModules } from 'esri-loader';

@Injectable({
  providedIn: 'root',
})
export class ServiciosCapasService {
  httpHeaders = new HttpHeaders({ "Content-Type": "application/json" });
  constructor(private http: HttpClient) {
    //Esto es intencional
  }

  /**Obtiene la lista de todos los dominios */
  obtener(): Observable<ICapa[]> {
    return this.http.get<any>(`${CONFIG.WS_END_POINT}capa/obtener`).pipe(
      map((response) => response),
      catchError((e) => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    );
  }

  /**Obtiene un dominio por identificador */
   obtenerPorId(id: number): Observable<any> { 
    return this.http
      .get<ICapa>(CONFIG.WS_END_POINT + 'capa/obtenerPorId/' + id) 
      .pipe(
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  /**Actualizar un dominio */
  actualizar(capa: ICapa): Observable<ICapa> {
    return this.http
      .post<ICapa>(CONFIG.WS_END_POINT + 'capa/actualizar', capa)
      .pipe(
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  /***************+
   
  map((r: ICapa) =>{

         let url = r.urlConsulta + '?where='+filtro + '&outFields='+ campos + '&returnGeometry=false&f=json'
          console.log("yyyy",url)
          return this.http
          .get<any>(
            url
          ).pipe(
/ *             map((response:any) => {
              console.log("wwwwwww",response)
              return response
            }), * /
            catchError((e:any) => {
              console.log("visualizarCapa 1", e)
              //HandlerExceptions.validarExcepcionesHTTP(e);
              return throwError(e);
            })
          )
        }     

        ),

        catchError((e:any) => {
          console.log("visualizarCapa 2", e)
          //HandlerExceptions.validarExcepcionesHTTP(e);
   
   */

  async consultarConfiguracionCapa(id: number) {
    let respuesta: any;
    await this.http
      .get<ICapa>(CONFIG.WS_END_POINT + 'capa/obtenerPorId/' + id)
      .toPromise()
      .then((r: ICapa) => {
        console.log('R', r);
        respuesta = r;
      })
      .catch((e: any) => {
        return throwError(e);
      });
      return respuesta;
  }

  /*getData(): Observable<any> {
    return new Observable(subscriber => {
        this.http.get(url)
          .pipe(catchError(this.handleError)
          .subscribe(res => {
              // Do my service.ts logic.
              // ...
              subscriber.next(res)
              subscriber.complete()
          }, err => subscriber.error(err))
    })
}*/

  /**Llama al servicio de visualizar una capa */
  consultarCapa(id: number, filtro: string, campos: string): Observable<any> {

    return new Observable(subscriber => {
    this.http
      .get<ICapa>(CONFIG.WS_END_POINT + 'capa/obtenerPorId/' + id)
      .subscribe((r:any)=>{
        let url =
      r.urlConsulta +
      '?where=' +
      filtro +
      '&outFields=' +
      campos +
      '&returnGeometry=false&f=json';
      
      let s = this.http.get<any>(url).pipe(
        catchError((e: any) => {
          console.log('visualizarCapa 1 error', e);
          //HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        }));

        subscriber.next(s);
        subscriber.complete();
      }, err => subscriber.error(err));
    });
    /*
    this.consultarConfiguracionCapa(id);
    let capa = this.consultarConfiguracionCapa(id);
    capa.then((r:any)=>{
      let url =
      r.urlConsulta +
      '?where=' +
      filtro +
      '&outFields=' +
      campos +
      '&returnGeometry=false&f=json';
    return this.http.get<any>(url).pipe(
      map((c: any) => {
        return c;
      }),
      catchError((e: any) => {
        console.log('visualizarCapa 1', e);
        //HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    );
    })*/
    
  }


  consultarCapaNew(urlConsulta: string, filtro:string, campos:string): Observable<any> {

    let url = urlConsulta + '?where='+filtro + '&outFields='+ campos + '&returnGeometry=false&f=json'
    console.log("yyyy",url)
    return this.http
    .get<any>(
      url, {
        headers: this.httpHeaders,
      }
    ).pipe(
      catchError(e => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    )

  }

}
