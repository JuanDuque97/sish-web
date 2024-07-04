import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiciosGeograficosService } from 'src/app/common/mapa/servicios-geograficos.service';
import { dominiosEnum } from 'src/app/modelo/enum/dominios-enum';
import { ServiciosDominiosValoresService } from '../../configuracion/dominios/servicios-dominios-valores.service';
import { ServiciosEmbalcesService } from '../../elementos/embalses/servicios-embalses.service';
import { ServiciosEstacionesService } from '../../elementos/estaciones/servicios-estaciones.service';
import { ServiciosParametrosService } from '../../parametros/servicios-parametros.service';
import { ServiciosPozosService } from '../../elementos/pozos/servicios-pozos.service';
import { ServiciosObservacionesEstacionService } from '../servicios-observaciones-estacion.service';
import { ServiciosObservacionesPozosService } from '../servicios-observaciones-pozos.service';
import { ServiciosObservacionesEmbalsesService } from '../servicios-observaciones-embalses.service';
import Swal from 'sweetalert2';
import { capasEnum, capasEnumDatos } from 'src/app/modelo/enum/capas-enum';
import { ServiciosCapasService } from '../../configuracion/capas/servicios-capas.service';
import { accionesTablasEnum } from 'src/app/modelo/enum/acciones-tablas-enum';
import { estados } from 'src/app/common/utils/constantes';
import { MetodosGlobales } from 'src/app/common/utils/metodos-globales';

@Component({
  selector: 'app-consultar-observaciones',
  templateUrl: './consultar-observaciones.component.html',
})
export class ConsultarObservacionesComponent implements OnInit {
  public formularioFiltros!: FormGroup;

  // Mapa
  // Set our map properties
  mapCenter = [-73.9, 4.4];
  basemapType = 'topo';
  mapZoomLevel = 9;
  // See app.component.html
  mapLoadedEvent(status: Event) {
    console.log('The map loaded: ' + status);
  }

  public fechaActual: string;

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

  public listaMunicipios = [];
  public listaDepartamentos: any = [];
  public departamentoSelected: any;
  private tempIdDepartamento: number = 0;
  datosOriginal = [] as any;
  public listZonaEAAB = [];
  public listTipoPozo = [];
  public listCategoriaPozo = [];
  public listCondicionPozo = [];
  public geograficas = false;
  public planas = false;
  public listEntidades = [];
  public listaAreaHidrografica = [];
  public listaZonaHidrografica = [];
  public listasubZonaHidrografica = [];
  public listanivel = [];
  public listaCuenca = [];
  public listaMicrocuenca = [];
  public listaEntidad = [];
  public listParametro: any[] = [];
  public listaFrecuencia = [];
  public listaSubcuenca = [];
  public listaBusqueda: any[] = [];
  public elemento: any = 0;
  public periodo: number = 0;
  public parametro: number;

  rutaGeneral = 'configuracion/gestionObservaciones/0/C/0';
  rutaEdicion: string;
  rutaConsulta: string;

  datosFilterEstaciones = [] as any;
  datosFilterEmbalses = [] as any;
  datosFilterPozos = [] as any;
  datosFilter = [] as any;
  listParametroXElemento = [] as any;
  capas: any[] = [];
  columnas = [
    {
      title: 'idObservacionXElemento',
      data: 'idObservacionXElemento',
      visible: false,
    },

    {
      title: 'idParametroXElemento',
      data: 'idParametroXElemento',
      visible: false,
    },

    {
       title: 'Elemento',
      data: 'estacion',
   },

    { title: 'Descripción', data: 'descripcion' },

    { title: 'Activo', data: 'activo', class: 'text-center' },
    {
      title: 'Estado observación',
      data: 'estadoObservacion',

      class: 'text-center',
    },
    { title: 'Fecha', data: 'fecha', class: 'text-center' },

    {
      title: 'fechaCargue',
      data: 'fechaCargue',
      class: 'text-center',
      visible: false,
    },
    {
      title: 'fechaCreacion',
      data: 'fechaCreacion',
      class: 'text-center',
      visible: false,
    },
    {
      title: 'fechaEstado',
      data: 'fechaEstado',
      class: 'text-center',
      visible: false,
    },
    {
      title: 'fechaModificacion',
      data: 'fechaModificacion',
      class: 'text-center',
      visible: false,
    },
    // {
    //   title: 'idEstacion',
    //   data: 'idEstacion',
    //   class: 'text-center',
    //   visible: false,
    // },
    {
      title: 'idEstadoObservacion',
      data: 'idEstadoObservacion',
      class: 'text-center',
      visible: false,
    },
    {
      title: 'idParametro',
      data: 'idParametro',
      class: 'text-center',
      visible: false,
    },
    {
      title: 'idTipoOrigenObservacion',
      data: 'idTipoOrigenObservacion',
      class: 'text-center',
      visible: false,
    },

    // { title: 'Origen', data: 'origen', class: 'text-center' },
    {
      title: 'Tipo origen observación',
      data: 'tipoOrigenObservacion',
      class: 'text-center',
    },

    {
      title: 'usuarioCargue',
      data: 'usuarioCargue',
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
      title: 'usuarioEstado',
      data: 'usuarioEstado',
      class: 'text-center',
      visible: false,
    },
    {
      title: 'usuarioModificacion',
      data: 'usuarioModificacion',
      class: 'text-center',
      visible: false,
    },

    { title: 'Valor', data: 'valor', class: 'text-center' },
  ];

