import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { LegendPosition } from '@swimlane/ngx-charts';
import { random } from 'lodash';

import { accionesTablasEnum } from 'src/app/modelo/enum/acciones-tablas-enum';
import Swal from 'sweetalert2';
import * as datosEjemplo from './datosEjemplo.json';
import {formatDate} from '@angular/common';

@Component({
  selector: 'app-consultar-ejemplo',
  templateUrl: './consultar-ejemplo.component.html',
})

export class ConsultarEjemploComponent implements OnInit {
  rutaGeneral = 'configuracion/seguridad/roles/0';
  rutaConsulta = 'configuracion/seguridad/roles/';
  rutaEdicion = 'configuracion/seguridad/roles/';
 listaDeElementos:any =[]


  
  accionRegistroTabla2(e: any) { 
    alert("Tabla 2"+e.accion)
    switch (e.accion) {
      case accionesTablasEnum.Activar: {
        console.log('Activar');
        //statements;
        alert('Alert... Tabla 2 Activar');
        break;
      }
      case accionesTablasEnum.Inactivar: {
        console.log('Inactivar');
        alert('Alert... Tabla 2 Inactivar');
        break;
      }
      case accionesTablasEnum.Eliminar: {
        console.log('Eliminar');
        //statements;
        break;
      }
      default: {
        console.log('default', e);
        //statements;
        break;
      }
    }
  }

  accionRegistro(e: any) {
    alert("Tabla 1")
    switch (e.accion) {
      case accionesTablasEnum.Activar: {
        console.log('Activar');
        //statements;
        alert('Alert... Tabla 1 Activar');
        break;
      }
      case accionesTablasEnum.Inactivar: {
        console.log('Inactivar');
        alert('Alert... Tabla 1 Inactivar');
        break;
      }
      case accionesTablasEnum.Eliminar: {
        console.log('Eliminar');
        //statements;
        break;
      }
      default: {
        console.log('default', e);
        //statements;
        break;
      }
    }
    
  }

  accionGeneral(e: any) {
    console.log('accion general', e);
    alert(JSON.stringify(e));

    console.log(e)
   
    console.log('lsita elementos',this.listaDeElementos)
  }


  lista(listaSelect:any){ 
    if (listaSelect.length >= 2) {
      this.listaDeElementos = listaSelect 
    }
    console.log(this.listaDeElementos)
  }

  datosFilter = [] as any;
  columnas = [
    {
      title: 'ID',
      data: 'id',
      visible: false,
      filter: true,
      filterValueMin: '',
      filterValueMax: '',
      tipo: 'rangoNumero',
    },
    {
      title: 'Rol',
      data: 'nombre',
      filter: true,
      filterValue: '',
      tipo: 'seleccion',
    },
    {
      title: 'Descripción',
      data: 'descripcion',
      filter: true,
      filterValue: '',
      tipo: 'texto',
    },
    {
      title: 'Activo',
      data: 'estado',
      class: 'text-center',
      filter: true,
      filterValue: '',
      tipo: 'seleccion',
    },
    {
      title: 'Creado',
      data: 'fechaCreacion',
      class: 'text-center',
      visible: true,
      filter: true,
      filterValueMin: '',
      filterValueMax: '',
      tipo: 'rangoFecha',
    },
    {
      title: 'Modificado',
      data: 'fechaModificacion',
      class: 'text-center',
      visible: false,
    },
  ];

  botones = [
    {
      class: 'sish-boton-azul',
      title: 'Valores',
      action: 'valores',
      icon: 'fas fa-tasks',
    },
    {
      class: 'sish-boton-naranja',
      title: 'Ir al mapa',
      action: 'mapa',
      icon: 'fas fa-globe-americas',
    },
  ];

  botonesGenerales = [
    {
      text: 'boton 1',
      action: 'boton1',
    },
    {
      text: 'boton 2',
      action: 'boton2',
    },
  ];

// graficos
 
view: [number,number] = [500,300];
view2: [number,number] = [500,300];
single:any=  [  ]
single2:any=  [   {
  "name": "Germany",
  "series": [
    {
      "name": "2010",
      "value": 7300000
    },
    {
      "name": "2011",
      "value": 8940000
    }
  ]
},

{
  "name": "USA",
  "series": [
    {
      "name": "2010",
      "value": 7870000
    },
    {
      "name": "2011",
      "value": 8270000
    }
  ]
},

{
  "name": "France",
  "series": [
    {
      "name": "2010",
      "value": 5000002
    },
    {
      "name": "2011",
      "value": 5800000
    }
  ]
}
]; 
// options
showXAxis = true;
showYAxis = true;
gradient = false;
showLegend = true;
legendPosition: LegendPosition = LegendPosition.Below;
showXAxisLabel = true;
showYAxisLabel = true;
 

xAxisLabel: string = 'Country';
yAxisLabel: string = 'Precipitacion Anual';
legendTitle: string = 'Años';


colorScheme:any = {
  domain: ['blue', 'orange', 'red']
};

  constructor(@Inject(LOCALE_ID) public locale: string) {
    // Esto es intencional
  }


fecha:string= "2022-02-18";
hora:string= "12:27:00";

fecha_y_hora: string="";

fechaHora: Date = new Date();

  ngOnInit(): void {
    //fecha_y_hora = Date.parse(this.fecha + 'T' +this.hora+'Z');
    const locale = '';
    
    let dateString=this.fecha+"T"+this.hora;
    this.fechaHora = new Date(dateString);
    
    this.fecha_y_hora= formatDate(dateString,"dd/mm/yyyy, h:mm a",this.locale);
    
    
    this.obtener();
  }

  obtener() {
    let dato: any = datosEjemplo;

    for (let index = 0; index < dato.length; index++) {
      const element = dato[index];

      this.single.push(
        
         { 

           name: dato[index].nombre,
           series:[
             {
               name: "anual",
               value: dato[index].Valor, 
             },
             {
               name: "maximo",
               value: dato[index].Valor +random(1,10) , 
             }
             ,
             {
               name: "Minimo",
               value: dato[index].Valor - random(1,10)  , 
             }
             ,
             {
               name: "Promedio",
               value: dato[index].Valor / random(1,10), 
             }
           ]
          
       }
      );
      
    }
 
    this.datosFilter = dato.default;
    console.log('intro', this.datosFilter);
  }
  actualizar(obj: any) {
    // datos
  }
}
