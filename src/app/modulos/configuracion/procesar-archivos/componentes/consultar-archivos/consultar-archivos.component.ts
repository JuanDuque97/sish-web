import { Component,  Input,  OnInit, Output, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { ProcesarArchivosService } from '../../servicios/procesar-archivos.sercevice';
import { MetodosGlobales } from 'src/app/common/utils/metodos-globales';
import { accionesTablasEnum } from 'src/app/modelo/enum/acciones-tablas-enum';
import { IArchivo, IArchivoDTO } from 'src/app/modelo/configuracion/archivo';
import { Router } from '@angular/router';
import { activo } from 'src/app/modelo/enum/cargue-archivo-enum';

@Component({
  selector: 'app-consultar-archivos',
  templateUrl: './consultar-archivos.component.html'
})
export class ConsultarArchivosComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  
  dtOptions: any = {};
  datatableElement!: DataTableDirective;
  informacionArchivo:any;
  rutaGeneral = 'procesararchivos/cargararchivos/C/0';
  datosFilter = [] as any;

  columnas = [
    {
      title: 'ID',
      data: 'idArchivo',
      visible: false,
    },
    {
      title: 'Archivo',
      data: 'archivo',
      filter: true,
      filterValue: '',
      tipo: 'texto',
    },
    {
      title: 'Fecha proceso',
      data: 'fechaProceso',
      visible: true,
      class: 'text-center',
    },
   {
      title: 'Total registros leidos',
      data: 'totalRegistrosLeidos',
      visible: true,
    },
    {
      title: 'Total registros cargados',
      data: 'totalRegistrosCargados',
      visible: true,
    },
    {
      title: 'Estación',
      data: 'estacion',
      class: 'text-center',
      visible: true,
    },
    {
      title: 'Pozo',
      data: 'pozo',
      class: 'text-center',
      visible: true,
    },
    {
      title: 'Embalse',
      data: 'embalse',
      class: 'text-center',
      visible: true,
    },
    {
      title: 'Estado activo',
      data: 'activo',
      class: 'text-center',
      visible: true,
    },
  ];

  botones = [
    {
      class: 'sish-boton-azul',
      title: 'Ver',
      action: 'verArchivo',
      icon: 'fas fa-glasses',
      enabled: this.validarPermiso('ConsultarArchivosConfigurados'),
    }
  ];

  constructor(private ProcesarArchivosService:ProcesarArchivosService,private router: Router) { 
    
  }

  ngOnInit(): void {
    this.obtenerArchivos();
  }

  private obtenerArchivos() {
    this.ProcesarArchivosService.obtenerArchivosDTO().subscribe(archivos => {       
      this.datosFilter = archivos;
    }); 
    
  }

  accionRegistro(e:any){
    switch (e.accion) {
      case accionesTablasEnum.Activar: {
        let archivo: IArchivo = e.registro;
        archivo.activo = activo.Si;
        this.actualizar(archivo);
        //statements;
        break;
      }
      case accionesTablasEnum.Inactivar: {
        let archivo: IArchivo = e.registro;
        archivo.activo = activo.No;
        this.actualizar(archivo);
        break;
      }

      case 'verArchivo': {
        let archivo: IArchivoDTO = e.registro;
        this.informacionArchivo = archivo
        //this.router.navigate(['procesararchivos/parametros/' , archivo.estacion,archivo.pozo]);
        //statements;
        break;
      }
      default: {
        //statements;
        break;
      }
    }
  }

  actualizar(archivo: any) {
    this.ProcesarArchivosService.actualizarArchivo(archivo) .subscribe((response) => {
      this.obtenerArchivos();
    });;
  }

  validarPermiso(event:any): boolean{
    return MetodosGlobales.validarPermiso(event);
  }

  onCargaRapida() {
    this.router.navigate(['/procesararchivos/cargarapida']);
  }

  onCargarConFormato() {
    this.router.navigate(['/procesararchivos/cargaformato']);
  }
}
