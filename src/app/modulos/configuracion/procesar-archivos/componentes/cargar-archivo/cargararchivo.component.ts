import { IObservacionesEstacion } from 'src/app/modelo/observaciones/observacionesEstacion';
import { ServiciosObservacionesEstacionService } from './../../../../observaciones/servicios-observaciones-estacion.service';
import { dominiosEnum } from './../../../../../modelo/enum/dominios-enum';
import { ServiciosDominiosValoresService } from './../../../dominios/servicios-dominios-valores.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { IArchivoDato } from 'src/app/modelo/configuracion/archivoDato';
import { IArchivo } from 'src/app/modelo/configuracion/archivo';
import { ICriterioValidacion } from 'src/app/modelo/configuracion/criterioValidacion';
import { ITipoArchivoColumna } from 'src/app/modelo/configuracion/tipoArchivoColumna';
import { ITipoArchivoConfigurado } from 'src/app/modelo/configuracion/tipoArchivoConfiguracion';
import { activo, tipoContenido, tipoDato } from 'src/app/modelo/enum/cargue-archivo-enum';
import { ProcesarArchivosService } from '../../servicios/procesar-archivos.sercevice';
import * as moment from 'moment';
import { ITipoArchivoCampo, ITipoArchivoCampoDTO } from 'src/app/modelo/configuracion/tipoArchivoColumnaCampo';
import Swal from 'sweetalert2';
import { ServiciosParametrosService } from 'src/app/modulos/parametros/servicios-parametros.service';
import { ServiciosParametrosEstacionesService } from 'src/app/modulos/elementos/estaciones/servicios-parametros-estaciones.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cargararchivo',
  templateUrl: './cargararchivo.component.html'
})
export class CargararchivoComponent implements OnInit {

  public porcentaje=0;
  public fmrCargueArchivo: FormGroup;
  public listaArchivosConfigurados:any=[]
  public barraProgreso = 0;
  public records: any[] = [];
  public configuracion:ITipoArchivoConfigurado;
  public arrayErrores:string;
  public inputHabilitado:boolean=false;
  public globalParametro:string='';
  public arrayIArchivo:IArchivo;
  public arrayIArchivoDato:IArchivoDato[];
  public rbTipoParametro: number = 2;
  public totalRegistrosCargados: number=0;
  public totalRegistrosErrores: number=0;
  public listParametro:any[]=[];
  public elemento: number = 1;
  public idParametro: number = 0;


  get ctrArchivoConfigurado() {
    return this.fmrCargueArchivo.get('ctrArchivoConfigurado');
  }

  get ctrEstaciones() {
    return this.fmrCargueArchivo.get('ctrEstaciones');
  }

   get ctrPozos() {
    return this.fmrCargueArchivo.get('ctrPozos');
  }

  get ctrEmbalses() {
    return this.fmrCargueArchivo.get('ctrEmbalses');
  }

  //Listas

  public listaTipoArchivoColumna:any=[];
  public listaTipoArchivoConfigurado=[];
  public listaEstaciones=[];
  public listaExpresiones:ICriterioValidacion[]=[];
  public listaArchivoCampo : IArchivoDato[]=[];
  public listaEmbalses=[];
  public listaPozos =[];
  public listTiposArchivoCampo:ITipoArchivoCampoDTO[]=[];
  public arrayResultado:Array<any>=[];
  public CodigoParametros: any = [];
  public NombresParametros: any = [];
  public idfrecuencia: number;
  public idElemento: number = 0;
  public listaflag: any = [];
  public id: string = '0';
  public ac: string = 'c';
  public te: string = '0';
  public flag: number = 0;
  public usuario = JSON.parse(sessionStorage.getItem('usuario') || '{}');
  public datosObservacionList: any[]=[];

