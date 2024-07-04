import { formatDate } from '@angular/common';
import { toBase64String } from '@angular/compiler/src/output/source_map';
import { Component, Inject, LOCALE_ID, OnInit ,ViewChild} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NumericDictionaryIteratee, String } from 'lodash';
import * as moment from 'moment';
import { estados } from 'src/app/common/utils/constantes';
import { IAforador, IAforo,  IAforoArchivo,  IAforoCalculo, IAforoDato, IAforoPunto, IAforoView } from 'src/app/modelo/configuracion/aforo';
import { Ihelice, IMolinete } from 'src/app/modelo/configuracion/molinete';
import { activo, aforoArchivo } from 'src/app/modelo/enum/cargue-archivo-enum';
import { dominiosEnum } from 'src/app/modelo/enum/dominios-enum';
import { ServiciosEmbalcesService } from 'src/app/modulos/elementos/embalses/servicios-embalses.service';
import { ServiciosParametrosEmbalseService } from 'src/app/modulos/elementos/embalses/servicios-parametros-embalse.service';
import { ServiciosEstacionesService } from 'src/app/modulos/elementos/estaciones/servicios-estaciones.service';
import { ServiciosParametrosEstacionesService } from 'src/app/modulos/elementos/estaciones/servicios-parametros-estaciones.service';
import { ServiciosParametrosPozosService } from 'src/app/modulos/elementos/pozos/servicios-parametros-pozos.service';
import { ServiciosPozosService } from 'src/app/modulos/elementos/pozos/servicios-pozos.service';
import { ServiciosSerieTiempoService } from 'src/app/modulos/seriestiempo/servicios/servicios-serie-tiempo.service';
import Swal from 'sweetalert2';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexFill,
  ApexTooltip,
  ApexXAxis,
  ApexLegend,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexYAxis
} from "ng-apexcharts";

export type ChartOptions = {
  series?: ApexAxisChartSeries | any;
  chart?: ApexChart | any;
  xaxis?: ApexXAxis | any;
  markers?: any | any; //ApexMarkers;
  stroke?: any | any;//ApexStroke;
  yaxis?: ApexYAxis | any;
  dataLabels?: ApexDataLabels | any;
  title?: ApexTitleSubtitle | any;
  legend?: ApexLegend | any;
  fill?: ApexFill | any;
  tooltip?: ApexTooltip | any;
};
import { ServiciosDominiosValoresService } from '../../../dominios/servicios-dominios-valores.service';
import { ServiciosAforoService } from '../servicios-aforo.service';
import { ServiciosMolineteService } from '../../molinetes/servicios-molinetes.service';


@Component({
  selector: 'app-guardar-aforo',
  templateUrl: './guardar-aforo.component.html', 
})
export class GuardarAforoComponent implements OnInit {


  
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  public verInfo = true;
  public ver = false;
  public id: string = '0';
  public ac: string = 'C';
  public te: string = '0';
  public idTipoCoordenadas:any;
  public formularioAforo!: FormGroup;
  public TipoAforo:number;
  public idAforoAforador:number;
  public nullNumber:number;
  public ancho:number;
  public radio:number;
  public perimetroMojado:number;
  public prof:number;
  public concecutivo:number;
  public fecha_:any;
  public elemento: number = 1;
  public idMoliente: number = 1;
  public Mecanismo: number;
  public listaElementos = [];
  public objEstacion:any = [];
    public listaElementosid = [];
  public idElemento: string = '0';
  public codigoEAAB:string='';
  public idTipoElemento: any;
  public idParametroXElemento: number;
  public listaCodigoEAAB: any = [];
  public listaCodigoIDEAM: any = [];
  public fechaObservacion: any;
  public Estacion: any;
  public listaNombreParametros: any = [];
  public NombresParametros: any = [];
  public listaFrecuenciaXParametro: any = [];
  public listaCodigoParametros: any = [];
  public CodigoParametros: any = [];
  public listaFrecuencia: any = [];
  public newlistaFrecuencia: any = [];
  public listaElemento: any = [];
  public listaflag: any = [];
  public select: any = [];
  public arrayHelices:Ihelice[]=[];
  public constanteB:number;
  public constanteM:number;
  public usuario = JSON.parse(sessionStorage.getItem('usuario') || '{}');
  public seleccionAforador: any=0;
  public idAforo: number;
  public entradManual: boolean = false;
  public tipoCoordenadaSelect: any=0;
  public listaTipoCoordenada: [];
  public listaEspejo:any= [];
  public listaMetodoMedicion:[];
  public listaAforador: [];
  public listaAforos:IAforo[]= [];
  public listaMolinetes:any=[];
  public listaHelices:any=[];
  public listaAbscisa = [] as any;
  public listaDato = [] as any;
  public listaAforoDato:any=[];
  // Aforo
  public aforoGeneral:IAforo;
  public punto: number = 1;
  public abscisa: number;
  public profundidadTotal: number;
  public profundidadObservada: number;
  public PA: number;
  public revoluciones: number;
  public tiempo: number;
  public N: number;
  public velocidad: number;
  public VMV: number;
  public velocidadMedia: number;
  public area: number;
  public caudalparcial: number;
  public value:'';
  public NR: number;
  public NR1: number;
  public ArchivoCargado:any='';
  public imagenCargada:any='';
  public caudalTotal:number=0;
  public velocidadMediaTotal:number=0;
  public areaTotal:number=0;
  public nivelTotal:number=0;

  public validadorAforo:boolean=true;
  public listaProfundidad:any[]=['Superficial','0.2', '0.4','0.6','0.8'];

  public slcNombreCorriente:any='';
  public sleFecha:any='';
  public sleHoraInicial:any='';
  public slcTipoElemento:any='';
  public slcTipoAforo:any='';
  public dateFrom: string =  "2016-10-01"
  public hourFrom: string =  "06:00"
  public slcEspejo:string = "484";
  visible=true;
  public listMeses: any = [
    { id: '00', text: 'Seleccione' },
    { id: '01', text: 'Enero' },
    { id: '02', text: 'Febrero' },
    { id: '03', text: 'Marzo' },
    { id: '04', text: 'Abril' },
    { id: '05', text: 'Mayo' },
    { id: '06', text: 'Junio' },
    { id: '07', text: 'Julio' },
    { id: '08', text: 'Agosto' },
    { id: '09', text: 'Septiembre' },
    { id: '10', text: 'Octubre' },
    { id: '11', text: 'Noviembre' },
    { id: '12', text: 'Diciembre' },
  ];
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

