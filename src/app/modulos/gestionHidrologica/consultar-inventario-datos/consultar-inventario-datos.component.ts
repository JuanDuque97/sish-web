import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { MetodosGlobales } from 'src/app/common/utils/metodos-globales';
import { dominiosEnum } from 'src/app/modelo/enum/dominios-enum';
import { ServiciosDominiosValoresService } from '../../configuracion/dominios/servicios-dominios-valores.service';
import { ServiciosDominiosService } from '../../configuracion/dominios/servicios-dominios.service';
import { ServiciosEmbalcesService } from '../../elementos/embalses/servicios-embalses.service';
import { ServiciosEstacionesService } from '../../elementos/estaciones/servicios-estaciones.service';
import { ServiciosPozosService } from '../../elementos/pozos/servicios-pozos.service';
import { ServiciosObservacionesEmbalsesService } from '../../observaciones/servicios-observaciones-embalses.service';
import { ServiciosObservacionesEstacionService } from '../../observaciones/servicios-observaciones-estacion.service';
import { ServiciosObservacionesPozosService } from '../../observaciones/servicios-observaciones-pozos.service';
import { ServiciosGeograficosService } from 'src/app/common/mapa/servicios-geograficos.service';
import { ServiciosParametrosService } from 'src/app/modulos/parametros/servicios-parametros.service';
import { Observable } from 'rxjs';
import { ServiciosParametrosEstacionesService } from '../../elementos/estaciones/servicios-parametros-estaciones.service';
import * as Highcharts from "highcharts";
import { toInteger, toNumber, toString } from 'lodash';

import * as ecStat from 'echarts-stat';
import HC_exporting from "highcharts/modules/exporting";
import HC_Data from "highcharts/modules/export-data";
import Accessbility from "highcharts/modules/accessibility";
import Swal from 'sweetalert2';
import { accionesTablasEnum } from 'src/app/modelo/enum/acciones-tablas-enum';
const regression = require('regression');
const correlation = require('node-correlation');
export var var1: number = 0;
export var var2: string = '';
export var var3: string = '';

HC_exporting(Highcharts);
HC_Data(Highcharts);
Accessbility(Highcharts);

@Component({
  selector: 'app-consultar-inventario-datos',
  templateUrl: './consultar-inventario-datos.component.html' 
})

export class ConsultarInventarioDatosComponent implements OnInit {

  @ViewChild("lineChart", { static: false }) lineChart: any;
  @ViewChild('ModalCalidad', { static: false }) ModalCalidad: ElementRef;
  @ViewChild(DataTableDirective, { static: false })

  public Highcharts = Highcharts;
  public isHighcharts = typeof Highcharts === 'object';
  public chartOptions: Highcharts.Options = {};
  public updateFlag: boolean = false;
  public formularioConsulta!: FormGroup;
  public rutaGeneral = 'configuracion/dominios/C/0';
  public rutaConsulta = 'configuracion/dominios/V/';
  public rutaEdicion = 'configuracion/dominios/E/';
  public verFechas = true;
  public datosFilter = [] as any;
  public departamentoSelected: any;
  public periodo: number = 2;
  public listaElemento :any= [];
  public myRegression :any= [];
  public listaElementos :any= [];
  public listaCodigoEAAB: any = [];
  public listaCodigoIDEAM: any = [];
  public datosOriginal = [] as any;
  public listZonaEAAB = [];
  public fechaActualMensual: string;
  public fechaActualHora: string;
  public listaAutocompletado: any = [];
  public listObservacionesInsertadas: any = [];
  public listaP: any = [];
  public listTipoPozo = [];
  public listCategoriaPozo = [];
  public listCondicionPozo = [];
  public geograficas = false;
  public planas = false;
  public fechainicio:Date;
  public Fechafin:Date;
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
  public nombreParametro:string ;
  public nombreEstacion:string ;
  public nombreEstacionA:string ;
  public nombreEstacionB:string ;
  public nombreEstacionC:string ;
  public nombreEstacionD:string ;
  public nombreEstacionE:string ;
  public ecuacionString:string ;
  public ajuste: number;
  public pediente2: number;
  public pediente1: number;
  public r2:number;
  botones = [
    {
      class: 'sish-boton-azul',
      title: 'autoCompletado',
      action: 'autoCompletado',
      icon: 'fa fa-indent',
      enabled: this.validarPermiso('ActualizarAforo'),
    }
    
  ];
  botonesGenerales = [
    {
      text: 'Activar Todos',
      action: 'autoCompletado',
      enabled: this.validarPermiso('ActualizarAforo'),
    }
  ];
  public correlacion: number;
  public listaCodigoEAABAgregar : any[] = [];
  public listaCodigoIDEAMAgregar : any[] = [];
  public listEntidades = [];
  public listaAreaHidrografica = [];
  public listaZonaHidrografica = [];
  public listaElementoAgregar: any[] = [];
  public listasubZonaHidrografica = [];
  public listanivel = [];
  public listaCuenca = [];
  public listaMicrocuenca = [];
  public listaEntidad = [];
  public listaItemsElementos:any=[];
  public idElementoAgregar :string = '0';
  public listParametro: any[] = [];
  public listParametroOrgin: any[] = [];
  public listaFrecuencia: any[] = [];
  public listaSubcuenca = [];
  public fechaMes: number;
  public cantidad:any = [];
  public serie = [];
  public listaMunicipios = [];
  public idTipoElemento: any;
  public idElementoTipo : any = '';
  public idElemento: string = '0';
  public listaDepartamentos = [];
  public datatableElement: DataTableDirective | undefined;
  public parametro: number = 0;
  public idfrecuencia: number = 0;
  private tempIdDepartamento: number = 0;
  public dtOptions: any = {};
  public anoFin : any;
  public anoInicio : any;
  public fechaActual:Date = new Date();
  public fecha: string;
  public fechaAno: number;
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
  public fechaActualMensualFin: string;
  public fechaActualHoraFin: string;
  public fechaFinal: string;
  public fechaAnoFin: number;
  public fechaMesFin: string;
  public fechasComparacion: number;
  public  cantidad_1:any=[];
  public  cantidad_2:any=[];
  public  cantidad_3:any=[];
  public  cantidad_4:any=[];
  public  cantidad_5:any=[];

  public  cantidad_1_1:any=[];
  public  cantidad_2_2:any=[];
  public  cantidad_3_3:any=[];
  public  cantidad_4_4:any=[];
  public  cantidad_5_5:any=[];

  listaAnos: any[] = [];


  public  cantidadRegistros:any; 


