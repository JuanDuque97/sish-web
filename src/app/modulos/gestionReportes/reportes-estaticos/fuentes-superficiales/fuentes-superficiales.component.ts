import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { ServiciosGestionReportes } from '../../servicios-gestion-reportes.service';
import { ServiciosEstacionesService } from 'src/app/modulos/elementos/estaciones/servicios-estaciones.service';
import { MetodosGlobales } from 'src/app/common/utils/metodos-globales';
import { ObtenerValorMaximoHorasRequest, ObtenerValorMaximoHorasResponse, ReporteFuentesSuperficialesRequest, ReporteFuentesSuperficialesRequestFechasMax, ReporteFuentesSuperficialesRequestFechasMin, ReporteFuentesSuperficialesResponse, ReporteFuentesSuperficialesResponseFechaMax, ReporteFuentesSuperficialesResponseFechaMin } from 'src/app/modelo/configuracion/reporte';
import Swal from 'sweetalert2';
import { FormGroup } from '@angular/forms';
import { Location } from '@angular/common';
import { IEstacionDTO } from 'src/app/modelo/configuracion/estacion';
import * as XLSX from 'xlsx';

declare var require: any;

import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
const htmlToPdfmake = require("html-to-pdfmake");
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-fuentes-superficiales',
  templateUrl: './fuentes-superficiales.component.html' 
})

