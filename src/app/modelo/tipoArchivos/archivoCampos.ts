export interface IArchivoCampo{
    campoRelacionado:string,
    codigoPropiedad:string,
    idParametro:number,
    idTipoArchivoCampo:number,
    idTipoArchivoColumna:number,
    idTipoArchivoColumnaPropiedad:number,
    idTipoArchivoConfigurado:number
}
export interface IArchivoCampoDTO{
 

    tipoArchivoColumna  :string;
    idParametro  :number;
    idTipoArchivoConfigurado  :number;
    idTipoArchivoColumna  :number;
    idTipoArchivoCampo  :number;
    tipoArchivoConfigurado   :string;
    descripcion   :string;
    idTipoArchivoColumnaPropiedad  :number;
    codigoPropiedad   :string;
    campoRelacionado   :string;
  

}