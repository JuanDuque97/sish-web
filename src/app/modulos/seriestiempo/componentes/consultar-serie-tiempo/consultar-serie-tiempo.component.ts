import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LegendPosition } from '@swimlane/ngx-charts';
import { ServiciosGeograficosService } from 'src/app/common/mapa/servicios-geograficos.service';
import { estados } from 'src/app/common/utils/constantes';
import { accionesTablasEnum } from 'src/app/modelo/enum/acciones-tablas-enum';
import { capasEnum, capasEnumDatos } from 'src/app/modelo/enum/capas-enum';
import { dominiosEnum } from 'src/app/modelo/enum/dominios-enum';
import Swal from 'sweetalert2';
import { ServiciosCapasService } from '../../../configuracion/capas/servicios-capas.service';
import { ServiciosDominiosValoresService } from '../../../configuracion/dominios/servicios-dominios-valores.service';
import { ServiciosEmbalcesService } from '../../../elementos/embalses/servicios-embalses.service';
import { ServiciosEstacionesService } from '../../../elementos/estaciones/servicios-estaciones.service';
import { ServiciosPozosService } from '../../../elementos/pozos/servicios-pozos.service';
import { ServiciosObservacionesEmbalsesService } from '../../../observaciones/servicios-observaciones-embalses.service';
import { ServiciosObservacionesEstacionService } from '../../../observaciones/servicios-observaciones-estacion.service';
import { ServiciosObservacionesPozosService } from '../../../observaciones/servicios-observaciones-pozos.service';
import { ServiciosParametrosService } from '../../../parametros/servicios-parametros.service';
import { ServiciosSerieTiempoService } from '../../servicios/servicios-serie-tiempo.service';
import { MetodosGlobales } from 'src/app/common/utils/metodos-globales';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexFill,
  ApexTooltip,
  ApexXAxis,
  ApexLegend,
  ApexDataLabels,
  ApexGrid,
  ApexTitleSubtitle,
  ApexYAxis
} from "ng-apexcharts";

export type ChartOptions = {
  series?: ApexAxisChartSeries | any;
  chart?: ApexChart | any;
  xaxis?: ApexXAxis | any;
  markers?: any | any; //ApexMarkers;
  stroke?: any | any;//ApexStroke;
  yaxis?: ApexYAxis | any;
  dataLabels?: ApexDataLabels | any;
  title?: ApexTitleSubtitle | any;
  legend?: ApexLegend | any;
  fill?: ApexFill | any;
  tooltip?: ApexTooltip | any;
  colors: string[];
  grid: ApexGrid;
};

@Component({
  selector: 'app-consultar-serie-tiempo',
  templateUrl: './consultar-serie-tiempo.component.html',
})

export class ConsultarSerieTiempoComponent implements OnInit {
  public formularioFiltros!: FormGroup;
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  // Mapa
  // Set our map properties
  mapCenter = [-73.9, 4.4];
  basemapType = 'topo';
  mapZoomLevel = 9;
  // See app.component.html
  mapLoadedEvent(status: Event) {
    console.log('The map loaded: ' + status);
  }