export class ReporteFuentesSuperficialesComponent implements OnInit {
  title = 'angular-app';
  fileName= 'ExcelSheet.xlsx';
  //@ViewChild(DataTableDirective)
  @ViewChild('pdfTable')
  pdfTable!: ElementRef;
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};

    formGroupR1 : FormGroup;

    fechaFinal : Date;
    fechaInicio : Date;
    fechaActual : Date = new Date();

    anoSTR : number;
    fechaActualSTR: string;
    estacion : string;
    latitud: number; 
    longitud: number;
    elevacion: number;
    departamento: string;
    municipio: string;
    tipoEstacion: string;
    entidad: string;
    cuenca: string;
    subCuenca: string;

    valorPromedioAnual : number;
    valorMaximoAnual : number;
    valorMinimoAnual : number;
    valorMinimoHora : number;
    valorMaximoHora : number;
    fecha : Date;
    fechaMaximas : any[] = [];
    fechaMinimas :any[] = [];
    fechaMaximasDia : any;
    fechaMinimasDia : Date;
    idEstacion : any;
    ano : any;

    columnas = [
      {title:'id',  data:'id', class: 'text-center', visible: false},
      {title:'Día',  data:'dia', class: 'text-center'},
      {title:'Enero',  data:'valorEnero', class: 'text-center', "render": function (data: number, type: any, row: any, meta: any) {
        if (null==data || undefined==data ) {
          return '';
        }
        return '' + (Math.round(data * 100) / 100).toFixed(2);
      }},
      {title:'Febrero',  data:'valorFebrero', class: 'text-center', "render": function (data: number, type: any, row: any, meta: any) {
        if (null==data || undefined==data ) {
          return '';
        }
        return '' + (Math.round(data * 100) / 100).toFixed(2);
      }},
      {title:'Marzo',  data:'valorMarzo', class: 'text-center', "render": function (data: number, type: any, row: any, meta: any) {
        if (null==data || undefined==data ) {
          return '';
        }
        return '' + (Math.round(data * 100) / 100).toFixed(2);
      }},
      {title:'Abril',  data:'valorAbril', class: 'text-center', "render": function (data: number, type: any, row: any, meta: any) {
        if (null==data || undefined==data ) {
          return '';
        }
        return '' + (Math.round(data * 100) / 100).toFixed(2);
      }},
      {title:'Mayo',  data:'valorMayo', class: 'text-center', "render": function (data: number, type: any, row: any, meta: any) {
        if (null==data || undefined==data ) {
          return '';
        }
        return '' + (Math.round(data * 100) / 100).toFixed(2);
      }},
      {title:'Junio',  data:'valorJunio', class: 'text-center', "render": function (data: number, type: any, row: any, meta: any) {
        if (null==data || undefined==data ) {
          return '';
        }
        return '' + (Math.round(data * 100) / 100).toFixed(2);
      }},
      {title:'Julio',  data:'valorJulio', class: 'text-center', "render": function (data: number, type: any, row: any, meta: any) {
        if (null==data || undefined==data ) {
          return '';
        }
        return '' + (Math.round(data * 100) / 100).toFixed(2);
      }},
      {title:'Agosto',  data:'valorAgosto', class: 'text-center', "render": function (data: number, type: any, row: any, meta: any) {
        if (null==data || undefined==data ) {
          return '';
        }
        return '' + (Math.round(data * 100) / 100).toFixed(2);
      }},
      {title:'Septiembre',  data:'valorSeptiembre', class: 'text-center', "render": function (data: number, type: any, row: any, meta: any) {
        if (null==data || undefined==data ) {
          return '';
        }
        return '' + (Math.round(data * 100) / 100).toFixed(2);
      }},
      {title:'Octubre',  data:'valorOctubre', class: 'text-center', "render": function (data: number, type: any, row: any, meta: any) {
        if (null==data || undefined==data ) {
          return '';
        }
        return '' + (Math.round(data * 100) / 100).toFixed(2);
      }},
      {title:'Noviembre',  data:'valorNoviembre', class: 'text-center', "render": function (data: number, type: any, row: any, meta: any) {
        if (null==data || undefined==data ) {
          return '';
        }
        return '' + (Math.round(data * 100) / 100).toFixed(2);
      }},
      {title:'Diciembre',  data:'valorDiciembre', class: 'text-center', "render": function (data: number, type: any, row: any, meta: any) {
        if (null==data || undefined==data ) {
          return '';
        }
        return '' + (Math.round(data * 100) / 100).toFixed(2);
      }},
    ];

    columnasAnuales : any[] = [
      {title:'id', data:'id'}, 
      {title:'Máximo Anual', data:'valorMaximoAnual', class: 'text-center'}, 
      {title:'Mínimo Anual', data:'valorMinimoAnual', class: 'text-center'}, 
      {title:'Promedio Anual', data:'valorPromedioAnual', class: 'text-center'}, 
    ];

    datosFilter : any[] = [];

    datosAnualesFilter : any[] = [];
    datosHoraFilter : any[] = [];
    

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
  datosDiaFilter: any;

  constructor(
    private serviciosReporte: ServiciosGestionReportes,
    private serviciosEstacion : ServiciosEstacionesService, 
    private route: ActivatedRoute, 
    private location: Location,
  ) { }

  ngOnInit(): void {
    this.ano = this.route.snapshot.paramMap.get('ano')!;
    this.idEstacion = this.route.snapshot.paramMap.get('idEstacion')!;

    this.dtOptions = {
      pageLength: 50,
    };

    this.cargarDatos();
  }

  cargarDatos() {
    Swal.fire({
      title: 'Cargando...', 
      html: 'Por favor espere.', 
      showConfirmButton: false,
      allowOutsideClick: false,
      timer: 42000, 
      timerProgressBar: true,
      didOpen: async() => {
        Swal.showLoading();

        this.anoSTR = this.ano;
        this.fechaActualSTR = '' + this.fechaActual.getFullYear() + '/' + (this.fechaActual.getMonth()+1) + '/' + this.fechaActual.getDate();

        let request : ReporteFuentesSuperficialesRequest = {
          idEstacion: this.idEstacion,
          ano : this.ano,
        } ;

        this.serviciosEstacion.obtenerEstacionDTOPorId(this.idEstacion).subscribe((response : IEstacionDTO) => {
          this.estacion = response.estacion;
          this.latitud = response.latitud;
          this.longitud = response.longitud;
          this.elevacion = response.altitud;
          this.departamento = response.departamento;
          this.municipio = response.municipio;
          this.tipoEstacion = response.tipoEstacion;
          this.entidad = response.entidad;
          this.cuenca = response.cuenca;
          this.subCuenca = response.subCuenca;
        });

        this.serviciosReporte.obtenerReporteFuentesSuperficiales(request).subscribe((response : ReporteFuentesSuperficialesResponse[]) => {
          this.datosFilter = response;

          let contador = 1;

          this.datosFilter.forEach(dato => {
            dato.id = contador++;
          });

          this.serviciosReporte.obtenerReporteFuentesSuperficialesExtra(request).subscribe((response : ReporteFuentesSuperficialesResponse) => {
            this.datosAnualesFilter = [response];

            this.valorPromedioAnual = response.valorPromedioAnual;
            this.valorMaximoAnual = response.valorMaximoAnual;
            this.valorMinimoAnual = response.valorMinimoAnual;
            this.valorMaximoHora = response.valorMaximoHora;
            this.valorMinimoHora = response.valorMinimoHora; 

            let reque : ReporteFuentesSuperficialesRequestFechasMax = {
              valorMaximo : this.valorMaximoAnual,
              idEstacion: this.idEstacion,
              ano : this.ano,
            } ;
    
            let requests : ReporteFuentesSuperficialesRequestFechasMin = {
              valorMinimo : this.valorMinimoAnual,
              idEstacion: this.idEstacion,
              ano : this.ano,
            } ;
        
            this.serviciosReporte.obtenerReporteMaximoFechaDia(reque).subscribe((response : ReporteFuentesSuperficialesResponseFechaMax) => {
              this.datosDiaFilter = response;

              this.fechaMaximasDia = response.fechaMaximaDia;
              console.log("---------------------------", this.datosDiaFilter)
              console.log("---------------------------", this.datosDiaFilter.fechaMaximaDia[0])
              console.log("---------------------------", this.fechaMaximasDia)
            });

            this.serviciosReporte.obtenerReporteMinimoFechaDia(requests).subscribe((response : ReporteFuentesSuperficialesResponseFechaMin) => {
              this.datosDiaFilter = response;

              this.fechaMinimasDia = response.fechaMinimaDia;

              let maximoDia: string = this.fechaMaximasDia.toString();
              let minimoDia: string = this.fechaMinimasDia.toString();

              let responder: ObtenerValorMaximoHorasRequest = {
              
                idEstacion: this.idEstacion,
                fecha :  maximoDia,
              }

              let responderMinimo: ObtenerValorMaximoHorasRequest = {
              
                idEstacion: this.idEstacion,
                fecha :  minimoDia,
              }

              console.log("---------------------------", responder)

              this.serviciosReporte.obtenerValoMaximoHora(responder).subscribe((response : number) => {
                this.valorMaximoHora = response;
                
              });

              this.serviciosReporte.obtenerValoMinimoHora(responderMinimo).subscribe((response : number) => {
                this.valorMinimoHora = response;

              });

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

  exportexcel(): void
  {
    /* pass here the table id */
    let element = document.getElementById('pdfTable');
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
 
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
 
    /* save to file */  
    XLSX.writeFile(wb, this.fileName);
 
  }

  
  
  public downloadAsPDF() {
    const pdfTable = this.pdfTable.nativeElement;
    var html = htmlToPdfmake(pdfTable.innerHTML);
    const documentDefinition = { content: html };
    pdfMake.createPdf(documentDefinition).download(); 
     
  }

  goBack(){
    this.location.back();
  }
  
  // Validacion de permisos 
  public validarPermiso(permiso: any): boolean {
    return MetodosGlobales.validarPermiso(permiso);
  }
}
