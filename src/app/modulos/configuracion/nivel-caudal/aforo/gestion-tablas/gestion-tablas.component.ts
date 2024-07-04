import { Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { dominiosEnum } from 'src/app/modelo/enum/dominios-enum';
import Swal from 'sweetalert2';
import { accionesTablasEnum } from 'src/app/modelo/enum/acciones-tablas-enum';
import { ServiciosDominiosValoresService } from '../../../dominios/servicios-dominios-valores.service';
import { ServiciosEmbalcesService } from '../../../../elementos/embalses/servicios-embalses.service';
import { ServiciosParametrosEmbalseService } from '../../../../elementos/embalses/servicios-parametros-embalse.service';
import { ServiciosEstacionesService } from '../../../../elementos/estaciones/servicios-estaciones.service';
import { ServiciosParametrosPozosService } from '../../../../elementos/pozos/servicios-parametros-pozos.service';
import { ServiciosPozosService } from '../../../../elementos/pozos/servicios-pozos.service';
import { ServiciosParametrosEstacionesService } from '../../../../elementos/estaciones/servicios-parametros-estaciones.service';
import { map } from 'rxjs/operators';
import { estados, OrigenObservacion } from '../../../../../common/utils/constantes';
import { ServiciosObservacionesEstacionService } from '../servicios-observaciones-estacion.service';
import { ServiciosObservacionesPozosService } from '../servicios-observaciones-pozos.service';
import { ServiciosObservacionesEmbalsesService } from '../servicios-observaciones-embalses.service';
import { IObservacionesConsulta } from 'src/app/modelo/observaciones/observacionesConsulta';
import { activo } from '../../../../../modelo/enum/cargue-archivo-enum';
import { ServiciosGeograficosService } from 'src/app/common/mapa/servicios-geograficos.service';
import { ServiciosCapasService } from '../../../capas/servicios-capas.service';
import { capasEnum, capasEnumDatos } from 'src/app/modelo/enum/capas-enum';
import { ServiciosAforoService } from '../servicios-aforo.service';
import { IInformacionGrafica } from 'src/app/modelo/configuracion/informacionGrafica';
import { ICurvaTendencia } from 'src/app/modelo/configuracion/curvaTendencia';


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
  selector: 'app-gestion-tablas',
  templateUrl: './gestion-tablas..component.html',
})

export class GestionTablasComponent implements OnInit {
  public id: string = '0';
  public ac: string = 'c';
  public te: string = '0';
  public listParametro_eje: any[] = [];
  public elemento: number = 0;
  public idElemento: number = 0;
  public CodigoEAAB: number = 0;
  public idParametro: number = 0;
  public listaCodigoEAAB: any = [];
  public formularioFiltroAforo!: FormGroup;
  public listaCodigoIDEAM: any = [];
  public fechaObservacion: any;
  public Estacion: any;
  public NombresParametros: any = [];
  public listaEntidad = [];
  public CodigoParametros: any = [];
  capas: any[] = []
  public listaMetodoMedicion = [];
  public listaFrecuencia: any = [];
  public newlistaFrecuencia: any = [];
  public listaNumeroAforo = [];
  public lisTipoAforo = [];
  public fechaFin: any = '';
  public fechaInicio: any = '';
  public tipoRango: any = 2;
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
  verFechas = false;
  public listaAforodor = [];
  public listaFrecuenciaXParametro: any = [];
  public listaElemento: any = [];
  public listaflag: any = [];
  listaTipoAforo = [] as any;
  public fecha: string;
  public fechaAno: number;
  public fechaMes: string;
  public periodo: number = 1;
  public usuario = JSON.parse(sessionStorage.getItem('usuario') || '{}');
  public pintarBG: number = 0;
  public valor: number;
  public flag: number = 0;
  public origen: string;
  public idfrecuencia: number;
  public listaMunicipios = [];
  public listaDepartamentos = [];
  public departamentoSelected: any;
  private tempIdDepartamento: number = 0;
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