  constructor(
    private formBuilder:FormBuilder, 
    private procesarArchivosService: ProcesarArchivosService ,
    private serviciosParametrosService: ServiciosParametrosService,
    private sercioparametrosestacion: ServiciosParametrosEstacionesService,
    private route: ActivatedRoute,
    private router: Router,
    private serviciosDominiosValoresService: ServiciosDominiosValoresService,
    private serviciosObservacionesEstacionService: ServiciosObservacionesEstacionService,
    ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.ac = this.route.snapshot.paramMap.get('ac')!;
    this.te = this.route.snapshot.paramMap.get('te')!;
    this.construirFormulario();
   
    this.procesarArchivosService.obtenerEstacion().subscribe(estaciones=>{
      this.listaEstaciones = estaciones;
    });
    //Lista que obtiene los pozos
    this.procesarArchivosService.obtenerPozosDTO().subscribe(pozos=>{   
      this.listaPozos = pozos;
    });
      //Lista que obtiene los embalse
      this.procesarArchivosService.obtenerEembalsesDTO().subscribe(embalses=>{   
        this.listaEmbalses = embalses;
      });
    //Lista Tipo archivo configurado
    this.procesarArchivosService.obtenerTipoArchioConfigurado().subscribe(tiposArchivos=>{      
      this.listaArchivosConfigurados = tiposArchivos;
    });
    //lista de expresiones regulares (nunca se muestra al usuario)
    this.procesarArchivosService.obtenerExpresiones().subscribe(tiposExpresiones=>{   
      this.listaExpresiones = tiposExpresiones;
    });
      // parametros
      this.serviciosParametrosService
      .obtenerValoresParametrosSelect2()
      .subscribe((response) => {
        this.listParametro = response;
      });

      if (this.ac != 'C') {
        
        this.serviciosDominiosValoresService
          .obtenerValoresPorIdDominio(dominiosEnum.FlagObservacion)
          .subscribe((response) => {
            this.listaflag = response;
          });
      } else {
       
        this.serviciosDominiosValoresService
          .obtenerValoresActivosPorIdDominio(dominiosEnum.FlagObservacion)
          .subscribe((response) => {
            this.listaflag = response;
          });
      }   
  }

  filtrarFrecuencias(frecuencia: number) {
    this.idParametro = 0;
    var elemento = this.NombresParametros.filter(function (
      list: any
    ) {
      return list.id == frecuencia;
    }
    );
    this.idfrecuencia = elemento[0].idPeriodo


  }

  test(){
    console.log(this.idElemento, this.idParametro);
    console.log(this.fmrCargueArchivo.value);
    // console.log(this.datosObservacionList);
    // console.log(this.listTiposArchivoCampo);
    // console.log(this.usuario);
    // console.log(this.fmrCargueArchivo.invalid);
    // console.log(this.rbTipoParametro);
    // let arregladoFinal:IObservacionesEstacion[]=[]
    // for(let i=0; i<this.datosObservacionList.length; i++){
    //   arregladoFinal.push(this.datosObservacionList[i])
    // }    
    // console.log(arregladoFinal);  
    
  }

  obtenerParametrosElemento(event: any){
    this.sercioparametrosestacion
          .obtenerListaParametros(event)
          .subscribe((response) => {
            console.log(response)

            this.NombresParametros = response.map((elemento: any) => ({
              id: elemento.idParametroXEstacion,
              text: elemento.descripcionParametro,
              idPeriodo: elemento.idPeriodo,
            }));

            this.CodigoParametros = response.map((elemento: any) => ({
              id: elemento.idParametroXEstacion,
              text: elemento.codigo,
              idPeriodo: elemento.idPeriodo,
            }));

            // filtrar  frecuencias por parametros
            // this.listaFrecuencia.forEach((list1: any) => {
            //   response.forEach((element: any) => {
            //     if (list1.id == element.idPeriodo) {
            //       this.newlistaFrecuencia.push(list1);
            //     }
            //   });
            // });

            // this.listaFrecuenciaXParametro = this.newlistaFrecuencia.filter(
            //   (valor: any, indice: any) => {
            //     return this.newlistaFrecuencia.indexOf(valor) === indice;
            //   }
            // );

          });
  }