  get nombreCorriente(): any {
    return this.formularioAforo.get('nombreCorriente');
  }
  get idMecanismo(): any {
    return this.formularioAforo.get('idMecanismo');
  }

  get fecha(): any {
    return this.formularioAforo.get('fecha');
  }
  get horaInicial(): any {
    return this.formularioAforo.get('horaInicial');
  }
  get horaFinal(): any {
    return this.formularioAforo.get('horaFinal');
  }
  get nivelInicial(): any {
    return this.formularioAforo.get('nivelInicial');
  }
  get nivelFinal(): any {
    return this.formularioAforo.get('nivelFinal');
  }
  get Aforador(): any {
    return this.formularioAforo.get('aforador');
  }

  constructor(
    @Inject(LOCALE_ID) public locale: string,

    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private serviciosEstacionesService: ServiciosEstacionesService,
    private serviciosDominiosValoresService: ServiciosDominiosValoresService,
    private serviciosEmbalcesService: ServiciosEmbalcesService,
    private serviciosPozosService: ServiciosPozosService,
    private serviciosParametrosEmbalseService: ServiciosParametrosEmbalseService,
    private sercioparametrosestacion: ServiciosParametrosEstacionesService,
    private serviciosParametrosPozosService: ServiciosParametrosPozosService,
    private serviciosSerieTiempoService: ServiciosSerieTiempoService,
    private servicioAforo:ServiciosAforoService,
    private serviciosMolineteService:ServiciosMolineteService
  ) {}

  ngOnInit(): void {
    this.construirFormulario();
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.ac = this.route.snapshot.paramMap.get('ac')!;
    this.te = this.route.snapshot.paramMap.get('te')!;

    this.serviciosDominiosValoresService
      .obtenerValoresActivosPorIdDominio(dominiosEnum.tipoEspejo)
      .subscribe((response) => {
        this.listaEspejo = response;
        //this.slcEspejo="483"
      });

    // Tipo Elemento
    this.serviciosDominiosValoresService
      .obtenerValoresPorIdDominio(dominiosEnum.TipoElemento)
      .subscribe((response) => {
        this.listaElementos = response;

         
      });

      this.servicioAforo.obtenerAforadores().subscribe(aforadores=>{
        this.listaAforador = aforadores
      })

      // obtener lista de molinetes
     

      this.serviciosDominiosValoresService
      .obtenerValoresPorIdDominio(dominiosEnum.tipoMolinete)
      .subscribe((response) => {
        console.log(response);
        
        this.listaMolinetes = [response[2],response[3]];
      });

      this.serviciosDominiosValoresService
      .obtenerValoresActivosPorIdDominio(dominiosEnum.TipoCoordenadas)
      .subscribe((response) => {
        this.listaTipoCoordenada = response;
      });
   

    if (this.ac != 'C') {
      // Periodos
      this.serviciosDominiosValoresService
        .obtenerValoresPorIdDominio(dominiosEnum.Periodos)
        .subscribe((response) => {
          this.listaFrecuencia = response;
        });

      this.serviciosDominiosValoresService
        .obtenerValoresPorIdDominio(dominiosEnum.FlagObservacion)
        .subscribe((response) => {
          this.listaflag = response;
        });
    } else {
      // Periodos

      this.serviciosDominiosValoresService
        .obtenerValoresActivosPorIdDominio(dominiosEnum.Periodos)
        .subscribe((response) => {
          this.listaFrecuencia = response;
        });
      this.serviciosDominiosValoresService
        .obtenerValoresActivosPorIdDominio(dominiosEnum.FlagObservacion)
        .subscribe((response) => {
          this.listaflag = response;
        });
    }
    if (this.ac == 'V') {
      this.formularioAforo.disable();
    }

    this.serviciosDominiosValoresService
        .obtenerValoresActivosPorIdDominio(dominiosEnum.metodoMedicion)
        .subscribe((response) => {
          this.listaMetodoMedicion = response;
        });

    if (this.id != '0') {
      
      this.servicioAforo.obtenerAforo(this.id).subscribe((aforos:any)=>{
        let AforoLocal: IAforoView={
          idAforo:this.id,
          idTipoAforo:aforos[0].idTipoAforo,
          idTipoElemento:aforos[0].idTipoElemento,
          idElemento:aforos[0].idElemento,
          codigoEAAB:aforos[0].codigoEAAB,
          codigoIDEAM:aforos[0].codigoIDEAM,
          nombreCorriente:aforos[0].nombreCorriente,
         // nombreAforo:aforos[0].nombreAforo == undefined? '': aforos[0].nombreAforo,
          fecha: new Date(), //aforos[0].fecha,
          horaInicial:aforos[0].horaInicial,
          horaFinal:aforos[0].horaFinal,
          nivelInicial:aforos[0].nivelInicial,
          nivelFinal:aforos[0].nivelFinal,
          idMetodoMedicion:aforos[0].metodoMedicion,
          
          idAforoAforador:aforos[0].idAforoAforador,
         // observacion:aforos[0].observacion,
          observaciones:aforos[0].observaciones==undefined ? '': aforos[0].observaciones,
         // adjunto:aforos[0].adjunto,
          //flagMigracion:aforos[0].flagMigracion,
          //numeroAforo:aforos[0].numeroAforo,
          //anio:aforos[0].anio,
          //activo:aforos[0].activo,
          //caudalTotal:aforos[0].caudalTotal,
          //areaTotal:aforos[0].areaTotal,
          idMecanismo:aforos[0].idMecanismo,
          //idAforo:aforos[0].idAforo,
          aforador:aforos[0].nombre,
          coeficionte: '',
          constanteEquipo:'',
          ecuacion: '',
         
          idEquipo: '',
          idHelice: aforos[0].dataHelice,
          idMetodoM: '',
          latitud: aforos[0].latitud,
          
          longitud:aforos[0].longitud,
          norte: aforos[0].coordenadasX,
          este: aforos[0].coordenadasY,
          norteMayor: '',
          norteMenor: '',
          idTipoCoordenadas:aforos[0].idTipoCoordenadas,
          tipoCoordenadas:aforos[0].tipoCoordenadas,
          idespejo: aforos[0].espejoAgua =='Orilla Derecha'? 483 : 484,
          idMolinete: aforos[0].tipoCoretrometro,
          nombreElemento:aforos[0].nombreElemento,
          //numeroRevolucionesMax: aforos[0].numeroRevolucionesMax,
          //numeroRevolucionesMin: aforos[0].numeroRevolucionesMin,

        }

        this.formularioAforo.setValue(AforoLocal);
       
      
        this.obtenerInfoHelice(aforos[0].idHelice);
        this.idTipoCoordenadas = aforos[0].idTipoCoordenadas;

        this.servicioAforo.obtenerAforoDato(this.id).subscribe(datos=>{
          for (let index = 0; index < datos.length; index++) {
           var abscisa = (Math.round(datos[index].abscisa * 100) / 100).toFixed(1);
           var profundidadTotal = (Math.round(datos[index].profundidadTotal * 100) / 100).toFixed(3);
           var valorMV =  (Math.round(datos[index].valorMV * 100) / 100).toFixed(3);
           var area =  (Math.round(datos[index].area * 100) / 100).toFixed(3);
           var velocidadMedia =  (Math.round(datos[index].velocidadMedia * 100) / 100).toFixed(3);
           var caudalParcial =  (Math.round(datos[index].caudalParcial * 100) / 100).toFixed(3);

            let objAforo2 = { 
              abscisa:abscisa,
              profundidadTotal:profundidadTotal,
              VMV:valorMV,
              velocidadMedia:velocidadMedia,
              area: area,
              caudalparcial:caudalParcial,
            };

            var abscisa = (Math.round(datos[index].abscisa * 100) / 100).toFixed(1);
            var profundidadObservada =  (Math.round(datos[index].profundidadObservada * 100) / 100).toFixed(2);
            var profundidadA =  (Math.round(datos[index].profundidadA * 100) / 100).toFixed(3);
            var revoluciones =  (Math.round(datos[index].revoluciones * 100) / 100).toFixed(0);
            var tiempo =  (Math.round(datos[index].tiempo * 100) / 100).toFixed(0);
            var velocidad = (Math.round(datos[index].velocidad * 100) / 100).toFixed(1);

            let objAforo = {
              punto: index+1,
              abscisa: abscisa,
              profundidadObservada: profundidadObservada,
              PA: profundidadA,
              revoluciones:revoluciones,
              tiempo: tiempo,
              N: velocidad,
              velocidad: valorMV,
            };

            this.listaDato.push(objAforo2);
            this.listaAbscisa.push(objAforo);
          }
        });
    })
  }


  if (this.ac === 'v') {
     this.formularioAforo.disable();
  }




  }



