export interface IValorConsulta {
  map(arg0: (observ: any) => any): any[];
  idEstacion: number,
  valor: number,
  fecha: string,
  codigo: number,
  fechaFin1: string,
  fechaInicio1: string,
  fechaFinal: string,
  fechaInicial: string,
  idElemento: string,
  idOperacion: number,
  idFrecuencia: number,
}

export interface IPruebaBondadGeneralRequest {
  codigo: number,
  fechaFin: string, 
  fechaInicio: string, 
  idElemento: string, 
  idOperacion: number, 
  idFrecuencia : number,
}

export interface IResultadoPrueba{
  fechaCalculada: number,
  valorEsperado: number
}

export interface limiteSuperior {
  limiteSuperior:any
}

export interface IPruebaBondadGeneralResponse {
  fechaCalculada: string,
  promedio: number,
  valorEsperado: number,
  valor: number,
  valorObservado: number,
  valorMaximo: number,
  valorMinimo: number,
  valorRango: number,
  valorCantidad: number,
  valorRaiz: number,
  valorTamanoIntervalo: number,
  valorDesviacion: number,
  intervalo: number;
  LimiteInferior: number;
  LimiteSuperior: number;
  frecuenciaObservada: number;
  limiteSuperior: number;
  estadistico: number;
}

export interface IVCramerResponse {
  map(arg0: (observ: any) => any): any;
  resultado : number,
}




export interface IVCramerRequest {
  valoresEsperados : number[], 
  valoresObservados: number[];
  promedios: number[], 
  nivelSignificancia: number,
  codigoFuncionDistribucion : number,
}
