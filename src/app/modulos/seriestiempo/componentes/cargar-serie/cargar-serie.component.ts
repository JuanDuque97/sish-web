import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { file } from 'jszip';
import * as moment from 'moment';
import { ICriterioValidacion } from 'src/app/modelo/configuracion/criterioValidacion';
import { ISerieTiempoCargueArchivo } from 'src/app/modelo/configuracion/serieTiempoCargueArchivo';
import { ISerieTiempoDetalle } from 'src/app/modelo/configuracion/serieTiempoDetalle';
import { ITipoFormatoSerie } from 'src/app/modelo/configuracion/tipoFormatoSerie';
import { ITipoFormatoSerieColumna } from 'src/app/modelo/configuracion/tipoFormatoSerieColumna';
import { activo, tipoDato } from 'src/app/modelo/enum/cargue-archivo-enum';
import { estado } from 'src/app/modelo/enum/cargue-serie-enum';
import Swal from 'sweetalert2';
import {  SeriesTiempoArchivos} from '../../servicios/series-tiempos.sercevice';
import {ConsultarSerieComponent } from '../consultar-serie/consultar-serie.component';


@Component({
  selector: 'app-cargar-serie',
  templateUrl: './cargar-serie.component.html'
})
export class CargarSerieComponent implements OnInit {

  @ViewChild(ConsultarSerieComponent, { static: true }) consultarSerie: ConsultarSerieComponent;
  public listaExpresiones:ICriterioValidacion[]=[];
  public listaTipoFormato=[];
  public fmrCargueSerie: FormGroup;
  public porcentaje=0;
  public totalRegistrosCargados: number=0;
  public totalRegistrosErrores: number=0;
  public arrayErrores:string;
  public configuracion:ITipoFormatoSerie;
  public configuracionColumnas:ITipoFormatoSerieColumna[];
  public listaSerieTiempoDetalle:ISerieTiempoDetalle[]=[];
  public serieTiempoCargueArchivos:ISerieTiempoCargueArchivo;
  public contadorErrores=0;
  get ctrTipoFormato() {
    return this.fmrCargueSerie.get('ctrTipoFormato');
  }
  constructor(private seriesTiempoArchivos:SeriesTiempoArchivos, private formBuilder:FormBuilder,) { }

  ngOnInit(): void {
    this.construirFormulario()
    this.seriesTiempoArchivos.obtenerTipoFormatoSerieLista().subscribe(tipoFormatoSerie=>{
      this.listaTipoFormato = tipoFormatoSerie;
    })

    this.seriesTiempoArchivos.obtenerExpresiones().subscribe(tiposExpresiones=>{   
      this.listaExpresiones = tiposExpresiones;
    });

    this.consultarSerie.cargarResultados();
  }


  construirFormulario(){    
    this.fmrCargueSerie = this.formBuilder.group({
      ctrTipoFormato: [''],
    });
  }

  cargarConfiguracionColumnas(event:any){
    if(event!= null && event!=""){
       this.seriesTiempoArchivos.obtenerTipoFormatoSerie().subscribe(resultado=>{
        this.configuracion = resultado.filter(function(tipoFormato){return tipoFormato.idTipoFormato == event})[0];
      });
      this.seriesTiempoArchivos.obtenerTipoFormatoSerieColumna(event).subscribe(resultado=>{
        if(resultado.length > 0){
          this.configuracionColumnas = resultado;
        }else{
          Swal.fire(
            'Error',
            'El tipo de formato no esta parametrizado',
            'error'
          )
          this.recargarComponente();
        }        
      });
    }
    
  }

  cargarArchivo(event:any) {
    if (event.target.files.length > 0) { 
      if(event.target.files[0].type != "text/csv" && event.target.files[0].type != "text/plain"){
        Swal.fire(
          'Validación',
          'El tipo de archivo no pudo ser cargado, solo se permiten formatos csv y txt.',
          'error'
        )
      }else{
        this.totalRegistrosCargados=0;
        this.totalRegistrosErrores=0;         
        const file = event.target.files[0];
        let reader = new FileReader(); 
  
        reader.readAsText(event.target.files[0]);
      
        reader.onload = () => { 
          Swal.fire({
            title: 'Cargando información...',
            html: 'Por favor espere',
            timerProgressBar: true,
            timer:10000,
            didOpen: () => {
              Swal.showLoading();
              let listArchivo = (<string>reader.result).split(/\r\n|\n/); 
              if(this.configuracion.contieneTitulo==activo.Si){
                listArchivo = listArchivo.splice(1,listArchivo.length);
                
              }                
              if(this.configuracion.contieneTitulo === activo.Si){
                let listaTitulos = this.cargarTitulos(listArchivo);  
                 this.cargarDatos(listArchivo, listaTitulos.length, this.configuracionColumnas,this.configuracion,file);  
                          
              }
              
            },
            willClose: () => {
              Swal.hideLoading();
            },
          }).then((result) => {
            
            Swal.hideLoading();
  
          });       
                   
        }
      }
      
    }
   }