  construirFormulario() {
    this.formularioAforo = this.formBuilder.group({
      idAforo: [0],
      idMecanismo: ['469', [Validators.required]],
      idTipoAforo:['481',[Validators.required]],
      idTipoElemento: ['', [Validators.required]],
      idElemento: [''],
      nombreCorriente: [''],
      fecha: ['', [Validators.required]],
      horaInicial: ['', [Validators.required]],
      horaFinal: ['', [Validators.required]],
      nivelInicial: ['', [Validators.required]],
      nivelFinal: ['', [Validators.required]],
      aforador: [''],
      idTipoCoordenadas: [''],
      tipoCoordenadas: [''],
      latitud: [''],
      longitud: [''],
      norte: [''],
      este: [''],
      idespejo: [''],
      idEquipo: [''],
      idMetodoM: [''],
      codigoEAAB:[''],
      codigoIDEAM:[''],
      idAforoAforador:[''],
      idMolinete:[''],
      idHelice: [''],
      constanteEquipo:[''],
      ecuacion:[''],
      norteMayor:[''],
      norteMenor:[''],
      coeficionte:[''],
      idMetodoMedicion:[''],
      observaciones: ['', [Validators.required]],
      nombreElemento:[],
    });
  }

  crearAforo() {
    if (this.validacionAforo()) {
      if (this.id === '0') {
        if (this.idMecanismo.value == 469) {
          this.cargarAforo(this.formularioAforo.value);
          
        } else {
          this.entradManual = false;
          console.log('enviando', this.idMecanismo);
        }
      } else {
        
      }
    }
  }

  validacionAforo(){
      if((
        this.formularioAforo.get('idTipoElemento')?.valid == true &&
        this.formularioAforo.get('idElemento')?.valid == true &&
        this.formularioAforo.get('horaFinal')?.valid == true &&
        this.formularioAforo.get('nivelFinal')?.valid == true &&
        this.formularioAforo.get('idAforoAforador')?.valid == true &&
        this.formularioAforo.get('fecha')?.valid == true &&
        this.formularioAforo.get('horaInicial')?.valid == true &&
        this.formularioAforo.get('nivelInicial')?.valid == true)
      ){
           this.validadorAforo = true;
          return true; 
        
        
              
      }else{
        this.validadorAforo = false;
        return false;        
      }    
  }

  crearAforoPunto(idAforo:number){
    let aforoPunto:IAforoPunto = {
      idAforo: Number(this.id),
      espejoAgua: '',
      idTipoCoordenadas:1,
      coordenadasX:1,
      coordenadasY:2,
      latitud:1,
      longitud:2,
      idMolinete:2,
      activo:'S',
    }

    this.servicioAforo.guardarAforoPunto(aforoPunto).subscribe(punto=>{
      console.log(punto);
    });
  }

  crearAforoDatos(aforoDatos:IAforoDato[]){
    this.servicioAforo.guardarAforoDato(aforoDatos).subscribe(resultadoDatos=>{
      console.log(resultadoDatos);
    });
  }
  datosAbscisas(){
    this.listaDato.forEach((item: { abscisa: any; area: any; caudalparcial: any; profundidadTotal: any; VMV: any; velocidadMedia: any; })=>{
          
      this.listaAbscisa.forEach((dato_: any)=>{

        let aforoAbscisa: IAforoDato = {
                abscisa: item.abscisa,
                area: item.area,
                caudalParcial: item.caudalparcial,
                numeroRevoluciones: dato_.revoluciones,
                profundidadA: dato_.PA,
                profundidadObservada: dato_.profundidadObservada,
                profundidadTotal: item.profundidadTotal,
                revoluciones: dato_.revoluciones,
                tiempo: dato_.tiempo,
                valorMV: item.VMV,
                velocidad: 2,
                velocidadMedia: item.velocidadMedia,
                idAforo: Number(this.id),
                activo:'S',
      };
      this.listaAforoDato.push(aforoAbscisa);
    
     
    
         
      });
    
    
  });

  console.log( this.listaAforoDato);
  }

