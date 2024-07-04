import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {FormBuilder, FormGroup, Validators } from '@angular/forms';
import { estados } from 'src/app/common/utils/constantes';
import { reporteEstructura } from 'src/app/modelo/configuracion/reporte';
import { accionesTablasEnum } from 'src/app/modelo/enum/acciones-tablas-enum';
import Swal from 'sweetalert2';
import { ServiciosGestionReportes } from '../servicios-gestion-reportes.service';
import { Router,ActivatedRoute } from '@angular/router';
import { MetodosGlobales } from 'src/app/common/utils/metodos-globales';
import * as moment from 'moment';
import { ThisReceiver } from '@angular/compiler';



@Component({
  selector: 'app-consultar-reportes',
  templateUrl: './consultar-reportes.component.html' 
})

export class ConsultarReportesComponent implements OnInit {

  esFechaMayor: boolean = true;
  fechasNoValidas: boolean = true;

  inp_FechaInicio: any;
  inp_FechaFinal: any;
  rutaGeneral = 'configuracion/gestionReportes/C/0';
  rutaConsulta = 'configuracion/gestionReportes/V/';
  rutaEdicion = 'configuracion/gestionReportes/E/';
  public formularioFiltros!: FormGroup;
  registro : any;

  public fechaActual: string;
  public nombreReporte: string ;
   public mostrarErrorRangoFechas : boolean = false;
  datosFilter = [] as any;
  // datosReporte = [] as any;

  dtOptions: any = {};

  columnas = [ 
    {title:'Id Estructura',  data:'idEstructura',   class: 'text-center',visible: false,}, 
    {title:'Código reporte' ,   data:"CodReporte",   class: 'text-center', filter: true, filterValue: '', tipo:'texto',}, 
    {title:'Nombre reporte',  data:'nombreReporte',   class: 'text-center', filter: true, filterValue: '', tipo:'texto',}, 
    {title:'Entidad solicita',  data:'EntidadSolicita',   class: 'text-center',filter: true, filterValue: '', tipo:'texto',}, 
    //{title:'Activo',  data:'activo',   class: 'text-center', filter: true, tipo:'seleccion',},
    {title:'Descripción',  data:'descripcion',   class: 'text-center', filter: true, filterValue: '',tipo:'texto',}, 
    {title:'Fecha entrega',  data:'fechaentrega',   class: 'text-center'},
     
    {title:'Estructura',  data:'estructura',   class: 'text-center',visible: false,},  
    {title:'Id Período',  data:'idPeriodo',   class: 'text-center',visible: false,}, 
    {title:'Id Tipo Elemento',  data:'idTipoElemento',   class: 'text-center',visible: false,}, 
    {title:'Id Tipo Reporte',  data:'idtipoReporte',   class: 'text-center',visible: false,}, 
  ]
  // columnasReporte = [
  //   {
  //     title: 'ID Reporte',
  //       data: 'idParametro',
  //     visible: true,
  //   },

  //   {
  //     title: 'Campo 1',
  //       data:'idParametro',
  //     visible: true,
  //   },
  //   {
  //     title: 'Campo 2',
  //       data:'idParametro',
  //     visible: true,
  //   },

  // ];
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


  botones = [
    {
      class: 'sish-boton-azul',
      title: 'Generar el Archivo',
      action: 'generar',
      icon: 'fa fa-download', 
      enabled: this.validarPermiso('ConsultarReporte')
    },
  ];


  @ViewChild('ModalReporte', { static: false }) ModalReporte: ElementRef;
  
  constructor(
    private route: ActivatedRoute,  
    private formBuilder: FormBuilder,
    private serviciosGestionReportes: ServiciosGestionReportes, 
    private router: Router,
    
  ) { }

  ngOnInit(): void {
    
    this.obtenerListaReportes();
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
    this.construirFormulario();
   
  }

  get fechaInicio() {
    return this.formularioFiltros.get('fechaInicio');
  }
  get fechaFInal() {
    return this.formularioFiltros.get('fechaFInal') ?? '';
  }

  private construirFormulario() {
  this.formularioFiltros = this.formBuilder.group({
      fechaInicio: ['', Validators.required],
      fechaFInal: ['', Validators.required],
     
    });
  }

