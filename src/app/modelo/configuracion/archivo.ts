
export interface IArchivo{

  idArchivo:number,
  archivo:string,
  idEstacion:string,
  fechaProceso?:string,
  idTipoArchivoConfigurado:number,
  ruta?:string,
  procesoExitoso?:string,
  error?:string,
  idPozo?:number,
  idEmbalse?:number,
  activo:string,
  totalRegistrosLeidos:number,
  totalRegistrosCargados:number,
}

export interface IArchivoDTO{
  idArchivo:number,
  idTipoArchivoConfigurado:number,
  archivo:string,
  fechaProceso:string,
  idEmbalse:number,
  embalse:string,
  idPozo:number,
  pozo:string,
  idEstacion:number,
  estacion:string,
  activo:string,
  totalRegistrosLeidos:number,
  totalRegistrosCargados:number,
}

export interface FormatoConfigDTO {
  idFormato : number,
  nombreFormato : string,
  idFrecuencia : number,
  nombreFrecuencia : string,
  codigoParametrosPorNombre : any, 
}
