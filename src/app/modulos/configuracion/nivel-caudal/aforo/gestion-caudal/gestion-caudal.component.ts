import { Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { dominiosEnum } from 'src/app/modelo/enum/dominios-enum';
import { ServiciosDominiosValoresService } from '../../../dominios/servicios-dominios-valores.service';
import { ServiciosEstacionesService } from '../../../../elementos/estaciones/servicios-estaciones.service';
import { estados ,OrigenObservacion} from '../../../../../common/utils/constantes';
import { ServiciosObservacionesEstacionService } from '../../../../observaciones/servicios-observaciones-estacion.service';
import { ServiciosGeograficosService } from 'src/app/common/mapa/servicios-geograficos.service';
import { ServiciosAforoService } from '../servicios-aforo.service';
import { IObtenerDetalleNivelCaudalRequest, IObtenerDetalleNivelCaudalResponse, IObtenerParametrosCurvaNivelCaudalRequest, IObtenerParametrosCurvaNivelCaudalResponse, IObtenerTablaAgregacionAnualRequest, IObtenerTablaAgregacionMensualRequest } from 'src/app/modelo/configuracion/curvaTendencia';
import { Ecuacion } from 'src/app/modelo/configuracion/aforoGrafica';
import { ServiciosParametrosService } from '../../../../parametros/servicios-parametros.service';
import { ServiciosParametrosEstacionesService } from '../../../../elementos/estaciones/servicios-parametros-estaciones.service';

import { Router } from '@angular/router';
import * as Highcharts from 'highcharts';
import Exporting from 'highcharts/modules/exporting';
import HC_exporting from "highcharts/modules/exporting";
import HC_Data from "highcharts/modules/export-data";
import Accessbility from "highcharts/modules/accessibility";
import Swal from 'sweetalert2';
import { toInteger, toNumber, toString } from 'lodash';

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

Exporting(Highcharts);

export var var1: number = 0;
export var var2: string = '';
export var var3: string = '';
export var grado: number = 0;

HC_exporting(Highcharts);
HC_Data(Highcharts);
Accessbility(Highcharts);

@Component({
  selector: 'app-gestion-caudal',
  templateUrl: './gestion-caudal.component.html',
})

export class GestionCaudalComponent implements OnInit {
  
  isHighcharts = typeof Highcharts === 'object';
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};
  public fechaActualMensual: string;
  public fechaActualHora: string;
  public fechaActual:Date = new Date();
  public listObservaciones: any = [];
  public listaParametros: any = [];
  public listObservacionesInsertadas: any = [];
  public listaP: any = [];
  public id: string = '0';
  public te: string = '0';
  public elemento: number = 1;
  public idElemento: any = '';
  public idParametro: any = '';
  public idParametroXEstacion: any = 0;
  public listaCodigoEAAB: any = [];
  public formularioFiltroAforo!: FormGroup;
  public listaCodigoIDEAM: any = [];
  public listaDepartamento: any = [];
  public listaMunicipio: any = [];
  public listaZonaHidrograficas: any = [];
  public listaAreaHidrograficas: any = [];
  public listaSubZonaHidrograficas: any = [];
  public listaCuencas: any = [];
  public listaMicroCuencas: any = [];
  public listaEntidades: any = [];
  public fechaObservacion: any;
  public Estacion: any;
  public NombresParametros: any = [];
  public listaEntidad = [];
  public listarEcuacion: any[] = [];
  public CodigoParametros: any = [];
  public listaNumeroEcuacion: any = [];
  capas: any[] = []
  public listaFrecuencia: any = [];
  public newlistaFrecuencia: any = [];
  public listaNumeroAforo = [];
  public lisTipoAforo = [];
  public listaAforodor = [];
  public listaFrecuenciaXParametro: any = [];
  public listaElemento: any = [];
  public listaflag: any = [];
  listaTipoAforo = [] as any;
  public fecha: string;
  public fechaAno: number;
  public fechaMes: string;
  public periodo: number = 2;
  public usuario = JSON.parse(sessionStorage.getItem('usuario') || '{}');
  public valor: number;
  public flag: number = 0;
  public origen: string;
  public idfrecuencia: number;
  public listaMunicipios = [];
  public listaDepartamentos = [];
  public departamentoSelected: any;
  private tempIdDepartamento: number = 0;
  public listaAreaHidrografica: [];
  public listaZonaHidrografica: [];
  public listaSubzonaHidrografica: [];
  public listaNivelSubsiguiente: [];
  public listaCuenca: [];
  public listaSubcuenca: [];
  public listaMicrocuenca: [];
  public listaTipoCoordenada: [];
  //public listaCorriente: [];
  public listaAnos : any[] = [];
  public idTipoAgregacion: any = '';
  public idEcuacion: any = '';
  public idOperacion: any = '';
  public idAno: any = '';
  //public nombreCorriente: any = '';
  public fechaInicio: any = '';
  public fechaFin: any = '';
  public datosTablaGrafico: any[] = [];
  public datosTablaAnual: any[] = [];
  public datosTablaMensual: any[] = [];
  public ecuacionR : any = '';
  public tipoEcuacion : any = '';
  public idtipoEcuacion : any = 0;
  public ecuacionMAE : any = '';
  public exponente : any = 0
  public coeficiente : any = 0
  public ecuacion : any = '';
  public tipoRango : any = 2;
  public observaciones : any = [];

  rutaConsulta1 = 'configuracion/gestionAforo/V/';
  
  @ViewChild("chart") chart: ChartComponent;

  datePipe: DatePipe = new DatePipe('en-ES');
  public listaBusqueda: any[] = [];
  listParametroXElemento = [] as any;
  aforoSelecionado = [];

  public listaTiposAgregacion: any[] = [
    /*
    {
      id: 1,
      text: 'Medios Diarios ',
      disabled: false,
    }, {
      id: 2,
      text: 'Máximo Adsoluto Diario',
      disabled: false,
    }, {
      id: 3,
      text: 'Mínimo Adsoluto Diario',
      disabled: false,
    }, {
      */
     {
      id: 4,
      text: 'Medios Mensuales',
      disabled: false,
    }, {
      id: 5,
      text: 'Máximos Medio Mensual',
      disabled: false,
    }, {
      id: 6,
      text: 'Mínimo Medio Mensual',
      disabled: false,
    }
      /*
    }, {
      id: 7,
      text: 'Caudal Medios Anual',
      disabled: false,
    }, {
      id: 8,
      text: 'Medios Mensual Multianual',
      disabled: false,
    }, {
      id: 9,
      text: 'Máximo Mensual Multianual',
      disabled: false,
    },
    {
      id: 10,
      text: 'Mínimo Mensual Multianual',
      disabled: false,
    }
    */
  ];


  listaOperaciones : any[] = [
    {
      id: 1,
      text: 'Máximo', 
      disabled: false,
    },
    {
      id: 2,
      text: 'Mínimo', 
      disabled: false,
    },
    {
      id: 3,
      text: 'Promedio', 
      disabled: false,
    },
  ];

  columnasTablaGrafico = [
    {
      title: 'Fecha',
      data: 'fecha_Curva',
    },
    {
      title: 'Nivel(m)',
      data: 'nivel',
    },
  ];

  columnasTablaAnual = [
    {
      title: 'Año/Mes',
      data: 'ano',
    },
    {
      title: 'Ene',
      data: 'enero',
      'render': function (data: string, type: any, row: any, meta: any) {
        if ( null==data || undefined==data || data.length<=0 ) {
          return '0';
        }

        return data;
      }
    },
    {
      title: 'Feb',
      data: 'febrero',
      'render': function (data: string, type: any, row: any, meta: any) {
        if ( null==data || undefined==data || data.length<=0 ) {
          return '0';
        }

        return data;
      }
    },
    {
      title: 'Mar',
      data: 'marzo',
      'render': function (data: string, type: any, row: any, meta: any) {
        if ( null==data || undefined==data || data.length<=0 ) {
          return '0';
        }

        return data;
      }
    },
    {
      title: 'Abr',
      data: 'abril',
      'render': function (data: string, type: any, row: any, meta: any) {
        if ( null==data || undefined==data || data.length<=0 ) {
          return '0';
        }

        return data;
      }
    },

    {
      title: 'May',
      data: 'mayo',
      'render': function (data: string, type: any, row: any, meta: any) {
        if ( null==data || undefined==data || data.length<=0 ) {
          return '0';
        }

        return data;
      }
    },
    {
      title: 'Jun',
      data: 'junio',
      'render': function (data: string, type: any, row: any, meta: any) {
        if ( null==data || undefined==data || data.length<=0 ) {
          return '0';
        }

        return data;
      }
    },
    {
      title: 'Jul',
      data: 'julio',
      'render': function (data: string, type: any, row: any, meta: any) {
        if ( null==data || undefined==data || data.length<=0 ) {
          return '0';
        }

        return data;
      }
    },
    {
      title: 'Ago',
      data: 'agosto',
      'render': function (data: string, type: any, row: any, meta: any) {
        if ( null==data || undefined==data || data.length<=0 ) {
          return '0';
        }

        return data;
      }
    },
    {
      title: 'Sep',
      data: 'septiembre',
      'render': function (data: string, type: any, row: any, meta: any) {
        if ( null==data || undefined==data || data.length<=0 ) {
          return '0';
        }

        return data;
      }
    },
    {
      title: 'Oct',
      data: 'octubre',
      'render': function (data: string, type: any, row: any, meta: any) {
        if ( null==data || undefined==data || data.length<=0 ) {
          return '0';
        }

        return data;
      }
    },
    {
      title: 'Nov',
      data: 'noviembre',
      'render': function (data: string, type: any, row: any, meta: any) {
        if ( null==data || undefined==data || data.length<=0 ) {
          return '0';
        }

        return data;
      }
    },
    {
      title: 'Dic',
      data: 'diciembre',
      'render': function (data: string, type: any, row: any, meta: any) {
        if ( null==data || undefined==data || data.length<=0 ) {
          return '0';
        }

        return data;
      }
    },
    {
      title: 'Máximo',
      data: 'maximo',
    },
    {
      title: 'Mínimo',
      data: 'minimo',
    },
    {
      title: 'Media',
      data: 'promedio', 
      'render': function (data: number, type: any, row: any, meta: any) {
        let valor = row.promedio;
        valor = (Math.round(valor * 100) / 100).toFixed(2);
        return '' + valor;
      }
    },
  ];

  columnasTablaMensual = [
    {
      title: 'Mes/Día',
      data: 'mes',
    },
    {
      title: '1',
      data: 'valorDia1',
      'render': function (data: string, type: any, row: any, meta: any) {
        if ( null==data || undefined==data || data.length<=0 ) {
          return '0';
        }

        return data;
      }
    },
    {
      title: '2',
      data: 'valorDia2',
      'render': function (data: string, type: any, row: any, meta: any) {
        if ( null==data || undefined==data || data.length<=0 ) {
          return '0';
        }

        return data;
      }
    },
    {
      title: '3',
      data: 'valorDia3',
      'render': function (data: string, type: any, row: any, meta: any) {
        if ( null==data || undefined==data || data.length<=0 ) {
          return '0';
        }

        return data;
      }
    },
    {
      title: '4',
      data: 'valorDia4',
      'render': function (data: string, type: any, row: any, meta: any) {
        if ( null==data || undefined==data || data.length<=0 ) {
          return '0';
        }

        return data;
      }
    },

    {
      title: '5',
      data: 'valorDia5',
      'render': function (data: string, type: any, row: any, meta: any) {
        if ( null==data || undefined==data || data.length<=0 ) {
          return '0';
        }

        return data;
      }
    },
    {
      title: '6',
      data: 'valorDia6',
      'render': function (data: string, type: any, row: any, meta: any) {
        if ( null==data || undefined==data || data.length<=0 ) {
          return '0';
        }

        return data;
      }
    },
    {
      title: '7',
      data: 'valorDia7',
      'render': function (data: string, type: any, row: any, meta: any) {
        if ( null==data || undefined==data || data.length<=0 ) {
          return '0';
        }

        return data;
      }
    },
    {
      title: '8',
      data: 'valorDia8',
      'render': function (data: string, type: any, row: any, meta: any) {
        if ( null==data || undefined==data || data.length<=0 ) {
          return '0';
        }

        return data;
      }
    },
    {
      title: '9',
      data: 'valorDia9',
      'render': function (data: string, type: any, row: any, meta: any) {
        if ( null==data || undefined==data || data.length<=0 ) {
          return '0';
        }

        return data;
      }
    },
    {
      title: '10',
      data: 'valorDia10',
      'render': function (data: string, type: any, row: any, meta: any) {
        if ( null==data || undefined==data || data.length<=0 ) {
          return '0';
        }

        return data;
      }
    },
    {
      title: '11',
      data: 'valorDia11',
      'render': function (data: string, type: any, row: any, meta: any) {
        if ( null==data || undefined==data || data.length<=0 ) {
          return '0';
        }

        return data;
      }
    },
    {
      title: '12',
      data: 'valorDia12',
      'render': function (data: string, type: any, row: any, meta: any) {
        if ( null==data || undefined==data || data.length<=0 ) {
          return '0';
        }

        return data;
      }
    },
    {
      title: '13',
      data: 'valorDia13',
      'render': function (data: string, type: any, row: any, meta: any) {
        if ( null==data || undefined==data || data.length<=0 ) {
          return '0';
        }

        return data;
      }
    },
    {
      title: '14',
      data: 'valorDia14',
      'render': function (data: string, type: any, row: any, meta: any) {
        if ( null==data || undefined==data || data.length<=0 ) {
          return '0';
        }

        return data;
      }
    },
    {
      title: '15',
      data: 'valorDia15',
      'render': function (data: string, type: any, row: any, meta: any) {
        if ( null==data || undefined==data || data.length<=0 ) {
          return '0';
        }

        return data;
      }
    },
    {
      title: '16',
      data: 'valorDia16',
      'render': function (data: string, type: any, row: any, meta: any) {
        if ( null==data || undefined==data || data.length<=0 ) {
          return '0';
        }

        return data;
      }
    },
    {
      title: '17',
      data: 'valorDia17',
      'render': function (data: string, type: any, row: any, meta: any) {
        if ( null==data || undefined==data || data.length<=0 ) {
          return '0';
        }

        return data;
      }
    },
    {
      title: '18',
      data: 'valorDia18',
      'render': function (data: string, type: any, row: any, meta: any) {
        if ( null==data || undefined==data || data.length<=0 ) {
          return '0';
        }

        return data;
      }
    },
    {
      title: '19',
      data: 'valorDia19',
      'render': function (data: string, type: any, row: any, meta: any) {
        if ( null==data || undefined==data || data.length<=0 ) {
          return '0';
        }

        return data;
      }
    },
    {
      title: '20',
      data: 'valorDia20',
      'render': function (data: string, type: any, row: any, meta: any) {
        if ( null==data || undefined==data || data.length<=0 ) {
          return '0';
        }

        return data;
      }
    },
    {
      title: '21',
      data: 'valorDia21',
      'render': function (data: string, type: any, row: any, meta: any) {
        if ( null==data || undefined==data || data.length<=0 ) {
          return '0';
        }

        return data;
      }
    },
    {
      title: '22',
      data: 'valorDia22',
      'render': function (data: string, type: any, row: any, meta: any) {
        if ( null==data || undefined==data || data.length<=0 ) {
          return '0';
        }

        return data;
      }
    },
    {
      title: '23',
      data: 'valorDia23',
      'render': function (data: string, type: any, row: any, meta: any) {
        if ( null==data || undefined==data || data.length<=0 ) {
          return '0';
        }

        return data;
      }
    },
    {
      title: '24',
      data: 'valorDia24',
      'render': function (data: string, type: any, row: any, meta: any) {
        if ( null==data || undefined==data || data.length<=0 ) {
          return '0';
        }

        return data;
      }
    },
    {
      title: '25',
      data: 'valorDia25',
      'render': function (data: string, type: any, row: any, meta: any) {
        if ( null==data || undefined==data || data.length<=0 ) {
          return '0';
        }

        return data;
      }
    },
    {
      title: '26',
      data: 'valorDia26',
      'render': function (data: string, type: any, row: any, meta: any) {
        if ( null==data || undefined==data || data.length<=0 ) {
          return '0';
        }

        return data;
      }
    },
    {
      title: '27',
      data: 'valorDia27',
      'render': function (data: string, type: any, row: any, meta: any) {
        if ( null==data || undefined==data || data.length<=0 ) {
          return '0';
        }

        return data;
      }
    },
    {
      title: '28',
      data: 'valorDia28',
      'render': function (data: string, type: any, row: any, meta: any) {
        if ( null==data || undefined==data || data.length<=0 ) {
          return '0';
        }

        return data;
      }
    },
    {
      title: '29',
      data: 'valorDia29',
      'render': function (data: string, type: any, row: any, meta: any) {
        if ( null==data || undefined==data || data.length<=0 ) {
          return '0';
        }

        return data;
      }
    },
    {
      title: '30',
      data: 'valorDia30',
      'render': function (data: string, type: any, row: any, meta: any) {
        if ( null==data || undefined==data || data.length<=0 ) {
          return '0';
        }

        return data;
      }
    },
    {
      title: '31',
      data: 'valorDia31',
      'render': function (data: string, type: any, row: any, meta: any) {
        if ( null==data || undefined==data || data.length<=0 ) {
          return '0';
        }

        return data;
      }
    },
    {
      title: 'Máximo',
      data: 'maximo',
    },
    {
      title: 'Mínimo',
      data: 'minimo',
    },
    {
      title: 'Media',
      data: 'promedio', 
      'render': function (data: number, type: any, row: any, meta: any) {
        let valor = row.promedio;
        valor = (Math.round(valor * 100) / 100).toFixed(2);
        return '' + valor;
      }
    },
  ];

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
  get idTipoAgregacionFC() {
    return this.formularioFiltroAforo.get('idTipoAgregacionFC');
  }
  get ecuacionesCTR() {
    return this.formularioFiltroAforo.get('ecuacionesCTR');
  }

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private serviciosEstacionesService: ServiciosEstacionesService,
    private serviciosDominiosValoresService: ServiciosDominiosValoresService,
    private serviciosObservacionesEstacionService: ServiciosObservacionesEstacionService,
    private serviciosGeograficosService: ServiciosGeograficosService,
    private servicioAforo: ServiciosAforoService,
    private serviciosParametrosService: ServiciosParametrosService,
    private sercioparametrosestacion: ServiciosParametrosEstacionesService,


  ) { }

  ngOnInit(): void {

  



    this.construirFormulario();

    this.chartOptions = {
      title: {
        text: 'Relación Caudal (Q) vs Nivel (H)'
      },
      xAxis: {
        title: {
          text: ' Nivel (H)'
        },
      },
      yAxis: {
        title: {
          text: 'Caudal (Q)'
        },
      },
      series: [{
        type: 'line',
        name: "Regresión Lineal ",
        data: [],
      }, {
        type: 'scatter',
        name: 'Aforos',
        data: [],
      }]
    };

    this.obtenerElementos(466);

    // Entidad
    this.serviciosDominiosValoresService
      .obtenerValoresPorIdDominio(dominiosEnum.Entidad)
      .subscribe((response) => {
        this.listaEntidad = response;
      });

    // Departamentos
    this.serviciosGeograficosService
      .obtenerDepartamentos()
      .subscribe((response) => {
        this.listaDepartamentos = response;
      });

    // tipoCorriente
    /*
    this.serviciosDominiosValoresService
      .obtenerValoresActivosPorIdDominio(dominiosEnum.TipoCorriente)
      .subscribe((response) => {
        this.listaCorriente = response;
      });
      */

      // Número Ecuaciones
    this.servicioAforo
      .obtenerNumeroEcuacion()
      .subscribe((response) => {
        this.listaNumeroEcuacion = response;
      });
  }

  cargarDatos() {

  }

  obtenerElemento() {
    let idParam: number = +this.id;
    this.obtenerElementos(this.te);
    this.elemento = parseInt(this.te);

    switch (this.te) {
      case '1': {
        this.serviciosObservacionesEstacionService
          .obtenerPorIdDTO(idParam)
          .subscribe((response) => {
            this.obtenerParametrosElemento(response.idEstacion, this.te);

            var fecha = new Date(response.fecha); //Fecha actual
            var mes: any = fecha.getMonth() + 1; //obteniendo mes
            var dia: any = fecha.getDate(); //obteniendo dia
            var ano: any = fecha.getFullYear();
            if (dia < 10) {
              dia = '0' + dia; //agrega cero si el menor de 10
            }
            if (mes < 10) {
              mes = '0' + mes;
            }

            if (response.frecuencia == 155) {
              this.fechaAno = ano
            }
            if (response.frecuencia == 154) {
              // Mes 
              this.fechaMes = ano + '-' + mes
              console.log(this.fecha);
            }

            if (response.frecuencia == 152) {
              this.fecha = ano + '-' + mes + '-' + dia
            }

            if (response.frecuencia == 151 || response.frecuencia == 146 || response.frecuencia == 145) {
              this.fecha = response.fecha.slice(0, -13);
            }
            this.id
            this.idfrecuencia = response.frecuencia;

            let obFormulario: any = {
              idObservacion: this.id,
              idParametro: response.idParametroXEstacion,
              idElemento: response.idEstacion,
              fecha: this.fechaObservacion,
              idTipoOrigenObservacion: response.idTipoOrigenObservacion,
              origen: response.origen,
              usuarioCargue: response.usuarioCargue,
              valor: response.valor,
              idFlagObservacion: response.idFlagObservacion,
              activo: estados.activo,
              idEstadoObservacion: response.idEstadoObservacion,
              CodigoEAAB: this.te,
              CodigoIDEAM: this.te,
              idfrecuencia: response.frecuencia,
              fechaCargue: response.fechaCargue,
              usuarioModificacion: response.usuarioModificacion,
              usuarioEstado: response.usuarioEstado,
              fechaEstado: response.fechaEstado,
              usuarioCreacion: response.usuarioCreacion,
              fechaCreacion: response.fechaCreacion,
              fechaModificacion: response.fechaModificacion,
            };

            this.formularioFiltroAforo.setValue(obFormulario);
          });

        break;
      }
      
      default: {
      }
    }
  }

  private construirFormulario() {
    this.formularioFiltroAforo = this.formBuilder.group({
      // datos que no van en el formulario
      idelemento: ['', [Validators.required]],
      idEcuacion: ['', [Validators.required]],
      //nombreCorriente: [''],
      idDepartamento: [''],
      idMunicipio: [''],
      idAreaHidrografica: [''],
      idfrecuencia: [''],
      idZonaHidrografica: [''],
      idSubZonaHidrografica: [''],
      idCuenca: [''],
      idMicroCuenca: [''],
      idtipoAforo: [''],
      aforador: [''],
      idAforo: [''],
      idEntidad: [''],
      fechaFin: ['', [Validators.required]],
      fechaInicio: ['', [Validators.required]],
      idTipoAgregacionFC: [''],
      periodo: [''], 
    });
  }

  filtrar(elemento: any) {
    if ( !this.formularioFiltroAforo.valid ) {
      Swal.fire({
        title: 'Campos requeridos', 
        html: 'Por favor revise los campos obligatorios.', 
        icon: 'error',
      });
      return;
    }

    if ( this.tipoRango==2 && (!this.assertNullAndUndefined(this.fechaInicio) || !this.assertNullAndUndefined(this.fechaFin) || this.fechaInicio>=this.fechaFin) ) {
      Swal.fire({
        title: 'Fechas NO válidas', 
        html: 'La fecha inicio debe ser menor a la fecha final.', 
        icon: 'error',
      });
      return;
    }

    /*
    let nYears = this.calculateYears(this.fechaInicio, this.fechaFin);
    if ( this.tipoRango==2 && (nYears != 0) ) {
      Swal.fire({
        title: 'Fechas NO válidas', 
        html: 'Solo se permite seleccionar máximo 1 año como periodo de tiempo.', 
        icon: 'error',
      });
      return;
    }
    */

    this.datosTablaGrafico = [];
    this.datosTablaAnual = [];
    this.datosTablaMensual = [];
    this.listaAnos = [];
    this.idOperacion = '';

    this.chartOptions.series = [{
      name: "Nivel ",
      type: "scatter",
      data: []
    },];

    this.ecuacion = '';
    this.ecuacionR = '';
    this.ecuacionMAE = '';
    
    try {
      Swal.fire({
        title: 'Cargando datos...',
        html: 'Por favor espere.', 
        timer: 42000, 
        timerProgressBar: true, 
        allowOutsideClick: false, 
        showConfirmButton: false, 
        didOpen: async() => {
          Swal.showLoading();

          let request: IObtenerDetalleNivelCaudalRequest = {
            idEstacion: this.idElemento,
            idEcuacion: this.idEcuacion, 
            fechaInicio: elemento.value.fechaInicio,
            fechaFin: elemento.value.fechaFin,
            nombreCorriente: '',
          };
          
          this.servicioAforo.obtenerTablaNivelesCaudal(request).subscribe((response: IObtenerDetalleNivelCaudalResponse[]) => {
            let ecuaciones = this.listarEcuacion.filter(ecuacion => {
              return ecuacion.id == this.idEcuacion;
            });

            if ( this.assertNullAndUndefined(ecuaciones) && ecuaciones.length>0 ) {
              this.ecuacion = ecuaciones[0].ecuacion;
              this.ecuacionR = ecuaciones[0].r2;
              this.ecuacionMAE = ecuaciones[0].mae;
              this.tipoEcuacion = ecuaciones[0].id_tipo_ecuacion;
              this.idtipoEcuacion = ecuaciones[0].id_tipo_ecuacion;
              this.exponente = ecuaciones[0].exponente;
              this.coeficiente = ecuaciones[0].coeficiente;

              
            }

      
            
            this.datosTablaGrafico = response;

            let serieNivelCaudal = [];
            let serieRegresion = [];

            for ( let index = 0; index<response.length; index++ ) {
              let nivel = response[index]['nivel'];
              let caudal = response[index]['caudal'];
              serieNivelCaudal.push([nivel, caudal]);

              let valorX = response[index]['valor_En_X'];
              let valorY = response[index]['valor_En_Y'];
              serieRegresion.push([valorX, valorY]);
            }

            this.chartOptions = {
              title: {
                text: 'Relación Caudal (Q) vs Nivel (H)'
              },
              xAxis: {
                title: {
                  text: ' Nivel (H)'
                },
              },
              yAxis: {
                title: {
                  text: 'Caudal (Q)'
                },
              },
              series: [{
                type: 'line',
                name: "Regresión Lineal ",
                data: serieRegresion,
              }, {
                type: 'scatter',
                name: 'Aforos',
                data: serieNivelCaudal,
              }]
            };
            
            //this.chartOptions.chart.events['dataPointSelection'] = this.dataPointSelection;

            Swal.close();
          });
        }, 
        willClose: async() => {
          Swal.hideLoading();
        }
      });
    } catch (error) {
      console.error(error);
    }
  }

  obtenerElementos(even: any) {
    this.listaElemento = [];
    this.listaCodigoEAAB = [];
    this.listaCodigoIDEAM = [];
    this.listaDepartamento = [];
    this.listaMunicipio = [];
    this.listaAreaHidrograficas = [];
    this.listaZonaHidrograficas = [];
    this.listaSubZonaHidrograficas = [];
    this.listaCuencas = [];
    this.listaMicroCuencas = [];
    this.listaEntidades = [];

    switch (even) {
      case 466: {
        Swal.fire({
          title: 'Cargando información...',
          html: 'Por favor espere',
          timer: 42000,
          timerProgressBar: true,
          allowOutsideClick: false, 
          showConfirmButton: false, 
          didOpen: async () => {
            Swal.showLoading();

            this.serviciosEstacionesService.obtenerEstaciones().subscribe((response) => {

                this.listaCodigoEAAB = response.filter((element => element.codigoEstacionEaab != null)).map((elemento: any) => ({
                  id: elemento.idEstacion,
                  text: elemento.codigoEstacionEaab,
                  disabled: elemento.activo == 'S' ? false : true,
                }));

                this.listaCodigoIDEAM = response.filter((element => element.codigoEstacionIdeam != null)).map((elemento: any) => ({
                  id: elemento.idEstacion,
                  text: elemento.codigoEstacionIdeam,
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

                this.listaAreaHidrograficas = response.map((elemento: any) => ({
                  id: elemento.idEstacion,
                  text: elemento.areaHidrografica,
                  disabled: elemento.activo == 'S' ? false : true,
                }));

                this.listaZonaHidrograficas = response.map((elemento: any) => ({
                  id: elemento.idEstacion,
                  text: elemento.zonaHidrografica,
                  disabled: elemento.activo == 'S' ? false : true,
                }));

                this.listaSubZonaHidrograficas = response.map((elemento: any) => ({
                  id: elemento.idEstacion,
                  text: elemento.subZonaHidrografica,
                  disabled: elemento.activo == 'S' ? false : true,
                }));

                this.listaCuencas = response.map((elemento: any) => ({
                  id: elemento.idEstacion,
                  text: elemento.cuenca,
                  disabled: elemento.activo == 'S' ? false : true,
                }));

                this.listaMicroCuencas = response.map((elemento: any) => ({
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
        }
        );
        break;
      }

      default: {
        break;
      }
    }
  }

  obtenerParametrosElemento(event: any, mecanismo: any) {
    if ( null==event || undefined==event || event.length<=0 || event<=0 ) {
      return;
    }

    if ( null==mecanismo || undefined==mecanismo || mecanismo.length<=0 || mecanismo<=0 ) {
      return;
    }

    this.listarEcuacion = [];

    switch (mecanismo) {

      case 1: {

        Swal.fire({
          title: 'Cargando Ecuaciones...', 
          html: 'Por favor espere.', 
          timer: 42000, 
          timerProgressBar: true, 
          allowOutsideClick: false, 
          showConfirmButton: false,
          didOpen: async() => {
            Swal.showLoading();

            this.listarEcuacion = [];

            let ecuaciones: Ecuacion = {
              idElemento: this.idElemento,
              idTipoElemento: 466
            };

            this.servicioAforo.obtenerListaEcuaciones(ecuaciones).subscribe((response: any) => {
              if ( null==response || undefined==response ||response.length<=0 ) {
                Swal.close();

                this.obtenerParametros(this.idElemento);
                return;
              }
             
              this.listarEcuacion = response.map((elemento: any) => ({
                id: elemento.id, 
                text:"Estación: "+elemento.idElemento  +" Curva Tendencia: "+ elemento.id_curva_tendencia +" Ecuación# "+elemento.consecutivo ,
                id_informacion_ecuaciones: elemento.id_informacion_ecuaciones,
                id_curva_tendencia: elemento.id_curva_tendencia,
                tramo: elemento.tramo,
                nivel_min: elemento.nivel_min,
                nivel_max: elemento.nivel_max,
                coeficiente: elemento.coeficiente,
                exponente: elemento.exponente,
                ho: elemento.ho,
                r2: elemento.r,
                mae: elemento.mae,
                consecutivo: elemento.consecutivo,
                ecuacion: elemento.ecuacion,
                id_tipo_ecuacion:elemento.tipo_ecuacion
              }));

          

              this.obtenerParametros(this.idElemento);
            });
          }, 
          willClose: async() => {
            Swal.hideLoading();
          }
        });
        break;
      }

      default: {
        break;
      }
    }
  }

  obtenerParametros(idEstacion : number) {
    if ( !this.assertNullAndUndefined(idEstacion) ) {
      console.error('La estacion seleccionada NO es valida: ' + idEstacion);
      return;
    }

    Swal.fire({
      title: 'Cargando Parámetros...', 
      html: 'Por favor espere.', 
      timer: 42000, 
      timerProgressBar: true, 
      allowOutsideClick: false, 
      showConfirmButton: false, 
      didOpen: async() => {
        Swal.showLoading();

        this.listaParametros = [];

        let request: IObtenerParametrosCurvaNivelCaudalRequest = {
          estacionId: idEstacion,
          periodoIds: [152, 154]
        };

        this.servicioAforo.obtenerParametrosCurvaNivelCaudal(request).subscribe((response : IObtenerParametrosCurvaNivelCaudalResponse[]) => {
          let copia : any[] = [...this.listaParametros];

          response.forEach(elemento => {
            let dato : any = {
              id: elemento.parametroId, 
              text: elemento.parametroNombre + ' (' + elemento.unidadMedidaNombre.toLowerCase()  + ')', 
              idPeriodo: elemento.periodoId,
              parametroXEstacionId: elemento.parametroXEstacionId, 
              disabled: false
            };

            let datos = copia.filter((param : any) => {
              return param.id === dato.id;
            });

            if ( !this.assertNullAndUndefined(datos) || datos.length<=0 ) {
              copia.push(dato);
            }
          });

          this.listaParametros = [];
          this.listaParametros = [...copia];

          Swal.close();
        });
      }, 
      willClose: async() => {
        Swal.hideLoading();
      }
    });
  }

  onPeriodoVigente() {
    this.periodo = 1;
  }

  onEstablecerRango() {
    this.periodo = 2;
  }

  onTipoAgregacionChange(event : any) {
    if ( !this.assertNullAndUndefined(event) || event.length<=0 ) {
      return;
    }

    this.listaAnos = [];
    this.idTipoAgregacion = parseInt(event);

    let allowed : number[] = [4, 5, 6];

    if ( !allowed.includes(this.idTipoAgregacion) ) {
      Swal.fire({
        icon: 'warning',
        title: 'En construcción...',
        html: 'El tipo de agregación solicitado se encuentra en construcción.'
      });
      return;
    }

    Swal.fire({
      title: 'Cargando agregaciones anuales...', 
      html: 'Por favor espere.', 
      timer: 42000, 
      timerProgressBar: true, 
      allowOutsideClick: false, 
      showConfirmButton: false, 
      didOpen: async() => {
        Swal.showLoading();

        let request : IObtenerTablaAgregacionAnualRequest = {
          codigoOperacion: this.idOperacion,
          idTipoElemento: 466,
          idElemento: this.idElemento,
          idEcuacion: this.idEcuacion,
          fechaInicio: this.fechaInicio,
          fechaFin: this.fechaFin, 
        }
    
        this.servicioAforo.obtenerTablaAgregacionAnual(request).subscribe(response => {
          this.datosTablaAnual = response;

          this.listaAnos = response.map(value => {
            return {
              id: value.ano, 
              text: value.ano, 
              disabled: false,
            };
          });

          Swal.close();
        });
      }, 
      willClose: async() => {
        Swal.hideLoading();
      }
    });
  }

  onParametroChange(event : any) {
    if(event ){
    Swal.fire({
        title: 'Cacular caudal!',
        html: `   
        <h6> Desea calcular caudal con los siguientes datos </h6>
        <table border="1">
        <tbody>
            <tr>
                <th style="color: #2c9ce1;">Tipo Ecuación</th>
                <td colspan="2">&nbsp;</td>
                <td>`+this.tipoEcuacion+`</td>
            </tr>
            <tr>
                <th style="color: #2c9ce1;">Ecuación</th>
                <td colspan="2">&nbsp;</td>
                <td> `+this.ecuacion+`</td>
            </tr>
            <tr>
            <th style="color: #2c9ce1;">MAE</th>
            <td colspan="2">&nbsp;</td>
            <td>`+this.ecuacionMAE+`</td>
            </tr>
            <tr>
            <th style="color: #2c9ce1;">Paramentro</th>
            <td colspan="2">&nbsp;</td>
            <td> `+  this.listaParametros.filter((filtro:any)=> filtro.id == event)[0].text +`</td>
        </tr>
            <tr>
                <th style="color: #2c9ce1;">Estación</th>
                <td colspan="2">&nbsp;</td>
                <td> `+  this.listaElemento.filter((filtro:any)=> filtro.id == this.idElemento)[0].text  +`</td>
            </tr>
          
        </tbody>
    </table>`,
        showCancelButton: true,
        showCloseButton: true,
        showConfirmButton: true,
        confirmButtonText: 'Calcular caudal ',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Salir',
     
      }).then((result) => {
        if (result.isConfirmed) {
          var tipoEcuacion =  this.tipoEcuacion;
          if (event) {
      
            this.onParametroChange1(event,tipoEcuacion);
          }
        } else {
       
          
        }
      });
    }
  
  }
  guardar(mecanismo: any) {
    let arregladoFinal = [];
    switch (mecanismo) {
      case '1': {
        // Estacion
        // idParametroXEstacion


        break;
      }
    
    }
  }
  
  calcularFechas() {

    if (this.idfrecuencia == 155) {
      const fechass = this.fechaAno + '-01-01T05:04:30Z';
      // console.log(fechass)
      return (this.fechaObservacion = new Date(fechass));
    }
    if (this.idfrecuencia == 154) {
      const fechass = this.fechaMes + '-01T05:04:30Z';

      return (this.fechaObservacion = new Date(fechass));
    }
    if (this.idfrecuencia == 151 || this.idfrecuencia == 152 || this.idfrecuencia == 146 || this.idfrecuencia == 145 || this.idfrecuencia == 683 || this.idfrecuencia == 682) {
      return this.fechaObservacion = new Date(this.fecha);
    }

    return new Date();
  }
  
  validarObligatorios() {

    if (this.idfrecuencia == 155 && this.fechaAno == undefined) {
      return false;
    }
    if (
      this.idfrecuencia == 154 &&
      this.fechaMes == undefined &&
      this.fechaAno == undefined
    ) {
      return false;
    }
    if (
      (this.idfrecuencia == 151 && this.fecha == undefined) ||
      this.fecha == '' ||
      (this.idfrecuencia == 152 && this.fecha == undefined)
    ) {
      return false;
    }
    if (this.valor == undefined) {
      return false;
    }
     
    if (this.flag == undefined || this.flag == 0 )  {
      return false;
    }

    if (this.idfrecuencia == undefined) {
      return false;
    }

    if (this.idParametro == undefined || this.idParametro == 0) {
      return false;
    }
    if (this.formularioFiltroAforo.valid == false) {
      return false;
    }

    return true;
  }
  agregarlista() {
    // calcular fecha
    this.calcularFechas();
    let observacionParametros: any = {};
    var fecha = new Date(this.fechaObservacion); //Fecha actual
    var mes: any = fecha.getMonth() + 1; //obteniendo mes
    var dia: any = fecha.getDate(); //obteniendo dia
    var ano: any = fecha.getFullYear();

    var fechaFin ;

    this.idfrecuencia  = this.CodigoParametros.filter((filtro:any)=> filtro.id ==   this.idParametro)[0].idPeriodo
    console.log( this.idfrecuencia);
   
    observacionParametros = {
      idObservacionXElemento: 0,
      idParametroElemento: this.idParametro,
      fecha:this.fechaObservacion,
      valor: this.valor,
      idFlagObservacion: this.flag,
      flagInsert: true,
      idfrecuencia:this.idfrecuencia,
      flagExistente: false,
      origen: 'origen ' + this.idParametroXEstacion.length ,
      // valores fijos
      idEstadoObservacion: 266,
      idTipoOrigen: 262,
      activo: estados.activo,
      idTipoOrigenObservacion: OrigenObservacion.Manual,
      // Valores auditoria
      fechaCargue: null,
      fechaCreacion: null,
      fechaEstado: null,
      fechaModificacion: null,
      usuarioCargue: this.usuario.usuario,
      usuarioCreacion: this.usuario.usuario,
      usuarioEstado: null,
      usuarioModificacion: null,
    };
console.log(observacionParametros);
 
        this.listObservaciones.push(observacionParametros);
   
    }



  ListaAgregacion() {



  }


  cargaMaviva(lista: any) {


    if (this.listObservaciones[0]) {
      this.serviciosObservacionesEstacionService
        .creacionMasivafecha(lista)
        .subscribe((Response) => {

          this.listObservacionesInsertadas = Response;

          if (Response.length == 0) {
            this.toast.fire({
              icon: 'error',
              title:
                'Tiene ' + Response.length + ' Observaciones de agregación !',
            });

          } else {
            this.toast.fire({
              icon: 'success',
              title:
                'se guardaron ' + Response.length + ' Observaciones de agregación !',
            });



          }

        });



    } else {
      this.toast.fire({
        icon: 'error',
        title:
          'No hay información!',
      });
    }
  }

  onOperacionChange(event : any) {
    if ( !this.assertNullAndUndefined(event) || event.length<=0 ) {
      return;
    }

    this.datosTablaMensual = [];
    this.datosTablaAnual = [];
    this.idAno = '';
    this.listaAnos = [];

    Swal.fire({
      title: 'Cargando agregaciones anuales...', 
      html: 'Por favor espere.', 
      timer: 42000, 
      timerProgressBar: true, 
      allowOutsideClick: false, 
      showConfirmButton: false, 
      didOpen: async() => {
        Swal.showLoading();

        let request : IObtenerTablaAgregacionAnualRequest = {
          codigoOperacion: this.idOperacion,
          idTipoElemento: 466,
          idElemento: this.idElemento,
          idEcuacion: this.idEcuacion,
          fechaInicio: this.fechaInicio,
          fechaFin: this.fechaFin, 
        }

        this.servicioAforo.obtenerTablaAgregacionAnual(request).subscribe(response => {
          this.datosTablaAnual = response;

          this.listaAnos = response.map(value => {
            return {
              id: value.ano, 
              text: value.ano, 
              disabled: false,
            };
          });

          Swal.close();
        });
      }, 
      willClose: async() => {
        Swal.hideLoading();
      }
    });
  }

  onAnoChange(event : any) {
    if ( !this.assertNullAndUndefined(event) || event.length<=0 ) {
      return;
    }

    if ( !this.assertNullAndUndefined(this.idOperacion) || this.idOperacion.length<=0 ) {
      Swal.fire(
        'Aviso', 
        'Se debe selecionar una operación para calcular los valores de la tabla',
        'warning'
      );
      return;
    }

    this.idAno = parseInt(event);

    Swal.fire({
      title: 'Cargando agregaciones mensuales...', 
      html: 'Por favor espere.', 
      timer: 42000, 
      timerProgressBar: true, 
      allowOutsideClick: false, 
      showConfirmButton: false, 
      didOpen: async() => {
        Swal.showLoading();

        let request : IObtenerTablaAgregacionMensualRequest = {
          codigoOperacion: this.idOperacion,
          idTipoElemento: 466,
          idElemento: this.idElemento,
          idEcuacion: this.idEcuacion,
          ano: this.idAno,
        }
    
        this.servicioAforo.obtenerTablaAgregacionMensual(request).subscribe(response => {
          this.datosTablaMensual = response;
          Swal.close();
        });
      }, 
      willClose: async() => {
        Swal.hideLoading();
      }
    });
  }

  assertNullAndUndefined(value : any) : boolean {
    if ( null==value || undefined==value ) {
      return false;
    }

    return true;
  }
  onParametroChange1(event : any, tipoEcuacion:any) {


    if(event || tipoEcuacion ){
      Swal.fire({
        title: 'Cargando calculo de caudal...', 
        html: 'Por favor espere.', 
        timerProgressBar: true, 
        allowOutsideClick: false, 
        showConfirmButton: false, 
        didOpen: async() => {
          Swal.showLoading();
          this.serviciosParametrosService
          .obtenerPorId(event)
          .subscribe((response) => { 
            var parametroLista = response
            this.listaParametros= response
  
            var ipxe: any = {
              idParametro: this.listaParametros.idParametro,
              idEstacion: this.idElemento
            }
            console.log(ipxe);
            this.sercioparametrosestacion
              .obtenerListaParametrosEstacion(ipxe)
              .subscribe((Response) => {
                if (Response) {
                  this.idParametroXEstacion  = Response.idParametroXEstacion;
                } else {
      
                  this.toast.fire({
                    icon: 'error',
                    title:
                      'La estación no tiene asociado el parametro que se debe agregar !',
                  });
      
                }
      
              })
      
            console.log(parametroLista);
      
            this.periodo == 2;
      
      
            if(this.periodo == 2){
        
        
               var objetoBusqueda: any;
               const dateInicio = this.formularioFiltroAforo.value.fechaInicio;
               const [year, month, day] = dateInicio.split('-');
               const dateFin = this.formularioFiltroAforo.value.fechaFin;
               const [year1, month1, day1] = dateFin.split('-');
               this.formularioFiltroAforo.value.fechaInicio1 = `${day}-${month}-${year}`;
               this.formularioFiltroAforo.value.fechaFin1 = `${day1}-${month1}-${year1}`;
               if(this.idfrecuencia == 154){
        
                 this.formularioFiltroAforo.value.fechaInicio ="";
                 this.formularioFiltroAforo.value.fechaFin ="";
                 this.formularioFiltroAforo.value.fechaInicio1 = `${month}-${year}`;
                 this.formularioFiltroAforo.value.fechaFin1 = `${month1}-${year1}`;
        
                 var lastday = function(y:any,m:any){
                   return  new Date(y, m +1, 0).getDate();
                   }
                   this.formularioFiltroAforo.value.fechaInicio1  =   `${year}-${month}-01`;
                   this.formularioFiltroAforo.value.fechaFin1 = `${year1}-${month1}-`+lastday(`${year1}`,`${month1}`); 
                   this.formularioFiltroAforo.value.fechaInicio  =   `${year}-${month}-01`;
                   this.formularioFiltroAforo.value.fechaFin = `${year1}-${month1}-`+lastday(`${year1}`,`${month1}`); 
               }
        
               if(this.idfrecuencia == 152){
        
                 this.formularioFiltroAforo.value.fechaInicio ="";
                 this.formularioFiltroAforo.value.fechaFin ="";
                 this.formularioFiltroAforo.value.fechaInicio1 = `${month}-${year}`;
                 this.formularioFiltroAforo.value.fechaFin1 = `${month1}-${year1}`;
        
                 var lastday = function(y:any,m:any){
                   return  new Date(y, m +1, 0).getDate();
                   }
                   this.formularioFiltroAforo.value.fechaInicio1  =   `${year}-${month}-01`;
                   this.formularioFiltroAforo.value.fechaFin1 = `${year1}-${month1}-`+lastday(`${year1}`,`${month1}`); 
                   this.formularioFiltroAforo.value.fechaInicio  =   `${year}-${month}-01`;
                   this.formularioFiltroAforo.value.fechaFin = `${year1}-${month1}-`+lastday(`${year1}`,`${month1}`); 
               }
        
        
            }else{
               
             
        
             if(this.idfrecuencia == 145){
               this.formularioFiltroAforo.value.fechaInicio1 = "10-10-1900";
               this.formularioFiltroAforo.value.fechaFin1 =  this.fechaActual;
             
         
             }
             if(this.idfrecuencia == 152 ){
               this.formularioFiltroAforo.value.fechaInicio1 = "10-10-1900";
               this.formularioFiltroAforo.value.fechaFin1 = this.fechaActual;
         
               
             }
             if(this.idfrecuencia == 154){
         
              this.formularioFiltroAforo.value.fechaInicio1 = "10-1900";
               this.formularioFiltroAforo.value.fechaFin1 = this.fechaActualMensual 
            
             }
             if(this.idfrecuencia == 151){
               this.formularioFiltroAforo.value.fechaInicio = "1900-08-10T13:01";
               this.formularioFiltroAforo.value.fechaFin =     this.fechaActualHora 
              
               
             }
             if(this.idfrecuencia == 682){
               this.formularioFiltroAforo.value.fechaInicio = "1900-08-10T13:01";
               this.formularioFiltroAforo.value.fechaFin =      this.fechaActualHora 
              
             }
             if(this.idfrecuencia == 683){
         
               this.formularioFiltroAforo.value.fechaInicio = "1900-08-10T13:01";
               this.formularioFiltroAforo.value.fechaFin =     this.fechaActualHora 
              
             }
             if(this.idfrecuencia == 146){
         
               this.formularioFiltroAforo.value.fechaInicio = "1900-08-10T13:01";
               this.formularioFiltroAforo.value.fechaFin =      this.fechaActualHora 
         
         
             }
        
        
            }
            var codigo:string=  parametroLista.codigo
      
            this.formularioFiltroAforo.value.idParametro = parametroLista.idParametro
      
            this.formularioFiltroAforo.value.idElementoString  =  this.formularioFiltroAforo.value.idelemento ;
            
            this.formularioFiltroAforo.value.frecuencia = parametroLista.idPeriodo
            this.serviciosObservacionesEstacionService
            .calcularCaudal( this.formularioFiltroAforo.value)
              .subscribe((response) => {
                this.listObservaciones  =  response
  
                console.log(44,this.coeficiente,this.exponente);
                  for (
                    let index = 0;
                    index < this.listObservaciones.length;
                    index++
                  ) {
                    if(tipoEcuacion == 'Lineal'){
                       
                      var valor  =  this.listObservaciones[index]['valor'];
                      var x = toString(this.exponente); 
                      var valorFinal;
                      var newStr = parseInt(x)
  
                      if(Math.sign(this.exponente) == -1){
                       
  
                        valorFinal = (this.coeficiente * valor) + newStr;
                        this.listObservaciones[index]['valor'] = valorFinal;
                      }else{
                        valorFinal = (this.coeficiente * valor) + newStr;
                        this.listObservaciones[index]['valor'] = valorFinal;
                      }
  
                     
      
  
                     }
  
  
                    }
  
                    
                    var objetoBusqueda: any;
                    let lista: any = []
                    objetoBusqueda = this.formularioFiltroAforo.value
                    for (
                      let index = 0;
                      index < this.listObservaciones.length;
                      index++
                    ) {
                
                      var fecha;
                      switch (this.listaParametros.idPeriodo) {
                        case 154: {
                
                          fecha = this.listObservaciones[index]['fecha'] + '-01T00:00:00.000';
                          break;
                        }
                        case 155: {
                
                          fecha = this.listObservaciones[index]['fecha'] + '-01-01T00:00:00.000';
                          break;
                        } case 145: {
                
                          fecha = this.listObservaciones[index]['fecha'] + 'T00:00:00.000';
                          break;
                        } case 152: {
                
                          fecha = this.listObservaciones[index]['fecha'] + 'T00:00:00.000';
                          break;
                        }  case 151: {
                
                          var input = this.listObservaciones[index]['fecha']
                          var hora = input.slice(11, 13);
                          var dia  = input.slice(8, 10);
                          var mes = input.slice(5, 7);
                          var ano1 = input.slice(0, 4);
                          var segundo = input.slice(12, 14);
                        
                     
                          fecha =  ano1 + '-' + mes + '-' + dia + 'T' +   hora + ':00.00.000Z';
                
                          
                          break;
                        }
                
                        case 682: {
                          var input = this.listObservaciones[index]['fecha']
                          var minuto1 = input.slice(10, 12);
                          var hora1 = input.slice(8, 10);
                          var dia1 = input.slice(6, 8);
                          var mes1 = input.slice(4, 6);
                          var ano1 = input.slice(0, 4);
                          var segundo = input.slice(12, 14);
                
                
                
                
                          if (minuto1 == '60') {
                
                            var hora:any = toInteger(hora1) + 1;
                            fecha = ano1 + '-' + mes1 + '-' + dia1 + 'T' + hora + ':00:' + segundo + '.00.000Z';
                          } else {
                
                            if (minuto1 == '00') {
                
                              this.listObservaciones.splice(index, 1)
                
                            } else {
                              fecha = ano1 + '-' + mes1 + '-' + dia1 + 'T' + hora1 + ":" + minuto1 + ':' + segundo + '.00.000Z';
                
                            }
                
                          }
                
                
                          break;
                        }
                        case 683: {
                
                          var input = this.listObservaciones[index]['fecha']
                          var minuto1 = input.slice(10, 12);
                          var hora1 = input.slice(8, 10);
                          var dia1 = input.slice(6, 8);
                          var mes1 = input.slice(4, 6);
                          var ano1 = input.slice(0, 4);
                          var segundo = input.slice(12, 14);
                
                
                
                
                          if (minuto1 == '60') {
                
                            var hora:any = toInteger(hora1) + 1;
                            fecha = ano1 + '-' + mes1 + '-' + dia1 + 'T' + hora + ':00:' + segundo + '.00.000Z';
                          } else {
                
                            if (minuto1 == '00') {
                
                              this.listObservaciones.splice(index, 1)
                
                            } else {
                              fecha = ano1 + '-' + mes1 + '-' + dia1 + 'T' + hora1 + ":" + minuto1 + ':' + segundo + '.00.000Z';
                
                            }
                
                          }
                
                
                
                
                
                
                
                
                          break;
                        }
                        case 146: {
                
                          fecha = this.listObservaciones[index]['fecha'] + '00.00.000Z';
                          break;
                        }
                
                        case 146: {
                
                          fecha = this.listObservaciones[index]['fecha'] + '00.00.000Z';
                          break;
                        }
                
                
                        default: {
                
                          break;
                        }
                      }
                
                
                      var fechaFin: any = fecha;
                      objetoBusqueda.idElementoString = objetoBusqueda.idElemento;
                
                      const [dias, horas] = fechaFin.split('T');
                      const [year, month, day] = dias.split('-');
                      const [h, m, s] = horas.split(':');
                
                      objetoBusqueda.fechaFin1 = `${year}-${month}-${day} ${h}:${m}:${s}`;
                      
            

                        
                      var lis:any = {
                        activo: "S",
                        fecha:fechaFin,
                        fechaCargue: null,
                        fechaCreacion: null,
                        fechaEstado: null,
                        fechaModificacion: null,
                        flagExistente: false,
                        flagInsert: true,
                        idEstadoObservacion: 266,
                        idFlagObservacion: "271",
                        idObservacionXEstacionInicial: 0,
                        idTipoOrigen: 262,
                        idTipoOrigenObservacion: 262,
                        origen: "origen 0",
                        usuarioCargue: "juan.duque@linktic.co",
                        usuarioCreacion:"juan.duque@linktic.co",
                        usuarioEstado: null,
                        usuarioModificacion: null,
                        idParametroXEstacion:toString(this.idParametroXEstacion) ,
                        valor:this.listObservaciones[index]['valor']
                      };
                      lista.push(lis);
                
                      this.listaP = lista;
                    }
                
                    console.log(6, lista);

                    this.agregarlista();
                    
     var   arregladoFinal = lista.map(
          (p: { [x: string]: any; idParametroElemento: any }) => {
            // crear nueva propiedad de nombre Del Elemento
            p[`idParametroXEstacion`] = p.idParametroElemento;
            p[`idObservacionXEstacionInicial`] = p.idObservacionXElemento;
            // remover la propiedad actual
            delete p.idParametroElemento;
            delete p.idObservacionXElemento;
            // retornar el nuevo objeto
            return p;
          }
        );

        //  console.log('enviando',arregladoFinal)
        this.serviciosObservacionesEstacionService
          .creacionMasiva(this.listObservaciones)
          .subscribe((Response) => {
            this.toast.fire({
              icon: 'success',
              title:
                'se gurardaron ' +
                Response.length +
                ' Observaciones exitosamente!',
            });
            this.router.navigate(['/configuracion/gestionObservaciones']);
          }); 

                    this.serviciosObservacionesEstacionService
        .creacionMasivafecha(lista)
        .subscribe((Response) => {

          this.listObservacionesInsertadas = Response;

          if (Response.length == 0) {
            this.toast.fire({
              icon: 'error',
              title:
                'Tiene ' + Response.length + ' Observaciones de agregación !',
            });

          } else {
            this.toast.fire({
              icon: 'success',
              title:
                'se guardaron ' + Response.length + ' Observaciones de agregación !',
            });



          }

        });

               
                Swal.close();
  
  
                });
      
          });
        
        }, 
        willClose: async() => {
          Swal.hideLoading();
        }
      });
  
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

  dataPointSelection(event: any, chartContext: any, config: any) {
    var1 = config.dataPointIndex;
    let div: any = document.getElementById(`btn`);
    div.click();
  }

  dataPointSelection1(event: any, chartContext: any, config: any) {
    var1 = config.dataPointIndex;

    Swal.fire({
      title: 'Cambiar parametros de aforo ',
      html: `<input type="number" id="caudal" class="swal2-input" placeholder="Caudal">
      <input type="number" id="nivel" class="swal2-input" placeholder="Nivel">`,
      showCancelButton: true,
      showCloseButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Cambiar',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Eliminar aforo',
      preConfirm: () => {
        var2 = (document.getElementById(
          'nivel'
        ) as HTMLInputElement).value;
        var3 = (document.getElementById(
          'caudal'
        ) as HTMLInputElement).value;

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
      } else {
        Swal.fire({
          title: 'Desea eliminar el aforo?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Eliminar',
        }).then((result) => {
          if (result.isConfirmed) {
            let div: any = document.getElementById(`btn_1`);
            div.click();
          }
        });
      }
    });
  };

  cancelar() {
    location.reload();
  }

  guardarCurva() {
    if ( !this.assertNullAndUndefined(this.idParametro) || this.idParametro.length<=0 ) {
      Swal.fire(
        'Error', 
        'Por favor seleccione un parámetro para guardar.', 
        'error'
      );
      return;
    }

    if ( !this.assertNullAndUndefined(this.idOperacion) || this.idOperacion.length<=0 ) {
      Swal.fire(
        'Error', 
        'Por favor seleccione una operación para calcular los valores.', 
        'error'
      );
      return;
    }

    if ( !this.assertNullAndUndefined(this.idAno) || this.idAno.length<=0 ) {
      Swal.fire(
        'Error', 
        'Por favor seleccione un año para calcular los valores.', 
        'error'
      );
      return;
    }

    let parametros = this.listaParametros.filter((param:any) => {
      return param.id == this.idParametro;
    });

    if ( !this.assertNullAndUndefined(parametros) || parametros.length<=0 ) {
      Swal.fire(
        'Error', 
        'El parámetro solicitado NO existe.', 
        'error'
      );
      return;
    }

    let parametro = parametros[0];
    this.observaciones = [];
    let fechas : any[] = [];
    let valores : any[] = [];

    switch (parametro.idPeriodo) {
      // Día
      case 152:
        if ( !this.assertNullAndUndefined(this.datosTablaMensual) || this.datosTablaMensual.length<=0 ) {
          Swal.fire(
            'Aviso', 
            'NO hay datos para guardar. La tabla mensual NO contiene datos.', 
            'warning'
          );
          return;
        }

        let ano = this.idAno;
        
        this.datosTablaMensual.forEach(dato => {
          let month = -1;

          switch (dato.mes) {
            case 'Ene':
              month = 0;
              break;

            case 'Feb':
              month = 1;
              break;

            case 'Mar':
              month = 2;
              break;

            case 'Abr':
              month = 3;
              break;

            case 'May':
              month = 4;
              break;

            case 'Jun':
              month = 5;
              break;

            case 'Jul':
              month = 6;
              break;

            case 'Ago':
              month = 7;
              break;

            case 'Sep':
              month = 8;
              break;

            case 'Oct':
              month = 9;
              break;

            case 'Nov':
              month = 10;
              break;

            case 'Dic':
              month = 11;
              break;

            default:
              month = -1;
              break;
          }

          if ( month < 0 ) {
            console.error('Mes incorrecto: ' + dato.mes + ', Indice: ' + month);
            return;
          }

          let valor = dato.valorDia1;
          if ( this.assertNullAndUndefined(valor) && valor>0 ) {
            let fecha = new Date(ano, month, 1, 0, 0 ,0);
            fechas.push(fecha);
            valores.push(valor);
          }

          valor = dato.valorDia2;
          if ( this.assertNullAndUndefined(valor) && valor>0 ) {
            let fecha = new Date(ano, month, 2, 0, 0 ,0);
            fechas.push(fecha);
            valores.push(valor);
          }

          valor = dato.valorDia3;
          if ( this.assertNullAndUndefined(valor) && valor>0 ) {
            let fecha = new Date(ano, month, 3, 0, 0 ,0);
            fechas.push(fecha);
            valores.push(valor);
          }

          valor = dato.valorDia4;
          if ( this.assertNullAndUndefined(valor) && valor>0 ) {
            let fecha = new Date(ano, month, 4, 0, 0 ,0);
            fechas.push(fecha);
            valores.push(valor);
          }

          valor = dato.valorDia5;
          if ( this.assertNullAndUndefined(valor) && valor>0 ) {
            let fecha = new Date(ano, month, 5, 0, 0 ,0);
            fechas.push(fecha);
            valores.push(valor);
          }

          valor = dato.valorDia6;
          if ( this.assertNullAndUndefined(valor) && valor>0 ) {
            let fecha = new Date(ano, month, 6, 0, 0 ,0);
            fechas.push(fecha);
            valores.push(valor);
          }

          valor = dato.valorDia7;
          if ( this.assertNullAndUndefined(valor) && valor>0 ) {
            let fecha = new Date(ano, month, 7, 0, 0 ,0);
            fechas.push(fecha);
            valores.push(valor);
          }

          valor = dato.valorDia8;
          if ( this.assertNullAndUndefined(valor) && valor>0 ) {
            let fecha = new Date(ano, month, 8, 0, 0 ,0);
            fechas.push(fecha);
            valores.push(valor);
          }

          valor = dato.valorDia9;
          if ( this.assertNullAndUndefined(valor) && valor>0 ) {
            let fecha = new Date(ano, month, 9, 0, 0 ,0);
            fechas.push(fecha);
            valores.push(valor);
          }

          valor = dato.valorDia10;
          if ( this.assertNullAndUndefined(valor) && valor>0 ) {
            let fecha = new Date(ano, month, 10, 0, 0 ,0);
            fechas.push(fecha);
            valores.push(valor);
          }

          valor = dato.valorDia11;
          if ( this.assertNullAndUndefined(valor) && valor>0 ) {
            let fecha = new Date(ano, month, 11, 0, 0 ,0);
            fechas.push(fecha);
            valores.push(valor);
          }

          valor = dato.valorDia12;
          if ( this.assertNullAndUndefined(valor) && valor>0 ) {
            let fecha = new Date(ano, month, 12, 0, 0 ,0);
            fechas.push(fecha);
            valores.push(valor);
          }

          valor = dato.valorDia13;
          if ( this.assertNullAndUndefined(valor) && valor>0 ) {
            let fecha = new Date(ano, month, 13, 0, 0 ,0);
            fechas.push(fecha);
            valores.push(valor);
          }

          valor = dato.valorDia14;
          if ( this.assertNullAndUndefined(valor) && valor>0 ) {
            let fecha = new Date(ano, month, 14, 0, 0 ,0);
            fechas.push(fecha);
            valores.push(valor);
          }

          valor = dato.valorDia15;
          if ( this.assertNullAndUndefined(valor) && valor>0 ) {
            let fecha = new Date(ano, month, 15, 0, 0 ,0);
            fechas.push(fecha);
            valores.push(valor);
          }

          valor = dato.valorDia16;
          if ( this.assertNullAndUndefined(valor) && valor>0 ) {
            let fecha = new Date(ano, month, 16, 0, 0 ,0);
            fechas.push(fecha);
            valores.push(valor);
          }

          valor = dato.valorDia17;
          if ( this.assertNullAndUndefined(valor) && valor>0 ) {
            let fecha = new Date(ano, month, 17, 0, 0 ,0);
            fechas.push(fecha);
            valores.push(valor);
          }

          valor = dato.valorDia18;
          if ( this.assertNullAndUndefined(valor) && valor>0 ) {
            let fecha = new Date(ano, month, 18, 0, 0 ,0);
            fechas.push(fecha);
            valores.push(valor);
          }

          valor = dato.valorDia19;
          if ( this.assertNullAndUndefined(valor) && valor>0 ) {
            let fecha = new Date(ano, month, 19, 0, 0 ,0);
            fechas.push(fecha);
            valores.push(valor);
          }

          valor = dato.valorDia20;
          if ( this.assertNullAndUndefined(valor) && valor>0 ) {
            let fecha = new Date(ano, month, 20, 0, 0 ,0);
            fechas.push(fecha);
            valores.push(valor);
          }

          valor = dato.valorDia21;
          if ( this.assertNullAndUndefined(valor) && valor>0 ) {
            let fecha = new Date(ano, month, 21, 0, 0 ,0);
            fechas.push(fecha);
            valores.push(valor);
          }

          valor = dato.valorDia22;
          if ( this.assertNullAndUndefined(valor) && valor>0 ) {
            let fecha = new Date(ano, month, 22, 0, 0 ,0);
            fechas.push(fecha);
            valores.push(valor);
          }

          valor = dato.valorDia23;
          if ( this.assertNullAndUndefined(valor) && valor>0 ) {
            let fecha = new Date(ano, month, 23, 0, 0 ,0);
            fechas.push(fecha);
            valores.push(valor);
          }

          valor = dato.valorDia24;
          if ( this.assertNullAndUndefined(valor) && valor>0 ) {
            let fecha = new Date(ano, month, 24, 0, 0 ,0);
            fechas.push(fecha);
            valores.push(valor);
          }

          valor = dato.valorDia25;
          if ( this.assertNullAndUndefined(valor) && valor>0 ) {
            let fecha = new Date(ano, month, 25, 0, 0 ,0);
            fechas.push(fecha);
            valores.push(valor);
          }

          valor = dato.valorDia26;
          if ( this.assertNullAndUndefined(valor) && valor>0 ) {
            let fecha = new Date(ano, month, 26, 0, 0 ,0);
            fechas.push(fecha);
            valores.push(valor);
          }

          valor = dato.valorDia27;
          if ( this.assertNullAndUndefined(valor) && valor>0 ) {
            let fecha = new Date(ano, month, 27, 0, 0 ,0);
            fechas.push(fecha);
            valores.push(valor);
          }

          valor = dato.valorDia28;
          if ( this.assertNullAndUndefined(valor) && valor>0 ) {
            let fecha = new Date(ano, month, 28, 0, 0 ,0);
            fechas.push(fecha);
            valores.push(valor);
          }

          valor = dato.valorDia29;
          if ( this.assertNullAndUndefined(valor) && valor>0 ) {
            let fecha = new Date(ano, month, 29, 0, 0 ,0);
            fechas.push(fecha);
            valores.push(valor);
          }

          valor = dato.valorDia30;
          if ( this.assertNullAndUndefined(valor) && valor>0 ) {
            let fecha = new Date(ano, month, 30, 0, 0 ,0);
            fechas.push(fecha);
            valores.push(valor);
          }

          valor = dato.valorDia31;
          if ( this.assertNullAndUndefined(valor) && valor>0 ) {
            let fecha = new Date(ano, month, 31, 0, 0 ,0);
            fechas.push(fecha);
            valores.push(valor);
          }
        });

        if ( fechas.length > 0 ) {
          for ( let index=0; index<fechas.length; index++ ) {
            let fecha = fechas[index];
            let valor = valores[index];
           //this.observaciones.push(this.crearObservacion(parametro, '' + fecha.getFullYear() + '-' + fecha.getMonth() + '-' +fecha.getDate() + ' 00:00:00', valor));
           this.observaciones.push(this.crearObservacion(parametro, fecha, valor));
          }
        }
        break;

      // Mes
      case 154:
        if ( !this.assertNullAndUndefined(this.datosTablaAnual) || this.datosTablaAnual.length<=0 ) {
          Swal.fire(
            'Aviso', 
            'NO hay datos para guardar. La tabla anual NO contiene datos.', 
            'warning'
          );
          return;
        }

        this.datosTablaAnual.forEach(dato => {
          let ano = dato.ano;
          let valor = dato.enero;
          if ( this.assertNullAndUndefined(valor) && valor>0 ) {
            let fecha = new Date(ano, 0, 1, 0, 0 ,0);
            fechas.push(fecha);
            valores.push(valor);
          }

          valor = dato.febrero;
          if ( this.assertNullAndUndefined(valor) && valor>0 ) {
            let fecha = new Date(ano, 1, 1, 0, 0 ,0);
            fechas.push(fecha);
            valores.push(valor);
          }

          valor = dato.marzo;
          if ( this.assertNullAndUndefined(valor) && valor>0 ) {
            let fecha = new Date(ano, 2, 1, 0, 0 ,0);
            fechas.push(fecha);
            valores.push(valor);
          }

          valor = dato.abril;
          if ( this.assertNullAndUndefined(valor) && valor>0 ) {
            let fecha = new Date(ano, 3, 1, 0, 0 ,0);
            fechas.push(fecha);
            valores.push(valor);
          }

          valor = dato.mayo;
          if ( this.assertNullAndUndefined(valor) && valor>0 ) {
            let fecha = new Date(ano, 4, 1, 0, 0 ,0);
            fechas.push(fecha);
            valores.push(valor);
          }

          valor = dato.junio;
          if ( this.assertNullAndUndefined(valor) && valor>0 ) {
            let fecha = new Date(ano, 5, 1, 0, 0 ,0);
            fechas.push(fecha);
            valores.push(valor);
          }

          valor = dato.julio;
          if ( this.assertNullAndUndefined(valor) && valor>0 ) {
            let fecha = new Date(ano, 6, 1, 0, 0 ,0);
            fechas.push(fecha);
            valores.push(valor);
          }

          valor = dato.agosto;
          if ( this.assertNullAndUndefined(valor) && valor>0 ) {
            let fecha = new Date(ano, 7, 1, 0, 0 ,0);
            fechas.push(fecha);
            valores.push(valor);
          }

          valor = dato.septiembre;
          if ( this.assertNullAndUndefined(valor) && valor>0 ) {
            let fecha = new Date(ano, 8, 1, 0, 0 ,0);
            fechas.push(fecha);
            valores.push(valor);
          }

          valor = dato.octubre;
          if ( this.assertNullAndUndefined(valor) && valor>0 ) {
            let fecha = new Date(ano, 9, 1, 0, 0 ,0);
            fechas.push(fecha);
            valores.push(valor);
          }

          valor = dato.noviembre;
          if ( this.assertNullAndUndefined(valor) && valor>0 ) {
            let fecha = new Date(ano, 10, 1, 0, 0 ,0);
            fechas.push(fecha);
            valores.push(valor);
          }

          valor = dato.diciembre;
          if ( this.assertNullAndUndefined(valor) && valor>0 ) {
            let fecha = new Date(ano, 11, 1, 0, 0 ,0);
            fechas.push(fecha);
            valores.push(valor);
          }
        });

        if ( fechas.length > 0 ) {
          for ( let index=0; index<fechas.length; index++ ) {
            let fecha = fechas[index];
            let valor = valores[index];
           //this.observaciones.push(this.crearObservacion(parametro, '' + fecha.getFullYear() + '-' + fecha.getMonth() + '-' +fecha.getDate() + ' 00:00:00', valor));
           this.observaciones.push(this.crearObservacion(parametro, fecha, valor));
          }
        }
        break;

      default:
        Swal.fire(
          'Error', 
          'El periodo del parámetro NO fue reconocido.', 
          'error'
        );
        break;
    }

    if ( this.observaciones.length > 0 ) {
      /*
      console.log('-- -------------------');
      console.log('-- Observaciones:');
      console.log('-- -------------------');

      let data : any[] = [...this.observaciones];

      data.forEach(observ => {
        console.log(JSON.stringify(observ));
      });
      console.log('-- -------------------');
      */

      Swal.fire({
        title: 'Guardando...', 
        html: 'Por favor espere.', 
        timer: 42000, 
        timerProgressBar: true, 
        allowOutsideClick: false, 
        showConfirmButton: false, 
        didOpen: async() => {
          Swal.showLoading();

          this.serviciosObservacionesEstacionService.cargueRapido(this.observaciones).subscribe(response => {
            Swal.close();

            if ( !this.assertNullAndUndefined(response) || !this.assertNullAndUndefined(response.observacionesRegistradas) ) {
              Swal.fire(
                'Error',
                'No fue posible guardar las observaciones solicitadas', 
                'error'
              );
              return;
            }
    
            let nDatos = response.observacionesRegistradas.length;
            if ( nDatos > 0 ) {
              Swal.fire(
                "Confirmación", 
                "" + response.observacionesRegistradas.length + " observaciones han sido creadas con éxito.", 
                "success"
              );
            } else {
              if ( !this.assertNullAndUndefined(response.razonesFallo) || response.razonesFallo.length<=0 ) {
                return;
              }

              Swal.fire(
                "Aviso", 
                //"Ningún dato solicitado fue guardado de manera exitosa. Razones: " + JSON.stringify(response.razonesFallo), 
                "Ningún dato solicitado fue guardado de manera exitosa. Por favor valide que no existan observaciones en las fechas solicitadas.", 
                "warning", 
              );
            }
          });
        }, 
        willClose: async() => {
          Swal.hideLoading();
        }
      });
    }
  }

  /*
  calculateYears(startDate: any, endDate: any) {
    if ( !this.assertNullAndUndefined(startDate) || !this.assertNullAndUndefined(endDate) ) {
      return -1;
    }

    if ( startDate.length<=0 || !startDate.includes('-' ) ) {
      return -1;
    }

    if ( endDate.length<=0 || !endDate.includes('-' ) ) {
      return -1;
    }

    let datos = endDate.split('-');
    if ( !this.assertNullAndUndefined(datos) || datos.length!=3 ) {
      return -1;
    }
    let year = datos[0];
    let month = datos[1];
    let day = datos[2];
    let miFechaFin = moment([year, month-1, day, 23, 59, 59]);

    datos = startDate.split('-');
    if ( !this.assertNullAndUndefined(datos) || datos.length!=3 ) {
      return -1;
    }
    year = datos[0];
    month = datos[1];
    day = datos[2];
    let miFechaInicio = moment([year, month-1, day, 0, 0, 0]);

    return miFechaFin.diff(miFechaInicio, 'years');
  }
  */

  crearObservacion(parametro: any, fecha: Date, valor: number) : any {
    let observ : any = {
      idParametroXEstacion: parametro.parametroXEstacionId, 
      fecha: fecha,
      valor: valor,
      fechaCargue: new Date(),
      usuarioCreacion: this.usuario.usuario, 
      idTipoOrigenObservacion: 262, 
      origen: 'Manual', 
      idEstadoObservacion: 266, 
      idFlagObservacion: 271, 
      activo: 'S', 
    };

    return observ;
  }
}