  columnas = [ 
    { title:'Código Parámetros', data:'codigoParametros', visible:false }, 
    { title:'Fecha Inicio', data:'fechaInicio', visible:false }, 
    { title:'Fecha Fin', data:'fechaFin', visible:false }, 
    { title:'Elemento', data:'elemento' }, 
    { title:'Descripción', data:'descripcion'}, 
    { title:'Frecuencia', data:'frecuencia'}, 
    { title:'Datos esperados', data:'datosSegunFrecuencia', 'render': function (data: number, type: any, row: any, meta: any) {
      if ( null==row || undefined==row ) {
        return '';
      }

      if ( null==row.fecha || undefined==row.fecha ) {
        return '';
      }

      if ( null==row.frecuencia || undefined==row.frecuencia ) {
        return '';
      }
      
      // 2022-01 YYYY-MM
      // 2022
      let fecha = row.fecha;
      if ( null==fecha || undefined==fecha || !fecha.includes('-') || fecha.split('-').length<2 ) {
        return '';
      }

      let fechaTokens = fecha.split('-');
      let year = parseInt(fechaTokens[0]);
      let month = parseInt(fechaTokens[1]);

      let lastDayOfMonth = new Date(year, month, 0);
      let maxDayOnMonth = lastDayOfMonth.getDate();

      let frecuencia = row.frecuencia;

      if ( frecuencia==='Segundos' ) {
        /*
        // "2022-08-14 00:00:00"
        let fechaInicio = row.fechaInicio;

        if ( null==fechaInicio || undefined==fechaInicio || !fechaInicio.includes('-') || !fechaInicio.includes(':') ) {
          return '';
        }

        let fechaTokens = fechaInicio.split('-');
        if ( null==fechaTokens || undefined==fechaTokens || fechaTokens.length<3 || !fechaTokens[2].includes(' ') || fechaTokens[2].split(' ').length<1 ) {
          return '';
        }

        let year = fechaTokens[0];
        let month = fechaTokens[1];
        let day = fechaTokens[2].split(' ')[0];

        let horaTokens = fechaInicio.split(':');
        if ( null==horaTokens || undefined==horaTokens || horaTokens.length<3 || !horaTokens[0].includes(' ') || horaTokens[0].split(' ').length<2 ) {
          return '';
        }

        let hour = horaTokens[0].split(' ')[1];
        let minute = horaTokens[1];
        let second = horaTokens[2];

        let fechaInicioDate : any = new Date(year, month-1, day, hour, minute, second);

        // "2022-08-15 23:59:59"
        let fechaFin = row.fechaFin;

        if ( null==fechaFin || undefined==fechaFin || !fechaFin.includes('-') || !fechaFin.includes(':') ) {
          return '';
        }

        fechaTokens = fechaFin.split('-');
        if ( null==fechaTokens || undefined==fechaTokens || fechaTokens.length<3 || !fechaTokens[2].includes(' ') || fechaTokens[2].split(' ').length<1 ) {
          return '';
        }

        year = fechaTokens[0];
        month = fechaTokens[1];
        day = fechaTokens[2].split(' ')[0];

        horaTokens = fechaFin.split(':');
        if ( null==horaTokens || undefined==horaTokens || horaTokens.length<3 || !horaTokens[0].includes(' ') || horaTokens[0].split(' ').length<2 ) {
          return '';
        }

        hour = horaTokens[0].split(' ')[1];
        minute = horaTokens[1];
        second = horaTokens[2];

        let fechaFinDate : any = new Date(year, month-1, day, hour, minute, second);

        let diff = Math.abs(fechaFinDate - fechaInicioDate);
        let seconds = Math.floor(diff/1000);

        // return '' + seconds;
        */
        return '' + (maxDayOnMonth * 24 * 60 * 60);

        /*
        let codigos = row.codigoParametros;
        if ( null!=codigos && undefined!=codigos && codigos.length==0 ) {
          // Cantidad de segundos en un mes
          return '' + (maxDayOnMonth * 24 * 60 * 60);
        }

        // Cantidad de segundos en un minuto
        return '60';
        */

      } else if ( frecuencia==='Minutos' ) {
        /*
        // "2022-08-14 00:00:00"
        let fechaInicio = row.fechaInicio;

        if ( null==fechaInicio || undefined==fechaInicio || !fechaInicio.includes('-') || !fechaInicio.includes(':') ) {
          return '';
        }

        let fechaTokens = fechaInicio.split('-');
        if ( null==fechaTokens || undefined==fechaTokens || fechaTokens.length<3 || !fechaTokens[2].includes(' ') || fechaTokens[2].split(' ').length<1 ) {
          return '';
        }

        let year = fechaTokens[0];
        let month = fechaTokens[1];
        let day = fechaTokens[2].split(' ')[0];

        let horaTokens = fechaInicio.split(':');
        if ( null==horaTokens || undefined==horaTokens || horaTokens.length<3 || !horaTokens[0].includes(' ') || horaTokens[0].split(' ').length<2 ) {
          return '';
        }

        let hour = horaTokens[0].split(' ')[1];
        let minute = horaTokens[1];
        let second = horaTokens[2];

        let fechaInicioDate : any = new Date(year, month-1, day, hour, minute, second);

        // "2022-08-15 23:59:59"
        let fechaFin = row.fechaFin;

        if ( null==fechaFin || undefined==fechaFin || !fechaFin.includes('-') || !fechaFin.includes(':') ) {
          return '';
        }

        fechaTokens = fechaFin.split('-');
        if ( null==fechaTokens || undefined==fechaTokens || fechaTokens.length<3 || !fechaTokens[2].includes(' ') || fechaTokens[2].split(' ').length<1 ) {
          return '';
        }

        year = fechaTokens[0];
        month = fechaTokens[1];
        day = fechaTokens[2].split(' ')[0];

        horaTokens = fechaFin.split(':');
        if ( null==horaTokens || undefined==horaTokens || horaTokens.length<3 || !horaTokens[0].includes(' ') || horaTokens[0].split(' ').length<2 ) {
          return '';
        }

        hour = horaTokens[0].split(' ')[1];
        minute = horaTokens[1];
        second = horaTokens[2];

        let fechaFinDate : any = new Date(year, month-1, day, hour, minute, second);

        let diff = Math.abs(fechaFinDate.getTime() - fechaInicioDate.getTime());
        let minutes = Math.floor(diff/1000/60);
        
        //return '' + (maxDayOnMonth * 24 * minutes);
        //return minutes;
        */

        return '' + (maxDayOnMonth * 24 * 60);

        /*
        let codigos = row.codigoParametros;
        if ( null!=codigos && undefined!=codigos && codigos.length==0 ) {
          // Cantidad de minutos en un mes
          return '' + (maxDayOnMonth * 24 * 60);
        }

        // Cantidad de minutos en 1 hora
        return '60';
        */

      } else if ( frecuencia==='5 Minutal' ) {
        /*
        // "2022-08-14 00:00:00"
        let fechaInicio = row.fechaInicio;
        
        if ( null==fechaInicio || undefined==fechaInicio || !fechaInicio.includes('-') || !fechaInicio.includes(':') ) {
          return '';
        }

        let fechaTokens = fechaInicio.split('-');
        if ( null==fechaTokens || undefined==fechaTokens || fechaTokens.length<3 || !fechaTokens[2].includes(' ') || fechaTokens[2].split(' ').length<1 ) {
          return '';
        }

        let year = fechaTokens[0];
        let month = fechaTokens[1];
        let day = fechaTokens[2].split(' ')[0];

        let horaTokens = fechaInicio.split(':');
        if ( null==horaTokens || undefined==horaTokens || horaTokens.length<3 || !horaTokens[0].includes(' ') || horaTokens[0].split(' ').length<2 ) {
          return '';
        }

        let hour = horaTokens[0].split(' ')[1];
        let minute = horaTokens[1];
        let second = horaTokens[2];

        let fechaInicioDate : any = new Date(year, month-1, day, hour, minute, second);

        // "2022-08-15 23:59:59"
        let fechaFin = row.fechaFin;

        if ( null==fechaFin || undefined==fechaFin || !fechaFin.includes('-') || !fechaFin.includes(':') ) {
          return '';
        }

        fechaTokens = fechaFin.split('-');
        if ( null==fechaTokens || undefined==fechaTokens || fechaTokens.length<3 || !fechaTokens[2].includes(' ') || fechaTokens[2].split(' ').length<1 ) {
          return '';
        }

        year = fechaTokens[0];
        month = fechaTokens[1];
        day = fechaTokens[2].split(' ')[0];

        horaTokens = fechaFin.split(':');
        if ( null==horaTokens || undefined==horaTokens || horaTokens.length<3 || !horaTokens[0].includes(' ') || horaTokens[0].split(' ').length<2 ) {
          return '';
        }

        hour = horaTokens[0].split(' ')[1];
        minute = horaTokens[1];
        second = horaTokens[2];

        let fechaFinDate : any = new Date(year, month-1, day, hour, minute, second);

        let diff = Math.abs(fechaFinDate - fechaInicioDate);
        let minutes5 = Math.floor((diff/1000)/60/5);
        */

        //return '' + (maxDayOnMonth * 24 * 12);
        // return '' + minutes5;

        return '' + (maxDayOnMonth * 24 * 60 / 5);

        /*
        let codigos = row.codigoParametros;
        if ( null!=codigos && undefined!=codigos && codigos.length==0 ) {
          // Cantidad de 5-minutos en un mes
          return '' + (maxDayOnMonth * 24 * 60 / 5);
        }

        // Cantidad de 5-minutal en 1 hora.
        return '12';
        */

      } else if ( frecuencia==='10 Minutal' ) {
        /*
        // "2022-08-14 00:00:00"
        let fechaInicio = row.fechaInicio;
        
        if ( null==fechaInicio || undefined==fechaInicio || !fechaInicio.includes('-') || !fechaInicio.includes(':') ) {
          return '';
        }

        let fechaTokens = fechaInicio.split('-');
        if ( null==fechaTokens || undefined==fechaTokens || fechaTokens.length<3 || !fechaTokens[2].includes(' ') || fechaTokens[2].split(' ').length<1 ) {
          return '';
        }

        let year = fechaTokens[0];
        let month = fechaTokens[1];
        let day = fechaTokens[2].split(' ')[0];

        let horaTokens = fechaInicio.split(':');
        if ( null==horaTokens || undefined==horaTokens || horaTokens.length<3 || !horaTokens[0].includes(' ') || horaTokens[0].split(' ').length<2 ) {
          return '';
        }

        let hour = horaTokens[0].split(' ')[1];
        let minute = horaTokens[1];
        let second = horaTokens[2];

        let fechaInicioDate : any = new Date(year, month-1, day, hour, minute, second);

        // "2022-08-15 23:59:59"
        let fechaFin = row.fechaFin;

        if ( null==fechaFin || undefined==fechaFin || !fechaFin.includes('-') || !fechaFin.includes(':') ) {
          return '';
        }

        fechaTokens = fechaFin.split('-');
        if ( null==fechaTokens || undefined==fechaTokens || fechaTokens.length<3 || !fechaTokens[2].includes(' ') || fechaTokens[2].split(' ').length<1 ) {
          return '';
        }

        year = fechaTokens[0];
        month = fechaTokens[1];
        day = fechaTokens[2].split(' ')[0];

        horaTokens = fechaFin.split(':');
        if ( null==horaTokens || undefined==horaTokens || horaTokens.length<3 || !horaTokens[0].includes(' ') || horaTokens[0].split(' ').length<2 ) {
          return '';
        }

        hour = horaTokens[0].split(' ')[1];
        minute = horaTokens[1];
        second = horaTokens[2];

        let fechaFinDate : any = new Date(year, month-1, day, hour, minute, second);

        let diff = Math.abs(fechaFinDate - fechaInicioDate);
        let minutes10 = Math.floor((diff/1000)/60/10);
        */

        // return '' + (maxDayOnMonth * 24 * 6);
        // return minutes10;

        return '' + (maxDayOnMonth * 24 * 60 / 10);

        /*
        let codigos = row.codigoParametros;
        if ( null!=codigos && undefined!=codigos && codigos.length==0 ) {
          // Cantidad de 10-minutos en un mes
          return '' + (maxDayOnMonth * 24 * 60 / 10);
        }

        // Cantidad de 10-minutal en 1 hora
        return '6';
        */

      } else if ( frecuencia==='Hora' ) {
        /*
        // "2022-08-14 00:00:00"
        let fechaInicio = row.fechaInicio;
        
        if ( null==fechaInicio || undefined==fechaInicio || !fechaInicio.includes('-') || !fechaInicio.includes(':') ) {
          return '';
        }

        let fechaTokens = fechaInicio.split('-');
        if ( null==fechaTokens || undefined==fechaTokens || fechaTokens.length<3 || !fechaTokens[2].includes(' ') || fechaTokens[2].split(' ').length<1 ) {
          return '';
        }

        let year = fechaTokens[0];
        let month = fechaTokens[1];
        let day = fechaTokens[2].split(' ')[0];

        let horaTokens = fechaInicio.split(':');
        if ( null==horaTokens || undefined==horaTokens || horaTokens.length<3 || !horaTokens[0].includes(' ') || horaTokens[0].split(' ').length<2 ) {
          return '';
        }

        let hour = horaTokens[0].split(' ')[1];
        let minute = horaTokens[1];
        let second = horaTokens[2];

        let fechaInicioDate : any = new Date(year, month-1, day, hour, minute, second);

        // "2022-08-15 23:59:59"
        let fechaFin = row.fechaFin;

        if ( null==fechaFin || undefined==fechaFin || !fechaFin.includes('-') || !fechaFin.includes(':') ) {
          return '';
        }

        fechaTokens = fechaFin.split('-');
        if ( null==fechaTokens || undefined==fechaTokens || fechaTokens.length<3 || !fechaTokens[2].includes(' ') || fechaTokens[2].split(' ').length<1 ) {
          return '';
        }

        year = fechaTokens[0];
        month = fechaTokens[1];
        day = fechaTokens[2].split(' ')[0];

        horaTokens = fechaFin.split(':');
        if ( null==horaTokens || undefined==horaTokens || horaTokens.length<3 || !horaTokens[0].includes(' ') || horaTokens[0].split(' ').length<2 ) {
          return '';
        }

        hour = horaTokens[0].split(' ')[1];
        minute = horaTokens[1];
        second = horaTokens[2];

        let fechaFinDate : any = new Date(year, month-1, day, hour, minute, second);

        let diff = Math.abs(fechaFinDate - fechaInicioDate);
        let hours = Math.floor((diff/1000)/60/60);
        */

        // return '' + hours;
        //return '' + (maxDayOnMonth * 24);

        return '' + (maxDayOnMonth * 24);

        /*
        let codigos = row.codigoParametros;
        if ( null!=codigos && undefined!=codigos && codigos.length==0 ) {
          // Cantidad de horas en un mes
          return '' + (maxDayOnMonth * 24);
        }
        
        // Cantidad de horas en 1 dia
        return '24';
        */

      } else if ( frecuencia === 'Día' ) {
        // Cantidad de dias en el mes.
        return '' + maxDayOnMonth;

      } else if ( frecuencia === 'Semana' ) {
        // Cantidad de semanas en el mes.
        return '4';

      } else if ( frecuencia === 'Mes' ) {
        // Cantidad de meses en el año.
        //return '12';
        return '' + 1;
      }

      return '';
    }}, 
    { title:'Datos obtenidos', data:'total' }, 
    { title:'Datos faltante', data:'faltante', 'render': function (data: number, type: any, row: any, meta: any) {
      if ( null==row || undefined==row ) {
        return '';
      }

      if ( null==row.fecha || undefined==row.fecha ) {
        return '';
      }

      if ( null==row.frecuencia || undefined==row.frecuencia ) {
        return '';
      }
      
      // 2022-01 YYYY-MM
      let fecha = row.fecha;
      if ( null==fecha || undefined==fecha || !fecha.includes('-') || fecha.split('-').length<2 ) {
        return '';
      }

      let fechaTokens = fecha.split('-');
      let year = parseInt(fechaTokens[0]);
      let month = parseInt(fechaTokens[1]);

      let lastDayOfMonth = new Date(year, month, 0);
      let maxDayOnMonth = lastDayOfMonth.getDate();

      let frecuencia = row.frecuencia;

      let datosSegunFrecuencia = 0;
      if ( frecuencia==='Segundos' ) {
        /*
        // "2022-08-14 00:00:00"
        let fechaInicio = row.fechaInicio;

        if ( null==fechaInicio || undefined==fechaInicio || !fechaInicio.includes('-') || !fechaInicio.includes(':') ) {
          return '';
        }

        let fechaTokens = fechaInicio.split('-');
        if ( null==fechaTokens || undefined==fechaTokens || fechaTokens.length<3 || !fechaTokens[2].includes(' ') || fechaTokens[2].split(' ').length<1 ) {
          return '';
        }

        let year = fechaTokens[0];
        let month = fechaTokens[1];
        let day = fechaTokens[2].split(' ')[0];

        let horaTokens = fechaInicio.split(':');
        if ( null==horaTokens || undefined==horaTokens || horaTokens.length<3 || !horaTokens[0].includes(' ') || horaTokens[0].split(' ').length<2 ) {
          return '';
        }

        let hour = horaTokens[0].split(' ')[1];
        let minute = horaTokens[1];
        let second = horaTokens[2];

        let fechaInicioDate : any = new Date(year, month-1, day, hour, minute, second);

        // "2022-08-15 23:59:59"
        let fechaFin = row.fechaFin;

        if ( null==fechaFin || undefined==fechaFin || !fechaFin.includes('-') || !fechaFin.includes(':') ) {
          return '';
        }

        fechaTokens = fechaFin.split('-');
        if ( null==fechaTokens || undefined==fechaTokens || fechaTokens.length<3 || !fechaTokens[2].includes(' ') || fechaTokens[2].split(' ').length<1 ) {
          return '';
        }

        year = fechaTokens[0];
        month = fechaTokens[1];
        day = fechaTokens[2].split(' ')[0];

        horaTokens = fechaFin.split(':');
        if ( null==horaTokens || undefined==horaTokens || horaTokens.length<3 || !horaTokens[0].includes(' ') || horaTokens[0].split(' ').length<2 ) {
          return '';
        }

        hour = horaTokens[0].split(' ')[1];
        minute = horaTokens[1];
        second = horaTokens[2];

        let fechaFinDate : any = new Date(year, month-1, day, hour, minute, second);

        let diff = Math.abs(fechaFinDate - fechaInicioDate);
        let seconds = Math.floor(diff/1000);
        */

        //datosSegunFrecuencia = maxDayOnMonth * 24 * 60 * 60;
        // datosSegunFrecuencia = seconds;

        datosSegunFrecuencia = maxDayOnMonth * 24 * 60 * 60;

        /*
        let codigos = row.codigoParametros;
        if ( null!=codigos && undefined!=codigos && codigos.length==0 ) {
          // Cantidad de segundos en un mes
          datosSegunFrecuencia= maxDayOnMonth * 24 * 60 * 60;
        } else {

          // Cantidad de segundos en un minuto
          datosSegunFrecuencia = 60;
        }
        */

      } else if ( frecuencia==='Minutos' ) {
        /*
        // "2022-08-14 00:00:00"
        let fechaInicio = row.fechaInicio;

        if ( null==fechaInicio || undefined==fechaInicio || !fechaInicio.includes('-') || !fechaInicio.includes(':') ) {
          return '';
        }

        let fechaTokens = fechaInicio.split('-');
        if ( null==fechaTokens || undefined==fechaTokens || fechaTokens.length<3 || !fechaTokens[2].includes(' ') || fechaTokens[2].split(' ').length<1 ) {
          return '';
        }

        let year = fechaTokens[0];
        let month = fechaTokens[1];
        let day = fechaTokens[2].split(' ')[0];

        let horaTokens = fechaInicio.split(':');
        if ( null==horaTokens || undefined==horaTokens || horaTokens.length<3 || !horaTokens[0].includes(' ') || horaTokens[0].split(' ').length<2 ) {
          return '';
        }

        let hour = horaTokens[0].split(' ')[1];
        let minute = horaTokens[1];
        let second = horaTokens[2];

        let fechaInicioDate : any = new Date(year, month-1, day, hour, minute, second);

        // "2022-08-15 23:59:59"
        let fechaFin = row.fechaFin;

        if ( null==fechaFin || undefined==fechaFin || !fechaFin.includes('-') || !fechaFin.includes(':') ) {
          return '';
        }

        fechaTokens = fechaFin.split('-');
        if ( null==fechaTokens || undefined==fechaTokens || fechaTokens.length<3 || !fechaTokens[2].includes(' ') || fechaTokens[2].split(' ').length<1 ) {
          return '';
        }

        year = fechaTokens[0];
        month = fechaTokens[1];
        day = fechaTokens[2].split(' ')[0];

        horaTokens = fechaFin.split(':');
        if ( null==horaTokens || undefined==horaTokens || horaTokens.length<3 || !horaTokens[0].includes(' ') || horaTokens[0].split(' ').length<2 ) {
          return '';
        }

        hour = horaTokens[0].split(' ')[1];
        minute = horaTokens[1];
        second = horaTokens[2];

        let fechaFinDate : any = new Date(year, month-1, day, hour, minute, second);

        let diff = Math.abs(fechaFinDate - fechaInicioDate);
        let minutes = Math.floor((diff/1000)/60);

        //datosSegunFrecuencia = maxDayOnMonth * 24 * 60;
        //datosSegunFrecuencia = minutes;
        */

        datosSegunFrecuencia = maxDayOnMonth * 24 * 60;

        /*
        let codigos = row.codigoParametros;
        if ( null!=codigos && undefined!=codigos && codigos.length==0 ) {
          // Cantidad de minutos en un mes
          datosSegunFrecuencia= maxDayOnMonth * 24 * 60;
        } else {

          // Cantidad de minutos en 1 hora
          datosSegunFrecuencia = 60;
        }
        */

      } else if ( frecuencia==='5 Minutal' ) {
        /*
        // "2022-08-14 00:00:00"
        let fechaInicio = row.fechaInicio;

        if ( null==fechaInicio || undefined==fechaInicio || !fechaInicio.includes('-') || !fechaInicio.includes(':') ) {
          return '';
        }

        let fechaTokens = fechaInicio.split('-');
        if ( null==fechaTokens || undefined==fechaTokens || fechaTokens.length<3 || !fechaTokens[2].includes(' ') || fechaTokens[2].split(' ').length<1 ) {
          return '';
        }

        let year = fechaTokens[0];
        let month = fechaTokens[1];
        let day = fechaTokens[2].split(' ')[0];

        let horaTokens = fechaInicio.split(':');
        if ( null==horaTokens || undefined==horaTokens || horaTokens.length<3 || !horaTokens[0].includes(' ') || horaTokens[0].split(' ').length<2 ) {
          return '';
        }

        let hour = horaTokens[0].split(' ')[1];
        let minute = horaTokens[1];
        let second = horaTokens[2];

        let fechaInicioDate : any = new Date(year, month-1, day, hour, minute, second);

        // "2022-08-15 23:59:59"
        let fechaFin = row.fechaFin;

        if ( null==fechaFin || undefined==fechaFin || !fechaFin.includes('-') || !fechaFin.includes(':') ) {
          return '';
        }

        fechaTokens = fechaFin.split('-');
        if ( null==fechaTokens || undefined==fechaTokens || fechaTokens.length<3 || !fechaTokens[2].includes(' ') || fechaTokens[2].split(' ').length<1 ) {
          return '';
        }

        year = fechaTokens[0];
        month = fechaTokens[1];
        day = fechaTokens[2].split(' ')[0];

        horaTokens = fechaFin.split(':');
        if ( null==horaTokens || undefined==horaTokens || horaTokens.length<3 || !horaTokens[0].includes(' ') || horaTokens[0].split(' ').length<2 ) {
          return '';
        }

        hour = horaTokens[0].split(' ')[1];
        minute = horaTokens[1];
        second = horaTokens[2];

        let fechaFinDate : any = new Date(year, month-1, day, hour, minute, second);

        let diff = Math.abs(fechaFinDate - fechaInicioDate);
        let minutes5 = Math.floor((diff/1000)/60/5);
        */

        //datosSegunFrecuencia = maxDayOnMonth * 24 * 12;
        //datosSegunFrecuencia = minutes5;

        datosSegunFrecuencia = maxDayOnMonth * 24 * 60 / 5;

        /*
        let codigos = row.codigoParametros;
        if ( null!=codigos && undefined!=codigos && codigos.length==0 ) {
          // Cantidad de 5-minutos en un mes
          datosSegunFrecuencia= maxDayOnMonth * 24 * 60 / 5;
        } else {

          // Cantidad de 5-minutal en 1 hora.
          datosSegunFrecuencia = 12;
        }
        */

      } else if ( frecuencia==='10 Minutal' ) {
        /*
        // "2022-08-14 00:00:00"
        let fechaInicio = row.fechaInicio;

        if ( null==fechaInicio || undefined==fechaInicio || !fechaInicio.includes('-') || !fechaInicio.includes(':') ) {
          return '';
        }

        let fechaTokens = fechaInicio.split('-');
        if ( null==fechaTokens || undefined==fechaTokens || fechaTokens.length<3 || !fechaTokens[2].includes(' ') || fechaTokens[2].split(' ').length<1 ) {
          return '';
        }

        let year = fechaTokens[0];
        let month = fechaTokens[1];
        let day = fechaTokens[2].split(' ')[0];

        let horaTokens = fechaInicio.split(':');
        if ( null==horaTokens || undefined==horaTokens || horaTokens.length<3 || !horaTokens[0].includes(' ') || horaTokens[0].split(' ').length<2 ) {
          return '';
        }

        let hour = horaTokens[0].split(' ')[1];
        let minute = horaTokens[1];
        let second = horaTokens[2];

        let fechaInicioDate : any = new Date(year, month-1, day, hour, minute, second);

        // "2022-08-15 23:59:59"
        let fechaFin = row.fechaFin;

        if ( null==fechaFin || undefined==fechaFin || !fechaFin.includes('-') || !fechaFin.includes(':') ) {
          return '';
        }

        fechaTokens = fechaFin.split('-');
        if ( null==fechaTokens || undefined==fechaTokens || fechaTokens.length<3 || !fechaTokens[2].includes(' ') || fechaTokens[2].split(' ').length<1 ) {
          return '';
        }

        year = fechaTokens[0];
        month = fechaTokens[1];
        day = fechaTokens[2].split(' ')[0];

        horaTokens = fechaFin.split(':');
        if ( null==horaTokens || undefined==horaTokens || horaTokens.length<3 || !horaTokens[0].includes(' ') || horaTokens[0].split(' ').length<2 ) {
          return '';
        }

        hour = horaTokens[0].split(' ')[1];
        minute = horaTokens[1];
        second = horaTokens[2];

        let fechaFinDate : any = new Date(year, month-1, day, hour, minute, second);

        let diff = Math.abs(fechaFinDate - fechaInicioDate);
        let minutes10 = Math.floor((diff/1000)/60/10);
        */

        // datosSegunFrecuencia = minutes10;
        //datosSegunFrecuencia = maxDayOnMonth * 24 * 6;

        datosSegunFrecuencia = maxDayOnMonth * 24 * 60 / 10;

        /*
        let codigos = row.codigoParametros;
        if ( null!=codigos && undefined!=codigos && codigos.length==0 ) {
          // Cantidad de 10-minutos en un mes
          datosSegunFrecuencia= maxDayOnMonth * 24 * 60 / 10;
        } else {

          // Cantidad de 10-minutal en 1 hora
          datosSegunFrecuencia = 6;
        }
        */

      } else if ( frecuencia==='Hora' ) {
        /*
        // "2022-08-14 00:00:00"
        let fechaInicio = row.fechaInicio;

        if ( null==fechaInicio || undefined==fechaInicio || !fechaInicio.includes('-') || !fechaInicio.includes(':') ) {
          return '';
        }

        let fechaTokens = fechaInicio.split('-');
        if ( null==fechaTokens || undefined==fechaTokens || fechaTokens.length<3 || !fechaTokens[2].includes(' ') || fechaTokens[2].split(' ').length<1 ) {
          return '';
        }

        let year = fechaTokens[0];
        let month = fechaTokens[1];
        let day = fechaTokens[2].split(' ')[0];

        let horaTokens = fechaInicio.split(':');
        if ( null==horaTokens || undefined==horaTokens || horaTokens.length<3 || !horaTokens[0].includes(' ') || horaTokens[0].split(' ').length<2 ) {
          return '';
        }

        let hour = horaTokens[0].split(' ')[1];
        let minute = horaTokens[1];
        let second = horaTokens[2];

        let fechaInicioDate : any = new Date(year, month-1, day, hour, minute, second);

        // "2022-08-15 23:59:59"
        let fechaFin = row.fechaFin;

        if ( null==fechaFin || undefined==fechaFin || !fechaFin.includes('-') || !fechaFin.includes(':') ) {
          return '';
        }

        fechaTokens = fechaFin.split('-');
        if ( null==fechaTokens || undefined==fechaTokens || fechaTokens.length<3 || !fechaTokens[2].includes(' ') || fechaTokens[2].split(' ').length<1 ) {
          return '';
        }

        year = fechaTokens[0];
        month = fechaTokens[1];
        day = fechaTokens[2].split(' ')[0];

        horaTokens = fechaFin.split(':');
        if ( null==horaTokens || undefined==horaTokens || horaTokens.length<3 || !horaTokens[0].includes(' ') || horaTokens[0].split(' ').length<2 ) {
          return '';
        }

        hour = horaTokens[0].split(' ')[1];
        minute = horaTokens[1];
        second = horaTokens[2];

        let fechaFinDate : any = new Date(year, month-1, day, hour, minute, second);

        let diff = Math.abs(fechaFinDate - fechaInicioDate);
        let hours = Math.floor((diff/1000)/60/60)
        */

        //datosSegunFrecuencia = hours;

        datosSegunFrecuencia = maxDayOnMonth * 24;

        /*
        let codigos = row.codigoParametros;
        if ( null!=codigos && undefined!=codigos && codigos.length==0 ) {
          // Cantidad de horas en un mes
          datosSegunFrecuencia = maxDayOnMonth * 24;
        } else {
          // Cantidad de horas en 1 dia
          datosSegunFrecuencia = 24;
        }
        */

      } else if ( frecuencia === 'Día' ) {
        datosSegunFrecuencia = maxDayOnMonth;

      } else if ( frecuencia === 'Semana' ) {
        datosSegunFrecuencia = 4;

      } else if ( frecuencia === 'Mes' ) {
        datosSegunFrecuencia = 1;

      } else {
        return '';
      }

      let total = row.total;
      if ( null==total || undefined==total ) {
        return '';
      }

      let result = datosSegunFrecuencia - total;
      if ( result < 0 ) {
        return '' + 0;
      }

      return '' + result;
    }},
    { title:'Año-Mes', data:'fecha' }, 
    { title:'idElemento', data:'idElemento', visible: false, }, 
    { title:'idPeriodo', data:'idPeriodo', visible: false, },
    { title:'Porcentaje', data:'porcentaje', 'render': function (data: number, type: any, row: any, meta: any) {
      if ( null==row || undefined==row ) {
        return '';
      }

      if ( null==row.fecha || undefined==row.fecha ) {
        return '';
      }

      if ( null==row.frecuencia || undefined==row.frecuencia ) {
        return '';
      }
      
      // 2022-01 YYYY-MM
      let fecha = row.fecha;
      if ( null==fecha || undefined==fecha || !fecha.includes('-') || fecha.split('-').length<2 ) {
        return '';
      }

      let fechaTokens = fecha.split('-');
      let year = parseInt(fechaTokens[0]);
      let month = parseInt(fechaTokens[1]);

      let lastDayOfMonth = new Date(year, month, 0);
      let maxDayOnMonth = lastDayOfMonth.getDate();

      let frecuencia = row.frecuencia;

      let datosSegunFrecuencia = 0;
      if ( frecuencia==='Segundos' ) {
        datosSegunFrecuencia = maxDayOnMonth * 24 * 60 * 60;

        /*
        let codigos = row.codigoParametros;
        if ( null!=codigos && undefined!=codigos && codigos.length==0 ) {
          // Cantidad de segundos en un mes
          datosSegunFrecuencia= maxDayOnMonth * 24 * 60 * 60;
        } else {

          // Cantidad de segundos en un minuto
          datosSegunFrecuencia = 60;
        }
        */

      } else if ( frecuencia==='Minutos' ) {
        datosSegunFrecuencia = maxDayOnMonth * 24 * 60;

        /*
        let codigos = row.codigoParametros;
        if ( null!=codigos && undefined!=codigos && codigos.length==0 ) {
          // Cantidad de minutos en un mes
          datosSegunFrecuencia= maxDayOnMonth * 24 * 60;
        } else {

          // Cantidad de minutos en 1 hora
          datosSegunFrecuencia = 60;
        }
        */

      } else if ( frecuencia==='5 Minutal' ) {
        datosSegunFrecuencia = maxDayOnMonth * 24 * 12;

        /*
        let codigos = row.codigoParametros;
        if ( null!=codigos && undefined!=codigos && codigos.length==0 ) {
          // Cantidad de 5-minutos en un mes
          datosSegunFrecuencia= maxDayOnMonth * 24 * 60 / 5;
        } else {

          // Cantidad de 5-minutal en 1 hora.
          datosSegunFrecuencia = 12;
        }
        */

      } else if ( frecuencia==='10 Minutal' ) {
        datosSegunFrecuencia = maxDayOnMonth * 24 * 6;

        /*
        let codigos = row.codigoParametros;
        if ( null!=codigos && undefined!=codigos && codigos.length==0 ) {
          // Cantidad de 10-minutos en un mes
          datosSegunFrecuencia= maxDayOnMonth * 24 * 60 / 10;
        } else {

          // Cantidad de 10-minutal en 1 hora
          datosSegunFrecuencia = 6;
        }
        */

      } else if ( frecuencia==='Hora' ) {
        datosSegunFrecuencia= maxDayOnMonth * 24;

        /*
        let codigos = row.codigoParametros;
        if ( null!=codigos && undefined!=codigos && codigos.length==0 ) {
          // Cantidad de horas en un mes
          datosSegunFrecuencia= maxDayOnMonth * 24;
        } else {

          // Cantidad de horas en 1 dia
          datosSegunFrecuencia = 24;
        }
        */

      } else if ( frecuencia === 'Día' ) {
        // Cantidad de dias en el mes.
        datosSegunFrecuencia = maxDayOnMonth;

      } else if ( frecuencia === 'Semana' ) {
        // Cantidad de semanas en el mes.
        datosSegunFrecuencia = 4;

      } else if ( frecuencia === 'Mes' ) {
        // Cantidad de meses en el año.
        datosSegunFrecuencia = 1;

      } else {
        return '';
      }

      let total = row.total;
      if ( null==total || undefined==total ) {
        return '';
      }

      if ( datosSegunFrecuencia == 0 ) {
        return '';
      }

      let percent = total * 100 / datosSegunFrecuencia;
      let result = (Math.round(percent * 100) / 100).toFixed(2) + '%';
      return '' + result;
    }}, 
    { title:'Alerta', data:'porcentaje', 'render': function (data: number, type: any, row: any, meta: any) {
      if ( null==row || undefined==row ) {
        return '';
      }

      if ( null==row.fecha || undefined==row.fecha ) {
        return '';
      }

      if ( null==row.frecuencia || undefined==row.frecuencia ) {
        return '';
      }
      
      // 2022-01 YYYY-MM
      let fecha = row.fecha;
      if ( null==fecha || undefined==fecha || !fecha.includes('-') || fecha.split('-').length<2 ) {
        return '';
      }

      let fechaTokens = fecha.split('-');
      let year = parseInt(fechaTokens[0]);
      let month = parseInt(fechaTokens[1]);

      let lastDayOfMonth = new Date(year, month, 0);
      let maxDayOnMonth = lastDayOfMonth.getDate();

      let frecuencia = row.frecuencia;

      let datosSegunFrecuencia = 0;
      if ( frecuencia==='Segundos' ) {
        datosSegunFrecuencia = maxDayOnMonth * 24 * 60 * 60;

        /*
        let codigos = row.codigoParametros;
        if ( null!=codigos && undefined!=codigos && codigos.length==0 ) {
          // Cantidad de segundos en un mes
          datosSegunFrecuencia= maxDayOnMonth * 24 * 60 * 60;
        } else {

          // Cantidad de segundos en un minuto
          datosSegunFrecuencia = 60;
        }
        */

      } else if ( frecuencia==='Minutos' ) {
        datosSegunFrecuencia = maxDayOnMonth * 24 * 60;

        /*
        let codigos = row.codigoParametros;
        if ( null!=codigos && undefined!=codigos && codigos.length==0 ) {
          // Cantidad de minutos en un mes
          datosSegunFrecuencia= maxDayOnMonth * 24 * 60;
        } else {

          // Cantidad de minutos en 1 hora
          datosSegunFrecuencia = 60;
        }
        */

      } else if ( frecuencia==='5 Minutal' ) {
        datosSegunFrecuencia = maxDayOnMonth * 24 * 12;

        /*
        let codigos = row.codigoParametros;
        if ( null!=codigos && undefined!=codigos && codigos.length==0 ) {
          // Cantidad de 5-minutos en un mes
          datosSegunFrecuencia= maxDayOnMonth * 24 * 60 / 5;
        } else {

          // Cantidad de 5-minutal en 1 hora.
          datosSegunFrecuencia = 12;
        }
        */

      } else if ( frecuencia==='10 Minutal' ) {
        datosSegunFrecuencia = maxDayOnMonth * 24 * 6;

        /*
        let codigos = row.codigoParametros;
        if ( null!=codigos && undefined!=codigos && codigos.length==0 ) {
          // Cantidad de 10-minutos en un mes
          datosSegunFrecuencia= maxDayOnMonth * 24 * 60 / 10;
        } else {

          // Cantidad de 10-minutal en 1 hora
          datosSegunFrecuencia = 6;
        }
        */

      } else if ( frecuencia==='Hora' ) {
        datosSegunFrecuencia = maxDayOnMonth * 24;

        /*
        let codigos = row.codigoParametros;
        if ( null!=codigos && undefined!=codigos && codigos.length==0 ) {
          // Cantidad de horas en un mes
          datosSegunFrecuencia = maxDayOnMonth * 24;
        } else {
          // Cantidad de horas en 1 dia
          datosSegunFrecuencia = 24;
        }
        */

      } else if ( frecuencia === 'Día' ) {
        datosSegunFrecuencia = maxDayOnMonth;

      } else if ( frecuencia === 'Semana' ) {
        datosSegunFrecuencia = 4;

      } else if ( frecuencia === 'Mes' ) {
        datosSegunFrecuencia = 1;

      } else {
        return '';
      }

      let total = row.total;
      if ( null==total || undefined==total ) {
        return '';
      }

      if ( null==datosSegunFrecuencia || undefined==datosSegunFrecuencia ) {
        return '';
      }

      if ( datosSegunFrecuencia == 0 ) {
        return '';
      }

      let percent : number = total * 100 / datosSegunFrecuencia;
      percent = parseFloat((Math.round(percent * 100) / 100).toFixed(2));

      if ( percent < 90 ) {
        return '<a><em class="fas fa-circle fa-2x semaforoRojo"></em></a>';
      }
      
      return '<a><em class="fas fa-circle fa-2x semaforoVerde"></em></a>';
    }},
  ];

