import { Component, ElementRef, OnInit ,ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ServiciosEmbalcesService } from '../../../../elementos/embalses/servicios-embalses.service';
import { ServiciosEstacionesService } from '../../../../elementos/estaciones/servicios-estaciones.service';
import { ServiciosAforoService} from '../servicios-aforo.service';
import { ICurvaDuracionActualizacionRequest, ICurvaDuracionDetalleDTO, ICurvaDuracionPorFechasRequest } from 'src/app/modelo/configuracion/curvaDuracion';
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
  selector: 'app-curva-duracion-ajuste',
  templateUrl: './curva-duracion-ajuste..component.html',
})

export class CurvaDuracionAjusteComponent implements OnInit {

  @ViewChild("chart") chart: ChartComponent;
  @ViewChild('modalEdicion', { static: false }) modalEdicion: ElementRef;

  public datosTabla : any[] = [];
  public elemento: number = 0;
  public idElemento: number = 0;
  public listaCodigoEAAB: any = [];
  public formularioFiltroAforo!: FormGroup;
  public listaCodigoIDEAM: any = []; 
  public listaCurvas: any = [];
  public idCurvaDuracion : any = '';
  public fechaInicio: Date;
  public fechaFin : Date;

  public detalleRegistro : any = {
    fechaGrupo: '', 
    promedioCaudal: '',
    cantidadCaudal : '',
    porcentaje : '',
    numeroAforo : '', 
    nombreElemento : '',
  };

  public listaElemento: any = [];
  public usuario = JSON.parse(sessionStorage.getItem('usuario') || '{}');
  public chartOptions: Partial<ChartOptions>;
  public datePipe: DatePipe = new DatePipe('en-ES');

  public columnas = [
    {
      title: 'idCurvaDuracionDetalle', 
      data: 'idCurvaDuracionDetalle', 
      visible: false,
    }, 
    {
      title: 'Fecha',
      data: 'fechaGrupo',
    },
    {
      title: 'Promedio Calculo',
      data: 'promedioCaudal',
    },
    {
      title: 'Cantidad Caudal Calculo',
      data: 'cantidadCaudal',
    },
    {
      title: 'Porcentaje',
      data: 'porcentaje',
    },
    {
      title: 'Numero Aforo',
      data: 'numeroAforo',
      'render': function (data: string, type: any, row: any, meta: any) {
        let numeroAforo = row.numeroAforo;
        if ( null==numeroAforo || undefined==numeroAforo || numeroAforo<0 ) {
          return '';
        }

        return '' + numeroAforo;
      }
    },
    {
      title: 'Elemento',
      data: 'nombreElemento',
    }
  ];

