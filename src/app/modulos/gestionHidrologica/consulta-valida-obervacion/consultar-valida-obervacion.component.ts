import { Component, OnInit, ViewChild } from '@angular/core';
import {ActivatedRoute, Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { MetodosGlobales } from 'src/app/common/utils/metodos-globales';
import { IDominioValor } from 'src/app/modelo/configuracion/dominioValor';
import { ServiciosParametrosService } from '../../parametros/servicios-parametros.service';

import * as Highcharts from 'highcharts';
import Exporting from 'highcharts/modules/exporting';
import { Console } from 'console';
const heatmap = require('highcharts/modules/heatmap.js');
heatmap(Highcharts);

Exporting(Highcharts);

@Component({
  selector: 'app-consultar-valida-obervacion',
  templateUrl: './consultar-valida-obervacion.component.html',
})
export class ConsultarValidacionObervacionComponent implements OnInit {

  @ViewChild(DataTableDirective, { static: false })
  rutaGeneral = 'configuracion/dominios/C/0';
  rutaConsulta = 'configuracion/dominios/V/';
  rutaEdicion = 'configuracion/dominios/E/';
  listValidaObervacion: any;
  datosFilter = [] as any;

  datatableElement: DataTableDirective | undefined;
 private id :string; 
  dtOptions: any = {};
  columnas = [
    {
      title: 'ID',
      data: 'id_valida_observaciones',
      visible: false,
      filterValueMin: '',
      filterValueMax: '',
      tipo: 'rangoNumero',
    },
    {
      title: 'fecha Validación',
      data: 'fechaValidacion',
      filter: true,
      filterValue: '',
      tipo: 'texto',
    } ,
    {
      title: 'criterio',
      data: 'criterio',
      filter: true,
      filterValue: '',
      tipo: 'texto',
    },
    {
      title: 'Elemento',
      data: 'elemento',
      filter: true,
      filterValue: '',
      tipo: 'texto',
    },
    {
      title: 'Parámetro',
      data: 'parametro',
      filter: true,
      filterValue: '',
      tipo: 'texto',
    },
    {
      title: 'Valor',
      data: 'valor',
      filter: true,
      filterValue: '',
      tipo: 'texto',
    },
    {
      title: 'Tipo Elemento',
      data: 'tipoElemento',
      filter: true,
      filterValue: '',
      tipo: 'texto',
    },
    {
      title: 'Resultado',
      data: 'estado',
      filter: true,
      filterValue: '',
      tipo: 'texto',
    },
    {
      title: 'Usuario',
      data: 'usuario',
      filter: true,
      filterValue: '',
      tipo: 'texto',
    }
  ];
 
 
  botones = [
    {
      class: 'sish-boton-azul',
      title: 'Permisos',
      action: 'permisos',
      icon: 'fas fa-tasks', 
    },
  ];
 
  accionRegistro(e: any) { 
    switch (e.accion) {
      
      case 'permisos': {
 
      let dominioValor: IDominioValor = e.registro; 
        this.router.navigate([
          'configuracion/parametros/tipo/Parametros/' + dominioValor.idDominioValor 
       ,]);

      

        // statements;
        break;
      }

      default: {
        break;
      }
    }
  }
 
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private serviciosParametrosService: ServiciosParametrosService,
    
  ) { }
 

  ngOnInit(): void { 
    
    this.id = this.route.snapshot.paramMap.get('id')!;

    if(this.id){
      
      this.obtener();
      this.router.navigateByUrl('/configuracion/gestionAlertas/'+this.id );

    }


  }

  obtener(){
    this.serviciosParametrosService
    .validaObervacionesId(parseInt(this.id))
    .subscribe((response) => {
      this.listValidaObervacion = response;

     console.log(this.listValidaObervacion);
     this.router.navigateByUrl('/configuracion/gestionAlertas/'+this.id );
      for (let i = 0; i < this.listValidaObervacion.length; i++) {

       
       

        if( this.listValidaObervacion[i]['resultado'] == 1 ){
         this.listValidaObervacion[i]['estado'] =
         '<a><em class="fas fa-circle fa-2x semaforoVerde"></em></a>';
        }else{
    
         this.listValidaObervacion[i]['estado'] =
         '<a><em class="fas fa-circle fa-2x semaforoRojo"></em></a>';
        }
        this.router.navigateByUrl('/configuracion/gestionAlertas/'+this.id );
    
         this.listValidaObervacion = this.listValidaObervacion;
    
    }
      
    });
 
  }



// Validacion de permisos 
public validarPermiso(permiso: any): boolean {
  return MetodosGlobales.validarPermiso(permiso);
}

}
