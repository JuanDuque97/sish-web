export interface IArchivoColumna {
  idTipoArchivoColumna: number;
  tipoArchivosColumna: string;
  idTipoArchivoConfigurado: number;
  numeroColumna: number;
  idTipoDato: number;
  formatoOrigen: string;
  formatoDestino: string;
  posicionInicial?: number;
  posicionFinal?: number;
  idTipoContenido: number;
}

export interface IArchivoColumnaDTO{
  tipoDato: string;
  tipoArchivoColumna: string;
  tipoContenido: string;
  idTipoArchivoConfigurado: number,
  idTipoArchivoColumna: number,
  tipoArchivoConfigurado: string;
  numeroColumna: number,
  idTipoDato: number,
  formatoOrigen: string;
  formatoDestino: string;
  posicionInicial: number,
  posicionFinal: number,
  idTipoContenido: number,
  separador: string;
}