import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ServiciosAutenticacionService } from './common/autenticacion/servicios-autenticacion.service';
import { Login1 } from './modelo/seguridad/usuario';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'sish-frontend';
  langs: string[] = [];


  constructor(public trasnlate: TranslateService,
    public serviciosAutenticacionService: ServiciosAutenticacionService) {
    // this.autenticacion();
    this.trasnlate.addLangs(['es', 'en']);
    this.trasnlate.setDefaultLang('es');
    this.trasnlate.use('es');
    this.langs = this.trasnlate.getLangs();
  }

  ngOnInit(): void {

    // Esto es intencional
  }
  /**Obtiene el usuario autenticado */
  obtenerUsuarioAutenticado() {
    try {

      this.serviciosAutenticacionService
        .obtenerUsuarioAutenticado()
        .subscribe((response) => {
          sessionStorage.setItem('usuario', JSON.stringify(response));

          let permisos = response.permisos;
          if ( null!=permisos && undefined!=permisos ) {
            permisos.forEach(permiso => {
              sessionStorage.setItem(permiso, permiso);
            });
          }
        });
    } catch (error) {
      console.log("error obtenerUsuarioAutenticado", error)
    }
  }

  /**Autentica al usuario */
  autenticacion() {

    const usuario: string = sessionStorage.getItem('usuario') || "";
    if (usuario) {
      return;
    }
   alert(4);
    const login: Login1 = {
      "password": "Acueducto2023*",
      "username": "SISH1",
      "rememberMe": true
    }

    this.serviciosAutenticacionService
      .autenticacion(login)
      .subscribe((response) => {
        sessionStorage.setItem('token', response.token);
        this.obtenerUsuarioAutenticado();
      });
  }



}
