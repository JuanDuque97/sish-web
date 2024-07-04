import { Component, OnInit } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { MetodosGlobales } from 'src/app/common/utils/metodos-globales';
import { ServiciosCriteriosAceptacion } from '../servicios-gestion-criterios.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-consultar-cirterios',
  templateUrl: './consultar-cirterios.component.html'
})
export class ConsultarCirteriosComponent implements OnInit {

  rutaGeneral = 'configuracion/gestionCriterios/C/0';
  rutaConsulta = 'configuracion/gestionCriterios/V/';
  rutaEdicion = 'configuracion/gestionCriterios/E/';

  datosFilter = [] as any;

  datatableElement: DataTableDirective | undefined;

  dtOptions: any = {};
  columnas = [
    {
      title: 'id',
      data: 'idCriterio',
      visible: false,
      filterValueMin: '',
      filterValueMax: '',
      tipo: 'rangoNumero',
    },

    {
      title: 'Codigo',
      data: 'codigo',
      class: 'text-center',

    },

    {
      title: 'Nombre',
      data: 'nombre',
      class: 'text-center',
      filter: true,
      filterValue: '',
      tipo: 'texto',
    },

    {
      title: 'Descripción',
      data: 'descripcion',
      class: 'text-center',
      filter: true,
      filterValue: '',
      tipo: 'texto',
    },
  ];

  constructor(private serviciosCriteriosAceptacion: ServiciosCriteriosAceptacion) {
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
        this.serviciosCriteriosAceptacion.obtener().subscribe((response) => {
          // console.log('llegaron',response)
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