   cargarDatos(listArchivo: any, headerLength: any, tipoArchivoColumna:ITipoFormatoSerieColumna[], tipoConfiguracion:ITipoFormatoSerie, archivo:any){  
    this.arrayErrores = '';
    let dato:string;
    let fecha:string;
    try{      
      for (let i = 1; i < listArchivo.length; i++) { 
        let datoArray =  (<string>listArchivo[i]).split(tipoConfiguracion.separador);
        if(datoArray!= null && datoArray[0] != ''){
          this.porcentaje = (i/listArchivo.length) *100;          
              if(datoArray.length >= tipoArchivoColumna.length){
                  fecha = this.validarDatoFecha(tipoArchivoColumna.filter(res=>   res.idTipoContenido==tipoDato.Fecha || res.idTipoContenido==tipoDato.Fecha_Hora || res.idTipoContenido==tipoDato.Hora), datoArray);
                  tipoArchivoColumna.filter(res=>   res.idTipoContenido!=tipoDato.Fecha && res.idTipoContenido!=tipoDato.Fecha_Hora && res.idTipoContenido!=tipoDato.Hora).forEach(columna=>{
                        dato = this.ingresoSerieTiempoDetalle(dato, datoArray, columna, tipoConfiguracion, headerLength, fecha, i);                                
                        
                        
                      });       
              }else{
                this.arrayErrores = 'La cantidad de columnas no coincide con el tipo de configuración, fila: '+i+'\r\n'+ this.arrayErrores ;
                break;
              }              
          }         
      }      
      this.serieTiempoCargueArchivos = {
        idElemento:0,
        idEstado: estado.Validado,
        idSerieTiempoCargueArchivo:0,
        idSerieTiempoElemento:0,
        nombreArchivo:archivo.name,
        totalRegistrosCargados: this.listaSerieTiempoDetalle.length - this.arrayErrores.length,
        totalRegistrosLeidos: this.listaSerieTiempoDetalle.length ,
        activo: activo.Si,
      }
      this.totalRegistrosCargados = this.listaSerieTiempoDetalle.length;
      this.totalRegistrosErrores = this.arrayErrores.length;
      
      this.porcentaje = 100;  
      Swal.fire(
        'ok',
        'Registros validados con exito!',
        'success'
      )
      return this.listaSerieTiempoDetalle;     
    }catch(e){
      this.porcentaje = 0;
      return [];
    }     
  }

  private ingresoSerieTiempoDetalle(dato: string, datoArray: string[], columna: ITipoFormatoSerieColumna, tipoConfiguracion: ITipoFormatoSerie, headerLength: any, fecha: string, i: number) {
    dato = datoArray[columna.numeroColumna - 1];
    if (columna.posicionInicial != null && columna.posicionFinal != null) {
      dato = this.validacionAnchoFijo(columna, dato).trim();
    }

    if (tipoConfiguracion.separador == columna.separador && datoArray.length > headerLength) {
      dato = datoArray[columna.numeroColumna - 1] + columna.separador.toString() + datoArray[columna.numeroColumna];
    }

    if (this.validarTipoDato(dato, columna.idTipoContenido)) {
      if (columna.numeroColumna == datoArray.length) {
        let fechaformateada:moment.Moment = moment(fecha, "DD/MM/YYYY HH:mm:ss");
        let serieTiempoDetalle: ISerieTiempoDetalle = {
          //idSerieTiempoDetalle: idParametro,
          fecha: fechaformateada.toDate(),
          valor: Number(datoArray[datoArray.length-1].replace(',','.')),
          hora: fechaformateada.toDate().getHours() +
          ':' +
          fechaformateada.toDate().getMinutes() +
          ':' +
          fechaformateada.toDate().getSeconds(),
          anio:fechaformateada.toDate().getFullYear(),
          mes:fechaformateada.toDate().getMonth()+1,
          dia:fechaformateada.toDate().getDay(),
          idFlag: 0,
          idTipoFormato: 0,
          idSerieTiempoElemento: 0,
          flagInsert: 1,
          idEstación: Number(dato[0])
        };
        this.listaSerieTiempoDetalle.push(serieTiempoDetalle);
      }
    } else {
      this.arrayErrores = this.arrayErrores + "La columna " + columna.numeroColumna + " de la fila " + i + " no coincide con el tipo de dato: " + dato + ' ' + '\r\n';
      this.contadorErrores = this.contadorErrores +1;
    }
    return dato;
  }