  constructor(
    
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
    private serviciosObservacionesEmbalsesService: ServiciosObservacionesEmbalsesService
  ) {
    // Esto es intencional
  }

  vector: Array<number> = Array(50);

  cargarAnosFilter() {
    if ( this.listaAnos.length > 0 ) {
      return;
    }

    let curDate = new Date();
    let lastYear = curDate.getFullYear();

    for ( let ano=lastYear; ano>=1900; ano--) {
      let cbItem = {
        id: ano, 
        text: '' + ano, 
        enabled: true,
      };

      this.listaAnos.push(ano);
    }
  }

  ngOnInit(): void {

    this.cargarAnosFilter();

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
      navigator: {
        enabled: true
    }
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

  get areaHidrografica() {
    return this.formularioConsulta?.get('areaHidrografica');
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
  get idPeriodo() {
    return this.formularioConsulta.get('idPeriodo');
  }

  private construirFormulario() {
    this.formularioConsulta = this.formBuilder.group({
      idElemento: ['', [Validators.required]],
      ElementoAgregar: [''],
      idCodigoIDEAM:['', [Validators.required]],
      idCodigoEAAB:['', [Validators.required]],
      idCodigoIDEAMAgregar:[''],
      idCodigoEAABAgregar:[''],
      fechaInicio:['', [Validators.required]],
      fechaFin:['', [Validators.required]],
      frecuencia:['', [Validators.required]],
      idParametro:['', [Validators.required]],
      idMecanismo: [469],
      idTipoElemento: ['', Validators.required],
      idElementoAgregar: [''],
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

      idEntidad: [''],

      idPeriodo:[''],
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

              if ( this.verFechas ) {
                if ( !this.assertNullAndUndefined(request.fechaInicio) ) {
                  console.error('La fecha de inicio: ' + request.fechaInicio + ' NO es valida.');
                  Swal.close();
                }

                /*
                let nHypes = 0;
                for ( let index=0; index<request.fechaInicio.length; index++ ) {
                  if ( request.fechaInicio.charAt(index) == '-' ) {
                    nHypes++;
                  }
                }

                if ( nHypes == 1 ) {
                  request.fechaInicio += '-01'
                } else if ( nHypes == 0 ) {
                  request.fechaInicio += '-01-01'
                }
                */

                request.fechaInicio += '-01';

                if ( !request.fechaInicio.includes(':') ) {
                  request.fechaInicio += " 00:00:00";
                }

                if ( !this.assertNullAndUndefined(request.fechaFin) ) {
                  console.error('La fecha fin: ' + request.fechaFin + ' NO es valida.');
                  Swal.close();
                  return;
                }

                /*
                nHypes = 0;
                for ( let index=0; index<request.fechaFin.length; index++ ) {
                  if ( request.fechaFin.charAt(index) == '-' ) {
                    nHypes++;
                  }
                }

                if ( nHypes == 1 ) {
                  //yyyy-mm
                  let tokens = request.fechaFin.split('-');
                  let year = tokens[0];
                  let month = tokens[1];
                  let endDate = new Date(year, month, 0);
                  request.fechaFin += '-' + (endDate.getDate()>=10 ? endDate.getDate() : ('0'+endDate.getDate()));
                }  else if ( nHypes == 0 ) {
                  request.fechaFin += '-12-31';
                }
                */

                let tokens = request.fechaFin.split('-');
                let year = tokens[0];
                let month = tokens[1];
                let endDate = new Date(year, month, 0);
                request.fechaFin += '-' + (endDate.getDate()>=10 ? endDate.getDate() : ('0'+endDate.getDate()));

                if ( !request.fechaFin.includes(':') ) {
                  request.fechaFin += " 23:59:59";
                }

                let horaTokens = request.fechaInicio.split(':');
                if ( this.assertNullAndUndefined(horaTokens) && horaTokens.length==2 ) {
                  request.fechaInicio =  request.fechaInicio.replace('T', ' ') + ":00";
                }

                horaTokens = request.fechaFin.split(':');
                if ( this.assertNullAndUndefined(horaTokens) && horaTokens.length==2 ) {
                  request.fechaFin =  request.fechaFin.replace('T', ' ') + ":59";
                }

              } else {
                let currentDate : Date = new Date();
                this.formularioConsulta.value.fechaInicio = "1900-01-01 00:00:00";
                this.formularioConsulta.value.fechaFin = currentDate.getFullYear()+30 + "-12-31 23:59:59";
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

agregarElementoOrigen() {
 

  if ( !this.assertNullAndUndefined(this.formularioConsulta.get('idElemento')) ||
    !this.assertNullAndUndefined(this.formularioConsulta.get('idElemento')?.value) || 
    (this.formularioConsulta.get('idElemento')?.value.length<1) ) {
      return;
  }

  if ( !this.assertNullAndUndefined(this.formularioConsulta.get('idCodigoIDEAM')) ||
    !this.assertNullAndUndefined(this.formularioConsulta.get('idCodigoIDEAM')?.value) || 
    (this.formularioConsulta.get('idCodigoIDEAM')?.value.length<1) ) {
      return;
  }

  if ( !this.assertNullAndUndefined(this.formularioConsulta.get('idCodigoEAAB')) ||
    !this.assertNullAndUndefined(this.formularioConsulta.get('idCodigoEAAB')?.value) || 
    (this.formularioConsulta.get('idCodigoEAAB')?.value.length<1) ) {
      return;
  }

  if ( !this.assertNullAndUndefined(this.formularioConsulta.get('idElemento')) ||
    !this.assertNullAndUndefined(this.formularioConsulta.get('idElemento')?.value) || 
    (this.formularioConsulta.get('idElemento')?.value.length<1) ) {
      return;
  }

  
      var seleccionTemporal : any = {
        id: this.listaCodigoIDEAMAgregar.filter(filtro=> filtro.id == this.formularioConsulta.get('idElemento')?.value)[0].text,
        codigoIDEAM: this.listaCodigoIDEAMAgregar.filter(filtro=> filtro.id == this.formularioConsulta.get('idCodigoIDEAM')?.value)[0].text,
        codigoEAAB: this.listaCodigoEAABAgregar.filter(filtro=> filtro.id == this.formularioConsulta.get('idCodigoEAAB')?.value)[0].text,
        nombreElemento: this.listaElementoAgregar.filter(filtro=> filtro.id == this.formularioConsulta.get('idElemento')?.value)[0].text,
        idElemento:this.formularioConsulta.get('idElemento')?.value,
        idCodigoEAAB: this.formularioConsulta.get('idCodigoEAAB')?.value,
        idCodigoIDEAM:this.formularioConsulta.get('idCodigoIDEAM')?.value,
      }

      this.listaItemsElementos[0] = seleccionTemporal;
     // this.datosFilterElementos = this.listaItemsElementos;

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
      Swal.fire(
        'Autocompletado',
        'la estación fue agregada ',
        'info'
      )
  
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
          return car.idPeriodo == 151 || car.idPeriodo == 152 || car.idPeriodo == 154 || car.idPeriodo == 682 || car.idPeriodo == 683  ; 
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

filtrarAutocompletado(elemento: any) {
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

                    if(this.idfrecuencia == 152){

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
                        this.serviciosObservacionesEstacionService
                        .autocompletadoDatos( this.formularioConsulta.value)
                          .subscribe((response) => {
                            if(response){

                       
                          Swal.showLoading();
                           this.listaAutocompletado = response;    
                       
                             var serie:any = [];
                            var catidadRepresentativas:any  = [];
                            catidadRepresentativas = this.listaAutocompletado.multiLista;
                   
                            var   cantidad =[];
                            var   cantidad2 =[];
                            var cantidadNivel = [];
                            console.log(this.listaAutocompletado.multiLista.length);
                            for (let  i = 0; i <  this.listaAutocompletado.multiLista.length; i++) {
                            switch (i) {
                            case  0: { 
                                       if(this.listaAutocompletado.multiLista.length < 0){ 


                                       
                                        var myRegression:any = [];
                                        var cantidad1 = [];
                                        var lista_1 = [];
                                        this.listaP=[]
                                        const x:any = [];
                                        const y:any = [];

                                      
                                        for (let  i = 0; i <  this.listaAutocompletado.multiLista[0].length; i++) {
                                             cantidadValor =this.listaAutocompletado.multiLista[0][i].valor
                                              var  ejeY =   this.listaAutocompletado.multiLista[0][i].valor
                                              var  ejex =  this.listaAutocompletado.multiLista[0][i].valor
                                              cantidad1.push([ejex,ejeY]);
                                              this.cantidad_1.push([this.listaAutocompletado.multiLista[0][i].valor ,
                                                this.listaAutocompletado.multiLista[0][i].valor  ]);
                                              var fecha ;
                                              switch ( this.idfrecuencia) {
                                                case 154: {
                                                 
                                                  fecha =  this.listaAutocompletado.multiLista[0][i].fecha+'-01T00:00:00.000';
                                                  break;
                                                }
                                                case 155: {
                                                 
                                                  fecha =    this.listaAutocompletado.multiLista[0][i].fecha+'-01-01T00:00:00.000';
                                                  break;
                                                } case 145: {
                                                 
                                                  fecha =    this.listaAutocompletado.multiLista[0][i].fecha+'T00:00:00.000';
                                                  break;
                                                } case 152: {
                                                 
                                                   var fechaFin1  =   this.listaAutocompletado.multiLista[0][i].fecha
                                                  
                                                  
                                                  const [year, month, day] = fechaFin1.split('/');
                                                  
                                                  fecha = `${year}-${month}-${day}`+'T00:00:00.000';
                                                break;
                                               }case 151: {
                                                      
                                                fecha =   this.listaAutocompletado.multiLista[0][i].fecha+':00:00.000';
                                                var d = new Date(fecha);
                                                 fecha = [d.getFullYear(), d.getMonth() + 1, d.getDate()].join('-') + 'T' + d.getHours()+':00:00.000';
                                               console.log(fecha);
                                            
                                                  break;
                                                  }
                                            
                                                  case 682: {
                                                   
                                                    fecha =   this.listaAutocompletado.multiLista[0][i].fecha+'.000';
                                                     
                                                  break;
                                                }
                                                case 683: {
                                                      
                                                         
                                                  fecha =   this.listaAutocompletado.multiLista[0][i].fecha+'.000';
                                                    
                                            
                                            
                                                break;
                                              }
                                              case 146: {
                                                      
                                                fecha =    this.listaAutocompletado.multiLista[0][i].fecha+'00.000';
                                              break;
                                            }
                                            
                                            case 146: {
                                                      
                                              fecha =     this.listaAutocompletado.multiLista[0][i].fecha+'00.000';
                                            break;
                                            }
                                             
                                               
                                                default: {
                                                  
                                                  break;
                                                }
                                              }
                                            
                                            
                                            var fechaFin:any =  fecha;
                                            
                                  
                                        
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
                                                idParametroXEstacion:this.listParametro.filter(filtro=> filtro.id == this.formularioConsulta.value.idParametro)[0].idPXE,
                                                valor:cantidadValor
                                              };
                                              lista_1.push(lis);
                                    
                                    
                                    
                                        

                                          
                                            }
 
                                          this.listaP = lista_1;

                                          console.log(cantidad1 ,this.cantidad_1);



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
  
                                    

                                
                          
                                          }
                                break;
                             }
                            case  1: {


                              if(this.listaAutocompletado.multiLista[1].length){
                                        var myRegression:any = [];
                                        var cantidad1 = [];
                                        var lista_1 = [];
                                        this.listaP=[]
                                        const x:any = [];
                                        const y:any = [];
                                        for (let  i = 0; i <  this.listaAutocompletado.multiLista[1].length; i++) {
                                            
                                          if(catidadRepresentativas[0][i]  &&   catidadRepresentativas[1][i] ){
          
                                            x.push(catidadRepresentativas[0][i]['valor']);  
                                            y.push(catidadRepresentativas[1][i]['valor']); 
                                            var  ejeY =  catidadRepresentativas[0][i]['valor'] 
                                            var  ejex =  catidadRepresentativas[1][i]['valor'] 
                                            cantidad1.push([ejex,ejeY]);
                                            this.cantidad_1.push([catidadRepresentativas[1][i]['valor'],catidadRepresentativas[0][i]['valor']]);
                                            switch ( this.idfrecuencia) {
                                              case 154: {
                                               
                                                fecha =  catidadRepresentativas[1][i]['fecha']+'-01T00:00:00.000';
                                                break;
                                              }
                                              case 155: {
                                               
                                                fecha =  catidadRepresentativas[1][i]['fecha']+'-01-01T00:00:00.000';
                                                break;
                                              } case 145: {
                                               
                                                fecha =  catidadRepresentativas[1][i]['fecha']+'T00:00:00.000';
                                                break;
                                              } case 152: {
                                               
                                                 var fechaFin1  =  catidadRepresentativas[1][i]['fecha']
                                                
                                                
                                                const [year, month, day] = fechaFin1.split('/');
                                                
                                                fecha = `${year}-${month}-${day}`+'T00:00:00.000';
                                              break;
                                             }case 151: {
                                                    
                                              fecha =  catidadRepresentativas[1][i]['fecha']+':00:00.000';
                                              var d = new Date(fecha);
                                               fecha = [d.getFullYear(), d.getMonth() + 1, d.getDate()].join('-') + 'T' + d.getHours()+':00:00.000';
                                             console.log(fecha);
                                          
                                                break;
                                                }
                                          
                                                case 682: {
                                                  fecha =    catidadRepresentativas[1][i]['fecha']
                                                   
                                                  
                                                break;
                                              }
                                              case 683: {
                                                    
                                                fecha =    catidadRepresentativas[1][i]['fecha']
                                          
                                              break;
                                            }
                                            case 146: {
                                                    
                                              fecha =   catidadRepresentativas[1][i]['fecha']+'00.000';
                                            break;
                                          }
                                          
                                          case 146: {
                                                    
                                            fecha =   catidadRepresentativas[1][i]['fecha']+'00.000';
                                          break;
                                          }
                                           
                                             
                                              default: {
                                                
                                                break;
                                              }
                                            }
                                          
                                          
                                          var fechaFin:any =  fecha;
                                          
                                
                                      
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
                                              idParametroXEstacion:this.listParametro.filter(filtro=> filtro.id == this.formularioConsulta.value.idParametro)[0].idPXE,
                                              valor:cantidadValor
                                            };
                                            
                                            lista_1.push(lis);
                                       
                                          
                                          }else{
                                            
                                              var cantidadValor =  catidadRepresentativas[1][i]['valor'] 
                                              x.push(cantidadValor);  
                                              y.push(catidadRepresentativas[1][i]['valor']); 
                                              var  ejeY =  cantidadValor
                                              var  ejex =  catidadRepresentativas[1][i]['valor'] 
                                              cantidad1.push([ejex,ejeY]);
                                              this.cantidad_1.push([catidadRepresentativas[1][i]['valor'],cantidadValor ]);
                                              var fecha ;
                                              switch ( this.idfrecuencia) {
                                                case 154: {
                                                 
                                                  fecha =  catidadRepresentativas[1][i]['fecha']+'-01T00:00:00.000';
                                                  break;
                                                }
                                                case 155: {
                                                 
                                                  fecha =  catidadRepresentativas[1][i]['fecha']+'-01-01T00:00:00.000';
                                                  break;
                                                } case 145: {
                                                 
                                                  fecha =  catidadRepresentativas[1][i]['fecha']+'T00:00:00.000';
                                                  break;
                                                } case 152: {
                                                 
                                                   var fechaFin1  =  catidadRepresentativas[1][i]['fecha']
                                                  
                                                  
                                                  const [year, month, day] = fechaFin1.split('/');
                                                  
                                                  fecha = `${year}-${month}-${day}`+'T00:00:00.000';
                                                break;
                                               }case 151: {
                                                      
                                                fecha =  catidadRepresentativas[1][i]['fecha']+':00:00.000';
                                                var d = new Date(fecha);
                                                 fecha = [d.getFullYear(), d.getMonth() + 1, d.getDate()].join('-') + 'T' + d.getHours()+':00:00.000';
                                               console.log(fecha);
                                            
                                                  break;
                                                  }
                                            
                                                  case 682: {
                                                    fecha =    catidadRepresentativas[1][i]['fecha']
                                                     
                                                    
                                                  break;
                                                }
                                                case 683: {
                                                      
                                                  fecha =    catidadRepresentativas[1][i]['fecha']
                                            
                                                break;
                                              }
                                              case 146: {
                                                      
                                                fecha =   catidadRepresentativas[1][i]['fecha']+'00.000';
                                              break;
                                            }
                                            
                                            case 146: {
                                                      
                                              fecha =   catidadRepresentativas[1][i]['fecha']+'00.000';
                                            break;
                                            }
                                             
                                               
                                                default: {
                                                  
                                                  break;
                                                }
                                              }
                                            
                                            
                                            var fechaFin:any =  fecha;
                                            
                                  
                                        
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
                                                idParametroXEstacion:this.listParametro.filter(filtro=> filtro.id == this.formularioConsulta.value.idParametro)[0].idPXE,
                                                valor:cantidadValor
                                              };
                                              lista_1.push(lis);
                                           }

                                          }

                                          this.listaP = lista_1;

                                          console.log(this.listaP);



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
                                    'Autocompletado',
                                    'No hay información en la estación representativa '+this.listaItemsElementos[1]['nombreElemento'],
                                    'error'
                                  )
                                }
                          
                          
                                break;
                             }
                             case  2: {


                              if(this.listaAutocompletado.multiLista[2].length){

                                        var myRegression:any = [];
                                        var cantidad1 = [];
                                        var lista_1 = [];
                                        this.listaP=[]
                                        const x:any = [];
                                        const y:any = [];
                                        for (let  i = 0; i <  this.listaAutocompletado.multiLista[2].length; i++) {
                                            
                                          if(catidadRepresentativas[0][i]  &&   catidadRepresentativas[2][i] ){
          
                                            x.push(catidadRepresentativas[0][i]['valor']);  
                                            y.push(catidadRepresentativas[2][i]['valor']); 
                                            var  ejeY =  catidadRepresentativas[0][i]['valor'] 
                                            var  ejex =  catidadRepresentativas[2][i]['valor'] 
                                            cantidad1.push([ejex,ejeY]);
                                            this.cantidad_1.push([catidadRepresentativas[2][i]['valor'],catidadRepresentativas[0][i]['valor']]);
                                          
                                          }else{
                                            
                                              var cantidadValor =  catidadRepresentativas[2][i]['valor'] 
                                              x.push(cantidadValor);  
                                              y.push(catidadRepresentativas[2][i]['valor']); 
                                              var  ejeY =  cantidadValor
                                              var  ejex =  catidadRepresentativas[2][i]['valor'] 
                                              cantidad1.push([ejex,ejeY]);
                                              this.cantidad_2.push([catidadRepresentativas[2][i]['valor'],cantidadValor ]);
                                              var fecha ;
                                              switch ( this.idfrecuencia) {
                                                case 154: {
                                                 
                                                  fecha =  catidadRepresentativas[2][i]['fecha']+'-01T00:00:00.000';
                                                  break;
                                                }
                                                case 155: {
                                                 
                                                  fecha =  catidadRepresentativas[2][i]['fecha']+'-01-01T00:00:00.000';
                                                  break;
                                                } case 145: {
                                                 
                                                  fecha =  catidadRepresentativas[2][i]['fecha']+'T00:00:00.000';
                                                  break;
                                                } case 152: {
                                                 
                                                   var fechaFin1  =  catidadRepresentativas[2][i]['fecha']
                                                  
                                                  
                                                  const [year, month, day] = fechaFin1.split('/');
                                                  
                                                  fecha = `${year}-${month}-${day}`+'T00:00:00.000';
                                                break;
                                               }case 151: {
                                                      
                                                fecha =  catidadRepresentativas[2][i]['fecha']+':00:00.000';
                                                var d = new Date(fecha);
                                                 fecha = [d.getFullYear(), d.getMonth() + 1, d.getDate()].join('-') + 'T' + d.getHours()+':00:00.000';
                                               console.log(fecha);
                                            
                                                  break;
                                                  }
                                            
                                                  case 682: {
                                                    fecha =    catidadRepresentativas[2][i]['fecha']+'.000';
                                                     
                                                    
                                                  break;
                                                }
                                                case 683: {
                                                      
                                                  fecha =    catidadRepresentativas[2][i]['fecha']+'.000';
                                            
                                                break;
                                              }
                                              case 146: {
                                                      
                                                fecha =   catidadRepresentativas[2][i]['fecha']+'00.000';
                                              break;
                                            }
                                            
                                            case 146: {
                                                      
                                              fecha =   catidadRepresentativas[2][i]['fecha']+'00.000';
                                            break;
                                            }
                                             
                                               
                                                default: {
                                                  
                                                  break;
                                                }
                                              }
                                            
                                            
                                            var fechaFin:any =  fecha;
                                            
                                  
                                        
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
                                                idParametroXEstacion:this.listParametro.filter(filtro=> filtro.id == this.formularioConsulta.value.idParametro)[0].idPXE,
                                                valor:cantidadValor
                                              };
                                              lista_1.push(lis);
                                           }

                                          
                                              
                                          


                                          }

                                          this.listaP = lista_1;

                                          console.log(this.listaP);



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
                                    'Autocompletado',
                                    'No hay información en la estación representativa '+this.listaItemsElementos[2]['nombreElemento'],
                                    'error'
                                  )
                                }
                          
                          
                                break;
                             }
                      
                             case  3: {


                              if(this.listaAutocompletado.multiLista[3].length){

                                        var myRegression:any = [];
                                        var cantidad1 = [];
                                        var lista_1 = [];
                                        this.listaP=[]
                                        const x:any = [];
                                        const y:any = [];
                                        for (let  i = 0; i <  this.listaAutocompletado.multiLista[3].length; i++) {
                                            
                                          if(catidadRepresentativas[0][i]  &&   catidadRepresentativas[3][i] ){
          
                                            x.push(catidadRepresentativas[0][i]['valor']);  
                                            y.push(catidadRepresentativas[3][i]['valor']); 
                                            var  ejeY =  catidadRepresentativas[0][i]['valor'] 
                                            var  ejex =  catidadRepresentativas[3][i]['valor'] 
                                            cantidad1.push([ejex,ejeY]);
                                            this.cantidad_1.push([catidadRepresentativas[3][i]['valor'],catidadRepresentativas[0][i]['valor']]);
                                          
                                          }else{
                                            
                                              var cantidadValor =  catidadRepresentativas[3][i]['valor'] 
                                              x.push(cantidadValor);  
                                              y.push(catidadRepresentativas[3][i]['valor']); 
                                              var  ejeY =  cantidadValor
                                              var  ejex =  catidadRepresentativas[3][i]['valor'] 
                                              cantidad1.push([ejex,ejeY]);
                                              this.cantidad_2.push([catidadRepresentativas[3][i]['valor'],cantidadValor ]);
                                              var fecha ;
                                              switch ( this.idfrecuencia) {
                                                case 154: {
                                                 
                                                  fecha =  catidadRepresentativas[3][i]['fecha']+'-01T00:00:00.000';
                                                  break;
                                                }
                                                case 155: {
                                                 
                                                  fecha =  catidadRepresentativas[3][i]['fecha']+'-01-01T00:00:00.000';
                                                  break;
                                                } case 145: {
                                                 
                                                  fecha =  catidadRepresentativas[3][i]['fecha']+'T00:00:00.000';
                                                  break;
                                                } case 152: {
                                                 
                                                   var fechaFin1  =  catidadRepresentativas[3][i]['fecha']
                                                  
                                                  
                                                  const [year, month, day] = fechaFin1.split('/');
                                                  
                                                  fecha = `${year}-${month}-${day}`+'T00:00:00.000';
                                                break;
                                               }case 151: {
                                                      
                                                fecha =  catidadRepresentativas[3][i]['fecha']+':00:00.000';
                                                var d = new Date(fecha);
                                                 fecha = [d.getFullYear(), d.getMonth() + 1, d.getDate()].join('-') + 'T' + d.getHours()+':00:00.000';
                                               console.log(fecha);
                                            
                                                  break;
                                                  }
                                            
                                                  case 682: {
                                                    fecha =    catidadRepresentativas[3][i]['fecha']+'.000';
                                                     
                                                    
                                                  break;
                                                }
                                                case 683: {
                                                      
                                                  fecha =    catidadRepresentativas[3][i]['fecha']+'.000';
                                            
                                                break;
                                              }
                                              case 146: {
                                                      
                                                fecha =   catidadRepresentativas[3][i]['fecha']+'00.000';
                                              break;
                                            }
                                            
                                            case 146: {
                                                      
                                              fecha =   catidadRepresentativas[3][i]['fecha']+'00.000';
                                            break;
                                            }
                                             
                                               
                                                default: {
                                                  
                                                  break;
                                                }
                                              }
                                            
                                            
                                            var fechaFin:any =  fecha;
                                            
                                  
                                        
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
                                                idParametroXEstacion:this.listParametro.filter(filtro=> filtro.id == this.formularioConsulta.value.idParametro)[0].idPXE,
                                                valor:cantidadValor
                                              };
                                              lista_1.push(lis);
                                           }

                                          
                                              
                                          


                                          }

                                          this.listaP = lista_1;

                                          console.log(this.listaP);



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
                                    'Autocompletado',
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
                                        var lista_1 = [];
                                        this.listaP=[]
                                        const x:any = [];
                                        const y:any = [];
                                        for (let  i = 0; i <  this.listaAutocompletado.multiLista[4].length; i++) {
                                            
                                          if(catidadRepresentativas[0][i]  &&   catidadRepresentativas[4][i] ){
          
                                            x.push(catidadRepresentativas[0][i]['valor']);  
                                            y.push(catidadRepresentativas[4][i]['valor']); 
                                            var  ejeY =  catidadRepresentativas[0][i]['valor'] 
                                            var  ejex =  catidadRepresentativas[4][i]['valor'] 
                                            cantidad1.push([ejex,ejeY]);
                                            this.cantidad_1.push([catidadRepresentativas[4][i]['valor'],catidadRepresentativas[0][i]['valor']]);
                                          
                                          }else{
                                            
                                              var cantidadValor =  catidadRepresentativas[4][i]['valor'] 
                                              x.push(cantidadValor);  
                                              y.push(catidadRepresentativas[3][i]['valor']); 
                                              var  ejeY =  cantidadValor
                                              var  ejex =  catidadRepresentativas[3][i]['valor'] 
                                              cantidad1.push([ejex,ejeY]);
                                              this.cantidad_2.push([catidadRepresentativas[4][i]['valor'],cantidadValor ]);
                                              var fecha ;
                                              switch ( this.idfrecuencia) {
                                                case 154: {
                                                 
                                                  fecha =  catidadRepresentativas[4][i]['fecha']+'-01T00:00:00.000';
                                                  break;
                                                }
                                                case 155: {
                                                 
                                                  fecha =  catidadRepresentativas[4][i]['fecha']+'-01-01T00:00:00.000';
                                                  break;
                                                } case 145: {
                                                 
                                                  fecha =  catidadRepresentativas[4][i]['fecha']+'T00:00:00.000';
                                                  break;
                                                } case 152: {
                                                 
                                                   var fechaFin1  =  catidadRepresentativas[4][i]['fecha']
                                                  
                                                  
                                                  const [year, month, day] = fechaFin1.split('/');
                                                  
                                                  fecha = `${year}-${month}-${day}`+'T00:00:00.000';
                                                break;
                                               }case 151: {
                                                      
                                                fecha =  catidadRepresentativas[4][i]['fecha']+':00:00.000';
                                                var d = new Date(fecha);
                                                 fecha = [d.getFullYear(), d.getMonth() + 1, d.getDate()].join('-') + 'T' + d.getHours()+':00:00.000';
                                               console.log(fecha);
                                            
                                                  break;
                                                  }
                                            
                                                  case 682: {
                                                    fecha =    catidadRepresentativas[4][i]['fecha']+'.000';
                                                     
                                                    
                                                  break;
                                                }
                                                case 683: {
                                                      
                                                  fecha =    catidadRepresentativas[4][i]['fecha']+'.000';
                                            
                                                break;
                                              }
                                              case 146: {
                                                      
                                                fecha =   catidadRepresentativas[4][i]['fecha']+'00.000';
                                              break;
                                            }
                                            
                                            case 146: {
                                                      
                                              fecha =   catidadRepresentativas[4][i]['fecha']+'00.000';
                                            break;
                                            }
                                             
                                               
                                                default: {
                                                  
                                                  break;
                                                }
                                              }
                                            
                                            
                                            var fechaFin:any =  fecha;
                                            
                                  
                                        
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
                                                idParametroXEstacion:this.listParametro.filter(filtro=> filtro.id == this.formularioConsulta.value.idParametro)[0].idPXE,
                                                valor:cantidadValor
                                              };
                                              lista_1.push(lis);
                                           }

                                          
                                              
                                          


                                          }

                                          this.listaP = lista_1;

                                          console.log(this.listaP);



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
                                    'Autocompletado',
                                    'No hay información en la estación representativa '+this.listaItemsElementos[4]['nombreElemento'],
                                    'error'
                                  )
                                }
                          
                          
                                break;
                             }
                             case  4: {


                              if(this.listaAutocompletado.multiLista[4].length){

                                        var myRegression:any = [];
                                        var cantidad1 = [];
                                        var lista_1 = [];
                                        this.listaP=[]
                                        const x:any = [];
                                        const y:any = [];
                                        for (let  i = 0; i <  this.listaAutocompletado.multiLista[5].length; i++) {
                                            
                                          if(catidadRepresentativas[0][i]  &&   catidadRepresentativas[5][i] ){
          
                                            x.push(catidadRepresentativas[0][i]['valor']);  
                                            y.push(catidadRepresentativas[5][i]['valor']); 
                                            var  ejeY =  catidadRepresentativas[0][i]['valor'] 
                                            var  ejex =  catidadRepresentativas[5][i]['valor'] 
                                            cantidad1.push([ejex,ejeY]);
                                            this.cantidad_1.push([catidadRepresentativas[5][i]['valor'],catidadRepresentativas[0][i]['valor']]);
                                          
                                          }else{
                                            
                                              var cantidadValor =  catidadRepresentativas[4][i]['valor'] 
                                              x.push(cantidadValor);  
                                              y.push(catidadRepresentativas[3][i]['valor']); 
                                              var  ejeY =  cantidadValor
                                              var  ejex =  catidadRepresentativas[3][i]['valor'] 
                                              cantidad1.push([ejex,ejeY]);
                                              this.cantidad_2.push([catidadRepresentativas[5][i]['valor'],cantidadValor ]);
                                              var fecha ;
                                              switch ( this.idfrecuencia) {
                                                case 154: {
                                                 
                                                  fecha =  catidadRepresentativas[5][i]['fecha']+'-01T00:00:00.000';
                                                  break;
                                                }
                                                case 155: {
                                                 
                                                  fecha =  catidadRepresentativas[5][i]['fecha']+'-01-01T00:00:00.000';
                                                  break;
                                                } case 145: {
                                                 
                                                  fecha =  catidadRepresentativas[5][i]['fecha']+'T00:00:00.000';
                                                  break;
                                                } case 152: {
                                                 
                                                   var fechaFin1  =  catidadRepresentativas[5][i]['fecha']
                                                  
                                                  
                                                  const [year, month, day] = fechaFin1.split('/');
                                                  
                                                  fecha = `${year}-${month}-${day}`+'T00:00:00.000';
                                                break;
                                               }case 151: {
                                                      
                                                fecha =  catidadRepresentativas[5][i]['fecha']+':00:00.000';
                                                var d = new Date(fecha);
                                                 fecha = [d.getFullYear(), d.getMonth() + 1, d.getDate()].join('-') + 'T' + d.getHours()+':00:00.000';
                                               console.log(fecha);
                                            
                                                  break;
                                                  }
                                            
                                                  case 682: {
                                                    fecha =    catidadRepresentativas[5][i]['fecha']+'.000';
                                                     
                                                    
                                                  break;
                                                }
                                                case 683: {
                                                      
                                                  fecha =    catidadRepresentativas[5][i]['fecha']+'.000';
                                            
                                                break;
                                              }
                                              case 146: {
                                                      
                                                fecha =   catidadRepresentativas[5][i]['fecha']+'00.000';
                                              break;
                                            }
                                            
                                            case 146: {
                                                      
                                              fecha =   catidadRepresentativas[5][i]['fecha']+'00.000';
                                            break;
                                            }
                                             
                                               
                                                default: {
                                                  
                                                  break;
                                                }
                                              }
                                            
                                            
                                            var fechaFin:any =  fecha;
                                            
                                  
                                        
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
                                                idParametroXEstacion:this.listParametro.filter(filtro=> filtro.id == this.formularioConsulta.value.idParametro)[0].idPXE,
                                                valor:cantidadValor
                                              };
                                              lista_1.push(lis);
                                           }

                                          
                                              
                                          


                                          }

                                          this.listaP = lista_1;

                                          console.log(this.listaP);



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
                                    'Autocompletado',
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
                              case 0: {
                                  if(this.listaAutocompletado.multiLista[0].length){
  
                                        serie.push( 
                                            {
                                          point: {
                                            events: {
                                                click: function(event1:any,formdate:any) {
                                                        var3 = catidadRepresentativas[0].filter((filtro:any)=> filtro.valor == event1.point.options.x)[0].fecha;
                                                        var2 = event1.point.options.y
                                                        var1 = event1.point.options.x
                                                        let div:any=document.getElementById(`btn`);
                                                        div.click();
                                                      
                                                }
                                            }
                                        },
                                              type: 'scatter',
                                          name: this.listaItemsElementos[i]['nombreElemento'],
                                              data: this.cantidad_1,
                                            }
                                          );
  
                                      serie.push( 
                                        {
                                          point: {
                                            events: {
                                                click: function(event1:any,formdate:any) {
                                          
                                                        var3 = catidadRepresentativas[0].filter((filtro:any)=> filtro.valor == event1.point.options.x)[0].fecha;
                                                        var2 = event1.point.options.y
                                                        var1 = event1.point.options.x
                                                        let div:any=document.getElementById(`btn`);
                                                        div.click();
                                                      
                                                }
                                            }
                                        },
                                          type: 'line',
                                          name:  'Regreción lineal '+ this.listaItemsElementos[i]['nombreElemento'],
                                          data: this.cantidad_1_1,
                                        }
                                      );
  
  
                                      this.nombreEstacionA = this.listaItemsElementos[i]['nombreElemento'];
  
                                  
                                }
                                          break;
                                        }
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
                                            type: 'scatter',
                                        name: this.listaItemsElementos[i]['nombreElemento'],
                                            data: this.cantidad_1,
                                          }
                                        );

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
                                        name:  'Regreción lineal '+ this.listaItemsElementos[i]['nombreElemento'],
                                        data: this.cantidad_1_1,
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
                                      type: 'scatter',
                                  name: this.listaItemsElementos[i]['nombreElemento'],
                                      data: this.cantidad_2,
                                    }
                                  );


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
                                  name: 'Regreción lineal '+this.listaItemsElementos[i]['nombreElemento'],
                                  data: this.cantidad_2_2,
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
                           this.obtener();
                            Swal.close();
                        
                        
                             } 
                            
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
              'Autocompletado',
              'Debe ingresar al menos una estación representativa ',
              'error'
            )
          }

        }else{
          Swal.fire(
            'Autocompletado',
            'Debe ingresar los datos solicitados  ',
            'error'
          )
        }


      } catch (error) {
        Swal.fire(
          'Autocompletado',
          'Debe ingresar los datos solicitados  ',
          'error'
        )
       
      }

}



