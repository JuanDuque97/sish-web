import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { ServiciosParametrosService } from '../servicios-parametros.service';
import { accionesTablasEnum } from 'src/app/modelo/enum/acciones-tablas-enum';
import { estados } from 'src/app/common/utils/constantes';
import { IParametro } from 'src/app/modelo/configuracion/parametro';
import { MetodosGlobales } from 'src/app/common/utils/metodos-globales';
import { capasEnum, capasEnumDatos } from 'src/app/modelo/enum/capas-enum';
import { ServiciosCapasService } from '../../configuracion/capas/servicios-capas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-consultar-parametros',
  templateUrl: './consultar-parametros.component.html',
})


export class ConsultarParametrosComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtOptions: any = {};
  datatableElement!: DataTableDirective;

  rutaGeneral = 'configuracion/parametros/C/0';
  rutaConsulta = 'configuracion/parametros/V/';
  rutaEdicion = 'configuracion/parametros/E/';

  // Set our map properties
  mapCenter = [-73.9, 4.4];
  basemapType = 'topo';
  mapZoomLevel = 9;
  // See app.component.html
  mapLoadedEvent(status: Event) {
    // console.log('The map loaded: ' + status);
  }

  constructor(private serviciosParametrosService: ServiciosParametrosService,

    private serviciosCapasService: ServiciosCapasService) {
    // Esto es intencional
  }

  capas: any[] = [];
  // capas = [
  //   {
  //     url: 'http://apps.diegopedroza.co:11030/arcgis/rest/services/sish/departamentos/MapServer/0',
  //     id: 'departamentos',
  //     visible: true,
  //     titulo: 'Departamentos',
  //   },
  //   {
  //     url: 'http://apps.diegopedroza.co:11030/arcgis/rest/services/sish/zonificacion/MapServer/0',
  //     id: 'zonificacion',
  //     visible: true,
  //     titulo: 'Zonificación',
  //   },
  //   {
  //     url: 'http://apps.diegopedroza.co:11030/arcgis/rest/services/sish/estaciones/MapServer/0',
  //     id: 'estaciones',
  //     visible: true,
  //     titulo: 'Estaciones',
  //   },
  // ];

  datosFilter = [] as any;
  columnas = [
    {
      title: 'ID',
      data: 'idParametro',
      visible: false,
    },
    {
      title: 'Código',
      data: 'codigo',
      filter: true,
      class: 'text-center',
      filterValue: '',
      tipo: 'texto',
    },
    {
      title: 'Variable',
      data: 'variable',
      filter: true,
      class: 'text-center',
      filterValue: '',
      tipo: 'texto',
    },
    {
      title: 'Tipo parámetro',
      data: 'nombreUnidadMedida',
      filter: true,
      class: 'text-center',
      filterValue: '',
      tipo: 'seleccion',
    },
    {
      title: 'Periodo',
      data: 'periodo',
      filter: true,
      class: 'text-center',
      filterValue: '',
      tipo: 'seleccion',
    },
    {
      title: 'Método',
      data: 'nombreMetodo',
      filter: true,
      class: 'text-center',
      filterValue: '',
      tipo: 'seleccion',
    },
    {
      title: 'Unidad medida',
      data: 'nombreTipoParametro',
      filter: true,
      class: 'text-center',
      filterValue: '',
      tipo: 'seleccion',
    },
    {
      title: 'Descripción',
      data: 'descripcion',
    },
    {
      title: 'Categoria',
      data: 'categoria',
      filter: true,
      class: 'text-center',
      filterValue: '',
      tipo: 'seleccion',
    },
    {
      title: 'Estado',
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
  botonesGenerales = [
    {
      text: 'Activar todos',
      action: 'Activacion',
      enabled: this.validarPermiso('ActualizarParametro'),
    },
    {
      text: 'Inactivar todos',
      action: 'Inactivar',
      enabled: this.validarPermiso('ActualizarParametro'),
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

  vector: Array<number> = Array(50);
  ngOnInit(): void {
    this.cargarCapas();
    this.obtenerListaParametros();
  }

  obtenerListaParametros() {
    Swal.fire({
      title: 'Cargando...',
      html: 'Por favor espere.',
      timer: 42000,
      timerProgressBar: true,
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: async () => {
        Swal.showLoading();
        this.serviciosParametrosService.obtenerListaParametros().subscribe(
          (response) => {
            // console.log(response);
            this.datosFilter = response;
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
        let parametro: IParametro = e.registro;
        parametro.activo = estados.activo;
        this.actualizar(parametro);
        //statements;
        break;
      }
      case accionesTablasEnum.Inactivar: {
        let parametro: IParametro = e.registro;
        parametro.activo = estados.inactivo;
        this.actualizar(parametro);
        break;
      }
      case accionesTablasEnum.Eliminar: {
        //statements;
        break;
      }
      default: {
        //statements;
        break;
      }
    }
  }
  actualizar(parametro: IParametro) {
    this.serviciosParametrosService.actualizar(parametro).subscribe(
      (response) => {
        // console.log(response);
        this.obtenerListaParametros();
      }
    );
  }

  cargarCapas() {
    this.serviciosCapasService
      .obtenerPorId(capasEnum.Pozos)
      .subscribe((response) => {
        // console.log('cargarCapas', response.urlVisualizar);
        this.capas.push({
          url: response.urlVisualizar,
          id: capasEnumDatos(capasEnum.Pozos).id,
          visible: true,
          titulo: capasEnumDatos(capasEnum.Pozos).titulo,
        });
      });
    this.serviciosCapasService
      .obtenerPorId(capasEnum.Embalses)
      .subscribe((response) => {
        // console.log('cargarCapas', response.urlVisualizar);
        this.capas.push({
          url: response.urlVisualizar,
          id: capasEnumDatos(capasEnum.Embalses).id,
          visible: true,
          titulo: capasEnumDatos(capasEnum.Embalses).titulo,
        });
      });
    this.serviciosCapasService
      .obtenerPorId(capasEnum.Estaciones)
      .subscribe((response) => {
        // console.log('cargarCapas', response.urlVisualizar);
        this.capas.push({
          url: response.urlVisualizar,
          id: capasEnumDatos(capasEnum.Estaciones).id,
          visible: true,
          titulo: capasEnumDatos(capasEnum.Estaciones).titulo,
        });
      });


    // console.log('cargarCapas');
    this.serviciosCapasService
      .obtenerPorId(capasEnum.Zonificacion)
      .subscribe((response) => {
        // console.log('cargarCapas', response.urlVisualizar);
        this.capas.push({
          url: response.urlVisualizar,
          id: capasEnumDatos(capasEnum.Zonificacion).id,
          visible: true,
          titulo: capasEnumDatos(capasEnum.Zonificacion).titulo,
        });
      });

    this.serviciosCapasService
      .obtenerPorId(capasEnum.Departamentos)
      .subscribe((response) => {
        // console.log('cargarCapas', response.urlVisualizar);
        this.capas.push({
          url: response.urlVisualizar,
          id: capasEnumDatos(capasEnum.Departamentos).id,
          visible: true,
          titulo: capasEnumDatos(capasEnum.Departamentos).titulo,
        });
      });



    // console.log('cargarCapas',this.capas);
  }

  accionGeneral(e: any) {
    switch (e) {
      case 'Activacion': {
        if (this.listaDeElementos.length >= 2) {
          // console.log('Activacion general', e);
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
                const element: IParametro = this.listaDeElementos[index];
                element.activo = estados.activo;
                this.serviciosParametrosService
                  .actualizar(element)
                  .subscribe((response) => { });
              }
            },
            willClose: () => {
              this.toast.fire({
                icon: 'success',
                title:
                  'Se Activaron ' +
                  this.listaDeElementos.length +
                  ' Elementos',
              });
              this.listaDeElementos = [];
              this.obtenerListaParametros();
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
                const element: IParametro = this.listaDeElementos[index];
                element.activo = estados.inactivo;
                this.serviciosParametrosService
                  .actualizar(element)
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
              this.obtenerListaParametros();
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
  }

  // Validacion de permisos 
  public validarPermiso(permiso: any): boolean {
    return MetodosGlobales.validarPermiso(permiso);
  }

  clickMapa(event: any) {
    console.log('Evento click recibido', event);
  }

  seleccionMapa(event: any) {
    console.log('Evento selección recibido', event);
  }

}
