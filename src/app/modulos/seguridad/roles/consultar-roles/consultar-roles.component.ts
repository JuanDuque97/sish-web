import { Component, OnInit } from '@angular/core';
import { ServiciosRolesService } from '../servicios-roles.service';
import { accionesTablasEnum } from 'src/app/modelo/enum/acciones-tablas-enum';
import { IRol } from 'src/app/modelo/seguridad/rol';
import { estados } from 'src/app/common/utils/constantes';
import { Router } from '@angular/router';
import { MetodosGlobales } from 'src/app/common/utils/metodos-globales';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-consultar-roles',
  templateUrl: './consultar-roles.component.html',
})

export class ConsultarRolesComponent implements OnInit {

  private toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
  });

  rutaGeneral = 'configuracion/seguridad/roles/0';
  rutaConsulta = 'configuracion/seguridad/roles/';
  rutaEdicion = 'configuracion/seguridad/roles/';

  datosFilter = [] as any;

  columnas = [
    {
      title: 'ID',
      data: 'idRol',
      visible: false,
      //filter: true,
      filterValueMin: '',
      filterValueMax: '',
      tipo: 'rangoNumero',
    },
    {
      title: 'Rol',
      data: 'rol',
      filter: true,
      filterValue: '',
      tipo: 'texto',
    },
    {
      title: 'Descripción',
      data: 'descripcion',
      filter: true,
      filterValue: '',
      tipo: 'texto',
    },
    {
      title: 'Activo',
      data: 'activo',
      class: 'text-center',
      filter: true,
      filterValue: '',
      tipo: 'seleccion',
    },
    {
      title: 'Creado',
      data: 'fechaCreacion',
      class: 'text-center',
      visible: false,
    },
    {
      title: 'Modificado',
      data: 'fechaModificacion',
      class: 'text-center',
      visible: false,
    },
  ];
  
  botones = [
    {
      class: 'sish-boton-azul',
      title: 'Permisos',
      action: 'permisos',
      icon: 'fas fa-tasks', 
    },
  ];

  constructor(
    private router: Router,
    private serviciosRolesService: ServiciosRolesService
  ) { 

  }

  ngOnInit(): void {
    this.obtener(() => {});
  }

  obtener(onSuccess : Function) {
    Swal.fire({
      title: 'Cargando...',
      html: 'Por favor espere.',
      timer: 42000,
      timerProgressBar: true,
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: async () => {
        Swal.showLoading();

        this.serviciosRolesService.obtener().subscribe((response) => {
          this.datosFilter = response;

          this.datosFilter.forEach( (dato : any) => {
            dato.activo = dato.activo === 'S' ? 'Sí' : 'No';
          });

          if ( null != onSuccess ) {
            onSuccess();
          }
          Swal.close();
        });
      },
      willClose: async () => {
        Swal.hideLoading();
      }
    });
  }

  mostrarResultadoAlActualizar(accion : accionesTablasEnum) {
    let mensaje = '';

    switch (accion) {
      case accionesTablasEnum.Activar:
        mensaje = 'El registro se activó exitosamente!';
        break;

      case accionesTablasEnum.Inactivar:
        mensaje = 'El registro se inactivó exitosamente!';
        break;

      case accionesTablasEnum.Eliminar:
        mensaje = 'El registro se eleiminó exitosamente!';
        break;

      default:
        mensaje = '';
        break;
    }

    this.toast.fire({
      icon: 'success', 
      title: mensaje,
    });
  }

  actualizar(rol: IRol, accion : accionesTablasEnum) {
    Swal.fire({
      title: 'Cargando información...',
      html: 'Por favor espere',
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: async () => {
        Swal.showLoading();

        this.serviciosRolesService.actualizar(rol).subscribe((response) => {
          console.log(response);
          Swal.close();

          this.obtener(() => {
            this.mostrarResultadoAlActualizar(accion);
          });
        });
      }, 
      willClose: async () => {
        Swal.hideLoading();
      },
    });
  }

  accionRegistro(e: any) {
    switch (e.accion) {
      case accionesTablasEnum.Activar: {
        let rol: IRol = e.registro;
        rol.activo = estados.activo;
        this.actualizar(rol, e.accion);
        //statements;
        break;
      }

      case accionesTablasEnum.Inactivar: {
        let rol: IRol = e.registro;
        rol.activo = estados.inactivo;
        this.actualizar(rol, e.accion);
        break;
      }

      case accionesTablasEnum.Eliminar: {
        //statements;
        break;
      }

      case 'permisos': {
        let rol: IRol = e.registro;
        this.router.navigate([
          'configuracion/seguridad/roles/permisos/' + rol.idRol,
        ]);
        break;
      }

      default: {
        break;
      }
    }
  }

  // Validacion de permisos 
  public validarPermiso(permiso: any): boolean {
    return MetodosGlobales.validarPermiso(permiso);
  }
}
