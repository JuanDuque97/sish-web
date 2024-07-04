import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { result } from 'lodash';
import { MetodosGlobales } from 'src/app/common/utils/metodos-globales';
import { ISerieTiempoCargueArchivo } from 'src/app/modelo/configuracion/serieTiempoCargueArchivo';
import { accionesTablasEnum } from 'src/app/modelo/enum/acciones-tablas-enum';
import { activo } from 'src/app/modelo/enum/cargue-serie-enum';
import { SeriesTiempoArchivos } from '../../servicios/series-tiempos.sercevice';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-consultar-serie',
  templateUrl: './consultar-serie.component.html'
})
export class ConsultarSerieComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  
  dtOptions: any = {};
  datatableElement!: DataTableDirective;
  informacionArchivo:any;
  rutaGeneral = 'procesararchivos/cargararchivos/C/0';
  datosFilter = [] as any;

  columnas = [
    {
      title: 'ID',
      data: 'idSerieTiempoCargueArchivo',
      filter: true,
      filterValue: '',
      tipo: 'texto',
    },
    {
      title: 'Nombre del Archivo',
      data: 'nombreArchivo',
      filter: true,
      filterValue: '',
      tipo: 'texto',
    },
     
    {
      title: 'Cargado Por',
      data: 'usuarioCreacion',
      class: 'text-center',
      visible: true,
    },
    {
      title: 'Total registros leidos',
      data: 'totalRegistrosLeidos',
      visible: true,
      class: 'text-center',
    },
    {
      title: 'Total registros cargados',
      data: 'totalRegistrosCargados',
      visible: true,
      class: 'text-center',
    },
    {
      title: 'Fecha Cargue',
      data: 'fechaCreacion',
      visible: true,
      class: 'text-center',
    },   
    {
      title: 'Estado Activo',
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
    },
    {
      class: 'sish-boton-azul',
      title: 'Descargar',
      action: 'descargar',
      icon: 'fas fa-file-csv',
    }
  ];
  ticks = Date.now().valueOf();
  constructor(private seriesTiempoArchivos:SeriesTiempoArchivos) { }

  ngOnInit(): void {
    //this.cargarResultados();
    
  }
  cargarResultados(): void {
    this.seriesTiempoArchivos.obtenerSeriesTiempoCargueArchvo().subscribe(archivos => { 
      this.datosFilter = archivos;
    });
  }

  private obtenerArchivos() {
    
    
    
  }

  accionRegistro(e:any){

    switch (e.accion) {
      case accionesTablasEnum.Activar: {
        let serieTiempo: ISerieTiempoCargueArchivo= e.registro;
        serieTiempo.activo = activo.SI; 
        this.actualizar(serieTiempo);
        break;
      }
      case accionesTablasEnum.Inactivar: {
        let serieTiempo: ISerieTiempoCargueArchivo= e.registro;
        serieTiempo.activo = activo.NO; 
        this.actualizar(serieTiempo);
        break;
      }

      case 'descargar': {            
              Swal.fire({
                title: 'Descargando...',
                html: 'Por favor espere',
                //timer: 2000,
                timerProgressBar: true,
                didOpen: () => {
                  Swal.showLoading();
                  this.seriesTiempoArchivos.obtenerPorIdCargueArchivo(e.registro.idSerieTiempoCargueArchivo).subscribe(resultados=>{
                    if(resultados.length > 0){
                    new ngxCsv(JSON.stringify(resultados),e.registro.nombreArchivo);
                    Swal.hideLoading();
                    Swal.fire(
                      'ok',
                      'Descarga finalizada!',
                      'success'
                    )
                    }else{
                      Swal.hideLoading();
                    Swal.fire(
                      '',
                      'El archivo no cuenta con información',
                      'error'
                    )
                      console.log('El archivo no cuenta con data en base');
                    } 
                    
                  });
                },
                willClose: () => {
          
                },
              }).then((result) => {
                console.log(result);        

              });    
        break;
      }
      default: {
        //statements;
        break;
      }
    }
  }
  
  actualizar(serieTiempoCargueArchivo: ISerieTiempoCargueArchivo) {
    this.seriesTiempoArchivos.actualizarSerie(serieTiempoCargueArchivo).subscribe((response) => {
      this.cargarResultados();
    });
  }

  validarPermiso(event:any): boolean{
    return MetodosGlobales.validarPermiso(event);
  }

}
