import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { MetodosGlobales } from 'src/app/common/utils/metodos-globales';
import { dominiosEnum } from 'src/app/modelo/enum/dominios-enum';
import { ServiciosDominiosValoresService } from '../../../configuracion/dominios/servicios-dominios-valores.service';
import { ServiciosDominiosService } from '../../../configuracion/dominios/servicios-dominios.service';
import { ServiciosEmbalcesService } from '../../../elementos/embalses/servicios-embalses.service';
import { ServiciosEstacionesService } from '../../../elementos/estaciones/servicios-estaciones.service';
import { ServiciosPozosService } from '../../../elementos/pozos/servicios-pozos.service';
import { ServiciosObservacionesEmbalsesService } from '../../../observaciones/servicios-observaciones-embalses.service';
import { ServiciosObservacionesEstacionService } from '../../../observaciones/servicios-observaciones-estacion.service';
import { ServiciosObservacionesPozosService } from '../../../observaciones/servicios-observaciones-pozos.service';
import { ServiciosAnalisisCon } from './dobles-masas.service';
import { ActivatedRoute, Router } from '@angular/router';

import { ServiciosGeograficosService } from 'src/app/common/mapa/servicios-geograficos.service';
import { ServiciosParametrosService } from 'src/app/modulos/parametros/servicios-parametros.service';
import { ServiciosSerieTiempoService } from 'src/app/modulos/seriestiempo/servicios/servicios-serie-tiempo.service';
import { IserieConsulta, IserieConsultaDTO, IserieTiempoElemento, IserieTiempoPromedioAnio } from 'src/app/modelo/configuracion/seriesTiempo';
import { accionesTablasEnum } from 'src/app/modelo/enum/acciones-tablas-enum';
import Swal from 'sweetalert2';
import { IParametrosCFrecuencias } from 'src/app/modelo/configuracion/estacion';
import { Observable } from 'rxjs';
import { ServiciosParametrosEstacionesService } from '../../../elementos/estaciones/servicios-parametros-estaciones.service';
import * as Highcharts from "highcharts";
import * as ecStat from 'echarts-stat';
const regression = require('regression');
import HC_exporting from "highcharts/modules/exporting";
import HC_Data from "highcharts/modules/export-data";
import Accessbility from "highcharts/modules/accessibility";
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
HC_exporting(Highcharts);
HC_Data(Highcharts);
Accessbility(Highcharts);
const SpearmanRHO = require('spearman-rho');
const correlation = require('node-correlation');

export var var1: number = 0;
export var var2: string = '';
export var var3: string = '';
@Component({
  selector: 'app-dobles-masas',
  templateUrl: './dobles-masas.component.html',
})


export class DoblesMasasComponent implements OnInit {
  @ViewChild("lineChart", { static: false }) lineChart: any;
  @ViewChild('ModalCalidad', { static: false }) ModalCalidad: ElementRef;
  @ViewChild('ModalReporte', { static: false }) ModalReporte: ElementRef;

  @ViewChild(DataTableDirective, { static: false })
  public Highcharts = Highcharts;
  public isHighcharts = typeof Highcharts === 'object';
  public chartOptions: Highcharts.Options = {};
  public chartOptions1: Highcharts.Options = {};
  public updateFlag: boolean = false;
  public formularioConsulta!: FormGroup;
  public rutaGeneral = 'configuracion/dominios/C/0';
  public rutaConsulta = 'configuracion/dominios/V/';
  public rutaEdicion = 'configuracion/dominios/E/';
  public verFechas = false;
  public datosFilter = [] as any;
  public departamentoSelected: any;
  public periodo: number = 2;
  public listaElemento :any= [];
  public listaElementos :any= [];
  public listaCodigoEAAB: any = [];
  public listaCodigoIDEAM: any = [];
  public datosOriginal = [] as any;
  public idSerieTiempo: number;
  public parametroLista = [] as any;
  public listZonaEAAB = [];
  public myRegression:any = [];
  public listaAutocompletado: any = [];
  public listaDetalle: any  = [] as any;
  public categoriaFecha: any  = [] as any;
  public listTipoPozo = [];

  public moda: number;
  public fechaObservacion: any;



  public listCategoriaPozo = [];
  public listCondicionPozo = [];
  public geograficas = false;
  public planas = false;
  public fechainicio:Date;
  public Fechafin:Date;
  public nombreParametro:string = "" ;
  public tabla:string = "" ;
  public nombreEstacion:string = "" ;
  public nombreEstacionA:string = "" ;
  public nombreEstacionB:string  = "" ;
  public nombreEstacionC:string  = "" ;
  public nombreEstacionD:string  = "" ;
  public nombreEstacionE:string  = "" ;
  public ecuacionString:string = "" ;
  public listaCodigoEAABAgregar : any[] = [];
  public listaCodigoIDEAMAgregar : any[] = [];
  public listEntidades = [];

  public usuario = JSON.parse(sessionStorage.getItem('usuario') || '{}');
  public valor: number;
  public flag: number = 0;
  public origen: string;
  public idFrecuencia: number;
  
  public listaAreaHidrografica = [];
  public listaZonaHidrografica = [];
  public listaElementoAgregar: any[] = [];
  public listasubZonaHidrografica = [];
  public listanivel = [];
  public listAnos: any = [
    { id: 0, text: 'Seleccione' },
    { id: 2018, text: '2018' },
    { id: 2019, text: '2019' },
    { id: 2020, text: '2020' },
    { id: 2021, text: '2021' },
    { id: 2022, text: '2022' },
    { id: 2023, text: '2023' },
    { id: 2024, text: '2024' },
    { id: 2025, text: '2025' },
    { id: 2026, text: '2026' },
    { id: 2027, text: '2027' },
    { id: 2028, text: '2028' },
  ];
  public ajuste: number;
  public pediente2: number;
  public pediente1: number;
  public correlacion: number;
  public fechaActualMensual: string;
  public fechaActualHora: string;
  public fecha: string;
  public fechaAno: number;
  public fechaMes: string;

  public fechaActualMensualFin: string;
  public fechaActualHoraFin: string;
  public fechaFinal: string;
  public fechaAnoFin: number;
  public fechaMesFin: string;
  public fechasComparacion: number;
  public listaCuenca = [];
  public listaMicrocuenca = [];
  public listaEntidad = [];
  public listaItemsElementos:any=[];
  public idElementoAgregar :string ;
  public listParametro: any[] = [];
  public listParametroOrgin: any[] = [];
  public listaFrecuencia: any[] = [];
  public listaSubcuenca = [];
  public cantidad:any = [];
  public serie = [];
  public r2:number;
  public listaMunicipios = [];
  public idTipoElemento: any;
  public idElementoTipo : any;
  public idElemento: string = '0';
  public listaDepartamentos = [];
  public datatableElement: DataTableDirective | undefined;
  public parametro: number = 0;
  public idfrecuencia: number = 0;
  public dtOptions: any = {};
  public  cantidad_1:any=[];
  public  cantidad_2:any=[];
  public  cantidad_3:any=[];
  public  cantidad_4:any=[];
  public  cantidad_5:any=[];
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


  done: boolean;

  public  cantidad_1_1:any=[];
  public  cantidad_2_2:any=[];
  public  cantidad_3_3:any=[];
  public  cantidad_4_4:any=[];
  public  cantidad_5_5:any=[];
  public fechaActual: string;
  private tempIdDepartamento: number = 0;


      columnas:any  = [ 
      { title:'', data:'',disabled: false}, 
      { title:'', data:'',disabled: false}, 
      { title:'', data:'',disabled: false},  
      ] as any;
      columnas1:any  = [ 
        { title:'', data:'',disabled: false}, 
      { title:'', data:'',disabled: false}, 
      { title:'', data:'',disabled: false},   
      { title:'', data:'',disabled: false}, 
        ] as any;
      columnas2:any  = [ 
        { title:'', data:'',disabled: false}, 
      { title:'', data:'',disabled: false}, 
      { title:'', data:'',disabled: false},   
      { title:'', data:'',disabled: false},  
      { title:'', data:'',disabled: false},  
        ] as any;
    columnas3:any  = [ 
      { title:'', data:'',disabled: false}, 
     { title:'', data:'',disabled: false}, 
     { title:'', data:'',disabled: false},   
     { title:'', data:'',disabled: false},  
     { title:'', data:'',disabled: false},  
     { title:'', data:'',disabled: false},  
      ] as any;

      columnas4:any  = [ 
        { title:'', data:'',disabled: false}, 
       { title:'', data:'',disabled: false}, 
       { title:'', data:'',disabled: false},   
       { title:'', data:'',disabled: false},  
       { title:'', data:'',disabled: false},  
       { title:'', data:'',disabled: false},  
       { title:'', data:'',disabled: false},  
        ] as any;

  constructor(
    private ServiciosAnalisisCon:ServiciosAnalisisCon,
    private serviciosParametrosService: ServiciosParametrosService,
    private formBuilder: FormBuilder,
    private serviciosDominiosService: ServiciosDominiosService,
    private serviciosEstacionesService: ServiciosEstacionesService,
    private serviciosDominiosValoresService: ServiciosDominiosValoresService,
    private serviciosEmbalcesService: ServiciosEmbalcesService,
    private serviciosPozosService: ServiciosPozosService,
    private serviciosGeograficosService: ServiciosGeograficosService,
    private serviciosObservacionesEstacionService: ServiciosObservacionesEstacionService,
    private serviciosObservacionesPozosService: ServiciosObservacionesPozosService,
    private sercioparametrosestacion: ServiciosParametrosEstacionesService,
    private router:Router,
    private serviciosSerieTiempoService: ServiciosSerieTiempoService,
    private serviciosObservacionesEmbalsesService: ServiciosObservacionesEmbalsesService
  ) {
    // Esto es intencional
  }

  vector: Array<number> = Array(50);

  ngOnInit(): void {


    var fecha = new Date(); //Fecha actual
    var mes: any = fecha.getMonth() + 1; //obteniendo mes
    var dia: any = fecha.getDate(); //obteniendo dia
    var ano: any = fecha.getFullYear();
    var hora: any = fecha.getHours();
    var minuto: any = fecha.getMinutes();
    var segundo: any = fecha.getSeconds();

    if (dia < 10) {
      dia = '0' + dia; //agrega cero si el menor de 10
    }
    if (mes < 10) {
      mes = '0' + mes;
    }

    this.fechaActual = dia + '-' + mes + '-' + ano;
    this.fechaActualMensual = mes + '-' + ano;
    this.fechaActualHora = ano + '-' + mes + '-' + dia+'T'+hora+':'+minuto;


 
   this.obtenerElementos('466');
   this.chartOptions = {
    title : {
      text:  this.nombreParametro   
   },
   xAxis : {
     title: {
       text:  this.nombreEstacion,
     },
      categories: this.cantidad,

   },
   yAxis : {
   },
   series :[{name:'',
     type:'scatter', 
     data:[]
     },{name:'',
     type:'scatter', 
     data:[]
     },{name:'',
     type:'scatter', 
     data:[]
     },{name:'',
     type:'scatter', 
     data:[]
     },{name:'',
     type:'scatter', 
     data:[]
     },{name:'',
     type:'scatter', 
     data:[]
     },{name:'',
     type:'scatter', 
     data:[]
     },{name:'',
     type:'scatter', 
     data:[]
     },{name:'',
     type:'scatter', 
     data:[]
     },{name:'',
     type:'scatter', 
     data:[]
     }
    ],
  };
    
    this.chartOptions1 = {
      chart: {
          type: 'column'
      },
      title: {
          text: ''
      },
    
      xAxis: {
          categories: ['Africa', 'America', 'Asia', 'Europe', 'Oceania'],
          title: {
              text: null
          }
      },
      yAxis: {
          min: 0,
          title: {
              text: '',
              align: 'high'
          },
          labels: {
              overflow: 'justify'
          }
      },
      tooltip: {
          valueSuffix: ' millions'
      },
      plotOptions: {
          bar: {
              dataLabels: {
                  enabled: true
              }
          }
      },

  
      credits: {
          enabled: false
      },
      series: [ {
        type: 'column',
        name:'',
      },  {
        type: 'column',
        name:'',
      }, {
        type: 'column',
        name:'',
      }, {
        type: 'column',
        name:'',
      }, {
        type: 'column',
        name:'',
      }, {
        type: 'column',
        name:'',
      }
    ]
  };
    this.cargarDatos();
    this.construirFormulario();
  }

  cargarDatos() {
    Swal.fire({
      title: 'Cargando datos...',
      html: 'Por favor espere',
      allowOutsideClick: false, 
      showConfirmButton: false, 
      timer: 42000, 
      timerProgressBar: true,
      didOpen: async() => {
        Swal.showLoading();

        // Parámetros
        this.serviciosParametrosService
          .pametroOrigen().subscribe((response) => {
            this.listParametro = response;

            // Departamentos
            this.serviciosGeograficosService
              .obtenerDepartamentos().subscribe((response) => {
              this.listaDepartamentos = response;

              // entidad
              this.serviciosDominiosValoresService
                .obtenerValoresPorIdDominio(dominiosEnum.Entidad).subscribe((response) => {
                  this.listaEntidad = response;

                  // Tipo Elemento
                  this.serviciosDominiosValoresService
                    .obtenerValoresPorIdDominio(dominiosEnum.TipoElemento).subscribe((response) => {
                      this.listaElementos = response;

                      // frecuencia
                      this.serviciosDominiosValoresService
                        .obtenerTotalValoresPorIdDominio(dominiosEnum.Periodos).subscribe((response) => {
                          this.listaFrecuencia = response;

                          Swal.close();
                      });
                  });
              });
            });
        });
      }, 
      willClose: async() => {
        Swal.hideLoading();
      }
    });
  }

  actualizarFrecuencia(event : any) {
    if ( !this.assertNullAndUndefined(event) || 0==event.length ){
      return;
    }

    let parametros = this.listParametro.filter(param => {
      return param.id === parseInt(event);
    });

    if ( !this.assertNullAndUndefined(parametros) || parametros.length<1 ) {
      return;
    }

    let miParametro = parametros[0];

    let frecuencias = this.listaFrecuencia.filter(frecuencia => {
      return miParametro.idPeriodo === frecuencia.id;
    });

    if ( !this.assertNullAndUndefined(frecuencias) || frecuencias.length<1 ) {
      return;
    }

    this.idfrecuencia = frecuencias[0].id;
  }

  ngOnChanges(): void {

  }




  get idMecanismo(): any {
    return this.formularioConsulta.get('idMecanismo');
  }

  get ElementoAgregar() {
    return this.formularioConsulta?.get('ElementoAgregar');
  }
  get zonaHidrografica() {
    return this.formularioConsulta.get('zonaHidrografica');
  }
  get subZonaHidrografica() {
    return this.formularioConsulta.get('subZonaHidrografica');
  }
  get cuenca() {
    return this.formularioConsulta.get('cuenca');
  }
  get subcuenca() {
    return this.formularioConsulta.get('subCuenca');
  }
  get microcuenca() {
    return this.formularioConsulta.get('microCuenca');
  }
  get fechaInicio() {
    return this.formularioConsulta.get('fechaInicio');
  }
  get fechaInicio1() {
    return this.formularioConsulta.get('fechaInicio1');
  }
  get fechaFin() {
    return this.formularioConsulta.get('fechaFin');
  }
  get fechaFin1() {
    return this.formularioConsulta.get('fechaFin1');
  }
  get idParametro() {
    return this.formularioConsulta.get('idParametro');
  }
  get idParametroAgregar() {
    return this.formularioConsulta.get('idParametroAgregar');
  }
  get idCodigoEAABAgregar() {
    return this.formularioConsulta.get('idCodigoEAABAgregar');
  }
  get idCodigoIDEAMAgregar() {
    return this.formularioConsulta.get('idCodigoIDEAMAgregar');
  }
  get idCodigoIDEAM() {
    return this.formularioConsulta.get('idCodigoIDEAM');
  }
  get idCodigoEAAB() {
    return this.formularioConsulta.get('idCodigoEAAB');
  }
  get frecuencia() {
    return this.formularioConsulta.get('frecuencia');
  }
  get frecuenciaAgregar() {
    return this.formularioConsulta.get('frecuenciaAgregar');
  }

  private construirFormulario() {
    this.formularioConsulta = this.formBuilder.group({
      idElemento: ['', [Validators.required]],
      ElementoAgregar: ['', [Validators.required]],
      idCodigoIDEAM:['', [Validators.required]],
      idCodigoEAAB:['', [Validators.required]],
      idCodigoIDEAMAgregar:['', [Validators.required]],
      idCodigoEAABAgregar:['', [Validators.required]],
      fechaInicio:[''],
      fechaFin:[''],
      frecuencia:['', [Validators.required]],
      idParametro:['', [Validators.required]],
      peridoId:[''],
      idMecanismo: [469],
    });
  }

