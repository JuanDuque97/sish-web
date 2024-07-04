import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LegendPosition } from '@swimlane/ngx-charts';

var RMSE = require('rmse');
import { NgApexchartsModule } from "ng-apexcharts";
import * as ApexCharts from "apexcharts";
import { ServiciosGeograficosService } from 'src/app/common/mapa/servicios-geograficos.service';
import { estados } from 'src/app/common/utils/constantes';
import { accionesTablasEnum } from 'src/app/modelo/enum/acciones-tablas-enum';
import { capasEnum, capasEnumDatos } from 'src/app/modelo/enum/capas-enum';
import { dominiosEnum } from 'src/app/modelo/enum/dominios-enum';
import { ServiciosEmbalcesService } from 'src/app/modulos/elementos/embalses/servicios-embalses.service';
import { ServiciosEstacionesService } from 'src/app/modulos/elementos/estaciones/servicios-estaciones.service';
import { ServiciosPozosService } from 'src/app/modulos/elementos/pozos/servicios-pozos.service';
import { ServiciosObservacionesEmbalsesService } from 'src/app/modulos/observaciones/servicios-observaciones-embalses.service';
import { ServiciosObservacionesEstacionService } from 'src/app/modulos/observaciones/servicios-observaciones-estacion.service';
import { ServiciosObservacionesPozosService } from 'src/app/modulos/observaciones/servicios-observaciones-pozos.service';
import { ServiciosParametrosService } from 'src/app/modulos/parametros/servicios-parametros.service';
import { ServiciosSerieTiempoService } from 'src/app/modulos/seriestiempo/servicios/servicios-serie-tiempo.service';
import Swal from 'sweetalert2';
import * as ecStat from 'echarts-stat';

import { Consecutivo, ICurvaNivelCaudal, InformacionEcuacion, ICurvaNivelCaudalDetalles } from 'src/app/modelo/configuracion/curvaNivelCaudal';
import { ICurvaTendencia } from 'src/app/modelo/configuracion/curvaTendencia';
var incrmae = require('../../../../../../../node_modules/@stdlib/stats-incr-mae');

const regression = require('regression');

import { ServiciosCapasService } from '../../../capas/servicios-capas.service';
import { ServiciosDominiosValoresService } from '../../../dominios/servicios-dominios-valores.service';
import { ServiciosAforoService } from '../servicios-aforo.service';
import { DataTableDirective } from 'angular-datatables';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexFill,
  ApexTooltip,
  ApexXAxis,
  ApexLegend,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexYAxis
} from "ng-apexcharts";
import { parseInt } from 'lodash';

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
};
import * as Highcharts from 'highcharts';
import Exporting from 'highcharts/modules/exporting';
const heatmap = require('highcharts/modules/heatmap.js');
heatmap(Highcharts);

Exporting(Highcharts);

export var var1: number = 0;
export var var2: string = '';
export var var3: string = '';
export var grado: number = 0;
import HC_exporting from "highcharts/modules/exporting";
import HC_Data from "highcharts/modules/export-data";
import Accessbility from "highcharts/modules/accessibility";

HC_exporting(Highcharts);
HC_Data(Highcharts);
Accessbility(Highcharts);


@Component({
  selector: 'app-gestion-regresion',
  templateUrl: './gestion-regresion.component.html',
})



export class GestionRegresionComponent implements OnInit {
  private data: Array<number>;  // raw chart data
  private htmlElement: HTMLElement;
  isHighcharts = typeof Highcharts === 'object';
  Highcharts: typeof Highcharts = Highcharts;

  chartOptions: Highcharts.Options = {};
  chartOptions1: Highcharts.Options = {};
  chartOptions2: Highcharts.Options = {};

  @ViewChild(DataTableDirective, { static: false })

  public formularioFiltros!: FormGroup;
  regress = (x: any, y: any) => {
    const n = y.length;
    let sx = 0;
    let sy = 0;
    let sxy = 0;
    let sxx = 0;
    let syy = 0;
    for (let i = 0; i < n; i++) {
      sx += x[i];
      sy += y[i];
      sxy += x[i] * y[i];
      sxx += x[i] * x[i];
      syy += y[i] * y[i];
    }




    const mx = sx / n;
    const my = sy / n;
    const yy = n * syy - sy * sy;
    const xx = n * sxx - sx * sx;
    const xy = n * sxy - sx * sy;
    const slope = xy / xx;
    const intercept = my - slope * mx;
    const r = xy / Math.sqrt(xx * yy);
    const r2 = Math.pow(r, 2);
    let sst = 0;
    for (let i = 0; i < n; i++) {
      sst += Math.pow((y[i] - my), 2);
    }
    const sse = sst - r2 * sst;
    const see = Math.sqrt(sse / (n - 2));
    const ssr = sst - sse;
    return { slope, intercept, r, r2, sse, ssr, sst, sy, sx, see };
  }
  // Mapa
  datatableElement: DataTableDirective | undefined;
  capas = [
    {
      url: 'http://apps.diegopedroza.co:11030/arcgis/rest/services/sish/departamentos/MapServer/0',
      id: 'departamentos',
      visible: true,
      titulo: 'Departamentos',
    },
    {
      url: 'http://apps.diegopedroza.co:11030/arcgis/rest/services/sish/zonificacion/MapServer/0',
      id: 'zonificacion',
      visible: true,
      titulo: 'Zonificación',
    },
    {
      url: 'http://apps.diegopedroza.co:11030/arcgis/rest/services/sish/estaciones/MapServer/0',
      id: 'estaciones',
      visible: true,
      titulo: 'Estaciones',
    },
  ];
  // Set our map properties
  mapCenter = [-73.9, 4.4];
  basemapType = 'topo';
  mapZoomLevel = 9;

  // See app.component.html
  mapLoadedEvent(status: Event) {

  }

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
  
  public Mecanismo: string;
  public listaMunicipios = [];
  public myRegression: any = [];
  public listaDepartamentos = [];
  public departamentoSelected: any;
  public curvaSelected: any;
  private tempIdDepartamento: number = 0;
  public ListaCurva = [] as any;
  public tempIdCurva: string = '0';
  public fecha_pintar = 0;
  public fechaInicio: Date;
  datosOriginal = [] as any;
  public objEstacion: any;
  public ecuacion = 0;
  public grado: string = '0';
  public listZonaEAAB = [];
  public listTipoPozo = [];
  public listCategoriaPozo = [];
  public listCondicionPozo = [];
  public geograficas = false;
  public planas = false;
  public listEntidades = [];
  public date = new Date();
  public hoy = String(this.date.getDate()).padStart(2, '0') + '/' + String(this.date.getMonth() + 1).padStart(2, '0') + '/' + this.date.getFullYear();

  public listaAreaHidrografica = [];
  public listaZonaHidrografica = [];
  public listasubZonaHidrografica = [];
  public listanivel = [];
  public listaCuenca = [];
  public listaMicrocuenca = [];
  public listaEntidad = [];
  public listParametro: any[] = [];
  public curvaTendencia: ICurvaTendencia;
  public listaFrecuencia = [];
  public listaSubcuenca = [];
  public listaBusqueda: any[] = [];
  public elemento: number = 0;
  public periodo: number = 0;
  public parametro: number;
  public idestacion: number;
  public ndestacion: number;

  public listaCodigoEAAB: any = [];
  public listaCodigoIDEAM: any = [];
  rutaConsulta1 = 'configuracion/gestionAforo/V/';
  rutaGeneral = 'configuracion/gestionAforo/C/0';
  rutaEdicion = 'configuracion/gestionAforo/E/';
  rutaConsulta = 'configuracion/gestionAforo/V/';
  public id: string = '0';
  datosFilterEstaciones = [] as any;
  datosFilterEmbalses = [] as any;
  datosFilterPozos = [] as any;
  datosFilter = [] as any;
  datosSerieAnio = [] as any;
  datosSerieMes = [] as any;
  listParametroXElemento = [] as any;
  listParametro_eje = [] as any;
  listParametro_registro = [] as any;
  listaElementos = [] as any;
  listaTipoAforo = [] as any;
  listaElemento = [] as any;
  listAforos = [] as any;
  listaInfoEcuador = [] as any;
  public idTipoElemento: any;
  public idElemento: string = '0';
  public ecuacionString: string;
  public tipoEcuacionString: string;

  r2: number;
  rmse: number;
  mae: number;
  mspe: string;
  bias: string;



  columnas = [

    {
      title: 'Aforo id',
      data: 'id_aforo',
      visible: false,

    },
    {
      title: 'Fecha aforo',
      data: 'fecha_creacion',

    },
    {
      title: 'Aforo NO.',
      data: 'n_aforo',

    },
    {
      title: 'Caudal(㎥/s)',
      data: 'caudal',

    },
    {
      title: 'Nivel(m) (m)',
      data: 'nivel',
    }
  ];



  columnasEstaciones = [
    {
      title: 'ID',
      data: 'idEstacion',
      visible: false,
    },
    {
      title: 'Código Estación IDEAM',
      data: 'codigoEstacionIdeam',
      filter: true,
      filterValue: '',
      tipo: 'texto',
    },
    {
      title: 'Código Estación EAAB',
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
    },

  ];

  // graficos
  multi: any = [
    {
      name: 'Germany',
      series: [
        {
          name: '1990',
          value: 62000000,
        },
        {
          name: '2010',
          value: 73000000,
        },
        {
          name: '2011',
          value: 89400000,
        },
      ],
    },

    {
      name: 'USA',
      series: [
        {
          name: '1990',
          value: 250000000,
        },
        {
          name: '2010',
          value: 309000000,
        },
        {
          name: '2011',
          value: 311000000,
        },
      ],
    },

    {
      name: 'France',
      series: [
        {
          name: '1990',
          value: 58000000,
        },
        {
          name: '2010',
          value: 50000020,
        },
        {
          name: '2011',
          value: 58000000,
        },
      ],
    },
    {
      name: 'UK',
      series: [
        {
          name: '1990',
          value: 57000000,
        },
        {
          name: '2010',
          value: 62000000,
        },
      ],
    },
  ];

  view: [number, number] = [700, 300];

  // options
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Year';
  yAxisLabel: string = 'Population';
  timeline: boolean = true;

