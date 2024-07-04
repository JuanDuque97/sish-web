export interface IMolinete {
  activo: string;
  descripcion: string;
  fechaAdquisicion: string;
  fechaCreacion: string;
  fechaEstado: string;
  fechaModificacion: string;
  fechaUltimaCalibracion: string;
  idMolinete: number;
  idTipoMolinete: number;
  idImagen: number;
  idhelice: number;
  idCertificadoUltimaCalibracion: number;
  marca: string;
  serie: string;
  usuarioCreacion: string;
  usuarioEstado: string;
  usuarioModificacion: string;
  identificacionMolinete: string;
  serieHelice: string;
}
export interface IMolineteDTO {
  activo: string;
  certificacoUltimaCalibracion: string;
  descripcion: string;
  fechaAdquisicion: string;
  fechaCreacion: string;
  fechaEstado: string;
  fechaModificacion: string;
  fechaUltimaCalibracion: string;
  flagMigracion: string;
  idCertificadoUltimaCalibracion: number;
  idImagen: number;
  idMolinete: number;
  idPeriodoSugeridoCalibracion: number;
  idTipoMolinete: number;
  identificacionMolinete: string;
  imangen: string;
  marca: string;
  periodoSugeridoCalibracion: string;
  serie: string;
  tipoMolinete: string;
  usuarioCreacion: string;
  usuarioEstado: string;
  usuarioModificacion: string;
}

export interface Ihelice {
  activo: string;
  constanteB: number;
  constanteM: number;
  idHelice: number;
  idMolinete: number;
  numeroRevolucionesMax: number;
  numeroRevolucionesMin: number;
  observaciones: string;
  serieHelice: string;
  velocidadExpresadaMax: number;
  velocidadExpresadaMin: number;
  idImagen: number;
  idCertificadoUltimaCalibracion: number;
  flagMigracion: string;
  idPeriodoSugeridoCalibracion: number;
  fechaUltimaCalibracion: string;
  imagen: string;
  molinete: string;
  descripcionImagen: string;
  idTipoArchivoImagen: number;
  certificadoUltimaCalibracion: string;
  descripcionCertificadoUltimaCalibracion: string;
  idTipoArchivoCertificado: number;
}

export interface IarchivoMolinete {
  archivo: string;
  descripcion: string;
  idArchivo: number;
  idTipoArchivo: number;
}
