 
export interface IArchivosConfigurados {
  idTipoArchivoConfigurado: number;
  tipoarchivoconfigurado: number;
  idTipoArchivo: number;
  idTipoFraccionamiento: number;
  idUbicacionDatos: number;
  separador: string;
  calificadorTexto: string;
  contieneEncabezado: string;
  contieneResumen: string;
  separadorDecimal: string;
  idFrecuenciaTemporal: number;
  intervaloFrecuenciaTemporal: number;
  idTipoCodificacion: number;
  activo: string;
  fechaCreacion: string;
  fechaEstado: string;
  fechaModificacion: string;
  usuarioCreacion: string;
  usuarioEstado: string;
  usuarioModificacion: string;
  calificacionTexto:string
}

export interface IArchivosConfiguradosDTO{

     fechaCreacion : string;
     idTipoArchivo: number;
     idTipoFraccionamiento: number;
     idUbicacionDatos: number;
     separador : string;
     contieneEncabezado: string;
     contieneResumen: string;
     separadorDecimal : string;
     idFrecuenciaTemporal: number;
     intervaloFrecuenciaTemporal : string;
     idTipoCodificacion:number;
     activo: string;
     fechaEstado: string;
     usuarioEstado : string;
     fechaModificacion: string;
     usuarioCreacion : string;
     usuarioModificacion : string;
     calificadorTexto : string;
     tipoCodificacion: string;
     tipoFraccionamiento: string;
     frecuenciaTemporal: string;
     tipoArchivo: string;
     ubicacionDatos: string;
     idTipoArchivoConfigurado : number;
     tipoArchivoConfigurado : string;

  }
 