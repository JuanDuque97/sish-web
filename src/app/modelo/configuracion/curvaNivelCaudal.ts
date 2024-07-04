
export interface ICurvaNivelCaudal{
  idEcuacion: number,
  idCalibracion: any,
  idElemento: number,
  estado:number,
  fechaInicioVigencia:string,
  flagMigracion:number,
  idVigencia: number,
  numeroCurva: number,
  activo: string,
  idTipoElemento : number,
  consecutivo: number
  id_tipo_eduacion:number
}



export interface InformacionEcuacion {
  id_tipo_ecuacion:number
  id_curva_tendencia : number,
  coeficiente: number, 
  exponente: number, 
  flagMigracion: number, 
  ecuacion: string,
  tramo: number,
  nivel_min: number,
  nivel_max: number,
  ho:number,
  activo: string,
  tipo_ecuacion: string,
  mae: number,
  r2: number,
  idTipoElemento: number,
  idElemento:number,
  consecutivo:number
}

export interface Consecutivo {
  idTipoElemento: number,
  idElemento:number
}


export interface ICurvaNivelCaudalDetalles{
  idCurvaNivelCaudal: number,
  nivel: number,
  caudal: number,
  valorEnX: number,
  valorEnY: number,
  fechaCurva: Date,
  activo: string
}