  cargarAforo(modeloFormulario:any){
   
    if(modeloFormulario.horaFinal <= modeloFormulario.horaInicial ){
     
      this.toast.fire({
        icon: 'error',
        title: 'La hora final  debe ser igual o mayor a la hora inicial !! ',
      });
    }else{ 
    
      let idEstacion:number = this.formularioAforo.get('codigoIDEAM')?.value as number;
    this.serviciosEstacionesService.obtenerPorId(idEstacion).subscribe((response) => {
    
    this.objEstacion = response;
    if(modeloFormulario.idTipoElemento == "466" && this.formularioAforo.get('codigoEAAB')!= null && this.formularioAforo.get('codigoEAAB')?.value!=''){
      this.codigoEAAB = this.listaCodigoEAAB.find((x:any)=> x.id==this.formularioAforo.get('codigoEAAB')?.value).text;
    
    }
   
    let aforo:any={

      adjunto:'',
      //aforador: ws[aforoArchivo.MOLINETE],
      codigoEAAB:this.codigoEAAB,
      codigoIDEAM:this.objEstacion.codigoEstacionIdeam,
      fecha: new Date(modeloFormulario.fecha),
      horaFinal: new Date(modeloFormulario.fecha+' '+modeloFormulario.horaInicial),
      horaInicial: new Date(modeloFormulario.fecha +' '+modeloFormulario.horaFinal),
      idElemento: modeloFormulario.idElemento,
      idMetodoMedicion:modeloFormulario.idMetodoMedicion,// sin información 
      idTipoAforo:modeloFormulario.idTipoAforo, //481=Liquido,482=otro 
      idTipoElemento: modeloFormulario.idTipoElemento,
      nivelFinal: modeloFormulario.nivelFinal,
      nivelInicial: modeloFormulario.nivelInicial,
      nombreAforo:'FORMATO DE CALCULO PARA AFOROS DE CORRIENTES DE AGUA',
      nombreCorriente: modeloFormulario.nombreCorriente,
      observacion:'',
      observaciones:'', 
      anio: Number(modeloFormulario.fecha.substring(0,4)),
      flagMigracion:'0',
      idAforoAforador: modeloFormulario.idAforoAforador,
      numeroAforo:this.seleccionAforador,    
      activo: activo.Si  , 
      caudalTotal:0,
      areaTotal:0,
      estado:864,


    }

    
    this.servicioAforo
            .guardarAforo(aforo)
            .subscribe((response) => {
              if (response.idAforo != null &&  response.idAforo>= 0) {
                this.formularioAforo.get('idAforoAforador')?.disable();
                this.aforoGeneral = response;
                this.id=response.idAforo.toString();
                this.idAforo = response.idAforo;
                this.entradManual = true;
                this.toast.fire({
                  icon: 'success',
                  title:
                    'Aforo Creado Exitosamente!',
                });
                this.formularioAforo.get('nombreCorriente')?.disable();
                this.formularioAforo.get('horaInicial')?.disable();
                this.formularioAforo.get('nivelInicial')?.disable();
                this.formularioAforo.get('horaFinal')?.disable();
                this.formularioAforo.get('nivelFinal')?.disable();
                this.formularioAforo.get('fecha')?.disable();
               
                //this.formularioAforo.disable();
              }
            });
    
 
  });
    
}
  }

  guardarAforo(){

    if(this.listaDato.length <2){
      Swal.fire(
        'Aforo',
        'Se debe registrar un minimo de 2 abscisas.',
        'error'
      );
    }else{
      let espejo:string =  this.listaEspejo.find((x:any)=> x.id==this.formularioAforo.get('idespejo')?.value).text;
      let punto: IAforoPunto = {
        idAforo: Number(this.id),
        espejoAgua: espejo,
        idTipoCoordenadas:this.formularioAforo.get('idTipoCoordenadas')?.value,
        latitud:this.formularioAforo.get('latitud')?.value == '' ? 0:  this.formularioAforo.get('latitud')?.value,
        longitud:this.formularioAforo.get('longitud')?.value == '' ? 0:  this.formularioAforo.get('longitud')?.value,
        coordenadasX:this.formularioAforo.get('norte')?.value == '' ? 0:  this.formularioAforo.get('norte')?.value,
        coordenadasY:this.formularioAforo.get('este')?.value == '' ? 0:  this.formularioAforo.get('este')?.value,
        idMolinete:this.idMoliente,
        activo:'S',
      };
      this.servicioAforo.guardarAforoPunto(punto).subscribe(_punto=>{
        if(_punto.idAforoPunto != null){
          this.listaDato.forEach((item: { abscisa: any; area: any; caudalparcial: any; profundidadTotal: any; VMV: any; velocidadMedia: any; })=>{
            this.listaAbscisa.forEach((dato_: any)=>{
              if(item.abscisa  ==  dato_.abscisa ){
              let aforoAbscisa: IAforoDato = {
                abscisa: item.abscisa,
                area: item.area,
                caudalParcial: item.caudalparcial,
                numeroRevoluciones: dato_.revoluciones,
                profundidadA: dato_.PA,
                profundidadObservada: dato_.profundidadObservada,
                profundidadTotal: item.profundidadTotal,
                revoluciones: dato_.revoluciones,
                tiempo: dato_.tiempo,
                valorMV: item.VMV,
                velocidad: 2,
                velocidadMedia: item.velocidadMedia,
                idAforo: Number(this.id),
                activo:'S',
            };
            this.listaAforoDato.push(aforoAbscisa);
          
          }   
            });
          });
  
        }
        this.aforoGeneral.observaciones = this.formularioAforo.get('observaciones')?.value;
  
        this.servicioAforo.guardarAforoDato(this.listaAforoDato).subscribe(aforoDato=>{
          
             for (let i = 0; i < this.listaDato.length; i++) {
                this.caudalTotal  += this.listaDato[i].caudalparcial;
            }
            this.velocidadMediaTotal= this.listaAbscisa.map((resul:any)=> resul.velocidad).reduce((a:any,b:any)=>a+b,0);
            this.areaTotal = this.listaDato.map(
              (resul:any)=> 
              resul.area).reduce(
                (a:any,b:any)=>a+b,0); 
            this.aforoGeneral.caudalTotal = this.caudalTotal;
            this.aforoGeneral.areaTotal= this.areaTotal
            this.aforoGeneral.fecha  = new Date(this.aforoGeneral.fecha);
            this.aforoGeneral.horaFinal= new Date(this.aforoGeneral.horaFinal);
            this.aforoGeneral.horaInicial= new Date(this.aforoGeneral.horaInicial);
            //this.aforoGeneral.fechaCreacion= this.aforoGeneral.fechaCreacion == undefined ? new Date() : new Date(this.aforoGeneral.fechaCreacion);
            //this.aforoGeneral.fechaModificacion= this.aforoGeneral.fechaModificacion == undefined ? new Date() : new Date(this.aforoGeneral.fechaModificacion);
            var listaSeciones= [];
            var array1= [];
            for (let index = 0; index < this.listaDato.length; index++) {
           
              var b =  this.listaDato[index].profundidadTotal;
              listaSeciones.push(b);
              array1.push(this.listaDato[index].profundidadTotal);
              this.radio = listaSeciones.reduce((a:any, b:any) => a + b, 0);
              
            }
        
            this.ancho = this.areaTotal/this.radio
            this.perimetroMojado =  this.ancho+2*this.radio   

            console.log(  this.radio , this.ancho , this.perimetroMojado);

            
            this.nivelTotal = this.listaAforoDato.map((resul:any)=> resul.revoluciones).reduce((a:number,b:number)=> a+b,0) / this.listaAforoDato.map((resul:any)=> resul.tiempo).reduce((a:number,b:number)=> a+b,0);
            var calculoAforo: IAforoCalculo={
              idAforo: this.idAforo,
              ancho:  this.ancho ,
              area:this.areaTotal,
              caudal: this.caudalTotal,            
              nivelMedio: this.nivelTotal,            
              velocidadMedia: this.velocidadMediaTotal,
              factorGeometrico:0,
              factorHidraulico:0,
              perimetroHumedo:this.perimetroMojado,
              profundidadMedia:'',
              radioHidraulico:this.radio,
            }
            this.servicioAforo.guardarCalculoAforo(calculoAforo).subscribe(calculo=>{
              console.log(this.aforoGeneral);
            //  this.servicioAforo.actualizarAforo(this.actualizarAforo(this.aforoGeneral)).subscribe(aforo=>{  //pendiente validar fechas para actualizar el aforo
           
                Swal.fire(
                  'Aforo',
                  '¡El aforo fue creado de manera exitosa! ',
                  'success'
                );
                this.router.navigate(['/configuracion/gestionAforo']);
              //});
            });         
        });
        
      });
    }
  }


