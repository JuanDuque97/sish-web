import { Component, Inject, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { estados } from 'src/app/common/utils/constantes';
import { dominiosEnum } from 'src/app/modelo/enum/dominios-enum';
import { IObservacionesConsulta } from 'src/app/modelo/observaciones/observacionesConsulta';
import { ServiciosvalorParametroXCriterio } from 'src/app/modulos/gestionHidrologica/cirterios/servicios-ValoresParametros-criterio.service';
import { ServiciosObservacionesEmbalsesService } from 'src/app/modulos/observaciones/servicios-observaciones-embalses.service';
import { ServiciosObservacionesEstacionService } from 'src/app/modulos/observaciones/servicios-observaciones-estacion.service';
import { ServiciosObservacionesPozosService } from 'src/app/modulos/observaciones/servicios-observaciones-pozos.service';
import Swal from 'sweetalert2';
import { accionesTablasEnum } from 'src/app/modelo/enum/acciones-tablas-enum';
import { ServiciosDominiosValoresService } from '../../../configuracion/dominios/servicios-dominios-valores.service';
import { ServiciosEmbalcesService } from '../../../elementos/embalses/servicios-embalses.service';
import { ServiciosParametrosEmbalseService } from '../../../elementos/embalses/servicios-parametros-embalse.service';
import { ServiciosEstacionesService } from '../../../elementos/estaciones/servicios-estaciones.service';
import { ServiciosParametrosEstacionesService } from '../../../elementos/estaciones/servicios-parametros-estaciones.service';
import { ServiciosParametrosPozosService } from '../../../elementos/pozos/servicios-parametros-pozos.service';
import { ServiciosPozosService } from '../../../elementos/pozos/servicios-pozos.service';
import { ServiciosSerieTiempoService } from '../../servicios/servicios-serie-tiempo.service';
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

export var var1: number = 0;
export var var2: string = '';
export var var3: string = '';
@Component({
  selector: 'app-guardar-serie-tiempo',
  templateUrl: './guardar-serie-tiempo.component.html',
})
export class GuardarSerieTiempoComponent implements OnInit {
  public formularioFiltros!: FormGroup;
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  public id: string = '0';
  public ac: string = 'C';
  public te: string = '0';
  public formularioSerieTiempo!: FormGroup;
  public elemento: number = 1;
  public listaElementos = [];
  public idElemento: string = '0';
  public idTipoElemento: any;
  public idParametroXElemento: number;
  public listaCodigoEAAB: any = [];
  public listaCodigoIDEAM: any = [];
  public periodo: number = 0;
  public parametro: number;
  public listParametro_eje: any[] = [];

  public promedio: string;
  public median: number;
  public mediana: number;
  public moda: number;
  public fechaObservacion: any;
  public Estacion: any;
  public listaNombreParametros: any = [];
  public NombresParametros: any = [];
  public listaFrecuenciaXParametro: any = [];
  public listaCodigoParametros: any = [];
  public CodigoParametros: any = [];
  public listaFrecuencia: any = [];
  public listaBusqueda: any = [];
  public listParametroXElemento: any = [];
  listP = [] as any;
  public newlistaFrecuencia: any = [];
  public listaElemento: any = [];
  public listaflag: any = [];
  public fecha: string;
  public fechaAno: number;
  public fechaMes: number;
  public usuario = JSON.parse(sessionStorage.getItem('usuario') || '{}');
  public valor: number;
  public flag: number = 0;
  public origen: string;
  public idFrecuencia: number;
  public idSerieTiempo: number;
  public entradManual: boolean = false;
  public Vista: boolean = false;
  datosFilter = [] as any;
  listObservaciones = [] as any;

  columnasDetalle = [
    // visible: false,
    { title: 'Fecha', data: 'fecha', class: 'text-center' },
    { title: 'valor', data: 'valor', class: 'text-center' },
    { title: 'dato', data: 'flagObservacion', class: 'text-center' },


  ];
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
  bloquear: boolean;
  public fechaActual: string;

  get idMecanismo(): any {
    return this.formularioSerieTiempo.get('idMecanismo');
  }
  get idTipoRegistro() {
    return this.formularioSerieTiempo.get('idTipoRegistro');
  }
  get fechaInicio() {
    return this.formularioSerieTiempo.get('fechaInicio');
  }
  get fechaFin() {
    return this.formularioSerieTiempo.get('fechaFin');
  }
  get Id() {
    return this.formularioSerieTiempo.get('fechaFin');
  }

  constructor(
    @Inject(LOCALE_ID) public locale: string,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private serviciosEstacionesService: ServiciosEstacionesService,
    private serviciosDominiosValoresService: ServiciosDominiosValoresService,
    private serviciosEmbalcesService: ServiciosEmbalcesService,
    private serviciosPozosService: ServiciosPozosService,
    private serviciosParametrosEmbalseService: ServiciosParametrosEmbalseService,
    private sercioparametrosestacion: ServiciosParametrosEstacionesService,
    private serviciosParametrosPozosService: ServiciosParametrosPozosService,
    private serviciosSerieTiempoService: ServiciosSerieTiempoService,
    private serviciosObservacionesEstacionService: ServiciosObservacionesEstacionService,
    private serviciosObservacionesPozosService: ServiciosObservacionesPozosService,
    private serviciosObservacionesEmbalsesService: ServiciosObservacionesEmbalsesService
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
          click(event: any, chartContext: any, config: any) {
            var1 = config.dataPointIndex;
            let div: any = document.getElementById(`btn`);
            div.click();
          },
          dataPointMouseEnter(event: any, chartContext: any, config: any) {
            alert(55);
            var1 = config.dataPointIndex;
            let div: any = document.getElementById(`btn`);
            div.click();
          }
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

    this.id = this.route.snapshot.paramMap.get('id')!;
    this.ac = this.route.snapshot.paramMap.get('ac')!;
    this.te = this.route.snapshot.paramMap.get('te')!;

    // Tipo Elemento
    this.serviciosDominiosValoresService
      .obtenerValoresPorIdDominio(dominiosEnum.TipoElemento)
      .subscribe((response) => {
        this.listaElementos = response;
        // console.log('llego frecuencia', this.listaFrecuencia);
      });

    if (this.ac != 'C') {
      // Periodos
      this.serviciosDominiosValoresService
        .obtenerValoresPorIdDominio(dominiosEnum.Periodos)
        .subscribe((response) => {
          this.listaFrecuencia = response;
        });

      this.serviciosDominiosValoresService
        .obtenerValoresPorIdDominio(dominiosEnum.FlagObservacion)
        .subscribe((response) => {
          this.listaflag = response;
          console.log(this.listaflag);
        });
    } else {
      // Periodos

      this.serviciosDominiosValoresService
        .obtenerValoresActivosPorIdDominio(dominiosEnum.Periodos)
        .subscribe((response) => {
          this.listaFrecuencia = response;
        });
      this.serviciosDominiosValoresService
        .obtenerValoresActivosPorIdDominio(dominiosEnum.FlagObservacion)
        .subscribe((response) => {
          this.listaflag = response;
        });
    }

    if (this.id != '0') {
      this.obtenerSerie();
    }
  }

  obtenerSerie() {
    this.idSerieTiempo = parseInt(this.id);
    this.obtenerElementos(this.te);
    this.elemento = parseInt(this.te);

    this.serviciosSerieTiempoService
      .obtenerSeriePorId(this.idSerieTiempo)
      .subscribe((response) => {
        this.idParametroXElemento = response.idParametroXElemento;
        this.obtenerParametrosElemento(response.idElemento, this.te);

        response.fechaInicio = '';
        response.fechaFin = '';

        this.formularioSerieTiempo.setValue(response);

        if (response.idSerieTiempoElemento >= 0) {
          this.serviciosSerieTiempoService
            .obtenerSerieDetallePorId(this.idSerieTiempo)
            .subscribe((responseDetalle) => {
              // this.datosFilter = responseDetalle;
              // console.log('datos llegaron', responseDetalle);

              let objetoDETALLE: any = [];

              for (let index = 0; index < responseDetalle.length; index++) {
                const element = responseDetalle[index];

                objetoDETALLE.push({
                  idSerieTiempoElemento:
                    responseDetalle[index].idSerieTiempoElemento,
                  idSerieTiempoDetalle:
                    responseDetalle[index].idSerieTiempoDetalle,
                  idTipoFormato: responseDetalle[index].idTipoFormato,
                  valor: responseDetalle[index].valor,
                  flagObservacion: responseDetalle[index].flagObservacion,
                  fecha: new Date(
                    responseDetalle[index].fecha +
                    'T' +
                    responseDetalle[index].hora
                  ),
                  //   formatDate(responseDetalle[index].fecha + "T"+ responseDetalle[index].hora,"dd/mm/yyyy, h:mm a",this.locale),
                  idFlag: responseDetalle[index].idFlag,
                  dia: responseDetalle[index].dia,
                  anio: responseDetalle[index].anio,
                  mes: responseDetalle[index].mes,
                  hora: responseDetalle[index].hora,
                });

                this.datosFilter = objetoDETALLE;
                alert(33);
              }

              // console.log('llego lista de Detalle', this.datosFilter);
              this.entradManual = true;
            });
        }
      });

    this.bloquear = true;
    if (this.ac == 'V') {
      this.formularioSerieTiempo.disable();
      this.Vista = true;
    }
  }

  private construirFormulario() {
    this.formularioSerieTiempo = this.formBuilder.group({
      idSerieTiempoElemento: [''],
      idElemento: ['', [Validators.required]],
      idTipoElemento: ['', [Validators.required]],
      codigoEaab: [''],
      codigoIdeam: [''],
      idMecanismo: [469],
      idTipoRegistro: ['', [Validators.required]],
      idFrecuencia: ['', [Validators.required]],
      idParametroXElemento: [''],
      activo: [estados.activo],
      flagInsert: [''],
      // Auditoria
      fechaCreacion: [''],
      fechaEstado: [''],
      fechaModificacion: [''],
      usuarioCreacion: [''],
      usuarioEstado: [''],
      fechaInicio: ['', [Validators.required]],
      fechaFin: ['', [Validators.required]],
      usuarioModificacion: [''],
    });


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
      idElemento: [''],
      idEstadoObservacion: [265],
      idcriterioCalidad: [''],
    });
  }

  crearSerie() {

    if (this.formularioSerieTiempo.valid) {
      if (this.datosFilter.length >= 2) {
        if (this.id === '0') {
          if (this.idMecanismo.value == 469) {
            console.log(this.formularioSerieTiempo.value);
            this.serviciosSerieTiempoService
              .crearElemento(this.formularioSerieTiempo.value)
              .subscribe((response) => {
                // console.log('llego', response.idSerieTiempoElemento);
                debugger
                if (response.idSerieTiempoElemento >= 0) {
                  this.idSerieTiempo = response.idSerieTiempoElemento;
                  this.entradManual = true;
                  // console.log('enviando', this.idSerieTiempo);
                  debugger
                  this.formularioSerieTiempo.disable();
                }
              });
          } else {
            this.entradManual = false;
            // console.log('enviando', this.idMecanismo);
          }
        } else {
          this.serviciosSerieTiempoService
            .actualizarElemento(this.formularioSerieTiempo.value)
            .subscribe((response) => {
              this.toast.fire({
                icon: 'success',
                title:
                  'La serie  ' +
                  response.idSerieTiempoElemento +
                  ', actualizado exitosamente!',
              });
            });
        }
      }
    }
  }
  accionRegistro(e: any) {

    switch (e.accion) {

      case accionesTablasEnum.Eliminar: {
        let elemento: any = e.registro;
        elemento.activo = estados.activo;
        console.log(elemento);
        var cars = this.datosFilter.filter(function (car: any) {
          return car.fecha !== e.registro.fecha;
        });

        this.datosFilter = cars;
        var cantidad = []
        var cantegoria = []
        var data: any = []
        var x;
        var y;

        for (let i = 0; i < this.datosFilter.length; i++) {

          y = this.datosFilter[i]['valor'];
          x = this.datosFilter[i]['fecha'];

          cantegoria.push(this.datosFilter[i]['fecha']);
          cantidad.push(this.datosFilter[i]['valor']);

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

          categories: cantegoria
        }



        break;
      }


      default: {
        //statements;
        break;
      }
    }
  }
  obtenerElementos(even: any) {


    this.idTipoElemento = even;

    // console.log('elemento', even);

    this.listaElemento = [];
    this.listaCodigoEAAB = [];
    this.listaCodigoIDEAM = [];


    switch (even) {


      case '466': {
        Swal.fire({
          title: 'Cargando...',
          html: 'Por favor espere',
          allowOutsideClick: false,
          showConfirmButton: false,
          didOpen: async () => {
            Swal.showLoading();
            // Estaciones
            this.serviciosEstacionesService
              .obtenerEstaciones()
              .subscribe((response) => {
                this.listaElemento = response.map((elemento: any) => ({
                  id: elemento.idEstacion,
                  text: elemento.estacion,
                  disabled: elemento.activo == 'S' ? false : true,
                }));

                this.listaCodigoEAAB = response.map((elemento: any) => ({
                  id: elemento.idEstacion,
                  text: elemento.codigoEstacionEaab,
                  disabled: elemento.activo == 'S' ? false : true,
                }));

                this.listaCodigoIDEAM = response.map((elemento: any) => ({
                  id: elemento.idEstacion,
                  text: elemento.codigoEstacionIdeam,
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
      case '467': {
        Swal.fire({
          title: 'Cargando...',
          html: 'Por favor espere',
          allowOutsideClick: false,
          showConfirmButton: false,
          didOpen: async () => {
            Swal.showLoading();
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
                Swal.close();
              });
          },
          willClose: async () => {
            Swal.hideLoading();
          }
        });
        break;
      }
      case '468': {
        Swal.fire({
          title: 'Cargando...',
          html: 'Por favor espere',
          allowOutsideClick: false,
          showConfirmButton: false,
          didOpen: async () => {
            Swal.showLoading();
            // pozos
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
        console.log('default');
        //statements;

        break;
      }
    }
  }

  calcularFechas(): Date | undefined {
    if (this.idFrecuencia == 155) {
      const fechass = this.fechaAno + '-01-01T05:04:30';
      // console.log(fechass)
      return (this.fechaObservacion = new Date(fechass));
    }
    if (this.idFrecuencia == 154) {
      const fechass = this.fechaMes + '-01T05:04:30';

      return (this.fechaObservacion = new Date(fechass));
    }
    if (this.idFrecuencia == 151 || this.idFrecuencia == 152) {
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

  guardar() {
    if (this.datosFilter.length >= 2) {
      if (this.id === '0') {
        Swal.fire({
          title: 'Cargando...',
          html: 'Por favor espere',
          allowOutsideClick: false,
          showConfirmButton: false,
          didOpen: async () => {
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
             
              });

              Swal.close();
          },
          willClose: () => {
            this.toast.fire({
              icon: 'success',
              title: 'Se Creo  la Serie de tiempo ',
            });

            this.router.navigate(['/seriestiempo/consultarserie']);
          },
        }).then((result) => { });
      } else {
        // Eliminar

        Swal.fire({
          title: 'Cargando...',
          html: 'Por favor espere',
          allowOutsideClick: false,
          showConfirmButton: false,
          didOpen: async () => {
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

            this.router.navigate(['/seriestiempo/consultarserie']);
          },
        }).then((result) => { });
      }
    } else {
      this.toast.fire({
        icon: 'info',
        title: 'la Serie de tiempo debe contrar con almenos dos elementos',
      });
    }
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

  filtrar() {

    console.log('buscnado', this.formularioSerieTiempo.value);
    var objetoBusqueda: any;
    this.listaBusqueda = [];
    this.listParametroXElemento = [];
    var idparametro = this.formularioSerieTiempo.value.idParametroXElemento;

    var codParametro = this.CodigoParametros.filter(function (list: any) {
      return list.id == idparametro;
    });

    this.listParametroXElemento.push(codParametro[0].idParametro);
    this.listaBusqueda.push(this.formularioSerieTiempo.value.idElemento);

    this.formularioFiltros.value.listParametros = this.listParametroXElemento;
    this.formularioFiltros.value.listaElementos = this.listaBusqueda;

    this.formularioFiltros.value.fechaInicio =
      this.formularioSerieTiempo.value.fechaInicio;
    this.formularioFiltros.value.fechaFin =
      this.formularioSerieTiempo.value.fechaFin;
    this.datosFilter = [];
    Swal.fire({
      title: 'Cargando...',
      html: 'Por favor espere',
      allowOutsideClick: false, 
      showConfirmButton: false,
      didOpen: async() => {
        Swal.showLoading();
        try {
          if (this.formularioFiltros.valid) {
            switch (this.formularioSerieTiempo.value.idTipoElemento) {
              case '466': {
                // estaciones
                objetoBusqueda = this.formularioFiltros.value;
                this.serviciosObservacionesEstacionService
                  .obtenerDTO(objetoBusqueda)
                  .subscribe((response) => {


                    console.log(response);
                    var list: any = response;
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

                      this.datosFilter.push(objSerieTiempo);
                    }

                    this.entradManual = true;
                    this.crearSerie();
                    this.formularioFiltros.disable();


                    var cantidad = []
                    var cantegoria = []
                    var data: any = []
                    var x;
                    var y;

                    for (let i = 0; i < this.datosFilter.length; i++) {

                      y = this.datosFilter[i]['valor'];
                      x = this.datosFilter[i]['fecha'];

                      cantegoria.push(this.datosFilter[i]['fecha']);
                      cantidad.push(this.datosFilter[i]['valor']);

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

                      categories: cantegoria
                    }
                    console.log(this.chartOptions);
                    console.log(33, this.datosFilter);
                    Swal.hideLoading();


                  });

                  Swal.close();

                break;
              }
              case '467': {
                // Embalses

                objetoBusqueda = this.formularioFiltros.value;

                this.serviciosObservacionesEmbalsesService
                  .obtenerDTO(objetoBusqueda)
                  .subscribe((response) => {

                    var list: any = response;
                    for (let index = 0; index < list.length; index++) {
                      const element = list[index];

                      var fecha = new Date(list[index].fecha);

                      let objSerieTiempo = {
                        idSerieTiempoElemento: 0,
                        idSerieTiempoDetalle: 0,
                        idTipoFormato: 461,
                        valor: list[index].valor,
                        fecha: fecha,
                        idFlag: list[index].idFlagObservacion,

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

                      this.datosFilter.push(objSerieTiempo);
                    }

                    this.entradManual = true;

                    this.formularioFiltros.disable();
                    this.crearSerie();

                    Swal.close();

                  });


                break;
              }
              case '468': {
                // Pozos
                objetoBusqueda = this.formularioFiltros.value;

                this.serviciosObservacionesPozosService
                  .obtenerDTO(objetoBusqueda)
                  .subscribe((response: IObservacionesConsulta) => {
                    var list: any = response;
                    for (let index = 0; index < list.length; index++) {
                      const element = list[index];

                      var fecha = new Date(list[index].fecha);

                      let objSerieTiempo = {
                        idSerieTiempoElemento: 0,
                        idSerieTiempoDetalle: 0,
                        idTipoFormato: 461,
                        valor: list[index].valor,
                        fecha: fecha,
                        idFlag: list[index].idFlagObservacion,

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

                      this.datosFilter.push(objSerieTiempo);
                    }


                    this.entradManual = true;

                    this.formularioFiltros.disable();
                    this.crearSerie();
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
      },
      willClose: () => {


      },
    }).then((result) => { });


  }
  eliminarLista(id: any) {
    var i = this.datosFilter.indexOf(id);

    if (i !== -1) {

      this.datosFilter.splice(i, 1);


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

  filtrarFrecuencias(frecuencia: number) {
    this.listaNombreParametros = [];
    this.listaCodigoParametros = [];
    // this.idParametroXElemento = 0;

    this.listaNombreParametros = this.NombresParametros.filter(function (
      list: any
    ) {
      return list.idPeriodo == frecuencia;
    });

    this.listaCodigoParametros = this.CodigoParametros.filter(function (
      list: any
    ) {
      return list.idPeriodo == frecuencia;
    });
  }

  infoAforo() {
    console.log(this.datosFilter[var1]);
    var x = this.datosFilter[var1].valor;
    var fecha = this.datosFilter[var1].fecha;

    var alumnosCurso = '<table id="alumnosCurso" class="table table-striped nowrap" width="100%"><thead><tr><th>Valor</th><th>Fecha de Obervación</th></tr> </thead><tbody><tr><td>' + x + '</td><td>' + fecha + '</td> </tr></tbody></table>';

    Swal.fire({
      title: 'Información de Obervación',
      html: alumnosCurso,
      showCancelButton: true,
      showCloseButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Cambiar',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Eliminar Obervación',


    }).then((result) => {
      if (result.isConfirmed) {

      } else {
        Swal.fire({
          title: 'Desea el valor Obervación?',
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

  }


  eliminarValor() {
    var cantidad = []
    var cantegoria = []
    var data: any = []
    var x;
    var y;
    var fecha = this.datosFilter[var1].fecha;
    var cars = this.datosFilter.filter(function (car: any) {
      return car.fecha !== fecha;
    });

    this.datosFilter = cars;

    for (let i = 0; i < this.datosFilter.length; i++) {

      y = this.datosFilter[i]['valor'];
      x = this.datosFilter[i]['fecha'];

      cantegoria.push(this.datosFilter[i]['fecha']);
      cantidad.push(this.datosFilter[i]['valor']);

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


      Amount: 5,
      labels: {
        formatter: function (val: any) {
          return parseFloat(val).toFixed(1)
        }
      },
      tickAmount: 10,
      title: {
        text: 'Fecha',
        style: {
          fontSize: 10,
          color: '#ffffff'
        }
      },

      categories: cantegoria
    }
  }

  dataPointSelection(event: any, chartContext: any, config: any) {
    alert(55);
    var1 = config.dataPointIndex;
    let div: any = document.getElementById(`btn`);
    div.click();
  }
  obtenerParametrosElemento(event: any, mecanismo: any) {
    console.log('evento', event);

    var tipomecanismo: Number = parseInt(mecanismo);
    switch (tipomecanismo) {
      case 466: {
        this.sercioparametrosestacion
          .obtenerListaParametros(event)
          .subscribe((response) => {
            this.NombresParametros = response.map((elemento: any) => ({
              id: elemento.idParametroXEstacion,
              text: elemento.descripcionParametro,
              idParametro: elemento.idParametro,

              idPeriodo: elemento.idPeriodo,
            }));
            for (let index = 0; index < this.NombresParametros.length; index++) {

              var text = this.NombresParametros[index]['text']
              var text1 = text.split('-');
              var parametro = text1[0] + '-' + text1[1].toLowerCase();

              this.NombresParametros[index]['text'] = parametro;


              console.log(this.NombresParametros[index]['text']);

            }

            this.CodigoParametros = response.map((elemento: any) => ({
              id: elemento.idParametroXEstacion,
              text: elemento.codigo,
              idParametro: elemento.idParametro,
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
            // console.log('llego lista', this.listaFrecuenciaXParametro);
          });

        break;
      }
      case 467: {
        this.serviciosParametrosEmbalseService
          .obtenerListaParametrosXEmbalse(event)
          .subscribe((response) => {
            // console.log('embalses', response);
            this.NombresParametros = response.map((elemento: any) => ({
              id: elemento.idParametroXEmbalse,
              text: elemento.descripcionParametro,
              idPeriodo: elemento.idPeriodo,
              idParametro: elemento.idParametro,
              disabled: elemento.activo == 'S' ? false : true,
            }));
            for (let index = 0; index < this.NombresParametros.length; index++) {

              var text = this.NombresParametros[index]['text']
              var text1 = text.split('-');
              var parametro = text1[0] + '-' + text1[1].toLowerCase();

              this.NombresParametros[index]['text'] = parametro;


              console.log(this.NombresParametros[index]['text']);

            }
            this.CodigoParametros = response.map((elemento: any) => ({
              id: elemento.idParametroXEmbalse,
              text: elemento.codigo,
              idPeriodo: elemento.idPeriodo,
              idParametro: elemento.idParametro,
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
      case 468: {
        this.serviciosParametrosPozosService
          .obtenerListaParametrosXPozo(event)
          .subscribe((response) => {
            console.log('elementos', response);

            this.NombresParametros = response.map((elemento: any) => ({
              id: elemento.idParametroXPozo,
              text: elemento.descripcionParametro,
              idPeriodo: elemento.idPeriodo,
              idParametro: elemento.idParametro,
              disabled: elemento.activo == 'S' ? false : true,
            }));

            this.CodigoParametros = response.map((elemento: any) => ({
              id: elemento.idParametroXPozo,
              idPeriodo: elemento.idPeriodo,
              text: elemento.codigo,
              idParametro: elemento.idParametro,
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
}