  subirArchivo(){
    console.log("holas");
    
    Swal.fire({
      title: 'Cargando información...',
      html: 'Por favor espere',
      //timer: 2000,
      timerProgressBar: true,
      didOpen: async () => {
        Swal.showLoading();
        // this.procesarArchivosService.crearArchivo(this.arrayIArchivo).subscribe(resultado=>{
        //   let arrayDato = this.listaArchivoCampo.map(element=>{
        //     element.idArchivo= resultado.idArchivo;
        //     return  element;
        //   })
        //   this.procesarArchivosService.crearArchivoDato(arrayDato).subscribe(res=>{
        //     Swal.fire(
        //       'ok',
        //       'Almacenamiento finalizado!',
        //       'success'
        //     )
        //     Swal.hideLoading();
        //   });
        // });      
          
        switch (this.fmrCargueArchivo.value.rbTipoParametro) {     
          case "1":
            await this.datosObservacionList.map(
                (p: { [x: string]: any; idParametroElemento: any }) => {
                  // crear nueva propiedad de nombre Del Elemento
                  p[`idParametroXEstacion`] = p.idParametroElemento;
                  p[`idObservacionXEstacionInicial`] = p.idObservacionXElemento;
                  // remover la propiedad actual
                  delete p.idParametroElemento;
                  delete p.idObservacionXElemento;
                  // retornar el nuevo objeto
                  return p;
                }
              );
            // Estacion
            let arregladoFinal=[] as any
            for(let i=0; i<this.datosObservacionList.length; i++){
              if(this.datosObservacionList[i].idParametroXEstacion != null)
              {
                arregladoFinal.push(this.datosObservacionList[i])
              }
            }    

              await this.serviciosObservacionesEstacionService
              .creacionMasiva(arregladoFinal)
              .subscribe((Response) => {
                Swal.hideLoading();
                // this.toast.fire({
                //   icon: 'success',
                //   title:
                //     'se gurardaron ' +
                //     Response.length +
                //     ' Observaciones exitosamente!',
                // });
            this.router.navigate(['/configuracion/gestionObservaciones']);
          });
            break;
        

            case "2":
              this.datosObservacionList.map(
                  (p: { [x: string]: any; idParametroElemento: any }) => {
                    // crear nueva propiedad de nombre Del Elemento
                    p[`idParametroXEmbalse`] = p.idParametroElemento;
                    p[`idObservacionXEmbalseInicial`] = p.idObservacionXElemento;
                    // remover la propiedad actual
                    delete p.idParametroElemento;
                    delete p.idObservacionXElemento;
                    // retornar el nuevo objeto
                    return p;
                  }
                );
              // Estacion
              let arregladoFinal2=[] as any
              for(let i=0; i<this.datosObservacionList.length; i++){
                arregladoFinal2.push(this.datosObservacionList[i])
              }    
  
                await this.serviciosObservacionesEstacionService
                .creacionMasiva(arregladoFinal2)
                .subscribe((Response) => {
                  // this.toast.fire({
                  //   icon: 'success',
                  //   title:
                  //     'se gurardaron ' +
                  //     Response.length +
                  //     ' Observaciones exitosamente!',
                  // });
              this.router.navigate(['/configuracion/gestionObservaciones']);
            });
              break;

              case "3":
                this.datosObservacionList.map(
                    (p: { [x: string]: any; idParametroElemento: any }) => {
                      // crear nueva propiedad de nombre Del Elemento
                      p[`idParametroXPozo`] = p.idParametroElemento;
                      p[`idObservacionXPozoInicial`] = p.idObservacionXElemento;
                      // remover la propiedad actual
                      delete p.idParametroElemento;
                      delete p.idObservacionXElemento;
                      // retornar el nuevo objeto
                      return p;
                    }
                  );
                // Estacion
                let arregladoFinal3=[] as any
                for(let i=0; i<this.datosObservacionList.length; i++){
                  arregladoFinal3.push(this.datosObservacionList[i])
                }    
    
                  await this.serviciosObservacionesEstacionService
                  .creacionMasiva(arregladoFinal3)
                  .subscribe((Response) => {
                    // this.toast.fire({
                    //   icon: 'success',
                    //   title:
                    //     'se gurardaron ' +
                    //     Response.length +
                    //     ' Observaciones exitosamente!',
                    // });
                this.router.navigate(['/configuracion/gestionObservaciones']);
              });
                break;
          default:
            break;
        }
       
      },
      willClose: () => {
        // clearInterval();
      },
    }).then((result) => {
      Swal.hideLoading();      

    });   

 
    
  } 