buscarEstacion(){
     
 var request =  this.formularioConsulta.value;

  if ( this.verFechas ) {
    if ( !this.assertNullAndUndefined(request.fechaInicio) ) {
      console.error('La fecha de inicio: ' + request.fechaInicio + ' NO es valida.');
      Swal.close();
    }

    /*
    let nHypes = 0;
    for ( let index=0; index<request.fechaInicio.length; index++ ) {
      if ( request.fechaInicio.charAt(index) == '-' ) {
        nHypes++;
      }
    }

    if ( nHypes == 1 ) {
      request.fechaInicio += '-01'
    } else if ( nHypes == 0 ) {
      request.fechaInicio += '-01-01'
    }
    */

    request.fechaInicio += '-01';

    if ( !request.fechaInicio.includes(':') ) {
      request.fechaInicio += " 00:00:00";
    }

    if ( !this.assertNullAndUndefined(request.fechaFin) ) {
      console.error('La fecha fin: ' + request.fechaFin + ' NO es valida.');
      Swal.close();
      return;
    }

    /*
    nHypes = 0;
    for ( let index=0; index<request.fechaFin.length; index++ ) {
      if ( request.fechaFin.charAt(index) == '-' ) {
        nHypes++;
      }
    }

    if ( nHypes == 1 ) {
      //yyyy-mm
      let tokens = request.fechaFin.split('-');
      let year = tokens[0];
      let month = tokens[1];
      let endDate = new Date(year, month, 0);
      request.fechaFin += '-' + (endDate.getDate()>=10 ? endDate.getDate() : ('0'+endDate.getDate()));
    }  else if ( nHypes == 0 ) {
      request.fechaFin += '-12-31';
    }
    */

    let tokens = request.fechaFin.split('-');
    let year = tokens[0];
    let month = tokens[1];
    let endDate = new Date(year, month, 0);
    request.fechaFin += '-' + (endDate.getDate()>=10 ? endDate.getDate() : ('0'+endDate.getDate()));

    if ( !request.fechaFin.includes(':') ) {
      request.fechaFin += " 23:59:59";
    }

    if ( !request.fechaFin.includes(':') ) {
      request.fechaInicio += " 00:00:00";
    }
    
    request.fechaFin =  request.fechaFin.replace(' ', 'T');
    request.fechaInicio =  request.fechaInicio.replace(' ', 'T');


  } else {
    let currentDate : Date = new Date();
    this.formularioConsulta.value.fechaInicio = "1900-01-01 00:00:00";
    this.formularioConsulta.value.fechaFin = currentDate.getFullYear()+30 + "-12-31 23:59:59";
  }
  console.log();


  console.log( this.formularioConsulta);


 if( this.formularioConsulta.value.frecuencia &&
  this.formularioConsulta.value.fechaFin &&
  this.formularioConsulta.value.frecuencia ){ 

    request.idElementoString = this.idElementoAgregar


    this.serviciosObservacionesEstacionService
        .cantidadEstado( request)
        .subscribe((response) => {  
          
              var numero:any = response
              if(numero == this.cantidadRegistros){
                this.agregarElemento(); 
               
              }else{
                Swal.fire(
                  'Autocompletado',
                  'La esatción debe tener # '+ this.cantidadRegistros+'  observaciones para realizar la compraración',
                  'error'
                )
              }
          
          });

  }else{
    Swal.fire(
      'Autocompletado',
      'Debes ingresar toda la imforamción ',
      'error'
    )
  }




} 



