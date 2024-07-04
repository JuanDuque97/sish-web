import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { MetodosGlobales } from 'src/app/common/utils/metodos-globales';
import { dominiosEnum } from 'src/app/modelo/enum/dominios-enum';

import { ServiciosAnalisisCon } from './idfs.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProcesarArchivosService } from 'src/app/modulos/configuracion/procesar-archivos/servicios/procesar-archivos.sercevice';
import { ITipoArchivoCampoDTO } from 'src/app/modelo/configuracion/tipoArchivoColumnaCampo';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { capasEnum, capasEnumDatos } from 'src/app/modelo/enum/capas-enum';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
const htmlToPdfmake = require("html-to-pdfmake");
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

import { ServiciosGeograficosService } from 'src/app/common/mapa/servicios-geograficos.service';
import { ServiciosParametrosService } from 'src/app/modulos/parametros/servicios-parametros.service';
import { ServiciosSerieTiempoService } from 'src/app/modulos/seriestiempo/servicios/servicios-serie-tiempo.service';
import { IserieConsulta, IserieConsultaDTO, IserieTiempoElemento, IserieTiempoPromedioAnio } from 'src/app/modelo/configuracion/seriesTiempo';
import { accionesTablasEnum } from 'src/app/modelo/enum/acciones-tablas-enum';
import Swal from 'sweetalert2';
import { IParametrosCFrecuencias } from 'src/app/modelo/configuracion/estacion';
import { Observable } from 'rxjs';
import * as Highcharts from "highcharts";
import * as ecStat from 'echarts-stat';
const regression = require('regression');
import HC_exporting from "highcharts/modules/exporting";
import HC_Data from "highcharts/modules/export-data";
import Accessbility from "highcharts/modules/accessibility";
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
HC_exporting(Highcharts);
HC_Data(Highcharts);
Accessbility(Highcharts);
const SpearmanRHO = require('spearman-rho');
const correlation = require('node-correlation');

export var var1: number = 0;
export var var2: string = '';
export var var3: string = '';
@Component({
  selector: 'app-idfs',
  templateUrl: './idfs.component.html',
})



export class IdfsComponent implements OnInit {
  
  @ViewChild("lineChart", { static: false }) lineChart: any;
  @ViewChild('ModalCalidad', { static: false }) ModalCalidad: ElementRef;
  @ViewChild('ModalReporte', { static: false }) ModalReporte: ElementRef;
  @ViewChild('pdfTable')
  pdfTable!: ElementRef;

  fechaConsulta: number = Date.now();

  @ViewChild(DataTableDirective, { static: false })
  public Highcharts = Highcharts;
  public isHighcharts = typeof Highcharts === 'object';
  public chartOptions: Highcharts.Options = {};
  public chartOptions1: Highcharts.Options = {};
  public updateFlag: boolean = false;
  public formularioConsulta!: FormGroup;
  public formularioIdfs!: FormGroup;
  imagen: unknown;
  botones = [
    {
      class: 'sish-boton-azul',
      title: 'Descargar pdf',
      action: 'descargr',
      icon: 'fa fa-download',
      enabled: this.validarPermiso('ActualizarEstacion'),

    },
 
  
  
  ];
  public rutaGeneral = 'configuracion/dominios/C/0';
  public rutaConsulta = 'configuracion/dominios/V/';
  public rutaEdicion = 'configuracion/dominios/E/';
  public verFechas = false;
  public datosFilter = [] as any;
  public departamentoSelected: any;
  public periodo: number = 2;
  public listaElemento :any= [];
  public listaElementos :any= [];
  public listaCodigoEAAB: any = [];
  public listaCodigoIDEAM: any = [];
  public datosOriginal = [] as any;
  public idSerieTiempo: number;
  public parametroLista = [] as any;
  public listZonaEAAB = [];
  public myRegression:any = [];
  public listaAutocompletado: any = [];
  public listaDetalle: any  = [] as any;
  public categoriaFecha: any  = [] as any;
  public listTipoPozo = [];
  public separadorCampos : string = ',';
  public formatoFecha : string = 'yyyy-MM-dd';
  public formatoHora : string = 'HH:mm:ss';
  public formatoFechaHora : string = this.formatoFecha + " " + this.formatoHora;
  public moda: number;
  public fechaObservacion: any;
  public posValor = 1;
  public posFecha = 0;
  public porcentaje : number = 0;
  public fmrCargueArchivo :  FormGroup;
  public arrayErrores : string = '';
  public rbTipoParametro : number = 1;
  public listaCodigoParametros : any[] = [];
  public listaNombreParametros : any[] = [];
  public totalRegistrosEsperados : number=0;
  public totalRegistrosCargados : number=0;
  public totalRegistrosErrores : number=0;
  public elemento : number = 1;
  public idFlag : number = 0;
  public archivoRuta : String = '';
  public listaEstaciones=[];
  public listaEmbalses=[];
  public listaPozos =[];
  public listTiposArchivoCampo:ITipoArchivoCampoDTO[]=[];
  public idElemento: number = 0;
  public listaflag: any = [];
  public id: string = '0';
  public ac: string = 'c';
  public te: string = '0';
  public usuario = JSON.parse(sessionStorage.getItem('usuario') || '{}');
  public datosObservacionList: any[] = [];
  public capas: any[] = [];

  public estes = [] as any;
  public nortes = [] as any;
  public listObservaciones: any;

  mapZoomLevel = 9;
  mapCenter = [-73.9, 4.4];
  basemapType = 'topo';

  name = '';
  url: string = "https://www.folkloredelnorte.com.ar/cancionero/v/virgenindia.html";
  urlSafe: SafeResourceUrl;
  niveles: number;

  // See app.component.html
  mapLoadedEvent(status: Event) {
    console.log('The map loaded: ' + status);
  }

  public listCategoriaPozo = [];
  public listCondicionPozo = [];
  public geograficas = false;
  public planas = false;
  public fechainicio:Date;
  public Fechafin:Date;
  public nombreParametro:string = "" ;
  public tabla:string = "" ;
  public nombreEstacion:string = "" ;
  public nombreEstacionA:string = "" ;
  public nombreEstacionB:string  = "" ;
  public nombreEstacionC:string  = "" ;
  public nombreEstacionD:string  = "" ;
  public nombreEstacionE:string  = "" ;
  public ecuacionString:string = "" ;
  public listaCodigoEAABAgregar : any[] = [];
  public ListaTipoCordenadas : any[] = [
    { id: 1, text: 'EPSG: 4326 -  WGS 84' },
    { id: 2, text: 'EPSG:3116 - Magna -Sirgas Bogotá' },
  ];
  public listEntidades = [];

  public valor: number;
  public flag: number = 0;
  public origen: string;
  public idFrecuencia: number;
  public tipoBusqueda: number = 1;
  public listaAreaHidrografica = [];
  public listaZonaHidrografica = [];
  public cordenadaX: number = 0;
  public cordenadaY: number = 0;


  public listasubZonaHidrografica = [];
  public listanivel = [];
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
  public ajuste: number;
  public pediente2: number;
  public pediente1: number;
  public correlacion: number;
  public fechaActualMensual: string;
  public fechaActualHora: string;
  public fecha: string;
  public fechaAno: number;
  public fechaMes: string;

  public fechaActualMensualFin: string;
  public fechaActualHoraFin: string;
  public fechaFinal: string;
  public fechaAnoFin: number;
  public fechaMesFin: string;
  public fechasComparacion: number;
  public listaCuenca = [];
  public listaMicrocuenca = [];
  public listaEntidad = [];
  public listaItemsElementos:any=[];
  public tipoCordenadas :string ;
  public listParametro: any[] = [];
  public listParametroOrgin: any[] = [];
  public listaFrecuencia: any[] = [];
  public listaSubcuenca = [];
  public cantidad:any = [];
  public serie = [];
  public r2:number;
  public listaMunicipios = [];
  public idTipoElemento: any;
  public idElementoTipo : any;
  public listaDepartamentos = [];
  public datatableElement: DataTableDirective | undefined;
  public parametro: number = 0;
  public idfrecuencia: number = 0;
  public dtOptions: any = {};
  public  cantidad_1:any=[];
  public  cantidad_2:any=[];
  public  cantidad_3:any=[];
  public  cantidad_4:any=[];
  public  cantidad_5:any=[];
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


  done: boolean;

  public  cantidad_1_1:any=[];
  public  cantidad_2_2:any=[];
  public  cantidad_3_3:any=[];
  public  cantidad_4_4:any=[];
  public  cantidad_5_5:any=[];
  public fechaActual: string;
  private tempIdDepartamento: number = 0;

   
       columnas:any  = [] as any;
      columnas1:any  = [ 
        { title:'', data:'',disabled: false}, 
      { title:'', data:'',disabled: false}, 
      { title:'', data:'',disabled: false},   
      { title:'', data:'',disabled: false}, 
        ] as any;
      columnas2:any  = [ 
        { title:'', data:'',disabled: false}, 
      { title:'', data:'',disabled: false}, 
      { title:'', data:'',disabled: false},   
      { title:'', data:'',disabled: false},  
      { title:'', data:'',disabled: false},  
        ] as any;
    columnas3:any  = [ 
      { title:'', data:'',disabled: false}, 
     { title:'', data:'',disabled: false}, 
     { title:'', data:'',disabled: false},   
     { title:'', data:'',disabled: false},  
     { title:'', data:'',disabled: false},  
     { title:'', data:'',disabled: false},  
      ] as any;

      columnas4:any  = [ 
        { title:'', data:'',disabled: false}, 
       { title:'', data:'',disabled: false}, 
       { title:'', data:'',disabled: false},   
       { title:'', data:'',disabled: false},  
       { title:'', data:'',disabled: false},  
       { title:'', data:'',disabled: false},  
       { title:'', data:'',disabled: false},  
        ] as any;

  constructor(
    private procesarArchivosService: ProcesarArchivosService ,
    private ServiciosIdfs:ServiciosAnalisisCon,
    private serviciosParametrosService: ServiciosParametrosService,
    private formBuilder: FormBuilder,
    private router:Router,
    private serviciosSerieTiempoService: ServiciosSerieTiempoService,
  ) {
    // Esto es intencional
  }

