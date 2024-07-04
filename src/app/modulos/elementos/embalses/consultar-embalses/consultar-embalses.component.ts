import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { estados } from 'src/app/common/utils/constantes';
import { MetodosGlobales } from 'src/app/common/utils/metodos-globales';
import { IEmbalce } from 'src/app/modelo/configuracion/embalce';
import { accionesTablasEnum } from 'src/app/modelo/enum/acciones-tablas-enum';
import { capasEnum, capasEnumDatos } from 'src/app/modelo/enum/capas-enum';
import Swal from 'sweetalert2';
import { ServiciosCapasService } from '../../../configuracion/capas/servicios-capas.service';
import { ServiciosEmbalcesService } from '../servicios-embalses.service';

@Component({
  selector: 'app-consultar-embalses',
  templateUrl: './consultar-embalses.component.html',
})
export class ConsultarEmbalsesComponent implements OnInit {
  rutaGeneral = 'configuracion/embalses/C/0';
  rutaConsulta = 'configuracion/embalses/V/';
  rutaEdicion = 'configuracion/embalses/E/';

  capas: any[] = [];
  datosOriginal = [] as any;
  // Set our map properties
  mapCenter = [-73.9, 4.4];
  basemapType = 'topo';
  mapZoomLevel = 9;

  datosFilter = [] as any;
  columnas = [
    {
      title: 'ID',
      data: 'idEmbalse',
      visible: false,
      filter: false,
      filterValueMin: '',
      filterValueMax: '',
      tipo: 'rangoNumero',
    },

    {
      title: 'Cuenca',
      data: 'cuenca',
      filter: true,
      filterValue: '',
      tipo: 'texto',
    },
    {
      title: 'Elevación',
      data: 'elevacion',
      visible: false,
      filter: true,
      filterValueMin: '',
      filterValueMax: '',
      tipo: 'rangoNumero',
    },
    {
      title: 'Embalse',
      data: 'embalse',
      filter: true,
      filterValue: '',
      tipo: 'texto',
    },
    {
      title: 'Entidad',
      data: 'entidad',
      filter: true,
      filterValue: '',
      tipo: 'texto',
    },

    { title: 'Fecha inicio operacion', data: 'fechaInicioOperacion' },

    {
      title: 'Altura presa',
      data: 'alturaPresa',
      filter: true,
      visible: false,
      filterValueMin: '',
      filterValueMax: '',
      tipo: 'rangoNumero',
    },
    {
      title: 'Ancho cresta',
      data: 'anchoCresta',
      visible: false,
      filter: true,
      filterValueMin: '',
      filterValueMax: '',
      tipo: 'rangoNumero',
    },
    {
      title: 'Área hidrográfica',
      data: 'areaHidrografica',
      filter: true,
      filterValue: '',
      tipo: 'texto',
    },
    {
      title: 'Longitud cresta',
      data: 'longitudCresta',
      filter: true,
      visible: false,
      filterValueMin: '',
      filterValueMax: '',
      tipo: 'rangoNumero',
    },
    {
      title: 'Micro cuenca',
      data: 'microcuenca',
      filter: true,
      filterValue: '',
      tipo: 'texto',
    },
    {
      title: 'Departamento',
      data: 'departamento',
      filter: true,
      filterValue: '',
      tipo: 'texto',
      visible: false,
    },
    {
      title: 'Municipio',
      data: 'municipio',
      filter: true,
      filterValue: '',
      tipo: 'texto',
    },
    {
      title: 'Nivel sub siguiente',
      data: 'nivelSubSiguiente',
      filter: true,
      filterValue: '',
      tipo: 'texto',
    },
    {
      title: 'Sub cuenca',
      data: 'subCuenca',
      filter: true,
      filterValue: '',
      tipo: 'texto',
    },
    {
      title: 'Sub zona hidrográfica',
      data: 'subZonaHidrografica',
      filter: true,
      filterValue: '',
      tipo: 'texto',
    },
    {
      title: 'Volumen muerto',
      data: 'volumenMuerto',
      visible: false,
      filter: true,
      filterValueMin: '',
      filterValueMax: '',
      tipo: 'rangoNumero',
    },
    {
      title: 'Volumen total',
      data: 'volumenTotal',
      filter: true,
      filterValueMin: '',
      filterValueMax: '',
      tipo: 'rangoNumero',
    },
    {
      title: 'Volumen útil',
      data: 'volumenUtil',
      filter: true,
      filterValueMin: '',
      filterValueMax: '',
      tipo: 'rangoNumero',
    },
    {
      title: 'Zona hidrográfica',
      data: 'zonaHidrografica',
      filter: true,
      filterValue: '',
      tipo: 'texto',
    },
    {
      title: 'Zona operativa EAAB',
      data: 'zonaOperativaEaab',
      filter: true,
      filterValue: '',
      tipo: 'texto',
    },
    { title: 'Activo', data: 'activo', visible: false },

    { title: 'Usuario creación', data: 'usuarioCreacion', visible: false },
    { title: 'Usuario estado', data: 'usuarioEstado', visible: false },
    {
      title: 'Usuarioc modificación',
      data: 'usuarioModificacion',
      visible: false,
    },
    { title: 'idAreaHidrografica', data: 'idAreaHidrografica', visible: false },
    { title: 'idCuenca', data: 'idCuenca', visible: false },
    { title: 'idEntidad', data: 'idEntidad', visible: false },
    { title: 'idMicroCuenca', data: 'idMicroCuenca', visible: false },
    { title: 'idMunicipio', data: 'idMunicipio', visible: false },
    { title: 'idSubCuenca', data: 'idSubCuenca', visible: false },
    {
      title: 'idSubZonaHidrografica',
      data: 'idSubZonaHidrografica',
      visible: false,
    },
    { title: 'idZonaHidrografica', data: 'idZonaHidrografica', visible: false },
    { title: 'idDepartamento', data: 'idDepartamento', visible: false },
    { title: 'fecha Modificacion', data: 'fechaModificacion', visible: false },
    { title: 'fecha Creacion', data: 'fechaCreacion', visible: false },
    { title: 'fecha Estado', data: 'fechaEstado', visible: false },
  ];
  botones = [
    {
      class: 'sish-boton-azul',
      title: 'parámetros',
      action: 'parametros',
      icon: 'fas fa-tasks',
      enabled: this.validarPermiso('ConsultarParametroXEmbalse'),
    },
  ];
  botonesGenerales = [
    {
      text: 'Activar Todos',
      action: 'Activacion',
      enabled: this.validarPermiso('ActualizarEmbalse'),
    },
    {
      text: 'Inactivar todos',
      action: 'Inactivar',
      enabled: this.validarPermiso('ActualizarEmbalse'),
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

  constructor(
    private router: Router,
    private serviciosEmbalcesService: ServiciosEmbalcesService,
    private serviciosCapasService: ServiciosCapasService
  ) {}

  // See app.component.html
  mapLoadedEvent(status: Event) {
    console.log('The map loaded: ' + status);
  }
  ngOnInit(): void {
    this.cargarCapas();

    this.obtener();
  }

  obtener() {
    this.serviciosEmbalcesService
      .obtenerEembalsesDTO()
      .subscribe((response) => {
        // console.log('llegaron embalses',response)
        this.datosFilter = response;
      });
  }
  async cargarCapas() {
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

    //  console.log('cargarCapas',this.capas);
  }

  accionRegistro(e: any) {
    switch (e.accion) {
      case accionesTablasEnum.Activar: {
        let embalce: IEmbalce = e.registro;
        embalce.activo = estados.activo;
        this.actualizar(embalce);
        //statements;
        break;
      }
      case accionesTablasEnum.Inactivar: {
        let embalce: IEmbalce = e.registro;
        embalce.activo = estados.inactivo;
        this.actualizar(embalce);
        break;
      }
      case 'parametros': {
        let embalse: IEmbalce = e.registro;
        this.router.navigate([
          'configuracion/ParametrosEmbalses/' + embalse.idEmbalse,
        ]);
        //statements;
        break;
      }

      default: {
        //statements;
        break;
      }
    }
  }
  actualizar(embalce: IEmbalce) {
    // console.log('actualizando', embalce);
    this.serviciosEmbalcesService.actualizar(embalce).subscribe((response) => {
      this.obtener();
    });
  }

  clickMapa(event: any) {
    let valores =
      event.data
        .filter((f: any) => f.idCapa === capasEnumDatos(capasEnum.Embalses).id)
        ?.map((d: any) => d.atributos?.CODIGO_INTERNO_SISH)[0] ?? '';
    if (valores) {
      this.datosFilter = this.datosOriginal.filter(
        (f: any) => f.idEstacion === valores
      );
      // console.log('datos filyttados', this.datosFilter);
    } else {
      this.datosFilter = this.datosOriginal;
    }
  }

  

  seleccionMapa(event: any) {


 

    let seleccion = event.seleccion
      .map((s: any) =>
        s.filter((r: any) => r.idCapa === capasEnumDatos(capasEnum.Embalses).id)
      )
      .filter((v: any) => v.length > 0)[0];
    let valores =
      seleccion?.map((d: any) => d.atributos?.CODIGO_INTERNO_SISH) ?? [];
    if (valores) {
      this.datosFilter = this.datosOriginal.filter(
        (f: any) => valores.indexOf(f.idEstacion) > -1
      );
    } else {
      this.datosFilter = this.datosOriginal;
    }
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
                const element: IEmbalce = this.listaDeElementos[index];
                element.activo = estados.activo;
                this.serviciosEmbalcesService
                  .actualizar(element)
                  .subscribe((response) => {});
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

              this.obtener();

              this.listaDeElementos = [];
              // console.log('lista', this.listaDeElementos);
            },
          }).then((result) => {});
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
                const element: IEmbalce = this.listaDeElementos[index];
                element.activo = estados.inactivo;
                this.serviciosEmbalcesService
                  .actualizar(element)
                  .subscribe((response) => {});
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
          }).then((result) => {});
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

  public validarPermiso(permiso: any): boolean {
    return MetodosGlobales.validarPermiso(permiso);
  }
}