graficapdf(){
  this.lineChart.chart.exportChart({
    type: "application/pdf",
    filename: "line-chart"
  });

}

cargaMaviva(lista:any){   


  if(this.listaP[0]){
    Swal.fire({
      title: 'Cargando datos...',
      html: 'Por favor espere',
      allowOutsideClick: false, 
      showConfirmButton: false, 
      timerProgressBar: true,
      didOpen: async() => {
    this.serviciosObservacionesEstacionService
    .creacionMasiva(lista)
    .subscribe((Response) => {
    
 
          
      this.listObservacionesInsertadas = Response;
      
            if(Response.length  == 0){
              
            
              Swal.fire(
                'Autocompletado',
                'Tiene ' +Response.length +' Observaciones de agregación !',
                'error'
              )

            }else{
              
              Swal.fire(
                'Autocompletado',
                'se gurardaron ' +Response.length +' Observaciones de agregación !',
                'info'
              )



            }
   
          
            Swal.fire({
              title: 'Autocompletado',
              html: 'El autocompletado fue exitoso  ',
              allowOutsideClick: false, 
              showConfirmButton: false, 
              timer: 2000, 
              timerProgressBar: true,
              didOpen: async() => {
               
              }, 
              willClose: async() => {
                Swal.hideLoading();
              }
            });

            Swal.close();
            window.location.reload();
          });
          }, 
          willClose: async() => {

        

            Swal.hideLoading();
          }
        });
          
    



  }else{
    Swal.fire(
      'Autocompletado',
      'No hay información!',
      'error'
    )
  }


  }


