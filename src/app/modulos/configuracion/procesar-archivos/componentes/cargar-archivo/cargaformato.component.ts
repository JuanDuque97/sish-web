import { ServiciosObservacionesEstacionService } from '../../../../observaciones/servicios-observaciones-estacion.service';
import { ServiciosObservacionesEmbalsesService } from '../../../../observaciones/servicios-observaciones-embalses.service';
import { ServiciosObservacionesPozosService } from '../../../../observaciones/servicios-observaciones-pozos.service';
import { ServiciosDominiosValoresService } from '../../../dominios/servicios-dominios-valores.service';
import { ServiciosParametrosEstacionesService } from 'src/app/modulos/elementos/estaciones/servicios-parametros-estaciones.service';
import { ServiciosParametrosEmbalseService } from 'src/app/modulos/elementos/embalses/servicios-parametros-embalse.service';
import { ServiciosParametrosPozosService } from 'src/app/modulos/elementos/pozos/servicios-parametros-pozos.service';
import { ProcesarArchivosService } from '../../servicios/procesar-archivos.sercevice';
import { dominiosEnum } from '../../../../../modelo/enum/dominios-enum';
import { ITipoArchivoCampoDTO } from 'src/app/modelo/configuracion/tipoArchivoColumnaCampo';
import { activo } from 'src/app/modelo/enum/cargue-archivo-enum';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import readXlsxFile from 'read-excel-file';

@Component({
  selector: 'app-cargaformato',
  templateUrl: './cargaformato.component.html'
})

export class CargaformatoComponent implements OnInit {
  
  public formatoFecha : string = 'yyyy-MM-dd';
  public formatoHora : string = 'HH:mm:ss';
  public formatoFechaHora : string = this.formatoFecha + " " + this.formatoHora;
  public separadorCampos : string = ',';
  public posValor = 1;
  public posFecha = 0;

  public mostrarParametros : boolean = true;

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
  public idParametro : number = 0;
  public idFlag : number = 0;
  public idFormato : number = 1;
  public idFrecuencia : number = 4;
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

  public codigoPrecipitacionACUMH : any = '20';

  public codigoClimatologiaACUMH : any = '20';
  public codigoClimatologiaTEMP : any = '29';
  public codigoClimatologiaHUM : any = '50';
  public codigoClimatologiaRAD : any = '32';
  public codigoClimatologiaEVAP : any = '24';
  public codigoClimatologiaPATM : any = '30';
  public codigoClimatologiaVVIENTO : any = '26';
  public codigoClimatologiaDVIENTO : any = '28';

  public codigoThalimedesCAUDAL_INST : any = '2';

  public codigoSensorNIVEL_INST : any = '1';

  public listaFormatos : any[] = [{
    id: 1,
    text: 'Formato de Precipitación',
  }, {
    id: 2,
    text: 'Formato de Climatología',
  }, {
    id: 3,
    text: 'Formato Thalímedes y Sonda',
  }, {
    id: 4,
    text: 'Formato Sensor',
  },
  /*
   {
    id: 5,
    text: 'Formato Alto del Vino',
  }, 
  {
    id: 6,
    text: 'Formato NO Validado',
  }
  */
  ];

  public listaFrecuencias : any[] = [{
    id: 1,
    text: 'Minutos',
  }, {
    id: 2,
    text: '5 Minutal',
  }, {
    id: 3,
    text: '10 Minutal',
  }, {
    id: 4,
    text: 'Hora',
  },
  /*
   {
    id: 5,
    text: 'Formato Alto del Vino',
  }, 
  {
    id: 6,
    text: 'Formato NO Validado',
  }
  */
  ];

  get ctrFormatos() {
    return this.fmrCargueArchivo.get('ctrFormatos');
  }

