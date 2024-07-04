import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { CONFIG } from 'src/app/common/utils/constantes';
import { HandlerExceptions } from 'src/app/common/utils/handlerexception';
import { catchError, map } from 'rxjs/operators';
import { IAforador, IAforo, IAforoFiltro, IAforoArchivo, IAfotoCantidad, IAforoCalculo, IAforoDato, IAforoPunto, AforoNumeroDTO, TipoAforoDTO, IObtenerCurvaDuracionRequestDTO, IObtenerCurvaDuracionResponseDTO } from 'src/app/modelo/configuracion/aforo';
import { ITipoFormatoSerie } from 'src/app/modelo/configuracion/tipoFormatoSerie';
import { ITipoFormatoArchivo } from 'src/app/modelo/configuracion/tipoFormatoArchivo';
import { ICriterioValidacion } from 'src/app/modelo/configuracion/criterioValidacion';
import { Ihelice, IMolinete } from 'src/app/modelo/configuracion/molinete';
import { IAforoCudal, IAforoConsulta, Ecuacion } from 'src/app/modelo/configuracion/aforoGrafica';
import { ICurvaTendencia, IObtenerDetalleNivelCaudalRequest, IObtenerDetalleNivelCaudalResponse, IObtenerParametrosCurvaNivelCaudalRequest, IObtenerParametrosCurvaNivelCaudalResponse, IObtenerTablaAgregacionAnualRequest, IObtenerTablaAgregacionAnualResponse, IObtenerTablaAgregacionMensualRequest, IObtenerTablaAgregacionMensualResponse } from 'src/app/modelo/configuracion/curvaTendencia';
import { ICurvaDuracion, ICurvaDuracionDetalleDTO, ICurvaDuracionDetalleRequest, ICurvaDuracionDetalleResponse, ICurvaDuracionPorFechasRequest, ICurvaDuracionActualizacionRequest } from 'src/app/modelo/configuracion/curvaDuracion';
import { ICurvaRespuesta } from 'src/app/modelo/configuracion/curvaDuracion';
import { IConsecutivoRequest, IConsecutivoResponse } from 'src/app/modelo/configuracion/curvaDuracion';
import { IInformacionEcuacion } from 'src/app/modelo/configuracion/informacionEcuacion';
import { IInformacionGrafica } from 'src/app/modelo/configuracion/informacionGrafica';
import { Consecutivo, ICurvaNivelCaudal, ICurvaNivelCaudalDetalles, InformacionEcuacion } from 'src/app/modelo/configuracion/curvaNivelCaudal';

@Injectable({
  providedIn: 'root'
})

export class ServiciosAforoService {

  constructor(private http: HttpClient) {

  }

