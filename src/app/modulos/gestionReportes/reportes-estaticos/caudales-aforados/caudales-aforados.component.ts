import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import { ServiciosGestionReportes } from '../../servicios-gestion-reportes.service';
import { MetodosGlobales } from 'src/app/common/utils/metodos-globales';
import { ReporteCaudalesAforadosRequest, ReporteCaudalesAforadosResponse } from 'src/app/modelo/configuracion/reporte';
import { ActivatedRoute } from '@angular/router';
import { result } from 'lodash';

@Component({
  selector: 'app-caudales-aforados',
  templateUrl: './caudales-aforados.component.html' 
})

export class CaudalesAforadosComponent implements OnInit {

    datosFilter = [] as any;
    registro : any;
    public nombreReporte: string;

    columnas = [ 
        {title:'IdAforo',  data:'idAforo',   class: 'text-center', visible: false}, 
        {title:'Estacion',  data:'estacion',   class: 'text-center'}, 
        {title:'Fecha' ,   data:"fecha",   class: 'text-center', render: function (fechaSTR: string, type: any, row: any, meta: any) {
          if ( null==fechaSTR || undefined==fechaSTR ) {
            return;
          }

          let fechaTokens = fechaSTR.split('T');
          if ( null==fechaTokens || undefined==fechaTokens || fechaTokens.length!=2 ) {
            return;
          }

          fechaTokens = fechaTokens[0].split('-');
          if ( null==fechaTokens || undefined==fechaTokens || fechaTokens.length!=3 ) {
            return;
          }

          let year = fechaTokens[0];
          let month = fechaTokens[1];
          let day = fechaTokens[2];
          
          return day + '/' + month + '/' + year;
        }}, 
        {title:'Horas',  data:'hora',   class: 'text-center',}, 
        {title:'Minutos',  data:'minutos',   class: 'text-center',}, 
        {title:'Caudal Aforado (l/s)',  data:'caudal',   class: 'text-center',},  
        {title:'Tipo Aforo',  data:'tipoAforo',   class: 'text-center',}, 
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

  constructor(
    private serviciosAforo: ServiciosGestionReportes, 
    private route: ActivatedRoute, 
    private location: Location,
  ) { }

  ngOnInit(): void {
    this.cargarDatos();
  }

  assertNullAndUndefined(value : any) : boolean {
    if ( null==value || undefined==value ) {
      return false;
    }

    return true;
  }

  cargarDatos() {
    let fechaInicioSTR = this.route.snapshot.paramMap.get('fechaInicio')!;
    let fechaFinSTR = this.route.snapshot.paramMap.get('fechaFin')!;
    let idEstacionesSTR = this.route.snapshot.paramMap.get('idEstaciones')!;

    if ( !this.assertNullAndUndefined(fechaInicioSTR) || 
      0==fechaInicioSTR.length || 
      !fechaInicioSTR.startsWith('[') || 
      !fechaInicioSTR.endsWith(']' || 
      !fechaInicioSTR.includes('-') ) ) {
        console.error('Fecha inicio NO valida: ' + fechaInicioSTR);
        return;
    }

    if ( !this.assertNullAndUndefined(fechaFinSTR) || 
      0==fechaFinSTR.length || 
      !fechaFinSTR.startsWith('[') || 
      !fechaFinSTR.endsWith(']' || 
      !fechaFinSTR.includes('-') ) ) {
        console.error('Fecha fin NO valida: ' + fechaFinSTR);
        return;
    }

    if ( !this.assertNullAndUndefined(idEstacionesSTR) || 
      0==idEstacionesSTR.length ) {
        console.error('ID Estaciones NO valido: ' + idEstacionesSTR);
        return;
    }

    // 1. Se procesa la fecha de Inicio...

    // Se eliminan los caracteres: '[' y ']'
    fechaInicioSTR = fechaInicioSTR.substring(1, fechaInicioSTR.length);
    fechaInicioSTR = fechaInicioSTR.substring(0, fechaInicioSTR.length-1);

    // Se obtienen los datos de la fecha. Formato esperado: 2022-12-22
    let fechaTokens = fechaInicioSTR.split('-');
    let ano = parseInt(fechaTokens[0]);
    let mes = parseInt(fechaTokens[1]);
    let dia = parseInt(fechaTokens[2]);

    let fechaInicio = new Date(ano, (mes-1), dia);

    // 2. Se procesa la fecha de Fin...

    // Se eliminan los caracteres: '[' y ']'
    fechaFinSTR = fechaFinSTR.substring(1, fechaFinSTR.length);
    fechaFinSTR = fechaFinSTR.substring(0, fechaFinSTR.length-1);

    // Se obtienen los datos de la fecha. Formato esperado: 2022-12-22
    fechaTokens = fechaFinSTR.split('-');
    ano = parseInt(fechaTokens[0]);
    mes = parseInt(fechaTokens[1]);
    dia = parseInt(fechaTokens[2]);

    let fechaFin = new Date(ano, (mes-1), dia);

    // 3. Se procesan los IDs de las estaciones...

    // Se obtienen los IDs de las estaciones. Formato esperado: 6037;6731;6732;6733;...n
    let idEstaciones : any[] = [];
    if ( idEstacionesSTR.includes(';') ) {
      let idTokens = idEstacionesSTR.split(';');
      idTokens.forEach(id => {
        idEstaciones.push(parseInt(id));
      });
    } else {
      idEstaciones.push(parseInt(idEstacionesSTR));
    }

    Swal.fire({
      title: 'Cargando información...',
      html: 'Por favor espere',
      showConfirmButton: false,
      allowOutsideClick: false,
      didOpen: async () => {
        Swal.showLoading();

        let request : ReporteCaudalesAforadosRequest = {
          idEstaciones: idEstaciones,
          fechaInicio: fechaInicio, 
          fechaFin: fechaFin,
        };

        this.serviciosAforo.obtenerReporteCaudalesAforados(request).subscribe(
          (response : ReporteCaudalesAforadosResponse[]) => {
            this.datosFilter = response;
            Swal.close();
          }
        );
      },
      willClose: async() => {
        Swal.hideLoading();
      }
    });
  }

  goBack(){
    this.location.back();
  }

  // Validacion de permisos 
  public validarPermiso(permiso: any): boolean {
    return MetodosGlobales.validarPermiso(permiso);
  }
}
