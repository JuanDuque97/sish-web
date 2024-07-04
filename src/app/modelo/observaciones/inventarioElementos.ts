export interface IinventarioElementos
  {
    descripcion: string,
    elemento: string,
    faltante: number,
    fecha: string,
    frecuencia: string,
    idElemento: number,
    idPeriodo: number,
    total: number, 
    porcentaje: number,
    datosSegunFrecuencia: number, 
    fechaInicio: any, 
    fechaFin: any,
    codigoParametros: number[], 
  }

  export interface IrequesInventario
  {
    fechaFin:string,
    fechaInicio: string,
    idElemento: number,
    codigoParametros: any[],
  }
