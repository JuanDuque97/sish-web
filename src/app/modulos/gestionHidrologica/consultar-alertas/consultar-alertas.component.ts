import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ServiciosGeograficosService } from 'src/app/common/mapa/servicios-geograficos.service';
import { accionesTablasEnum } from 'src/app/modelo/enum/acciones-tablas-enum';
import { dominiosEnum } from 'src/app/modelo/enum/dominios-enum';
import Swal from 'sweetalert2';
import { ServiciosDominiosValoresService } from '../../configuracion/dominios/servicios-dominios-valores.service';
import { ServiciosEmbalcesService } from '../../elementos/embalses/servicios-embalses.service';
import { ServiciosEstacionesService } from '../../elementos/estaciones/servicios-estaciones.service';
import { ServiciosPozosService } from '../../elementos/pozos/servicios-pozos.service';
import { ServiciosObservacionesEmbalsesService } from '../../observaciones/servicios-observaciones-embalses.service';
import { ServiciosObservacionesEstacionService } from '../../observaciones/servicios-observaciones-estacion.service';
import { ServiciosObservacionesPozosService } from '../../observaciones/servicios-observaciones-pozos.service';
import { ServiciosParametrosService } from '../../parametros/servicios-parametros.service';
import { ServiciosCriteriosAceptacion } from '../cirterios/servicios-gestion-criterios.service';
import { ServiciosvalorParametroXCriterio } from '../cirterios/servicios-ValoresParametros-criterio.service';
import { IValidaObervacion } from 'src/app/modelo/configuracion/validarObservacion';
import { ServiciosParametrosCriterio } from '../cirterios/servicios-parametros-criterio.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AnyTxtRecord } from 'dns';

@Component({
  selector: 'app-consultar-alertas',
  templateUrl: './consultar-alertas.component.html',
})

export class ConsultarAlertasComponent implements OnInit {
  public formularioFiltros!: FormGroup;
  public formularioCalidad!: FormGroup;
  @ViewChild('ModalCalidad', { static: false }) ModalCalidad: ElementRef;

