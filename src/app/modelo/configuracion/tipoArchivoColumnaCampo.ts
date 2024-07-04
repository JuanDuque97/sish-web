export interface ITipoArchivoCampo {
  idTipoArchivoCampo: number;
  idTipoArchivoConfigurado: number;
  idTipoArchivoColumna: number;
  idTipoArchivoColumnaPropiedad: number;
  codigoPropiedad: string;
  idParametro: number;
  campoRelacionado: string;
}

export interface ITipoArchivoCampoDTO {
  idParametro: number;
  idTipoArchivoCampo: number;
  tipoArchivoConfigurado: string;
  idTipoArchivoColumna: number;
  idTipoArchivoConfigurado: number;
  idTipoArchivoColumnaPropiedad?: any;
  codigoPropiedad: string;
  campoRelacionado: string;
  descripcion: string;
  tipoArchivoColumna: string;
}