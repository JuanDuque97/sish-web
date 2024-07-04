export interface ICriterioValidacion{

  idCriterioValidacion:number,
  criterioValidacion:string,
  descripcion:string,
  global:number,
  idParametro:number,
  idTipoDato:number
}

export interface IParametrosCriterio{
  
  idCriterio: number,
  idParametro: number,
  idParametroXCriterio: number
}
export interface IValorParametroXCriterio{
  idValoresCalidad: number,
  idParametroXCriterio: number,
  valor1: number,
  valor2: number,
  valor3: number,
  fechaVigencia: string,
  fechaCreacion: string
}