  // Mapa
  // Set our map properties
  mapCenter = [-73.9, 4.4];
  basemapType = 'topo';
  mapZoomLevel = 9;
  objetoValidar: any;
  listaElementosSeleccionados: { id: any; text: any }[];
  // See app.component.html
  mapLoadedEvent(status: Event) {

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

  name = '';
  url: string = "https://www.folkloredelnorte.com.ar/cancionero/v/virgenindia.html";
  urlSafe: SafeResourceUrl;
  public validar: number;
  public idelemento: number;
  public listaMunicipios = [];
  public listaDepartamentos = [];
  public departamentoSelected: any;
  private tempIdDepartamento: number = 0;
  private valorMaximoH: number;
  private valorMiniH: number;
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
  public listaValidacion: any;
  public listaMicrocuenca = [];
  public date = new Date();
  public hoy = String(this.date.getFullYear() + '-' + String(this.date.getMonth() + 1).padStart(2, '0') + '-' + this.date.getDate()).padStart(2, '0');
  public id: number;
  public listaEntidad = [];
  public listParametro: any[] = [];
  public listaFrecuencia = [];
  public listaSubcuenca = [];
  public listaBusqueda: any[] = [];
  public elemento: any = 0;
  public periodo: number = 0;
  public parametro: number;
  public listValidaObervacion: any;
  public valorObservacion: number;
  public criterioCalidadSeleccionado: number;
  // public idNewEstadoObservacion: number;
  public FechaObservacion: string;
  public estadoObservacion: string;
  public observacionesCalidad: string;
  public OrigenObservacion: string;
  public listObservaciones: any;

  // rutaGeneral = 'configuracion/gestionObservaciones/0/C/0';
  // rutaEdicion: string;
  // rutaConsulta: string;

  datosFilterEstaciones = [] as any;
  listValidaciones = [] as any;
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

    { title: 'Descripción', data: 'descripcion' },
    { title: 'Observacion calidad', data: 'observacioneCalidad' },
    { title: 'Calidad', data: 'validarCalidad' },

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
  columnasValidar = [
    {
      title: 'ID',
      data: 'id_valida_observaciones',
      visible: false,
      filterValueMin: '',
      filterValueMax: '',
      tipo: 'rangoNumero',
    },
    {
      title: 'fecha Validación',
      data: 'fechaValidacion',
      filter: true,
      filterValue: '',
      tipo: 'texto',
    },
    {
      title: 'criterio',
      data: 'criterio',
      filter: true,
      filterValue: '',
      tipo: 'texto',
    },
    {
      title: 'Elemento',
      data: 'elemento',
      filter: true,
      filterValue: '',
      tipo: 'texto',
    },
    {
      title: 'Parámetro',
      data: 'parametro',
      filter: true,
      filterValue: '',
      tipo: 'texto',
    },
    {
      title: 'Valor',
      data: 'valor',
      filter: true,
      filterValue: '',
      tipo: 'texto',
    },
    {
      title: 'Tipo Elemento',
      data: 'tipoElemento',
      filter: true,
      filterValue: '',
      tipo: 'texto',
    },
    {
      title: 'Resultado',
      data: 'estado',
      filter: true,
      filterValue: '',
      tipo: 'texto',
    },
    {
      title: 'Usuario',
      data: 'usuario',
      filter: true,
      filterValue: '',
      tipo: 'texto',
    }
  ];

  botones2 = [{
    class: 'sish-boton-azul',
    title: 'Permisos',
    action: 'permisos',
    icon: 'fas fa-tasks',
  },
  ];




  listaDeElementos: any = [];
  listaDeCriterios: any = [];

  constructor(
    public sanitizer: DomSanitizer,
    private router: Router,
    private formBuilder: FormBuilder,
    private serviciosGeograficosService: ServiciosGeograficosService,
    private serviciosDominiosValoresService: ServiciosDominiosValoresService,
    private serviciosParametrosService: ServiciosParametrosService,
    private serviciosEmbalcesService: ServiciosEmbalcesService,
    private serviciosPozosService: ServiciosPozosService,
    private serviciosEstacionesService: ServiciosEstacionesService,
    private serviciosCriteriosAceptacion: ServiciosCriteriosAceptacion,
    private serviciosObservacionesEstacionService: ServiciosObservacionesEstacionService,
    private serviciosObservacionesPozosService: ServiciosObservacionesPozosService,
    private serviciosvalorParametroXCriterio: ServiciosvalorParametroXCriterio,
    private serviciosObservacionesEmbalsesService: ServiciosObservacionesEmbalsesService,
    private serviciosParametrosCriterio: ServiciosParametrosCriterio
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

    this.serviciosDominiosValoresService
      .obtenerValoresPorIdDominio(dominiosEnum.TipoValidacion)
      .subscribe((response) => {

        this.listValidaciones = [response[0], response[1]]
      });

    // Criterios

    this.serviciosCriteriosAceptacion.obtener().subscribe((response) => {
      this.listaDeCriterios = response.map((event: any) => {
        return { id: event.idCriterio, text: event.nombre };
      });
    });
  }

  accionRegistro(e: any) {
    switch (e.accion) {
      case accionesTablasEnum.Activar: {
        break;
      }
      case accionesTablasEnum.Inactivar: {
        break;
      }
      case 'validar': {

        Swal.fire({
          title: 'Desea validar por los criterios de calidad ?',
          text: 'Se almacenara la tabla a validación de calidad ',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, Guardar',
        }).then((result) => {
          if (result.isConfirmed) {
            this.valorObservacion = e.registro.valor;
            this.FechaObservacion = e.registro.fecha;
            this.OrigenObservacion = e.registro.origen;
            this.estadoObservacion = e.registro.estadoObservacion;
            this.objetoValidar = e.registro;
            this.serviciosCriteriosAceptacion.obtener().subscribe((response) => {


              this.listaDeCriterios = response;
              for (let index = 0; index < this.listaDeCriterios.length; index++) {

              }

            });
            this.valorObservacion = e.registro.valor;
            this.FechaObservacion = e.registro.fecha;
            this.OrigenObservacion = e.registro.origen;
            this.estadoObservacion = e.registro.estadoObservacion;
            this.objetoValidar = e.registro;

            if (e.registro.idEstadoObservacion == 267
              || e.registro.idEstadoObservacion == 266) {
              this.ModalCalidad.nativeElement.click();
            }

          }
        });


        break;
      }
      case 'permisos': {
        let elemento: any = [];

        this.id = e.registro.idObservacionXElemento;
        this.obtener();


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
  get idcriterioCalidad() {
    return this.formularioFiltros.get('idcriterioCalidad');
  }
  get idElemento() {
    return this.formularioFiltros.get('idElemento');
  }
  get idParametro() {
    return this.formularioFiltros.get('idParametro');
  }

  get observacionCalidad() {
    return this.formularioCalidad.get('observacionesCalidad');
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
      idParametro: ['', Validators.required],
      idElemento: ['', Validators.required],
      idEstadoObservacion: [''],
      idcriterioCalidad: [''],
    });
    this.formularioCalidad = this.formBuilder.group({
      //   valorObservacion
      // FechaObservacion
      // estadoObservacion
      // OrigenObservacion
      // listObservaciones

      idcriterioCalidad: [''],
      idEstadoObservacion: [''],
      observacionesCalidad: ['', Validators.required],
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
    location.reload();

  }

  filtrarCalidad(elemento: any) {



    if (!this.formularioFiltros.valid) {
      this.toast.fire({
        icon: 'error',
        title: 'Los parametros solicitados NO son correctos. Por favor revise los valores obligatorios.',
      });
      return;
    }

    if (elemento == '1') {

      let objetoBusqueda: any;

      this.listaBusqueda = [];
      this.listParametroXElemento = [];

      this.listaBusqueda.push(this.formularioFiltros.value.idElemento);
      this.listParametroXElemento.push(this.formularioFiltros.value.idParametro);

      this.formularioFiltros.value.listParametros = this.listParametroXElemento;
      this.formularioFiltros.value.listaElementos = this.listaBusqueda;

      objetoBusqueda = this.formularioFiltros.value;

      Swal.fire({
        title: 'Procesando...',
        html: 'Por favor espere',
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: async () => {
          console.time('executionTime');

          Swal.showLoading();

          this.serviciosObservacionesEstacionService.prueba(objetoBusqueda).subscribe((Response) => {
            this.listObservaciones = Response.map(

              (p: { [x: string]: any; idParametroXEstacion: any }) => {
                p[`idParametroXElemento`] = p.idParametroXEstacion;
                p[`idObservacionXElemento`] = p.idObservacionXEstacionInicial;

                if (p[`estadoObservacion`] == "Validado") {
                  p[`validarCalidad`] = '<a><em class="fas fa-circle fa-2x semaforoVerde"></em></a>';
                } else {
                  p[`validarCalidad`] = '<a><em class="fas fa-circle fa-2x semaforoRojo"></em></a>';
                }

                // remover la propiedad actual
                delete p.idParametroXEstacion;
                delete p.idObservacionXEstacionInicial;

                // retornar el nuevo objeto
                return p;
              }
            );

            this.datosFilter = this.listObservaciones;
            Swal.close();

            console.timeEnd('executionTime');
          });
        }, willClose: async () => {
          Swal.hideLoading();
        }
      });
    }

    //embalces
    if (elemento == '2') {
      let objetoBusqueda: any;

      this.listaBusqueda = [];
      this.listParametroXElemento = [];

      this.listaBusqueda.push(this.formularioFiltros.value.idElemento);
      this.listParametroXElemento.push(this.formularioFiltros.value.idParametro);

      this.formularioFiltros.value.listParametros = this.listParametroXElemento;
      this.formularioFiltros.value.listaElementos = this.listaBusqueda;

      objetoBusqueda = this.formularioFiltros.value;

      Swal.fire({
        title: 'Procesando...',
        html: 'Por favor espere',
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: async () => {
          console.time('executionTime');

          Swal.showLoading();

          this.serviciosObservacionesEmbalsesService.prueba(objetoBusqueda).subscribe((Response) => {
            this.listObservaciones = Response.map(

              (p: { [x: string]: any; idParametroXEmbalse: any }) => {
                p[`idParametroXElemento`] = p.idParametroXEmbalse;
                p[`idObservacionXElemento`] = p.idObservacionXEmbalseInicial;

                if (p[`estadoObservacion`] == "Validado") {
                  p[`validarCalidad`] = '<a><em class="fas fa-circle fa-2x semaforoVerde"></em></a>';
                } else {
                  p[`validarCalidad`] = '<a><em class="fas fa-circle fa-2x semaforoRojo"></em></a>';
                }

                // remover la propiedad actual
                delete p.idParametroXEmbalse;
                delete p.idObservacionXEmbalseInicial;

                // retornar el nuevo objeto
                return p;
              }
            );

            this.datosFilter = this.listObservaciones;
            Swal.close();

            console.timeEnd('executionTime');
          });
        }, willClose: async () => {
          Swal.hideLoading();
        }
      });
    }

    //pozos
    if (elemento == '3') {
      let objetoBusqueda: any;

      this.listaBusqueda = [];
      this.listParametroXElemento = [];

      this.listaBusqueda.push(this.formularioFiltros.value.idElemento);
      this.listParametroXElemento.push(this.formularioFiltros.value.idParametro);

      this.formularioFiltros.value.listParametros = this.listParametroXElemento;
      this.formularioFiltros.value.listaElementos = this.listaBusqueda;

      objetoBusqueda = this.formularioFiltros.value;

      Swal.fire({
        title: 'Procesando...',
        html: 'Por favor espere',
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: async () => {
          console.time('executionTime');

          Swal.showLoading();

          this.serviciosObservacionesPozosService.prueba(objetoBusqueda).subscribe((Response) => {
            this.listObservaciones = Response.map(

              (p: { [x: string]: any; idParametroXPozo: any }) => {
                p[`idParametroXElemento`] = p.idParametroXPozo;
                p[`idObservacionXElemento`] = p.idObservacionXPozoInicial;

                if (p[`estadoObservacion`] == "Validado") {
                  p[`validarCalidad`] = '<a><em class="fas fa-circle fa-2x semaforoVerde"></em></a>';
                } else {
                  p[`validarCalidad`] = '<a><em class="fas fa-circle fa-2x semaforoRojo"></em></a>';
                }

                // remover la propiedad actual
                delete p.idParametroXPozo;
                delete p.idObservacionXPozoInicial;

                // retornar el nuevo objeto
                return p;
              }
            );

            this.datosFilter = this.listObservaciones;
            Swal.close();

            console.timeEnd('executionTime');
          });
        }, willClose: async () => {
          Swal.hideLoading();
        }
      });
    }

  }

  filtrar(elemento: any) {

    var objetoBusqueda: any;
    this.listaBusqueda = [];
    this.listParametroXElemento = [];

    this.listParametroXElemento.push(this.formularioFiltros.value.idParametro);
    this.listaBusqueda.push(this.formularioFiltros.value.idElemento);

    this.formularioFiltros.value.listParametros = this.listParametroXElemento;

    this.formularioFiltros.value.listaElementos = this.listaBusqueda;





    try {
      if (this.formularioFiltros.valid) {

        Swal.fire({
          title: 'Cargando...',
          html: 'Por favor espere',
          timerProgressBar: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        switch (elemento) {
          case '1': {

            objetoBusqueda = this.formularioFiltros.value;

            this.serviciosObservacionesEstacionService
              .obtenerDTO(objetoBusqueda)
              .subscribe((Response) => {
                this.listObservaciones = Response.map(
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

                if (this.listObservaciones) {

                  this.serviciosObservacionesEstacionService
                    .obtenerDTOXParametro(objetoBusqueda)
                    .subscribe((Response) => {
                      this.valorMaximoH = Response;
                    });

                  this.serviciosObservacionesEstacionService
                    .obtenerDTOXParametroMini(objetoBusqueda)
                    .subscribe((Response) => {

                      this.valorMiniH = Response;
                      this.toast.fire({
                        icon: 'info',
                        title: 'Valor extemos maximo  ' + this.valorMaximoH
                          + "  Valor extremo minimo " + this.valorMiniH,

                      });
                    });

                  this.CalcularCalidad();





                } else {


                  Swal.showLoading();
                  this.datosFilter = [];

                }



              });

            break;
          }
          case '2': {
            // Embalses

            objetoBusqueda = this.formularioFiltros.value;

            this.serviciosObservacionesEmbalsesService
              .obtenerDTO(objetoBusqueda)
              .subscribe((Response) => {
                this.listObservaciones = Response.map(
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
                this.CalcularCalidad();
              });
            break;
          }
          case '3': {
            // Pozos
            objetoBusqueda = this.formularioFiltros.value;

            this.serviciosObservacionesPozosService
              .obtenerDTO(objetoBusqueda)
              .subscribe((Response) => {
                this.listObservaciones = Response.map(
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
                this.CalcularCalidad();
              });

            break;
          }
          default: {

          }
        }

      }
    } catch (error) {

    }



  }

  filtrarId(elemento: any) {

    var objetoBusqueda: any;

    try {
      if (this.formularioFiltros) {

        switch (elemento) {
          case '1': {

            objetoBusqueda = this.formularioFiltros.value;

            this.serviciosObservacionesEstacionService
              .obtenerDTO(objetoBusqueda)
              .subscribe((Response) => {

                this.listObservaciones = Response;
                console.log(this.listObservaciones);
                for (let i = 0; i < this.listObservaciones.length; i++) {
                  if (this.listObservaciones[i]['estadoObservacion'] === "No validado") {
                    this.validarEstado(this.listObservaciones[i]['idObservacionXEstacionInicial']);
                  }
                }
                this.listObservaciones = Response.map(

                  (p: { [x: string]: any; idParametroXEstacion: any }) => {
                    // crear nueva propiedad de nombre Del Elemento
                    p[`idParametroXElemento`] = p.idParametroXEstacion;
                    p[`idObservacionXElemento`] =
                      p.idObservacionXEstacionInicial;

                    if (p[`estadoObservacion`] == "Validado") {
                      p[`validarCalidad`] =
                        '<a><em class="fas fa-circle fa-2x semaforoVerde"></em></a>';
                    } else {

                      p[`validarCalidad`] =
                        '<a><em class="fas fa-circle fa-2x semaforoRojo"></em></a>';
                    }
                    // remover la propiedad actual
                    delete p.idParametroXEstacion;
                    delete p.idObservacionXEstacionInicial;
                    // retornar el nuevo objeto
                    return p;
                  }
                );


                this.datosFilter = this.listObservaciones;



              });

            break;
          }
          case '2': {
            // Embalses

            objetoBusqueda = this.formularioFiltros.value;

            this.serviciosObservacionesEmbalsesService
              .obtenerDTO(objetoBusqueda)
              .subscribe((Response) => {
                this.listObservaciones = Response.map(
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

              });
            break;
          }
          case '3': {
            // Pozos
            objetoBusqueda = this.formularioFiltros.value;

            this.serviciosObservacionesPozosService
              .obtenerDTO(objetoBusqueda)
              .subscribe((Response) => {
                this.listObservaciones = Response.map(
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

              });

            break;
          }
          default: {

          }
        }
      }
    } catch (error) {
      console.error(error);
    }


  }

  validarEstado(id: any) {


    this.serviciosParametrosService
      .validaObervacionesIdestado(id)
      .subscribe((response) => {

        this.listaValidacion = response;

        if (this.listaValidacion.length) {

          var respost;
          this.serviciosObservacionesEstacionService
            .actualizarEstadoObservacion(841, id)
            .subscribe((Response) => {

              respost = Response;


            })

        } else {


          var respost;
          this.serviciosObservacionesEstacionService
            .actualizarEstadoObservacion(265, id)
            .subscribe((Response) => {

              respost = Response;


            })

        }


      });






  }


  crearValidaObervacion(i: any, obervacion: any, criterio: any) {

    var tipo: number = 446;
    var validacion: any = 0;
    var ValMaximo: number = 0;
    var ValMinimo: number = 0;
    var estado: any;

    this.serviciosvalorParametroXCriterio
      .obtenerValoresXParametrosDeCriterio(
        this.formularioFiltros.value.idParametro, criterio.idCriterio,
      )
      .subscribe((response) => {


        ValMaximo = response.valor1;
        ValMinimo = response.valor2;

        const element = obervacion;

        if (obervacion.valor > ValMaximo) {

          estado = 841;
          validacion = 0;
          this.validar = 0;

        }
        if (obervacion.valor < ValMinimo) {
          estado = 841;
          validacion = 0;
          this.validar = 0;


        }


        if (!estado) {
          estado = 265;
          validacion = 1;
          this.validar = 1;

        }






        var today = new Date();

        var hoy = today.toISOString();

        let validaObervacion: IValidaObervacion = {
          "fechaValidacion": hoy,
          "idCriterio": criterio.idCriterio,
          "idElemento": this.formularioFiltros.value.idElemento,
          "idObservacion": obervacion.idObservacionXElemento,
          "idParametro": this.formularioFiltros.value.idParametro,
          "idTipoElemento": tipo,
          "idValidaObervaciones": 0,
          "resultadoValidacion": validacion,
          "usuarioValidacion": 2
        }

        this.serviciosParametrosService
          .crearValidacionObervacion(validaObervacion)
          .subscribe((response) => {
            this.listValidaObervacion = response;


          });







      });








  }

  crearValidaObervacion1(i: any, obervacion: any, criterio: any) {

    var tipo: number = 446;
    var validacion: any = 0;
    var ValMaximo: number = 0;
    var ValMinimo: number = 0;
    var estado: any;

    this.serviciosvalorParametroXCriterio
      .obtenerValoresXParametrosDeCriterio(
        this.formularioFiltros.value.idParametro, criterio.idCriterio,
      )
      .subscribe((response) => {


        ValMaximo = this.valorMaximoH;
        ValMinimo = this.valorMiniH;

        const element = obervacion;

        if (obervacion.valor > ValMaximo) {

          estado = 841;
          validacion = 0;
          this.validar = 0;
        }
        if (obervacion.valor < ValMinimo) {
          estado = 841;
          validacion = 0;
          this.validar = 0;
        }


        if (!estado) {
          estado = 265;
          validacion = 1;
          this.validar = 1;
        }


        var today = new Date();

        var hoy = today.toISOString();

        let validaObervacion: IValidaObervacion = {
          "fechaValidacion": hoy,
          "idCriterio": criterio.idCriterio,
          "idElemento": this.formularioFiltros.value.idElemento,
          "idObservacion": obervacion.idObservacionXElemento,
          "idParametro": this.formularioFiltros.value.idParametro,
          "idTipoElemento": tipo,
          "idValidaObervaciones": 0,
          "resultadoValidacion": validacion,
          "usuarioValidacion": 2
        }

        this.serviciosParametrosService
          .crearValidacionObervacion(validaObervacion)
          .subscribe((response) => {
            this.listValidaObervacion = response;


          });





      });








  }



  crearValidaObervacion2(index: any, obervacion: any, criterio: any) {


    var estado;
    var ValMaximo: number = 0;
    var ValMinimo: number = 0;
    var tipo: number = 446;
    var validacion = 0;
    this.serviciosvalorParametroXCriterio
      .obtenerValoresXParametrosDeCriterio(
        this.formularioFiltros.value.idParametro, criterio.idCriterio,
      )
      .subscribe((response) => {





        ValMaximo = response.valor1;
        ValMinimo = response.valor2;



        const element = obervacion;
        var consistencia;
        if (this.listObservaciones[index - 1]) {
          consistencia = this.listObservaciones[index - 1]['valor']
        } else {
          consistencia = obervacion.valor;
        }

        var constante = consistencia - obervacion.valor
        var valor_ad = Math.abs(constante);

        if (valor_ad > ValMaximo) {
          estado = 841;
          validacion = 0;
          this.validar = 0;

        } else {
          estado = 265;
          validacion = 1;
          this.validar = 1;
        }


        var today = new Date();

        var hoy = today.toISOString();

        let validaObervacion: IValidaObervacion = {
          "fechaValidacion": hoy,
          "idCriterio": criterio.idCriterio,
          "idElemento": this.formularioFiltros.value.idElemento,
          "idObservacion": obervacion.idObservacionXElemento,
          "idParametro": this.formularioFiltros.value.idParametro,
          "idTipoElemento": tipo,
          "idValidaObervaciones": 0,
          "resultadoValidacion": validacion,
          "usuarioValidacion": 2
        }
        this.serviciosParametrosService
          .crearValidacionObervacion(validaObervacion)
          .subscribe((response) => {
            this.listValidaObervacion = response;


          });







      });


  }


  crearValidaObervacion3(index: any, obervacion: any, criterio: any) {


    var estado;
    var ValMaximo: number = 0;
    var ValMinimo: number = 0;
    var tipo: number = 446;
    var validacion = 0;
    this.serviciosvalorParametroXCriterio
      .obtenerValoresXParametrosDeCriterio(
        this.formularioFiltros.value.idParametro, criterio.idCriterio,
      )
      .subscribe((response) => {


        ValMaximo = response.valor1;
        ValMinimo = response.valor2;
        var estado;
        var numero = index + 1;

        var numfin = numero - ValMaximo;





        for (let i = 0; i < ValMaximo; i++) {

          switch (this.listObservaciones[index - i]['valor']) {
            case obervacion.valor: {
              estado = 841;
              validacion = 0;
              this.validar = 0;

              break;
            }
            default: {

              estado = 265;
              validacion = 1;
              this.validar = 1;
            }

          }

        }


        var today = new Date();

        var hoy = today.toISOString();

        let validaObervacion: IValidaObervacion = {
          "fechaValidacion": hoy,
          "idCriterio": criterio.idCriterio,
          "idElemento": this.formularioFiltros.value.idElemento,
          "idObservacion": obervacion.idObservacionXElemento,
          "idParametro": this.formularioFiltros.value.idParametro,
          "idTipoElemento": tipo,
          "idValidaObervaciones": 0,
          "resultadoValidacion": validacion,
          "usuarioValidacion": 2
        }

        this.serviciosParametrosService
          .crearValidacionObervacion(validaObervacion)
          .subscribe((response) => {
            this.listValidaObervacion = response;


          });








      });


  }

  CalcularCalidad() {

    var validacion: any;

    for (let i = 0; i < this.listObservaciones.length; i++) {
      if (this.listObservaciones[i]['estadoObservacion'] === "No validado") {

        this.serviciosParametrosCriterio
          .obtenerListaCriterioXParametros(this.listObservaciones[i]['idParametro'])
          .subscribe((response) => {
            var obervacion = this.listObservaciones[i];

            for (let index = 0; index < response.length; index++) {


              switch (response[index]['idCriterio']) {
                case 104: {

                  this.crearValidaObervacion(i, this.listObservaciones[i], response[index]);



                  break;
                } case 107: {
                  this.crearValidaObervacion1(i, this.listObservaciones[i], response[index]);

                  break;
                }
                case 201: {

                  this.crearValidaObervacion2(i, this.listObservaciones[i], response[index]);



                  break;
                }
                case 202: {
                  this.crearValidaObervacion3(i, this.listObservaciones[i], response[index]);
                  break;
                }
                default: {

                }
              }







            }

          });




      }

    }
    let div: any = document.getElementById(`btn`);
    div.click();
    this.listObservaciones = this.listObservaciones.map(

      (p: { [x: string]: any; idParametroXEstacion: any }) => {

        if (p[`estadoObservacion`] == "Validado") {
          p[`validarCalidad`] =
            '<a><em class="fas fa-circle fa-2x semaforoVerde"></em></a>';
        } else {

          p[`validarCalidad`] =
            '<a><em class="fas fa-circle fa-2x semaforoRojo"></em></a>';
        }
        // remover la propiedad actual

        // retornar el nuevo objeto
        return p;
      }
    );


    this.datosFilter = this.listObservaciones;

    Swal.showLoading();


  }

  CalcularCalidad44() {

    var ValMaximo: number = 0;
    var ValMinimo: number = 0;
    var tipo: number = 0;

    var objetoBusqueda = this.formularioFiltros.value;

    this.serviciosCriteriosAceptacion.obtener().subscribe((response) => {
      this.listaDeCriterios = response;


      for (let index = 0; index < this.listaDeCriterios.length; index++) {
        switch (this.listaDeCriterios[index].idCriterio) {
          case 104: {
            //this.crearValidaObervacion(104);
            break;
          } case 107: {
            // this.crearValidaObervacion1(107);
            break;
          }
          case 201: {
            // this.crearValidaObervacion2(201);
            break;
          }
          case 202: {
            //this.crearValidaObervacion3(202);
            break;
          }
          default: {

          }
        }

      }

    });



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
      title: 'Procesando...',
      html: 'Por favor espere',
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: async () => {
        console.time('executionTime');

        Swal.showLoading();
        this.serviciosEstacionesService
          .obtenerEstaciones()
          .subscribe((response) => {
            this.listaElementosSeleccionados = response.map((event: any) => {
              return { id: event.idEstacion, text: event.estacion };
            });
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
      title: 'Procesando...',
      html: 'Por favor espere',
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: async () => {
        console.time('executionTime');

        Swal.showLoading();

        this.serviciosEmbalcesService
          .obtenerEembalsesDTO()
          .subscribe((response) => {
            this.listaElementosSeleccionados = response.map((event: any) => {
              return { id: event.idEmbalse, text: event.embalse };
            });

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
      title: 'Procesando...',
      html: 'Por favor espere',
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: async () => {
        console.time('executionTime');

        Swal.showLoading();

        this.serviciosPozosService.obtenerPozosDTO().subscribe((response) => {
          this.listaElementosSeleccionados = response.map((event: any) => {
            return { id: event.idPozo, text: event.pozo };
          });
          Swal.close();

          console.timeEnd('executionTime');
        });
      },
      willClose: async () => {
        Swal.hideLoading();
      }

    });
  }

  ValidarCalidad(estado: number) {
    if (this.formularioCalidad.valid) {
      switch (this.elemento) {
        case '1': {
          let elementoActualizar: any = {
            idObservacionXEstacionInicial:
              this.objetoValidar.idObservacionXElemento,
            idParametroXEstacion: this.objetoValidar.idParametroXElemento,
            activo: this.objetoValidar.activo,
            descripcion: this.objetoValidar.descripcion,
            estacion: this.objetoValidar.estacion,
            estadoObservacion: this.objetoValidar.estadoObservacion,
            fecha: this.objetoValidar.fecha,
            fechaCargue: this.objetoValidar.fechaCargue,
            fechaCreacion: this.objetoValidar.fechaCreacion,
            fechaEstado: this.objetoValidar.fechaEstado,
            fechaModificacion: this.objetoValidar.fechaModificacion,
            frecuencia: this.objetoValidar.frecuencia,
            idEstacion: this.objetoValidar.idEstacion,

            idFlagObservacion: this.objetoValidar.idFlagObservacion,
            idParametro: this.objetoValidar.idParametro,
            idTipoOrigenObservacion: this.objetoValidar.idTipoOrigenObservacion,
            origen: this.objetoValidar.origen,
            tipoOrigenObservacion: this.objetoValidar.tipoOrigenObservacion,
            usuarioCargue: this.objetoValidar.usuarioCargue,
            usuarioCreacion: this.objetoValidar.usuarioCreacion,
            usuarioEstado: this.objetoValidar.usuarioEstado,
            usuarioModificacion: this.objetoValidar.usuarioModificacion,
            valor: this.objetoValidar.valor,
            idEstadoObservacion: estado,
            idCriterioCalidad: this.criterioCalidadSeleccionado,
            observacioneCalidad: this.observacionesCalidad,
          };
          this.serviciosObservacionesEstacionService
            .actualizar(elementoActualizar)
            .subscribe((Response) => {
              this.filtrar(this.elemento);
              // this.estado = 0
              this.observacionesCalidad = '';
            });

          break;
        }
        case '2': {
          // Embalses

          let elementoActualizar: any = {
            idObservacionXEmbalseInicial:
              this.objetoValidar.idObservacionXElemento,
            idParametroXEmbalse: this.objetoValidar.idParametroXElemento,
            activo: this.objetoValidar.activo,
            descripcion: this.objetoValidar.descripcion,
            estacion: this.objetoValidar.estacion,
            estadoObservacion: this.objetoValidar.estadoObservacion,
            fecha: this.objetoValidar.fecha,
            fechaCargue: this.objetoValidar.fechaCargue,
            fechaCreacion: this.objetoValidar.fechaCreacion,
            fechaEstado: this.objetoValidar.fechaEstado,
            fechaModificacion: this.objetoValidar.fechaModificacion,
            frecuencia: this.objetoValidar.frecuencia,
            idEstacion: this.objetoValidar.idEstacion,
            idFlagObservacion: this.objetoValidar.idFlagObservacion,
            idParametro: this.objetoValidar.idParametro,
            idTipoOrigenObservacion: this.objetoValidar.idTipoOrigenObservacion,
            origen: this.objetoValidar.origen,
            tipoOrigenObservacion: this.objetoValidar.tipoOrigenObservacion,
            usuarioCargue: this.objetoValidar.usuarioCargue,
            usuarioCreacion: this.objetoValidar.usuarioCreacion,
            usuarioEstado: this.objetoValidar.usuarioEstado,
            usuarioModificacion: this.objetoValidar.usuarioModificacion,
            valor: this.objetoValidar.valor,
            idEstadoObservacion: estado,
            idCriterioCalidad: this.criterioCalidadSeleccionado,
            observacioneCalidad: this.observacionesCalidad,
          };

          this.serviciosObservacionesEmbalsesService
            .actualizar(elementoActualizar)
            .subscribe((Response) => { });
          this.filtrar(this.elemento);
          // this.idNewEstadoObservacion = 0
          this.observacionesCalidad = '';
          break;
        }
        case '3': {
          //  Pozos

          let elementoActualizar: any = {
            idObservacionXPozoInicial:
              this.objetoValidar.idObservacionXElemento,
            idParametroXPozo: this.objetoValidar.idParametroXElemento,
            activo: this.objetoValidar.activo,
            descripcion: this.objetoValidar.descripcion,
            estacion: this.objetoValidar.estacion,
            estadoObservacion: this.objetoValidar.estadoObservacion,
            fecha: this.objetoValidar.fecha,
            fechaCargue: this.objetoValidar.fechaCargue,
            fechaCreacion: this.objetoValidar.fechaCreacion,
            fechaEstado: this.objetoValidar.fechaEstado,
            fechaModificacion: this.objetoValidar.fechaModificacion,
            frecuencia: this.objetoValidar.frecuencia,
            idEstacion: this.objetoValidar.idEstacion,
            idFlagObservacion: this.objetoValidar.idFlagObservacion,
            idParametro: this.objetoValidar.idParametro,
            idTipoOrigenObservacion: this.objetoValidar.idTipoOrigenObservacion,
            origen: this.objetoValidar.origen,
            tipoOrigenObservacion: this.objetoValidar.tipoOrigenObservacion,
            usuarioCargue: this.objetoValidar.usuarioCargue,
            usuarioCreacion: this.objetoValidar.usuarioCreacion,
            usuarioEstado: this.objetoValidar.usuarioEstado,
            usuarioModificacion: this.objetoValidar.usuarioModificacion,
            valor: this.objetoValidar.valor,
            idEstadoObservacion: estado,
            idCriterioCalidad: this.criterioCalidadSeleccionado,
            observacioneCalidad: this.observacionesCalidad,
          };

          // console.log('Guardando Validacion', elementoActualizar);
          this.serviciosObservacionesPozosService
            .actualizar(elementoActualizar)
            .subscribe((Response) => {
              this.filtrar(this.elemento);
              // this.idNewEstadoObservacion = 0
              this.observacionesCalidad = '';
            });
          break;
        }
        default: {
          // console.log('this.objetoValidaro', this.objetoValidar);
        }
      }
      this.ModalCalidad.nativeElement.click();
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
  consultarParametro(idParaemntro: any, idelemento: any) {

    if (this.formularioFiltros.value.idParametro) {



      this.serviciosParametrosCriterio
        .obtenerListaCriterioXParametros(this.formularioFiltros.value.idParametro)
        .subscribe((response) => {

          var listaDeCriterios: any = response.map((event: any) => {
            return { id: event.idCriterio, text: event.nombre };
          });

          for (let index = 0; index < listaDeCriterios.length; index++) {
            switch (listaDeCriterios[index].id) {

              case 104: {
                var valor: any;
                this.serviciosvalorParametroXCriterio
                  .obtenerValoresXParametrosDeCriterio(
                    this.formularioFiltros.value.idParametro, 104
                  )
                  .subscribe((response) => {
                    valor = response
                  })

                if (!valor) {
                  this.toast.fire({
                    icon: 'error',
                    title: 'Debe ingresar los valores adminisbles ',
                  });
                } else {



                }


                break;
              } case 107: {

                var valor: any;
                this.serviciosvalorParametroXCriterio
                  .obtenerValoresXParametrosDeCriterio(
                    this.formularioFiltros.value.idParametro, 107
                  )
                  .subscribe((response) => {
                    valor = response
                  })

                if (!valor) {
                  this.toast.fire({
                    icon: 'error',
                    title: 'Debe ingresar los valores extremos  ',
                  });
                } else {



                }
                break;
              }
              case 201: {

                var valor: any;
                this.serviciosvalorParametroXCriterio
                  .obtenerValoresXParametrosDeCriterio(
                    this.formularioFiltros.value.idParametro, 201
                  )
                  .subscribe((response) => {
                    valor = response
                  })

                if (!valor) {
                  this.toast.fire({
                    icon: 'error',
                    title: 'Debe ingresar los valores Consistencia ',
                  });
                } else {



                }
                break;
              }
              case 202: {
                var valor: any;
                this.serviciosvalorParametroXCriterio
                  .obtenerValoresXParametrosDeCriterio(
                    this.formularioFiltros.value.idParametro, 202
                  )
                  .subscribe((response) => {
                    valor = response
                  })

                if (!valor) {
                  this.toast.fire({
                    icon: 'error',
                    title: 'Debe ingresar los valores Persistencia  ',
                  });
                } else {



                }
                break;
              }
              default: {

              }
            }

          }
        });
    }
  }
  obtener() {
    Swal.fire({
      title: 'Procesando...',
      html: 'Por favor espere',
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: async () => {

        Swal.showLoading();

        this.serviciosParametrosService
        .validaObervacionesIdAlerta(this.id, this.elemento)
        .subscribe((response) => {
          this.listValidaObervacion = response;

          for (let i = 0; i < this.listValidaObervacion.length; i++) {




            if (this.listValidaObervacion[i]['resultado'] == 1) {
              this.listValidaObervacion[i]['estado'] =
                '<a><em class="fas fa-circle fa-2x semaforoVerde"></em></a>';
            } else {

              this.listValidaObervacion[i]['estado'] =
                '<a><em class="fas fa-circle fa-2x semaforoRojo"></em></a>';
            }

            this.listValidaObervacion = this.listValidaObervacion;

             let div: any = document.getElementById(`validarBtn1`);
             div.click();

             Swal.close();


          }

        });
      },
      willClose: async () => {
        Swal.hideLoading();
      }

    });



  }


}