  obtenerElementos(even: any) {
    if ( !this.assertNullAndUndefined(even) || 0==even.length ){
      return;
    }

    

    this.idTipoElemento = even;
    this.listaElemento = [];
    this.listaCodigoEAAB = [];
    this.listaCodigoIDEAM = [];
  
    switch (even) {

      // Estaciones
      case '466': {
        Swal.fire({
          title: 'Cargando información...',
          html: 'Por favor espere',
          allowOutsideClick: false, 
          showConfirmButton: false, 
          timerProgressBar: true,
          timer: 42000,
          didOpen: async() => {
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
              
              this.listaCodigoEAABAgregar  = response.filter((element => element.codigoEstacionEaab != null)).map((elemento: any) => ({
                id: elemento.idEstacion,
                text: elemento.codigoEstacionEaab,
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

              Swal.close();
            });
          },
          willClose: async() => {
            Swal.hideLoading();
          }
        });
        break;
      }

      // Embalses
      case '467': {
        Swal.fire({
          title: 'Cargando información...',
          html: 'Por favor espere',
          allowOutsideClick: false, 
          showConfirmButton: false, 
          timerProgressBar: true,
          timer: 42000,
          
          didOpen: async() => {
            Swal.showLoading();

            this.serviciosEmbalcesService.obtenerEembalsesDTO().subscribe((response) => {
              this.listaElemento = response.map((elemento: any) => ({
                id: elemento.idEmbalse, 
                text: elemento.embalse, 
                disabled: elemento.activo == 'S' ? false : true,
              }));

              Swal.close();
            });
          },
          willClose: async() => {
            Swal.hideLoading();
          }
        });
        break;
      }

      // Pozos
      case '468': {
        Swal.fire({
          title: 'Cargando información...',
          html: 'Por favor espere',
          allowOutsideClick: false, 
          showConfirmButton: false, 
          timerProgressBar: true,
          timer: 42000,
          didOpen: async() => {
            Swal.showLoading();

            this.serviciosPozosService.obtenerPozosDTO().subscribe((response) => {
              this.listaElemento = response.map((elemento: any) => ({
                id: elemento.idPozo,
                text: elemento.pozo,
                disabled: elemento.activo == 'S' ? false : true,
              }));

              Swal.close();
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

  obtener() {
    if ( !this.verFechas ) {
      let currentDate : Date = new Date();
      this.formularioConsulta.value.fechaInicio = "1900-01-01 00:00:00";
      this.formularioConsulta.value.fechaFin = currentDate.getFullYear()+30 + "-12-31 23:59:59";
    }
    
    if (this.formularioConsulta.valid) {
      switch (this.idTipoElemento) {

        // Estaciones
        case '466': {
          Swal.fire({
            title: 'Procesando Estaciones...',
            html: 'Por favor espere',
            allowOutsideClick: false, 
            showConfirmButton: false, 
            timerProgressBar: true,
            timer: 42000,
            didOpen: async() => {
              Swal.showLoading();

              let request = this.formularioConsulta.value;
              request.codigoParametros = [];

              if ( this.assertNullAndUndefined(this.parametro) && parseInt('' + this.parametro)>0 ) {
                let parametros = this.listParametro.filter(param => {
                  return param.id === parseInt('' + this.parametro);
                });

                if ( this.assertNullAndUndefined(parametros) && parametros.length>=1 ) {
                  request.codigoParametros.push(parametros[0].codigo);
                }
              }

              let horaTokens = request.fechaInicio.split(':');
              if ( this.assertNullAndUndefined(horaTokens) && horaTokens.length==2 ) {
                request.fechaInicio =  request.fechaInicio.replace('T', ' ') + ":00";
              }

              horaTokens = request.fechaFin.split(':');
              if ( this.assertNullAndUndefined(horaTokens) && horaTokens.length==2 ) {
                request.fechaFin =  request.fechaFin.replace('T', ' ') + ":59";
              }
              
              this.serviciosObservacionesEstacionService.obtenerInventario(request).subscribe(response => {
                this.datosFilter = response;

                Swal.close();
              });
            },
            willClose: async() => {
              Swal.hideLoading();
            }
          });
          break;
        }

        // Embalses 
        case '467': {
          Swal.fire({
            title: 'Procesando Embalses...',
            html: 'Por favor espere',
            allowOutsideClick: false, 
            showConfirmButton: false, 
            timerProgressBar: true,
            timer: 42000,
            didOpen: async() => {
              Swal.showLoading();

              this.serviciosObservacionesEmbalsesService.obtenerInventario(this.formularioConsulta.value).subscribe(response => {
                this.datosFilter = response;

                Swal.close();
              });
            }, 
            willClose: async() => {
              Swal.hideLoading();
            }
          });
          break;
        }

        // Pozos 
        case '468': {
          Swal.fire({
            title: 'Procesando Pozos...',
            html: 'Por favor espere',
            allowOutsideClick: false, 
            showConfirmButton: false, 
            timerProgressBar: true,
            timer: 42000,
            didOpen: async() => {
              Swal.showLoading();

              this.serviciosObservacionesPozosService.obtenerInventario(this.formularioConsulta.value).subscribe(response => {
                this.datosFilter = response;

                Swal.close();
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

  onPeriodoVigente() {
    this.periodo =  1;
    this.verFechas = false;
  }

  onEstablecerRango(){
    this.periodo =  2;
    this.verFechas = true;
  }

// Validacion de permisos 
public validarPermiso(permiso: any): boolean {
  return MetodosGlobales.validarPermiso(permiso);
}

autocompletar(){
  
this.ModalCalidad.nativeElement.click();

}

assertNullAndUndefined(value : any) : boolean {
  if ( null==value || undefined==value ) {
    return false;
  }

  return true;
}


agregarElementoOrigen(){
  var seleccionTemporal:any;
  if(this.idElemento != '0' ){ 
    
    this.listaItemsElementos[0] = seleccionTemporal;
    seleccionTemporal ={
        id:this.formularioConsulta.get('idCodigoIDEAM')?.value,
        idElemento:this.formularioConsulta.get('idElemento')?.value,
        idCodigoEAAB: this.formularioConsulta.get('idCodigoEAAB')?.value,
        idCodigoIDEAM:this.formularioConsulta.get('idCodigoIDEAM')?.value,
        codigoIDEAM: this.listaCodigoEAAB.filter((filtro:any)=> filtro.id == this.formularioConsulta.get('idCodigoIDEAM')?.value)[0].text,
        codigoEAAB: this.listaCodigoEAAB.filter((filtro:any)=> filtro.id == this.formularioConsulta.get('idCodigoEAAB')?.value)[0].text,
        nombreElemento: this.listaElemento.filter((filtro:any)=> filtro.id == this.formularioConsulta.get('idElemento')?.value)[0].text,
       
      }
      this.listaItemsElementos[0] = seleccionTemporal

  }

  

}
agregarElemento(){
  if(this.listaItemsElementos.length < 6){
    let obsCorrelacion = new Observable((observer) => {
      console.log(observer);
      var seleccionTemporal:any={
        id:this.listaCodigoIDEAMAgregar.filter(filtro=> filtro.id == this.formularioConsulta.get('ElementoAgregar')?.value)[0].text,
        codigoIDEAM: this.listaCodigoIDEAMAgregar.filter(filtro=> filtro.id == this.formularioConsulta.get('idCodigoIDEAMAgregar')?.value)[0].text,
        codigoEAAB: this.listaCodigoEAABAgregar.filter(filtro=> filtro.id == this.formularioConsulta.get('idCodigoEAABAgregar')?.value)[0].text,
        nombreElemento: this.listaElementoAgregar.filter(filtro=> filtro.id == this.formularioConsulta.get('ElementoAgregar')?.value)[0].text,
        idElemento:this.formularioConsulta.get('ElementoAgregar')?.value,
        idCodigoEAAB: this.formularioConsulta.get('idCodigoEAABAgregar')?.value,
        idCodigoIDEAM:this.formularioConsulta.get('idCodigoIDEAMAgregar')?.value,
      }
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



obtenerListaParametros(id : any) {
  if ( !this.assertNullAndUndefined(id) || 0==id.length ) {
    return;
  }

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

        Swal.close();
      });
    }, 
    willClose: async() => {
      Swal.hideLoading();
    }
  });
}




obtenerListaParametros4(id: any) {
  if ( null==id || undefined==id || id.length<=0 || id<=0 ) {
    return;
  }

  let obtenerListaParametrosEstacion : IParametrosCFrecuencias = {
    idEstacion: id,
    idPeriodos: [] = [151, 152, 154], 
  };

  console.log('-- ------------------');
  console.log("ID de estacion: " + id);
  console.log('-- ------------------');

  this.sercioparametrosestacion.obtenerListaParametrosPorFrecuenciasDobleMasas(obtenerListaParametrosEstacion).subscribe((response) => {
    this.listParametro = response.map((elemento: any) => ({
      id: elemento.idParametro,
      text: elemento.descripcion,
      codigo: elemento.codigo,
      idPeriodo: elemento.idPeriodo,
      idPXE: elemento.idParametroXEstacion,
    }));
  });

   console.log(this.listParametro );


  /*
  this.sercioparametrosestacion.obtenerListaParametros(id).subscribe((response) => {
      this.listParametro = response.map((elemento: any) => ({
        id: elemento.idParametro,
        text: elemento.descripcionParametro,
        codigo: elemento.codigo,
        idPeriodo: elemento.idPeriodo,
      }));
    });
    */
}

modoLectura(){
  this.nombreParametro =  this.listParametro.filter(filtro=> filtro.id == this.formularioConsulta.get('idParametro')?.value)[0].text;
  this.nombreEstacion =this.listaElementoAgregar.filter(filtro=> filtro.id == this.formularioConsulta.get('idElemento')?.value)[0].text;

}
getData(){

  this.chartOptions = {               
    title : {
       text:  this.nombreParametro   
    },
    xAxis : {
      title: {
        text:  this.nombreEstacion,
      },
       categories: this.cantidad,
 
    },
    yAxis : {
       min: 0
    },
    series :this.serie
 };
 return   this.chartOptions ;
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



buscarEstacion(){
     
  if(this.periodo == 2){


          var objetoBusqueda: any;
          const dateInicio = this.formularioConsulta.value.fechaInicio;
          const [year, month, day] = dateInicio.split('-');
          const dateFin = this.formularioConsulta.value.fechaFin;
          const [year1, month1, day1] = dateFin.split('-');
          this.formularioConsulta.value.fechaInicio1 = `${day}-${month}-${year}`;
          this.formularioConsulta.value.fechaFin1 = `${day1}-${month1}-${year1}`;
          
          if(this.idfrecuencia == 154){

            this.formularioConsulta.value.fechaInicio ="";
            this.formularioConsulta.value.fechaFin ="";
            this.formularioConsulta.value.fechaInicio1 = `${month}-${year}`;
            this.formularioConsulta.value.fechaFin1 = `${month1}-${year1}`;

            var lastday = function(y:any,m:any){
              return  new Date(y, m +1, 0).getDate();
              }
              this.formularioConsulta.value.fechaInicio1  =   `${year}-${month}-01`;
              this.formularioConsulta.value.fechaFin1 = `${year1}-${month1}-`+lastday(`${year1}`,`${month1}`); 
              this.formularioConsulta.value.fechaInicio  =   `${year}-${month}-01`;
              this.formularioConsulta.value.fechaFin = `${year1}-${month1}-`+lastday(`${year1}`,`${month1}`); 
          }
          console.log( this.formularioConsulta);


      }else{
          
        

        if(this.idfrecuencia == 145){
          this.formularioConsulta.value.fechaInicio1 = "10-10-1900";
          this.formularioConsulta.value.fechaFin1 =  this.fechaActual;
        

        }
        if(this.idfrecuencia == 152 ){
          this.formularioConsulta.value.fechaInicio1 = "10-10-1900";
          this.formularioConsulta.value.fechaFin1 = this.fechaActual;

          
        }
        if(this.idfrecuencia == 154){

        this.formularioConsulta.value.fechaInicio1 = "10-1900";
          this.formularioConsulta.value.fechaFin1 = this.fechaActualMensual 
      
        }
        if(this.idfrecuencia == 151){
          this.formularioConsulta.value.fechaInicio = "1900-08-10T13:01";
          this.formularioConsulta.value.fechaFin =     this.fechaActualHora 
        
          
        }
        if(this.idfrecuencia == 682){
          this.formularioConsulta.value.fechaInicio = "1900-08-10T13:01";
          this.formularioConsulta.value.fechaFin =      this.fechaActualHora 
        
        }
        if(this.idfrecuencia == 683){

          this.formularioConsulta.value.fechaInicio = "1900-08-10T13:01";
          this.formularioConsulta.value.fechaFin =     this.fechaActualHora 
        
        }
        if(this.idfrecuencia == 146){

          this.formularioConsulta.value.fechaInicio = "1900-08-10T13:01";
          this.formularioConsulta.value.fechaFin =      this.fechaActualHora 


        }


      }
    

  console.log( this.formularioConsulta);


 if( this.formularioConsulta.value.frecuencia &&
  this.formularioConsulta.value.fechaFin &&
  this.formularioConsulta.value.frecuencia ){ 

    this.formularioConsulta.value.idElementoString = this.formularioConsulta.value.ElementoAgregar


    this.ServiciosAnalisisCon
        .cantidad( this.formularioConsulta.value)
        .subscribe((response) => {  
          
              var numero:any = response
              if(numero != 0){
                this.agregarElemento(); 
                Swal.fire(
                  'Doble masas ',
                  'la estación fue agregada ',
                  'info'
                )
              }else{
                Swal.fire(
                  'Doble masas ',
                  'Esta estación no tiene informción',
                  'error'
                )
              }
          
          });

  }else{
    Swal.fire(
      'Doble masas ',
      'Debes ingresar toda la imforamción ',
      'error'
    )
  }




}

filtrar(elemento: any) {
  try {
      if(this.formularioConsulta.valid) {
        if( this.listaItemsElementos.length > 1 ){

                 console.log(this.formularioConsulta);


                 if(this.periodo == 2){


                    var objetoBusqueda: any;
                    const dateInicio = this.formularioConsulta.value.fechaInicio;
                    const [year, month, day] = dateInicio.split('-');
                    const dateFin = this.formularioConsulta.value.fechaFin;
                    const [year1, month1, day1] = dateFin.split('-');
                    this.formularioConsulta.value.fechaInicio1 = `${day}-${month}-${year}`;
                    this.formularioConsulta.value.fechaFin1 = `${day1}-${month1}-${year1}`;
                    if(this.idfrecuencia == 154){

                      this.formularioConsulta.value.fechaInicio ="";
                      this.formularioConsulta.value.fechaFin ="";
                      this.formularioConsulta.value.fechaInicio1 = `${month}-${year}`;
                      this.formularioConsulta.value.fechaFin1 = `${month1}-${year1}`;
          
                      var lastday = function(y:any,m:any){
                        return  new Date(y, m +1, 0).getDate();
                        }
                        this.formularioConsulta.value.fechaInicio1  =   `${year}-${month}-01`;
                        this.formularioConsulta.value.fechaFin1 = `${year1}-${month1}-`+lastday(`${year1}`,`${month1}`); 
                        this.formularioConsulta.value.fechaInicio  =   `${year}-${month}-01`;
                        this.formularioConsulta.value.fechaFin = `${year1}-${month1}-`+lastday(`${year1}`,`${month1}`); 
                    }


                 }else{
                    
                  

                  if(this.idfrecuencia == 145){
                    this.formularioConsulta.value.fechaInicio1 = "10-10-1900";
                    this.formularioConsulta.value.fechaFin1 =  this.fechaActual;
                  
              
                  }
                  if(this.idfrecuencia == 152 ){
                    this.formularioConsulta.value.fechaInicio1 = "10-10-1900";
                    this.formularioConsulta.value.fechaFin1 = this.fechaActual;
              
                    
                  }
                  if(this.idfrecuencia == 154){
              
                   this.formularioConsulta.value.fechaInicio1 = "10-1900";
                    this.formularioConsulta.value.fechaFin1 = this.fechaActualMensual 
                 
                  }
                  if(this.idfrecuencia == 151){
                    this.formularioConsulta.value.fechaInicio = "1900-08-10T13:01";
                    this.formularioConsulta.value.fechaFin =     this.fechaActualHora 
                   
                    
                  }
                  if(this.idfrecuencia == 682){
                    this.formularioConsulta.value.fechaInicio = "1900-08-10T13:01";
                    this.formularioConsulta.value.fechaFin =      this.fechaActualHora 
                   
                  }
                  if(this.idfrecuencia == 683){
              
                    this.formularioConsulta.value.fechaInicio = "1900-08-10T13:01";
                    this.formularioConsulta.value.fechaFin =     this.fechaActualHora 
                   
                  }
                  if(this.idfrecuencia == 146){
              
                    this.formularioConsulta.value.fechaInicio = "1900-08-10T13:01";
                    this.formularioConsulta.value.fechaFin =      this.fechaActualHora 
              
              
                  }


                 }
                    


                    this.formularioConsulta.value.listaElementosDestacados = this.listaItemsElementos;
                    this.formularioConsulta.value.idElementoString  =  this.formularioConsulta.value.idElemento ;
              
                    switch (elemento) {
                      
                      case '466': {

                        Swal.fire({
                          title: 'Cargando información...',
                          html: 'Por favor espere',
                          allowOutsideClick: false, 
                          showConfirmButton: false, 
                          timerProgressBar: true,
                          didOpen: async() => {
                        this.modoLectura()
                        this.chartOptions.series = [];
                        
                         this.ServiciosAnalisisCon
                          .analisisDobleMasas( this.formularioConsulta.value)
                          .subscribe((response) => {

                             

                                  
                                  Swal.showLoading();
                           this.listaAutocompletado = response;    


                           for (let  i = 0; i <     this.listaAutocompletado.multiLista.length; i++) {
                          
                            for (let  j = 0; j <     this.listaAutocompletado.multiLista[i].length; j++) {

                            
                              if( this.listaAutocompletado.multiLista[i][0]['valor']  == 0 ){


                                var valor  =       this.listaAutocompletado.multiLista[i][j]['valor']  

                              }else{
                           
                           
                              if( this.listaAutocompletado.multiLista[i][0]['valor']  ){


                                var valor  =       this.listaAutocompletado.multiLista[i][j]['valor']  


                              }else{
                                var valor  =       this.listaAutocompletado.multiLista[i][j-1]['valor']  +   this.listaAutocompletado.multiLista[i][j]['valor']  


                              }

                            }
                              this.listaAutocompletado.multiLista[i][j]['valor'] =valor;
                              
                              

                       
                            
                           };

                          }


                          console.log( 33, this.listaAutocompletado);



                           var cars = this.listaAutocompletado.multiLista.filter(function(car:any) {
                            return car.length != 0; 
                          });
                          var posicion =  this.listaAutocompletado.multiLista.indexOf(null);
                          console.log(434,cars);
                      console.log(44,posicion);
                          var lista_elemento :any= []
                          for (let  i = 0; i <  posicion.length; i++) {
                              lista_elemento =  posicion.filter(((element:any) => element.idCategoria == posicion[i].text)).map((elemento: any) => ({
                              id: elemento.id,
                              text: elemento.text,
                            }));
                          };
                       
                     



                          this.listaAutocompletado.multiLista = cars
                             var serie:any = [];
                            var catidadRepresentativas:any  = [];
                            catidadRepresentativas = this.listaAutocompletado.multiLista;

                   
                            var   cantidad =[];
                            var   cantidad2 =[];
                            var cantidadNivel = [];

                            for (let  i = 0; i <  catidadRepresentativas.length; i++) {

                            switch (i) {
                            case  1: {


                              if(this.listaAutocompletado.multiLista[1].length){

                                        var myRegression:any = [];
                                        var cantidad1 = [];
                                        const x:any = [];
                                        const y:any = [];
                                        for (let  i = 0; i <  catidadRepresentativas[0].length; i++) {
                                            
                                          if(catidadRepresentativas[0][i]  &&   catidadRepresentativas[1][i] ){

                                            
                                            if(i==0 ){
                                
                                              var valor  =       catidadRepresentativas[0][i]['valor']  
                                              var valor1  =       catidadRepresentativas[1][i]['valor']  
              
              
                                            }else{
                                              var valor  =       catidadRepresentativas[0][i-1]['valor']  +   catidadRepresentativas[0][i]['valor']  
              
                                              var valor1  =       catidadRepresentativas[1][i-1]['valor']  +   catidadRepresentativas[1][i]['valor']  

                                            }
                                                 catidadRepresentativas[1][i]['valor'] =valor;
                                                  catidadRepresentativas[0][i]['valor'] =valor1;

                                                  let myArray = [catidadRepresentativas[1][i]['valor']  , catidadRepresentativas[0][i]['valor'] ]; 
                                                  let suma = 0
    
                                                  for(let index in myArray) {
                                                    suma += myArray[index]
                                                  
                                                  }
                                                  
                                                    console.log(suma/myArray.length)

                                            
                                                      
          
                                            x.push(suma/myArray.length);
                                            y.push(catidadRepresentativas[1][i]['valor']); 
                                            var  ejeY =  catidadRepresentativas[0][i]['valor'] 
                                            var  eje =  suma/myArray.length
                                            cantidad1.push([eje,ejeY]);
                                              this.cantidad_1.push([suma/myArray.length,catidadRepresentativas[1][i]['valor']  ]);

                                            }


                                          }


                                          console.log(2,catidadRepresentativas);


                                            myRegression = ecStat.regression('linear', cantidad1, 0);
                                            this.cantidad_1_1 = myRegression.points;
          
                                            const result = regression.linear( this.cantidad_1);
                                            console.log(myRegression);
                                            console.log(result);
                                            this.pediente1 = result.equation[0];
                                            this.pediente2 = result.equation[1];
                                            this.ecuacionString = result.string;
                                            this.correlacion  = correlation.calc(x, y);
          
                                            var lista =  this.linearRegression(x,y);
          
                                            this.r2 = result.r2;
                                            var r2 = lista.r2;
                                            var r22 =  r2.toFixed(2)
                                            var r221   = parseFloat(r22)
                                            this.ajuste=r221
  
                                    

                                    }else{
  
                                  Swal.fire(
                                    'Doble masas ',
                                    'No hay información en la estación representativa '+this.listaItemsElementos[1]['nombreElemento'],
                                    'error'
                                  )
                                }
                          
                          
                                break;
                             }
                            case 2: {   

                                if(this.listaAutocompletado.multiLista[2].length){


                      


                                  var myRegression:any = [];
                                  var cantidad1 = [];
                                    for (let  i = 0; i <  catidadRepresentativas[0].length; i++) {

                                      if(catidadRepresentativas[0][i]  &&   catidadRepresentativas[2][i] ){ 
                                        
                                         
                                            if(i==0 ){
                                
                                              var valor  =       catidadRepresentativas[0][i]['valor']  
                                              var valor1  =       catidadRepresentativas[2][i]['valor']  
              
              
                                            }else{
                                              var valor  =       catidadRepresentativas[0][i-1]['valor']  +   catidadRepresentativas[0][i]['valor']  
              
                                              var valor1  =       catidadRepresentativas[2][i-1]['valor']  +   catidadRepresentativas[2][i]['valor']  

                                            }
                                                 catidadRepresentativas[2][i]['valor'] =valor;
                                                  catidadRepresentativas[0][i]['valor'] =valor1;

                                                  let myArray = [catidadRepresentativas[2][i]['valor']  , catidadRepresentativas[0][i]['valor'] ]; 
                                                  let suma = 0
    
                                                  for(let index in myArray) {
                                                    suma += myArray[index]
                                                  
                                                  }
                                                  
                                                    console.log(suma/myArray.length)

                                            
                                                      
          
                                         
                                            var  ejeY =  catidadRepresentativas[2][i]['valor'] 
                                            var  eje =  suma/myArray.length
                                            cantidad1.push([eje,ejeY]);
                                              this.cantidad_2.push([suma/myArray.length,catidadRepresentativas[2][i]['valor']  ]);

                                      }
                                    }
                                    myRegression = ecStat.regression('linear', cantidad1, 0);
                                    this.cantidad_2_2 = myRegression.points;
 
                            
                            
                                  }else{
    
                                  Swal.fire(
                                    'Doble masas ',
                                    'No hay información en la estación representativa '+this.listaItemsElementos[2]['nombreElemento'],
                                    'error'
                                  )
                                }
                               

                              
                                  break;
                            }
                            case 3: {   

                                  
                                  if(this.listaAutocompletado.multiLista[3].length){

                             
                                      var myRegression:any = [];
                                      var cantidad1 = [];
                                    for (let  i = 0; i <  catidadRepresentativas[0].length; i++) {

                                      if(catidadRepresentativas[0][i]  &&   catidadRepresentativas[3][i] ){ 

                                        if(i==0 ){
                                
                                          var valor  =       catidadRepresentativas[0][i]['valor']  
                                          var valor1  =       catidadRepresentativas[1][i]['valor']  
          
          
                                        }else{
                                          var valor  =       catidadRepresentativas[0][i-1]['valor']  +   catidadRepresentativas[0][i]['valor']  
          
                                          var valor1  =       catidadRepresentativas[1][i-1]['valor']  +   catidadRepresentativas[1][i]['valor']  

                                        }
                                             catidadRepresentativas[1][i]['valor'] =valor;
                                              catidadRepresentativas[0][i]['valor'] =valor1;

                                        var  ejeY =  catidadRepresentativas[0][i]['valor'] 
                                        var  ejex =  catidadRepresentativas[3][i]['valor'] 
                                        cantidad1.push([ejex,ejeY]);
                                        this.cantidad_3.push([catidadRepresentativas[3][i]['valor'],catidadRepresentativas[0][i]['valor']]);
                                      }
                                  
                                      }
                                      myRegression = ecStat.regression('linear', cantidad1, 0);
                                      this.cantidad_3_3 = myRegression.points;
        
                                    }else{
        
                                      Swal.fire(
                                        'Doble masas ',
                                        'No hay información en la estación representativa '+this.listaItemsElementos[3]['nombreElemento'],
                                        'error'
                                      )
                                    }
                                  
                               
                                  break;
                            }
                             case  4: {   
                                  if(this.listaAutocompletado.multiLista[4].length){

                                    

                                    var myRegression:any = [];
                                    var cantidad1 = [];
                                  for (let  i = 0; i <  catidadRepresentativas[0].length; i++) {
                                    if(catidadRepresentativas[0][i]  &&   catidadRepresentativas[4][i] ){ 
                                      var  ejeY =  catidadRepresentativas[0][i]['valor'] 
                                      var  ejex =  catidadRepresentativas[4][i]['valor'] 
                                      cantidad1.push([ejex,ejeY]);
                                      this.cantidad_4.push([catidadRepresentativas[4][i]['valor'],catidadRepresentativas[0][i]['valor']]);
                                    }
                                 
                                    }
                                    myRegression = ecStat.regression('linear', cantidad1, 0);
                                    this.cantidad_4_4 = myRegression.points;
 
                                  }else{
      
                                    Swal.fire(
                                      'Doble masas ',
                                      'No hay información en la estación representativa '+this.listaItemsElementos[4]['nombreElemento'],
                                      'error'
                                    )
                                  }

                                
                                    
                                    
                                  break;
                            }
                            case  5: {   


                                  if(this.listaAutocompletado.multiLista[5].length){

                                  
                                    var myRegression:any = [];
                                    var cantidad1 = [];
                                  for (let  i = 0; i <  catidadRepresentativas[0].length; i++) {
                                    if(catidadRepresentativas[0][i]  &&   catidadRepresentativas[5][i] ){ 
                                      var  ejeY =  catidadRepresentativas[0][i]['valor'] 
                                      var  ejex =  catidadRepresentativas[5][i]['valor'] 
                                      cantidad1.push([ejex,ejeY]);
                                      this.cantidad_5.push([catidadRepresentativas[5][i]['valor'],catidadRepresentativas[0][i]['valor']]);
                                    }
                                    }
                                    myRegression = ecStat.regression('linear', cantidad1, 0);
                                    this.cantidad_5_5 = myRegression.points;
 
                                  }else{
      
                                    Swal.fire(
                                      'Doble masas ',
                                      'No hay información en la estación representativa '+this.listaItemsElementos[5]['nombreElemento'],
                                      'error'
                                    )
                                  }
                                  
                                    
                                    
                                  break;
                             }
                            default: {
                                  console.log('elemento', elemento);
                                }
                            }  


                          }
                              
                            for (let  i = 0; i <  catidadRepresentativas.length; i++) {

                              switch (i) {
                        
                              case 1: {
                                if(this.listaAutocompletado.multiLista[1].length){

                                      serie.push( 
                                          {
                                        point: {
                                          events: {
                                              click: function(event1:any,formdate:any) {
                                                      var3 = catidadRepresentativas[1].filter((filtro:any)=> filtro.valor == event1.point.options.x)[0].fecha;
                                                      var2 = event1.point.options.y
                                                      var1 = event1.point.options.x
                                                      let div:any=document.getElementById(`btn`);
                                                      div.click();
                                                    
                                              }
                                          }
                                      },
                                            type: 'line',
                                        name: this.listaItemsElementos[i]['nombreElemento'],
                                            data: this.cantidad_1,
                                          }
                                        );

                                


                                    this.nombreEstacionA = this.listaItemsElementos[i]['nombreElemento'];

                                
                              }
                                        break;
                                      }
                              case 2: {
                                if(this.listaAutocompletado.multiLista[2].length){

                                   
                                serie.push( 
                                    {
                                  point: {
                                    events: {
                                        click: function(event1:any,formdate:any) {
                                  
                                                var3 = catidadRepresentativas[2].filter((filtro:any)=> filtro.valor == event1.point.options.x)[0].fecha;
                                                var2 = event1.point.options.y
                                                var1 = event1.point.options.x
                                                let div:any=document.getElementById(`btn`);
                                                div.click();
                                              
                                        }
                                    }
                                },
                                      type: 'line',
                                  name: this.listaItemsElementos[i]['nombreElemento'],
                                      data: this.cantidad_2,
                                    }
                                  );



                              this.nombreEstacionB = this.listaItemsElementos[i]['nombreElemento'];

                                }
                              

                                  break;
                                }
                              case 3: {
                                if(this.listaAutocompletado.multiLista[3].length){

                                  
                                        serie.push( 
                                            {
                                          point: {
                                            events: {
                                                click: function(event1:any,formdate:any) {
                                          
                                                        var3 = catidadRepresentativas[3].filter((filtro:any)=> filtro.valor == event1.point.options.x)[0].fecha;
                                                        var2 = event1.point.options.y
                                                        var1 = event1.point.options.x
                                                        let div:any=document.getElementById(`btn`);
                                                        div.click();
                                                      
                                                }
                                            }
                                        },
                                              type: 'scatter',
                                          name: this.listaItemsElementos[i]['nombreElemento'],
                                              data: this.cantidad_3,
                                            }
                                          );

                                      
                                    serie.push( 
                                      {
                                        point: {
                                          events: {
                                              click: function(event1:any,formdate:any) {
                                        
                                                      var3 = catidadRepresentativas[3].filter((filtro:any)=> filtro.valor == event1.point.options.x)[0].fecha;
                                                      var2 = event1.point.options.y
                                                      var1 = event1.point.options.x
                                                      let div:any=document.getElementById(`btn`);
                                                      div.click();
                                                    
                                              }
                                          }
                                      },
                                        type: 'line',
                                        name: 'Regreción lineal '+ this.listaItemsElementos[i]['nombreElemento'],
                                        data: this.cantidad_3_3,
                                      }
                                    );
                                    
                                    this.nombreEstacionC = this.listaItemsElementos[i]['nombreElemento'];

                                

                              }
                                    break;
                                  }
                              case 4: {
                                if(this.listaAutocompletado.multiLista[4].length){

                                      serie.push( 
                                          {
                                    point: {
                                        events: {
                                            click: function(event1:any,formdate:any) {
                                      
                                                    var3 = catidadRepresentativas[4].filter((filtro:any)=> filtro.valor == event1.point.options.x)[0].fecha;
                                                    var2 = event1.point.options.y
                                                    var1 = event1.point.options.x
                                                    let div:any=document.getElementById(`btn`);
                                                    div.click();
                                                  
                                            }
                                        }
                                    },
                                            type: 'scatter',
                                        name:  this.listaItemsElementos[i]['nombreElemento'],
                                            data: this.cantidad_4,
                                          }
                                        );

                                    serie.push( 
                                      {
                                        point: {
                                          events: {
                                              click: function(event1:any,formdate:any) {
                                        
                                                      var3 = catidadRepresentativas[4].filter((filtro:any)=> filtro.valor == event1.point.options.x)[0].fecha;
                                                      var2 = event1.point.options.y
                                                      var1 = event1.point.options.x
                                                      let div:any=document.getElementById(`btn`);
                                                      div.click();
                                                    
                                              }
                                          }
                                      },
                                        type: 'line',
                                        name: 'Regreción lineal '+ this.listaItemsElementos[i]['nombreElemento'],
                                        data: this.cantidad_4_4,
                                      }
                                    );
                                        
                                    this.nombreEstacionD = this.listaItemsElementos[i]['nombreElemento'];
                                

                              }
                                  break;
                                }
                              case 5: {
                                if(this.listaAutocompletado.multiLista[4].length){
                                  serie.push( 
                                      {
                                    point: {
                                      events: {
                                          click: function(event1:any,formdate:any) {
                                                  
                                                  var3 = catidadRepresentativas[5].filter((filtro:any)=> filtro.valor == event1.point.options.x)[0].fecha;
                                                  var2 = event1.point.options.y
                                                  var1 = event1.point.options.x
                                                  let div:any=document.getElementById(`btn`);
                                                  div.click();
                                                
                                          }
                                      }
                                  },
                                        type: 'scatter',
                                    name: this.listaItemsElementos[i]['nombreElemento'],
                                        data: this.cantidad_5,
                                      }
                                    );
                                
                                serie.push( 
                                  {
                                  
                                    point: {
                                      events: {
                                          click: function(event1:any,formdate:any) {
                                    
                                                  var3 = catidadRepresentativas[5].filter((filtro:any)=> filtro.valor == event1.point.options.x)[0].fecha;
                                                  var2 = event1.point.options.y
                                                  var1 = event1.point.options.x
                                                  let div:any=document.getElementById(`btn`);
                                                  div.click();
                                                
                                          }
                                      }
                                  },
                                    type: 'line',
                                    name: 'Regreción lineal '+this.listaItemsElementos[i]['nombreElemento'],
                                    data: this.cantidad_5_5,
                                  }
                                );

                                this.nombreEstacionE = this.listaItemsElementos[i]['nombreElemento'];

                                


                              }
                                    break;
                                  }
                              default: {
                                        console.log('elemento', elemento);
                                      }
                                    }
                                      
                                    
                                  }
                                
                            
                              this.chartOptions = {    
                                chart: {
                                
                                  renderTo: 'container',
                              
                                  type: 'scatter',
                            
                              },           
                                title : {
                                  text:  this.nombreParametro   
                                },
                                yAxis : {
                                  title: {
                                    text:   this.nombreParametro +"  -"  +this.nombreEstacion,
                                  },
                                  
                            
                                  type: 'category',
                                  labels: {
                                    rotation: -45,
                                    style: {
                                            fontSize: '13px',
                                            fontFamily: 'Verdana, sans-serif'
                                        },
                                    }
                              },
                              xAxis : {
                                title: {
                                  text:  'Estaciones representativas',
                                },
                                categories: this.cantidad,
                          
                                type: 'category',
                                labels: {
                                  rotation: -45,
                                  style: {
                                          fontSize: '13px',
                                          fontFamily: 'Verdana, sans-serif'
                                      },
                                  }
                            },

                            tooltip: {
                              formatter: function(d){
                                var rV = "Estación selecionada "+this.series.name + " <br/>";
                                rV += '<span style="color:' + this.point.color + '">\u25CF</span> Valor estación origen: <b> ' + this.y + '</b><br/>';
                                rV += '<span style="color:' + this.point.color + '">\u25CF</span> Valor estación  representativa : <b> ' + this.x + '</b><br/>';
                                return rV;
                            },
                              backgroundColor: '#FCFFC5',
                              borderColor: 'black',
                              borderRadius: 10,
                              borderWidth: 3
                          },
                                series :serie
                            };

                           this.serie = serie 

                            Swal.close();
                          });
                          },
                          willClose: async() => {
                            Swal.hideLoading();
                          }
                        });


                      

                       
                  

                        break;
                      }
                      case '467': {
                        // Embalses
                        this.formularioConsulta.value.listaElementos =
                        objetoBusqueda = this.formularioConsulta.value;
                        objetoBusqueda.tipoElemento = elemento;
                        break;
                      }
                      case '468': {
                        // Pozos
                      
                        objetoBusqueda = this.formularioConsulta.value;
                        objetoBusqueda.tipoElemento = elemento;
                        break;
                      }
                      default: {
                        console.log('elemento', elemento);
                      }
                    }
                
                    
          }else{
            Swal.fire(
              'Doble masas ',
              'Debe ingresar al menos una estación representativa ',
              'error'
            )
          }

        }else{
          Swal.fire(
            'Doble masas ',
            'Debe ingresar los datos solicitados  ',
            'error'
          )
        }


      } catch (error) {
        Swal.fire(
          'Doble masas ',
          'Debe ingresar los datos solicitados  ',
          'error'
        )
       
      }

}



graficapdf(){
  alert(33);
  this.lineChart.chart.exportChart({
    type: "application/pdf",
    filename: "line-chart"
  });

}

infoAforo(){

 
  var alumnosCurso = '<table id="alumnosCurso" class="table table-striped nowrap" width="100%"><thead><tr><th>Valor Origen </th><th>Valor reprentativo</th><th>Fecha de aforo</th></tr> </thead><tbody><tr><td>'+var1+'</td><td>'+var2+'</td><td>'+var3+'</td> </tr></tbody></table>';
 
      Swal.fire({
        title: 'Información de valores ',
        html:alumnosCurso,
        focusConfirm: false,
        allowOutsideClick: false
    });

} 



guadarCurva(){
  Swal.fire({
    title: 'Desea guardar la serie de tiempo ?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Guardar',
  }).then((result) => {
    if (result.isConfirmed) {
      
    this.crearSerie();

    }
  });
}
verDetalle(){


  
  this.chartOptions1 = {};
  this.chartOptions1.series = [];
    var serie:any=[];
    var dataO:any=[];
    var dataA:any=[];
    var dataB:any=[];
    var dataC:any=[];
    var dataD:any=[];
    var dataE:any=[];




     for (let  i = 0; i <  this.listaAutocompletado.multiLista[0].length; i++) {
         
      this.categoriaFecha.push(this.listaAutocompletado.multiLista[0][i]['fecha']);

     } 
  
    if(this.listaAutocompletado.multiLista.length == 2){ 

      this.tabla = '1';
      this.listaDetalle =[];
      for (let  i = 0; i <  this.listaAutocompletado.multiLista[0].length; i++) {
 
          if(this.listaAutocompletado.multiLista[0][i]  &&   this.listaAutocompletado.multiLista[1][i] ){

              this.listaDetalle.push(
          
                {  fecha: this.listaAutocompletado.multiLista[0][i]['fecha'],
                  valorOrigen: this.listaAutocompletado.multiLista[0][i]['valor'],
                  valor1: this.listaAutocompletado.multiLista[1][i]['valor'],

              }   ); 

              dataO.push(this.listaAutocompletado.multiLista[0][i]['valor']);
              dataA.push(this.listaAutocompletado.multiLista[1][i]['valor']);

          }
      }

      serie=[{
        type: 'column',
          name: this.nombreEstacion+"-Origen",
          data: dataO
        },
        {
          type: 'column',
            name: this.nombreEstacionA,
            data: dataA
          },
      ]




   var    tablaString = 'Promedio '+this.nombreParametro+'-'+ this.nombreEstacion;
     var  tablaString1 = 'Promedio '+this.nombreParametro+'-'+this.nombreEstacionA;
    
     this.columnas = [ 
      { title:'Fecha', data:'fecha' ,  disabled: true }, 
       { title:tablaString, data:'valorOrigen',disabled: true}, 
       { title:tablaString1, data:'valor1',disabled: true},  
     ];

    }
 
 
    if(this.listaAutocompletado.multiLista.length  == 3){  
      this.listaDetalle =[];

      this.tabla = '2';
      for (let  i = 0; i <  this.listaAutocompletado.multiLista[0].length; i++) {

     if(this.listaAutocompletado.multiLista[0][i]  &&  
       this.listaAutocompletado.multiLista[2][i]  &&
        this.listaAutocompletado.multiLista[1][i]   ){

            this.listaDetalle.push(
        
              {  fecha: this.listaAutocompletado.multiLista[0][i]['fecha'],
                valorOrigen: this.listaAutocompletado.multiLista[0][i]['valor'],
                valor1: this.listaAutocompletado.multiLista[1][i]['valor'],
                valor2: this.listaAutocompletado.multiLista[2][i]['valor'],
            
            }   ); 

            dataO.push(this.listaAutocompletado.multiLista[0][i]['valor']);
            dataA.push(this.listaAutocompletado.multiLista[1][i]['valor']);
            dataB.push(this.listaAutocompletado.multiLista[2][i]['valor']);

          }
      }

      serie=[{
        type: 'column',
          name: this.nombreEstacion+"-Origen",
          data: dataO
        },
      {
        type: 'column',
          name: this.nombreEstacionA,
          data: dataA
        },
      {
        type: 'column',
          name: this.nombreEstacionB,
          data: dataB
        },     
      ]

      var    tablaString = 'Promedio '+this.nombreParametro+'-'+ this.nombreEstacion;
      var  tablaString1 = 'Promedio '+this.nombreParametro+'-'+this.nombreEstacionA;
      var  tablaString2 = 'Promedio '+this.nombreParametro+'-'+this.nombreEstacionB;
       this.columnas1 = [ 
        { title:'Fecha', data:'fecha' ,  disabled: true }, 
         { title:tablaString, data:'valorOrigen',disabled: true}, 
         { title:tablaString1, data:'valor1',disabled: true},  
         { title:tablaString2, data:'valor2',disabled: true}, 
       ];

    }

    if(this.listaAutocompletado.multiLista.length  == 4){  
      this.listaDetalle =[];

      this.tabla = '3';
      for (let  i = 0; i <  this.listaAutocompletado.multiLista[0].length; i++) {

     if(this.listaAutocompletado.multiLista[0][i]  &&  
       this.listaAutocompletado.multiLista[2][i]  &&
        this.listaAutocompletado.multiLista[1][i]   ){

            this.listaDetalle.push(
        
              {  fecha: this.listaAutocompletado.multiLista[0][i]['fecha'],
                valorOrigen: this.listaAutocompletado.multiLista[0][i]['valor'],
                valor1: this.listaAutocompletado.multiLista[1][i]['valor'],
                valor2: this.listaAutocompletado.multiLista[2][i]['valor'],
                valor3: this.listaAutocompletado.multiLista[3][i]['valor'],
            
            }   ); 

            dataO.push(this.listaAutocompletado.multiLista[0][i]['valor']);
            dataA.push(this.listaAutocompletado.multiLista[1][i]['valor']);
            dataB.push(this.listaAutocompletado.multiLista[2][i]['valor']);
            dataC.push(this.listaAutocompletado.multiLista[3][i]['valor']);

          }
      }

      serie=[{
        type: 'column',
          name: this.nombreEstacion+"-Origen",
          data: dataO
        },
      {
        type: 'column',
          name: this.nombreEstacionA,
          data: dataA
        },
      {
        type: 'column',
          name: this.nombreEstacionB,
          data: dataB
        },  
        {
          type: 'column',
            name: this.nombreEstacionC,
            data: dataC
          },    
      ]

      var    tablaString = 'Promedio '+this.nombreParametro+'-'+ this.nombreEstacion;
      var  tablaString1 = 'Promedio '+this.nombreParametro+'-'+this.nombreEstacionA;
      var  tablaString2 = 'Promedio '+this.nombreParametro+'-'+this.nombreEstacionB;
      var  tablaString3 = 'Promedio '+this.nombreParametro+'-'+this.nombreEstacionC;

       this.columnas2 = [ 
        { title:'Fecha', data:'fecha' ,  disabled: true }, 
         { title:tablaString, data:'valorOrigen',disabled: true}, 
         { title:tablaString1, data:'valor1',disabled: true},  
         { title:tablaString2, data:'valor2',disabled: true}, 
         { title:tablaString3, data:'valor3',disabled: true}, 
       ];

    }

    if(this.listaAutocompletado.multiLista.length  == 5){  
      this.listaDetalle =[];

      this.tabla = '4';
      for (let  i = 0; i <  this.listaAutocompletado.multiLista[0].length; i++) {

     if(this.listaAutocompletado.multiLista[0][i]  &&  
       this.listaAutocompletado.multiLista[2][i]  &&
        this.listaAutocompletado.multiLista[1][i] &&
        this.listaAutocompletado.multiLista[3][i] &&  
        this.listaAutocompletado.multiLista[4][i] 
        ){

            this.listaDetalle.push(
        
              {  fecha: this.listaAutocompletado.multiLista[0][i]['fecha'],
                valorOrigen: this.listaAutocompletado.multiLista[0][i]['valor'],
                valor1: this.listaAutocompletado.multiLista[1][i]['valor'],
                valor2: this.listaAutocompletado.multiLista[2][i]['valor'],
                valor3: this.listaAutocompletado.multiLista[3][i]['valor'],
                valor4: this.listaAutocompletado.multiLista[4][i]['valor'],
            
            }   ); 

            dataO.push(this.listaAutocompletado.multiLista[0][i]['valor']);
            dataA.push(this.listaAutocompletado.multiLista[1][i]['valor']);
            dataB.push(this.listaAutocompletado.multiLista[2][i]['valor']);
            dataC.push(this.listaAutocompletado.multiLista[2][i]['valor']);
            dataD.push(this.listaAutocompletado.multiLista[4][i]['valor']);

          }
      }

      serie=[{
        type: 'column',
          name: this.nombreEstacion+"-Origen",
          data: dataO
        },
      {
        type: 'column',
          name: this.nombreEstacionA,
          data: dataA
        },
      {
        type: 'column',
          name: this.nombreEstacionB,
          data: dataB
        },   
        {
          type: 'column',
            name: this.nombreEstacionC,
            data: dataC
          },    

          {
            type: 'column',
              name: this.nombreEstacionD,
              data: dataD
            }, 
      ]

      var    tablaString = 'Promedio '+this.nombreParametro+'-'+ this.nombreEstacion;
      var  tablaString1 = 'Promedio '+this.nombreParametro+'-'+this.nombreEstacionA;
      var  tablaString2 = 'Promedio '+this.nombreParametro+'-'+this.nombreEstacionB;
      var  tablaString3 = 'Promedio '+this.nombreParametro+'-'+this.nombreEstacionC;
      var  tablaString4 = 'Promedio '+this.nombreParametro+'-'+this.nombreEstacionD;
       this.columnas3 = [ 
        { title:'Fecha', data:'fecha' ,  disabled: true }, 
         { title:tablaString, data:'valorOrigen',disabled: true}, 
         { title:tablaString1, data:'valor1',disabled: true},  
         { title:tablaString2, data:'valor2',disabled: true}, 
         { title:tablaString3, data:'valor3',disabled: true},  
         { title:tablaString4, data:'valor4',disabled: true}, 
       ];

    }



    if(this.listaAutocompletado.multiLista.length  == 6){  
      this.listaDetalle =[];


      this.tabla = '5';
      for (let  i = 0; i <  this.listaAutocompletado.multiLista[0].length; i++) {
  
     if(this.listaAutocompletado.multiLista[0][i]  &&  
        this.listaAutocompletado.multiLista[2][i]  &&
        this.listaAutocompletado.multiLista[1][i] &&
        this.listaAutocompletado.multiLista[3][i] &&  
        this.listaAutocompletado.multiLista[4][i] && 
        this.listaAutocompletado.multiLista[5][i] 
        ){

            this.listaDetalle.push(
        
              {  fecha: this.listaAutocompletado.multiLista[0][i]['fecha'],
                valorOrigen: this.listaAutocompletado.multiLista[0][i]['valor'],
                valor1: this.listaAutocompletado.multiLista[1][i]['valor'],
                valor2: this.listaAutocompletado.multiLista[2][i]['valor'],
                valor3: this.listaAutocompletado.multiLista[3][i]['valor'],
                valor4: this.listaAutocompletado.multiLista[4][i]['valor'],
                valor5: this.listaAutocompletado.multiLista[5][i]['valor'],
            
            }   ); 

            dataO.push(this.listaAutocompletado.multiLista[0][i]['valor']);
            dataA.push(this.listaAutocompletado.multiLista[1][i]['valor']);
            dataB.push(this.listaAutocompletado.multiLista[2][i]['valor']);
            dataC.push(this.listaAutocompletado.multiLista[2][i]['valor']);
            dataD.push(this.listaAutocompletado.multiLista[4][i]['valor']);
            dataE.push(this.listaAutocompletado.multiLista[5][i]['valor']);
          }
      }

      serie=[{
        type: 'column',
          name: this.nombreEstacion+"-Origen",
          data: dataO
        },
      {
        type: 'column',
          name: this.nombreEstacionA,
          data: dataA
        },
      {
        type: 'column',
          name: this.nombreEstacionB,
          data: dataB
        },   
        {
          type: 'column',
            name: this.nombreEstacionC,
            data: dataC
          },    

          {
            type: 'column',
              name: this.nombreEstacionD,
              data: dataD
            }, 

            {
              type: 'column',
                name: this.nombreEstacionE,
                data: dataE
              }, 
      ]

      var    tablaString = 'Promedio '+this.nombreParametro+'-'+ this.nombreEstacion;
      var  tablaString1 = 'Promedio '+this.nombreParametro+'-'+this.nombreEstacionA;
      var  tablaString2 = 'Promedio '+this.nombreParametro+'-'+this.nombreEstacionB;
      var  tablaString3 = 'Promedio '+this.nombreParametro+'-'+this.nombreEstacionC;
      var  tablaString4 = 'Promedio '+this.nombreParametro+'-'+this.nombreEstacionD;
      var  tablaString5 = 'Promedio '+this.nombreParametro+'-'+this.nombreEstacionE;
       this.columnas4 = [ 
        { title:'Fecha', data:'fecha' ,  disabled: true }, 
         { title:tablaString, data:'valorOrigen',disabled: true}, 
         { title:tablaString1, data:'valor1',disabled: true},  
         { title:tablaString2, data:'valor2',disabled: true}, 
         { title:tablaString3, data:'valor3',disabled: true},  
         { title:tablaString4, data:'valor4',disabled: true}, 
         { title:tablaString5, data:'valor5',disabled: true}, 
       ];

    }



 

     

 console.log(serie);
    this.chartOptions1 = {
      chart: {
          type: 'column'
      },
      title: {
          text: this.nombreParametro
      },

      xAxis: {
          categories: this.categoriaFecha,
          title: {
              text: null
          }
      },
      yAxis: {
          min: 0,
          title: {
              text: this.nombreParametro,
              align: 'high'
          },
          labels: {
              overflow: 'justify'
          }
      },
      tooltip: {
          valueSuffix: '  '
      },
      plotOptions: {
          bar: {
              dataLabels: {
                  enabled: true
              }
          }
      },
  
      
      credits: {
          enabled: false
      },
      series: serie
  };

  var list: any = this.listaDetalle;

  for (let index = 0; index < list.length; index++) {
    const element = list[index]; 
    var fecha = new Date(list[index].fecha); 
    let objSerieTiempo = {
      idSerieTiempoElemento: 0,
      idSerieTiempoDetalle: 0,
      idTipoFormato: 461,
      valor: list[index].valor,
      fecha: list[index].fecha,
      idFlag: list[index].idFlagObservacion, 
      flagObservacion: list[index].flagObservacion,
      dia: fecha.getDay(),
      anio: fecha.getFullYear(),
      mes: fecha.getMonth() + 1,
      hora:
        fecha.getHours() +
        ':' +
        fecha.getMinutes() +
        ':' +
        fecha.getSeconds(),
    };

  }

 }



obtenerPorFrecuencia(idfrecuencia:any){


  if(idfrecuencia.value){
    this.serviciosParametrosService
    .obtenerPorId(idfrecuencia.value)
    .subscribe((response1) => {
  
      this.parametroLista = response1;
  
    this.serviciosParametrosService
    .obtenerListaParametros()
    .subscribe((response) => {
  
    console.log(45644,response);
      this.listParametroOrgin  =  response.filter((element => element.idCategoria == response1.idCategoria)).map((elemento: any) => ({
        id: elemento.idParametro,
        text: elemento.descripcion+'-'+elemento.nombreTipoParametro ,
        idOrigen: elemento.codigoOrigen,
        disabled: elemento.activo == 'S' ? false : true,
      }));
      this.agregarElementoOrigen()
    });
  
  
    this.idfrecuencia = this.parametroLista.idPeriodo;
  
    });

  }

 
}


validarSerie(newSerie: any) {
  for (let index = 0; index < this.datosFilter.length; index++) {
    // Validar Estacion
    if (
      // validar parametro
      this.datosFilter[index].fecha.getTime() == newSerie.fecha.getTime() &&
      this.datosFilter[index].valor == newSerie.valor
      // validar fechas
    ) {
      this.toast.fire({
        icon: 'info',
        title: 'la Serie de tiempo ya se encuentra agregada',
      });

      return false;
    }
  }

  if (newSerie.idFlag == 0) {
    return false;
  }
  if (newSerie.valor == 0 || newSerie.valor == undefined) {
    return false;
  }
  if (newSerie.hora == 'NaN:NaN:NaN') {
    return false;
  }

  return true;
}

cancelar(){

  window.location.reload();
}
guardar() {
  if (this.datosFilter.length >= 2) {
   
      Swal.fire({
        title: 'Guardando...',
        html: 'Por favor espere',
        timer: 5000,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading();

          for (let index = 0; index < this.datosFilter.length; index++) {
            const element = this.datosFilter[index];
            this.datosFilter[index].idSerieTiempoElemento =
              this.idSerieTiempo;
          }

          console.log('Guardando ', this.datosFilter);

          this.serviciosSerieTiempoService
            .crearDetalle(this.datosFilter)
            .subscribe((response) => {
              Swal.close();
            });
        },
        willClose: () => {
        

        },
      }).then((result) => {});

  } else {
 
  }
}
calcularFechas(): Date | undefined {
  if (this.idfrecuencia == 155) {
    const fechass = this.fechaAno + '-01-01T05:04:30';
    // console.log(fechass)
    return (this.fechaObservacion = new Date(fechass));
  }
  if (this.idfrecuencia == 154) {
    const fechass = this.fechaMes + '-01T05:04:30';

    return (this.fechaObservacion = new Date(fechass));
  }
  if (this.idfrecuencia == 151 || this.idfrecuencia == 152) {
    return (this.fechaObservacion = new Date(this.fecha));
  }

  return new Date();
}

agregarLista() {
  this.calcularFechas();
  let objSerieTiempo = {
    idSerieTiempoElemento: this.idSerieTiempo,
    idSerieTiempoDetalle: 0,
    idTipoFormato: 461,
    valor: this.valor,
    fecha: this.fechaObservacion,
    idFlag: this.flag,
    dia: this.fechaObservacion.getDay(),
    anio: this.fechaObservacion.getFullYear(),
    mes: this.fechaObservacion.getMonth() + 1,
    hora:
      this.fechaObservacion.getHours() +
      ':' +
      this.fechaObservacion.getMinutes() +
      ':' +
      this.fechaObservacion.getSeconds(),
  };

  if (this.validarSerie(objSerieTiempo)) {
    this.datosFilter.push(objSerieTiempo);
  }
}

guardar4() {
  if (this.datosFilter.length >= 2) {
   
      Swal.fire({
        title: 'Guardando...',
        html: 'Por favor espere',
        timer: 5000,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading();

          for (let index = 0; index < this.datosFilter.length; index++) {
            const element = this.datosFilter[index];
            this.datosFilter[index].idSerieTiempoElemento =
              this.idSerieTiempo;
          }

          console.log('Guardando ', this.datosFilter);

          this.serviciosSerieTiempoService
            .crearDetalle(this.datosFilter)
            .subscribe((response) => {
              Swal.close();
            });
        },
        willClose: () => {
          this.toast.fire({
            icon: 'success',
            title: 'Se Creo  la Serie de tiempo ',
          });

          this.router.navigate(['/seriestiempo/consultarserie']);
        },
      }).then((result) => {});
    } else {
      // Eliminar

      Swal.fire({
        title: 'Guardando...',
        html: 'Por favor espere',
        timer: 5000,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading();
          this.serviciosSerieTiempoService
            .eliminarSerieDetalle(this.idSerieTiempo)
            .subscribe((response) => {
              console.log('llego', response);
              this.serviciosSerieTiempoService
                .crearDetalle(this.datosFilter)
                .subscribe((response) => {
                  Swal.close();
                });
            });
        },
        willClose: () => {
          this.toast.fire({
            icon: 'success',
            title: 'Se Actualizo la Serie de tiempo ',
          });

          this.router.navigate(['/analisisconsistencia/doblesmasas']);
        },
      }).then((result) => {});
    }
 
}

crearSerie() {

  var reques:any = {};

  this.verDetalle();

  
  if( this.listaAutocompletado.multiLista.length == 2){

        Swal.fire({
          title: 'Cargando información...',
          html: 'Por favor espere',
          allowOutsideClick: false, 
          showConfirmButton: false, 
          timerProgressBar: true,
          didOpen: async() => {

            var reques1:any = {
              activo : "S",
              codigoEaab : "",
              codigoIdeam  : "",
              fechaCreacion : "",
              fechaEstado: "",
              fechaModificacion: "",
              idElemento:  this.formularioConsulta.value.idElemento,
              idFrecuencia: this.formularioConsulta.value.frecuencia,
              idMecanismo:469,
              idParametroXElemento:this.listParametro.filter(filtro=> filtro.id == this.formularioConsulta.value.idParametro)[0].idPXE,
              idTipoRegistro: 464,
              usuarioCreacion: "",
              usuarioEstado: "",
              usuarioModificacion: "",
              idTipoElemento: "466",
              flagInsert: "",
              fechaInicio:  this.formularioConsulta.value.fechaInicio,
              fechaFin:   this.formularioConsulta.value.fechaFin,
            };
        

            this.serviciosSerieTiempoService
            .crearDobleMasas(reques1)
            .subscribe((response) => {
                 
                  if(!response){


                  }else{


                
                this.idSerieTiempo = response.idSerieTiempoElemento;
                  for (let  i = 0; i <  this.cantidad_1_1.length; i++) {
                    if(this.listaDetalle[i]){
                      var fecha;
                      if(this.idfrecuencia == 145){
                        
                      fecha = this.listaDetalle[i].fecha
                      }
                      if(this.idfrecuencia == 152 ){
                        fecha = this.listaDetalle[i].fecha
                      }
                      if(this.idfrecuencia == 154){
                        fecha =this.listaDetalle[i].fecha+ "/01"
                      }
                      if(this.idfrecuencia == 151){
                        fecha = this.listaDetalle[i].fecha 
                      }
                      if(this.idfrecuencia == 682){
                        fecha = this.listaDetalle[i].fecha
                      }
                      if(this.idfrecuencia == 683){
                        fecha = this.listaDetalle[i].fecha
                      }
                      if(this.idfrecuencia == 146){
                        fecha = this.listaDetalle[i].fecha
                      }

                     var   fecha1 = new Date(fecha); 
                        let objSerieTiempo = {
                          idSerieTiempoElemento: 0,
                          idSerieTiempoDetalle: 0,
                          idTipoFormato: 461,
                          idFlag: response.idSerieTiempoElemento, 
                          fecha:fecha1,
                          valor:this.cantidad_1_1[i][1],
                          flagObservacion:"Generado",
                          dia: fecha1.getDay(),
                          anio: fecha1.getFullYear(),
                          mes: fecha1.getMonth() + 1,
                          hora:
                            fecha1.getHours() +
                            ':' +
                            fecha1.getMinutes() +
                            ':' +
                            fecha1.getSeconds(),
                        };
                     
                        this.datosFilter.push(objSerieTiempo);

                         }
                      
                      }
                      this.guardar();

                      this.toast.fire({
                        icon: 'success',
                        title: 'Se guardo la serie de tiempo id  #' +this.idSerieTiempo,
                      });
            
                      window.location.reload();


                    }
              
            });
        
          },
          willClose: async() => {
            Swal.hideLoading();
          }
        });
         
       

       }

       if( this.listaAutocompletado.multiLista.length == 3){


        
        Swal.fire({
          title: 'Cargando información...',
          html: 'Por favor espere',
          allowOutsideClick: false, 
          showConfirmButton: false, 
          timerProgressBar: true,
          didOpen: async() => {
 
          this.idSerieTiempo;
          var datosFilter :any =[];
            var reques1:any = {
              activo : "S",
              codigoEaab : "",
              codigoIdeam  : "",
              fechaCreacion : "",
              fechaEstado: "",
              fechaModificacion: "",
              idElemento:  this.formularioConsulta.value.idElemento,
              idFrecuencia: this.formularioConsulta.value.frecuencia,
              idMecanismo:469,
              idParametroXElemento:this.listParametro.filter(filtro=> filtro.id == this.formularioConsulta.value.idParametro)[0].idPXE,
              idTipoRegistro: 464,
              usuarioCreacion: "",
              usuarioEstado: "",
              usuarioModificacion: "",
              idTipoElemento: "466",
              flagInsert: "",
              fechaInicio:  this.formularioConsulta.value.fechaInicio,
              fechaFin:   this.formularioConsulta.value.fechaFin,
            };
        

            this.serviciosSerieTiempoService
            .crearDobleMasas(reques1)
            .subscribe((response1) => {
                 
              var idSerieTiempo = response1.idSerieTiempoElemento;
                  for (let  i = 0; i <  this.cantidad_1_1.length; i++) {
                    if(this.listaDetalle[i]){
                      var fecha;
                      if(this.idfrecuencia == 145){
                        
                      fecha = this.listaDetalle[i].fecha
                      }
                      if(this.idfrecuencia == 152 ){
                        fecha = this.listaDetalle[i].fecha
                      }
                      if(this.idfrecuencia == 154){
                        fecha =this.listaDetalle[i].fecha+ "/01"
                      }
                      if(this.idfrecuencia == 151){
                        fecha = this.listaDetalle[i].fecha+':00Z';
                      }
                      if(this.idfrecuencia == 682){
                        fecha = this.listaDetalle[i].fecha
                      }
                      if(this.idfrecuencia == 683){
                        fecha = this.listaDetalle[i].fecha
                      }
                      if(this.idfrecuencia == 146){
                        fecha = this.listaDetalle[i].fecha
                      }
                      
                      var   fecha1 = new Date(fecha); 

                      let objSerieTiempo = {
                        idSerieTiempoDetalle: 0,
                        idTipoFormato: 461,
                        idFlag: response1.idSerieTiempoElemento, 
                        fecha:fecha1,
                        idSerieTiempoElemento :  idSerieTiempo,
                        valor:this.cantidad_1_1[i][1],
                        flagObservacion:"Generado",
                        dia: fecha1.getDay(),
                        anio: fecha1.getFullYear(),
                        mes: fecha1.getMonth() + 1,
                        hora:
                          fecha1.getHours() +
                          ':' +
                          fecha1.getMinutes() +
                          ':' +
                          fecha1.getSeconds(),
                      };
                   
                      datosFilter.push(objSerieTiempo);


                    
                    }
                  }

              
                   
              
                        this.serviciosSerieTiempoService
                          .crearDetalle(datosFilter)
                          .subscribe((response) => {


                            this.toast.fire({
                              icon: 'success',
                              title: 'Se guardo la serie de tiemopo id  #' + idSerieTiempo,
                            });
                  
                      


                      
                                this.idSerieTiempo;
                    
                                var datosFilter1 :any =[];
                                var reques2:any = {
                                  activo : "S",
                                  codigoEaab : "",
                                  codigoIdeam  : "",
                                  fechaCreacion : "",
                                  fechaEstado: "",
                                  fechaModificacion: "",
                                  idElemento:  this.formularioConsulta.value.idElemento,
                                  idFrecuencia: this.formularioConsulta.value.frecuencia,
                                  idMecanismo:469,
                                  idParametroXElemento:this.listParametro.filter(filtro=> filtro.id == this.formularioConsulta.value.idParametro)[0].idPXE,
                                  idTipoRegistro: 464,
                                  usuarioCreacion: "",
                                  usuarioEstado: "",
                                  usuarioModificacion: "",
                                  idTipoElemento: "466",
                                  flagInsert: "",
                                  fechaInicio:  this.formularioConsulta.value.fechaInicio,
                                  fechaFin:   this.formularioConsulta.value.fechaFin,
                                };
                            
                    
                                this.serviciosSerieTiempoService
                                .crearDobleMasas(reques2)
                                .subscribe((response2) => {
                                 
                                     
                                    var idSerieTiempo1 = response2.idSerieTiempoElemento;
                                      for (let  i = 0; i <  this.cantidad_2_2.length; i++) {
                                        if(this.listaDetalle[i]){
                                          var fecha;
                                          if(this.idfrecuencia == 145){
                                            
                                          fecha = this.listaDetalle[i].fecha
                                          }
                                          if(this.idfrecuencia == 152 ){
                                            fecha = this.listaDetalle[i].fecha
                                          }
                                          if(this.idfrecuencia == 154){
                                            fecha =this.listaDetalle[i].fecha+ "/01"
                                          }
                                          if(this.idfrecuencia == 151){
                                            fecha = this.listaDetalle[i].fecha+':00Z';
                                          }
                                          if(this.idfrecuencia == 682){
                                            fecha = this.listaDetalle[i].fecha
                                          }
                                          if(this.idfrecuencia == 683){
                                            fecha = this.listaDetalle[i].fecha
                                          }
                                          if(this.idfrecuencia == 146){
                                            fecha = this.listaDetalle[i].fecha
                                          }
                    
                                         var   fecha1 = new Date(fecha); 
                                            let objSerieTiempo = {
                                              idSerieTiempoDetalle: 0,
                                              idTipoFormato: 461,
                                              idFlag: response2.idSerieTiempoElemento, 
                                              fecha:fecha1,
                                              idSerieTiempoElemento : idSerieTiempo1,
                                              valor:this.cantidad_2_2[i][1],
                                              flagObservacion:"Generado",
                                              dia: fecha1.getDay(),
                                              anio: fecha1.getFullYear(),
                                              mes: fecha1.getMonth() + 1,
                                              hora:
                                                fecha1.getHours() +
                                                ':' +
                                                fecha1.getMinutes() +
                                                ':' +
                                                fecha1.getSeconds(),
                                            };
                                         
                                            datosFilter1.push(objSerieTiempo);
                    
                    
                                          
                                          }
                    
                                        }
                                    
                                         
                                    
                                              this.serviciosSerieTiempoService
                                                .crearDetalle(datosFilter1)
                                                .subscribe((response) => {
                                                  this.toast.fire({
                                                    icon: 'success',
                                                    title: 'Se guardo la serie de tiemopo id  #' + idSerieTiempo1,
                                                  });
                                        
                                        
                                                  window.location.reload();
                                                });
                                            
                                            
                    
                    
                                  
                                  
                                });
                    
                                
                            
                         
                          
                          });


                       
              
            });


           
        
          },
          willClose: async() => {
            Swal.hideLoading();
          }
        });

       
       

       }


       if( this.listaAutocompletado.multiLista.length == 4){


        
        Swal.fire({
          title: 'Cargando información...',
          html: 'Por favor espere',
          allowOutsideClick: false, 
          showConfirmButton: false, 
          timerProgressBar: true,
          didOpen: async() => {
 
          this.idSerieTiempo;
          var datosFilter :any =[];
            var reques1:any = {
              activo : "S",
              codigoEaab : "",
              codigoIdeam  : "",
              fechaCreacion : "",
              fechaEstado: "",
              fechaModificacion: "",
              idElemento:  this.formularioConsulta.value.idElemento,
              idFrecuencia: this.formularioConsulta.value.frecuencia,
              idMecanismo:469,
              idParametroXElemento:this.listParametro.filter(filtro=> filtro.id == this.formularioConsulta.value.idParametro)[0].idPXE,
              idTipoRegistro: 464,
              usuarioCreacion: "",
              usuarioEstado: "",
              usuarioModificacion: "",
              idTipoElemento: "466",
              flagInsert: "",
              fechaInicio:  this.formularioConsulta.value.fechaInicio,
              fechaFin:   this.formularioConsulta.value.fechaFin,
            };
        

            this.serviciosSerieTiempoService
            .crearDobleMasas(reques1)
            .subscribe((response1) => {
        
                 
              var idSerieTiempo = response1.idSerieTiempoElemento;
                  for (let  i = 0; i <  this.cantidad_1_1.length; i++) {
                    if(this.listaDetalle[i]){
                      var fecha;
                      if(this.idfrecuencia == 145){
                        
                      fecha = this.listaDetalle[i].fecha
                      }
                      if(this.idfrecuencia == 152 ){
                        fecha = this.listaDetalle[i].fecha
                      }
                      if(this.idfrecuencia == 154){
                        fecha =this.listaDetalle[i].fecha+ "/01"
                      }
                      if(this.idfrecuencia == 151){
                        fecha = this.listaDetalle[i].fecha+':00Z';
                      }
                      if(this.idfrecuencia == 682){
                        fecha = this.listaDetalle[i].fecha
                      }
                      if(this.idfrecuencia == 683){
                        fecha = this.listaDetalle[i].fecha
                      }
                      if(this.idfrecuencia == 146){
                        fecha = this.listaDetalle[i].fecha
                      }
                      var   fecha1 = new Date(fecha); 
                      let objSerieTiempo = {
                        idSerieTiempoDetalle: 0,
                        idTipoFormato: 461,
                        idFlag: response1.idSerieTiempoElemento, 
                        fecha:fecha1,
                        idSerieTiempoElemento :  idSerieTiempo,
                        valor:this.cantidad_1_1[i][1],
                        flagObservacion:"Generado",
                        dia: fecha1.getDay(),
                        anio: fecha1.getFullYear(),
                        mes: fecha1.getMonth() + 1,
                        hora:
                          fecha1.getHours() +
                          ':' +
                          fecha1.getMinutes() +
                          ':' +
                          fecha1.getSeconds(),
                      };
                   
                      datosFilter.push(objSerieTiempo);


                    
                    }


                  }
                   
              
                        this.serviciosSerieTiempoService
                          .crearDetalle(datosFilter)
                          .subscribe((response) => {


                            this.toast.fire({
                              icon: 'success',
                              title: 'Se guardo la serie de tiemopo id  #' + idSerieTiempo,
                            });
                  
                  
                            window.location.reload();


                      
                                this.idSerieTiempo;
                    
                                var datosFilter1 :any =[];
                                var reques2:any = {
                                  activo : "S",
                                  codigoEaab : "",
                                  codigoIdeam  : "",
                                  fechaCreacion : "",
                                  fechaEstado: "",
                                  fechaModificacion: "",
                                  idElemento:  this.formularioConsulta.value.idElemento,
                                  idFrecuencia: this.formularioConsulta.value.frecuencia,
                                  idMecanismo:469,
                                  idParametroXElemento:this.listParametro.filter(filtro=> filtro.id == this.formularioConsulta.value.idParametro)[0].idPXE,
                                  idTipoRegistro: 464,
                                  usuarioCreacion: "",
                                  usuarioEstado: "",
                                  usuarioModificacion: "",
                                  idTipoElemento: "466",
                                  flagInsert: "",
                                  fechaInicio:  this.formularioConsulta.value.fechaInicio,
                                  fechaFin:   this.formularioConsulta.value.fechaFin,
                                };
                            
                    
                                this.serviciosSerieTiempoService
                                .crearDobleMasas(reques2)
                                .subscribe((response2) => {
                                 
                                       this.verDetalle();
                                    var idSerieTiempo1 = response2.idSerieTiempoElemento;
                                      for (let  i = 0; i <  this.cantidad_2_2.length; i++) {
                                        if(this.listaDetalle[i]){
                                          var fecha;
                                          if(this.idfrecuencia == 145){
                                            
                                          fecha = this.listaDetalle[i].fecha
                                          }
                                          if(this.idfrecuencia == 152 ){
                                            fecha = this.listaDetalle[i].fecha
                                          }
                                          if(this.idfrecuencia == 154){
                                            fecha =this.listaDetalle[i].fecha+ "/01"
                                          }
                                          if(this.idfrecuencia == 151){
                                            fecha = this.listaDetalle[i].fecha+':00Z';
                                          }
                                          if(this.idfrecuencia == 682){
                                            fecha = this.listaDetalle[i].fecha
                                          }
                                          if(this.idfrecuencia == 683){
                                            fecha = this.listaDetalle[i].fecha
                                          }
                                          if(this.idfrecuencia == 146){
                                            fecha = this.listaDetalle[i].fecha
                                          }
                    
                                         var   fecha1 = new Date(fecha); 
                                            let objSerieTiempo = {
                                              idSerieTiempoDetalle: 0,
                                              idTipoFormato: 461,
                                              idFlag: response2.idSerieTiempoElemento, 
                                              fecha:fecha1,
                                              idSerieTiempoElemento : idSerieTiempo1,
                                              valor:this.cantidad_2_2[i][1],
                                              flagObservacion:"Generado",
                                              dia: fecha1.getDay(),
                                              anio: fecha1.getFullYear(),
                                              mes: fecha1.getMonth() + 1,
                                              hora:
                                                fecha1.getHours() +
                                                ':' +
                                                fecha1.getMinutes() +
                                                ':' +
                                                fecha1.getSeconds(),
                                            };
                                         
                                            datosFilter1.push(objSerieTiempo);
                    
                    
                                          
                                          }
                    
                    
                                        }
                                         
                                    
                                              this.serviciosSerieTiempoService
                                                .crearDetalle(datosFilter1)
                                                .subscribe((response) => {

                                                  this.toast.fire({
                                                    icon: 'success',
                                                    title: 'Se guardo la serie de tiemopo id  #' + idSerieTiempo1,
                                                  });
                                        
                                        
                                        
                      

                                                  this.idSerieTiempo;
                    
                                                  var datosFilter2 :any =[];
                                                  var reques3:any = {
                                                    activo : "S",
                                                    codigoEaab : "",
                                                    codigoIdeam  : "",
                                                    fechaCreacion : "",
                                                    fechaEstado: "",
                                                    fechaModificacion: "",
                                                    idElemento:  this.formularioConsulta.value.idElemento,
                                                    idFrecuencia: this.formularioConsulta.value.frecuencia,
                                                    idMecanismo:469,
                                                    idParametroXElemento:this.listParametro.filter(filtro=> filtro.id == this.formularioConsulta.value.idParametro)[0].idPXE,
                                                    idTipoRegistro: 464,
                                                    usuarioCreacion: "",
                                                    usuarioEstado: "",
                                                    usuarioModificacion: "",
                                                    idTipoElemento: "466",
                                                    flagInsert: "",
                                                    fechaInicio:  this.formularioConsulta.value.fechaInicio,
                                                    fechaFin:   this.formularioConsulta.value.fechaFin,
                                                  };
                                              
                                      
                                                  this.serviciosSerieTiempoService
                                                  .crearDobleMasas(reques3)
                                                  .subscribe((response3) => {
                                                   
                                                         this.verDetalle();
                                                      var idSerieTiempo2 = response3.idSerieTiempoElemento;
                                                        for (let  i = 0; i <  this.cantidad_3_3.length; i++) {
                                                          if(this.listaDetalle[i]){
                                                            var fecha;
                                                            if(this.idfrecuencia == 145){
                                                              
                                                            fecha = this.listaDetalle[i].fecha
                                                            }
                                                            if(this.idfrecuencia == 152 ){
                                                              fecha = this.listaDetalle[i].fecha
                                                            }
                                                            if(this.idfrecuencia == 154){
                                                              fecha =this.listaDetalle[i].fecha+ "/01"
                                                            }
                                                            if(this.idfrecuencia == 151){
                                                              fecha = this.listaDetalle[i].fecha+':00Z';
                                                            }
                                                            if(this.idfrecuencia == 682){
                                                              fecha = this.listaDetalle[i].fecha
                                                            }
                                                            if(this.idfrecuencia == 683){
                                                              fecha = this.listaDetalle[i].fecha
                                                            }
                                                            if(this.idfrecuencia == 146){
                                                              fecha = this.listaDetalle[i].fecha
                                                            }
                                      
                                                           var   fecha1 = new Date(fecha); 
                                                              let objSerieTiempo = {
                                                                idSerieTiempoDetalle: 0,
                                                                idTipoFormato: 461,
                                                                idFlag: response2.idSerieTiempoElemento, 
                                                                fecha:fecha1,
                                                                idSerieTiempoElemento : idSerieTiempo2,
                                                                valor:this.cantidad_3_3[i][1],
                                                                flagObservacion:"Generado",
                                                                dia: fecha1.getDay(),
                                                                anio: fecha1.getFullYear(),
                                                                mes: fecha1.getMonth() + 1,
                                                                hora:
                                                                  fecha1.getHours() +
                                                                  ':' +
                                                                  fecha1.getMinutes() +
                                                                  ':' +
                                                                  fecha1.getSeconds(),
                                                              };
                                                           
                                                              datosFilter2.push(objSerieTiempo);
                                      
                                      
                                                            
                                                            }
                                      
                                                          }
                                                      
                                                           
                                                      
                                                                this.serviciosSerieTiempoService
                                                                  .crearDetalle(datosFilter2)
                                                                  .subscribe((response) => {
                                                                    this.toast.fire({
                                                                      icon: 'success',
                                                                      title: 'Se guardo la serie de tiemopo id  #' + idSerieTiempo2,
                                                                    });
                                                          
                                                                    window.location.reload();
                                                                  });
                                                              
                                                              
                                      
                                      
                                                    
                                                    
                                                  });
                                      
                                                });
                                            
                                            
                    
                    
                                  
                                  
                                });
                    
                                
                            
                         
                          
                          });


                       
              
            });


           
        
          },
          willClose: async() => {
            Swal.hideLoading();
          }
        });

       
       

       }

       if( this.listaAutocompletado.multiLista.length == 5){


        
        Swal.fire({
          title: 'Cargando información...',
          html: 'Por favor espere',
          allowOutsideClick: false, 
          showConfirmButton: false, 
          timerProgressBar: true,
          didOpen: async() => {
 
          this.idSerieTiempo;
          var datosFilter :any =[];
            var reques1:any = {
              activo : "S",
              codigoEaab : "",
              codigoIdeam  : "",
              fechaCreacion : "",
              fechaEstado: "",
              fechaModificacion: "",
              idElemento:  this.formularioConsulta.value.idElemento,
              idFrecuencia: this.formularioConsulta.value.frecuencia,
              idMecanismo:469,
              idParametroXElemento:this.listParametro.filter(filtro=> filtro.id == this.formularioConsulta.value.idParametro)[0].idPXE,
              idTipoRegistro: 464,
              usuarioCreacion: "",
              usuarioEstado: "",
              usuarioModificacion: "",
              idTipoElemento: "466",
              flagInsert: "",
              fechaInicio:  this.formularioConsulta.value.fechaInicio,
              fechaFin:   this.formularioConsulta.value.fechaFin,
            };
        

            this.serviciosSerieTiempoService
            .crearDobleMasas(reques1)
            .subscribe((response1) => {
        
                 
              var idSerieTiempo = response1.idSerieTiempoElemento;
                  for (let  i = 0; i <  this.cantidad_1_1.length; i++) {
                    if(this.listaDetalle[i]){
                      var fecha;
                      if(this.idfrecuencia == 145){
                        
                      fecha = this.listaDetalle[i].fecha
                      }
                      if(this.idfrecuencia == 152 ){
                        fecha = this.listaDetalle[i].fecha
                      }
                      if(this.idfrecuencia == 154){
                        fecha =this.listaDetalle[i].fecha+ "/01"
                      }
                      if(this.idfrecuencia == 151){
                        fecha = this.listaDetalle[i].fecha+':00Z';
                      }
                      if(this.idfrecuencia == 682){
                        fecha = this.listaDetalle[i].fecha
                      }
                      if(this.idfrecuencia == 683){
                        fecha = this.listaDetalle[i].fecha
                      }
                      if(this.idfrecuencia == 146){
                        fecha = this.listaDetalle[i].fecha
                      }
                      var   fecha1 = new Date(fecha); 
                      let objSerieTiempo = {
                        idSerieTiempoDetalle: 0,
                        idTipoFormato: 461,
                        idFlag: response1.idSerieTiempoElemento, 
                        fecha:fecha1,
                        idSerieTiempoElemento :  idSerieTiempo,
                        valor:this.cantidad_1_1[i][1],
                        flagObservacion:"Generado",
                        dia: fecha1.getDay(),
                        anio: fecha1.getFullYear(),
                        mes: fecha1.getMonth() + 1,
                        hora:
                          fecha1.getHours() +
                          ':' +
                          fecha1.getMinutes() +
                          ':' +
                          fecha1.getSeconds(),
                      };
                   
                      datosFilter.push(objSerieTiempo);


                    
                    }

                  }
              
                   
              
                        this.serviciosSerieTiempoService
                          .crearDetalle(datosFilter)
                          .subscribe((response) => {


                            this.toast.fire({
                              icon: 'success',
                              title: 'Se guardo la serie de tiemopo id  #' + idSerieTiempo,
                            });


                      
                                this.idSerieTiempo;
                    
                                var datosFilter1 :any =[];
                                var reques2:any = {
                                  activo : "S",
                                  codigoEaab : "",
                                  codigoIdeam  : "",
                                  fechaCreacion : "",
                                  fechaEstado: "",
                                  fechaModificacion: "",
                                  idElemento:  this.formularioConsulta.value.idElemento,
                                  idFrecuencia: this.formularioConsulta.value.frecuencia,
                                  idMecanismo:469,
                                  idParametroXElemento:this.listParametro.filter(filtro=> filtro.id == this.formularioConsulta.value.idParametro)[0].idPXE,
                                  idTipoRegistro: 464,
                                  usuarioCreacion: "",
                                  usuarioEstado: "",
                                  usuarioModificacion: "",
                                  idTipoElemento: "466",
                                  flagInsert: "",
                                  fechaInicio:  this.formularioConsulta.value.fechaInicio,
                                  fechaFin:   this.formularioConsulta.value.fechaFin,
                                };
                            
                    
                                this.serviciosSerieTiempoService
                                .crearDobleMasas(reques2)
                                .subscribe((response2) => {
                                 
                                       this.verDetalle();
                                    var idSerieTiempo1 = response2.idSerieTiempoElemento;
                                      for (let  i = 0; i <  this.cantidad_2_2.length; i++) {
                                        if(this.listaDetalle[i]){
                                          var fecha;
                                          if(this.idfrecuencia == 145){
                                            
                                          fecha = this.listaDetalle[i].fecha
                                          }
                                          if(this.idfrecuencia == 152 ){
                                            fecha = this.listaDetalle[i].fecha
                                          }
                                          if(this.idfrecuencia == 154){
                                            fecha =this.listaDetalle[i].fecha+ "/01"
                                          }
                                          if(this.idfrecuencia == 151){
                                               fecha = this.listaDetalle[i].fecha+':00Z';
                                          }
                                          if(this.idfrecuencia == 682){
                                            fecha = this.listaDetalle[i].fecha
                                          }
                                          if(this.idfrecuencia == 683){
                                            fecha = this.listaDetalle[i].fecha
                                          }
                                          if(this.idfrecuencia == 146){
                                            fecha = this.listaDetalle[i].fecha
                                          }
                    
                                         var   fecha1 = new Date(fecha); 
                                            let objSerieTiempo = {
                                              idSerieTiempoDetalle: 0,
                                              idTipoFormato: 461,
                                              idFlag: response2.idSerieTiempoElemento, 
                                              fecha:fecha1,
                                              idSerieTiempoElemento : idSerieTiempo1,
                                              valor:this.cantidad_2_2[i][1],
                                              flagObservacion:"Generado",
                                              dia: fecha1.getDay(),
                                              anio: fecha1.getFullYear(),
                                              mes: fecha1.getMonth() + 1,
                                              hora:
                                                fecha1.getHours() +
                                                ':' +
                                                fecha1.getMinutes() +
                                                ':' +
                                                fecha1.getSeconds(),
                                            };
                                         
                                            datosFilter1.push(objSerieTiempo);
                    
                    
                                          
                                          }
                    
                                        }
                                    
                                         
                                    
                                              this.serviciosSerieTiempoService
                                                .crearDetalle(datosFilter1)
                                                .subscribe((response) => {


                                                  this.toast.fire({
                                                    icon: 'success',
                                                    title: 'Se guardo la serie de tiemopo id  #' + idSerieTiempo1,
                                                  });
                                                  
                                                  this.idSerieTiempo;
                    
                                                  var datosFilter2 :any =[];
                                                  var reques3:any = {
                                                    activo : "S",
                                                    codigoEaab : "",
                                                    codigoIdeam  : "",
                                                    fechaCreacion : "",
                                                    fechaEstado: "",
                                                    fechaModificacion: "",
                                                    idElemento:  this.formularioConsulta.value.idElemento,
                                                    idFrecuencia: this.formularioConsulta.value.frecuencia,
                                                    idMecanismo:469,
                                                    idParametroXElemento:this.listParametro.filter(filtro=> filtro.id == this.formularioConsulta.value.idParametro)[0].idPXE,
                                                    idTipoRegistro: 464,
                                                    usuarioCreacion: "",
                                                    usuarioEstado: "",
                                                    usuarioModificacion: "",
                                                    idTipoElemento: "466",
                                                    flagInsert: "",
                                                    fechaInicio:  this.formularioConsulta.value.fechaInicio,
                                                    fechaFin:   this.formularioConsulta.value.fechaFin,
                                                  };
                                              
                                      
                                                  this.serviciosSerieTiempoService
                                                  .crearDobleMasas(reques3)
                                                  .subscribe((response3) => {
                                                   
                                                         this.verDetalle();
                                                      var idSerieTiempo2 = response3.idSerieTiempoElemento;
                                                        for (let  i = 0; i <  this.cantidad_3_3.length; i++) {
                                                          if(this.listaDetalle[i]){
                                                            var fecha;
                                                            if(this.idfrecuencia == 145){
                                                              
                                                            fecha = this.listaDetalle[i].fecha
                                                            }
                                                            if(this.idfrecuencia == 152 ){
                                                              fecha = this.listaDetalle[i].fecha
                                                            }
                                                            if(this.idfrecuencia == 154){
                                                              fecha =this.listaDetalle[i].fecha+ "/01"
                                                            }
                                                            if(this.idfrecuencia == 151){
                                                              fecha = this.listaDetalle[i].fecha+':00Z';
                                                            }
                                                            if(this.idfrecuencia == 682){
                                                              fecha = this.listaDetalle[i].fecha
                                                            }
                                                            if(this.idfrecuencia == 683){
                                                              fecha = this.listaDetalle[i].fecha
                                                            }
                                                            if(this.idfrecuencia == 146){
                                                              fecha = this.listaDetalle[i].fecha
                                                            }
                                      
                                                           var   fecha1 = new Date(fecha); 
                                                              let objSerieTiempo = {
                                                                idSerieTiempoDetalle: 0,
                                                                idTipoFormato: 461,
                                                                idFlag: response2.idSerieTiempoElemento, 
                                                                fecha:fecha1,
                                                                idSerieTiempoElemento : idSerieTiempo2,
                                                                valor:this.cantidad_3_3[i][1],
                                                                flagObservacion:"Generado",
                                                                dia: fecha1.getDay(),
                                                                anio: fecha1.getFullYear(),
                                                                mes: fecha1.getMonth() + 1,
                                                                hora:
                                                                  fecha1.getHours() +
                                                                  ':' +
                                                                  fecha1.getMinutes() +
                                                                  ':' +
                                                                  fecha1.getSeconds(),
                                                              };
                                                           
                                                              datosFilter2.push(objSerieTiempo);
                                      
                                      
                                                            
                                                            }
                                      
                                      
                                                      
                                                          }
                                                      
                                                                this.serviciosSerieTiempoService
                                                                  .crearDetalle(datosFilter2)
                                                                  .subscribe((response) => {


                                                                    this.toast.fire({
                                                                      icon: 'success',
                                                                      title: 'Se guardo la serie de tiemopo id  #' + idSerieTiempo2,
                                                                    }); 


                                                                    this.idSerieTiempo;
                    
                                                                    var datosFilter3 :any =[];
                                                                    var reques4:any = {
                                                                      activo : "S",
                                                                      codigoEaab : "",
                                                                      codigoIdeam  : "",
                                                                      fechaCreacion : "",
                                                                      fechaEstado: "",
                                                                      fechaModificacion: "",
                                                                      idElemento:  this.formularioConsulta.value.idElemento,
                                                                      idFrecuencia: this.formularioConsulta.value.frecuencia,
                                                                      idMecanismo:469,
                                                                      idParametroXElemento:this.listParametro.filter(filtro=> filtro.id == this.formularioConsulta.value.idParametro)[0].idPXE,
                                                                      idTipoRegistro: 464,
                                                                      usuarioCreacion: "",
                                                                      usuarioEstado: "",
                                                                      usuarioModificacion: "",
                                                                      idTipoElemento: "466",
                                                                      flagInsert: "",
                                                                      fechaInicio:  this.formularioConsulta.value.fechaInicio,
                                                                      fechaFin:   this.formularioConsulta.value.fechaFin,
                                                                    };
                                                                
                                                        
                                                                    this.serviciosSerieTiempoService
                                                                    .crearDobleMasas(reques4)
                                                                    .subscribe((response4) => {
                                                                     
                                                                           this.verDetalle();
                                                                        var idSerieTiempo4 = response4.idSerieTiempoElemento;
                                                                          for (let  i = 0; i <  this.cantidad_4_4.length; i++) {
                                                                            if(this.listaDetalle[i]){
                                                                              var fecha;
                                                                              if(this.idfrecuencia == 145){
                                                                                
                                                                              fecha = this.listaDetalle[i].fecha
                                                                              }
                                                                              if(this.idfrecuencia == 152 ){
                                                                                fecha = this.listaDetalle[i].fecha
                                                                              }
                                                                              if(this.idfrecuencia == 154){
                                                                                fecha =this.listaDetalle[i].fecha+ "/01"
                                                                              }
                                                                              if(this.idfrecuencia == 151){
                                                                                fecha = this.listaDetalle[i].fecha+':00Z';
                                                                              }
                                                                              if(this.idfrecuencia == 682){
                                                                                fecha = this.listaDetalle[i].fecha
                                                                              }
                                                                              if(this.idfrecuencia == 683){
                                                                                fecha = this.listaDetalle[i].fecha
                                                                              }
                                                                              if(this.idfrecuencia == 146){
                                                                                fecha = this.listaDetalle[i].fecha
                                                                              }
                                                        
                                                                             var   fecha1 = new Date(fecha); 
                                                                                let objSerieTiempo = {
                                                                                  idSerieTiempoDetalle: 0,
                                                                                  idTipoFormato: 461,
                                                                                  idFlag: response2.idSerieTiempoElemento, 
                                                                                  fecha:fecha1,
                                                                                  idSerieTiempoElemento : idSerieTiempo4,
                                                                                  valor:this.cantidad_4_4[i][1],
                                                                                  flagObservacion:"Generado",
                                                                                  dia: fecha1.getDay(),
                                                                                  anio: fecha1.getFullYear(),
                                                                                  mes: fecha1.getMonth() + 1,
                                                                                  hora:
                                                                                    fecha1.getHours() +
                                                                                    ':' +
                                                                                    fecha1.getMinutes() +
                                                                                    ':' +
                                                                                    fecha1.getSeconds(),
                                                                                };
                                                                             
                                                                                datosFilter3.push(objSerieTiempo);
                                                        
                                                        
                                                                              
                                                                              }
                                                        
                                                        
                                                                        
                                                                            }
                                                                        
                                                                                  this.serviciosSerieTiempoService
                                                                                    .crearDetalle(datosFilter3)
                                                                                    .subscribe((response) => {
                                                                                      this.toast.fire({
                                                                                        icon: 'success',
                                                                                        title: 'Se guardo la serie de tiemopo id  #' + idSerieTiempo4,
                                                                                      }); 
                                                                            
                                                                                      window.location.reload();  });
                                                                                
                                                                                
                                                        
                                                        
                                                                      
                                                                      
                                                                    });
                                                                  });
                                                              
                                                              
                                      
                                      
                                                    
                                                    
                                                  });
                                      
                                                });
                                            
                                            
                    
                    
                                  
                                  
                                });
                    
                                
                            
                         
                          
                          });


                       
              
            });


           
        
          },
          willClose: async() => {
            Swal.hideLoading();
          }
        });

       
       

       }


       if( this.listaAutocompletado.multiLista.length == 6){


        
        Swal.fire({
          title: 'Cargando información...',
          html: 'Por favor espere',
          allowOutsideClick: false, 
          showConfirmButton: false, 
          timerProgressBar: true,
          didOpen: async() => {
 
          this.idSerieTiempo;
          var datosFilter :any =[];
            var reques1:any = {
              activo : "S",
              codigoEaab : "",
              codigoIdeam  : "",
              fechaCreacion : "",
              fechaEstado: "",
              fechaModificacion: "",
              idElemento:  this.formularioConsulta.value.idElemento,
              idFrecuencia: this.formularioConsulta.value.frecuencia,
              idMecanismo:469,
              idParametroXElemento:this.listParametro.filter(filtro=> filtro.id == this.formularioConsulta.value.idParametro)[0].idPXE,
              idTipoRegistro: 464,
              usuarioCreacion: "",
              usuarioEstado: "",
              usuarioModificacion: "",
              idTipoElemento: "466",
              flagInsert: "",
              fechaInicio:  this.formularioConsulta.value.fechaInicio,
              fechaFin:   this.formularioConsulta.value.fechaFin,
            };
        

            this.serviciosSerieTiempoService
            .crearDobleMasas(reques1)
            .subscribe((response1) => {
        
                 
              var idSerieTiempo = response1.idSerieTiempoElemento;
                  for (let  i = 0; i <  this.cantidad_1_1.length; i++) {
             
                      var fecha;
                      if(this.idfrecuencia == 145){
                        
                      fecha = this.listaDetalle[i].fecha
                      }
                      if(this.idfrecuencia == 152 ){
                        fecha = this.listaDetalle[i].fecha
                      }
                      if(this.idfrecuencia == 154){
                        fecha =this.listaDetalle[i].fecha+ "/01"
                      }
                      if(this.idfrecuencia == 151){
                        fecha = this.listaDetalle[i].fecha+':00Z';
                      }
                      if(this.idfrecuencia == 682){
                        fecha = this.listaDetalle[i].fecha
                      }
                      if(this.idfrecuencia == 683){
                        fecha = this.listaDetalle[i].fecha
                      }
                      if(this.idfrecuencia == 146){
                        fecha = this.listaDetalle[i].fecha
                      }
                      var   fecha1 = new Date(fecha); 
                      let objSerieTiempo = {
                        idSerieTiempoDetalle: 0,
                        idTipoFormato: 461,
                        idFlag: response1.idSerieTiempoElemento, 
                        fecha:fecha1,
                        idSerieTiempoElemento :  idSerieTiempo,
                        valor:this.cantidad_1_1[i][1],
                        flagObservacion:"Generado",
                        dia: fecha1.getDay(),
                        anio: fecha1.getFullYear(),
                        mes: fecha1.getMonth() + 1,
                        hora:
                          fecha1.getHours() +
                          ':' +
                          fecha1.getMinutes() +
                          ':' +
                          fecha1.getSeconds(),
                      };
                   
                      datosFilter.push(objSerieTiempo);


                    
                    }


              
                   
              
                        this.serviciosSerieTiempoService
                          .crearDetalle(datosFilter)
                          .subscribe((response) => {


                            this.toast.fire({
                              icon: 'success',
                              title: 'Se guardo la serie de tiemopo id  #' + idSerieTiempo,
                            }); 


                      
                                this.idSerieTiempo;
                    
                                var datosFilter1 :any =[];
                                var reques2:any = {
                                  activo : "S",
                                  codigoEaab : "",
                                  codigoIdeam  : "",
                                  fechaCreacion : "",
                                  fechaEstado: "",
                                  fechaModificacion: "",
                                  idElemento:  this.formularioConsulta.value.idElemento,
                                  idFrecuencia: this.formularioConsulta.value.frecuencia,
                                  idMecanismo:469,
                                  idParametroXElemento:this.listParametro.filter(filtro=> filtro.id == this.formularioConsulta.value.idParametro)[0].idPXE,
                                  idTipoRegistro: 464,
                                  usuarioCreacion: "",
                                  usuarioEstado: "",
                                  usuarioModificacion: "",
                                  idTipoElemento: "466",
                                  flagInsert: "",
                                  fechaInicio:  this.formularioConsulta.value.fechaInicio,
                                  fechaFin:   this.formularioConsulta.value.fechaFin,
                                };
                            
                    
                                this.serviciosSerieTiempoService
                                .crearDobleMasas(reques2)
                                .subscribe((response2) => {
                            
                                    var idSerieTiempo1 = response2.idSerieTiempoElemento;
                                      for (let  i = 0; i <  this.cantidad_2_2.length; i++) {
                                 
                                          var fecha;
                                          if(this.idfrecuencia == 145){
                                            
                                          fecha = this.listaDetalle[i].fecha
                                          }
                                          if(this.idfrecuencia == 152 ){
                                            fecha = this.listaDetalle[i].fecha
                                          }
                                          if(this.idfrecuencia == 154){
                                            fecha =this.listaDetalle[i].fecha+ "/01"
                                          }
                                          if(this.idfrecuencia == 151){
                                            fecha = this.listaDetalle[i].fecha+':00Z';
                                          }
                                          if(this.idfrecuencia == 682){
                                            fecha = this.listaDetalle[i].fecha
                                          }
                                          if(this.idfrecuencia == 683){
                                            fecha = this.listaDetalle[i].fecha
                                          }
                                          if(this.idfrecuencia == 146){
                                            fecha = this.listaDetalle[i].fecha
                                          }
                    
                                         var   fecha1 = new Date(fecha); 
                                            let objSerieTiempo = {
                                              idSerieTiempoDetalle: 0,
                                              idTipoFormato: 461,
                                              idFlag: response2.idSerieTiempoElemento, 
                                              fecha:fecha1,
                                              idSerieTiempoElemento : idSerieTiempo1,
                                              valor:this.cantidad_2_2[i][1],
                                              flagObservacion:"Generado",
                                              dia: fecha1.getDay(),
                                              anio: fecha1.getFullYear(),
                                              mes: fecha1.getMonth() + 1,
                                              hora:
                                                fecha1.getHours() +
                                                ':' +
                                                fecha1.getMinutes() +
                                                ':' +
                                                fecha1.getSeconds(),
                                            };
                                         
                                            datosFilter1.push(objSerieTiempo);
                    
                    
                                          
                                          }
                    
                    
                                    
                                         
                                    
                                              this.serviciosSerieTiempoService
                                                .crearDetalle(datosFilter1)
                                                .subscribe((response) => {

                                                  this.toast.fire({
                                                    icon: 'success',
                                                    title: 'Se guardo la serie de tiemopo id  #' + idSerieTiempo1,
                                                  }); 
                                                  this.idSerieTiempo;
                    
                                                  var datosFilter3 :any =[];
                                                  var reques3:any = {
                                                    activo : "S",
                                                    codigoEaab : "",
                                                    codigoIdeam  : "",
                                                    fechaCreacion : "",
                                                    fechaEstado: "",
                                                    fechaModificacion: "",
                                                    idElemento:  this.formularioConsulta.value.idElemento,
                                                    idFrecuencia: this.formularioConsulta.value.frecuencia,
                                                    idMecanismo:469,
                                                    idParametroXElemento:this.listParametro.filter(filtro=> filtro.id == this.formularioConsulta.value.idParametro)[0].idPXE,
                                                    idTipoRegistro: 464,
                                                    usuarioCreacion: "",
                                                    usuarioEstado: "",
                                                    usuarioModificacion: "",
                                                    idTipoElemento: "466",
                                                    flagInsert: "",
                                                    fechaInicio:  this.formularioConsulta.value.fechaInicio,
                                                    fechaFin:   this.formularioConsulta.value.fechaFin,
                                                  };
                                              
                                      
                                                  this.serviciosSerieTiempoService
                                                  .crearDobleMasas(reques3)
                                                  .subscribe((response3) => {
                                                   
                                                         this.verDetalle();
                                                      var idSerieTiempo3 = response3.idSerieTiempoElemento;
                                                        for (let  i = 0; i <  this.cantidad_3_3.length; i++) {
                                                   
                                                            var fecha;
                                                            if(this.idfrecuencia == 145){
                                                              
                                                            fecha = this.listaDetalle[i].fecha
                                                            }
                                                            if(this.idfrecuencia == 152 ){
                                                              fecha = this.listaDetalle[i].fecha
                                                            }
                                                            if(this.idfrecuencia == 154){
                                                              fecha =this.listaDetalle[i].fecha+ "/01"
                                                            }
                                                            if(this.idfrecuencia == 151){
                                                              fecha = this.listaDetalle[i].fecha+':00Z';
                                                           }
                                                            if(this.idfrecuencia == 682){
                                                              fecha = this.listaDetalle[i].fecha
                                                            }
                                                            if(this.idfrecuencia == 683){
                                                              fecha = this.listaDetalle[i].fecha
                                                            }
                                                            if(this.idfrecuencia == 146){
                                                              fecha = this.listaDetalle[i].fecha
                                                            }
                                      
                                                           var   fecha1 = new Date(fecha); 
                                                              let objSerieTiempo = {
                                                                idSerieTiempoDetalle: 0,
                                                                idTipoFormato: 461,
                                                                idFlag: response2.idSerieTiempoElemento, 
                                                                fecha:fecha1,
                                                                idSerieTiempoElemento : idSerieTiempo3,
                                                                valor:this.cantidad_3_3[i][1],
                                                                flagObservacion:"Generado",
                                                                dia: fecha1.getDay(),
                                                                anio: fecha1.getFullYear(),
                                                                mes: fecha1.getMonth() + 1,
                                                                hora:
                                                                  fecha1.getHours() +
                                                                  ':' +
                                                                  fecha1.getMinutes() +
                                                                  ':' +
                                                                  fecha1.getSeconds(),
                                                              };
                                                           
                                                              datosFilter3.push(objSerieTiempo);
                                      
                                      
                                                            
                                                            }
                                      
                                      
                                                      
                                                           
                                                      
                                                                this.serviciosSerieTiempoService
                                                                  .crearDetalle(datosFilter3)
                                                                  .subscribe((response) => {

                                                                    this.toast.fire({
                                                                      icon: 'success',
                                                                      title: 'Se guardo la serie de tiemopo id  #' + idSerieTiempo3,
                                                                    }); 
                                                                    this.idSerieTiempo;
                    
                                                                    var datosFilter4 :any =[];
                                                                    var reques4:any = {
                                                                      activo : "S",
                                                                      codigoEaab : "",
                                                                      codigoIdeam  : "",
                                                                      fechaCreacion : "",
                                                                      fechaEstado: "",
                                                                      fechaModificacion: "",
                                                                      idElemento:  this.formularioConsulta.value.idElemento,
                                                                      idFrecuencia: this.formularioConsulta.value.frecuencia,
                                                                      idMecanismo:469,
                                                                      idParametroXElemento:this.listParametro.filter(filtro=> filtro.id == this.formularioConsulta.value.idParametro)[0].idPXE,
                                                                      idTipoRegistro: 464,
                                                                      usuarioCreacion: "",
                                                                      usuarioEstado: "",
                                                                      usuarioModificacion: "",
                                                                      idTipoElemento: "466",
                                                                      flagInsert: "",
                                                                      fechaInicio:  this.formularioConsulta.value.fechaInicio,
                                                                      fechaFin:   this.formularioConsulta.value.fechaFin,
                                                                    };
                                                                
                                                        
                                                                    this.serviciosSerieTiempoService
                                                                    .crearDobleMasas(reques4)
                                                                    .subscribe((response4) => {
                                                                     
                                                                           this.verDetalle();
                                                                        var idSerieTiempo4 = response4.idSerieTiempoElemento;
                                                                          for (let  i = 0; i <  this.cantidad_4_4.length; i++) {
                                                                     
                                                                              var fecha;
                                                                              if(this.idfrecuencia == 145){
                                                                                
                                                                              fecha = this.listaDetalle[i].fecha
                                                                              }
                                                                              if(this.idfrecuencia == 152 ){
                                                                                fecha = this.listaDetalle[i].fecha
                                                                              }
                                                                              if(this.idfrecuencia == 154){
                                                                                fecha =this.listaDetalle[i].fecha+ "/01"
                                                                              }
                                                                              if(this.idfrecuencia == 151){
                                                                                fecha = this.listaDetalle[i].fecha+':00Z';
                                                                              }
                                                                              if(this.idfrecuencia == 682){
                                                                                fecha = this.listaDetalle[i].fecha
                                                                              }
                                                                              if(this.idfrecuencia == 683){
                                                                                fecha = this.listaDetalle[i].fecha
                                                                              }
                                                                              if(this.idfrecuencia == 146){
                                                                                fecha = this.listaDetalle[i].fecha
                                                                              }
                                                        
                                                                             var   fecha1 = new Date(fecha); 
                                                                                let objSerieTiempo = {
                                                                                  idSerieTiempoDetalle: 0,
                                                                                  idTipoFormato: 461,
                                                                                  idFlag: response4.idSerieTiempoElemento, 
                                                                                  fecha:fecha1,
                                                                                  idSerieTiempoElemento : idSerieTiempo4,
                                                                                  valor:this.cantidad_4_4[i][1],
                                                                                  flagObservacion:"Generado",
                                                                                  dia: fecha1.getDay(),
                                                                                  anio: fecha1.getFullYear(),
                                                                                  mes: fecha1.getMonth() + 1,
                                                                                  hora:
                                                                                    fecha1.getHours() +
                                                                                    ':' +
                                                                                    fecha1.getMinutes() +
                                                                                    ':' +
                                                                                    fecha1.getSeconds(),
                                                                                };
                                                                             
                                                                                datosFilter4.push(objSerieTiempo);
                                                        
                                                        
                                                                              
                                                                              }
                                                        
                                                        
                                                                        
                                                                             
                                                                        
                                                                                  this.serviciosSerieTiempoService
                                                                                    .crearDetalle(datosFilter4)
                                                                                    .subscribe((response) => {


                                                                                      this.toast.fire({
                                                                                        icon: 'success',
                                                                                        title: 'Se guardo la serie de tiemopo id  #' + idSerieTiempo4,
                                                                                      });   


                                                                                      this.idSerieTiempo;
                    
                                                                                      var datosFilter5 :any =[];
                                                                                      var reques5:any = {
                                                                                        activo : "S",
                                                                                        codigoEaab : "",
                                                                                        codigoIdeam  : "",
                                                                                        fechaCreacion : "",
                                                                                        fechaEstado: "",
                                                                                        fechaModificacion: "",
                                                                                        idElemento:  this.formularioConsulta.value.idElemento,
                                                                                        idFrecuencia: this.formularioConsulta.value.frecuencia,
                                                                                        idMecanismo:469,
                                                                                        idParametroXElemento:this.listParametro.filter(filtro=> filtro.id == this.formularioConsulta.value.idParametro)[0].idPXE,
                                                                                        idTipoRegistro: 464,
                                                                                        usuarioCreacion: "",
                                                                                        usuarioEstado: "",
                                                                                        usuarioModificacion: "",
                                                                                        idTipoElemento: "466",
                                                                                        flagInsert: "",
                                                                                        fechaInicio:  this.formularioConsulta.value.fechaInicio,
                                                                                        fechaFin:   this.formularioConsulta.value.fechaFin,
                                                                                      };
                                                                                  
                                                                          
                                                                                      this.serviciosSerieTiempoService
                                                                                      .crearDobleMasas(reques5)
                                                                                      .subscribe((response5) => {
                                                                                       
                                                                                             this.verDetalle();
                                                                                          var idSerieTiempo5 = response5.idSerieTiempoElemento;
                                                                                            for (let  i = 0; i <  this.cantidad_5_5.length; i++) {
                                                                                       
                                                                                                var fecha;
                                                                                                if(this.idfrecuencia == 145){
                                                                                                  
                                                                                                fecha = this.listaDetalle[i].fecha
                                                                                                }
                                                                                                if(this.idfrecuencia == 152 ){
                                                                                                  fecha = this.listaDetalle[i].fecha
                                                                                                }
                                                                                                if(this.idfrecuencia == 154){
                                                                                                  fecha =this.listaDetalle[i].fecha+ "/01"
                                                                                                }
                                                                                                if(this.idfrecuencia == 151){
                                                                                                  fecha = this.listaDetalle[i].fecha+':00Z';
                                                                                                }
                                                                                                if(this.idfrecuencia == 682){
                                                                                                  fecha = this.listaDetalle[i].fecha
                                                                                                }
                                                                                                if(this.idfrecuencia == 683){
                                                                                                  fecha = this.listaDetalle[i].fecha
                                                                                                }
                                                                                                if(this.idfrecuencia == 146){
                                                                                                  fecha = this.listaDetalle[i].fecha
                                                                                                }
                                                                          
                                                                                               var   fecha1 = new Date(fecha); 
                                                                                                  let objSerieTiempo = {
                                                                                                    idSerieTiempoDetalle: 0,
                                                                                                    idTipoFormato: 461,
                                                                                                    idFlag: response5.idSerieTiempoElemento, 
                                                                                                    fecha:fecha1,
                                                                                                    idSerieTiempoElemento : idSerieTiempo5,
                                                                                                    valor:this.cantidad_5_5[i][1],
                                                                                                    flagObservacion:"Generado",
                                                                                                    dia: fecha1.getDay(),
                                                                                                    anio: fecha1.getFullYear(),
                                                                                                    mes: fecha1.getMonth() + 1,
                                                                                                    hora:
                                                                                                      fecha1.getHours() +
                                                                                                      ':' +
                                                                                                      fecha1.getMinutes() +
                                                                                                      ':' +
                                                                                                      fecha1.getSeconds(),
                                                                                                  };
                                                                                               
                                                                                                  datosFilter5.push(objSerieTiempo);
                                                                          
                                                                          
                                                                                                
                                                                                                }
                                                                          
                                                                          
                                                                                          
                                                                                               
                                                                                          
                                                                                                    this.serviciosSerieTiempoService
                                                                                                      .crearDetalle(datosFilter5)
                                                                                                      .subscribe((response) => {
                                                                                                        this.toast.fire({
                                                                                                          icon: 'success',
                                                                                                          title: 'Se guardo la serie de tiemopo id  #' +idSerieTiempo5,
                                                                                                        });
                                                                                              
                                                                                                        window.location.reload();
                                                                                                      });
                                                                                                  
                                                                                                  
                                                                          
                                                                          
                                                                                        
                                                                                        
                                                                                      });
                                                                                    });
                                                                                
                                                                                
                                                        
                                                        
                                                                      
                                                                      
                                                                    });
                                                                  });
                                                              
                                                              
                                      
                                      
                                                    
                                                    
                                                  });
                                      
                                                });
                                            
                                            
                    
                    
                                  
                                  
                                });
                    
                                
                            
                         
                          
                          });


                       
              
            });


           
        
          },
          willClose: async() => {
            Swal.hideLoading();
          }
        });

       
       

       }
     
  
  
}


accionRegistroColumnas(e: any) {
  switch (e.accion) {
    case accionesTablasEnum.Eliminar: {
      var listaFinal = this.listaDetalle;
      var cars = listaFinal.filter(function(car:any) {
        return car.fecha !== e.registro.fecha; 
      });
      this.listaDetalle = [];
      this.listaDetalle = cars;

      var listaF:any = this.chartOptions1.series;
      var serie:any = [];
      var serie1:any = [];
      var serie2:any = [];
      var serie3:any = [];
      var serie4:any = [];
      var serie5:any = [];



      switch ( this.chartOptions1.series?.length) {

        // Estaciones
        case 2: {
          
          serie  = listaF[0]['data'].filter(function(car1:any) {
            return car1 !== e.registro.valorOrigen; 
          });
          serie1  = listaF[1]['data'].filter(function(car1:any) {
            return car1 !== e.registro.valor1; 
          });
      
          console.log(e.registro, listaF,serie,serie1);
          var series:any =[]
          series.push( 
            {  type: 'column',
               name:listaF[0]['name'],
              data:serie,
            },
            {  type: 'column',
               name:listaF[1]['name'],
              data:serie1,
            }
          );
          break;
        }
  
        // Embalses
        case 3: {
          serie  = listaF[0]['data'].filter(function(car1:any) {
            return car1 !== e.registro.valorOrigen; 
          });
          serie1  = listaF[1]['data'].filter(function(car1:any) {
            return car1 !== e.registro.valor1; 
          });
          serie2  = listaF[2]['data'].filter(function(car1:any) {
            return car1 !== e.registro.valor2; 
          })
      
          var series:any =[]
          series.push( 
            {  type: 'column',
               name:listaF[0]['name'],
              data:serie,
            },
            {  type: 'column',
               name:listaF[1]['name'],
              data:serie1,
            },
            {  type: 'column',
            name:listaF[2]['name'],
           data:serie2,
         }
          );
          break;
        }
  
        // Pozos
        case 4: {
          serie  = listaF[0]['data'].filter(function(car1:any) {
            return car1 !== e.registro.valorOrigen; 
          });
          serie1  = listaF[1]['data'].filter(function(car1:any) {
            return car1 !== e.registro.valor1; 
          });
          serie2  = listaF[2]['data'].filter(function(car1:any) {
            return car1 !== e.registro.valor2; 
          })
          serie3  = listaF[3]['data'].filter(function(car1:any) {
            return car1 !== e.registro.valor3; 
          })
          console.log(33,e.registro,serie,serie1,serie2,serie3);
          var series:any =[]
          series.push( 
            {  type: 'column',
               name:listaF[0]['name'],
              data:serie,
            },
            {  type: 'column',
               name:listaF[1]['name'],
              data:serie1,
            },
             {  type: 'column',
                name:listaF[2]['name'],
              data:serie2,
            },
            {  type: 'column',
            name:listaF[3]['name'],
           data:serie3,
         }
          );


          break;
        }

          case 5: {


          serie  = listaF[0]['data'].filter(function(car1:any) {
            return car1 !== e.registro.valorOrigen; 
          });
          serie1  = listaF[1]['data'].filter(function(car1:any) {
            return car1 !== e.registro.valor1; 
          });
          serie2  = listaF[2]['data'].filter(function(car1:any) {
            return car1 !== e.registro.valor2; 
          })
          serie3  = listaF[3]['data'].filter(function(car1:any) {
            return car1 !== e.registro.valor2; 
          })
          serie4  = listaF[4]['data'].filter(function(car1:any) {
            return car1 !== e.registro.valor4; 
          })
          console.log(33,e.registro,serie,serie1,serie2,serie3,serie4);
          var series:any =[]
          series.push( 
            {  type: 'column',
               name:listaF[0]['name'],
              data:serie,
            },
            {  type: 'column',
               name:listaF[1]['name'],
              data:serie1,
            },
             {  type: 'column',
                name:listaF[2]['name'],
              data:serie2,
            },
            {  type: 'column',
                name:listaF[3]['name'],
              data:serie3,
            },
            {  type: 'column',
            name:listaF[4]['name'],
           data:serie4,
         }
          );


          break;
        }

        case 6: {
          serie  = listaF[0]['data'].filter(function(car1:any) {
            return car1 !== e.registro.valorOrigen; 
          });
          serie1  = listaF[1]['data'].filter(function(car1:any) {
            return car1 !== e.registro.valor1; 
          });
          serie2  = listaF[2]['data'].filter(function(car1:any) {
            return car1 !== e.registro.valor2; 
          })
          serie3  = listaF[3]['data'].filter(function(car1:any) {
            return car1 !== e.registro.valor2; 
          })
          serie4  = listaF[4]['data'].filter(function(car1:any) {
            return car1 !== e.registro.valor4; 
          })
          serie5 = listaF[5]['data'].filter(function(car1:any) {
            return car1 !== e.registro.valor5; 
          })
          console.log(33,e.registro,serie,serie1,serie2,serie3);
          var series:any =[]
          series.push( 
            {  type: 'column',
               name:listaF[0]['name'],
              data:serie,
            },
            {  type: 'column',
               name:listaF[1]['name'],
              data:serie1,
            },
             {  type: 'column',
                name:listaF[2]['name'],
              data:serie2,
            },
            {  type: 'column',
                name:listaF[3]['name'],
              data:serie3,
            },
            {  type: 'column',
            name:listaF[4]['name'],
           data:serie4,
              },
              {  type: 'column',
              name:listaF[5]['name'],
              data:serie5,
            }
          );


          break;
        }

        default: {
          break;
        }
      }
     


      var llistaFecha=  this.categoriaFecha.filter(function(car1:any) {
        return car1 !== e.registro.fecha; 
      });
      this.categoriaFecha =   llistaFecha



 


    this.chartOptions1 = {
      chart: {
          type: 'column'
      },
      title: {
          text: this.nombreParametro
      },

      xAxis: {
          categories: this.categoriaFecha,
          title: {
              text: null
          }
      },
      yAxis: {
          min: 0,
          title: {
              text: this.nombreParametro,
              align: 'high'
          },
          labels: {
              overflow: 'justify'
          }
      },
      tooltip: {
          valueSuffix: '  '
      },
      plotOptions: {
          bar: {
              dataLabels: {
                  enabled: true
              }
          }
      },
  
      
      credits: {
          enabled: false
      },
      series: series
  };

   
    }
  
    
  }
}

}
