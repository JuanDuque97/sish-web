import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { dominiosEnum } from 'src/app/modelo/enum/dominios-enum';
import Swal from 'sweetalert2';
import { ServiciosDominiosValoresService } from '../../configuracion/dominios/servicios-dominios-valores.service';
import { ServiciosEmbalcesService } from '../../elementos/embalses/servicios-embalses.service';
import { ServiciosParametrosEmbalseService } from '../../elementos/embalses/servicios-parametros-embalse.service';
import { ServiciosEstacionesService } from '../../elementos/estaciones/servicios-estaciones.service';
import { ServiciosParametrosPozosService } from '../../elementos/pozos/servicios-parametros-pozos.service';
import { ServiciosPozosService } from '../../elementos/pozos/servicios-pozos.service';
import { ServiciosParametrosEstacionesService } from '../../elementos/estaciones/servicios-parametros-estaciones.service';
import { map } from 'rxjs/operators';
import { estados, OrigenObservacion } from '../../../common/utils/constantes';
import { ServiciosObservacionesEstacionService } from '../servicios-observaciones-estacion.service';
import { ServiciosObservacionesPozosService } from '../servicios-observaciones-pozos.service';
import { ServiciosObservacionesEmbalsesService } from '../servicios-observaciones-embalses.service';
import { IObservacionesConsulta } from 'src/app/modelo/observaciones/observacionesConsulta';
import { activo } from '../../../modelo/enum/cargue-archivo-enum';

@Component({
  selector: 'app-guardar-obsercaciones',
  templateUrl: './guardar-obsercaciones.component.html',
})
export class GuardarObsercacionesComponent implements OnInit {
  public id: string = '0';
  public ac: string = 'c';
  public te: string = '0';
  public elemento: number = 1;
  public idElemento: number = 0;
  public idParametro: number = 0;
  public listaCodigoEAAB: any = [];
  public formularioObservaciones!: FormGroup;
  public listaCodigoIDEAM: any = [];
  public fechaObservacion: any;
  public Estacion: any;
  public NombresParametros: any = [];

  public CodigoParametros: any = [];

  public listaFrecuencia: any = [];
  public newlistaFrecuencia: any = [];

  public listaFrecuenciaXParametro: any = [];
  public listaElemento: any = [];
  public listaflag: any = [];
  public fechaActual: string;
  public fechaActualMensual: string;
  public fechaActualHora: string;
  public fecha: string;
  public fechaAno: number;
  public fechaMes: string;

  public usuario = JSON.parse(sessionStorage.getItem('usuario') || '{}');

  public valor: number;
  public flag: number = 0;
  public origen: string;
  public idfrecuencia: number;

  datosFilter = [] as any;

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
  listParametros: any = [];
  constructor(
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
    private serviciosObservacionesEstacionService: ServiciosObservacionesEstacionService,
    private serviciosObservacionesPozosService: ServiciosObservacionesPozosService,
    private serviciosObservacionesEmbalsesService: ServiciosObservacionesEmbalsesService
  ) { }

