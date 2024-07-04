import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { MetodosGlobales } from 'src/app/common/utils/metodos-globales';
import { ServiciosCapasService } from '../servicios-capas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-consultar-capas',
  templateUrl: './consultar-capas.component.html',
})
export class ConsultarCapasComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })

  rutaGeneral = '';
  rutaConsulta = 'configuracion/capas/V/';
  rutaEdicion = 'configuracion/capas/E/';

  datosFilter = [] as any;

  datatableElement: DataTableDirective | undefined;

  dtOptions: any = {};
  columnas = [
    {
      title: 'id',
      data: 'idCapa',
      visible: false,
      filterValueMin: '',
      filterValueMax: '',
      tipo: 'rangoNumero',
    },

    {
      title: 'Capa',
      data: 'capa',
      class: 'text-center',
      filter: true,
      filterValue: '',
      tipo: 'texto',
    },
    {
      title: 'Identificador',
      data: 'identificador',
      class: 'text-center',
      filter: true,
      filterValue: '',
      tipo: 'texto',
    },
    {
      title: 'Nombre servicio',
      data: 'nombreServicio',
      class: 'text-center',
      filter: true,
      filterValue: '',
      tipo: 'texto',
    },

    {
      title: 'fechaCreacion',
      data: 'fechaCreacion',
      class: 'text-center',
      visible: false,
    },
    {
      title: 'fechaModificacion',
      data: 'fechaModificacion',
      class: 'text-center',
      visible: false,
    },
    {
      title: 'usuarioCreacion',
      data: 'usuarioCreacion',
      class: 'text-center',
      visible: false,
    },
    {
      title: 'usuarioModificacion',
      data: 'usuarioModificacion',
      class: 'text-center',
      visible: false,
    },

    {
      title: 'urlVisualizar',
      data: 'urlVisualizar',
      class: 'text-center',

      visible: false,
    },
    {
      title: 'urlCrear',
      data: 'urlCrear',
      class: 'text-center',
      visible: false,
    },
    {
      title: 'urlActualizar',
      data: 'urlActualizar',
      class: 'text-center',
      visible: false,
    },
    {
      title: 'urlBorrar',
      data: 'urlBorrar',
      class: 'text-center',
      visible: false,
    },
    {
      title: 'urlConsulta',
      data: 'urlConsulta',
      class: 'text-center',

      visible: false,
    },
  ];

  constructor(private serviciosCapasService: ServiciosCapasService) {
    // Esto es intencional
  }

  ngOnInit(): void {
    this.obtener();
  }

  obtener() {
    Swal.fire({
      title: 'Cargando...',
      html: 'Por favor espere.',
      timer: 42000,
      timerProgressBar: true,
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: async () => {
        Swal.showLoading();
        this.serviciosCapasService.obtener().subscribe((response) => {
          this.datosFilter = response;
          Swal.close();
        });
      },
      willClose: async () => {
        Swal.hideLoading();
      }
    });
  }

  // Validacion de permisos
  public validarPermiso(permiso: any): boolean {
    return MetodosGlobales.validarPermiso(permiso);
  }
}