  cargarArchivo(event:any) { 
  if (event.target.files.length > 0) { 
    if(event.target.files[0].type != "text/csv" && event.target.files[0].type != "text/plain" && event.target.files[0].type != "application/vnd.ms-excel" ) {
      Swal.fire(
        'Validación',
        'El tipo de archivo no pudo ser cargado, solo se permiten tipos txt y csv.',
        'error'
      )
    }else{    
    this.procesarArchivosService.valorExistente(event.target.files[0].name).subscribe(async result=>{
        if(result ==false){
          if (event.target.files.length > 0) {
            // await this.procesarArchivosService.obtenerTipoArchioConfiguradoPorId(Number(this.fmrCargueArchivo.value.ctrArchivoConfigurado)).subscribe(tipoConfiguracion=>{
              if(this.listTiposArchivoCampo.length == 0){
                await this.procesarArchivosService.obtenerTipoArchivoCampo(81).subscribe(archivoCampo=>{
                  this.listTiposArchivoCampo = archivoCampo;
                  this.fmrCargueArchivo.value.ctrArchivoConfigurado = 81;
                });
              }
            await this.procesarArchivosService.obtenerTipoArchioConfigurado().subscribe(tipoConfiguracion=>{
              
              this.configuracion = tipoConfiguracion;
                    
                      const file = event.target.files[0];
                      let reader = new FileReader();  
                      reader.readAsText(event.target.files[0]);
                      reader.onload = () => { 
                        
                        Swal.fire({
                          title: 'Cargando información...',
                          html: 'Por favor espere',
                          timerProgressBar: true,
                          timer: 10000,
                          didOpen: () => {
                            Swal.showLoading();
                            this.procesarArchivosService.obtenerTipoArchivoColumna(this.fmrCargueArchivo.value.ctrArchivoConfigurado).subscribe(columnas=>{
                              
                              let listArchivo = (<string>reader.result).split(/\r\n|\n/); 
                              this.cargarData(listArchivo)
                            
                            })
                            
                          },
                          willClose: () => {
                            Swal.hideLoading();
                          },
                        }).then((result) => {
                          
                          Swal.hideLoading();
                
                        });                
                    }        
                });   
                }
        }else{
          Swal.fire(
            'Validación',
            'El nombre del archivo ya existe',
            'error'
          )
        }
    });    
           
    } 
  }
    
  }   

