import { number } from "@stdlib/stdlib/docs/types"

export interface IAforo{

    idAforo?:number,
    idTipoAforo:number,
    idTipoElemento:number,
    idElemento:number,
    codigoEAAB:string,
    codigoIDEAM:string,
    nombreCorriente:string,
    nombreAforo:string,
    fecha:Date,
    horaInicial:Date,
    horaFinal:Date,
    nivelInicial:number,
    nivelFinal:number,
    idMetodoMedicion:number,
    idAforoAforador:number,
    //observacion:string,
    observaciones:string,
    //adjunto:string,
    flagMigracion:string,
    numeroAforo:number,
    anio:number,
    activo?:string,
    caudalTotal?:number,
    areaTotal?:number,
    idMecanismo?:number,
    estacion:string, 
    pozo:string, 
    embalse:string,
    aforador: string,
    longitud: string,
    latitud: string,
    norte: string,
    este: string,
    idEquipo: string,
    idMetodoM: string,
    idHelice: string,
    constanteEquipo: string,
    ecuacion: string,
    norteMayor: string,
    norteMenor: string,
    coeficionte: string,
    idTipoCoordenadas?:number
    idespejo?:number
    idMolinete?:number
    nombreElemento:string
    
};
export interface IAforoFiltro{
    codigoEstacionEaab:number,
    idAforo?:number,
    idTipoAforo:number,
    idTipoElemento:number,
    idElemento:number,
    codigoEAAB:number,
    codigoIDEAM:number,
    nombreCorriente:number,
    nombreAforo:number,
    fecha:string,
    fechaFin:string,
    fechaInicio:string,
    nivelInicial:number,
    nivelFinal:number,
    idMetodoMedicion:number,
    idAforoAforador:number,
    metodoMedicion:number,
    //observacion:string,
    observaciones:string,
    medotoMedicion:number,
    flagMigracion:string,
    numeroAforo:number,
    anio:number,
    activo?:string,
    caudalTotal?:number,
    areaTotal?:number,
    idMecanismo?:number,
    estacion:string, 
    pozo:string, 
    embalse:string,
    aforador: number,
    longitud: string,
    latitud: string,
    norte: string,
    este: string,
    idEquipo: string,
    idMetodoM: string,
    idHelice: string,
    constanteEquipo: string,
    ecuacion: string,
    norteMayor: string,
    norteMenor: string,
    coeficionte: string,
    idelemento?:number
    idespejo?:number
    idMolinete?:number
    nombreElemento:number
    
};
export interface IAforoView{
    tipoCoordenadas?:string,
    idTipoCorrentometro?:string,
    idAforo?:string,
    idTipoAforo:number,
    idTipoElemento:number,
    idElemento:number,
    codigoEAAB:string,
    codigoIDEAM:string,
    nombreCorriente:string,
   // nombreAforo:string,
    fecha:Date,
    horaInicial:Date,
    horaFinal:Date,
    nivelInicial:number,
    nivelFinal:number,
    idAforoAforador:number,
    //observacion:string,
    observaciones:string,
    //adjunto:string,
    //flagMigracion:string,
    //numeroAforo:number,
    //anio:number,
    //activo?:string,
    //caudalTotal?:number,
    //areaTotal?:number,
    idMecanismo?:number,
    idHelice?:number,
    idMetodoMedicion?:number,
    aforador: string,
    longitud: string,
    latitud: string,
    norte: string,
    este: string,
    idEquipo: string,
    idMetodoM: string,
    constanteEquipo: string,
    ecuacion: string,
    norteMayor: string,
    norteMenor: string,
    coeficionte: string,
    idTipoCoordenadas?:number
    idespejo?:number
    idMolinete?:number
    nombreElemento:string
    //nombreMolinete:string
    //helice:string
    //numeroRevolucionesMin?:string
    //numeroRevolucionesMax?:string
    
};

export interface IAforoArchivo{
    idAforoArchivo?:number,
    nombreArchivo:string,
    idAforo:number,
    archivo?:string,
};

export interface IAforoDato{
    idAforo?:number,
    idAforoDato?:number,
    abscisa:number,
    profundidadTotal:number,
    profundidadObservada:number,
    profundidadA:number,
    revoluciones:number,
    tiempo:number,
    numeroRevoluciones:number,
    velocidad:number,
    valorMV:number,
    velocidadMedia:number,
    area:number,
    caudalParcial:number,
    activo?:string,
}

export interface IAforoPunto{

    idAforoPunto?:number,
    idAforo:number,
    espejoAgua:string,
    idTipoCoordenadas:number,
    idTipoCorrentometro?:number,
    latitud:number,
    longitud:number,
    coordenadasX:number,
    coordenadasY:number,
    idMolinete:number,
    activo:string,
}
export interface AforoNumeroDTO{
    idAforo:number,
    numeroAforo:number
}


export interface TipoAforoDTO{
    id_dominio_valor:number,
    dominio_valor:string
}
export interface IAfotoCantidad{
    cantidad:number,
}



export interface IAforador{
    idAforoAforador:number,
    codigo:number,
    nombre:string,
}
export interface AforoDTO {
  idAforo: number;
  idTipoElemento: number;
  idElemento: number;
  codigoEAAB: string;
  flagMigracion: number;
  idTipoAforo: number;
  nombreCorriente: string;
  dominioValor: string;
  fecha: string;
  nombre: string;
  codigoIDEAM: string;
  areaTotal?: any;
  caudalTotal?: any;
}

export interface IAforoCalculo {
  ancho: number;
  area: number;
  caudal: number;
  factorGeometrico: number;
  factorHidraulico: number;
  fechaCreacion?: string;
  fechaModificacion?: string;
  idAforo: number;
  idAforoCalculo?: number;
  nivelMedio: number;
  perimetroHumedo: number;
  profundidadMedia: string;
  radioHidraulico: number;
  usuarioCreacion?: string;
  usuarioModificacion?: string;
  velocidadMedia: number;
}

export interface IObtenerCurvaDuracionRequestDTO {
    tipoElementoId: number, 
    elementoId: number, 
    parametroId: number, 
    fechaInicio: Date, 
    fechaFin: Date,
}

export interface IObtenerCurvaDuracionResponseDTO {
    porcentaje: number, 
    caudal: number,
}
