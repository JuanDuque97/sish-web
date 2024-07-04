export interface IRol {
    idRol: number;
    rol: string;
    descripcion: string;
    activo:string,
    fechaCreacion: string,
    fechaModificacion: string,
    fechaEstado: string,
    usuarioCreacion:string,
    usuarioModificacion: string,
    usuarioEstado: string
 }

 export interface IPermisoXRol{
     idPermisoXRol:number;
     idRol:number;
     idPermiso:number;
 }
 
 export interface IObtenerPermisosRequest {
    roles: any[], 
 }

 export interface IObtenerPermisosResponse {
    permisos: any[], 
 }
