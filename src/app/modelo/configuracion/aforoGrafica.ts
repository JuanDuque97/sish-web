export interface IAforoGrafica{
  elementoid:number,
  codigoEstacionIdeam?:number,
  idelemento?:number,
  CodigoEAAB:number,
  nombreCorriente:String,
  idDepartamento:number,
  idMunicipio:number,
  areaHidrografica:number,
  zonaHidrografica:number,
  subZonaHidrografica:number,
  cuenca:number,
  subCuenca:number,
  idAforo:number,
  fechaInicio:Date,
  fechaFin:Date,
  idEntidad:number,
  caudalParcial:number,
  aforador:number,
  microcuenca:number

}

export interface IAforoCudal{
  idTipoElemento?:number,
  nombreCorrientee?:String,
  codigoEAAB:String,
  fecha:String,
  municipio:String,
  radio_h:number,
  aforo_n:number,
  correntrometr:String,
  nivel:number,
  factor_g:number,
  ancho:number,
  departamento:String,
  periodo_h:number,
  velocidad_m:number,
  perimetro_m:number,
  profundidad:number,
  fechaFin:Date,
  idEntidad:number,
  caudalParcial:number,
  aforador:number,
  area:number
}




export interface IAforoConsulta{
  idAforo:String,
  aforador:number,
  aforo_n:String,
  caudal:String,
  fecha:String,
  estacion:number,
  id_estacion:number,
  radio_h:number,
  marca:String,
  nivel:number,
  perimetro_m:number,
  nombreCorriente:String
}

export interface IEcuaciones{
  id_informacion_ecuaciones: number,
  id_ecuacion: number,
  tramo: number,
  nivel_min: number,
  nivel_max: number,
  coeficiente: number,
  exponente: number,
  ho: number,
  ecuacion: number,
  flag_migracion: number,
  id_Estacion: number 
}

export interface Ecuacion{
  idElemento : number,
  idTipoElemento : number
}

export interface EcuacionResponse{
  idElemento : number,
  idTipoElemento : number, 
  ecuaciones: any[], 
}

