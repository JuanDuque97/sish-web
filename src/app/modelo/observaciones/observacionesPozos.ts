
export interface IObservacionesPozos{

  activo: string,
  fecha: string,
  fechaCargue: string,
  fechaCreacion: string,
  fechaEstado: string,
  fechaModificacion: string,
  flagInsert: true,
  idEstadoObservacion: number,
  idFlagObservacion: number,
  idObservacionXPozoInicial: number,
  idParametroXPozo: number,
  idTipoOrigenObservacion: number,
  origen: string,
  usuarioCargue: string,
  usuarioCreacion: string,
  usuarioEstado: string,
  usuarioModificacion: string,
  valor: number
}

export interface IObservacionesPozosDTO{
    activo : string,
    descripcion : string,
    estacion : string,
    estadoObservacion : string,
    fecha : string,
    fechaCargue : string,
    fechaCreacion : string,
    fechaEstado : string,
    fechaModificacion : string,
    idPozo : number,
    idEstadoObservacion : number, 
    idParametro : number,
   
    idObservacionXPozoInicial: number,
    idParametroXPozo: number,

    idTipoOrigenObservacion : number,
    origen : string,
    tipoOrigenObservacion : string,
    usuarioCargue : string,
    usuarioCreacion : string,
    usuarioEstado : string,
    usuarioModificacion : string,
    valor : number,
    frecuencia : number
    idFlagObservacion : number
}

export interface ICarguePozoRespuesta {   
  observacionesRegistradas : any[],
  observacionesRechazadas : any[],
  razonesFallo : string[]
}