  private toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 1000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
  });

  public listaMunicipios = [];
  public listaDepartamentos = [];
  public departamentoSelected: any;
  private tempIdDepartamento: number = 0;
  datosOriginal = [] as any;
  public listZonaEAAB = [];
  public listTipoPozo = [];
  public listCategoriaPozo = [];
  public listCondicionPozo = [];
  public geograficas = false;
  consecutivo: number = 0;
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
  public listaSeries: any[] = [];
  public listaFrecuencia = [];
  public listaSubcuenca = [];
  public listaBusqueda: any[] = [];
  public elemento: number = 0;
  public periodo: number = 0;
  public parametro: number;
  public promedio: string;
  public median: number;
  public mediana: number;
  public moda: number;
  rutaGeneral = 'seriestiempo/guardarserie/0/C/0';
  rutaEdicion: string;
  rutaConsulta: string;
  datosFilterEstaciones = [] as any;
  datosFilterEmbalses = [] as any;
  datosFilterPozos = [] as any;
  datosFilter = [] as any;
  datosSerieAnio = [] as any;
  datosSerieMes = [] as any;
  listParametroXElemento = [] as any;
  listP = [] as any;
  capas: any[] = [];
  idE: number;
  columnas = [
    // visible: false,
    { title: 'Tipo elemento', data: 'tipoElemento', class: 'text-center' },
    { title: 'Elemento', data: 'elemento', class: 'text-center' },
    { title: 'Flag', data: 'flag', class: 'text-center' },
    { title: 'Frecuencia', data: 'frecuencia', class: 'text-center' },
    { title: 'Activo', data: 'activo', class: 'text-center' },
    { title: 'Tipo formato', data: 'tipoFormato', class: 'text-center' },
    { title: 'Tipo registro', data: 'tipoRegistro', class: 'text-center' },
    { title: 'Valor', data: 'valor', class: 'text-center' },
    { title: 'Fecha', data: 'fecha', class: 'text-center' },

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
    {
      title: 'idElemento',
      data: 'idElemento',
      class: 'text-center',
      visible: false,
    },
    { title: 'idFlag', data: 'idFlag', class: 'text-center', visible: false },
    {
      title: 'idFrecuencia',
      data: 'idFrecuencia',
      class: 'text-center',
      visible: false,
    },
    {
      title: 'idSerieTiempoDetalle',
      data: 'idSerieTiempoDetalle',
      class: 'text-center',
      visible: false,
    },
    {
      title: 'idSerieTiempoElemento',
      data: 'idSerieTiempoElemento',
      class: 'text-center',
      visible: false,
    },
    {
      title: 'idTipoElemento',
      data: 'idTipoElemento',
      class: 'text-center',
      visible: false,
    },
    {
      title: 'idTipoFormato',
      data: 'idTipoFormato',
      class: 'text-center',
      visible: false,
    },
    {
      title: 'idTipoRegistro',
      data: 'idTipoRegistro',
      class: 'text-center',
      visible: false,
    },
    {
      title: 'idParametroXElemento',
      data: 'idParametroXElemento',
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
      title: 'Agregar',
      action: 'agregar',
      icon: 'fas fa-tasks',
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

  // graficos

  viewAnual: [number, number] = [500, 300];
  viewMensual: [number, number] = [500, 300];
  Anual: any = [];
  Mensual: any = [];
  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  legendPosition: LegendPosition = LegendPosition.Below;
  showXAxisLabel = true;
  showYAxisLabel = true;

  xAxisLabel: string = 'Country';
  yAxisLabelMensual: string;
  yAxisLabelAnual: string = 'Precipitacion Anual';
  legendTitle: string = 'Años';

  colorScheme: any = {
    domain: ['blue', 'orange', 'red'],
  };

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
    private serviciosObservacionesEmbalsesService: ServiciosObservacionesEmbalsesService,
    private serviciosSerieTiempoService: ServiciosSerieTiempoService
  ) { }

  ngOnInit(): void {



    this.chartOptions = {
      chart: {
        id: 'chart',
        height: 400,
        with: 'auto',
        type: "line",
        locales: [{
          "name": "en",
          "options": {
            "months": ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
            "shortMonths": ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
            "days": ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
            "shortDays": ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"],
            "toolbar": {
              "exportToSVG": "Descargar SVG",
              "exportToPNG": "Descargar PNG",
              "exportToCSV": "Descargar CSV",
              "menu": "Menu",
              "selection": "Seleccionar",
              "selectionZoom": "Seleccionar Zoom",
              "zoomIn": "Aumentar",
              "zoomOut": "Disminuir",
              "pan": "Navegación",
              "reset": "Reiniciar Zoom"

            }
          }
        }],

        toolbar: { show: true },
        zoom: {
          enabled: true,
          type: 'xy'
        },
        events: {

        }
      },
      dataLabels: {
        enabled: false
      },


      title: {
        text: "Serie de tiempo",
        align: "left"
      },
      legend: {

        horizontalAlign: "left",
        offsetX: 40,

        tooltipHoverFormatter: function (val: any, opts: any) {
          return (
            val +
            " - <strong>" +
            opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
            "</strong>"
          );
        }
      },

      colors: ["#FF1654", "#247BA0"],
      series: [
        {
          name: "Fecha",
          data: [1.4, 2, 2.5, 1.5, 2.5, 2.8, 3.8, 4.6]
        },
      ],

      xaxis: {
        labels: {
          formatter: function (val: any) {
            return parseFloat(val).toFixed(1)
          }
        },
        tickAmount: 10,
        title: {
          text: 'Fecha',

        },
        categories: [2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016]
      },

      yaxis: [
        {
          type: "datetime",
          axisTicks: {
            show: true
          },
          tooltip: {
            formatter: function (val: any, opts: any) {
              return val + "..." + opts
            }
          },
          axisBorder: {
            show: true,
            color: "#FF1654"
          },
          labels: {
            type: "datetime",
            rotate: 0,

            style: {
              colors: "#FF1654"
            }
          },
          title: {
            text: "Valor Obervación",
            style: {
              color: "#FF1654"
            }
          }
        }
      ],
      stroke: {
        width: [5, 7, 5],
        curve: 'straight',
        dashArray: [0, 8, 5]
      },
      tooltip: {
        y: [
          {
            title: {
              formatter: function (val: any) {
                return val + " (mins)"
              }
            }
          },],
        shared: true,


      },



    }

    this.construirFormulario();

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
  public generateDayWiseTimeSeries(baseval: any, count: any, yrange: any) {
    var i = 0;
    var series = [];
    while (i < count) {
      var x = baseval;
      var y =
        Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

      series.push([x, y]);
      baseval += 86400000;
      i++;
    }
    return series;
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
                this.serviciosSerieTiempoService
                  .actualizarElemento(element)
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
              this.filtrar(this.elemento);
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
                this.serviciosSerieTiempoService
                  .actualizarElemento(element)
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
              this.filtrar(this.elemento);
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

  accionRegistroModal(e: any) {
    switch (e.accion) {
      case 'agregar': {
        //statements;
        if (e.registro != undefined) {
          // this.agregarlistaElementos(e.registro);
          if (this.validarElemeto(e.registro)) {
            this.listaBusqueda.push(e.registro);
            let div: any = document.getElementById(`salir`);
            div.click();
            this.idE = e.registro.idEstacion


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
  get idConceptivo() {
    return this.formularioFiltros.get('idConceptivo');
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
      fechaInicio: [''],
      fechaFin: [''],
      listaElementos: [[]],
      listParametros: [[]],
      idParametro: [''],
      idConceptivo: [''],

    });
  }

  obtenerElementos(element: any) {
    Swal.fire({
      title: 'Cargando información...',
      html: 'Por favor espere',
      timerProgressBar: true,
      timer: 1000,
      didOpen: () => {
        Swal.showLoading();

      },

    }).then((result) => {



    });
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
          this.Anual = [];
          this.Mensual = [];
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
    this.Anual = [];
    this.Mensual = [];
    this.formularioFiltros.reset();
    this.elemento = 0;
  }
  medianof2Arr(arr1: any) {
    var concat = arr1;
    concat = concat.sort(
      function (a: any, b: any) { return a - b });

    console.log(concat);
    var length = concat.length;

    if (length % 2 == 1) {

      // If length is odd
      console.log(concat[(length / 2) - .5])
      return concat[(length / 2) - .5]

    }
    else {
      console.log((concat[length / 2]
        + concat[(length / 2) - 1]) / 2);

      return (concat[length / 2]
        + concat[(length / 2) - 1]) / 2;
    }
  }

  filtrar(elemento: any) {

    Swal.fire({
      title: 'Cargando información...',
      html: 'Por favor espere',
      timerProgressBar: true,
      timer: 10000,
      didOpen: () => {
        Swal.showLoading();

      },

    }).then((result) => {



    });

    var objetoBusqueda: any;
    this.rutaEdicion = 'seriestiempo/guardarserie/' + this.elemento + '/E/';
    this.rutaConsulta = 'seriestiempo/guardarserie/' + this.elemento + '/V/';
    try {
      if (this.formularioFiltros.valid) {
        switch (elemento) {
          case '466': {
            this.formularioFiltros.value.listaElementos =
              this.listaBusqueda.map((elemento: any) => elemento.idEstacion);
            var elemento1: any = this.listaBusqueda[0].idEstacion;
            var idElemento: number = parseInt(elemento1);
            this.formularioFiltros.value.listParametros =
              this.listParametroXElemento;

            objetoBusqueda = this.formularioFiltros.value;
            objetoBusqueda.tipoElemento = elemento;
            objetoBusqueda.cuenca = this.formularioFiltros.value.idParametro;
            objetoBusqueda.areaHidrografica = idElemento;
            objetoBusqueda.idConceptivo = parseInt(this.formularioFiltros.value.idConceptivo);






            Swal.showLoading();
            break;
          }
          case '467': {
            // Embalses
            this.formularioFiltros.value.listaElementos =
              this.listaBusqueda.map((elemento: any) => elemento.idEmbalse);
            this.formularioFiltros.value.listParametros =
              this.listParametroXElemento;
            objetoBusqueda = this.formularioFiltros.value;
            objetoBusqueda.tipoElemento = elemento;

            Swal.showLoading();
            break;
          }
          case '468': {
            // Pozos
            this.formularioFiltros.value.listaElementos =
              this.listaBusqueda.map((elemento: any) => elemento.idPozo);
            this.formularioFiltros.value.listParametros =
              this.listParametroXElemento;
            objetoBusqueda = this.formularioFiltros.value;
            objetoBusqueda.tipoElemento = elemento;
            Swal.showLoading();
            break;
          }
          default: {
            // console.log('elemento', elemento);
          }
        }

        console.log('Buscando', objetoBusqueda);
        this.serviciosSerieTiempoService
          .obtenerDTO(objetoBusqueda)
          .subscribe((response) => {
            Swal.showLoading();
            this.datosFilter = response;
            this.chartOptions.series[0] = [];
            this.chartOptions.xaxis.categories = [];
            this.chartOptions.yaxis[0].title.text = "";
            var cantidad = []
            var cantidad2 = []
            var cantegoria = []
            var data: any = []

            var x;
            var y;
            for (let i = 0; i < this.datosFilter.length; i++) {

              y = this.datosFilter[i]['valor'];
              x = this.datosFilter[i]['fecha'];

              cantegoria.push(this.datosFilter[i]['fecha']);
              cantidad.push(this.datosFilter[i]['valor']);
              cantidad2.push(this.datosFilter[i]['valor']);
              data = [
                this.datosFilter[i]['fecha']
              ]




            }




            this.chartOptions.series[0] = {
              name: "Valor",
              data: cantidad
            };
            this.chartOptions.xaxis = {
              rotate: 0,
              type: "datetime",

              title: {
                style: {
                  fontSize: 10,
                  color: '#ffffff'
                }
              },
              Amount: 5,
              tickPlacement: 'between',
              x: 'Oct 06 14:00',
              borderColor: '#00E396',
              label: {
                rotate: 0,
                borderColor: '#00E396',
                style: {
                  fontSize: '12px',
                  color: '#fff',
                  background: '#00E396'
                },
                orientation: 'horizontal',
                offsetY: 7,
                text: 'Annotation Test'
              },

              categories: cantegoria
            }
            console.log(this.chartOptions);
            Swal.hideLoading();

            let sum = cantidad2.reduce((previous, current) => current += previous);
            var promedio = sum / cantidad2.length;
            this.promedio = promedio.toFixed(3);
            let values = cantidad2;
            values.sort((a, b) => a - b);
            let lowMiddle = Math.floor((values.length - 1) / 2);
            let highMiddle = Math.ceil((values.length - 1) / 2);
            this.median = (values[lowMiddle] + values[highMiddle]) / 2;
            this.mediana = this.medianof2Arr(cantidad2);
            var list: any = cantidad2;
            var empty = []
            var i = 0
            var max = 0
            while (i < list.length) {

              if (list[i] == list[i + 1]) {
                empty = list[i]
                i += 1
              } else {
                i += 1
              }

            }

            this.moda = empty

          });




        // this.serviciosSerieTiempoService
        //   .obtenerDTOPromedioAnio(objetoBusqueda)
        //   .subscribe((response) => {
        //     this.datosSerieAnio = response;

        //     this.datosGrafico(); 
        //   });

        // this.serviciosSerieTiempoService
        //   .obtenerDTOPromedioMes(objetoBusqueda)
        //   .subscribe((response) => {
        //     this.datosSerieMes = response;

        //     this.datosGrafico(); 
        //   });
      }
    } catch (error) {
      console.error(error);
    }
  }

  datosGrafico() {
    this.Anual = [];
    this.Mensual = [];



    const anioActual = new Date().getFullYear();

    //  Año

    this.yAxisLabelAnual = 'Precipitacion Anual  ';

    for (let index = 0; index < this.datosSerieAnio.length; index++) {
      const element = this.datosSerieAnio[index];

      this.Anual.push({
        name: this.datosSerieAnio[index].anio,
        series: [
          {
            name: 'maximo',
            value: this.datosSerieAnio[index].valorMaximo,
          },
          {
            name: 'Minimo',
            value: this.datosSerieAnio[index].valorMinimo,
          },
          {
            name: 'Promedio',
            value: this.datosSerieAnio[index].promedio,
          },
        ],
      });
    }


    this.yAxisLabelMensual = 'Precipitacion Mensual ' + anioActual;

    for (let index = 0; index < this.datosSerieMes.length; index++) {
      if (anioActual == this.datosSerieMes[index].anio) {
        this.Mensual.push({
          name: this.datosSerieMes[index].mes,
          series: [
            {
              name: 'maximo',
              value: this.datosSerieMes[index].valorMaximo,
            },
            {
              name: 'Minimo',
              value: this.datosSerieMes[index].valorMinimo,
            },
            {
              name: 'Promedio',
              value: this.datosSerieMes[index].promedio,
            },
          ],
        });
      }
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
      title: 'Procesando...',
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

  actualizar(elemento: any) {
    this.serviciosSerieTiempoService
      .actualizarElemento(elemento)
      .subscribe((response) => {
        this.filtrar(this.elemento);
      });
  }

  agregarlistaParametros(parametro: any) {
    if (parametro != undefined) {
      if (this.validarParametro(parametro)) {
        this.listParametroXElemento.push(parseInt(parametro));
      }
      let div: any = document.getElementById(`salir`);
      div.click();
      this.serviciosSerieTiempoService
        .obtenerConceptivo(this.idE, parametro)
        .subscribe((response) => {


          this.listaSeries = response;

          console.log(this.listaSeries);
        });


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

  lista(listaSelect: any) {
    // debugger
    if (listaSelect.length >= 2) {
      this.listaDeElementos = listaSelect;
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


  validarParametro(parametro: any) {
    this.serviciosParametrosService
      .obtenerListaParametros()
      .subscribe((response) => {
        this.listP = response.filter((element => element.idParametro == parametro)).map((elemento: any) => ({
          id: elemento.idParametro,
          text: elemento.descripcion,
          unidadMedida: elemento.nombreTipoParametro,
          disabled: elemento.activo == 'S' ? false : true,
        }));

        console.log(this.listP);
        console.log(this.chartOptions.yaxis[0].labels.title);
      });

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

      if (
        // validar parametro
        this.listParametroXElemento[0]
      ) {
        this.toast.fire({
          icon: 'info',
          title: 'Solo se puede selecionar un parametro',
        });

        return false;
      }
    }

    return true;
  }
  validarElemeto(elemento: any) {

    for (let index = 0; index < this.listaBusqueda.length; index++) {
      // Validar Estacion
      if (
        // validar parametro
        this.listaBusqueda[index] == elemento
      ) {
        this.toast.fire({
          icon: 'info',
          title: 'El elemento ya se encuentra agregado',
        });

        return false;
      }

      if (
        // validar parametro
        this.listaBusqueda[0]
      ) {
        this.toast.fire({
          icon: 'info',
          title: 'Solo se puede agregar un elemento',
        });

        return false;
      }
    }

    return true;
  }

  // Validacion de permisos 
  public validarPermiso(permiso: any): boolean {
    return MetodosGlobales.validarPermiso(permiso);
  }
}