autocompletado(){
  Swal.fire({
    title: 'Desea guardar?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Guardar',
  }).then((result) => {
    if (result.isConfirmed) {
        console.log(this.listaP);
        this.cargaMaviva(this.listaP);
      }
  });
}





accionRegistroColumnas(e: any) {

  switch (e.accion) {
    case 'autoCompletado': {
      this.fechaMes ;
      this.fechaMesFin ;
      this.cantidadRegistros ;
      var total:any = function (data: number, type: any, row: any, meta: any) {
        if ( null==row || undefined==row ) {
          return '';
        }
  
        if ( null==row.fecha || undefined==row.fecha ) {
          return '';
        }
  
        if ( null==row.frecuencia || undefined==row.frecuencia ) {
          return '';
        }
        
        // 2022-01 YYYY-MM
        // 2022
        let fecha = row.fecha;
        if ( null==fecha || undefined==fecha || !fecha.includes('-') || fecha.split('-').length<2 ) {
          return '';
        }
  
        let fechaTokens = fecha.split('-');
        let year = parseInt(fechaTokens[0]);
        let month = parseInt(fechaTokens[1]);
  
        let lastDayOfMonth = new Date(year, month, 0);
        let maxDayOnMonth = lastDayOfMonth.getDate();
  
        let frecuencia = row.frecuencia;
  
        if ( frecuencia==='Segundos' ) {
          /*
          // "2022-08-14 00:00:00"
          let fechaInicio = row.fechaInicio;
  
          if ( null==fechaInicio || undefined==fechaInicio || !fechaInicio.includes('-') || !fechaInicio.includes(':') ) {
            return '';
          }
  
          let fechaTokens = fechaInicio.split('-');
          if ( null==fechaTokens || undefined==fechaTokens || fechaTokens.length<3 || !fechaTokens[2].includes(' ') || fechaTokens[2].split(' ').length<1 ) {
            return '';
          }
  
          let year = fechaTokens[0];
          let month = fechaTokens[1];
          let day = fechaTokens[2].split(' ')[0];
  
          let horaTokens = fechaInicio.split(':');
          if ( null==horaTokens || undefined==horaTokens || horaTokens.length<3 || !horaTokens[0].includes(' ') || horaTokens[0].split(' ').length<2 ) {
            return '';
          }
  
          let hour = horaTokens[0].split(' ')[1];
          let minute = horaTokens[1];
          let second = horaTokens[2];
  
          let fechaInicioDate : any = new Date(year, month-1, day, hour, minute, second);
  
          // "2022-08-15 23:59:59"
          let fechaFin = row.fechaFin;
  
          if ( null==fechaFin || undefined==fechaFin || !fechaFin.includes('-') || !fechaFin.includes(':') ) {
            return '';
          }
  
          fechaTokens = fechaFin.split('-');
          if ( null==fechaTokens || undefined==fechaTokens || fechaTokens.length<3 || !fechaTokens[2].includes(' ') || fechaTokens[2].split(' ').length<1 ) {
            return '';
          }
  
          year = fechaTokens[0];
          month = fechaTokens[1];
          day = fechaTokens[2].split(' ')[0];
  
          horaTokens = fechaFin.split(':');
          if ( null==horaTokens || undefined==horaTokens || horaTokens.length<3 || !horaTokens[0].includes(' ') || horaTokens[0].split(' ').length<2 ) {
            return '';
          }
  
          hour = horaTokens[0].split(' ')[1];
          minute = horaTokens[1];
          second = horaTokens[2];
  
          let fechaFinDate : any = new Date(year, month-1, day, hour, minute, second);
  
          let diff = Math.abs(fechaFinDate - fechaInicioDate);
          let seconds = Math.floor(diff/1000);
  
          // return '' + seconds;
          */
          return '' + (maxDayOnMonth * 24 * 60 * 60);
  
          /*
          let codigos = row.codigoParametros;
          if ( null!=codigos && undefined!=codigos && codigos.length==0 ) {
            // Cantidad de segundos en un mes
            return '' + (maxDayOnMonth * 24 * 60 * 60);
          }
  
          // Cantidad de segundos en un minuto
          return '60';
          */
  
        } else if ( frecuencia==='Minutos' ) {
          /*
          // "2022-08-14 00:00:00"
          let fechaInicio = row.fechaInicio;
  
          if ( null==fechaInicio || undefined==fechaInicio || !fechaInicio.includes('-') || !fechaInicio.includes(':') ) {
            return '';
          }
  
          let fechaTokens = fechaInicio.split('-');
          if ( null==fechaTokens || undefined==fechaTokens || fechaTokens.length<3 || !fechaTokens[2].includes(' ') || fechaTokens[2].split(' ').length<1 ) {
            return '';
          }
  
          let year = fechaTokens[0];
          let month = fechaTokens[1];
          let day = fechaTokens[2].split(' ')[0];
  
          let horaTokens = fechaInicio.split(':');
          if ( null==horaTokens || undefined==horaTokens || horaTokens.length<3 || !horaTokens[0].includes(' ') || horaTokens[0].split(' ').length<2 ) {
            return '';
          }
  
          let hour = horaTokens[0].split(' ')[1];
          let minute = horaTokens[1];
          let second = horaTokens[2];
  
          let fechaInicioDate : any = new Date(year, month-1, day, hour, minute, second);
  
          // "2022-08-15 23:59:59"
          let fechaFin = row.fechaFin;
  
          if ( null==fechaFin || undefined==fechaFin || !fechaFin.includes('-') || !fechaFin.includes(':') ) {
            return '';
          }
  
          fechaTokens = fechaFin.split('-');
          if ( null==fechaTokens || undefined==fechaTokens || fechaTokens.length<3 || !fechaTokens[2].includes(' ') || fechaTokens[2].split(' ').length<1 ) {
            return '';
          }
  
          year = fechaTokens[0];
          month = fechaTokens[1];
          day = fechaTokens[2].split(' ')[0];
  
          horaTokens = fechaFin.split(':');
          if ( null==horaTokens || undefined==horaTokens || horaTokens.length<3 || !horaTokens[0].includes(' ') || horaTokens[0].split(' ').length<2 ) {
            return '';
          }
  
          hour = horaTokens[0].split(' ')[1];
          minute = horaTokens[1];
          second = horaTokens[2];
  
          let fechaFinDate : any = new Date(year, month-1, day, hour, minute, second);
  
          let diff = Math.abs(fechaFinDate.getTime() - fechaInicioDate.getTime());
          let minutes = Math.floor(diff/1000/60);
          
          //return '' + (maxDayOnMonth * 24 * minutes);
          //return minutes;
          */
  
          return '' + (maxDayOnMonth * 24 * 60);
  
          /*
          let codigos = row.codigoParametros;
          if ( null!=codigos && undefined!=codigos && codigos.length==0 ) {
            // Cantidad de minutos en un mes
            return '' + (maxDayOnMonth * 24 * 60);
          }
  
          // Cantidad de minutos en 1 hora
          return '60';
          */
  
        } else if ( frecuencia==='5 Minutal' ) {
          /*
          // "2022-08-14 00:00:00"
          let fechaInicio = row.fechaInicio;
          
          if ( null==fechaInicio || undefined==fechaInicio || !fechaInicio.includes('-') || !fechaInicio.includes(':') ) {
            return '';
          }
  
          let fechaTokens = fechaInicio.split('-');
          if ( null==fechaTokens || undefined==fechaTokens || fechaTokens.length<3 || !fechaTokens[2].includes(' ') || fechaTokens[2].split(' ').length<1 ) {
            return '';
          }
  
          let year = fechaTokens[0];
          let month = fechaTokens[1];
          let day = fechaTokens[2].split(' ')[0];
  
          let horaTokens = fechaInicio.split(':');
          if ( null==horaTokens || undefined==horaTokens || horaTokens.length<3 || !horaTokens[0].includes(' ') || horaTokens[0].split(' ').length<2 ) {
            return '';
          }
  
          let hour = horaTokens[0].split(' ')[1];
          let minute = horaTokens[1];
          let second = horaTokens[2];
  
          let fechaInicioDate : any = new Date(year, month-1, day, hour, minute, second);
  
          // "2022-08-15 23:59:59"
          let fechaFin = row.fechaFin;
  
          if ( null==fechaFin || undefined==fechaFin || !fechaFin.includes('-') || !fechaFin.includes(':') ) {
            return '';
          }
  
          fechaTokens = fechaFin.split('-');
          if ( null==fechaTokens || undefined==fechaTokens || fechaTokens.length<3 || !fechaTokens[2].includes(' ') || fechaTokens[2].split(' ').length<1 ) {
            return '';
          }
  
          year = fechaTokens[0];
          month = fechaTokens[1];
          day = fechaTokens[2].split(' ')[0];
  
          horaTokens = fechaFin.split(':');
          if ( null==horaTokens || undefined==horaTokens || horaTokens.length<3 || !horaTokens[0].includes(' ') || horaTokens[0].split(' ').length<2 ) {
            return '';
          }
  
          hour = horaTokens[0].split(' ')[1];
          minute = horaTokens[1];
          second = horaTokens[2];
  
          let fechaFinDate : any = new Date(year, month-1, day, hour, minute, second);
  
          let diff = Math.abs(fechaFinDate - fechaInicioDate);
          let minutes5 = Math.floor((diff/1000)/60/5);
          */
  
          //return '' + (maxDayOnMonth * 24 * 12);
          // return '' + minutes5;
  
          return '' + (maxDayOnMonth * 24 * 60 / 5);
  
          /*
          let codigos = row.codigoParametros;
          if ( null!=codigos && undefined!=codigos && codigos.length==0 ) {
            // Cantidad de 5-minutos en un mes
            return '' + (maxDayOnMonth * 24 * 60 / 5);
          }
  
          // Cantidad de 5-minutal en 1 hora.
          return '12';
          */
  
        } else if ( frecuencia==='10 Minutal' ) {
          /*
          // "2022-08-14 00:00:00"
          let fechaInicio = row.fechaInicio;
          
          if ( null==fechaInicio || undefined==fechaInicio || !fechaInicio.includes('-') || !fechaInicio.includes(':') ) {
            return '';
          }
  
          let fechaTokens = fechaInicio.split('-');
          if ( null==fechaTokens || undefined==fechaTokens || fechaTokens.length<3 || !fechaTokens[2].includes(' ') || fechaTokens[2].split(' ').length<1 ) {
            return '';
          }
  
          let year = fechaTokens[0];
          let month = fechaTokens[1];
          let day = fechaTokens[2].split(' ')[0];
  
          let horaTokens = fechaInicio.split(':');
          if ( null==horaTokens || undefined==horaTokens || horaTokens.length<3 || !horaTokens[0].includes(' ') || horaTokens[0].split(' ').length<2 ) {
            return '';
          }
  
          let hour = horaTokens[0].split(' ')[1];
          let minute = horaTokens[1];
          let second = horaTokens[2];
  
          let fechaInicioDate : any = new Date(year, month-1, day, hour, minute, second);
  
          // "2022-08-15 23:59:59"
          let fechaFin = row.fechaFin;
  
          if ( null==fechaFin || undefined==fechaFin || !fechaFin.includes('-') || !fechaFin.includes(':') ) {
            return '';
          }
  
          fechaTokens = fechaFin.split('-');
          if ( null==fechaTokens || undefined==fechaTokens || fechaTokens.length<3 || !fechaTokens[2].includes(' ') || fechaTokens[2].split(' ').length<1 ) {
            return '';
          }
  
          year = fechaTokens[0];
          month = fechaTokens[1];
          day = fechaTokens[2].split(' ')[0];
  
          horaTokens = fechaFin.split(':');
          if ( null==horaTokens || undefined==horaTokens || horaTokens.length<3 || !horaTokens[0].includes(' ') || horaTokens[0].split(' ').length<2 ) {
            return '';
          }
  
          hour = horaTokens[0].split(' ')[1];
          minute = horaTokens[1];
          second = horaTokens[2];
  
          let fechaFinDate : any = new Date(year, month-1, day, hour, minute, second);
  
          let diff = Math.abs(fechaFinDate - fechaInicioDate);
          let minutes10 = Math.floor((diff/1000)/60/10);
          */
  
          // return '' + (maxDayOnMonth * 24 * 6);
          // return minutes10;
  
          return '' + (maxDayOnMonth * 24 * 60 / 10);
  
          /*
          let codigos = row.codigoParametros;
          if ( null!=codigos && undefined!=codigos && codigos.length==0 ) {
            // Cantidad de 10-minutos en un mes
            return '' + (maxDayOnMonth * 24 * 60 / 10);
          }
  
          // Cantidad de 10-minutal en 1 hora
          return '6';
          */
  
        } else if ( frecuencia==='Hora' ) {
          /*
          // "2022-08-14 00:00:00"
          let fechaInicio = row.fechaInicio;
          
          if ( null==fechaInicio || undefined==fechaInicio || !fechaInicio.includes('-') || !fechaInicio.includes(':') ) {
            return '';
          }
  
          let fechaTokens = fechaInicio.split('-');
          if ( null==fechaTokens || undefined==fechaTokens || fechaTokens.length<3 || !fechaTokens[2].includes(' ') || fechaTokens[2].split(' ').length<1 ) {
            return '';
          }
  
          let year = fechaTokens[0];
          let month = fechaTokens[1];
          let day = fechaTokens[2].split(' ')[0];
  
          let horaTokens = fechaInicio.split(':');
          if ( null==horaTokens || undefined==horaTokens || horaTokens.length<3 || !horaTokens[0].includes(' ') || horaTokens[0].split(' ').length<2 ) {
            return '';
          }
  
          let hour = horaTokens[0].split(' ')[1];
          let minute = horaTokens[1];
          let second = horaTokens[2];
  
          let fechaInicioDate : any = new Date(year, month-1, day, hour, minute, second);
  
          // "2022-08-15 23:59:59"
          let fechaFin = row.fechaFin;
  
          if ( null==fechaFin || undefined==fechaFin || !fechaFin.includes('-') || !fechaFin.includes(':') ) {
            return '';
          }
  
          fechaTokens = fechaFin.split('-');
          if ( null==fechaTokens || undefined==fechaTokens || fechaTokens.length<3 || !fechaTokens[2].includes(' ') || fechaTokens[2].split(' ').length<1 ) {
            return '';
          }
  
          year = fechaTokens[0];
          month = fechaTokens[1];
          day = fechaTokens[2].split(' ')[0];
  
          horaTokens = fechaFin.split(':');
          if ( null==horaTokens || undefined==horaTokens || horaTokens.length<3 || !horaTokens[0].includes(' ') || horaTokens[0].split(' ').length<2 ) {
            return '';
          }
  
          hour = horaTokens[0].split(' ')[1];
          minute = horaTokens[1];
          second = horaTokens[2];
  
          let fechaFinDate : any = new Date(year, month-1, day, hour, minute, second);
  
          let diff = Math.abs(fechaFinDate - fechaInicioDate);
          let hours = Math.floor((diff/1000)/60/60);
          */
  
          // return '' + hours;
          //return '' + (maxDayOnMonth * 24);
  
          return '' + (maxDayOnMonth * 24);
  
          /*
          let codigos = row.codigoParametros;
          if ( null!=codigos && undefined!=codigos && codigos.length==0 ) {
            // Cantidad de horas en un mes
            return '' + (maxDayOnMonth * 24);
          }
          
          // Cantidad de horas en 1 dia
          return '24';
          */
  
        } else if ( frecuencia === 'Día' ) {
          // Cantidad de dias en el mes.
          return '' + maxDayOnMonth;
  
        } else if ( frecuencia === 'Semana' ) {
          // Cantidad de semanas en el mes.
          return '4';
  
        } else if ( frecuencia === 'Mes' ) {
          // Cantidad de meses en el año.
          //return '12';
          return '' + 1;
        }
  
        return '';
      }

      this.cantidadRegistros = total( e.registro, e.registro, e.registro, e.registro);
      this.fechaMes  = e.registro.fecha 
      this.fechaMesFin  = e.registro.fecha 
      this.autocompletar();
      this.agregarElementoOrigen();

      

      
   
   
    }
  
    
  }
}



}
