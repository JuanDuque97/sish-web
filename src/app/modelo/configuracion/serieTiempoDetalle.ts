export interface ISerieTiempoDetalle{
  idSerieTiempoDetalle?: number;
  valor: number;
  fecha: Date;
  hora: string;
  idFlag: number;
  idTipoFormato: number;
  idSerieTiempoElemento: number;
  flagInsert: number;
  idEstación:number;
  idSerieTiempoCargueArchivo?:number;
  anio?:number;
  mes?:number;
  dia?:number;
}