  guardarSerieTiempo(){
    
    Swal.fire({
      title: 'Cargando información...',
      html: 'Por favor espere',
      //timer: 2000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
        this.seriesTiempoArchivos.crearSerieDeTiempoAchivo(this.serieTiempoCargueArchivos).subscribe(resultado=>{
      
          let serieTiempoDetalle =this.listaSerieTiempoDetalle.map(element=>{
             element.idSerieTiempoCargueArchivo= resultado.idSerieTiempoCargueArchivo;
            return  element;
          })
          this.seriesTiempoArchivos.crearSerieDeTiempoDetalle(serieTiempoDetalle).subscribe(res=>{
            Swal.fire(
              'ok',
              'Almacenamiento finalizado!',
              'success'
            )
            this.recargarComponente();
            Swal.hideLoading();
          });
          
        });        
      },
      willClose: () => {
        clearInterval();
      },
    }).then((result) => {
      Swal.hideLoading();      

    });      
    
  }
  recargarComponente() {
    this.porcentaje = 0;
    this.totalRegistrosCargados = 0;
    this.totalRegistrosErrores = 0;
    this.arrayErrores = '';
    this.fmrCargueSerie.value.ctrTipoFormato = '';
    this.listaTipoFormato =[];
    this.consultarSerie.cargarResultados();
    this.seriesTiempoArchivos.obtenerTipoFormatoSerieLista().subscribe(tipoFormatoSerie => {
      this.listaTipoFormato = tipoFormatoSerie;
    });
  }

  validarArchivo(event:any){
    if(this.fmrCargueSerie.value.ctrTipoFormato==""){
      Swal.fire(
        'Validación',
        'Seleccione el tipo de formato',
        'error'
      )
      return false;
    }else{
      this.totalRegistrosErrores=0; 
      this.totalRegistrosCargados=0;   
      this.contadorErrores=0;
      return true;
    }

  }

  validarDatoFecha(tipoArchivoColumna:ITipoFormatoSerieColumna[], datoArray:String[]){
    let fechaIntegrada='';
    let horaLocal='';
    let dato='';
    tipoArchivoColumna.forEach(iterable=>{
      dato = datoArray[iterable.numeroColumna -1].toString();
      if(iterable.posicionInicial !=null && iterable.posicionFinal!=null ){
        //dato = this.validacionAnchoFijo(iterable, dato).trim();
      }
      switch(iterable.idTipoContenido){
        case tipoDato.Fecha:
          if(this.validarExpresionFecha(iterable.idTipoContenido, dato)){   
            if(horaLocal!=''){
              fechaIntegrada = dato+' '+horaLocal;
            }else{
              fechaIntegrada = dato;
            }         
           
          };
        break;
      case tipoDato.Hora:
          if(this.validarExpresion(iterable.idTipoContenido, dato)){
            if(fechaIntegrada!=''){
              fechaIntegrada =fechaIntegrada +' '+ dato;
            }else{
              horaLocal = dato;
            }  
          };
        break;
      case tipoDato.Fecha_Hora:
        if(this.validarExpresion(iterable.idTipoContenido, dato)){
          fechaIntegrada = dato;
        };
        break;
        default:
        break;
    }
    });
    
    return fechaIntegrada;
  }


  cargarTitulos(array: any) {  
    let titulos = (<string>array[0]).split(',');  
    let headerArray = [];  
    for (let j = 0; j < titulos.length; j++) {  
      headerArray.push(titulos[j]);  
    }  
    return headerArray;  
  }  

  validarTipoDato(dato:string, tipoContenidoDato:number){   
    switch(tipoContenidoDato){
     
      case tipoDato.Texto:
        return this.validarExpresion(241, dato);
      case tipoDato.Fecha:
        return this.validarExpresionFecha(tipoContenidoDato, dato);
      case tipoDato.Fecha_Hora:
        return this.validarExpresion(tipoContenidoDato, dato);
      case tipoDato.Hora:
        return this.validarExpresion(tipoContenidoDato, dato);
      case tipoDato.Decimal:
        return this.validarExpresion(tipoContenidoDato, dato);
      case tipoDato.NumeroEntero:
        return this.validarExpresion(tipoContenidoDato, dato);
      default:
        return false
    }
  }

  validarExpresion(tipoDato: number, dato:string){
    let resultado = this.listaExpresiones.filter(function(expresion){return expresion.idTipoDato == tipoDato})
    
    let criterio = new RegExp(resultado[0].criterioValidacion);
    return criterio.test(dato);
  }

  validarExpresionFecha(tipoDato: number, dato:string){
    let validacion=false
    let resultado = this.listaExpresiones.filter(function(expresion){return expresion.idTipoDato == tipoDato})
    resultado.forEach(ex=>{
      let criterio = new RegExp(ex.criterioValidacion);
      if(criterio.test(dato)) {
        validacion= true;
      }
    })
    return validacion
  }

  validacionAnchoFijo(tipoArchivoColumna:any, dato:string){
    return dato.substring(tipoArchivoColumna.posicionInicial, tipoArchivoColumna.posicionFinal);
  
}

isvalid(): boolean {
  if(this.fmrCargueSerie.value.ctrTipoFormato != '' && this.listaSerieTiempoDetalle.length > 0){
     return false;
  }
  return true;
}


}