  columnasEstaciones = [
    {
      title: 'ID',
      data: 'idEstacion',
      visible: false,
    },
    {
      title: 'Código estación IDEAM',
      data: 'codigoEstacionIdeam',
      filter: true,
      filterValue: '',
      tipo: 'texto',
    },
    {
      title: 'Código estación EAAB',
      data: 'codigoEstacionEaab',
      filter: true,
      filterValue: '',
      tipo: 'texto',
    },
    {
      title: 'Nombre',
      data: 'estacion',
      filter: true,
      filterValue: '',
      tipo: 'texto',
    },
  ];
  columnasEmbalses = [
    {
      title: 'ID',
      data: 'idEmbalse',
      visible: false,
      filter: true,
      filterValueMin: '',
      filterValueMax: '',
      tipo: 'rangoNumero',
    },
    {
      title: 'embalse',
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
  ];
  columnasPozos = [
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
      visible: true,
      class: 'text-center',
      filter: true,
      filterValue: '',
      tipo: 'texto',
    },
    {
      title: 'Zona Operativa EAAB ',
      data: 'zonaOperativaEaab',
      visible: true,
      class: 'text-center',
      filter: true,
      filterValue: '',
      tipo: 'seleccion',
    },
  ];

  botones = [
    {
      class: 'sish-boton-azul',
      title: 'agregar',
      action: 'agregar',
      icon: 'fas fa-tasks',
      enabled: this.validarCreacionElemento(),
    },
  ];
  botonesGenerales = [
    {
      text: 'Activar todos',
      action: 'Activacion',
      enabled: this.validarEdicionElemento(),
    },
    {
      text: 'Inactivar todos',
      action: 'Inactivar',
      enabled: this.validarEdicionElemento(),
    },
  ];

