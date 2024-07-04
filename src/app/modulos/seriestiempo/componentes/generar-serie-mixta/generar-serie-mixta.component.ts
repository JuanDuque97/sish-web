import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
import { FormGroup, FormBuilder,Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LegendPosition } from '@swimlane/ngx-charts';
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
import { ServiciosParametrosEstacionesService } from '../../../elementos/estaciones/servicios-parametros-estaciones.service';

import { ServiciosCapasService } from '../../../configuracion/capas/servicios-capas.service';
import { ServiciosDominiosValoresService } from '../../../configuracion/dominios/servicios-dominios-valores.service';
import { DataTableDirective } from 'angular-datatables';
import { Observable } from 'rxjs';
import * as d3 from 'd3';
import * as d31 from 'd3';
import * as d32 from 'd3';
import * as d33 from 'd3';
import * as d34 from 'd3';
import * as d35 from 'd3';
import * as D3 from 'd3';
import * as math from 'mathjs'
const correlation = require('matrix_columns_correlation');
 
let arrays = [[5,2,1,4,1,6,2], [1,5,3,5,5,6,1], [6,2,7,7,5,6,7], [1,2,3,4,6,6,7]]
//console.log(clusters)

interface ResponseData {
  value: number;
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}
var Statistics = require('statistics.js');

import * as Highcharts from 'highcharts';
import Exporting from 'highcharts/modules/exporting';
import { Console } from 'console';
import { IfStmt } from '@angular/compiler';
const heatmap = require('highcharts/modules/heatmap.js');

import * as Highcharts0 from 'highcharts';
import * as Highcharts1 from 'highcharts';
import * as Highcharts2 from 'highcharts';
import * as Highcharts3 from 'highcharts';


const SpearmanRHO = require('spearman-rho');
 
const x = [4];
const y = [6.9];
 
const spearmanRHO = new SpearmanRHO(x, y);
spearmanRHO.calc()
  .then((value:any) => console.log(555,value))
  .catch((err:any) => console.error(err));

 var calculateCorrelation = (matrix:any) => {
    const correlations = [];
    for(let numColumn = 0; numColumn < matrix[0].length; numColumn ++) {
        const rowCorrelations = [];
        for(let numColumn2 = 0; numColumn2 < matrix[0].length; numColumn2 ++) {
            const array1 = [];
            const array2 = [];
            for(let index in matrix) {
                array1.push(matrix[index][numColumn]);
                array2.push(matrix[index][numColumn2]);
            }
            const correlationValue = spearmanRHO.calc(array1, array2);
            rowCorrelations.push(correlationValue);
        }
        correlations.push(rowCorrelations);
    }

    return correlations;
};
let matrix = [[5,2,1,4,1,6,2], [1,5,3,5,5,6,1]]
var respuesta = calculateCorrelation(matrix);
//console.log(55,respuesta);

heatmap(Highcharts);
Exporting(Highcharts);

heatmap(Highcharts0);
Exporting(Highcharts0);

heatmap(Highcharts1);
Exporting(Highcharts1);

heatmap(Highcharts2);
Exporting(Highcharts2);

heatmap(Highcharts3);
Exporting(Highcharts3);

@Component({
  selector: 'app-generar-serie-mixta',
  templateUrl: './generar-serie-mixta.component.html'
})

export class GenerarSerieMixtaComponent implements OnInit {

  private data:Array<number>;  // raw chart data
  private htmlElement:HTMLElement;
  isHighcharts = typeof Highcharts === 'object';
  Highcharts: typeof Highcharts = Highcharts;

  isHighcharts0 = typeof Highcharts0 === 'object';
  Highcharts0: typeof Highcharts0 = Highcharts0;

  isHighcharts1 = typeof Highcharts1 === 'object';
  Highcharts1: typeof Highcharts1 = Highcharts1;

  isHighcharts2 = typeof Highcharts2 === 'object';
  Highcharts2: typeof Highcharts2 = Highcharts2;

  isHighcharts3 = typeof Highcharts3 === 'object';
  Highcharts3: typeof Highcharts3 = Highcharts3;


  chartOptions: Highcharts.Options = {};
  chartOptions00: Highcharts.Options = {};


  chartOptions0: Highcharts.Options = {};
  chartOptions1: Highcharts.Options = {};
  chartOptions2: Highcharts.Options = {};
  chartOptions3: Highcharts.Options = {};
   
  parametro : string = '0';

  updateFlag: boolean = true;

  public formularioFiltros!: FormGroup;

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
  public Mecanismo:string;
  public listaMunicipios = [];
  public listaDepartamentos = [];
  public departamentoSelected: any;
  private tempIdDepartamento: number = 0;
  datosOriginal = [] as any;
  public listZonaEAAB = [];
  public vergrafica = false ;
  
  public listTipoPozo = [];
  public metodo:number = 0;
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
  private svg:any;
  private treeLayout:any;
  private root:any;

  public listaEntidad = [];
  public listParametro: any[] = [];
  public listParametroAgregar: any[] = [];
  public listParametroOrgin: any[] = [];
  public listaFrecuencia: any[] = [];
  public listaSubcuenca = [];
  public valores: any =[];
  public valoresCorrelacion: any =[];

  public listaBusqueda: any[] = [];
  public elemento: number = 0;
  public periodo: number = 0;
  public idfrecuencia: number = 0;
  public idfrecuenciaAgregar: number = 0;
  public parametroAgregar: number;
  public listaCodigoEAAB: any[] = [];
  public listaCodigoIDEAM: any[] = [];
  public listaCodigoEAABAgregar : any[] = [];
  public listaCodigoIDEAMAgregar : any[] = [];
  public abscisa:number;
  public profundidadTotal :number;
  public VMV:number;
  public velocidadMedia:number;
  public area:number;
  public caudalparcial:number;
  public listaPerido:any=[];
  public listaCorrelacion:any=[];
  public listaItemsElementos:any=[];
  public listaElementoCate:any=[];
  public listaCorrelacionAdd:any=[]; 
  public valor:any=[]; 
  content = "$x = {-b \\pm \\sqrt{b^2-4ac} \\over 2a}$";
  rutaGeneral = 'configuracion/gestionAforo/C/0';
  rutaEdicion = 'configuracion/gestionAforo/E/';
  rutaConsulta = 'configuracion/gestionAforo/V/';

