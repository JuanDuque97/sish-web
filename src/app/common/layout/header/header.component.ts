import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Login1 } from 'src/app/modelo/seguridad/usuario';
import Swal from 'sweetalert2';
import { ServiciosAutenticacionService } from '../../autenticacion/servicios-autenticacion.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})

export class HeaderComponent implements OnInit {

  usuario: Login1 = new Login1();
  visible:Boolean;

  //recordarme = false;

  constructor(private auth: ServiciosAutenticacionService,
    private router: Router) {
    // Esto es intencional
  }

  ngOnInit(): void {
    this.visible =  this.auth.estaAutenticado();

    // let myPerms = this.permisos;
    window.onload = function() {
      let usuarioDTO = sessionStorage.getItem('usuario');
      console.log('-- ---------------------------------------------');
      //console.log('Uusario autenticado: ' + usuarioDTO);
      console.log('Uusario-usuario: ' + sessionStorage.getItem('usuarioUsuario'));
      console.log('Uusario-nombre: ' + sessionStorage.getItem('usuarioNombre'));
      console.log('Uusario-correo: ' + sessionStorage.getItem('usuarioCorreo'));
      console.log('-- ---------------------------------------------');
    };

    // Esto es intencional
  }

  login(form: NgForm) {
    if (form.invalid) {
      return;
    }
    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      title: 'Espere por favor...',
    });

    Swal.showLoading();
    this.usuario.rememberMe = true;
    this.auth.datosSesion().subscribe((resp:any) => {

      if(resp){

        this.usuario.password = resp.grupo;
        this.usuario.username = resp.nombre;
        this.auth.autenticacion(this.usuario).subscribe(
          (response) => {
               sessionStorage.setItem('token', response.token1);
              Swal.close();
              console.log('response.permisos', response.permisos);


              sessionStorage.setItem('usuario', JSON.stringify(response));
              sessionStorage.setItem('usuarioUsuario', response.usuario);
              sessionStorage.setItem('usuarioNombre', response.nombre);
              sessionStorage.setItem('usuarioCorreo', response.correo);

              if ( null!=response.roles && undefined!=response.roles ) {
                for ( let index=0; index<response.roles.length; index++ ) {
                  sessionStorage.setItem('rol' + (index+1), response.roles[index]);
                }
              }

              if ( null!=response.permisos && undefined!=response.permisos ) {
                response.permisos.forEach((permiso:any) => {
                  sessionStorage.setItem(permiso, permiso);
                });
              }
              window.location.reload();

          },
          (err) => {
            Swal.fire({
              allowOutsideClick: false,
              icon: 'error',
              title: 'Error al autenticar',
              text: err.error.error.message,
            });
          }

        );


      }else{

        Swal.fire({
          allowOutsideClick: false,
          icon: 'error',
          title: 'No tienes permisos para ingresar!!',
          text: "Ingresa por el portal 'https://www.acueducto.com.co'",
        });

      }


    });


  }


  /**Obtiene el usuario autenticado */
  obtenerUsuarioAutenticado() {
    try {
      this.auth.obtenerUsuarioAutenticado().subscribe((response) => {


        console.log('response.permisos', response.permisos);


        sessionStorage.setItem('usuario', JSON.stringify(response));
        sessionStorage.setItem('usuarioUsuario', response.usuario);
        sessionStorage.setItem('usuarioNombre', response.nombre);
        sessionStorage.setItem('usuarioCorreo', response.correo);

        if ( null!=response.roles && undefined!=response.roles ) {
          for ( let index=0; index<response.roles.length; index++ ) {
            sessionStorage.setItem('rol' + (index+1), response.roles[index]);
          }
        }

        if ( null!=response.permisos && undefined!=response.permisos ) {
          response.permisos.forEach(permiso => {
            sessionStorage.setItem(permiso, permiso);
          });
        }

        window.location.reload();
      });
    } catch (error) {
      console.error('error obtenerUsuarioAutenticado', error);
    }
  }
}
