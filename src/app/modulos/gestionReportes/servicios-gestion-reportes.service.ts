import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CONFIG } from 'src/app/common/utils/constantes';
import { HandlerExceptions } from 'src/app/common/utils/handlerexception';
import { 
  reporteEstructura, 
  ReporteCaudalesAforadosRequest, 
  ReporteCaudalesAforadosResponse,
  ReporteFuentesSuperficialesRequest, 
  ReporteFuentesSuperficialesResponse, 
  ReportePrecipitacionRequest, 
  ReportePrecipitacionResponse,
  ReporteFuentesSuperficialesResponseFechaMax,
  ReporteFuentesSuperficialesRequestFechasMax,
  ReporteFuentesSuperficialesRequestFechasMin,
  ObtenerValorMaximoHorasRequest,
  ObtenerValorMaximoHorasResponse,
  ReporteFuentesSuperficialesResponseFechaMin
} from '../../modelo/configuracion/reporte';

@Injectable({
  providedIn: 'root',
})
export class ServiciosGestionReportes {
  constructor(private http: HttpClient) {
    // Esto es intencional
  }

  crear(reporteEstructura: reporteEstructura): Observable<reporteEstructura> {
    return this.http
      .post<reporteEstructura>(
        CONFIG.WS_END_POINT + 'reporteEstructura/crearDTO',
        reporteEstructura
      )
      .pipe(
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  actualizar(reporteEstructura: reporteEstructura): Observable<reporteEstructura> {
    return this.http
      .post<reporteEstructura>(
        CONFIG.WS_END_POINT + 'reporteEstructura/actualizarDTO',
        reporteEstructura
      )
      .pipe(
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  eliminar(reporteEstructura: reporteEstructura): Observable<reporteEstructura> {
      return this.http.delete<reporteEstructura>(
        CONFIG.WS_END_POINT + 'reporteEstructura/eliminarPorId/' + reporteEstructura.idEstructura, 
      ).pipe(
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  obtener(reporteEstructura: reporteEstructura): Observable<reporteEstructura> {
    return this.http
      .post<reporteEstructura>(
        CONFIG.WS_END_POINT + 'reporteEstructura/obtener',
        reporteEstructura
      )
      .pipe(
        map((response) => response),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  obtenerDTO(): Observable<reporteEstructura[]> {
    return this.http
      .get<reporteEstructura[]>(`${CONFIG.WS_END_POINT}reporteEstructura/obtenerDTO`)
      .pipe(
        map((response) => response),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  obtenerReporteElementosDTO(reporteRequest : any): Observable<any[]> {
    return this.http
      .post<any[]>(
        CONFIG.WS_END_POINT + 'reporteElementos/obtenerDTO',
        reporteRequest
      )
      .pipe(
        map((response) => response),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  obtenerReporteEstaciones(reporteRequest : any): Observable<any[]> {
    return this.http
      .post<any[]>(
        CONFIG.WS_END_POINT + 'reporteElementos/obtenerDTOEstaciones',
        reporteRequest
      )
      .pipe(
        map((response) => response),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  obtenerReporteEmbalses(reporteRequest : any): Observable<any[]> {
    return this.http
      .post<any[]>(
        CONFIG.WS_END_POINT + 'reporteElementos/obtenerDTOEmbalses',
        reporteRequest
      )
      .pipe(
        map((response) => response),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  obtenerReportePozos(reporteRequest : any): Observable<any[]> {
    return this.http
      .post<any[]>(
        CONFIG.WS_END_POINT + 'reporteElementos/obtenerDTOPozos',
        reporteRequest
      )
      .pipe(
        map((response) => response),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  obtenerPorId(id: number): Observable<reporteEstructura> {
    return this.http
      .get<reporteEstructura>(
        CONFIG.WS_END_POINT + 'reporteEstructura/obtenerPorIdDTO/' + id
      )
      .pipe(
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  obtenerReporteCaudalesAforados(request: ReporteCaudalesAforadosRequest): Observable<ReporteCaudalesAforadosResponse[]> {
      return this.http
      .post<ReporteCaudalesAforadosResponse[]>(
        CONFIG.WS_END_POINT + 'reporteEstaticos/obtenerReporteCaudalesAforados',
        request
      )
      .pipe(
        map((response) => response),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  obtenerReporteFuentesSuperficiales(request: ReporteFuentesSuperficialesRequest): Observable<ReporteFuentesSuperficialesResponse[]> {
    return this.http
    .post<ReporteFuentesSuperficialesResponse[]>(
      CONFIG.WS_END_POINT + 'reporteEstaticos/obtenerReporteFuentesSuperficialesAnual',
      request
    )
    .pipe(
      map((response) => response),
      catchError((e) => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    );
  }

  obtenerReporteFuentesSuperficialesExtra(request: ReporteFuentesSuperficialesRequest): Observable<ReporteFuentesSuperficialesResponse> {
    return this.http
    .post<ReporteFuentesSuperficialesResponse>(
      CONFIG.WS_END_POINT + 'reporteEstaticos/obtenerReporteFuentesSuperficialesAnualExtra',
      request
    )
    .pipe(
      map((response) => response),
      catchError((e) => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    );
  }

  obtenerReporteMaximoFechaHora(reques: ReporteFuentesSuperficialesRequestFechasMax): Observable<ReporteFuentesSuperficialesResponseFechaMax[]> {
    return this.http
    .post<ReporteFuentesSuperficialesResponseFechaMax[]>(
      CONFIG.WS_END_POINT + 'reporteEstaticos/obtenerfechasMaximoHora',
      reques
    )
    .pipe(
      map((response) => response),
      catchError((e) => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    );
  }

  obtenerReporteMinimoFechaHora(reques: ReporteFuentesSuperficialesRequestFechasMin): Observable<ReporteFuentesSuperficialesResponseFechaMax[]> {
    return this.http
    .post<ReporteFuentesSuperficialesResponseFechaMax[]>(
      CONFIG.WS_END_POINT + 'reporteEstaticos/obtenerfechasMinimoHora',
      reques
    )
    .pipe(
      map((response) => response),
      catchError((e) => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    );
  }
  obtenerReporteMaximoFechaDia(reques: ReporteFuentesSuperficialesRequestFechasMax): Observable<ReporteFuentesSuperficialesResponseFechaMax> {
    return this.http
    .post<ReporteFuentesSuperficialesResponseFechaMax>(
      CONFIG.WS_END_POINT + 'reporteEstaticos/obtenerfechasMaximoDia',
      reques
    )
    .pipe(
      map((response) => response),
      catchError((e) => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    );
  }

  obtenerReporteMinimoFechaDia(reques: ReporteFuentesSuperficialesRequestFechasMin): Observable<ReporteFuentesSuperficialesResponseFechaMin> {
    return this.http
    .post<ReporteFuentesSuperficialesResponseFechaMin>(
      CONFIG.WS_END_POINT + 'reporteEstaticos/obtenerfechasMinimoDia',
      reques
    )
    .pipe(
      map((response) => response),
      catchError((e) => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    );
  }

  obtenerValoMaximoHora(responder: ObtenerValorMaximoHorasRequest): Observable<number> {
    return this.http
    .post<number>(
      CONFIG.WS_END_POINT + 'reporteEstaticos/obtenerValoMaximoHora',
      responder
    )
    .pipe(
      map((response) => response),
      catchError((e) => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    );
  }

  obtenerValoMinimoHora(responder: ObtenerValorMaximoHorasRequest): Observable<number> {
    return this.http
    .post<number>(
      CONFIG.WS_END_POINT + 'reporteEstaticos/obtenerValorMinimoHora',
      responder
    )
    .pipe(
      map((response) => response),
      catchError((e) => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    );
  }
  
  obtenerReportePrecipitacion(request: ReportePrecipitacionRequest): Observable<ReportePrecipitacionResponse[]> {
    return this.http.post<ReportePrecipitacionResponse[]>(
      CONFIG.WS_END_POINT + 'reporteEstaticos/obtenerReportePrecipitacion', request
    )
    .pipe(
      map((response) => response), 
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        }
      )
    );
  }
}