  onFileChange(evt:any){
    var file:File = evt.target.files[0];
  var myReader:FileReader = new FileReader();

  myReader.onloadend = (e) => {
   var image = myReader.result;
    console.log(image);
    var archivo: IAforoArchivo={
        archivo: image?.toString(),
        idAforo: Number(this.id),
        nombreArchivo: ''
    }
    this.servicioAforo.guardarAforoArchivo(archivo);
  }
  myReader.readAsDataURL(file);
   /* const target : DataTransfer =  <DataTransfer>(evt.target);  
    if(target.files.length>0){
      let listaArchivoDatoLocal:any =[];
      this.imagenCargada = target.files[0].name;
    } */
  
  }

  actualizarAforo(modeloFormulario:any){
    let aforo:any={
      idAforo: modeloFormulario.idAforo,
      adjunto:'',
      //aforador: ws[aforoArchivo.MOLINETE],
      codigoEAAB: modeloFormulario.codigoIDEAM,
      codigoIDEAM: modeloFormulario.codigoEAAB,
      fecha: modeloFormulario.fecha,
      horaFinal: modeloFormulario.horaInicial,
      horaInicial: modeloFormulario.horaInicial,
      idElemento: modeloFormulario.idElemento,
      idMetodoMedicion:modeloFormulario.idMetodoMedicion,// sin información 
      idTipoAforo:modeloFormulario.idTipoAforo, //481=Liquido,482=otro 
      idTipoElemento: modeloFormulario.idTipoElemento,
      nivelFinal: modeloFormulario.nivelFinal,
      nivelInicial: modeloFormulario.nivelInicial,
      nombreAforo:'FORMATO DE CALCULO PARA AFOROS DE CORRIENTES DE AGUA',
      nombreCorriente: modeloFormulario.nombreCorriente,
      observacion:modeloFormulario.observaciones,
      observaciones: modeloFormulario.observaciones, 
      anio: modeloFormulario.anio,
      flagMigracion: modeloFormulario.flagMigracion,
      idAforoAforador: modeloFormulario.idAforoAforador,
      numeroAforo: modeloFormulario.numeroAforo,  
      caudalTotal: modeloFormulario.caudalTotal,
      areaTotal:modeloFormulario.areaTotal,
     // fechaModificacion: modeloFormulario.fechaModificacion,
      // usuarioModificacion: modeloFormulario.usuarioModificacion,
    }
    return aforo;
  }

  obtenerElementos(even: any) {
    this.idTipoElemento = even;

    console.log('Cambiando', this.idTipoElemento);

    this.listaElemento = [];
    this.listaCodigoEAAB = [];
    this.listaCodigoIDEAM = [];

    switch (even) {
      case '466': {
        // Estaciones
        
        this.serviciosEstacionesService
          .obtenerEstaciones()
          .subscribe((response) => {
            this.listaCodigoEAAB = response.filter((element => element.codigoEstacionEaab != null)).map((elemento: any) => ({
              id: elemento.idEstacion,
              text: elemento.codigoEstacionEaab,
              // text: elemento.codigoEstacionEaab,
              disabled: elemento.activo == 'S' ? false : true,
            }));

            this.listaCodigoIDEAM = response.filter((element => element.codigoEstacionIdeam != null)).map((elemento: any) => ({
              id: elemento.idEstacion,
              text: elemento.codigoEstacionIdeam,
              // text: elemento.codigoEstacionEaab,
              disabled: elemento.activo == 'S' ? false : true,
            }));
              
            this.listaElemento = response.map((elemento: any) => ({
             id: elemento.idEstacion,
              text: elemento.estacion,
            disabled: elemento.activo == 'S' ? false : true,
           }));
          });
        break;
      }
      case '467': {
        // Embalses
        this.serviciosEmbalcesService
          .obtenerEembalsesDTO()
          .subscribe((response) => {
            // console.log('llegaron embalses', response);

            this.listaElemento = response.map((elemento: any) => ({
              id: elemento.idEmbalse,
              text: elemento.embalse,
              disabled: elemento.activo == 'S' ? false : true,
            }));
          });
        break;
      }
      case '468': {
        // pozos
        this.serviciosPozosService.obtenerPozosDTO().subscribe((response) => {
          // console.log('llegaron pozoz', response);
          this.listaElemento = response.map((elemento: any) => ({
            id: elemento.idPozo,
            text: elemento.pozo,
            disabled: elemento.activo == 'S' ? false : true,
          }));
        });

        break;
      }
      default: {
        console.log('default');
        //statements;
        break;
      }
    }
  }

