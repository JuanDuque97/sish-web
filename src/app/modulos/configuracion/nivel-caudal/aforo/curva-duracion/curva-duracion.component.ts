import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { dominiosEnum } from 'src/app/modelo/enum/dominios-enum';
import { ServiciosDominiosValoresService } from '../../../dominios/servicios-dominios-valores.service';
import { ServiciosEstacionesService } from '../../../../elementos/estaciones/servicios-estaciones.service';
import { ServiciosGeograficosService } from 'src/app/common/mapa/servicios-geograficos.service';
import { ServiciosCapasService } from '../../../capas/servicios-capas.service';
import { capasEnum, capasEnumDatos } from 'src/app/modelo/enum/capas-enum';
import { ServiciosAforoService } from '../servicios-aforo.service';
import { IObtenerParametrosCurvaNivelCaudalRequest, IObtenerParametrosCurvaNivelCaudalResponse } from 'src/app/modelo/configuracion/curvaTendencia';
import Swal from 'sweetalert2';

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
import { IObtenerCurvaDuracionRequestDTO, IObtenerCurvaDuracionResponseDTO } from 'src/app/modelo/configuracion/aforo';

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
  selector: 'app-curva-duracion',
  templateUrl: './curva-duracion.component.html',
})

export class CurvaDuracionComponent implements OnInit {

  @ViewChild("chart") chart: ChartComponent;

  @ViewChild('modalEdicion', { static: false }) modalEdicion: ElementRef;

  public id: string = '0';
  public te: string = '0';
  public elemento: any = '1';
  public idElemento: any = '';
  public tipoElemento: number = 0;
  public CodigoEAAB: number = 0;
  public idParametro: any = '';
  public listaCodigoEAAB: any = [];
  public formularioFiltroAforo!: FormGroup;
  public listaCodigoIDEAM: any = [];
  public listaEntidad = [];
  public capas: any[] = [];
  public listaParametros: any[] = [];
  public fechaInicio: any = '';
  public fechaFin: any = '';
  public listaElemento: any = [];
  public usuario = JSON.parse(sessionStorage.getItem('usuario') || '{}');
  public listaMunicipios = [];
  public listaDepartamentos = [];
  private tempIdDepartamento: number = 0;
  public listaAreaHidrografica: [];
  public listaZonaHidrografica: [];
  public listaSubzonaHidrografica: [];
  public listaCuenca: [];
  public listaSubcuenca: [];
  public listaMicrocuenca: [];
  public chartOptions: Partial<ChartOptions>;
  public datePipe: DatePipe = new DatePipe('en-ES');
  public datosTabla: any[] = [];
  public caudalCalculado: any = '';
  public tipoRango: any = '';
  public idDepartamento: any = '';
  public idMunicipio: any = '';
  public idAreaHidrografica: any = '';
  public idZonaHidrografica: any = '';
  public idSubZonaHidrografica: any = '';
  public idCuenca: any = '';
  public idsubCuenca: any = '';
  public idMicroCuenca: any = '';
  public idEntidad: any = '';
  public mostrarFechas: boolean = false;

  columnas = [
    {
      title: 'Probabilidad de excedencia (%)', 
      data: 'porcentaje',
      /*
      'render': function (data: string, type: any, row: any, meta: any) {
        let valor = row.porcentaje;
        return (Math.round(valor * 100) / 100).toFixed(3);
      }
      */
    }, 
    {
      title: 'Caudal (㎥/s)', 
      data: 'caudal',
      'render': function (data: string, type: any, row: any, meta: any) {
        let valor = row.caudal;
        return (Math.round(valor * 100) / 100).toFixed(3);
      }
    }, 
    {
      title: 'Código IDEAM', 
      data: 'codigoIDEAM'
    },
    {
      title: 'Código EAAB', 
      data: 'codigoEAAB'
    },
    {
      title: 'Nombre estación', 
      data: 'nombreElemento'
    },
    {
      title: 'Fecha inicio', 
      data: 'fechaInicio'
    },
    {
      title: 'Fecha fin', 
      data: 'fechaFin'
    },
  ];

