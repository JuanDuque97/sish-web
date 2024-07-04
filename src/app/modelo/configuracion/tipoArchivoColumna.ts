import { NumericLiteral } from "typescript";

export interface ITipoArchivoColumna {
  idTipoArchivoColumna: number;
  tipoArchivosColumna: string;
  idTipoArchivoConfigurado: number;
  numeroColumna: number;
  idTipoDato: number;
  formatoOrigen: string;
  formatoDestino: string;
  posicionInicial:number;
  posicionFinal: number;
  idTipoContenido:number;
  separador:string;
}