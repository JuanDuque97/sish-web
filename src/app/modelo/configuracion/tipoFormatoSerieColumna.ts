export interface ITipoFormatoSerieColumna {
  idTipoFormatoColumna: number;
  tipoFormatoColumna: string;
  numeroColumna: number;
  posicionInicial?: any;
  posicionFinal?: any;
  separador?: any;
  idTipoContenido: number;
  idTipoFormato: number;
  idCriterioValidacion: number;
}