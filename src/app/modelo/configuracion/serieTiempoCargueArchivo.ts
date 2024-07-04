export interface ISerieTiempoCargueArchivo
 {
  idSerieTiempoCargueArchivo: number;
  nombreArchivo: string;
  totalRegistrosLeidos: number;
  totalRegistrosCargados: number;
  idElemento: number;
  idEstado: number;
  idSerieTiempoElemento:number;
  activo?:string;
  fechaEstado?:string;
  usuarioEstado?:string;
}