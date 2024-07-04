import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MetodosGlobales } from 'src/app/common/utils/metodos-globales';
import { ServiciosGeograficosService } from 'src/app/common/mapa/servicios-geograficos.service';
import { estados } from 'src/app/common/utils/constantes';
import { accionesTablasEnum } from 'src/app/modelo/enum/acciones-tablas-enum';
import { capasEnum, capasEnumDatos } from 'src/app/modelo/enum/capas-enum';
import { dominiosEnum } from 'src/app/modelo/enum/dominios-enum';
import { ServiciosMolineteService } from '../../molinetes/servicios-molinetes.service';
import { ServiciosEmbalcesService } from 'src/app/modulos/elementos/embalses/servicios-embalses.service';
import { ServiciosEstacionesService } from 'src/app/modulos/elementos/estaciones/servicios-estaciones.service';
import { ServiciosPozosService } from 'src/app/modulos/elementos/pozos/servicios-pozos.service';
import { ServiciosObservacionesEmbalsesService } from 'src/app/modulos/observaciones/servicios-observaciones-embalses.service';
import { ServiciosObservacionesEstacionService } from 'src/app/modulos/observaciones/servicios-observaciones-estacion.service';
import { ServiciosObservacionesPozosService } from 'src/app/modulos/observaciones/servicios-observaciones-pozos.service';
import { ServiciosParametrosService } from 'src/app/modulos/parametros/servicios-parametros.service';
import { ServiciosParametrosEstacionesService } from '../../../../elementos/estaciones/servicios-parametros-estaciones.service';
import { ServiciosParametrosEmbalseService } from '../../../../elementos/embalses/servicios-parametros-embalse.service';
import { ServiciosParametrosPozosService } from '../../../../elementos/pozos/servicios-parametros-pozos.service';
import { ServiciosSerieTiempoService } from 'src/app/modulos/seriestiempo/servicios/servicios-serie-tiempo.service';
import Swal from 'sweetalert2';
import { ServiciosCapasService } from '../../../capas/servicios-capas.service';
import { ServiciosDominiosValoresService } from '../../../dominios/servicios-dominios-valores.service';
import { ServiciosAforoService } from '../servicios-aforo.service';
import { DataTableDirective } from 'angular-datatables';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { IAforoView } from 'src/app/modelo/configuracion/aforo';

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
  selector: 'app-consultar-aforo',
  templateUrl: './consultar-aforo.component.html',
})