  calcular() {
    this.PA = this.profundidadTotal * (isNaN(this.profundidadObservada) ? 0: this.profundidadObservada);
 
    
    if(this.tiempo == 0){
      this.N = 0;
    }else{
      this.N = this.revoluciones / this.tiempo;
    }

    if (this.N >= 0 && this.revoluciones >0) {
      this.velocidad = this.N * this.NR + this.NR1;
    } else {
      this.velocidad = 0;
    }
 
    this.area = this.abscisa * (this.profundidadTotal / 2);

    this.caudalparcial = this.velocidadMedia * this.area;

  }

  
  asignaradscisa( absisa:any ){ 
    for (let index = 0; index < this.listaDato.length; index++) {
      const element = this.listaDato[index];
      if (this.listaDato[index].abscisa == absisa) {
        
        this.profundidadTotal = this.listaDato[index].profundidadTotal
        this.abscisa = this.listaDato[index].abscisa;        
      }                          
      
    }
    this.calcular();


  }
cambairDecimal(anny:any){
  return anny;
}


  eliminadadscisa( id:any ){ 
    

    
    var listaDato = this.listaDato.filter(function(car:any) {
      return car.abscisa !== id.abscisa; 
    });

    this.listaDato =listaDato;

  
    
    
    
   }

    eliminadadscisaDato( id:any ){ 

      var listaAbscisa = this.listaAbscisa.filter(function(car:any) {
        return car.punto !== id.punto; 
      });
  
      this.listaAbscisa = listaAbscisa;
  

       
    
    }
    

  calcularVMV() {
    const obg: any = [];
    const obg2: any = [];
    // Calcular VMV
    if (this.revoluciones == 0) {
      this.VMV = this.velocidad * this.NR;
    } else {
      for (let index = 0; index < this.listaAbscisa.length; index++) {
        if (this.listaAbscisa[index].abscisa == this.abscisa) {

          if(this.listaAbscisa[index].velocidad == 0){

          }else{ 
             
              obg.push(this.listaAbscisa[index].velocidad);

           }
        }
      }
      var i = 0,
        summ = 0,
        ArrayLen = obg.length;
      while (i < ArrayLen) {
        summ = summ + obg[i++];
      }
      if(ArrayLen == 1){
        this.VMV = summ * 0.82;
      }else{
    
        this.VMV = summ / ArrayLen;
      }
      

      for (let index = 0; index < this.listaDato.length; index++) {
        const element = this.listaDato[index];

        if (this.listaDato[index].abscisa == this.abscisa) {
          this.listaDato[index].VMV = isNaN(this.VMV) ? 0:this.VMV;

         
        }
      }
    }
  }
  calcularVelMed44() {
    for (let index = 0; index < this.listaDato.length; index++) {
      if (this.listaDato[0].velocidadMedia == null) {
        
        // Cuando es el primer resgistro de la abscisa
           // this.velocidadMedia = (this.VMV * 2) / 3;
           this.listaDato[index].velocidadMedia =
             this.listaDato[index].VMV * (2 / 3);
   
         } else {
  

        const index3 = index + 2;
        const index2 = index + 1;

        if (this.listaDato[index3] != undefined) {

          if (this.listaDato[index2].VMV == 0 || undefined) {
            
            this.listaDato[index].velocidadMedia = (0 * 2) / 3;

            
          } else {
         // Si la profundidad de la tercera abscisa es = VMV * (2/3)
        

         if(this.listaDato[index2]  == undefined ){
         
          this.listaDato[index].velocidadMedia =
          (this.listaDato[index2].VMV * 2) / 3;


         }else{

          
          
          this.listaDato[index].velocidadMedia =
          (this.listaDato[index].VMV +
            this.listaDato[index2].VMV) /
          2;
         }
         

          }

        } else {

          if (this.listaDato[index2] == undefined) {

         
            this.listaDato[index].velocidadMedia =
              (this.listaDato[index].VMV + 0) / 2;

              

          } else {
          // Si es diferente de cero entonces divida entre 2 el resultado de 
          // sumar la VMV de la abscisa siguiente a la VMV de la abscisa actual.
          
            this.listaDato[index].velocidadMedia =
              (this.listaDato[index].VMV +
                this.listaDato[index2].VMV) /
              2;
          }


        }
      }
    }
  }

  calcularVelMed3() {
    for (let index = 0; index < this.listaDato.length; index++) {
      
      

        const index3 = index + 2;
        const index2 = index + 1;

        if (this.listaDato[index3] != undefined) {
         
          if (this.listaDato[index2].VMV == 0 || undefined) {
           
            this.listaDato[index].velocidadMedia = (0 * 2) / 3;
          } else {
            
            this.listaDato[index].velocidadMedia =
              (this.listaDato[index2].VMV * 2) / 3;
          }
        } else {
         
          if (this.listaDato[index2] == undefined) {
           
            this.listaDato[index].velocidadMedia =
              (this.listaDato[index].VMV + 0) / 2;
          } else {
         
            this.listaDato[index].velocidadMedia =
              (this.listaDato[index].VMV +
                this.listaDato[index2].VMV) /
              2;
          }
        }
     
    
    }
  }


  calcularVelMed7() {
    for (let index = 0; index < this.listaDato.length; index++) {
      if (this.listaDato[index].velocidadMedia == null) {
        
     // Cuando es el primer resgistro de la abscisa
        // this.velocidadMedia = (this.VMV * 2) / 3;
        this.listaDato[index].velocidadMedia =
          this.listaDato[index].VMV * (2 / 3);

      } else {
  

        const index3 = index + 2;
        const index2 = index + 1;

        if (this.listaDato[index3] != undefined) {

          if (this.listaDato[index2].VMV == 0 || undefined) {
            this.listaDato[index].velocidadMedia = (0 * 2) / 3;
          } else {
         // Si la profundidad de la tercera abscisa es = VMV * (2/3)

            this.listaDato[index].velocidadMedia =
              (this.listaDato[index2].VMV * 2) / 3;
          }

        } else {

          if (this.listaDato[index2] == undefined) {
            this.listaDato[index].velocidadMedia =
              (this.listaDato[index].VMV + 0) / 2;
          } else {
          // Si es diferente de cero entonces divida entre 2 el resultado de 
          // sumar la VMV de la abscisa siguiente a la VMV de la abscisa actual.
            this.listaDato[index].velocidadMedia =
              (this.listaDato[index].VMV +
                this.listaDato[index2].VMV) /
              2;
          }


        }
      }
    }
  }



