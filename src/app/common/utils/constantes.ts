import { environment } from "src/environments/environment";

export const CONFIG = {
    WS_END_POINT: environment.apiRest,

}
export const estados = {
    activo: "S",
    inactivo: "N",

}
export const OrigenObservacion = {
     	Scada:263	,
    	Migración:264	,
    	Manual:262	,
    	ArchivoScada:261	,
 

}
export const estadosVector = [
    {
        id: estados.activo,
        text: 'Activo'
    },
    {
        id: estados.inactivo,
        text: 'Inactivo'
    }
]
export const ConfirmacionVector = [
    {
        id: estados.activo,
        text: 'SI'
    },
    {
        id: estados.inactivo,
        text: 'No'
    }
]