  colorScheme: any = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5'],
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
    private serviciosSerieTiempoService: ServiciosSerieTiempoService,
    private servicioAforo: ServiciosAforoService,
  ) { }

  ngOnInit(): void {

    this.id = this.route.snapshot.paramMap.get('id')!;
    if (this.id) {

      this.tempIdCurva = this.id;

      this.obtneridCurva();

      this.cambairidCurva();
      this.buscarinfoEcuacion();



    }

    this.chartOptions = {
      chart: {
        events: {
          load: function() {
            console.log('you click export')
          }
        }
      },
      title: {
        useHTML: true,
          text: '<span style="display: block;"> Estación  '+this.ndestacion+' relación Caudal(m3/s) vs Nivel(m) </span>',
         style: {
            "text-align": "center"
        }
    },
    

      exporting: {
        buttons: {
            contextButton: {
              
            }
        }
    },
      lang:{
        months:[
          "Enero",
          "Febrero",
          "Marzo",
          "Abril",
          "Mayo",
          "Junio",
          "Julio",
          "Agosto",
          "Septiembre",
          "Octubre",
          "Noviembre",
          "Diciembre"
        ],
        weekdays: [
          "Domingo",
            "Lunes",
            "Martes",
            "Miércoles",
            "Jueves",
            "Viernes",
          "Sábado"
        ],
        downloadJPEG: "Descargar Imagen JPEG",
        downloadPDF: "Descargar Documento PDF",
        downloadPNG: "Descargar Imagen PNG",
        downloadSVG : "Descargar Imagen SVG",
        printChart: "Imprimir grafica ",
        resetZoom: "Resetear zoom",
        resetZoomTitle: "Resetear zoom",
        viewData: "Ver Grafica zoom",
        exitFullscreen:"Salir de pantalla completa",
        viewFullscreen:"Ver en  pantalla completa",
      },
      xAxis: {
   


      },

      yAxis: {

        min: 0
      },
      series: [
        {
          type: 'line',
          name: 'Regreción  Line',
          data: [],
          marker: {
            enabled: false
          },
      
          enableMouseTracking: false
        },
        {
          type: 'scatter',
          name: 'Ecuación',
          data: [],
     
        }]
    }

    this.chartOptions1 = {
 title: {
        useHTML: true,
          text: '<span style="display: block;"> Estación  '+this.ndestacion+' relación Caudal(m3/s) vs Nivel(m) </span>',
         style: {
            "text-align": "center"
        }
    },
    
    caption: {
      useHTML: true,
      style: {
        "text-align": "center",
        "margin-left": "2250px"
      },
      text: ' <div class="col-xl-2 col-lg-2 col-md-2 col-sm-2 ">  <div class="col-xl-12">     <span>Tipo de Ecuación =  '+this.tipoEcuacionString+ ' </span>  <span> </span>  </div>   <div class="col-xl-12">    <span>Ecuación =  '+this.ecuacionString+ ' </span>  <span> </span>  </div>  <div class=" col-xl-12">   <span>R = '+this.r2+ '</span>   <span> </span> </div>',
    },
      xAxis: {
        min: -0.5,
        max: 5.5
      },
      yAxis: {
        min: 0
      },
      series: [
        {
          type: 'line',
          name: 'Regression Line',
          data: [],
          marker: {
            enabled: false
          },
          states: {
            hover: {
              lineWidth: 0
            }
          },
          enableMouseTracking: false
        },
        {
          type: 'scatter',
          name: 'Observations',
          data: [],
          marker: {
            radius: 4
          }
        }]
    };

    this.chartOptions2 = {
      title: {
        text: ' '
      },
      xAxis: {
        min: -0.5,
        max: 5.5
      },
      yAxis: {
        min: 0
      },
      series: [
        {
          type: 'line',
          name: 'Regression Line',
          data: [],
          marker: {
            enabled: false
          },
          states: {
            hover: {
              lineWidth: 0
            }
          },
          enableMouseTracking: false
        },
        {
          type: 'scatter',
          name: 'Observations',
          data: [],
          marker: {
            radius: 4
          }
        }]
    };




    // Curva tendencia
    this.servicioAforo
      .obtenerCurva()
      .subscribe((response) => {
        this.ListaCurva = response;
      });



  }

  accionRegistro(e: any) {
    switch (e.accion) {
      case accionesTablasEnum.Activar: {
        let elemento: any = e.registro;
        elemento.activo = estados.activo;

        console.log('actualizando', elemento);
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
      case accionesTablasEnum.Editar: {
        let elemento: any = e.registro;
        elemento.activo = estados.inactivo;

        break;
      }

      default: {
        //statements;
        break;
      }
    }
  }

  get areaHidrografica() {
    return this.formularioFiltros?.get('areaHidrografica');
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
  get microcuenca() {
    return this.formularioFiltros.get('microCuenca');
  }


  get fechaFin() {
    return this.formularioFiltros.get('fechaFin');
  }



  dataPointSelection(event: any, chartContext: any, config: any) {
    var1 = config.dataPointIndex;
    let div: any = document.getElementById(`btn`);
    div.click();
  }

  obtenerElementos1(element: any) {


    if (
      this.datosFilter.length >= 1 ||
      this.listaBusqueda.length >= 1 ||
      this.listParametroXElemento.length >= 1
    ) {
      const elementoSeleccionado = element

      Swal.fire({
        title: 'Desea Cambiar de elemento?',
        text: 'Se Cambiaran todos los valores ',
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

          this.formularioFiltros.value.elemento = elementoSeleccionado
          this.elemento = elementoSeleccionado
        }
      });



    }


  }

  expCurveFit(d: any) {
    var sum_x2 = 0, sum_lny = 0, sum_x = 0, sum_xlny = 0, n = d.length;
    for (var i = 0; i < d.length; i++) {
      var x = d[i][0];
      var y = d[i][1];
      sum_x2 += x ^ 2, sum_lny += Math.log(y), sum_x += x, sum_xlny += x * Math.log(y);
    }
    var a = ((sum_lny * sum_x2) - (sum_x * sum_xlny)) / ((n * sum_x2) - sum_x ^ 2);
    var b = ((n * sum_xlny) - (sum_x * sum_lny)) / ((n * sum_x2) - sum_x ^ 2);
    return [a, b];
  }
  obtenerElementos(even: any) {

    switch (even) {
      case '1': {

        Swal.fire({
          title: 'Desea Cambiar la ecuación a Exponencial?',
          text: 'Se cambiaran todos los valores ',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, Cambiar',
        }).then((result) => {
          if (result.isConfirmed) {
            this.chartOptions.series = [];
            this.chartOptions2.series = [];
            var cantidad1 = [];
            var cantidad = [];
            var ejex = [];
            var cantidadNivel = [];
            for (let i = 0; i < this.listParametro_eje.length; i++) {

              var ejeY = this.listParametro_eje[i]['caudal'] + 0.01
              var ejeX = this.listParametro_eje[i]['nivel'];
              let n = parseFloat(this.listParametro_eje[i]['nivel']);

              cantidad1.push([ejeX,
                ejeY]);
                cantidad.push([ejeX,
                  this.listParametro_eje[i]['caudal']]);

              ejex.push(ejeX);
            }



            this.myRegression = ecStat.regression('exponential', cantidad1, 0);

            const result = regression.exponential(cantidad1);

            const gradient = result.equation[0];
            const yIntercept = result.equation[1];
          var str = result.string.substring(1);
            this.ecuacionString ="Q"+ str  
            this.ecuacion = 1;
            this.tipoEcuacionString = "Exponencial"

            var a = result.equation[0];
            var b = Math.exp(result.equation[1]);

            ejex.sort(function (a, b) {
              return a - b;
            })

            ejex.sort((a, b) => a - b)
            for (let i = 0; i < this.listParametro_eje.length; i++) {

              ejeX = ejex[i];

              ejeY = a ^ (b * this.listParametro_eje[i]['nivel'])
              cantidadNivel.push([this.listParametro_eje[i]['nivel'], ejeY]);
              cantidad.push([this.listParametro_eje[i]['nivel'], this.listParametro_eje[i]['caudal']]);

            }








            this.chartOptions = {
             title: {
        useHTML: true,
          text: '<span style="display: block;"> Estación  '+this.ndestacion+' relación Caudal(m3/s) vs Nivel(m) </span>',
         style: {
            "text-align": "center"
        }
    },
    
    caption: {
      useHTML: true,
      style: {
        "text-align": "center",
        "margin-left": "2250px"
      },
      text: ' <div class="col-xl-2 col-lg-2 col-md-2 col-sm-2 ">  <div class="col-xl-12">     <span>Tipo de Ecuación =  '+this.tipoEcuacionString+ ' </span>  <span> </span>  </div>   <div class="col-xl-12">    <span>Ecuación =  '+this.ecuacionString+ ' </span>  <span> </span>  </div>  <div class=" col-xl-12">   <span>R = '+this.r2+ '</span>   <span> </span> </div>',
    },
              xAxis: {
                title: {
                  text: ' Nivel(m)'
                },

              },
              yAxis: {
                title: {
                  text: 'Caudal (m3/s)'
                },

              },
              series: [{
                type: 'line',
                name: "Regresión Exponencial ",
                data: this.myRegression.points,

              }, {
                type: 'scatter',
                name: 'Aforos',
                data: cantidad,

              }]
            }




          }
        });
        break;
      }
      case '2': {
        Swal.fire({
          title: 'Desea Cambiar la ecuación a Logaritmica?',
          text: 'Se cambiaran todos los valores ',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, Cambiar',
        }).then((result) => {
          if (result.isConfirmed) {
            this.chartOptions.series = [];
            this.chartOptions2.series = [];
            var cantidad = []; var cantidad1 = [];
            var cantidadNivel = [];
            for (let i = 0; i < this.listParametro_eje.length; i++) {
              var ejeY = this.listParametro_eje[i]['caudal'] + 0.01
              var ejeX = this.listParametro_eje[i]['nivel'];
              let n = parseFloat(this.listParametro_eje[i]['nivel']);
              cantidad1.push([parseFloat(this.listParametro_eje[i]['nivel']),
                ejeY]);
              cantidad.push([parseFloat(this.listParametro_eje[i]['nivel']),
                this.listParametro_eje[i]['caudal']]);
            }

            this.myRegression = ecStat.regression('logarithmic', cantidad, 0);
            this.tipoEcuacionString = "Logaritmica"
            const result = regression.logarithmic(cantidad);
            console.log(this.myRegression);
            const gradient = result.equation[0];
            const yIntercept = result.equation[1];
          var str = result.string.substring(1);
            this.ecuacionString ="Q"+ str  
            this.ecuacion = 1;

            for (let i = 0; i < this.listParametro_eje.length; i++) {
              var ejeX = this.listParametro_eje[i]['nivel'];
              var ejeY = gradient + yIntercept + Math.log(ejeX);
              cantidadNivel.push([ejeX, ejeY]);


            }




            this.chartOptions = {
            title: {
        useHTML: true,
          text: '<span style="display: block;"> Estación  '+this.ndestacion+' relación Caudal(m3/s) vs Nivel(m) </span>',
         style: {
            "text-align": "center"
        }
    },
    
    caption: {
      useHTML: true,
      style: {
        "text-align": "center",
        "margin-left": "2250px"
      },
      text: ' <div class="col-xl-2 col-lg-2 col-md-2 col-sm-2 ">  <div class="col-xl-12">     <span>Tipo de Ecuación =  '+this.tipoEcuacionString+ ' </span>  <span> </span>  </div>   <div class="col-xl-12">    <span>Ecuación =  '+this.ecuacionString+ ' </span>  <span> </span>  </div>  <div class=" col-xl-12">   <span>R = '+this.r2+ '</span>   <span> </span> </div>',
    },
              xAxis: {
                title: {
                  text: ' Nivel(m)'
                },

              },
              yAxis: {
                title: {
                  text: 'Caudal (m3/s)'
                },

              },
              series: [{
                type: 'line',
                name: "Regresión Logaritmica ",
                data: this.myRegression.points,

              }, {
                type: 'scatter',
                name: 'Aforos',
                data: cantidad,

              }]
            }





          }


        });


        break;
      }
      case '3': {
        // pozos
        Swal.fire({
          title: 'Desea Cambiar la ecuación a Lineal?',
          text: 'Se cambiaran todos los valores ',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, Cambiar',
        }).then((result) => {
          if (result.isConfirmed) {
            var lista = this.linearRegression(x, y);


            var r2 = lista.r2;
            var r22 = r2.toFixed(2)
            var r221 = parseFloat(r22)
            this.r2 = r221
  
            this.chartOptions.series = [];
            this.chartOptions2.series = [];
            var cantidad = []; var cantidad1 = [];
            var cantidadNivel = [];
            var x :any= [];
            var y:any = [];
            for (let i = 0; i < this.listParametro_eje.length; i++) {
              var ejeY = this.listParametro_eje[i]['caudal'] + 0.01
              var ejeX = this.listParametro_eje[i]['nivel'];
              y = ejeY
              x = ejeX
              let n = parseFloat(this.listParametro_eje[i]['nivel']);
              cantidad1.push([parseFloat(this.listParametro_eje[i]['nivel']),
                ejeY]);
              cantidad.push([parseFloat(this.listParametro_eje[i]['nivel']),
                ejeY]);
            }
            this.tipoEcuacionString = "Lineal"
            this.myRegression = ecStat.regression('linear', cantidad, 0);

            const result = regression.linear(cantidad);

            const gradient = result.equation[0];
            const yIntercept = result.equation[1];
          var str = result.string.substring(1);
            this.ecuacionString ="Q"+ str  
            

            for (let i = 0; i < this.listParametro_eje.length; i++) {
              var ejeX = this.listParametro_eje[i]['nivel'];
              var ejeY = gradient * ejeX + yIntercept;
              cantidadNivel.push([ejeX, ejeY]);

            }

       

          var mspe = lista.offset;
          this.mspe = mspe.toFixed(2);

          var bias = lista.gain;
          this.bias = bias.toFixed(2);


            this.ecuacion = 1;

            this.chartOptions = {
            title: {
        useHTML: true,
          text: '<span style="display: block;"> Estación  '+this.ndestacion+' relación Caudal(m3/s) vs Nivel(m) </span>',
         style: {
            "text-align": "center"
        }
    },
    
    caption: {
      useHTML: true,
      style: {
        "text-align": "center",
        "margin-left": "2250px"
      },
      text: ' <div class="col-xl-2 col-lg-2 col-md-2 col-sm-2 ">  <div class="col-xl-12">     <span>Tipo de Ecuación =  '+this.tipoEcuacionString+ ' </span>  <span> </span>  </div>   <div class="col-xl-12">    <span>Ecuación =  '+this.ecuacionString+ ' </span>  <span> </span>  </div>  <div class=" col-xl-12">   <span>R = '+this.r2+ '</span>   <span> </span> </div>',
    },
              xAxis: {
                title: {
                  text: ' Nivel(m)'
                },

              },
              yAxis: {
                title: {
                  text: 'Caudal (m3/s)'
                },

              },
              series: [{
                type: 'line',
                name: "Regresión Lineal ",
                data: this.myRegression.points,

              }, {
                type: 'scatter',
                name: 'Aforos',
                data: cantidad1,

              }]
            }




          }
        });


        break;
      }
      case '4': {


        Swal.fire({
          title: 'Desea Cambiar la ecuación a Polinómica?',
          html: `<select  id="grado" class="swal2-input" placeholder="grado" name="grado">
          <option value="2">Segundo grado</option>
          <option value="3" selected>Tercer grado</option>
          <option value="5" selected>Cuarto grado</option>
        </select>`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, Cambiar',
          preConfirm: () => {
            var2 = (document.getElementById(
              'grado'
            ) as HTMLInputElement).value;
            return { grado: var2 }
          }

        }).then((result) => {
          if (result.isConfirmed) {
            this.chartOptions.series = [];
            this.chartOptions2.series = [];
            var cantidad = []; var cantidad1 = [];
            var cantidadNivel = [];
            for (let i = 0; i < this.listParametro_eje.length; i++) {
              var ejeY = this.listParametro_eje[i]['caudal'] + 0.01
              var ejeX = this.listParametro_eje[i]['nivel'];
              let n = parseFloat(this.listParametro_eje[i]['nivel']);
              cantidad1.push([parseFloat(this.listParametro_eje[i]['nivel']),
                ejeY]);
              cantidad.push([parseFloat(this.listParametro_eje[i]['nivel']),
              this.listParametro_eje[i]['caudal']]);
            }


            this.myRegression = ecStat.regression('polynomial', cantidad, parseInt(var2));



            this.tipoEcuacionString = "Polinómica"


            const result = regression.polynomial(cantidad, { order: parseInt(var2) });

            const gradient = result.equation[0];
            const yIntercept = result.equation[1];
          var str = result.string.substring(1);
            this.ecuacionString ="Q"+ str  
            cantidadNivel = [gradient, yIntercept];

            this.ecuacion = 4;

            this.chartOptions = {
            title: {
        useHTML: true,
          text: '<span style="display: block;"> Estación  '+this.ndestacion+' relación Caudal(m3/s) vs Nivel(m) </span>',
         style: {
            "text-align": "center"
        }
    },
    
    caption: {
      useHTML: true,
      style: {
        "text-align": "center",
        "margin-left": "2250px"
      },
      text: ' <div class="col-xl-2 col-lg-2 col-md-2 col-sm-2 ">  <div class="col-xl-12">     <span>Tipo de Ecuación =  '+this.tipoEcuacionString+ ' </span>  <span> </span>  </div>   <div class="col-xl-12">    <span>Ecuación =  '+this.ecuacionString+ ' </span>  <span> </span>  </div>  <div class=" col-xl-12">   <span>R = '+this.r2+ '</span>   <span> </span> </div>',
    },
              xAxis: {
                title: {
                  text: ' Nivel(m)'
                },

              },
              yAxis: {
                title: {
                  text: 'Caudal (m3/s)'
                },

              },
              series: [{
                type: 'line',
                name: "Regresión Polinómica ",
                data: this.myRegression.points,

              }, {
                type: 'scatter',
                name: 'Aforos',
                data: cantidad,

              }]
            }



          }
        });

        break;
      }
      case '5': {
        // Embalses
        Swal.fire({
          title: 'Desea Cambiar la ecuación a Potencial?',
          text: 'Se cambiaran todos los valores ',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, Cambiar',
        }).then((result) => {
          if (result.isConfirmed) {

            this.chartOptions.series = [];
            this.chartOptions2.series = [];
            var cantidad = []; var cantidad1 = [];
            var cantidadNivel = [];
            for (let i = 0; i < this.listParametro_eje.length; i++) {
              var ejeY = this.listParametro_eje[i]['caudal'] + 0.01
              var ejeX = this.listParametro_eje[i]['nivel'];
              let n = parseFloat(this.listParametro_eje[i]['nivel']);
              cantidad1.push([parseFloat(this.listParametro_eje[i]['nivel']),
              this.listParametro_eje[i]['caudal']]);
              cantidad.push([parseFloat(this.listParametro_eje[i]['nivel']),
                ejeY]);
            }
            this.myRegression = ecStat.regression('polynomial', cantidad, 4);

            const result = regression.linear(cantidad);

            const gradient = result.equation[0];
            const yIntercept = result.equation[1];
          var str = result.string.substring(1);
            this.ecuacionString ="Q"+ str  

            for (let i = 0; i < this.listParametro_eje.length; i++) {
              var ejeX = this.listParametro_eje[i]['nivel'];
              var ejeY = gradient * ejeX + yIntercept;
              cantidadNivel.push([ejeX, ejeY]);

            }
            this.tipoEcuacionString = "Potencial"


            this.ecuacion = 1;

            this.chartOptions = {
            title: {
        useHTML: true,
          text: '<span style="display: block;"> Estación  '+this.ndestacion+' relación Caudal(m3/s) vs Nivel(m) </span>',
         style: {
            "text-align": "center"
        }
    },
    
    caption: {
      useHTML: true,
      style: {
        "text-align": "center",
        "margin-left": "2250px"
      },
      text: ' <div class="col-xl-2 col-lg-2 col-md-2 col-sm-2 ">  <div class="col-xl-12">     <span>Tipo de Ecuación =  '+this.tipoEcuacionString+ ' </span>  <span> </span>  </div>   <div class="col-xl-12">    <span>Ecuación =  '+this.ecuacionString+ ' </span>  <span> </span>  </div>  <div class=" col-xl-12">   <span>R = '+this.r2+ '</span>   <span> </span> </div>',
    },
              xAxis: {
                title: {
                  text: ' Nivel(m)'
                },

              },
              yAxis: {
                title: {
                  text: 'Caudal (m3/s)'
                },

              },
              series: [{
                type: 'line',
                name: "Regresión Potencial ",
                data: this.myRegression.points,

              }, {
                type: 'scatter',
                name: 'Aforos',
                data: cantidad1,

              }]
            }






          }
        });
        break;
      }
      case '6': {
        Swal.fire({
          title: 'Desea Cambiar la ecuación a Media movil?',
          text: 'Se cambiaran todos los valores ',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, Cambiar',
        }).then((result) => {
          if (result.isConfirmed) {

            this.chartOptions.series = [];
            this.chartOptions2.series = [];
            var cantidad = [];
            var cantidad1 = [];
            var cantidadNivel = [];
            for (let i = 0; i < this.listParametro_eje.length; i++) {
              var ejeY = this.listParametro_eje[i]['caudal'] + 0.01
              var ejeX = this.listParametro_eje[i]['nivel'];
              let n = parseFloat(this.listParametro_eje[i]['nivel']);
              cantidad1.push([parseFloat(this.listParametro_eje[i]['nivel']),
              this.listParametro_eje[i]['caudal']]);
              cantidad.push([parseFloat(this.listParametro_eje[i]['nivel']),
                ejeY]);
            }

            this.myRegression = ecStat.regression('polynomial', cantidad, 4);



            this.tipoEcuacionString = "Media movil"
            const result = regression.polynomial(cantidad, { order: 4 });

            const gradient = result.equation[0];
            const yIntercept = result.equation[1];
          var str = result.string.substring(1);
            this.ecuacionString ="Q"+ str  
            cantidadNivel = [gradient, yIntercept];

            this.ecuacion = 1;

            this.chartOptions = {
            title: {
        useHTML: true,
          text: '<span style="display: block;"> Estación  '+this.ndestacion+' relación Caudal(m3/s) vs Nivel(m) </span>',
         style: {
            "text-align": "center"
        }
    },
    
    caption: {
      useHTML: true,
      style: {
        "text-align": "center",
        "margin-left": "2250px"
      },
      text: ' <div class="col-xl-2 col-lg-2 col-md-2 col-sm-2 ">  <div class="col-xl-12">     <span>Tipo de Ecuación =  '+this.tipoEcuacionString+ ' </span>  <span> </span>  </div>   <div class="col-xl-12">    <span>Ecuación =  '+this.ecuacionString+ ' </span>  <span> </span>  </div>  <div class=" col-xl-12">   <span>R = '+this.r2+ '</span>   <span> </span> </div>',
    },
              xAxis: {
                title: {
                  text: ' Nivel(m)'
                },

              },
              yAxis: {
                title: {
                  text: 'Caudal (m3/s)'
                },

              },
              series: [{
                type: 'line',
                name: "Regresión Media movil ",
                data: result.points,

              }, {
                type: 'scatter',
                name: 'Aforos',
                data: cantidad1,

              }]
            }


          }
        });


        break;
      }
      default: {

        //statements;
        break;
      }
    }
  }

  obtenerElementos11(even: any) {

    alert(33);
    if (
      this.datosFilter.length >= 1 ||
      this.listaBusqueda.length >= 1 ||
      this.listParametroXElemento.length >= 1
    ) {
      const elementoSeleccionado = even;

      Swal.fire({
        title: 'Desea Cambiar la ecuación?',
        text: 'Se Cambiaran todos los valores ',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, Cambiar',
      }).then((result) => {
        if (result.isConfirmed) {


        }
      });
    }
  }

  filtrar(elemento: any) {

    var objetoBusqueda: any;

    try {
      if (this.formularioFiltros.valid) {
        switch (elemento) {
          case '466': {
            this.formularioFiltros.value.listaElementos =
              this.listaBusqueda.map((elemento: any) => elemento.idEstacion);
            this.formularioFiltros.value.listParametros =
              this.listParametroXElemento;

            objetoBusqueda = this.formularioFiltros.value;
            objetoBusqueda.tipoElemento = elemento;

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
            break;
          }
          default: {
            console.log('elemento', elemento);
          }
        }
      }

      this.serviciosSerieTiempoService
        .obtenerDTO(objetoBusqueda)
        .subscribe((response) => {
          console.log('llegando consulta', response);
          this.datosFilter = response;
        });
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

  private cargarCurvaporId() {
    alert(4433);
  }

  cambioDepartamento(departamentoSelected: any) {
    alert(66);
    if (departamentoSelected != undefined && departamentoSelected != '') {
      this.tempIdDepartamento = departamentoSelected;
      this.cargarMunicipiosPorDepartamento();
    }
  }


  obtenerEstaciones() {
    this.serviciosEstacionesService
      .obtenerEstaciones()
      .subscribe((response) => {
        this.datosFilterEstaciones = response;
      });
  }
  obtenerEmbalses() {
    this.serviciosEmbalcesService
      .obtenerEembalsesDTO()
      .subscribe((response) => {
        this.datosFilterEmbalses = response;
      });
  }
  obtenerPozos() {
    this.serviciosPozosService.obtenerPozosDTO().subscribe((response) => {
      this.datosFilterPozos = response;
    });
  }

  actualizar(elemento: any) {
    this.serviciosSerieTiempoService
      .actualizarElemento(elemento)
      .subscribe((response) => {
        this.filtrar(this.elemento);
        console.log('se actualizo', response);
      });
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

    } else {
      this.datosFilter = this.datosOriginal;
    }
  }
  seleccionMapa(e: any) {
    // TO-DO

    // this.latitud?.setValue(e.ubicacion.latitude);
    // this.longitud?.setValue(e.ubicacion.longitude);

    let features = e.seleccion.flat(1);

    let _cuenca = features.filter(
      (c: any) => c.idCapa === capasEnumDatos(capasEnum.Cuenca).id
    )[0]?.atributos;
    let _subcuenca = features.filter(
      (c: any) => c.idCapa === capasEnumDatos(capasEnum.Subcuenca).id
    )[0]?.atributos;
    let _microcuenca = features.filter(
      (c: any) => c.idCapa === capasEnumDatos(capasEnum.Microcuenca).id
    )[0]?.atributos;
    let codah = _cuenca.CODAH ?? '';
    let codzh = _cuenca.CODZH ?? '';
    let codszh = _cuenca.CODSZH ?? '';
    let codch = _cuenca.CODCH ?? '';
    let codsch = _subcuenca.CODSCH ?? '';
    let codmch = _microcuenca.CODMC ?? '';
    this.areaHidrografica?.setValue(codah);
    this.zonaHidrografica?.setValue(codzh);
    this.subZonaHidrografica?.setValue(codszh);
    this.cuenca?.setValue(codch);
    this.subcuenca?.setValue(codsch);
    this.microcuenca?.setValue(codmch);
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
              .map((f: any) => f.attributes)
              .map((zh: any) => {
                return { id: zh.CODAH, text: zh.NOMBAH };
              });
            this.listaAreaHidrografica = datos;
            console.log('listaAreaHidrografica', datos);
          });
      });
  }

  cargarZonaHidrografica() {
    console.log('Area hidrográfica', this.areaHidrografica?.value);
    if (this.areaHidrografica?.value) {
      this.serviciosCapasService
        .obtenerPorId(capasEnum.SubZonaHidrografica)
        // .obtenerPorId(capasEnum.Zonificacion)
        .subscribe((response) => {
          console.log('llegaron parametros', response);
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
                  return { id: zh.CODZH, text: zh.NOMBZH };
                });
              console.log('serviciosCapasService OK', datos);
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
                  return { id: zh.CODSZH, text: zh.NOMBSZH };
                });
              console.log('serviciosCapasService OK', datos);
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
                  return { id: zh.CODCH, text: zh.NOMBCH };
                });
              console.log('serviciosCapasService OK', datos);
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
                  return { id: zh.CODSCH, text: zh.NOMSCH };
                });
              console.log('serviciosCapasService OK', datos);
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
                  return { id: zh.CODMC, text: zh.NOMBMC };
                });
              console.log('serviciosCapasService OK', datos);
              this.listaMicrocuenca = datos;
            });
        });
    }
  }
  pintarcha() {

    this.fecha_pintar = 1;
  }

  despintarfechas() {

    this.fecha_pintar = 0;
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


  buscar() {


    this.serviciosParametrosService
      .obtener()
      .subscribe((response) => {
        this.listParametro_eje = response;
        this.listParametro_registro = response; 


        var cantidad = [];
        var cantidad1 = [];


        for (let i = 0; i < this.listParametro_eje.length; i++) {
          var ejeY = this.listParametro_eje[i]['nivel'];

          var ejeX = this.listParametro_eje[i]['caudal'];
          cantidad.push(ejeX, ejeY);


        }





        this.chartOptions = {
          title: {
            useHTML: true,
              text: '<span style="display: block;"> Estación  '+this.ndestacion+' relación Caudal(m3/s) vs Nivel(m) </span>',
             style: {
                "text-align": "center"
            }
        },
        
        caption: {
          useHTML: true,
          style: {
            "text-align": "center",
            "margin-left": "2250px"
          },
          text: ' <div class="col-xl-2 col-lg-2 col-md-2 col-sm-2 ">  <div class="col-xl-12">     <span>Tipo de Ecuación =  '+this.tipoEcuacionString+ ' </span>  <span> </span>  </div>   <div class="col-xl-12">    <span>Ecuación =  '+this.ecuacionString+ ' </span>  <span> </span>  </div>  <div class=" col-xl-12">   <span>R = '+this.r2+ '</span>   <span> </span> </div>',
        },
          xAxis: {
            title: {
              text: ' Nivel(m)'
            },

          },
          yAxis: {
            title: {
              text: 'Caudal (m3/s)'
            },

          },
          series: [{
            type: 'line',
            name: "Regresión Media movil ",
            data: cantidad,

          }, {
            type: 'scatter',
            name: 'Aforos',
            data: cantidad,

          }]
        }






      });



  }

  obtneridCurva() {


    try {


      this.servicioAforo
        .obtenerCurvaId(this.id)
        .subscribe((response) => {
          console.log('llegando consulta', response);
          this.listParametro_eje = response;
          this.listParametro_registro = response; 
          console.log(this.listParametro_eje);
          var cantidad = [];
          var cantidadR = [];
          var dataset = [];
          var cantidadLinea: any = [];
          var x = [];
          var y = [];
          var listaFin = this.linear_regression(cantidadLinea);

          var cantidad1 = [];
          var cantidadNivel = [];
          for (let i = 0; i < this.listParametro_eje.length; i++) {
            console.log(this.listParametro_eje[i]['caudal']);
            var ejeY = this.listParametro_eje[i]['caudal'];
            var ejeX = this.listParametro_eje[i]['nivel'];
            var y2 = parseFloat(this.listParametro_eje[i]['caudal']).toFixed(2);
            var x2 = parseFloat(this.listParametro_eje[i]['nivel']).toFixed(2);
            cantidad1.push([parseFloat(this.listParametro_eje[i]['nivel']),
              ejeY]);
            cantidad.push({
              x: x2,
              y: this.listParametro_eje[i]['caudal']
            });
            dataset.push({
              actual: x2,
              predicted: y2
            });
            x.push(ejeX);
            y.push(this.listParametro_eje[i]['caudal']);

            cantidadLinea.push([{
              x2, y2
            }]

            );
          }


          console.log(4, cantidad);

          var listaR = this.linearRegression2(x, y);
          var listaRegresion = listaR['y_hat'];

          var listaRe = [];


          for (let i = 0; i < listaRegresion.length; i++) {

            listaRe.push({
              x: x[i],
              y: listaRegresion[i]
            });

          }




          var xSum = 0, ySum = 0, xxSum = 0, xySum = 0;
          var count = y.length;
          for (var i = 0, len = count; i < count; i++) {
            xSum += x[i];
            ySum += y[i];
            xxSum += x[i] * x[i];
            xySum += x[i] * y[i];
          }

          // Calculate slope and intercept
          var slope = (count * xySum - xSum * ySum) / (count * xxSum - xSum * xSum);
          var intercept = (ySum / count) - (slope * xSum) / count;

          // Generate values
          var xValues = [];
          var yValues = [];
          for (var x1 = 50; x1 <= 150; x1 += 1) {
            xValues.push(x1);
            yValues.push(x1 * slope + intercept);
            cantidadR.push({
              x: x1,
              y: x1 * slope + intercept
            });
          }




          var rmse = RMSE.rmse(dataset);
          this.rmse = rmse.toFixed(2);


          var accumulator;
          var v1;
          var v2;
          var i1;

          // Initialize an accumulator:
          accumulator = incrmae();

          // For each simulated datum, update the mean absolute error...
          for (i1 = 0; i1 < cantidad.length; i1++) {
            v1 = cantidad[i1].x;
            v2 = cantidad[i1].y
            accumulator(v1, v2);
          }

          var mae = accumulator();

          this.mae = mae.toFixed(3);


          // For each simulated datum, update the mean absolute error...
          for (i1 = 0; i1 < cantidad.length; i1++) {
            v1 = cantidad[i1].x;
            v2 = cantidad[i1].y
            accumulator(v1, v2);
          }

          var mae = accumulator();

          this.mae = mae.toFixed(3);


          // Initialize an accumulator:

          // For each simulated datum, update the mean absolute error...
          for (i1 = 0; i1 < cantidad.length; i1++) {
            v1 = cantidad[i1].x;
            v2 = cantidad[i1].y
          }




          cantidad = [];
          for (let i = 0; i < this.listParametro_eje.length; i++) {
            var ejeY = this.listParametro_eje[i]['caudal'] + 0.01
            var ejeX = this.listParametro_eje[i]['nivel'];
            let n = parseFloat(this.listParametro_eje[i]['nivel']);
            cantidad1.push([parseFloat(this.listParametro_eje[i]['nivel']),
              ejeY]);
            cantidad.push([parseFloat(this.listParametro_eje[i]['nivel']),
              ejeY]);
          }

          this.myRegression = ecStat.regression('linear', cantidad, 0);

          const result = regression.linear(cantidad);

          const gradient = result.equation[0];
          const yIntercept = result.equation[1];
        var str = result.string.substring(1);
            this.ecuacionString ="Q"+ str  

          for (let i = 0; i < this.listParametro_eje.length; i++) {
            var ejeX = this.listParametro_eje[i]['nivel'];
            var ejeY = gradient * ejeX + yIntercept;
            cantidadNivel.push([ejeX, ejeY]);

          }


          this.ecuacion = 1;

          this.chartOptions = {
            title: {
              useHTML: true,
                text: '<span style="display: block;"> Estación  '+this.ndestacion+' relación Caudal(m3/s) vs Nivel(m) </span>',
               style: {
                  "text-align": "center"
              }
          },
          
          caption: {
            useHTML: true,
            style: {
              "text-align": "center",
              "margin-left": "2250px"
            },
            text: ' <div class="col-xl-2 col-lg-2 col-md-2 col-sm-2 ">  <div class="col-xl-12">     <span>Tipo de Ecuación =  '+this.tipoEcuacionString+ ' </span>  <span> </span>  </div>   <div class="col-xl-12">    <span>Ecuación =  '+this.ecuacionString+ ' </span>  <span> </span>  </div>  <div class=" col-xl-12">   <span>R = '+this.r2+ '</span>   <span> </span> </div>',
          },
            xAxis: {
              title: {
                text: ' Nivel(m)'
              },

            },
            yAxis: {
              title: {
                text: 'Caudal (m3/s)'
              },

            },
            series: [{
              type: 'line',
              name: "Regresión Lineal ",
              data: this.myRegression.points,

            }, {
              type: 'scatter',
              name: 'Aforos',
              data: cantidad1,

            }]
          }

          var lista = this.linearRegression(x, y);


          var r2 = lista.r2;
          var r22 = r2.toFixed(2)
          var r221 = parseFloat(r22)
          this.r2 = r221


          var mspe = lista.offset;
          this.mspe = mspe.toFixed(2);

          var bias = lista.gain;
          this.bias = bias.toFixed(2);




        });
    } catch (error) {
      console.error(error);
    }
  }
  buscarinfoEcuacion() {

    try {

      Swal.fire({
        title: 'Cargando información...',
        html: 'Por favor espere',
        timerProgressBar: true,
        timer: 2000,
        didOpen: () => {

          this.servicioAforo
          .obtenerEcuacionCurvaId(this.tempIdCurva)
          .subscribe((response) => {
            if (response) {
  
  
  
              console.log('llegando consulta', response);
              this.listaInfoEcuador = response;
  
  
  
            } else {
  
  
            }
  
          });
          Swal.showLoading();
  
        },
  
      }).then((result) => {
  
  
  
      });
  
    } catch (error) {
      console.error(error);
    }
  }

  cambairidCurva() {
    console.log(this.tempIdCurva);
    try {

      Swal.fire({
        title: 'Cargando información...',
        html: 'Por favor espere',
        timerProgressBar: true,
        didOpen: () => {
          this.servicioAforo
          .obtenerIdcurvaTendencia(this.tempIdCurva)
          .subscribe((response) => {
            this.curvaTendencia = response;
            this.fechaInicio = this.curvaTendencia.fechaInicio;
            console.log(this.curvaTendencia.idEstacion);
            let idEstacion: number = this.curvaTendencia.idEstacion as number;
            this.serviciosEstacionesService.obtenerPorId(idEstacion).subscribe((response) => {
  
              this.objEstacion = response;
  
              this.idestacion = this.objEstacion.idEstacion;
              this.ndestacion = this.objEstacion.estacion;
  
            });
  
          });
        this.servicioAforo
          .obtenerCurvaId(this.tempIdCurva)
          .subscribe((response) => {
  
            this.listParametro_eje = response;
            this.listParametro_registro = response; 
  
            var dataset = [];
            var cantidad = [];
            var categories = [];
            var cantidad2 = [];
            var x = [];
            var y = [];
            var cantidadNivel = [];
            for (let i = 0; i < this.listParametro_eje.length; i++) {
              var ejeY = this.listParametro_eje[i]['caudal'];
              var ejeX = this.listParametro_eje[i]['nivel'];
              var y2 = parseFloat(this.listParametro_eje[i]['caudal']).toFixed(2);
              var x2 = parseFloat(this.listParametro_eje[i]['nivel']).toFixed(2);
              cantidad.push({
                x: x2,
                y: this.listParametro_eje[i]['caudal']
              });
              categories.push(this.listParametro_eje[i]['caudal']);
              cantidad2.push(this.listParametro_eje[i]['nivel'], this.listParametro_eje[i]['caudal']);
              dataset.push({
                actual: ejeX,
                predicted: this.listParametro_eje[i]['caudal']
              });
              x.push(ejeX);
              y.push(this.listParametro_eje[i]['caudal']);
            }
           this.tipoEcuacionString = "Lineal"
            var rmse = RMSE.rmse(dataset);
            this.rmse = rmse.toFixed(2);
            var accumulator;
            var v1;
            var v2;
            var i1;
  
            accumulator = incrmae();
  
            // For each simulated datum, update the mean absolute error...
            for (i1 = 0; i1 < cantidad.length; i1++) {
              v1 = cantidad[i1].x;
              v2 = cantidad[i1].y
              accumulator(v1, v2);
            }
            
            var listaR = this.linearRegression2(x, y);
            var listaRegresion = listaR['y_hat'];
            var listaRe = [];
  
  
            for (let i = 0; i < listaRegresion.length; i++) {
  
              listaRe.push(x[i],
                listaRegresion[i]
              );
  
            }
  
            var accumulator;
            var v1;
            var v2;
            var i1;
            var i;
  
            // Initialize an accumulator:
            accumulator = incrmae();
  
            // For each simulated datum, update the mean absolute error...
            for (i1 = 0; i1 < cantidad.length; i1++) {
              v1 = cantidad[i1].x;
              v2 = cantidad[i1].y
              accumulator(v1, v2);
            }
  
            var mae = accumulator();
  
            this.mae = mae.toFixed(3);
  
            // Initialize an accumulator:
     
  
            // For each simulated datum, update the mean absolute error...
            for (i = 0; i < cantidad.length; i++) {
              v1 = cantidad[i].x;
              v2 = cantidad[i].y
            }
  
  
  
  
  
            var lista = this.linearRegression(x, y);
            var r2 = lista.r2;
            var r22 = r2.toFixed(2)
            var r221 = parseFloat(r22)
            this.r2 = r221
            console.log('llegando consulta', cantidad2);
            cantidad2 = [];
            cantidad = [];
            for (let i = 0; i < this.listParametro_eje.length; i++) {
              var ejeY = this.listParametro_eje[i]['caudal'] 
              var ejeX = this.listParametro_eje[i]['nivel'];
              let n = parseFloat(this.listParametro_eje[i]['nivel']);
              cantidad2.push([parseFloat(this.listParametro_eje[i]['nivel']),
                ejeY]);
              cantidad.push([parseFloat(this.listParametro_eje[i]['nivel']),
                ejeY]);
            }
  
            this.myRegression = ecStat.regression('linear', cantidad, 0);
  
            const result = regression.linear(cantidad);
  
            const gradient = result.equation[0];
            const yIntercept = result.equation[1];
          var str = result.string.substring(1);
            this.ecuacionString ="Q"+ str  
  
            for (let i = 0; i < this.listParametro_eje.length; i++) {
              var ejeX = this.listParametro_eje[i]['nivel'];
              var ejeY = gradient * ejeX + yIntercept;
              cantidadNivel.push([ejeX, ejeY]);
  
            }
  
  
            this.ecuacion = 1;
  
            this.chartOptions = {
              title: {
                useHTML: true,
                  text: '<span style="display: block;"> Estación  '+this.ndestacion+' relación Caudal(m3/s) vs Nivel(m) </span>',
                 style: {
                    "text-align": "center"
                }
            },
            
            caption: {
              useHTML: true,
              style: {
                "text-align": "center",
                "margin-left": "2250px"
              },
              text: ' <div class="col-xl-2 col-lg-2 col-md-2 col-sm-2 ">  <div class="col-xl-12">     <span>Tipo de Ecuación =  '+this.tipoEcuacionString+ ' </span>  <span> </span>  </div>   <div class="col-xl-12">    <span>Ecuación =  '+this.ecuacionString+ ' </span>  <span> </span>  </div>  <div class=" col-xl-12">   <span>R = '+this.r2+ '</span>   <span> </span> </div>',
            }, 
              xAxis: {
                title: {
                  text: ' Nivel(m)'
                },
  
              },
              yAxis: {
                title: {
                  text: 'Caudal (m3/s)'
                },
  
              },
              series: [{
                type: 'line',
                name: "Regresión Lineal ",
                data: this.myRegression.points,
  
              }, {
                type: 'scatter',
                name: 'Aforos',
                data: cantidad2,
  
              }]
            }
  
  
            var mspe = lista.offset;
            this.mspe = mspe.toFixed(2);
  
  
            var bias = lista.gain;
            this.bias = bias.toFixed(2);
  
            Swal.close();
          });
          Swal.showLoading();
  
        },
  
      }).then((result) => {
  
  
  
      });
 
    } catch (error) {
      console.error(error);
    }
  }

  rSquared(x: any, y: any, coefficients: any) {

    let regressionSquaredError = 0
    let totalSquaredError = 0

    function yPrediction(x: any, coefficients: any) {
      return coefficients[0] + coefficients[1] * x
    }

    let yMean = y.reduce((a: any, b: any) => a + b) / y.length

    for (let i = 0; i < x.length; i++) {
      regressionSquaredError += Math.pow(y[i] - yPrediction(x[i], coefficients), 2)
      totalSquaredError += Math.pow(y[i] - yMean, 2)
    }

    return 1 - (regressionSquaredError / totalSquaredError)

  }
  accionRegistroColumnas(e: any) {
    switch (e.accion) {
      case accionesTablasEnum.Eliminar: {

        var listaFinal = this.listParametro_eje;
        var cars = listaFinal.filter(function (car: any) {
          return car.id_informacion_grafica !== e.registro.id_informacion_grafica;
        });
        this.listParametro_eje = [];
        this.listParametro_eje = cars;

        console.log(this.elemento);

        

        switch (this.tipoEcuacionString) {
          case "Lineal": {      
            
          
  
            var dataset = [];
            var cantidad = [];
            var categories = [];
            var cantidad2 = [];
            var x = [];
            var y = [];
            var cantidadNivel = [];
            for (let i = 0; i < this.listParametro_eje.length; i++) {
              var ejeY = this.listParametro_eje[i]['caudal'];
              var ejeX = this.listParametro_eje[i]['nivel'];
              var y2 = parseFloat(this.listParametro_eje[i]['caudal']).toFixed(2);
              var x2 = parseFloat(this.listParametro_eje[i]['nivel']).toFixed(2);
              cantidad.push({
                x: x2,
                y: this.listParametro_eje[i]['caudal']
              });
              categories.push(this.listParametro_eje[i]['caudal']);
              cantidad2.push(this.listParametro_eje[i]['nivel'], this.listParametro_eje[i]['caudal']);
              dataset.push({
                actual: ejeX,
                predicted: this.listParametro_eje[i]['caudal']
              });
              x.push(ejeX);
              y.push(this.listParametro_eje[i]['caudal']);
            }
           this.tipoEcuacionString = "Lineal"
            var rmse = RMSE.rmse(dataset);
            this.rmse = rmse.toFixed(2);
            var listaR = this.linearRegression2(x, y);
            var listaRegresion = listaR['y_hat'];
            var listaRe = [];
  
  
            for (let i = 0; i < listaRegresion.length; i++) {
  
              listaRe.push(x[i],
                listaRegresion[i]
              );
  
            }
  
            var accumulator;
            var v1;
            var v2;
            var i1;
            var i;
  
            // Initialize an accumulator:
            accumulator = incrmae();
  
            // For each simulated datum, update the mean absolute error...
            for (i1 = 0; i1 < cantidad.length; i1++) {
              v1 = cantidad[i1].x;
              v2 = cantidad[i1].y
              accumulator(v1, v2);
            }
  
            var mae = accumulator();
  
            this.mae = mae.toFixed(3);
  
            // Initialize an accumulator:
     
  
            // For each simulated datum, update the mean absolute error...
            for (i = 0; i < cantidad.length; i++) {
              v1 = cantidad[i].x;
              v2 = cantidad[i].y
            }
  
  
  
  
  
            var lista = this.linearRegression(x, y);
            var r2 = lista.r2;
            var r22 = r2.toFixed(2)
            var r221 = parseFloat(r22)
            this.r2 = r221
            console.log('llegando consulta', cantidad2);
            cantidad2 = [];
            cantidad = [];
            for (let i = 0; i < this.listParametro_eje.length; i++) {
              var ejeY = this.listParametro_eje[i]['caudal'] 
              var ejeX = this.listParametro_eje[i]['nivel'];
              let n = parseFloat(this.listParametro_eje[i]['nivel']);
              cantidad2.push([parseFloat(this.listParametro_eje[i]['nivel']),
                ejeY]);
              cantidad.push([parseFloat(this.listParametro_eje[i]['nivel']),
                ejeY]);
            }
  
            this.myRegression = ecStat.regression('linear', cantidad, 0);
  
            const result = regression.linear(cantidad);
  
            const gradient = result.equation[0];
            const yIntercept = result.equation[1];
          var str = result.string.substring(1);
            this.ecuacionString ="Q"+ str  
  
            for (let i = 0; i < this.listParametro_eje.length; i++) {
              var ejeX = this.listParametro_eje[i]['nivel'];
              var ejeY = gradient * ejeX + yIntercept;
              cantidadNivel.push([ejeX, ejeY]);
  
            }
  
  
            this.ecuacion = 1;
  
            this.chartOptions = {
              title: {
                useHTML: true,
                  text: '<span style="display: block;"> Estación  '+this.ndestacion+' relación Caudal(m3/s) vs Nivel(m) </span>',
                 style: {
                    "text-align": "center"
                }
            },
            
            caption: {
              useHTML: true,
              style: {
                "text-align": "center",
                "margin-left": "2250px"
              },
              text: ' <div class="col-xl-2 col-lg-2 col-md-2 col-sm-2 ">  <div class="col-xl-12">     <span>Tipo de Ecuación =  '+this.tipoEcuacionString+ ' </span>  <span> </span>  </div>   <div class="col-xl-12">    <span>Ecuación =  '+this.ecuacionString+ ' </span>  <span> </span>  </div>  <div class=" col-xl-12">   <span>R = '+this.r2+ '</span>   <span> </span> </div>',
            }, 
              xAxis: {
                title: {
                  text: ' Nivel(m)'
                },
  
              },
              yAxis: {
                title: {
                  text: 'Caudal (m3/s)'
                },
  
              },
              series: [{
                type: 'line',
                name: "Regresión Lineal ",
                data: this.myRegression.points,
  
              }, {
                type: 'scatter',
                name: 'Aforos',
                data: cantidad2,
  
              }]
            }
  
  
            var mspe = lista.offset;
            this.mspe = mspe.toFixed(2);
  
  
            var bias = lista.gain;
            this.bias = bias.toFixed(2);
            break;
          }
          case "Exponencial": {
            alert(7);
            this.chartOptions.series = [];
            this.chartOptions2.series = [];
            var cantidad1 = [];
            var cantidad = [];
            var ejex = [];
            var cantidadNivel = [];
            for (let i = 0; i < this.listParametro_eje.length; i++) {

              var ejeY = this.listParametro_eje[i]['caudal'] +0.01
              var ejeX = this.listParametro_eje[i]['nivel'];
              let n = parseFloat(this.listParametro_eje[i]['nivel']);

              cantidad.push([ejeX,
                this.listParametro_eje[i]['caudal']]);
                cantidad1.push([ejeX,
                  this.listParametro_eje[i]['caudal']]);

              ejex.push(ejeX);
            }



            this.myRegression = ecStat.regression('exponential', cantidad1, 0);

            const result = regression.exponential(cantidad1);

            const gradient = result.equation[0];
            const yIntercept = result.equation[1];
          var str = result.string.substring(1);
            this.ecuacionString ="Q"+ str  
            this.ecuacion = 1;
            this.tipoEcuacionString = "Exponencial"

            var a = result.equation[0];
            var b = Math.exp(result.equation[1]);

            ejex.sort(function (a, b) {
              return a - b;
            })

            ejex.sort((a, b) => a - b)
            for (let i = 0; i < this.listParametro_eje.length; i++) {

              ejeX = ejex[i];

              ejeY = a ^ (b * this.listParametro_eje[i]['nivel'])
              cantidadNivel.push([this.listParametro_eje[i]['nivel'], ejeY]);
              cantidad.push([this.listParametro_eje[i]['nivel'], this.listParametro_eje[i]['caudal']]);

            }








            this.chartOptions = {
             title: {
        useHTML: true,
          text: '<span style="display: block;"> Estación  '+this.ndestacion+' relación Caudal(m3/s) vs Nivel(m) </span>',
         style: {
            "text-align": "center"
        }
    },
    
    caption: {
      useHTML: true,
      style: {
        "text-align": "center",
        "margin-left": "2250px"
      },
      text: ' <div class="col-xl-2 col-lg-2 col-md-2 col-sm-2 ">  <div class="col-xl-12">     <span>Tipo de Ecuación =  '+this.tipoEcuacionString+ ' </span>  <span> </span>  </div>   <div class="col-xl-12">    <span>Ecuación =  '+this.ecuacionString+ ' </span>  <span> </span>  </div>  <div class=" col-xl-12">   <span>R = '+this.r2+ '</span>   <span> </span> </div>',
    },
              xAxis: {
                title: {
                  text: ' Nivel(m)'
                },

              },
              yAxis: {
                title: {
                  text: 'Caudal (m3/s)'
                },

              },
              series: [{
                type: 'line',
                name: "Regresión Exponencial ",
                data: this.myRegression.points,

              }, {
                type: 'scatter',
                name: 'Aforos',
                data: cantidad,

              }]
            }


            break;
          }
          case "Logaritmica": {
            this.chartOptions.series = [];
            this.chartOptions2.series = [];
            var cantidad = []; var cantidad1 = [];
            var cantidadNivel = [];
            for (let i = 0; i < this.listParametro_eje.length; i++) {
              var ejeY = this.listParametro_eje[i]['caudal'] + 0.01
              var ejeX = this.listParametro_eje[i]['nivel'];
              let n = parseFloat(this.listParametro_eje[i]['nivel']);
              cantidad.push([parseFloat(this.listParametro_eje[i]['nivel']),
                ejeY]);
              cantidad1.push([parseFloat(this.listParametro_eje[i]['nivel']),
                this.listParametro_eje[i]['caudal']]);
            }

            this.myRegression = ecStat.regression('logarithmic', cantidad, 0);
            this.tipoEcuacionString = "Logaritmica"
            const result = regression.logarithmic(cantidad);
            console.log(this.myRegression);
            const gradient = result.equation[0];
            const yIntercept = result.equation[1];
          var str = result.string.substring(1);
            this.ecuacionString ="Q"+ str  
            this.ecuacion = 1;

            for (let i = 0; i < this.listParametro_eje.length; i++) {
              var ejeX = this.listParametro_eje[i]['nivel'];
              var ejeY = gradient + yIntercept + Math.log(ejeX);
              cantidadNivel.push([ejeX, ejeY]);


            }




            this.chartOptions = {
            title: {
        useHTML: true,
          text: '<span style="display: block;"> Estación  '+this.ndestacion+' relación Caudal(m3/s) vs Nivel(m) </span>',
         style: {
            "text-align": "center"
        }
    },
    
    caption: {
      useHTML: true,
      style: {
        "text-align": "center",
        "margin-left": "2250px"
      },
      text: ' <div class="col-xl-2 col-lg-2 col-md-2 col-sm-2 ">  <div class="col-xl-12">     <span>Tipo de Ecuación =  '+this.tipoEcuacionString+ ' </span>  <span> </span>  </div>   <div class="col-xl-12">    <span>Ecuación =  '+this.ecuacionString+ ' </span>  <span> </span>  </div>  <div class=" col-xl-12">   <span>R = '+this.r2+ '</span>   <span> </span> </div>',
    },
              xAxis: {
                title: {
                  text: ' Nivel(m)'
                },

              },
              yAxis: {
                title: {
                  text: 'Caudal (m3/s)'
                },

              },
              series: [{
                type: 'line',
                name: "Regresión Logaritmica ",
                data: this.myRegression.points,

              }, {
                type: 'scatter',
                name: 'Aforos',
                data: cantidad,

              }]
            }





          
            break;
          } 
          case "Polinómica": {
            this.chartOptions.series = [];
            this.chartOptions2.series = [];
            var cantidad = []; var cantidad1 = [];
            var cantidadNivel = [];
            for (let i = 0; i < this.listParametro_eje.length; i++) {
              var ejeY = this.listParametro_eje[i]['caudal'] + 0.01
              var ejeX = this.listParametro_eje[i]['nivel'];
              let n = parseFloat(this.listParametro_eje[i]['nivel']);
              cantidad1.push([parseFloat(this.listParametro_eje[i]['nivel']),
                ejeY]);
              cantidad.push([parseFloat(this.listParametro_eje[i]['nivel']),
              this.listParametro_eje[i]['caudal']]);
            }


            this.myRegression = ecStat.regression('polynomial', cantidad, parseInt(var2));



            this.tipoEcuacionString = "Polinómica"


            const result = regression.polynomial(cantidad, { order: parseInt(var2) });

            const gradient = result.equation[0];
            const yIntercept = result.equation[1];
          var str = result.string.substring(1);
            this.ecuacionString ="Q"+ str  
            cantidadNivel = [gradient, yIntercept];

            this.ecuacion = 4;

            this.chartOptions = {
            title: {
        useHTML: true,
          text: '<span style="display: block;"> Estación  '+this.ndestacion+' relación Caudal(m3/s) vs Nivel(m) </span>',
         style: {
            "text-align": "center"
        }
    },
    
    caption: {
      useHTML: true,
      style: {
        "text-align": "center",
        "margin-left": "2250px"
      },
      text: ' <div class="col-xl-2 col-lg-2 col-md-2 col-sm-2 ">  <div class="col-xl-12">     <span>Tipo de Ecuación =  '+this.tipoEcuacionString+ ' </span>  <span> </span>  </div>   <div class="col-xl-12">    <span>Ecuación =  '+this.ecuacionString+ ' </span>  <span> </span>  </div>  <div class=" col-xl-12">   <span>R = '+this.r2+ '</span>   <span> </span> </div>',
    },
              xAxis: {
                title: {
                  text: ' Nivel(m)'
                },

              },
              yAxis: {
                title: {
                  text: 'Caudal (m3/s)'
                },

              },
              series: [{
                type: 'line',
                name: "Regresión Polinómica ",
                data: this.myRegression.points,

              }, {
                type: 'scatter',
                name: 'Aforos',
                data: cantidad,

              }]
            }






          
            break;
          } 
          case "Potencial": {
          
            this.chartOptions.series = [];
            this.chartOptions2.series = [];
            var cantidad = []; var cantidad1 = [];
            var cantidadNivel = [];
            for (let i = 0; i < this.listParametro_eje.length; i++) {
              var ejeY = this.listParametro_eje[i]['caudal'] + 0.01
              var ejeX = this.listParametro_eje[i]['nivel'];
              let n = parseFloat(this.listParametro_eje[i]['nivel']);
              cantidad1.push([parseFloat(this.listParametro_eje[i]['nivel']),
              this.listParametro_eje[i]['caudal']]);
              cantidad.push([parseFloat(this.listParametro_eje[i]['nivel']),
                ejeY]);
            }
            this.myRegression = ecStat.regression('polynomial', cantidad, 4);

            const result = regression.linear(cantidad);

            const gradient = result.equation[0];
            const yIntercept = result.equation[1];
          var str = result.string.substring(1);
            this.ecuacionString ="Q"+ str  

            for (let i = 0; i < this.listParametro_eje.length; i++) {
              var ejeX = this.listParametro_eje[i]['nivel'];
              var ejeY = gradient * ejeX + yIntercept;
              cantidadNivel.push([ejeX, ejeY]);

            }
            this.tipoEcuacionString = "Potencial"


            this.ecuacion = 1;

            this.chartOptions = {
            title: {
        useHTML: true,
          text: '<span style="display: block;"> Estación  '+this.ndestacion+' relación Caudal(m3/s) vs Nivel(m) </span>',
         style: {
            "text-align": "center"
        }
    },
    
    caption: {
      useHTML: true,
      style: {
        "text-align": "center",
        "margin-left": "2250px"
      },
      text: ' <div class="col-xl-2 col-lg-2 col-md-2 col-sm-2 ">  <div class="col-xl-12">     <span>Tipo de Ecuación =  '+this.tipoEcuacionString+ ' </span>  <span> </span>  </div>   <div class="col-xl-12">    <span>Ecuación =  '+this.ecuacionString+ ' </span>  <span> </span>  </div>  <div class=" col-xl-12">   <span>R = '+this.r2+ '</span>   <span> </span> </div>',
    },
              xAxis: {
                title: {
                  text: ' Nivel(m)'
                },

              },
              yAxis: {
                title: {
                  text: 'Caudal (m3/s)'
                },

              },
              series: [{
                type: 'line',
                name: "Regresión Potencial ",
                data: this.myRegression.points,

              }, {
                type: 'scatter',
                name: 'Aforos',
                data: cantidad1,

              }]
            }



          
            break;
          } 
          case "Media movil": {
            this.chartOptions.series = [];
            this.chartOptions2.series = [];
            var cantidad = [];
            var cantidad1 = [];
            var cantidadNivel = [];
            for (let i = 0; i < this.listParametro_eje.length; i++) {
              var ejeY = this.listParametro_eje[i]['caudal'] + 0.01
              var ejeX = this.listParametro_eje[i]['nivel'];
              let n = parseFloat(this.listParametro_eje[i]['nivel']);
              cantidad1.push([parseFloat(this.listParametro_eje[i]['nivel']),
              this.listParametro_eje[i]['caudal']]);
              cantidad.push([parseFloat(this.listParametro_eje[i]['nivel']),
                ejeY]);
            }

            this.myRegression = ecStat.regression('polynomial', cantidad, 4);



            this.tipoEcuacionString = "Media movil"
            const result = regression.polynomial(cantidad, { order: 4 });

            const gradient = result.equation[0];
            const yIntercept = result.equation[1];
          var str = result.string.substring(1);
            this.ecuacionString ="Q"+ str  
            cantidadNivel = [gradient, yIntercept];

            this.ecuacion = 1;

            this.chartOptions = {
            title: {
        useHTML: true,
          text: '<span style="display: block;"> Estación  '+this.ndestacion+' relación Caudal(m3/s) vs Nivel(m) </span>',
         style: {
            "text-align": "center"
        }
    },
    
    caption: {
      useHTML: true,
      style: {
        "text-align": "center",
        "margin-left": "2250px"
      },
      text: ' <div class="col-xl-2 col-lg-2 col-md-2 col-sm-2 ">  <div class="col-xl-12">     <span>Tipo de Ecuación =  '+this.tipoEcuacionString+ ' </span>  <span> </span>  </div>   <div class="col-xl-12">    <span>Ecuación =  '+this.ecuacionString+ ' </span>  <span> </span>  </div>  <div class=" col-xl-12">   <span>R = '+this.r2+ '</span>   <span> </span> </div>',
    },
              xAxis: {
                title: {
                  text: ' Nivel(m)'
                },

              },
              yAxis: {
                title: {
                  text: 'Caudal (m3/s)'
                },

              },
              series: [{
                type: 'line',
                name: "Regresión Media movil ",
                data: result.points,

              }, {
                type: 'scatter',
                name: 'Aforos',
                data: cantidad1,

              }]
            }



          
            break;
          } 
          
          
          default: {

            break;
          }
        }


     

      }


    }
  }
  linearRegression(x: any, y: any) {
    var xs = 0;  // sum(x)
    var ys = 0;  // sum(y)
    var xxs = 0; // sum(x*x)
    var xys = 0; // sum(x*y)
    var yys = 0; // sum(y*y)

    var n = 0;
    for (; n < x.length && n < y.length; n++) {

      xs += x[n];
      ys += y[n];
      xxs += x[n] * x[n];
      xys += x[n] * y[n];
      yys += y[n] * y[n];
    }

    var div = n * xxs - xs * xs;
    var gain = (n * xys - xs * ys) / div;
    var offset = (ys * xxs - xs * xys) / div;

    var r2 = Math.abs((xys * n - xs * ys) / Math.sqrt((xxs * n - xs * xs) * (yys * n - ys * ys)));

    return { gain: gain, offset: offset, r2: r2 };
  }
  linearRegression2(x_values: any, y_values: any) {

    //Create the regressor object to store the equation's data
    var regressor: any = {};

    //Set variables we'll need to get the slope and intercept; we need to find the equation in the format y = m*x+b where m is the slope and b is the intercept
    var x_mean = x_values.reduce((a: any, b: any) => a + b, 0) / x_values.length;
    var y_mean = y_values.reduce((a: any, b: any) => a + b, 0) / y_values.length;

    //Equations to solve for slope: 
    var slope = 0, slope_numerator = 0, slope_denominator = 0;
    for (i = 0; i < x_values.length; i++) {
      slope_numerator += (x_values[i] - x_mean) * (y_values[i] - y_mean);
      slope_denominator += Math.pow((x_values[i] - x_mean), 2)
    }

    slope = slope_numerator / slope_denominator;

    regressor['slope'] = slope;

    //Equation to solve for intercept
    var intercept = y_mean - x_mean * slope;
    regressor['intercept'] = intercept;


    //Get y_hat, or predicted values of y based on x_values
    //Loop through x_values, and run the elements through the lr equation to get predictions
    var y_hat = [];
    var i;
    for (i = 0; i < x_values.length; i++) {

      y_hat.push(x_values[i] * regressor['slope'] + regressor['intercept']);
    }
    regressor['y_hat'] = y_hat;


    //Now to find the r2 score
    var residual_sum_of_squares = 0, total_sum_of_squares = 0, r2 = 0;

    for (i = 0; i < y_values.length; i++) {
      residual_sum_of_squares += Math.pow((y_hat[i] - y_values[i]), 2);
      total_sum_of_squares += Math.pow((y_hat[i] - y_mean), 2);
    }

    r2 = 1 - residual_sum_of_squares / total_sum_of_squares;

    //Add to regressor object
    regressor['r2'] = r2;


    return regressor;

  }
  cambiar(id: any) {


    this.tempIdCurva = id;


    this.cambairidCurva();
    this.buscarinfoEcuacion();


  }


  buscarInformacion(arg: any) {


    Swal.fire({
      title: 'Desea cambiar la curva de tendencia?',
      text: 'Se cambiaran todos los valores ',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Cambiar',
    }).then((result) => {
      if (result.isConfirmed) {


        this.cambiar(this.tempIdCurva);


      }
    });
  }

  dataPointSelection1(event: any, chartContext: any, config: any) {

    Swal.fire({
      title: 'Cmbiar aforo ',
      html: `<input type="number" id="caudal" class="swal2-input" placeholder="Caudal">
        <input type="number" id="nivel" class="swal2-input" placeholder="Nivel">`,
      confirmButtonText: 'Cambiar',
      focusConfirm: false,
      preConfirm: () => {
        var2 = (document.getElementById(
          'nivel'
        ) as HTMLInputElement).value;
        var3 = (document.getElementById(
          'caudal'
        ) as HTMLInputElement).value;
        var1 = config.dataPointIndex;

        return { caudal: var3, nivel: var2 }
      }

    }).then((result) => {
      if (result.isConfirmed) {
        let divsucursal: any = document.getElementById(`btn`);
        divsucursal.click();
        Swal.fire(`
          caudal: ${result.value?.caudal}
          nivel: ${result.value?.nivel}
        `.trim());
      }

    });

  };
  infoAforo() {


  }
  cambioCurva() {

    this.tempIdCurva = this.curvaSelected;
    this.cargarCurvaporId();

  }
  onRightClick4(chart: HTMLElement, chartId: string, event?: Event) {

  }
  imprimirGrafica() {
    
    $("li:nth-last-child(n + 3)").click();


  }

  linear_regression(xyr: any) {
    var i,
      x, y, r,
      sumx = 0, sumy = 0, sumx2 = 0, sumy2 = 0, sumxy = 0, sumr = 0,
      a, b;

    for (i = 0; i < xyr.length; i++) {
      // this is our data pair
      x = xyr[i][0]; y = xyr[i][1];

      // this is the weight for that pair
      // set to 1 (and simplify code accordingly, ie, sumr becomes xy.length) if weighting is not needed
      r = xyr[i][2];

      // consider checking for NaN in the x, y and r variables here 
      // (add a continue statement in that case)

      sumr += r;
      sumx += r * x;
      sumx2 += r * (x * x);
      sumy += r * y;
      sumy2 += r * (y * y);
      sumxy += r * (x * y);
    }

    // note: the denominator is the variance of the random variable X
    // the only case when it is 0 is the degenerate case X==constant
    b = (sumy * sumx2 - sumx * sumxy) / (sumr * sumx2 - sumx * sumx);
    a = (sumr * sumxy - sumx * sumy) / (sumr * sumx2 - sumx * sumx);

    return [a, b];
  }

  guadarCurva() {
    console.log("--------------------------------------------")
    console.log("el resultado del detalle caudal", this.listParametro_eje);
    console.log("--------------------------------------------")
    var tipoE:number;
    Swal.fire({
      title: 'Desea guardar la curva nivel caudal asociada a la estación?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Guardar',
    }).then((result) => {
      if (result.isConfirmed) {
        var date = new Date();
        var datess = '2022-01-12'
        //conusltar la tabla si el id de la estación ya tiene registro si ya tiene debe incremetar el valor que trae 
        // this.curvaTendencia.idEstacion, consultar id la estación numeroCurva 

        let consecutivo: Consecutivo = {
          idElemento: this.objEstacion.idEstacion,
          idTipoElemento: 466
        }

        this.servicioAforo
          .guardarConsecutivoCurva(consecutivo)
          .subscribe((response) => {

          
            let consecutivo: any = response;

           if( this.elemento == 1 ){

            tipoE = 901 
           }
           if( this.elemento == 2 ){

            tipoE = 902 
           }
           if( this.elemento == 3 ){

            tipoE = 903 
           } 
              if( this.elemento == 4 ){

            tipoE = 904 
           }
           if( this.elemento == 5 ){

            tipoE = 905
           }
           if( this.elemento == 6 ){

            tipoE = 906
           }

            let informacionEcuacion: InformacionEcuacion = {
              id_curva_tendencia: parseInt(this.tempIdCurva),
              coeficiente: this.myRegression.parameter.intercept,
              exponente: this.myRegression.parameter.gradient,
              flagMigracion: 0,
              ecuacion: this.ecuacionString,
              tramo: 0,
              id_tipo_ecuacion:tipoE,
              tipo_ecuacion:this.tipoEcuacionString,
              nivel_min: 0,
              nivel_max: 0,
              ho: 0,
              activo: 'S',
              r2: this.r2,
              mae: this.mae,
              idElemento: this.objEstacion.idEstacion,
              idTipoElemento: 466,
              consecutivo: consecutivo.consecutivo
            };



            console.log(this.elemento,informacionEcuacion);


            this.servicioAforo
              .guardarInformcionEcuacion(informacionEcuacion)
              .subscribe((response) => {

                let id_informacion_ecuaciones: any = response;

                console.log("-------------------------------")
                console.log("este es la estacion", this.objEstacion)
                console.log("-------------------------------")

                let curvaNivelCaudal: ICurvaNivelCaudal = {
                  idEcuacion: id_informacion_ecuaciones.id_informacion_ecuaciones,
                  idCalibracion: null,
                  idElemento: this.objEstacion.idEstacion,
                  estado: 0,
                  fechaInicioVigencia: datess,
                  flagMigracion: 0,

                  idVigencia: 0,
                  numeroCurva: 0,
                  id_tipo_eduacion:this.idTipoElemento,
                  activo: 'S',
                  idTipoElemento: 466,
                  consecutivo: consecutivo.consecutivo
                }

                console.log("-----------------------")
                console.log("este es el codigo", this.objEstacion.id_tipo_elemento)
                console.log("-------------------------------")

                this.servicioAforo
                  .guardarCurvaNivelCaudal(curvaNivelCaudal)
                  .subscribe((response) => {
                    var respuestaCurvaNivel: any = response;
                    Swal.fire({
                      title: '¡se guardo correctamente! ',
                      icon: 'info',
                      showCancelButton: false,
                    }).then((result) => {
                      if (result.isConfirmed) {
                        console.log("este es el response", response);

                        Swal.fire({
                          title: 'Guardando detalles...', 
                          html: 'Por favor espere.', 
                          timer: 42000, 
                          timerProgressBar: true, 
                          allowOutsideClick: false, 
                          showConfirmButton: false, 
                          didOpen: async() => {
                            Swal.showLoading();

                            var curvaNivelCaudalDetalle: any = [];

                            

                            for (let i = 0; i < this.listParametro_registro.length; i++) {


                              var ejeY = this.listParametro_registro[i]['caudal'] 
                              var ejeX = this.listParametro_registro[i]['nivel'];
                              let n = parseFloat(this.listParametro_registro[i]['nivel']);

                              //guardar servicio detalle de curva nivel caudal 
                              // en la misma posición for en this.listParametro_eje fecha , nivel y cudal  al igual this.myRegression.points x y
                              /// insert tabla detalle curva 
                              //id_curva_nivel_caudal
                              // this.listParametro_eje[i]['cudal']
                              //this.listParametro_eje[i]['nivel']
                              //this.listParametro_eje[i]['fecha']
                              //this.myRegressio.points[i][0] = x eje_x
                              //this.myRegression.points[i][1] = y eje_y

                              curvaNivelCaudalDetalle.push({
                                idCurvaNivelCaudal: respuestaCurvaNivel.idCurvaNivelCaudal,
                                caudal: ejeY,
                                nivel: ejeX,
                                valorEnX: this.myRegression.points[i][0],
                                valorEnY: this.myRegression.points[i][1],
                                activo: 's'
                              });
                              
                              let curvaNivelCaudalDetalles: ICurvaNivelCaudalDetalles = {
                                idCurvaNivelCaudal: respuestaCurvaNivel.idCurvaNivelCaudal,
                                nivel: ejeX,
                                caudal: ejeY,
                                valorEnX: this.myRegression.points[i][0],
                                valorEnY: this.myRegression.points[i][1],
                                fechaCurva: this.listParametro_registro[i]['fecha_creacion'],
                                activo: 'S',
                              }

                              this.servicioAforo
                                .guardarCurvaNivelCaudalDetalle(curvaNivelCaudalDetalles)
                                .subscribe((response) => {
                                  //console.log('--> Guardado exitoso. Objeto: ' + (i+1) + '. Faltan: ' + (this.listParametro_eje.length - (i+1)) + " objetos.");
                              });
                              
                              console.log("--------------------------------------------");
                              console.log("el resultado del detalle caudal", curvaNivelCaudalDetalles);
                              console.log("--------------------------------------------");
                            }

                            setTimeout(() => {
                              Swal.close();

                              Swal.fire({
                                icon: 'success', 
                                title: 'Guardado exitoso.', 
                                html: 'Los detalles de la tabla han sido guardados de forma exitosa.', 
                              });
                            }, 5000);
                          }, 
                          willClose: async() => {
                            Swal.hideLoading();
                          }
                        });
                      }
                    });
                  });
              });

            /*this.servicioAforo
            .guardarCurvaNivelCaudal(curvaNiveLCudal2)
            .subscribe((response) => {
              if (response.id_informacion_ecuaciones != null &&  response.id_informacion_ecuaciones>= 0) {
                debugger;
    
                var id_curva_nivel_caudal = response.id_informacion_ecuaciones;
    
                Swal.fire({
                  title: '¡La curva nivel-caudal No! '+ id_curva_nivel_caudal,
                  icon: 'info',
                  showCancelButton: false,
                }).then((result) => {
                  if (result.isConfirmed) {
    
                    //No hay back 
    
    
                      //guardar servicio detalle de curva nivel caudal 
                      // en la misma posición for en this.listParametro_eje fecha , nivel y cudal  al igual this.myRegression.points x y
                    /// insert tabla detalle curva 
                    //id_curva_nivel_caudal
                    // this.listParametro_eje[i]['cudal']
                    //this.listParametro_eje[i]['nivel']
                      //this.listParametro_eje[i]['fecha']
                    //this.myRegressio.points[i][0] = x eje_x
                    //this.myRegression.points[i][1] = y eje_y
             
                  }
                });
      
    
            
    
                };
                
    
    
    
              } );
    
         
          */

          });
      }
    });
  }
  eliminarRegresar() {
    this.router.navigateByUrl('/configuracion/calcularRegresecion');

  }

  regresar() {
    this.router.navigateByUrl('/configuracion/calcularRegresecion');


  }

  

  regresarCurva() {

    
   
    let curvaTendencia ={
      idEstacion:   this.idestacion ,
      idCurvaTendencia: this.tempIdCurva

    }
    this.servicioAforo
    .consultarAnterior(curvaTendencia)
    .subscribe((response) => {
      this.tempIdCurva = response;
      this.id = response;
      this.obtneridCurva();

      this.cambairidCurva();
      this.buscarinfoEcuacion();

      });

  


  }
  ImportarTabla() {

    let div: any = document.querySelector(".buttons-print");
    div.click();
  }

}
