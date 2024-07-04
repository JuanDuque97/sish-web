import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Router } from '@angular/router';
import { ServiciosDominiosService } from '../servicios-dominios.service';
import { IDominio } from '../../../../modelo/configuracion/dominio';
import { MetodosGlobales } from 'src/app/common/utils/metodos-globales';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-consultar-dominios',
  templateUrl: './consultar-dominios.component.html',
})
export class ConsultarDominiosComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  rutaGeneral = 'configuracion/dominios/C/0';
  rutaConsulta = 'configuracion/dominios/V/';
  rutaEdicion = 'configuracion/dominios/E/';

  datosFilter = [] as any;

  datatableElement: DataTableDirective | undefined;

  dtOptions: any = {};
  columnas = [
    {
      title: 'ID',
      data: 'idDominio',
      visible: false,
      filterValueMin: '',
      filterValueMax: '',
      tipo: 'rangoNumero',
    },
    {
      title: 'Dominio',
      data: 'dominio',
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

  constructor(
    private serviciosDominiosService: ServiciosDominiosService,
    private renderer: Renderer2,
    private router: Router
  ) {
    // Esto es intencional
  }

  vector: Array<number> = Array(50);

  botonesGenerales =
    [
      {
        text: 'Agregar Valor',
        action: 'agregarValor',
        enabled: this.validarPermiso('CrearValorDominio'),
      }
    ];

  ngOnInit(): void {
    this.obtener();
  }


  // accionRegistro(e: any) {
  //   switch (e.accion) {
  //     case accionesTablasEnum.Activar: {
  //       let dominio: IDominio = e.registro;
  //       dominio.activo = estados.activo;
  //       this.actualizar(dominio);
  //       //statements;
  //       break;
  //     }
  //     case accionesTablasEnum.Inactivar: {
  //       let dominio: IParametro = e.registro;
  //       dominio.activo = estados.inactivo;
  //       this.actualizar(dominio);
  //       break;
  //     }
  //     case accionesTablasEnum.Eliminar: {
  //       //statements;
  //       break;
  //     }
  //     default: {
  //       //statements;
  //       break;
  //     }
  //   }
  // }

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
        this.serviciosDominiosService.obtener().subscribe((response) => {
          this.datosFilter = response;
          Swal.close();
        });
      },
      willClose: async () => {
        Swal.hideLoading();
      }
    });
  }
  actualizar(dominio: IDominio) {
    this.serviciosDominiosService.actualizar(dominio).subscribe((response) => {
      console.log(response);
      this.obtener();
    });
  }

  // Validacion de permisos 
  public validarPermiso(permiso: any): boolean {
    return MetodosGlobales.validarPermiso(permiso);
  }


}