  ngOnInit(): void {
 


    this.id = this.route.snapshot.paramMap.get('id')!;
    this.ac = this.route.snapshot.paramMap.get('ac')!;
    this.te = this.route.snapshot.paramMap.get('te')!;
    this.construirFormulario();
    var fecha = new Date(); //Fecha actual
    var mes: any = fecha.getMonth() + 1; //obteniendo mes
    var dia: any = fecha.getDate(); //obteniendo dia
    var ano: any = fecha.getFullYear();
    var  hora: any = fecha.getHours() + 1; //obteniendo mes
    var min: any = fecha.getMinutes(); //obteniendo dia
    var seg: any = fecha.getSeconds();
    var segMil: any = fecha.getMilliseconds();
    if (dia < 10) {
      dia = '0' + dia; //agrega cero si el menor de 10
    }
    if (mes < 10) {
      mes = '0' + mes;
    }
    var today:any = new Date();
    var dd:any = today.getDate();
    var mm:any = today.getMonth() + 1;
    var yyyy:any = today.getFullYear();
    //
    var hh = today.getHours();
    var m = today.getMinutes();

    if (dd < 10) {
      dd = '0' + dd;
    }

    if (mm < 10) {
      mm = '0' + mm;
    }
        
today = yyyy + "-" + mm + "-" + dd + "T" + hh + ":" + m;
    var hours = fecha.getHours();
    var minutes:any = fecha.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    this.fechaActual = ano + '-' + mes + '-' + dia;
    this.fechaActualMensual = ano + '-' + mes ;
    this.fechaActualHora  = today
    console.log(this.fechaActualHora);
    if (this.ac != 'C') {
      // Periodos
      this.serviciosDominiosValoresService
        .obtenerValoresPorIdDominio(dominiosEnum.Periodos)
        .subscribe((response) => {
          this.listaFrecuencia = response;
          // console.log('llego frecuencia', this.listaFrecuencia);
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

    if (this.id != '0') {
      // console.log('llego ido',this.id) 

      this.obtenerElemento();
      if (this.ac == 'V') {
        this.formularioObservaciones.disable();
      }
    }
  }

  obtenerElemento() {
    let idParam: number = +this.id;
    this.obtenerElementos(this.te);
    this.elemento = parseInt(this.te);

    // console.log('llego te', this.te);
    switch (this.te) {
      case '1': {
        this.serviciosObservacionesEstacionService
          .obtenerPorIdDTO(idParam)
          .subscribe((response) => {
            this.obtenerParametrosElemento(response.idEstacion, this.te);

            var fecha = new Date(response.fecha); //Fecha actual
            var mes: any = fecha.getMonth() + 1; //obteniendo mes
            var dia: any = fecha.getDate(); //obteniendo dia
            var ano: any = fecha.getFullYear();
            if (dia < 10) {
              dia = '0' + dia; //agrega cero si el menor de 10
            }
            if (mes < 10) {
              mes = '0' + mes;
            }

            if (response.frecuencia == 155) {
              this.fechaAno = ano
            }
            if (response.frecuencia == 154) {
              // Mes 
              this.fechaMes = ano + '-' + mes
              console.log(this.fecha);
            }

            if (response.frecuencia == 152) {
              this.fecha = ano + '-' + mes + '-' + dia
            }

            if (response.frecuencia == 151 || response.frecuencia == 146 || response.frecuencia == 145 || response.frecuencia == 682 || response.frecuencia == 683) {
              this.fecha = response.fecha.slice(0, -13);
            }
            
            this.id
            this.idfrecuencia = response.frecuencia;
            this.calcularFechas();

            let obFormulario: any = {
              idObservacion: this.id,
              idParametro: response.idParametroXEstacion,
              idElemento: response.idEstacion,
              fecha: this.fechaObservacion,
              idTipoOrigenObservacion: response.idTipoOrigenObservacion,
              origen: response.origen,
              usuarioCargue: response.usuarioCargue,
              valor: response.valor,
              idFlagObservacion: response.idFlagObservacion,
              activo: estados.activo,
              idEstadoObservacion: response.idEstadoObservacion,
              CodigoEAAB: this.te,
              CodigoIDEAM: this.te,
              idfrecuencia: response.frecuencia,
              fechaCargue: response.fechaCargue,
              usuarioModificacion: response.usuarioModificacion,
              usuarioEstado: response.usuarioEstado,
              fechaEstado: response.fechaEstado,
              usuarioCreacion: response.usuarioCreacion,
              fechaCreacion: response.fechaCreacion,
              fechaModificacion: response.fechaModificacion,
            };

            this.formularioObservaciones.setValue(obFormulario);
          });

        break;
      }
      case '2': {
        this.serviciosObservacionesEmbalsesService
          .obtenerPorIdDTO(idParam)
          .subscribe((response) => {
            // console.log('llego', response); 
            this.obtenerParametrosElemento(response.idEmbalse, this.te);
            var fecha = new Date(response.fecha); //Fecha actual
            var mes: any = fecha.getMonth() + 1; //obteniendo mes
            var dia: any = fecha.getDate(); //obteniendo dia
            var ano: any = fecha.getFullYear();
            if (dia < 10) {
              dia = '0' + dia; //agrega cero si el menor de 10
            }
            if (mes < 10) {
              mes = '0' + mes;
            }

            if (response.frecuencia == 155) {
              this.fechaAno = ano
            }
            if (response.frecuencia == 154) {
              // Mes 
              this.fechaMes = ano + '-' + mes
              console.log(this.fecha);
            }

            if (response.frecuencia == 152) {
              this.fecha = ano + '-' + mes + '-' + dia
            }

            if (response.frecuencia == 151 || response.frecuencia == 146 || response.frecuencia == 145) {
              this.fecha = response.fecha.slice(0, -13);
            }

            this.id
            this.idfrecuencia = response.frecuencia;
            this.calcularFechas();

            let obFormulario: any = {
              idObservacion: this.id,
              idParametro: response.idParametroXEmbalse,
              idElemento: response.idEmbalse,
              fecha: this.fechaObservacion,
              idTipoOrigenObservacion: response.idTipoOrigenObservacion,
              origen: response.origen,
              usuarioCargue: response.usuarioCargue,
              valor: response.valor,
              idFlagObservacion: response.idFlagObservacion,
              activo: estados.activo,
              idEstadoObservacion: response.idEstadoObservacion,
              CodigoEAAB: this.te,
              CodigoIDEAM: this.te,
              idfrecuencia: response.frecuencia,
              fechaCargue: response.fechaCargue,
              usuarioModificacion: response.usuarioModificacion,
              usuarioEstado: response.usuarioEstado,
              fechaEstado: response.fechaEstado,
              usuarioCreacion: response.usuarioCreacion,
              fechaCreacion: response.fechaCreacion,
              fechaModificacion: response.fechaModificacion,
            };

            this.formularioObservaciones.setValue(obFormulario);
          });
        break;
      }
      case '3': {
        // Pozos
        this.serviciosObservacionesPozosService
          .obtenerPorIdDTO(idParam)
          .subscribe((response) => {
            // console.log('llego Pozo', response);

            this.obtenerParametrosElemento(response.idPozo, this.te);


            var fecha = new Date(response.fecha); //Fecha actual
            var mes: any = fecha.getMonth() + 1; //obteniendo mes
            var dia: any = fecha.getDate(); //obteniendo dia
            var ano: any = fecha.getFullYear();
            if (dia < 10) {
              dia = '0' + dia; //agrega cero si el menor de 10
            }
            if (mes < 10) {
              mes = '0' + mes;
            }

            if (response.frecuencia == 155) {
              this.fechaAno = ano
            }
            if (response.frecuencia == 154) {
              // Mes 
              this.fechaMes = ano + '-' + mes
              console.log(this.fecha);
            }

            if (response.frecuencia == 152) {
              this.fecha = ano + '-' + mes + '-' + dia
            }

            if (response.frecuencia == 151 || response.frecuencia == 146 || response.frecuencia == 145) {
              this.fecha = response.fecha.slice(0, -13);
            }
            this.idfrecuencia = response.frecuencia;
            this.calcularFechas();

            let obFormulario: any = {
              idObservacion: this.id,
              idParametro: response.idParametroXPozo,
              idElemento: response.idPozo,
              fecha: this.fechaObservacion,
              idTipoOrigenObservacion: response.idTipoOrigenObservacion,
              origen: response.origen,
              usuarioCargue: response.usuarioCargue,
              valor: response.valor,
              idFlagObservacion: response.idFlagObservacion,
              activo: estados.activo,
              idEstadoObservacion: response.idEstadoObservacion,
              CodigoEAAB: this.te,
              CodigoIDEAM: this.te,
              idfrecuencia: response.frecuencia,
              fechaCargue: response.fechaCargue,
              usuarioModificacion: response.usuarioModificacion,
              usuarioEstado: response.usuarioEstado,
              fechaEstado: response.fechaEstado,
              usuarioCreacion: response.usuarioCreacion,
              fechaCreacion: response.fechaCreacion,
              fechaModificacion: response.fechaModificacion,
            };

            this.formularioObservaciones.setValue(obFormulario);
          });
        break;
      }
      default: {
      }
    }

    if (this.ac == 'V') {
      this.formularioObservaciones.disable();
    }
  }

  private construirFormulario() {
    this.formularioObservaciones = this.formBuilder.group({
      idObservacion: [''],
      idParametro: [''],
      fecha: [''],
      fechaCargue: [''],
      idEstadoObservacion: [''],
      idTipoOrigenObservacion: [''],
      origen: [''],
      usuarioCargue: [''],
      valor: [''],
      idFlagObservacion: [''],
      usuarioCreacion: [''],
      fechaCreacion: [''],
      usuarioModificacion: [''],
      fechaModificacion: [''],
      usuarioEstado: [''],
      fechaEstado: [''],
      // datos que no van en el formulario
      idElemento: [''],
      activo: [estados.activo],
      CodigoEAAB: [''],
      CodigoIDEAM: [''],
      idfrecuencia: [''],
    });
  }

  obtenerElementos(even: any) {
    if (this.datosFilter.length >= 1) {
      Swal.fire({
        title: 'Desea Cambiar de elemento?',
        text: 'Se restableceran todos los valores ',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, Cambiar',
      }).then((result) => {
        if (result.isConfirmed) {
          this.fecha = '';
          this.fechaAno = 0;
          this.fechaMes = '';
          this.valor = 0;
          this.flag = 0;
          this.origen = '';
          this.idfrecuencia = 0;
          this.datosFilter = [];
          this.listaCodigoEAAB = [];
          this.listaCodigoIDEAM = [];
        }
      });
    }

    this.listaElemento = [];
    this.listaCodigoEAAB = [];
    this.listaCodigoIDEAM = [];
    
    Swal.showLoading();

    switch (even) {
      case '1': {
        // Estaciones
        Swal.fire({
          title: 'Cargando...',
          html: 'Por favor espere',
          timer: 15000,
          timerProgressBar: true,
          allowOutsideClick: false,
          didOpen: async () => {
            Swal.showLoading();
        
          this.serviciosEstacionesService
            .obtenerEstaciones()
            .subscribe((response) => {
              Swal.close()
              // console.log('llegaron Estaciones ', response); 
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
                idTecnologia:elemento.idTecnologia,
              disabled: elemento.activo == 'S' ? false : true,
            }));


            });
          }, 
          willClose: async() => {
            Swal.hideLoading();
          }
          
        });
        break;
      }
      case '2': {
        // Embalses
        this.serviciosEmbalcesService
          .obtenerEembalsesDTO()
          .subscribe((response) => {
            // console.log('llegaron embalses', response);
            Swal.close()
            this.listaElemento = response.map((elemento: any) => ({
              id: elemento.idEmbalse,
              text: elemento.embalse,
              disabled: elemento.activo == 'S' ? false : true,
            }));
          });
        break;
      }
      case '3': {
        // pozos
        this.serviciosPozosService.obtenerPozosDTO().subscribe((response) => {
          // console.log('llegaron pozoz', response);
          Swal.close()
          this.listaElemento = response.map((elemento: any) => ({
            id: elemento.idPozo,
            text: elemento.pozo,
            disabled: elemento.activo == 'S' ? false : true,
          }));
        });

        break;
      }
      default: {
        // console.log('default');
        //statements;
        break;
      }
    }
  }

