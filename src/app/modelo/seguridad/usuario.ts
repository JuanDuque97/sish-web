export interface Usuario {
    usuario: string,
    nombre: string,
    correo:string,
    permisos: Array<string>,
    roles: Array<string>,
    token: string
 }

 export class Login {
    username: string;
    password: string;
 }

 export class Login1 {
  username: string;
  password: string;
  rememberMe:Boolean;
}
