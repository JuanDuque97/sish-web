import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { estados } from 'src/app/common/utils/constantes';

import { LegendPosition } from '@swimlane/ngx-charts';
import { ServiciosDominiosValoresService } from 'src/app/modulos/configuracion/dominios/servicios-dominios-valores.service';
import { dominiosEnum } from 'src/app/modelo/enum/dominios-enum';
import { ServiciosEstacionesService } from 'src/app/modulos/elementos/estaciones/servicios-estaciones.service';
import { ServiciosParametrosEstacionesService } from 'src/app/modulos/elementos/estaciones/servicios-parametros-estaciones.service';
import { ServiciosPublicarInformacionService } from '../servicios-pubilcar-Iinformacion.service';
import Swal from 'sweetalert2';
import { param } from 'jquery';

@Component({
  selector: 'app-consultar-precipitacion',
  templateUrl: './consultar-precipitacion.component.html',
})
export class ConsultarPrecipitacionComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private serviciosDominiosValoresService: ServiciosDominiosValoresService,
    private serviciosEstacionesService: ServiciosEstacionesService,
    private sercioparametrosestacion: ServiciosParametrosEstacionesService,
    private serviciosPublicarInformacionService: ServiciosPublicarInformacionService
  ) { }
  public idElemento: number = 0;
  mapCenter = [-73.9, 4.4];
  basemapType = 'topo';
  mapZoomLevel = 9;
  fechaActual: string;

  @ViewChild('ModalResul', { static: false }) ModalResul: ElementRef;

  NombreParametro: string = '';
  NombreFrecuencia: string = '';

  public formularioFiltro!: FormGroup;
  public listaEstacion: any = [];
  public listaCodigoEAAB: any = [];
  public listaCodigoIDEAM: any = [];

  public listaFrecuenciaXParametro: any = [];

  public NombresParametros: any[] = [];
  public Parametros: any = [
    { id: 1, text: 'Precipitación', disabled: true },
    { id: 2, text: 'Temperatura', disabled: true },
    { id: 3, text: 'Humedad  Relativa', disabled: true },
    { id: 4, text: 'Presión Atmosférica', disabled: true },
    { id: 5, text: 'Radiación Solar', disabled: true },
    { id: 6, text: 'Punto de Rocío', disabled: true },
    { id: 7, text: 'Caudales', disabled: true },
    { id: 8, text: 'Niveles', disabled: true },
    { id: 9, text: 'Evaporación', disabled: true },
    { id: 10, text: 'Brillo Solar', disabled: true },
    { id: 11, text: 'Viento', disabled: true },
  ];

  public listaFrecuencia: any = [
    { id: 207, text: 'Máxima 24 horas', idParametro: 1, disabled: true },
    { id: 323, text: 'Precipitación número de días', idParametro: 1, disabled: true },
    { id: 209, text: 'Total Diario ', idParametro: 1, disabled: true },
    { id: 210, text: 'Total Mensual', idParametro: 1, disabled: true },
    { id: 129, text: 'Media Diaria ', idParametro: 2, disabled: true },
    { id: 130, text: 'Mínima Diaria ', idParametro: 2, disabled: true },
    { id: 140, text: 'Media Diaria ', idParametro: 2, disabled: true },
    { id: 529, text: 'Media Mensual ', idParametro: 2, disabled: true },
    { id: 195, text: 'Media Diaria', idParametro: 3, disabled: true },
    { id: 193, text: 'Media Mensual', idParametro: 3, disabled: true },
    { id: 211, text: 'Diaria', idParametro: 4, disabled: true },
    { id: 212, text: 'Mensual', idParametro: 4, disabled: true },
    { id: 220, text: 'Diaria', idParametro: 5, disabled: true },
    { id: 221, text: 'Media Mensual', idParametro: 5, disabled: true },
    { id: 222, text: 'Mensual', idParametro: 5, disabled: true },
    { id: 217, text: 'Diaria', idParametro: 6, disabled: true },
    { id: 218, text: 'Mensual', idParametro: 6, disabled: true },
    { id: 218, text: 'Media Mensual', idParametro: 6, disabled: true },
    { id: 171, text: 'Instantáneos', idParametro: 7, disabled: true },
    { id: 172, text: 'máximos Instantáneos', idParametro: 7, disabled: true },
    { id: 162, text: 'Medios Diarios', idParametro: 7, disabled: true },
    { id: 163, text: 'Medios Mensuales', idParametro: 7, disabled: true },
    { id: 175, text: 'Mínimo Absolutos', idParametro: 7, disabled: true },
    { id: 68, text: 'Instantáneos', idParametro: 8, disabled: true },
    { id: 202, text: 'Máximo Absolutos Mensuales', idParametro: 8, disabled: true },
    { id: 203, text: 'Medios Diarios', idParametro: 8, disabled: true },
    { id: 204, text: 'Medios Mensuales', idParametro: 8, disabled: true },
    { id: 191, text: 'Diaria', idParametro: 9, disabled: true },
    { id: 192, text: 'Mensual', idParametro: 9, disabled: true },
    { id: 165, text: 'Total Diario', idParametro: 10, disabled: true },
    { id: 166, text: 'Total Mensual', idParametro: 10, disabled: true },
  ];
  public listPeriodo: any[] = [
    {
      id: 2,
      text: 'Disponible',
    },
    {
      id: 1,
      text: 'Establecer Rango',
    },
  ];
  public idestacion: number;
  public serie: string;
  public NombreEstacion: any;
  public Periodo: string;

  public fechaMinima: string;
  public fechaMaxima: string;
  public fechaInicio: string;

  public tipoperiodo: number;
  public ArrayEstaciones: any = [];
  datosSerieMes = [] as any;

  listTipoEstacion: any = [];

  // graficos

  viewMensual: [number, number] = [1000, 500];
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
  etiquetaEjeX = 'Mes';
  etiquetaEjeY = '';

  //xAxisLabel: string = 'Country';
  yAxisLabelMensual: string;
  colorScheme: any = {
    domain: ['blue', 'orange', 'red'],
  };

  datosFilter = [] as any;
  columnas = [
    {
      title: 'Estación',
      data: 'estacion',
      class: 'text-center',
    },
    {
      title: 'Fecha',
      data: 'fecha',
      class: 'text-center',
    },
    {
      title: 'Valor',
      data: 'valor',
      class: 'text-center',
    },

    {
      title: 'Parámetro',
      data: 'nombreParametro',
      class: 'text-center',
    },

    {
      title: 'Unidad de medida',
      data: 'unidadMedida',
      class: 'text-center',
    },

    // activo
    // codigoEstacionEaab
    // codigoEstacionIdeam
    // idEstacion
    // idEstadiObservacion
    // idFlagObservacion
    // idObservacionXEstacionInicial
    // idParametro
    // idParametroXEstacion
    // idTipoEstacion
  ];

  listMeses = [
    { id: 1, text: 'Enero' },
    { id: 2, text: 'Febrero' },
    { id: 3, text: 'Marzo' },
    { id: 4, text: 'Abril' },
    { id: 5, text: 'Mayo' },
    { id: 6, text: 'Junio' },
    { id: 7, text: 'Julio' },
    { id: 8, text: 'Agosto' },
    { id: 9, text: 'Septiembre' },
    { id: 10, text: 'Octubre' },
    { id: 11, text: 'Noviembre' },
    { id: 12, text: 'Diciembre' },
  ];

  get idperiodo() {
    return this.formularioFiltro.get('idperiodo');
  }

  get estacion() {
    return this.formularioFiltro.get('idestacion');
  }
  get idtipoEstacion() {
    return this.formularioFiltro.get('idtipoEstacion');
  }
  get idparametro() {
    return this.formularioFiltro.get('idparametro');
  }

  ngOnInit(): void {
    this.serviciosDominiosValoresService
      .obtenerTotalValoresPorIdDominio(dominiosEnum.CategoriasEstacion)
      .subscribe((response) => {
        this.listTipoEstacion = response;
      });

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
            // console.log('estaciones', response);
            var Array: any = [];
            response.forEach(function (element, index, array) {
              if (element.activo == 'S') {
                Array.push(element);
              }
            });
            // console.log('llegaron estaciones', Array);
            this.ArrayEstaciones = Array;
            Swal.close();

            console.timeEnd('executionTime');
          });
      }, willClose: async () => {
        Swal.hideLoading();
      }

    });

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
  }

  private construirFormulario() {
    this.formularioFiltro = this.formBuilder.group({
      idtipoEstacion: ['', [Validators.required]],
      idestacion: ['', [Validators.required]],
      idperiodo: ['', [Validators.required]],
      parametro: [''],
      idparametro: ['', [Validators.required]],
      fechaInicio: [''],
      fechaFin: [''],
    });
  }

  obtenerLista(estacion: any) {
    let parametroActivo = 0;

    this.Parametros.forEach((element: any) => {
      element.disabled = true;
    });


    if (estacion != '' && estacion != undefined) {
      this.NombresParametros = [];
      this.sercioparametrosestacion
        .obtenerListaParametros(estacion)
        .subscribe((response) => {
          // Validar Freciencias en la estacion
          for (let index = 0; index < response.length; index++) {
            const element = response[index];
            for (let index = 0; index < this.listaFrecuencia.length; index++) {
              const element2 = this.listaFrecuencia[index];
              if (element2.id == element.idParametro) {
                this.listaFrecuencia[index].disabled = false;

                parametroActivo = this.listaFrecuencia[index].idParametro;
                //  console.log('lista Parametros Activos ', this.listaFrecuencia[index]);

                //  activar Parametros por Estacion
                this.Parametros.forEach((element: any) => {
                  if (element.id == parametroActivo) {
                    element.disabled = false;
                  }

                });

              }
            }
          }




          this.NombresParametros = this.Parametros;
        });

      // console.log('lista frecuencias ', this.NombresParametros);
    }
  }

  obtenerParametros(parametro: number) {
    this.listaFrecuenciaXParametro = [];
    this.listaFrecuenciaXParametro = this.listaFrecuencia.filter(function (
      list: any
    ) {
      return list.idParametro == parametro;
    });
    // console.log('lista freciencia',this.listaFrecuenciaXParametro)
  }

  obtenerEstaciones(parametro: number) {
    // console.log('tipo estacion', this.ArrayEstaciones);

    var estacionesActivas = this.ArrayEstaciones.filter(function (list: any) {
      return list.idCategoria == parametro;
    });

    this.listaEstacion = estacionesActivas.map((elemento: any) => ({
      id: elemento.idEstacion,
      text: elemento.estacion,
      disabled: elemento.activo == 'S' ? false : true,
    }));

    this.listaCodigoEAAB = estacionesActivas.map((elemento: any) => ({
      id: elemento.idEstacion,
      text: elemento.codigoEstacionEaab,
      disabled: elemento.activo == 'S' ? false : true,
    }));

    this.listaCodigoIDEAM = estacionesActivas.map((elemento: any) => ({
      id: elemento.idEstacion,
      text: elemento.codigoEstacionIdeam,
      disabled: elemento.activo == 'S' ? false : true,
    }));
  }

  datosGrafico() {
    this.Mensual = [];

    console.log('datosSerieMes', this.datosSerieMes);
    this.yAxisLabelMensual = 'Precipitacion Mensual ';

    for (let index = 0; index < this.datosSerieMes.length; index++) {
      // if (anioActual == this.datosSerieMes[index].anio) {
      var mes = this.listMeses.find(
        (element: any) => element.id == this.datosSerieMes[index].mes
      );
      console.log(JSON.stringify(mes));


      this.Mensual.push({
        name: mes?.text,
        series: [
          {
            name: 'maximo',
            value: this.datosSerieMes[index].valorMax,
          },
          {
            name: 'Minimo',
            value: this.datosSerieMes[index].valorMin,
          },
          {
            name: 'Promedio',
            value: this.datosSerieMes[index].promedio,
          },
        ],
      });
      // }
    }
    // console.log('meses', this.Mensual);
  }

  guardar() {
    //this.fechaMinima = null;
    //this.fechaMaxima = null;

    this.NombreEstacion = '';
    this.serie = '';
    if (this.formularioFiltro.valid) {
      const found = this.listaEstacion.find(
        (element: any) => element.id == this.formularioFiltro.value.idestacion
      );

      const found2 = this.NombresParametros.find(
        (element: any) => element.id == this.formularioFiltro.value.parametro
      );
      const found3 = this.listaFrecuencia.find(
        (element: any) => element.id == this.formularioFiltro.value.idparametro
      );
      this.NombreEstacion = found.text;
      this.serie = found2.text + ' ' + found3.text;

      this.NombreParametro = found2.text;
      this.NombreFrecuencia = found3.text;

      var datos = this.formularioFiltro.value;

      Swal.fire({
        
        title: 'Cargando Información...',
        html: 'Por favor espere',
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          console.time('executionTime')
          Swal.showLoading();
          
          this.serviciosPublicarInformacionService
            .obtenerDTO(this.formularioFiltro.value)
            .subscribe((res) => {
              //  console.log('llegaron normales', res);
              this.datosFilter = res;

              if (null != this.datosFilter && undefined != this.datosFilter && this.datosFilter.length > 0) {
                let elemento = this.datosFilter[0];
                this.etiquetaEjeY = elemento.nombreParametro + ' (' + elemento.unidadMedida.toLowerCase() + ')';
              } else {
                this.etiquetaEjeY = '';
              }

              //let copia : any[] = [...this.datosFilter];

              /*
              copia.forEach(miDato => {
                let idParam = miDato.idParametro;
                let nombre: any = this.NombresParametros.filter(param => {
                  // let myParam :any= JSON.stringify(param);
                  //let myParam = param.map(function(obj : any) { return obj["text"]; });
                  //console.log("Parametro: " + myParam.text);
                  //console.log("Parametro: " + myParam);
                  return param.id == idParam;
                });
                
                miDato['nombreParametro'] = nombre.text;
              });
              */

              //this.datosFilter = copia;
              //console.log(this.datosFilter);

              this.serviciosPublicarInformacionService
                .obtenetDTOFechas(this.formularioFiltro.value)
                .subscribe((res) => {
                  this.fechaMinima = res.fechaMinima;
                  this.fechaMaxima = res.fechaMaxima;

                  this.serviciosPublicarInformacionService
                    .obtenerPromedio(datos)
                    .subscribe((resPromedio) => {
                      //  console.log('llegaron promedios', resPromedio);
                      this.datosSerieMes = resPromedio;
                      this.datosGrafico();
                    });
                });
                Swal.close();

                console.timeEnd('executionTime');
              });
        },
        willClose: () => {

          console.log('Fecha maxima: ' + this.fechaMaxima);
          console.log('Fecha minima: ' + this.fechaMinima);

          if (this.datosFilter.length >= 1) {
            this.ModalResul.nativeElement.click();
            this.formularioFiltro.reset();

          } else {
            const Toast = Swal.mixin({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
              }
            })

            Toast.fire({
              icon: 'info',
              title: 'No se Encontraron Datos Con los Filtros Asignados ',
            })

          }

        },
      }).then((result) => { });
    }
  }

  limpiar() {
    this.formularioFiltro.reset()
  }

}