  vector: Array<number> = Array(50);

    
  async ngOnInit(): Promise<void> {


    
    this.cargar();

    this.imagen = await this.getBase64ImageFromURL(
      "./assets/images/logoacueducto.png"
    )

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




  get idMecanismo(): any {
    return this.formularioConsulta.get('idMecanismo');
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
  get idcordenadaX() {
    return this.formularioConsulta.get('idcordenadaX');
  }
  get idtipoCordenadas() {
    return this.formularioConsulta.get('idtipoCordenadas');
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

  get este(){
    return this.formularioIdfs.get('este')
  }
  get norte(){
    return this.formularioIdfs.get('norte')
  }

  private construirFormulario() {
    this.formularioConsulta = this.formBuilder.group({
      idElemento: ['', [Validators.required]],
      idcordenadaX: ['', [Validators.required]],
      idcordenadaY:['', [Validators.required]],
      idCodigoEAAB:['', [Validators.required]],
      idtipoCordenadas:['', [Validators.required]],
      fechaInicio:[''],
      fechaFin:[''],
      frecuencia:['', [Validators.required]],
      idParametro:['', [Validators.required]],
      peridoId:[''],
      idMecanismo: [469],
    });
    this.formularioIdfs = this.formBuilder.group({
      este: [''],
      norte: [''],
    })
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



agregarElemento(){
  if(this.listaItemsElementos.length < 10){
  
      var seleccionTemporal:any={
        id:this.listaItemsElementos.length +1 ,
        nombreTipoCordenadas: this.ListaTipoCordenadas.filter(filtro=> filtro.id == this.formularioConsulta.get('idtipoCordenadas')?.value)[0].text,
        cordenadaX: this.formularioConsulta.get('idcordenadaX')?.value,
        cordenadaY:this.formularioConsulta.get('idcordenadaY')?.value,
      }


    console.log(seleccionTemporal);

    this.listaItemsElementos.push(seleccionTemporal);
    this.estes.push(seleccionTemporal.cordenadaX);
    this.nortes.push(seleccionTemporal.cordenadaY);

  }else{
    Swal.fire(
      'Consultar Idfs',
      'No se pueden incluir mas de 10 elementos ',
      'error'
    );
  }
 
}

filtrarCalidad() {



  if (!this.formularioIdfs.valid) {
    this.toast.fire({
      icon: 'error',
      title: 'Los parametros solicitados NO son correctos. Por favor revise los valores obligatorios.',
    });
    return;
  }
    let objetoBusqueda: any;

    this.formularioConsulta.value.idcordenadaY = this.estes;
    this.formularioConsulta.value.idcordenadaX = this.nortes;

    objetoBusqueda = this.formularioConsulta.value;
    console.log("------------------------------")
console.log(objetoBusqueda)
    Swal.fire({
      title: 'Procesando...',
      html: 'Por favor espere',
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: async () => {
        console.time('executionTime');

        Swal.showLoading();

        this.ServiciosIdfs.prueba(objetoBusqueda).subscribe((Response) => {
          this.listObservaciones = Response;
          this.datosFilter = this.listObservaciones;
          Swal.close();

          console.timeEnd('executionTime');
        });
      }, willClose: async () => {
        Swal.hideLoading();
      }
    });

}







modoLectura(){


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



buscarEstacion(){
     
  this.agregarElemento(); 




}

filtrar(elemento: any) {
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
                        
                         this.ServiciosIdfs
                          .analisisDobleMasas( this.formularioConsulta.value)
                          .subscribe((response) => {

                             

                                  
                                  Swal.showLoading();
                           this.listaAutocompletado = response;    


                           for (let  i = 0; i <     this.listaAutocompletado.multiLista.length; i++) {
                          
                            for (let  j = 0; j <     this.listaAutocompletado.multiLista[i].length; j++) {

                            
                              if( this.listaAutocompletado.multiLista[i][0]['valor']  == 0 ){


                                var valor  =       this.listaAutocompletado.multiLista[i][j]['valor']  

                              }else{
                           
                           
                              if( this.listaAutocompletado.multiLista[i][0]['valor']  ){


                                var valor  =       this.listaAutocompletado.multiLista[i][j]['valor']  


                              }else{
                                var valor  =       this.listaAutocompletado.multiLista[i][j-1]['valor']  +   this.listaAutocompletado.multiLista[i][j]['valor']  


                              }

                            }
                              this.listaAutocompletado.multiLista[i][j]['valor'] =valor;
                              
                              

                       
                            
                           };

                          }


                          console.log( 33, this.listaAutocompletado);



                           var cars = this.listaAutocompletado.multiLista.filter(function(car:any) {
                            return car.length != 0; 
                          });
                          var posicion =  this.listaAutocompletado.multiLista.indexOf(null);
                          console.log(434,cars);
                      console.log(44,posicion);
                          var lista_elemento :any= []
                          for (let  i = 0; i <  posicion.length; i++) {
                              lista_elemento =  posicion.filter(((element:any) => element.idCategoria == posicion[i].text)).map((elemento: any) => ({
                              id: elemento.id,
                              text: elemento.text,
                            }));
                          };
                       
                     



                          this.listaAutocompletado.multiLista = cars
                             var serie:any = [];
                            var catidadRepresentativas:any  = [];
                            catidadRepresentativas = this.listaAutocompletado.multiLista;

                   
                            var   cantidad =[];
                            var   cantidad2 =[];
                            var cantidadNivel = [];

                            for (let  i = 0; i <  catidadRepresentativas.length; i++) {

                            switch (i) {
                            case  1: {


                              if(this.listaAutocompletado.multiLista[1].length){

                                        var myRegression:any = [];
                                        var cantidad1 = [];
                                        const x:any = [];
                                        const y:any = [];
                                        for (let  i = 0; i <  catidadRepresentativas[0].length; i++) {
                                            
                                          if(catidadRepresentativas[0][i]  &&   catidadRepresentativas[1][i] ){

                                            
                                            if(i==0 ){
                                
                                              var valor  =       catidadRepresentativas[0][i]['valor']  
                                              var valor1  =       catidadRepresentativas[1][i]['valor']  
              
              
                                            }else{
                                              var valor  =       catidadRepresentativas[0][i-1]['valor']  +   catidadRepresentativas[0][i]['valor']  
              
                                              var valor1  =       catidadRepresentativas[1][i-1]['valor']  +   catidadRepresentativas[1][i]['valor']  

                                            }
                                                 catidadRepresentativas[1][i]['valor'] =valor;
                                                  catidadRepresentativas[0][i]['valor'] =valor1;

                                                  let myArray = [catidadRepresentativas[1][i]['valor']  , catidadRepresentativas[0][i]['valor'] ]; 
                                                  let suma = 0
    
                                                  for(let index in myArray) {
                                                    suma += myArray[index]
                                                  
                                                  }
                                                  
                                                    console.log(suma/myArray.length)

                                            
                                                      
          
                                            x.push(suma/myArray.length);
                                            y.push(catidadRepresentativas[1][i]['valor']); 
                                            var  ejeY =  catidadRepresentativas[0][i]['valor'] 
                                            var  eje =  suma/myArray.length
                                            cantidad1.push([eje,ejeY]);
                                              this.cantidad_1.push([suma/myArray.length,catidadRepresentativas[1][i]['valor']  ]);

                                            }


                                          }


                                          console.log(2,catidadRepresentativas);


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
                                    'IDFs ',
                                    'No hay información en la estación representativa '+this.listaItemsElementos[1]['nombreElemento'],
                                    'error'
                                  )
                                }
                          
                          
                                break;
                             }
                            case 2: {   

                                if(this.listaAutocompletado.multiLista[2].length){


                      


                                  var myRegression:any = [];
                                  var cantidad1 = [];
                                    for (let  i = 0; i <  catidadRepresentativas[0].length; i++) {

                                      if(catidadRepresentativas[0][i]  &&   catidadRepresentativas[2][i] ){ 
                                        
                                         
                                            if(i==0 ){
                                
                                              var valor  =       catidadRepresentativas[0][i]['valor']  
                                              var valor1  =       catidadRepresentativas[2][i]['valor']  
              
              
                                            }else{
                                              var valor  =       catidadRepresentativas[0][i-1]['valor']  +   catidadRepresentativas[0][i]['valor']  
              
                                              var valor1  =       catidadRepresentativas[2][i-1]['valor']  +   catidadRepresentativas[2][i]['valor']  

                                            }
                                                 catidadRepresentativas[2][i]['valor'] =valor;
                                                  catidadRepresentativas[0][i]['valor'] =valor1;

                                                  let myArray = [catidadRepresentativas[2][i]['valor']  , catidadRepresentativas[0][i]['valor'] ]; 
                                                  let suma = 0
    
                                                  for(let index in myArray) {
                                                    suma += myArray[index]
                                                  
                                                  }
                                                  
                                                    console.log(suma/myArray.length)

                                            
                                                      
          
                                         
                                            var  ejeY =  catidadRepresentativas[2][i]['valor'] 
                                            var  eje =  suma/myArray.length
                                            cantidad1.push([eje,ejeY]);
                                              this.cantidad_2.push([suma/myArray.length,catidadRepresentativas[2][i]['valor']  ]);

                                      }
                                    }
                                    myRegression = ecStat.regression('linear', cantidad1, 0);
                                    this.cantidad_2_2 = myRegression.points;
 
                            
                            
                                  }else{
    
                                  Swal.fire(
                                    'IDFs ',
                                    'No hay información en la estación representativa '+this.listaItemsElementos[2]['nombreElemento'],
                                    'error'
                                  )
                                }
                               

                              
                                  break;
                            }
                            case 3: {   

                                  
                                  if(this.listaAutocompletado.multiLista[3].length){

                             
                                      var myRegression:any = [];
                                      var cantidad1 = [];
                                    for (let  i = 0; i <  catidadRepresentativas[0].length; i++) {

                                      if(catidadRepresentativas[0][i]  &&   catidadRepresentativas[3][i] ){ 

                                        if(i==0 ){
                                
                                          var valor  =       catidadRepresentativas[0][i]['valor']  
                                          var valor1  =       catidadRepresentativas[1][i]['valor']  
          
          
                                        }else{
                                          var valor  =       catidadRepresentativas[0][i-1]['valor']  +   catidadRepresentativas[0][i]['valor']  
          
                                          var valor1  =       catidadRepresentativas[1][i-1]['valor']  +   catidadRepresentativas[1][i]['valor']  

                                        }
                                             catidadRepresentativas[1][i]['valor'] =valor;
                                              catidadRepresentativas[0][i]['valor'] =valor1;

                                        var  ejeY =  catidadRepresentativas[0][i]['valor'] 
                                        var  ejex =  catidadRepresentativas[3][i]['valor'] 
                                        cantidad1.push([ejex,ejeY]);
                                        this.cantidad_3.push([catidadRepresentativas[3][i]['valor'],catidadRepresentativas[0][i]['valor']]);
                                      }
                                  
                                      }
                                      myRegression = ecStat.regression('linear', cantidad1, 0);
                                      this.cantidad_3_3 = myRegression.points;
        
                                    }else{
        
                                      Swal.fire(
                                        'IDFs ',
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
                                  for (let  i = 0; i <  catidadRepresentativas[0].length; i++) {
                                    if(catidadRepresentativas[0][i]  &&   catidadRepresentativas[4][i] ){ 
                                      var  ejeY =  catidadRepresentativas[0][i]['valor'] 
                                      var  ejex =  catidadRepresentativas[4][i]['valor'] 
                                      cantidad1.push([ejex,ejeY]);
                                      this.cantidad_4.push([catidadRepresentativas[4][i]['valor'],catidadRepresentativas[0][i]['valor']]);
                                    }
                                 
                                    }
                                    myRegression = ecStat.regression('linear', cantidad1, 0);
                                    this.cantidad_4_4 = myRegression.points;
 
                                  }else{
      
                                    Swal.fire(
                                      'IDFs ',
                                      'No hay información en la estación representativa '+this.listaItemsElementos[4]['nombreElemento'],
                                      'error'
                                    )
                                  }

                                
                                    
                                    
                                  break;
                            }
                            case  5: {   


                                  if(this.listaAutocompletado.multiLista[5].length){

                                  
                                    var myRegression:any = [];
                                    var cantidad1 = [];
                                  for (let  i = 0; i <  catidadRepresentativas[0].length; i++) {
                                    if(catidadRepresentativas[0][i]  &&   catidadRepresentativas[5][i] ){ 
                                      var  ejeY =  catidadRepresentativas[0][i]['valor'] 
                                      var  ejex =  catidadRepresentativas[5][i]['valor'] 
                                      cantidad1.push([ejex,ejeY]);
                                      this.cantidad_5.push([catidadRepresentativas[5][i]['valor'],catidadRepresentativas[0][i]['valor']]);
                                    }
                                    }
                                    myRegression = ecStat.regression('linear', cantidad1, 0);
                                    this.cantidad_5_5 = myRegression.points;
 
                                  }else{
      
                                    Swal.fire(
                                      'IDFs ',
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
                                            type: 'line',
                                        name: this.listaItemsElementos[i]['nombreElemento'],
                                            data: this.cantidad_1,
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
                                      type: 'line',
                                  name: this.listaItemsElementos[i]['nombreElemento'],
                                      data: this.cantidad_2,
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

                            Swal.close();
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
              'IDFs ',
              'Debe ingresar al menos una estación representativa ',
              'error'
            )
          }

        }else{
          Swal.fire(
            'IDFs ',
            'Debe ingresar los datos solicitados  ',
            'error'
          )
        }


      } catch (error) {
        Swal.fire(
          'IDFs ',
          'Debe ingresar los datos solicitados  ',
          'error'
        )
       
      }

}



graficapdf(){
  alert(33);
  this.lineChart.chart.exportChart({
    type: "application/pdf",
    filename: "line-chart"
  });

}

infoAforo(){

 
  var alumnosCurso = '<table id="alumnosCurso" class="table table-striped nowrap" width="100%"><thead><tr><th>Valor Origen </th><th>Valor reprentativo</th><th>Fecha de aforo</th></tr> </thead><tbody><tr><td>'+var1+'</td><td>'+var2+'</td><td>'+var3+'</td> </tr></tbody></table>';
 
      Swal.fire({
        title: 'Información de valores ',
        html:alumnosCurso,
        focusConfirm: false,
        allowOutsideClick: false
    });

} 



guadarCurva(){
  Swal.fire({
    title: 'Desea guardar la serie de tiempo ?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Guardar',
  }).then((result) => {
    if (result.isConfirmed) {
      
    this.crearSerie();

    }
  });
}
verDetalle(){


  
  this.chartOptions1 = {};
  this.chartOptions1.series = [];
    var serie:any=[];
    var dataO:any=[];
    var dataA:any=[];
    var dataB:any=[];
    var dataC:any=[];
    var dataD:any=[];
    var dataE:any=[];




     for (let  i = 0; i <  this.listaAutocompletado.multiLista[0].length; i++) {
         
      this.categoriaFecha.push(this.listaAutocompletado.multiLista[0][i]['fecha']);

     } 
  
    if(this.listaAutocompletado.multiLista.length == 2){ 

      this.tabla = '1';
      this.listaDetalle =[];
      for (let  i = 0; i <  this.listaAutocompletado.multiLista[0].length; i++) {
 
          if(this.listaAutocompletado.multiLista[0][i]  &&   this.listaAutocompletado.multiLista[1][i] ){

              this.listaDetalle.push(
          
                {  fecha: this.listaAutocompletado.multiLista[0][i]['fecha'],
                  valorOrigen: this.listaAutocompletado.multiLista[0][i]['valor'],
                  valor1: this.listaAutocompletado.multiLista[1][i]['valor'],

              }   ); 

              dataO.push(this.listaAutocompletado.multiLista[0][i]['valor']);
              dataA.push(this.listaAutocompletado.multiLista[1][i]['valor']);

          }
      }

      serie=[{
        type: 'column',
          name: this.nombreEstacion+"-Origen",
          data: dataO
        },
        {
          type: 'column',
            name: this.nombreEstacionA,
            data: dataA
          },
      ]




   var    tablaString = 'Promedio '+this.nombreParametro+'-'+ this.nombreEstacion;
     var  tablaString1 = 'Promedio '+this.nombreParametro+'-'+this.nombreEstacionA;
    


    }

    if(this.listaAutocompletado.multiLista.length  == 3){  
      this.listaDetalle =[];

      this.tabla = '2';
      for (let  i = 0; i <  this.listaAutocompletado.multiLista[0].length; i++) {

     if(this.listaAutocompletado.multiLista[0][i]  &&  
       this.listaAutocompletado.multiLista[2][i]  &&
        this.listaAutocompletado.multiLista[1][i]   ){

            this.listaDetalle.push(
        
              {  fecha: this.listaAutocompletado.multiLista[0][i]['fecha'],
                valorOrigen: this.listaAutocompletado.multiLista[0][i]['valor'],
                valor1: this.listaAutocompletado.multiLista[1][i]['valor'],
                valor2: this.listaAutocompletado.multiLista[2][i]['valor'],
            
            }   ); 

            dataO.push(this.listaAutocompletado.multiLista[0][i]['valor']);
            dataA.push(this.listaAutocompletado.multiLista[1][i]['valor']);
            dataB.push(this.listaAutocompletado.multiLista[2][i]['valor']);

          }
      }

      serie=[{
        type: 'column',
          name: this.nombreEstacion+"-Origen",
          data: dataO
        },
      {
        type: 'column',
          name: this.nombreEstacionA,
          data: dataA
        },
      {
        type: 'column',
          name: this.nombreEstacionB,
          data: dataB
        },     
      ]

      var    tablaString = 'Promedio '+this.nombreParametro+'-'+ this.nombreEstacion;
      var  tablaString1 = 'Promedio '+this.nombreParametro+'-'+this.nombreEstacionA;
      var  tablaString2 = 'Promedio '+this.nombreParametro+'-'+this.nombreEstacionB;
       this.columnas1 = [ 
        { title:'Fecha', data:'fecha' ,  disabled: true }, 
         { title:tablaString, data:'valorOrigen',disabled: true}, 
         { title:tablaString1, data:'valor1',disabled: true},  
         { title:tablaString2, data:'valor2',disabled: true}, 
       ];

    }

    if(this.listaAutocompletado.multiLista.length  == 4){  
      this.listaDetalle =[];

      this.tabla = '3';
      for (let  i = 0; i <  this.listaAutocompletado.multiLista[0].length; i++) {

     if(this.listaAutocompletado.multiLista[0][i]  &&  
       this.listaAutocompletado.multiLista[2][i]  &&
        this.listaAutocompletado.multiLista[1][i]   ){

            this.listaDetalle.push(
        
              {  fecha: this.listaAutocompletado.multiLista[0][i]['fecha'],
                valorOrigen: this.listaAutocompletado.multiLista[0][i]['valor'],
                valor1: this.listaAutocompletado.multiLista[1][i]['valor'],
                valor2: this.listaAutocompletado.multiLista[2][i]['valor'],
                valor3: this.listaAutocompletado.multiLista[3][i]['valor'],
            
            }   ); 

            dataO.push(this.listaAutocompletado.multiLista[0][i]['valor']);
            dataA.push(this.listaAutocompletado.multiLista[1][i]['valor']);
            dataB.push(this.listaAutocompletado.multiLista[2][i]['valor']);
            dataC.push(this.listaAutocompletado.multiLista[3][i]['valor']);

          }
      }

      serie=[{
        type: 'column',
          name: this.nombreEstacion+"-Origen",
          data: dataO
        },
      {
        type: 'column',
          name: this.nombreEstacionA,
          data: dataA
        },
      {
        type: 'column',
          name: this.nombreEstacionB,
          data: dataB
        },  
        {
          type: 'column',
            name: this.nombreEstacionC,
            data: dataC
          },    
      ]

      var    tablaString = 'Promedio '+this.nombreParametro+'-'+ this.nombreEstacion;
      var  tablaString1 = 'Promedio '+this.nombreParametro+'-'+this.nombreEstacionA;
      var  tablaString2 = 'Promedio '+this.nombreParametro+'-'+this.nombreEstacionB;
      var  tablaString3 = 'Promedio '+this.nombreParametro+'-'+this.nombreEstacionC;

       this.columnas2 = [ 
        { title:'Fecha', data:'fecha' ,  disabled: true }, 
         { title:tablaString, data:'valorOrigen',disabled: true}, 
         { title:tablaString1, data:'valor1',disabled: true},  
         { title:tablaString2, data:'valor2',disabled: true}, 
         { title:tablaString3, data:'valor3',disabled: true}, 
       ];

    }

    if(this.listaAutocompletado.multiLista.length  == 5){  
      this.listaDetalle =[];

      this.tabla = '4';
      for (let  i = 0; i <  this.listaAutocompletado.multiLista[0].length; i++) {

     if(this.listaAutocompletado.multiLista[0][i]  &&  
       this.listaAutocompletado.multiLista[2][i]  &&
        this.listaAutocompletado.multiLista[1][i] &&
        this.listaAutocompletado.multiLista[3][i] &&  
        this.listaAutocompletado.multiLista[4][i] 
        ){

            this.listaDetalle.push(
        
              {  fecha: this.listaAutocompletado.multiLista[0][i]['fecha'],
                valorOrigen: this.listaAutocompletado.multiLista[0][i]['valor'],
                valor1: this.listaAutocompletado.multiLista[1][i]['valor'],
                valor2: this.listaAutocompletado.multiLista[2][i]['valor'],
                valor3: this.listaAutocompletado.multiLista[3][i]['valor'],
                valor4: this.listaAutocompletado.multiLista[4][i]['valor'],
            
            }   ); 

            dataO.push(this.listaAutocompletado.multiLista[0][i]['valor']);
            dataA.push(this.listaAutocompletado.multiLista[1][i]['valor']);
            dataB.push(this.listaAutocompletado.multiLista[2][i]['valor']);
            dataC.push(this.listaAutocompletado.multiLista[2][i]['valor']);
            dataD.push(this.listaAutocompletado.multiLista[4][i]['valor']);

          }
      }

      serie=[{
        type: 'column',
          name: this.nombreEstacion+"-Origen",
          data: dataO
        },
      {
        type: 'column',
          name: this.nombreEstacionA,
          data: dataA
        },
      {
        type: 'column',
          name: this.nombreEstacionB,
          data: dataB
        },   
        {
          type: 'column',
            name: this.nombreEstacionC,
            data: dataC
          },    

          {
            type: 'column',
              name: this.nombreEstacionD,
              data: dataD
            }, 
      ]

      var    tablaString = 'Promedio '+this.nombreParametro+'-'+ this.nombreEstacion;
      var  tablaString1 = 'Promedio '+this.nombreParametro+'-'+this.nombreEstacionA;
      var  tablaString2 = 'Promedio '+this.nombreParametro+'-'+this.nombreEstacionB;
      var  tablaString3 = 'Promedio '+this.nombreParametro+'-'+this.nombreEstacionC;
      var  tablaString4 = 'Promedio '+this.nombreParametro+'-'+this.nombreEstacionD;
       this.columnas3 = [ 
        { title:'Fecha', data:'fecha' ,  disabled: true }, 
         { title:tablaString, data:'valorOrigen',disabled: true}, 
         { title:tablaString1, data:'valor1',disabled: true},  
         { title:tablaString2, data:'valor2',disabled: true}, 
         { title:tablaString3, data:'valor3',disabled: true},  
         { title:tablaString4, data:'valor4',disabled: true}, 
       ];

    }



    if(this.listaAutocompletado.multiLista.length  == 6){  
      this.listaDetalle =[];


      this.tabla = '5';
      for (let  i = 0; i <  this.listaAutocompletado.multiLista[0].length; i++) {
  
     if(this.listaAutocompletado.multiLista[0][i]  &&  
        this.listaAutocompletado.multiLista[2][i]  &&
        this.listaAutocompletado.multiLista[1][i] &&
        this.listaAutocompletado.multiLista[3][i] &&  
        this.listaAutocompletado.multiLista[4][i] && 
        this.listaAutocompletado.multiLista[5][i] 
        ){

            this.listaDetalle.push(
        
              {  fecha: this.listaAutocompletado.multiLista[0][i]['fecha'],
                valorOrigen: this.listaAutocompletado.multiLista[0][i]['valor'],
                valor1: this.listaAutocompletado.multiLista[1][i]['valor'],
                valor2: this.listaAutocompletado.multiLista[2][i]['valor'],
                valor3: this.listaAutocompletado.multiLista[3][i]['valor'],
                valor4: this.listaAutocompletado.multiLista[4][i]['valor'],
                valor5: this.listaAutocompletado.multiLista[5][i]['valor'],
            
            }   ); 

            dataO.push(this.listaAutocompletado.multiLista[0][i]['valor']);
            dataA.push(this.listaAutocompletado.multiLista[1][i]['valor']);
            dataB.push(this.listaAutocompletado.multiLista[2][i]['valor']);
            dataC.push(this.listaAutocompletado.multiLista[2][i]['valor']);
            dataD.push(this.listaAutocompletado.multiLista[4][i]['valor']);
            dataE.push(this.listaAutocompletado.multiLista[5][i]['valor']);
          }
      }

      serie=[{
        type: 'column',
          name: this.nombreEstacion+"-Origen",
          data: dataO
        },
      {
        type: 'column',
          name: this.nombreEstacionA,
          data: dataA
        },
      {
        type: 'column',
          name: this.nombreEstacionB,
          data: dataB
        },   
        {
          type: 'column',
            name: this.nombreEstacionC,
            data: dataC
          },    

          {
            type: 'column',
              name: this.nombreEstacionD,
              data: dataD
            }, 

            {
              type: 'column',
                name: this.nombreEstacionE,
                data: dataE
              }, 
      ]

      var    tablaString = 'Promedio '+this.nombreParametro+'-'+ this.nombreEstacion;
      var  tablaString1 = 'Promedio '+this.nombreParametro+'-'+this.nombreEstacionA;
      var  tablaString2 = 'Promedio '+this.nombreParametro+'-'+this.nombreEstacionB;
      var  tablaString3 = 'Promedio '+this.nombreParametro+'-'+this.nombreEstacionC;
      var  tablaString4 = 'Promedio '+this.nombreParametro+'-'+this.nombreEstacionD;
      var  tablaString5 = 'Promedio '+this.nombreParametro+'-'+this.nombreEstacionE;
       this.columnas4 = [ 
        { title:'Fecha', data:'fecha' ,  disabled: true }, 
         { title:tablaString, data:'valorOrigen',disabled: true}, 
         { title:tablaString1, data:'valor1',disabled: true},  
         { title:tablaString2, data:'valor2',disabled: true}, 
         { title:tablaString3, data:'valor3',disabled: true},  
         { title:tablaString4, data:'valor4',disabled: true}, 
         { title:tablaString5, data:'valor5',disabled: true}, 
       ];

    }



 

     

 console.log(serie);
    this.chartOptions1 = {
      chart: {
          type: 'column'
      },
      title: {
          text: this.nombreParametro
      },

      xAxis: {
          categories: this.categoriaFecha,
          title: {
              text: null
          }
      },
      yAxis: {
          min: 0,
          title: {
              text: this.nombreParametro,
              align: 'high'
          },
          labels: {
              overflow: 'justify'
          }
      },
      tooltip: {
          valueSuffix: '  '
      },
      plotOptions: {
          bar: {
              dataLabels: {
                  enabled: true
              }
          }
      },
  
      
      credits: {
          enabled: false
      },
      series: serie
  };

  var list: any = this.listaDetalle;

  for (let index = 0; index < list.length; index++) {
    const element = list[index]; 
    var fecha = new Date(list[index].fecha); 
    let objSerieTiempo = {
      idSerieTiempoElemento: 0,
      idSerieTiempoDetalle: 0,
      idTipoFormato: 461,
      valor: list[index].valor,
      fecha: list[index].fecha,
      idFlag: list[index].idFlagObservacion, 
      flagObservacion: list[index].flagObservacion,
      dia: fecha.getDay(),
      anio: fecha.getFullYear(),
      mes: fecha.getMonth() + 1,
      hora:
        fecha.getHours() +
        ':' +
        fecha.getMinutes() +
        ':' +
        fecha.getSeconds(),
    };

  }

 }



obtenerPorFrecuencia(idfrecuencia:any){


  if(idfrecuencia.value){
    this.serviciosParametrosService
    .obtenerPorId(idfrecuencia.value)
    .subscribe((response1) => {
  
      this.parametroLista = response1;
  
    this.serviciosParametrosService
    .obtenerListaParametros()
    .subscribe((response) => {
  
    console.log(45644,response);
      this.listParametroOrgin  =  response.filter((element => element.idCategoria == response1.idCategoria)).map((elemento: any) => ({
        id: elemento.idParametro,
        text: elemento.descripcion+'-'+elemento.nombreTipoParametro ,
        idOrigen: elemento.codigoOrigen,
        disabled: elemento.activo == 'S' ? false : true,
      }));
    });
  
  
    this.idfrecuencia = this.parametroLista.idPeriodo;
  
    });

  }

 
}


validarSerie(newSerie: any) {
  for (let index = 0; index < this.datosFilter.length; index++) {
    // Validar Estacion
    if (
      // validar parametro
      this.datosFilter[index].fecha.getTime() == newSerie.fecha.getTime() &&
      this.datosFilter[index].valor == newSerie.valor
      // validar fechas
    ) {
      this.toast.fire({
        icon: 'info',
        title: 'la Serie de tiempo ya se encuentra agregada',
      });

      return false;
    }
  }

  if (newSerie.idFlag == 0) {
    return false;
  }
  if (newSerie.valor == 0 || newSerie.valor == undefined) {
    return false;
  }
  if (newSerie.hora == 'NaN:NaN:NaN') {
    return false;
  }

  return true;
}

cancelar(){

  window.location.reload();
}
guardar() {
  if (this.datosFilter.length >= 2) {
   
      Swal.fire({
        title: 'Guardando...',
        html: 'Por favor espere',
        timer: 5000,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading();

          for (let index = 0; index < this.datosFilter.length; index++) {
            const element = this.datosFilter[index];
            this.datosFilter[index].idSerieTiempoElemento =
              this.idSerieTiempo;
          }

          console.log('Guardando ', this.datosFilter);

          this.serviciosSerieTiempoService
            .crearDetalle(this.datosFilter)
            .subscribe((response) => {
              Swal.close();
            });
        },
        willClose: () => {
        

        },
      }).then((result) => {});

  } else {
 
  }
}
calcularFechas(): Date | undefined {
  if (this.idfrecuencia == 155) {
    const fechass = this.fechaAno + '-01-01T05:04:30';
    // console.log(fechass)
    return (this.fechaObservacion = new Date(fechass));
  }
  if (this.idfrecuencia == 154) {
    const fechass = this.fechaMes + '-01T05:04:30';

    return (this.fechaObservacion = new Date(fechass));
  }
  if (this.idfrecuencia == 151 || this.idfrecuencia == 152) {
    return (this.fechaObservacion = new Date(this.fecha));
  }

  return new Date();
}

agregarLista() {
  this.calcularFechas();
  let objSerieTiempo = {
    idSerieTiempoElemento: this.idSerieTiempo,
    idSerieTiempoDetalle: 0,
    idTipoFormato: 461,
    valor: this.valor,
    fecha: this.fechaObservacion,
    idFlag: this.flag,
    dia: this.fechaObservacion.getDay(),
    anio: this.fechaObservacion.getFullYear(),
    mes: this.fechaObservacion.getMonth() + 1,
    hora:
      this.fechaObservacion.getHours() +
      ':' +
      this.fechaObservacion.getMinutes() +
      ':' +
      this.fechaObservacion.getSeconds(),
  };

  if (this.validarSerie(objSerieTiempo)) {
    this.datosFilter.push(objSerieTiempo);
  }
}

guardar4() {
  if (this.datosFilter.length >= 2) {
   
      Swal.fire({
        title: 'Guardando...',
        html: 'Por favor espere',
        timer: 5000,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading();

          for (let index = 0; index < this.datosFilter.length; index++) {
            const element = this.datosFilter[index];
            this.datosFilter[index].idSerieTiempoElemento =
              this.idSerieTiempo;
          }

          console.log('Guardando ', this.datosFilter);

          this.serviciosSerieTiempoService
            .crearDetalle(this.datosFilter)
            .subscribe((response) => {
              Swal.close();
            });
        },
        willClose: () => {
          this.toast.fire({
            icon: 'success',
            title: 'Se Creo  la Serie de tiempo ',
          });

          this.router.navigate(['/seriestiempo/consultarserie']);
        },
      }).then((result) => {});
    } else {
      // Eliminar

      Swal.fire({
        title: 'Guardando...',
        html: 'Por favor espere',
        timer: 5000,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading();
          this.serviciosSerieTiempoService
            .eliminarSerieDetalle(this.idSerieTiempo)
            .subscribe((response) => {
              console.log('llego', response);
              this.serviciosSerieTiempoService
                .crearDetalle(this.datosFilter)
                .subscribe((response) => {
                  Swal.close();
                });
            });
        },
        willClose: () => {
          this.toast.fire({
            icon: 'success',
            title: 'Se Actualizo la Serie de tiempo ',
          });

          this.router.navigate(['/analisisconsistencia/doblesmasas']);
        },
      }).then((result) => {});
    }
 
}

crearSerie() {

  var reques:any = {};

  this.verDetalle();

  
  if( this.listaAutocompletado.multiLista.length == 2){

        Swal.fire({
          title: 'Cargando información...',
          html: 'Por favor espere',
          allowOutsideClick: false, 
          showConfirmButton: false, 
          timerProgressBar: true,
          didOpen: async() => {

            var reques1:any = {
              activo : "S",
              codigoEaab : "",
              codigoIdeam  : "",
              fechaCreacion : "",
              fechaEstado: "",
              fechaModificacion: "",
              idElemento:  this.formularioConsulta.value.idElemento,
              idFrecuencia: this.formularioConsulta.value.frecuencia,
              idMecanismo:469,
              idParametroXElemento:this.listParametro.filter(filtro=> filtro.id == this.formularioConsulta.value.idParametro)[0].idPXE,
              idTipoRegistro: 464,
              usuarioCreacion: "",
              usuarioEstado: "",
              usuarioModificacion: "",
              idTipoElemento: "466",
              flagInsert: "",
              fechaInicio:  this.formularioConsulta.value.fechaInicio,
              fechaFin:   this.formularioConsulta.value.fechaFin,
            };
        

            this.serviciosSerieTiempoService
            .crearDobleMasas(reques1)
            .subscribe((response) => {
                 
                  if(!response){


                  }else{


                
                this.idSerieTiempo = response.idSerieTiempoElemento;
                  for (let  i = 0; i <  this.cantidad_1_1.length; i++) {
                    if(this.listaDetalle[i]){
                      var fecha;
                      if(this.idfrecuencia == 145){
                        
                      fecha = this.listaDetalle[i].fecha
                      }
                      if(this.idfrecuencia == 152 ){
                        fecha = this.listaDetalle[i].fecha
                      }
                      if(this.idfrecuencia == 154){
                        fecha =this.listaDetalle[i].fecha+ "/01"
                      }
                      if(this.idfrecuencia == 151){
                        fecha = this.listaDetalle[i].fecha 
                      }
                      if(this.idfrecuencia == 682){
                        fecha = this.listaDetalle[i].fecha
                      }
                      if(this.idfrecuencia == 683){
                        fecha = this.listaDetalle[i].fecha
                      }
                      if(this.idfrecuencia == 146){
                        fecha = this.listaDetalle[i].fecha
                      }

                     var   fecha1 = new Date(fecha); 
                        let objSerieTiempo = {
                          idSerieTiempoElemento: 0,
                          idSerieTiempoDetalle: 0,
                          idTipoFormato: 461,
                          idFlag: response.idSerieTiempoElemento, 
                          fecha:fecha1,
                          valor:this.cantidad_1_1[i][1],
                          flagObservacion:"Generado",
                          dia: fecha1.getDay(),
                          anio: fecha1.getFullYear(),
                          mes: fecha1.getMonth() + 1,
                          hora:
                            fecha1.getHours() +
                            ':' +
                            fecha1.getMinutes() +
                            ':' +
                            fecha1.getSeconds(),
                        };
                     
                        this.datosFilter.push(objSerieTiempo);

                         }
                      
                      }
                      this.guardar();

                      this.toast.fire({
                        icon: 'success',
                        title: 'Se guardo la serie de tiempo id  #' +this.idSerieTiempo,
                      });
            
                      window.location.reload();


                    }
              
            });
        
          },
          willClose: async() => {
            Swal.hideLoading();
          }
        });
         
       

       }

       if( this.listaAutocompletado.multiLista.length == 3){


        
        Swal.fire({
          title: 'Cargando información...',
          html: 'Por favor espere',
          allowOutsideClick: false, 
          showConfirmButton: false, 
          timerProgressBar: true,
          didOpen: async() => {
 
          this.idSerieTiempo;
          var datosFilter :any =[];
            var reques1:any = {
              activo : "S",
              codigoEaab : "",
              codigoIdeam  : "",
              fechaCreacion : "",
              fechaEstado: "",
              fechaModificacion: "",
              idElemento:  this.formularioConsulta.value.idElemento,
              idFrecuencia: this.formularioConsulta.value.frecuencia,
              idMecanismo:469,
              idParametroXElemento:this.listParametro.filter(filtro=> filtro.id == this.formularioConsulta.value.idParametro)[0].idPXE,
              idTipoRegistro: 464,
              usuarioCreacion: "",
              usuarioEstado: "",
              usuarioModificacion: "",
              idTipoElemento: "466",
              flagInsert: "",
              fechaInicio:  this.formularioConsulta.value.fechaInicio,
              fechaFin:   this.formularioConsulta.value.fechaFin,
            };
        

            this.serviciosSerieTiempoService
            .crearDobleMasas(reques1)
            .subscribe((response1) => {
                 
              var idSerieTiempo = response1.idSerieTiempoElemento;
                  for (let  i = 0; i <  this.cantidad_1_1.length; i++) {
                    if(this.listaDetalle[i]){
                      var fecha;
                      if(this.idfrecuencia == 145){
                        
                      fecha = this.listaDetalle[i].fecha
                      }
                      if(this.idfrecuencia == 152 ){
                        fecha = this.listaDetalle[i].fecha
                      }
                      if(this.idfrecuencia == 154){
                        fecha =this.listaDetalle[i].fecha+ "/01"
                      }
                      if(this.idfrecuencia == 151){
                        fecha = this.listaDetalle[i].fecha+':00Z';
                      }
                      if(this.idfrecuencia == 682){
                        fecha = this.listaDetalle[i].fecha
                      }
                      if(this.idfrecuencia == 683){
                        fecha = this.listaDetalle[i].fecha
                      }
                      if(this.idfrecuencia == 146){
                        fecha = this.listaDetalle[i].fecha
                      }
                      
                      var   fecha1 = new Date(fecha); 

                      let objSerieTiempo = {
                        idSerieTiempoDetalle: 0,
                        idTipoFormato: 461,
                        idFlag: response1.idSerieTiempoElemento, 
                        fecha:fecha1,
                        idSerieTiempoElemento :  idSerieTiempo,
                        valor:this.cantidad_1_1[i][1],
                        flagObservacion:"Generado",
                        dia: fecha1.getDay(),
                        anio: fecha1.getFullYear(),
                        mes: fecha1.getMonth() + 1,
                        hora:
                          fecha1.getHours() +
                          ':' +
                          fecha1.getMinutes() +
                          ':' +
                          fecha1.getSeconds(),
                      };
                   
                      datosFilter.push(objSerieTiempo);


                    
                    }
                  }

              
                   
              
                        this.serviciosSerieTiempoService
                          .crearDetalle(datosFilter)
                          .subscribe((response) => {


                            this.toast.fire({
                              icon: 'success',
                              title: 'Se guardo la serie de tiemopo id  #' + idSerieTiempo,
                            });
                  
                      


                      
                                this.idSerieTiempo;
                    
                                var datosFilter1 :any =[];
                                var reques2:any = {
                                  activo : "S",
                                  codigoEaab : "",
                                  codigoIdeam  : "",
                                  fechaCreacion : "",
                                  fechaEstado: "",
                                  fechaModificacion: "",
                                  idElemento:  this.formularioConsulta.value.idElemento,
                                  idFrecuencia: this.formularioConsulta.value.frecuencia,
                                  idMecanismo:469,
                                  idParametroXElemento:this.listParametro.filter(filtro=> filtro.id == this.formularioConsulta.value.idParametro)[0].idPXE,
                                  idTipoRegistro: 464,
                                  usuarioCreacion: "",
                                  usuarioEstado: "",
                                  usuarioModificacion: "",
                                  idTipoElemento: "466",
                                  flagInsert: "",
                                  fechaInicio:  this.formularioConsulta.value.fechaInicio,
                                  fechaFin:   this.formularioConsulta.value.fechaFin,
                                };
                            
                    
                                this.serviciosSerieTiempoService
                                .crearDobleMasas(reques2)
                                .subscribe((response2) => {
                                 
                                     
                                    var idSerieTiempo1 = response2.idSerieTiempoElemento;
                                      for (let  i = 0; i <  this.cantidad_2_2.length; i++) {
                                        if(this.listaDetalle[i]){
                                          var fecha;
                                          if(this.idfrecuencia == 145){
                                            
                                          fecha = this.listaDetalle[i].fecha
                                          }
                                          if(this.idfrecuencia == 152 ){
                                            fecha = this.listaDetalle[i].fecha
                                          }
                                          if(this.idfrecuencia == 154){
                                            fecha =this.listaDetalle[i].fecha+ "/01"
                                          }
                                          if(this.idfrecuencia == 151){
                                            fecha = this.listaDetalle[i].fecha+':00Z';
                                          }
                                          if(this.idfrecuencia == 682){
                                            fecha = this.listaDetalle[i].fecha
                                          }
                                          if(this.idfrecuencia == 683){
                                            fecha = this.listaDetalle[i].fecha
                                          }
                                          if(this.idfrecuencia == 146){
                                            fecha = this.listaDetalle[i].fecha
                                          }
                    
                                         var   fecha1 = new Date(fecha); 
                                            let objSerieTiempo = {
                                              idSerieTiempoDetalle: 0,
                                              idTipoFormato: 461,
                                              idFlag: response2.idSerieTiempoElemento, 
                                              fecha:fecha1,
                                              idSerieTiempoElemento : idSerieTiempo1,
                                              valor:this.cantidad_2_2[i][1],
                                              flagObservacion:"Generado",
                                              dia: fecha1.getDay(),
                                              anio: fecha1.getFullYear(),
                                              mes: fecha1.getMonth() + 1,
                                              hora:
                                                fecha1.getHours() +
                                                ':' +
                                                fecha1.getMinutes() +
                                                ':' +
                                                fecha1.getSeconds(),
                                            };
                                         
                                            datosFilter1.push(objSerieTiempo);
                    
                    
                                          
                                          }
                    
                                        }
                                    
                                         
                                    
                                              this.serviciosSerieTiempoService
                                                .crearDetalle(datosFilter1)
                                                .subscribe((response) => {
                                                  this.toast.fire({
                                                    icon: 'success',
                                                    title: 'Se guardo la serie de tiemopo id  #' + idSerieTiempo1,
                                                  });
                                        
                                        
                                                  window.location.reload();
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


       if( this.listaAutocompletado.multiLista.length == 4){


        
        Swal.fire({
          title: 'Cargando información...',
          html: 'Por favor espere',
          allowOutsideClick: false, 
          showConfirmButton: false, 
          timerProgressBar: true,
          didOpen: async() => {
 
          this.idSerieTiempo;
          var datosFilter :any =[];
            var reques1:any = {
              activo : "S",
              codigoEaab : "",
              codigoIdeam  : "",
              fechaCreacion : "",
              fechaEstado: "",
              fechaModificacion: "",
              idElemento:  this.formularioConsulta.value.idElemento,
              idFrecuencia: this.formularioConsulta.value.frecuencia,
              idMecanismo:469,
              idParametroXElemento:this.listParametro.filter(filtro=> filtro.id == this.formularioConsulta.value.idParametro)[0].idPXE,
              idTipoRegistro: 464,
              usuarioCreacion: "",
              usuarioEstado: "",
              usuarioModificacion: "",
              idTipoElemento: "466",
              flagInsert: "",
              fechaInicio:  this.formularioConsulta.value.fechaInicio,
              fechaFin:   this.formularioConsulta.value.fechaFin,
            };
        

            this.serviciosSerieTiempoService
            .crearDobleMasas(reques1)
            .subscribe((response1) => {
        
                 
              var idSerieTiempo = response1.idSerieTiempoElemento;
                  for (let  i = 0; i <  this.cantidad_1_1.length; i++) {
                    if(this.listaDetalle[i]){
                      var fecha;
                      if(this.idfrecuencia == 145){
                        
                      fecha = this.listaDetalle[i].fecha
                      }
                      if(this.idfrecuencia == 152 ){
                        fecha = this.listaDetalle[i].fecha
                      }
                      if(this.idfrecuencia == 154){
                        fecha =this.listaDetalle[i].fecha+ "/01"
                      }
                      if(this.idfrecuencia == 151){
                        fecha = this.listaDetalle[i].fecha+':00Z';
                      }
                      if(this.idfrecuencia == 682){
                        fecha = this.listaDetalle[i].fecha
                      }
                      if(this.idfrecuencia == 683){
                        fecha = this.listaDetalle[i].fecha
                      }
                      if(this.idfrecuencia == 146){
                        fecha = this.listaDetalle[i].fecha
                      }
                      var   fecha1 = new Date(fecha); 
                      let objSerieTiempo = {
                        idSerieTiempoDetalle: 0,
                        idTipoFormato: 461,
                        idFlag: response1.idSerieTiempoElemento, 
                        fecha:fecha1,
                        idSerieTiempoElemento :  idSerieTiempo,
                        valor:this.cantidad_1_1[i][1],
                        flagObservacion:"Generado",
                        dia: fecha1.getDay(),
                        anio: fecha1.getFullYear(),
                        mes: fecha1.getMonth() + 1,
                        hora:
                          fecha1.getHours() +
                          ':' +
                          fecha1.getMinutes() +
                          ':' +
                          fecha1.getSeconds(),
                      };
                   
                      datosFilter.push(objSerieTiempo);


                    
                    }


                  }
                   
              
                        this.serviciosSerieTiempoService
                          .crearDetalle(datosFilter)
                          .subscribe((response) => {


                            this.toast.fire({
                              icon: 'success',
                              title: 'Se guardo la serie de tiemopo id  #' + idSerieTiempo,
                            });
                  
                  
                            window.location.reload();


                      
                                this.idSerieTiempo;
                    
                                var datosFilter1 :any =[];
                                var reques2:any = {
                                  activo : "S",
                                  codigoEaab : "",
                                  codigoIdeam  : "",
                                  fechaCreacion : "",
                                  fechaEstado: "",
                                  fechaModificacion: "",
                                  idElemento:  this.formularioConsulta.value.idElemento,
                                  idFrecuencia: this.formularioConsulta.value.frecuencia,
                                  idMecanismo:469,
                                  idParametroXElemento:this.listParametro.filter(filtro=> filtro.id == this.formularioConsulta.value.idParametro)[0].idPXE,
                                  idTipoRegistro: 464,
                                  usuarioCreacion: "",
                                  usuarioEstado: "",
                                  usuarioModificacion: "",
                                  idTipoElemento: "466",
                                  flagInsert: "",
                                  fechaInicio:  this.formularioConsulta.value.fechaInicio,
                                  fechaFin:   this.formularioConsulta.value.fechaFin,
                                };
                            
                    
                                this.serviciosSerieTiempoService
                                .crearDobleMasas(reques2)
                                .subscribe((response2) => {
                                 
                                       this.verDetalle();
                                    var idSerieTiempo1 = response2.idSerieTiempoElemento;
                                      for (let  i = 0; i <  this.cantidad_2_2.length; i++) {
                                        if(this.listaDetalle[i]){
                                          var fecha;
                                          if(this.idfrecuencia == 145){
                                            
                                          fecha = this.listaDetalle[i].fecha
                                          }
                                          if(this.idfrecuencia == 152 ){
                                            fecha = this.listaDetalle[i].fecha
                                          }
                                          if(this.idfrecuencia == 154){
                                            fecha =this.listaDetalle[i].fecha+ "/01"
                                          }
                                          if(this.idfrecuencia == 151){
                                            fecha = this.listaDetalle[i].fecha+':00Z';
                                          }
                                          if(this.idfrecuencia == 682){
                                            fecha = this.listaDetalle[i].fecha
                                          }
                                          if(this.idfrecuencia == 683){
                                            fecha = this.listaDetalle[i].fecha
                                          }
                                          if(this.idfrecuencia == 146){
                                            fecha = this.listaDetalle[i].fecha
                                          }
                    
                                         var   fecha1 = new Date(fecha); 
                                            let objSerieTiempo = {
                                              idSerieTiempoDetalle: 0,
                                              idTipoFormato: 461,
                                              idFlag: response2.idSerieTiempoElemento, 
                                              fecha:fecha1,
                                              idSerieTiempoElemento : idSerieTiempo1,
                                              valor:this.cantidad_2_2[i][1],
                                              flagObservacion:"Generado",
                                              dia: fecha1.getDay(),
                                              anio: fecha1.getFullYear(),
                                              mes: fecha1.getMonth() + 1,
                                              hora:
                                                fecha1.getHours() +
                                                ':' +
                                                fecha1.getMinutes() +
                                                ':' +
                                                fecha1.getSeconds(),
                                            };
                                         
                                            datosFilter1.push(objSerieTiempo);
                    
                    
                                          
                                          }
                    
                    
                                        }
                                         
                                    
                                              this.serviciosSerieTiempoService
                                                .crearDetalle(datosFilter1)
                                                .subscribe((response) => {

                                                  this.toast.fire({
                                                    icon: 'success',
                                                    title: 'Se guardo la serie de tiemopo id  #' + idSerieTiempo1,
                                                  });
                                        
                                        
                                        
                      

                                                  this.idSerieTiempo;
                    
                                                  var datosFilter2 :any =[];
                                                  var reques3:any = {
                                                    activo : "S",
                                                    codigoEaab : "",
                                                    codigoIdeam  : "",
                                                    fechaCreacion : "",
                                                    fechaEstado: "",
                                                    fechaModificacion: "",
                                                    idElemento:  this.formularioConsulta.value.idElemento,
                                                    idFrecuencia: this.formularioConsulta.value.frecuencia,
                                                    idMecanismo:469,
                                                    idParametroXElemento:this.listParametro.filter(filtro=> filtro.id == this.formularioConsulta.value.idParametro)[0].idPXE,
                                                    idTipoRegistro: 464,
                                                    usuarioCreacion: "",
                                                    usuarioEstado: "",
                                                    usuarioModificacion: "",
                                                    idTipoElemento: "466",
                                                    flagInsert: "",
                                                    fechaInicio:  this.formularioConsulta.value.fechaInicio,
                                                    fechaFin:   this.formularioConsulta.value.fechaFin,
                                                  };
                                              
                                      
                                                  this.serviciosSerieTiempoService
                                                  .crearDobleMasas(reques3)
                                                  .subscribe((response3) => {
                                                   
                                                         this.verDetalle();
                                                      var idSerieTiempo2 = response3.idSerieTiempoElemento;
                                                        for (let  i = 0; i <  this.cantidad_3_3.length; i++) {
                                                          if(this.listaDetalle[i]){
                                                            var fecha;
                                                            if(this.idfrecuencia == 145){
                                                              
                                                            fecha = this.listaDetalle[i].fecha
                                                            }
                                                            if(this.idfrecuencia == 152 ){
                                                              fecha = this.listaDetalle[i].fecha
                                                            }
                                                            if(this.idfrecuencia == 154){
                                                              fecha =this.listaDetalle[i].fecha+ "/01"
                                                            }
                                                            if(this.idfrecuencia == 151){
                                                              fecha = this.listaDetalle[i].fecha+':00Z';
                                                            }
                                                            if(this.idfrecuencia == 682){
                                                              fecha = this.listaDetalle[i].fecha
                                                            }
                                                            if(this.idfrecuencia == 683){
                                                              fecha = this.listaDetalle[i].fecha
                                                            }
                                                            if(this.idfrecuencia == 146){
                                                              fecha = this.listaDetalle[i].fecha
                                                            }
                                      
                                                           var   fecha1 = new Date(fecha); 
                                                              let objSerieTiempo = {
                                                                idSerieTiempoDetalle: 0,
                                                                idTipoFormato: 461,
                                                                idFlag: response2.idSerieTiempoElemento, 
                                                                fecha:fecha1,
                                                                idSerieTiempoElemento : idSerieTiempo2,
                                                                valor:this.cantidad_3_3[i][1],
                                                                flagObservacion:"Generado",
                                                                dia: fecha1.getDay(),
                                                                anio: fecha1.getFullYear(),
                                                                mes: fecha1.getMonth() + 1,
                                                                hora:
                                                                  fecha1.getHours() +
                                                                  ':' +
                                                                  fecha1.getMinutes() +
                                                                  ':' +
                                                                  fecha1.getSeconds(),
                                                              };
                                                           
                                                              datosFilter2.push(objSerieTiempo);
                                      
                                      
                                                            
                                                            }
                                      
                                                          }
                                                      
                                                           
                                                      
                                                                this.serviciosSerieTiempoService
                                                                  .crearDetalle(datosFilter2)
                                                                  .subscribe((response) => {
                                                                    this.toast.fire({
                                                                      icon: 'success',
                                                                      title: 'Se guardo la serie de tiemopo id  #' + idSerieTiempo2,
                                                                    });
                                                          
                                                                    window.location.reload();
                                                                  });
                                                              
                                                              
                                      
                                      
                                                    
                                                    
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

       if( this.listaAutocompletado.multiLista.length == 5){


        
        Swal.fire({
          title: 'Cargando información...',
          html: 'Por favor espere',
          allowOutsideClick: false, 
          showConfirmButton: false, 
          timerProgressBar: true,
          didOpen: async() => {
 
          this.idSerieTiempo;
          var datosFilter :any =[];
            var reques1:any = {
              activo : "S",
              codigoEaab : "",
              codigoIdeam  : "",
              fechaCreacion : "",
              fechaEstado: "",
              fechaModificacion: "",
              idElemento:  this.formularioConsulta.value.idElemento,
              idFrecuencia: this.formularioConsulta.value.frecuencia,
              idMecanismo:469,
              idParametroXElemento:this.listParametro.filter(filtro=> filtro.id == this.formularioConsulta.value.idParametro)[0].idPXE,
              idTipoRegistro: 464,
              usuarioCreacion: "",
              usuarioEstado: "",
              usuarioModificacion: "",
              idTipoElemento: "466",
              flagInsert: "",
              fechaInicio:  this.formularioConsulta.value.fechaInicio,
              fechaFin:   this.formularioConsulta.value.fechaFin,
            };
        

            this.serviciosSerieTiempoService
            .crearDobleMasas(reques1)
            .subscribe((response1) => {
        
                 
              var idSerieTiempo = response1.idSerieTiempoElemento;
                  for (let  i = 0; i <  this.cantidad_1_1.length; i++) {
                    if(this.listaDetalle[i]){
                      var fecha;
                      if(this.idfrecuencia == 145){
                        
                      fecha = this.listaDetalle[i].fecha
                      }
                      if(this.idfrecuencia == 152 ){
                        fecha = this.listaDetalle[i].fecha
                      }
                      if(this.idfrecuencia == 154){
                        fecha =this.listaDetalle[i].fecha+ "/01"
                      }
                      if(this.idfrecuencia == 151){
                        fecha = this.listaDetalle[i].fecha+':00Z';
                      }
                      if(this.idfrecuencia == 682){
                        fecha = this.listaDetalle[i].fecha
                      }
                      if(this.idfrecuencia == 683){
                        fecha = this.listaDetalle[i].fecha
                      }
                      if(this.idfrecuencia == 146){
                        fecha = this.listaDetalle[i].fecha
                      }
                      var   fecha1 = new Date(fecha); 
                      let objSerieTiempo = {
                        idSerieTiempoDetalle: 0,
                        idTipoFormato: 461,
                        idFlag: response1.idSerieTiempoElemento, 
                        fecha:fecha1,
                        idSerieTiempoElemento :  idSerieTiempo,
                        valor:this.cantidad_1_1[i][1],
                        flagObservacion:"Generado",
                        dia: fecha1.getDay(),
                        anio: fecha1.getFullYear(),
                        mes: fecha1.getMonth() + 1,
                        hora:
                          fecha1.getHours() +
                          ':' +
                          fecha1.getMinutes() +
                          ':' +
                          fecha1.getSeconds(),
                      };
                   
                      datosFilter.push(objSerieTiempo);


                    
                    }

                  }
              
                   
              
                        this.serviciosSerieTiempoService
                          .crearDetalle(datosFilter)
                          .subscribe((response) => {


                            this.toast.fire({
                              icon: 'success',
                              title: 'Se guardo la serie de tiemopo id  #' + idSerieTiempo,
                            });


                      
                                this.idSerieTiempo;
                    
                                var datosFilter1 :any =[];
                                var reques2:any = {
                                  activo : "S",
                                  codigoEaab : "",
                                  codigoIdeam  : "",
                                  fechaCreacion : "",
                                  fechaEstado: "",
                                  fechaModificacion: "",
                                  idElemento:  this.formularioConsulta.value.idElemento,
                                  idFrecuencia: this.formularioConsulta.value.frecuencia,
                                  idMecanismo:469,
                                  idParametroXElemento:this.listParametro.filter(filtro=> filtro.id == this.formularioConsulta.value.idParametro)[0].idPXE,
                                  idTipoRegistro: 464,
                                  usuarioCreacion: "",
                                  usuarioEstado: "",
                                  usuarioModificacion: "",
                                  idTipoElemento: "466",
                                  flagInsert: "",
                                  fechaInicio:  this.formularioConsulta.value.fechaInicio,
                                  fechaFin:   this.formularioConsulta.value.fechaFin,
                                };
                            
                    
                                this.serviciosSerieTiempoService
                                .crearDobleMasas(reques2)
                                .subscribe((response2) => {
                                 
                                       this.verDetalle();
                                    var idSerieTiempo1 = response2.idSerieTiempoElemento;
                                      for (let  i = 0; i <  this.cantidad_2_2.length; i++) {
                                        if(this.listaDetalle[i]){
                                          var fecha;
                                          if(this.idfrecuencia == 145){
                                            
                                          fecha = this.listaDetalle[i].fecha
                                          }
                                          if(this.idfrecuencia == 152 ){
                                            fecha = this.listaDetalle[i].fecha
                                          }
                                          if(this.idfrecuencia == 154){
                                            fecha =this.listaDetalle[i].fecha+ "/01"
                                          }
                                          if(this.idfrecuencia == 151){
                                               fecha = this.listaDetalle[i].fecha+':00Z';
                                          }
                                          if(this.idfrecuencia == 682){
                                            fecha = this.listaDetalle[i].fecha
                                          }
                                          if(this.idfrecuencia == 683){
                                            fecha = this.listaDetalle[i].fecha
                                          }
                                          if(this.idfrecuencia == 146){
                                            fecha = this.listaDetalle[i].fecha
                                          }
                    
                                         var   fecha1 = new Date(fecha); 
                                            let objSerieTiempo = {
                                              idSerieTiempoDetalle: 0,
                                              idTipoFormato: 461,
                                              idFlag: response2.idSerieTiempoElemento, 
                                              fecha:fecha1,
                                              idSerieTiempoElemento : idSerieTiempo1,
                                              valor:this.cantidad_2_2[i][1],
                                              flagObservacion:"Generado",
                                              dia: fecha1.getDay(),
                                              anio: fecha1.getFullYear(),
                                              mes: fecha1.getMonth() + 1,
                                              hora:
                                                fecha1.getHours() +
                                                ':' +
                                                fecha1.getMinutes() +
                                                ':' +
                                                fecha1.getSeconds(),
                                            };
                                         
                                            datosFilter1.push(objSerieTiempo);
                    
                    
                                          
                                          }
                    
                                        }
                                    
                                         
                                    
                                              this.serviciosSerieTiempoService
                                                .crearDetalle(datosFilter1)
                                                .subscribe((response) => {


                                                  this.toast.fire({
                                                    icon: 'success',
                                                    title: 'Se guardo la serie de tiemopo id  #' + idSerieTiempo1,
                                                  });
                                                  
                                                  this.idSerieTiempo;
                    
                                                  var datosFilter2 :any =[];
                                                  var reques3:any = {
                                                    activo : "S",
                                                    codigoEaab : "",
                                                    codigoIdeam  : "",
                                                    fechaCreacion : "",
                                                    fechaEstado: "",
                                                    fechaModificacion: "",
                                                    idElemento:  this.formularioConsulta.value.idElemento,
                                                    idFrecuencia: this.formularioConsulta.value.frecuencia,
                                                    idMecanismo:469,
                                                    idParametroXElemento:this.listParametro.filter(filtro=> filtro.id == this.formularioConsulta.value.idParametro)[0].idPXE,
                                                    idTipoRegistro: 464,
                                                    usuarioCreacion: "",
                                                    usuarioEstado: "",
                                                    usuarioModificacion: "",
                                                    idTipoElemento: "466",
                                                    flagInsert: "",
                                                    fechaInicio:  this.formularioConsulta.value.fechaInicio,
                                                    fechaFin:   this.formularioConsulta.value.fechaFin,
                                                  };
                                              
                                      
                                                  this.serviciosSerieTiempoService
                                                  .crearDobleMasas(reques3)
                                                  .subscribe((response3) => {
                                                   
                                                         this.verDetalle();
                                                      var idSerieTiempo2 = response3.idSerieTiempoElemento;
                                                        for (let  i = 0; i <  this.cantidad_3_3.length; i++) {
                                                          if(this.listaDetalle[i]){
                                                            var fecha;
                                                            if(this.idfrecuencia == 145){
                                                              
                                                            fecha = this.listaDetalle[i].fecha
                                                            }
                                                            if(this.idfrecuencia == 152 ){
                                                              fecha = this.listaDetalle[i].fecha
                                                            }
                                                            if(this.idfrecuencia == 154){
                                                              fecha =this.listaDetalle[i].fecha+ "/01"
                                                            }
                                                            if(this.idfrecuencia == 151){
                                                              fecha = this.listaDetalle[i].fecha+':00Z';
                                                            }
                                                            if(this.idfrecuencia == 682){
                                                              fecha = this.listaDetalle[i].fecha
                                                            }
                                                            if(this.idfrecuencia == 683){
                                                              fecha = this.listaDetalle[i].fecha
                                                            }
                                                            if(this.idfrecuencia == 146){
                                                              fecha = this.listaDetalle[i].fecha
                                                            }
                                      
                                                           var   fecha1 = new Date(fecha); 
                                                              let objSerieTiempo = {
                                                                idSerieTiempoDetalle: 0,
                                                                idTipoFormato: 461,
                                                                idFlag: response2.idSerieTiempoElemento, 
                                                                fecha:fecha1,
                                                                idSerieTiempoElemento : idSerieTiempo2,
                                                                valor:this.cantidad_3_3[i][1],
                                                                flagObservacion:"Generado",
                                                                dia: fecha1.getDay(),
                                                                anio: fecha1.getFullYear(),
                                                                mes: fecha1.getMonth() + 1,
                                                                hora:
                                                                  fecha1.getHours() +
                                                                  ':' +
                                                                  fecha1.getMinutes() +
                                                                  ':' +
                                                                  fecha1.getSeconds(),
                                                              };
                                                           
                                                              datosFilter2.push(objSerieTiempo);
                                      
                                      
                                                            
                                                            }
                                      
                                      
                                                      
                                                          }
                                                      
                                                                this.serviciosSerieTiempoService
                                                                  .crearDetalle(datosFilter2)
                                                                  .subscribe((response) => {


                                                                    this.toast.fire({
                                                                      icon: 'success',
                                                                      title: 'Se guardo la serie de tiemopo id  #' + idSerieTiempo2,
                                                                    }); 


                                                                    this.idSerieTiempo;
                    
                                                                    var datosFilter3 :any =[];
                                                                    var reques4:any = {
                                                                      activo : "S",
                                                                      codigoEaab : "",
                                                                      codigoIdeam  : "",
                                                                      fechaCreacion : "",
                                                                      fechaEstado: "",
                                                                      fechaModificacion: "",
                                                                      idElemento:  this.formularioConsulta.value.idElemento,
                                                                      idFrecuencia: this.formularioConsulta.value.frecuencia,
                                                                      idMecanismo:469,
                                                                      idParametroXElemento:this.listParametro.filter(filtro=> filtro.id == this.formularioConsulta.value.idParametro)[0].idPXE,
                                                                      idTipoRegistro: 464,
                                                                      usuarioCreacion: "",
                                                                      usuarioEstado: "",
                                                                      usuarioModificacion: "",
                                                                      idTipoElemento: "466",
                                                                      flagInsert: "",
                                                                      fechaInicio:  this.formularioConsulta.value.fechaInicio,
                                                                      fechaFin:   this.formularioConsulta.value.fechaFin,
                                                                    };
                                                                
                                                        
                                                                    this.serviciosSerieTiempoService
                                                                    .crearDobleMasas(reques4)
                                                                    .subscribe((response4) => {
                                                                     
                                                                           this.verDetalle();
                                                                        var idSerieTiempo4 = response4.idSerieTiempoElemento;
                                                                          for (let  i = 0; i <  this.cantidad_4_4.length; i++) {
                                                                            if(this.listaDetalle[i]){
                                                                              var fecha;
                                                                              if(this.idfrecuencia == 145){
                                                                                
                                                                              fecha = this.listaDetalle[i].fecha
                                                                              }
                                                                              if(this.idfrecuencia == 152 ){
                                                                                fecha = this.listaDetalle[i].fecha
                                                                              }
                                                                              if(this.idfrecuencia == 154){
                                                                                fecha =this.listaDetalle[i].fecha+ "/01"
                                                                              }
                                                                              if(this.idfrecuencia == 151){
                                                                                fecha = this.listaDetalle[i].fecha+':00Z';
                                                                              }
                                                                              if(this.idfrecuencia == 682){
                                                                                fecha = this.listaDetalle[i].fecha
                                                                              }
                                                                              if(this.idfrecuencia == 683){
                                                                                fecha = this.listaDetalle[i].fecha
                                                                              }
                                                                              if(this.idfrecuencia == 146){
                                                                                fecha = this.listaDetalle[i].fecha
                                                                              }
                                                        
                                                                             var   fecha1 = new Date(fecha); 
                                                                                let objSerieTiempo = {
                                                                                  idSerieTiempoDetalle: 0,
                                                                                  idTipoFormato: 461,
                                                                                  idFlag: response2.idSerieTiempoElemento, 
                                                                                  fecha:fecha1,
                                                                                  idSerieTiempoElemento : idSerieTiempo4,
                                                                                  valor:this.cantidad_4_4[i][1],
                                                                                  flagObservacion:"Generado",
                                                                                  dia: fecha1.getDay(),
                                                                                  anio: fecha1.getFullYear(),
                                                                                  mes: fecha1.getMonth() + 1,
                                                                                  hora:
                                                                                    fecha1.getHours() +
                                                                                    ':' +
                                                                                    fecha1.getMinutes() +
                                                                                    ':' +
                                                                                    fecha1.getSeconds(),
                                                                                };
                                                                             
                                                                                datosFilter3.push(objSerieTiempo);
                                                        
                                                        
                                                                              
                                                                              }
                                                        
                                                        
                                                                        
                                                                            }
                                                                        
                                                                                  this.serviciosSerieTiempoService
                                                                                    .crearDetalle(datosFilter3)
                                                                                    .subscribe((response) => {
                                                                                      this.toast.fire({
                                                                                        icon: 'success',
                                                                                        title: 'Se guardo la serie de tiemopo id  #' + idSerieTiempo4,
                                                                                      }); 
                                                                            
                                                                                      window.location.reload();  });
                                                                                
                                                                                
                                                        
                                                        
                                                                      
                                                                      
                                                                    });
                                                                  });
                                                              
                                                              
                                      
                                      
                                                    
                                                    
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


       if( this.listaAutocompletado.multiLista.length == 6){


        
        Swal.fire({
          title: 'Cargando información...',
          html: 'Por favor espere',
          allowOutsideClick: false, 
          showConfirmButton: false, 
          timerProgressBar: true,
          didOpen: async() => {
 
          this.idSerieTiempo;
          var datosFilter :any =[];
            var reques1:any = {
              activo : "S",
              codigoEaab : "",
              codigoIdeam  : "",
              fechaCreacion : "",
              fechaEstado: "",
              fechaModificacion: "",
              idElemento:  this.formularioConsulta.value.idElemento,
              idFrecuencia: this.formularioConsulta.value.frecuencia,
              idMecanismo:469,
              idParametroXElemento:this.listParametro.filter(filtro=> filtro.id == this.formularioConsulta.value.idParametro)[0].idPXE,
              idTipoRegistro: 464,
              usuarioCreacion: "",
              usuarioEstado: "",
              usuarioModificacion: "",
              idTipoElemento: "466",
              flagInsert: "",
              fechaInicio:  this.formularioConsulta.value.fechaInicio,
              fechaFin:   this.formularioConsulta.value.fechaFin,
            };
        

            this.serviciosSerieTiempoService
            .crearDobleMasas(reques1)
            .subscribe((response1) => {
        
                 
              var idSerieTiempo = response1.idSerieTiempoElemento;
                  for (let  i = 0; i <  this.cantidad_1_1.length; i++) {
             
                      var fecha;
                      if(this.idfrecuencia == 145){
                        
                      fecha = this.listaDetalle[i].fecha
                      }
                      if(this.idfrecuencia == 152 ){
                        fecha = this.listaDetalle[i].fecha
                      }
                      if(this.idfrecuencia == 154){
                        fecha =this.listaDetalle[i].fecha+ "/01"
                      }
                      if(this.idfrecuencia == 151){
                        fecha = this.listaDetalle[i].fecha+':00Z';
                      }
                      if(this.idfrecuencia == 682){
                        fecha = this.listaDetalle[i].fecha
                      }
                      if(this.idfrecuencia == 683){
                        fecha = this.listaDetalle[i].fecha
                      }
                      if(this.idfrecuencia == 146){
                        fecha = this.listaDetalle[i].fecha
                      }
                      var   fecha1 = new Date(fecha); 
                      let objSerieTiempo = {
                        idSerieTiempoDetalle: 0,
                        idTipoFormato: 461,
                        idFlag: response1.idSerieTiempoElemento, 
                        fecha:fecha1,
                        idSerieTiempoElemento :  idSerieTiempo,
                        valor:this.cantidad_1_1[i][1],
                        flagObservacion:"Generado",
                        dia: fecha1.getDay(),
                        anio: fecha1.getFullYear(),
                        mes: fecha1.getMonth() + 1,
                        hora:
                          fecha1.getHours() +
                          ':' +
                          fecha1.getMinutes() +
                          ':' +
                          fecha1.getSeconds(),
                      };
                   
                      datosFilter.push(objSerieTiempo);


                    
                    }


              
                   
              
                        this.serviciosSerieTiempoService
                          .crearDetalle(datosFilter)
                          .subscribe((response) => {


                            this.toast.fire({
                              icon: 'success',
                              title: 'Se guardo la serie de tiemopo id  #' + idSerieTiempo,
                            }); 


                      
                                this.idSerieTiempo;
                    
                                var datosFilter1 :any =[];
                                var reques2:any = {
                                  activo : "S",
                                  codigoEaab : "",
                                  codigoIdeam  : "",
                                  fechaCreacion : "",
                                  fechaEstado: "",
                                  fechaModificacion: "",
                                  idElemento:  this.formularioConsulta.value.idElemento,
                                  idFrecuencia: this.formularioConsulta.value.frecuencia,
                                  idMecanismo:469,
                                  idParametroXElemento:this.listParametro.filter(filtro=> filtro.id == this.formularioConsulta.value.idParametro)[0].idPXE,
                                  idTipoRegistro: 464,
                                  usuarioCreacion: "",
                                  usuarioEstado: "",
                                  usuarioModificacion: "",
                                  idTipoElemento: "466",
                                  flagInsert: "",
                                  fechaInicio:  this.formularioConsulta.value.fechaInicio,
                                  fechaFin:   this.formularioConsulta.value.fechaFin,
                                };
                            
                    
                                this.serviciosSerieTiempoService
                                .crearDobleMasas(reques2)
                                .subscribe((response2) => {
                            
                                    var idSerieTiempo1 = response2.idSerieTiempoElemento;
                                      for (let  i = 0; i <  this.cantidad_2_2.length; i++) {
                                 
                                          var fecha;
                                          if(this.idfrecuencia == 145){
                                            
                                          fecha = this.listaDetalle[i].fecha
                                          }
                                          if(this.idfrecuencia == 152 ){
                                            fecha = this.listaDetalle[i].fecha
                                          }
                                          if(this.idfrecuencia == 154){
                                            fecha =this.listaDetalle[i].fecha+ "/01"
                                          }
                                          if(this.idfrecuencia == 151){
                                            fecha = this.listaDetalle[i].fecha+':00Z';
                                          }
                                          if(this.idfrecuencia == 682){
                                            fecha = this.listaDetalle[i].fecha
                                          }
                                          if(this.idfrecuencia == 683){
                                            fecha = this.listaDetalle[i].fecha
                                          }
                                          if(this.idfrecuencia == 146){
                                            fecha = this.listaDetalle[i].fecha
                                          }
                    
                                         var   fecha1 = new Date(fecha); 
                                            let objSerieTiempo = {
                                              idSerieTiempoDetalle: 0,
                                              idTipoFormato: 461,
                                              idFlag: response2.idSerieTiempoElemento, 
                                              fecha:fecha1,
                                              idSerieTiempoElemento : idSerieTiempo1,
                                              valor:this.cantidad_2_2[i][1],
                                              flagObservacion:"Generado",
                                              dia: fecha1.getDay(),
                                              anio: fecha1.getFullYear(),
                                              mes: fecha1.getMonth() + 1,
                                              hora:
                                                fecha1.getHours() +
                                                ':' +
                                                fecha1.getMinutes() +
                                                ':' +
                                                fecha1.getSeconds(),
                                            };
                                         
                                            datosFilter1.push(objSerieTiempo);
                    
                    
                                          
                                          }
                    
                    
                                    
                                         
                                    
                                              this.serviciosSerieTiempoService
                                                .crearDetalle(datosFilter1)
                                                .subscribe((response) => {

                                                  this.toast.fire({
                                                    icon: 'success',
                                                    title: 'Se guardo la serie de tiemopo id  #' + idSerieTiempo1,
                                                  }); 
                                                  this.idSerieTiempo;
                    
                                                  var datosFilter3 :any =[];
                                                  var reques3:any = {
                                                    activo : "S",
                                                    codigoEaab : "",
                                                    codigoIdeam  : "",
                                                    fechaCreacion : "",
                                                    fechaEstado: "",
                                                    fechaModificacion: "",
                                                    idElemento:  this.formularioConsulta.value.idElemento,
                                                    idFrecuencia: this.formularioConsulta.value.frecuencia,
                                                    idMecanismo:469,
                                                    idParametroXElemento:this.listParametro.filter(filtro=> filtro.id == this.formularioConsulta.value.idParametro)[0].idPXE,
                                                    idTipoRegistro: 464,
                                                    usuarioCreacion: "",
                                                    usuarioEstado: "",
                                                    usuarioModificacion: "",
                                                    idTipoElemento: "466",
                                                    flagInsert: "",
                                                    fechaInicio:  this.formularioConsulta.value.fechaInicio,
                                                    fechaFin:   this.formularioConsulta.value.fechaFin,
                                                  };
                                              
                                      
                                                  this.serviciosSerieTiempoService
                                                  .crearDobleMasas(reques3)
                                                  .subscribe((response3) => {
                                                   
                                                         this.verDetalle();
                                                      var idSerieTiempo3 = response3.idSerieTiempoElemento;
                                                        for (let  i = 0; i <  this.cantidad_3_3.length; i++) {
                                                   
                                                            var fecha;
                                                            if(this.idfrecuencia == 145){
                                                              
                                                            fecha = this.listaDetalle[i].fecha
                                                            }
                                                            if(this.idfrecuencia == 152 ){
                                                              fecha = this.listaDetalle[i].fecha
                                                            }
                                                            if(this.idfrecuencia == 154){
                                                              fecha =this.listaDetalle[i].fecha+ "/01"
                                                            }
                                                            if(this.idfrecuencia == 151){
                                                              fecha = this.listaDetalle[i].fecha+':00Z';
                                                           }
                                                            if(this.idfrecuencia == 682){
                                                              fecha = this.listaDetalle[i].fecha
                                                            }
                                                            if(this.idfrecuencia == 683){
                                                              fecha = this.listaDetalle[i].fecha
                                                            }
                                                            if(this.idfrecuencia == 146){
                                                              fecha = this.listaDetalle[i].fecha
                                                            }
                                      
                                                           var   fecha1 = new Date(fecha); 
                                                              let objSerieTiempo = {
                                                                idSerieTiempoDetalle: 0,
                                                                idTipoFormato: 461,
                                                                idFlag: response2.idSerieTiempoElemento, 
                                                                fecha:fecha1,
                                                                idSerieTiempoElemento : idSerieTiempo3,
                                                                valor:this.cantidad_3_3[i][1],
                                                                flagObservacion:"Generado",
                                                                dia: fecha1.getDay(),
                                                                anio: fecha1.getFullYear(),
                                                                mes: fecha1.getMonth() + 1,
                                                                hora:
                                                                  fecha1.getHours() +
                                                                  ':' +
                                                                  fecha1.getMinutes() +
                                                                  ':' +
                                                                  fecha1.getSeconds(),
                                                              };
                                                           
                                                              datosFilter3.push(objSerieTiempo);
                                      
                                      
                                                            
                                                            }
                                      
                                      
                                                      
                                                           
                                                      
                                                                this.serviciosSerieTiempoService
                                                                  .crearDetalle(datosFilter3)
                                                                  .subscribe((response) => {

                                                                    this.toast.fire({
                                                                      icon: 'success',
                                                                      title: 'Se guardo la serie de tiemopo id  #' + idSerieTiempo3,
                                                                    }); 
                                                                    this.idSerieTiempo;
                    
                                                                    var datosFilter4 :any =[];
                                                                    var reques4:any = {
                                                                      activo : "S",
                                                                      codigoEaab : "",
                                                                      codigoIdeam  : "",
                                                                      fechaCreacion : "",
                                                                      fechaEstado: "",
                                                                      fechaModificacion: "",
                                                                      idElemento:  this.formularioConsulta.value.idElemento,
                                                                      idFrecuencia: this.formularioConsulta.value.frecuencia,
                                                                      idMecanismo:469,
                                                                      idParametroXElemento:this.listParametro.filter(filtro=> filtro.id == this.formularioConsulta.value.idParametro)[0].idPXE,
                                                                      idTipoRegistro: 464,
                                                                      usuarioCreacion: "",
                                                                      usuarioEstado: "",
                                                                      usuarioModificacion: "",
                                                                      idTipoElemento: "466",
                                                                      flagInsert: "",
                                                                      fechaInicio:  this.formularioConsulta.value.fechaInicio,
                                                                      fechaFin:   this.formularioConsulta.value.fechaFin,
                                                                    };
                                                                
                                                        
                                                                    this.serviciosSerieTiempoService
                                                                    .crearDobleMasas(reques4)
                                                                    .subscribe((response4) => {
                                                                     
                                                                           this.verDetalle();
                                                                        var idSerieTiempo4 = response4.idSerieTiempoElemento;
                                                                          for (let  i = 0; i <  this.cantidad_4_4.length; i++) {
                                                                     
                                                                              var fecha;
                                                                              if(this.idfrecuencia == 145){
                                                                                
                                                                              fecha = this.listaDetalle[i].fecha
                                                                              }
                                                                              if(this.idfrecuencia == 152 ){
                                                                                fecha = this.listaDetalle[i].fecha
                                                                              }
                                                                              if(this.idfrecuencia == 154){
                                                                                fecha =this.listaDetalle[i].fecha+ "/01"
                                                                              }
                                                                              if(this.idfrecuencia == 151){
                                                                                fecha = this.listaDetalle[i].fecha+':00Z';
                                                                              }
                                                                              if(this.idfrecuencia == 682){
                                                                                fecha = this.listaDetalle[i].fecha
                                                                              }
                                                                              if(this.idfrecuencia == 683){
                                                                                fecha = this.listaDetalle[i].fecha
                                                                              }
                                                                              if(this.idfrecuencia == 146){
                                                                                fecha = this.listaDetalle[i].fecha
                                                                              }
                                                        
                                                                             var   fecha1 = new Date(fecha); 
                                                                                let objSerieTiempo = {
                                                                                  idSerieTiempoDetalle: 0,
                                                                                  idTipoFormato: 461,
                                                                                  idFlag: response4.idSerieTiempoElemento, 
                                                                                  fecha:fecha1,
                                                                                  idSerieTiempoElemento : idSerieTiempo4,
                                                                                  valor:this.cantidad_4_4[i][1],
                                                                                  flagObservacion:"Generado",
                                                                                  dia: fecha1.getDay(),
                                                                                  anio: fecha1.getFullYear(),
                                                                                  mes: fecha1.getMonth() + 1,
                                                                                  hora:
                                                                                    fecha1.getHours() +
                                                                                    ':' +
                                                                                    fecha1.getMinutes() +
                                                                                    ':' +
                                                                                    fecha1.getSeconds(),
                                                                                };
                                                                             
                                                                                datosFilter4.push(objSerieTiempo);
                                                        
                                                        
                                                                              
                                                                              }
                                                        
                                                        
                                                                        
                                                                             
                                                                        
                                                                                  this.serviciosSerieTiempoService
                                                                                    .crearDetalle(datosFilter4)
                                                                                    .subscribe((response) => {


                                                                                      this.toast.fire({
                                                                                        icon: 'success',
                                                                                        title: 'Se guardo la serie de tiemopo id  #' + idSerieTiempo4,
                                                                                      });   


                                                                                      this.idSerieTiempo;
                    
                                                                                      var datosFilter5 :any =[];
                                                                                      var reques5:any = {
                                                                                        activo : "S",
                                                                                        codigoEaab : "",
                                                                                        codigoIdeam  : "",
                                                                                        fechaCreacion : "",
                                                                                        fechaEstado: "",
                                                                                        fechaModificacion: "",
                                                                                        idElemento:  this.formularioConsulta.value.idElemento,
                                                                                        idFrecuencia: this.formularioConsulta.value.frecuencia,
                                                                                        idMecanismo:469,
                                                                                        idParametroXElemento:this.listParametro.filter(filtro=> filtro.id == this.formularioConsulta.value.idParametro)[0].idPXE,
                                                                                        idTipoRegistro: 464,
                                                                                        usuarioCreacion: "",
                                                                                        usuarioEstado: "",
                                                                                        usuarioModificacion: "",
                                                                                        idTipoElemento: "466",
                                                                                        flagInsert: "",
                                                                                        fechaInicio:  this.formularioConsulta.value.fechaInicio,
                                                                                        fechaFin:   this.formularioConsulta.value.fechaFin,
                                                                                      };
                                                                                  
                                                                          
                                                                                      this.serviciosSerieTiempoService
                                                                                      .crearDobleMasas(reques5)
                                                                                      .subscribe((response5) => {
                                                                                       
                                                                                             this.verDetalle();
                                                                                          var idSerieTiempo5 = response5.idSerieTiempoElemento;
                                                                                            for (let  i = 0; i <  this.cantidad_5_5.length; i++) {
                                                                                       
                                                                                                var fecha;
                                                                                                if(this.idfrecuencia == 145){
                                                                                                  
                                                                                                fecha = this.listaDetalle[i].fecha
                                                                                                }
                                                                                                if(this.idfrecuencia == 152 ){
                                                                                                  fecha = this.listaDetalle[i].fecha
                                                                                                }
                                                                                                if(this.idfrecuencia == 154){
                                                                                                  fecha =this.listaDetalle[i].fecha+ "/01"
                                                                                                }
                                                                                                if(this.idfrecuencia == 151){
                                                                                                  fecha = this.listaDetalle[i].fecha+':00Z';
                                                                                                }
                                                                                                if(this.idfrecuencia == 682){
                                                                                                  fecha = this.listaDetalle[i].fecha
                                                                                                }
                                                                                                if(this.idfrecuencia == 683){
                                                                                                  fecha = this.listaDetalle[i].fecha
                                                                                                }
                                                                                                if(this.idfrecuencia == 146){
                                                                                                  fecha = this.listaDetalle[i].fecha
                                                                                                }
                                                                          
                                                                                               var   fecha1 = new Date(fecha); 
                                                                                                  let objSerieTiempo = {
                                                                                                    idSerieTiempoDetalle: 0,
                                                                                                    idTipoFormato: 461,
                                                                                                    idFlag: response5.idSerieTiempoElemento, 
                                                                                                    fecha:fecha1,
                                                                                                    idSerieTiempoElemento : idSerieTiempo5,
                                                                                                    valor:this.cantidad_5_5[i][1],
                                                                                                    flagObservacion:"Generado",
                                                                                                    dia: fecha1.getDay(),
                                                                                                    anio: fecha1.getFullYear(),
                                                                                                    mes: fecha1.getMonth() + 1,
                                                                                                    hora:
                                                                                                      fecha1.getHours() +
                                                                                                      ':' +
                                                                                                      fecha1.getMinutes() +
                                                                                                      ':' +
                                                                                                      fecha1.getSeconds(),
                                                                                                  };
                                                                                               
                                                                                                  datosFilter5.push(objSerieTiempo);
                                                                          
                                                                          
                                                                                                
                                                                                                }
                                                                          
                                                                          
                                                                                          
                                                                                               
                                                                                          
                                                                                                    this.serviciosSerieTiempoService
                                                                                                      .crearDetalle(datosFilter5)
                                                                                                      .subscribe((response) => {
                                                                                                        this.toast.fire({
                                                                                                          icon: 'success',
                                                                                                          title: 'Se guardo la serie de tiemopo id  #' +idSerieTiempo5,
                                                                                                        });
                                                                                              
                                                                                                        window.location.reload();
                                                                                                      });
                                                                                                  
                                                                                                  
                                                                          
                                                                          
                                                                                        
                                                                                        
                                                                                      });
                                                                                    });
                                                                                
                                                                                
                                                        
                                                        
                                                                      
                                                                      
                                                                    });
                                                                  });
                                                              
                                                              
                                      
                                      
                                                    
                                                    
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
     
  
  
}


cargarArchivo(event : any) {
  if ( event.target.files.length < 1 ) {
    console.error("--> El número de archivos solicitados NO es válido...");
    return;
  }

  this.totalRegistrosCargados = 0;
  this.totalRegistrosErrores = 0;
  this.arrayErrores = '';

  if ( 
    event.target.files[0].type != "text/csv" && 
    event.target.files[0].type != "text/plain" && 
    event.target.files[0].type != "application/vnd.ms-excel" ) {
    Swal.fire(
      'Validación',
      'El tipo de archivo no pudo ser cargado, solo se permiten tipos txt y csv.',
      'error'
    )
  } else {
    this.procesarArchivosService.valorExistente(event.target.files[0].name).subscribe(async result => {
      if ( result) {
        Swal.fire(
          'Validación',
          'El nombre del archivo ya existe',
          'error'
        );
      } else {
        const file = event.target.files[0];
        let reader = new FileReader();  
        reader.readAsText(event.target.files[0]);
        reader.onload = () => {
          Swal.fire({
            title: 'Cargando información...',
            html: 'Por favor espere',
            timerProgressBar: false,
            allowOutsideClick: false, 
            showConfirmButton: false,
            didOpen: () => {
              Swal.showLoading();
              let listArchivo = (<string>reader.result).split(/\r\n|\n/);
              this.cargarData(listArchivo);
              Swal.close();
            },
            willClose: () => {
              Swal.hideLoading();
            },
          })
        }
      }
    });
  }
}


  seleccionMapa(e: any) {
    // TO-DO
    console.log('seleccion respuesta', e);
    // this.latitud?.setValue(e.ubicacion.latitude);
    // this.longitud?.setValue(e.ubicacion.longitude);

    let features = e.seleccion.flat(1);

    let _cuenca = features.filter(
      (c: any) => c.idCapa === capasEnumDatos(capasEnum.Cuenca).id
    )[0]?.atributos;
    let _subcuenca = features.filter(
      (c: any) => c.idCapa === capasEnumDatos(capasEnum.Subcuenca).id
    )[0]?.atributos;
    let _microcuenca = features.filter(
      (c: any) => c.idCapa === capasEnumDatos(capasEnum.Microcuenca).id
    )[0]?.atributos;
    let codah = _cuenca.CODAH ?? '';
    let codzh = _cuenca.CODZH ?? '';
    let codszh = _cuenca.CODSZH ?? '';
    let codch = _cuenca.CODCH ?? '';
    let codsch = _subcuenca.CODSCH ?? '';
    let codmch = _microcuenca.CODMC ?? '';
    this.zonaHidrografica?.setValue(codzh);
    this.subZonaHidrografica?.setValue(codszh);
    this.cuenca?.setValue(codch);
    this.subcuenca?.setValue(codsch);
    this.microcuenca?.setValue(codmch);
  }

  clickMapa(event: any) {
    let valores =
      event.data
        .filter((f: any) => f.idCapa === capasEnumDatos(capasEnum.Embalses).id)
        ?.map((d: any) => d.atributos?.CODIGO_INTERNO_SISH)[0] ?? '';
    if (valores) {
      this.datosFilter = this.datosOriginal.filter(
        (f: any) => f.idEstacion === valores
      );
      console.log('datos filyttados', this.datosFilter);
    } else {
      this.datosFilter = this.datosOriginal;
    }
  }
async cargarData(data: string[]) {
  let archivo = (<HTMLInputElement> document.getElementById('inputFileServer'));
  let archivoEtiqueta = document.getElementById('archivoNombre');

  if ( null!=archivo && undefined!=archivo && null!=archivoEtiqueta && undefined!=archivoEtiqueta ) {
    archivoEtiqueta.innerHTML = archivo.value;
    this.archivoRuta = archivo.value;
  }
  
  this.totalRegistrosEsperados = 0;

  this.datosObservacionList = [];
  let linea;
  data.splice(0,1);

  let fechas : String[] = [];
  
  let consec = 0;
  let nLinea = 0;
  data.forEach(element => {
    ++nLinea;
    if ( undefined!=element && null!=element && element.length>0 ) {
      linea = element.split(this.separadorCampos);

      if ( null==linea || undefined==linea || linea.length<1 ) {
        this.arrayErrores += "--> Error al procesar la línea: " + nLinea + ' con valor: [' + element + ']. Revisar separadores y formatos de los datos. Separador esperado: [' + this.separadorCampos + ']. Formato fecha esperado: [' + this.formatoFechaHora + '].\n';

      } else {
        const miValor = null!=linea && undefined!=linea && linea.length>1 ? this.convertirADecimal(linea[this.posValor]) : null;
        const miFecha = null!=linea && undefined!=linea && linea.length>1 ? this.convertirAFecha(linea[this.posFecha], fechas) : null;
        this.totalRegistrosEsperados++;
        
        if ( null!=miValor && null!=miFecha ) {

          let myObject = {
            idParametroPorPozo: null,
            idParametroXEstacion: null,
            idParametroXEmbalse: null, 

            fecha: miFecha,
            valor: miValor,
            fechaCargue: this.convertirFechaAUTC(new Date()),
            //usuarioCargue: this.usuario,
            idTipoOrigenObservacion: 262,
            origen: 'origen ' + consec,
            idEstadoObservacion: 266,
            idFlagObservacion: this.fmrCargueArchivo.value.flagObservacion,
            // idCriterioCalidad: , 
            // observacioneCalidad: ,
            flagInsert: true,
            flagExistente: false
          };

          this.datosObservacionList.push(myObject);
          consec++;
        } else {
          this.arrayErrores += "--> Error al procesar la línea: " + nLinea + ' con valor: [' + element + ']. Revisar separadores y formatos de los datos. Separador esperado: [' + this.separadorCampos + ']. Formato fecha esperado: [' + this.formatoFechaHora + '].\n';
        }
      }
    }
  });

  console.log("-- -------------------------");
  console.log("Observaciones a persistir...");
  console.log("-- -------------------------");
  this.datosObservacionList.forEach(observ => {
    console.info("---> Observacion: [Fecha: " + this.formatearFecha(observ.fecha) + ", Valor: " + observ.valor + "].");
  });
  console.log("-- -------------------------");
} 

formatearFecha(fecha : Date) : string {
  if ( null==fecha || undefined==fecha ) {
    return "";
  }

  let formato = [
    this.agregarCero(fecha.getFullYear()),
    this.agregarCero(fecha.getMonth() + 1),
    fecha.getDate()].join('-') + ' ' +
  [
    this.agregarCero(fecha.getHours()),
    this.agregarCero(fecha.getMinutes()),
    this.agregarCero(fecha.getSeconds())
  ].join(':');

  return formato;
}


convertirAFecha(cadena:String, fechas:String[]) : any {
  // Formato Esperado:
  // yyyy-MM-dd HH:mm:ss
  // Ejemplo: 2022-10-20 21:48:30

  if ( null==cadena || undefined==cadena ) {
    // console.error("--> Error al procesar la fecha: " + cadena + '.');
    this.arrayErrores += "--> Error al procesar la fecha: " + cadena + '.' + '\n';
    return null;
  }

  let result : Date;

  try {
    if ( !cadena.includes('-') || cadena.split('-').length<3 ) {
      console.error("--> Error al procesar la fecha: [" + cadena + ']. El formato de la fecha esperado es: [' + this.formatoFechaHora + ']');
      this.arrayErrores += "--> Error al procesar la fecha: [" + cadena + ']. El formato de la fecha esperado es: [' + this.formatoFechaHora + ']' + '\n';
      return null;
    }

    let fechaTokens = cadena.split("-");
    // 2022-10-20 21:48:30
    // fechaTokens[0] --> 2022
    // fechaTokens[1] --> 10
    // fechatokens[2] --> 20 21:48:30

    if ( !(fechaTokens[2].includes(" ")) || (fechaTokens[2].split(" ").length<2) ) {
      //console.error("--> Error al procesar la fecha: [" + cadena + ']. El formato esperado es: [' + this.formatoFechaHora + ']');
      this.arrayErrores += "--> Error al procesar la fecha: [" + cadena + ']. El formato esperado es: [' + this.formatoFechaHora + ']' + '\n';
      return null;
    }

    if ( !(fechaTokens[2].split(" ")[1].includes(":")) || (fechaTokens[2].split(" ")[1].split(':').length<3) ) {
      //console.error("--> Error al procesar la fecha: [" + cadena + ']. El formato de la hora debe ser: ' + this.formatoHora);
      this.arrayErrores += "--> Error al procesar la fecha: [" + cadena + ']. El formato de la hora debe ser: ' + this.formatoHora + '\n';
      return null;
    }

    let horaTokens = fechaTokens[2].split(" ")[1].split(":");
    // fechatokens[2] --> 20 21:48:30
    // horaTokens[0] --> 21
    // horaTokens[1] --> 48
    // horatokens[2] --> 30

    fechaTokens[2] = fechaTokens[2].split(" ")[0];
    // fechaTokens[0] --> 2022
    // fechaTokens[1] --> 10
    // fechatokens[2] --> 20

    // horaTokens[0] --> 21
    // horaTokens[1] --> 48
    // horatokens[2] --> 30

    let dia = +fechaTokens[2];
    if ( (null==dia) || !(dia>=1 && dia<=31) ) {
      //console.error("--> Error al procesar la fecha: [" + cadena + ']. Dia NO valido: ' + dia);
      this.arrayErrores += "--> Error al procesar la fecha: [" + cadena + ']. Dia NO valido: ' + dia + '.\n';
      return null;
    }

    let mes = +fechaTokens[1];
    if ( (null==mes) || !(mes>=1 && mes<=12) ) {
      // console.error("--> Error al procesar la fecha: [" + cadena + ']. Mes NO valido.');
      this.arrayErrores += "--> Error al procesar la fecha: [" + cadena + ']. Mes NO valido: ' + mes + '.\n';
      return null;
    }

    let ano = +fechaTokens[0];
    if ( (null==ano) || !(ano>=1900 && ano<=new Date().getFullYear()) ) {
      // console.error("--> Error al procesar la fecha: [" + cadena + ']. Año NO valido: ' + ano + '. Valores permitidos entre (1900 - ' + new Date().getFullYear() + ').');
      this.arrayErrores += "--> Error al procesar la fecha: [" + cadena + ']. Año NO valido: ' + ano + 'Valores permitidos entre (1900 - ' + new Date().getFullYear() + ').\n';
      return null;
    }

    let hora = +horaTokens[0];
    if ( (null==hora) || !(hora>=0 && hora<=23) ) {
      // console.error("--> Error al procesar la fecha: [" + cadena + ']. Hora NO valida: ' + hora);
      this.arrayErrores += "--> Error al procesar la fecha: [" + cadena + ']. Hora NO valida: ' + hora + '.\n';
      return null;
    }

    let min = +horaTokens[1];
    if ( (null==min) || !(min>=0 && min<=59) ) {
      // console.error("--> Error al procesar la fecha: [" + cadena + ']. Minuto NO valido: ' + min + '.');
      this.arrayErrores += "--> Error al procesar la fecha: [" + cadena + ']. Minuto NO valido: ' + min + '.\n';
      return null;
    }

    let seg = +horaTokens[2];
    if ( (null==seg) || !(seg>=0 && seg<=59) ) {
      // console.error("--> Error al procesar la fecha: [" + cadena + ']. Segundo NO valido: ' + seg + '.');
      this.arrayErrores += "--> Error al procesar la fecha: [" + cadena + ']. Segundo NO valido: ' + seg + '.\n';
      return null;
    }

    let utcDate = new Date(Date.UTC(ano, mes-1, dia, hora, min, seg));
    let localDate = new Date(ano, mes-1, dia, hora, min, seg);

    if ( localDate > new Date() ) {
      // console.error("--> Error al procesar la fecha: [" + cadena + ']. Fecha mayor a la actual (' + (this.formatearFecha(new Date())) + ').');
      this.arrayErrores += "--> Error al procesar la fecha: [" + cadena + ']. Fecha mayor a la actual (' + (this.formatearFecha(new Date())) + ').' + '\n';
      return null;
    }

    if ( fechas.includes(this.formatearFecha(utcDate)) ) {
      this.arrayErrores += "--> Error al procesar la fecha: [" + cadena + ']. La fecha YA se había procesado anteriormente.\n';
      return null;
    }
    fechas.push(this.formatearFecha(utcDate));

    result = utcDate;

  } catch (e) {
    // console.error("--> Error al procesar la fecha: [" + cadena + ']. Error: ' + e);
    this.arrayErrores += "--> Error al procesar la fecha: [" + cadena + ']. Error: ' + e + '\n';
    return null;
  }

  return result;
}


 downloadAsPDF() {
     
  const pdfTable = this.pdfTable.nativeElement;
  var html = htmlToPdfmake(pdfTable.innerHTML);

  var docDefinition = {
    content: [
      html            
    ]
  }
  pdfMake.createPdf(docDefinition).download(); 

   
}


agregarCero(dato : number) : string {
  if ( null==dato || undefined==dato ) {
    return "";
  }

  if ( dato < 10 ) {
    return '0' + dato;
  }

  return '' + dato;
}


convertirADecimal(cadena : String) : any {
  if ( null==cadena || undefined==cadena ) {
    // console.error("--> Error al procesar el valor decimal: " + cadena + '.');
    this.arrayErrores += "--> Error al procesar el valor decimal: " + cadena + '.\n';
    return null;
  }

  let result : Number;

  try {
    result = parseFloat(cadena.replace("\"", "").replace(",", "."));
  } catch(e) {
    // console.error("--> Error al procesar el valor decimal: " + cadena + '. Error: ' + e);
    this.arrayErrores += "--> Error al procesar el valor decimal: " + cadena + '. Error: ' + e + '\n';
    return null;
  }

  return result;
}

convertirFechaAUTC(fecha : Date) : any {
  if ( null==fecha || undefined==fecha ) {
    return null;
  }

  return new Date(Date.UTC(fecha.getFullYear(), fecha.getMonth(), fecha.getDate(), fecha.getHours(), fecha.getMinutes(), fecha.getSeconds()));
}

accionRegistro(e: any) {
  switch (e.accion) {

    case 'descargr': {
      let solitud = e.registro;
      const objStr = atob(solitud.consulta)
      console.log(objStr)
       const obj = JSON.parse(objStr)
    Swal.fire({
      title: 'Procesando...',
      html: 'Por favor espere',
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: async () => {
     

      

        this.ServiciosIdfs.prueba(obj).subscribe((Response) => {
          this.listObservaciones = Response;
          if(Response){

            Swal.close();

            setTimeout(() => {
              this.downloadAsPDF();
            },2000);
          
         
            
          }
        
       
        });
     

      }, willClose: async () => {
        Swal.hideLoading();
      }
    });

   
    
      break;
    }


 
    default: {
      //         break;
    }
  }
}

getBase64ImageFromURL(url: any) {
  return new Promise((resolve, reject) => {
    var img = new Image();
    img.setAttribute("crossOrigin", "anonymous");

    img.onload = () => {
      var canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      var ctx : any = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      var dataURL = canvas.toDataURL("image/png");

      resolve(dataURL);
    };

    img.onerror = error => {
      reject(error);
    };

    img.src = url;
  });
}


accionRegistroColumnas(e: any) {
  switch (e.accion) {
    case accionesTablasEnum.Eliminar: {
      var listaFinal = this.listaDetalle;
      var cars = listaFinal.filter(function(car:any) {
        return car.fecha !== e.registro.fecha; 
      });
      this.listaDetalle = [];
      this.listaDetalle = cars;

      var listaF:any = this.chartOptions1.series;
      var serie:any = [];
      var serie1:any = [];
      var serie2:any = [];
      var serie3:any = [];
      var serie4:any = [];
      var serie5:any = [];



      switch ( this.chartOptions1.series?.length) {

        // Estaciones
        case 2: {
          
          serie  = listaF[0]['data'].filter(function(car1:any) {
            return car1 !== e.registro.valorOrigen; 
          });
          serie1  = listaF[1]['data'].filter(function(car1:any) {
            return car1 !== e.registro.valor1; 
          });
      
          console.log(e.registro, listaF,serie,serie1);
          var series:any =[]
          series.push( 
            {  type: 'column',
               name:listaF[0]['name'],
              data:serie,
            },
            {  type: 'column',
               name:listaF[1]['name'],
              data:serie1,
            }
          );
          break;
        }
  
        // Embalses
        case 3: {
          serie  = listaF[0]['data'].filter(function(car1:any) {
            return car1 !== e.registro.valorOrigen; 
          });
          serie1  = listaF[1]['data'].filter(function(car1:any) {
            return car1 !== e.registro.valor1; 
          });
          serie2  = listaF[2]['data'].filter(function(car1:any) {
            return car1 !== e.registro.valor2; 
          })
      
          var series:any =[]
          series.push( 
            {  type: 'column',
               name:listaF[0]['name'],
              data:serie,
            },
            {  type: 'column',
               name:listaF[1]['name'],
              data:serie1,
            },
            {  type: 'column',
            name:listaF[2]['name'],
           data:serie2,
         }
          );
          break;
        }
  
        // Pozos
        case 4: {
          serie  = listaF[0]['data'].filter(function(car1:any) {
            return car1 !== e.registro.valorOrigen; 
          });
          serie1  = listaF[1]['data'].filter(function(car1:any) {
            return car1 !== e.registro.valor1; 
          });
          serie2  = listaF[2]['data'].filter(function(car1:any) {
            return car1 !== e.registro.valor2; 
          })
          serie3  = listaF[3]['data'].filter(function(car1:any) {
            return car1 !== e.registro.valor3; 
          })
          console.log(33,e.registro,serie,serie1,serie2,serie3);
          var series:any =[]
          series.push( 
            {  type: 'column',
               name:listaF[0]['name'],
              data:serie,
            },
            {  type: 'column',
               name:listaF[1]['name'],
              data:serie1,
            },
             {  type: 'column',
                name:listaF[2]['name'],
              data:serie2,
            },
            {  type: 'column',
            name:listaF[3]['name'],
           data:serie3,
         }
          );


          break;
        }

          case 5: {


          serie  = listaF[0]['data'].filter(function(car1:any) {
            return car1 !== e.registro.valorOrigen; 
          });
          serie1  = listaF[1]['data'].filter(function(car1:any) {
            return car1 !== e.registro.valor1; 
          });
          serie2  = listaF[2]['data'].filter(function(car1:any) {
            return car1 !== e.registro.valor2; 
          })
          serie3  = listaF[3]['data'].filter(function(car1:any) {
            return car1 !== e.registro.valor2; 
          })
          serie4  = listaF[4]['data'].filter(function(car1:any) {
            return car1 !== e.registro.valor4; 
          })
          console.log(33,e.registro,serie,serie1,serie2,serie3,serie4);
          var series:any =[]
          series.push( 
            {  type: 'column',
               name:listaF[0]['name'],
              data:serie,
            },
            {  type: 'column',
               name:listaF[1]['name'],
              data:serie1,
            },
             {  type: 'column',
                name:listaF[2]['name'],
              data:serie2,
            },
            {  type: 'column',
                name:listaF[3]['name'],
              data:serie3,
            },
            {  type: 'column',
            name:listaF[4]['name'],
           data:serie4,
         }
          );


          break;
        }

        case 6: {
          serie  = listaF[0]['data'].filter(function(car1:any) {
            return car1 !== e.registro.valorOrigen; 
          });
          serie1  = listaF[1]['data'].filter(function(car1:any) {
            return car1 !== e.registro.valor1; 
          });
          serie2  = listaF[2]['data'].filter(function(car1:any) {
            return car1 !== e.registro.valor2; 
          })
          serie3  = listaF[3]['data'].filter(function(car1:any) {
            return car1 !== e.registro.valor2; 
          })
          serie4  = listaF[4]['data'].filter(function(car1:any) {
            return car1 !== e.registro.valor4; 
          })
          serie5 = listaF[5]['data'].filter(function(car1:any) {
            return car1 !== e.registro.valor5; 
          })
          console.log(33,e.registro,serie,serie1,serie2,serie3);
          var series:any =[]
          series.push( 
            {  type: 'column',
               name:listaF[0]['name'],
              data:serie,
            },
            {  type: 'column',
               name:listaF[1]['name'],
              data:serie1,
            },
             {  type: 'column',
                name:listaF[2]['name'],
              data:serie2,
            },
            {  type: 'column',
                name:listaF[3]['name'],
              data:serie3,
            },
            {  type: 'column',
            name:listaF[4]['name'],
           data:serie4,
              },
              {  type: 'column',
              name:listaF[5]['name'],
              data:serie5,
            }
          );


          break;
        }

        default: {
          break;
        }
      }
     


      var llistaFecha=  this.categoriaFecha.filter(function(car1:any) {
        return car1 !== e.registro.fecha; 
      });
      this.categoriaFecha =   llistaFecha



 


    this.chartOptions1 = {
      chart: {
          type: 'column'
      },
      title: {
          text: this.nombreParametro
      },

      xAxis: {
          categories: this.categoriaFecha,
          title: {
              text: null
          }
      },
      yAxis: {
          min: 0,
          title: {
              text: this.nombreParametro,
              align: 'high'
          },
          labels: {
              overflow: 'justify'
          }
      },
      tooltip: {
          valueSuffix: '  '
      },
      plotOptions: {
          bar: {
              dataLabels: {
                  enabled: true
              }
          }
      },
  
      
      credits: {
          enabled: false
      },
      series: series
  };

   
    }
  
    
  }
}


cargar(){


    


   

 


  this.ServiciosIdfs
  .obtener()
  .subscribe((response) => {
    
    this.listaItemsElementos = response;

  });

  this.columnas = [ 
    { title:'id', data:'id' ,  disabled: true }, 
    { title:'Fecha de creación', data:'fecha_CREACION' ,  disabled: true }, 
    { title:'Nombre solcitante ', data:'nombre' ,  disabled: true }, 
    { title:'Correo de solcitante', data:'correo' ,  disabled: true }, 
    { title:'Nit/cc de solcitante', data:'identificacion' ,  disabled: true },

   ];
  var fecha = new Date(); //Fecha actual
  var mes: any = fecha.getMonth() + 1; //obteniendo mes
  var dia: any = fecha.getDate(); //obteniendo dia
  var ano: any = fecha.getFullYear();
  var hora: any = fecha.getHours();
  var minuto: any = fecha.getMinutes();
  var segundo: any = fecha.getSeconds();

  if (dia < 10) {
    dia = '0' + dia; //agrega cero si el menor de 10
  }
  if (mes < 10) {
    mes = '0' + mes;
  }

  this.fechaActual = dia + '-' + mes + '-' + ano;
  this.fechaActualMensual = mes + '-' + ano;
  this.fechaActualHora = ano + '-' + mes + '-' + dia+'T'+hora+':'+minuto;



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
};
  
  this.chartOptions1 = {
    chart: {
        type: 'column'
    },
    title: {
        text: ''
    },
  
    xAxis: {
        categories: ['Africa', 'America', 'Asia', 'Europe', 'Oceania'],
        title: {
            text: null
        }
    },
    yAxis: {
        min: 0,
        title: {
            text: '',
            align: 'high'
        },
        labels: {
            overflow: 'justify'
        }
    },
    tooltip: {
        valueSuffix: ' millions'
    },
    plotOptions: {
        bar: {
            dataLabels: {
                enabled: true
            }
        }
    },


    credits: {
        enabled: false
    },
    series: [ {
      type: 'column',
      name:'',
    },  {
      type: 'column',
      name:'',
    }, {
      type: 'column',
      name:'',
    }, {
      type: 'column',
      name:'',
    }, {
      type: 'column',
      name:'',
    }, {
      type: 'column',
      name:'',
    }
  ]
};
  this.construirFormulario();
}

}