  cargarDatos(listArchivo: any, headerLength: any, tipoArchivoColumna:ITipoArchivoColumna[], tipoConfiguracion:ITipoArchivoConfigurado, archivo:any): IArchivoDato[] {  
    this.arrayErrores = '';
    let dato:string;
    let fecha:string;
    this.arrayIArchivoDato = [];
    let listaArchivoDatoLocal:any =[];
    try{      
      for (let i = 1; i < listArchivo.length; i++) { 
        let datoArray =  (<string>listArchivo[i]).split(tipoConfiguracion.separador)
        if(datoArray!= null && datoArray[0] != ''){
              if(datoArray.length >= tipoArchivoColumna.length){
                  fecha = this.validarDatoFecha(tipoArchivoColumna.filter(res=>   res.idTipoDato==tipoDato.Fecha || res.idTipoDato==tipoDato.Fecha_Hora || res.idTipoDato==tipoDato.Hora), datoArray);
                  tipoArchivoColumna.filter(res=>   res.idTipoDato!=tipoDato.Fecha && res.idTipoDato!=tipoDato.Fecha_Hora && res.idTipoDato!=tipoDato.Hora).forEach(columna=>{
                    
                        dato =  datoArray[columna.numeroColumna-1];
                        if(columna.posicionInicial !=null && columna.posicionFinal!=null ){
                          dato = this.validacionAnchoFijo(columna, dato).trim();
                        }

                        if(tipoConfiguracion.separador == columna.separador && datoArray.length > headerLength){
                          dato = datoArray[columna.numeroColumna-1]+ columna.separador.toString() +datoArray[columna.numeroColumna];
                        }
                        if(this.validarTipoDato(dato, columna.idTipoDato)){
                          let fechaformateada = moment( new Date(fecha), "DD/mm/yyyy H:mm:ss");
                          let idParametro = this.listTiposArchivoCampo.filter(filtro=>{ return filtro.idTipoArchivoColumna==columna.idTipoArchivoColumna});
                          this.incluirElemento(fechaformateada, dato, listaArchivoDatoLocal, idParametro[0].idParametro);
                        }else{
                          this.arrayErrores = this.arrayErrores+"La columna "+ columna.numeroColumna +" de la fila "+i+ " no coincide con el tipo de dato: "+dato+' '+'\r\n'
                          
                        }                                
                   })       
              }else{
                this.arrayErrores = 'La cantidad de columnas no coincide con el tipo de configuración, fila: '+i+'\r\n'+ this.arrayErrores ;
                this.porcentaje = 0;
                break;
              }
              this.totalRegistrosErrores = this.arrayErrores.length;
          }         
            
          
      }     
      let fechaActual  = new Date().toJSON().slice(0,10);
      this.arrayIArchivo = {
        idArchivo:0,
        archivo : archivo.name,
        fechaProceso : fechaActual,
        idEstacion: this.fmrCargueArchivo.value.rbTipoParametro == "1" || "" ? this.fmrCargueArchivo.value.ctrEstaciones: null,
        idEmbalse: this.fmrCargueArchivo.value.rbTipoParametro == "2"? this.fmrCargueArchivo.value.ctrEmbalses: null,
        idPozo: this.fmrCargueArchivo.value.rbTipoParametro == "3" ? this.fmrCargueArchivo.value.ctrPozos: null,
        idTipoArchivoConfigurado: this.fmrCargueArchivo.value.ctrArchivoConfigurado,
        totalRegistrosCargados:this.totalRegistrosCargados,
        totalRegistrosLeidos: this.totalRegistrosCargados+this.totalRegistrosErrores,
        activo:activo.Si,
      }; 

      if(this.totalRegistrosCargados >0){
        this.porcentaje = 100;
        Swal.fire(
          'ok',
          'Registros validados con exito!',
          'success'
        )
      }else{
        this.porcentaje = 0;
        Swal.fire(
          'error',
          'No fue posible leer el archivo, valide la configuración.',
          'error'
        )
      }
     
      return listaArchivoDatoLocal;     
    }catch(e){
      console.log(e);
      this.porcentaje = 0;
      return [];
    }     
  }

  async cargarData(data: string[]){
    this.datosObservacionList=[]
    let observacionParametro;
    let observacionParametros: any={};
    data.splice(0,1);
    let consec = 0;
    data.forEach(element => {
      if (element[0] != null && element[0] != '') {
        observacionParametro = element.split(';')
        observacionParametros = {
          idObservacionXElemento: 0,
          idParametroElemento: this.idParametro,
          fecha: new Date(observacionParametro[2]),
          valor: Number(parseFloat(observacionParametro[1].toString().replace(/,/g, '.'))),
          idFlagObservacion: this.fmrCargueArchivo.value.idFlagObservacion,
          flagInsert: true,
          flagExistente: false,
          origen: 'origen ' + consec ,
          idEstadoObservacion: 266,
          idTipoOrigen: 262,
          activo: 'S',
          idTipoOrigenObservacion: 262,
          fechaCargue: null,
          fechaCreacion: null,
          fechaEstado: null,
          fechaModificacion: null,
          usuarioEstado: null,
          usuarioModificacion: null,
        }
        consec++;
      }     
      this.datosObservacionList.push(observacionParametros)
    });
    console.log(observacionParametros)

  }