  rutaConsulta1 = 'configuracion/gestionAforo/V/';
  datosFilter = [] as any;
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  datePipe: DatePipe = new DatePipe('en-ES');
  public listaBusqueda: any[] = [];
  listParametroXElemento = [] as any;
  aforoSelecionado = [];
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
  columnas = [
    {
      title: 'ID aforo',
      data: 'idAforo',

    },
    {
      title: 'Estación',
      data: 'estacion',

    },
    {
      title: 'Nombre corriente',
      data: 'nombreCorriente',
    },
    {
      title: 'Fecha aforo',
      data: 'fecha',

    },
    {
      title: 'Aforo N',
      data: 'aforo_n',
    },

    {
      title: 'Correntrómetro',
      data: 'helice',

    },
    {
      title: 'Caudal (㎥/s)',
      data: 'caudal',

    },
    {
      title: 'Nivel (h) (m)',
      data: 'nivel',

    },
    {
      title: 'Radio hidráulico (m)',
      data: 'radio_h',

    },
    {
      title: 'Perimetro mojado (m)',
      data: 'perimetro_m',

    },
    {
      title: 'Aforador',
      data: 'aforador',

    },
    {
      title: 'Estado ',
      data: 'estado',

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
  listParametros: any = [];

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

  constructor(
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
    private serviciosObservacionesEstacionService: ServiciosObservacionesEstacionService,
    private serviciosObservacionesPozosService: ServiciosObservacionesPozosService,
    private serviciosObservacionesEmbalsesService: ServiciosObservacionesEmbalsesService,
    private serviciosGeograficosService: ServiciosGeograficosService,
    private serviciosCapasService: ServiciosCapasService,
    private servicioAforo: ServiciosAforoService,
  ) { }

  ngOnInit(): void {


    this.chartOptions = {
      series: [],
      chart: {
        height: 350,
        id: 'chartf',
        type: 'scatter',
        toolbar: { show: true },
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
        tickAmount: 10,
        title: {
          text: 'Nivel(h) (m)',

        },
        labels: {
          formatter: function (val: any) {
            return parseFloat(val).toFixed(1)
          }
        }
      },
      yaxis: {
        title: {
          text: 'Caudal (Q) (㎥/s)',
          offsetY: 20,
          labels: {
            formatter: function (val: any) {
              return parseFloat(val).toFixed(1)
            }
          },

        },


        tickAmount: 7
      }
    };
    this.construirFormulario();


    //--------------------

    this.cargarAreaHidrografica();
    this.onChanges();

    this.cargarAreaHidrografica();
    this.serviciosDominiosValoresService
      .obtenerValoresActivosPorIdDominio(dominiosEnum.metodoMedicion)
      .subscribe((response) => {
        this.listaMetodoMedicion = response;
      });
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

    // Tipo Coordenadas
    this.serviciosDominiosValoresService
      .obtenerValoresActivosPorIdDominio(dominiosEnum.TipoCoordenadas)
      .subscribe((response) => {
        this.listaTipoCoordenada = response;
      });
    // tipoCorriente
    this.serviciosDominiosValoresService
      .obtenerValoresActivosPorIdDominio(dominiosEnum.TipoCorriente)
      .subscribe((response) => {
        this.listaCorriente = response;
      });
    //Número afoto 
    this.servicioAforo
      .obtenerNumeroAfoto()
      .subscribe((response) => {
        this.listaNumeroAforo = response;

      });

    this.servicioAforo
      .obtenerTipoAforo()
      .subscribe((response) => {
        this.lisTipoAforo = response;

      });

    // Aforador
    this.servicioAforo
      .obtenerAforadores()
      .subscribe((response) => {
        this.listaAforodor = response;
        // console.log('llego frecuencia', this.listaFrecuencia);
      });

    // Periodos
    this.serviciosDominiosValoresService
      .obtenerValoresPorIdDominio(dominiosEnum.Periodos)
      .subscribe((response) => {
        this.listaFrecuencia = response;
        // console.log('llego frecuencia', this.listaFrecuencia);
      });
    // Departamentos
    this.serviciosGeograficosService
      .obtenerDepartamentos()
      .subscribe((response) => {
        this.listaDepartamentos = response;
      });

    this.serviciosDominiosValoresService
      .obtenerValoresPorIdDominio(dominiosEnum.FlagObservacion)
      .subscribe((response) => {
        this.listaflag = response;
      });

    this.cargarAreaHidrografica();
    this.onChanges();

  }



  obtenerElemento() {
    let idParam: number = +this.id;
    this.obtenerElementos(this.te);
    this.elemento = parseInt(this.te);

    // console.log('llego te', this.te);
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
            this.calcularFechas();

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
      case '2': {
        this.serviciosObservacionesEmbalsesService
          .obtenerPorIdDTO(idParam)
          .subscribe((response) => {
            // console.log('llego', response); 
            this.obtenerParametrosElemento(response.idEmbalse, this.te);
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
            this.calcularFechas();

            let obFormulario: any = {
              idObservacion: this.id,
              idParametro: response.idParametroXEmbalse,
              idElemento: response.idEmbalse,
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
      case '3': {
        // Pozos
        this.serviciosObservacionesPozosService
          .obtenerPorIdDTO(idParam)
          .subscribe((response) => {
            // console.log('llego Pozo', response);

            this.obtenerParametrosElemento(response.idPozo, this.te);


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
            this.idfrecuencia = response.frecuencia;
            this.calcularFechas();

            let obFormulario: any = {
              idObservacion: this.id,
              idParametro: response.idParametroXPozo,
              idElemento: response.idPozo,
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

    if (this.ac == 'V') {
      this.formularioFiltroAforo.disable();
    }
  }

  private construirFormulario() {
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
  obtenerfecha(fecha: Date) {
    const zeroPad = (val: any) => val.toString().padStart(2, "0");
    // Advertencia, padStart() -> ECMAScript 2017

    let odate = new Date(fecha);
    let año = odate.getFullYear().toString(); // getFullYear() retorna un número, para poder usar slice() necesitamos convertirlo a un string utilizando toString()
    let final = año.slice(-2);
    let year = odate.getFullYear();
    let month = zeroPad(odate.getMonth());
    let day = zeroPad(odate.getDate());
    let hour = zeroPad(odate.getHours());
    let mins = zeroPad(odate.getMinutes());
    let seg = zeroPad(odate.getSeconds());
    let milseg = zeroPad(odate.getMilliseconds());
    let ampm = odate.getHours() < 12 ? 'AM' : 'PM';
    let fecha1 = Date.parse(day + '/' + month + '/' + final)

    return fecha1;
  }

  assertNullAndUndefined(value: any): boolean {
    if (null == value || undefined == value) {
      return false;
    }

    return true;
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
          console.log(elemento.value);

          if (!elemento.value.fechaInicio) {
            elemento.value.fechaInicio = "1900-08-01"
            elemento.value.fechaFin = "2200-08-01"
          }
          elemento.value.metodoMedicion = elemento.value.idtipoAforo;

          if (elemento.value.idelemento == undefined || elemento.value.idelemento == 0) {
            elemento.value.codigoEstacionEaab = "";
          }
          var fechaFin = elemento.value.fechaFin + 'T00:00:00.000'
          elemento.value.fechaFin = fechaFin;

          var fecha = elemento.value.fechaInicio + 'T00:00:00.000'
          elemento.value.fechaInicio = fecha;

          this.servicioAforo
            .obtenerTablas(elemento.value)
            .subscribe((response) => {


              this.listParametro_eje = response;

              if (this.listParametro_eje[0] == null) {
                Swal.fire({
                  title: 'No sé encontro datos!!',
                  icon: 'error',
                  confirmButtonText: 'Salir',
                }).then((result) => {

                  this.chartOptions.series = [{
                    name: "Nivel ",
                    type: "scatter",
                    data: []
                  },];

                });


              } else {

                Swal.fire({
                  title: 'Busqueda exitosa!!',
                  icon: 'info',
                  confirmButtonText: 'Salir',
                }).then((result) => {

                  console.log('llegando consulta', response);
                  this.pintarBG = 1;

                  var cantidad = [];
                  var cantidadNivel = [];

                  for (let i = 0; i < this.listParametro_eje.length; i++) {

                    var ejeY = this.listParametro_eje[i]['caudal'];
                    var ejeX = this.listParametro_eje[i]['nivel'];
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


                  this.chartOptions.chart.events['dataPointSelection'] = this.dataPointSelection;



                  this.servicioAforo

                    .obtenerAforoValidar(elemento.value.idelemento)
                    .subscribe((response) => {
                      var nuero = response;

                      if (nuero) {

                        Swal.fire({
                          title: 'Aforos pendientes por validar !!',
                          icon: 'error',
                        }).then((result) => {
                          if (result.isConfirmed) {

                          }
                        });

                      }

                    })
                });

              }

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
          this.fecha = '';
          this.fechaAno = 0;
          this.fechaMes = '';
          this.valor = 0;
          this.flag = 0;
          this.origen = '';
          this.idfrecuencia = 0;
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


  filtrar(elemento: any) {




    var objetoBusqueda: any;

    try {
      if (this.formularioFiltroAforo.valid) {
        switch (elemento) {
          case '0': {
            this.formularioFiltroAforo.value.listaElementos =
              this.listaBusqueda.map((elemento: any) => elemento.idEstacion);
            this.formularioFiltroAforo.value.listParametros =
              this.listParametroXElemento;

            objetoBusqueda = this.formularioFiltroAforo.value;
            objetoBusqueda.tipoElemento = elemento;

            break;
          }
          case '1': {
            // Embalses
            this.formularioFiltroAforo.value.listaElementos =
              this.listaBusqueda.map((elemento: any) => elemento.idEmbalse);
            this.formularioFiltroAforo.value.listParametros =
              this.listParametroXElemento;
            objetoBusqueda = this.formularioFiltroAforo.value;
            objetoBusqueda.tipoElemento = elemento;
            break;
          }
          case '2': {
            // Pozos
            this.formularioFiltroAforo.value.listaElementos =
              this.listaBusqueda.map((elemento: any) => elemento.idPozo);
            this.formularioFiltroAforo.value.listParametros =
              this.listParametroXElemento;
            objetoBusqueda = this.formularioFiltroAforo.value;
            objetoBusqueda.tipoElemento = elemento;
            break;
          }
          default: {
            console.log('elemento', elemento);
          }
        }
      }

      console.log(elemento.value);
      this.servicioAforo
        .obtenerCurva1(elemento.value)
        .subscribe((response) => {

          this.listParametro_eje = response;

          if (this.listParametro_eje[0] == null) {
            Swal.fire({
              title: 'No sé encontro datos!!',
              icon: 'error',
              confirmButtonText: 'Salir',
            }).then((result) => {

              this.chartOptions.series = [{
                name: "Nivel ",
                type: "scatter",
                data: []
              },];

            });


          } else {

            Swal.fire({
              title: 'Busqueda exitosa!!',
              icon: 'info',
              confirmButtonText: 'Salir',
            }).then((result) => {

              console.log('llegando consulta', response);
              this.pintarBG = 1;

              var cantidad = [];
              var cantidadNivel = [];
              for (let i = 0; i < this.listParametro_eje.length; i++) {
                var ejeY = this.listParametro_eje[i]['caudal'];
                var ejeX = this.listParametro_eje[i]['nivel'];
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


              this.chartOptions.chart.events['dataPointSelection'] = this.dataPointSelection;

            });






          }







        });
    } catch (error) {


      console.error(error);
    }
  }


  agregarlista(FiltroAforo: any) {



    this.filtra1r(FiltroAforo)

    this.datosFilter.push(FiltroAforo);




    // console.log('lista ', this.datosFilter);
  }

  guardar(mecanismo: any) {
    let arregladoFinal = [];
    switch (mecanismo) {
      case '1': {
        // Estacion
        // idParametroXEstacion

        arregladoFinal = this.datosFilter.map(
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
          .creacionMasiva(arregladoFinal)
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

        break;
      }
      case '2': {
        // Embalses
        // idParametroXEmbalse
        arregladoFinal = this.datosFilter.map(
          (p: { [x: string]: any; idParametroElemento: any }) => {
            // crear nueva propiedad de nombre Del Elemento
            p[`idParametroXEmbalse`] = p.idParametroElemento;
            p[`idObservacionXEmbalseInicial`] = p.idObservacionXElemento;
            // remover la propiedad actual
            delete p.idParametroElemento;
            delete p.idObservacionXElemento;
            // retornar el nuevo objeto
            return p;
          }
        );

        //  console.log('enviando',arregladoFinal)
        this.serviciosObservacionesEmbalsesService
          .creacionMasiva(arregladoFinal)
          .subscribe((Response) => {
            // console.log('embalses ', Response);
            this.toast.fire({
              icon: 'success',
              title:
                'se gurardaron ' +
                Response.length +
                ' Observaciones exitosamente!',
            });
            this.router.navigate(['/configuracion/gestionObservaciones']);
          });

        break;
      }
      case '3': {
        // Pozos
        // idParametroXPozo
        arregladoFinal = this.datosFilter.map(
          (p: { [x: string]: any; idParametroElemento: any }) => {
            // crear nueva propiedad de nombre Del Elemento
            p[`idParametroXPozo`] = p.idParametroElemento;
            p[`idObservacionXPozoInicial`] = p.idObservacionXElemento;
            // remover la propiedad actual
            delete p.idParametroElemento;
            delete p.idObservacionXElemento;
            // retornar el nuevo objeto
            return p;
          }
        );

        // console.log('enviando', arregladoFinal);
        this.serviciosObservacionesPozosService
          .creacionMasiva(arregladoFinal)
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

        break;
      }
    }
  }

  Actualizar() {
    this.calcularFechas();
    let observacionParametros: any = {};
    switch (this.te) {
      case '1': {
        observacionParametros = {
          idObservacionXEstacionInicial: this.id,
          idParametroXEstacion: this.idParametro,
          fecha: this.fechaObservacion,
          valor: this.valor,
          idFlagObservacion: this.flag,
          flagInsert: true,
          flagExistente: false,
          origen: this.origen,
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

        this.serviciosObservacionesEstacionService
          .actualizar(observacionParametros)
          .subscribe((Response) => {
            this.toast.fire({
              icon: 'success',
              title: 'Se Actualizo  ' + ' Observaciones exitosamente!',
            });
            this.router.navigate(['/configuracion/gestionObservaciones']);
          });

        break;
      }
      case '2': {
        observacionParametros = {
          idObservacionXEmbalseInicial: this.id,
          idParametroXEmbalse: this.idParametro,
          fecha: this.fechaObservacion,
          valor: this.valor,
          idFlagObservacion: this.flag,
          flagInsert: true,
          flagExistente: false,
          origen: this.origen,
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
        //  console.log('enviando',arregladoFinal)
        this.serviciosObservacionesEmbalsesService
          .actualizar(observacionParametros)
          .subscribe((Response) => {

            this.toast.fire({
              icon: 'success',
              title: 'Se Actualizo  ' + ' Observaciones exitosamente!',
            });
            this.router.navigate(['/configuracion/gestionObservaciones']);
          });

        break;
      }
      case '3': {
        observacionParametros = {
          idObservacionXPozoInicial: this.id,
          idParametroXPozo: this.idParametro,
          fecha: this.fechaObservacion,
          valor: this.valor,
          idFlagObservacion: this.flag,
          flagInsert: true,
          flagExistente: false,
          origen: this.origen,
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

        this.serviciosObservacionesPozosService
          .actualizar(observacionParametros)
          .subscribe((Response) => {
            // console.log('llego al guardar ', Response);
            this.toast.fire({
              icon: 'success',
              title: 'Se Actualizo  ' + ' Observaciones exitosamente!',
            });
            this.router.navigate(['/configuracion/gestionObservaciones']);
          });

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
    if (this.idfrecuencia == 151 || this.idfrecuencia == 152 || this.idfrecuencia == 146 || this.idfrecuencia == 145) {
      return this.fechaObservacion = new Date(this.fecha + ':00Z');
    }

    return new Date();
  }

  filtrarFrecuencias(frecuencia: number) {
    this.idParametro = 0;
    var elemento = this.NombresParametros.filter(function (
      list: any
    ) {
      return list.id == frecuencia;
    }
    );
    this.idfrecuencia = elemento[0].idPeriodo


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
  eliminarLista(id: any) {
    var i = this.datosFilter.indexOf(id);

    if (i !== -1) {
      this.datosFilter.splice(i, 1);
    }
  }

  validarTabbla(newObservacion: any) {
    for (let index = 0; index < this.datosFilter.length; index++) {
      // Validar filtro 
      alert(3);
      if (
        // validar parametro
        this.datosFilter[index].idParametroElemento ==
        newObservacion.idParametroElemento &&
        // validar fechas
        this.datosFilter[index].fecha.getTime() ==
        newObservacion.fecha.getTime()
      ) {
        this.toast.fire({
          icon: 'info',
          title: 'la observacion ya se encuentra agregada',
        });

        return false;
      }
    }

    return true;
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



  onChanges(): void {
    if (this.formularioFiltroAforo) {
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
        alert(1);
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
                return { id: zh.CODAH, text: zh.CODAH + '-' + zh.NOMBAH };
              });
            this.listaAreaHidrografica = datos;
            // console.log('listaAreaHidrografica', datos);
          });
      });
  }

  accionRegistroColumnas(e: any) {
    switch (e.accion) {
      case accionesTablasEnum.Eliminar: {
        var listaFinal = this.listParametro_eje;
        var cars = listaFinal.filter(function (car) {
          return car.idAforo !== e.registro.idAforo;
        });
        this.listParametro_eje = [];
        this.listParametro_eje = cars;
        console.log(this.listParametro_eje);

        var x = this.chartOptions.series[0].data[var1].x;
        var y = this.chartOptions.series[0].data[var1].y;

        var listaFinal1 = this.chartOptions.series[0].data;
        this.chartOptions.series[0].data = [];
        listaFinal1 = listaFinal1.filter(function (car: any) {
          return car.x !== x;
        });
        var listafin = listaFinal1;
        this.chartOptions.series = [{
          name: "Nivel ",
          type: "scatter",
          data: listafin
        },];
        break;
      }
      case accionesTablasEnum.Consultar: {
        alert(44);
      }


    }
  }

  accionRegistroVer(e: any) {
    switch (e.accion) {
      case accionesTablasEnum.Editar: {
        var listaFinal = this.listParametro_eje;
        var cars = listaFinal.filter(function (car) {
          return car.idAforo !== e.registro.idAforo;
        });
        this.listParametro_eje = [];
        this.listParametro_eje = cars;
        console.log(this.listParametro_eje);
      }

    }
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


  mapLoadedEvent(status: Event) {
    console.log('The map loaded: ' + status);
  }

  seleccionMapa(e: any) {
    // // TO-DO
    // console.log('seleccion respuesta ', e);


    let features = e.seleccion.flat(1);

    let _cuenca = features.filter(
      (c: any) => c.idCapa === capasEnumDatos(capasEnum.Cuenca).id
    )[0].atributos;
    let _subcuenca = features.filter(
      (c: any) => c.idCapa === capasEnumDatos(capasEnum.Subcuenca).id
    )[0].atributos;
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
    this.microCuenca?.setValue(codmch);
  }

  clickMapa(e: any) {
    // TO-DO
    console.log('respuesta click', e);
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



    console.log('capas cargadas', this.capas)
  }
  dataPointSelection(event: any, chartContext: any, config: any) {
    var1 = config.dataPointIndex;
    let div: any = document.getElementById(`btn`);
    div.click();
  }
  infoAforo() {
    var x = this.chartOptions.series[0].data[var1].x;
    var y = this.chartOptions.series[0].data[var1].y;
    var fecha = this.listParametro_eje[0]["fecha"];

    var alumnosCurso = '<table id="alumnosCurso" class="table table-striped nowrap" width="100%"><thead><tr><th>Nivel</th><th>Caudal</th><th>Fecha de aforo</th></tr> </thead><tbody><tr><td>' + x + '</td><td>' + y + '</td><td>' + fecha + '</td> </tr></tbody></table>';

    Swal.fire({
      title: 'Información de aforo',
      html: alumnosCurso,
      focusConfirm: false,
      allowOutsideClick: false
    });

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

  eliminarRegistros() {

    var x = this.chartOptions.series[0].data[var1].x;
    var y = this.chartOptions.series[0].data[var1].y;
    var listaFinal = this.chartOptions.series[0].data;
    this.chartOptions.series[0].data = [];
    listaFinal = listaFinal.filter(function (car: any) {
      return car.x !== x;
    });
    var listafin = listaFinal;
    this.chartOptions.series = [{
      name: "Nivel ",
      type: "scatter",
      data: listafin
    },];


  }
  guardarConvertirCurvaInfo() {

    var date = new Date();
    var transformDate = this.datePipe.transform(date, 'yyyy-MM-dd');



    this.servicioAforo
      .obtenerCurvaid(this.listParametro_eje[1]['id_estacion'])
      .subscribe((response) => {
        var string = response.toString();
        var numero = parseInt(string);
        console.log(string, numero + 1);
        var nfin = numero + 1

        let curvaTendencia: ICurvaTendencia = {
          idEstacion: this.listParametro_eje[1]['id_estacion'],
          idVigencia: 0,
          idCalibracion: '',
          numeroCurva: nfin.toString(),
          fechaFin: '',
          fechaInicio: date,
          usuario: '',
          estado: '2',
        }
        this.servicioAforo
          .guardarCurva(curvaTendencia)
          .subscribe((response) => {
            if (response.idCurvaTendencia != null && response.idCurvaTendencia >= 0) {
              debugger;

              var id_curva = response.idCurvaTendencia;

              this.toast.fire({
                icon: 'success',
                title:
                  'Curva de tendecia  Creado Exitosamente!' + response.idCurvaTendencia,
              });

              for (let i = 0; i < this.listParametro_eje.length; i++) {

                const [fecha, tiempo] = this.listParametro_eje[i]['fecha'].split(' ');
                let infoGrafica: IInformacionGrafica = {
                  caudal: this.listParametro_eje[i]['caudal'],
                  fecha_creacion: this.listParametro_eje[i]['fecha'],
                  id_curva_tendencia: id_curva,
                  nivel: this.listParametro_eje[i]['nivel'],
                  usuario_creacion: '',
                  usuario_modificacion: 'String',
                  fecha_modificacion: date,
                  id_informacion_grafica: '',
                  fechaFin: date,
                  id_aforo: this.listParametro_eje[i]['idAforo'],
                  n_aforo: this.listParametro_eje[i]['aforo_n']
                }
                this.servicioAforo
                  .guardarInformacionGrafica(infoGrafica)
                  .subscribe((response) => {

                  });

              };
              this.router.navigate(['/configuracion/calcularRegresecion', id_curva]);



            }
          });
      });

  }
  guardarConvertirCurva() {

    Swal.fire({
      title: 'Desea calcular regresión?',
      text: 'Los datos serán Guardados!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Convertir, Guardar',
    }).then((result) => {
      if (result.isConfirmed) {

        this.guardarConvertirCurvaInfo();

      }
    });



  };


  guardarCurvaInfo() {

    var date = new Date();
    var transformDate = this.datePipe.transform(date, 'yyyy-MM-dd');



    this.servicioAforo
      .obtenerCurvaid(this.listParametro_eje[1]['id_estacion'])
      .subscribe((response) => {
        var string = response.toString();
        var numero = parseInt(string);
        console.log(string, numero + 1);
        var nfin = numero + 1

        let curvaTendencia: ICurvaTendencia = {
          idEstacion: this.listParametro_eje[1]['id_estacion'],
          idVigencia: 0,
          idCalibracion: '',
          numeroCurva: nfin.toString(),
          fechaFin: '',
          fechaInicio: date,
          usuario: '',
          estado: '2',
        }
        this.servicioAforo
          .guardarCurva(curvaTendencia)
          .subscribe((response) => {
            if (response.idCurvaTendencia != null && response.idCurvaTendencia >= 0) {
              debugger;

              var id_curva = response.idCurvaTendencia;

              this.toast.fire({
                icon: 'success',
                title:
                  'Curva de tendecia  Creado Exitosamente!' + response.idCurvaTendencia,
              });


              for (let i = 0; i < this.listParametro_eje.length; i++) {

                const [fecha, tiempo] = this.listParametro_eje[i]['fecha'].split(' ');
                let infoGrafica: IInformacionGrafica = {
                  caudal: this.listParametro_eje[i]['caudal'],
                  fecha_creacion: this.listParametro_eje[i]['fecha'],
                  id_curva_tendencia: id_curva,
                  nivel: this.listParametro_eje[i]['nivel'],
                  usuario_creacion: '',
                  usuario_modificacion: 'String',
                  fecha_modificacion: date,
                  id_informacion_grafica: '',
                  fechaFin: date,
                  id_aforo: this.listParametro_eje[i]['idAforo'],
                  n_aforo: this.listParametro_eje[i]['aforo_n']
                }
                this.servicioAforo
                  .guardarInformacionGrafica(infoGrafica)
                  .subscribe((response) => {



                  });





              };

            }
          });

      })




  }

  cancelar() {


    this.router.navigateByUrl('/configuracion/gestionTablas');
  }
  guardarCurva() {

    Swal.fire({
      title: 'Desea Guaradar la información?',
      text: 'Se almacenara la tabla a una curva de tendencia ',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Guardar',
    }).then((result) => {
      if (result.isConfirmed) {

        this.guardarCurvaInfo();

      }
    });



  };

  moficaAforo() {



    var cantidad = this.chartOptions.series[0].data;
    console.log(cantidad[var1]);
    cantidad[var1] = {
      x: var2,
      y: var3
    };
    this.listParametro_eje[var1]['caudal'] = var3;
    this.listParametro_eje[var1]['nivel'] = var2;
    this.chartOptions.series = [{
      name: "Nivel ",
      type: "scatter",
      data: cantidad
    },];


  };
  regresar() {

    location.reload();
  }
  guardarTabla() {

    var cantidad = this.chartOptions.series[0].data;
    console.log(cantidad[var1]);
    cantidad[var1] = {
      x: var2,
      y: var3
    };
    this.listParametro_eje[var1]['caudal'] = var3;
    this.listParametro_eje[var1]['nivel'] = var2;
    this.chartOptions.series = [{
      name: "Nivel ",
      type: "scatter",
      data: cantidad
    },];


  };



}
