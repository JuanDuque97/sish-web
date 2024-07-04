import { Component, OnInit } from '@angular/core';
import { MetodosGlobales } from '../../utils/metodos-globales';

@Component({
  selector: 'app-menu-izquierdo',
  templateUrl: './menu-izquierdo.component.html'
})
export class MenuIzquierdoComponent implements OnInit {

  public userMail : any = '';

  constructor() { 
    // Esto es intencional
  }

  ngOnInit(): void {
    // Esto es intencional
    this.userMail = sessionStorage.getItem('usuarioUsuario');
  }

  // Validacion de permisos 
  public validarPermiso(permiso: any): boolean {
    return MetodosGlobales.validarPermiso(permiso);
  }
}
