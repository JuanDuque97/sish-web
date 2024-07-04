import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CONFIG } from 'src/app/common/utils/constantes';
import { HandlerExceptions } from 'src/app/common/utils/handlerexception';   
import { IValorParametroXCriterio } from 'src/app/modelo/configuracion/criterioValidacion';
import { IinventarioElementos, IrequesInventario } from 'src/app/modelo/observaciones/inventarioElementos';
import { IObservacionesConsulta } from 'src/app/modelo/observaciones/observacionesConsulta';
import { IValorConsultaOXP } from 'src/app/modelo/observaciones/valorObservacionXparaemtro';
import { IAfotoCantidad } from 'src/app/modelo/configuracion/aforo';
import { IValorConsulta } from 'src/app/modelo/observaciones/valorObservacion';
import { IautoCompletado ,IautoCompletadoDatos } from 'src/app/modelo/observaciones/autocompletado';
import Swal from 'sweetalert2';
import { IObservacionesEstacion, ICargueEstacionRespuesta } from 'src/app/modelo/observaciones/observacionesEstacion';
import { IObservacionesEstacionDTO } from '../../modelo/observaciones/observacionesEstacion';

@Injectable({
  providedIn: 'root'
})
export class ServiciosObservacionesEstacionService {
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
  obtener(): Observable<IObservacionesEstacion[]> {
    return this.http
      .get<IObservacionesEstacion[]>(`${CONFIG.WS_END_POINT}OXEstacionInicial/obtener`)
      .pipe(
        map((response) => response),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  } 
  obtenerPorId(id: number): Observable<IObservacionesEstacion> {
    return this.http.get<IObservacionesEstacion>(CONFIG.WS_END_POINT + 'OXEstacionInicial/obtenerPorId/' + id)
    .pipe(
      map((response) => response),
      catchError(e => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    );
  }
  obtenerPorIdDTO(id: number): Observable<IObservacionesEstacionDTO> {
    return this.http.get<IObservacionesEstacionDTO>(CONFIG.WS_END_POINT + 'OXEstacionInicial/obtenerDTOById/' + id)
    .pipe(
      map((response) => response),
      catchError(e => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    );
  }
  
  obtenerDTO(IObservacionesConsulta: IObservacionesConsulta): Observable<IObservacionesConsulta> { 
    return this.http
      .post<IObservacionesConsulta>(CONFIG.WS_END_POINT + 'OXEstacionInicial/obtenerDTO', IObservacionesConsulta)
      .pipe(
        map((response) => response),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }
  seriemixtavalor(IObservacionesConsulta: IObservacionesConsulta): Observable<IValorConsultaOXP> { 
    return this.http
      .post<IValorConsultaOXP>(CONFIG.WS_END_POINT + 'OXEstacionInicial/seriemixtavalor', IObservacionesConsulta)
      .pipe(
        map((response) => response),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  seriemixtavalorCorrelacion(IObservacionesConsulta: IObservacionesConsulta): Observable<IValorConsultaOXP> { 
    return this.http
      .post<IValorConsultaOXP>(CONFIG.WS_END_POINT + 'OXEstacionInicial/seriemixtavalorCorrelacion', IObservacionesConsulta)
      .pipe(
        map((response) => response),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  cantidad(IObservacionesConsulta: IObservacionesConsulta): Observable<IAfotoCantidad> { 
    return this.http
      .post<IAfotoCantidad>(CONFIG.WS_END_POINT + 'analisis/cantidad-obervaciones-id-fecha', IObservacionesConsulta)
      .pipe(
        map((response) => response),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }
  
  cantidadEstado(IObservacionesConsulta: IObservacionesConsulta): Observable<IAfotoCantidad> { 
    return this.http
      .post<IAfotoCantidad>(CONFIG.WS_END_POINT + 'analisis/cantidad-obervaciones-id-estado', IObservacionesConsulta)
      .pipe(
        map((response) => response),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }
  autocompletadoDatos(IObservacionesConsulta: IObservacionesConsulta): Observable<IautoCompletado> { 
    return this.http
      .post<IautoCompletado>(CONFIG.WS_END_POINT + 'analisis/autocomPletado', IObservacionesConsulta)
      .pipe(
        map((response) => response),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  calcularCaudal(IObservacionesConsulta: IObservacionesConsulta): Observable<IautoCompletado> { 
    return this.http
      .post<IautoCompletado>(CONFIG.WS_END_POINT + 'OXEstacionInicial/calcularCaudal', IObservacionesConsulta)
      .pipe(
        map((response) => response),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  
  prueba(IObservacionesConsulta: IObservacionesConsulta): Observable<IObservacionesConsulta> { 
    return this.http
      .post<IObservacionesConsulta>(CONFIG.WS_END_POINT + 'OXEstacionInicial/prueba', IObservacionesConsulta)
      .pipe(
        map((response) => response),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  obtenerDTOAgregacion(IValorConsulta: IValorConsulta): Observable<IValorConsulta> { 
    return this.http
      .post<IValorConsulta>(CONFIG.WS_END_POINT + 'OXEstacionInicial/obtenerDTOAgregacion', IValorConsulta)
      .pipe(
        map((response) => response),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }


  obtenerDTOXParametro(IObservacionesConsulta: IObservacionesConsulta): Observable<number> { 
    return this.http
      .post<number>(CONFIG.WS_END_POINT + 'OXEstacionInicial/obtenerDTOXParametro', IObservacionesConsulta)
      .pipe(
        map((response) => response),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  obtenerDTOXParametroMini(IObservacionesConsulta: IObservacionesConsulta): Observable<number> { 
    return this.http
      .post<number>(CONFIG.WS_END_POINT + 'OXEstacionInicial/obtenerDTOXParametroMini', IObservacionesConsulta)
      .pipe(
        map((response) => response),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }


  obtenerValoresDTO(IObservacionesConsulta: IObservacionesConsulta): Observable<IValorParametroXCriterio> { 
    return this.http
      .post<IValorParametroXCriterio>(CONFIG.WS_END_POINT + 'OXEstacionInicial/obtenerValoresDTO', IObservacionesConsulta)
      .pipe(
        map((response) => response),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  obtenerInventario(requesInventario: IrequesInventario): Observable<IinventarioElementos> {  
    return this.http
      .post<IinventarioElementos>(CONFIG.WS_END_POINT + 'OXEstacionInicial/InventarioDTO', requesInventario)
      .pipe(
        map((response) => response),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }


  creacionMasiva(
    IObservacionesEstacion: IObservacionesEstacion
  ): Observable<IObservacionesEstacion[]> {
    return this.http
      .post<IObservacionesEstacion[]>(
        CONFIG.WS_END_POINT + 'OXEstacionInicial/creacionMasiva',
        IObservacionesEstacion
      )
      .pipe(
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  creacionMasivafecha(
    IObservacionesEstacion: IObservacionesEstacion
  ): Observable<any[]> {
    return this.http
      .post<any[]>(
        CONFIG.WS_END_POINT + 'OXEstacionInicial/creacionMasiva',
        IObservacionesEstacion
      )
      .pipe(
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }


  cargueRapido(IObservacionesEstacion: IObservacionesEstacion): Observable<ICargueEstacionRespuesta> {
    return this.http
      .post<ICargueEstacionRespuesta>(
        CONFIG.WS_END_POINT + 'OXEstacionInicial/cargueRapido',
        IObservacionesEstacion
      )
      .pipe(
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  crear(
    IObservacionesEstacion: IObservacionesEstacion
  ): Observable<IObservacionesEstacion[]> {
    return this.http
      .post<IObservacionesEstacion[]>(
        CONFIG.WS_END_POINT + 'OXEstacionInicial/crear',
        IObservacionesEstacion
      )
      .pipe(
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  actualizar(IObservacionesEstacion: IObservacionesEstacion): Observable<IObservacionesEstacion> { 
    return this.http
      .post<IObservacionesEstacion>(CONFIG.WS_END_POINT + 'OXEstacionInicial/actualizar', IObservacionesEstacion)
      .pipe(
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }
  actualizarEstado(actualizar:any  ): Observable<IObservacionesEstacion> { 
    return this.http
      .post<IObservacionesEstacion>(CONFIG.WS_END_POINT + 'OXEstacionInicial/actualizar', actualizar)
      .pipe(
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  actualizarEstadoObservacion(estado:any,id: any){
    return this.http.post<boolean>(CONFIG.WS_END_POINT + 'OXEstacionInicial/actualizarEstado?estado='+estado+'&id='+id,0 ).pipe(
        catchError(e => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  duscarfecha(IValorConsulta: IValorConsulta): Observable<any> { 
    return this.http
      .post<any>(CONFIG.WS_END_POINT + 'OXEstacionInicial/duscarfecha', IValorConsulta)
      .pipe(
        map((response) => response),
        catchError((e) => {
         
        if(e.ok === false){
          this.toast.fire({
            icon: 'error',
            title:
              'No se puede eliminar tiene datos asociados!!!',
          });
          return throwError(e.ok);
        }else{
          HandlerExceptions.validarExcepcionesHTTP(e);
         
          return throwError(e);
        }

        })
      );
  }
}
