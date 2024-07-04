import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { MetodosGlobales } from 'src/app/common/utils/metodos-globales';
import { accionesTablasEnum } from 'src/app/modelo/enum/acciones-tablas-enum';
import Swal from 'sweetalert2';
import { ServiciosPozosService } from '../servicios-pozos.service';
import { IPozos } from '../../../../modelo/configuracion/pozo';
import { estados } from 'src/app/common/utils/constantes';
import { Router } from '@angular/router';
import { capasEnum, capasEnumDatos } from 'src/app/modelo/enum/capas-enum';
import { ServiciosCapasService } from '../../../configuracion/capas/servicios-capas.service';

@Component({
  selector: 'app-consultar-pozos',
  templateUrl: './consultar-pozos.component.html',
})
export class ConsultarPozosComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtOptions: any = {};
  datatableElement!: DataTableDirective;

  rutaGeneral = 'configuracion/pozos/C/0';
  rutaConsulta = 'configuracion/pozos/V/';
  rutaEdicion = 'configuracion/pozos/E/';

  capas: any[] = [  ];


  
  datosOriginal = [] as any;
  // Set our map properties
  mapCenter = [-73.9, 4.4];
  basemapType = 'topo';
  mapZoomLevel = 9;

  datosFilter = [] as any;
  columnas = [
    {
      title: 'ID',
      data: 'idPozo',
      visible: false,
      filter: true,
      filterValueMin: '',
      filterValueMax: '',
      tipo: 'rangoNumero',
    },

    {
      title: 'Pozo',
      data: 'pozo',
      filter: true,
      filterValue: '',
      tipo: 'texto',
    },
    {
      title: 'Activo',
      data: 'activo',
      filter: true,
      filterValue: '',

      visible: false,
      tipo: 'seleccion',
    },
    {
      title: 'Zona operativa EAAB\ ',
      data: 'zonaOperativaEaab',
      filter: true,
      filterValue: '',
      tipo: 'texto',
    },
    {
      title: 'Área hidrográfica',
      data: 'areaHidrografica',
      filter: true,
      filterValue: '',
      tipo: 'texto',
    },
    {
      title: 'Categoria',
      data: 'categoria',
      class: 'text-center',
      filter: true,
      filterValue: '',
      tipo: 'seleccion',
    },
    {
      title: 'Condición',
      data: 'condicion',
      class: 'text-center',
      filter: true,
      filterValue: '',
      tipo: 'seleccion',
    },
    {
      title: 'Cota boca',
      data: 'cotaBoca',
      filter: true,
      filterValue: '',
      tipo: 'texto',
    },
    {
      title: 'Cota medidor',
      data: 'cotaMedidor',
      filter: true,
      filterValue: '',
      tipo: 'texto',
    },

    {
      title: 'Cuenca',
      data: 'cuenca',
      filter: true,
      filterValue: '',
      tipo: 'texto',
    },
    {
      title: 'Micro cuenca',
      data: 'microcuenca',
      filter: true,
      visible: false,
      filterValue: '',
      tipo: 'texto',
    },
    { title: 'Fecha inicio operacion', data: 'fechaInicioOperacion' },
    {
      title: 'Departamento',
      data: 'departamento',
      filter: true,
      visible: false,
      filterValue: '',
      tipo: 'texto',
    },
    {
      title: 'Municipio',
      data: 'municipio',
      filter: true,
      filterValue: '',
      tipo: 'texto',
    },
    { title: 'Profundidad', data: 'profundidad'     , 
    filter: true,
    visible:false,
    filterValueMin: '',
    filterValueMax: '',
    tipo: 'rangoNumero',  },
    { title: 'Nivel sub siguiente', data: 'nivelSubsiguiente',visible: false },
    { title: 'Sub zona hidrográfica', data: 'subZonaHidrografica' ,visible: false},
    {
      title: 'Tipo pozo',
      data: 'tipoPozo',
      filter: true,
      filterValue: '',
      tipo: 'seleccion',
    },
    { title: 'Zona hidrográfica ', data: 'zonaHidrografica' },
    { title: 'Sub cuenca', data: 'subCuenca' ,visible: false},
    {
      title: 'Tipo coordenada',
      data: 'tipoCoordenada',
      class: 'text-center',
      filter: true,
      filterValue: '',
      tipo: 'seleccion',
    },
    {
      title: 'Latitud',
      data: 'latitud',
      class: 'text-center',
      filter: true,
      
      filterValueMin: '',
      filterValueMax: '',
      tipo: 'rangoNumero',
      visible: false
    },
    {
      title: 'Longitud',
      data: 'longitud',
      class: 'text-center',
      filter: true,
      visible: false,
      filterValueMin: '',
      filterValueMax: '',
      tipo: 'rangoNumero',
    },

    { title: 'idAreaHidrografica', data: 'idAreaHidrografica', visible: false },
    { title: 'idCategoria', data: 'idCategoria', visible: false },
    { title: 'idCondicion', data: 'idCondicion', visible: false },
    { title: 'idCuenca', data: 'idCuenca', visible: false },
    { title: 'idDepartamento', data: 'idDepartamento', visible: false },
    { title: 'idMicroCuenca', data: 'idMicroCuenca', visible: false },
    { title: 'idMunicipio', data: 'idMunicipio', visible: false },
    { title: 'idSubCuenca', data: 'idSubCuenca', visible: false },
    {
      title: 'idSubZonaHidrografica',
      data: 'idSubZonaHidrografica',
      visible: false,
    },
    { title: 'idTipoCoordenada', data: 'idTipoCoordenada', visible: false },
    { title: 'idTipoPozo', data: 'idTipoPozo', visible: false },
    { title: 'idZonaHidrografica', data: 'idZonaHidrografica', visible: false },
    { title: 'fechaCreacion', data: 'fechaCreacion', visible: false },
    { title: 'fechaEstado', data: 'fechaEstado', visible: false },
    { title: 'fechaModificacion', data: 'fechaModificacion', visible: false },
    { title: 'usuarioCreacion', data: 'usuarioCreacion', visible: false },
    { title: 'usuarioEstado', data: 'usuarioEstado', visible: false },
    {
      title: 'usuarioModificacion',
      data: 'usuarioModificacion',
      visible: false,
    },
  ];
  botones = [
    {
      class: 'sish-boton-azul',
      title: 'parametros',
      action: 'parametros',
      icon: 'fas fa-tasks',
      enabled: this.validarPermiso('ConsultarParametroXPozo'),
    },
  ];
  botonesGenerales = [
    {
      text: 'Activar todos',
      action: 'Activacion',
      enabled: this.validarPermiso('ActualizarPozo'),
    },
    {
      text: 'Inactivar todos',
      action: 'Inactivar',
      enabled: this.validarPermiso('ActualizarPozo'),
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
    private serviciosPozosService: ServiciosPozosService,
    private serviciosCapasService: ServiciosCapasService
  ) {}

   ngOnInit(): void {
    this.cargarCapas();
    this.obtenerListaPozoz();
  }
  mapLoadedEvent(status: Event) {
    console.log('The map loaded: ' + status);
  }

  obtenerListaPozoz() {
    this.serviciosPozosService.obtenerPozosDTO().subscribe((response) => {
      this.datosFilter = response;
    });
  }

  accionRegistro(e: any) {
    switch (e.accion) {
      case accionesTablasEnum.Activar: {
        let pozos: IPozos = e.registro;
        pozos.activo = estados.activo;
        this.actualizar(pozos);
        //statements;
        break;
      }
      case accionesTablasEnum.Inactivar: {
        // console.log('llegaron', e);
        let pozos: IPozos = e.registro;
        pozos.activo = estados.inactivo;
        this.actualizar(pozos);
        break;
      }

      case 'parametros': {
        let pozos: IPozos = e.registro;
        this.router.navigate(['configuracion/ParametrosPozos/' + pozos.idPozo]);
        //statements;
        break;
      }
      default: {
        //statements;
        break;
      }
    }
  }
 
  async   cargarCapas() {

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

     

    // console.log('Capas cargadas',this.capas);
  }

  actualizar(pozos: IPozos) {
    this.serviciosPozosService.actualizar(pozos).subscribe((response) => {
      this.obtenerListaPozoz();
    });
  }
  
  public validarPermiso(permiso: any): boolean {
    return MetodosGlobales.validarPermiso(permiso);
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
                const element: IPozos = this.listaDeElementos[index];
                element.activo = estados.activo;
                this.serviciosPozosService
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
              this.listaDeElementos = [];
              this.obtenerListaPozoz(); 
              console.log('lista', this.listaDeElementos);
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
                const element: IPozos = this.listaDeElementos[index];
                element.activo = estados.inactivo;
                this.serviciosPozosService
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
              this.obtenerListaPozoz();
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
  }

  clickMapa(event: any) {
    let valores =
      event.data
        .filter((f: any) => f.idCapa === capasEnumDatos(capasEnum.Pozos).id)
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
        s.filter((r: any) => r.idCapa === capasEnumDatos(capasEnum.Pozos).id)
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
}
