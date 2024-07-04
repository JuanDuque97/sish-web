import { Component, OnInit, ViewChild } from '@angular/core';
import {FormBuilder, FormGroup, FormArray, FormControl, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LegendPosition } from '@swimlane/ngx-charts';
import { IAforador, IAforo,  IAforoArchivo,  IAforoCalculo, IAforoDato, IAforoPunto, IAforoView } from 'src/app/modelo/configuracion/aforo';



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
import { ServiciosMolineteService } from '../../molinetes/servicios-molinetes.service';
const regression = require('regression');

import { ServiciosCapasService } from '../../../capas/servicios-capas.service';
import { ServiciosDominiosValoresService } from '../../../dominios/servicios-dominios-valores.service';
import { ServiciosAforoService} from '../servicios-aforo.service';
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
import { namespaces } from 'd3';

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
  

export var var1: number = 0;
export var var2: string = '';
export var var3: string = '';




@Component({
  selector: 'app-validar-aforo',
  templateUrl: './validar-aforo.component.html',
})

export class ValidarAforoComponent implements OnInit {
 
  @ViewChild("chart") chart: ChartComponent;
  @ViewChild("chart1") chart1: ChartComponent;
  @ViewChild("chart2") chart2: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  public chartOptions1: Partial<ChartOptions>;
  public chartOptions2: Partial<ChartOptions>;

  @ViewChild(DataTableDirective, { static: false })