  botonesGenerales = [
    {
      text: 'Calcular',
      action: 'mostrarModal', 
      enabled: true,
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
    private formBuilder: FormBuilder,
    private serviciosEstacionesService: ServiciosEstacionesService,
    private serviciosDominiosValoresService: ServiciosDominiosValoresService,
    private serviciosGeograficosService: ServiciosGeograficosService,
    private serviciosCapasService: ServiciosCapasService,
    private servicioAforo: ServiciosAforoService,
  ) { }

  ngOnInit(): void {
    this.obtenerElementos('1');

    this.chartOptions = {
      series: [
        {
          name: "Caudales",
          data: []
        }
      ],
      chart: {
        height: 350,
        type: "line",
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "straight"
      },
      title: {
        text: "Curva Duración de Caudales",
        align: "left"
      },
      /*
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5
        }
      },
      */
      xaxis: {
        categories: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100], 
        title: {
          text: "Probabilidad de Excedencia (%)"
        }
      }, 
      yaxis: {
        title: {
          text: "Caudal (㎥/s)"
        },
      },
      markers: {
        size: 1
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: -25,
        offsetX: -5
      }
    };

    this.construirFormulario();

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

    this.cargarAreaHidrografica();
    this.onChanges();
  }

  private construirFormulario() {
    this.formularioFiltroAforo = this.formBuilder.group({
      idelemento: ['', [Validators.required]],
      idParametro: ['', [Validators.required]],
      codigoEstacionEaab: [''],
      idDepartamento: [''],
      idMunicipio: [''],
      idAreaHidrografica: [''],
      idZonaHidrografica: [''],
      idSubZonaHidrografica: [''],
      idCuenca: [''],
      idSubCuenca: [''],
      idMicroCuenca: [''],
      idEntidad: [''],
      fechaFin: [''],
      fechaInicio: [''],
      periodo: ['', [Validators.required]], 
    });
  }

  assertNullAndUndefined(value: any) {
    if (null == value || undefined == value) {
      return false;
    }

    return true;
  }

