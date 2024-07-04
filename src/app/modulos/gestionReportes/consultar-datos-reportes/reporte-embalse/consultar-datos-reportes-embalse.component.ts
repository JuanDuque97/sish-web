import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { ServiciosGestionReportes } from '../../servicios-gestion-reportes.service';
import { ActivatedRoute } from '@angular/router'
import { toInteger } from 'lodash';
import { Location } from '@angular/common';

@Component({
  selector: 'app-consultar-reportes-embalses',
  templateUrl: './consultar-datos-reportes-embalse.component.html' 
})

export class ConsultarReportesEmbalseComponent implements OnInit {

  rutaGeneral = "";
  rutaConsulta = "";
  rutaEdicion = "";

  public idEstructura: string = '0';
  public fechaInicio: string = '0';
  public fechaFin: string = '0';
  public fechaActual: string;
  public nombreReporte: string ;
  public estructura : any;
  public colPosicionMap : Map<string, number> = new Map();

  listEstructura = [] as any;
  listElementos = [] as any;
  listParametros= [] as any;

  datosFilter = [] as any;
  
  //dtOptions: any = {};
  defaultCols: { title: string, data: string, class:string,  visible: boolean }[] = [];

  columnas = [
    {title:'Id Embalse' ,   data:"id_EMBALSE",   class: 'text-center',visible: true,}, 
    {title:'Embalse',  data:'embalse',   class: 'text-center',visible: true,},
    {title:'Id Entidad',  data:'id_ENTIDAD',   class: 'text-center',visible: true,}, 
    {title:'Entidad',  data:'entidad',   class: 'text-center',visible: true,},
    {title:'Zona Operativa EAAB',  data:'zona_OPERATIVA_EAAB',   class: 'text-center',visible: true,},  
    {title:'Fecha Inicio Operación',  data:'fecha_INICIO_OPERACION',   class: 'text-center',visible: true,}, 
    {title:'Elevación',  data:'elevacion',   class: 'text-center',visible: true,},
    {title:'Volumen Total',  data:'volumen_TOTAL',   class: 'text-center',visible: true,},
    {title:'Volumen Útil',  data:'volumen_UTIL',   class: 'text-center',visible: true,},
    {title:'Volumen Muerto',  data:'volumen_MUERTO',   class: 'text-center',visible: true,},
    {title:'Longitud Cresta',  data:'longitud_CRESTA',   class: 'text-center',visible: true,},
    {title:'Ancho Cresta',  data:'ancho_CRESTA',   class: 'text-center',visible: true,},
    {title:'Id Municipio',  data:'id_MUNICIPIO',   class: 'text-center',visible: true,},
    {title:'Municipio',  data:'municipio',   class: 'text-center',visible: true,},
    {title:'Id Departamento',  data:'id_DEPARTAMENTO',   class: 'text-center',visible: true,},
    {title:'Departamento',  data:'departamento',   class: 'text-center',visible: true,},
    {title:'Área Hidrográfica',  data:'area_HIDROGRAFICA',   class: 'text-center',visible: true,},
    {title:'Zona Hidrográfica',  data:'zona_HIDROGRAFICA',   class: 'text-center',visible: true,},
    {title:'Subzona Hidrográfica',  data:'subzona_HIDROGRAFICA',   class: 'text-center',visible: true,},
    {title:'Nivel Subsiguiente',  data:'nivel_SUBSIGUIENTE',   class: 'text-center',visible: true,},
    {title:'Cuenca',  data:'cuenca',   class: 'text-center',visible: true,},
    {title:'Subcuenca',  data:'subcuenca',   class: 'text-center',visible: true,},
    {title:'Microcuenca',  data:'microcuenca',   class: 'text-center',visible: true,},
    {title:'Altura Presa',  data:'altura_PRESA',   class: 'text-center',visible: true,},
    {title:'Activo Embalse',  data:'activo_EMBALSE',   class: 'text-center',visible: true,},
    {title:'Id Área Hidrográfica',  data:'id_AREA_HIDROGRAFICA',   class: 'text-center',visible: true,},
    {title:'Id Zona Hidrográfica',  data:'id_ZONA_HIDROGRAFICA',   class: 'text-center',visible: true,},
    {title:'Id Subzona Hidrográfica',  data:'id_SUBZONA_HIDROGRAFICA',   class: 'text-center',visible: true,},
    {title:'Id Cuenca',  data:'id_CUENCA',   class: 'text-center',visible: true,},
    {title:'Id Subcuenca',  data:'id_SUBCUENCA',   class: 'text-center',visible: true,},
    {title:'Id Microcuenca',  data:'id_MICROCUENCA',   class: 'text-center',visible: true,},
    {title:'Id Observación Embalse Inicial',  data:'id_OBSERVACION_X_EMBALSE_INICIAL',   class: 'text-center',visible: true,},
    {title:'Id Parámetro Embalse',  data:'id_PARAMETRO_X_EMABALSE',   class: 'text-center',visible: true,},
    {title:'Fecha',  data:'fecha',   class: 'text-center',visible: true,},
    {title:'Valor',  data:'valor',   class: 'text-center',visible: true,},
    {title:'Fecha Cargue',  data:'fecha_CARGUE',   class: 'text-center',visible: true,},
    {title:'Usuario Cargue',  data:'usuario_CARGUE',   class: 'text-center',visible: true,},
    {title:'Id Tipo Origen Observación',  data:'id_TIPO_ORIGEN_OBSERVACION',   class: 'text-center',visible: true,},
    {title:'Origen Observación',  data:'origen_OBSERVACION',   class: 'text-center',visible: true,},
    {title:'Origen',  data:'origen',   class: 'text-center',visible: true,},
    {title:'Id Estado Observación',  data:'id_ESTADO_OBSERVACION',   class: 'text-center',visible: true,},
    {title:'Estado Observación',  data:'estado_OBSERVACION',   class: 'text-center',visible: true,},
    {title:'Id Flag Observación',  data:'id_FLAG_OBSERVACION',   class: 'text-center',visible: true,},
    {title:'Flag Observación',  data:'flag_OBSERVACION',   class: 'text-center',visible: true,},
    {title:'Activo Observación',  data:'activo_OBSERVACION',   class: 'text-center',visible: true,},
    {title:'Fecha Creación',  data:'fecha_CREACION',   class: 'text-center',visible: true,},
    {title:'Fecha Modificación',  data:'fecha_MODIFICACION',   class: 'text-center',visible: true,},
    {title:'Fecha Estado',  data:'fecha_ESTADO',   class: 'text-center',visible: true,},
    {title:'Usuario Creación',  data:'usuario_CREACION',   class: 'text-center',visible: true,},
    {title:'Usuario Modificación',  data:'usuario_MODIFICACION',   class: 'text-center',visible: true,},
    {title:'Usuario Estado',  data:'usuario_ESTADO',   class: 'text-center',visible: true,},
    {title:'Id Parámetro',  data:'id_PARAMETRO',   class: 'text-center',visible: true,},
    {title:'Id Variable',  data:'id_VARIABLE',   class: 'text-center',visible: true,},
    {title:'Código',  data:'codigo',   class: 'text-center',visible: true,},
    {title:'Descripción',  data:'descripcion',   class: 'text-center',visible: true,},
    {title:'Id Unidad Medida',  data:'id_UNIDAD_MEDIDA',   class: 'text-center',visible: true,},
    {title:'Unidad Medida',  data:'unidad_MEDIDA',   class: 'text-center',visible: true,},
    {title:'Id Tipo Parámetro',  data:'id_TIPO_PARAMETRO',   class: 'text-center',visible: true,},
    {title:'Tipo parámetro',  data:'tipo_PARAMETRO',   class: 'text-center',visible: true,},
    {title:'Id Método',  data:'id_METODO',   class: 'text-center',visible: true,},
    {title:'Método',  data:'metodo',   class: 'text-center',visible: true,},
    {title:'Id Período',  data:'id_PERIODO',   class: 'text-center',visible: true,},
    {title:'Período',  data:'periodo',   class: 'text-center',visible: true,},
    {title:'Activo Parámetro',  data:'activo_PARAMETRO',   class: 'text-center',visible: true,},
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

  botones = [
    {
      class: 'sish-boton-azul',
      title: 'Generar el Archivo',
      action: 'generar',
      icon: 'fa fa-download', 
    },
  ];


  @ViewChild('ModalReporte', { static: false }) ModalReporte: ElementRef;
  
  constructor(
    private route: ActivatedRoute,
    private serviciosGestionReportes: ServiciosGestionReportes, 
    private location: Location,
  ) { }

  cargarColumnas() {
    this.defaultCols = [

    {title:'Id Embalse' ,   data:"id_EMBALSE",   class: 'text-center',visible: true,}, 
    {title:'Embalse',  data:'embalse',   class: 'text-center',visible: true,},
    {title:'Id Entidad',  data:'id_ENTIDAD',   class: 'text-center',visible: true,}, 
    {title:'Entidad',  data:'entidad',   class: 'text-center',visible: true,},
    {title:'Zona Operativa EAAB',  data:'zona_OPERATIVA_EAAB',   class: 'text-center',visible: true,},  
    {title:'Fecha Inicio Operación',  data:'fecha_INICIO_OPERACION',   class: 'text-center',visible: true,}, 
    {title:'Elevación',  data:'elevacion',   class: 'text-center',visible: true,},
    {title:'Volumen Total',  data:'volumen_TOTAL',   class: 'text-center',visible: true,},
    {title:'Volumen Útil',  data:'volumen_UTIL',   class: 'text-center',visible: true,},
    {title:'Volumen Muerto',  data:'volumen_MUERTO',   class: 'text-center',visible: true,},
    {title:'Longitud Cresta',  data:'longitud_CRESTA',   class: 'text-center',visible: true,},
    {title:'Ancho Cresta',  data:'ancho_CRESTA',   class: 'text-center',visible: true,},
    {title:'Id Municipio',  data:'id_MUNICIPIO',   class: 'text-center',visible: true,},
    {title:'Municipio',  data:'municipio',   class: 'text-center',visible: true,},
    {title:'Id Departamento',  data:'id_DEPARTAMENTO',   class: 'text-center',visible: true,},
    {title:'Departamento',  data:'departamento',   class: 'text-center',visible: true,},
    {title:'Área Hidrográfica',  data:'area_HIDROGRAFICA',   class: 'text-center',visible: true,},
    {title:'Zona Hidrográfica',  data:'zona_HIDROGRAFICA',   class: 'text-center',visible: true,},
    {title:'Subzona Hidrográfica',  data:'subzona_HIDROGRAFICA',   class: 'text-center',visible: true,},
    {title:'Nivel Subsiguiente',  data:'nivel_SUBSIGUIENTE',   class: 'text-center',visible: true,},
    {title:'Cuenca',  data:'cuenca',   class: 'text-center',visible: true,},
    {title:'Subcuenca',  data:'subcuenca',   class: 'text-center',visible: true,},
    {title:'Microcuenca',  data:'microcuenca',   class: 'text-center',visible: true,},
    {title:'Altura Presa',  data:'altura_PRESA',   class: 'text-center',visible: true,},
    {title:'Activo Embalse',  data:'activo_EMBALSE',   class: 'text-center',visible: true,},
    {title:'Id Área Hidrográfica',  data:'id_AREA_HIDROGRAFICA',   class: 'text-center',visible: true,},
    {title:'Id Zona Hidrográfica',  data:'id_ZONA_HIDROGRAFICA',   class: 'text-center',visible: true,},
    {title:'Id Subzona Hidrográfica',  data:'id_SUBZONA_HIDROGRAFICA',   class: 'text-center',visible: true,},
    {title:'Id Cuenca',  data:'id_CUENCA',   class: 'text-center',visible: true,},
    {title:'Id Subcuenca',  data:'id_SUBCUENCA',   class: 'text-center',visible: true,},
    {title:'Id Microcuenca',  data:'id_MICROCUENCA',   class: 'text-center',visible: true,},
    {title:'Id Observación Embalse Inicial',  data:'id_OBSERVACION_X_EMBALSE_INICIAL',   class: 'text-center',visible: true,},
    {title:'Id Parámetro Embalse',  data:'id_PARAMETRO_X_EMABALSE',   class: 'text-center',visible: true,},
    {title:'Fecha',  data:'fecha',   class: 'text-center',visible: true,},
    {title:'Valor',  data:'valor',   class: 'text-center',visible: true,},
    {title:'Fecha Cargue',  data:'fecha_CARGUE',   class: 'text-center',visible: true,},
    {title:'Usuario Cargue',  data:'usuario_CARGUE',   class: 'text-center',visible: true,},
    {title:'Id Tipo Origen Observación',  data:'id_TIPO_ORIGEN_OBSERVACION',   class: 'text-center',visible: true,},
    {title:'Origen Observación',  data:'origen_OBSERVACION',   class: 'text-center',visible: true,},
    {title:'Origen',  data:'origen',   class: 'text-center',visible: true,},
    {title:'Id Estado Observación',  data:'id_ESTADO_OBSERVACION',   class: 'text-center',visible: true,},
    {title:'Estado Observación',  data:'estado_OBSERVACION',   class: 'text-center',visible: true,},
    {title:'Id Flag Observación',  data:'id_FLAG_OBSERVACION',   class: 'text-center',visible: true,},
    {title:'Flag Observación',  data:'flag_OBSERVACION',   class: 'text-center',visible: true,},
    {title:'Activo Observación',  data:'activo_OBSERVACION',   class: 'text-center',visible: true,},
    {title:'Fecha Creación',  data:'fecha_CREACION',   class: 'text-center',visible: true,},
    {title:'Fecha Modificación',  data:'fecha_MODIFICACION',   class: 'text-center',visible: true,},
    {title:'Fecha Estado',  data:'fecha_ESTADO',   class: 'text-center',visible: true,},
    {title:'Usuario Creación',  data:'usuario_CREACION',   class: 'text-center',visible: true,},
    {title:'Usuario Modificación',  data:'usuario_MODIFICACION',   class: 'text-center',visible: true,},
    {title:'Usuario Estado',  data:'usuario_ESTADO',   class: 'text-center',visible: true,},
    {title:'Id Parámetro',  data:'id_PARAMETRO',   class: 'text-center',visible: true,},
    {title:'Id Variable',  data:'id_VARIABLE',   class: 'text-center',visible: true,},
    {title:'Código',  data:'codigo',   class: 'text-center',visible: true,},
    {title:'Descripción',  data:'descripcion',   class: 'text-center',visible: true,},
    {title:'Id Unidad Medida',  data:'id_UNIDAD_MEDIDA',   class: 'text-center',visible: true,},
    {title:'Unidad Medida',  data:'unidad_MEDIDA',   class: 'text-center',visible: true,},
    {title:'Id Tipo Parámetro',  data:'id_TIPO_PARAMETRO',   class: 'text-center',visible: true,},
    {title:'Tipo parámetro',  data:'tipo_PARAMETRO',   class: 'text-center',visible: true,},
    {title:'Id Método',  data:'id_METODO',   class: 'text-center',visible: true,},
    {title:'Método',  data:'metodo',   class: 'text-center',visible: true,},
    {title:'Id Período',  data:'id_PERIODO',   class: 'text-center',visible: true,},
    {title:'Período',  data:'periodo',   class: 'text-center',visible: true,},
    {title:'Activo Parámetro',  data:'activo_PARAMETRO',   class: 'text-center',visible: true,},
    ];
  }

  ngOnInit(): void {
    
    this.idEstructura = this.route.snapshot.paramMap.get('idEstructura')!;
    this.fechaInicio = this.route.snapshot.paramMap.get('fechaInicio')!;
    this.fechaFin = this.route.snapshot.paramMap.get('fechaFin')!;

    Swal.fire({
      title: 'Cargando datos...',
      html: 'Por favor espere',
      showConfirmButton: false,
      allowOutsideClick: false,
      didOpen: async() => {
        Swal.showLoading();
        this.cargarDatos(toInteger(this.idEstructura), () => {
          Swal.close();
        });
      }, 
      willClose: async() => {
        Swal.hideLoading();
      }
    });

    this.cargarColumnas();
  }

  goBack(){
    this.location.back();
  }

  cargarDatos(idEstructura: number, callback : Function) {
    // 1. Se caga la información de la estructura...
    this.serviciosGestionReportes.obtenerPorId(idEstructura).subscribe((response) => {
      
      let idsElementos : any[] = []; 
      response.listElemento.forEach((elemento : any) => {
        idsElementos.push(elemento.id);
      })

      let idsParametros : any[] = [];
      response.listParametros.forEach((elemento : any) => {
        idsParametros.push(elemento.id);
      })
      
      this.obtenerListaReportes(toInteger(this.idEstructura), response.idTipoElemento, idsElementos,  idsParametros , this.fechaInicio, this.fechaFin, callback,response.estructura);
    });
  }

  obtenerListaReportes(idEstructura: number, idTipoElemento : number, idsElemento : number[], idsParametro : number[], fechaInicio : string, fechaFin : string, callback : Function, myestructura : string) {
    
    this.mostrarColumnas(myestructura);
    
    let elementosObj : any[] = [];
    idsElemento.forEach(id => {
    let objeto = {
        idReporteXElemento: null, 
        id: id, 
        text: null, 
        disabled: false,
      };
      elementosObj.push(objeto);
    });

   let parametrosObj : any[] = [];
   idsParametro.forEach(id => {
    let objeto = {
      idReporteXParametro: null, 
      id: id, 
      text: null,
      disabled: false,
    };
    parametrosObj.push(objeto);
   });

   let myRequest:any = {
    idEstructura: idEstructura, 
    idTipoElemento: idTipoElemento,
    tipoReporte: null,
    estructuraReporte: 'a,b',
    fechaInicio: fechaInicio,
    fechaFin: fechaFin,
    listElemento: elementosObj,
    listParametros: parametrosObj,
  };
  
  //console.log(1,myRequest);
  //console.log(JSON.stringify(myRequest));

  this.serviciosGestionReportes.obtenerReporteEmbalses(myRequest).subscribe(
      (response) => {
        this.datosFilter = response;
        callback();
      }
    );

  }

  mostrarColumnas(estructura : string) {
    
    let campos = estructura.split(',');
    this.colPosicionMap.clear();
    this.columnas = [];
    let contador = 0;

    campos.forEach(campo => {

      if (campo != '') {
        /*JUANDIEGO*/
        this.colPosicionMap.set(campo, contador);
        let newData = (campo.split('_')).length == 1 ? campo.toLowerCase() : campo.split('_')[0].toLowerCase().replace(",","")+campo.split(campo.split('_')[0])[1];
          
        let arrTitle = campo.toLowerCase().split('_');
        for (var i = 0; i < arrTitle.length; i++) {
          arrTitle[i] = arrTitle[i].charAt(0).toUpperCase() + arrTitle[i].slice(1);
        }
        let newTitle = arrTitle.join(" ");
          
        this.columnas.push({title: newTitle, data: newData, class: 'text-center', visible: true,});
        let index : number = toInteger(this.colPosicionMap.get(campo));
        this.columnas[index].visible = true;
        contador =contador + 1;
      }
    });

    this.defaultCols.forEach(defaultCol => {

      let obj = campos.find(o => o.toUpperCase()=== defaultCol.data.toUpperCase());
      if(obj==undefined){
        let newData = (defaultCol.data.split('_')).length == 1 ? defaultCol.data.toLowerCase() : defaultCol.data.split('_')[0].toLowerCase().replace(",","")+defaultCol.data.split(defaultCol.data.split('_')[0])[1];
        let arrTitle = defaultCol.data.toLowerCase().split('_');
        for (var i = 0; i < arrTitle.length; i++) {
          arrTitle[i] = arrTitle[i].charAt(0).toUpperCase() + arrTitle[i].slice(1);
        }
        let newTitle = arrTitle.join(" ");

        this.columnas.push({title: newTitle, data: newData, class: 'text-center', visible: false,});
      }
      
    });
  }

  accionRegistro(e: any) {

  }
  
  generarReporte(registro:any){
    this.ModalReporte.nativeElement.click();  
    console.log('llego',registro)
    this.nombreReporte = registro.descripcion
  }
}