  obtenerListaReportes() {
    Swal.fire({
      title: 'Cargando información...',
      html: 'Por favor espere',
      //timerProgressBar: true,
      //timer: 20000,
      showConfirmButton: false,
      allowOutsideClick: false,
      didOpen: async () => {
        Swal.showLoading();

        this.serviciosGestionReportes.obtenerDTO().subscribe(
          (response) => {
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

accionRegistro(e: any) {
    switch (e.accion) {
      case accionesTablasEnum.Activar: {
        let reporte: reporteEstructura = e.registro;
        reporte.activo = estados.activo;
        this.actualizar(reporte);
        break;
      }

      case accionesTablasEnum.Inactivar: {
        let reporte: reporteEstructura = e.registro;
        reporte.activo = estados.inactivo;
        this.actualizar(reporte);
        break;
      }

      case accionesTablasEnum.Eliminar: {
        let reporte: reporteEstructura = e.registro;
        this.eliminar(reporte);
        break;
      }

      case 'generar': {
        this.generarReporte(e.registro)
        break;
      }

      default: {
        break;
      }
    }
  }

  validarFecha(obj: any){
    // let fechaInicio : any = this.inp_FechaInicio;
    // let fechaFinal : any = this.inp_FechaFinal;

    this.esFechaMayor = true;
    this.fechasNoValidas = false;
    
    this.fechasNoValidas =  
      (null == this.inp_FechaInicio) || 
      (undefined == this.inp_FechaInicio) ||
      (null == this.inp_FechaFinal) || 
      (undefined == this.inp_FechaFinal);

    if ( this.fechasNoValidas ) {
      return;
    }

    this.esFechaMayor = moment(this.inp_FechaInicio).isBefore(this.inp_FechaFinal);
    if ( !this.esFechaMayor ) {
      return;
    }
  }
   

  generarReporte(registro:any){
    this.ModalReporte.nativeElement.click();  
    console.log('llego',registro)
    this.registro = registro;
    this.nombreReporte = registro.descripcion





// new ngxCsv(JSON.stringify(registro),registro.descripcion);

  }


  actualizar(reporte: reporteEstructura) {
    console.log('actualizando', reporte);
    Swal.fire({
      title: 'Actualizando reporte...',
      html: 'Por favor espere',
      showConfirmButton: false,
      allowOutsideClick: false,
      didOpen: async () => {
        Swal.showLoading();
        this.serviciosGestionReportes.actualizar(reporte).subscribe((response) => {
          Swal.close();
          this.obtenerListaReportes();
        });
      }, 
      willClose: async() => {
        Swal.hideLoading();
      }
    });
  }

  eliminar(reporte: reporteEstructura) {
    Swal.fire({
      title: 'Eliminado reporte...',
      html: 'Por favor espere',
      showConfirmButton: false,
      allowOutsideClick: false,
      didOpen: async () => {
        Swal.showLoading();
        this.serviciosGestionReportes.eliminar(reporte).subscribe((response) => {
          Swal.close();
          this.obtenerListaReportes();
        });
      }, willClose: async() => {
        Swal.hideLoading();
      }
    });
  }

  onCancelarModal() {
    let myForm:any = document.getElementById('modalForm');
    myForm.reset();
  }

  onNavegar(obj: any) {
    let tipoElemento = this.registro.idTipoElemento;
   
    // if ( !this.formularioFiltros.valid ) {
    //   return;
    // }
    
    /*
    let fechaInicio = obj.currentTarget[0].value ?? '';
    let fechaFinal = obj.currentTarget[1].value ?? '';

    this.fechasNoValidas =  
      (null == fechaInicio) || 
      (undefined == fechaInicio) ||
      ('' === fechaInicio) ||  
      (null == fechaFinal) || 
      (undefined == fechaFinal) || 
      ('' === fechaFinal);
*/

    console.log('Fecha Inicial: ' + this.inp_FechaInicio);
    console.log('Fecha Final: ' + this.inp_FechaFinal);

    if ( this.fechasNoValidas ) {
      return;
    }

    if ( !this.esFechaMayor ) {
      return;
    }

    switch (tipoElemento) {
      // Estaciones...
      case 466:
        this.ModalReporte.nativeElement.click();
        this.router.navigate(['/configuracion/reporte/estacion/'+ 
          this.registro.idEstructura+'/'+
          this.formularioFiltros.value.fechaInicio+'/'+
          this.formularioFiltros.value.fechaFInal
        ]);
        break;

        // Embalse
        case 467:
          this.ModalReporte.nativeElement.click();
          this.router.navigate(['/configuracion/reporte/embalse/'+ 
            this.registro.idEstructura+'/'+
            this.formularioFiltros.value.fechaInicio+'/'+
            this.formularioFiltros.value.fechaFInal
          ]);
          break; 

        // Pozo
        case 468:
          this.ModalReporte.nativeElement.click();
          this.router.navigate(['/configuracion/reporte/pozo/'+ 
            this.registro.idEstructura+'/'+
            this.formularioFiltros.value.fechaInicio+'/'+
            this.formularioFiltros.value.fechaFInal
          ]);
          break;

      default: 
        console.error('Tipo de objeto desconocido....');
        break;
    }
  }

  // Validacion de permisos 
  public validarPermiso(permiso: any): boolean {
    return MetodosGlobales.validarPermiso(permiso);
  }
}