  calcularVelMed() {
    for (let index = 0; index < this.listaDato.length; index++) {
      if (this.listaDato[index].abscisa == 122) {
       
        // this.velocidadMedia = (this.VMV * 2) / 3;
        this.listaDato[index].velocidadMedia =
          this.listaDato[index].VMV * (2 / 3);
      } else {
        const index3 = index + 2;
        const index2 = index + 1;

        if (this.listaDato[index3] != undefined) {
          if (this.listaDato[index2].VMV == 0 || undefined) {
          
            this.listaDato[index].velocidadMedia = (0 * 2) / 3;
          } else {
           

            this.listaDato[index2].velocidadMedia =
              (this.listaDato[index2].VMV +
                this.listaDato[index3].VMV) /
              2;
              var fin =  this.listaDato.length - 0;
              var posicion = fin -1;
             var fin2 = posicion - 1;
             var posicionAntes = posicion -  2 ;
             var antes = posicion -1;
              
                if(this.listaDato[posicion].profundidadTotal == 0 ||  this.listaDato[posicion].VMV == 0){
                 
                    if(this.listaDato[posicionAntes].profundidadTotal == null){

        
                    }else{
        
                      this.listaDato[posicionAntes].velocidadMedia =
                      this.listaDato[antes].VMV * (2 / 3);

                  
                 
                        this.listaDato[posicion].velocidadMedia = 0;
                        this.listaDato[posicion].caudalParcial = 0;
          
                      
                    
                  
                }

               
                  
                }

          }
        } else {
          if (this.listaDato[index2] == undefined) {
         
            this.listaDato[index].velocidadMedia =
              (this.listaDato[index].VMV + 0) / 2;
          } else {
           
              this.listaDato[index].velocidadMedia =
              (this.listaDato[index2].VMV * 2) / 3;

              
          }
        }


      }

    


    }
  }



  calcularArea() {

    for (let index = 0; index < this.listaDato.length; index++) {
      const index2 = index + 1;

      if (this.listaDato[index2] == undefined) {
        this.listaDato[index].area =
          (0 - this.listaDato[index].abscisa) *
          ((0 + this.listaDato[index].profundidadTotal) / 2);
      } else {
        this.listaDato[index].area =
          (this.listaDato[index2].abscisa - this.listaDato[index].abscisa) *((this.listaDato[index2].profundidadTotal +
          this.listaDato[index].profundidadTotal) / 2);
      }

      this.listaDato[index].caudalparcial = this.listaDato[index].area * this.listaDato[index].velocidadMedia;
    }
  }
  
  
  AgregarAbsicisaId(even: any) {
 
   this.asignaradscisa(even);

   let div:any=document.getElementById(`btn_1`);
   div.click();
   var listaFinal =  this.listaDato.filter(function(car:any) {
    return car.x !== even; 
   }); 
    console.log(listaFinal);
    this.listaDato =listaFinal;
  }


  validarAforoAdsisa() {
    var aceptado = true 
  
    
   
 
    
    if(this.profundidadTotal == null){

      this.toast.fire({
        icon: 'error',
        title: 'Debes ingresar las profundidad !! ',
      });
   
      aceptado = false 
    };
   

   
    return aceptado;
  }


  agregarAbscisa() { 

  
    if(this.validarAforoAdsisa() == true){

    let objAforo2 = { 
      abscisa: this.abscisa,
      profundidadTotal: this.profundidadTotal,
      VMV: this.VMV,
      velocidadMedia: this.velocidadMedia,
      area: this.area,
      caudalparcial: this.caudalparcial,
    }; 
    if (this.validarDatos(2)) {
      this.listaDato.push(objAforo2);
      // this.listaDato.push([])
    }
  


    this.calcularVMV();
    this.calcularVelMed();
    this.calcularArea();
 
    this.abscisa = 0;
    this.profundidadTotal = 0;
    this.profundidadObservada = 0; 
    this.VMV = 0;
    this.velocidadMedia = 0;
    this.area = 0;
    this.caudalparcial = 0;
  }
  }


  validarAforo() {
    var aceptado = true 
  
    if(this.tiempo == null){

      this.toast.fire({
        icon: 'error',
        title: 'Debes ingresar el tiempo en Segundos (s)!! ',
      });
      this.tiempo = 0;
      aceptado = false 
    };
   
 
    
    if(this.revoluciones == null){

      this.toast.fire({
        icon: 'error',
        title: 'Debes ingresar las revoluciones!! ',
      });
   
      aceptado = false 
    };
   

   
    return aceptado;
  }
  agregarLista() {
  
 


  if(this.validarAforo() == true){
  
  
    
    let objAforo = {
      punto: this.punto,
      abscisa: this.abscisa,
      profundidadObservada: this.profundidadObservada,
      PA: this.PA,
      revoluciones: this.revoluciones,
      tiempo: this.tiempo,
      N: this.N,
      velocidad: this.velocidad,
    };
    let objAforo2 = {
      punto: this.punto,
      abscisa: this.abscisa,
      profundidadTotal: this.profundidadTotal,
      VMV: this.VMV,
      velocidadMedia: this.velocidadMedia,
      area: this.area,
      caudalparcial: this.caudalparcial,
    };

    if (this.validarDatos(1)) {
      this.listaAbscisa.push(objAforo);
    }
    if (this.validarDatos(2)) {
      this.listaDato.push(objAforo2);
      // this.listaDato.push([])
    }

    this.calcularVMV();
    this.calcularVelMed();
    this.calcularArea();

    this.punto++;
    this.abscisa = this.nullNumber;
    this.profundidadTotal = this.nullNumber;
    this.profundidadObservada = this.nullNumber;
    this.PA = this.nullNumber;
    this.revoluciones = this.nullNumber;
    this.tiempo = this.nullNumber;
    this.N = this.nullNumber;
    this.velocidad = this.nullNumber;
    this.VMV = this.nullNumber;
    this.velocidadMedia = this.nullNumber;
    this.area = this.nullNumber;
    this.caudalparcial = this.nullNumber;
    this.select = "0";
  }

  }