  validarArchivo(event:any):boolean{
    if(this.fmrCargueArchivo.value.ctrArchivoConfigurado=="" ){ 
      Swal.fire(
        'Validación',
        'Seleccione el tipo de Archivo',
        'error'
      )
      return false;   
     
    }else{
      if(this.fmrCargueArchivo.value.ctrEstaciones=="" && this.fmrCargueArchivo.value.ctrPozos=="" && this.fmrCargueArchivo.value.ctrEmbalses=="") {

        Swal.fire(
          'Validación',
          'Seleccione el , pozo, embalse o estación',
          'error'
        )
        return false;
      }
      this.totalRegistrosCargados=0;
      this.totalRegistrosErrores=0; 
      
      return true;
    }

  }

  private incluirElemento(dateMomentObject: moment.Moment, dato: string, listaArchivoDatoLocal: any, idParametro:number) {

    let archivoDato: IArchivoDato = {
      idParametro: this.fmrCargueArchivo.value.ctrParametro,//idParametro,
      fecha: dateMomentObject.toDate(),
      valor: Number(dato),
      idArchivoDato: 0,
    };
    listaArchivoDatoLocal.push(archivoDato);
    this.totalRegistrosCargados = listaArchivoDatoLocal.length;
  }

  validarDatoFecha(tipoArchivoColumna:ITipoArchivoColumna[], datoArray:String[]){
    let fechaIntegrada='';
    let horaLocal='';
    let dato='';
    tipoArchivoColumna.forEach(iterable=>{
      dato = datoArray[iterable.numeroColumna -1].toString();
      if(iterable.posicionInicial !=null && iterable.posicionFinal!=null ){
        dato = this.validacionAnchoFijo(iterable, dato).trim();
      }
      switch(iterable.idTipoDato){
        case tipoDato.Fecha:
          if(this.validarExpresionFecha(iterable.idTipoDato, dato)){   
            if(horaLocal!=''){
              fechaIntegrada = dato+' '+horaLocal;
            }else{
              fechaIntegrada = dato;
            }         
           
          };
        break;
      case tipoDato.Hora:
          if(this.validarExpresion(iterable.idTipoDato, dato)){
            if(fechaIntegrada!=''){
              fechaIntegrada = fechaIntegrada +' '+ dato;
            }else{
              horaLocal = dato;
            }  
          };
        break;
      case tipoDato.Fecha_Hora:
        if(this.validarExpresion(iterable.idTipoDato, dato)){
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

  construirFormulario(){    
    this.fmrCargueArchivo = this.formBuilder.group({
      ctrArchivoConfigurado: [''],
      ctrEstaciones:[''],
      ctrPozos:[''],
      ctrEmbalses:[''],
      ctrParametro:[''],
      avatar: [null],
      archivo: new FormControl(''),
      rbTipoParametro:['1'],
      fechaInicio:[''],
      idParametro:[null],
      idFlagObservacion: [''],
    });
  }

  limpiarFormulario(){    
    this.fmrCargueArchivo = this.formBuilder.group({
      ctrEstaciones:[''],
      ctrPozos:[''],
      ctrEmbalses:[''],
      ctrParametro:[''],
    });
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

  validacionAnchoFijo(tipoArchivoColumna:ITipoArchivoColumna, dato:string){
      return dato.substring(tipoArchivoColumna.posicionInicial, tipoArchivoColumna.posicionFinal);
    
  }

  cambioParametro(e:any){
    switch(e.target.value){
      case 1: 
        this.rbTipoParametro = 1
        break;
      case 2:
        this.rbTipoParametro = 2
        break;
      case 3:
        this.rbTipoParametro = 3
        break;
      default:
        this.rbTipoParametro = 0
        break;
    }
  }

  cargarConfiguracionCampos(e:any){
    if(e!= ""){
      this.procesarArchivosService.obtenerTipoArchivoCampo(e).subscribe(archivoCampo=>{
        this.listTiposArchivoCampo = archivoCampo;
      });
    }  
  }

  isvalid(): boolean {
    if(this.fmrCargueArchivo.value.ctrArchivoConfigurado != '' && this.fmrCargueArchivo.value.ctrEstaciones!='' && this.listaArchivoCampo.length > 0){
       return false;
    }
  return true;
  }


}
