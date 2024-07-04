import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MetodosGlobales } from 'src/app/common/utils/metodos-globales';
import { IDominioValor } from 'src/app/modelo/configuracion/dominioValor';
import { accionesTablasEnum } from 'src/app/modelo/enum/acciones-tablas-enum';
import { ServiciosMolineteService } from '../servicios-molinetes.service';
import { IMolinete } from '../../../../../modelo/configuracion/molinete';
import { estados } from 'src/app/common/utils/constantes';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-consultar-molinete',
  templateUrl: './consultar-molinete.component.html',
})
export class ConsultarMolineteComponent implements OnInit {
  rutaGeneral = 'configuracion/gestionMolinete/C/0';
  rutaConsulta = 'configuracion/gestionMolinete/V/';
  rutaEdicion = 'configuracion/gestionMolinete/E/';

  datosFilter = [] as any;

  dtOptions: any = {};

  columnas = [
    {
      title: 'idMolinete',
      data: 'idMolinete',
      visible: false,
      filterValueMin: '',
      filterValueMax: '',
      tipo: 'rangoNumero',
    },
    { title: 'idImagen', data: 'idImagen', visible: false },

    { title: 'idTipoMolinete', data: 'idTipoMolinete', visible: false },
    {
      title: 'identificacionMolinete',
      data: 'identificacionMolinete',
      visible: false,
    },
    { title: 'imangen', data: 'imangen', visible: false },

    {
      title: 'Serie',
      data: 'serie',
      filter: true,
      filterValue: '',
      tipo: 'texto',
    },

    {
      title: 'Marca',
      data: 'marca',
      filter: true,
      filterValue: '',
      tipo: 'seleccion',
    },

    {
      title: 'Tipo molinete',
      data: 'tipoMolinete',
      filter: true,
      filterValue: '',
      tipo: 'seleccion',
    },

    {
      title: 'Activo',
      data: 'activo',
      filter: true,
      filterValue: '',
      tipo: 'seleccion',
    },
    {
      title: 'Descripción',
      data: 'descripcion',
      filter: false,
      visible: false,
      filterValue: '',
      tipo: 'texto',
    },

    {
      title: 'Fecha adquisición',
      data: 'fechaAdquisicion',
      filter: true,
      filterValueMin: '',
      filterValueMax: '',
      tipo: 'rangoFecha',
    },

    { title: 'fechaCreacion', data: 'fechaCreacion', visible: false },
    { title: 'fechaEstado', data: 'fechaEstado', visible: false },
    { title: 'fechaModificacion', data: 'fechaModificacion', visible: false },

    { title: 'Flag Migracion', data: 'flagMigracion', visible: false },
    {
      title: 'Cantidad de Helices',
      data: 'numeroHelices',
      filterValueMin: '',
      filterValueMax: '',
      tipo: 'rangoNumero',
    },

    { title: 'usuarioCreacion', data: 'usuarioCreacion', visible: false },
    { title: 'usuarioEstado', data: 'usuarioEstado', visible: false },
    {
      title: 'usuarioModificacion',
      data: 'usuarioModificacion',
      visible: false,
    },
  ];

  botonesGenerales = [
    {
      text: 'Activar Todos',
      action: 'Activacion',
    },
    {
      text: 'Inactivar todos',
      action: 'Inactivar',
    },
  ];

  listaDeElementos: any = [];

  private toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
  });

  constructor(private serviciosMolineteService: ServiciosMolineteService) { }

  ngOnInit(): void {
    this.obtener();
  }

  accionRegistro(e: any) {
    switch (e.accion) {
      case accionesTablasEnum.Activar: {
        let molinete: IMolinete = e.registro;
        molinete.activo = estados.activo;
        this.actualizar(molinete);
        break;
      }
      case accionesTablasEnum.Inactivar: {
        let molinete: IMolinete = e.registro;
        molinete.activo = estados.inactivo;
        this.actualizar(molinete);

        break;
      }
      default: {
        console.log('default', e);
        //statements;
        break;
      }
    }
  }

  actualizar(molinete: IMolinete) {
    this.serviciosMolineteService
      .actualizarEstado(molinete.activo, molinete.idMolinete)
      .subscribe((response) => {
        this.obtener();
      });
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
        this.serviciosMolineteService.obtenerDTO().subscribe((Response) => {
          this.datosFilter = Response;
          Swal.close();
        });
      },
      willClose: async () => {
        Swal.hideLoading();
      }
    });
  }

  accionGeneral(e: any) {
    switch (e) {
      case 'Activacion': {
        if (this.listaDeElementos.length >= 2) {
          Swal.fire({
            title:
              'Cambiando estado de ' +
              this.listaDeElementos.length +
              ' elementos ',
            html: 'Por favor espere',
            timer: 2000,
            timerProgressBar: true,
            didOpen: () => {
              Swal.showLoading();
              for (
                let index = 0;
                index < this.listaDeElementos.length;
                index++
              ) {
                const molinete: IMolinete = this.listaDeElementos[index];

                molinete.activo = estados.activo;
                this.serviciosMolineteService
                  .actualizarEstado(molinete.activo, molinete.idMolinete)
                  .subscribe((response) => { });
              }
            },
            willClose: () => {
              this.toast.fire({
                icon: 'success',
                title:
                  'Se Activaron ' + this.listaDeElementos.length + ' Elementos',
              });

              this.obtener();

              this.listaDeElementos = [];
              // console.log('lista', this.listaDeElementos);
            },
          }).then((result) => { });
        } else {
          this.toast.fire({
            icon: 'info',
            title: 'Debe tener seleccionado almenos Dos elementos',
          });
        }

        break;
      }
      case 'Inactivar': {
        if (this.listaDeElementos.length >= 2) {
          Swal.fire({
            title:
              'Cambiando estado de ' +
              this.listaDeElementos.length +
              ' elementos ',
            html: 'Por favor espere',
            timer: 2000,
            timerProgressBar: true,
            didOpen: () => {
              Swal.showLoading();
              for (
                let index = 0;
                index < this.listaDeElementos.length;
                index++
              ) {
                const molinete: IMolinete = this.listaDeElementos[index];
                molinete.activo = estados.inactivo;
                this.serviciosMolineteService
                  .actualizarEstado(molinete.activo, molinete.idMolinete)
                  .subscribe((response) => { });
              }
            },
            willClose: () => {
              this.toast.fire({
                icon: 'success',
                title:
                  'Se Inactivaron ' +
                  this.listaDeElementos.length +
                  ' Elementos',
              });

              this.listaDeElementos = [];
              this.obtener();
            },
          }).then((result) => { });
        } else {
          this.toast.fire({
            icon: 'info',
            title: 'Debe tener seleccionado almenos Dos elementos',
          });
        }

        break;
      }

      default:
        break;
    }
  }

  lista(listaSelect: any) {
    // debugger
    if (listaSelect.length >= 2) {
      this.listaDeElementos = listaSelect;
    }
    // console.log(this.listaDeElementos);
  }

  // Validacion de permisos
  public validarPermiso(permiso: any): boolean {
    return MetodosGlobales.validarPermiso(permiso);
  }
}