  obtenerAforo(idAforo: any): Observable<IAforo[]> {
    return this.http.get<any>(`${CONFIG.WS_END_POINT}aforo/obtenerPorAforo/` + idAforo)
      .pipe(
        map((response) => response),
        catchError(e => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  obtenerAforoid(idAforo: any): Observable<IAforo[]> {
    return this.http.get<any>(`${CONFIG.WS_END_POINT}aforo/obtenerAforoid/` + idAforo)
      .pipe(
        map((response) => response),
        catchError(e => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  obtenerAforoidHelice(idAforo: any): Observable<Ihelice[]> {
    return this.http.get<any>(`${CONFIG.WS_END_POINT}helice/aforo/` + idAforo)
      .pipe(
        map((response) => response),
        catchError(e => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }
  obtenerPorTipo(): Observable<IAforo[]> {
    return this.http.get<any>(`${CONFIG.WS_END_POINT}aforo/obtenerPorTipoAforo?tipo_elemento=estaciones`)
      .pipe(

        map((response) => response),

        catchError(e => {
          alert(33);
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  obtenerPorTipofiltros1(id_elemento: any): Observable<IAforo[]> {
    return this.http.get<any>(`${CONFIG.WS_END_POINT}aforo/obtenerPorTipo?tipo_elemento=estaciones&id_elemento=` + id_elemento)
      .pipe(
        map((response) => response),
        catchError(e => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }
  obtenerPorTipofiltros(aforo: IAforoFiltro) {
    return this.http.post<IAforoFiltro>(CONFIG.WS_END_POINT + 'aforo/obtenerPorTipo', aforo).pipe(
      catchError(e => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    );
  }

  guardarAforo(aforo: IAforo) {
    return this.http.post<IAforo>(CONFIG.WS_END_POINT + 'aforo/crear', aforo).pipe(
      catchError(e => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    );
  }

  actualizarAforo(aforo: IAforo) {
    return this.http.post<IAforo>(CONFIG.WS_END_POINT + 'aforo/actualizar', aforo).pipe(
      catchError(e => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    );
  }

  actualizarEstadoObservacion(observacion: any, estado: any, idAforo: any, caudal: any, nivel: any) {
    return this.http.post<IAforo>(CONFIG.WS_END_POINT + 'aforo/actualizarEstadoObservacion?observacion=' + observacion + '&idAforo=' + idAforo + '&estado=' + estado + '&caudal=' + caudal + '&nivel=' + nivel, 0).pipe(
      catchError(e => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    );
  }

  actualizarEstado(estado: any, idAforo: any) {
    return this.http.post<IAforo>(CONFIG.WS_END_POINT + 'aforo/actualizarEstado?idAforo=' + idAforo + '&estado=' + estado, 0)
      .pipe(
        catchError(e => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }


  obtenerAforoDato(idAforo: string) {
    return this.http.get<IAforoDato[]>(`${CONFIG.WS_END_POINT}aforoDato/aforo/` + idAforo)
      .pipe(
        map((response) => response),
        catchError(e => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }
  eliminarAforo(id: any) {
    return this.http.get<IAforo>(`${CONFIG.WS_END_POINT}aforoDato/aforo/` + id)
      .pipe(
        catchError(e => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  guardarAforoDato(aforoDato: IAforoDato[]) {
    return this.http.post<IAforoDato[]>(CONFIG.WS_END_POINT + 'aforoDato/crearLista', aforoDato).pipe(
      catchError(e => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    );
  }

  guardarCalculoAforo(aforoCalculo: IAforoCalculo) {
    return this.http.post<IAforoDato[]>(CONFIG.WS_END_POINT + 'aforoCalculo/crear', aforoCalculo).pipe(
      catchError(e => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    );
  }

  guardarAforoArchivo(aforoArchivo: IAforoArchivo) {
    return this.http.post<IAforoDato[]>(CONFIG.WS_END_POINT + 'aforoArchivo/crear', aforoArchivo).pipe(
      catchError(e => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    );
  }

  obtenerAforoPunto() {
    return this.http.get<IAforoPunto[]>(`${CONFIG.WS_END_POINT}aforoPunto/obtener`)
      .pipe(
        map((response) => response),
        catchError(e => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  guardarAforoPunto(aforoPunto: IAforoPunto) {
    return this.http.post<IAforoPunto>(CONFIG.WS_END_POINT + 'aforoPunto/crear', aforoPunto).pipe(
      catchError(e => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    );
  }

  obtenerTipoFormatoSerieLista() {
    return this.http
      .get<ITipoFormatoSerie>(`${CONFIG.WS_END_POINT}tipoFormato/obtener`)
      .pipe(
        map((r: any) =>
          r.map((d: ITipoFormatoSerie) => ({
            id: d.idTipoFormato,
            text: d.tipoFormato,
            disabled: false
          }))
        ),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }
  obtenerNumeroEcuacion() {
    return this.http
      .get<IInformacionEcuacion>(`${CONFIG.WS_END_POINT}informacionEcuacion/obtener`)
      .pipe(
        map((r: any) =>
          r.map((d: IInformacionEcuacion) => ({
            id: d.id_informacion_ecuaciones,
            text: d.id_informacion_ecuaciones,
            disabled: false
          }))
        ),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }
  obtenerTipoFormatoArchivo() {
    return this.http.get<ITipoFormatoArchivo[]>(`${CONFIG.WS_END_POINT}tipoFormatoArchivo/obtener`)
      .pipe(
        map((response) => response),
        catchError(e => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  obtenerExpresiones() {
    return this.http
      .get<ICriterioValidacion[]>(`${CONFIG.WS_END_POINT}criterioValidacion/obtenerActivo`)
      .pipe(
        map((response) => response),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  obtenerAforadores() {
    return this.http
      .get<IAforador[]>(`${CONFIG.WS_END_POINT}aforoAforador/obtener`)
      .pipe(
        map((r: any) =>
          r.map((d: IAforador) => ({
            id: d.idAforoAforador,
            text: d.nombre,
          }))
        ),

        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  obtenerMolinetes() {

    return this.http.get<IMolinete[]>(`${CONFIG.WS_END_POINT}molinete/obtenerActivos`)
      .pipe(
        map((r: any) =>
          r.map((d: IMolinete) => ({
            id: d.idMolinete,
            text: d.descripcion,
            activo: d.activo
          }))
        ),

        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }


  obtenerNumeroAfoto() {

    return this.http.get<AforoNumeroDTO[]>(`${CONFIG.WS_END_POINT}aforo/obtenerNumeroAforo`)
      .pipe(
        map((r: any) =>
          r.map((d: AforoNumeroDTO) => ({
            id: d.idAforo,
            text: d.numeroAforo
          }))
        ),

        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  obtenerTipoAforo() {

    return this.http.get<TipoAforoDTO[]>(`${CONFIG.WS_END_POINT}aforo/tipoAforo`)
      .pipe(
        map((r: any) =>
          r.map((d: TipoAforoDTO) => ({
            id: d.id_dominio_valor,
            text: d.dominio_valor
          }))
        ),

        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }


  obtenerAforador() {

    return this.http.get<IAforador[]>(`${CONFIG.WS_END_POINT}aforoAforador/obtener`)
      .pipe(
        map((r: any) =>
          r.map((d: IAforador) => ({
            id: d.idAforoAforador,
            text: d.nombre
          }))
        ),

        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }


  obtenerHelice(idMolinete: number) {

    return this.http
      .get<Ihelice[]>(`${CONFIG.WS_END_POINT}helice/obtenerPorIdMolinete/` + idMolinete)
      .pipe(
        map((r: any) =>
          r.map((d: Ihelice) => ({
            id: d.idHelice,
            text: d.serieHelice,
          }))
        ),

        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }
  obtenerAforoCalculo(idaforo: String) {

    return this.http
      .get<IAforoCalculo[]>(`${CONFIG.WS_END_POINT}aforoCalculo/aforo/` + idaforo)
      .pipe(
        map((response) => response),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }
  obtenerInfoHelice(idHelice: any) {
    return this.http
      .get<Ihelice>(`${CONFIG.WS_END_POINT}helice/obtenerPorIdSelect/` + idHelice)
      .pipe(
        map((response) => response),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }
  obtenerIdcurvaTendencia(idcurva: any) {
    return this.http
      .get<ICurvaTendencia>(`${CONFIG.WS_END_POINT}curvaTendencia/obtenerPorId/` + idcurva)
      .pipe(
        map((response) => response),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  obtenerTablas(aforo: IAforoFiltro) {
    return this.http.post<ICurvaTendencia[]>(CONFIG.WS_END_POINT + 'aforo/obtener-aforo-caudal', aforo).pipe(
      catchError(e => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    );
  }

  obtenerCurvaDuracion(aforo: IAforoFiltro) {
    return this.http.post<ICurvaRespuesta[]>(CONFIG.WS_END_POINT + 'aforo/obtenerCurva', aforo).pipe(
      catchError(e => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    );
  }

  obtenerNuevaCurvaDuracion(request: IObtenerCurvaDuracionRequestDTO) {
    return this.http.post<IObtenerCurvaDuracionResponseDTO[]>(CONFIG.WS_END_POINT + 'curvaDuracion/obtenerCurvaDuracion', request).pipe(
      catchError(e => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    );
  }

  obtenerDetallesPorCurvaDuracion(idCurvaDuracion: number) {
    return this.http.get<ICurvaDuracionDetalleDTO[]>(CONFIG.WS_END_POINT + 'curvaDuracionDetalle/obtenerDetallesPorCurvaDuracionId/' + idCurvaDuracion).pipe(
      catchError(e => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    );
  }

  obtenerAforoValidar(estacion: String) {
    return this.http
      .get<IAfotoCantidad>(`${CONFIG.WS_END_POINT}aforo/cantidad-aforos-aprobacion?id_elemento=` + estacion)
      .pipe(
        map((response) => response),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  obtenerInfoHeliceid(idHelice: any) {
    return this.http.post<Ihelice[]>(CONFIG.WS_END_POINT + 'helice/obtenerPorIdHelice', idHelice).pipe(
      catchError(e => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    );
  }
  AforoCaudalEstacion() {
    return this.http
      .get<IAforoConsulta[]>(`${CONFIG.WS_END_POINT}aforo/obtener_estacion`)
      .pipe(
        map((response) => response),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  obtenerAforoCaudal(datosFiltros: IAforoCudal) {
    return this.http.post<IAforoConsulta[]>(CONFIG.WS_END_POINT + 'aforo/obtener_estacion', datosFiltros).pipe(
      catchError(e => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    );
  }

  obtenerListaEcuaciones(request: Ecuacion) {
    return this.http.post<any[]>(CONFIG.WS_END_POINT + 'informacionEcuacion/gestion_ecuaciones', request).pipe(
      catchError(e => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    );
  }

  guardarConsecutivoCurva(request : Consecutivo){
    return this.http.post<Consecutivo>(CONFIG.WS_END_POINT + 'curva-nivel-caudal/obtenerConsecutivo', request).pipe(
        catchError(e => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  guardarCurva(ICurvaTendencia: ICurvaTendencia) {
    return this.http.post<ICurvaTendencia>(CONFIG.WS_END_POINT + 'curvaTendencia/crear', ICurvaTendencia).pipe(
      catchError(e => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    );
  }
  consultarAnterior(ICurvaTendencia: any) {
    return this.http.post<any>(CONFIG.WS_END_POINT + 'curvaTendencia/consultarAnterior', ICurvaTendencia).pipe(
      catchError(e => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    );
  }


  guardarCurvaDuracion(ICurvaDuracion: ICurvaDuracion) {
    return this.http.post<ICurvaDuracion>(CONFIG.WS_END_POINT + 'curvaDuracion/crear', ICurvaDuracion).pipe(
      catchError(e => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    );
  }

  guardarCurvaDuracionDetalle(request: ICurvaDuracionDetalleRequest) {
    return this.http.post<ICurvaDuracionDetalleResponse>(CONFIG.WS_END_POINT + 'curvaDuracionDetalle/guardar', request).pipe(
      catchError(e => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    );
  }



  obtenerCurvaid(estacion: String) {
    return this.http
      .get<IAfotoCantidad>(`${CONFIG.WS_END_POINT}curvaTendencia/obtenerPorEstacion?id_elemento=` + estacion)
      .pipe(
        map((response) => response),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  obtenerCurvaidD(estacion: any) {
    return this.http
      .get<IAfotoCantidad>(`${CONFIG.WS_END_POINT}curvaDuracion/obtenerPorId/` + estacion)
      .pipe(
        map((response) => response),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  obtenerCurvasDuracionPorElemento(idTipoElemento: number, idElemento: number) {
    return this.http.get<ICurvaDuracion[]>(`${CONFIG.WS_END_POINT}` + 'curvaDuracion/obtenerPorElemento/' + idTipoElemento + '/' + idElemento)
       .pipe(
        
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
       );
   }

   obtenerCurvasDuracionPorFechasCreacion(request : ICurvaDuracionPorFechasRequest) {
    return this.http.post<ICurvaDuracion[]>(CONFIG.WS_END_POINT + 'curvaDuracion/obtenerPorFechasCreacion', request).pipe(
      catchError(e => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    );
   }

   actualizarCurvasDuracionDetalles(request : ICurvaDuracionActualizacionRequest) {
    return this.http.post<ICurvaDuracion[]>(CONFIG.WS_END_POINT + 'curvaDuracion/actualizarDetalles', request).pipe(
      catchError(e => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    );
   }
   
   guardarCurvaNivelCaudal(request: ICurvaNivelCaudal) {
    return this.http.post<ICurvaNivelCaudal>(CONFIG.WS_END_POINT + 'curva-nivel-caudal/guardarCurvaNivel', request).pipe(
      catchError(e => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        console.log(e);
        return throwError(e);
      })
    );
  }

   guardarCurvaNivelCaudalDetalle(request:ICurvaNivelCaudalDetalles){
    return this.http.post<ICurvaNivelCaudalDetalles>(CONFIG.WS_END_POINT + 'curvaNivelCaudalDetalle/crearDetalle', request).pipe(
      catchError(e => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        console.log(e);
        return throwError(e);
      })
    );
  }

  guardarTablaGestionCaudal(request:ICurvaNivelCaudalDetalles){
    return this.http.post<ICurvaNivelCaudalDetalles>(CONFIG.WS_END_POINT + 'curvaNivelCaudalDetalle/obtenerCurvaNivelDetalle', request).pipe(
      catchError(e => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        console.log(e);
        return throwError(e);
      })
    );
  }

  guardarInformcionEcuacion(request: InformacionEcuacion) {
    return this.http.post<InformacionEcuacion>(CONFIG.WS_END_POINT + 'informacionEcuacion/crear', request).pipe(
      catchError(e => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        console.log(e);
        return throwError(e);
      })
    );
  }

  guardarInformacionGrafica(IInformacionGrafica: IInformacionGrafica) {
    return this.http.post<IInformacionGrafica>(CONFIG.WS_END_POINT + 'informacionGrafica/crear', IInformacionGrafica).pipe(
      catchError(e => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    );
  }



  obtenerEcuacionCurvaId(idCurva: String) {
    return this.http
      .get<IInformacionEcuacion[]>(`${CONFIG.WS_END_POINT}informacionEcuacion/obtenerPoridCurva/` + idCurva)
      .pipe(
        map((response) => response),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  obtenerCurvaId(idCurva: String) {
    return this.http
      .get<ICurvaTendencia[]>(`${CONFIG.WS_END_POINT}informacionGrafica/obtenerPoridCurva/` + idCurva)
      .pipe(
        map((response) => response),
        catchError((e) => {
          console.log(e);
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }

  

  obtenerCurvaDuracionConsecutivo(request: IConsecutivoRequest) {
    return this.http.post<IConsecutivoResponse>(CONFIG.WS_END_POINT + 'curvaDuracion/calcularProximoConsecutivo', request).pipe(
      catchError(e => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    );
  }

  obtenerCurva() {
    return this.http.get<ICurvaTendencia[]>(`${CONFIG.WS_END_POINT}curvaTendencia/obtener`)
      .pipe(
        map((r: any) =>
          r.map((d: ICurvaTendencia) => ({
            id: d.idCurvaTendencia,
            text: "Curva de tendencia #" + d.idCurvaTendencia,
            label: "Estación: " +d.nombreEstacion

          }))
        ),
        catchError((e) => {
          HandlerExceptions.validarExcepcionesHTTP(e);
          return throwError(e);
        })
      );
  }


  obtenerCurva1(ICurvaTendencia: ICurvaTendencia) {
    return this.http.post<ICurvaTendencia[]>(CONFIG.WS_END_POINT + 'aforo/obtenerAforoCaudal', ICurvaTendencia).pipe(
      catchError(e => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    );
  }

  obtenerTablaNivelesCaudal(request: IObtenerDetalleNivelCaudalRequest) {
    return this.http.post<IObtenerDetalleNivelCaudalResponse[]>(CONFIG.WS_END_POINT + 'curva-nivel-caudal/obtenerDetalleNivelCaudal', request).pipe(
      catchError(e => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    );
  }

  obtenerTablaAgregacionAnual(request : IObtenerTablaAgregacionAnualRequest) {
    return this.http.post<IObtenerTablaAgregacionAnualResponse[]>(CONFIG.WS_END_POINT + 'curva-nivel-caudal/obtenerDatosAgregacionesPorAno', request).pipe(
      catchError(e => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    );
  }

  obtenerTablaAgregacionMensual(request : IObtenerTablaAgregacionMensualRequest) {
    return this.http.post<IObtenerTablaAgregacionMensualResponse[]>(CONFIG.WS_END_POINT + 'curva-nivel-caudal/obtenerDatosAgregacionesPorMes', request).pipe(
      catchError(e => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    );
  }

  obtenerParametrosCurvaNivelCaudal(request: IObtenerParametrosCurvaNivelCaudalRequest) {
    return this.http.post<IObtenerParametrosCurvaNivelCaudalResponse[]>(CONFIG.WS_END_POINT + 'curva-nivel-caudal/obtenerParametros', request).pipe(
      catchError(e => {
        HandlerExceptions.validarExcepcionesHTTP(e);
        return throwError(e);
      })
    );
  }
}
