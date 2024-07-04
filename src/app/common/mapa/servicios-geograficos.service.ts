import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { loadModules } from 'esri-loader';
import { IMunicipio } from 'src/app/modelo/configuracion/municipio';
import { IDepartamento } from 'src/app/modelo/configuracion/departamento';
import { Observable, throwError } from 'rxjs';
import { CONFIG } from '../utils/constantes'; 
import { HandlerExceptions } from '../utils/handlerexception'; 
import { catchError, map } from 'rxjs/operators';
/**
 * Estos servicios corresponden a las lecturas de servicios externos a SISH
 */

@Injectable({
  providedIn: 'root',
})
export class ServiciosGeograficosService {
  httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) {
    // Esto es intencional
  }

  async consultarDatosCapa(_url: string, _where: string, _outFields:string, _returnDistinctValues:boolean, _orderByFields:string):Promise<any> {
    let p: any;
    let Q: any;
    let QT: any;
    await loadModules(['esri/tasks/support/Query', 'esri/tasks/QueryTask']).then(
      ([Query, QueryTask]) => {
        Q = Query;
        QT = QueryTask;
      }
    );
    let query = new Q();
        let queryTask = new QT({
          url: _url,
        });
        query.where = _where;
        query.returnGeometry = false;
        query.outFields = [_outFields];
        query.returnDistinctValues = _returnDistinctValues;
        query.orderByFields = [_orderByFields]
        return queryTask.execute(query);
        
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
}