export class ConsultarAforoComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })

  public formularioFiltros!: FormGroup;
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  @ViewChild("chart2") chart2: ChartComponent;
  public chartOptions2: Partial<ChartOptions>;
  @ViewChild("chart1") chart1: ChartComponent;
  public chartOptions1: Partial<ChartOptions>;
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

  name = '';
  url: string = "https://www.folkloredelnorte.com.ar/cancionero/v/virgenindia.html";
  urlSafe: SafeResourceUrl;
  niveles: number;

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
  public monilete: any = [];
  public marca: string;
  public caudal = 0;
  public aforoLocal = [] as any;
  public parametro: number;
  public radio: String;
  public perimetroMojado: number;
  public ancho: number;
  public ecuacion = 0;
  public Mecanismo: string;
  public listaMunicipios = [];
  public listaDepartamentos = [];
  public listahelice = [] as any;
  public departamentoSelected: any;
  private tempIdDepartamento: number = 0;
  datosOriginal = [] as any;
  public observacion: string;
  listaCalculo = [] as any;
  public idmolinete: number;
  public listZonaEAAB = [];
  public h = 0;
  public serie: string;
  public listTipoPozo = [];
  public listCategoriaPozo = [];
  public id: string = '0';
  public listCondicionPozo = [];
  public geograficas = false;
  public idElemento: number = 0;
  public idElementoEaab: number = 0;
  public estado: String;
  public idElementoIDEAM: number = 0;
  public planas = false;
  public verFechas = false;
  public listEntidades = [];
  public NombresParametros: any = [];
  public listParametro_eje: any[] = [];
 
  public listaMetodoMedicion = [];
  public te: string = '0';
  public listanivel = [];
  public listaFrecuenciaXParametro: any = [];
  listaTipoAforo = [] as any;
  public pintarBG: number = 0;
  public numeroA: number;

  public lisTipoAforo = [];
  public CodigoParametros: any = [];
  public listaEntidad = [];
  public listParametro: any[] = [];
  public listaFrecuencia = [];

  public listaBusqueda: any[] = [];
  public elemento: number = 0;
  public newlistaFrecuencia: any = [];
  public periodo: number = 0;
  public listaAforodor = [];

  public listaAreaHidrografica: any = [];
  public listaZonaHidrografica: any = [];
  public listaSubzonaHidrografica: any = [];
  public listaNivelSubsiguiente: any = [];
  public listaCuenca: any = [];
  public listaSubcuenca: any = [];
  public listaMicrocuenca: any = [];
  public listaTipoCoordenada: [];
  public listaCorriente: [];
  public listaDepartamento: any = [];
  public listaMunicipio: any = [];
  public listaEntidades: any = [];
  listaCodigoEAAB: any[] = [{
    id: '',
    text: '',
    disabled: false
  }];
  listaCodigoIDEAM: any = [];
  public abscisa: number;
  public profundidadTotal: number;
  public VMV: number;
  public velocidadMedia: number;
  public velocidadMedia1: String;
  public area: number;
  public caudalparcial: number;
  public formularioFiltroAforo!: FormGroup;
  public velocidadMedi1: String;


  rutaGeneral = 'configuracion/gestionAforo/C/0';
  rutaEdicion = 'configuracion/gestionAforo/E/';
  rutaConsulta = 'configuracion/gestionAforo/V/';

  datosFilterEstaciones = [] as any;
  datosFilterEmbalses = [] as any;
  datosFilterPozos = [] as any;
  datosFilter = [] as any;
  datosSerieAnio = [] as any;
  datosSerieMes = [] as any;
  listParametroXElemento = [] as any;
  listaElementos = [] as any;

  public tipoRango: any = 2;
  public fechaFin: any = '';
  public fechaInicio: any = '';

  public listaNumeroAforo = [];

  listaElemento = [] as any;
  listAforos = [] as any;
  botonesGenerales = [
    {
      text: 'Activar todos',
      action: 'Validar',
      enabled: this.validarPermiso('ActualizarAforo'),
    }
  ];
  public idTipoElemento: any;
  columnas = [

    {
      title: 'ID',
      data: 'idAforo',
      visible: false,
      filterValueMin: '',
      filterValueMax: '',
      tipo: 'rangoNumero',
    },
    {
      title: 'Nombre elemento',
      data: 'estacion',
      class: 'text-center',
      visible: true,
    },
    {
      title: 'idTipoElemento',
      data: 'idTipoElemento',
      class: 'text-center',
      visible: false,
    },
    {
      title: 'idElemento',
      data: 'idElemento',
      class: 'text-center',
      visible: false,
    },

    {
      title: 'idTipoAforo',
      data: 'idTipoAforo',
      class: 'text-center',
      visible: false,
    },
    {
      title: 'Nombre corriente',
      data: 'nombreCorriente',
      class: 'text-center',
      visible: true,
    },
    {
      title: 'Tipo elemento',
      data: 'dominioValor',
      class: 'text-center',
      visible: true,
    },
    {
      title: 'Fecha',
      data: 'fecha',
      class: 'text-center',
      visible: true,
    },
    {
      title: 'Aforador',
      data: 'nombre',
      class: 'text-center',
      visible: true,
    },

    {
      title: 'Codigo EAAB',
      data: 'codigoEAAB',
      class: 'text-center',
      visible: true,
    },
    {
      title: 'Codigo IDEAM',
      data: 'codigoIDEAM',
      class: 'text-center',
      visible: true,
    },
    {
      title: 'Area total (㎡)',
      data: 'areaTotal',
      class: 'text-center',
      visible: true,
    },
    {
      title: 'Caudal total (㎥/s)',
      data: 'caudalTotal',
      class: 'text-center',
      visible: true,
    },
    {
      title: 'Observaciones',
      data: 'observaciones',
      class: 'text-center',
      visible: true,
    },
    {
      title: 'Estado',
      data: 'estado',
      class: 'text-center',
      visible: true,
    },
    {
      title: 'Activo',
      data: 'activo',
      filter: true,
      visible: false,
    },
  ];
  tipoMedida: any = [

    {
      id: 639,
      text: 'Cable',
    },
    {
      id: 640,
      text: 'Puente',
    },
    {
      id: 641,
      text: 'Vadeo',
    },
    {
      id: 638,
      text: 'Bote',
    },



  ];
  columnas1 = [

    {
      title: 'ID',
      data: 'idAforo',
      visible: false,
      filterValueMin: '',
      filterValueMax: '',
      tipo: 'rangoNumero',
    },
    {
      title: 'idTipoElemento',
      data: 'idTipoElemento',
      class: 'text-center',
      visible: false,
    },
    {
      title: 'idElemento',
      data: 'idElemento',
      class: 'text-center',
      visible: false,
    },
    {
      title: 'idTipoAforo',
      data: 'idTipoAforo',
      class: 'text-center',
      visible: false,
    },
    {
      title: 'Nombre Elemento',
      data: 'estacion',
      class: 'text-center',
      visible: true,
    },
    {
      title: 'Fecha',
      data: 'fecha',
      class: 'text-center',
      visible: true,
    },
    {
      title: 'Aforador',
      data: 'nombre',
      class: 'text-center',
      visible: true,
    },

    {
      title: 'codigo EAAB',
      data: 'codigoEAAB',
      class: 'text-center',
      visible: true,
    },
    {
      title: 'Codigo IDEAM',
      data: 'codigoIDEAM',
      class: 'text-center',
      visible: true,
    },
    {
      title: 'Area Total',
      data: 'areaTotal',
      class: 'text-center',
      visible: true,
    },
    {
      title: 'Caudal Total',
      data: 'caudalTotal',
      class: 'text-center',
      visible: true,
    },
    {
      title: 'Observaciones',
      data: 'observaciones',
      class: 'text-center',
      visible: true,
    },
    {
      title: 'Estado',
      data: 'estado',
      class: 'text-center',
      visible: true,
    },
    {
      title: 'Activo',
      data: 'activo',
      filter: true,
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
      title: 'validar',
      action: 'validar',
      icon: 'fas fa-check',
      enabled: this.validarPermiso('ActualizarAforo'),
    }

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
    private serviciosParametrosPozosService: ServiciosParametrosPozosService,
    private serviciosObservacionesEstacionService: ServiciosObservacionesEstacionService,
    private serviciosObservacionesPozosService: ServiciosObservacionesPozosService,
    private serviciosObservacionesEmbalsesService: ServiciosObservacionesEmbalsesService,
    private serviciosSerieTiempoService: ServiciosSerieTiempoService,
    private servicioAforo: ServiciosAforoService,
    private serviciosMolineteService: ServiciosMolineteService,
    private serviciosParametrosEmbalseService: ServiciosParametrosEmbalseService,
    private sercioparametrosestacion: ServiciosParametrosEstacionesService,
    public sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.chartOptions = {
      series: [],
      chart: {
        height: 500,
        type: 'scatter',
        zoom: {
          enabled: true,
          type: 'xy'
        },
        events: [],
      },
      title: {
        text: 'Relación Caudal Vs Nivel',
        align: 'Center'
      },
      xaxis: {
        dataLabels: {
          enabled: true,
          enabledOnSeries: [1]
        },
        title: {
          text: 'Nivel(h) (m) ',
          style: {

            fontSize: '12px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 600,
            cssClass: 'apexcharts-xaxis-title',
          },
        },
        tickAmount: 10,

      },
      yaxis: {
        title: {
          text: 'Caudal (Q) (㎥/s) ',
          offsetY: 20,
        },
        labels: {
          formatter: function (val: any) {
            return parseFloat(val).toFixed(1)
          }
        },
        tickAmount: 7,

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
          formatter: function (val: any) {
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
          formatter: function (val: any) {
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

    this.construirFormulario();

    //Número afoto 
    this.servicioAforo
      .obtenerNumeroAfoto()
      .subscribe((response) => {
        this.listaNumeroAforo = response;

      });
    //--------------------

    this.cargarAreaHidrografica();
    this.onChanges();
    this.cargarCapas();
    this.servicioAforo.obtenerPorTipo().subscribe(aforos => {

      this.listAforos = aforos;

      console.log(44, this.listAforos);

      var cantidad = [];
      var cantidadNivel = [];
      for (let i = 0; i < this.listAforos.length; i++) {

        var y = parseFloat(this.listAforos[i]['caudalTotal']);
        var a = parseFloat(this.listAforos[i]['areaTotal']);
        var x = parseFloat(this.listAforos[i]['nivelFinal']);

        var numy = new Number(y);
        var numa = new Number(a);
        var numx = new Number(x);
        this.listAforos[i]['caudalTotal'] = numy.toPrecision(2);
        this.listAforos[i]['areaTotal'] = numa.toPrecision();
        this.listAforos[i]['nivelFinal'] = numx.toPrecision(2);

        var ejeY = this.listAforos[i]['caudalTotal']
        var ejeX = this.listAforos[i]['nivelFinal']

        cantidad.push({
          x: ejeX,
          y: ejeY
        });

      }



      this.chartOptions.series = [{
        name: "Nivel ",
        type: "scatter",
        data: cantidad
      },];
    })

    this.cargarAreaHidrografica();
    this.serviciosDominiosValoresService
      .obtenerValoresActivosPorIdDominio(dominiosEnum.metodoMedicion)
      .subscribe((response) => {
        this.listaMetodoMedicion = response;
        console.log(2, this.listaMetodoMedicion);
      });

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


    this.servicioAforo
      .obtenerAforadores()
      .subscribe((response) => {
        this.listaAforodor = response;
        // console.log('llego frecuencia', this.listaFrecuencia);
      });
    this.servicioAforo
      .obtenerTipoAforo()
      .subscribe((response) => {
        this.lisTipoAforo = response;

      });

    // entidad
    this.serviciosDominiosValoresService
      .obtenerValoresPorIdDominio(dominiosEnum.Entidad)
      .subscribe((response) => {
        this.listaEntidad = response;
      });

    // -----------



  }

  accionRegistro(e: any) {
    switch (e.accion) {
      case accionesTablasEnum.Activar: {
        let elemento: any = e.registro;
        elemento.activo = estados.activo;
        this.servicioAforo.actualizarEstado(elemento.activo, elemento.idAforo).subscribe(resultado => {
          console.log(resultado);
          this.servicioAforo.obtenerPorTipo().subscribe(aforos => {
            this.listAforos = aforos;
          })
        })
        break;
      }
      case accionesTablasEnum.Consultar: {
        let elemento: any = e.registro;
        elemento.activo = estados.activo;
        this.servicioAforo.actualizarEstado(elemento.activo, elemento.idAforo).subscribe(resultado => {
          console.log(resultado);
          this.servicioAforo.obtenerPorTipo().subscribe(aforos => {
            this.listAforos = aforos;
          })
        })
        break;
      }
      case accionesTablasEnum.Eliminar: {

        var listaFinal = this.listAforos;
        if (e.registro.estado == "Registrado") {

          var cars = listaFinal.filter(function (car: any) {
            return car.idAforo !== e.registro.idAforo;
          });
          this.listAforos = [];
          this.listAforos = cars;
          this.servicioAforo.eliminarAforo(e.registro.idAforo).subscribe(resultado => {
            console.log(resultado);
            Swal.fire(
              'Aforo',
              '¡El aforo fue eliminado de manera exitosa! ',
              'success'
            );
          })


        } else {
          Swal.fire(
            'Aforo',
            '¡No se puede eliminar! ',
            'error'
          );
        }

        break;
      }
      case accionesTablasEnum.Inactivar: {
        let elemento: any = e.registro;
        elemento.activo = estados.inactivo;
        this.servicioAforo.actualizarEstado(elemento.activo, elemento.idAforo).subscribe(resultado => {
          console.log(resultado);
          this.servicioAforo.obtenerPorTipo().subscribe(aforos => {
            this.listAforos = aforos;
          })
        })
        break;
      }
      case accionesTablasEnum.Editar: {
        let elemento: any = e.registro;
        elemento.activo = estados.inactivo;

        break;
      } case 'validar': {
        let elemento: any = [];
        this.id = e.registro.idAforo
        this.estado = e.registro.estado
        this.obtneridAfotoCalculo();
        let div: any = document.getElementById(`validarBtn`);
        div.click();
        break;
      } case 'calcular': {
        let elemento: any = [];
        this.urlSafe = '';
        var URLdomain = window.location.host;
        elemento = e.registro;
        this.url = 'http://' + URLdomain + '/sish-frontend/#/configuracion/calcularAforo/E/' + elemento.idAforo;

        this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);

        let div: any = document.getElementById(`validarBtn1`);
        div.click();

        break;
      }

      default: {
        //statements;
        break;
      }
    }
  }

  actualizarEstado() {

  }


  get idelemento() {
    return this.formularioFiltroAforo.get('idelemento');
  }
  get corriente() {
    return this.formularioFiltroAforo.get('corriente');
  }
  get zonaOperativaEaab() {
    return this.formularioFiltroAforo.get('zonaOperativaEaab');
  }
  get areaHidrografica() {
    return this.formularioFiltroAforo.get('idAreaHidrografica');
  }
  get zonaHidrografica() {
    return this.formularioFiltroAforo.get('idZonaHidrografica');
  }
  get subZonaHidrografica() {
    return this.formularioFiltroAforo.get('idSubZonaHidrografica');
  }
  get cuenca() {
    return this.formularioFiltroAforo.get('idCuenca');
  }
  get subcuenca() {
    return this.formularioFiltroAforo.get('idSubCuenca');
  }
  get microCuenca() {
    return this.formularioFiltroAforo.get('idMicroCuenca');
  }
  get microcuenca() {
    return this.formularioFiltroAforo.get('microCuenca');
  }

  private construirFormulario() {
    this.Mecanismo = '469';
    this.formularioFiltroAforo = this.formBuilder.group({
      // datos que no van en el formulario
      idelemento: [''],
      codigoEstacionEaab: [''],
      nombreCorriente: [''],
      idDepartamento: [''],
      idMunicipio: [''],
      idAreaHidrografica: [''],
      idfrecuencia: [''],
      idZonaHidrografica: [''],
      idSubZonaHidrografica: [''],
      idCuenca: [''],
      idSubCuenca: [''],
      idMicroCuenca: [''],
      idtipoAforo: [''],
      aforador: [''],
      idAforo: [''],
      idEntidad: [''],
      fechaFin: [''],
      fechaInicio: [''],

    });
  }

  test() {
    console.log(this.listaCodigoEAAB);
    this.serviciosEstacionesService.obtenerEstaciones().subscribe(element => {
      console.log(element);

    })
  }

  obtenerElementos(even: any) {

    if (this.datosFilter.length >= 1) {
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

          this.datosFilter = [];
          this.listaCodigoEAAB = [];
          this.listaCodigoIDEAM = [];
        }
      });
    }

    this.listaElemento = [];
    this.listaCodigoEAAB = [];
    this.listaCodigoIDEAM = [];
    this.listaDepartamento = [];
    this.listaMunicipios = [];
    this.listaAreaHidrografica = [];
    this.listaZonaHidrografica = [];
    this.listaSubzonaHidrografica = [];
    this.listaCuenca = [];
    this.listaMicrocuenca = [];
    this.listaEntidades = [];

    switch (even) {
      case '1': {
        // Estaciones
        Swal.fire({
          title: 'Cargando...',
          html: 'Por favor espere.',
          timer: 42000,
          timerProgressBar: true,
          allowOutsideClick: false,
          showConfirmButton: false,
          didOpen: async () => {
            Swal.showLoading();
            this.formularioFiltroAforo.value.idelemento = 466;
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

                this.listaDepartamento = response.map((elemento: any) => ({
                  id: elemento.idEstacion,
                  text: elemento.departamento,
                  disabled: elemento.activo == 'S' ? false : true,
                }));

                this.listaMunicipio = response.map((elemento: any) => ({
                  id: elemento.idEstacion,
                  text: elemento.municipio,
                  disabled: elemento.activo == 'S' ? false : true,
                }));

                this.listaAreaHidrografica = response.map((elemento: any) => ({
                  id: elemento.idEstacion,
                  text: elemento.areaHidrografica,
                  disabled: elemento.activo == 'S' ? false : true,
                }));

                this.listaZonaHidrografica = response.map((elemento: any) => ({
                  id: elemento.idEstacion,
                  text: elemento.zonaHidrografica,
                  disabled: elemento.activo == 'S' ? false : true,
                }));

                this.listaSubzonaHidrografica = response.map((elemento: any) => ({
                  id: elemento.idEstacion,
                  text: elemento.subZonaHidrografica,
                  disabled: elemento.activo == 'S' ? false : true,
                }));

                this.listaCuenca = response.map((elemento: any) => ({
                  id: elemento.idEstacion,
                  text: elemento.cuenca,
                  disabled: elemento.activo == 'S' ? false : true,
                }));

                this.listaMicrocuenca = response.map((elemento: any) => ({
                  id: elemento.idEstacion,
                  text: elemento.microCuenca,
                  disabled: elemento.activo == 'S' ? false : true,
                }));

                this.listaEntidades = response.map((elemento: any) => ({
                  id: elemento.idEstacion,
                  text: elemento.entidad,
                  disabled: elemento.activo == 'S' ? false : true,
                }));


                Swal.close();
              });
          },
          willClose: async () => {
            Swal.hideLoading();
          }
        });
        break;
      }
      case '2': {
        // Embalses
        Swal.fire({
          title: 'Cargando...',
          html: 'Por favor espere.',
          timer: 42000,
          timerProgressBar: true,
          allowOutsideClick: false,
          showConfirmButton: false,
          didOpen: async () => {
            Swal.showLoading();
            this.serviciosEmbalcesService
              .obtenerEembalsesDTO()
              .subscribe((response) => {
                // console.log('llegaron embalses', response);

                this.listaElemento = response.map((elemento: any) => ({
                  id: elemento.idEmbalse,
                  text: elemento.embalse,
                  disabled: elemento.activo == 'S' ? false : true,
                }));
                Swal.close();
              });
          },
          willClose: async () => {
            Swal.hideLoading();
          }
        });
        break;
      }
      case '3': {
        // pozos
        Swal.fire({
          title: 'Cargando...',
          html: 'Por favor espere.',
          timer: 42000,
          timerProgressBar: true,
          allowOutsideClick: false,
          showConfirmButton: false,
          didOpen: async () => {
            Swal.showLoading();
            this.serviciosPozosService.obtenerPozosDTO().subscribe((response) => {
              // console.log('llegaron pozoz', response);
              this.listaElemento = response.map((elemento: any) => ({
                id: elemento.idPozo,
                text: elemento.pozo,
                disabled: elemento.activo == 'S' ? false : true,
              }));
              Swal.close();
            });
          },
          willClose: async () => {
            Swal.hideLoading();
          }
        });

        break;
      }
      default: {
        // console.log('default');
        //statements;
        break;
      }
    }
  }

  assertNullAndUndefined(value: any): boolean {
    if (null == value || undefined == value) {
      return false;
    }

    return true;
  }

  filtrar(elemento: any) {


    console.log(33);


    var objetoBusqueda: any;

    Swal.fire({
      title: 'Cargando...',
      html: 'Por favor espere.',
      timer: 42000,
      timerProgressBar: true,
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: async () => {
        Swal.showLoading();

        if (this.tipoRango == 2 && (!this.assertNullAndUndefined(this.fechaInicio) || !this.assertNullAndUndefined(this.fechaFin) || this.fechaInicio >= this.fechaFin)) {
          Swal.fire({
            title: 'Fechas NO válidas',
            html: 'La fecha inicio debe ser menor a la fecha final.',
            icon: 'error',
          });
          return;
        }

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
          Swal.close();
        });
      } catch (error) {


        console.error(error);
      }

    },
    willClose: async () => {
      Swal.hideLoading();
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
  perriodoBigente() {
    this.periodo = 1;
    this.verFechas = false;
  }
  establecerRngo() {
    this.periodo = 2;
    this.verFechas = true;
  }
  cargarCapas() {
    console.log('cargarCapas');
    this.serviciosCapasService
      .obtenerPorId(capasEnum.Zonificacion)
      .subscribe((response) => {
        console.log('cargarCapas', response.urlVisualizar);
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
        console.log('cargarCapas', response.urlVisualizar);
        this.capas.push({
          url: response.urlVisualizar,
          id: capasEnumDatos(capasEnum.Departamentos).id,
          visible: true,
          titulo: capasEnumDatos(capasEnum.Departamentos).titulo,
        });
      });

    this.serviciosCapasService
      .obtenerPorId(capasEnum.Estaciones)
      .subscribe((response) => {
        console.log('cargarCapas', response.urlVisualizar);
        this.capas.push({
          url: response.urlVisualizar,
          id: capasEnumDatos(capasEnum.Estaciones).id,
          visible: true,
          titulo: capasEnumDatos(capasEnum.Estaciones).titulo,
        });
      });

    console.log('capas cargadas', this.capas);
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


  validarObligatorios() {

    if (this.elemento == undefined || this.elemento == 0) {

      Swal.fire({
        title: 'Debe seleccionar un elemento!!',
        icon: 'error',
      }).then((result) => {
        if (result.isConfirmed) {

        }
      });

      return false;
    }
    if (this.formularioFiltroAforo.value.idelemento == undefined || this.formularioFiltroAforo.value.idelemento == 0) {

      Swal.fire({
        title: 'Debe sseleccionar el nombre del elmento!!',
        icon: 'error',
      }).then((result) => {
        if (result.isConfirmed) {

        }
      });

      return false;
    }


    return true;
  }

  obtenerParametrosElemento(event: any, mecanismo: any) {
    switch (mecanismo) {
      case '1': {

        this.sercioparametrosestacion
          .obtenerListaParametros(event)
          .subscribe((response) => {
            console.log(response)

            this.NombresParametros = response.map((elemento: any) => ({
              id: elemento.idParametroXEstacion,
              text: elemento.descripcionParametro,
              idPeriodo: elemento.idPeriodo,
            }));

            this.CodigoParametros = response.map((elemento: any) => ({
              id: elemento.idParametroXEstacion,
              text: elemento.codigo,
              idPeriodo: elemento.idPeriodo,
            }));

            // filtrar  frecuencias por parametros
            this.listaFrecuencia.forEach((list1: any) => {
              response.forEach((element: any) => {
                if (list1.id == element.idPeriodo) {
                  this.newlistaFrecuencia.push(list1);
                }
              });
            });

            this.listaFrecuenciaXParametro = this.newlistaFrecuencia.filter(
              (valor: any, indice: any) => {
                return this.newlistaFrecuencia.indexOf(valor) === indice;
              }
            );

            // console.log('lista de parametros ', response);
          });

        break;
      }
      case '2': {
        this.serviciosParametrosEmbalseService
          .obtenerListaParametrosXEmbalse(event)
          .subscribe((response) => {
            // console.log('embalses', response);
            this.NombresParametros = response.map((elemento: any) => ({
              id: elemento.idParametroXEmbalse,
              text: elemento.descripcionParametro,
              idPeriodo: elemento.idPeriodo,
              disabled: elemento.activo == 'S' ? false : true,
            }));
            this.CodigoParametros = response.map((elemento: any) => ({
              id: elemento.idParametroXEmbalse,
              text: elemento.codigo,
              idPeriodo: elemento.idPeriodo,
              disabled: elemento.activo == 'S' ? false : true,
            }));
            // filtrar  frecuencias por parametros
            this.listaFrecuencia.forEach((list1: any) => {
              response.forEach((element: any) => {
                if (list1.id == element.idPeriodo) {
                  this.newlistaFrecuencia.push(list1);
                }
              });
            });

            this.listaFrecuenciaXParametro = this.newlistaFrecuencia.filter(
              (valor: any, indice: any) => {
                return this.newlistaFrecuencia.indexOf(valor) === indice;
              }
            );
          });
        break;
      }
      case '3': {

        this.serviciosParametrosPozosService
          .obtenerListaParametrosXPozo(event)
          .subscribe((response) => {
            debugger
            this.NombresParametros = response.map((elemento: any) => ({
              id: elemento.idParametroXPozo,
              text: elemento.descripcionParametro,
              idPeriodo: elemento.idPeriodo,
              disabled: elemento.activo == 'S' ? false : true,
            }));

            this.CodigoParametros = response.map((elemento: any) => ({
              id: elemento.idParametroXPozo,
              idPeriodo: elemento.idPeriodo,
              text: elemento.codigo,
              disabled: elemento.activo == 'S' ? false : true,
            }));

            // filtrar  frecuencias por parametros
            this.listaFrecuencia.forEach((list1: any) => {
              response.forEach((element: any) => {
                if (list1.id == element.idPeriodo) {
                  this.newlistaFrecuencia.push(list1);
                }
              });
            });

            this.listaFrecuenciaXParametro = this.newlistaFrecuencia.filter(
              (valor: any, indice: any) => {
                return this.newlistaFrecuencia.indexOf(valor) === indice;
              }
            );
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

  agregarlista(FiltroAforo: any) {


    this.filtra1r(FiltroAforo)

    this.datosFilter.push(FiltroAforo);




    // console.log('lista ', this.datosFilter);
  }

  dataPointSelection(event: any, chartContext: any, config: any) {
    var1 = config.dataPointIndex;
    let div: any = document.getElementById(`btn`);
    div.click();
  }



  filtra1r(elemento: any) {
    Swal.fire({
      title: 'Cargando...',
      html: 'Por favor espere.',
      timer: 42000,
      timerProgressBar: true,
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: async () => {
        Swal.showLoading();

        if (this.tipoRango == 2 && (!this.assertNullAndUndefined(this.fechaInicio) || !this.assertNullAndUndefined(this.fechaFin) || this.fechaInicio >= this.fechaFin)) {
          Swal.fire({
            title: 'Fechas NO válidas',
            html: 'La fecha inicio debe ser menor a la fecha final.',
            icon: 'error',
          });
          return;
        }

    try {

      if (!elemento.value.fechaInicio) {
        elemento.value.fechaInicio = "1900-08-01"
        elemento.value.fechaFin = "2050-08-01"
      }

      if (elemento.value.idelemento == undefined || elemento.value.idelemento == 0) {
        elemento.value.idelemento = null;
      }
      elemento.value.metodoMedicion = elemento.value.idtipoAforo;
      elemento.value.tipoElemento = 'estaciones';
      console.log(elemento.value.idSubCuenca);

      this.servicioAforo
        .obtenerPorTipofiltros(elemento.value)
        .subscribe((response) => {


          this.listAforos = response;



          var cantidad = [];
          var cantidadNivel = [];
          for (let i = 0; i < this.listAforos.length; i++) {


            var y = parseFloat(this.listAforos[i]['caudalTotal']);
            var a = parseFloat(this.listAforos[i]['areaTotal']);
            var x = parseFloat(this.listAforos[i]['nivelFinal']);

            var numy = new Number(y);
            var numa = new Number(a);
            var numx = new Number(x);
            this.listAforos[i]['caudalTotal'] = numy.toPrecision(2);
            this.listAforos[i]['areaTotal'] = numa.toPrecision(2);
            this.listAforos[i]['nivelFinal'] = numx.toPrecision(2);

            var ejeY = this.listAforos[i]['caudalTotal']
            var ejeX = this.listAforos[i]['nivelFinal']


            cantidad.push({
              x: ejeX,
              y: ejeY
            });

          }

          this.chartOptions.series = [{
            name: "Nivel ",
            type: "scatter",
            data: cantidad
          },];

          Swal.close();

        });


      } catch (error) {


        console.error(error);
      }

    },
    willClose: async () => {
      Swal.hideLoading();
    }
  });
  }

  onChanges(): void {

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
              this.listaSubzonaHidrografica = datos;
              // console.log('lista zona OK', this.listaSubzonaHidrografica);
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
  validadoAforo() {

    if (this.observacion) {



      Swal.fire({
        title: 'Desea validar los datos del calculo del aforo No. ' + this.id + '  ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Validar',
      }).then((result) => {
        if (result.isConfirmed) {


          this.servicioAforo
            .actualizarEstadoObservacion(this.observacion, 861, this.id, this.listaCalculo.caudal, this.h)
            .subscribe((response) => {
              Swal.fire({
                title: '¡El aforo No. ' + this.id + ' ha sido Validado  satisfactoriamente!',
                icon: 'info',
                showCancelButton: false,
              }).then((result) => {
                if (result.isConfirmed) {

                  let div: any = document.getElementById(`cerrar`);
                  div.click();

                }
              });

            });




        }
      });

    } else {

      this.toast.fire({
        icon: 'error',
        title: 'Debes ingresar las observación !! ',
      });
    }


  }
  obtneridAfotoCalculo() {

    try {
      this.servicioAforo
        .obtenerAforoCalculo(this.id)
        .subscribe((response) => {
          console.log('llegando consulta', response);
          this.listaCalculo = response[0];


        });
      this.servicioAforo.obtenerAforo(this.id).subscribe((aforos: any) => {
        var AforoLocal: IAforoView = {
          idAforo: this.id,
          idTipoAforo: aforos[0].idTipoAforo,
          idTipoElemento: aforos[0].idTipoElemento,
          idElemento: aforos[0].idElemento,
          codigoEAAB: aforos[0].codigoEAAB,
          codigoIDEAM: aforos[0].codigoIDEAM,
          nombreCorriente: aforos[0].nombreCorriente,
          // nombreAforo:aforos[0].nombreAforo == undefined? '': aforos[0].nombreAforo,
          fecha: aforos[0].fecha,
          horaInicial: aforos[0].horaInicial,
          horaFinal: aforos[0].horaFinal,
          nivelInicial: aforos[0].nivelInicial,
          nivelFinal: aforos[0].nivelFinal,
          idMetodoMedicion: aforos[0].idMetodoMedicion,
          idAforoAforador: aforos[0].idAforoAforador,
          // observacion:aforos[0].observacion,
          observaciones: aforos[0].observaciones == undefined ? '' : aforos[0].observaciones,
          // adjunto:aforos[0].adjunto,
          //flagMigracion:aforos[0].flagMigracion,
          //numeroAforo:aforos[0].numeroAforo,
          //anio:aforos[0].anio,
          //activo:aforos[0].activo,
          //caudalTotal:aforos[0].caudalTotal,
          //areaTotal:aforos[0].areaTotal,
          idMecanismo: aforos[0].idMecanismo,
          //idAforo:aforos[0].idAforo,
          aforador: aforos[0].nombre,
          coeficionte: '',
          constanteEquipo: '',
          ecuacion: '',
          este: '',
          idEquipo: '',
          idHelice: aforos[0].idHelice,
          idMetodoM: '',
          latitud: aforos[0].latitud,
          longitud: aforos[0].longitud,
          norte: '',
          norteMayor: '',
          norteMenor: '',
          idTipoCoordenadas: aforos[0].idTipoCoordenadas,
          idespejo: aforos[0].espejoAgua == 'Orilla Derecha' ? 483 : 484,
          idMolinete: aforos[0].idMolinete,
          nombreElemento: aforos[0].nombreElemento,
          //numeroRevolucionesMax: aforos[0].numeroRevolucionesMax,
          //numeroRevolucionesMin: aforos[0].numeroRevolucionesMin,

        }
        this.idmolinete = aforos[0].idMolinete;


        var max = 0;
        var listaSeciones: any = [];
        var array1: any = [];
        var array2: any = [];
        this.servicioAforo.obtenerAforoDato(this.id).subscribe(datos => {

          var b;
          var abscisa;
          for (let index = 0; index < datos.length; index++) {

            b = datos[index].profundidadTotal;
            abscisa = datos[index].abscisa;

            array2.push(abscisa);
            listaSeciones.push(b);
            array1.push(datos[index].profundidadTotal);


          }










          var var1 = 0;
          var var2 = 0;
          var resta = 0
          var restul = 0
          var h: any = [];
          var array3: any = [];
          var arrayfin: any = [];
          var array4: any = [];
          let index = 0
          for (index = 0; index < listaSeciones.length; index++) {

            var1 = Math.pow(listaSeciones[index], 2);
            var2 = Math.pow(listaSeciones[index + 1], 2);

            resta = var1 - var2;
            restul = Math.sqrt(resta)
            array3 = Math.hypot(listaSeciones[index], listaSeciones[index + 1]);
            array4.push(array3);

          }


          array4.splice(array4.length - 1);


          console.log(1, array4);

          restul = array4.reduce((a: any, b: any) => a + b, 0);

          var r = Math.sqrt(restul)

          var r1 = Math.trunc(restul)
          var r2 = Math.abs(restul)
          console.log(4, Math.abs(restul));

          var numb = r2.toPrecision(3);
          var rest = Math.abs(restul);
          var rest1 = Math.sqrt(rest)
          var numrest1 = new Number(rest1);
          var ñ = numrest1.toPrecision(3)
          var n = parseFloat(ñ)
          console.log(2, n);

          this.perimetroMojado = n

          var radio = this.listaCalculo.area / this.perimetroMojado
          var nradio = new Number(radio);
          this.radio = nradio.toPrecision(3);

          var ancho = array2.reduce((a: any, b: any) => a + b, 0);
          var an = ancho / array2.length;
          this.ancho = Math.max.apply(null, array2)

          this.aforoLocal = AforoLocal;
          this.h = (this.aforoLocal.nivelInicial + this.aforoLocal.nivelFinal) / 2;

          var velocidadMedia = this.listaCalculo.caudal / this.listaCalculo.area;
          var nvelocidadMedia = new Number(velocidadMedia);
          this.velocidadMedia1 = nvelocidadMedia.toPrecision(3)
          this.caudal = this.listaCalculo.caudal.toPrecision(3);

          var cantidad = [];
          var cantidadLinea = [];
          var ejeY = this.listaCalculo.caudal
          var ejeX = this.h;
          cantidad.push({
            x: ejeX,
            y: ejeY
          });

          cantidadLinea.push({
            x: 0,
            y: 0
          }, {
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
              .obtenerPorId(this.listahelice.idMolinete)
              .subscribe((response) => {

                this.monilete = response
                console.log(this.monilete);

                this.marca = this.monilete.marca;
                this.serie = this.monilete.serie;
              });

          });

      })



    } catch (error) {
      console.error(error);
    }
  }
  rechazadoAforo() {
    if (this.observacion) {



      Swal.fire({
        title: 'Desea rechazar los datos del calculo del aforo No. ' + this.id + '  ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Rechazar',
      }).then((result) => {
        if (result.isConfirmed) {
          console.log("-------------------------------------")
          console.log("este es el nivel", this.h)
          console.log("-------------------------------------")

          this.servicioAforo
            .actualizarEstadoObservacion(this.observacion, 862, this.id, this.listaCalculo.caudal, this.h)
            .subscribe((response) => {
              Swal.fire({
                title: '¡El aforo No. ' + this.id + ' ha sido Rechazado  satisfactoriamente!',
                icon: 'info',
                showCancelButton: false,
              }).then((result) => {
                if (result.isConfirmed) {
                  let div: any = document.getElementById(`cerrar`);
                  div.click();


                }
              });

            });





        }
      });

    } else {

      this.toast.fire({
        icon: 'error',
        title: 'Debes ingresar las observación !! ',
      });

    }

  }
  onRightClick(event: any) {
    console.log("right clicked on me " + event.currentTarget.attributes);
    return false;
  }
  infoAforo() {
    var x = this.chartOptions.series[0].data[var1].x;
    var y = this.chartOptions.series[0].data[var1].y;
    var fecha = this.listParametro_eje[0]["fecha_creacion"];

    var alumnosCurso = '<table id="alumnosCurso" class="table table-striped nowrap" width="100%"><thead><tr><th>Nivel</th><th>Caudal</th><th>Fecha de aforo</th></tr> </thead><tbody><tr><td>' + x + '</td><td>' + y + '</td><td>' + fecha + '</td> </tr></tbody></table>';

    Swal.fire({
      title: 'Información de aforo',
      html: alumnosCurso,
      focusConfirm: false,
      allowOutsideClick: false
    });

  }
  regresar() {

    location.reload();
  }
  onRightClick4(chart: HTMLElement, chartId: string, event?: Event) {
    console.log(event)
    console.log(chart)
    console.log(chartId)
  }
  agregarAbscisa() {

  }
  bntverdetalleAforo() {

    this.router.navigateByUrl('/configuracion/gestionAforo/V/' + this.id);


  }
  verdetalleAforo() {

    let div: any = document.getElementById(`btn_ver`);
    div.click();

  }
  recargar() {
    this.router.navigateByUrl('/configuracion/gestionAforo');

  }
  /*
  AsignarNombres() {
    let CuencaName: any = this.listaCuenca.find(
      (cuenca) => cuenca['id'] == this.formularioFiltroAforo.value.idCuenca
    );

    let AreaName: any = this.listaAreaHidrografica.find(
      (cuenca) =>
        cuenca['id'] == this.formularioFiltroAforo.value.idAreaHidrografica
    );

    let ZonaName: any = this.listaZonaHidrografica.find(
      (cuenca) =>
        cuenca['id'] == this.formularioFiltroAforo.value.idZonaHidrografica
    );

    let subZonaName: any = this.listaSubzonaHidrografica.find(
      (cuenca) =>
        cuenca['id'] == this.formularioFiltroAforo.value.idSubZonaHidrografica
    );

    let subCuencaName: any = this.listaSubcuenca.find(
      (cuenca) => cuenca['id'] == this.formularioFiltroAforo.value.idSubCuenca
    );

    let MicroCuencaName: any = this.listaMicrocuenca.find(
      (cuenca) => cuenca['id'] == this.formularioFiltroAforo.value.idMicroCuenca
    );

    if (MicroCuencaName != undefined || null) {
      this.formularioFiltroAforo.value.microCuenca = MicroCuencaName['text'];
    }
    if (CuencaName != undefined || null) {
      this.formularioFiltroAforo.value.cuenca = CuencaName['text'];
    }
    if (AreaName != undefined || null) {
      this.formularioFiltroAforo.value.areaHidrografica = AreaName['text'];
    }
    if (ZonaName != undefined || null) {
      this.formularioFiltroAforo.value.zonaHidrografica = ZonaName['text'];
    }
    if (subZonaName != undefined || null) {
      this.formularioFiltroAforo.value.subZonaHidrografica = subZonaName['text'];
    }
    if (subCuencaName != undefined || null) {
      this.formularioFiltroAforo.value.subCuenca = subCuencaName['text'];
    }
  }
  */

  validarPermiso(event: any): boolean {
    return MetodosGlobales.validarPermiso(event);
  }
  
}
