
export class MetodosGlobales {

  public static validarPermiso(permiso: any): boolean {
    
    let uPermiso = sessionStorage.getItem(permiso);

    if ( null==uPermiso || undefined==uPermiso ) {
      return false;
    }

    return true;
  }

  public fechaActual(){
    return Date.now();
  }
}
