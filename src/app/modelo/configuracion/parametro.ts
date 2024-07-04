export interface  IParametro{ 
    idParametro: number,
    idVariable:number,
    activo:string,
    codigo:string,
    descripcion:string,
    fechaCreacion:string,
    fechaEstado:string,
    fechaModificacion:string,
    idMetodo: number,
    idTipoParametro: number,
    idFrecuencia: number,
    idUnidadMedida: number,
    usuarioCreacion:string,
    usuarioEstado:string,
    usuarioModificacion:string 
    codigoOrigen:number,
    idPeriodo: number,
    idCategoria: number,
 }
 
 export interface  IParametroDto{ 
    idParametro: number,
    activo:string,
    codigo:number,
    descripcion:string,
    fechaCreacion:string,
    fechaEstado:string,
    fechaModificacion:string,
    idMetodo: number,
    idTipoParametro: number,
    idUnidadMedida: number,
    parametro:string,
    categoria:string,
    usuarioCreacion:string,
    usuarioEstado:string,
    usuarioModificacion:string,
    nombreMetodo: string,
    nombreTipoParametro: string,
    nombreUnidadMedida: string,
    unidadMedida:string,
    idPeriodo: number,
    idCategoria:number
 }
 
 
 export interface IMetodoTipoParametro{
    tipoParametro :string,
    metodo:string,
    idTipoParametro:number,
    idMetodo:number,
    idMetodoXTipoParametro:number,
 
 }