  obtenerParametros(idEstacion : any) {
    if ( !this.assertNullAndUndefined(idEstacion) || idEstacion.length<=0 ) {
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

  obtenerDatos(elemento: any) {
    if( !elemento.valid || 
      !this.assertNullAndUndefined(this.tipoRango) || 
      (this.tipoRango.length<=0) || 
      (this.tipoRango==2 && (!this.assertNullAndUndefined(this.fechaInicio) || !this.assertNullAndUndefined(this.fechaFin))) || 
      (this.tipoRango==2 && (this.fechaInicio.length<=0 || this.fechaFin.length<=0)) ) {

      Swal.fire(
        'Error', 
        'Hay campos obligatorios pendientes por diligenciar.', 
        'error'
      );
      return;
    }

    if ( this.tipoRango == 1 ) {
      this.fechaInicio = new Date(1900, 0, 1, 0, 0, 0);
      this.fechaFin = new Date(new Date().getFullYear(), 11, 31, 23, 59, 59);
    }

    if ( (this.tipoRango == 2) && (this.fechaInicio >= this.fechaFin) ) {
      Swal.fire({
        title: 'Fechas NO válidas', 
        html: 'La fecha inicio debe ser menor a la fecha final.', 
        icon: 'error',
      });
      return;
    }

    try {
      Swal.fire({
        title: 'Consultando datos...', 
        html: 'Por favor espere.', 
        timer: 42000, 
        timerProgressBar: true,
        allowOutsideClick: false, 
        showConfirmButton: false, 
        didOpen: async() => {
          Swal.showLoading();

          let request : IObtenerCurvaDuracionRequestDTO = {
            tipoElementoId: 466,
            elementoId: this.idElemento,
            parametroId: this.idParametro,
            fechaInicio: this.fechaInicio,
            fechaFin: this.fechaFin,
          };

          this.chartOptions.series = [{
            name: "Nivel ",
            type: "line",
            data: []
          },];
          
          this.servicioAforo.obtenerNuevaCurvaDuracion(request).subscribe(response => {
            this.datosTabla = response;

            let porcentajes : any[] = [];
            let caudales : any[] = [];
            this.datosTabla.forEach((dato : IObtenerCurvaDuracionResponseDTO)  => {
              porcentajes.push(dato.porcentaje);
              caudales.push(dato.caudal);
            });

            this.chartOptions = {
              series: [
                {
                  name: "Caudales",
                  data: caudales
                }
              ],
              chart: {
                height: 350,
                type: "line",
                zoom: {
                  enabled: false
                }
              },
              dataLabels: {
                enabled: false
              },
              stroke: {
                curve: "straight"
              },
              title: {
                text: "Curva Duración de Caudales",
                align: "left"
              },
              /*
              grid: {
                row: {
                  colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
                  opacity: 0.5
                }
              },
              */
              xaxis: {
                categories: porcentajes, 
                title: {
                  text: "Probabilidad de Excedencia (%)"
                }
              }, 
              yaxis: {
                title: {
                  text: "Caudal (㎥/s)"
                },
              },
              markers: {
                size: 1
              },
              legend: {
                position: "top",
                horizontalAlign: "right",
                floating: true,
                offsetY: -25,
                offsetX: -5
              }
            };

            Swal.close();
          });
        }, 
        willClose: async() => {
          Swal.hideLoading();
        }
      });
    } catch (error) {
      console.error('Error inesperado: ' + JSON.stringify(error));
    }
  }

  obtenerElementos(even: any) {
    if ( null==even || undefined==even || even.length<=0 ) {
      return;
    }

    if ( even == '1' ) {
      this.tipoElemento = 466;
    } else {
      this.tipoElemento = 467;
    }

    this.listaElemento = [];
    this.listaCodigoEAAB = [];
    this.listaCodigoIDEAM = [];

    switch (even) {
      // Estaciones
      case '1': {
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
                this.listaElemento = response.map((elemento: any) => ({
                  id: elemento.idEstacion,
                  text: elemento.estacion,
                  disabled: elemento.activo == 'S' ? false : true,

                  idDepartamento: elemento.idDepartamento,
                  idMunicipio: elemento.idMunicipio,

                  idAreaHidrografica: elemento.idAreaHidrografica,
                  idZonaHidrografica: elemento.idZonaHidrografica,
                  idSubZonaHidrografica: elemento.idSubZonaHidrografica,

                  idCuenca: elemento.idCuenca,
                  idSubCuenca: elemento.idSubCuenca,
                  idMicroCuenca: elemento.idMicroCuenca,

                  idEntidad: elemento.idEntidad,
                }));

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
        break;
      }
    }
  }

  obtenerParametrosElemento(event: any, mecanismo: any) {
    if (!this.assertNullAndUndefined(event) || event.length <= 0) {
      return;
    }

    switch (mecanismo) {
      // Estaciones
      case '1': {
        let estaciones = this.listaElemento.filter((elem : any) => {
          return elem.id == this.idElemento;
        });

        if ( this.assertNullAndUndefined(estaciones) && estaciones.length>0 && this.assertNullAndUndefined(estaciones[0]) ) {
          let estacion = estaciones[0];

          this.idDepartamento = estacion.idDepartamento;
          this.idMunicipio = estacion.idMunicipio;

          this.idAreaHidrografica = estacion.idAreaHidrografica;
          this.idZonaHidrografica = estacion.idZonaHidrografica;
          this.idSubZonaHidrografica = estacion.idSubZonaHidrografica;

          this.idCuenca = estacion.idCuenca;
          this.idsubCuenca = estacion.idSubCuenca;
          this.idMicroCuenca = estacion.idMicroCuenca;

          this.idEntidad = estacion.idEntidad;
        }

        this.obtenerParametros(this.idElemento);
        break;
      }

      default: {
        break;
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

  cambioDepartamento(depto: any) {
    if ( !this.assertNullAndUndefined(depto) || depto.length<=0 ) {
      return;
    }

    this.tempIdDepartamento = depto;
    this.cargarMunicipiosPorDepartamento();
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
        this.cargarMicroCuenca();
      });
    }
  }

  cargarAreaHidrografica() {
    this.serviciosCapasService
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
          });
      });
  }

  cargarZonaHidrografica() {
    if (this.areaHidrografica?.value) {
      this.serviciosCapasService
        .obtenerPorId(capasEnum.SubZonaHidrografica)
        .subscribe((response) => {
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
              this.listaSubzonaHidrografica = datos;
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
            this.listaMicrocuenca = datos;
          });
      });
  }

  cargarCapas() {
    this.serviciosCapasService
      .obtenerPorId(capasEnum.Zonificacion)
      .subscribe((response) => {
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
        this.capas.push({
          url: response.urlVisualizar,
          id: capasEnumDatos(capasEnum.Estaciones).id,
          visible: true,
          titulo: capasEnumDatos(capasEnum.Estaciones).titulo,
        });
      });
  }

  cancelar() {
    this.datosTabla = [];
    this.chartOptions.series = [];
    this.formularioFiltroAforo.reset();
  }

  regresar() {
    location.reload();
  }

  onCalcularCaudal() {
    this.caudalCalculado = '';

    let input : any = document.getElementById('miPorcentaje');
    if ( !this.assertNullAndUndefined(input) || !this.assertNullAndUndefined(input.value) ) {
      return;
    }

    let requestedPercent : number = parseFloat(input.value);

    if ( !(requestedPercent>=0 && requestedPercent<=100) ) {
      Swal.fire(
        'Error', 
        'El valor solicitado NO es válido. Solo se permiten valores entre [0-100].', 
        'error'
      );
      return;
    }

    let maxPercent=-1, minPercent=Number.MAX_VALUE, minCaudal=Number.MAX_VALUE, maxCaudal=-1;
    if ( this.assertNullAndUndefined(this.datosTabla) && this.datosTabla.length> 0 ) {
      maxPercent = this.datosTabla[this.datosTabla.length-1].porcentaje;
      maxCaudal = this.datosTabla[0].caudal;

      minPercent = this.datosTabla[0].porcentaje;
      minCaudal = this.datosTabla[this.datosTabla.length-1].caudal;
    }

    if ( -1 == maxPercent ) {
      Swal.fire(
        'Error', 
        'No hay datos para realizar el cálculo.', 
        'error'
      );
      return;
    }

    // y = y1 + [(y2-y1)/(x2-x1) * (x-x1)]
    let x1 = minPercent;
    let y1 = maxCaudal;

    let x2 = maxPercent;
    let y2 = minCaudal;

    let x = requestedPercent;

    this.caudalCalculado = y1 + (((y2-y1)/(x2-x1)) * (x-x1));
    this.caudalCalculado = (Math.round(this.caudalCalculado * 100) / 100).toFixed(3);
  }

  mostrarModal() {
    this.modalEdicion.nativeElement.click();
  }

  accionGeneral(event : any) {
    if ( !this.assertNullAndUndefined(event) ||  event.length<=0 ) {
      return;
    }

    switch (event) {
      case 'mostrarModal':
        this.mostrarModal();
        break;

      default:
        break;
    }
  }

  onCerrarModal() {
    let input : any = document.getElementById('miPorcentaje');
    if ( !this.assertNullAndUndefined(input) || !this.assertNullAndUndefined(input.value) ) {
      return;
    }

    input.value = '';
    this.caudalCalculado = '';
  }

  onPeriodoChange(event : any) {
    if ( !this.assertNullAndUndefined(event) || event.length<=0 ) {
      return;
    }

    this.tipoRango = '';
    this.fechaInicio = '';
    this.fechaFin = '';

    let dato = parseInt(event.target.value);
    switch(dato) {
      case 1:
        this.mostrarFechas = false;
        this.tipoRango = '1';
        break;

      case 2:
        this.mostrarFechas = true;
        this.tipoRango = '2';
        break;

      default:
        break;
    }
  }
}
