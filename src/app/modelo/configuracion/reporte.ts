export interface reporteEstructura{
    
       activo:string,
       // codElemento: number,
       codReporte: number,
       descripcion:string,
       EntidadSolicita:string,
       estructura: string,
       fechaCreacion:string,
       fechaentrega:string,
       fechaModificacion:string,
       idEstructura: number,
       idPeriodo: number,
       idTipoElemento: number,
       idtipoReporte: number,
       nombreReporte:string,
       usuarioCreacion:string,
       usuarioModificacion:string,
       listElemento:any,
       listParametros:any,
     
}

export interface reporteDato{
    
       activo:string,
       // codElemento: number,
       codReporte: number,
       descripcion:string,
       EntidadSolicita:string,
       estructura: string,
       fechaCreacion:string,
       fechaentrega:string,
       fechaModificacion:string,
       idEstructura: number,
       idPeriodo: number,
       idTipoElemento: number,
       idtipoReporte: number,
       nombreReporte:string,
       usuarioCreacion:string,
       usuarioModificacion:string,
       listElemento:any,
       listParametros:any,
     
}

export interface ReporteCaudalesAforadosRequest {
       idEstaciones : any[], 
       fechaInicio : any,
       fechaFin : any, 
}

export interface ReporteCaudalesAforadosResponse {
       idAforo: any, 
       estacion: any, 
       fecha: any, 
       hora: any, 
       minutos: any, 
       caudal: any,
       tipoAforo: any, 
}

export interface ReporteFuentesSuperficialesRequest {
       ano : number, 
       idEstacion : number,
}
export interface ReporteFuentesSuperficialesRequestFechasMax {
       valorMaximo: number,
       idEstacion : number,
       ano: number
}
export interface ReporteFuentesSuperficialesResponseFechaMax {
       fechaMaximaDia : Date
}
export interface ReporteFuentesSuperficialesResponseFechaMin {
       fechaMinimaDia: Date
}
export interface ReporteFuentesSuperficialesRequestFechasMin {
       valorMinimo:number,
       idEstacion : number,
       ano: number
}

export interface ObtenerValorMaximoHorasRequest{
       idEstacion : number,
       fecha: string
}

export interface ObtenerValorMaximoHorasResponse{
       maximoHora : number
}

export interface ReporteFuentesSuperficialesResponse {
       id : number,
       dia : string,
       valorEnero : number,
       valorFebrero : number,
       valorMarzo : number,
       valorAbril : number,
       valorMayo : number,
       valorJunio : number,
       valorJulio : number,
       valorAgosto : number,
       valorSeptiembre : number,
       valorOctubre : number,
       valorNoviembre : number,
       valorDiciembre : number,
       valorPromedioAnual : number, 
       valorMaximoAnual : number, 
       valorMinimoAnual : number,
       valorMaximoHora : number, 
       valorMinimoHora : number,  
}

export interface ReportePrecipitacionRequest {
       fechaInicio: any,
       fechaFin: any,
       idEstaciones: any[],
}

export interface ReportePrecipitacionResponse {
       idEstacion: any,
       fecha : any,
       valor : any;
       descripcion: any;
       codigo: any;
}
