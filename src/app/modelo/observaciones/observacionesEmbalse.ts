
export interface IObservacionesEmbalses{

  activo: string,
  fecha: string,
  fechaCargue: string,
  fechaCreacion: string,
  fechaEstado: string,
  fechaModificacion: string,
  flagInsert: true,
  idEstadoObservacion: number,
  idFlagObservacion: number,
  idObservacionXEmbalseInicial: number,
  idParametroXEmbalse: number,
  idTipoOrigenObservacion: number,
  origen: string,
  usuarioCargue: string,
  usuarioCreacion: string,
  usuarioEstado: string,
  usuarioModificacion: string,
  valor: number
  idEmbalse: number
}

export interface IObservacionesEmbalsesDTO{
  idEmbalse: number
    activo : string,
    descripcion : string,
    estacion : string,
    estadoObservacion : string,
    fecha : string,
    fechaCargue : string,
    fechaCreacion : string,
    fechaEstado : string,
    fechaModificacion : string,
    idEstacion : number,
    idEstadoObservacion : number, 
    idParametro : number,
   
    idObservacionXEmbalseInicial: number,
    idParametroXEmbalse: number,

    idTipoOrigenObservacion : number,
    origen : string,
    tipoOrigenObservacion : string,
    usuarioCargue : string,
    usuarioCreacion : string,
    usuarioEstado : string,
    usuarioModificacion : string,
    valor : number
    frecuencia : number,
    idFlagObservacion : number,
}

export interface ICargueEmbalseRespuesta {   
  observacionesRegistradas : any[],
  observacionesRechazadas : any[],
  razonesFallo : string[]
}