  public formularioFiltros!: FormGroup;
   regress = (x:any, y:any ) => {
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
    const r2 = Math.pow(r,2);
    let sst = 0;
    for (let i = 0; i < n; i++) {
       sst += Math.pow((y[i] - my), 2);
    }
    const sse = sst - r2 * sst;
    const see = Math.sqrt(sse / (n - 2));
    const ssr = sst - sse;
    return {slope, intercept, r, r2, sse, ssr, sst, sy, sx, see};
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
    console.log('The map loaded: ' + status);
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
  public monilete :any = [];
  public marca:string;
  
  public serie:string;
  public Mecanismo:string;
  public listaMunicipios = [];
  public listaDepartamentos = [];
  public departamentoSelected: any;
  public curvaSelected: any;
  public aforoLocal=[] as any;
  public listahelice=[] as any;
  private tempIdDepartamento: number = 0;
  public ListaCurva = [] as any;
  public tempIdCurva: string = '0';
  public observacion: string;
  public fecha_pintar = 0;
  public velocidadMedia:String;
  public caudal = 0;
  datosOriginal = [] as any;
  public ecuacion = 0;
  public h = 0;
  public idmolinete:number;
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
  public elemento: number = 0;
  public periodo: number = 0;
  public parametro: number;
  public radio: String;
  public perimetroMojado: number;
  public ancho: number;
  public listaCodigoEAAB: any = [];
  public listaCodigoIDEAM: any = [];
  rutaConsulta1 = 'configuracion/gestionAforo/V/';
  rutaGeneral = 'configuracion/gestionAforo/C/0';
  rutaEdicion = 'configuracion/gestionAforo/E/';
  rutaConsulta = 'configuracion/gestionAforo/V/';
  public id: string = '0';
  public ac: string = '0';
   public te: string = '0';
  datosFilterEstaciones = [] as any;
  datosFilterEmbalses = [] as any;
  datosFilterPozos = [] as any;
  datosFilter = [] as any;
  datosSerieAnio = [] as any;
  datosSerieMes = [] as any;
  listParametroXElemento = [] as any;
  listParametro_eje = [] as any;
  listaCalculo = [] as any;
  listaElementos = [] as any;
  listaTipoAforo = [] as any;
  listaElemento = [] as any;
  listAforos = [] as any;
  listaInfoEcuador = [] as any;
  public idTipoElemento: any;
  public idElemento: string = '0';
  r2:number;
  rmse:number;
  mae:number;
  mspe:number;
  bias:number;



  columnas = [
    {
      title: 'id',
      data: 'id_informacion_grafica',

    },
    {
      title: 'Fecha Aforo',
      data: 'fecha_creacion',

    },
    {
      title: 'Aforo NO.',
      data: 'id_informacion_grafica',

    },
    {
      title: 'Caudal(㎥/s)',
      data: 'caudal',

    },
    {
      title: 'Nivel(m)',
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
    private servicioAforo:ServiciosAforoService,
    private serviciosMolineteService:ServiciosMolineteService
  ) {}

  ngOnInit(): void {

    this.id = this.route.snapshot.paramMap.get('id')!;
    this.ac = this.route.snapshot.paramMap.get('ac')!;
    this.te = this.route.snapshot.paramMap.get('te')!;
    if(this.id){
      if (this.ac != 'E') {
        this.obtneridAfotoCalculo();
      }
  
    
      this.obtneridAfotoCalculo();

    }
   
 
    this.chartOptions = {
      series: [],
      chart: {
        height: 350,
        id: 'chartf',
        type: 'scatter',
        toolbar: {
          tools: {
              download: false
          }
        },
        zoom: {
          enabled: true,
          type: 'xy'
        },
        events: [],
      },
      title: {
        text: 'Punto obtenido ',
        align: 'Center'
      },
      xaxis: {
        tickAmount: 10,
        title: {
          text: 'Nivel(h) (m)',

      },
        labels: {
          formatter: function(val:any) {
            return parseFloat(val).toPrecision(1)
          }
        }
      },
      yaxis: {
        title: {
          text: 'Caudal (Q) (㎥/s)',
          offsetY: 20,
         },
        tickAmount: 7
      }
    };
    this.chartOptions2 = {
      series: [],
      chart: {
        id: 'target-chart',
        height: 350,
        type: 'line',
        toolbar: {
          tools: {
              download: false
          }
        },
        zoom: {
          enabled: true,
          type: 'xy'
        },
        events: [],    
      },
      title: {
        text: 'Ecuación Caudal Vs Nivel',
        align: 'Center'
      },
      xaxis: {
        title: {
          text: 'Nivel(h) (m)',

      },
        tickAmount: 10,
        labels: {
          formatter: function(val:any) {
            return parseFloat(val).toPrecision(1)
          }
        }
      },
      yaxis: {
        title: {
          text: 'Caudal (Q) (㎥/s)',
          offsetY: 20,
         },
        tickAmount: 7
      }
    };

    this.chartOptions1 = {
      series: [],
      chart: {
        id: 'target-chart',
        height: 350,
        type: 'line',
        toolbar: { show: true },
        zoom: {
          enabled: true,
          type: 'xy'
        },
        events: [],    
      },

      title: {
        text: 'Curva de tendencia Caudal Vs Nivel',
        align: 'Center'
      },
      xaxis: {
        title: {
          text: 'Nivel(h) (m)',

      },
        tickAmount: 10,
        labels: {
          formatter: function(val:any) {
            return parseFloat(val).toPrecision(1)
          }
        }
      },
      yaxis: {
        title: {
          text: 'Caudal (Q) (㎥/s)',
          offsetY: 20,
         },
        tickAmount: 7
      }
    };
    this.chartOptions.chart.events['dataPointSelection'] = this.dataPointSelection;
    this.chartOptions1.chart.events['dataPointSelection'] = this.dataPointSelection;

    this.servicioAforo.obtenerPorTipo().subscribe(aforos=>{

      this.listAforos = aforos;

    })


    this.serviciosDominiosValoresService
      .obtenerValoresPorIdDominio(dominiosEnum.TipoElemento)
      .subscribe((response) => {
        this.listaElementos = response;
        // console.log('llego frecuencia', this.listaFrecuencia);
      });

    this.serviciosDominiosValoresService
      .obtenerValoresPorIdDominio(dominiosEnum.TipoAforos)
      .subscribe((response) => {
        this.listaTipoAforo = response;
      });

       // Curva tendencia
    this.servicioAforo
    .obtenerCurva()
    .subscribe((response) => {
      this.ListaCurva = response;
    });


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
    this.construirFormulario();
    //this.cargarAreaHidrografica();
    //this.onChanges();
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

  get fechaInicio() {
    return this.formularioFiltros.get('fechaInicio');
  }
  get fechaFin() {
    return this.formularioFiltros.get('fechaFin');
  }


  private construirFormulario() {
    this.Mecanismo = '469';
  this.formularioFiltros = this.formBuilder.group({
      codigoEstacionIdeam: [''],
      elemento: [''],
      idElemento: [''],
      nombreCorriente: [''],
      idDepartamento: [''],
      idMunicipio: [''],
      areaHidrografica: [''],
      zonaHidrografica: [''],
      subZonaHidrografica: [''],
      cuenca: [''],
      subCuenca: [''],
      microcuenca: [''],
      tipo: [''],
      idAforo: [''],
      aforador: [''],
      idtipoAforo: [''],
      fechaInicio: [''],
      fechaFin: [''],
      idEntidad: [''],
      periodo: [''],
    });
  }
  dataPointSelection(event: any, chartContext:any, config:any) {
    var1 = config.dataPointIndex;
    let div:any=document.getElementById(`btn`);
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
          this.elemento =  elementoSeleccionado
        }
      });



    }


  }
  obtenerElementos(even: any) {

    switch (even) {
      case '1': {

        Swal.fire({
          title: 'Desea Cambiar la ecuación a Exponecial?',
          text: 'Se cambiaran todos los valores ',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, Cambiar',
        }).then((result) => {
          if (result.isConfirmed) {
           var  cantidadfinal = [];
            var cantidadr = [];
            var cantidad = [];
            var cantidadNivel = [];
                  for (let  i = 0; i <  this.listParametro_eje.length; i++) {
                    var  ejeY =  this.listParametro_eje[i]['caudal'];
                    var  ejeX =    this.listParametro_eje[i]['nivel'];
                   cantidad.push([ejeX,ejeY]);
                   cantidadr.push(ejeX);
                  }
                  var myArray = cantidadr;
                  var max = Math.max.apply(null, myArray);
               
           var ultimoPrimer =  this.listParametro_eje[0]['caudal'];
           var ultimoCaudal =  this.listParametro_eje[this.listParametro_eje.length-1]['caudal'];
         
            const result = regression.exponential(cantidad);
            console.log(cantidad);
            console.log(result);
            const gradient = result.equation[0];
            const yIntercept = result.equation[1];
            cantidadNivel = [gradient,yIntercept]; 
        
          cantidadfinal = [{
            x:ultimoPrimer,
            y:gradient
          },{
            x:max,
            y:yIntercept
          }];
           
          this.ecuacion = 1;
       
          this.chartOptions1.series[1]= {
            name: "Ecuaución Exponecial ",
            type: "line",
            data:cantidadfinal
          };
          this.chartOptions2.series = [{
            name: "Curva tendencia  ",
            type: "line",
            data:cantidadNivel
          },
        ];
         
           
           var chart = new ApexCharts(document.querySelector("#chartf"), this.chartOptions);
           chart.render();
           var chart1 = new ApexCharts(document.querySelector("#chartf1"), this.chartOptions1);
           chart1.render();


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

            var cantidad = [];
            var cantidadNivel = [];
                  for (let  i = 0; i <  this.listParametro_eje.length; i++) {
                    var  ejeY =  this.listParametro_eje[i]['caudal'];
                    var  ejeX =    this.listParametro_eje[i]['nivel'];
                   cantidad.push([ejeX,ejeY]);
                  }



            const result = regression.logarithmic(cantidad);
            console.log(cantidad);
            console.log(result);
            const gradient = result.equation[0];
            const yIntercept = result.equation[1];
            cantidadNivel = [gradient,yIntercept];

            this.ecuacion = 1;
            this.chartOptions2.series = [{
              name: "Curva tendencia  ",
              type: "line",
              data:cantidadNivel
            },
          ];

            this.chartOptions.chart.events['dataPointSelection'] = this.dataPointSelection;




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

            var cantidad = [];
            var cantidadNivel = [];
                  for (let  i = 0; i <  this.listParametro_eje.length; i++) {
                    var  ejeY =  this.listParametro_eje[i]['caudal'];
                    var  ejeX =    this.listParametro_eje[i]['nivel'];
                   cantidad.push([ejeX,ejeY]);
                  }



            const result = regression.linear(cantidad);
            console.log(cantidad);
            console.log(result);
            const gradient = result.equation[0];
            const yIntercept = result.equation[1];
            cantidadNivel = [gradient,yIntercept];


            this.ecuacion = 1;
            this.chartOptions2.series = [{
              name: "Curva tendencia  ",
              type: "line",
              data:cantidadNivel
            },
          ];
            this.chartOptions2.chart.events['dataPointSelection'] = this.dataPointSelection;



          }
        });


        break;
      }
       case '4': {
        Swal.fire({
          title: 'Desea Cambiar la ecuación a Polinómica?',
          text: 'Se cambiaran todos los valores ',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, Cambiar',
        }).then((result) => {
          if (result.isConfirmed) {

            var cantidad = [];
            var cantidadNivel = [];
                  for (let  i = 0; i <  this.listParametro_eje.length; i++) {
                   var  ejeX =  this.listParametro_eje[i]['caudal'];
                   var  ejeY =    this.listParametro_eje[i]['nivel'];
                   cantidad.push([ejeX,ejeY]);
                  }



            const result = regression.polynomial(cantidad);
            console.log(cantidad);
            console.log(result);
            const gradient = result.equation[0];
            const yIntercept = result.equation[1];
            cantidadNivel = [gradient,yIntercept];

            this.ecuacion = 1;
            this.chartOptions2.series = [{
              name: "Curva tendencia  ",
              type: "line",
              data:cantidadNivel
            },
          ];

            this.chartOptions1.chart.events['dataPointSelection'] = this.dataPointSelection;




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

            var cantidad = [];
            var cantidadNivel = [];
                  for (let  i = 0; i <  this.listParametro_eje.length; i++) {
                   var  ejeX =  this.listParametro_eje[i]['caudal'];
                   var  ejeY =    this.listParametro_eje[i]['nivel'];
                   cantidad.push([ejeX,ejeY]);
                  }



            const result = regression.linear(cantidad);
            console.log(cantidad);
            console.log(result);
            const gradient = result.equation[0];
            const yIntercept = result.equation[1];
            cantidadNivel = [gradient,yIntercept];
            this.chartOptions1.series = [];

            this.ecuacion = 1;
            this.chartOptions2.series = [{
              name: "Curva tendencia  ",
              type: "line",
              data:cantidadNivel
            },
          ];
            this.chartOptions2.chart.events['dataPointSelection'] = this.dataPointSelection;



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

            var cantidad = [];
            var cantidadNivel = [];
                  for (let  i = 0; i <  this.listParametro_eje.length; i++) {
                   var  ejeX =  this.listParametro_eje[i]['caudal'];
                   var  ejeY =    this.listParametro_eje[i]['nivel'];
                   cantidad.push([ejeX,ejeY]);
                  }



            const result = regression.linear(cantidad);
            console.log(cantidad);
            console.log(result);
            const gradient = result.equation[0];
            const yIntercept = result.equation[1];
            cantidadNivel = [gradient,yIntercept];

            this.ecuacion = 1;
            this.chartOptions2.series = [{
              name: "Curva tendencia  ",
              type: "line",
              data:cantidadNivel
            },
          ];
            this.chartOptions1.chart.events['dataPointSelection'] = this.dataPointSelection;



          }
        });


        break;
      }
      default: {
        console.log('default');
        //statements;
        break;
      }
    }
  }

  obtenerElementos11(even: any) {

   
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
   
  }

  cambioDepartamento(departamentoSelected: any) {
 
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
      console.log('datos filyttados', this.datosFilter);
    } else {
      this.datosFilter = this.datosOriginal;
    }
  }
  seleccionMapa(e: any) {
    // TO-DO
    console.log('seleccion respuesta', e);
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


    resetfiltro(){

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


    buscar(){


      this.serviciosParametrosService
      .obtener()
      .subscribe((response) => {
        this.listParametro_eje = response;



						     var cantidad = [];
                 var cantidad1 = [];


								for (let  i = 0; i <  this.listParametro_eje.length; i++) {
								 var  ejeY =  this.listParametro_eje[i]['nivel'];

                 var  ejeX =    this.listParametro_eje[i]['caudal'];
                 cantidad.push(ejeX,ejeY);


								}


                console.log(cantidad);
                this.chartOptions.series = [{
                    name: "Nivel ",
                    type: "scatter",
                    data: cantidad
                  },{
                    name: "Curva tendencia  ",
                    type: "line",
                    data: cantidad
                  } ];


                  this.chartOptions.chart.events['dataPointSelection'] = this.dataPointSelection;





      });



    }

    obtneridAfotoCalculo() {

      try {
        this.servicioAforo
          .obtenerAforoCalculo(this.id)
          .subscribe((response) => {
            console.log('llegando consulta', response);
            this.listaCalculo = response[0];
           

          });
          this.servicioAforo.obtenerAforo(this.id).subscribe((aforos:any)=>{
            var AforoLocal: IAforoView={
              idAforo:this.id,
              idTipoAforo:aforos[0].idTipoAforo,
              idTipoElemento:aforos[0].idTipoElemento,
              idElemento:aforos[0].idElemento,
              codigoEAAB:aforos[0].codigoEAAB,
              codigoIDEAM:aforos[0].codigoIDEAM,
              nombreCorriente:aforos[0].nombreCorriente,
             // nombreAforo:aforos[0].nombreAforo == undefined? '': aforos[0].nombreAforo,
              fecha: aforos[0].fecha,
              horaInicial:aforos[0].horaInicial,
              horaFinal:aforos[0].horaFinal,
              nivelInicial:aforos[0].nivelInicial,
              nivelFinal:aforos[0].nivelFinal,
              idMetodoMedicion:aforos[0].idMetodoMedicion,
              idAforoAforador:aforos[0].idAforoAforador,
             // observacion:aforos[0].observacion,
              observaciones:aforos[0].observaciones==undefined ? '': aforos[0].observaciones,
             // adjunto:aforos[0].adjunto,
              //flagMigracion:aforos[0].flagMigracion,
              //numeroAforo:aforos[0].numeroAforo,
              //anio:aforos[0].anio,
              //activo:aforos[0].activo,
              //caudalTotal:aforos[0].caudalTotal,
              //areaTotal:aforos[0].areaTotal,
              idMecanismo:aforos[0].idMecanismo,
              //idAforo:aforos[0].idAforo,
              aforador:aforos[0].nombre,
              coeficionte: '',
              constanteEquipo:'',
              ecuacion: '',
              este: '',
              idEquipo: '',
              idHelice: aforos[0].idHelice,
              idMetodoM: '',
              latitud: aforos[0].latitud,
              longitud:aforos[0].longitud,
              norte: '',
              norteMayor: '',
              norteMenor: '',
              idTipoCoordenadas:aforos[0].idTipoCoordenadas,
              idespejo: aforos[0].espejoAgua =='Orilla Derecha'? 483 : 484,
              idMolinete: aforos[0].idMolinete,
              nombreElemento:aforos[0].nombreElemento,
              //numeroRevolucionesMax: aforos[0].numeroRevolucionesMax,
              //numeroRevolucionesMin: aforos[0].numeroRevolucionesMin,
    
            } 
          this.idmolinete = aforos[0].idMolinete;
    
     
        var max = 0;
        var listaSeciones:any = [];
        var array1:any = [];
        var array2:any = [];
        this.servicioAforo.obtenerAforoDato(this.id).subscribe(datos=>{
        
          var b;
          var abscisa ;
          for (let index = 0; index < datos.length; index++) {
           
             b =  datos[index].profundidadTotal;
             abscisa =  datos[index].abscisa;
             
            array2.push(abscisa);
            listaSeciones.push(b);
            array1.push(datos[index].profundidadTotal);
       
            
          }
       
           
            

        
          
        

     

        var var1 = 0;
        var var2 = 0;
        var resta  = 0
        var restul  = 0
        var h:any = [];
        var array3 :any = [];
        var arrayfin :any = [];
        var array4 :any = [];
        let index = 0
        for (index = 0; index < listaSeciones.length; index++) {

          var1 =   Math.pow(listaSeciones[index],2); 
          var2 =  Math.pow(listaSeciones[index+1],2); 

         resta = var1 - var2;
         restul =  Math.sqrt(resta)
         array3 =  Math.hypot( listaSeciones[index], listaSeciones[index+1]);  
          array4.push(array3);

        }
       

        array4.splice(array4.length - 1);


        console.log(1,array4);
        
        restul = array4.reduce((a:any, b:any) => a + b, 0);

        var r =   Math.sqrt(restul)

        var r1 =   Math.trunc(restul)
        var r2 =  Math.abs(restul)
        console.log(4,  Math.abs(restul));
       
        var numb = r2.toPrecision(3);
        var rest =  Math.abs(restul);
        var rest1 = Math.sqrt(rest)
        var numrest1 = new Number(rest1);
       var ñ =  numrest1.toPrecision(3)
       var n   = parseFloat(ñ)
        console.log( 2,n);   
   
        this.perimetroMojado =  n

        var radio = this.listaCalculo.area/ this.perimetroMojado
        var nradio= new Number(radio);
        this.radio = nradio.toPrecision(3);

        var  ancho =  array2.reduce((a:any, b:any) => a + b, 0)  ;
        var an =  ancho/array2.length;
        this.ancho =  Math.max.apply(null, array2)

            this.aforoLocal    =   AforoLocal;
            this.h =( this.aforoLocal.nivelInicial + this.aforoLocal.nivelFinal)/2;

            var velocidadMedia  = this.listaCalculo.caudal / this.listaCalculo.area;
             var nvelocidadMedia = new Number(velocidadMedia);
            this.velocidadMedia =     nvelocidadMedia.toPrecision(3)
            this.caudal = this.listaCalculo.caudal.toPrecision(3);
            
                    var cantidad =[];
                    var cantidadLinea =[];
                      var  ejeY =  this.listaCalculo.caudal
                      var  ejeX =    this.h;
                      cantidad.push({
                        x: ejeX,
                        y: ejeY
                    });

                    cantidadLinea.push({
                      x: 0,
                      y: 0
                      },{
                        x: ejeX,
                        y: ejeY
                    });
                 

                  this.chartOptions.series = [{
                      name: "Nivel(h) ",
                      type: "scatter",
                      data: cantidad
                    }
                  
                  ];

                    this.chartOptions1.series = [{
                      name: "Curva de tendencia",
                      type: "line",
                      data: cantidadLinea
                    }];


                  });

                    this.servicioAforo
                    .obtenerAforoidHelice(this.id)
                    .subscribe((response) => {
                      console.log('llegando consulta', response);
                      this.listahelice = response[0];
                      this.serviciosMolineteService
                  .obtenerPorId(this.listahelice.idMolinete )
                  .subscribe((response) => {
            
                    this.monilete = response
                    console.log( this.monilete);
            
                    this.marca =  this.monilete.marca;
                    this.serie =   this.monilete.serie;
                  });
                 
                    });
                    
        })
        
        

      } catch (error) {
        console.error(error);
      }
    }
    buscarinfoEcuación() {

      try {
        this.servicioAforo
          .obtenerEcuacionCurvaId(this.tempIdCurva)
          .subscribe((response) => {
            if(response){
              console.log('llegando consulta', response);
              this.listaInfoEcuador = response;
              console.log(this.listaInfoEcuador);


            }else{

              
            }
      
          });
      } catch (error) {
        console.error(error);
      }
    }

    cambairidCurva() {

      try {
        this.servicioAforo
          .obtenerCurvaId("89")
          .subscribe((response) => {
            console.log('llegando consulta', response);
            this.listParametro_eje = response;
            var dataset = [];
            var cantidad = [];
            var x = [];
            var y = [];
            var cantidadNivel = [];
                 for (let  i = 0; i <  this.listParametro_eje.length; i++) {
                      var  ejeY =  this.listParametro_eje[i]['caudal'];
                      var  ejeX =    this.listParametro_eje[i]['nivel'];
                      cantidad.push({
                        x: ejeX,
                        y: ejeY
                    });
                     dataset.push({
                      actual: ejeX,
                      predicted: ejeY
                  });
                    x.push(ejeX);
                    y.push(ejeY);
                  }

                   this.rmse =  RMSE.rmse(dataset)
                   var listaR = this.linearRegression2(x,y);
                   var listaRegresion = listaR['y_hat'];
                  var listaRe = [];
 
 
                   for (let  i = 0; i < listaRegresion.length; i++) {
 
                     listaRe.push({
                       x: x[i],
                       y: listaRegresion[i]
                   });
 
                   }
                   console.log(this.rmse);
     
                  var accumulator;
                  var v1;
                  var v2;
                  var i;
                  
                  // Initialize an accumulator:
               
                  // For each simulated datum, update the mean absolute error...
                  for ( i = 0; i < cantidad.length; i++ ) {
                      v1 = cantidad[i].x;
                      v2 = cantidad[i].y
                  }
                  
                  this.chartOptions.series = [{
                      name: "Nivel ",
                      type: "scatter",
                      data: cantidad
                    },{
                      name: "Curva tendencia  ",
                      type: "line",
                      data: listaRe
                    },];

                    
                   var lista =  this.linearRegression(x,y);
                   this.r2 = lista.r2;
                   console.log(this.r2);

                   this.chartOptions1.series = [{
                    name: "Curva de tendencia",
                    type: "line",
                    data: listaRe
                  }];
            
                  this.chartOptions.chart.events['dataPointSelection'] = this.dataPointSelection;
                  this.mspe =lista.offset;
                  this.bias=lista.gain;


          });
      } catch (error) {
        console.error(error);
      }
    }
    
    rSquared(x:any, y:any, coefficients:any) {

      let regressionSquaredError = 0
      let totalSquaredError = 0
    
      function yPrediction(x:any, coefficients:any) {
        return coefficients[0] + coefficients[1] * x
      }
    
      let yMean = y.reduce((a:any, b:any) => a + b) / y.length
    
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
          var cars = listaFinal.filter(function(car:any) {
            return car.id_informacion_grafica !== e.registro.id_informacion_grafica; 
          });
          this.listParametro_eje = [];
          this.listParametro_eje = cars;
          console.log(this.listParametro_eje);
        }
      
        
      }
    }
    linearRegression(x:any, y:any)
    {
        var xs = 0;  // sum(x)
        var ys = 0;  // sum(y)
        var xxs = 0; // sum(x*x)
        var xys = 0; // sum(x*y)
        var yys = 0; // sum(y*y)
    
        var n = 0;
        for (; n < x.length && n < y.length; n++)
        {
          
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
     linearRegression2(x_values:any, y_values:any){
        
      //Create the regressor object to store the equation's data
      var regressor:any = {};
      
      //Set variables we'll need to get the slope and intercept; we need to find the equation in the format y = m*x+b where m is the slope and b is the intercept
      var x_mean = x_values.reduce((a:any, b:any) => a + b, 0)/x_values.length;
      var y_mean = y_values.reduce((a:any, b:any) => a + b, 0)/y_values.length;
      
      //Equations to solve for slope: 
      var slope = 0, slope_numerator = 0, slope_denominator = 0;
      for(i=0; i<x_values.length; i++){
        slope_numerator += (x_values[i]-x_mean)*(y_values[i]-y_mean);
        slope_denominator += Math.pow((x_values[i]-x_mean),2)
      }
      
      slope = slope_numerator/slope_denominator;
      console.log(slope);
      regressor['slope'] = slope;
      
      //Equation to solve for intercept
      var intercept = y_mean - x_mean*slope;
      regressor['intercept'] = intercept;
    
      
      //Get y_hat, or predicted values of y based on x_values
      //Loop through x_values, and run the elements through the lr equation to get predictions
      var y_hat = [];
      var i;
      for(i=0; i<x_values.length; i++){
        console.log(x_values[i])
        y_hat.push(x_values[i]*regressor['slope']+regressor['intercept']);
      }
      regressor['y_hat'] = y_hat;
      
      
      //Now to find the r2 score
      var residual_sum_of_squares = 0, total_sum_of_squares = 0, r2 = 0;
      
      for(i=0; i<y_values.length; i++){
          residual_sum_of_squares+= Math.pow((y_hat[i]-y_values[i]),2);
          total_sum_of_squares += Math.pow((y_hat[i]-y_mean),2);
      }
      
      r2 = 1- residual_sum_of_squares/total_sum_of_squares;
      
      //Add to regressor object
      regressor['r2'] = r2;
      console.log(r2);
            
      return regressor;
            
    }
    
    buscarInformacion(arg:any) {

    this.tempIdCurva  =  arg.target.value;
     console.log(this.tempIdCurva);
      Swal.fire({
        title: 'Desea cambiar la curva de tendencia?',
        text: 'Se cambiaran todos los valores ',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#dcambairidCurva',
        confirmButtonText: 'Si, Cambiar',
      }).then((result) => {
        if (result.isConfirmed) {

          this.cambairidCurva();
          this.buscarinfoEcuación();


        }
      });
    }

    dataPointSelection1(event: any, chartContext:any, config:any) {

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
        if(result.isConfirmed) {
          let divsucursal:any=document.getElementById(`btn`);
          divsucursal.click();
          Swal.fire(`
          caudal: ${result.value?.caudal}
          nivel: ${result.value?.nivel}
        `.trim());
        }

      });


     };
      infoAforo(){
        var x = this.chartOptions.series[0].data[var1].x;
        var y = this.chartOptions.series[0].data[var1].y;
        var fecha = this.listParametro_eje[0]["fecha_creacion"];
      
        var alumnosCurso = '<table id="alumnosCurso" class="table table-striped nowrap" width="100%"><thead><tr><th>Nivel</th><th>Caudal</th><th>Fecha de aforo</th></tr> </thead><tbody><tr><td>'+x+'</td><td>'+y+'</td><td>'+fecha+'</td> </tr></tbody></table>';
      
        Swal.fire({
          title: 'Información de aforo',
          html:alumnosCurso,
          focusConfirm: false,
          allowOutsideClick: false
      });

      }
    cambioCurva() {
      

        this.tempIdCurva = this.curvaSelected;
        this.cargarCurvaporId();

    }
    onRightClick4(chart: HTMLElement, chartId: string, event?: Event) {
      console.log(event)
      console.log(chart)
      console.log(chartId)
    }
    imprimirGrafica() {
  
      var chart = new ApexCharts(document.querySelector("#chartf"), this.chartOptions);
        var dataURL = chart.dataURI().then();
        console.log(dataURL);
      
    }
    onRightClick(event:any) {
      console.log("right clicked on me " + event.currentTarget.attributes);
      return false;
  }
     linear_regression( xyr:any )
    {
        var i, 
            x, y, r,
            sumx=0, sumy=0, sumx2=0, sumy2=0, sumxy=0, sumr=0,
            a, b;
    
        for(i=0;i<xyr.length;i++)
        {   
            // this is our data pair
            x = xyr[i][0]; y = xyr[i][1]; 
    
            // this is the weight for that pair
            // set to 1 (and simplify code accordingly, ie, sumr becomes xy.length) if weighting is not needed
            r = xyr[i][2];  
    
            // consider checking for NaN in the x, y and r variables here 
            // (add a continue statement in that case)
    
            sumr += r;
            sumx += r*x;
            sumx2 += r*(x*x);
            sumy += r*y;
            sumy2 += r*(y*y);
            sumxy += r*(x*y);
        }
    
        // note: the denominator is the variance of the random variable X
        // the only case when it is 0 is the degenerate case X==constant
        b = (sumy*sumx2 - sumx*sumxy)/(sumr*sumx2-sumx*sumx);
        a = (sumr*sumxy - sumx*sumy)/(sumr*sumx2-sumx*sumx);
    
        return [a, b];
    }

    validadoAforo(){
      
      if(this.observacion){



      Swal.fire({
        title: 'Desea validar los datos del calculo del aforo No. ' +this.id+ '  ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Validar',
      }).then((result) => {
        if (result.isConfirmed) {


          this.servicioAforo
          .actualizarEstadoObservacion(this.observacion,861,this.id,this.listaCalculo.caudal,this.h)
          .subscribe((response) => {
            Swal.fire({
              title: '¡El aforo No. ' +this.id+ ' ha sido Validado  satisfactoriamente!',
              icon: 'info',
              showCancelButton: false,
            }).then((result) => {
              if (result.isConfirmed) {
  

              
              }
            });  
            
          });

         


        }
      });
    
    }else{

      this.toast.fire({
        icon: 'error',
        title: 'Debes ingresar las observación !! ',
      });
    }
    }
    rechazadoAforo(){
      if(this.observacion){

   

        Swal.fire({
          title: 'Desea Rechazar los datos del calculo del aforo No. ' +this.id+ '  ?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Rechazar',
        }).then((result) => {
          if (result.isConfirmed) {
  
            this.servicioAforo
            .actualizarEstadoObservacion(this.observacion,862,this.id,this.listaCalculo.caudal,this.h)
            .subscribe((response) => {
              Swal.fire({
                title: '¡El aforo No. ' +this.id+ ' ha sido Rechazado  satisfactoriamente!',
                icon: 'info',
                showCancelButton: false,
              }).then((result) => {
                if (result.isConfirmed) {
    
  
                
                }
              });  
              
            });
           
  
           
  
  
          }
        });
      
      }else{
  
        this.toast.fire({
          icon: 'error',
          title: 'Debes ingresar las observación !! ',
        });
      }
      }
    eliminarRegresar(){
      this.router.navigateByUrl('/configuracion/gestion');
      
    }
  
    regresar(){
      this.router.navigateByUrl('/configuracion/calcularRegresecion');
      

    }

    verdetalleAforo(){
      this.router.navigateByUrl('/configuracion/gestionAforo/V/'+this.id);
      
    }
    regresarCurva(){
      window.history.go(-1);
      window.history.back();
      
    }

}
