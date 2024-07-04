import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiciosAforoService } from '../servicios-aforo.service';
import * as XLSX from 'xlsx';
import { aforoArchivo, tipoAforo, tipoDato, tipoMedicion } from 'src/app/modelo/enum/cargue-archivo-enum';
import { ICriterioValidacion } from 'src/app/modelo/configuracion/criterioValidacion';
import { ITipoFormatoArchivo } from 'src/app/modelo/configuracion/tipoFormatoArchivo';
import { IAforo, IAforoDato } from 'src/app/modelo/configuracion/aforo';
import { subscribeOn } from 'rxjs/operators';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Component({
  selector: 'app-cargar-aforo',
  templateUrl: './cargar-aforo.component.html'
})
export class CargarAforoComponent implements OnInit {
  public listaTipoFormato=[];
  public fmrCargueAforo:FormGroup;
  public porcentaje=0;
  public totalRegistrosCargados:number=0;
  public totalRegistrosErrores:number=0;
  public arrayErrores:string;
  public contadorErrores=0;
  public data: any;
  public listaExpresiones:ICriterioValidacion[]=[];
  public listaFormatoArchivo:ITipoFormatoArchivo[]=[];
  public listAforoDato:IAforoDato[]=[];
  //public listAforoDato:any=[];
  public aforo:any;
  public fechaAforo:Date;
  get ctrTipoFormato(){
    return this.fmrCargueAforo.get('ctrTipoFormato');
  }

  constructor(private servicioAforo: ServiciosAforoService, private formBuilder:FormBuilder) { }

  ngOnInit(): void {
    this.construirFormulario(),
    this.servicioAforo.obtenerTipoFormatoSerieLista().subscribe(tipoFormatoSerie=>{
      this.listaTipoFormato = tipoFormatoSerie;
    });

    this.servicioAforo.obtenerTipoFormatoArchivo().subscribe(result=>{
      this.listaFormatoArchivo = result
    });

    this.servicioAforo.obtenerExpresiones().subscribe(expresiones=>{
      this.listaExpresiones = expresiones;
    });

  }

  validacionArchivo(archivo:any){
      let msj='';
      let resultado=true
      if(this.listaFormatoArchivo.length > 0){

        this.listaFormatoArchivo.forEach(element => {
          if(element.idTipoDato == tipoDato.Fecha){
            var date = new Date(archivo[element.posicion].w);
            if(isNaN(date.getTime())){
              msj =  'error en la celda '+ element.posicion+' '+element.mensajeError;       
              throw this.mostrarMensaje('Error', msj ,'error');
            }else{
              this.fechaAforo = date;
            }
          }else
          if(!this.validarTipoDato(archivo[element.posicion].w ,element.idTipoDato)){
            
            msj =  'error en la celda '+ element.posicion+' '+element.mensajeError;       
            throw this.mostrarMensaje('Error', msj ,'error');
          }
        });
        
      }else{
        this.mostrarMensaje('Error', 'no se parametrizaron los parametros del archivo' ,'error');
        resultado = false;

      }
      return resultado;
      
  }

  lecturaArchivo(){

  }