  datosFilterEstaciones = [] as any;
  datosFilterEmbalses = [] as any;
  datosFilterPozos = [] as any;
  datosFilter = [] as any;
  datosFilterElementos = [] as any;
  datosSerieAnio = [] as any;
  datosSerieMes = [] as any;
  listParametroXElemento = [] as any;
  listaElementos : any[] = [];
  listaTipoAforo = [] as any;
  listaElemento: any[] = [];
  listAforos = [] as any;
  listaElementoAgregar: any[] = [];
  public idTipoElemento: any;
  public idElemento: string = '0';
  public idElementoAgregar :number = 0;
  public grafica0=false;
  public grafica1=false;
  public grafica2=false;
  public grafica3=false;
  public grafica4=false;
  public grafica5=false;
  columnas = [
    
    {
      title: 'ID',
      data: 'id',
      visible: true, 
      filterValueMin: '',
      filterValueMax: '',
      tipo: 'rangoNumero',
    },
    {
      title: 'Parametro',
      data: 'parametro',
      class: 'text-center',
      visible: true,
    },
    {
      title: 'Frecuencia',
      data: 'frecuencia',
      class: 'text-center',
      visible: true,
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
  columnasElementos = [
    {
      title: 'id',
      data: 'id',
      visible: true,
      tipo: 'rangoNumero',
    },
    {
      title: 'Codigo IDEAM',
      data: 'codigoIDEAM',
      visible: true,
      class: 'text-center',
      tipo: 'texto',
    },
    {
      title: 'Codigo EAAB ',
      data: 'codigoEAAB',
      visible: true,
      class: 'text-center',
      tipo: 'texto',
    }
    ,
    {
      title: 'Nombre Elemento',
      data: 'nombreElemento',
      visible: true,
      class: 'text-center',
      tipo: 'texto',
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
    private sercioparametrosestacion: ServiciosParametrosEstacionesService,
    private serviciosObservacionesEstacionService: ServiciosObservacionesEstacionService,
    private serviciosObservacionesPozosService: ServiciosObservacionesPozosService,
    private serviciosObservacionesEmbalsesService: ServiciosObservacionesEmbalsesService,
    private serviciosSerieTiempoService: ServiciosSerieTiempoService,
    private elementRef:ElementRef) { }


  
  
  ngOnInit(): void {

    var bodyMeasurements = [
      { weight: 63, height: 1.65 },
      { weight: 64, height: 1.67 },
      { weight: 74, height: 1.80 },
      { weight: 79, height: 1.82 },
      { weight: 82, height: 1.86 },
      { weight: 66, height: 1.70 },
      { weight: 91, height: 1.83 },
      { weight: 72, height: 1.76 },
      { weight: 85, height: 1.89 },
      { weight: 68, height: 1.68 }
    ];
    
    var bodyVars = {
      weight: 'metric',
      height: 'metric'
    };
    
    var stats = new Statistics(bodyMeasurements, bodyVars);
    var r = stats.correlationCoefficient('weight', 'height');
    
    
    var transform = stats.fisherTransformation(0.3);
    console.log(transform);
    
    
    var margin = {top: 10, right: 30, bottom: 30, left: 40},
      width = 730 - margin.left - margin.right,
      height = 730 - margin.top - margin.bottom;
    

    var svg2 = d3.select("#serie")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
         
            d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/iris.csv")
      .then( (dat)=>this.crargrafia(svg2,dat)  );
    
        // Y label
     
        svg2.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-size", "20px")
        .text("Estación Origen");
        


        svg2.append("text")
        .attr("x", 132)
        .attr("y", 10)
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .text("Diagrama de disperción "   );

    this.chartOptions = 
    {   
       chart : {
         type: 'heatmap',
         marginTop: 40,
         marginBottom: 80
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
      title : {
         text: 'Correlación matrix parámetro estación'   
      },
      xAxis : {
        type: 'category',
         categories: ['Alexander', 'Marie', 'Maximilian', 'Sophia', 'Lukas'],
            title: {
              text: 'Estaciones'
            },
      },
      yAxis : {
        type: 'category',
         categories: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        title: {
          text: 'Parametro'
        },
        labels: {
          format:'{value} '
        },
        
       reversed: false
       
      },
      accessibility: {
        point: {
          
        }
    },
     colorAxis: {
    
      stops: [
        [0, '#FF0000'],
        [0.25, '#FFFFFF'],
        [0, '#FFFFFF'],
        [0.75, '#FFFFFF'],
        [1, '#00bfff']
      ],
      min: -1,
      max: 1
  },
      legend: {
        align: 'right',
        layout: 'vertical',
        margin: 0,
        verticalAlign: 'top',
        y: 25,
        symbolHeight: 280
    },

    tooltip: {
      
    }, responsive: {
      rules: [{
          condition: {
              maxWidth: 500
          },
          chartOptions: {
              yAxis: {
                  labels: {
                     
                  }
              }
          }
      }]
  },
    series: [{
      
      type: 'heatmap',
      name: 'Valores de estaciones',
      borderWidth: 1,
        data: [ [0, -1, -1], [0, 1, 0], [0, 2, 0], [0, 3, 0], [0, 4, 1],
       [1, 0, 1], [1, 1, 1], [1, 2, 1], [1, 3, 1], [1, 4, 1], 
       [2, 0, 1], [2, 1, 1], [2, 2, 1], [2, 3, 1], [2, 4, -1],
        [3, 0, 1], [3, 1, 1], [3, 2, 1], [3, 3, 1], [3, 4, 1], 
        [4, 0, 1], [4, 1, 1], [4, 2, 1], [4, 3, 1], [4, 4, 1]
     ],
      dataLabels: {
          enabled: true,
          color: '#000000'
      },

      events: {
        legendItemClick: function() {
            if (this.visible) {
                this.yAxis.update({
                    breaks: [{
                        from: 1.5,
                        to: 2.5,
                        breakSize: 0
                    }]
                }, false);
            } else {
                this.yAxis.update({
                    breaks: []
                }, false);
            }
        }
    }
  }]
    }

    
 

    this.chartOptions00 = 
    {   
       chart : {
         type: 'heatmap',
         marginTop: 40,
         marginBottom: 80
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
      title : {
         text: 'Correlación matrix parámetro estación'   
      },
      xAxis : {
        type: 'category',
         categories: ['Alexander', 'Marie', 'Maximilian', 'Sophia', 'Lukas'],
            title: {
              text: 'Estaciones'
            },
      },
      yAxis : {
        type: 'category',
         categories: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        title: {
          text: 'Parametro'
        },
        labels: {
          format:'{value} '
        },
        
       reversed: false
       
      },
      accessibility: {
        point: {
          
        }
    },
      colorAxis: {
    
      stops: [
        [0, '#FF0000'],
        [0.25, '#FFFFFF'],
        [0, '#FFFFFF'],
        [0.75, '#FFFFFF'],
        [1, '#00bfff']
      ],
      min: -1,
      max: 1
  },
      legend: {
        align: 'right',
        layout: 'vertical',
        margin: 0,
        verticalAlign: 'top',
        y: 25,
        symbolHeight: 280
    },

    tooltip: {
      
    }, responsive: {
      rules: [{
          condition: {
              maxWidth: 500
          },
          chartOptions: {
              yAxis: {
                  labels: {
                     
                  }
              }
          }
      }]
  },
    series: [{
      
      type: 'heatmap',
      name: 'Valores de estaciones',
      borderWidth: 1,
        data: [ [0, 1, 0], [0, 1, 19], [0, 2, 0], [0, 3, 0], [0, 4, 67],
       [1, 1, 92], [1, 1, 0], [1, -2, 78], [1, -3, 117], [1, -4, 48], 
       [2, -0, 35], [2, -1, 15], [2, -2, 123], [2, -3, 64], [2, -4, 52],
        [3, -0, 72], [3, -1, 132], [3, -2, 114], [3, -3, 19], [3, -4, 16], 
        [4, 0, 38], [4, 1, 5], [4, 2, 8], [4, 3, 117], [4, 4, 115], [5, 0, 88], 
        [5, 1, 32], [5, 2, 12], [5, 3, 6], [5, 4, 120], [6, 0, 13], [6, 1, 44]
     ],
      dataLabels: {
          enabled: true,
          color: '#000000'
      },

      events: {
        legendItemClick: function() {
            if (this.visible) {
                this.yAxis.update({
                    breaks: [{
                        from: 1.5,
                        to: 2.5,
                        breakSize: 0
                    }]
                }, false);
            } else {
                this.yAxis.update({
                    breaks: []
                }, false);
            }
        }
    }
  }]
    }
    
    this.chartOptions0 = 
    {   
       chart : {
         type: 'heatmap',
         marginTop: 40,
         marginBottom: 80
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
      title : {
         text: 'Correlación matrix parámetro estación'   
      },
      xAxis : {
        type: 'category',
         categories: ['Alexander', 'Marie', 'Maximilian', 'Sophia', 'Lukas'],
            title: {
              text: 'Estaciones'
            },
      },
      yAxis : {
        type: 'category',
         categories: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        title: {
          text: 'Parametro'
        },
        labels: {
          format:'{value} '
        },
        
       reversed: false
       
      },
      accessibility: {
        point: {
          
        }
    },
      colorAxis: {
    
      stops: [
        [0, '#FF0000'],
        [0.25, '#FFFFFF'],
        [0, '#FFFFFF'],
        [0.75, '#FFFFFF'],
        [1, '#00bfff']
      ],
      min: -1,
      max: 1
  },
      legend: {
        align: 'right',
        layout: 'vertical',
        margin: 0,
        verticalAlign: 'top',
        y: 25,
        symbolHeight: 280
    },

    tooltip: {
      
    }, responsive: {
      rules: [{
          condition: {
              maxWidth: 500
          },
          chartOptions: {
              yAxis: {
                  labels: {
                     
                  }
              }
          }
      }]
  },
    series: [{
      
      type: 'heatmap',
      name: 'Valores de estaciones',
      borderWidth: 1,
        data: [ [0, 1, 0], [0, 1, 19], [0, 2, 0], [0, 3, 0], [0, 4, 67],
       [1, 1, 92], [1, 1, 0], [1, -2, 78], [1, -3, 117], [1, -4, 48], 
       [2, -0, 35], [2, -1, 15], [2, -2, 123], [2, -3, 64], [2, -4, 52],
        [3, -0, 72], [3, -1, 132], [3, -2, 114], [3, -3, 19], [3, -4, 16], 
        [4, 0, 38], [4, 1, 5], [4, 2, 8], [4, 3, 117], [4, 4, 115], [5, 0, 88], 
        [5, 1, 32], [5, 2, 12], [5, 3, 6], [5, 4, 120], [6, 0, 13], [6, 1, 44]
     ],
      dataLabels: {
          enabled: true,
          color: '#000000'
      },

      events: {
        legendItemClick: function() {
            if (this.visible) {
                this.yAxis.update({
                    breaks: [{
                        from: 1.5,
                        to: 2.5,
                        breakSize: 0
                    }]
                }, false);
            } else {
                this.yAxis.update({
                    breaks: []
                }, false);
            }
        }
    }
  }]
    }


    this.chartOptions1 = 
    {   
       chart : {
         type: 'heatmap',
         marginTop: 40,
         marginBottom: 80
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
      title : {
         text: 'Correlación matrix parámetro estación'   
      },
      xAxis : {
        type: 'category',
         categories: ['Alexander', 'Marie', 'Maximilian', 'Sophia', 'Lukas',
            'Maria', 'Leon', 'Anna', 'Tim', 'Laura'],
            title: {
              text: 'Estaciones'
            },
      },
      yAxis : {
        type: 'category',
         categories: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        title: {
          text: 'Parametro'
        },
        labels: {
          format:'{value} '
        },
        
       reversed: false
       
      },
      accessibility: {
        point: {
          
        }
    },
      colorAxis: {
    
      stops: [
        [0, '#FF0000'],
        [0.25, '#FFFFFF'],
        [0, '#FFFFFF'],
        [0.75, '#FFFFFF'],
        [1, '#00bfff']
      ],
      min: -1,
      max: 1
  },
      legend: {
        align: 'right',
        layout: 'vertical',
        margin: 0,
        verticalAlign: 'top',
        y: 25,
        symbolHeight: 280
    },

    tooltip: {
      
    }, responsive: {
      rules: [{
          condition: {
              maxWidth: 500
          },
          chartOptions: {
              yAxis: {
                  labels: {
                     
                  }
              }
          }
      }]
  },
    series: [{
      
      type: 'heatmap',
      name: 'Valores de estaciones',
      borderWidth: 1,
        data: [ [0, -1, -19], [0, -1, 19], [0, -2, 0], [0, -3, 0], [0, -4, 67],
       [1, -0, 92], [1, -1, 58], [1, -2, 78], [1, -3, 117], [1, -4, 48], 
       [2, -0, 35], [2, -1, 15], [2, -2, 123], [2, -3, 64], [2, -4, 52],
        [3, -0, 72], [3, -1, 132], [3, -2, 114], [3, -3, 19], [3, -4, 16], 
        [4, 0, 38], [4, 1, 5], [4, 2, 8], [4, 3, 117], [4, 4, 115], [5, 0, 88], 
        [5, 1, 32], [5, 2, 12], [5, 3, 6], [5, 4, 120], [6, 0, 13], [6, 1, 44]
     ],
      dataLabels: {
          enabled: true,
          color: '#000000'
      },

      events: {
        legendItemClick: function() {
            if (this.visible) {
                this.yAxis.update({
                    breaks: [{
                        from: 1.5,
                        to: 2.5,
                        breakSize: 0
                    }]
                }, false);
            } else {
                this.yAxis.update({
                    breaks: []
                }, false);
            }
        }
    }
  }]
    }

    this.chartOptions2 = 
    {   
       chart : {
         type: 'heatmap',
         marginTop: 40,
         marginBottom: 80
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
      title : {
         text: 'Correlación matrix parámetro estación'   
      },
      xAxis : {
        type: 'category',
         categories: ['Alexander', 'Marie', 'Maximilian', 'Sophia', 'Lukas',
            'Maria', 'Leon', 'Anna', 'Tim', 'Laura'],
            title: {
              text: 'Estaciones'
            },
      },
      yAxis : {
        type: 'category',
         categories: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        title: {
          text: 'Parametro'
        },
        labels: {
          format:'{value} '
        },
        
       reversed: false
       
      },
      accessibility: {
        point: {
          
        }
    },
      colorAxis: {
    
      stops: [
        [0, '#FF0000'],
        [0.25, '#FFFFFF'],
        [0, '#FFFFFF'],
        [0.75, '#FFFFFF'],
        [1, '#00bfff']
      ],
      min: -1,
      max: 1
  },
      legend: {
        align: 'right',
        layout: 'vertical',
        margin: 0,
        verticalAlign: 'top',
        y: 25,
        symbolHeight: 280
    },

    tooltip: {
      
    }, responsive: {
      rules: [{
          condition: {
              maxWidth: 500
          },
          chartOptions: {
              yAxis: {
                  labels: {
                     
                  }
              }
          }
      }]
  },
    series: [{
      
      type: 'heatmap',
      name: 'Valores de estaciones',
      borderWidth: 1,
        data: [ [0, -1, -19], [0, -1, 19], [0, -2, 0], [0, -3, 0], [0, -4, 67],
       [1, -0, 92], [1, -1, 58], [1, -2, 78], [1, -3, 117], [1, -4, 48], 
       [2, -0, 35], [2, -1, 15], [2, -2, 123], [2, -3, 64], [2, -4, 52],
        [3, -0, 72], [3, -1, 132], [3, -2, 114], [3, -3, 19], [3, -4, 16], 
        [4, 0, 38], [4, 1, 5], [4, 2, 8], [4, 3, 117], [4, 4, 115], [5, 0, 88], 
        [5, 1, 32], [5, 2, 12], [5, 3, 6], [5, 4, 120], [6, 0, 13], [6, 1, 44]
     ],
      dataLabels: {
          enabled: true,
          color: '#000000'
      },

      events: {
        legendItemClick: function() {
            if (this.visible) {
                this.yAxis.update({
                    breaks: [{
                        from: 1.5,
                        to: 2.5,
                        breakSize: 0
                    }]
                }, false);
            } else {
                this.yAxis.update({
                    breaks: []
                }, false);
            }
        }
    }
  }]
    }

    this.chartOptions3 = 
    {   
       chart : {
         type: 'heatmap',
         marginTop: 40,
         marginBottom: 80
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
      title : {
         text: 'Correlación matrix parámetro estación'   
      },
      xAxis : {
        type: 'category',
         categories: ['Alexander', 'Marie', 'Maximilian', 'Sophia', 'Lukas',
            'Maria', 'Leon', 'Anna', 'Tim', 'Laura'],
            title: {
              text: 'Estaciones'
            },
      },
      yAxis : {
        type: 'category',
         categories: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        title: {
          text: 'Parametro'
        },
        labels: {
          format:'{value} '
        },
        
       reversed: false
       
      },
      accessibility: {
        point: {
          
        }
    },
      colorAxis: {
    
      stops: [
        [0, '#FF0000'],
        [0.25, '#FFFFFF'],
        [0, '#FFFFFF'],
        [0.75, '#FFFFFF'],
        [1, '#00bfff']
      ],
      min: -1,
      max: 1
  },
      legend: {
        align: 'right',
        layout: 'vertical',
        margin: 0,
        verticalAlign: 'top',
        y: 25,
        symbolHeight: 280
    },

    tooltip: {
      
    }, responsive: {
      rules: [{
          condition: {
              maxWidth: 500
          },
          chartOptions: {
              yAxis: {
                  labels: {
                     
                  }
              }
          }
      }]
  },
    series: [{
      
      type: 'heatmap',
      name: 'Valores de estaciones',
      borderWidth: 1,
        data: [ [0, -1, -19], [0, -1, 19], [0, -2, 0], [0, -3, 0], [0, -4, 67],
       [1, -0, 92], [1, -1, 58], [1, -2, 78], [1, -3, 117], [1, -4, 48], 
       [2, -0, 35], [2, -1, 15], [2, -2, 123], [2, -3, 64], [2, -4, 52],
        [3, -0, 72], [3, -1, 132], [3, -2, 114], [3, -3, 19], [3, -4, 16], 
        [4, 0, 38], [4, 1, 5], [4, 2, 8], [4, 3, 117], [4, 4, 115], [5, 0, 88], 
        [5, 1, 32], [5, 2, 12], [5, 3, 6], [5, 4, 120], [6, 0, 13], [6, 1, 44]
     ],
      dataLabels: {
          enabled: true,
          color: '#000000'
      },

      events: {
        legendItemClick: function() {
            if (this.visible) {
                this.yAxis.update({
                    breaks: [{
                        from: 1.5,
                        to: 2.5,
                        breakSize: 0
                    }]
                }, false);
            } else {
                this.yAxis.update({
                    breaks: []
                }, false);
            }
        }
    }
  }]
    }

    
console.log(this.chartOptions);
    
    this.serviciosDominiosValoresService
      .obtenerValoresPorIdDominio(dominiosEnum.TipoElemento)
      .subscribe((response) => {
        this.listaElementos = response;
         console.log('llego frecuencia', this.listaFrecuencia);
      });






    this.serviciosDominiosValoresService
      .obtenerValoresPorIdDominio(dominiosEnum.TipoAforos)
      .subscribe((response) => {
        this.listaTipoAforo = response;
      });

    // Departamentos
    this.serviciosGeograficosService
      .obtenerDepartamentos()
      .subscribe((response) => {
        this.listaDepartamentos = response;
      });

      

    // entidad
    this.serviciosDominiosValoresService
      .obtenerValoresPorIdDominio(dominiosEnum.Entidad)
      .subscribe((response) => {
        this.listaEntidad = response;
      });

      // frecuencia
      this.serviciosDominiosValoresService
      .obtenerTotalValoresPorIdDominio(dominiosEnum.Periodos)
      .subscribe((response) =>{
        this.listaFrecuencia = response;
      })

    // -----------
    this.construirFormulario();
    //this.cargarAreaHidrografica();
    //this.onChanges();
  }


  plotGraph(dataInstance:any) {
  
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
  get fechaInicio1() {
    return this.formularioFiltros.get('fechaInicio1');
  }
  get fechaFin() {
    return this.formularioFiltros.get('fechaFin');
  }
  get fechaFin1() {
    return this.formularioFiltros.get('fechaFin1');
  }
  get idParametro() {
    return this.formularioFiltros.get('idParametro');
  }
  get idParametroAgregar() {
    return this.formularioFiltros.get('idParametroAgregar');
  }
  get idCodigoEAABAgregar() {
    return this.formularioFiltros.get('idCodigoEAABAgregar');
  }
  get idCodigoIDEAMAgregar() {
    return this.formularioFiltros.get('idCodigoIDEAMAgregar');
  }

  get idCodigoIDEAM() {
    return this.formularioFiltros.get('idCodigoIDEAM');
  }
  get idCodigoEAAB() {
    return this.formularioFiltros.get('idCodigoEAAB');
  }
  get metodoid() {
    return this.formularioFiltros.get('idCodigoEAAB');
  }
  get frecuencia() {
    return this.formularioFiltros.get('frecuencia');
  }
  
  get frecuenciaAgregar() {
    return this.formularioFiltros.get('frecuenciaAgregar');
  }
  get idElementoA() {
    return this.formularioFiltros.get('idElementoA');
  }
  private construirFormulario() {
    this.Mecanismo = '469';
    this.formularioFiltros = this.formBuilder.group({
      idTipoElemento: ['', [Validators.required]],
      idElemento: ['', [Validators.required]],
      idCodigoIDEAM:[''],
      idCodigoEAAB:[''],
      metodoid:['', [Validators.required]],
      idElementoA: ['', [Validators.required]],
      idCodigoIDEAMAgregar:[''],
      idCodigoEAABAgregar:[''],
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
      aforador: [''],
      idtipoAforo: [''],
      fechaInicio:['', [Validators.required]],
      fechaFin:['', [Validators.required]],
      idEntidad: [''],
      frecuencia:[''],
      idParametro:['', [Validators.required]],
      frecuenciaAgregar:[''],
      idParametroAgregar:['', [Validators.required]],
      fechaFin1:[''],
      fechaInicio1:[''],
    });
  }


 
  

agregarElementoOrigen(e:any){
  var seleccionTemporal:any;
  if(this.idElemento != '0' ){ 
    
    this.listaItemsElementos[0] = seleccionTemporal;
    seleccionTemporal ={
        id:this.formularioFiltros.get('idCodigoIDEAM')?.value,
        codigoIDEAM: this.listaCodigoIDEAMAgregar.filter(filtro=> filtro.id == this.formularioFiltros.get('idCodigoIDEAM')?.value)[0].text,
        codigoEAAB: this.listaCodigoEAABAgregar.filter(filtro=> filtro.id == this.formularioFiltros.get('idCodigoEAAB')?.value)[0].text,
        nombreElemento: this.listaElementoAgregar.filter(filtro=> filtro.id == this.formularioFiltros.get('idElemento')?.value)[0].text,
        idElemento:this.formularioFiltros.get('idElemento')?.value,
        idCodigoEAAB: this.formularioFiltros.get('idCodigoEAAB')?.value,
        idCodigoIDEAM:this.formularioFiltros.get('idCodigoIDEAM')?.value,
      }
      this.listaItemsElementos[0] = seleccionTemporal

  }

  

}



agregarCorrelacionOrigen(id :any){
  if(this.parametro != '0' ){ 
     console.log(id);

      var seleccionTemporal:any={
        id:1,
        parametro: this.listParametro.filter(filtro=> filtro.id ==  this.formularioFiltros.get('idParametro')?.value)[0].text,
        frecuencia: this.listaFrecuencia.filter(filtro=> filtro.id ==  this.formularioFiltros.get('frecuencia')?.value)[0].text,
        idParametro: this.formularioFiltros.get('idParametro')?.value,
        idFrecuencia: this.formularioFiltros.get('frecuencia')?.value,
      }

       var listParametroOrgin  =  this.listaCorrelacion.filter(((element:any) => element.idParametro == seleccionTemporal.idParametro)).map((elemento: any) => ({
        
        })); 

       if( this.listaCorrelacion[0] == seleccionTemporal   ){

        Swal.fire(
          'Serie Mixta',
          'El parámetro ya esta selecionado. ',
          'error'
        );

       }else{
        this.listaCorrelacion[0] = seleccionTemporal
   

        
       }
       this.datosFilter = this.listaCorrelacion;
 
} 
} 


  agregarCorrelacion(){

    var id_pa = this.listParametro.filter(filtro=> filtro.id == this.formularioFiltros.get('idParametroAgregar')?.value);


    if(id_pa.length == 0){

      Swal.fire(
        'Serie Mixta',
        'El parámetro debe esta relacionado con la estación origen ',
        'error'
      )

    }
    else{


      if(this.parametroAgregar != 0 ){ 
        if(this.listaCorrelacion.length < 6){
          const obsCorrelacion = new Observable((observer) => {
    
            var seleccionTemporal:any={
              id:this.listaCorrelacion.length,
              parametro: this.listParametro.filter(filtro=> filtro.id == this.formularioFiltros.get('idParametroAgregar')?.value)[0].text,
              frecuencia: this.listaFrecuencia.filter(filtro=> filtro.id == this.formularioFiltros.get('frecuenciaAgregar')?.value)[0].text,
              idParametro: this.formularioFiltros.get('idParametroAgregar')?.value,
              idFrecuencia: this.formularioFiltros.get('frecuenciaAgregar')?.value,
            }
            console.log(this.listaCorrelacion);
            var listaCorrelacion  =  this.listaCorrelacion.filter(((element:any) => element.idParametro == seleccionTemporal.idParametro)).map((elemento: any) => ({
              id: elemento.idParametro,
            })); 
    
            console.log(listaCorrelacion );
    
           if(listaCorrelacion[0]){
            Swal.fire(
              'Serie Mixta',
              'El parámetro ya esta selecionado. ',
              'error'
            )
          
           }else{
           
    
            this.listaCorrelacion.push(seleccionTemporal);
            this.datosFilter = this.listaCorrelacion;
    
           }
    
        
         
          });
          obsCorrelacion.subscribe();
        }else{
          Swal.fire(
            'Serie Mixta',
            'No se pueden incluir mas de 5 correlaciones. ',
            'error'
          );
        }
      }

    }

  } 

  agregarElemento(){


  var id = this.listaElemento.filter(filtro=> filtro.id == this.formularioFiltros.get('idElementoA')?.value)[0].id;

  this.sercioparametrosestacion.obtenerListaParametros(id).subscribe((response) => {
    this.listParametroAgregar = response.map((elemento: any) => ({
      id: elemento.idParametro,
      text: elemento.descripcionParametro,
      codigo: elemento.codigo,
      idPeriodo: elemento.idPeriodo,
      idPXE:elemento.idParametroXEstacion
    }));

  });



  console.log( this.listParametroAgregar );

      if(this.listParametroAgregar.length = this.listParametro.length){
        
        if(this.idElemento != '0' ){ 
          if(this.listaItemsElementos.length < 6){
            let obsCorrelacion = new Observable((observer) => {
              var seleccionTemporal:any={
                id:this.formularioFiltros.get('idElementoA')?.value,
                codigoIDEAM: this.listaCodigoIDEAM.filter(filtro=> filtro.id == this.formularioFiltros.get('idCodigoIDEAMAgregar')?.value)[0].text,
                codigoEAAB: this.listaCodigoEAAB.filter(filtro=> filtro.id == this.formularioFiltros.get('idCodigoEAABAgregar')?.value)[0].text,
                nombreElemento: this.listaElemento.filter(filtro=> filtro.id == this.formularioFiltros.get('idElementoA')?.value)[0].text,
                idElemento:this.formularioFiltros.get('idElementoA')?.value,
                idCodigoEAAB: this.formularioFiltros.get('idCodigoEAABAgregar')?.value,
                idCodigoIDEAM:this.formularioFiltros.get('idCodigoIDEAMAgregar')?.value,
              }
              console.log(this.listaItemsElementos);
      
              var listaItemsElementos  =  this.listaItemsElementos.filter(((element:any) => element.idElemento == seleccionTemporal.idElemento)).map((elemento: any) => ({
                id: elemento.idElemento,
              })); 
      
              console.log(listaItemsElementos );
      
             if(listaItemsElementos[0]){
              Swal.fire(
                'Serie Mixta',
                'La estación ya esta selecionado. ',
                'error'
              )
            
             }else{
              
              this.listaItemsElementos.push(seleccionTemporal);
      
             }
      
             // this.datosFilterElementos = this.listaItemsElementos;
              
            });
            obsCorrelacion.subscribe();
          }else{
            Swal.fire(
              'Serie Mixta',
              'No se pueden incluir mas de 5 elementos ',
              'error'
            );
          }
        }

      }else{

        Swal.fire(
          'Serie Mixta',
          'La estación no esta relacionada con la estación origen  ',
          'error'
        );

      }


 
  }
  public generateData(count:any, yrange:any) {
    var i = 0;
    var series = [];
    while (i < count) {
      var y =
        Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

      series.push(y);
      i++;
    }
    return series;
  }
  obtenerElementos(even: any) {
    
    this.idTipoElemento = even;
    this.listaElemento = [];
    this.listaCodigoEAAB = [];
    this.listaCodigoIDEAM = [];

    switch (even) {
      case '466': {
        Swal.fire({
          title: 'Cargando información...',
          html: 'Por favor espere',
          timerProgressBar: true,
          timer: 7000,
          didOpen: () => {
            Swal.showLoading();
          
          },
         
        })
        // Estaciones
        this.serviciosEstacionesService
          .obtenerEstaciones()
          .subscribe((response) => {
      
            this.listaCodigoEAAB = response.filter((element => element.codigoEstacionEaab != null)).map((elemento: any) => ({
              id: elemento.idEstacion,
              text: elemento.codigoEstacionEaab,
              // text: elemento.codigoEstacionEaab,
              disabled: elemento.activo == 'S' ? false : true,
            }));

            this.listaCodigoIDEAM = response.filter((element => element.codigoEstacionIdeam != null)).map((elemento: any) => ({
              id: elemento.idEstacion,
              text: elemento.codigoEstacionIdeam,
              // text: elemento.codigoEstacionEaab,
              disabled: elemento.activo == 'S' ? false : true,
            }));
              
            this.listaElemento = response.map((elemento: any) => ({
             id: elemento.idEstacion,
              text: elemento.estacion,
            disabled: elemento.activo == 'S' ? false : true,
           }));
       
            this.listaCodigoEAABAgregar  = response.filter((element => element.codigoEstacionEaab != null)).map((elemento: any) => ({
              id: elemento.idEstacion,
              text: elemento.codigoEstacionEaab,
              // text: elemento.codigoEstacionEaab,
              disabled: elemento.activo == 'S' ? false : true,
            }));

            this.listaCodigoIDEAMAgregar  = response.filter((element => element.codigoEstacionIdeam != null)).map((elemento: any) => ({
              id: elemento.idEstacion,
              text: elemento.codigoEstacionIdeam,
            }));
              
            this.listaElementoAgregar = response.map((elemento: any) => ({
             id: elemento.idEstacion,
              text: elemento.estacion,
            disabled: elemento.activo == 'S' ? false : true,
           }));


          });
        break;
      }
      case '467': {
        Swal.fire({
          title: 'Cargando información...',
          html: 'Por favor espere',
          timerProgressBar: true,
          timer: 4000,
          didOpen: () => {
            Swal.showLoading();
          
          },
         
        })
        // Embalses
        this.serviciosEmbalcesService
          .obtenerEembalsesDTO()
          .subscribe((response) => {
            // console.log('llegaron embalses', response);

            this.listaElemento = response.map((elemento: any) => ({
              id: elemento.idEmbalse,
              text: elemento.embalse,
              disabled: elemento.activo == 'S' ? false : true,
            }));
          });
        break;
      }
      case '468': {
        Swal.fire({
          title: 'Cargando información...',
          html: 'Por favor espere',
          timerProgressBar: true,
          timer: 4000,
          didOpen: () => {
            Swal.showLoading();
          
          },
         
        })
        // pozos
        this.serviciosPozosService.obtenerPozosDTO().subscribe((response) => {
          // console.log('llegaron pozoz', response);
          this.listaElemento = response.map((elemento: any) => ({
            id: elemento.idPozo,
            text: elemento.pozo,
            disabled: elemento.activo == 'S' ? false : true,
          }));
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
  obtenerPorFrecuencia(idfrecuencia:any){



    this.serviciosParametrosService
    .obtenerPorId(idfrecuencia.value)
    .subscribe((response1) => {

    this.serviciosParametrosService
    .obtenerListaParametros()
    .subscribe((response) => {

      this.listParametroOrgin  =  response.filter((element => element.idPeriodo   == response1.idPeriodo)).map((elemento: any) => ({
        id: elemento.idParametro,
        text: elemento.descripcion+'-'+elemento.nombreTipoParametro ,
        idOrigen: elemento.codigoOrigen,
        disabled: elemento.activo == 'S' ? false : true,
      }));
     this.agregarCorrelacionOrigen(idfrecuencia)

    });


    this.idfrecuencia = response1.idPeriodo;

    });
   
  }

  obtenerPorFrecuenciaA(){
     
     if(this.parametroAgregar){
      this.serviciosParametrosService
      .obtenerPorId(this.parametroAgregar)
      .subscribe((response1) => {
  
      this.idfrecuenciaAgregar = response1.idPeriodo;

  
      });
     }
    
  
   
  }

  cancelar(){

    window.location.reload();
  } 


   jsonToCsv(items:any) {
    const header = Object.keys(items[0]);
    const headerString = header.join(',');
    // handle null or undefined values here
    const replacer = (key:any, value:any) => value ?? '';
    const rowItems = items.map((row:any) =>
      header
        .map((fieldName) => JSON.stringify(row[fieldName], replacer))
        .join(',')
    );
    // join header and body, and break into separate lines
    const csv:string = [headerString, ...rowItems].join('\r\n');
    return csv;
  }


  crearGrafica(){



    this.vergrafica = true ;
    var valor:any = [];   

    var listaDatoa:any = [];   
    var lista:any = []; 
   
   var elemet :string
 

      for ( 
        let index = 0;
      index < this.listaItemsElementos.length;
      index++
        ) {
          elemet = this.listaItemsElementos[index]['nombreElemento'];
          this.listaElementoCate.push(elemet)
        

      }

      for (
        let index = 0;
       index < this.listaCorrelacion.length;
        index++
          ) {
            elemet = this.listaCorrelacion[index]['parametro'];
           
            listaDatoa  =     this.valores.filter((word:any) => word.consecutivoP == index);
            this.listaCorrelacionAdd.push(elemet)
            lista.push([listaDatoa]);


  
              elemet = this.listaCorrelacion[index]['parametro'];

          }

              for (
                let index = 0;
               index < this.listaCorrelacion.length;
                index++
                  ) {
              switch (index) {
             
              case 1: {

                this.grafica1 = true ;
              var valorFin:any = []; 
              var valorOrigen;
              var valorC:any=[];
              var valor;
              const obj:any = [];
              var valorA:any=[];
              for (
                let index = 0;
                index < lista[0][0].length;
                  index++
                    ) {
                            valorOrigen = lista[0][0][index].valorMaximo
                            valorC.push(valorOrigen);
          
                    }
              for (
                let index = 0;
                index < lista[1][0].length;
                  index++
                    ) {
                            valor = lista[1][0][index].valorMaximo
                            valorA.push(valor);
                  
                    }
                    const matrix:any = [];
                    const matrixDispercion:any = [];
                    matrix.push(valorA,valorC);  
                    console.log(7,matrix);
                  
                    const correlationResult = correlation.calculateCorrelation(matrix);      
                      console.log(77,correlationResult);


            for (
                let index = 0;
                index < correlationResult.length;
                  index++
                    ) {
                      for (
                        let i = 0;
                      i <  correlationResult[index].length;
                        i++
                          ) {

                           
                         


                       
                              if(isNaN(correlationResult[index][i])){
                              correlationResult[index][i] = 1
                            }else{
                              if(correlationResult[index][i] == -1){
                                correlationResult[index][i] = -0.3
                              }
                            }
                            valorFin.push( [index,i, correlationResult[index][i]]);
                          }

              }

              
              this.chartOptions = 
              {   
                chart : {
                   type: 'heatmap',
                   marginTop: 40,
                   marginBottom: 80
                },
                title : {
                     text: 'Correlación matrix parámetro '+this.listaCorrelacion[0]['parametro']  + " VS "  + this.listaCorrelacion[1]['parametro']   
                },
                xAxis : {
                  type: 'category',
                   categories: this.listaElementoCate,
                      title: {
                        text: 'Estaciones'
                      },
                },
                yAxis : {
                  type: 'category',
                   categories:  this.listaElementoCate,
                  title: {
                    text: 'Estaciones'
                  },
                  labels: {
                    format:'{value} '
                  },
                  
                 reversed: false
                 
                },
                accessibility: {
                  point: {
                    
                  }
              },
                colorAxis: {

                      stops: [
                        [0, '#FF0000'],
                        [0.25, '#FFFFFF'],
                        [0, '#FFFFFF'],
                        [0.75, '#FFFFFF'],
                        [1, '#00bfff']
                      ],
                      min: -1,
                      max: 1
                  },
                legend: {
                  align: 'right',
                  layout: 'vertical',
                  margin: 0,
                  verticalAlign: 'top',
                  y: 25,
                  symbolHeight: 280
              },
          
              tooltip: {
                
              }, responsive: {
                rules: [{
                    condition: {
                        maxWidth: 500
                    },
                    chartOptions: {
                        yAxis: {
                            labels: {
                               
                            }
                        }
                    }
                }]
            },
              series: [{
                
                type: 'heatmap',
                name: 'Valores de estaciones',
                borderWidth: 1,
                  data: valorFin,
                dataLabels: {
                    enabled: true,
                    color: '#000000'
                },
          
                events: {
                  legendItemClick: function() {
                      if (this.visible) {
                          this.yAxis.update({
                              breaks: [{
                                  from: 1.5,
                                  to: 2.5,
                                  breakSize: 0
                              }]
                          }, false);
                      } else {
                          this.yAxis.update({
                              breaks: []
                          }, false);
                      }
                  }
              }
            }]
              }



            break;
              }
              case 2: {
                this.grafica2 = true ;
                  var valorFin:any = []; 
                  var valorOrigen;
                  var valorC:any=[];
                  var valor;
                  var valorA:any=[];
                  for (
                    let index = 0;
                    index < lista[0][0].length;
                      index++
                        ) {
                                valorOrigen = lista[0][0][index].valorMaximo
                                valorC.push(valorOrigen);
              
                        }
                  for (
                    let index = 0;
                    index < lista[2][0].length;
                      index++
                        ) {
                                valor = lista[2][0][index].valorMaximo
                                valorA.push(valor);
                      
                        }
                        const matrix:any = [];
                        matrix.push(valorA,valorC);  
                        console.log(7,matrix);
                      
                        const correlationResult = correlation.calculateCorrelation(matrix);      
                          console.log(77,correlationResult);


                for (
                    let index = 0;
                    index < correlationResult.length;
                      index++
                        ) {
                          for (
                            let i = 0;
                          i <  correlationResult[index].length;
                            i++
                              ) {


                           
                                  if(isNaN(correlationResult[index][i])){
                                  correlationResult[index][i] = 1
                                }
                                valorFin.push( [index,i, correlationResult[index][i]]);
                              }

                  }

            
                  this.chartOptions0 = 
                  {   
                    chart : {
                       type: 'heatmap',
                       marginTop: 40,
                       marginBottom: 80
                    },
                    title : {
                         text: 'Correlación matrix parámetro '+ this.listaCorrelacion[0]['parametro']   +"  VS  "+ this.listaCorrelacion[2]['parametro']   
                    },
                    xAxis : {
                      type: 'category',
                       categories: this.listaElementoCate,
                          title: {
                            text: 'Estaciones'
                          },
                    },
                    yAxis : {
                      type: 'category',
                       categories:  this.listaElementoCate,
                      title: {
                        text: 'Parametro'
                      },
                      labels: {
                        format: '{value} '
                      },
                      
                     reversed: false
                     
                    },
                    accessibility: {
                      point: {
                        
                      }
                  },
                     colorAxis: {
  
                      stops: [
                        [0, '#FF0000'],
                        [0.25, '#FFFFFF'],
                        [0, '#FFFFFF'],
                        [0.75, '#FFFFFF'],
                        [1, '#00bfff']
                      ],
                      min: -1,
                      max: 1
                  },
                    legend: {
                      align: 'right',
                      layout: 'vertical',
                      margin: 0,
                      verticalAlign: 'top',
                      y: 25,
                      symbolHeight: 280
                  },
              
                  tooltip: {
                    
                  }, responsive: {
                    rules: [{
                        condition: {
                            maxWidth: 500
                        },
                        chartOptions: {
                            yAxis: {
                                labels: {
                               
                                }
                            }
                        }
                    }]
                },
                  series: [{
                    
                    type: 'heatmap',
                    name: 'Valores de estaciones',
                    borderWidth: 1,
                      data: valorFin,
                    dataLabels: {
                        enabled: true,
                        color: '#000000'
                    },
              
                    events: {
                      legendItemClick: function() {
                          if (this.visible) {
                              this.yAxis.update({
                                  breaks: [{
                                      from: 1.5,
                                      to: 2.5,
                                      breakSize: 0
                                  }]
                              }, false);
                          } else {
                              this.yAxis.update({
                                  breaks: []
                              }, false);
                          }
                      }
                  }
                }]

                  }


             

                break;
              }
              case 3: {
                this.grafica3 = true ;
                var valorFin:any = []; 
                var valorOrigen;
                var valorC:any=[];
                var valor;
                var valorA:any=[];
                for (
                  let index = 0;
                  index < lista[0][0].length;
                    index++
                      ) {
                              valorOrigen = lista[0][0][index].valorMaximo
                              valorC.push(valorOrigen);
            
                      }
                for (
                  let index = 0;
                  index < lista[3][0].length;
                    index++
                      ) {

                        if( lista[3][0][index].valorMaximo == null  ){
                          valor =1

                        }else {
                          valor = lista[3][0][index].valorMaximo

                        }
                             

                              valorA.push(valor);
                    
                      }
                      const matrix:any = [];
                      matrix.push(valorA,valorC);  
                      console.log(7,matrix);
                    
                      const correlationResult = correlation.calculateCorrelation(matrix);      
                        console.log(77,correlationResult);


                for (
                    let index = 0;
                    index < correlationResult.length;
                      index++
                        ) {
                          for (
                            let i = 0;
                          i <  correlationResult[index].length;
                            i++
                              ) {
                               if(isNaN(correlationResult[index][i])){
                                  correlationResult[index][i] = 1
                                }

                                valorFin.push( [index,i, correlationResult[index][i]]);
                              }

                  }

                  console.log(77,valorFin);

                  this.chartOptions1 = 
                  {   
                    chart : {
                       type: 'heatmap',
                       marginTop: 40,
                       marginBottom: 80
                    },
                    title : {
                         text: 'Correlación matrix parámetro '+ this.listaCorrelacion[0]['parametro']   +" VS "+ this.listaCorrelacion[3]['parametro']   
                    },
                    xAxis : {
                      type: 'category',
                       categories: this.listaElementoCate,
                          title: {
                            text: 'Estaciones'
                          },
                    },
                    yAxis : {
                      type: 'category',
                       categories:  this.listaElementoCate,
                      title: {
                        text: 'Parametro'
                      },
                      labels: {
                        format: '{value} '
                      },
                      
                     reversed: false
                     
                    },
                    accessibility: {
                      point: {
                        
                      }
                  },
                     colorAxis: {
  
                    stops: [
                      [0, '#FF0000'],
                      [0.25, '#FFFFFF'],
                      [0, '#FFFFFF'],
                      [0.75, '#FFFFFF'],
                      [1, '#00bfff']
                    ],
                    min: -1,
                    max: 1
                },
                    legend: {
                      align: 'right',
                      layout: 'vertical',
                      margin: 0,
                      verticalAlign: 'top',
                      y: 25,
                      symbolHeight: 280
                  },
              
                  tooltip: {
                    
                  }, responsive: {
                    rules: [{
                        condition: {
                            maxWidth: 500
                        },
                        chartOptions: {
                            yAxis: {
                                labels: {
                                   
                                }
                            }
                        }
                    }]
                },
                  series: [{
                    
                    type: 'heatmap',
                    name: 'Valores de estaciones',
                    borderWidth: 1,
                      data: valorFin,
                    dataLabels: {
                        enabled: true,
                        color: '#000000'
                    },
              
                    events: {
                      legendItemClick: function() {
                          if (this.visible) {
                              this.yAxis.update({
                                  breaks: [{
                                      from: 1.5,
                                      to: 2.5,
                                      breakSize: 0
                                  }]
                              }, false);
                          } else {
                              this.yAxis.update({
                                  breaks: []
                              }, false);
                          }
                      }
                  }
                }]




                  }
               
                break;
              }
              case 4: {

                
                this.grafica4 = true ;
                var valorFin:any = []; 
                var valorOrigen;
                var valorC:any=[];
                var valor;
                var valorA:any=[];
                for (
                  let index = 0;
                  index < lista[0][0].length;
                    index++
                      ) {
                              valorOrigen = lista[0][0][index].valorMaximo
                              valorC.push(valorOrigen);
            
                      }
                for (
                  let index = 0;
                  index < lista[4][0].length;
                    index++
                      ) {
                              valor = lista[4][0][index].valorMaximo
                              valorA.push(valor);
                    
                      }
                      const matrix:any = [];
                      matrix.push(valorA,valorC);  
                      console.log(7,matrix);
                    
                      const correlationResult = correlation.calculateCorrelation(matrix);      
                        console.log(77,correlationResult);


                for (
                    let index = 0;
                    index < correlationResult.length;
                      index++
                        ) {
                          for (
                            let i = 0;
                          i <  correlationResult[index].length;
                            i++
                              ) {

                               if(isNaN(correlationResult[index][i])){
                                  correlationResult[index][i] = 1
                                }
                                valorFin.push( [index,i, correlationResult[index][i]]);
                              }

                  }

                  console.log(77,valorFin);

                  this.chartOptions2 = 
                  {   
                    chart : {
                       type: 'heatmap',
                       marginTop: 40,
                       marginBottom: 80
                    },
                    title : {
                         text: 'Correlación matrix parámetro '+ this.listaCorrelacion[4]['parametro']   
                    },
                    xAxis : {
                      type: 'category',
                       categories: this.listaElementoCate,
                          title: {
                            text: 'Estaciones'
                          },
                    },
                    yAxis : {
                      type: 'category',
                       categories:  this.listaElementoCate,
                      title: {
                        text: 'Parametro'
                      },
                      labels: {
                        format:'{value} '
                      },
                      
                     reversed: false
                     
                    },
                    accessibility: {
                      point: {
                        
                      }
                  },
                     colorAxis: {
  
                    stops: [
                      [0, '#FF0000'],
                      [0.25, '#FFFFFF'],
                      [0, '#FFFFFF'],
                      [0.75, '#FFFFFF'],
                      [1, '#00bfff']
                    ],
                    min: -1,
                    max: 1
                },
               legend: {
                      align: 'right',
                      layout: 'vertical',
                      margin: 0,
                      verticalAlign: 'top',
                      y: 25,
                      symbolHeight: 280
                  },
              
                  tooltip: {
                    
                  }, responsive: {
                    rules: [{
                        condition: {
                            maxWidth: 500
                        },
                        chartOptions: {
                            yAxis: {
                                labels: {
                                   
                                }
                            }
                        }
                    }]
                },
                  series: [{
                    
                    type: 'heatmap',
                    name: 'Valores de estaciones',
                    borderWidth: 1,
                      data: valorFin,
                    dataLabels: {
                        enabled: true,
                        color: '#000000'
                    },
              
                    events: {
                      legendItemClick: function() {
                          if (this.visible) {
                              this.yAxis.update({
                                  breaks: [{
                                      from: 1.5,
                                      to: 2.5,
                                      breakSize: 0
                                  }]
                              }, false);
                          } else {
                              this.yAxis.update({
                                  breaks: []
                              }, false);
                          }
                      }
                  }
                }]
                  } 
                 
                break;
              }
              case 5: {

                this.grafica5 = true ;
                var valorFin:any = []; 
                var valorOrigen;
                var valorC:any=[];
                var valor;
                var valorA:any=[];
                for (
                  let index = 0;
                  index < lista[0][0].length;
                    index++
                      ) {
                              valorOrigen = lista[0][0][index].valorMaximo
                              valorC.push(valorOrigen);
            
                      }
                for (
                  let index = 0;
                  index < lista[5][0].length;
                    index++
                      ) {
                              valor = lista[5][0][index].valorMaximo
                              valorA.push(valor);
                    
                      }
                      const matrix:any = [];
                      matrix.push(valorA,valorC);  
                      console.log(7,matrix);
                    
                      const correlationResult = correlation.calculateCorrelation(matrix);      
                        console.log(77,correlationResult);


                for (
                    let index = 0;
                    index < correlationResult.length;
                      index++
                        ) {
                          for (
                            let i = 0;
                          i <  correlationResult[index].length;
                            i++
                              ) {
                               if(isNaN(correlationResult[index][i])){
                                  correlationResult[index][i] = 1
                                }

                                valorFin.push( [index,i, correlationResult[index][i]]);
                              }

                  }

                  console.log(77,valorFin);

                  this.chartOptions3 = 
                  {   
                    chart : {
                       type: 'heatmap',
                       marginTop: 40,
                       marginBottom: 80
                    },
                    title : {
                         text: 'Correlación matrix parámetro '+ this.listaCorrelacion[5]['parametro']   
                    },
                    xAxis : {
                      type: 'category',
                       categories: this.listaElementoCate,
                          title: {
                            text: 'Estaciones'
                          },
                    },
                    yAxis : {
                      type: 'category',
                       categories:  this.listaElementoCate,
                      title: {
                        text: 'Parametro'
                      },
                      labels: {
                        format:'{value} '
                      },
                      
                     reversed: false
                     
                    },
                    accessibility: {
                      point: {
                        
                      }
                  },
                     colorAxis: {
  
                        stops: [
                          [0, '#FF0000'],
                          [0.25, '#FFFFFF'],
                          [0, '#FFFFFF'],
                          [0.75, '#FFFFFF'],
                          [1, '#00bfff']
                        ],
                        min: -1,
                        max: 1
                    },
                                        legend: {
                      align: 'right',
                      layout: 'vertical',
                      margin: 0,
                      verticalAlign: 'top',
                      y: 25,
                      symbolHeight: 280
                  },
              
                  tooltip: {
                    
                  }, responsive: {
                    rules: [{
                        condition: {
                            maxWidth: 500
                        },
                        chartOptions: {
                            yAxis: {
                                labels: {
                                   
                                }
                            }
                        }
                    }]
                },
                  series: [{
                    
                    type: 'heatmap',
                    name: 'Valores de estaciones',
                    borderWidth: 1,
                      data: valorFin,
                    dataLabels: {
                        enabled: true,
                        color: '#000000'
                    },
              
                    events: {
                      legendItemClick: function() {
                          if (this.visible) {
                              this.yAxis.update({
                                  breaks: [{
                                      from: 1.5,
                                      to: 2.5,
                                      breakSize: 0
                                  }]
                              }, false);
                          } else {
                              this.yAxis.update({
                                  breaks: []
                              }, false);
                          }
                      }
                  }
                }]
                  }
                
                      



                break;
              }
              
              default: {
                

              }
            }

    }

   
}


crearGrafica2(){



  this.vergrafica = true ;
  var valor:any = [];   

  var listaDatoa:any = [];   
  var lista:any = []; 
 
 var elemet :string


    for ( 
      let index = 0;
    index < this.listaItemsElementos.length;
    index++
      ) {
        elemet = this.listaItemsElementos[index]['nombreElemento'];
        this.listaElementoCate.push(elemet)
      

    }

    for (
      let index = 0;
     index < this.listaCorrelacion.length;
      index++
        ) {
          elemet = this.listaCorrelacion[index]['parametro'];
         
          listaDatoa  =     this.valores.filter((word:any) => word.consecutivoP == index);
          this.listaCorrelacionAdd.push(elemet)
          lista.push([listaDatoa]);



            elemet = this.listaCorrelacion[index]['parametro'];

        }

            for (
              let index = 0;
             index < this.listaCorrelacion.length;
              index++
                ) {
            switch (index) {
           
            case 1: {

              this.grafica1 = true ;
            var valorFin:any = []; 
            var valorOrigen;
            var valorC:any=[];
            var valor;
            const obj:any = [];
            var valorA:any=[];
            for (
              let index = 0;
              index < lista[0][0].length;
                index++
                  ) {
                          valorOrigen = lista[0][0][index].valorMaximo
                          valorC.push(valorOrigen);
        
                  }
            for (
              let index = 0;
              index < lista[1][0].length;
                index++
                  ) {
                          valor = lista[1][0][index].valorMaximo
                          valorA.push(valor);
                
                  }
                  const matrix:any = [];
                  const matrixDispercion:any = [];
                  matrix.push(valorA,valorC);  
                  console.log(7,matrix);
                
                  const correlationResult = correlation.calculateCorrelation(matrix);      
                    console.log(77,correlationResult);


          for (
              let index = 0;
              index < correlationResult.length;
                index++
                  ) {
                    for (
                      let i = 0;
                    i <  correlationResult[index].length;
                      i++
                        ) {

                         
                       


                     
                            if(isNaN(correlationResult[index][i])){
                            correlationResult[index][i] = 1
                          }else{
                            if(correlationResult[index][i] == -1){
                              correlationResult[index][i] = 0
                            }
                          }
                          valorFin.push( [index,i, correlationResult[index][i]]);
                        }

            }

            
            this.chartOptions = 
            {   
              chart : {
                 type: 'heatmap',
                 marginTop: 40,
                 marginBottom: 80
              },
              title : {
                   text: 'Correlación matrix parámetro '+this.listaCorrelacion[0]['parametro']  + " VS "  + this.listaCorrelacion[1]['parametro']   
              },
              xAxis : {
                type: 'category',
                 categories: this.listaElementoCate,
                    title: {
                      text: 'Estaciones'
                    },
              },
              yAxis : {
                type: 'category',
                 categories:  this.listaElementoCate,
                title: {
                  text: 'Parametro'
                },
                labels: {
                  format:'{value} '
                },
                
               reversed: false
               
              },
              accessibility: {
                point: {
                  
                }
            },
              colorAxis: {

                    stops: [
                      [0, '#FF0000'],
                      [0.25, '#FFFFFF'],
                      [0, '#FFFFFF'],
                      [0.75, '#FFFFFF'],
                      [1, '#00bfff']
                    ],
                    min: -1,
                    max: 1
                },
              legend: {
                align: 'right',
                layout: 'vertical',
                margin: 0,
                verticalAlign: 'top',
                y: 25,
                symbolHeight: 280
            },
        
            tooltip: {
              
            }, responsive: {
              rules: [{
                  condition: {
                      maxWidth: 500
                  },
                  chartOptions: {
                      yAxis: {
                          labels: {
                             
                          }
                      }
                  }
              }]
          },
            series: [{
              
              type: 'heatmap',
              name: 'Valores de estaciones',
              borderWidth: 1,
                data: valorFin,
              dataLabels: {
                  enabled: true,
                  color: '#000000'
              },
        
              events: {
                legendItemClick: function() {
                    if (this.visible) {
                        this.yAxis.update({
                            breaks: [{
                                from: 1.5,
                                to: 2.5,
                                breakSize: 0
                            }]
                        }, false);
                    } else {
                        this.yAxis.update({
                            breaks: []
                        }, false);
                    }
                }
            }
          }]
            }



          break;
            }
            case 2: {
              this.grafica2 = true ;
                var valorFin:any = []; 
                var valorOrigen;
                var valorC:any=[];
                var valor;
                var valorA:any=[];
                for (
                  let index = 0;
                  index < lista[0][0].length;
                    index++
                      ) {
                              valorOrigen = lista[0][0][index].valorMaximo
                              valorC.push(valorOrigen);
            
                      }
                for (
                  let index = 0;
                  index < lista[2][0].length;
                    index++
                      ) {
                              valor = lista[2][0][index].valorMaximo
                              valorA.push(valor);
                    
                      }
                      const matrix:any = [];
                      matrix.push(valorA,valorC);  
                      console.log(7,matrix);
                    
                      const correlationResult = correlation.calculateCorrelation(matrix);      
                        console.log(77,correlationResult);


              for (
                  let index = 0;
                  index < correlationResult.length;
                    index++
                      ) {
                        for (
                          let i = 0;
                        i <  correlationResult[index].length;
                          i++
                            ) {


                         
                                if(isNaN(correlationResult[index][i])){
                                correlationResult[index][i] = 0
                              }
                              valorFin.push( [index,i, correlationResult[index][i]]);
                            }

                }

          
                this.chartOptions0 = 
                {   
                  chart : {
                     type: 'heatmap',
                     marginTop: 40,
                     marginBottom: 80
                  },
                  title : {
                       text: 'Correlación matrix parámetro '+ this.listaCorrelacion[0]['parametro']   +"  VS  "+ this.listaCorrelacion[2]['parametro']   
                  },
                  xAxis : {
                    type: 'category',
                     categories: this.listaElementoCate,
                        title: {
                          text: 'Estaciones'
                        },
                  },
                  yAxis : {
                    type: 'category',
                     categories:  this.listaElementoCate,
                    title: {
                      text: 'Parametro'
                    },
                    labels: {
                      format: '{value} '
                    },
                    
                   reversed: false
                   
                  },
                  accessibility: {
                    point: {
                      
                    }
                },
                   colorAxis: {

                    stops: [
                      [0, '#FF0000'],
                      [0.25, '#FFFFFF'],
                      [0, '#FFFFFF'],
                      [0.75, '#FFFFFF'],
                      [1, '#00bfff']
                    ],
                    min: -1,
                    max: 1
                },
                  legend: {
                    align: 'right',
                    layout: 'vertical',
                    margin: 0,
                    verticalAlign: 'top',
                    y: 25,
                    symbolHeight: 280
                },
            
                tooltip: {
                  
                }, responsive: {
                  rules: [{
                      condition: {
                          maxWidth: 500
                      },
                      chartOptions: {
                          yAxis: {
                              labels: {
                             
                              }
                          }
                      }
                  }]
              },
                series: [{
                  
                  type: 'heatmap',
                  name: 'Valores de estaciones',
                  borderWidth: 1,
                    data: valorFin,
                  dataLabels: {
                      enabled: true,
                      color: '#000000'
                  },
            
                  events: {
                    legendItemClick: function() {
                        if (this.visible) {
                            this.yAxis.update({
                                breaks: [{
                                    from: 1.5,
                                    to: 2.5,
                                    breakSize: 0
                                }]
                            }, false);
                        } else {
                            this.yAxis.update({
                                breaks: []
                            }, false);
                        }
                    }
                }
              }]

                }


           

              break;
            }
            case 3: {
              this.grafica3 = true ;
              var valorFin:any = []; 
              var valorOrigen;
              var valorC:any=[];
              var valor;
              var valorA:any=[];
              for (
                let index = 0;
                index < lista[0][0].length;
                  index++
                    ) {
                            valorOrigen = lista[0][0][index].valorMaximo
                            valorC.push(valorOrigen);
          
                    }
              for (
                let index = 0;
                index < lista[3][0].length;
                  index++
                    ) {
                           if( lista[3][0][index].valorMaximo == null  ){
                          valor =1
                          
                        }else {
                          valor = lista[3][0][index].valorMaximo

                        }
                            valorA.push(valor);
                  
                    }
                    const matrix:any = [];
                    matrix.push(valorA,valorC);  
                    console.log(7,matrix);
                  
                    const correlationResult = correlation.calculateCorrelation(matrix);      
                      console.log(77,correlationResult);


              for (
                  let index = 0;
                  index < correlationResult.length;
                    index++
                      ) {
                        for (
                          let i = 0;
                        i <  correlationResult[index].length;
                          i++
                            ) {
                             if(isNaN(correlationResult[index][i])){
                                correlationResult[index][i] = 0
                              }

                              valorFin.push( [index,i, correlationResult[index][i]]);
                            }

                }

                console.log(77,valorFin);

                this.chartOptions1 = 
                {   
                  chart : {
                     type: 'heatmap',
                     marginTop: 40,
                     marginBottom: 80
                  },
                  title : {
                       text: 'Correlación matrix parámetro '+ this.listaCorrelacion[0]['parametro']   +" VS "+ this.listaCorrelacion[3]['parametro']   
                  },
                  xAxis : {
                    type: 'category',
                     categories: this.listaElementoCate,
                        title: {
                          text: 'Estaciones'
                        },
                  },
                  yAxis : {
                    type: 'category',
                     categories:  this.listaElementoCate,
                    title: {
                      text: 'Parametro'
                    },
                    labels: {
                      format: '{value} '
                    },
                    
                   reversed: false
                   
                  },
                  accessibility: {
                    point: {
                      
                    }
                },
                   colorAxis: {

                  stops: [
                    [0, '#FF0000'],
                    [0.25, '#FFFFFF'],
                    [0, '#FFFFFF'],
                    [0.75, '#FFFFFF'],
                    [1, '#00bfff']
                  ],
                  min: -1,
                  max: 1
              },
                  legend: {
                    align: 'right',
                    layout: 'vertical',
                    margin: 0,
                    verticalAlign: 'top',
                    y: 25,
                    symbolHeight: 280
                },
            
                tooltip: {
                  
                }, responsive: {
                  rules: [{
                      condition: {
                          maxWidth: 500
                      },
                      chartOptions: {
                          yAxis: {
                              labels: {
                                 
                              }
                          }
                      }
                  }]
              },
                series: [{
                  
                  type: 'heatmap',
                  name: 'Valores de estaciones',
                  borderWidth: 1,
                    data: valorFin,
                  dataLabels: {
                      enabled: true,
                      color: '#000000'
                  },
            
                  events: {
                    legendItemClick: function() {
                        if (this.visible) {
                            this.yAxis.update({
                                breaks: [{
                                    from: 1.5,
                                    to: 2.5,
                                    breakSize: 0
                                }]
                            }, false);
                        } else {
                            this.yAxis.update({
                                breaks: []
                            }, false);
                        }
                    }
                }
              }]




                }
             
              break;
            }
            case 4: {

              
              this.grafica4 = true ;
              var valorFin:any = []; 
              var valorOrigen;
              var valorC:any=[];
              var valor;
              var valorA:any=[];
              for (
                let index = 0;
                index < lista[0][0].length;
                  index++
                    ) {
                            valorOrigen = lista[0][0][index].valorMaximo
                            valorC.push(valorOrigen);
          
                    }
              for (
                let index = 0;
                index < lista[4][0].length;
                  index++
                    ) {
                            valor = lista[4][0][index].valorMaximo
                            valorA.push(valor);
                  
                    }
                    const matrix:any = [];
                    matrix.push(valorA,valorC);  
                    console.log(7,matrix);
                  
                    const correlationResult = correlation.calculateCorrelation(matrix);      
                      console.log(77,correlationResult);


              for (
                  let index = 0;
                  index < correlationResult.length;
                    index++
                      ) {
                        for (
                          let i = 0;
                        i <  correlationResult[index].length;
                          i++
                            ) {

                             if(isNaN(correlationResult[index][i])){
                                correlationResult[index][i] = 0
                              }
                              valorFin.push( [index,i, correlationResult[index][i]]);
                            }

                }

                console.log(77,valorFin);

                this.chartOptions2 = 
                {   
                  chart : {
                     type: 'heatmap',
                     marginTop: 40,
                     marginBottom: 80
                  },
                  title : {
                       text: 'Correlación matrix parámetro '+ this.listaCorrelacion[4]['parametro']   
                  },
                  xAxis : {
                    type: 'category',
                     categories: this.listaElementoCate,
                        title: {
                          text: 'Estaciones'
                        },
                  },
                  yAxis : {
                    type: 'category',
                     categories:  this.listaElementoCate,
                    title: {
                      text: 'Parametro'
                    },
                    labels: {
                      format:'{value} '
                    },
                    
                   reversed: false
                   
                  },
                  accessibility: {
                    point: {
                      
                    }
                },
                   colorAxis: {

                  stops: [
                    [0, '#FF0000'],
                    [0.25, '#FFFFFF'],
                    [0, '#FFFFFF'],
                    [0.75, '#FFFFFF'],
                    [1, '#00bfff']
                  ],
                  min: -1,
                  max: 1
              },
             legend: {
                    align: 'right',
                    layout: 'vertical',
                    margin: 0,
                    verticalAlign: 'top',
                    y: 25,
                    symbolHeight: 280
                },
            
                tooltip: {
                  
                }, responsive: {
                  rules: [{
                      condition: {
                          maxWidth: 500
                      },
                      chartOptions: {
                          yAxis: {
                              labels: {
                                 
                              }
                          }
                      }
                  }]
              },
                series: [{
                  
                  type: 'heatmap',
                  name: 'Valores de estaciones',
                  borderWidth: 1,
                    data: valorFin,
                  dataLabels: {
                      enabled: true,
                      color: '#000000'
                  },
            
                  events: {
                    legendItemClick: function() {
                        if (this.visible) {
                            this.yAxis.update({
                                breaks: [{
                                    from: 1.5,
                                    to: 2.5,
                                    breakSize: 0
                                }]
                            }, false);
                        } else {
                            this.yAxis.update({
                                breaks: []
                            }, false);
                        }
                    }
                }
              }]
                } 
               
              break;
            }
            case 5: {

              this.grafica5 = true ;
              var valorFin:any = []; 
              var valorOrigen;
              var valorC:any=[];
              var valor;
              var valorA:any=[];
              for (
                let index = 0;
                index < lista[0][0].length;
                  index++
                    ) {
                            valorOrigen = lista[0][0][index].valorMaximo
                            valorC.push(valorOrigen);
          
                    }
              for (
                let index = 0;
                index < lista[5][0].length;
                  index++
                    ) {
                            valor = lista[5][0][index].valorMaximo
                            valorA.push(valor);
                  
                    }
                    const matrix:any = [];
                    matrix.push(valorA,valorC);  
                    console.log(7,matrix);
                  
                    const correlationResult = correlation.calculateCorrelation(matrix);      
                      console.log(77,correlationResult);


              for (
                  let index = 0;
                  index < correlationResult.length;
                    index++
                      ) {
                        for (
                          let i = 0;
                        i <  correlationResult[index].length;
                          i++
                            ) {
                             if(isNaN(correlationResult[index][i])){
                                correlationResult[index][i] = 0
                              }

                              valorFin.push( [index,i, correlationResult[index][i]]);
                            }

                }

                console.log(77,valorFin);

                this.chartOptions3 = 
                {   
                  chart : {
                     type: 'heatmap',
                     marginTop: 40,
                     marginBottom: 80
                  },
                  title : {
                       text: 'Correlación matrix parámetro '+ this.listaCorrelacion[5]['parametro']   
                  },
                  xAxis : {
                    type: 'category',
                     categories: this.listaElementoCate,
                        title: {
                          text: 'Estaciones'
                        },
                  },
                  yAxis : {
                    type: 'category',
                     categories:  this.listaElementoCate,
                    title: {
                      text: 'Parametro'
                    },
                    labels: {
                      format:'{value} '
                    },
                    
                   reversed: false
                   
                  },
                  accessibility: {
                    point: {
                      
                    }
                },
                   colorAxis: {

                      stops: [
                        [0, '#FF0000'],
                        [0.25, '#FFFFFF'],
                        [0, '#FFFFFF'],
                        [0.75, '#FFFFFF'],
                        [1, '#00bfff']
                      ],
                      min: -1,
                      max: 1
                  },
                                      legend: {
                    align: 'right',
                    layout: 'vertical',
                    margin: 0,
                    verticalAlign: 'top',
                    y: 25,
                    symbolHeight: 280
                },
            
                tooltip: {
                  
                }, responsive: {
                  rules: [{
                      condition: {
                          maxWidth: 500
                      },
                      chartOptions: {
                          yAxis: {
                              labels: {
                                 
                              }
                          }
                      }
                  }]
              },
                series: [{
                  
                  type: 'heatmap',
                  name: 'Valores de estaciones',
                  borderWidth: 1,
                    data: valorFin,
                  dataLabels: {
                      enabled: true,
                      color: '#000000'
                  },
            
                  events: {
                    legendItemClick: function() {
                        if (this.visible) {
                            this.yAxis.update({
                                breaks: [{
                                    from: 1.5,
                                    to: 2.5,
                                    breakSize: 0
                                }]
                            }, false);
                        } else {
                            this.yAxis.update({
                                breaks: []
                            }, false);
                        }
                    }
                }
              }]
                }
              
                    



              break;
            }
            
            default: {
              

            }
          }

  }

 
}


crearGrafica3(){



  this.vergrafica = true ;
  var valor:any = [];   

  var listaDatoa:any = [];   
  var lista:any = []; 
 
 var elemet :string


    for ( 
      let index = 0;
    index < this.listaItemsElementos.length;
    index++
      ) {
        elemet = this.listaItemsElementos[index]['nombreElemento'];
        this.listaElementoCate.push(elemet)
      

    }

    for (
      let index = 0;
     index < this.listaCorrelacion.length;
      index++
        ) {
          elemet = this.listaCorrelacion[index]['parametro'];
         
          listaDatoa  =     this.valores.filter((word:any) => word.consecutivoP == index);
          this.listaCorrelacionAdd.push(elemet)
          lista.push([listaDatoa]);



            elemet = this.listaCorrelacion[index]['parametro'];

        }

            for (
              let index = 0;
             index < this.listaCorrelacion.length;
              index++
                ) {
            switch (index) {
           
            case 1: {

              this.grafica1 = true ;
            var valorFin:any = []; 
            var valorOrigen;
            var valorC:any=[];
            var valor;
            const obj:any = [];
            var valorA:any=[];
            for (
              let index = 0;
              index < lista[0][0].length;
                index++
                  ) {
                          valorOrigen = lista[0][0][index].valorMaximo
                          valorC.push(valorOrigen);
        
                  }
            for (
              let index = 0;
              index < lista[1][0].length;
                index++
                  ) {
                    if( lista[3][0][index].valorMaximo == null  ){
                      valor =1
                      
                    }else {
                      valor = lista[3][0][index].valorMaximo

                    }
                          valorA.push(valor);
                
                  }
                  const matrix:any = [];
                  const matrixDispercion:any = [];
                  matrix.push(valorA,valorC);  
                  console.log(7,matrix);
                
                  const correlationResult = correlation.calculateCorrelation(matrix);      
                    console.log(77,correlationResult);


          for (
              let index = 0;
              index < correlationResult.length;
                index++
                  ) {
                    for (
                      let i = 0;
                    i <  correlationResult[index].length;
                      i++
                        ) {

                         
                       


                     
                            if(isNaN(correlationResult[index][i])){
                            correlationResult[index][i] = 1
                          }else{
                            if(correlationResult[index][i] == -1){
                              correlationResult[index][i] = 1
                            }
                          }
                          valorFin.push( [index,i, correlationResult[index][i]]);
                        }

            }

            
            this.chartOptions = 
            {   
              chart : {
                 type: 'heatmap',
                 marginTop: 40,
                 marginBottom: 80
              },
              title : {
                   text: 'Correlación matrix parámetro '+this.listaCorrelacion[0]['parametro']  + " VS "  + this.listaCorrelacion[1]['parametro']   
              },
              xAxis : {
                type: 'category',
                 categories: this.listaElementoCate,
                    title: {
                      text: 'Estaciones'
                    },
              },
              yAxis : {
                type: 'category',
                 categories:  this.listaElementoCate,
                title: {
                  text: 'Parametro'
                },
                labels: {
                  format:'{value} '
                },
                
               reversed: false
               
              },
              accessibility: {
                point: {
                  
                }
            },
              colorAxis: {

                    stops: [
                      [0, '#FF0000'],
                      [0.25, '#FFFFFF'],
                      [0, '#FFFFFF'],
                      [0.75, '#FFFFFF'],
                      [1, '#00bfff']
                    ],
                    min: -1,
                    max: 1
                },
              legend: {
                align: 'right',
                layout: 'vertical',
                margin: 0,
                verticalAlign: 'top',
                y: 25,
                symbolHeight: 280
            },
        
            tooltip: {
              
            }, responsive: {
              rules: [{
                  condition: {
                      maxWidth: 500
                  },
                  chartOptions: {
                      yAxis: {
                          labels: {
                             
                          }
                      }
                  }
              }]
          },
            series: [{
              
              type: 'heatmap',
              name: 'Valores de estaciones',
              borderWidth: 1,
                data: valorFin,
              dataLabels: {
                  enabled: true,
                  color: '#000000'
              },
        
              events: {
                legendItemClick: function() {
                    if (this.visible) {
                        this.yAxis.update({
                            breaks: [{
                                from: 1.5,
                                to: 2.5,
                                breakSize: 0
                            }]
                        }, false);
                    } else {
                        this.yAxis.update({
                            breaks: []
                        }, false);
                    }
                }
            }
          }]
            }



          break;
            }
            case 2: {
              this.grafica2 = true ;
                var valorFin:any = []; 
                var valorOrigen;
                var valorC:any=[];
                var valor;
                var valorA:any=[];
                for (
                  let index = 0;
                  index < lista[0][0].length;
                    index++
                      ) {
                              valorOrigen = lista[0][0][index].valorMaximo
                              valorC.push(valorOrigen);
            
                      }
                for (
                  let index = 0;
                  index < lista[2][0].length;
                    index++
                      ) {
                              valor = lista[2][0][index].valorMaximo
                              valorA.push(valor);
                    
                      }
                      const matrix:any = [];
                      matrix.push(valorA,valorC);  
                      console.log(7,matrix);
                    
                      const correlationResult = correlation.calculateCorrelation(matrix);      
                        console.log(77,correlationResult);


              for (
                  let index = 0;
                  index < correlationResult.length;
                    index++
                      ) {
                        for (
                          let i = 0;
                        i <  correlationResult[index].length;
                          i++
                            ) {


                         
                                if(isNaN(correlationResult[index][i])){
                                correlationResult[index][i] = 1
                              }
                              valorFin.push( [index,i, correlationResult[index][i]]);
                            }

                }

          
                this.chartOptions0 = 
                {   
                  chart : {
                     type: 'heatmap',
                     marginTop: 40,
                     marginBottom: 80
                  },
                  title : {
                       text: 'Correlación matrix parámetro '+ this.listaCorrelacion[0]['parametro']   +"  VS  "+ this.listaCorrelacion[2]['parametro']   
                  },
                  xAxis : {
                    type: 'category',
                     categories: this.listaElementoCate,
                        title: {
                          text: 'Estaciones'
                        },
                  },
                  yAxis : {
                    type: 'category',
                     categories:  this.listaElementoCate,
                    title: {
                      text: 'Parametro'
                    },
                    labels: {
                      format: '{value} '
                    },
                    
                   reversed: false
                   
                  },
                  accessibility: {
                    point: {
                      
                    }
                },
                   colorAxis: {

                    stops: [
                      [0, '#FF0000'],
                      [0.25, '#FFFFFF'],
                      [0, '#FFFFFF'],
                      [0.75, '#FFFFFF'],
                      [1, '#00bfff']
                    ],
                    min: -1,
                    max: 1
                },
                  legend: {
                    align: 'right',
                    layout: 'vertical',
                    margin: 0,
                    verticalAlign: 'top',
                    y: 25,
                    symbolHeight: 280
                },
            
                tooltip: {
                  
                }, responsive: {
                  rules: [{
                      condition: {
                          maxWidth: 500
                      },
                      chartOptions: {
                          yAxis: {
                              labels: {
                             
                              }
                          }
                      }
                  }]
              },
                series: [{
                  
                  type: 'heatmap',
                  name: 'Valores de estaciones',
                  borderWidth: 1,
                    data: valorFin,
                  dataLabels: {
                      enabled: true,
                      color: '#000000'
                  },
            
                  events: {
                    legendItemClick: function() {
                        if (this.visible) {
                            this.yAxis.update({
                                breaks: [{
                                    from: 1.5,
                                    to: 2.5,
                                    breakSize: 0
                                }]
                            }, false);
                        } else {
                            this.yAxis.update({
                                breaks: []
                            }, false);
                        }
                    }
                }
              }]

                }


           

              break;
            }
            case 3: {
              this.grafica3 = true ;
              var valorFin:any = []; 
              var valorOrigen;
              var valorC:any=[];
              var valor;
              var valorA:any=[];
              for (
                let index = 0;
                index < lista[0][0].length;
                  index++
                    ) {
                            valorOrigen = lista[0][0][index].valorMaximo
                            valorC.push(valorOrigen);
          
                    }
              for (
                let index = 0;
                index < lista[3][0].length;
                  index++
                    ) {
                            valor = lista[3][0][index].valorMaximo
                            valorA.push(valor);
                  
                    }
                    const matrix:any = [];
                    matrix.push(valorA,valorC);  
                    console.log(7,matrix);
                  
                    const correlationResult = correlation.calculateCorrelation(matrix);      
                      console.log(77,correlationResult);


              for (
                  let index = 0;
                  index < correlationResult.length;
                    index++
                      ) {
                        for (
                          let i = 0;
                        i <  correlationResult[index].length;
                          i++
                            ) {
                             if(isNaN(correlationResult[index][i])){
                                correlationResult[index][i] = 1
                              }

                              valorFin.push( [index,i, correlationResult[index][i]]);
                            }

                }

                console.log(77,valorFin);

                this.chartOptions1 = 
                {   
                  chart : {
                     type: 'heatmap',
                     marginTop: 40,
                     marginBottom: 80
                  },
                  title : {
                       text: 'Correlación matrix parámetro '+ this.listaCorrelacion[0]['parametro']   +" VS "+ this.listaCorrelacion[3]['parametro']   
                  },
                  xAxis : {
                    type: 'category',
                     categories: this.listaElementoCate,
                        title: {
                          text: 'Estaciones'
                        },
                  },
                  yAxis : {
                    type: 'category',
                     categories:  this.listaElementoCate,
                    title: {
                      text: 'Parametro'
                    },
                    labels: {
                      format: '{value} '
                    },
                    
                   reversed: false
                   
                  },
                  accessibility: {
                    point: {
                      
                    }
                },
                   colorAxis: {

                  stops: [
                    [0, '#FF0000'],
                    [0.25, '#FFFFFF'],
                    [0, '#FFFFFF'],
                    [0.75, '#FFFFFF'],
                    [1, '#00bfff']
                  ],
                  min: -1,
                  max: 1
              },
                  legend: {
                    align: 'right',
                    layout: 'vertical',
                    margin: 0,
                    verticalAlign: 'top',
                    y: 25,
                    symbolHeight: 280
                },
            
                tooltip: {
                  
                }, responsive: {
                  rules: [{
                      condition: {
                          maxWidth: 500
                      },
                      chartOptions: {
                          yAxis: {
                              labels: {
                                 
                              }
                          }
                      }
                  }]
              },
                series: [{
                  
                  type: 'heatmap',
                  name: 'Valores de estaciones',
                  borderWidth: 1,
                    data: valorFin,
                  dataLabels: {
                      enabled: true,
                      color: '#000000'
                  },
            
                  events: {
                    legendItemClick: function() {
                        if (this.visible) {
                            this.yAxis.update({
                                breaks: [{
                                    from: 1.5,
                                    to: 2.5,
                                    breakSize: 0
                                }]
                            }, false);
                        } else {
                            this.yAxis.update({
                                breaks: []
                            }, false);
                        }
                    }
                }
              }]




                }
             
              break;
            }
            case 4: {

              
              this.grafica4 = true ;
              var valorFin:any = []; 
              var valorOrigen;
              var valorC:any=[];
              var valor;
              var valorA:any=[];
              for (
                let index = 0;
                index < lista[0][0].length;
                  index++
                    ) {
                            valorOrigen = lista[0][0][index].valorMaximo
                            valorC.push(valorOrigen);
          
                    }
              for (
                let index = 0;
                index < lista[4][0].length;
                  index++
                    ) {
                            valor = lista[4][0][index].valorMaximo
                            valorA.push(valor);
                  
                    }
                    const matrix:any = [];
                    matrix.push(valorA,valorC);  
                    console.log(7,matrix);
                  
                    const correlationResult = correlation.calculateCorrelation(matrix);      
                      console.log(77,correlationResult);


              for (
                  let index = 0;
                  index < correlationResult.length;
                    index++
                      ) {
                        for (
                          let i = 0;
                        i <  correlationResult[index].length;
                          i++
                            ) {

                             if(isNaN(correlationResult[index][i])){
                                correlationResult[index][i] = 1
                              }
                              valorFin.push( [index,i, correlationResult[index][i]]);
                            }

                }

                console.log(77,valorFin);

                this.chartOptions2 = 
                {   
                  chart : {
                     type: 'heatmap',
                     marginTop: 40,
                     marginBottom: 80
                  },
                  title : {
                       text: 'Correlación matrix parámetro '+ this.listaCorrelacion[4]['parametro']   
                  },
                  xAxis : {
                    type: 'category',
                     categories: this.listaElementoCate,
                        title: {
                          text: 'Estaciones'
                        },
                  },
                  yAxis : {
                    type: 'category',
                     categories:  this.listaElementoCate,
                    title: {
                      text: 'Parametro'
                    },
                    labels: {
                      format:'{value} '
                    },
                    
                   reversed: false
                   
                  },
                  accessibility: {
                    point: {
                      
                    }
                },
                   colorAxis: {

                  stops: [
                    [0, '#FF0000'],
                    [0.25, '#FFFFFF'],
                    [0, '#FFFFFF'],
                    [0.75, '#FFFFFF'],
                    [1, '#00bfff']
                  ],
                  min: -1,
                  max: 1
              },
             legend: {
                    align: 'right',
                    layout: 'vertical',
                    margin: 0,
                    verticalAlign: 'top',
                    y: 25,
                    symbolHeight: 280
                },
            
                tooltip: {
                  
                }, responsive: {
                  rules: [{
                      condition: {
                          maxWidth: 500
                      },
                      chartOptions: {
                          yAxis: {
                              labels: {
                                 
                              }
                          }
                      }
                  }]
              },
                series: [{
                  
                  type: 'heatmap',
                  name: 'Valores de estaciones',
                  borderWidth: 1,
                    data: valorFin,
                  dataLabels: {
                      enabled: true,
                      color: '#000000'
                  },
            
                  events: {
                    legendItemClick: function() {
                        if (this.visible) {
                            this.yAxis.update({
                                breaks: [{
                                    from: 1.5,
                                    to: 2.5,
                                    breakSize: 0
                                }]
                            }, false);
                        } else {
                            this.yAxis.update({
                                breaks: []
                            }, false);
                        }
                    }
                }
              }]
                } 
               
              break;
            }
            case 5: {

              this.grafica5 = true ;
              var valorFin:any = []; 
              var valorOrigen;
              var valorC:any=[];
              var valor;
              var valorA:any=[];
              for (
                let index = 0;
                index < lista[0][0].length;
                  index++
                    ) {
                            valorOrigen = lista[0][0][index].valorMaximo
                            valorC.push(valorOrigen);
          
                    }
              for (
                let index = 0;
                index < lista[5][0].length;
                  index++
                    ) {
                            valor = lista[5][0][index].valorMaximo
                            valorA.push(valor);
                  
                    }
                    const matrix:any = [];
                    matrix.push(valorA,valorC);  
                    console.log(7,matrix);
                  
                    const correlationResult = correlation.calculateCorrelation(matrix);      
                      console.log(77,correlationResult);


              for (
                  let index = 0;
                  index < correlationResult.length;
                    index++
                      ) {
                        for (
                          let i = 0;
                        i <  correlationResult[index].length;
                          i++
                            ) {
                             if(isNaN(correlationResult[index][i])){
                                correlationResult[index][i] = 1
                              }

                              valorFin.push( [index,i, correlationResult[index][i]]);
                            }

                }

                console.log(77,valorFin);

                this.chartOptions3 = 
                {   
                  chart : {
                     type: 'heatmap',
                     marginTop: 40,
                     marginBottom: 80
                  },
                  title : {
                       text: 'Correlación matrix parámetro '+ this.listaCorrelacion[5]['parametro']   
                  },
                  xAxis : {
                    type: 'category',
                     categories: this.listaElementoCate,
                        title: {
                          text: 'Estaciones'
                        },
                  },
                  yAxis : {
                    type: 'category',
                     categories:  this.listaElementoCate,
                    title: {
                      text: 'Parametro'
                    },
                    labels: {
                      format:'{value} '
                    },
                    
                   reversed: false
                   
                  },
                  accessibility: {
                    point: {
                      
                    }
                },
                   colorAxis: {

                      stops: [
                        [0, '#FF0000'],
                        [0.25, '#FFFFFF'],
                        [0, '#FFFFFF'],
                        [0.75, '#FFFFFF'],
                        [1, '#00bfff']
                      ],
                      min: -1,
                      max: 1
                  },
                                      legend: {
                    align: 'right',
                    layout: 'vertical',
                    margin: 0,
                    verticalAlign: 'top',
                    y: 25,
                    symbolHeight: 280
                },
            
                tooltip: {
                  
                }, responsive: {
                  rules: [{
                      condition: {
                          maxWidth: 500
                      },
                      chartOptions: {
                          yAxis: {
                              labels: {
                                 
                              }
                          }
                      }
                  }]
              },
                series: [{
                  
                  type: 'heatmap',
                  name: 'Valores de estaciones',
                  borderWidth: 1,
                    data: valorFin,
                  dataLabels: {
                      enabled: true,
                      color: '#000000'
                  },
            
                  events: {
                    legendItemClick: function() {
                        if (this.visible) {
                            this.yAxis.update({
                                breaks: [{
                                    from: 1.5,
                                    to: 2.5,
                                    breakSize: 0
                                }]
                            }, false);
                        } else {
                            this.yAxis.update({
                                breaks: []
                            }, false);
                        }
                    }
                }
              }]
                }
              
                    



              break;
            }
            
            default: {
              

            }
          }

  }

 
}

  obtenerListaParametrosAgregar(id : any) {

    

    Swal.fire({
      title: 'Cargando Parámetros...', 
      html: 'Espere por favor.', 
      timer: 42000, 
      timerProgressBar: true, 
      showConfirmButton: false,
      allowOutsideClick: false,
      didOpen: async() => {
        Swal.showLoading();
  
        this.sercioparametrosestacion.obtenerListaParametros(id).subscribe((response) => {
          this.listParametroAgregar = response.map((elemento: any) => ({
            id: elemento.idParametro,
            text: elemento.descripcionParametro,
            codigo: elemento.codigo,
            idPeriodo: elemento.idPeriodo,
            idPXE:elemento.idParametroXEstacion
          })); 


          if(this.listParametroAgregar == this.listParametro){
            
         
          }else{

            Swal.fire(
              'Serie Mixta',
              'La estación no esta relacionada con la estación origen  ',
              'error'
            );

          }
  
       
          Swal.close();
        });
      }, 
      willClose: async() => {
        Swal.hideLoading();
      }
    });
  }

  obtenerListaParametros(id : any) {
    Swal.fire({
      title: 'Cargando Parámetros...', 
      html: 'Espere por favor.', 
      timer: 42000, 
      timerProgressBar: true, 
      showConfirmButton: false,
      allowOutsideClick: false,
      didOpen: async() => {
        Swal.showLoading();
  
        this.sercioparametrosestacion.obtenerListaParametros(id).subscribe((response) => {
          this.listParametro = response.map((elemento: any) => ({
            id: elemento.idParametro,
            text: elemento.descripcionParametro,
            codigo: elemento.codigo,
            idPeriodo: elemento.idPeriodo,
            idPXE:elemento.idParametroXEstacion
          }));
  
          var cars1 =      this.listParametro.filter(function(car:any) {
            return car.idPeriodo == 151 || car.idPeriodo == 152 || car.idPeriodo == 154  ; 
          });
          for (let index = 0; index <   this.listParametro.length; index++) {
            
            var text   =  this.listParametro[index]['text']
            var text1 = text.split('-');
             var parametro = text1[0]+'-'+text1[1].toLowerCase();
  
             this.listParametro[index]['text'] = parametro;
  
  
             console.log(  this.listParametro[index]['text']   );
  
          }
          this.listParametro  = cars1;
  
          console.log(this.listParametro );
          this.agregarElementoOrigen(id);

          Swal.close();
        });
      }, 
      willClose: async() => {
        Swal.hideLoading();
      }
    });
  }


  buscarDispercion(objetoBusqueda:any){
    this.serviciosObservacionesEstacionService
    .seriemixtavalorCorrelacion(objetoBusqueda)
    .subscribe((response) => {
    

              this.vergrafica = true;


              this.valoresCorrelacion = response;
              console.log(1,this.valoresCorrelacion.multiLista,this.valoresCorrelacion.multiLista.length);

              var matrixDispercion:any = [];
              var cantidad1:any = [];
              console.log( this.valoresCorrelacion)
              var numeroCorelacion = (this.valoresCorrelacion.multiLista.length / this.listaCorrelacion.length);
                              
                                          const y:any = [];
                        for (let  i1 = 0; i1 <  this.valoresCorrelacion.multiLista[0].length; i1++) {
                            

                         
                          if(numeroCorelacion == 1){

                            var   estacion1 =  this.valoresCorrelacion.multiLista[0][i1].valorMaximo

                            var   estacion2 =  this.valoresCorrelacion.multiLista[1][i1].valorMaximo

                           matrixDispercion.push({
                              estacion1:estacion1, Species:'setosa' },
                              {
                                estacion1:estacion4,Species:'versicolor' }
                              );  

                          }




                          if(numeroCorelacion == 3){

                            var   estacion1 =  this.valoresCorrelacion.multiLista[0][i1].valorMaximo

                            var   estacion2 =  this.valoresCorrelacion.multiLista[1][i1].valorMaximo

                            var   estacion3 =  this.valoresCorrelacion.multiLista[2][i1].valorMaximo

                            var   estacion4 =  this.valoresCorrelacion.multiLista[3][i1].valorMaximo

                            var   estacion5 =  this.valoresCorrelacion.multiLista[4][i1].valorMaximo

                            var   estacion6 =  this.valoresCorrelacion.multiLista[5][i1].valorMaximo


                            


                            
                            matrixDispercion.push({
                              estacion1:estacion1, estacion2:estacion2, estacion3:estacion3,Species:'setosa' },
                              {
                                estacion1:estacion4, estacion2:estacion5, estacion3:estacion6,Species:'versicolor' }
                              );  

                          }

                      
                          if(numeroCorelacion == 2){

                            var   estacion1 =  this.valoresCorrelacion.multiLista[0][i1].valorMaximo

                            var   estacion2 =  this.valoresCorrelacion.multiLista[1][i1].valorMaximo

                            var   estacion3 =  this.valoresCorrelacion.multiLista[2][i1].valorMaximo

                            var   estacion4 =  this.valoresCorrelacion.multiLista[3][i1].valorMaximo

                            


                            
                            matrixDispercion.push({
                              estacion1:estacion1, estacion2:estacion2,Species:'setosa' },
                              {
                                estacion1:estacion4, estacion2:estacion5,Species:'versicolor' }
                              );  

                          }
                         

                          if(numeroCorelacion == 4){

                            var   estacion1 =  this.valoresCorrelacion.multiLista[0][i1].valorMaximo

                            var   estacion2 =  this.valoresCorrelacion.multiLista[1][i1].valorMaximo

                            var   estacion3 =  this.valoresCorrelacion.multiLista[2][i1].valorMaximo

                            var   estacion4 =  this.valoresCorrelacion.multiLista[3][i1].valorMaximo

                            var   estacion5 =  this.valoresCorrelacion.multiLista[4][i1].valorMaximo

                            var   estacion6 =  this.valoresCorrelacion.multiLista[5][i1].valorMaximo

                            var   estacion7 =  this.valoresCorrelacion.multiLista[6][i1].valorMaximo

                            var   estacion8 =  this.valoresCorrelacion.multiLista[7][i1].valorMaximo

                            


                            
                            matrixDispercion.push({
                              estacion1:estacion1, estacion2:estacion2, estacion3:estacion3,estacion4:estacion4,Species:'setosa' },
                              {
                                estacion1:estacion5, estacion2:estacion6, estacion3:estacion7,estacion4:estacion8,Species:'versicolor' }
                              );  

                          }


                          if(numeroCorelacion == 5){

                            var   estacion1 =  this.valoresCorrelacion.multiLista[0][i1].valorMaximo

                            var   estacion2 =  this.valoresCorrelacion.multiLista[1][i1].valorMaximo

                            var   estacion3 =  this.valoresCorrelacion.multiLista[2][i1].valorMaximo

                            var   estacion4 =  this.valoresCorrelacion.multiLista[3][i1].valorMaximo

                            var   estacion5 =  this.valoresCorrelacion.multiLista[4][i1].valorMaximo

                            var   estacion6 =  this.valoresCorrelacion.multiLista[5][i1].valorMaximo

                            var   estacion7 =  this.valoresCorrelacion.multiLista[6][i1].valorMaximo

                            var   estacion8 =  this.valoresCorrelacion.multiLista[7][i1].valorMaximo

                            var   estacion9 =  this.valoresCorrelacion.multiLista[6][i1].valorMaximo

                            var   estacion10 =  this.valoresCorrelacion.multiLista[7][i1].valorMaximo

                            


                            
                            matrixDispercion.push({
                              estacion1:estacion1, estacion2:estacion2, estacion3:estacion3,estacion4:estacion4,estacion5:estacion5,Species:'setosa' },
                              {
                                estacion1:estacion6, estacion2:estacion7, estacion3:estacion8,estacion4:estacion9,estacion5:estacion10,Species:'versicolor' }
                              );  

                          }


                                            
                        }
  

                    console.log(numeroCorelacion, );


          
      
      
                  console.log(453, matrixDispercion, matrixDispercion);
      
                  var bodyMeasurements = [
                    { weight: 63, height: 1.65 },
                    { weight: 64, height: 1.67 },
                    { weight: 74, height: 1.80 },
                    { weight: 79, height: 1.82 },
                    { weight: 82, height: 1.86 },
                    { weight: 66, height: 1.70 },
                    { weight: 91, height: 1.83 },
                    { weight: 72, height: 1.76 },
                    { weight: 85, height: 1.89 },
                    { weight: 68, height: 1.68 }
                  ];
                  
                  var bodyVars = {
                    weight: 'metric',
                    height: 'metric'
                  };
                  
                  var stats = new Statistics(bodyMeasurements, bodyVars);
                  var r = stats.correlationCoefficient('weight', 'height');
                  
                  
                  var transform = stats.fisherTransformation(0.3);
                  console.log(transform);
                  
                  
                  var margin = {top: 10, right: 30, bottom: 30, left: 40},
                    width = 730 - margin.left - margin.right,
                    height = 730 - margin.top - margin.bottom;


                   
                    d31.selectAll('#serie svg').remove();
                 
                  var svg = d31.select("#serie")
                  .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                  .append("g")
                    .attr("transform",
                          "translate(" + margin.left + "," + margin.top + ")");
                     
                     
                     
                       
      
              
                          
                      
                      var stringCvs =    this.jsonToCsv(matrixDispercion);
              
              
              
              
              
                       var csv = URL.createObjectURL(new Blob([
                        stringCvs
                              ]));
              
                            var  list = this.listaElementoCate.legend
              
                            console.log(list);
                              
                              d3.csv(csv)
                            .then( (dat)=>this.crargrafia1(svg,dat,numeroCorelacion)  );
              
                            console.log(stringCvs,csv);
                            Swal.close();
                            svg.append("text")
                            .attr("transform", "rotate(-90)")
                            .attr("y", 0 - margin.left)
                            .attr("x",0 - (height / 2))
                            .attr("dy", "1em")
                            .style("text-anchor", "middle")
                            .style("font-size", "25px")
                            .text("Diagrama de disperción ");


           
                       

 







      });















 


  }

  buscarDispercion1(objetoBusqueda:any){
    this.serviciosObservacionesEstacionService
    .seriemixtavalorCorrelacion(objetoBusqueda)
    .subscribe((response) => {
      
            

              this.vergrafica = true;


              this.valoresCorrelacion = response;
              console.log(1,this.valoresCorrelacion.multiLista,this.valoresCorrelacion.multiLista.length);

              var matrixDispercion:any = [];
              var cantidad1:any = [];
              console.log( this.valoresCorrelacion)
              var numeroCorelacion = (this.valoresCorrelacion.multiLista.length / this.listaCorrelacion.length);
                              
                                          const y:any = [];
                        for (let  i1 = 0; i1 <  this.valoresCorrelacion.multiLista[0].length; i1++) {
                            

                         
                          if(numeroCorelacion == 1){

                            var   estacion1 =  this.valoresCorrelacion.multiLista[0][i1].valorMaximo

                            var   estacion2 =  this.valoresCorrelacion.multiLista[1][i1].valorMaximo

                           matrixDispercion.push({
                              estacion1:estacion1, Species:'setosa' },
                              {
                                estacion1:estacion4,Species:'versicolor' }
                              );  

                          }




                          if(numeroCorelacion == 3){

                            var   estacion1 =  this.valoresCorrelacion.multiLista[0][i1].valorMaximo

                            var   estacion2 =  this.valoresCorrelacion.multiLista[1][i1].valorMaximo

                            var   estacion3 =  this.valoresCorrelacion.multiLista[2][i1].valorMaximo

                            var   estacion4 =  this.valoresCorrelacion.multiLista[6][i1].valorMaximo

                            var   estacion5 =  this.valoresCorrelacion.multiLista[7][i1].valorMaximo

                            var   estacion6 =  this.valoresCorrelacion.multiLista[8][i1].valorMaximo


                            


                            
                            matrixDispercion.push({
                              estacion1:estacion1, estacion2:estacion2, estacion3:estacion3,Species:'setosa' },
                              {
                                estacion1:estacion4, estacion2:estacion5, estacion3:estacion6,Species:'versicolor' }
                              );  

                          }

                      
                          if(numeroCorelacion == 2){

                            var   estacion1 =  this.valoresCorrelacion.multiLista[0][i1].valorMaximo

                            var   estacion2 =  this.valoresCorrelacion.multiLista[1][i1].valorMaximo

                            var   estacion3 =  this.valoresCorrelacion.multiLista[4][i1].valorMaximo

                            var   estacion4 =  this.valoresCorrelacion.multiLista[5][i1].valorMaximo

                            


                            
                            matrixDispercion.push({
                              estacion1:estacion1, estacion2:estacion2,Species:'setosa' },
                              {
                                estacion1:estacion4, estacion2:estacion5,Species:'versicolor' }
                              );  

                          }
                         

                          if(numeroCorelacion == 4){

                            var   estacion1 =  this.valoresCorrelacion.multiLista[0][i1].valorMaximo

                            var   estacion2 =  this.valoresCorrelacion.multiLista[1][i1].valorMaximo

                            var   estacion3 =  this.valoresCorrelacion.multiLista[2][i1].valorMaximo

                            var   estacion4 =  this.valoresCorrelacion.multiLista[3][i1].valorMaximo

                            var   estacion5 =  this.valoresCorrelacion.multiLista[8][i1].valorMaximo

                            var   estacion6 =  this.valoresCorrelacion.multiLista[9][i1].valorMaximo

                            var   estacion7 =  this.valoresCorrelacion.multiLista[10][i1].valorMaximo

                            var   estacion8 =  this.valoresCorrelacion.multiLista[11][i1].valorMaximo

                            


                            
                            matrixDispercion.push({
                              estacion1:estacion1, estacion2:estacion2, estacion3:estacion3,estacion4:estacion4,Species:'setosa' },
                              {
                                estacion1:estacion5, estacion2:estacion6, estacion3:estacion7,estacion4:estacion8,Species:'versicolor' }
                              );  

                          }


                          if(numeroCorelacion == 5){

                            var   estacion1 =  this.valoresCorrelacion.multiLista[0][i1].valorMaximo

                            var   estacion2 =  this.valoresCorrelacion.multiLista[1][i1].valorMaximo

                            var   estacion3 =  this.valoresCorrelacion.multiLista[2][i1].valorMaximo

                            var   estacion4 =  this.valoresCorrelacion.multiLista[3][i1].valorMaximo

                            var   estacion5 =  this.valoresCorrelacion.multiLista[4][i1].valorMaximo

                            var   estacion6 =  this.valoresCorrelacion.multiLista[8][i1].valorMaximo

                            var   estacion7 =  this.valoresCorrelacion.multiLista[9][i1].valorMaximo

                            var   estacion8 =  this.valoresCorrelacion.multiLista[10][i1].valorMaximo

                            var   estacion9 =  this.valoresCorrelacion.multiLista[11][i1].valorMaximo

                            var   estacion10 =  this.valoresCorrelacion.multiLista[12][i1].valorMaximo

                            
                            matrixDispercion.push({
                              estacion1:estacion1, estacion2:estacion2, estacion3:estacion3,estacion4:estacion4,estacion5:estacion5,Species:'virginica' },
                              {
                                estacion1:estacion6, estacion2:estacion7, estacion3:estacion8,estacion4:estacion9,estacion5:estacion10,Species:'color2' }
                              );  

                          }


                                            
                        }
  

                    console.log(numeroCorelacion, );


          
      
      
                  console.log(453, matrixDispercion, matrixDispercion);
      
                  var bodyMeasurements = [
                    { weight: 63, height: 1.65 },
                    { weight: 64, height: 1.67 },
                    { weight: 74, height: 1.80 },
                    { weight: 79, height: 1.82 },
                    { weight: 82, height: 1.86 },
                    { weight: 66, height: 1.70 },
                    { weight: 91, height: 1.83 },
                    { weight: 72, height: 1.76 },
                    { weight: 85, height: 1.89 },
                    { weight: 68, height: 1.68 }
                  ];
                  
                  var bodyVars = {
                    weight: 'metric',
                    height: 'metric'
                  };
                  
                  var stats = new Statistics(bodyMeasurements, bodyVars);
                  var r = stats.correlationCoefficient('weight', 'height');
                  
                  
                  var transform = stats.fisherTransformation(0.3);
                  console.log(transform);
                  
                  
                  var margin = {top: 10, right: 30, bottom: 30, left: 40},
                    width = 730 - margin.left - margin.right,
                    height = 730 - margin.top - margin.bottom;
                  
                    d31.selectAll('#serie1 svg').remove();
                 
                  var svg = d31.select("#serie1")
                  .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                  .append("g")
                    .attr("transform",
                          "translate(" + margin.left + "," + margin.top + ")");
                     
                     
                     
                       
      
              
                          
                      
                      var stringCvs =    this.jsonToCsv(matrixDispercion);
              
              
              
              
              
                       var csv = URL.createObjectURL(new Blob([
                        stringCvs
                              ]));
              
                            var  list = this.listaElementoCate.legend
              
                            console.log(list);
                              
                              d3.csv(csv)
                            .then( (dat)=>this.crargrafia3(svg,dat,numeroCorelacion)  );
              
                            console.log(stringCvs,csv);
              
                            svg.append("text")
                            .attr("transform", "rotate(-90)")
                            .attr("y", 0 - margin.left)
                            .attr("x",0 - (height / 2))
                            .attr("dy", "1em")
                            .style("text-anchor", "middle")
                            .style("font-size", "25px")
                            .text("Diagrama de disperción");



                          




 







      });















 


  }

  
  buscarDispercion2(objetoBusqueda:any){
    this.serviciosObservacionesEstacionService
    .seriemixtavalorCorrelacion(objetoBusqueda)
    .subscribe((response) => {
      
            

              this.vergrafica = true;


              this.valoresCorrelacion = response;
              console.log(1,this.valoresCorrelacion.multiLista,this.valoresCorrelacion.multiLista.length);

              var matrixDispercion:any = [];
              var cantidad1:any = [];
              console.log( this.valoresCorrelacion)
              var numeroCorelacion = (this.valoresCorrelacion.multiLista.length / this.listaCorrelacion.length);
                              
                                          const y:any = [];
                        for (let  i1 = 0; i1 <  this.valoresCorrelacion.multiLista[0].length; i1++) {
                            

                         
                          if(numeroCorelacion == 1){

                            var   estacion1 =  this.valoresCorrelacion.multiLista[0][i1].valorMaximo

                            var   estacion2 =  this.valoresCorrelacion.multiLista[1][i1].valorMaximo

                           matrixDispercion.push({
                              estacion1:estacion1, Species:'setosa' },
                              {
                                estacion1:estacion4,Species:'versicolor' }
                              );  

                          }




                          if(numeroCorelacion == 3){

                            var   estacion1 =  this.valoresCorrelacion.multiLista[0][i1].valorMaximo

                            var   estacion2 =  this.valoresCorrelacion.multiLista[1][i1].valorMaximo

                            var   estacion3 =  this.valoresCorrelacion.multiLista[2][i1].valorMaximo

                            var   estacion4 =  this.valoresCorrelacion.multiLista[6][i1].valorMaximo

                            var   estacion5 =  this.valoresCorrelacion.multiLista[7][i1].valorMaximo

                            var   estacion6 =  this.valoresCorrelacion.multiLista[8][i1].valorMaximo


                            


                            
                            matrixDispercion.push({
                              estacion1:estacion1, estacion2:estacion2, estacion3:estacion3,Species:'setosa' },
                              {
                                estacion1:estacion4, estacion2:estacion5, estacion3:estacion6,Species:'versicolor' }
                              );  

                          }

                      
                          if(numeroCorelacion == 2){

                            var   estacion1 =  this.valoresCorrelacion.multiLista[0][i1].valorMaximo

                            var   estacion2 =  this.valoresCorrelacion.multiLista[1][i1].valorMaximo

                            var   estacion3 =  this.valoresCorrelacion.multiLista[4][i1].valorMaximo

                            var   estacion4 =  this.valoresCorrelacion.multiLista[5][i1].valorMaximo

                            


                            
                            matrixDispercion.push({
                              estacion1:estacion1, estacion2:estacion2,Species:'setosa' },
                              {
                                estacion1:estacion4, estacion2:estacion5,Species:'versicolor' }
                              );  

                          }
                         

                          if(numeroCorelacion == 4){

                            var   estacion1 =  this.valoresCorrelacion.multiLista[0][i1].valorMaximo

                            var   estacion2 =  this.valoresCorrelacion.multiLista[1][i1].valorMaximo

                            var   estacion3 =  this.valoresCorrelacion.multiLista[2][i1].valorMaximo

                            var   estacion4 =  this.valoresCorrelacion.multiLista[3][i1].valorMaximo

                            var   estacion5 =  this.valoresCorrelacion.multiLista[8][i1].valorMaximo

                            var   estacion6 =  this.valoresCorrelacion.multiLista[9][i1].valorMaximo

                            var   estacion7 =  this.valoresCorrelacion.multiLista[10][i1].valorMaximo

                            var   estacion8 =  this.valoresCorrelacion.multiLista[11][i1].valorMaximo

                            


                            
                            matrixDispercion.push({
                              estacion1:estacion1, estacion2:estacion2, estacion3:estacion3,estacion4:estacion4,Species:'setosa' },
                              {
                                estacion1:estacion5, estacion2:estacion6, estacion3:estacion7,estacion4:estacion8,Species:'versicolor' }
                              );  

                          }


                          if(numeroCorelacion == 5){

                            var   estacion1 =  this.valoresCorrelacion.multiLista[0][i1].valorMaximo

                            var   estacion2 =  this.valoresCorrelacion.multiLista[1][i1].valorMaximo

                            var   estacion3 =  this.valoresCorrelacion.multiLista[2][i1].valorMaximo

                            var   estacion4 =  this.valoresCorrelacion.multiLista[3][i1].valorMaximo

                            var   estacion5 =  this.valoresCorrelacion.multiLista[4][i1].valorMaximo

                            var   estacion6 =  this.valoresCorrelacion.multiLista[8][i1].valorMaximo

                            var   estacion7 =  this.valoresCorrelacion.multiLista[9][i1].valorMaximo

                            var   estacion8 =  this.valoresCorrelacion.multiLista[10][i1].valorMaximo

                            var   estacion9 =  this.valoresCorrelacion.multiLista[11][i1].valorMaximo

                            var   estacion10 =  this.valoresCorrelacion.multiLista[12][i1].valorMaximo

                            


                            
                            matrixDispercion.push({
                              estacion1:estacion1, estacion2:estacion2, estacion3:estacion3,estacion4:estacion4,estacion5:estacion5,Species:'setosa' },
                              {
                                estacion1:estacion6, estacion2:estacion7, estacion3:estacion8,estacion4:estacion9,estacion5:estacion10,Species:'versicolor' }
                              );  

                          }


                                            
                        }
  

                    console.log(numeroCorelacion, );


          
      
      
                  console.log(453, matrixDispercion, matrixDispercion);
      
                  var bodyMeasurements = [
                    { weight: 63, height: 1.65 },
                    { weight: 64, height: 1.67 },
                    { weight: 74, height: 1.80 },
                    { weight: 79, height: 1.82 },
                    { weight: 82, height: 1.86 },
                    { weight: 66, height: 1.70 },
                    { weight: 91, height: 1.83 },
                    { weight: 72, height: 1.76 },
                    { weight: 85, height: 1.89 },
                    { weight: 68, height: 1.68 }
                  ];
                  
                  var bodyVars = {
                    weight: 'metric',
                    height: 'metric'
                  };
                  
                  var stats = new Statistics(bodyMeasurements, bodyVars);
                  var r = stats.correlationCoefficient('weight', 'height');
                  
                  
                  var transform = stats.fisherTransformation(0.3);
                  console.log(transform);
                  
                  
                  var margin = {top: 10, right: 30, bottom: 30, left: 40},
                    width = 730 - margin.left - margin.right,
                    height = 730 - margin.top - margin.bottom;
                  
                  
                    d3.selectAll('#serie2 svg').remove();
                  var svg = d3.select("#serie2")
                  .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                  .append("g")
                    .attr("transform",
                          "translate(" + margin.left + "," + margin.top + ")");
                     
                     
                     
                       
      
              
                          
                      
                      var stringCvs =    this.jsonToCsv(matrixDispercion);
              
              
              
              
              
                       var csv = URL.createObjectURL(new Blob([
                        stringCvs
                              ]));
              
                            var  list = this.listaElementoCate.legend
              
                            console.log(list);
                              
                              d3.csv(csv)
                            .then( (dat)=>this.crargrafia1(svg,dat,numeroCorelacion)  );
              
                            console.log(stringCvs,csv);
              
                            svg.append("text")
                            .attr("transform", "rotate(-90)")
                            .attr("y", 0 - margin.left)
                            .attr("x",0 - (height / 2))
                            .attr("dy", "1em")
                            .style("text-anchor", "middle")
                            .style("font-size", "25px")
                            .text("Diagrama de disperción");




 







      });















 


  }

  buscarDispercion3(objetoBusqueda:any){
    this.serviciosObservacionesEstacionService
    .seriemixtavalorCorrelacion(objetoBusqueda)
    .subscribe((response) => {
      
            

              this.vergrafica = true;


              this.valoresCorrelacion = response;
              console.log(1,this.valoresCorrelacion.multiLista,this.valoresCorrelacion.multiLista.length);

              var matrixDispercion:any = [];
              var cantidad1:any = [];
              console.log( this.valoresCorrelacion)
              var numeroCorelacion = (this.valoresCorrelacion.multiLista.length / this.listaCorrelacion.length);
                              
                                          const y:any = [];
                        for (let  i1 = 0; i1 <  this.valoresCorrelacion.multiLista[0].length; i1++) {
                            

                         
                          if(numeroCorelacion == 1){

                            var   estacion1 =  this.valoresCorrelacion.multiLista[0][i1].valorMaximo

                            var   estacion2 =  this.valoresCorrelacion.multiLista[1][i1].valorMaximo

                           matrixDispercion.push({
                              estacion1:estacion1, Species:'setosa' },
                              {
                                estacion1:estacion4,Species:'versicolor' }
                              );  

                          }




                          if(numeroCorelacion == 3){

                            var   estacion1 =  this.valoresCorrelacion.multiLista[0][i1].valorMaximo

                            var   estacion2 =  this.valoresCorrelacion.multiLista[1][i1].valorMaximo

                            var   estacion3 =  this.valoresCorrelacion.multiLista[2][i1].valorMaximo

                            var   estacion4 =  this.valoresCorrelacion.multiLista[6][i1].valorMaximo

                            var   estacion5 =  this.valoresCorrelacion.multiLista[7][i1].valorMaximo

                            var   estacion6 =  this.valoresCorrelacion.multiLista[8][i1].valorMaximo


                            


                            
                            matrixDispercion.push({
                              estacion1:estacion1, estacion2:estacion2, estacion3:estacion3,Species:'setosa' },
                              {
                                estacion1:estacion4, estacion2:estacion5, estacion3:estacion6,Species:'versicolor' }
                              );  

                          }

                      
                          if(numeroCorelacion == 2){

                            var   estacion1 =  this.valoresCorrelacion.multiLista[0][i1].valorMaximo

                            var   estacion2 =  this.valoresCorrelacion.multiLista[1][i1].valorMaximo

                            var   estacion3 =  this.valoresCorrelacion.multiLista[4][i1].valorMaximo

                            var   estacion4 =  this.valoresCorrelacion.multiLista[5][i1].valorMaximo

                            


                            
                            matrixDispercion.push({
                              estacion1:estacion1, estacion2:estacion2,Species:'setosa' },
                              {
                                estacion1:estacion4, estacion2:estacion5,Species:'versicolor' }
                              );  

                          }
                         

                          if(numeroCorelacion == 4){

                            var   estacion1 =  this.valoresCorrelacion.multiLista[0][i1].valorMaximo

                            var   estacion2 =  this.valoresCorrelacion.multiLista[1][i1].valorMaximo

                            var   estacion3 =  this.valoresCorrelacion.multiLista[2][i1].valorMaximo

                            var   estacion4 =  this.valoresCorrelacion.multiLista[3][i1].valorMaximo

                            var   estacion5 =  this.valoresCorrelacion.multiLista[8][i1].valorMaximo

                            var   estacion6 =  this.valoresCorrelacion.multiLista[9][i1].valorMaximo

                            var   estacion7 =  this.valoresCorrelacion.multiLista[10][i1].valorMaximo

                            var   estacion8 =  this.valoresCorrelacion.multiLista[11][i1].valorMaximo

                            


                            
                            matrixDispercion.push({
                              estacion1:estacion1, estacion2:estacion2, estacion3:estacion3,estacion4:estacion4,Species:'setosa' },
                              {
                                estacion1:estacion5, estacion2:estacion6, estacion3:estacion7,estacion4:estacion8,Species:'versicolor' }
                              );  

                          }


                          if(numeroCorelacion == 5){

                            var   estacion1 =  this.valoresCorrelacion.multiLista[0][i1].valorMaximo

                            var   estacion2 =  this.valoresCorrelacion.multiLista[1][i1].valorMaximo

                            var   estacion3 =  this.valoresCorrelacion.multiLista[2][i1].valorMaximo

                            var   estacion4 =  this.valoresCorrelacion.multiLista[3][i1].valorMaximo

                            var   estacion5 =  this.valoresCorrelacion.multiLista[4][i1].valorMaximo

                            var   estacion6 =  this.valoresCorrelacion.multiLista[8][i1].valorMaximo

                            var   estacion7 =  this.valoresCorrelacion.multiLista[9][i1].valorMaximo

                            var   estacion8 =  this.valoresCorrelacion.multiLista[10][i1].valorMaximo

                            var   estacion9 =  this.valoresCorrelacion.multiLista[11][i1].valorMaximo

                            var   estacion10 =  this.valoresCorrelacion.multiLista[12][i1].valorMaximo

                            


                            
                            matrixDispercion.push({
                              estacion1:estacion1, estacion2:estacion2, estacion3:estacion3,estacion4:estacion4,estacion5:estacion5,Species:'setosa' },
                              {
                                estacion1:estacion6, estacion2:estacion7, estacion3:estacion8,estacion4:estacion9,estacion5:estacion10,Species:'versicolor' }
                              );  

                          }


                                            
                        }
  

                    console.log(numeroCorelacion, );


          
      
      
                  console.log(453, matrixDispercion, matrixDispercion);
      
                  var bodyMeasurements = [
                    { weight: 63, height: 1.65 },
                    { weight: 64, height: 1.67 },
                    { weight: 74, height: 1.80 },
                    { weight: 79, height: 1.82 },
                    { weight: 82, height: 1.86 },
                    { weight: 66, height: 1.70 },
                    { weight: 91, height: 1.83 },
                    { weight: 72, height: 1.76 },
                    { weight: 85, height: 1.89 },
                    { weight: 68, height: 1.68 }
                  ];
                  
                  var bodyVars = {
                    weight: 'metric',
                    height: 'metric'
                  };
                  
                  var stats = new Statistics(bodyMeasurements, bodyVars);
                  var r = stats.correlationCoefficient('weight', 'height');
                  
                  
                  var transform = stats.fisherTransformation(0.3);
                  console.log(transform);
                  
                  
                  var margin = {top: 10, right: 30, bottom: 30, left: 40},
                    width = 730 - margin.left - margin.right,
                    height = 730 - margin.top - margin.bottom;
                  
                  
                    d31.selectAll('#serie3 svg').remove();
                  var svg = d31.select("#serie3")
                  .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                  .append("g")
                    .attr("transform",
                          "translate(" + margin.left + "," + margin.top + ")");
                     
                     
                     
                       
      
              
                          
                      
                      var stringCvs =    this.jsonToCsv(matrixDispercion);
              
              
              
              
              
                       var csv = URL.createObjectURL(new Blob([
                        stringCvs
                              ]));
              
                            var  list = this.listaElementoCate.legend
              
                            console.log(list);
                              
                              d3.csv(csv)
                            .then( (dat)=>this.crargrafia1(svg,dat,numeroCorelacion)  );
              
                            console.log(stringCvs,csv);
              
                            svg.append("text")
                            .attr("transform", "rotate(-90)")
                            .attr("y", 0 - margin.left)
                            .attr("x",0 - (height / 2))
                            .attr("dy", "1em")
                            .style("text-anchor", "middle")
                            .style("font-size", "25px")
                            .text("Diagrama de disperción");




 







      });















 


  }  
       
  buscarDispercion4(objetoBusqueda:any){
    this.serviciosObservacionesEstacionService
    .seriemixtavalorCorrelacion(objetoBusqueda)
    .subscribe((response) => {
      
            

              this.vergrafica = true;


              this.valoresCorrelacion = response;
              console.log(1,this.valoresCorrelacion.multiLista,this.valoresCorrelacion.multiLista.length);

              var matrixDispercion:any = [];
              var cantidad1:any = [];
              console.log( this.valoresCorrelacion)
              var numeroCorelacion = (this.valoresCorrelacion.multiLista.length / this.listaCorrelacion.length);
                              
                                          const y:any = [];
                        for (let  i1 = 0; i1 <  this.valoresCorrelacion.multiLista[0].length; i1++) {
                            

                         
                          if(numeroCorelacion == 1){

                            var   estacion1 =  this.valoresCorrelacion.multiLista[0][i1].valorMaximo

                            var   estacion2 =  this.valoresCorrelacion.multiLista[1][i1].valorMaximo

                           matrixDispercion.push({
                              estacion1:estacion1, Species:'setosa' },
                              {
                                estacion1:estacion4,Species:'versicolor' }
                              );  

                          }




                          if(numeroCorelacion == 3){

                            var   estacion1 =  this.valoresCorrelacion.multiLista[0][i1].valorMaximo

                            var   estacion2 =  this.valoresCorrelacion.multiLista[1][i1].valorMaximo

                            var   estacion3 =  this.valoresCorrelacion.multiLista[2][i1].valorMaximo

                            var   estacion4 =  this.valoresCorrelacion.multiLista[6][i1].valorMaximo

                            var   estacion5 =  this.valoresCorrelacion.multiLista[7][i1].valorMaximo

                            var   estacion6 =  this.valoresCorrelacion.multiLista[8][i1].valorMaximo


                            


                            
                            matrixDispercion.push({
                              estacion1:estacion1, estacion2:estacion2, estacion3:estacion3,Species:'setosa' },
                              {
                                estacion1:estacion4, estacion2:estacion5, estacion3:estacion6,Species:'versicolor' }
                              );  

                          }

                      
                          if(numeroCorelacion == 2){

                            var   estacion1 =  this.valoresCorrelacion.multiLista[0][i1].valorMaximo

                            var   estacion2 =  this.valoresCorrelacion.multiLista[1][i1].valorMaximo

                            var   estacion3 =  this.valoresCorrelacion.multiLista[4][i1].valorMaximo

                            var   estacion4 =  this.valoresCorrelacion.multiLista[5][i1].valorMaximo

                            


                            
                            matrixDispercion.push({
                              estacion1:estacion1, estacion2:estacion2,Species:'setosa' },
                              {
                                estacion1:estacion4, estacion2:estacion5,Species:'versicolor' }
                              );  

                          }
                         

                          if(numeroCorelacion == 4){

                            var   estacion1 =  this.valoresCorrelacion.multiLista[0][i1].valorMaximo

                            var   estacion2 =  this.valoresCorrelacion.multiLista[1][i1].valorMaximo

                            var   estacion3 =  this.valoresCorrelacion.multiLista[2][i1].valorMaximo

                            var   estacion4 =  this.valoresCorrelacion.multiLista[3][i1].valorMaximo

                            var   estacion5 =  this.valoresCorrelacion.multiLista[8][i1].valorMaximo

                            var   estacion6 =  this.valoresCorrelacion.multiLista[9][i1].valorMaximo

                            var   estacion7 =  this.valoresCorrelacion.multiLista[10][i1].valorMaximo

                            var   estacion8 =  this.valoresCorrelacion.multiLista[11][i1].valorMaximo

                            


                            
                            matrixDispercion.push({
                              estacion1:estacion1, estacion2:estacion2, estacion3:estacion3,estacion4:estacion4,Species:'setosa' },
                              {
                                estacion1:estacion5, estacion2:estacion6, estacion3:estacion7,estacion4:estacion8,Species:'versicolor' }
                              );  

                          }


                          if(numeroCorelacion == 5){

                            var   estacion1 =  this.valoresCorrelacion.multiLista[0][i1].valorMaximo

                            var   estacion2 =  this.valoresCorrelacion.multiLista[1][i1].valorMaximo

                            var   estacion3 =  this.valoresCorrelacion.multiLista[2][i1].valorMaximo

                            var   estacion4 =  this.valoresCorrelacion.multiLista[3][i1].valorMaximo

                            var   estacion5 =  this.valoresCorrelacion.multiLista[4][i1].valorMaximo

                            var   estacion6 =  this.valoresCorrelacion.multiLista[8][i1].valorMaximo

                            var   estacion7 =  this.valoresCorrelacion.multiLista[9][i1].valorMaximo

                            var   estacion8 =  this.valoresCorrelacion.multiLista[10][i1].valorMaximo

                            var   estacion9 =  this.valoresCorrelacion.multiLista[11][i1].valorMaximo

                            var   estacion10 =  this.valoresCorrelacion.multiLista[12][i1].valorMaximo

                            


                            
                            matrixDispercion.push({
                              estacion1:estacion1, estacion2:estacion2, estacion3:estacion3,estacion4:estacion4,estacion5:estacion5,Species:'setosa' },
                              {
                                estacion1:estacion6, estacion2:estacion7, estacion3:estacion8,estacion4:estacion9,estacion5:estacion10,Species:'versicolor' }
                              );  

                          }


                                            
                        }
  

                    console.log(numeroCorelacion, );


          
      
      
                  console.log(453, matrixDispercion, matrixDispercion);
      
                  var bodyMeasurements = [
                    { weight: 63, height: 1.65 },
                    { weight: 64, height: 1.67 },
                    { weight: 74, height: 1.80 },
                    { weight: 79, height: 1.82 },
                    { weight: 82, height: 1.86 },
                    { weight: 66, height: 1.70 },
                    { weight: 91, height: 1.83 },
                    { weight: 72, height: 1.76 },
                    { weight: 85, height: 1.89 },
                    { weight: 68, height: 1.68 }
                  ];
                  
                  var bodyVars = {
                    weight: 'metric',
                    height: 'metric'
                  };
                  
                  var stats = new Statistics(bodyMeasurements, bodyVars);
                  var r = stats.correlationCoefficient('weight', 'height');
                  
                  
                  var transform = stats.fisherTransformation(0.3);
                  console.log(transform);
                  
                  
                  var margin = {top: 10, right: 30, bottom: 30, left: 40},
                    width = 730 - margin.left - margin.right,
                    height = 730 - margin.top - margin.bottom;
                  
                  
                 
                    d31.selectAll('#serie4 svg').remove();
                  var svg = d31.select("#serie4")
                  .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                  .append("g")
                    .attr("transform",
                          "translate(" + margin.left + "," + margin.top + ")");
                     
                     
                     
                       
      
              
                          
                      
                      var stringCvs =    this.jsonToCsv(matrixDispercion);
              
              
              
              
              
                       var csv = URL.createObjectURL(new Blob([
                        stringCvs
                              ]));
              
                            var  list = this.listaElementoCate.legend
              
                            console.log(list);
                              
                              d3.csv(csv)
                            .then( (dat)=>this.crargrafia1(svg,dat,numeroCorelacion)  );
              
                            console.log(stringCvs,csv);
              
                            svg.append("text")
                            .attr("transform", "rotate(-90)")
                            .attr("y", 0 - margin.left)
                            .attr("x",0 - (height / 2))
                            .attr("dy", "1em")
                            .style("text-anchor", "middle")
                            .style("font-size", "25px")
                            .text("Diagrama de disperción");




 







      });















 


  }             

  filtrar(elemento: any) {
    console.log(elemento);
    var objetoBusqueda: any;
  
        const dateInicio = this.formularioFiltros.value.fechaInicio;
        const [year, month, day] = dateInicio.split('-');
    
        const dateFin = this.formularioFiltros.value.fechaFin;
        const [year1, month1, day1] = dateFin.split('-');
        this.formularioFiltros.value.fechaInicio1 = `${day}-${month}-${year}`;
        this.formularioFiltros.value.fechaFin1 = `${day1}-${month1}-${year1}`;
        this.formularioFiltros.value.listaParametrosCorrelacionado = this.listaCorrelacion;
        this.formularioFiltros.value.listaElementosDestacados = this.listaItemsElementos;
        this.formularioFiltros.value.idElementoString  =  this.formularioFiltros.value.idElemento ;
        console.log(this.formularioFiltros.valid);
        try {
          if (this.formularioFiltros.valid) {
            
            Swal.fire({
              title: 'Cargando información...',
              html: 'Por favor espere',
              timerProgressBar: true,
              didOpen: () => {
                Swal.showLoading();
                switch (elemento) {
                  case '466': {
                    this.formularioFiltros.value.listaElementos =
                      this.listaBusqueda.map((elemento: any) => elemento.idEstacion);
                    this.formularioFiltros.value.listParametros =
                      this.listParametroXElemento;
                      objetoBusqueda = this.formularioFiltros.value;
                      objetoBusqueda.tipoElemento = elemento;
                
                        
                    

                      this.serviciosObservacionesEstacionService
                      .seriemixtavalor(objetoBusqueda)
                      .subscribe((response) => {

                               
                
                              
                            

                                this.valores = response;

                                if( !this.valores[0]['valorMaximo']){


                                
                                  Swal.close();

                                  Swal.fire(
                                    'Serie Mixta',
                                    'No hay información! ',
                                    'error'
                                  );


                                }else{


                                  this.vergrafica = true;


                              


                                if(this.metodo == 1){
                                  this.crearGrafica();

                                }

                                if(this.metodo == 2){
                                  this.crearGrafica2();
                                

                                }
                                if(this.metodo  == 3){
                                  this.crearGrafica3(); 

                                }
                                

                                for (
                                  let index = 0;
                                index < this.listaCorrelacion.length;
                                  index++
                                    ) {
                                switch (index) {
                              
                                case 1: {

                           

                                  this.buscarDispercion(objetoBusqueda);

                              
                                  break;
                                }
                                
                                case 2: {

                                  this.buscarDispercion1(objetoBusqueda);
                              
                                  break;
                                }
                                
                                case 3: {

                                  this.buscarDispercion2(objetoBusqueda);
                              
                                  break;
                                }
                                
                                case 4: {

                                  this.buscarDispercion3(objetoBusqueda);
                              
                                  break;
                                }
                                
                                case 5: {

                                  
                                  this.buscarDispercion4(objetoBusqueda);
                                  break;
                                }
                                  
                                
                                default: {
                                  
                
                                }
                              }

                            }
                
                      }



                              
              
                  






                  
                        });

                      
                
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
              },
              willClose: () => {
                this.toast.fire({
                  icon: 'success',
                  title: 'Se Actualizo la Serie de tiempo ',
                });
    
              
              },
            }).then((result) => {});
      
          }     
        } catch (error) {
          Swal.hideLoading();
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

  update(source:any) {
    let i = 0;
    let duration = 750;

    let treeData = this.treeLayout(this.root);
    let nodes = treeData.descendants();
    let links = treeData.descendants().slice(1);

    nodes.forEach((d:any)  => d.y = d.depth * 180);

    let node = this.svg.selectAll("g.node")
        .data(nodes, (d:any)  =>  d.id || (d.id = ++i) );

    let nodeEnter = node.enter().append("g")
        .attr("class", "node")
        .attr("transform", (d:any)  => "translate(" + source.y0 + "," + source.x0 + ")")
        .on("click", this.click);

    nodeEnter.append("circle")
        .attr("class", "node")
        .attr("r", 1e-6)
        .style("fill", (d:any)  => d._children ? "lightsteelblue" : "#fff");

    let nodeUpdate = nodeEnter.merge(node);

    nodeUpdate.transition()
        .duration(duration)
        .attr("transform", (d:any)  => "translate(" + d.y + "," + d.x + ")");

    nodeUpdate.select("circle.node")
        .attr("r", 10)
        .style("fill", (d:any)  => d._children ? "lightsteelblue" : "#fff")
        .attr("cursor", "pointer");

    let nodeExit = node.exit().transition()
        .duration(duration)
        .attr("transform", (d:any)  => "translate(" + source.y + "," + source.x + ")")
        .remove();

    nodeExit.select("circle")
        .attr("r", 1e-6);

    nodeExit.select("text")
        .style("fill-opacity", 1e-6);

    let link = this.svg.selectAll("path.link")
        .data(links, (d:any)  => d.id);

    let linkEnter = link.enter().insert("path", "g")
        .attr("class", "link")
        .attr("d", (d:any)  => {
            let o = { x: source.x0, y: source.y0 };
            return this.diagonal(o, o);
        });

    let linkUpdate = linkEnter.merge(link);

    linkUpdate.transition()
        .duration(duration)
        .attr("d", (d:any)  => {
            return this.diagonal(d, d.parent)
        });

    let linkExit = link.exit().transition()
        .duration(duration)
        .attr("d", (d:any)  => {
            let o = { x: source.x, y: source.y };
            return this.diagonal(o, o);
        })
        .remove();

    nodes.forEach((d:any) => {
        d.x0 = d.x;
        d.y0 = d.y;
    });

}

click(d:any) {
    if (d.children) {
        d._children = d.children;
        d.children = null;
    } else {
        d.children = d._children;
        d._children = null;
    }

    this.update(d);
}

diagonal(s:any, d:any) {
    let path = `M ${s.y} ${s.x}
            C ${(s.y + d.y) / 2} ${s.x},
              ${(s.y + d.y) / 2} ${d.x},
              ${d.y} ${d.x}`

    return path;
}
crargrafia ( svg:any,data:any){

  
  this.htmlElement = this.elementRef.nativeElement;  // reference to <bar-graph> element from the main template
  console.log(this.htmlElement);
  console.log(D3);

  var marginWhole = {top: 10, right: 10, bottom: 10, left: 10},
  sizeWhole = 640 - marginWhole.left - marginWhole.right
  let d3:any = D3;
// Create the svg area
var height =  3233;
var allVar = ["estacion1", "estacion2", "estacion3", "estacion4", "estacion5"]
var numVar = allVar.length

// Now I can compute the size of a single chart
var  mar = 20
var  size = sizeWhole / numVar


// ----------------- //
// Scales
// ----------------- //

// Create a scale: gives the position of each pair each variable
var position = d3.scalePoint()
  .domain(allVar)
  .range([0, sizeWhole-size])

// Color scale: give me a specie name, I return a color
var color = d3.scaleOrdinal()
  .domain(["setosa", "versicolor", "virginica" ])
  .range([ "#8FD175", "#D18975", "#8FD175"])


// ------------------------------- //
// Add charts
// ------------------------------- //
for (i in allVar){
  for (j in allVar){

    // Get current variable name
    var var1 = allVar[i]
    var var2 = allVar[j]

    // If var1 == var2 i'm on the diagonal, I skip that
    if (var1 === var2) { continue; }

    // Add X Scale of each graph
  var   xextent:any = d3.extent(data, function(d:any) { return +d[var1] })
    var x = d3.scaleLinear()
      .domain(xextent).nice()
      .range([ 0, size-2*mar ]);

    // Add Y Scale of each graph
   var  yextent = d3.extent(data, function(d:any) { return +d[var2] })
    var y = d3.scaleLinear()
      .domain(yextent).nice()
      .range([ size-2*mar, 0 ]);

    // Add a 'g' at the right position
    var tmp = svg
      .append('g')
      .attr("transform", "translate(" + (position(var1)+mar) + "," + (position(var2)+mar) + ")");

    // Add X and Y axis in tmp
    tmp.append("g")
      .attr("transform", "translate(" + 0 + "," + (size-mar*2) + ")")
      .call(d3.axisBottom(x).ticks(3));
    tmp.append("g")
      .call(d3.axisLeft(y).ticks(3));

    // Add circle
    tmp
      .selectAll("myCircles")
      .data(data)
      .enter()
      .append("circle")
        .attr("cx", function(d:any){ return x(+d[var1]) })
        .attr("cy", function(d:any){ return y(+d[var2]) })
        .attr("r", 1)
        .attr("fill", function(d:any){ return color(d.Species)})
  }
}


// ------------------------------- //
// Add histograms = diagonal
// ------------------------------- //
var i:any;
var j:any;
for (i in allVar){
  for (j in allVar){

    // variable names
    var var1 = allVar[i]
    var var2 = allVar[j]

    // If var1 == var2 i'm on the diagonal, otherwisee I skip
    if (i != j) { continue; }

    // create X Scale
    xextent = d3.extent(data, function(d:any) { return +d[var1] })
    var x = d3.scaleLinear()
      .domain(xextent).nice()
      .range([ 0, size-2*mar ]);

    // Add a 'g' at the right position
    var tmp = svg
      .append('g')
      .attr("transform", "translate(" + (position(var1)+mar) + "," + (position(var2)+mar) + ")");

    // Add x axis
    tmp.append("g")
      .attr("transform", "translate(" + 0 + "," + (size-mar*2) + ")")
      .call(d3.axisBottom(x).ticks(3));

    // set the parameters for the histogram
     var histogram = d3.histogram()
         .value(function(d:any) { return +d[var1]; })   // I need to give the vector of value
         .domain(x.domain())  // then the domain of the graphic
         .thresholds(x.ticks(15)); // then the numbers of bins

     // And apply this function to data to get the bins
     var bins = histogram(data);

     // Y axis: scale and draw:
     var y = d3.scaleLinear()
          .range([ size-2*mar, 0 ])
          .domain([0, d3.max(bins, function(d:any) { return d.length; })]);   // d3.hist has to be called before the Y axis obviously
          var line = d3.line().curve(d3.curveBasis)
          .x(function (d:any) {
            return x(d.date);
          })
          .y(function (d:any) {
            return y(d.sales);
          });
     // append the bar rectangles to the svg element
     tmp.append('g')
        .selectAll("rect")
        .data(bins)
        .enter()
        .append("rect")
           .attr("x", 1)
           .attr("transform", function(d:any) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
           .attr("width", function(d:any) { return x(d.x1) - x(d.x0)  ; })
           .attr("height", function(d:any) { return (size-2*mar) - y(d.length); })
           .style("fill", "#b8b8b8")
           .attr("stroke", "white")
  }
}

}

crargrafia1 ( svg:any,data:any ,listaParaemtros:number){
console.log(svg,data);
  
  this.htmlElement = this.elementRef.nativeElement;  // reference to <bar-graph> element from the main template
  console.log(this.htmlElement);
  console.log(D3);

  var marginWhole = {top: 30, right: 30, bottom: 30, left: 30},
  sizeWhole = 640 - marginWhole.left - marginWhole.right
  let d3:any = D3;
// Create the svg area
var height =  4000;
  var allVar:any =[];
  if(listaParaemtros==1){
    allVar = ["estacion1"]
 
 }

if(listaParaemtros==2){
   allVar = ["estacion1", "estacion2"]

}
if(listaParaemtros==3){
   allVar = ["estacion1", "estacion2", "estacion3"]

}
if(listaParaemtros==4){
     allVar = ["estacion1", "estacion2", "estacion3", "estacion4"]

}

if(listaParaemtros==5){
   allVar = ["estacion1", "estacion2", "estacion3", "estacion4", "estacion5"]

}


var numVar = allVar.length

// Now I can compute the size of a single chart
var  mar = 20
var  size = sizeWhole / numVar


// ----------------- //
// Scales
// ----------------- //

// Create a scale: gives the position of each pair each variable
var position = d3.scalePoint()
  .domain(allVar)
  .range([0, sizeWhole-size])

// Color scale: give me a specie name, I return a color
var color = d3.scaleOrdinal()
  .domain(["setosa", "versicolor", "virginica", "color2"  ])
  .range([ "#221CE5", "#EC2020", "#000" , "#796ce1"  ])


// ------------------------------- //
// Add charts
// ------------------------------- //
for (i in allVar){
  for (j in allVar){

    // Get current variable name
    var var1 = allVar[i]
    var var2 = allVar[j]

    // If var1 == var2 i'm on the diagonal, I skip that
    if (var1 === var2) { continue; }

    // Add X Scale of each graph
  var   xextent:any = d3.extent(data, function(d:any) { return +d[var1] })
    var x = d3.scaleLinear()
      .domain(xextent).nice()
      .range([ 0, size-2*mar ]);

    // Add Y Scale of each graph
   var  yextent = d3.extent(data, function(d:any) { return +d[var2] })
    var y = d3.scaleLinear()
      .domain(yextent).nice()
      .range([ size-2*mar, 0 ]);

    // Add a 'g' at the right position
    var tmp = svg
      .append('g')
      .attr("transform", "translate(" + (position(var1)+mar) + "," + (position(var2)+mar) + ")");
      

    // Add X and Y axis in tmp
    tmp.append("g")
      .attr("transform", "translate(" + 0 + "," + (size-mar*2) + ")")
      .call(d3.axisBottom(x).ticks(3));
    tmp.append("g")
      .call(d3.axisLeft(y).ticks(3));

    // Add circle
    tmp
      .selectAll("myCircles")
      .data(data)
      .enter()
      .append("circle")
        .attr("cx", function(d:any){ return x(+d[var1]) })
        .attr("cy", function(d:any){ return y(+d[var2]) })
        .attr("r", 1)
        .attr("fill", function(d:any){ return color(d.Species)})



  }
}


// ------------------------------- //
// Add histograms = diagonal
// ------------------------------- //
var i:any;
var j:any;
for (i in allVar){
  for (j in allVar){

    // variable names
    var var1 = allVar[i]
    var var2 = allVar[j]

    // If var1 == var2 i'm on the diagonal, otherwisee I skip
    if (i != j) { continue; }

    // create X Scale
    xextent = d3.extent(data, function(d:any) { return +d[var1] })
    var x = d3.scaleLinear()
      .domain(xextent).nice()
      .range([ 0, size-2*mar ]);

    // Add a 'g' at the right position
    var tmp = svg
      .append('g')
      .attr("transform", "translate(" + (position(var1)+mar) + "," + (position(var2)+mar) + ")");
      

    // Add x axis
    tmp.append("g")
      .attr("transform", "translate(" + 0 + "," + (size-mar*2) + ")")
      .call(d3.axisBottom(x).ticks(3));

    // set the parameters for the histogram
     var histogram = d3.histogram()
         .value(function(d:any) { return +d[var1]; })   // I need to give the vector of value
         .domain(x.domain())  // then the domain of the graphic
         .thresholds(x.ticks(15)); // then the numbers of bins

     // And apply this function to data to get the bins
     var bins = histogram(data);

     // Y axis: scale and draw:
     var y = d3.scaleLinear()
          .range([ size-2*mar, 0 ])
          .domain([0, d3.max(bins, function(d:any) { return d.length; })]);   // d3.hist has to be called before the Y axis obviously
          var line = d3.line().curve(d3.curveBasis)
          .x(function (d:any) {
            return x(d.date);
          })
          .y(function (d:any) {
            return y(d.sales);
          });

          
     // append the bar rectangles to the svg element
     tmp.append('g')
        .selectAll("rect")
        .data(bins)
        .enter()
        .append("rect")
           .attr("x", 1)
           .attr("transform", function(d:any) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
           .attr("width", function(d:any) { return x(d.x1) - x(d.x0)  ; })
           .attr("height", function(d:any) { return (size-2*mar) - y(d.length); })
           .style("fill", "#b8b8b8")
           .attr("stroke", "white")


           svg.append('g')
           .attr("transform", "translate(" + position(var1) + "," + position(var2) + ")")
           .append('text')
            .attr("x", -100)
              .attr("y", -10)
           .attr("transform", "rotate(-90)")
           .attr("dy", "1em")
           .style("text-anchor", "middle")
           .style("font-size", "15px")
           .text(this.listaElementoCate[i]);


           svg.append("text")
           .attr("x", 210)
           .attr("y", 10)
           .attr("text-anchor", "middle")
           .style("font-size", "18px")
           .text(" " +this.listaCorrelacion[0]['parametro'] +" vs "+this.listaCorrelacion[1]['parametro']      );
  }
}

}


crargrafia2 ( svg:any,data:any ,listaParaemtros:number){
  console.log(svg,data);
    
    this.htmlElement = this.elementRef.nativeElement;  // reference to <bar-graph> element from the main template
    console.log(this.htmlElement);
    console.log(D3);
  
    var marginWhole = {top: 30, right: 30, bottom: 30, left: 30},
    sizeWhole = 640 - marginWhole.left - marginWhole.right
    let d3:any = D3;
  // Create the svg area
  var height =  4000;
    var allVar:any =[];
    if(listaParaemtros==1){
      allVar = ["estacion1"]
   
   }
  
  if(listaParaemtros==2){
     allVar = ["estacion1", "estacion2"]
  
  }
  if(listaParaemtros==3){
     allVar = ["estacion1", "estacion2", "estacion3"]
  
  }
  if(listaParaemtros==4){
       allVar = ["estacion1", "estacion2", "estacion3", "estacion4"]
  
  }
  
  if(listaParaemtros==5){
     allVar = ["estacion1", "estacion2", "estacion3", "estacion4", "estacion5"]
  
  }
  
  
  var numVar = allVar.length
  
  // Now I can compute the size of a single chart
  var  mar = 20
  var  size = sizeWhole / numVar
  
  
  // ----------------- //
  // Scales
  // ----------------- //
  
  // Create a scale: gives the position of each pair each variable
  var position = d3.scalePoint()
    .domain(allVar)
    .range([0, sizeWhole-size])
  
  // Color scale: give me a specie name, I return a color
  var color = d3.scaleOrdinal()
    .domain(["setosa", "versicolor", "virginica", "color2"  ])
    .range([ "#221CE5", "#EC2020", "#000" , "#796ce1"  ])
  
  
  // ------------------------------- //
  // Add charts
  // ------------------------------- //
  for (i in allVar){
    for (j in allVar){
  
      // Get current variable name
      var var1 = allVar[i]
      var var2 = allVar[j]
  
      // If var1 == var2 i'm on the diagonal, I skip that
      if (var1 === var2) { continue; }
  
      // Add X Scale of each graph
    var   xextent:any = d3.extent(data, function(d:any) { return +d[var1] })
      var x = d3.scaleLinear()
        .domain(xextent).nice()
        .range([ 0, size-2*mar ]);
  
      // Add Y Scale of each graph
     var  yextent = d3.extent(data, function(d:any) { return +d[var2] })
      var y = d3.scaleLinear()
        .domain(yextent).nice()
        .range([ size-2*mar, 0 ]);
  
      // Add a 'g' at the right position
      var tmp = svg
        .append('g')
        .attr("transform", "translate(" + (position(var1)+mar) + "," + (position(var2)+mar) + ")");
        
  
      // Add X and Y axis in tmp
      tmp.append("g")
        .attr("transform", "translate(" + 0 + "," + (size-mar*2) + ")")
        .call(d3.axisBottom(x).ticks(3));
      tmp.append("g")
        .call(d3.axisLeft(y).ticks(3));
  
      // Add circle
      tmp
        .selectAll("myCircles")
        .data(data)
        .enter()
        .append("circle")
          .attr("cx", function(d:any){ return x(+d[var1]) })
          .attr("cy", function(d:any){ return y(+d[var2]) })
          .attr("r", 1)
          .attr("fill", function(d:any){ return color(d.Species)})
  
  
  
    }
  }
  
  
  // ------------------------------- //
  // Add histograms = diagonal
  // ------------------------------- //
  var i:any;
  var j:any;
  for (i in allVar){
    for (j in allVar){
  
      // variable names
      var var1 = allVar[i]
      var var2 = allVar[j]
  
      // If var1 == var2 i'm on the diagonal, otherwisee I skip
      if (i != j) { continue; }
  
      // create X Scale
      xextent = d3.extent(data, function(d:any) { return +d[var1] })
      var x = d3.scaleLinear()
        .domain(xextent).nice()
        .range([ 0, size-2*mar ]);
  
      // Add a 'g' at the right position
      var tmp = svg
        .append('g')
        .attr("transform", "translate(" + (position(var1)+mar) + "," + (position(var2)+mar) + ")");
        
  
      // Add x axis
      tmp.append("g")
        .attr("transform", "translate(" + 0 + "," + (size-mar*2) + ")")
        .call(d3.axisBottom(x).ticks(3));
  
      // set the parameters for the histogram
       var histogram = d3.histogram()
           .value(function(d:any) { return +d[var1]; })   // I need to give the vector of value
           .domain(x.domain())  // then the domain of the graphic
           .thresholds(x.ticks(15)); // then the numbers of bins
  
       // And apply this function to data to get the bins
       var bins = histogram(data);
  
       // Y axis: scale and draw:
       var y = d3.scaleLinear()
            .range([ size-2*mar, 0 ])
            .domain([0, d3.max(bins, function(d:any) { return d.length; })]);   // d3.hist has to be called before the Y axis obviously
            var line = d3.line().curve(d3.curveBasis)
            .x(function (d:any) {
              return x(d.date);
            })
            .y(function (d:any) {
              return y(d.sales);
            });
  
            
       // append the bar rectangles to the svg element
       tmp.append('g')
          .selectAll("rect")
          .data(bins)
          .enter()
          .append("rect")
             .attr("x", 1)
             .attr("transform", function(d:any) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
             .attr("width", function(d:any) { return x(d.x1) - x(d.x0)  ; })
             .attr("height", function(d:any) { return (size-2*mar) - y(d.length); })
             .style("fill", "#b8b8b8")
             .attr("stroke", "white")
  
  
             svg.append('g')
             .attr("transform", "translate(" + position(var1) + "," + position(var2) + ")")
             .append('text')
              .attr("x", -100)
                .attr("y", -10)
             .attr("transform", "rotate(-90)")
             .attr("dy", "1em")
             .style("text-anchor", "middle")
             .style("font-size", "15px")
             .text(this.listaElementoCate[i]);
  
  
             svg.append("text")
             .attr("x", 210)
             .attr("y", 10)
             .attr("text-anchor", "middle")
             .style("font-size", "18px")
             .text(" " +this.listaCorrelacion[0]['parametro'] +" vs "+this.listaCorrelacion[1]['parametro']      );

    }
  }
  
  }


  crargrafia3 ( svg:any,data:any ,listaParaemtros:number){
    console.log(svg,data);
      
      this.htmlElement = this.elementRef.nativeElement;  // reference to <bar-graph> element from the main template
      console.log(this.htmlElement);
      console.log(D3);
    
      var marginWhole = {top: 30, right: 30, bottom: 30, left: 30},
      sizeWhole = 640 - marginWhole.left - marginWhole.right
      let d3:any = D3;
    // Create the svg area
    var height =  4000;
      var allVar:any =[];
      if(listaParaemtros==1){
        allVar = ["estacion1"]
     
     }
    
    if(listaParaemtros==2){
       allVar = ["estacion1", "estacion2"]
    
    }
    if(listaParaemtros==3){
       allVar = ["estacion1", "estacion2", "estacion3"]
    
    }
    if(listaParaemtros==4){
         allVar = ["estacion1", "estacion2", "estacion3", "estacion4"]
    
    }
    
    if(listaParaemtros==5){
       allVar = ["estacion1", "estacion2", "estacion3", "estacion4", "estacion5"]
    
    }
    
    
    var numVar = allVar.length
    
    // Now I can compute the size of a single chart
    var  mar = 20
    var  size = sizeWhole / numVar
    
    
    // ----------------- //
    // Scales
    // ----------------- //
    
    // Create a scale: gives the position of each pair each variable
    var position = d3.scalePoint()
      .domain(allVar)
      .range([0, sizeWhole-size])
    
    // Color scale: give me a specie name, I return a color
    var color = d3.scaleOrdinal()
      .domain(["setosa", "versicolor", "virginica", "color2"  ])
      .range([ "#221CE5", "#EC2020", "#000" , "#796ce1"  ])
    
    
    // ------------------------------- //
    // Add charts
    // ------------------------------- //
    for (i in allVar){
      for (j in allVar){
    
        // Get current variable name
        var var1 = allVar[i]
        var var2 = allVar[j]
    
        // If var1 == var2 i'm on the diagonal, I skip that
        if (var1 === var2) { continue; }
    
        // Add X Scale of each graph
      var   xextent:any = d3.extent(data, function(d:any) { return +d[var1] })
        var x = d3.scaleLinear()
          .domain(xextent).nice()
          .range([ 0, size-2*mar ]);
    
        // Add Y Scale of each graph
       var  yextent = d3.extent(data, function(d:any) { return +d[var2] })
        var y = d3.scaleLinear()
          .domain(yextent).nice()
          .range([ size-2*mar, 0 ]);
    
        // Add a 'g' at the right position
        var tmp = svg
          .append('g')
          .attr("transform", "translate(" + (position(var1)+mar) + "," + (position(var2)+mar) + ")");
          
    
        // Add X and Y axis in tmp
        tmp.append("g")
          .attr("transform", "translate(" + 0 + "," + (size-mar*2) + ")")
          .call(d3.axisBottom(x).ticks(3));
        tmp.append("g")
          .call(d3.axisLeft(y).ticks(3));
    
        // Add circle
        tmp
          .selectAll("myCircles")
          .data(data)
          .enter()
          .append("circle")
            .attr("cx", function(d:any){ return x(+d[var1]) })
            .attr("cy", function(d:any){ return y(+d[var2]) })
            .attr("r", 1)
            .attr("fill", function(d:any){ return color(d.Species)})
    
    
    
      }
    }
    
    
    // ------------------------------- //
    // Add histograms = diagonal
    // ------------------------------- //
    var i:any;
    var j:any;
    for (i in allVar){
      for (j in allVar){
    
        // variable names
        var var1 = allVar[i]
        var var2 = allVar[j]
    
        // If var1 == var2 i'm on the diagonal, otherwisee I skip
        if (i != j) { continue; }
    
        // create X Scale
        xextent = d3.extent(data, function(d:any) { return +d[var1] })
        var x = d3.scaleLinear()
          .domain(xextent).nice()
          .range([ 0, size-2*mar ]);
    
        // Add a 'g' at the right position
        var tmp = svg
          .append('g')
          .attr("transform", "translate(" + (position(var1)+mar) + "," + (position(var2)+mar) + ")");
          
    
        // Add x axis
        tmp.append("g")
          .attr("transform", "translate(" + 0 + "," + (size-mar*2) + ")")
          .call(d3.axisBottom(x).ticks(3));
    
        // set the parameters for the histogram
         var histogram = d3.histogram()
             .value(function(d:any) { return +d[var1]; })   // I need to give the vector of value
             .domain(x.domain())  // then the domain of the graphic
             .thresholds(x.ticks(15)); // then the numbers of bins
    
         // And apply this function to data to get the bins
         var bins = histogram(data);
    
         // Y axis: scale and draw:
         var y = d3.scaleLinear()
              .range([ size-2*mar, 0 ])
              .domain([0, d3.max(bins, function(d:any) { return d.length; })]);   // d3.hist has to be called before the Y axis obviously
              var line = d3.line().curve(d3.curveBasis)
              .x(function (d:any) {
                return x(d.date);
              })
              .y(function (d:any) {
                return y(d.sales);
              });
    
              
         // append the bar rectangles to the svg element
         tmp.append('g')
            .selectAll("rect")
            .data(bins)
            .enter()
            .append("rect")
               .attr("x", 1)
               .attr("transform", function(d:any) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
               .attr("width", function(d:any) { return x(d.x1) - x(d.x0)  ; })
               .attr("height", function(d:any) { return (size-2*mar) - y(d.length); })
               .style("fill", "#b8b8b8")
               .attr("stroke", "white")
    
    
               svg.append('g')
               .attr("transform", "translate(" + position(var1) + "," + position(var2) + ")")
               .append('text')
                .attr("x", -100)
                  .attr("y", -10)
               .attr("transform", "rotate(-90)")
               .attr("dy", "1em")
               .style("text-anchor", "middle")
               .style("font-size", "15px")
               .text(this.listaElementoCate[i]);
    
    
               svg.append("text")
               .attr("x", 210)
               .attr("y", 10)
               .attr("text-anchor", "middle")
               .style("font-size", "18px")
               .text(" " +this.listaCorrelacion[0]['parametro'] +" vs "+this.listaCorrelacion[2]['parametro']      );
  
      }
    }
    
    }



    guardarSerie(){

      Swal.fire({
        title: 'Desea guardar la serie ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Guardar',
      }).then((result) => {
      

         location.reload();
       
      });
    }

}