  botones = [
    {
      class: 'sish-boton-azul-claro',
      title: 'Consultar',
      action: 'consultarDetalle',
      icon: 'fas fa-glasses', 
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
 
  get curvaDuracionFiltro() {
    return this.formularioFiltroAforo.get('curvaDuracionCTR');
  }

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private serviciosEstacionesService: ServiciosEstacionesService,
    private serviciosEmbalcesService: ServiciosEmbalcesService,
    private servicioAforo:ServiciosAforoService,
  ) {}

  ngOnInit(): void {
    
    this.chartOptions = {
      series: [],
      chart: {
        height: 350,
        id: 'chartf',
        type: 'line',
        events: {
          markerClick(event:any, chartContext:any, config:any) {
            var1 = config.dataPointIndex;
            let div:any=document.getElementById(`btn`);
            div.click();
          }
        }
      },
      title: {
        text: "Curva de Duración",
        align: "left"
      },
      xaxis: {
        title: {
          text: 'Fecha',
        },
        labels: {
          formatter: function(val:any) {
            return parseFloat(val).toFixed(1)
          }
        }
      },
      yaxis: {
        title: {
          text: 'Caudal (Q) (㎥/s)',
         },
      }
    };
    this.chartOptions.chart.events['dataPointSelection'] = this.dataPointSelection;
    this.construirFormulario();
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
      fechaFinCTR: [''],
      fechaInicioCTR: [''],
      media: [''],
      curvaDuracionCTR: [''],
    });
  }
  
  assertNullAndUndefined(value : any) {
    if ( null==value || undefined==value ) {
      return false;
    }

    return true;
  }

  onCurvaDuracionChange(event : any) {
    if ( !this.assertNullAndUndefined(event) || event.length<=0 ) {
      return;
    }

    this.idCurvaDuracion = event;
  }

  onFechaInicioChange(event : any) {
    if ( !this.assertNullAndUndefined(event) ) {
      return;
    }

    if ( !this.assertNullAndUndefined(this.fechaInicio) && !this.assertNullAndUndefined(this.fechaFin) ) {
      return;
    }

    if ( !this.assertNullAndUndefined(this.fechaInicio) ) {
      return;
    }

    if ( !this.assertNullAndUndefined(this.fechaFin) ) {
      return;
    }

    /*
    if ( !this.assertNullAndUndefined(this.fechaFin) ) {
      this.fechaFin = new Date();
    }
    */

    // "2023-01-01T00:00"
    /*
    let fechaInicioSTR : any = this.fechaInicio;
    if ( typeof(fechaInicioSTR) === 'string' && fechaInicioSTR.length>0 ) {
      let tokens = fechaInicioSTR.split('T');
      
      let fechaTokens = tokens[0].split('-');
      let year = parseInt(fechaTokens[0]);
      let month = parseInt(fechaTokens[1]);
      let date = parseInt(fechaTokens[2]);

      let horaTokens = tokens[1].split(':');
      let hours = parseInt(horaTokens[0]);
      let minutes = parseInt(horaTokens[1]);

      this.fechaInicio = new Date(year, month-1, date, hours, minutes, 0);
    }
    */

    // "2023-01-01T00:00"
    /*
    let fechaFinSTR : any = this.fechaFin;
    if ( typeof(fechaFinSTR) === 'string' && fechaFinSTR.length>0 ) {
      let tokens = fechaFinSTR.split('T');
      
      let fechaTokens = tokens[0].split('-');
      let year = parseInt(fechaTokens[0]);
      let month = parseInt(fechaTokens[1]);
      let date = parseInt(fechaTokens[2]);

      let horaTokens = tokens[1].split(':');
      let hours = parseInt(horaTokens[0]);
      let minutes = parseInt(horaTokens[1]);

      this.fechaFin = new Date(year, month-1, date, hours, minutes, 59);
    }
    */

    let idTipoElemento = this.elemento == 1 ? 466 : 467;

    if ( this.fechaInicio >= this.fechaFin ) {
      Swal.fire({
        icon: 'error',
        title: 'Fecha de inicio NO válida', 
        html: 'La fecha de inicio no puede ser mayor o igual a la fecha final.',
        confirmButtonText: 'Salir',
      });
      return;
    }

    console.log('-- ------------------------------');
    console.log('onFechaInicioChange()...');
    console.log('-- ------------------------------');
    console.log('Elemento: ' + this.elemento);
    console.log('ID Tipo Elemento: ' + idTipoElemento);
    console.log('Fecha Inicio: ' + this.fechaInicio);
    console.log('Fecha Fin: ' + this.fechaFin);
    console.log('-- ------------------------------');

    Swal.fire({
      title: 'Cargando curvas de Duración...', 
      html: 'Por favor espere.', 
      timer: 42000, 
      timerProgressBar: true, 
      allowOutsideClick: false, 
      showConfirmButton: false,
      didOpen: async() => {
        Swal.showLoading();

        let request : ICurvaDuracionPorFechasRequest = {
          idTipoElemento: idTipoElemento,
          idElemento: this.idElemento,
          fechaInicio: this.fechaInicio,
          fechaFinal: this.fechaFin,
        };

        this.servicioAforo.obtenerCurvasDuracionPorFechasCreacion(request).subscribe(response => {
          this.listaCurvas = [];

          let elementos = this.listaElemento.filter((elemento : any) => {
            return elemento.id == this.idElemento;
          });

          let nombreElemento = '';
          if ( this.assertNullAndUndefined(elementos) && elementos.length>0 ) {
            nombreElemento = ' - ' + elementos[0].text;
          }

          response.forEach((curva : any) => {
            let item = {
              id: curva.idCurvaDuracion, 
              text: '' + curva.consecutivo + ' - ' + curva.idCurvaDuracion + nombreElemento, 
              disabled: curva.estado !== 'ACTIVO',
            };
            
            this.listaCurvas.push(item);
          });

          Swal.close();
        });
      }, 
      willClose: async() => {
        Swal.hideLoading();
      }
    });
  }

  onFechaFinChange(event : any) {
    if ( !this.assertNullAndUndefined(event) ) {
      return;
    }

    if ( !this.assertNullAndUndefined(this.fechaInicio) && !this.assertNullAndUndefined(this.fechaFin) ) {
      return;
    }

    if ( !this.assertNullAndUndefined(this.fechaInicio) ) {
      return;
    }

    if ( !this.assertNullAndUndefined(this.fechaFin) ) {
      return;
    }

    // "2023-01-01T00:00"
    /*
    let fechaInicioSTR : any = this.fechaInicio;
    if ( (typeof(fechaInicioSTR) === 'string') && (fechaInicioSTR.length>0) ) {
      let tokens = fechaInicioSTR.split('T');
      
      let fechaTokens = tokens[0].split('-');
      let year = parseInt(fechaTokens[0]);
      let month = parseInt(fechaTokens[1]);
      let date = parseInt(fechaTokens[2]);

      let horaTokens = tokens[1].split(':');
      let hours = parseInt(horaTokens[0]);
      let minutes = parseInt(horaTokens[1]);

      this.fechaInicio = new Date(year, month-1, date, hours, minutes, 0);
    }
    */

    // "2023-01-01T00:00"
    /*
    let fechaFinSTR : any = this.fechaFin;
    if ( (typeof(fechaFinSTR) === 'string') && (fechaFinSTR.length>0) ) {
      let tokens = fechaFinSTR.split('T');
      
      let fechaTokens = tokens[0].split('-');
      let year = parseInt(fechaTokens[0]);
      let month = parseInt(fechaTokens[1]);
      let date = parseInt(fechaTokens[2]);

      let horaTokens = tokens[1].split(':');
      let hours = parseInt(horaTokens[0]);
      let minutes = parseInt(horaTokens[1]);

      this.fechaFin = new Date(year, month-1, date, hours, minutes, 59);
    }
    */

    let idTipoElemento = this.elemento == 1 ? 466 : 467;

    if ( this.fechaInicio >= this.fechaFin ) {
      Swal.fire({
        icon: 'error',
        title: 'Fecha de inicio NO válida', 
        html: 'La fecha de inicio no puede ser mayor o igual a la fecha final.',
        confirmButtonText: 'Salir',
      });
      return;
    }

    console.log('-- ------------------------------');
    console.log('onFechaFinChange()...');
    console.log('-- ------------------------------');
    console.log('Elemento: ' + this.elemento);
    console.log('ID Tipo Elemento: ' + idTipoElemento);
    console.log('Fecha Inicio: ' + this.fechaInicio);
    console.log('Fecha Fin: ' + this.fechaFin);
    console.log('-- ------------------------------');

    Swal.fire({
      title: 'Cargando curvas de Duración...', 
      html: 'Por favor espere.', 
      timer: 42000, 
      timerProgressBar: true, 
      allowOutsideClick: false, 
      showConfirmButton: false,
      didOpen: async() => {
        Swal.showLoading();

        let request : ICurvaDuracionPorFechasRequest = {
          idTipoElemento: idTipoElemento,
          idElemento: this.idElemento,
          fechaInicio: this.fechaInicio,
          fechaFinal: this.fechaFin,
        };

        this.servicioAforo.obtenerCurvasDuracionPorFechasCreacion(request).subscribe(response => {
          this.listaCurvas = [];

          let elementos = this.listaElemento.filter((elemento : any) => {
            return elemento.id == this.idElemento;
          });

          let nombreElemento = '';
          if ( this.assertNullAndUndefined(elementos) && elementos.length>0 ) {
            nombreElemento = ' - ' + elementos[0].text;
          }
    
          response.forEach((curva : any) => {
            let item = {
              id: curva.idCurvaDuracion, 
              text: '' + curva.consecutivo + ' - ' + curva.idCurvaDuracion + nombreElemento, 
              disabled: curva.estado !== 'ACTIVO',
            };
            
            this.listaCurvas.push(item);
          });

          Swal.close();
        });
      }, 
      willClose: async() => {
        Swal.hideLoading();
      }
    });
  }

  obtener() {
    try {
      if ( !this.assertNullAndUndefined(this.idCurvaDuracion) || this.idCurvaDuracion.length<=0 ) {
        Swal.fire({
          icon: 'error', 
          title: 'Curva de duración NO válida',
          confirmButtonText: 'Salir',
          html: 'Por favor seleccione una curva de duración válida.', 
        });
        return;
      }

      Swal.fire({
        title: 'Cargando datos...', 
        html: 'Por favor espere.', 
        timer: 42000, 
        timerProgressBar: true, 
        allowOutsideClick: false, 
        showConfirmButton: true,
        didOpen: async() => {
          Swal.showLoading();

          this.servicioAforo.obtenerDetallesPorCurvaDuracion(this.idCurvaDuracion).subscribe((response) => {
            this.datosTabla = response;
    
            if ( !this.assertNullAndUndefined(this.datosTabla) || this.datosTabla.length<=0 ) {
              Swal.fire({
                title: 'No sé encontro datos!!',
                icon: 'error', 
                confirmButtonText: 'Salir',
              });
    
              return;
            }
    
            this.chartOptions.series = [{
              name: "Nivel ",
              type: "line",
              data: []
            }];
            
            let promedios = [];
            let fechas = [];
            let x; var y;
            
            for ( let i=0; i<this.datosTabla.length; i++ ) {
              x =  this.datosTabla[i]['fechaGrupo'];
              y =  this.datosTabla[i]['promedioCaudal'];
              
              fechas.push(x);
              promedios.push((Math.round(y * 100) / 100).toFixed(2));
            }
            
            this.chartOptions.series = [{
              name: "Fecha ", 
              type: "line",
              data: promedios
            }];
            
          
            this.chartOptions.xaxis = {
             categories: fechas
            };
            
            this.chartOptions.chart.events['dataPointSelection'] = this.dataPointSelection;

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
    this.listaElemento = [];
    this.listaCodigoEAAB = [];
    this.listaCodigoIDEAM = [];

    switch (even) {
      // Estaciones
      case 1:
      case '1': {
        Swal.fire({
          title: 'Cargando Estaciones...', 
          html: 'Por favor espere.', 
          timer: 42000, 
          timerProgressBar: true, 
          allowOutsideClick: false, 
          showConfirmButton: false, 
          didOpen: async() => {
            Swal.showLoading();

            this.formularioFiltroAforo.value.idelemento = 466;

            this.serviciosEstacionesService
              .obtenerEstaciones()
              .subscribe((response) => {
                this.listaElemento = response.map((elemento: any) => ({
                  id: elemento.idEstacion,
                  text: elemento.estacion,
                  disabled: elemento.activo == 'S' ? false : true,
                }));
                
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
      case 2:
      case '2': {
        Swal.fire({
          title: 'Cargando Embalses...', 
          html: 'Por favor espere.', 
          timer: 42000, 
          timerProgressBar: true, 
          allowOutsideClick: false, 
          showConfirmButton: false, 
          didOpen: async() => {
            Swal.showLoading();

            this.formularioFiltroAforo.value.idelemento = 467;

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

  obtenerCurvasPorElemento(idElemento: number, tipoElemento: any) {
    if ( !this.assertNullAndUndefined(idElemento) || idElemento<=0 ) {
      return;
    }

    if ( !this.assertNullAndUndefined(tipoElemento) || tipoElemento.length<=0 ) {
      return;
    }

    switch (tipoElemento) {

      // Estaciones...
      case 1:
      case '1':
        Swal.fire({
          title: 'Cargando curvas de Duración...', 
          html: 'Por favor espere.', 
          timer: 42000, 
          timerProgressBar: true, 
          allowOutsideClick: false, 
          showConfirmButton: false, 
          didOpen: async() => {
            Swal.showLoading();

            let idTipoElemento = 466;
            this.servicioAforo.obtenerCurvasDuracionPorElemento(idTipoElemento, idElemento).subscribe((response) => {
              this.listaCurvas = [];

              let elementos = this.listaElemento.filter((elemento : any) => {
                return elemento.id == this.idElemento;
              });

              let nombreElemento = '';
              if ( this.assertNullAndUndefined(elementos) && elementos.length>0 ) {
                nombreElemento = ' - ' + elementos[0].text;
              }

              response.forEach((curva : any) => {
                let item = {
                  id: curva.idCurvaDuracion, 
                  text: '' + curva.consecutivo + ' - ' + curva.idCurvaDuracion + nombreElemento, 
                  disabled: curva.estado !== 'ACTIVO',
                };
                
                this.listaCurvas.push(item);
              });

              Swal.close();
            });
          }, 
          willClose: async() => {
            Swal.hideLoading();
          }
        });
        break;

      // Embalses...
      case 2:
      case '2':
        break;

      default:
        break;
    }
  }

  accionRegistroColumnas(e: any) {
    switch (e.accion) {
      case 'consultarDetalle': {
        this.consultarDetalle(e);
        break;
      }

      default:
        break;
    }
  }



  dataPointSelection(event: any, chartContext:any, config:any) {


    console.log(event,chartContext,config ,config.dataPointIndex);
    var1 = config.dataPointIndex;
    let div:any=document.getElementById(`btn`);
    div.click();
  }

  infoAforo() {
    this.detalleRegistro = this.datosTabla[var1];
    this.modalEdicion.nativeElement.click();
  }

    guardarCurvaInfo() {
      Swal.fire({
        title: 'Actualizando registros...', 
        html: 'Por favor espere.', 
        timer: 42000, 
        timerProgressBar: true, 
        allowOutsideClick: false, 
        showConfirmButton: false, 
        didOpen: async() => {
          Swal.showLoading();

          let detalles : ICurvaDuracionDetalleDTO[] = [];

          this.datosTabla.forEach(dato => {
            let dto: ICurvaDuracionDetalleDTO = {
              idCurvaDuracionDetalle: dato.idCurvaDuracionDetalle,
              idCurvaDuracion: dato.idCurvaDuracion,
              idAforo: dato.idAforo,
              fechaGrupo: dato.fechaGrupo,
              cantidadCaudal: dato.cantidadCaudal,
              promedioCaudal: dato.promedioCaudal,
              porcentaje: dato.porcentaje,
              fechaCreacion: dato.fechaCreacion,
            };
            detalles.push(dto);
          });

          let request: ICurvaDuracionActualizacionRequest = {
            idCurvaDuracion: this.idCurvaDuracion,
            detalles: detalles,
          };

          this.servicioAforo.actualizarCurvasDuracionDetalles(request).subscribe(response => {
            Swal.close();

            Swal.fire({
              icon: 'success', 
              title: 'Actualización realizada con éxito!', 
              html: 'Se ha actualizado exitosamente los datos de la curva de duración.',
            });
          });
        }, 
        willClose: async() => {
          Swal.hideLoading();
        }
      });

      /*
        var date = new Date();

        this.servicioAforo
        .obtenerCurvaidD(this.formularioFiltroAforo.value.idelemento)
        .subscribe((response) => {
          let curvaDuracion :ICurvaDuracion={
            idElemento: this.idElemento, 
            fechaCreacion: date,
            fechaInicio: this.formularioFiltroAforo.value.fechaInicio,
            fechaFin: this.formularioFiltroAforo.value.fechaFin,
            estado:'ACTIVO',
          };

          this.servicioAforo
          .guardarCurvaDuracion(curvaDuracion)
          .subscribe((response) => {
            if ( response.idCurvaDuracion!=null && undefined!=response.idCurvaDuracion && response.idCurvaDuracion>=0 ) {
              var id_curva = response.idCurvaDuracion;
              this.toast.fire({
                icon: 'success',
                title:
                  'La curva de duración ha sido guardada exitosamente!',
              });

              this.datosTabla = [];
              this.chartOptions.series = [];
              this.formularioFiltroAforo.reset();
            }
          });
        });
        */
      }
      
      cancelar(){
        // this.router.navigateByUrl('/configuracion/gestionTablas');
        this.datosTabla = [];
        this.chartOptions.series = [];
        this.formularioFiltroAforo.reset();
      }

      guardarCurvaDuracion(){
              Swal.fire({
                title: 'Desea Guaradar la información?',
                text: 'Se almacenara la tabla a una curva de Duracion ',
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
            }

    regresar() {
      location.reload();
    }

    onModalEdicionBtn() {

    }

     consultarDetalle(event : any) {
      this.detalleRegistro = {
        fechaGrupo: '', 
        promedioCaudal: '',
        cantidadCaudal : '',
        porcentaje : '',
        numeroAforo : '', 
        nombreElemento : '',
      };

      if ( !this.assertNullAndUndefined(event) || !this.assertNullAndUndefined(event.registro) ) {
        return;
      }

      /*
      this.detalleFecha = '';
      this.detallePromedio = '';
      this.detalleCantidad = '';
      this.detallePorcentaje = '';
      this.detalleNumeroAforo = '';
      this.detalleNombreElemento = '';
      */

      this.detalleRegistro = event.registro;

      /*
      let promedioInput : any = document.getElementById('promedioInput');
      promedioInput.value = this.detalleRegistro.promedioCaudal;
      */

      /*
      if ( this.assertNullAndUndefined(registro.fechaGrupo) ) {
        this.detalleFecha = registro.fechaGrupo;
      }

      if ( this.assertNullAndUndefined(registro.promedioCaudal) ) {
        this.detallePromedio = registro.promedioCaudal;
      }

      if ( this.assertNullAndUndefined(registro.cantidadCaudal) ) {
        this.detalleCantidad = registro.cantidadCaudal;
      }

      if ( this.assertNullAndUndefined(registro.porcentaje) ) {
        this.detallePorcentaje = registro.porcentaje;
      }

      if ( this.assertNullAndUndefined(registro.numeroAforo) && registro.numeroAforo>=0 ) {
        this.detalleNumeroAforo = registro.numeroAforo;
      }

      if ( this.assertNullAndUndefined(registro.nombreElemento) ) {
        this.detalleNombreElemento = registro.nombreElemento;
      }
      */

      this.modalEdicion.nativeElement.click();
     }

     actualizar() {
      /*
      let promedioInput : any = document.getElementById('promedioInput');
      let nuevoPromedio = promedioInput.value;
      */

      let id = this.detalleRegistro.idCurvaDuracionDetalle;
      let values = this.datosTabla.filter(value => {
        return value.idCurvaDuracionDetalle == id;
      });

      if ( !this.assertNullAndUndefined(values) || values.length<=0 ) {
        return;
      }

      let registro = values[0];
      let promedioTabla = this.obtenerPromedio();
      //registro.promedioCaudal = nuevoPromedio / promedioTabla;
      registro.promedioCaudal = registro.promedioCaudal / promedioTabla;

      let copia : any[] = [...this.datosTabla];
      this.datosTabla = [];
      this.datosTabla = copia;

      Swal.fire({
        icon: 'success', 
        title: 'El registro ha sido actualizado exitosamente.', 
        showCancelButton: false,
      });

      let promedios = [];
      let fechas = [];
      let x; var y;
      
      for ( let i=0; i<this.datosTabla.length; i++ ) {
        x =  this.datosTabla[i]['fechaGrupo'];
        y =  this.datosTabla[i]['promedioCaudal'];
        
        fechas.push(x);
        promedios.push(y);
      }
      
      this.chartOptions.series = [{
        name: "Fecha ", 
        type: "line",
        data: promedios
      }];

     }

     obtenerPromedio() : number {
      if ( this.datosTabla.length == 0 ) {
        return 0;
      }

      let suma : number = 0;
      this.datosTabla.forEach(value => {
        suma += parseFloat(value.promedioCaudal);
      });
      let promedio = suma / this.datosTabla.length;
      return promedio;
     }
}
