 
export interface IPozos {
  activo: string;
  areaHidrografica: string;
  cotaBoca: number;
  cotaMedidor: number;
  cuenca: string;
  fechaCreacion: string;
  fechaEstado: string;
  fechaInicioOperacion: string;
  fechaModificacion: string;
  idCategoria: number;
  idCondicion: number;
  idMunicipio: number;
  idPozo: number;
  idTipoPozo: number;
  microcuenca: string;
  nivelSubsiguiente: string;
  pozo: string;
  profundidad: number;
  subZonaHidrografica: string;
  usuarioCreacion: string;
  usuarioEstado: string;
  usuarioModificacion: string;
  zonaHidrografica: string;
  zonaOperativaEaab: string;
  subcuenca: string;
  latitud   :number;
  longitud   :number;
  idDepartamento: number; 
  idTipoCoordenada: number; 
}

export interface IPozosDTO {
 
  activo: string,
  areaHidrografica: string,
  categoria: string,
  condicion: string,
  cotaBoca: number,
  cotaMedidor: number,
  cuenca: string,
  departamento: string,
  fechaCreacion: number,
  fechaEstado: number,
  fechaInicioOperacion:number,
  fechaModificacion: number,
  idAreaHidrografica: string,
  idCategoria: number,
  idCondicion: number,
  idCuenca: string,
  idDepartamento: number,
  idMicroCuenca: string,
  idMunicipio: number,
  idPozo: number,
  idSubCuenca: string,
  idSubZonaHidrografica: string,
  idTipoCoordenada: number,
  idTipoPozo: number,
  idZonaHidrografica: string,
  latitud: number,
  longitud: number,
  microcuenca: string,
  municipio: string,
  nivelSubsiguiente: string,
  pozo: string,
  profundidad: number,
  subCuenca: string,
  subZonaHidrografica: string,
  tipoCoordenada: string,
  tipoPozo: string,
  usuarioCreacion: string,
  usuarioEstado: string,
  usuarioModificacion: string,
  zonaHidrografica: string,
  zonaOperativaEaab: string

}

export interface IParametrosPozos{
  idParametro: number,
  idParametroXPozo: number,
  idPozo: number,

}
