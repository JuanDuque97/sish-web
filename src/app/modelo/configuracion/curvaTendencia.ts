import { number } from "mathjs"

export interface ICurvaTendencia{
  idCurvaTendencia?:number,
  idEstacion?:number,
  idVigencia:number,
  idCalibracion:String,
  numeroCurva:String,
  fechaFin:String,
  fechaInicio:Date,
  usuario:String,
  nombreEstacion?:String,
  estado:String,
  caudal?:number,
  nivel?:number
}

export interface IObtenerDetalleNivelCaudalRequest {
    idEstacion : number,
    idEcuacion: number,
    fechaInicio : Date,
    fechaFin : Date,
    nombreCorriente : string,
}

export interface IObtenerDetalleNivelCaudalResponse {
  fecha_Curva: Date,
  valor_En_X: number,
  valor_En_Y: number,
  caudal: number,
  nivel: number,
  id_Curva_Nivel_Caudal_Detalle: number,
  id_Curva_Nivel_Caudal: number,
}

export interface selectCurva{
  id?:number,
  text?:String,
}

export interface IObtenerTablaAgregacionAnualRequest {
   codigoOperacion: number,
   idTipoElemento : number, 
   idElemento : number, 
   idEcuacion : number, 
   fechaInicio : Date,
   fechaFin : Date,
}

export interface IObtenerTablaAgregacionAnualResponse {
   ano : number;
   enero : number;
   febrero : number;
   marzo : number;
   abril : number;
   mayo : number;
   junio : number;
   julio : number;
   agosto : number;
   septiembre : number;
   octubre : number;
   noviembre : number;
   diciembre : number;
   maximo: number, 
   minimo: number, 
   promedio: number, 
}

export interface IObtenerTablaAgregacionMensualRequest {
   codigoOperacion : number,
   idTipoElemento : number,
   idElemento : number,
   idEcuacion : number,
   ano : number,
}

export interface IObtenerTablaAgregacionMensualResponse {
    mes : string,
    valorDia1 : number,
    valorDia2 : number,
    valorDia3 : number,
    valorDia4 : number,
    valorDia5 : number,
    valorDia6 : number,
    valorDia7 : number,
    valorDia8 : number,
    valorDia9 : number,
    valorDia10 : number,
    valorDia11 : number,
    valorDia12 : number,
    valorDia13 : number,
    valorDia14 : number,
    valorDia15 : number,
    valorDia16 : number,
    valorDia17 : number,
    valorDia18 : number,
    valorDia19 : number,
    valorDia20 : number,
    valorDia21 : number,
    valorDia22 : number,
    valorDia23 : number,
    valorDia24 : number,
    valorDia25 : number,
    valorDia26 : number,
    valorDia27 : number,
    valorDia28 : number,
    valorDia29 : number,
    valorDia30 : number,
    valorDia31 : number,
    maximo : number,
    minimo : number,
    promedio : number,
}

export interface IObtenerParametrosCurvaNivelCaudalRequest {
  estacionId : number, 
  periodoIds : number[], 
}

export interface IObtenerParametrosCurvaNivelCaudalResponse {
  parametroId: number, 
  parametroNombre: string, 
  periodoId: number, 
  periodoNombre: string, 
  unidadMedidaId: number, 
  unidadMedidaNombre: string, 
  parametroXEstacionId: number,
}
