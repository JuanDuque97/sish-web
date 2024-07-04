import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CONFIG } from 'src/app/common/utils/constantes';
import { HandlerExceptions } from 'src/app/common/utils/handlerexception';    
import { IValorParametroXCriterio } from 'src/app/modelo/configuracion/criterioValidacion'; 
import { IinventarioElementos, IrequesInventario } from 'src/app/modelo/observaciones/inventarioElementos';
import { IObservacionesConsulta } from 'src/app/modelo/observaciones/observacionesConsulta';
import { IObservacionesEmbalses, IObservacionesEmbalsesDTO, ICargueEmbalseRespuesta } from 'src/app/modelo/observaciones/observacionesEmbalse';
 
@Injectable({
  providedIn: 'root'
})
export class PermisosService {

  constructor(private http: HttpClient) {
    // Esto es intencional
  } 
  sesssion(): Observable<String> {
    return this.http
      .get<String>(`${CONFIG.WS_END_POINT}tablaControl/sesionUrl`)
      .pipe(
        map((response) => response),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  } 


  

  sesssio2n(): Observable<any> { 
    return this.http
      .post<String>(CONFIG.WS_END_POINT + 'consultaIdfs/sessionURL', 0)
      .pipe(
        map((response) => response),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }


}