  obtenerParametrosElemento(event: any, mecanismo: any) {


    switch (mecanismo) {
      case '1': {

        this.listaElemento.forEach(function (element: any) {
          if (element.id == event) {
            console.log(element);
            if (element.idTecnologia != 16) {
              const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                  toast.addEventListener('mouseenter', Swal.stopTimer)
                  toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
              })

              Toast.fire({
                icon: 'info',
                title: 'La Estacion Seleccionada  No es Tegnologia Convencional',
              })

            }
          }
        });



        this.sercioparametrosestacion
         
        .obtenerListaParametros(event)
          .subscribe((response) => {
            console.log(response)
        
            this.NombresParametros = response.map((elemento: any) => ({
              
              id: elemento.idParametroXEstacion,
              text: elemento.descripcionParametro,
              idPeriodo: elemento.idPeriodo,
            }));
         
           
            for (let index = 0; index <   this.NombresParametros.length; index++) {
          
              var text   =  this.NombresParametros[index]['text']
              var text1 = text.split('-');
               var parametro = text1[0]+'-'+text1[1].toLowerCase();
 
               this.NombresParametros[index]['text'] = parametro;
 
 
               console.log(  this.NombresParametros[index]['text']   );
 
            }
            



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

            // console.log('lista de parametros ', response);
          });

        break;
      }
      case '2': {
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

          
            for (let index = 0; index <   this.NombresParametros.length; index++) {
          
              var text   =  this.NombresParametros[index]['text']
              var text1 = text.split('-');
               var parametro = text1[0]+'-'+text1[1].toLowerCase();
 
               this.NombresParametros[index]['text'] = parametro;
 
 
               console.log(  this.NombresParametros[index]['text']   );
 
            }
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
      case '3': {

        this.serviciosParametrosPozosService
          .obtenerListaParametrosXPozo(event)
          .subscribe((response) => {
             
            var NombresParametros = response.map((elemento: any) => ({
              id: elemento.idParametroXPozo,
              text: elemento.descripcionParametro,
              idPeriodo: elemento.idPeriodo,
              disabled: elemento.activo == 'S' ? false : true,
            }));
          
            for (let index = 0; index <   this.NombresParametros.length; index++) {
          
              var text   =  this.NombresParametros[index]['text']
              var text1 = text.split('-');
               var parametro = text1[0]+'-'+text1[1].toLowerCase();
 
               this.NombresParametros[index]['text'] = parametro;
 
 
               console.log(  this.NombresParametros[index]['text']   );
 
            }
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

  agregarlista() {
    // calcular fecha
    this.calcularFechas();
    let observacionParametros: any = {};
    var fecha = new Date(this.fechaObservacion); //Fecha actual
    var mes: any = fecha.getMonth() + 1; //obteniendo mes
    var dia: any = fecha.getDate(); //obteniendo dia
    var ano: any = fecha.getFullYear();

    var fechaFin ;

    this.idfrecuencia  = this.CodigoParametros.filter((filtro:any)=> filtro.id ==   this.idParametro)[0].idPeriodo
    console.log( this.idfrecuencia);
   
    observacionParametros = {
      idObservacionXElemento: 0,
      idParametroElemento: this.idParametro,
      fecha:this.fechaObservacion,
      valor: this.valor,
      idFlagObservacion: this.flag,
      flagInsert: true,
      idfrecuencia:this.idfrecuencia,
      flagExistente: false,
      origen: 'origen ' + this.datosFilter.length ,
      // valores fijos
      idEstadoObservacion: 266,
      idTipoOrigen: 262,
      activo: estados.activo,
      idTipoOrigenObservacion: OrigenObservacion.Manual,
      // Valores auditoria
      fechaCargue: null,
      fechaCreacion: null,
      fechaEstado: null,
      fechaModificacion: null,
      usuarioCargue: this.usuario.usuario,
      usuarioCreacion: this.usuario.usuario,
      usuarioEstado: null,
      usuarioModificacion: null,
    };
console.log(observacionParametros);
 
    if (this.validarObligatorios()) {
      if (this.validarObservacion(observacionParametros)) {
        this.datosFilter.push(observacionParametros);
        // this.formularioObservaciones.reset()
      }
    }

    // console.log('lista ', this.datosFilter);
  }

  guardar(mecanismo: any) {

    Swal.fire({
      title: 'Cargando...',
      html: 'Por favor espere.',
      timerProgressBar: true,
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: async () => {
        Swal.showLoading();
        let arregladoFinal = [];
        switch (mecanismo) {
          case '1': {
            // Estacion
            // idParametroXEstacion
    
            arregladoFinal = this.datosFilter.map(
              (p: { [x: string]: any; idParametroElemento: any }) => {
                // crear nueva propiedad de nombre Del Elemento
                p[`idParametroXEstacion`]  =  parseInt(p.idParametroElemento);
                p[`idObservacionXEstacionInicial`] = p.idObservacionXElemento;
                // remover la propiedad actual
                delete p.idParametroElemento;
                delete p.idObservacionXElemento;
                // retornar el nuevo objeto

                return p;
                
              }
            );
    
            //  console.log('enviando',arregladoFinal)
            this.serviciosObservacionesEstacionService
              .creacionMasiva(arregladoFinal)
              .subscribe((Response) => {
                this.toast.fire({
                  icon: 'success',
                  title:
                    'se gurardaron ' +
                    Response.length +
                    ' Observaciones exitosamente!',
                });
                this.router.navigate(['/configuracion/gestionObservaciones']);
                Swal.close();
              });
    
            break;
          }
          case '2': {
            // Embalses
            // idParametroXEmbalse
            arregladoFinal = this.datosFilter.map(
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
    
            //  console.log('enviando',arregladoFinal)
            this.serviciosObservacionesEmbalsesService
              .creacionMasiva(arregladoFinal)
              .subscribe((Response) => {
                // console.log('embalses ', Response);
                this.toast.fire({
                  icon: 'success',
                  title:
                    'se gurardaron ' +
                    Response.length +
                    ' Observaciones exitosamente!',
                });
                this.router.navigate(['/configuracion/gestionObservaciones']);
              });
    
            break;
          }
          case '3': {
            // Pozos
            // idParametroXPozo
            arregladoFinal = this.datosFilter.map(
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
    
            // console.log('enviando', arregladoFinal);
            this.serviciosObservacionesPozosService
              .creacionMasiva(arregladoFinal)
              .subscribe((Response) => {
                this.toast.fire({
                  icon: 'success',
                  title:
                    'se gurardaron ' +
                    Response.length +
                    ' Observaciones exitosamente!',
                });
                this.router.navigate(['/configuracion/gestionObservaciones']);
              });
    
            break;
          }
        }
      


            
         
      },
      willClose: async () => {
        Swal.hideLoading();
      }
    });

 
  }

  Actualizar() {
    this.calcularFechas();
    let observacionParametros: any = {};
    switch (this.te) {
      case '1': {
        observacionParametros = {
          idObservacionXEstacionInicial: this.id,
          idParametroXEstacion: this.idParametro,
          fecha: this.fechaObservacion,
          valor: this.valor,
          idFlagObservacion: this.flag,
          flagInsert: true,
          flagExistente: false,
          origen: this.origen,
          // valores fijos
          idEstadoObservacion: 266,
          idTipoOrigen: 262,
          activo: estados.activo,
          idTipoOrigenObservacion: OrigenObservacion.Manual,
          // Valores auditoria
          fechaCargue: null,
          fechaCreacion: null,
          fechaEstado: null,
          fechaModificacion: null,
          usuarioCargue: this.usuario.usuario,
          usuarioCreacion: this.usuario.usuario,
          usuarioEstado: null,
          usuarioModificacion: null,
        };

        this.serviciosObservacionesEstacionService
          .actualizar(observacionParametros)
          .subscribe((Response) => {
            this.toast.fire({
              icon: 'success',
              title: 'Se Actualizo  ' + ' Observaciones exitosamente!',
            });
            this.router.navigate(['/configuracion/gestionObservaciones']);
          });

        break;
      }
      case '2': {
        observacionParametros = {
          idObservacionXEmbalseInicial: this.id,
          idParametroXEmbalse: this.idParametro,
          fecha: this.fechaObservacion,
          valor: this.valor,
          idFlagObservacion: this.flag,
          flagInsert: true,
          flagExistente: false,
          origen: this.origen,
          // valores fijos
          idEstadoObservacion: 266,
          idTipoOrigen: 262,
          activo: estados.activo,
          idTipoOrigenObservacion: OrigenObservacion.Manual,
          // Valores auditoria
          fechaCargue: null,
          fechaCreacion: null,
          fechaEstado: null,
          fechaModificacion: null,
          usuarioCargue: this.usuario.usuario,
          usuarioCreacion: this.usuario.usuario,
          usuarioEstado: null,
          usuarioModificacion: null,
        };
        //  console.log('enviando',arregladoFinal)
        this.serviciosObservacionesEmbalsesService
          .actualizar(observacionParametros)
          .subscribe((Response) => {

            this.toast.fire({
              icon: 'success',
              title: 'Se Actualizo  ' + ' Observaciones exitosamente!',
            });
            this.router.navigate(['/configuracion/gestionObservaciones']);
          });

        break;
      }
      case '3': {
        observacionParametros = {
          idObservacionXPozoInicial: this.id,
          idParametroXPozo: this.idParametro,
          fecha: this.fechaObservacion,
          valor: this.valor,
          idFlagObservacion: this.flag,
          flagInsert: true,
          flagExistente: false,
          origen: this.origen,
          // valores fijos
          idEstadoObservacion: 266,
          idTipoOrigen: 262,
          activo: estados.activo,
          idTipoOrigenObservacion: OrigenObservacion.Manual,
          // Valores auditoria
          fechaCargue: null,
          fechaCreacion: null,
          fechaEstado: null,
          fechaModificacion: null,
          usuarioCargue: this.usuario.usuario,
          usuarioCreacion: this.usuario.usuario,
          usuarioEstado: null,
          usuarioModificacion: null,
        };

        this.serviciosObservacionesPozosService
          .actualizar(observacionParametros)
          .subscribe((Response) => {
            // console.log('llego al guardar ', Response);
            this.toast.fire({
              icon: 'success',
              title: 'Se Actualizo  ' + ' Observaciones exitosamente!',
            });
            this.router.navigate(['/configuracion/gestionObservaciones']);
          });

        break;
      }
    }
  }

  calcularFechas() {

    if (this.idfrecuencia == 155) {
      const fechass = this.fechaAno + '-01-01T05:04:30Z';
      // console.log(fechass)
      return (this.fechaObservacion = new Date(fechass));
    }
    if (this.idfrecuencia == 154) {
      const fechass = this.fechaMes + '-01T05:04:30Z';

      return (this.fechaObservacion = new Date(fechass));
    }
    if (this.idfrecuencia == 151 || this.idfrecuencia == 152 || this.idfrecuencia == 146 || this.idfrecuencia == 145 || this.idfrecuencia == 683 || this.idfrecuencia == 682) {
      return this.fechaObservacion = new Date(this.fecha);
    }

    return new Date();
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

  eliminarLista(id: any) {
    var i = this.datosFilter.indexOf(id);

    if (i !== -1) {
      this.datosFilter.splice(i, 1);
    }
  }

  validarObservacion(newObservacion: any) {
    for (let index = 0; index < this.datosFilter.length; index++) {
      // Validar Estacion
      if (
        // validar parametro
        this.datosFilter[index].idParametroElemento ==
        newObservacion.idParametroElemento &&
        // validar fechas
        this.datosFilter[index].fecha.getTime() ==
        newObservacion.fecha.getTime()
      ) {
        this.toast.fire({
          icon: 'info',
          title: 'la observacion ya se encuentra agregada',
        });

        return false;
      }
    }

    return true;
  }

  validarObligatorios() {

    if (this.idfrecuencia == 155 && this.fechaAno == undefined) {
      return false;
    }
    if (
      this.idfrecuencia == 154 &&
      this.fechaMes == undefined &&
      this.fechaAno == undefined
    ) {
      return false;
    }
    if (
      (this.idfrecuencia == 151 && this.fecha == undefined) ||
      this.fecha == '' ||
      (this.idfrecuencia == 152 && this.fecha == undefined)
    ) {
      return false;
    }
    if (this.valor == undefined) {
      return false;
    }
     
    if (this.flag == undefined || this.flag == 0 )  {
      return false;
    }

    if (this.idfrecuencia == undefined) {
      return false;
    }

    if (this.idParametro == undefined || this.idParametro == 0) {
      return false;
    }
    if (this.formularioObservaciones.valid == false) {
      return false;
    }

    return true;
  }
}