  get ctrFrecuencias() {
    return this.fmrCargueArchivo.get('ctrFrecuencias');
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

  private toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
  });

  constructor(
    private formBuilder:FormBuilder, 
    private procesarArchivosService: ProcesarArchivosService ,
    private servicioParametrosEstacion: ServiciosParametrosEstacionesService,
    private servicioParametrosEmbalse: ServiciosParametrosEmbalseService,
    private servicioParametrosPozo: ServiciosParametrosPozosService,
    private route: ActivatedRoute,
    private serviciosDominiosValoresService: ServiciosDominiosValoresService,
    private serviciosObservacionesEstacionService: ServiciosObservacionesEstacionService,
    private serviciosObservacionesEmbalsesService: ServiciosObservacionesEmbalsesService,
    private serviciosObservacionesPozosService: ServiciosObservacionesPozosService,
    ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.ac = this.route.snapshot.paramMap.get('ac')!;
    this.te = this.route.snapshot.paramMap.get('te')!;
    this.construirFormulario();
  }

  cargarCodigoParametros(callback : Function) {
    let formatoId : number, frecuenciaId : number;;
    formatoId = parseInt('' + this.idFormato);
    frecuenciaId = parseInt('' + this.idFrecuencia);

    Swal.fire({
      title: 'Cargando parámetros del formato seleccionado...',
      html: 'Por favor espere',
      allowOutsideClick: false, 
      showConfirmButton: false,
      didOpen: async() => {
        Swal.showLoading();

        this.procesarArchivosService.obtenerFormatoConfigDTO(formatoId, frecuenciaId).subscribe(response => {
          let object : any; 
          object = response.codigoParametrosPorNombre;
          let paramsByName = new Map(Object.entries(object));

          this.codigoPrecipitacionACUMH = undefined;
          this.codigoClimatologiaACUMH = undefined;
          this.codigoClimatologiaEVAP = undefined;
          this.codigoClimatologiaVVIENTO = undefined;
          this.codigoClimatologiaDVIENTO = undefined;
          this.codigoClimatologiaTEMP = undefined;
          this.codigoClimatologiaPATM = undefined;
          this.codigoClimatologiaRAD = undefined;
          this.codigoClimatologiaHUM = undefined;
          this.codigoThalimedesCAUDAL_INST = undefined;
          this.codigoSensorNIVEL_INST = undefined;

          if ( null==paramsByName || undefined==paramsByName || paramsByName.size==0 ) {
            Swal.close();
            callback();
            return;
          }

          let precipitacionCode:any, evaporacionCode:any, velVientoCode:any, dirVientoCode:any, tempCode:any, presionATM:any, radSolarCode:any, humedadCode:any, caudalInstCode:any, nivelInstCode:any;

          console.log("-- ---------------------");
          console.log("Recargando parametros...")
          console.log("-- ---------------------");
          console.log("Formato seleccionado ------> " + formatoId);
          console.log("Frecuencia seleccionado ---> " + frecuenciaId);
          console.log("-- ---------------------");
          switch ( formatoId ) {
            // Formato Precipitación
            case 1:
              precipitacionCode = paramsByName.get('PRECI');
              if ( undefined!=precipitacionCode && null!=precipitacionCode ) {
                this.codigoPrecipitacionACUMH = '' + precipitacionCode;
              }
              console.log('Parametro codigoPrecipitacionACUMH: ' + this.codigoPrecipitacionACUMH);
              break;

            // Formato Climatología
            case 2:
              precipitacionCode = paramsByName.get('PRECI');
              if ( undefined!=precipitacionCode && null!=precipitacionCode ) {
                this.codigoClimatologiaACUMH = '' + precipitacionCode;
              }
              console.log('Parametro codigoClimatologiaACUMH: ' + this.codigoClimatologiaACUMH);

              evaporacionCode = paramsByName.get('EVAPORACI');
              if ( undefined!=evaporacionCode && null!=evaporacionCode ) {
                this.codigoClimatologiaEVAP = '' + evaporacionCode;
              }
              console.log('Parametro codigoClimatologiaEVAP: ' + this.codigoClimatologiaEVAP);

              velVientoCode = paramsByName.get('VIENTO, VELOCIDAD');
              if ( undefined!=velVientoCode && null!=velVientoCode ) {
                this.codigoClimatologiaVVIENTO = '' + velVientoCode;
              }
              console.log('Parametro codigoClimatologiaVVIENTO: ' + this.codigoClimatologiaVVIENTO);

              dirVientoCode = paramsByName.get('VIENTO, DIRECCI');
              if ( undefined!=dirVientoCode && null!=dirVientoCode ) {
                this.codigoClimatologiaDVIENTO = '' + dirVientoCode;
              }
              console.log('Parametro codigoClimatologiaDVIENTO: ' + this.codigoClimatologiaDVIENTO);

              tempCode = paramsByName.get('TEMPERATURA AMBIENTE');
              if ( undefined!=tempCode && null!=tempCode ) {
                this.codigoClimatologiaTEMP = '' + tempCode;
              }
              console.log('Parametro codigoClimatologiaTEMP: ' + this.codigoClimatologiaTEMP);

              presionATM = paramsByName.get('PRESION ATMOSF');
              if ( undefined!=presionATM && null!=presionATM ) {
                this.codigoClimatologiaPATM = '' + presionATM;
              }
              console.log('Parametro codigoClimatologiaPATM: ' + this.codigoClimatologiaPATM);

              radSolarCode = paramsByName.get('RADIACION SOLAR');
              if ( undefined!=radSolarCode && null!=radSolarCode ) {
                this.codigoClimatologiaRAD = '' + radSolarCode;
              }
              console.log('Parametro codigoClimatologiaRAD: ' + this.codigoClimatologiaRAD);

              humedadCode = paramsByName.get('HUMEDAD RELATIVA');
              if ( undefined!=humedadCode && null!=humedadCode ) {
                this.codigoClimatologiaHUM = '' + humedadCode;
              }
              console.log('Parametro codigoClimatologiaHUM: ' + this.codigoClimatologiaHUM);
              break;

            // Formato Thalimedes
            case 3:
              caudalInstCode = paramsByName.get('CAUDALES INSTANTANEOS');
              if ( undefined!=caudalInstCode && null!=caudalInstCode ) {
                this.codigoThalimedesCAUDAL_INST = '' + caudalInstCode;
              }
              console.log('Parametro codigoThalimedesCAUDAL_INST: ' + this.codigoThalimedesCAUDAL_INST);
              break;

            // Formato Sensor
            case 4:
              nivelInstCode = paramsByName.get('NIVELES INSTANTANEOS');
              if ( undefined!=nivelInstCode && null!=nivelInstCode ) {
                this.codigoSensorNIVEL_INST = '' + nivelInstCode;
              }
              console.log('Parametro codigoSensorNIVEL_INST: ' + this.codigoSensorNIVEL_INST);
              break;

            default:
              break;
          }
          console.log("-- ---------------------");
          Swal.close();
          callback();
        });
      }, 
      willClose: async() => {
        Swal.hideLoading();
      }
    });
  }

  cargarDatos() {
    Swal.fire({
      title: 'Cargando...',
      html: 'Por favor espere',
      allowOutsideClick: false, 
      showConfirmButton: false,
      didOpen: async() => {
        Swal.showLoading();

        this.cargarCodigoParametros(() => {
          this.cargarEstaciones(() => {
            this.cargarEmbalses(() => {
              this.cargarPozos(() => {
                this.cargarFlags(() => {
                  this.reiniciarValores();
                  Swal.close();
                });
              });
            });
          });
        });

      }, willClose: async() => {
        Swal.hideLoading();
      }
    });
  }

  obtenerFormato(id : any) : any {
    if ( this.listaFormatos.length === 0 ) {
      return null;
    }

    let result = this.listaFormatos.filter(formato => {
      return formato.id === +id;
    });

    if ( null!=result && undefined!=result && result.length>0 ) {
      return result[0];
    }

    return null;
  }

  onFormatoChange(formatoId : number) {
    this.reiniciarValores();
    this.idFormato = +formatoId;

    if ( this.idFormato === 0 ) {
      return;
    }

    this.cargarDatos();
    this.prepararCamposParaFormato();
  }

  onFrecuenciaChange(frecuenciaId : number) {
    this.reiniciarValores();
    this.idFrecuencia = +frecuenciaId

    if ( this.idFrecuencia === 0 ) {
      return;
    }

    this.cargarDatos();
    this.prepararCamposParaFormato();
  }

  prepararCamposParaFormato() {
    let formatoId : number;
    formatoId  = parseInt('' + this.idFormato);

    switch( formatoId ) {
      // Formato 1: Formato Precipitacion
      // Formato 2: Formato Climatologia
      // Formato 3: Formato Thalimedes y Sonda
      // Formato 4: Formato Sensor
      // Formato 5: Formato Estación Vino: DESCARTADO POR EL MOMENTO.
      case 1:
      case 2:
      case 3:
      case 4:
      // case 5:
        this.mostrarParametros = false;
        break;

      default:
        this.mostrarParametros = true;
        break;
    }
  }

  cargarEstacionesPorFormato(callback : Function) {
    let tipoFormato : number, tipoFrecuencia : number;
    
    tipoFormato = +this.idFormato;
    tipoFrecuencia = +this.idFrecuencia;

    Swal.fire({
      title: 'Cargando estaciones...',
      html: 'Por favor espere',
      allowOutsideClick: false, 
      showConfirmButton: false,
      didOpen: async() => {
        Swal.showLoading();
        this.procesarArchivosService.obtenerEstacionesPorFormato(tipoFormato, tipoFrecuencia).subscribe(estaciones=>{
          this.listaEstaciones = estaciones;
          Swal.close();
          callback();
        });
      }, 
      willClose: async() => {
        Swal.hideLoading();
      }
    });
  }

  cargarEstacionesDefault(callback : Function) {
    Swal.fire({
      title: 'Cargando estaciones...',
      html: 'Por favor espere',
      allowOutsideClick: false, 
      showConfirmButton: false,
      didOpen: async() => {
        Swal.showLoading();
        this.procesarArchivosService.obtenerEstacion().subscribe(estaciones=>{
          this.listaEstaciones = estaciones;
          Swal.close();
          callback();
        });
      }, 
      willClose: async() => {
        Swal.hideLoading();
      }
    });
  }

  cargarEstaciones(callback : Function) {
    let formatoId : number;
    formatoId = parseInt('' + this.idFormato);
    switch ( formatoId ) {
      case 1:
      case 2:
      case 3:
      case 4:
      /*
      case 5:
      */
        this.cargarEstacionesPorFormato(callback);
        break;

      default:
        this.cargarEstacionesDefault(callback);
        break;
    }
  }

  cargarEmbalsesPorFormato(callback : Function) {
    let tipoFormato : number, tipoFrecuencia : number;
    
    tipoFormato = parseInt('' + this.idFormato);
    tipoFrecuencia = parseInt('' + this.idFrecuencia);

    Swal.fire({
      title: 'Cargando embalses...',
      html: 'Por favor espere',
      allowOutsideClick: false, 
      showConfirmButton: false,
      didOpen: async() => {
        Swal.showLoading();
        this.procesarArchivosService.obtenerEmbalsesPorFormato(tipoFormato, tipoFrecuencia).subscribe(embalses=>{   
          this.listaEmbalses = embalses;
          Swal.close();
          callback();
        });
      }, 
      willClose: async() => {
        Swal.hideLoading();
      }
    });
  }

  cargarEmbalsesDefault(callback : Function) {
    Swal.fire({
      title: 'Cargando embalses...',
      html: 'Por favor espere',
      allowOutsideClick: false, 
      showConfirmButton: false,
      didOpen: async() => {
        Swal.showLoading();
        this.procesarArchivosService.obtenerEembalsesDTO().subscribe(embalses=>{   
          this.listaEmbalses = embalses;
          Swal.close();
          callback();
        });
      }, 
      willClose: async() => {
        Swal.hideLoading();
      }
    });
  }

  cargarEmbalses(callback : Function) {
    let formatoId : number;
    formatoId = parseInt('' + this.idFormato);

    switch( formatoId ) {
      case 1:
      case 2:
      case 3:
      case 4:
      /*
      case 5:
      */
        this.cargarEmbalsesPorFormato(callback);
        break;

      default:
        this.cargarEmbalsesDefault(callback);
        break;
    }
  }

  cargarPozosPorFormato(callback : Function) {
    let tipoFormato : number, tipoFrecuencia : number;
    tipoFormato = parseInt('' + this.idFormato);
    tipoFrecuencia = parseInt('' + this.idFrecuencia);

    Swal.fire({
      title: 'Cargando pozos...',
      html: 'Por favor espere',
      allowOutsideClick: false, 
      showConfirmButton: false,
      didOpen: async() => {
        Swal.showLoading();

        this.procesarArchivosService.obtenerPozosPorFormato(tipoFormato, tipoFrecuencia).subscribe(pozos=>{
          this.listaPozos = pozos;
          Swal.close();
          callback();
        });
      }, 
      willClose: async() => {
        Swal.hideLoading();
      }
    });
  }

  cargarPozosDefault(callback : Function) {
    Swal.fire({
      title: 'Cargando pozos...',
      html: 'Por favor espere',
      allowOutsideClick: false, 
      showConfirmButton: false,
      didOpen: async() => {
        Swal.showLoading();

        this.procesarArchivosService.obtenerPozosDTO().subscribe(pozos=>{   
          this.listaPozos = pozos;
          Swal.close();
          callback();
        });
      }, 
      willClose: async() => {
        Swal.hideLoading();
      }
    });
  }

  cargarPozos(callback : Function) {
    let formatoId : number;
    formatoId = parseInt('' + this.idFormato);

    switch( formatoId ) {
      case 1:
      case 2:
      case 3:
      case 4:
      /*
      case 5:
      */
        this.cargarPozosPorFormato(callback);
        break;

      default:
        this.cargarPozosDefault(callback);
        break;
    }
  }

  cargarFlags(callback : Function) {
    Swal.fire({
      title: 'Cargando flags de observación...',
      html: 'Por favor espere',
      allowOutsideClick: false, 
      showConfirmButton: false,
      didOpen: async() => {
        Swal.showLoading();

        if (this.ac != 'C') {
          this.serviciosDominiosValoresService.obtenerValoresPorIdDominio(dominiosEnum.FlagObservacion).subscribe((response) => {
            this.listaflag = response;
            Swal.close();
            callback();
          });
        } else {
          this.serviciosDominiosValoresService.obtenerValoresActivosPorIdDominio(dominiosEnum.FlagObservacion).subscribe((response) => {
            this.listaflag = response;
            Swal.close();
            callback();
          });
        }
      }, 
      willClose: async() => {
        Swal.hideLoading();
      }
    });
  }

  construirFormulario(){    
    this.fmrCargueArchivo = this.formBuilder.group({
      ctrFormatos:[''],
      ctrFrecuencias:[''],
      ctrEstaciones:[''],
      ctrPozos:[''],
      ctrEmbalses:[''],
      ctrParametro:[''],
      rbTipoParametro:['1'],
      idParametro:[null],
      nombreParametro:[null],
      codigoParametro:[null],
      idFlag: [null],
      archivo: [null], 
    });
  }

  ajustarUnidadDeMedida(desc : String) : String {
    if ( undefined==desc || null==desc || !desc.includes('-') || desc.split('-').length<2 ) {
      return "";
    }

    let tokens = desc.split('-');
    let medida = tokens[1].toLowerCase();
    let result = tokens[0] + ' ' + medida;
    return result;
  }

  obtenerParametrosElemento(event: any) {
    if ( event ) {
      this.idElemento = event;
      this.idParametro = 0;
      let tipoElemento = this.fmrCargueArchivo.value.rbTipoParametro;

      /*
      console.log("--> event: " + event);
      console.log("--> rbTipoParametro: " + this.fmrCargueArchivo.value.rbTipoParametro);
      console.log("--> idElemento: " + this.idElemento);
      */

      switch (tipoElemento) {
        // Estaciones
        case '1':
          Swal.fire({
            title: 'Cargando parámetros de estación...',
            html: 'Por favor espere',
            allowOutsideClick: false, 
            showConfirmButton: false,
            didOpen: async() => {
              Swal.showLoading();

              this.servicioParametrosEstacion.obtenerListaParametros(this.idElemento).subscribe((response) => {
                this.listaNombreParametros = response.map((elemento: any) => ({
                  id: elemento.idParametroXEstacion, 
                  text: this.ajustarUnidadDeMedida(elemento.descripcionParametro),
                  idPeriodo: elemento.idPeriodo, 
                  codigo: elemento.codigo
                }));
                
                this.listaCodigoParametros = response.map((elemento: any) => ({
                  id: elemento.idParametroXEstacion,
                  text: elemento.codigo,
                  idPeriodo: elemento.idPeriodo,
                  codigo: elemento.codigo
                }));

                Swal.close();
              });
            }, 
            willClose: async() => {
              Swal.hideLoading();
            }
          });
          break

        // Embalses
        case '2':
          Swal.fire({
            title: 'Cargando parámetros de embalse...',
            html: 'Por favor espere',
            allowOutsideClick: false, 
            showConfirmButton: false,
            didOpen: async() => {
              Swal.showLoading();

              this.servicioParametrosEmbalse.obtenerListaParametrosXEmbalse(this.idElemento).subscribe((response) => {
                this.listaNombreParametros = response.map((elemento: any) => ({
                  id: elemento.idParametroXEmbalse, 
                  text: this.ajustarUnidadDeMedida(elemento.descripcionParametro), 
                  idPeriodo: elemento.idPeriodo,
                }));
                
                this.listaCodigoParametros = response.map((elemento: any) => ({
                  id: elemento.idParametroXEmbalse,
                  text: elemento.codigo,
                  idPeriodo: elemento.idPeriodo,
                }));

                Swal.close();
              });
            }, 
            willClose: async() => {
              Swal.hideLoading();
            }
          });
          break;

        // Pozos
        case '3':
          Swal.fire({
            title: 'Cargando parámetros de pozo...',
            html: 'Por favor espere',
            allowOutsideClick: false, 
            showConfirmButton: false,
            didOpen: async() => {
              Swal.showLoading();

              this.servicioParametrosPozo.obtenerListaParametrosXPozo(this.idElemento).subscribe((response) => {
                this.listaNombreParametros = response.map((elemento: any) => ({
                  id: elemento.idParametroXPozo, 
                  text: this.ajustarUnidadDeMedida(elemento.descripcionParametro), 
                  idPeriodo: elemento.idPeriodo,
                }));
                
                this.listaCodigoParametros = response.map((elemento: any) => ({
                  id: elemento.idParametroXPozo,
                  text: elemento.codigo,
                  idPeriodo: elemento.idPeriodo,
                }));

                Swal.close();
              });
            }, 
            willClose: async() => {
              Swal.hideLoading();
            }
          });
          break;

        default:
          break;
      }
    }
  }

  validarObligatorios() : boolean {
    if ( !(this.rbTipoParametro>=1 && this.rbTipoParametro<=3) ) {
      //console.error("--> Tipo de elemento no válido: " + this.rbTipoParametro);
      return false;
    }

    if ( !this.idElemento ) {
      switch ( this.rbTipoParametro ) {
        case 1:
          console.error("--> La estación seleccionada NO es válida.");
          break;

        case 2:
          console.error("--> El embalse seleccionado NO es válido.");
          break;

        case 3:
          console.error("--> El pozo seleccionado NO es válido.");
          break;

        default:
          console.error("--> Elemento solicitado NO es válido.");
          break;
      }
      
      return false;
    }

    if ( (this.idFormato==1 || this.idFormato==4)  && (null==this.idParametro || undefined==this.idParametro) ) {
      console.error("--> El parámetro seleccionado NO es válido.");
      return false;
    }

    if ( !this.idFlag ) {
      //console.error("--> El flag NO es válido.");
      return false;
    }

    if ( this.archivoRuta.length == 0 ) {
      console.error("--> El archivo seleccionado NO es válido.");
      return false;
    }
    
    /*
    if ( this.datosObservacionList.length == 0 ) {
      console.error("--> El archivo seleccionado NO es válido.");
      return false;
    }
    */

    return true;
  }

  subirArchivo() {
    if ( !this.validarObligatorios() ) {
      return;
    }

    Swal.fire({
      title: 'Cargando información...',
      html: 'Por favor espere',
      //timer: 2000,
      timerProgressBar: true,
      allowOutsideClick: false, 
      showConfirmButton: false,

      didOpen: async () => {
        try {
          Swal.showLoading();
          this.porcentaje = 0;

          /*
          console.log("-------------------------------------------------------------------");
          console.log("---> SOLICITUD CARGUE DE DATOS <---");
          console.log("-------------------------------------------------------------------");
          console.log("--> rbTipoParametro: " + this.fmrCargueArchivo.value.rbTipoParametro);
          console.log("--> idElemento: " + this.idElemento);
          console.log("--> idParametro: " + this.idParametro);
          console.log("-------------------------------------------------------------------");
          */
        
          switch (this.fmrCargueArchivo.value.rbTipoParametro) {

            // Estaciones
            case "1":
              if ( this.idFormato==1 || this.idFormato==4 ) {
                this.datosObservacionList.forEach(observ => {
                  observ.idParametroXEstacion = this.idParametro;
                });
              }

              let arrayCopyEst = [] as any;
              arrayCopyEst = [...this.datosObservacionList];

              await this.serviciosObservacionesEstacionService
                //.creacionMasiva(arrayCopyEst)
                .cargueRapido(arrayCopyEst)
                .subscribe((Response) => {
                  Swal.hideLoading();

                  let registradas = Response.observacionesRegistradas;
                  let causasFallo = Response.razonesFallo;

                  if ( registradas.length > 0 ) {
                    this.toast.fire({
                      icon: 'success', 
                      title:
                        'Se gurardaron ' +
                        registradas.length +
                        ' Observaciones de estación exitosamente!'
                    });
                  }

                  let razonesFallo = Response.razonesFallo;
                  if ( null!=razonesFallo && undefined!=razonesFallo && razonesFallo.length>0 ) {
                    this.arrayErrores += razonesFallo;
                  }

                  this.arrayErrores += causasFallo;
                  this.porcentaje = 100;
                  this.totalRegistrosCargados = registradas.length;
                  this.totalRegistrosErrores = this.totalRegistrosEsperados - this.totalRegistrosCargados;

                  Swal.close();
                  //this.router.navigate(['/configuracion/gestionObservaciones']);
            });
            break;

            // Embalses
            case "2":
              if ( this.idFormato==1 || this.idFormato==4 ) {
                this.datosObservacionList.forEach(observ => {
                  observ.idParametroXEmbalse = this.idParametro;
                });
              }
              
              let arrayCopyEmb = [] as any;
              arrayCopyEmb = [...this.datosObservacionList];
              
              await this.serviciosObservacionesEmbalsesService
                //.creacionMasiva(arrayCopyEmb)
                .cargueRapido(arrayCopyEmb)
                .subscribe((Response) => {
                  Swal.hideLoading();

                  let registradas = Response.observacionesRegistradas;
                  let causasFallo = Response.razonesFallo;
                  
                  if ( registradas.length > 0 ) {
                    this.toast.fire({
                      icon: 'success',
                      title: 
                        'Se gurardaron ' +
                        registradas.length +
                        ' Observaciones de embalse exitosamente!',
                    });
                  }
                  
                  this.arrayErrores += causasFallo;
                  this.porcentaje = 100;
                  this.totalRegistrosCargados = registradas.length;
                  this.totalRegistrosErrores = this.totalRegistrosEsperados - this.totalRegistrosCargados;

                  Swal.close();
                  // this.router.navigate(['/configuracion/gestionObservaciones']);
              });
              break;
              
              // Pozos
            case "3":
              if ( this.idFormato==1 || this.idFormato==4 ) {
                this.datosObservacionList.forEach(observ => {
                  observ.idParametroXPozo = this.idParametro;
                });
              }
              
              let arrayCopyPoz = [] as any;
              arrayCopyPoz = [...this.datosObservacionList];
              
              await this.serviciosObservacionesPozosService
                //.creacionMasiva(arrayCopyPoz)
                .cargueRapido(arrayCopyPoz)
                .subscribe((Response) => {
                  Swal.hideLoading();

                  let registradas = Response.observacionesRegistradas;
                  let causasFallo = Response.razonesFallo;

                  if ( registradas.length > 0 ) {
                    this.toast.fire({
                      icon: 'success', 
                      title:
                        'se gurardaron ' +
                        registradas.length +
                        ' Observaciones de pozo exitosamente!',
                    });
                  }

                  this.arrayErrores += causasFallo;
                  this.porcentaje = 100;
                  this.totalRegistrosCargados = registradas.length;
                  this.totalRegistrosErrores = this.totalRegistrosEsperados - this.totalRegistrosCargados;

                  Swal.close();
                  //this.router.navigate(['/configuracion/gestionObservaciones']);
              });
              break;

            default:
              break;
          }
        } catch (e) {
          console.error('--> Error al invocar el servicio de cargue: ' + e);
          Swal.hideLoading();
          Swal.close();
        }
      }, 
      willClose: () => {
        Swal.hideLoading();
      },
    })
  }

  validarTipoArchivo(fileType : string) : boolean {
    if ( null==fileType || undefined==fileType || 0==fileType.length ) {
      return false;
    }

    let formatoId : number;
    formatoId = parseInt('' + this.idFormato);

    let allowedFileTypes = [];

    switch( formatoId ) {
      case 1:
      case 2:
      case 3:
      case 4:
        allowedFileTypes.push('application/vnd.ms-excel');
        allowedFileTypes.push('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        break;

      default:
        return false;
    }

    console.info('FormatID: ' + formatoId);
    console.info('allowedFileTypes: ' + allowedFileTypes);
    console.info('requested fileType: ' + fileType);

    return allowedFileTypes.includes(fileType);
  }

  cargarArchivo(event : any) {
    this.totalRegistrosEsperados = 0;
    this.totalRegistrosCargados = 0;
    this.totalRegistrosErrores = 0;
    this.arrayErrores = '';

    let input : any = document.getElementById('inputFileServer');
    if ( null==input || undefined==input || null==input.files || undefined==input.files || 0>=input.files.length ) {
      console.error('El arcivo solicitado no es válido...');
      return;
    }

    let formatoId : number;
    formatoId = parseInt('' + this.idFormato);
    switch (formatoId) {
      case 1:
        this.cargarFormatoPrecipitacion(input.files[0]);
        break;

      case 2:
        this.cargarFormatoClimatologia(input.files[0]);
        break;

      case 3:
        this.cargarFormatoThalimedes(input.files[0]);
        break;

      case 4:
        this.cargarFormatoSensor(input.files[0]);
        break;

      /*
      case 5:
        this.cargarFormatoVino(input.files[0]);
        break;
      */

      default:
        this.toast.fire({
          icon: 'error', 
          title: 'El formato seleccionado, NO está soportado para ser procesado.'
        });
        break;
    }
  }

  obtenerParametroPorCodigo(codigo : string) : any {
    this.idParametro = 0;

    if ( this.listaCodigoParametros.length <=0 ) {
      return null;
    }

    /*
    console.log('-- ----------------------------------------------------------------');
    console.log('Codigo Parametro a buscar: ' + codigo + ', type: ' + (typeof codigo));
    console.log('-- ----------------------------------------------------------------');
    this.listaCodigoParametros.forEach(cod => {
      console.log('Codigo encontrado:  ' + cod.codigo);
      console.log('stringify[Codigo] encontrado:  ' + JSON.stringify(cod));
    })
    console.log('-- ----------------------------------------------------------------');
    */

    let parametros = this.listaCodigoParametros.filter(param => {
      return param.codigo === codigo;
    });

    if ( null==parametros || undefined==parametros || parametros.length<=0 ) {
      return null;
    }

    this.idParametro = parametros[0].id;
    return parametros[0].id;
  }

  validarDatosFormatoClimatologiaHoja1(filePath: any, fechas: String[], consec: number, callback: Function) {
    Swal.fire({
      title: 'Validando datos de la primera hoja...',
      html: 'Por favor espere',
      timerProgressBar: false,
      allowOutsideClick: false, 
      showConfirmButton: false,
      didOpen: async () => {
        Swal.showLoading();

        // Se procesan los registros de la Hoja: 1 (CCCAMPAMENTO1_1)
        readXlsxFile(filePath, {sheet: 1}).then((rows) => {
          // Se omite el primer registro, que corresponde a los encabezados de las columnas.
          rows.splice(0, 1);

          rows.forEach(cells => {
            let canContinue = true;
            //this.totalRegistrosEsperados++;
            
            if ( cells.length < 8 ) {
              this.arrayErrores += 'El registro debe tener al menos 8 columnas. Registro NO Valido: [' + cells + '].\n';
              console.error('El registro debe tener al menos 8 columnas. Registro NO Valido: [' + cells + '].');
              canContinue = false;

            } else {
              // Fecha
              if ( !(null!=cells[0]) && !(undefined!=cells[0]) ) {
                this.arrayErrores += 'La fecha del registro NO es valida: [' + cells[0] + ']. Registro NO Valido: [' + cells + '].\n';
                console.error('La fecha del registro NO es valida: [' + cells[0] + ']. Registro NO Valido: [' + cells + '].');
                canContinue = false;

              // Hora
              } else if ( !(null!=cells[1]) && !(undefined!=cells[1]) ) {
                this.arrayErrores += 'La hora del registro NO es valida: [' + cells[1] + ']. Registro NO Valido: [' + cells + '].\n';
                console.error('La hora del registro NO es valida: [' + cells[1] + ']. Registro NO Valido: [' + cells + '].');
                canContinue = false;

              // Valor Precipitacion Acumulado Hora
              } else if ( !(null!=cells[3]) && !(undefined!=cells[3]) ) {
                this.arrayErrores += 'El valor de precipitacion acumulada por hora del registro NO es valido: [' + cells[3] + ']. Registro NO Valido: [' + cells + '].\n';
                console.error('El valor de precipitacion acumulada por hora del registro NO es valido: [' + cells[3] + ']. Registro NO Valido: [' + cells + '].');
                canContinue = false;
              }

              // Valor Temperatura
              else if ( !(null!=cells[5]) && !(undefined!=cells[5]) ) {
                console.error('El valor de temperatura del registro NO es valido: [' + cells[5] + ']. Registro NO Valido: [' + cells + ']');
                this.arrayErrores += 'El valor de temperatura del registro NO es valido: [' + cells[5] + ']. Registro NO Valido: [' + cells + '].\n';
                canContinue = false;
              }
              
              // Valor Humedad
              else if ( !(null!=cells[6]) && !(undefined!=cells[6]) ) {
                this.arrayErrores += 'El valor de humedad del registro NO es valido: [' + cells[6] + ']. Registro NO Valido: [' + cells + '].\n';
                console.error('El valor de humedad del registro NO es valido: [' + cells[6] + ']. Registro NO Valido: [' + cells + '].');
                canContinue = false;
              }
            
              // Valor Radiacion
              else if ( !(null!=cells[7]) && !(undefined!=cells[7]) ) {
                this.arrayErrores += 'El valor del registro NO es valido: [' + cells[7] + ']. Registro NO Valido: [' + cells + '].\n';
                console.error('El valor del registro NO es valido: [' + cells[7] + ']. Registro NO Valido: [' + cells + '].');
                canContinue = false;
              }

              if ( canContinue ) {
                let fechaSTR = JSON.stringify(cells[0]);
                let horaSTR = JSON.stringify(cells[1]);
                let valorACUMHSTR = JSON.stringify(cells[3]);
                let valorTempSTR = JSON.stringify(cells[5]);
                let valorHumSTR = JSON.stringify(cells[6]);
                let valorRadSTR = JSON.stringify(cells[7]);

                if ( !(fechaSTR.includes('T')) || (fechaSTR.split('T').length <= 1) ) {
                  this.arrayErrores += 'La fecha del registro NO es valida: [' + fechaSTR + ']. Registro NO Valido: [' + cells + '].\n';
                  console.error('La fecha del registro NO es valida: [' + fechaSTR + ']. Registro NO Valido: [' + cells + '].');
                  canContinue = false;

                } else if ( !(horaSTR.includes('T')) || (horaSTR.split('T').length <= 1) || !(horaSTR.split('T')[1].includes('.')) || horaSTR.split('T')[1].split('.').length <= 1 ) {
                  this.arrayErrores += 'La hora del registro NO es valida: [' + horaSTR + ']. Registro NO Valido: [' + cells + '].\n';
                  console.error('La hora del registro NO es valida: [' + horaSTR + ']. Registro NO Valido: [' + cells + '].');
                  canContinue = false;
                }

                if ( canContinue) {
                  // 1899-12-30T11:09:53.000Z
                  let miFecha = fechaSTR.split('T')[0].replace('\"', '');
                  let miHora = horaSTR.split('T')[1].split('.')[0].replace('\"', '');
                  let nuevaFechaSTR = miFecha + ' ' + miHora;
                  
                  // yyyy-MM-dd HH:mm:ss
                  let fecha = this.convertirAFecha(nuevaFechaSTR, fechas);
                  // let valor = this.convertirADecimal(valorSTR);

                  let valorACUMH = this.convertirADecimal(valorACUMHSTR);
                  let valorTemp = this.convertirADecimal(valorTempSTR);
                  let valorHum = this.convertirADecimal(valorHumSTR);
                  let valorRad = this.convertirADecimal(valorRadSTR);

                  if ( null == fecha ) {
                    this.arrayErrores += 'La fecha y hora del registro NO es valido: [' + nuevaFechaSTR + ']. Registro NO Valido: [' + cells + '].\n';
                    console.error('La fecha y hora del registro NO es valido: [' + nuevaFechaSTR + ']. Registro NO Valido: [' + cells + '].');
                    canContinue = false;

                  } else if ( null == valorACUMH ) {
                    this.arrayErrores += 'El valor de precipitación acumulada hora del registro NO es valido: [' + valorACUMHSTR + ']. Registro NO Valido: [' + cells + '].\n';
                    console.error('El valor de precipitación acumulada hora del registro NO es valido: [' + valorACUMHSTR + ']. Registro NO Valido: [' + cells + '].');
                    canContinue = false;

                  }  else if ( null == valorTemp ) {
                    this.arrayErrores += 'El valor de temperatura del registro NO es valido: [' + valorTempSTR + ']. Registro NO Valido: [' + cells + '].\n';
                    console.error('El valor de temperatura del registro NO es valido: [' + valorTempSTR + ']. Registro NO Valido: [' + cells + '].');
                    canContinue = false;

                  }  else if ( null == valorHum ) {
                    this.arrayErrores += 'El valor de humedad del registro NO es valido: [' + valorHumSTR + ']. Registro NO Valido: [' + cells + '].\n';
                    console.error('El valor de humedad del registro NO es valido: [' + valorHumSTR + ']. Registro NO Valido: [' + cells + '].');
                    canContinue = false;

                  }  else if ( null == valorRad ) {
                    this.arrayErrores += 'El valor de radiación del registro NO es valido: [' + valorRadSTR + ']. Registro NO Valido: [' + cells + '].\n';
                    console.error('El valor de radiación del registro NO es valido: [' + valorRadSTR + ']. Registro NO Valido: [' + cells + '].');
                    canContinue = false;
                  }

                  if ( canContinue ) {
                    let registrarACUMH = true;
                    let registrarTEMP = true;
                    let registrarHUM = true;
                    let registrarRAD = true;

                    let idACUMHParam = this.obtenerParametroPorCodigo(this.codigoClimatologiaACUMH);
                    console.info('Parametro ACUMH: Codigo: [' + this.codigoClimatologiaACUMH + '], ID: [' + idACUMHParam + ']');
                    if ( null==idACUMHParam || undefined==idACUMHParam ) {
                      this.arrayErrores += 'La estación/embalse/pozo seleccionado NO soporta el parámetro: [Precipitación Acumulada por hora].\n';
                      console.error('El ID del parámetro PRECIPITACION ACUMULADA HORA NO es válido. Código solicitado: [' + this.codigoClimatologiaACUMH + ']. Registro: [' + cells + '].');
                      //canContinue = false;
                      registrarACUMH = false;
                    }

                    let idTEMPParam = this.obtenerParametroPorCodigo(this.codigoClimatologiaTEMP);
                    console.info('Parametro TEMP: Codigo: [' + this.codigoClimatologiaTEMP + '], ID: [' + idTEMPParam + ']');
                    if ( null==idTEMPParam || undefined==idTEMPParam ) {
                      this.arrayErrores += 'La estación/embalse/pozo seleccionado NO soporta el parámetro: [Temperatura].\n';
                      console.error('El ID del parámetro TEMPERATURA NO es válido. Código solicitado: [' + this.codigoClimatologiaTEMP + ']. Registro: [' + cells + '].');
                      // canContinue = false;
                      registrarTEMP = false;
                    }

                    let idHUMParam = this.obtenerParametroPorCodigo(this.codigoClimatologiaHUM);
                    console.info('Parametro HUM: Codigo: [' + this.codigoClimatologiaHUM + '], ID: [' + idHUMParam + ']');
                    if ( null==idHUMParam || undefined==idHUMParam ) {
                      this.arrayErrores += 'La estación/embalse/pozo seleccionado NO soporta el parámetro: [Humedad].\n';
                      console.error('El ID del parámetro HUMEDAD NO es válido. Código solicitado: [' + this.codigoClimatologiaHUM + ']. Registro: [' + cells + '].');
                      // canContinue = false;
                      registrarHUM = false;
                    }

                    let idRADParam = this.obtenerParametroPorCodigo(this.codigoClimatologiaRAD);
                    console.info('Parametro RAD: Codigo: [' + this.codigoClimatologiaRAD + '], ID: [' + idRADParam + ']');
                    if ( null==idRADParam || undefined==idRADParam ) {
                      this.arrayErrores += 'La estación/embalse/pozo seleccionado NO soporta el parámetro: [Radiación].\n';
                      console.error('El ID del parámetro RADIACION NO es válido. Código solicitado: [' + this.codigoClimatologiaRAD + ']. Registro: [' + cells + '].');
                      // canContinue = false;
                      registrarRAD = false;
                    }

                    if ( canContinue ) {
                      if ( registrarACUMH ) {
                        let object = this.registrarValorAlParametro(consec, fecha, valorACUMH, idACUMHParam);
                        this.datosObservacionList.push(object);
                      }

                      if ( registrarTEMP ) {
                        let object = this.registrarValorAlParametro(consec, fecha, valorTemp, idTEMPParam);
                        this.datosObservacionList.push(object);
                      }
                      
                      if ( registrarHUM ) {
                        let object = this.registrarValorAlParametro(consec, fecha, valorHum, idHUMParam);
                        this.datosObservacionList.push(object);
                      }

                      if ( registrarRAD ) {
                        let object = this.registrarValorAlParametro(consec, fecha, valorRad, idRADParam);
                        this.datosObservacionList.push(object);
                      }
                      
                      if ( registrarACUMH || registrarTEMP || registrarHUM || registrarRAD ) {
                        consec++;
                        this.totalRegistrosEsperados++;
                      }
                    }
                  }
                }
              }              
            }
          });

          Swal.close();
          callback();
        });
      }, 
      willClose: async() => {
        Swal.hideLoading();
      }
    });
  }

  validarDatosFormatoClimatologiaHoja2(filePath: any, fechas: String[], consec: number, callback: Function) {
    Swal.fire({
      title: 'Validando datos de la segunda hoja...',
      html: 'Por favor espere',
      timerProgressBar: false,
      allowOutsideClick: false, 
      showConfirmButton: false,
      didOpen: async () => {
        Swal.showLoading();

        // Se procesan los registros de la Hoja: 2 (CCCAMPAMENTO2_2)
        readXlsxFile(filePath, {sheet: 2}).then((rows) => {
          // Se omite el primer registro, que corresponde a los encabezados de las columnas.
          rows.splice(0, 1);

          rows.forEach(cells => {
            let canContinue = true;
            //this.totalRegistrosEsperados++;

            if ( cells.length < 8 ) {
              this.arrayErrores += 'El registro debe tener al menos 8 columnas. Registro NO Valido: [' + cells + '].\n';
              console.error('El registro debe tener al menos 8 columnas. Registro NO Valido: [' + cells + '].');
              canContinue = false;
            } else {
              // Fecha
              if ( !(null!=cells[0]) && !(undefined!=cells[0]) ) {
                this.arrayErrores += 'La fecha del registro NO es valida: [' + cells[0] + ']. Registro NO Valido: [' + cells + '].\n';
                console.error('La fecha del registro NO es valida: [' + cells[0] + ']. Registro NO Valido: [' + cells + '].');
                canContinue = false;

              // Hora
              } else if ( !(null!=cells[1]) && !(undefined!=cells[1]) ) {
                this.arrayErrores += 'La hora del registro NO es valida: [' + cells[1] + ']. Registro NO Valido: [' + cells + '].\n';
                console.error('La hora del registro NO es valida: [' + cells[1] + ']. Registro NO Valido: [' + cells + '].');
                canContinue = false;

              // Valor Evaporación
              } else if ( !(null!=cells[2]) && !(undefined!=cells[2]) ) {
                this.arrayErrores += 'El valor de evaporación del registro NO es valido: [' + cells[2] + ']. Registro NO Valido: [' + cells + '].\n';
                console.error('El valor de evaporación del registro NO es valido: [' + cells[2] + ']. Registro NO Valido: [' + cells + '].');
                canContinue = false;
              }

              // Valor Presión Barométrica
              else if ( !(null!=cells[3]) && !(undefined!=cells[3]) ) {
                this.arrayErrores += 'El valor de presión barométrica del registro NO es valido: [' + cells[3] + ']. Registro NO Valido: [' + cells + '].\n';
                console.error('El valor de presión barométrica del registro NO es valido: [' + cells[3] + ']. Registro NO Valido: [' + cells + '].');
                canContinue = false;
              }
              
              // Valor Velocidad Viento
              else if ( !(null!=cells[4]) && !(undefined!=cells[4]) ) {
                this.arrayErrores += 'El valor de velocidad del viento del registro NO es valido: [' + cells[4] + ']. Registro NO Valido: [' + cells + '].\n';
                console.error('El valor de presión barométrica del registro NO es valido: [' + cells[3] + ']. Registro NO Valido: [' + cells + '].');
                canContinue = false;
              }
            
              // Valor Direccion Viento
              else if ( !(null!=cells[5]) && !(undefined!=cells[5]) ) {
                this.arrayErrores += 'El valor del registro NO es valido: [' + cells[5] + ']. Registro NO Valido: [' + cells + '].\n';
                console.error('El valor del registro NO es valido: [' + cells[5] + ']. Registro NO Valido: [' + cells + '].');
                canContinue = false;
              }

              if ( canContinue ) {
                let fechaSTR = JSON.stringify(cells[0]);
                let horaSTR = JSON.stringify(cells[1]);
                let valorEVAPSTR = JSON.stringify(cells[2]);
                let valorDBARSTR = JSON.stringify(cells[3]);
                let valorVVIENTOSTR = JSON.stringify(cells[4]);
                let valorDVIENTOSTR = JSON.stringify(cells[5]);

                if ( !(fechaSTR.includes('T')) || (fechaSTR.split('T').length <= 1) ) {
                  this.arrayErrores += 'La fecha del registro NO es valida: [' + fechaSTR + ']. Registro NO Valido: [' + cells + '].\n';
                  console.error('La fecha del registro NO es valida: [' + fechaSTR + ']. Registro NO Valido: [' + cells + '].');
                  canContinue = false;

                } else if ( !(horaSTR.includes('T')) || (horaSTR.split('T').length <= 1) || !(horaSTR.split('T')[1].includes('.')) || horaSTR.split('T')[1].split('.').length <= 1 ) {
                  this.arrayErrores += 'La hora del registro NO es valida: [' + horaSTR + ']. Registro NO Valido: [' + cells + '].\n';
                  console.error('La hora del registro NO es valida: [' + horaSTR + ']. Registro NO Valido: [' + cells + '].');
                  canContinue = false;
                }

                if ( canContinue) {
                  // 1899-12-30T11:09:53.000Z
                  let miFecha = fechaSTR.split('T')[0].replace('\"', '');
                  let miHora = horaSTR.split('T')[1].split('.')[0].replace('\"', '');
                  let nuevaFechaSTR = miFecha + ' ' + miHora;
                  
                  // yyyy-MM-dd HH:mm:ss
                  let fecha = this.convertirAFecha(nuevaFechaSTR, fechas);
                  // let valor = this.convertirADecimal(valorSTR);

                  let valorEVAP = this.convertirADecimal(valorEVAPSTR);
                  let valorDBAR = this.convertirADecimal(valorDBARSTR);
                  let valorVVIENTO = this.convertirADecimal(valorVVIENTOSTR);
                  let valorDVIENTO = this.convertirADecimal(valorDVIENTOSTR);

                  if ( null == fecha ) {
                    this.arrayErrores += 'La fecha y hora del registro NO es valido: [' + nuevaFechaSTR + ']. Registro NO Valido: [' + cells + '].\n';
                    console.error('La fecha y hora del registro NO es valido: [' + nuevaFechaSTR + ']. Registro NO Valido: [' + cells + '].');
                    canContinue = false;

                  } else if ( null == valorEVAP ) {
                    this.arrayErrores += 'El valor de precipitación acumulada hora del registro NO es valido: [' + valorEVAPSTR + ']. Registro NO Valido: [' + cells + '].\n';
                    console.error('El valor de precipitación acumulada hora del registro NO es valido: [' + valorEVAPSTR + ']. Registro NO Valido: [' + cells + '].');
                    canContinue = false;

                  }  else if ( null == valorDBAR ) {
                    this.arrayErrores += 'El valor de temperatura del registro NO es valido: [' + valorDBARSTR + ']. Registro NO Valido: [' + cells + '].\n';
                    console.error('El valor de temperatura del registro NO es valido: [' + valorDBARSTR + ']. Registro NO Valido: [' + cells + '].');
                    canContinue = false;

                  }  else if ( null == valorVVIENTO ) {
                    this.arrayErrores += 'El valor de humedad del registro NO es valido: [' + valorVVIENTOSTR + ']. Registro NO Valido: [' + cells + '].\n';
                    console.error('El valor de humedad del registro NO es valido: [' + valorVVIENTOSTR + ']. Registro NO Valido: [' + cells + '].');
                    canContinue = false;

                  }  else if ( null == valorDVIENTO ) {
                    this.arrayErrores += 'El valor de radiación del registro NO es valido: [' + valorDVIENTOSTR + ']. Registro NO Valido: [' + cells + '].\n';
                    console.error('El valor de radiación del registro NO es valido: [' + valorDVIENTOSTR + ']. Registro NO Valido: [' + cells + '].');
                    canContinue = false;
                  }

                  if ( canContinue ) {
                    let registrarEVAP = true;
                    let registrarDBAR = true;
                    let registrarVVIENTO = true;
                    let registrarDVIENTO = true;

                    let idEVAPParam = this.obtenerParametroPorCodigo(this.codigoClimatologiaEVAP);
                    console.info('Parametro EVAP: Codigo: [' + this.codigoClimatologiaEVAP + '], ID: [' + idEVAPParam + ']');
                    if ( null==idEVAPParam || undefined==idEVAPParam ) {
                      this.arrayErrores += 'La estación/embalse/pozo seleccionada NO soporta el parámetro: [Evaporación].\n';
                      console.error('El ID del parámetro de evaporación a procesar NO es válido. Código solicitado: [' + this.codigoClimatologiaEVAP + ']. Registro: [' + cells + '].');
                      // canContinue = false;
                      registrarEVAP = false;
                    }

                    let idDBARParam = this.obtenerParametroPorCodigo(this.codigoClimatologiaPATM);
                    console.info('Parametro DBAR: Codigo: [' + this.codigoClimatologiaPATM + '], ID: [' + idDBARParam + ']');
                    if ( null==idDBARParam || undefined==idDBARParam ) {
                      this.arrayErrores += 'La estación/embalse/pozo seleccionado NO soporta el parámetro: [Presión Atmosférica].\n';
                      console.error('El ID del parámetro de presión atmosférica NO es válido. Código solicitado: [' + this.codigoClimatologiaPATM + ']. Registro: [' + cells + '].');
                      // canContinue = false;
                      registrarDBAR = false;
                    }

                    let idVVIENTOParam = this.obtenerParametroPorCodigo(this.codigoClimatologiaVVIENTO);
                    console.info('Parametro VEL_VIENTO: Codigo: [' + this.codigoClimatologiaVVIENTO + '], ID: [' + idVVIENTOParam + ']');
                    if ( null==idVVIENTOParam || undefined==idVVIENTOParam ) {
                      this.arrayErrores += 'La estación/embalse/pozo seleccionado NO soporta el parámetro: [Velocidad del viento].\n';
                      console.error('El ID del parámetro de velocidad del viento NO es válido. Código solicitado: [' + this.codigoClimatologiaVVIENTO + ']. Registro: [' + cells + '].');
                      // canContinue = false;
                      registrarVVIENTO = false;
                    }

                    let idDVIENTOParam = this.obtenerParametroPorCodigo(this.codigoClimatologiaDVIENTO);
                    console.info('Parametro DBAR: Codigo: [' + this.codigoClimatologiaDVIENTO + '], ID: [' + idDVIENTOParam + ']');
                    if ( null==idDVIENTOParam || undefined==idDVIENTOParam ) {
                      this.arrayErrores += 'La estación/embalse/pozo seleccionado NO soporta el parámetro: [Dirección del Viento].\n';
                      console.error('El ID del parámetro dirección del viento a procesar NO es válido. Código solicitado: [' + this.codigoClimatologiaDVIENTO + ']. Registro: [' + cells + '].');
                      // canContinue = false;
                      registrarDVIENTO = false;
                    }

                    if ( canContinue ) {
                      if ( registrarEVAP ) {
                        let object = this.registrarValorAlParametro(consec, fecha, valorEVAP, idEVAPParam);
                        this.datosObservacionList.push(object);
                      }

                      if ( registrarDBAR ) {
                        let object = this.registrarValorAlParametro(consec, fecha, valorDBAR, idDBARParam);
                        this.datosObservacionList.push(object);
                      }

                      if ( registrarVVIENTO ) {
                        let object = this.registrarValorAlParametro(consec, fecha, valorVVIENTO, idVVIENTOParam);
                        this.datosObservacionList.push(object);
                      }

                      if ( registrarDVIENTO ) {
                        let object = this.registrarValorAlParametro(consec, fecha, valorDVIENTO, idDVIENTOParam);
                        this.datosObservacionList.push(object);
                      }

                      if ( registrarEVAP || registrarDBAR || registrarVVIENTO || registrarDVIENTO ) {
                        consec++;
                        this.totalRegistrosEsperados++;
                      }
                    }
                  }
                }
              }              
            }
          });

          Swal.close();
          callback();
        });
      }, 
      willClose: async() => {
        Swal.hideLoading();
      }
    });
  }
  
  cargarFormatoClimatologia(filePath : any) {
    let archivo = (<HTMLInputElement> document.getElementById('inputFileServer'));
    let archivoEtiqueta = document.getElementById('archivoNombre');
    
    if ( null!=archivo && undefined!=archivo && null!=archivoEtiqueta && undefined!=archivoEtiqueta ) {
      archivoEtiqueta.innerHTML = archivo.value;
      this.archivoRuta = archivo.value;
    }

    this.totalRegistrosEsperados = 0;
    this.datosObservacionList = [];

    let consec = 0;

    this.validarDatosFormatoClimatologiaHoja1(filePath, [], consec, () => {
      this.validarDatosFormatoClimatologiaHoja2(filePath, [], consec, () => {
        console.log("-- -------------------------");
        console.log("Observaciones a persistir: [" + this.datosObservacionList.length + "]...");
        console.log("-- -------------------------");
        if ( this.datosObservacionList.length > 0 ) {
          this.datosObservacionList.forEach(observ => {
            console.info("---> Observacion: [Fecha: " + this.formatearFecha(observ.fecha) + ", Valor: " + observ.valor + ", idParametroXEstacion: " + observ.idParametroXEstacion+ ", idParametroXEmbalse: " + observ.idParametroXEmbalse+ ", idParametroPorPozo: " + observ.idParametroPorPozo + "].");
          });
          console.log("-- -------------------------");
        }

        this.totalRegistrosEsperados *= 4;
      });
    });
  }

  cargarFormatoThalimedes(filePath : any) {
    let archivo = (<HTMLInputElement> document.getElementById('inputFileServer'));
    let archivoEtiqueta = document.getElementById('archivoNombre');
    
    if ( null!=archivo && undefined!=archivo && null!=archivoEtiqueta && undefined!=archivoEtiqueta ) {
      archivoEtiqueta.innerHTML = archivo.value;
      this.archivoRuta = archivo.value;
    }

    this.totalRegistrosEsperados = 0;
    this.datosObservacionList = [];

    let consec = 0;

    Swal.fire({
      title: 'Validando datos del archivo seleccionado...',
      html: 'Por favor espere',
      timerProgressBar: false,
      allowOutsideClick: false, 
      showConfirmButton: false,
      didOpen: async () => {
        Swal.showLoading();

        let mapaValoresForFecha = new Map();

        readXlsxFile(filePath).then((rows) => {
          let fechaSTR : any = null;

          rows.forEach(cells => {
            if ( cells.length < 1 ) {
              this.arrayErrores += 'El registro debe tener al menos 1 columna. Registro NO Valido: [' + cells + '].\n';
            } else if ( !(null!=cells[0]) || !(undefined!=cells[0]) ) {
              this.arrayErrores += 'La fecha del registro NO es valida: [' + cells[0] + ']. Registro NO Valido: [' + cells + '].\n';
            } else {
              let linea = JSON.stringify(cells[0]);
              let esFecha = this.esLineaFecha(linea);
              let esValorHora = this.esLineaValorHora(linea);

              if ( esFecha ) {
                let miFechaSTR = this.extraerSoloFechaDesdeLinea(linea);
                if ( null != miFechaSTR ) {
                  fechaSTR = miFechaSTR;
                  console.log('-- ---------------');
                  console.log('Fecha: ' + fechaSTR);
                  console.log('-- ---------------');
                }
              }

              if ( esValorHora ) {
                let miHora = this.extraerSoloHora(linea);
                let miValor = this.extraerSoloValor(linea);
                console.log('[Hora: ' + miHora + ', Valor: ' + miValor + ']');
              }

              if ( esValorHora && null!=fechaSTR ) {
                let valoresSTR = mapaValoresForFecha.get(fechaSTR);
                if ( null == valoresSTR ) {
                  valoresSTR = [];
                  mapaValoresForFecha.set(fechaSTR, valoresSTR);
                }
                valoresSTR.push(linea);
                this.totalRegistrosEsperados++;
              }
            }
          });

          mapaValoresForFecha.forEach((valoresHoraSTR, fechaSTR) => {
            valoresHoraSTR.forEach((valorHoraSTR : any) => {
              let horaSTR = this.extraerSoloHora(valorHoraSTR);
              let valor = this.extraerSoloValor(valorHoraSTR);

              let fecha = this.convertirAFechaHora(fechaSTR, horaSTR);
              if ( null==fecha || undefined==fecha ) {
                this.arrayErrores += 'La fecha: [' + fechaSTR + '] con hora: [' + horaSTR + '] NO son validos.\n';

              } else {
                let idParam = this.obtenerParametroPorCodigo(this.codigoThalimedesCAUDAL_INST);
                if ( null==idParam || undefined==idParam ) {
                  this.arrayErrores += 'El parametro solicitado no es correcto. Codigo solicitado: [' + this.codigoThalimedesCAUDAL_INST + ']. Parametro encontrado: [' + idParam + '].\n';

                } else {
                  console.log('-- -------------------------------------------------');
                  console.log('Fecha y hora solicitada: ' + fechaSTR + ' ' + horaSTR);
                  console.log('Fecha y hora a persistir: ' + fecha);
                  console.log('-- -------------------------------------------------');

                  let registro = this.registrarValorAlParametro(consec, fecha, valor, idParam);
                  this.datosObservacionList.push(registro);
                  consec++;
                }
              }
            });
          });
  
          Swal.close();
        });
      },
      willClose: async() => {
        Swal.hideLoading();
      }
    });
  }

  convertirAFechaHora(fechaSTR : string, horaSTR : string) : any {
    if ( null==fechaSTR || undefined==fechaSTR || fechaSTR.length==0 ) {
      return null;
    }

    if ( null==horaSTR || undefined==horaSTR || horaSTR.length==0 ) {
      return null;
    }

    // fechaSTR: 2022-11-19
    // horaSTR: 23:59:00
    let horaTokens = horaSTR.split(':');
    let hora = horaTokens[0];
    let min = horaTokens[1];
    let seg = horaTokens[2];

    if ( hora === '24' ) {

      console.log('-- -----------------------');
      console.log('Fecha con hora en 24:00:00');
      console.log('-- -----------------------');
      console.log('FechaSTR: ' + fechaSTR);
      console.log('HoraSTR: ' + horaSTR);
      console.log('min: ' + min + ', type: ' + (typeof min));
      console.log('seg: ' + seg + ', type: ' + (typeof seg));

      if ( min!=='00' || seg!=='00') {
        return null;
      }

      horaSTR = "00:00:00";
      let date: Date;
      date = this.convertirAFecha(fechaSTR + ' ' + horaSTR, []);

      console.log('-- -----------------------');
      console.log('Fecha sin traducir: ' + date);
      date.setDate(date.getDate() + 1);
      console.log('Fecha traducdia: ' + date);
      console.log('-- -----------------------');

      return date;
    }

    return this.convertirAFecha(fechaSTR + ' ' + horaSTR, []);
  }

  extraerSoloValor(linea : string) : any {
    if ( null==linea || undefined==linea || linea.length==0 ) {
      return null;
    }

    linea = this.removeAllCharacters(linea, "\"").trim();

    let tokens = linea.split(' ');
    
    // Valor
    let valorSTR = tokens[0];
    if ( valorSTR === '---' ) {
      return 0.0;
    }

    let valor = this.convertirADecimal(valorSTR);
    return valor;
  }

  extraerSoloHora(linea : string) : string {
    if ( null==linea || undefined==linea || linea.length==0 ) {
      return '';
    }

    linea = this.removeAllCharacters(linea, "\"").trim();
    let tokens = linea.split(' ');

    // Hora
    let horaSTR = tokens[2];
    horaSTR = this.removeAllCharacters(horaSTR, '(');
    horaSTR = this.removeAllCharacters(horaSTR, ')');
    let tokensHora = horaSTR.split(':');
    
    let horasSTR = tokensHora[0];
    let horas = parseInt(horasSTR, 10);
    
    let minutosSTR = tokensHora[1];
    let minutos = parseInt(minutosSTR, 10);

    let segundosSTR = tokensHora[2];
    let segundos = parseInt(segundosSTR, 10);

    return this.agregarCero(horas) + ':' + this.agregarCero(minutos) + ':' + this.agregarCero(segundos);
  }

  esLineaValorHora(linea: string) : boolean {
    if ( null==linea || undefined==linea || linea.length==0 ) {
      return false;
    }

    linea = this.removeAllCharacters(linea, "\"").trim();

    if ( !linea.includes('(') || !linea.includes(')') || !linea.includes(':') || !linea.includes(' ') ) {
      return false;
    }

    let tokens = linea.split(' ');
    if ( null==tokens || undefined==tokens || tokens.length!=3 ) {
      return false;
    }

    // Valor
    let valorSTR = tokens[0];
    if ( null==valorSTR || undefined==valorSTR || !(valorSTR.length!=0) || valorSTR.includes('(') || valorSTR.includes(')') || valorSTR.includes(':') ) {
      this.arrayErrores += 'La linea: [' + linea + '] contiene un valor NO válido. Valor: [' + valorSTR + ']\n';
      return false;
    }

    if ( valorSTR !== '---' ) {
      let valor = this.convertirADecimal(valorSTR);
      if ( null==valor || isNaN(valor) ) {
        this.arrayErrores += 'La linea: [' + linea + '] contiene un valor NO válido. Valor: [' + valorSTR + ']\n';
        return false;
      }
    }

    // Hora
    let horaSTR = tokens[2];
    if ( null==horaSTR || undefined==horaSTR || !(horaSTR.length!=0) || !horaSTR.includes('(') || !horaSTR.includes(')') || !horaSTR.includes(':') ) {
      this.arrayErrores += 'La linea: [' + linea + '] contiene una hora NO válida. Hora: [' + horaSTR + ']\n';
      return false;
    }

    if ( horaSTR.indexOf('(') != 0 ) {
      this.arrayErrores += 'La linea: [' + linea + '] contiene una hora NO válida. Hora: [' + horaSTR + ']\n';
      return false;
    }

    if ( horaSTR.indexOf(')') != horaSTR.length-1 ) {
      this.arrayErrores += 'La linea: [' + linea + '] contiene una hora NO válida. Hora: [' + horaSTR + ']\n';
      return false;
    }

    horaSTR = this.removeAllCharacters(horaSTR, '(');
    horaSTR = this.removeAllCharacters(horaSTR, ')');

    if ( horaSTR.indexOf('(') != -1 ) {
      this.arrayErrores += 'La linea: [' + linea + '] contiene una hora NO válida. Hora: [' + horaSTR + ']\n';
      return false;
    }

    if ( horaSTR.indexOf(')') != -1 ) {
      this.arrayErrores += 'La linea: [' + linea + '] contiene una hora NO válida. Hora: [' + horaSTR + ']\n';
      return false;
    }

    let tokensHora = horaSTR.split(':');
    if ( null==tokensHora || undefined==tokensHora || (tokensHora.length!=3) ) {
      this.arrayErrores += 'La linea: [' + linea + '] contiene una hora NO válida. Hora: [' + horaSTR + ']\n';
      return false;
    }
    
    let horasSTR = tokensHora[0];
    if ( null==horasSTR || undefined==horasSTR ) {
      this.arrayErrores += 'La linea: [' + linea + '] contiene una hora NO válida. Parámetro Hora: [' + horasSTR + ']\n';
      return false;
    }
    horasSTR = this.removeAllCharacters(horasSTR, '\"').trim();
    if ( !(horasSTR.length>=1 && horasSTR.length<=2) ) {
      this.arrayErrores += 'La linea: [' + linea + '] contiene una hora NO válida. Parámetro Hora: [' + horasSTR + ']\n';
      return false;
    }
    let horas = parseInt(horasSTR, 10);
    if ( isNaN(horas) ) {
      this.arrayErrores += 'La linea: [' + linea + '] contiene una hora NO válida. Parámetro Hora: [' + horasSTR + ']\n';
      return false;
    }
    if ( !(horas>=0 && horas<=24) ) {
      this.arrayErrores += 'La linea: [' + linea + '] contiene una hora NO válida. Parámetro Hora: [' + horasSTR + ']\n';
      return false;
    }

    let minutosSTR = tokensHora[1];
    if ( null==minutosSTR || undefined==minutosSTR ) {
      this.arrayErrores += 'La linea: [' + linea + '] contiene una hora NO válida. Parámetro Minuto: [' + minutosSTR + ']\n';
      return false;
    }
    minutosSTR = this.removeAllCharacters(minutosSTR, '\"').trim();
    if ( !(minutosSTR.length>=1 && minutosSTR.length<=2) ) {
      this.arrayErrores += 'La linea: [' + linea + '] contiene una hora NO válida. Parámetro Minuto: [' + minutosSTR + ']\n';
      return false;
    }
    let minutos = parseInt(minutosSTR, 10);
    if ( isNaN(minutos) ) {
      this.arrayErrores += 'La linea: [' + linea + '] contiene una hora NO válida. Parámetro Minuto: [' + minutosSTR + ']\n';
      return false;
    }
    if ( !(minutos>=0 && minutos<=59) ) {
      this.arrayErrores += 'La linea: [' + linea + '] contiene una hora NO válida. Parámetro Minuto: [' + minutosSTR + ']\n';
      return false;
    }

    let segundosSTR = tokensHora[2];
    if ( null==segundosSTR || undefined==segundosSTR || !(segundosSTR.length>=1 && segundosSTR.length<=2) ) {
      this.arrayErrores += 'La linea: [' + linea + '] contiene una hora NO válida. Parámetro Segundo: [' + segundosSTR + ']\n';
      return false;
    }
    segundosSTR = this.removeAllCharacters(segundosSTR, '\"').trim();
    if ( !(segundosSTR.length>=1 && segundosSTR.length<=2) ) {
      this.arrayErrores += 'La linea: [' + linea + '] contiene una hora NO válida. Parámetro Segundo: [' + segundosSTR + ']\n';
      return false;
    }
    let segundos = parseInt(segundosSTR, 10);
    if ( isNaN(segundos) ) {
      this.arrayErrores += 'La linea: [' + linea + '] contiene una hora NO válida. Parámetro Segundo: [' + segundosSTR + ']\n';
      return false;
    }
    if ( !(segundos>=0 && segundos<=59) ) {
      this.arrayErrores += 'La linea: [' + linea + '] contiene una hora NO válida. Parámetro Segundo: [' + segundosSTR + ']\n';
      return false;
    }

    return true;
  }

  removeAllCharacters(cadena : string, caracter : string) : string {
    if ( null==cadena || undefined==cadena || cadena.length==0 ) {
      return cadena;
    }

    if ( null==caracter || undefined==caracter || caracter.length==0 ) {
      return cadena;
    }

    do {
      cadena = cadena.replace(caracter, '');
    } while(cadena.indexOf(caracter) != -1);

    return cadena;
  }

  extraerSoloFechaDesdeLinea(linea: string) : string {
    if ( null==linea || undefined==linea || linea.length==0 ) {
      return '';
    }

    linea = this.removeAllCharacters(linea, "\"").trim();
    let fecha = linea.substring(linea.lastIndexOf(':')+1, linea.length);
    let tokens = fecha.split('/');

    // Dia
    let diaSTR = tokens[0];
    let dia = parseInt(diaSTR, 10);

    // Mes
    let mesSTR = tokens[1];
    let mes = parseInt(mesSTR, 10);
    
    // Año
    let anoSTR = tokens[2];
    let ano = parseInt(anoSTR, 10);

    //return '[' + ano + '-' + mes + '-' + dia + ']';
    return ano + '-' + mes + '-' + dia;
  }

  esLineaFecha(linea: string) : boolean {
    if ( null==linea || undefined==linea || linea.length==0 ) {
      return false;
    }

    if ( !linea.includes('Fecha: ') || !(linea.lastIndexOf('Fecha: ')+1<linea.length) || !(linea.lastIndexOf(':')+1<linea.length) ) {
      return false;
    }

    linea = this.removeAllCharacters(linea, "\"").trim();
    let fecha = linea.substring(linea.lastIndexOf(':')+1, linea.length);
    if ( null==fecha || undefined==fecha || fecha.length==0 || !fecha.includes('/') ) {
      return false;
    }

    let tokens = fecha.split('/');
    if ( null==tokens || undefined==tokens || tokens.length!=3 ) {
      return false;
    }

    // Dia
    let diaSTR = tokens[0];
    if ( null==diaSTR || undefined==diaSTR ) {
      this.arrayErrores += 'La linea: [' + linea + '] contiene una fecha NO válida. Día no reconocido. [' + diaSTR + ']\n';
      return false;
    }
    diaSTR = this.removeAllCharacters(diaSTR, "\"").trim();
    if ( !(diaSTR.length>=1 && diaSTR.length<=2) ) {
      this.arrayErrores += 'La linea: [' + linea + '] contiene una fecha NO válida. Día no reconocido. [' + diaSTR + ']\n';
      return false;
    }

    let dia = parseInt(diaSTR, 10);
    if ( isNaN(dia) ) {
      this.arrayErrores += 'La linea: [' + linea + '] contiene una fecha NO válida. Día no reconocido. [' + diaSTR + ']\n';
      return false;
    }
    if ( !(dia>=1 && dia<=31) ) {
      this.arrayErrores += 'La linea: [' + linea + '] contiene una fecha NO válida. Día no reconocido. [' + diaSTR + ']\n';
      return false;
    }

    // Mes
    let mesSTR = tokens[1];
    if ( null==mesSTR || undefined==mesSTR ) {
      this.arrayErrores += 'La linea: [' + linea + '] contiene una fecha NO válida. Mes no reconocido. [' + mesSTR + ']\n';
      return false;
    }
    mesSTR = this.removeAllCharacters(mesSTR, "\"").trim();
    if ( !(mesSTR.length>=1 && mesSTR.length<=2) ) {
      this.arrayErrores += 'La linea: [' + linea + '] contiene una fecha NO válida. Mes no reconocido. [' + mesSTR + ']\n';
      return false;
    }
    let mes = parseInt(mesSTR, 10);
    if ( isNaN(mes) ) {
      this.arrayErrores += 'La linea: [' + linea + '] contiene una fecha NO válida. Mes no reconocido. [' + mesSTR + ']\n';
      return false;
    }
    if ( !(mes>=1 && mes<=12) ) {
      this.arrayErrores += 'La linea: [' + linea + '] contiene una fecha NO válida. Mes no reconocido. [' + mesSTR + ']\n';
      return false;
    }

    // Año
    let anoSTR = tokens[2];
    if ( null==anoSTR || undefined==anoSTR ) {
      this.arrayErrores += 'La linea: [' + linea + '] contiene una fecha NO válida. Año no reconocido. [' + anoSTR + ']\n';
      return false;
    }
    anoSTR = this.removeAllCharacters(anoSTR, "\"").trim();
    if ( anoSTR.length != 4 ) {
      this.arrayErrores += 'La linea: [' + linea + '] contiene una fecha NO válida. Año no reconocido. [' + anoSTR + ']\n';
      return false;
    }
    let ano = parseInt(anoSTR, 10);
    if ( isNaN(ano) ) {
      this.arrayErrores += 'La linea: [' + linea + '] contiene una fecha NO válida. Año no reconocido. [' + anoSTR + ']\n';
      return false;
    }
    if ( !(ano>=1900 && ano<=new Date().getFullYear()) ) {
      this.arrayErrores += 'La linea: [' + linea + '] contiene una fecha NO válida. Año NO valido: ' + ano + 'Valores permitidos entre (1900 - ' + new Date().getFullYear() + ').\n';
      return false;
    }

    // let utcDate = new Date(Date.UTC(ano, mes-1, dia));
    let localDate = new Date(ano, mes-1, dia);

    if ( localDate > new Date() ) {
      this.arrayErrores += "La línea: [" + linea + '] contiene una fecha mayor a la actual (' + (this.formatearFecha(new Date())) + ').' + '\n';
      return false;
    }

    return true;
  }

  registrarValorAlParametro(consec: number, miFecha: Date, miValor : number, miIdParam: number) {
    let myObject = {
      idParametroPorPozo: this.fmrCargueArchivo.value.rbTipoParametro=='3' ? miIdParam : null,
      idParametroXEstacion: this.fmrCargueArchivo.value.rbTipoParametro=='1' ? miIdParam : null,
      idParametroXEmbalse: this.fmrCargueArchivo.value.rbTipoParametro=='2' ? miIdParam : null,

      activo: activo.Si,
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

    return myObject;
  }

  cargarFormatoPrecipitacion(filePath : any) {
    let archivo = (<HTMLInputElement> document.getElementById('inputFileServer'));
    let archivoEtiqueta = document.getElementById('archivoNombre');
    
    if ( null!=archivo && undefined!=archivo && null!=archivoEtiqueta && undefined!=archivoEtiqueta ) {
      archivoEtiqueta.innerHTML = archivo.value;
      this.archivoRuta = archivo.value;
    }
    
    this.totalRegistrosEsperados = 0;
    this.datosObservacionList = [];

    let fechas : String[] = [];
    let consec = 0;

    Swal.fire({
      title: 'Validando datos del archivo seleccionado...',
      html: 'Por favor espere',
      timerProgressBar: false,
      allowOutsideClick: false, 
      showConfirmButton: false,
      didOpen: async () => {
        Swal.showLoading();
        
        readXlsxFile(filePath).then((rows) => {
          rows.splice(0, 1);
          rows.forEach(cells => {
            this.totalRegistrosEsperados++;

            if ( cells.length < 10 ) {
              this.arrayErrores += 'El registro debe tener al menos 10 columnas. Registro NO Valido: [' + cells + '].\n';
            } else {
              let canContinue = true;

              if ( !(null!=cells[0]) && !(undefined!=cells[0]) ) {
                this.arrayErrores += 'La fecha del registro NO es valida: [' + cells[0] + ']. Registro NO Valido: [' + cells + '].\n';
                canContinue = false;

              } else if ( !(null!=cells[1]) && !(undefined!=cells[1]) ) {
                this.arrayErrores += 'La hora del registro NO es valida: [' + cells[1] + ']. Registro NO Valido: [' + cells + '].\n';
                canContinue = false;

              } else if ( !(null!=cells[9]) && !(undefined!=cells[9]) ) {
                this.arrayErrores += 'El valor del registro NO es valido: [' + cells[9] + ']. Registro NO Valido: [' + cells + '].\n';
                canContinue = false;
              }

              if ( canContinue ) {

                let fechaSTR = JSON.stringify(cells[0]);
                let horaSTR = JSON.stringify(cells[1]);
                let valorSTR = JSON.stringify(cells[8]);

                if ( !(fechaSTR.includes('T')) || (fechaSTR.split('T').length <= 1) ) {
                  this.arrayErrores += 'La fecha del registro NO es valida: [' + fechaSTR + ']. Registro NO Valido: [' + cells + '].\n';
                  canContinue = false;

                } else if ( !(horaSTR.includes('T')) || (horaSTR.split('T').length <= 1) || !(horaSTR.split('T')[1].includes('.')) || horaSTR.split('T')[1].split('.').length <= 1 ) {
                  this.arrayErrores += 'La hora del registro NO es valida: [' + horaSTR + ']. Registro NO Valido: [' + cells + '].\n';
                  canContinue = false;
                }

                if ( canContinue) {
                  // 1899-12-30T11:09:53.000Z
                  let miFecha = fechaSTR.split('T')[0].replace('\"', '');
                  let miHora = horaSTR.split('T')[1].split('.')[0].replace('\"', '');
                  let nuevaFechaSTR = miFecha + ' ' + miHora;
                  
                  // yyyy-MM-dd HH:mm:ss
                  let fecha = this.convertirAFecha(nuevaFechaSTR, fechas);
                  let valor = this.convertirADecimal(valorSTR);

                  if ( null == fecha ) {
                    this.arrayErrores += 'La fecha y hora del registro NO es valido: [' + nuevaFechaSTR + ']. Registro NO Valido: [' + cells + '].\n';
                    canContinue = false;

                  } else if ( null == valor ) {
                    this.arrayErrores += 'El valor del registro NO es valido: [' + valorSTR + ']. Registro NO Valido: [' + cells + '].\n';
                    canContinue = false;
                  }

                  if ( canContinue ) {
                    let idParametro = this.obtenerParametroPorCodigo(this.codigoPrecipitacionACUMH);
                    if ( null==idParametro || undefined==idParametro ) {
                      this.arrayErrores += 'El ID del parámetro a procesar NO es válido. Código solicitado: [' + this.codigoPrecipitacionACUMH + ']. Registro: [' + cells + '].\n';
                      canContinue = false;
                    }

                    if ( canContinue ) {
                      let myObject = {
                        idParametroPorPozo: this.fmrCargueArchivo.value.rbTipoParametro=='3' ? idParametro : null,
                        idParametroXEstacion: this.fmrCargueArchivo.value.rbTipoParametro=='1' ? idParametro : null,
                        idParametroXEmbalse: this.fmrCargueArchivo.value.rbTipoParametro=='2' ? idParametro : null,

                        activo: activo.Si,
                        fecha: fecha,
                        valor: valor,
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
                    }
                  }
                }
              }
            }
          });

          console.log("-- -------------------------");
          console.log("Observaciones a persistir: [" + this.datosObservacionList.length + "]...");
          console.log("-- -------------------------");
          if ( this.datosObservacionList.length > 0 ) {
            this.datosObservacionList.forEach(observ => {
              console.info("---> Observacion: [Fecha: " + this.formatearFecha(observ.fecha) + ", Valor: " + observ.valor + ", idParametroXEstacion: " + observ.idParametroXEstacion+ ", idParametroXEmbalse: " + observ.idParametroXEmbalse+ ", idParametroPorPozo: " + observ.idParametroPorPozo + "].");
            });
            console.log("-- -------------------------");
          }

          Swal.close();
        });
      }, willClose: async() => {
        Swal.hideLoading();
      }
    });
  }

  cargarFormatoSensor(filePath : any) {
    let archivo = (<HTMLInputElement> document.getElementById('inputFileServer'));
    let archivoEtiqueta = document.getElementById('archivoNombre');
    
    if ( null!=archivo && undefined!=archivo && null!=archivoEtiqueta && undefined!=archivoEtiqueta ) {
      archivoEtiqueta.innerHTML = archivo.value;
      this.archivoRuta = archivo.value;
    }
    
    this.totalRegistrosEsperados = 0;
    this.datosObservacionList = [];

    let fechas : String[] = [];
    let consec = 0;

    Swal.fire({
      title: 'Validando datos del archivo seleccionado...',
      html: 'Por favor espere',
      timerProgressBar: false,
      allowOutsideClick: false, 
      showConfirmButton: false,
      didOpen: async () => {
        Swal.showLoading();
        
        readXlsxFile(filePath).then((rows) => {
          rows.splice(0, 1);
          rows.forEach(cells => {
            this.totalRegistrosEsperados++;

            if ( cells.length < 10 ) {
              this.arrayErrores += 'El registro debe tener al menos 10 columnas. Registro NO Valido: [' + cells + '].\n';
            } else {
              let canContinue = true;

              if ( !(null!=cells[0]) && !(undefined!=cells[0]) ) {
                this.arrayErrores += 'La fecha del registro NO es valida: [' + cells[0] + ']. Registro NO Valido: [' + cells + '].\n';
                canContinue = false;

              } else if ( !(null!=cells[1]) && !(undefined!=cells[1]) ) {
                this.arrayErrores += 'La hora del registro NO es valida: [' + cells[1] + ']. Registro NO Valido: [' + cells + '].\n';
                canContinue = false;

              } else if ( !(null!=cells[8]) && !(undefined!=cells[8]) ) {
                this.arrayErrores += 'El valor del registro NO es valido: [' + cells[9] + ']. Registro NO Valido: [' + cells + '].\n';
                canContinue = false;
              }

              if ( canContinue ) {

                let fechaSTR = JSON.stringify(cells[0]);
                let horaSTR = JSON.stringify(cells[1]);
                let valorSTR = JSON.stringify(cells[8]);

                if ( !(fechaSTR.includes('T')) || (fechaSTR.split('T').length <= 1) ) {
                  this.arrayErrores += 'La fecha del registro NO es valida: [' + fechaSTR + ']. Registro NO Valido: [' + cells + '].\n';
                  canContinue = false;

                } else if ( !(horaSTR.includes('T')) || (horaSTR.split('T').length <= 1) || !(horaSTR.split('T')[1].includes('.')) || horaSTR.split('T')[1].split('.').length <= 1 ) {
                  this.arrayErrores += 'La hora del registro NO es valida: [' + horaSTR + ']. Registro NO Valido: [' + cells + '].\n';
                  canContinue = false;
                }

                if ( canContinue) {
                  // 1899-12-30T11:09:53.000Z
                  let miFecha = fechaSTR.split('T')[0].replace('\"', '');
                  let miHora = horaSTR.split('T')[1].split('.')[0].replace('\"', '');
                  let nuevaFechaSTR = miFecha + ' ' + miHora;
                  
                  // yyyy-MM-dd HH:mm:ss
                  let fecha = this.convertirAFecha(nuevaFechaSTR, fechas);
                  let valor = this.convertirADecimal(valorSTR);

                  if ( null == fecha ) {
                    this.arrayErrores += 'La fecha y hora del registro NO es valido: [' + nuevaFechaSTR + ']. Registro NO Valido: [' + cells + '].\n';
                    canContinue = false;

                  } else if ( null == valor ) {
                    this.arrayErrores += 'El valor del registro NO es valido: [' + valorSTR + ']. Registro NO Valido: [' + cells + '].\n';
                    canContinue = false;
                  }

                  if ( canContinue ) {
                    let idParametro = this.obtenerParametroPorCodigo(this.codigoSensorNIVEL_INST);
                    if ( null==idParametro || undefined==idParametro ) {
                      this.arrayErrores += 'El ID del parámetro a procesar NO es válido. Código solicitado: [' + this.codigoSensorNIVEL_INST + ']. Registro: [' + cells + '].\n';
                      canContinue = false;
                    }

                    if ( canContinue ) {
                      let myObject = {
                        idParametroPorPozo: this.fmrCargueArchivo.value.rbTipoParametro=='3' ? idParametro : null,
                        idParametroXEstacion: this.fmrCargueArchivo.value.rbTipoParametro=='1' ? idParametro : null,
                        idParametroXEmbalse: this.fmrCargueArchivo.value.rbTipoParametro=='2' ? idParametro : null,

                        activo: activo.Si,
                        fecha: fecha,
                        valor: valor,
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
                    }
                  }
                }
              }
            }
          });

          console.log("-- -------------------------");
          console.log("Observaciones a persistir: [" + this.datosObservacionList.length + "]...");
          console.log("-- -------------------------");
          if ( this.datosObservacionList.length > 0 ) {
            this.datosObservacionList.forEach(observ => {
              console.info("---> Observacion: [Fecha: " + this.formatearFecha(observ.fecha) + ", Valor: " + observ.valor + ", idParametroXEstacion: " + observ.idParametroXEstacion+ ", idParametroXEmbalse: " + observ.idParametroXEmbalse+ ", idParametroPorPozo: " + observ.idParametroPorPozo + "].");
            });
            console.log("-- -------------------------");
          }

          Swal.close();
        });
      }, willClose: async() => {
        Swal.hideLoading();
      }
    });
  }

  cargarFormatoVino(filePath : any) {
    let archivo = (<HTMLInputElement> document.getElementById('inputFileServer'));
    let archivoEtiqueta = document.getElementById('archivoNombre');
    
    if ( null!=archivo && undefined!=archivo && null!=archivoEtiqueta && undefined!=archivoEtiqueta ) {
      archivoEtiqueta.innerHTML = archivo.value;
      this.archivoRuta = archivo.value;
    }
    
    this.totalRegistrosEsperados = 0;
    this.datosObservacionList = [];

    let fechas : String[] = [];
    let consec = 0;

    Swal.fire({
      title: 'Validando datos del archivo seleccionado...',
      html: 'Por favor espere',
      timerProgressBar: false,
      allowOutsideClick: false, 
      showConfirmButton: false,
      didOpen: async () => {
        Swal.showLoading();

        let nombres :any[] = [];
        
        readXlsxFile(filePath).then((rows) => {
          rows.splice(0, 1);
          rows.forEach(cells => {
            this.totalRegistrosEsperados++;

            if ( cells.length < 4 ) {
              this.arrayErrores += 'El registro debe tener al menos 4 columnas. Registro NO Valido: [' + cells + '].\n';
            } else {
              let canContinue = true;

              // Fecha
              if ( !(null!=cells[0]) && !(undefined!=cells[0]) ) {
                this.arrayErrores += 'La fecha del registro NO es valida: [' + cells[0] + ']. Registro NO Valido: [' + cells + '].\n';
                canContinue = false;

              // Hora
              } else if ( !(null!=cells[1]) && !(undefined!=cells[1]) ) {
                this.arrayErrores += 'La hora del registro NO es valida: [' + cells[1] + ']. Registro NO Valido: [' + cells + '].\n';
                canContinue = false;

              // Nombre Parametro
              } else if ( !(null!=cells[2]) && !(undefined!=cells[2]) ) {
                this.arrayErrores += 'El valor del registro NO es valido: [' + cells[9] + ']. Registro NO Valido: [' + cells + '].\n';
                canContinue = false;

              // Valor
              } else if ( !(null!=cells[3]) && !(undefined!=cells[3]) ) {
                this.arrayErrores += 'El valor del registro NO es valido: [' + cells[9] + ']. Registro NO Valido: [' + cells + '].\n';
                canContinue = false;
              }

              if ( canContinue ) {
                let nombreParametro = cells[2];
                
                if ( !nombres.includes(nombreParametro) ) {
                  nombres.push(nombreParametro);
                }

              }

              /*
              if ( canContinue ) {

                let fechaSTR = JSON.stringify(cells[0]);
                let horaSTR = JSON.stringify(cells[1]);
                let valorSTR = JSON.stringify(cells[8]);

                if ( !(fechaSTR.includes('T')) || (fechaSTR.split('T').length <= 1) ) {
                  this.arrayErrores += 'La fecha del registro NO es valida: [' + fechaSTR + ']. Registro NO Valido: [' + cells + '].\n';
                  canContinue = false;

                } else if ( !(horaSTR.includes('T')) || (horaSTR.split('T').length <= 1) || !(horaSTR.split('T')[1].includes('.')) || horaSTR.split('T')[1].split('.').length <= 1 ) {
                  this.arrayErrores += 'La hora del registro NO es valida: [' + horaSTR + ']. Registro NO Valido: [' + cells + '].\n';
                  canContinue = false;
                }

                if ( canContinue) {
                  // 1899-12-30T11:09:53.000Z
                  let miFecha = fechaSTR.split('T')[0].replace('\"', '');
                  let miHora = horaSTR.split('T')[1].split('.')[0].replace('\"', '');
                  let nuevaFechaSTR = miFecha + ' ' + miHora;
                  
                  // yyyy-MM-dd HH:mm:ss
                  let fecha = this.convertirAFecha(nuevaFechaSTR, fechas);
                  let valor = this.convertirADecimal(valorSTR);

                  if ( null == fecha ) {
                    this.arrayErrores += 'La fecha y hora del registro NO es valido: [' + nuevaFechaSTR + ']. Registro NO Valido: [' + cells + '].\n';
                    canContinue = false;

                  } else if ( null == valor ) {
                    this.arrayErrores += 'El valor del registro NO es valido: [' + valorSTR + ']. Registro NO Valido: [' + cells + '].\n';
                    canContinue = false;
                  }

                  if ( canContinue ) {
                    let idParametro = this.obtenerParametroPorCodigo(this.codigoSensorNIVEL_INST);
                    if ( null==idParametro || undefined==idParametro ) {
                      this.arrayErrores += 'El ID del parámetro a procesar NO es válido. Código solicitado: [' + this.codigoSensorNIVEL_INST + ']. Registro: [' + cells + '].\n';
                      canContinue = false;
                    }

                    if ( canContinue ) {
                      let myObject = {
                        idParametroPorPozo: this.fmrCargueArchivo.value.rbTipoParametro=='3' ? idParametro : null,
                        idParametroXEstacion: this.fmrCargueArchivo.value.rbTipoParametro=='1' ? idParametro : null,
                        idParametroXEmbalse: this.fmrCargueArchivo.value.rbTipoParametro=='2' ? idParametro : null,

                        activo: activo.Si,
                        fecha: fecha,
                        valor: valor,
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
                    }
                  }
                }
              }
              */
            }
          });

          /*
          console.log("-- -------------------------");
          console.log("Observaciones a persistir: [" + this.datosObservacionList.length + "]...");
          console.log("-- -------------------------");
          if ( this.datosObservacionList.length > 0 ) {
            this.datosObservacionList.forEach(observ => {
              console.info("---> Observacion: [Fecha: " + this.formatearFecha(observ.fecha) + ", Valor: " + observ.valor + ", idParametroXEstacion: " + observ.idParametroXEstacion+ ", idParametroXEmbalse: " + observ.idParametroXEmbalse+ ", idParametroPorPozo: " + observ.idParametroPorPozo + "].");
            });
            console.log("-- -------------------------");
          }
          */

          nombres.forEach(nombre => {
            console.log(nombre);
          });

          Swal.close();
        });
      }, willClose: async() => {
        Swal.hideLoading();
      }
    });
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

      //console.log('-- -------------');
      //console.log('Ano: ' + ano);
      //console.log('Mes: ' + mes);
      //console.log('Dia: ' + dia);
      //console.log('Hora: ' + hora);
      //console.log('Minuto: ' + min);
      //console.log('Segundo: ' + seg);
      //console.log('Fecha-Hora: ' + ano + '/' + mes + '/' + dia + ' ' + hora + ':' +  min + ':' + seg);

      let utcDate = new Date(Date.UTC(ano, mes-1, dia, hora, min, seg));
      let localDate = new Date(ano, mes-1, dia, hora, min, seg);

      console.log('-- -------------');
      console.log('Fecha UTC: ' + utcDate);
      console.log('Fecha Local: ' + localDate);
      console.log('-- -------------');

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

  agregarCero(dato : number) : string {
    if ( null==dato || undefined==dato ) {
      return "";
    }

    if ( dato < 10 ) {
      return '0' + dato;
    }

    return '' + dato;
  }

  reiniciarValores() {
    this.idElemento = 0;
    this.idParametro = 0;
    this.idFlag = 0;

    let archivo = document.getElementById('inputFileServer');
    let archivoEtiqueta = document.getElementById('archivoNombre');
    if ( null!=archivo && undefined!=archivo && null!=archivoEtiqueta && undefined!=archivoEtiqueta ) {
      archivo.setAttribute('value', '');
      archivoEtiqueta.innerHTML = 'Examinar';
      this.archivoRuta = '';
    }

    this.listaNombreParametros = [];
    this.listaCodigoParametros = [];
    
    this.porcentaje = 0;
    this.arrayErrores = '';
    this.totalRegistrosEsperados = 0;
    this.totalRegistrosCargados = 0;
    this.totalRegistrosErrores = 0;
  }

  cambioParametro(e:any) {
    this.reiniciarValores();

    switch(e.target.value){
      case '1': 
        this.rbTipoParametro = 1
        break;

      case '2':
        this.rbTipoParametro = 2
        break;

      case '3':
        this.rbTipoParametro = 3
        break;

      default:
        this.rbTipoParametro = 0
        break;
    }
  }
}
