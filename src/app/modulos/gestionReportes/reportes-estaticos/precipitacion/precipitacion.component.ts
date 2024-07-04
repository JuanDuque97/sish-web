import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ServiciosGestionReportes } from '../../servicios-gestion-reportes.service';
import { MetodosGlobales } from 'src/app/common/utils/metodos-globales';
import { ReporteCaudalesAforadosRequest, ReportePrecipitacionResponse } from 'src/app/modelo/configuracion/reporte';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import * as XLSX from 'xlsx';
import { blob } from 'd3';

@Component({
  selector: 'app-precipitacion',
  templateUrl: './precipitacion.component.html' 
})

export class ReportePrecipitacionComponent implements OnInit { 
    fileName= 'Reportes de precipitaciones.xlsx';
    datosFilter = [] as any;
    registro : any;
    public nombreReporte: string;
    public titulo: string;
    public valores: any[] = [];
    public codigo: any[] = [];
    public codigoNesplu: string;

    columnas = [ 
        {title:'NUSPLU',  data:'idEstacion',   class: 'text-center'}, 
        {title:'VALOR',  data:'valor',   class: 'text-center'}, 
        {title:'FECHA' ,   data:"fecha",   class: 'text-center',},  
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
  notes: any;

  constructor(
    private serviciosObservacion: ServiciosGestionReportes, 
    private route: ActivatedRoute, 
    private location: Location,
  ) { }

   
  ngOnInit(): void {
    
    if(this.codigo[0] = 120){
      this.columnas[1]['title'] = "PRECIPITACIÓN (mm)";
      this.cargarDatos();
    }
    else if(this.codigo[0] = 101){
      this.toast.fire({
        title: 'Error',
        text: 'No es reporte de Niveles.',
        icon: 'error'
      });
      return;
    }
    
  }

  exportexcel():any
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



  exportartxt(){

    var datosFilter:any="nesplu,precipitacion (mm),fecha"
   
       let titulo = "precipitacion (mm)"
       let content:any[] = this.datosFilter
   
       var jsonObject = JSON.stringify(this.datosFilter);
   
       let headers = ["NESPLU","PRECIPITACION (cm)","FECHA DE MEDICION"]
       //Choose your seperator
       const seperator = ",";
       
       //Prepare csv with a header row and our data
    
       
    
   
       var array = typeof jsonObject != 'object' ? JSON.parse(jsonObject) : jsonObject;
       var str = '';
   
       for (var i = 0; i < array.length; i++) {
           var line = '';
           for (var index in array[i]) {
               if (line != '') line += ','
   
               line += array[i][index];
           }
   
           str   += line + '\r\n';
       }
       const csvContent :any= [headers.join(seperator) +'\r\n'+
         str
         ]
      const data = encodeURI('data:text/csv;charset=utf-8,' );
   
       const blob = new Blob([csvContent], {type: 'text/plain'});
   
       const url = window.URL.createObjectURL(blob);
   
       const anchor = document.createElement("a");
       anchor.download = titulo + ".txt";
       anchor.href = url;
       anchor.click();
       
   
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
    let codigoNesplu = this.route.snapshot.paramMap.get('codigoNesplu')!;

    this.codigoNesplu = codigoNesplu;
    
    console.log("---------------------------------------")
    console.log("este es nesplu", codigoNesplu)
    console.log("---------------------------------------")

   
    /*provisional*/
    //fechaInicioSTR = '2000-12-01';
    //fechaFinSTR = '2022-12-31';

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
    
    if ( !this.assertNullAndUndefined(codigoNesplu) || 
    0==codigoNesplu.length ) {
      console.error('ID Estaciones NO valido: ' + codigoNesplu);
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

    let idcodigo : any[] = [];
    if ( codigoNesplu.includes(';') ) {
      let idTokens = codigoNesplu.split(';');
      idTokens.forEach(id => {
        idcodigo.push(parseInt(id));
      });
    } else {
      idcodigo.push(parseInt(codigoNesplu));
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

        this.serviciosObservacion.obtenerReportePrecipitacion(request).subscribe(
          (response : ReportePrecipitacionResponse[]) => {
            this.datosFilter = response;
            this.datosFilter = response.filter((element => element != null)).map((elemento: any) => ({
              idcodigo: '',
              id:elemento.idEstacion,
              valor: elemento.valor,
              fecha:elemento.fecha
            }));
 
            for (let index = 0; index <  this.datosFilter.length; index++) {
              
              for (let i = 0; i < idcodigo.length; i++) {

                if(idEstaciones[i] ==  this.datosFilter[index].id ){
                  console.log(idEstaciones[i], this.datosFilter[index].id,idcodigo[i] );

                  this.datosFilter[index].idcodigo = idcodigo[i]
                
                }
              
              }
  
              
            }

        



            this.valores = response.map(observ => {
              let valores = observ.descripcion
              return valores;

            });

            this.codigo = response.map(observ => {
              let codigo = observ.codigo
              return codigo;

            });


            console.log("estos son los valores", this.valores)

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
