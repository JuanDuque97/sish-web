export interface ITipoArchivoConfigurado {
  fechaCreacion: string;
  fechaModificacion: string;
  usuarioCreacion?: string;
  usuarioModificacion?: string;
  activo: string;
  fechaEstado?: string;
  usuarioEstado?: string;
  idTipoArchivoConfigurado: number;
  tipoArchivoConfigurado: string;
  idTipoArchivo: number;
  idTipoFraccionamiento: number;
  idUbicacionDatos: number;
  separador: string;
  calificadorTexto: string;
  contieneEncabezado: string;
  contieneResumen: string;
  separadorDecimal: string;
  idFrecuenciaTemporal: number;
  intervaloFrecuenciaTemporal: number;
  idTipoCodificacion: number;
}