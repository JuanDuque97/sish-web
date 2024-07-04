


export interface ICurvaRespuesta{
  promedioCaudalCalculo:number,
  cantidadCaudalCalculo:number,
  porcentaje:number,
  idEstacion:number,
  estacion:string,
  numeroAforo:string,
  fecha:string,
}


export interface ICurvaDuracion{
  idElemento?:number,
  idCurvaDuracion?:Number,
  fechaFin?:Date,
  fechaInicio?:Date,
  fechaCreacion?:Date,
  estado?:String,
  consecutivo?:Number,
  idTipoElemento?:Number,
}

export interface ICurvaDuracionAjuste{
  idElemento?:number,
  fechaInicio?:Date,
  fechaFinal?:Date,
  consecutivo?:String,
}

export interface ICurvaDuracionDetalleDTO {
  idCurvaDuracionDetalle : number, 
  idCurvaDuracion : number, 
  idAforo: number,
  fechaGrupo : string, 
  cantidadCaudal : number, 
  promedioCaudal : number, 
  porcentaje : number, 
  fechaCreacion : Date
}

export interface ICurvaDuracionDetalleRequest {
idCurvaDuracion : number, 
detalles : ICurvaDuracionDetalleDTO[], 
}

export interface ICurvaDuracionDetalleResponse {
idCurvaDuracion : Number, 
detalles : ICurvaDuracionDetalleDTO[], 
}

export interface IConsecutivoRequest {
  idElemento: number,
  idTipoElemento: number
}

export interface IConsecutivoResponse {
  idElemento: number,
  idTipoElemento: number, 
  consecutivo : number,
}

export interface ICurvaDuracionPorFechasRequest {
  idTipoElemento : number,
  idElemento : number,
  fechaInicio : Date, 
  fechaFinal : Date;
}

export interface ICurvaDuracionActualizacionRequest {
  idCurvaDuracion: number, 
  detalles: ICurvaDuracionDetalleDTO[], 
}
