import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { CONFIG } from 'src/app/common/utils/constantes';
import { HandlerExceptions } from 'src/app/common/utils/handlerexception'; 
import { catchError, map } from 'rxjs/operators';
import { IMolinete,Ihelice, IMolineteDTO } from 'src/app/modelo/configuracion/molinete'; 
import { IarchivoMolinete } from '../../../../modelo/configuracion/molinete';

@Injectable({
  providedIn: 'root'
})
export class ServiciosMolineteService {
  constructor(private http: HttpClient) {
    //Esto es intencional
  }

 /**Obtiene la lista de todos los molinetes */
  obtener(): Observable<IMolinete[]> {  
    return this.http.get<any>(`${CONFIG.WS_END_POINT}molinete/obtener`)
      .pipe(
        map((response) => response),
        catchError(e => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }
 /**Obtiene la lista de todos los molinetes */
  obtenerDTO(): Observable<IMolineteDTO[]> {  
    return this.http.get<any>(`${CONFIG.WS_END_POINT}molinete/obtenerDTO`)
      .pipe(
        map((response) => response),
        catchError(e => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

   
  /**Obtiene un molinete por identificador */
  obtenerPorId(id: number): Observable<any> {
    return this.http.get<IMolinete>(CONFIG.WS_END_POINT + 'molinete/obtenerPorId/' + id).pipe(
      catchError(e => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    );
  }
  /**Obtiene un molinete por identificador */
  obtenerPorIdtipo(id: number): Observable<any> {
    return this.http.get<IMolinete>(CONFIG.WS_END_POINT + 'molinete/obtenerPorIdtipoHelice/' + id)
      .pipe(
        map((r: any) =>
        r.map((d: IMolinete) => ({
          id:d.idhelice,
          text:d.marca+"-"+d.serie+"-"+d.serieHelice,
        }))
      ),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  
  /**Crea un molinete */
  crear(molinete: IMolinete): Observable<IMolinete> {
       
    return this.http.post<IMolinete>(CONFIG.WS_END_POINT + 'molinete/crear', molinete).pipe(
      catchError(e => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    );
  }

  /**Actualizar un molinete */
  actualizar(molinete: IMolinete): Observable<IMolinete> { 
    return this.http.post<IMolinete>(CONFIG.WS_END_POINT + 'molinete/actualizar', molinete).pipe(
      catchError(e => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    );
  }
  /**actualizarEstado un molinete */
  actualizarEstado(estado:any,idmolinete: any)  { 
    return this.http.post(CONFIG.WS_END_POINT + "molinete/actualizarEstado?estado="+estado+"&idMolinete="+idmolinete,0).pipe(
      catchError(e => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    );
  }
    

    /**Crea un Helice */  
    crearHelice(
      Ihelices:Ihelice[]
    ): Observable<Ihelice[]> {
      return this.http
        .post<Ihelice[]>(
          CONFIG.WS_END_POINT + 'helice/crearDTO',
          Ihelices
        )
        .pipe(
          catchError((e) => {
            HandlerExceptions.validarExcepcionesHTTP(e);
            return throwError(e);
          })
        );
    }

    obtenerHelicePorId(id: number): Observable<any> {
      return this.http.get<Ihelice>(CONFIG.WS_END_POINT + 'helice/obtenerDTOPorIdMolinete/' + id).pipe(
        catchError(e => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
    }
    
    eliminarHelicePorId(id: number): Observable<any> {
      return this.http.get<IMolinete>(CONFIG.WS_END_POINT + 'helice/eliminacionMasiva/' + id).pipe(
        catchError(e => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
    }
    actualizarHelice(helice: Ihelice[]): Observable<Ihelice[]> { 
      return this.http.post<Ihelice[]>(CONFIG.WS_END_POINT + 'helice/actualizarDTO', helice).pipe(
        catchError(e => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
    }

    //  archivos 


    crearArchivo( Iarchivo:IarchivoMolinete): Observable<IarchivoMolinete> {
      return this.http
        .post<IarchivoMolinete>(
          CONFIG.WS_END_POINT + 'molineteArchivo/crear',
          Iarchivo
        )
        .pipe(
          catchError((e) => {
            HandlerExceptions.validarExcepcionesHTTP(e);
            return throwError(e);
          })
        );
    }
     

    obtenerPorIdArchivo(id: number): Observable<any> {
      return this.http.get<IMolinete>(CONFIG.WS_END_POINT + 'molineteArchivo/obtenerPorId/' + id).pipe(
        catchError(e => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
    }


    actualizarArchivo(
      Iarchivo:IarchivoMolinete
    ): Observable<IarchivoMolinete> {
      return this.http
        .post<IarchivoMolinete>(
          CONFIG.WS_END_POINT + 'molineteArchivo/actualizar',
          Iarchivo
        )
        .pipe(
          catchError((e) => {
            HandlerExceptions.validarExcepcionesHTTP(e);
            return throwError(e);
          })
        );
    }

  
  
}