  guardar() {
    console.log('guardando', this.listaAbscisa);

    if (this.listaAbscisa.length >= 2) {
      if (this.id === '0') {
        Swal.fire({
          title: 'Guardando...',
          html: 'Por favor espere',
          timer: 2000,
          timerProgressBar: true,
          didOpen: () => {
            Swal.showLoading();
            this.serviciosSerieTiempoService
              .crearDetalle(this.listaAbscisa)
              .subscribe((response) => {
                console.log('llego', response);
              });
          },
          willClose: () => {
            this.toast.fire({
              icon: 'success',
              title: 'Se Creo  el aforo ',
            });

            this.router.navigate(['/seriestiempo/consultarserie']);
          },
        }).then((result) => {});
      } else {
        // Eliminar
      }
    } else {
      this.toast.fire({
        icon: 'info',
        title: 'la Serie de tiempo debe contrar con almenos dos elementos',
      });
    }
  }

  validarDatos(even: any) {
    if (even == 2) {
      for (let index = 0; index < this.listaDato.length; index++) {
        if (this.listaDato[index].abscisa == this.abscisa) {
          return false;
        }
      }
    } else {
      for (let index = 0; index < this.listaAbscisa.length; index++) {
        if (
          this.listaAbscisa[index].abscisa == this.abscisa &&
          this.listaAbscisa[index].punto == this.punto
        ) {
          this.toast.fire({
            icon: 'info',
            title: 'El  Punto ya se encuentra en el Aforo',
          });
          return false;
        }
      }
    }

    return true;
  }

  eliminarLista(id: any) {
    var i = this.listaAbscisa.indexOf(id);

    if (i !== -1) {
      this.listaAbscisa.splice(i, 1);
    }
  }

  obtenerParametrosElemento(event: any, mecanismo: any) {
    var tipomecanismo: Number = parseInt(mecanismo);
    switch (tipomecanismo) {
      case 466: {
        this.formularioAforo.controls['nombreCorriente'].setValidators([Validators.required])
        this.sercioparametrosestacion
          .obtenerListaParametros(event)
          .subscribe((response) => {
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
            this.listaFrecuencia.forEach((list1: any) => {
              response.forEach((element: any) => {
                if (list1.id == element.idPeriodo) {
                  this.newlistaFrecuencia.push(list1);
                }
              });
            });
            this.listaFrecuenciaXParametro = this.newlistaFrecuencia.filter(
              (valor: any, indice: any) => {
                return this.newlistaFrecuencia.indexOf(valor) === indice;
              }
            );
            console.log('llego lista', this.listaFrecuenciaXParametro);
          });

        break;
      }
      case 467: {
        this.formularioAforo.controls['nombreCorriente'].clearValidators()
        this.serviciosParametrosEmbalseService
          .obtenerListaParametrosXEmbalse(event)
          .subscribe((response) => {
            // console.log('embalses', response);
            this.NombresParametros = response.map((elemento: any) => ({
              id: elemento.idParametroXEmbalse,
              text: elemento.descripcionParametro,
              idPeriodo: elemento.idPeriodo,
              disabled: elemento.activo == 'S' ? false : true,
            }));
            this.CodigoParametros = response.map((elemento: any) => ({
              id: elemento.idParametroXEmbalse,
              text: elemento.codigo,
              idPeriodo: elemento.idPeriodo,
              disabled: elemento.activo == 'S' ? false : true,
            }));
            // filtrar  frecuencias por parametros
            this.listaFrecuencia.forEach((list1: any) => {
              response.forEach((element: any) => {
                if (list1.id == element.idPeriodo) {
                  this.newlistaFrecuencia.push(list1);
                }
              });
            });

            this.listaFrecuenciaXParametro = this.newlistaFrecuencia.filter(
              (valor: any, indice: any) => {
                return this.newlistaFrecuencia.indexOf(valor) === indice;
              }
            );
          });
        break;
      }
      case 468: {
        this.formularioAforo.controls['nombreCorriente'].clearValidators()
        this.serviciosParametrosPozosService
          .obtenerListaParametrosXPozo(event)
          .subscribe((response) => {
            this.NombresParametros = response.map((elemento: any) => ({
              id: elemento.idParametroXPozo,
              text: elemento.descripcionParametro,
              idPeriodo: elemento.idPeriodo,
              disabled: elemento.activo == 'S' ? false : true,
            }));

            this.CodigoParametros = response.map((elemento: any) => ({
              id: elemento.idParametroXPozo,
              idPeriodo: elemento.idPeriodo,
              text: elemento.codigo,
              disabled: elemento.activo == 'S' ? false : true,
            }));

            // filtrar  frecuencias por parametros
            this.listaFrecuencia.forEach((list1: any) => {
              response.forEach((element: any) => {
                if (list1.id == element.idPeriodo) {
                  this.newlistaFrecuencia.push(list1);
                }
              });
            });

            this.listaFrecuenciaXParametro = this.newlistaFrecuencia.filter(
              (valor: any, indice: any) => {
                return this.newlistaFrecuencia.indexOf(valor) === indice;
              }
            );
          });

        break;
      }
      default: {
        console.log('default');
        //statements;
        break;
      }
    }
  }

  obtenerHelice(idMolinete:any){
    if(idMolinete!= "" && idMolinete!= null){
      this.serviciosMolineteService.obtenerPorIdtipo(idMolinete)
          .subscribe((response) => {   
            console.log(response);
            this.listaHelices = response;       
      })
    }   
  }

  obtenerInfoHelice(idHelice:any){
    if(idHelice!= "" && idHelice!= null){
    this.servicioAforo.obtenerInfoHelice(idHelice).subscribe(helice=>{
      var helice1:any = helice;
      if(helice1[0]!=null){
        this.formularioAforo.get('constanteEquipo')?.setValue(this.formularioAforo.get('idMolinete')?.value.toString()+'-'+ helice1[0].serieHelice);
        this.formularioAforo.get('ecuacion')?.setValue('V = mN + B');
        this.formularioAforo.get('norteMayor')?.setValue(helice1[0].numeroRevolucionesMax);
        this.formularioAforo.get('norteMenor')?.setValue(helice1[0].numeroRevolucionesMin);
        this.formularioAforo.get('coeficionte')?.setValue('0');
        this.NR = helice1[0].constanteM
        this.NR1 = helice1[0].constanteB
        this.idMoliente = helice1[0].idMolinete

        if( this.NR){
         this.ver = true;
        }
        
      }    
     
    })
  }
  }

  regresarCurva(){
    window.history.go(-1);
    window.history.back();
    
  }
  obtenerInformacion(idHelice:any){
    console.log(idHelice);
  }

  
}
