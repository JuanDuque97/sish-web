
export interface IObservacionesEstacion{
  map(arg0: (p: { [x: string]: any; idObservacionXEstacionInicial: any; }) => { [x: string]: any; idObservacionXEstacionInicial: any; }): any;
  activo: string,
  fecha: string,
  fechaCargue: string,
  fechaCreacion: string,
  fechaEstado: string,
  fechaModificacion: string,
  flagInsert: true,
  idEstadoObservacion: number,
  idFlagObservacion: number,
  idObservacionXEstacionInicial: number,
  idParametroXEstacion: number,
  idTipoOrigenObservacion: number,
  origen: string,
  usuarioCargue: string,
  usuarioCreacion: string,
  usuarioEstado: string,
  usuarioModificacion: string,
  valor: number
  idEstacion : number,
}

export interface IObservacionesEstacionDTO{
 
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
    idObservacionXEstacionInicial : number,
    idParametro : number,
    idParametroXEstacion : number,
    idTipoOrigenObservacion : number,
    origen : string,
    tipoOrigenObservacion : string,
    usuarioCargue : string,
    usuarioCreacion : string,
    usuarioEstado : string,
    usuarioModificacion : string,
    valor : number,
    frecuencia : number,
  idFlagObservacion: number,
}

export interface ICargueEstacionRespuesta {   
  observacionesRegistradas : any[],
  observacionesRechazadas : any[],
  razonesFallo : string[]
}
