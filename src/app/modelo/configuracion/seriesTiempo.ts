export interface IserieTiempoElemento {
  activo: String;
  codigoEaab: String;
  codigoIdeam: String;
  fechaCreacion: String;
  fechaEstado: String;
  fechaModificacion: String;
  idElemento: number;
  idFrecuencia: number;
  idMecanismo: number;
  idParametroXElemento: number;
  idSerieTiempoElemento: number;
  idTipoRegistro: number;
  usuarioCreacion: String;
  usuarioEstado: String;
  usuarioModificacion: String;
  idTipoElemento: number;
  flagInsert:string,
  fechaInicio:string,
  fechaFin:string,
  conceptivo: number;

}
export interface IserieTiempoDetalle {
  fecha: string
  hora:String
  idFlag: number,
  flagObservacion:string,
  idSerieTiempoDetalle: number,
  idSerieTiempoElemento: number,
  idTipoFormato: number,
  valor: number,
  anio:number,
  dia:number,
  mes:number
}
export interface IserieTiempoPromedioAnio {
 
      anio: number,
      idSerieTiempoElemento: number,
      mes: number,
      promedio: number,
      valorMaximo: number,
      valorMinimo: 0
   
}
 

export interface IserieConsultaDTO{
  
  activo: string,
  areaHidrografica: string,
  categoria: string,
  condicion: string,
  cotaBoca: number,
  cotaMedidor: number,
  cuenca: string,
  departamento: string,
  fechaCreacion: string,
  fechaEstado: string
  fechaInicioOperacion:string,
  fechaModificacion: string,
  idAreaHidrografica: number
  idCategoria: number
  idCondicion: number
  idCuenca: number,
  idDepartamento: number
  idMicroCuenca: number
  idMunicipio: number
  idPozo: number
  idSubCuenca: number
  idSubZonaHidrografica: number
  idTipoCoordenada: number
  idTipoPozo: number
  idZonaHidrografica: number
  latitud: number
  longitud: number
  microcuenca: string,
  municipio: string,
  nivelSubsiguiente: string,
  pozo: string,
  profundidad: number
  subCuenca: string,
  subZonaHidrografica: string,
  tipoCoordenada: string,
  tipoPozo: string,
  usuarioCreacion: number
  usuarioEstado: number
  usuarioModificacion:string,
  zonaHidrografica: string,
  zonaOperativaEaab: string,
  Elementos: string,
 Parametros: number,
 conceptivo: number,
  
}
export interface IserieConsulta{
  
    areaHidrografica: string;
    cuenca: string;
    idDepartamento: number,
    idEntidad: string;
    idMunicipio: string;
    listParametros: [
      id:number
    ],
    listaElementos: [
      id:number
    ],
    microcuenca: string;
    subCuenca: string;
    subZonaHidrografica: string;

    zonaHidrografica:string
    tipoElemento: number;
    Elementos: string;
    Parametros: number;
}

 