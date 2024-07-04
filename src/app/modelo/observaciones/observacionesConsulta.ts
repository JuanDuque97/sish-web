import { IEstacion } from 'src/app/modelo/configuracion/estacion';
import { IParametro } from 'src/app/modelo/configuracion/parametro';


export interface IObservacionesConsulta{
  map(arg0: (p: { [x: string]: any; idParametroXEstacion: any; }) => { [x: string]: any; idParametroXEstacion: any; }): any; 
  map(arg0: (p: { [x: string]: any; idParametroXEmbalse: any; }) => { [x: string]: any; idParametroXEmbalse: any; }): any; 
  map(arg0: (p: { [x: string]: any; idParametroXPozo: any; }) => { [x: string]: any; idParametroXPozo: any; }): any; 
  
     idDepartamento: string,
     idMunicipio: string,
     areaHidrografica: string,
     zonaHidrografica: string,
     subZonaHidrografica: string,
     cuenca: string,
     subCuenca: string,
     microcuenca: string,
     idEntidad:string,
     idParametro: string,
     idFrecuencia: string,
     codigoIdeam: string,
     codigoEaab: string,
     codigo:string,
     nombreElemento: string,
     fechaInicio: string,
     fechaFin: string,
     validarCalidad: string,
     elemento: string,
     idElementoString:string,
     listaElementosDestacados:[IEstacion],
    listaParametrosCorrelacionado: [IParametro],
    periodo:boolean,
    listParametroXElemento: [
        {
            id: number
        } 
    ]
}