  validarTipoDato(dato:string, tipoContenidoDato:number){   
    switch(tipoContenidoDato){     
      case tipoDato.Texto:
        return this.validarExpresion(tipoContenidoDato, dato);
      case tipoDato.Fecha_Hora:
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

  construirFormulario() {
    this.fmrCargueAforo = this.formBuilder.group({
      ctrTipoFormato:['', Validators.required]
    })
  }

  onFileChange(evt: any) {
    const target : DataTransfer =  <DataTransfer>(evt.target);   
    let listaArchivoDatoLocal:any =[];
    if (target.files.length !== 1) {throw new Error('Cannot use multiple files');}
    if(target.files[0].type != "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"){
      Swal.fire(
        'Validación',
        'El tipo de archivo no pudo ser cargado, solo se permiten formato excel.',
        'error'
      )
    }else{  
      const reader: FileReader = new FileReader();
      reader.readAsBinaryString(target.files[0]);
      reader.onload = (e: any) => {
  
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
        const wsname : string = wb.SheetNames[1];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];
        let abscisaLocal:number=0;
        let profundidad:number=0;
        let VMV:number=0;
        let VM:number=0;
        let area:number=0;
        let caudal:number=0;
        
        this.data = (XLSX.utils.sheet_to_json(ws, { header: 1 }));
  
        //Validar archivo
        if(this.validacionArchivo(ws)){
          const inicioAbscisa = this.listaFormatoArchivo.filter(res=>res.enumerador== aforoArchivo.INICIOABSCISA)
          if(inicioAbscisa!=null){
            var inicio = Number(inicioAbscisa[0].posicion.substring(1,3));
            for(var i = inicio-1; i <  this.data.length; i++){
              //valida que la abscisa cuente con profundidad total
              if(this.data[i].length > 12 && this.data[i][2] == undefined){
                break;
              }
              else if(this.data[i].length > 12  && this.data[i][2] != undefined){
                    abscisaLocal = this.data[i][1];
                    profundidad = this.data[i][2];
                    VMV = this.data[i][9];
                    VM = this.data[i][10];
                    area = this.data[i][11];
                    caudal = this.data[i][12]
                    let aforoDato: IAforoDato={
                      abscisa: abscisaLocal,
                      profundidadTotal: profundidad,
                      profundidadObservada:this.data[i][3],
                      profundidadA:this.data[i][4],
                      numeroRevoluciones:this.data[i][5],
                      tiempo:this.data[i][6],
                      //Pendiente N
                      velocidad:this.data[i][8],
                      valorMV:VMV,                 
                      velocidadMedia: VM,
                      area: area,
                      caudalParcial:caudal ,
                      revoluciones:this.data[i][7],                      
                    }
                    this.listAforoDato.push(aforoDato);
                    
              }else{
                  let aforoDato: IAforoDato={
                    abscisa: abscisaLocal,
                    profundidadTotal: profundidad,
                    profundidadObservada:this.data[i][3],
                    profundidadA:this.data[i][4],
                    numeroRevoluciones:this.data[i][5],
                    tiempo:this.data[i][6],
                    //Pendiente N
                    velocidad:this.data[i][8],
                    valorMV:VMV,                 
                    velocidadMedia: VM,
                    area: area,
                    caudalParcial:caudal ,
                    revoluciones:this.data[i][7],                
                  }
                  this.listAforoDato.push(aforoDato);
              }
            }
          }else{
            this.mostrarMensaje('Error', 'Falla al realizar la lectura del archivo', 'error')
          }
             this.aforo ={
              adjunto:'',
              //aforador: ws[aforoArchivo.MOLINETE],
              codigoEAAB:'',
              codigoIDEAM:'',
              fecha: this.fechaAforo,
              horaFinal: this.fechaAforo,
              horaInicial: this.fechaAforo,
              idElemento: 1,
              idMetodoMedicion:tipoMedicion.SININFORMACION,
              idTipoAforo:tipoAforo.LIQUIDO, 
              idTipoElemento:4,
              nivelFinal:1,
              nivelInicial:1,
              nombreAforo:'FORMATO DE CALCULO PARA AFOROS DE CORRIENTES DE AGUA',
              nombreCorriente:'',
              observacion:'',
              observaciones:'', 
              anio:this.fechaAforo.getFullYear(),
              flagMigracion:'0',
              idAforoAforador:3,
              numeroAforo: 1,        
  
            }
            this.totalRegistrosCargados = this.listAforoDato.length;
            this.totalRegistrosCargados = this.listAforoDato.length;
            this.porcentaje = 100;
          
        };    
   
  
        };
    }
   
     
      

  }

  guardarAforo(){
    this.servicioAforo.guardarAforo(this.aforo).subscribe(resultado=>{
        if(resultado.idAforo != null && resultado.idAforo > 0 ){
          this.listAforoDato.forEach(afo=>{
              afo.idAforo = resultado.idAforo;
          })
          this.servicioAforo.guardarAforoDato(this.listAforoDato).subscribe(datos=>{
            if(datos.length>0){
              this.totalRegistrosCargados = 0;
              this.totalRegistrosCargados = 0;
              this.porcentaje = 0;
              this.listAforoDato=[];
              this.construirFormulario();
              this.mostrarMensaje('Proceso finalizado', 'Aforo creado', 'success');
            }
          });
        }
    });

  }

  mostrarMensaje(titulo:string, msj:string, logo:any){
    Swal.fire(
      titulo,
      msj,
      logo
    )
  }

  cancelar(){}
 

}
