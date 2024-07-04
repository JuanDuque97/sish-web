import { ServiciosObservacionesEstacionService } from './../../../../observaciones/servicios-observaciones-estacion.service';
import { ServiciosObservacionesEmbalsesService } from './../../../../observaciones/servicios-observaciones-embalses.service';
import { ServiciosObservacionesPozosService } from './../../../../observaciones/servicios-observaciones-pozos.service';
import { dominiosEnum } from './../../../../../modelo/enum/dominios-enum';
import { ServiciosDominiosValoresService } from './../../../dominios/servicios-dominios-valores.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { activo } from 'src/app/modelo/enum/cargue-archivo-enum';
import { ProcesarArchivosService } from '../../servicios/procesar-archivos.sercevice';
import { ITipoArchivoCampoDTO } from 'src/app/modelo/configuracion/tipoArchivoColumnaCampo';
import Swal from 'sweetalert2';
import { ServiciosParametrosService } from 'src/app/modulos/parametros/servicios-parametros.service';
import { ServiciosParametrosEstacionesService } from 'src/app/modulos/elementos/estaciones/servicios-parametros-estaciones.service';
import { ServiciosParametrosEmbalseService } from 'src/app/modulos/elementos/embalses/servicios-parametros-embalse.service';
import { ServiciosParametrosPozosService } from 'src/app/modulos/elementos/pozos/servicios-parametros-pozos.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cargarapida',
  templateUrl: './cargarapida.component.html'
})

export class CargarapidaComponent implements OnInit {
  public formatoFecha : string = 'yyyy-MM-dd';
  public formatoHora : string = 'HH:mm:ss';
  public formatoFechaHora : string = this.formatoFecha + " " + this.formatoHora;
  public separadorCampos : string = ',';
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
  public idParametro : number = 0;
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
    private serviciosParametrosService: ServiciosParametrosService,
    private servicioParametrosEstacion: ServiciosParametrosEstacionesService,
    private servicioParametrosEmbalse: ServiciosParametrosEmbalseService,
    private servicioParametrosPozo: ServiciosParametrosPozosService,
    private route: ActivatedRoute,
    private router: Router,
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
    this.cargarDatos();
  }

  cargarDatos() {
    Swal.fire({
      title: 'Cargando...',
      html: 'Por favor espere',
      allowOutsideClick: false, 
      showConfirmButton: false,
      didOpen: async() => {
        Swal.showLoading();

        this.cargarEstaciones(() => {
          this.cargarEmbalses(() => {
            this.cargarPozos(() => {
              this.cargarFlags(() => {
                Swal.close();
              });
            });
          });
        });

      }, willClose: async() => {
        Swal.hideLoading();
      }
    });
  }

  cargarEstaciones(callback : Function) {
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

  cargarEmbalses(callback : Function) {
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

  cargarPozos(callback : Function) {
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
                }));
                
                this.listaCodigoParametros = response.map((elemento: any) => ({
                  id: elemento.idParametroXEstacion,
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

    if ( !this.idParametro ) {
      //console.error("--> El parámetro seleccionado NO es válido.");
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

          switch (this.fmrCargueArchivo.value.rbTipoParametro) {

            // Estaciones
            case "1":
              this.datosObservacionList.forEach(observ => {
                observ.idParametroXEstacion = this.idParametro;
              });

              let arrayCopyEst = [] as any;
              arrayCopyEst = [...this.datosObservacionList];

              await this.serviciosObservacionesEstacionService
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

                  this.arrayErrores += causasFallo;
                  this.porcentaje = 100;
                  this.totalRegistrosCargados = registradas.length;
                  this.totalRegistrosErrores = this.totalRegistrosEsperados - this.totalRegistrosCargados;

                  Swal.close();
            });
            break;

            // Embalses
            case "2":
              this.datosObservacionList.forEach(observ => {
                observ.idParametroXEmbalse = this.idParametro;
              });
              
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
              });
              break;
              
              // Pozos
            case "3":
              this.datosObservacionList.forEach(observ => {
                observ.idParametroXPozo = this.idParametro;
              });
              
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

  cambioParametro(e:any) {
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