  listaDeElementos: any = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private serviciosGeograficosService: ServiciosGeograficosService,
    private serviciosDominiosValoresService: ServiciosDominiosValoresService,
    private serviciosParametrosService: ServiciosParametrosService,
    private serviciosEmbalcesService: ServiciosEmbalcesService,
    private serviciosPozosService: ServiciosPozosService,
    private serviciosEstacionesService: ServiciosEstacionesService,
    private serviciosCapasService: ServiciosCapasService,
    private serviciosObservacionesEstacionService: ServiciosObservacionesEstacionService,
    private serviciosObservacionesPozosService: ServiciosObservacionesPozosService,
    private serviciosObservacionesEmbalsesService: ServiciosObservacionesEmbalsesService
  ) { }

  ngOnInit(): void {
    this.construirFormulario();

    var fecha = new Date(); //Fecha actual
    var mes: any = fecha.getMonth() + 1; //obteniendo mes
    var dia: any = fecha.getDate(); //obteniendo dia
    var ano: any = fecha.getFullYear();

    if (dia < 10) {
      dia = '0' + dia; //agrega cero si el menor de 10
    }
    if (mes < 10) {
      mes = '0' + mes;
    }

    this.fechaActual = ano + '-' + mes + '-' + dia;
    // console.log('fecha actual', this.fechaActual);

    // Departamentos
    this.serviciosGeograficosService
      .obtenerDepartamentos()
      .subscribe((response) => {
        this.listaDepartamentos = response;
      });
    // parametros
    this.serviciosParametrosService
      .obtenerValoresParametrosSelect2()
      .subscribe((response) => {
        this.listParametro = response;
      });

    // entidad
    this.serviciosDominiosValoresService
      .obtenerValoresPorIdDominio(dominiosEnum.Entidad)
      .subscribe((response) => {
        this.listaEntidad = response;
      });

    // -----------
    this.cargarAreaHidrografica();
    this.onChanges();
  }

  cargarCapas() {
    this.serviciosCapasService
      .obtenerPorId(capasEnum.SubZonaHidrografica)
      .subscribe((response) => {
        // console.log('cargarCapas', response.urlVisualizar);
        this.capas.push({
          url: response.urlConsulta,
          id: capasEnumDatos(capasEnum.SubZonaHidrografica).id,
          visible: true,
          titulo: capasEnumDatos(capasEnum.SubZonaHidrografica).titulo,
        });
      });
    this.serviciosCapasService
      .obtenerPorId(capasEnum.Cuenca)
      .subscribe((response) => {
        // console.log('cargarCapas', response.urlVisualizar);
        this.capas.push({
          url: response.urlConsulta,
          id: capasEnumDatos(capasEnum.Cuenca).id,
          visible: true,
          titulo: capasEnumDatos(capasEnum.Cuenca).titulo,
        });
      });
    this.serviciosCapasService
      .obtenerPorId(capasEnum.Subcuenca)
      .subscribe((response) => {
        // console.log('cargarCapas', response.urlVisualizar);
        this.capas.push({
          url: response.urlConsulta,
          id: capasEnumDatos(capasEnum.Subcuenca).id,
          visible: true,
          titulo: capasEnumDatos(capasEnum.Subcuenca).titulo,
        });
      });
    this.serviciosCapasService
      .obtenerPorId(capasEnum.Microcuenca)
      .subscribe((response) => {
        // console.log('cargarCapas', response.urlVisualizar);
        this.capas.push({
          url: response.urlConsulta,
          id: capasEnumDatos(capasEnum.Microcuenca).id,
          visible: true,
          titulo: capasEnumDatos(capasEnum.Microcuenca).id,
        });
      });
  }

  accionRegistro(e: any) {
    switch (e.accion) {
      case accionesTablasEnum.Activar: {
        let elemento: any = e.registro;
        elemento.activo = estados.activo;

        this.actualizar(elemento);
        //statements;
        break;
      }
      case accionesTablasEnum.Inactivar: {
        let elemento: any = e.registro;
        elemento.activo = estados.inactivo;
        this.actualizar(elemento);
        break;
      }

      default: {
        //statements;
        break;
      }
    }
  }

  accionRegistroModal(e: any) {
    switch (e.accion) {
      case 'agregar': {
        //statements;
        if (e.registro != undefined) {
          // this.agregarlistaElementos(e.registro);
          /* if(e.registro.idEstacion!= tipoElemento.convencional) // Convencional
           {
             Swal.fire(
               'Observaciones',
               'Selecciono una estación no convencional para el ingreso de la observación.',
               'warning'
             );
           }*/
          if (this.validarElemeto(e.registro)) {
            this.listaBusqueda.push(e.registro);
          }
        }
        break;
      }
      default: {
        // console.log('default', e);
        //statements;
        break;
      }
    }
  }

  get areaHidrografica() {
    return this.formularioFiltros.get('areaHidrografica');
  }
  get zonaHidrografica() {
    return this.formularioFiltros.get('zonaHidrografica');
  }
  get subZonaHidrografica() {
    return this.formularioFiltros.get('subZonaHidrografica');
  }
  get cuenca() {
    return this.formularioFiltros.get('cuenca');
  }
  get subcuenca() {
    return this.formularioFiltros.get('subCuenca');
  }

  get microCuenca() {
    return this.formularioFiltros.get('microCuenca');
  }

  get fechaInicio() {
    return this.formularioFiltros.get('fechaInicio');
  }
  get fechaFin() {
    return this.formularioFiltros.get('fechaFin');
  }

  private construirFormulario() {
    this.formularioFiltros = this.formBuilder.group({
      idDepartamento: [''],
      idMunicipio: [''],
      areaHidrografica: [''],
      zonaHidrografica: [''],
      subZonaHidrografica: [''],
      cuenca: [''],
      subCuenca: [''],
      microcuenca: [''],
      idEntidad: [''],
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
      listaElementos: [[]],
      listParametros: [[]],
      idParametro: [''],
      idEstadoObservacion: [''],
    });
  }

  obtenerElementos(element: any) {
    if (
      this.datosFilter.length >= 1 ||
      this.listaBusqueda.length >= 1 ||
      this.listParametroXElemento.length >= 1
    ) {
      const elementoSeleccionado = element;

      Swal.fire({
        title: 'Desea Cambiar de elemento?',
        text: 'Se restableceran todos los valores ',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, Cambiar',
      }).then((result) => {
        if (result.isConfirmed) {
          this.listEntidades = [];
          this.listaAreaHidrografica = [];
          this.listaZonaHidrografica = [];
          this.listasubZonaHidrografica = [];
          this.listanivel = [];
          this.listaCuenca = [];
          this.listaMicrocuenca = [];
          this.listaEntidad = [];
          this.listaFrecuencia = [];
          this.listaBusqueda = [];
          this.datosFilter = [];
          this.listParametroXElemento = [];
          this.datosFilterEstaciones = [];
          this.datosFilterEmbalses = [];
          this.datosFilterPozos = [];

          this.formularioFiltros.reset();
          this.construirFormulario();

          this.formularioFiltros.value.elemento = elementoSeleccionado;
          this.elemento = elementoSeleccionado;
        }
      });
    }
  }


  resetfiltro() {

    this.listEntidades = [];
    this.listaAreaHidrografica = [];
    this.listaZonaHidrografica = [];
    this.listasubZonaHidrografica = [];
    this.listanivel = [];
    this.listaCuenca = [];
    this.listaMicrocuenca = [];
    this.listaEntidad = [];
    this.listaFrecuencia = [];
    this.listaBusqueda = [];
    this.datosFilter = [];
    this.listParametroXElemento = [];
    this.datosFilterEstaciones = [];
    this.datosFilterEmbalses = [];
    this.datosFilterPozos = [];

    this.formularioFiltros.reset();
    this.elemento = 0;
  }

  filtrar(elemento: any) {
    var objetoBusqueda: any;

    this.rutaEdicion =
      'configuracion/gestionObservaciones/' + this.elemento + '/E/';
    this.rutaConsulta =
      'configuracion/gestionObservaciones/' + this.elemento + '/V/';

    try {
      if (this.formularioFiltros.valid) {
        switch (elemento) {
          case '1': {
            Swal.fire({
              title: 'Procesando...',
              html: 'Por favor espere',
              allowOutsideClick: false,
              showConfirmButton: false,
              didOpen: async () => {
                console.time('executionTime');

                Swal.showLoading();

                this.formularioFiltros.value.listaElementos =
                  this.listaBusqueda.map((elemento: any) => elemento.idEstacion);
                this.formularioFiltros.value.listParametros =
                  this.listParametroXElemento;
                objetoBusqueda = this.formularioFiltros.value;

                this.serviciosObservacionesEstacionService
                  .obtenerDTO(objetoBusqueda)
                  .subscribe((Response) => {
                    this.datosFilter = Response.map(
                      (p: { [x: string]: any; idParametroXEstacion: any }) => {
                        // crear nueva propiedad de nombre Del Elemento
                        p[`idParametroXElemento`] = p.idParametroXEstacion;
                        p[`idObservacionXElemento`] =
                          p.idObservacionXEstacionInicial;
                        // remover la propiedad actual
                        delete p.idParametroXEstacion;
                        delete p.idObservacionXEstacionInicial;
                        // retornar el nuevo objeto
                        return p;
                      }
                    );
                    Swal.close();

                    console.timeEnd('executionTime');
                  });
              }, willClose: async () => {
                Swal.hideLoading();
              }

            });
            break;
          }
          case '2': {
            // Embalses
            Swal.fire({
              title: 'Procesando...',
              html: 'Por favor espere',
              allowOutsideClick: false,
              showConfirmButton: false,
              didOpen: async () => {
                console.time('executionTime');

                Swal.showLoading();
                this.formularioFiltros.value.listaElementos =
                  this.listaBusqueda.map((elemento: any) => elemento.idEmbalse);
                this.formularioFiltros.value.listParametros =
                  this.listParametroXElemento;
                objetoBusqueda = this.formularioFiltros.value;

                this.serviciosObservacionesEmbalsesService
                  .obtenerDTO(objetoBusqueda)
                  .subscribe((Response) => {
                    this.datosFilter = Response.map(
                      (p: { [x: string]: any; idParametroXEmbalse: any }) => {
                        // crear nueva propiedad de nombre Del Elemento
                        p[`idParametroXElemento`] = p.idParametroXEmbalse;
                        p[`idObservacionXElemento`] =
                          p.idObservacionXEmbalseInicial;
                        // remover la propiedad actual
                        delete p.idParametroXEmbalse;
                        delete p.idObservacionXEmbalseInicial;
                        // retornar el nuevo objeto
                        return p;
                      }
                    );
                    Swal.close();

                    console.timeEnd('executionTime');
                  });
              }, willClose: async () => {
                Swal.hideLoading();
              }

            });
            break;
          }
          case '3': {
            // Pozos
            Swal.fire({
              title: 'Procesando...',
              html: 'Por favor espere',
              allowOutsideClick: false,
              showConfirmButton: false,
              didOpen: async () => {
                console.time('executionTime');

                Swal.showLoading();
                this.formularioFiltros.value.listaElementos =
                  this.listaBusqueda.map((elemento: any) => elemento.idPozo);
                this.formularioFiltros.value.listParametros =
                  this.listParametroXElemento;
                objetoBusqueda = this.formularioFiltros.value;
                this.serviciosObservacionesPozosService
                  .obtenerDTO(objetoBusqueda)
                  .subscribe((Response) => {
                    this.datosFilter = Response.map(
                      (p: { [x: string]: any; idParametroXPozo: any }) => {
                        // crear nueva propiedad de nombre Del Elemento
                        p[`idParametroXElemento`] = p.idParametroXPozo;
                        p[`idObservacionXElemento`] = p.idObservacionXPozoInicial;
                        // remover la propiedad actual
                        delete p.idParametroXPozo;
                        delete p.idObservacionXPozoInicial;
                        // retornar el nuevo objeto
                        return p;
                      }
                    );
                    Swal.close();

                    console.timeEnd('executionTime');
                  });
              }, willClose: async () => {
                Swal.hideLoading();
              }

            });
            break;
          }
          default: {
            // console.log('elemento', elemento);
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  private cargarMunicipiosPorDepartamento() {
    this.serviciosGeograficosService
      .obtenerMunicipiosPorIdDepartamento(this.tempIdDepartamento)
      .subscribe((response) => {
        this.listaMunicipios = response;
      });
  }
  cambioDepartamento(departamentoSelected: any) {
    if (departamentoSelected != undefined && departamentoSelected != '') {
      this.tempIdDepartamento = departamentoSelected;
      this.cargarMunicipiosPorDepartamento();
    }
  }

  obtenerEstaciones() {
    Swal.fire({
      title: 'Cargando...',
      html: 'Por favor espere',
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: async () => {
        console.time('executionTime');

        Swal.showLoading();
        this.serviciosEstacionesService
          .obtenerEstaciones()
          .subscribe((response) => {
            this.datosFilterEstaciones = response;
            Swal.close();

            console.timeEnd('executionTime');
          });
      },
      willClose: async () => {
        Swal.hideLoading();
      }

    });
  }
  obtenerEmbalses() {
    Swal.fire({
      title: 'Cargando...',
      html: 'Por favor espere',
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: async () => {
        console.time('executionTime');

        Swal.showLoading();
        this.serviciosEmbalcesService
          .obtenerEembalsesDTO()
          .subscribe((response) => {
            this.datosFilterEmbalses = response;
            Swal.close();

            console.timeEnd('executionTime');
          });
      },
      willClose: async () => {
        Swal.hideLoading();
      }
    });
  }
  obtenerPozos() {
    Swal.fire({
      title: 'Cargando...',
      html: 'Por favor espere',
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: async () => {
        console.time('executionTime');

        Swal.showLoading();
        this.serviciosPozosService.obtenerPozosDTO().subscribe((response) => {
          this.datosFilterPozos = response;
          Swal.close();

          console.timeEnd('executionTime');
        });
      },
      willClose: async () => {
        Swal.hideLoading();
      }
    });
  }

  actualizar(DatoElemento: any) {
    switch (this.elemento) {
      case '1': {
        let elementoActualizar: any = {
          idObservacionXEstacionInicial: DatoElemento.idObservacionXElemento,
          idParametroXEstacion: DatoElemento.idParametroXElemento,
          activo: DatoElemento.activo,
          descripcion: DatoElemento.descripcion,
          estacion: DatoElemento.estacion,
          estadoObservacion: DatoElemento.estadoObservacion,
          fecha: DatoElemento.fecha,
          fechaCargue: DatoElemento.fechaCargue,
          fechaCreacion: DatoElemento.fechaCreacion,
          fechaEstado: DatoElemento.fechaEstado,
          fechaModificacion: DatoElemento.fechaModificacion,
          frecuencia: DatoElemento.frecuencia,
          idEstacion: DatoElemento.idEstacion,
          idEstadoObservacion: DatoElemento.idEstadoObservacion,
          idFlagObservacion: DatoElemento.idFlagObservacion,
          idParametro: DatoElemento.idParametro,
          idTipoOrigenObservacion: DatoElemento.idTipoOrigenObservacion,
          origen: DatoElemento.origen,
          tipoOrigenObservacion: DatoElemento.tipoOrigenObservacion,
          usuarioCargue: DatoElemento.usuarioCargue,
          usuarioCreacion: DatoElemento.usuarioCreacion,
          usuarioEstado: DatoElemento.usuarioEstado,
          usuarioModificacion: DatoElemento.usuarioModificacion,
          valor: DatoElemento.valor,
        };
        this.serviciosObservacionesEstacionService
          .actualizar(elementoActualizar)
          .subscribe((Response) => {
            // console.log('llego', Response);
            this.filtrar(this.elemento);
          });

        break;
      }
      case '2': {
        // Embalses

        let elementoActualizar: any = {
          idObservacionXEmbalseInicial: DatoElemento.idObservacionXElemento,
          idParametroXEmbalse: DatoElemento.idParametroXElemento,
          activo: DatoElemento.activo,
          descripcion: DatoElemento.descripcion,
          estacion: DatoElemento.estacion,
          estadoObservacion: DatoElemento.estadoObservacion,
          fecha: DatoElemento.fecha,
          fechaCargue: DatoElemento.fechaCargue,
          fechaCreacion: DatoElemento.fechaCreacion,
          fechaEstado: DatoElemento.fechaEstado,
          fechaModificacion: DatoElemento.fechaModificacion,
          frecuencia: DatoElemento.frecuencia,
          idEstacion: DatoElemento.idEstacion,
          idEstadoObservacion: DatoElemento.idEstadoObservacion,
          idFlagObservacion: DatoElemento.idFlagObservacion,
          idParametro: DatoElemento.idParametro,
          idTipoOrigenObservacion: DatoElemento.idTipoOrigenObservacion,
          origen: DatoElemento.origen,
          tipoOrigenObservacion: DatoElemento.tipoOrigenObservacion,
          usuarioCargue: DatoElemento.usuarioCargue,
          usuarioCreacion: DatoElemento.usuarioCreacion,
          usuarioEstado: DatoElemento.usuarioEstado,
          usuarioModificacion: DatoElemento.usuarioModificacion,
          valor: DatoElemento.valor,
        };

        this.serviciosObservacionesEmbalsesService
          .actualizar(elementoActualizar)
          .subscribe((Response) => {
            // console.log('llego al guardar ', Response);
            this.filtrar(this.elemento);
          });

        break;
      }
      case '3': {
        //  Pozos

        let elementoActualizar: any = {
          idObservacionXPozoInicial: DatoElemento.idObservacionXElemento,
          idParametroXPozo: DatoElemento.idParametroXElemento,
          activo: DatoElemento.activo,
          descripcion: DatoElemento.descripcion,
          estacion: DatoElemento.estacion,
          estadoObservacion: DatoElemento.estadoObservacion,
          fecha: DatoElemento.fecha,
          fechaCargue: DatoElemento.fechaCargue,
          fechaCreacion: DatoElemento.fechaCreacion,
          fechaEstado: DatoElemento.fechaEstado,
          fechaModificacion: DatoElemento.fechaModificacion,
          frecuencia: DatoElemento.frecuencia,
          idEstacion: DatoElemento.idEstacion,
          idEstadoObservacion: DatoElemento.idEstadoObservacion,
          idFlagObservacion: DatoElemento.idFlagObservacion,
          idParametro: DatoElemento.idParametro,
          idTipoOrigenObservacion: DatoElemento.idTipoOrigenObservacion,
          origen: DatoElemento.origen,
          tipoOrigenObservacion: DatoElemento.tipoOrigenObservacion,
          usuarioCargue: DatoElemento.usuarioCargue,
          usuarioCreacion: DatoElemento.usuarioCreacion,
          usuarioEstado: DatoElemento.usuarioEstado,
          usuarioModificacion: DatoElemento.usuarioModificacion,
          valor: DatoElemento.valor,
        };

        this.serviciosObservacionesPozosService
          .actualizar(elementoActualizar)
          .subscribe((Response) => {
            // console.log('llego al guardar ', Response);
            this.filtrar(this.elemento);
          });
        break;
      }
      default: {
        // console.log('elemento', DatoElemento);
      }
    }
  }

  agregarlistaParametros(parametro: any) {
    if (parametro != undefined) {
      if (this.validarParametro(parametro)) {
        this.listParametroXElemento.push(parseInt(parametro));
      }
    }
  }
  eliminarListaParametros(id: any) {
    var i = this.listParametroXElemento.indexOf(id);

    if (i !== -1) {
      this.listParametroXElemento.splice(i, 1);
    }
  }
  eliminarLista(id: any) {
    var i = this.listaBusqueda.indexOf(id);

    if (i !== -1) {
      this.listaBusqueda.splice(i, 1);
    }
  }

  onChanges(): void {
    if (this.formularioFiltros) {
      this.areaHidrografica?.valueChanges.subscribe((val) => {
        this.cargarZonaHidrografica();
      });
      this.zonaHidrografica?.valueChanges.subscribe((val) => {
        this.cargarSubZonaHidrografica();
      });
      this.subZonaHidrografica?.valueChanges.subscribe((val) => {
        this.cargarCuenca();
      });
      this.cuenca?.valueChanges.subscribe((val) => {
        this.cargarSubcuenca();
      });
      this.subcuenca?.valueChanges.subscribe((val) => {
        this.cargarMicroCuenca();
      });
    }
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


  cargarAreaHidrografica() {
    this.serviciosCapasService
      // .obtenerPorId(capasEnum.Zonificacion)
      .obtenerPorId(capasEnum.SubZonaHidrografica)
      .subscribe((response) => {
        this.serviciosGeograficosService
          .consultarDatosCapa(
            response.urlConsulta,
            '1=1',
            'CODAH,NOMBAH',
            true,
            'NOMBAH'
          )
          .then((response: any) => {
            let datos = response.features
              .map(
                (f: any) => f.attributes
              )

              .map((zh: any) => {

                return { id: zh.CODAH, text: zh.CODAH + '-' + zh.NOMBAH };
              });
            this.listaAreaHidrografica = datos;
            // console.log('listaAreaHidrografica', datos);
          });
      });
  }

  cargarZonaHidrografica() {
    // console.log('Area hidrográfica', this.areaHidrografica?.value);
    if (this.areaHidrografica?.value) {
      this.serviciosCapasService
        .obtenerPorId(capasEnum.SubZonaHidrografica)
        // .obtenerPorId(capasEnum.Zonificacion)
        .subscribe((response) => {
          // console.log('llegaron parametros', response);
          this.serviciosGeograficosService
            .consultarDatosCapa(
              response.urlConsulta,
              'CODAH=' + this.areaHidrografica?.value,
              'CODZH,NOMBZH',
              true,
              'NOMBZH'
            )
            .then((response: any) => {

              let datos = response.features
                .map((f: any) => f.attributes)
                .map((zh: any) => {
                  return { id: zh.CODZH, text: zh.CODZH + '-' + zh.NOMBZH };
                });
              // console.log('serviciosCapasService OK', datos);
              this.listaZonaHidrografica = datos;
            });
        });
    }
  }

  cargarSubZonaHidrografica() {
    if (this.zonaHidrografica?.value) {
      this.serviciosCapasService
        .obtenerPorId(capasEnum.SubZonaHidrografica)
        .subscribe((response) => {
          this.serviciosGeograficosService
            .consultarDatosCapa(
              response.urlConsulta,
              'CODZH=' + this.zonaHidrografica?.value,
              // '1=1',
              // '*',
              'CODSZH,NOMBSZH',
              true,
              'NOMBSZH'
              // ''
            )
            .then((response: any) => {
              let datos = response.features
                .map((f: any) => f.attributes)
                .map((zh: any) => {
                  return { id: zh.CODSZH, text: zh.CODSZH + '-' + zh.NOMBSZH };
                });
              // console.log('serviciosCapasService OK', datos);
              this.listasubZonaHidrografica = datos;
            });
        });
    }
  }

  cargarCuenca() {
    if (this.subZonaHidrografica?.value) {
      this.serviciosCapasService
        .obtenerPorId(capasEnum.Cuenca)
        .subscribe((response) => {
          this.serviciosGeograficosService
            .consultarDatosCapa(
              response.urlConsulta,
              'CODSZH=' + this.subZonaHidrografica?.value,
              // '1=1',
              // '*',
              'CODCH,NOMBCH',
              true,
              'NOMBCH'
              // ''
            )
            .then((response: any) => {
              let datos = response.features
                .map((f: any) => f.attributes)
                .map((zh: any) => {
                  return { id: zh.CODCH, text: zh.CODCH + '-' + zh.NOMBCH };
                });
              // console.log('serviciosCapasService OK', datos);
              this.listaCuenca = datos;
            });
        });
    }
  }
  cargarSubcuenca() {
    if (this.cuenca?.value) {
      this.serviciosCapasService
        .obtenerPorId(capasEnum.Subcuenca)
        .subscribe((response) => {
          this.serviciosGeograficosService
            .consultarDatosCapa(
              response.urlConsulta,
              'CODCH=' + this.cuenca?.value,
              // '1=1',
              // '*',
              'CODSCH,NOMSCH',
              true,
              'NOMSCH'
              // ''
            )
            .then((response: any) => {
              let datos = response.features
                .map((f: any) => f.attributes)
                .map((zh: any) => {
                  return { id: zh.CODSCH, text: zh.CODSCH + '-' + zh.NOMSCH };
                });
              // console.log('serviciosCapasService OK', datos);
              this.listaSubcuenca = datos;
            });
        });
    }
  }
  cargarMicroCuenca() {
    if (this.subcuenca?.value) {
      this.serviciosCapasService
        .obtenerPorId(capasEnum.Microcuenca)
        .subscribe((response) => {
          this.serviciosGeograficosService
            .consultarDatosCapa(
              response.urlConsulta,
              'CODSCH=' + this.subcuenca?.value,
              // '1=1',
              // '*',
              'CODMC,NOMBMC',
              true,
              'NOMBMC'
              // ''
            )
            .then((response: any) => {
              let datos = response.features
                .map((f: any) => f.attributes)
                .map((zh: any) => {
                  return { id: zh.CODMC, text: zh.CODMC + '-' + zh.NOMBMC };
                });
              // console.log('serviciosCapasService OK', datos);
              this.listaMicrocuenca = datos;
            });
        });
    }
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
                const element = this.listaDeElementos[index];
                element.activo = estados.activo;

                switch (this.elemento) {
                  case '1': {
                    let elementoActualizar: any = {
                      idObservacionXEstacionInicial:
                        element.idObservacionXElemento,
                      idParametroXEstacion: element.idParametroXElemento,
                      activo: element.activo,
                      descripcion: element.descripcion,
                      estacion: element.estacion,
                      estadoObservacion: element.estadoObservacion,
                      fecha: element.fecha,
                      fechaCargue: element.fechaCargue,
                      fechaCreacion: element.fechaCreacion,
                      fechaEstado: element.fechaEstado,
                      fechaModificacion: element.fechaModificacion,
                      frecuencia: element.frecuencia,
                      idEstacion: element.idEstacion,
                      idEstadoObservacion: element.idEstadoObservacion,
                      idFlagObservacion: element.idFlagObservacion,
                      idParametro: element.idParametro,
                      idTipoOrigenObservacion: element.idTipoOrigenObservacion,
                      origen: element.origen,
                      tipoOrigenObservacion: element.tipoOrigenObservacion,
                      usuarioCargue: element.usuarioCargue,
                      usuarioCreacion: element.usuarioCreacion,
                      usuarioEstado: element.usuarioEstado,
                      usuarioModificacion: element.usuarioModificacion,
                      valor: element.valor,
                    };
                    this.serviciosObservacionesEstacionService
                      .actualizar(elementoActualizar)
                      .subscribe((Response) => {
                        // console.log('llego', Response);
                      });

                    break;
                  }
                  case '2': {
                    // Embalses

                    let elementoActualizar: any = {
                      idObservacionXEmbalseInicial:
                        element.idObservacionXElemento,
                      idParametroXEmbalse: element.idParametroXElemento,
                      activo: element.activo,
                      descripcion: element.descripcion,
                      estacion: element.estacion,
                      estadoObservacion: element.estadoObservacion,
                      fecha: element.fecha,
                      fechaCargue: element.fechaCargue,
                      fechaCreacion: element.fechaCreacion,
                      fechaEstado: element.fechaEstado,
                      fechaModificacion: element.fechaModificacion,
                      frecuencia: element.frecuencia,
                      idEstacion: element.idEstacion,
                      idEstadoObservacion: element.idEstadoObservacion,
                      idFlagObservacion: element.idFlagObservacion,
                      idParametro: element.idParametro,
                      idTipoOrigenObservacion: element.idTipoOrigenObservacion,
                      origen: element.origen,
                      tipoOrigenObservacion: element.tipoOrigenObservacion,
                      usuarioCargue: element.usuarioCargue,
                      usuarioCreacion: element.usuarioCreacion,
                      usuarioEstado: element.usuarioEstado,
                      usuarioModificacion: element.usuarioModificacion,
                      valor: element.valor,
                    };

                    this.serviciosObservacionesEmbalsesService
                      .actualizar(elementoActualizar)
                      .subscribe((Response) => { });

                    break;
                  }
                  case '3': {
                    //  Pozos

                    let elementoActualizar: any = {
                      idObservacionXPozoInicial: element.idObservacionXElemento,
                      idParametroXPozo: element.idParametroXElemento,
                      activo: element.activo,
                      descripcion: element.descripcion,
                      estacion: element.estacion,
                      estadoObservacion: element.estadoObservacion,
                      fecha: element.fecha,
                      fechaCargue: element.fechaCargue,
                      fechaCreacion: element.fechaCreacion,
                      fechaEstado: element.fechaEstado,
                      fechaModificacion: element.fechaModificacion,
                      frecuencia: element.frecuencia,
                      idEstacion: element.idEstacion,
                      idEstadoObservacion: element.idEstadoObservacion,
                      idFlagObservacion: element.idFlagObservacion,
                      idParametro: element.idParametro,
                      idTipoOrigenObservacion: element.idTipoOrigenObservacion,
                      origen: element.origen,
                      tipoOrigenObservacion: element.tipoOrigenObservacion,
                      usuarioCargue: element.usuarioCargue,
                      usuarioCreacion: element.usuarioCreacion,
                      usuarioEstado: element.usuarioEstado,
                      usuarioModificacion: element.usuarioModificacion,
                      valor: element.valor,
                    };

                    this.serviciosObservacionesPozosService
                      .actualizar(elementoActualizar)
                      .subscribe((Response) => {
                        // console.log('llego al guardar ', Response);
                      });
                    break;
                  }
                  default: {
                    // console.log('elemento', element);
                  }
                }
              }
            },
            willClose: () => {
              this.toast.fire({
                icon: 'success',
                title:
                  'Se Activaron ' + this.listaDeElementos.length + ' Elementos',
              });
              this.listaDeElementos = [];
              this.filtrar(this.elemento);
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
                const element = this.listaDeElementos[index];
                element.activo = estados.inactivo;

                switch (this.elemento) {
                  case '1': {
                    let elementoActualizar: any = {
                      idObservacionXEstacionInicial:
                        element.idObservacionXElemento,
                      idParametroXEstacion: element.idParametroXElemento,
                      activo: element.activo,
                      descripcion: element.descripcion,
                      estacion: element.estacion,
                      estadoObservacion: element.estadoObservacion,
                      fecha: element.fecha,
                      fechaCargue: element.fechaCargue,
                      fechaCreacion: element.fechaCreacion,
                      fechaEstado: element.fechaEstado,
                      fechaModificacion: element.fechaModificacion,
                      frecuencia: element.frecuencia,
                      idEstacion: element.idEstacion,
                      idEstadoObservacion: element.idEstadoObservacion,
                      idFlagObservacion: element.idFlagObservacion,
                      idParametro: element.idParametro,
                      idTipoOrigenObservacion: element.idTipoOrigenObservacion,
                      origen: element.origen,
                      tipoOrigenObservacion: element.tipoOrigenObservacion,
                      usuarioCargue: element.usuarioCargue,
                      usuarioCreacion: element.usuarioCreacion,
                      usuarioEstado: element.usuarioEstado,
                      usuarioModificacion: element.usuarioModificacion,
                      valor: element.valor,
                    };
                    this.serviciosObservacionesEstacionService
                      .actualizar(elementoActualizar)
                      .subscribe((Response) => {
                        // console.log('llego', Response);
                      });

                    break;
                  }
                  case '2': {
                    // Embalses

                    let elementoActualizar: any = {
                      idObservacionXEmbalseInicial:
                        element.idObservacionXElemento,
                      idParametroXEmbalse: element.idParametroXElemento,
                      activo: element.activo,
                      descripcion: element.descripcion,
                      estacion: element.estacion,
                      estadoObservacion: element.estadoObservacion,
                      fecha: element.fecha,
                      fechaCargue: element.fechaCargue,
                      fechaCreacion: element.fechaCreacion,
                      fechaEstado: element.fechaEstado,
                      fechaModificacion: element.fechaModificacion,
                      frecuencia: element.frecuencia,
                      idEstacion: element.idEstacion,
                      idEstadoObservacion: element.idEstadoObservacion,
                      idFlagObservacion: element.idFlagObservacion,
                      idParametro: element.idParametro,
                      idTipoOrigenObservacion: element.idTipoOrigenObservacion,
                      origen: element.origen,
                      tipoOrigenObservacion: element.tipoOrigenObservacion,
                      usuarioCargue: element.usuarioCargue,
                      usuarioCreacion: element.usuarioCreacion,
                      usuarioEstado: element.usuarioEstado,
                      usuarioModificacion: element.usuarioModificacion,
                      valor: element.valor,
                    };

                    this.serviciosObservacionesEmbalsesService
                      .actualizar(elementoActualizar)
                      .subscribe((Response) => { });

                    break;
                  }
                  case '3': {
                    //  Pozos

                    let elementoActualizar: any = {
                      idObservacionXPozoInicial: element.idObservacionXElemento,
                      idParametroXPozo: element.idParametroXElemento,
                      activo: element.activo,
                      descripcion: element.descripcion,
                      estacion: element.estacion,
                      estadoObservacion: element.estadoObservacion,
                      fecha: element.fecha,
                      fechaCargue: element.fechaCargue,
                      fechaCreacion: element.fechaCreacion,
                      fechaEstado: element.fechaEstado,
                      fechaModificacion: element.fechaModificacion,
                      frecuencia: element.frecuencia,
                      idEstacion: element.idEstacion,
                      idEstadoObservacion: element.idEstadoObservacion,
                      idFlagObservacion: element.idFlagObservacion,
                      idParametro: element.idParametro,
                      idTipoOrigenObservacion: element.idTipoOrigenObservacion,
                      origen: element.origen,
                      tipoOrigenObservacion: element.tipoOrigenObservacion,
                      usuarioCargue: element.usuarioCargue,
                      usuarioCreacion: element.usuarioCreacion,
                      usuarioEstado: element.usuarioEstado,
                      usuarioModificacion: element.usuarioModificacion,
                      valor: element.valor,
                    };

                    this.serviciosObservacionesPozosService
                      .actualizar(elementoActualizar)
                      .subscribe((Response) => {
                        // console.log('llego al guardar ', Response);
                      });
                    break;
                  }
                  default: {
                    console.log('elemento', element);
                  }
                }
              }
            },
            willClose: () => {
              this.toast.fire({
                icon: 'success',
                title:
                  'Se Activaron ' + this.listaDeElementos.length + ' Elementos',
              });
              this.listaDeElementos = [];
              this.filtrar(this.elemento);
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

  validarParametro(parametro: any) {
    for (let index = 0; index < this.listParametroXElemento.length; index++) {
      // Validar Estacion
      if (
        // validar parametro
        this.listParametroXElemento[index] == parametro
      ) {
        this.toast.fire({
          icon: 'info',
          title: 'El parametro ya se encuentra agregado',
        });

        return false;
      }
    }

    if (parametro == '') {
      return false;
    }
    if (this.listParametroXElemento.length >= 10) {
      this.toast.fire({
        icon: 'info',
        title: 'Ya cuenta con 10 Parametros Agregados',
      });

      return false;
    }

    return true;
  }
  validarElemeto(elemento: any) {
    for (let index = 0; index < this.listaBusqueda.length; index++) {
      // Validar Estacion
      switch (this.elemento) {
        case '1': {
          if (
            // validar parametro
            this.listaBusqueda[index].idEstacion == elemento.idEstacion
          ) {
            this.toast.fire({
              icon: 'info',
              title: 'La Estacion ya se encuentra agregado',
            });

            return false;
          }
          break;
        }
        case '2': {
          // Embalses

          if (
            // validar parametro
            this.listaBusqueda[index].idEmbalse == elemento.idEmbalse
          ) {
            this.toast.fire({
              icon: 'info',
              title: 'El Embalse ya se encuentra agregado',
            });

            return false;
          }

          break;
        }
        case '3': {
          // Pozos

          if (
            // validar parametro
            this.listaBusqueda[index].idPozo == elemento.idPozo
          ) {
            this.toast.fire({
              icon: 'info',
              title: 'El Pozo ya se encuentra agregado',
            });

            return false;
          }

          break;
        }
        default: {
          // console.log('elemento', elemento);
        }
      }
    }

    if (this.listaBusqueda.length >= 10) {
      this.toast.fire({
        icon: 'info',
        title: 'Ya cuenta con 10 elementos Agregados',
      });

      return false;
    }

    return true;
  }

  validarConsultaElemento(): boolean {
    switch (this.elemento) {
      case '1':
        return this.validarPermiso('ConsultarObservacionesXEstacionInicial');

      case '2':
        return this.validarPermiso('ConsultarObservacionesXEmbalseInicial');

      case '3':
        return this.validarPermiso('ConsultarObservacionesXPozoInicial');

      default:
        return this.validarPermiso('ConsultarObservacionesXEstacionInicial');
    }
  }

  validarEdicionElemento(): boolean {
    switch (this.elemento) {
      case '1':
        return this.validarPermiso('ActualizarObservacionesXEstacionInicial');

      case '2':
        return this.validarPermiso('ActualizarObservacionesXEmbalseInicial');

      case '3':
        return this.validarPermiso('ActualizarObservacionesXPozoInicial');

      default:
        return this.validarPermiso('ActualizarObservacionesXEstacionInicial');
    }
  }

  validarCreacionElemento(): boolean {
    switch (this.elemento) {
      case '1':
        return this.validarPermiso('CrearObservacionesXEstacionInicial');

      case '2':
        return this.validarPermiso('CrearObservacionesXEmbalseInicial');

      case '3':
        return this.validarPermiso('CrearObservacionesXPozoInicial');

      default:
        return this.validarPermiso('CrearObservacionesXEstacionInicial');
    }
  }

  // Validacion de permisos 
  validarPermiso(permiso: any): boolean {
    return MetodosGlobales.validarPermiso(permiso);
  }
}
