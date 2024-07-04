import { Component, OnInit, ViewChild } from '@angular/core';
import { estados } from 'src/app/common/utils/constantes';
import { accionesTablasEnum } from 'src/app/modelo/enum/acciones-tablas-enum';
import { IPermiso } from 'src/app/modelo/seguridad/permiso';
import { DataTableDirective } from 'angular-datatables';
import { ServiciosPermisos } from '../servicios-permisos.service';
import { MetodosGlobales } from 'src/app/common/utils/metodos-globales';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-consultar-permisos',
  templateUrl: './consultar-permisos.component.html',
})

export class ConsultarPermisosComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })

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

  dtOptions: any = {};
  datatableElement!: DataTableDirective;

  rutaGeneral = 'configuracion/seguridad/permisos/0';
  rutaConsulta = 'configuracion/seguridad/permisos/';
  rutaEdicion = 'configuracion/seguridad/permisos/';

  datosFilter = [] as any;

  columnas = [
    {
      title: 'ID',
      data: 'idPermiso',
      visible: false,
    },
    {
      title: 'Permisos',
      data: 'permiso',
      filter: true,
      filterValue: '',
      tipo: 'texto',
    },
    {
      title: 'Descripción',
      data: 'descripcion',
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
      title: 'Fecha Estado',
      data: 'fechaEstado',
      class: 'text-center',
      visible: false,
    },
    {
      title: 'Usuario Estado',
      data: 'usuarioEstado',
      class: 'text-center',
      visible: false,
    },
  ];

  constructor(private serciciopermisos: ServiciosPermisos) {

  }

  ngOnInit(): void {
    this.obtener();
  }

  obtener() {
    Swal.fire({
      title: 'Cargando información...',
      html: 'Por favor espere',
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: async () => {
        Swal.showLoading();

        //this.serciciopermisos.obtener().subscribe((response) => {
        this.serciciopermisos.obtenerPermisos().subscribe((response) => {
          this.datosFilter = response;

          this.datosFilter.forEach( (dato : any) => {
            dato.activo = dato.activo === 'S' ? 'Sí' : 'No';
          });

          Swal.close();
        });
      },
      willClose: async () => {
        Swal.hideLoading();
      }
    });
  }

  accionRegistro(e: any) {
    switch (e.accion) {
      case accionesTablasEnum.Activar: {
        let permiso: IPermiso = e.registro;
        permiso.activo = estados.activo;
        this.actualizar(permiso);
        //statements;
        break;
      }

      case accionesTablasEnum.Inactivar: {
        let permiso: IPermiso = e.registro;
        permiso.activo = estados.inactivo;
        this.actualizar(permiso);
        break;
      }
    }
  }

  actualizar(permiso: IPermiso) {
    this.serciciopermisos.actualizar(permiso).subscribe((response) => {
      console.log(response);
      this.obtener();
    });
  }

  public validarPermiso(permiso: any): boolean {
    return MetodosGlobales.validarPermiso(permiso);
  }
}
