import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiciosGeograficosService } from 'src/app/common/mapa/servicios-geograficos.service';
import { estados } from 'src/app/common/utils/constantes';
import { accionesTablasEnum } from 'src/app/modelo/enum/acciones-tablas-enum';
import { capasEnum, capasEnumDatos } from 'src/app/modelo/enum/capas-enum';
import { dominiosEnum } from 'src/app/modelo/enum/dominios-enum';
import Swal from 'sweetalert2';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ServiciosParametrosEstacionesService } from '../../elementos/estaciones/servicios-parametros-estaciones.service';
import { receiveMessageOnPort } from 'worker_threads';
import { ServiciosCapasService } from '../../configuracion/capas/servicios-capas.service';
import { ServiciosDominiosValoresService } from '../../configuracion/dominios/servicios-dominios-valores.service';
import { ServiciosEmbalcesService } from '../../elementos/embalses/servicios-embalses.service';
import { ServiciosEstacionesService } from '../../elementos/estaciones/servicios-estaciones.service';
import { ServiciosPozosService } from '../../elementos/pozos/servicios-pozos.service';
import { ServiciosObservacionesEmbalsesService } from '../servicios-observaciones-embalses.service';
import { ServiciosObservacionesEstacionService } from '../servicios-observaciones-estacion.service';
import { ServiciosObservacionesPozosService } from '../servicios-observaciones-pozos.service';
import { ServiciosParametrosService } from '../../parametros/servicios-parametros.service';
import { ServiciosCriteriosAceptacion } from '../../gestionHidrologica/cirterios/servicios-gestion-criterios.service';
import { ServiciosvalorParametroXCriterio } from '../../gestionHidrologica/cirterios/servicios-ValoresParametros-criterio.service';
import { IValidaObervacion } from 'src/app/modelo/configuracion/validarObservacion';
import { IValorParametroXCriterio } from 'src/app/modelo/configuracion/criterioValidacion';
import { ServiciosParametrosCriterio } from '../../gestionHidrologica/cirterios/servicios-parametros-criterio.service';
import { var1 } from '../../configuracion/nivel-caudal/aforo/consultar-aforo/consultar-aforo.component';
import { toInteger, toNumber, toString } from 'lodash';

export var var2: number;
@Component({
  selector: 'app-gestion-agregacion',
  templateUrl: './gestion-agregacion.component.html',
})
export class GestionAgregacionComponent implements OnInit {
  public formularioFiltros!: FormGroup;
  public formularioCalidad!: FormGroup;
  @ViewChild('ModalCalidad', { static: false }) ModalCalidad: ElementRef;

  // Mapa
  // Set our map properties
  mapCenter = [-73.9, 4.4];
  basemapType = 'topo';
  mapZoomLevel = 9;
  objetoValidar: any;
  listaElementosSeleccionados: { id: any; text: any }[];
  // See app.component.html
  mapLoadedEvent(status: Event) {
    console.log('The map loaded: ' + status);
  }

  public fechaActual: string;

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
  name = '';
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

  url: string = "https://www.folkloredelnorte.com.ar/cancionero/v/virgenindia.html";
  urlSafe: SafeResourceUrl;
  public validar: number;
  public listaMunicipios = [];
  public listaDepartamentos = [];
  public flag: number = 0;
  public verBoton = false;
  public departamentoSelected: any;
  public listaParametros: any = [];
  public listarConfiguracionP: any = [];
  private tempIdDepartamento: number = 0;
  private valorMaximoH: number;
  private valorMiniH: number;
  datosOriginal = [] as any;
  public listZonaEAAB = [];
  public listTipoPozo = [];
  public idestacionXparametro: number;
  public listCategoriaPozo = [];
  public listaP: any = [];
  public listCondicionPozo = [];
  public geograficas = false;
  idParametroXEstacion: number;
  public planas = false;
  public listEntidades = [];
  public listaAreaHidrografica = [];
  public listaZonaHidrografica = [];
  public listasubZonaHidrografica = [];
  public listanivel = [];
  public listaCuenca = [];
  public listaValidacion: any;
  public listaMicrocuenca = [];
  public date = new Date();
  public hoy = String(this.date.getFullYear() + '-' + String(this.date.getMonth() + 1).padStart(2, '0') + '-' + this.date.getDate()).padStart(2, '0');
  hoy2 = new Date().toISOString().substr(0, 19).replace('T', ' ');
  public idfrecuencia: number;
  public id: number;
  listaFin = [];
  public listaEntidad = [];
  public listParametro: any[] = [];
  public listarParametro: any;
  public listParametroOrigen: any;
  public listaFrecuencia = [];
  public listaSubcuenca = [];
  public listaBusqueda: any[] = [];
  public elemento: any = 0;
  public periodo: number = 0;
  public parametro: number;
  public listValidaObervacion: any;
  public valorObservacion: number;
  public criterioCalidadSeleccionado: number;
  // public idNewEstadoObservacion: number;
  public FechaObservacion: string;
  public operacion: string;
  public frecuencia: string;
  public parametroO: string;
  public estadoObservacion: string;
  public observacionesCalidad: string;
  public OrigenObservacion: string;
  public listObservaciones: any;
  public listObservacionesInsertadas: any = [];
  // rutaGeneral = 'configuracion/gestionObservaciones/0/C/0';
  // rutaEdicion: string;
  // rutaConsulta: string;
  vista = false;
  datosFilterEstaciones = [] as any;
  listValidaciones = [] as any;
  datosFilterEmbalses = [] as any;
  datosFilterPozos = [] as any;
  datosFilter = [] as any;
  listParametroXElemento = [] as any;
  capas: any[] = [];
  columnas = [

    {
      title: 'Activo',
      data: 'activo',
      class: 'text-center',

    },
    {
      title: 'Fecha',
      data: 'fecha',
      class: 'text-center',

    },


    { title: 'Valor', data: 'valor', class: 'text-center' }
  ];
  columnasValidar = [
    {
      title: 'ID',
      data: 'id_valida_observaciones',
      visible: false,
      filterValueMin: '',
      filterValueMax: '',
      tipo: 'rangoNumero',
    },
    {
      title: 'fecha Validación',
      data: 'fechaValidacion',
      filter: true,
      filterValue: '',
      tipo: 'texto',
    },
    {
      title: 'criterio',
      data: 'criterio',
      filter: true,
      filterValue: '',
      tipo: 'texto',
    },
    {
      title: 'Elemento',
      data: 'elemento',
      filter: true,
      filterValue: '',
      tipo: 'texto',
    },
    {
      title: 'Parámetro',
      data: 'parametro',
      filter: true,
      filterValue: '',
      tipo: 'texto',
    },
    {
      title: 'Valor',
      data: 'valor',
      filter: true,
      filterValue: '',
      tipo: 'texto',
    },
    {
      title: 'Resultado',
      data: 'estado',
      filter: true,
      filterValue: '',
      tipo: 'texto',
    },
    {
      title: 'Usuario',
      data: 'usuario',
      filter: true,
      filterValue: '',
      tipo: 'texto',
    }
  ];


  botones2 = [

  ];

  listaCodigoEAAB: any[] = [{
    id: '',
    text: '',
    disabled: false
  }];
  public idElementos: number = 0;
  listaCodigoIDEAM: any = [];
  listaDeElementos: any = [];
  listaDeCriterios: any = [];

  constructor(
    public sanitizer: DomSanitizer,
    private router: Router,
    private formBuilder: FormBuilder,
    private serviciosGeograficosService: ServiciosGeograficosService,
    private serviciosDominiosValoresService: ServiciosDominiosValoresService,
    private serviciosParametrosService: ServiciosParametrosService,
    private serviciosEmbalcesService: ServiciosEmbalcesService,
    private serviciosPozosService: ServiciosPozosService,
    private sercioparametrosestacion: ServiciosParametrosEstacionesService,
    private serviciosEstacionesService: ServiciosEstacionesService,
    private serviciosCriteriosAceptacion: ServiciosCriteriosAceptacion,
    private serviciosObservacionesEstacionService: ServiciosObservacionesEstacionService,
    private serviciosObservacionesPozosService: ServiciosObservacionesPozosService,
    private serviciosvalorParametroXCriterio: ServiciosvalorParametroXCriterio,
    private serviciosObservacionesEmbalsesService: ServiciosObservacionesEmbalsesService,
    private serviciosParametrosCriterio: ServiciosParametrosCriterio
  ) { }

  ngOnInit(): void {




    this.construirFormulario();
    const dateInicio = this.formularioFiltros.value.fechaInicio;

    var minuto1 = dateInicio.slice(10, 12);
    var hora1 = dateInicio.slice(8, 10);
    var dia1 = dateInicio.slice(6, 8);
    var mes1 = dateInicio.slice(4, 6);
    var ano3 = dateInicio.slice(0, 4);
    var fechaInicio = ano3 + '-' + mes1 + '-' + dia1 + 'T' + hora1 + ":" + minuto1 + ':00.000';
    console.log(fechaInicio);
    this.serviciosParametrosService.obtenerOrgine().subscribe(
      (response) => {
        // console.log(response);
        this.listaParametros = response;
      }
    );
    var fecha = new Date(); //Fecha actual
    var mes: any = fecha.getMonth() + 1; //obteniendo mes
    var dia: any = fecha.getDate(); //obteniendo dia
    var ano: any = fecha.getFullYear();

    if (dia < 10) {
      dia = '0' + dia; //agrega cero si el menor de 10
    }
    if (mes < 10) {
      mes = '0' + mes;
    }

    this.fechaActual = ano + '-' + mes + '-' + dia;
    // console.log('fecha actual', this.fechaActual);

    // Departamentos
    this.serviciosGeograficosService
      .obtenerDepartamentos()
      .subscribe((response) => {
        this.listaDepartamentos = response;
      });
    // parametros
    this.serviciosParametrosService
      .obtenerValoresParametrosSelect2()
      .subscribe((response) => {
        this.listParametro = response;
      });

    // entidad
    this.serviciosDominiosValoresService
      .obtenerValoresPorIdDominio(dominiosEnum.Entidad)
      .subscribe((response) => {
        this.listaEntidad = response;
      });

    this.serviciosDominiosValoresService
      .obtenerValoresPorIdDominio(dominiosEnum.TipoValidacion)
      .subscribe((response) => {
        console.log(response);

        this.listValidaciones = [response[0], response[1]]
      });

    // Criterios

    this.serviciosCriteriosAceptacion.obtener().subscribe((response) => {
      this.listaDeCriterios = response.map((event: any) => {
        return { id: event.idCriterio, text: event.nombre };
      });
    });

    this.formularioFiltros.get('parametroOrigen')?.disable();
    this.formularioFiltros.get('operacionConf')?.disable();
    this.formularioFiltros.get('frecuenciaP')?.disable();
    this.formularioFiltros.get('idElemento')?.disable();
    this.formularioFiltros.get('codigoEstacionEaab')?.disable();
    this.formularioFiltros.get('CodigoIDEAM')?.disable();
  }

  accionRegistro(e: any) {
    switch (e.accion) {
      case accionesTablasEnum.Activar: {
        break;
      }
      case accionesTablasEnum.Inactivar: {
        break;
      }
      case 'validar': {

        Swal.fire({
          title: 'Desea validar por los criterios de calidad ?',
          text: 'Se almacenara la tabla a validación de calidad ',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, Guardar',
        }).then((result) => {
          if (result.isConfirmed) {
            this.valorObservacion = e.registro.valor;
            this.FechaObservacion = e.registro.fecha;
            this.OrigenObservacion = e.registro.origen;
            this.estadoObservacion = e.registro.estadoObservacion;
            this.objetoValidar = e.registro;
            this.serviciosCriteriosAceptacion.obtener().subscribe((response) => {


              this.listaDeCriterios = response;
              for (let index = 0; index < this.listaDeCriterios.length; index++) {
                console.log(this.listaDeCriterios[index]);
              }

            });
            this.valorObservacion = e.registro.valor;
            this.FechaObservacion = e.registro.fecha;
            this.OrigenObservacion = e.registro.origen;
            this.estadoObservacion = e.registro.estadoObservacion;
            this.objetoValidar = e.registro;

            if (e.registro.idEstadoObservacion == 267
              || e.registro.idEstadoObservacion == 266) {
              this.ModalCalidad.nativeElement.click();
            }

          }
        });


        break;
      }
      case 'permisos': {
        let elemento: any = [];

        this.id = e.registro.idObservacionXElemento;
        this.obtener();
        let div: any = document.getElementById(`validarBtn1`);
        div.click();

        break;
      }
      default: {
        //statements;
        break;
      }
    }
  }

  accionRegistroModal(e: any) {
    switch (e.accion) {
      case 'agregar': {
        //statements;
        if (e.registro != undefined) {
          // this.agregarlistaElementos(e.registro);
          if (this.validarElemeto(e.registro)) {
            this.listaBusqueda.push(e.registro);
          }
        }
        break;
      }
      default: {
        // console.log('default', e);
        //statements;
        break;
      }
    }
  }

  get areaHidrografica() {
    return this.formularioFiltros.get('areaHidrografica');
  }

  get zonaHidrografica() {
    return this.formularioFiltros.get('zonaHidrografica');
  }
  get subZonaHidrografica() {
    return this.formularioFiltros.get('subZonaHidrografica');
  }
  get cuenca() {
    return this.formularioFiltros.get('cuenca');
  }
  get subcuenca() {
    return this.formularioFiltros.get('subCuenca');
  }

  get microCuenca() {
    return this.formularioFiltros.get('microCuenca');
  }

  get fechaInicio() {
    return this.formularioFiltros.get('fechaInicio');
  }
  get fechaFin() {
    return this.formularioFiltros.get('fechaFin');
  }
  get idcriterioCalidad() {
    return this.formularioFiltros.get('idcriterioCalidad');
  }
  get idElemento() {
    return this.formularioFiltros.get('idElemento');
  }
  get idParametro() {
    return this.formularioFiltros.get('idParametro');
  }
  get codigoEstacionEaab() {
    return this.formularioFiltros.get('codigoEstacionEaab');
  }
  get CodigoIDEAM() {
    return this.formularioFiltros.get('CodigoIDEAM');
  }
  get idParametroConfig() {
    return this.formularioFiltros.get('idParametroConfig');
  }
  get observacionCalidad() {
    return this.formularioCalidad.get('observacionesCalidad');
  }

  private construirFormulario() {
    this.formularioFiltros = this.formBuilder.group({
      operacionConf: [''],
      codigoEstacionEaab: [''],
      CodigoIDEAM: [''],
      parametroOrigen: [''],
      fechaInicio: [''],
      fechaFin: [''],
      idParametro: [''],
      idParametroConfig: [''],
      idElemento: [''],
      frecuenciaP: [''],
    });
    this.formularioCalidad = this.formBuilder.group({
      //   valorObservacion
      // FechaObservacion
      // estadoObservacion
      // OrigenObservacion
      // listObservaciones

      idcriterioCalidad: [''],
      idEstadoObservacion: [''],
      observacionesCalidad: ['', Validators.required],
    });
  }

  obtenerElementos(element: any) {
    if (
      this.datosFilter.length >= 1 ||
      this.listaBusqueda.length >= 1 ||
      this.listParametroXElemento.length >= 1
    ) {
      const elementoSeleccionado = element;

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
          this.listEntidades = [];
          this.listaAreaHidrografica = [];
          this.listaZonaHidrografica = [];
          this.listasubZonaHidrografica = [];
          this.listanivel = [];
          this.listaCuenca = [];
          this.listaMicrocuenca = [];
          this.listaEntidad = [];
          this.listaFrecuencia = [];
          this.listaBusqueda = [];
          this.datosFilter = [];
          this.listParametroXElemento = [];
          this.datosFilterEstaciones = [];
          this.datosFilterEmbalses = [];
          this.datosFilterPozos = [];

          this.formularioFiltros.reset();
          this.construirFormulario();

          this.formularioFiltros.value.elemento = elementoSeleccionado;
          this.elemento = elementoSeleccionado;
        }
      });
    }
  }

  resetfiltro() {
    this.listEntidades = [];
    this.listaAreaHidrografica = [];
    this.listaZonaHidrografica = [];
    this.listasubZonaHidrografica = [];
    this.listanivel = [];
    this.listaCuenca = [];
    this.listaMicrocuenca = [];
    this.listaEntidad = [];
    this.listaFrecuencia = [];
    this.listaBusqueda = [];
    this.datosFilter = [];
    this.listParametroXElemento = [];
    this.datosFilterEstaciones = [];
    this.datosFilterEmbalses = [];
    this.datosFilterPozos = [];

    this.formularioFiltros.reset();
    this.elemento = 0;
  }



  traerIdexp() {

    if (this.formularioFiltros.value.idElemento) {
      var ipxe: any = {
        idParametro: this.listarParametro.idParametro,
        idEstacion: this.formularioFiltros.value.idElemento
      }
      this.sercioparametrosestacion
        .obtenerListaParametrosEstacion(ipxe)
        .subscribe((Response) => {
          if (Response) {
            var2 = Response.idParametroXEstacion;
            console.log(var2);
            this.verBoton = true;
          } else {

            this.toast.fire({

              
              icon: 'error',
              title:
                'La estación no tiene asociado el parametro que se debe agregar !',
            });

            this.verBoton = false;
          }

        })

    } else {
      this.toast.fire({
        icon: 'error',
        title:
          'Debe selecionar el elemento!',
      });


    }



  }
  cargaMaviva(lista: any) {


    if (this.listObservaciones[0]) {
      this.serviciosObservacionesEstacionService
        .creacionMasivafecha(lista)
        .subscribe((Response) => {

          this.listObservacionesInsertadas = Response;

          if (Response.length == 0) {
            this.toast.fire({
              icon: 'error',
              title:
                'Tiene ' + Response.length + ' Observaciones de agregación !',
            });

          } else {
            this.toast.fire({
              icon: 'success',
              title:
                'se guardaron ' + Response.length + ' Observaciones de agregación !',
            });



          }

        });



    } else {
      this.toast.fire({
        icon: 'error',
        title:
          'No hay información!',
      });
    }
  }
  uniqByKeepFirst(a: any, key: any) {
    let seen = new Set();
    return a.filter((item: any) => {
      let k = key(item);
      return seen.has(k) ? false : seen.add(k);
    });
  }


  uniqByKeepLast(a: any, key: any) {
    {
      return [
        ...new Map(
          a.map((x: any) => [key(x), x])
        ).values()
      ]
    }

  }

  ListaAgregacion() {
    var objetoBusqueda: any;
    let lista: any = []
    objetoBusqueda = this.formularioFiltros.value
    for (
      let index = 0;
      index < this.listObservaciones.length;
      index++
    ) {

      var fecha;
      switch (this.listarParametro.idPeriodo) {
        case 154: {

          fecha = this.listObservaciones[index]['fecha'] + '-01T00:00:00.000';
          break;
        }
        case 155: {

          fecha = this.listObservaciones[index]['fecha'] + '-01-01T00:00:00.000';
          break;
        } case 145: {

          fecha = this.listObservaciones[index]['fecha'] + 'T00:00:00.000';
          break;
        } case 152: {

          fecha = this.listObservaciones[index]['fecha'] + 'T00:00:00.000';
          break;
        } case 151: {

          fecha = this.listObservaciones[index]['fecha'] + ':00:00.000';
          var d = new Date(fecha);
          fecha = [d.getFullYear(), d.getMonth() + 1, d.getDate()].join('-') + 'T' + d.getHours() + ':00:00.000';
          console.log(fecha);

          break;
        }

        case 682: {
          var input = this.listObservaciones[index]['fecha']
          var minuto1 = input.slice(10, 12);
          var hora1 = input.slice(8, 10);
          var dia1 = input.slice(6, 8);
          var mes1 = input.slice(4, 6);
          var ano1 = input.slice(0, 4);
          var segundo = input.slice(12, 14);




          if (minuto1 == '60') {

            var hora = toInteger(hora1) + 1;
            fecha = ano1 + '-' + mes1 + '-' + dia1 + 'T' + hora + ':00:' + segundo + '.000';
          } else {

            if (minuto1 == '00') {

              this.listObservaciones.splice(index, 1)

            } else {
              fecha = ano1 + '-' + mes1 + '-' + dia1 + 'T' + hora1 + ":" + minuto1 + ':' + segundo + '.000';

            }

          }


          break;
        }
        case 683: {

          var input = this.listObservaciones[index]['fecha']
          var minuto1 = input.slice(10, 12);
          var hora1 = input.slice(8, 10);
          var dia1 = input.slice(6, 8);
          var mes1 = input.slice(4, 6);
          var ano1 = input.slice(0, 4);
          var segundo = input.slice(12, 14);




          if (minuto1 == '60') {

            var hora = toInteger(hora1) + 1;
            fecha = ano1 + '-' + mes1 + '-' + dia1 + 'T' + hora + ':00:' + segundo + '.000';
          } else {

            if (minuto1 == '00') {

              this.listObservaciones.splice(index, 1)

            } else {
              fecha = ano1 + '-' + mes1 + '-' + dia1 + 'T' + hora1 + ":" + minuto1 + ':' + segundo + '.000';

            }

          }








          break;
        }
        case 146: {

          fecha = this.listObservaciones[index]['fecha'] + '00.000';
          break;
        }

        case 146: {

          fecha = this.listObservaciones[index]['fecha'] + '00.000';
          break;
        }


        default: {

          break;
        }
      }


      var fechaFin: any = fecha;
      objetoBusqueda.idElementoString = objetoBusqueda.idElemento;

      const [dias, horas] = fechaFin.split('T');
      const [year, month, day] = dias.split('-');
      const [h, m, s] = horas.split(':');

      objetoBusqueda.fechaFin1 = `${year}-${month}-${day} ${h}:${m}:${s}`;
      var lis: any = {
        activo: "S",
        fecha: fechaFin,
        fechaCargue: null,
        fechaCreacion: null,
        fechaEstado: null,
        fechaModificacion: null,
        flagExistente: false,
        flagInsert: true,
        idEstadoObservacion: 266,
        idFlagObservacion: "271",
        idObservacionXEstacionInicial: 0,
        idTipoOrigen: 262,
        idTipoOrigenObservacion: 262,
        origen: "origen 0",
        usuarioCargue: "juan.duque@linktic.co",
        usuarioCreacion: "juan.duque@linktic.co",
        usuarioEstado: null,
        usuarioModificacion: null,
        idParametroXEstacion: var2,
        valor: this.listObservaciones[index]['valor']
      };
      lista.push(lis);

      this.listaP = lista;
    }

    console.log(6, lista);
    this.cargaMaviva(lista);


  }


  buscarFecha(list: any) {

    console.log(7, list);
    console.log(56, list);
    var objetoBusqueda: any;
    let lista: any = list;
    objetoBusqueda = this.formularioFiltros.value
    for (
      let index = 0;
      index < this.listaP.length;
      index++
    ) {

      objetoBusqueda.codigo = this.listarParametro.codigo
      this.serviciosObservacionesEstacionService
        .duscarfecha(objetoBusqueda)
        .subscribe((Response) => {
          this.fechasComparacion = Response


          if (this.fechasComparacion === 0) {
            this.listaFin = [];

            this.listaFin = list;
            this.buscarFecha(this.listaFin);
            console.log(999, this.listaFin);
          } else {
            this.listaFin = [];
            list.splice(index, 1)

            this.listaFin = list



          }

        })

    }
    console.log(556, this.listaFin);
    this.cargaMaviva(this.listaFin)


  }




  filtrar(elemento: any) {
    let lista: any = []
    var valor;
    const dateInicio = this.formularioFiltros.value.fechaInicio;
    const dateInicio1 = this.formularioFiltros.value.fechaFin
    var objetoBusqueda: any;
    this.listaBusqueda = [];
    this.listParametroXElemento = [];
    this.formularioFiltros.value.codigo = this.listarParametro.codigoOrigen;
    this.formularioFiltros.value.idOperacion = this.listarConfiguracionP[0].idOperacion;
    this.formularioFiltros.value.idFrecuencia = this.listarParametro.idPeriodo;
    if (this.idfrecuencia == 151 || this.idfrecuencia == 146 || this.idfrecuencia == 145 || this.idfrecuencia == 683 || this.idfrecuencia == 682) {

      const [dias, horas] = dateInicio.split('T');
      const [dias1, horas1] = dateInicio1.split('T');
      const [year, month, day] = dias.split('-');
      const [year1, month1, day1] = dias1.split('-');
      const [hora, minuto] = horas.split(':');
      const [hora1, minuto1] = horas1.split(':');

      this.formularioFiltros.value.fechaInicio1 = `${year}-${month}-${day} ${hora}:${minuto}:OO`;
      this.formularioFiltros.value.fechaFin1 = `${year1}-${month1}-${day1} ${hora1}:${minuto1}:00`;
    }

    objetoBusqueda = this.formularioFiltros.value

    if (this.idfrecuencia == 154) {

      const [year, month, day] = dateInicio.split('-');
      const [year1, month1, day1] = dateInicio1.split('-');

      this.formularioFiltros.value.fechaInicio1 = `${year}-${month}`;
      this.formularioFiltros.value.fechaInicio = this.formularioFiltros.value.fechaInicio1
      this.formularioFiltros.value.fechaFin1 = `${year1}-${month1}`;
      this.formularioFiltros.value.fechaFin = this.formularioFiltros.value.fechaFin1

      objetoBusqueda = {
        "fechaFin": "2000-12-27T03:52:37.193Z",
        "fechaFin1": `${year1}-${month1}`,
        "fechaInicio": "2022-12-27T03:52:37.193Z",
        "fechaInicio1": `${year}-${month}`,
        "idElemento": this.formularioFiltros.value.idElemento,
        "idFrecuencia": this.formularioFiltros.value.idFrecuencia,
        "idOperacion": this.formularioFiltros.value.idOperacion,
        "codigo": this.formularioFiltros.value.codigo
      };

    }



    try {

      switch (elemento) {
        case '1': {

          Swal.fire({
            title: 'Cargando ...',
            html: 'Por favor espere',
            timer: 5000,
            timerProgressBar: true,
            allowOutsideClick: false,
            didOpen: async () => {
              Swal.showLoading();

              var today = new Date();

              var hoy = today.toISOString();
              this.serviciosObservacionesEstacionService
                .obtenerDTOAgregacion(objetoBusqueda)
                .subscribe((Response) => {
                  console.log(this.listObservaciones);
                  this.listObservaciones = Response
                  this.ListaAgregacion();

                });
            },
            willClose: async () => {
              Swal.hideLoading();
            }

          });
          break;
        }
        case '2': {
          // Embalses

          objetoBusqueda = this.formularioFiltros.value;

          this.serviciosObservacionesEmbalsesService
            .obtenerDTO(objetoBusqueda)
            .subscribe((Response) => {
              this.listObservaciones = Response.map(
                (p: { [x: string]: any; idParametroXEmbalse: any }) => {
                  // crear nueva propiedad de nombre Del Elemento
                  p[`idParametroXElemento`] = p.idParametroXEmbalse;
                  p[`idObservacionXElemento`] =
                    p.idObservacionXEmbalseInicial;
                  // remover la propiedad actual
                  delete p.idParametroXEmbalse;
                  delete p.idObservacionXEmbalseInicial;
                  // retornar el nuevo objeto
                  return p;
                }
              );

            });
          break;
        }
        case '3': {
          // Pozos
          objetoBusqueda = this.formularioFiltros.value;

          this.serviciosObservacionesPozosService
            .obtenerDTO(objetoBusqueda)
            .subscribe((Response) => {
              this.listObservaciones = Response.map(
                (p: { [x: string]: any; idParametroXPozo: any }) => {
                  // crear nueva propiedad de nombre Del Elemento
                  p[`idParametroXElemento`] = p.idParametroXPozo;
                  p[`idObservacionXElemento`] = p.idObservacionXPozoInicial;
                  // remover la propiedad actual
                  delete p.idParametroXPozo;
                  delete p.idObservacionXPozoInicial;
                  // retornar el nuevo objeto
                  return p;
                }
              );

            });

          break;
        }
        default: {
          console.log('elemento', elemento);
        }
      }

    } catch (error) {
      console.error(error);
    }


    Swal.showLoading();
  }

  filtrarId(elemento: any) {

    var objetoBusqueda: any;

    try {
      if (this.formularioFiltros) {
        switch (elemento) {
          case '1': {

            objetoBusqueda = this.formularioFiltros.value;

            this.serviciosObservacionesEstacionService
              .obtenerDTO(objetoBusqueda)
              .subscribe((Response) => {
                this.listObservaciones = Response.map(
                  (p: { [x: string]: any; idParametroXEstacion: any }) => {
                    // crear nueva propiedad de nombre Del Elemento
                    p[`idParametroXElemento`] = p.idParametroXEstacion;
                    p[`idObservacionXElemento`] =
                      p.idObservacionXEstacionInicial;
                    // remover la propiedad actual
                    delete p.idParametroXEstacion;
                    delete p.idObservacionXEstacionInicial;
                    // retornar el nuevo objeto
                    return p;
                  }
                );

              });

            break;
          }
          case '2': {
            // Embalses

            objetoBusqueda = this.formularioFiltros.value;

            this.serviciosObservacionesEmbalsesService
              .obtenerDTO(objetoBusqueda)
              .subscribe((Response) => {
                this.listObservaciones = Response.map(
                  (p: { [x: string]: any; idParametroXEmbalse: any }) => {
                    // crear nueva propiedad de nombre Del Elemento
                    p[`idParametroXElemento`] = p.idParametroXEmbalse;
                    p[`idObservacionXElemento`] =
                      p.idObservacionXEmbalseInicial;
                    // remover la propiedad actual
                    delete p.idParametroXEmbalse;
                    delete p.idObservacionXEmbalseInicial;
                    // retornar el nuevo objeto
                    return p;
                  }
                );

              });
            break;
          }
          case '3': {
            // Pozos
            objetoBusqueda = this.formularioFiltros.value;

            this.serviciosObservacionesPozosService
              .obtenerDTO(objetoBusqueda)
              .subscribe((Response) => {
                this.listObservaciones = Response.map(
                  (p: { [x: string]: any; idParametroXPozo: any }) => {
                    // crear nueva propiedad de nombre Del Elemento
                    p[`idParametroXElemento`] = p.idParametroXPozo;
                    p[`idObservacionXElemento`] = p.idObservacionXPozoInicial;
                    // remover la propiedad actual
                    delete p.idParametroXPozo;
                    delete p.idObservacionXPozoInicial;
                    // retornar el nuevo objeto
                    return p;
                  }
                );

              });

            break;
          }
          default: {
            console.log('elemento', elemento);
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  }


  validarEstado(id: any) {


    this.serviciosParametrosService
      .validaObervacionesIdestado(id)
      .subscribe((response) => {

        this.listaValidacion = response;
        console.log(response);

        if (this.listaValidacion.length) {
          console.log(4, this.listaValidacion.length);
          var respost;
          this.serviciosObservacionesEstacionService
            .actualizarEstadoObservacion(841, id)
            .subscribe((Response) => {

              respost = Response;


            })

        } else {


          var respost;
          this.serviciosObservacionesEstacionService
            .actualizarEstadoObservacion(265, id)
            .subscribe((Response) => {

              respost = Response;


            })

        }


      });






  }


  crearValidaObervacion(i: any, obervacion: any, criterio: any) {

    var tipo: number = 446;
    var validacion: any = 0;
    var ValMaximo: number = 0;
    var ValMinimo: number = 0;
    var estado: any;

    this.serviciosvalorParametroXCriterio
      .obtenerValoresXParametrosDeCriterio(
        this.formularioFiltros.value.idParametro, criterio.idCriterio,
      )
      .subscribe((response) => {


        ValMaximo = response.valor1;
        ValMinimo = response.valor2;

        const element = obervacion;
        console.log(1, ValMaximo);
        console.log(2, obervacion.valor);
        if (obervacion.valor > ValMaximo) {

          estado = 841;
          validacion = 0;
          this.validar = 0;
          console.log('r');
        }
        if (obervacion.valor < ValMinimo) {
          estado = 841;
          validacion = 0;
          this.validar = 0;
          console.log('r', this.validar);
        }


        if (!estado) {
          estado = 265;
          validacion = 1;
          this.validar = 1;
          console.log('v', this.validar);
        }






        let validaObervacion: IValidaObervacion = {
          fechaValidacion: this.hoy,
          idCriterio: criterio.idCriterio,
          idElemento: this.formularioFiltros.value.idElemento,
          idObservacion: obervacion.idObservacionXElemento,
          idTipoElemento: tipo,
          idParametro: this.formularioFiltros.value.idParametro,
          resultadoValidacion: validacion,
          usuarioValidacion: 2
        }

        this.serviciosParametrosService
          .crearValidacionObervacion(validaObervacion)
          .subscribe((response) => {
            this.listValidaObervacion = response;


          });







      });








  }

  crearValidaObervacion1(i: any, obervacion: any, criterio: any) {

    var tipo: number = 446;
    var validacion: any = 0;
    var ValMaximo: number = 0;
    var ValMinimo: number = 0;
    var estado: any;

    this.serviciosvalorParametroXCriterio
      .obtenerValoresXParametrosDeCriterio(
        this.formularioFiltros.value.idParametro, criterio.idCriterio,
      )
      .subscribe((response) => {


        ValMaximo = this.valorMaximoH;
        ValMinimo = this.valorMiniH;

        const element = obervacion;
        console.log(1, ValMaximo);
        console.log(2, obervacion.valor);
        if (obervacion.valor > ValMaximo) {

          estado = 841;
          validacion = 0;
          this.validar = 0;
          console.log('r');
        }
        if (obervacion.valor < ValMinimo) {
          estado = 841;
          validacion = 0;
          this.validar = 0;
          console.log('r', this.validar);
        }


        if (!estado) {
          estado = 265;
          validacion = 1;
          this.validar = 1;
          console.log('v', this.validar);
        }



        let validaObervacion: IValidaObervacion = {
          fechaValidacion: this.hoy,
          idCriterio: criterio.idCriterio,
          idElemento: this.formularioFiltros.value.idElemento,
          idObservacion: obervacion.idObservacionXElemento,
          idTipoElemento: tipo,
          idParametro: this.formularioFiltros.value.idParametro,
          resultadoValidacion: validacion,
          usuarioValidacion: 2
        }

        this.serviciosParametrosService
          .crearValidacionObervacion(validaObervacion)
          .subscribe((response) => {
            this.listValidaObervacion = response;


          });





      });








  }

  crearValidaObervacion13(i: any, obervacion: any, criterio: any) {

    var ValMaximo: number = 0;
    var ValMinimo: number = 0;
    var tipo: number = 446;
    var objetoBusqueda = this.formularioFiltros.value;
    var tipo: number = 446;
    var validacion: any = 0;
    var ValMaximo: number = 0;
    var ValMinimo: number = 0;
    var estado: any;
    switch (this.elemento) {
      case '1': {


        this.serviciosObservacionesEstacionService
          .obtenerValoresDTO(objetoBusqueda)
          .subscribe((Response) => {

            var validacion: number = 0;
            ValMaximo = Response.valor1;
            ValMinimo = Response.valor2;

            const element = obervacion;
            if (obervacion.valor > ValMaximo) {
              estado = 841;
              validacion = 0;
              this.validar = 0;
              console.log('r');
            }
            if (obervacion.valor < ValMinimo) {
              estado = 841;
              validacion = 0;
              this.validar = 0;
              console.log('r');
            }
            if (obervacion.valor == undefined) {
              estado = 265;
              validacion = 1;
              this.validar = 1;
              console.log('v', this.validar);
            }




            let validaObervacion: IValidaObervacion = {
              fechaValidacion: this.hoy,
              idCriterio: criterio.idCriterio,
              idElemento: this.formularioFiltros.value.idElemento,
              idObservacion: obervacion.idObservacionXElemento,
              idTipoElemento: tipo,
              idParametro: this.formularioFiltros.value.idParametro,
              resultadoValidacion: validacion,
              usuarioValidacion: 2
            }

            this.serviciosParametrosService
              .crearValidacionObervacion(validaObervacion)
              .subscribe((response) => {
                this.listValidaObervacion = response;


              });



          });

        break;
      }
      case '2': {
        // Embalses

        this.serviciosObservacionesEmbalsesService
          .obtenerValoresDTO(objetoBusqueda)
          .subscribe((Response) => {
            ValMaximo = Response.valor1;
            ValMinimo = Response.valor2;
            var validacion: number = 0;
            for (
              let index = 0;
              index < this.listObservaciones.length;
              index++
            ) {

              this.serviciosParametrosService
                .validaObervacionesId(parseInt(this.listObservaciones[index]['idObservacionXElemento']))
                .subscribe((response) => {
                  if (response == null) {

                    const element = this.listObservaciones[index];
                    if (this.listObservaciones[index].valor > ValMaximo) {
                      validacion = 0;
                      this.listObservaciones[index].validarCalidad =
                        '<a><em class="fas fa-bell fa-2x semaforoRojo"></em></a>';
                    }
                    if (this.listObservaciones[index].valor < ValMinimo) {
                      validacion = 0;
                      this.listObservaciones[index].validarCalidad =
                        '<a><em class="fas fa-bell fa-2x semaforoRojo"></em></a>';
                    }
                    if (this.listObservaciones[index].validarCalidad == undefined) {
                      validacion = 1;
                      this.listObservaciones[index].validarCalidad =
                        '<a><em class="fas fa-circle fa-2x semaforoVerde"></em></a>';
                    }

                    let validaObervacion: IValidaObervacion = {
                      fechaValidacion: this.hoy,
                      idCriterio: this.listaDeCriterios[index].idCriterio,
                      idElemento: this.formularioFiltros.value.idElemento,
                      idObservacion: this.listObservaciones[index].idObservacion,
                      idTipoElemento: tipo,
                      idParametro: this.formularioFiltros.value.idParametro,
                      resultadoValidacion: validacion,
                      usuarioValidacion: 2
                    }

                    this.serviciosParametrosService
                      .crearValidacionObervacion(validaObervacion)
                      .subscribe((response) => {
                        this.listValidaObervacion = response;
                      });
                  }

                });

            }
            this.datosFilter = this.listObservaciones;
          });
        break;
      }
      case '3': {
        // Pozos

        this.serviciosObservacionesPozosService
          .obtenerValoresDTO(objetoBusqueda)
          .subscribe((Response) => {
            ValMaximo = Response.valor1;
            ValMinimo = Response.valor2;
            var validacion: number = 0;
            for (
              let index = 0;
              index < this.listObservaciones.length;
              index++
            ) {

              this.serviciosParametrosService
                .validaObervacionesId(parseInt(this.listObservaciones[index]['idObservacionXElemento']))
                .subscribe((response) => {
                  if (response == null) {


                    const element = this.listObservaciones[index];
                    if (this.listObservaciones[index].valor > ValMaximo) {
                      validacion = 0;
                      this.listObservaciones[index].validarCalidad =
                        '<a><em class="fas fa-bell fa-2x semaforoRojo"></em></a>';
                    }
                    if (this.listObservaciones[index].valor < ValMinimo) {
                      validacion = 0;
                      this.listObservaciones[index].validarCalidad =
                        '<a><em class="fas fa-bell fa-2x semaforoRojo"></em></a>';
                    }
                    if (this.listObservaciones[index].validarCalidad == undefined) {
                      validacion = 1;
                      this.listObservaciones[index].validarCalidad =
                        '<a><em class="fas fa-circle fa-2x semaforoVerde"></em></a>';
                    }


                    let validaObervacion: IValidaObervacion = {
                      fechaValidacion: this.hoy,
                      idCriterio: this.listaDeCriterios[index].idCriterio,
                      idElemento: this.formularioFiltros.value.idElemento,
                      idObservacion: this.listObservaciones[index].idObservacion,
                      idTipoElemento: tipo,
                      idParametro: this.formularioFiltros.value.idParametro,
                      resultadoValidacion: validacion,
                      usuarioValidacion: 2
                    }

                    this.serviciosParametrosService
                      .crearValidacionObervacion(validaObervacion)
                      .subscribe((response) => {
                        this.listValidaObervacion = response;
                      });
                  }
                });

            }

            this.datosFilter = this.listObservaciones;
          });

        break;
      }
      default: {
        console.log('elemento', this.elemento);
      }
    }
  }


  crearValidaObervacion2(index: any, obervacion: any, criterio: any) {


    var estado;
    var ValMaximo: number = 0;
    var ValMinimo: number = 0;
    var tipo: number = 446;
    var validacion = 0;
    this.serviciosvalorParametroXCriterio
      .obtenerValoresXParametrosDeCriterio(
        this.formularioFiltros.value.idParametro, criterio.idCriterio,
      )
      .subscribe((response) => {





        ValMaximo = response.valor1;
        ValMinimo = response.valor2;



        const element = obervacion;
        var consistencia;
        if (this.listObservaciones[index - 1]) {
          consistencia = this.listObservaciones[index - 1]['valor']
        } else {
          consistencia = obervacion.valor;
        }
        console.log(24, consistencia);
        var constante = consistencia - obervacion.valor
        var valor_ad = Math.abs(constante);

        if (valor_ad > ValMaximo) {
          estado = 841;
          validacion = 0;
          console.log('r');
          this.validar = 0;

        } else {
          estado = 265;
          validacion = 1;
          this.validar = 1;
        }


        let validaObervacion: IValidaObervacion = {
          fechaValidacion: this.hoy,
          idCriterio: criterio.idCriterio,
          idElemento: this.formularioFiltros.value.idElemento,
          idObservacion: obervacion.idObservacionXElemento,
          idTipoElemento: tipo,
          idParametro: this.formularioFiltros.value.idParametro,
          resultadoValidacion: validacion,
          usuarioValidacion: 2
        }

        this.serviciosParametrosService
          .crearValidacionObervacion(validaObervacion)
          .subscribe((response) => {
            this.listValidaObervacion = response;


          });







      });


  }


  crearValidaObervacion3(index: any, obervacion: any, criterio: any) {


    var estado;
    var ValMaximo: number = 0;
    var ValMinimo: number = 0;
    var tipo: number = 446;
    var validacion = 0;
    this.serviciosvalorParametroXCriterio
      .obtenerValoresXParametrosDeCriterio(
        this.formularioFiltros.value.idParametro, criterio.idCriterio,
      )
      .subscribe((response) => {


        ValMaximo = response.valor1;
        ValMinimo = response.valor2;
        var estado;
        var numero = index + 1;

        var numfin = numero - ValMaximo;

        console.log(ValMaximo);



        for (let i = 0; i < ValMaximo; i++) {

          console.log(ValMaximo);

          switch (this.listObservaciones[index - i]['valor']) {
            case obervacion.valor: {
              console.log(obervacion.valor, this.listObservaciones[index - i]['valor']);
              console.log(25, this.listObservaciones[index - i]['valor']);
              estado = 841;
              validacion = 0;
              this.validar = 0;

              break;
            }
            default: {

              estado = 265;
              validacion = 1;
              this.validar = 1;
              console.log(25, this.listObservaciones[index - i]['valor']);
              console.log('calidad', this.listObservaciones[index - i]['estadoObservacion']);
            }

          }

        }
        console.log(numfin);



        let validaObervacion: IValidaObervacion = {
          fechaValidacion: this.hoy,
          idCriterio: criterio.idCriterio,
          idElemento: this.formularioFiltros.value.idElemento,
          idObservacion: obervacion.idObservacionXElemento,
          idTipoElemento: tipo,
          idParametro: this.formularioFiltros.value.idParametro,
          resultadoValidacion: validacion,
          usuarioValidacion: 2
        }

        this.serviciosParametrosService
          .crearValidacionObervacion(validaObervacion)
          .subscribe((response) => {
            this.listValidaObervacion = response;


          });








      });


  }

  CalcularCalidad() {

    var validacion: any;


    for (let i = 0; i < this.listObservaciones.length; i++) {


      if (this.listObservaciones[i]['estadoObservacion'] === "No validado") {

        this.serviciosParametrosCriterio
          .obtenerListaCriterioXParametros(this.listObservaciones[i]['idParametro'])
          .subscribe((response) => {
            var obervacion = this.listObservaciones[i];

            for (let index = 0; index < response.length; index++) {


              switch (response[index]['idCriterio']) {
                case 104: {

                  this.crearValidaObervacion(i, this.listObservaciones[i], response[index]);
                  console.log(i, this.validar);



                  break;
                } case 107: {
                  this.crearValidaObervacion1(i, this.listObservaciones[i], response[index]);
                  console.log(i, this.validar);
                  break;
                }
                case 201: {

                  this.crearValidaObervacion2(i, this.listObservaciones[i], response[index]);
                  console.log(i, this.validar);


                  break;
                }
                case 202: {
                  this.crearValidaObervacion3(i, this.listObservaciones[i], response[index]);
                  break;
                }
                default: {
                  console.log('elemento', this.elemento);
                }
              }







            }

          });

      }

      this.validarEstado(this.listObservaciones[i]['idObservacionXElemento']);



    }





    this.filtrarId(this.elemento);



    for (let i = 0; i < this.listObservaciones.length; i++) {




      if (this.listObservaciones[i]['estadoObservacion'] == "Validado") {
        this.listObservaciones[i]['validarCalidad'] =
          '<a><em class="fas fa-circle fa-2x semaforoVerde"></em></a>';
      } else {

        this.listObservaciones[i]['validarCalidad'] =
          '<a><em class="fas fa-circle fa-2x semaforoRojo"></em></a>';
      }

      this.datosFilter = this.listObservaciones;




    }

    this.filtrarId(this.elemento);

  }

  CalcularCalidad44() {

    var ValMaximo: number = 0;
    var ValMinimo: number = 0;
    var tipo: number = 0;

    var objetoBusqueda = this.formularioFiltros.value;

    this.serviciosCriteriosAceptacion.obtener().subscribe((response) => {
      this.listaDeCriterios = response;


      for (let index = 0; index < this.listaDeCriterios.length; index++) {
        switch (this.listaDeCriterios[index].idCriterio) {
          case 104: {
            //this.crearValidaObervacion(104);
            break;
          } case 107: {
            // this.crearValidaObervacion1(107);
            break;
          }
          case 201: {
            // this.crearValidaObervacion2(201);
            break;
          }
          case 202: {
            //this.crearValidaObervacion3(202);
            break;
          }
          default: {
            console.log('elemento', this.elemento);
          }
        }

      }

    });



  }


  private cargarMunicipiosPorDepartamento() {
    this.serviciosGeograficosService
      .obtenerMunicipiosPorIdDepartamento(this.tempIdDepartamento)
      .subscribe((response) => {
        this.listaMunicipios = response;
      });
  }
  cambioDepartamento(departamentoSelected: any) {
    if (departamentoSelected != undefined && departamentoSelected != '') {
      this.tempIdDepartamento = departamentoSelected;
      this.cargarMunicipiosPorDepartamento();
    }
  }

  obtenerEstaciones() {
    Swal.fire({
      title: 'Cargando...',
      html: 'Por favor espere.',
      timer: 42000,
      timerProgressBar: true,
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: async () => {
        Swal.showLoading();
        this.serviciosEstacionesService
          .obtenerEstaciones()
          .subscribe((response) => {
            this.listaElementosSeleccionados = response.map((event: any) => {
              return { id: event.idEstacion, text: event.estacion };
            });
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


            Swal.close();
          });
      },
      willClose: async () => {
        Swal.hideLoading();
      }
    });
  }
  obtenerEmbalses() {
    Swal.fire({
      title: 'Cargando...',
      html: 'Por favor espere.',
      timer: 42000,
      timerProgressBar: true,
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: async () => {
        Swal.showLoading();
        this.serviciosEmbalcesService
          .obtenerEembalsesDTO()
          .subscribe((response) => {
            this.listaElementosSeleccionados = response.map((event: any) => {
              return { id: event.idEmbalse, text: event.embalse };
            });
            Swal.close();
          });
      },
      willClose: async () => {
        Swal.hideLoading();
      }
    });
  }
  obtenerPozos() {
    Swal.fire({
      title: 'Cargando...',
      html: 'Por favor espere.',
      timer: 42000,
      timerProgressBar: true,
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: async () => {
        Swal.showLoading();
        this.serviciosPozosService.obtenerPozosDTO().subscribe((response) => {
          this.listaElementosSeleccionados = response.map((event: any) => {
            return { id: event.idPozo, text: event.pozo };
          });
          Swal.close();
        });
      },
      willClose: async () => {
        Swal.hideLoading();
      }
    });
  }

  ValidarCalidad(estado: number) {
    if (this.formularioCalidad.valid) {
      switch (this.elemento) {
        case '1': {
          let elementoActualizar: any = {
            idObservacionXEstacionInicial:
              this.objetoValidar.idObservacionXElemento,
            idParametroXEstacion:  this.objetoValidar.idParametroXElemento,
            activo: this.objetoValidar.activo,
            descripcion: this.objetoValidar.descripcion,
            estacion: this.objetoValidar.estacion,
            estadoObservacion: this.objetoValidar.estadoObservacion,
            fecha: this.objetoValidar.fecha,
            fechaCargue: this.objetoValidar.fechaCargue,
            fechaCreacion: this.objetoValidar.fechaCreacion,
            fechaEstado: this.objetoValidar.fechaEstado,
            fechaModificacion: this.objetoValidar.fechaModificacion,
            frecuencia: this.objetoValidar.frecuencia,
            idEstacion: this.objetoValidar.idEstacion,

            idFlagObservacion: this.objetoValidar.idFlagObservacion,
            idParametro: this.objetoValidar.idParametro,
            idTipoOrigenObservacion: this.objetoValidar.idTipoOrigenObservacion,
            origen: this.objetoValidar.origen,
            tipoOrigenObservacion: this.objetoValidar.tipoOrigenObservacion,
            usuarioCargue: this.objetoValidar.usuarioCargue,
            usuarioCreacion: this.objetoValidar.usuarioCreacion,
            usuarioEstado: this.objetoValidar.usuarioEstado,
            usuarioModificacion: this.objetoValidar.usuarioModificacion,
            valor: this.objetoValidar.valor,
            idEstadoObservacion: estado,
            idCriterioCalidad: this.criterioCalidadSeleccionado,
            observacioneCalidad: this.observacionesCalidad,
          };
          this.serviciosObservacionesEstacionService
            .actualizar(elementoActualizar)
            .subscribe((Response) => {
              this.filtrar(this.elemento);
              // this.estado = 0
              this.observacionesCalidad = '';
            });

          break;
        }
        case '2': {
          // Embalses

          let elementoActualizar: any = {
            idObservacionXEmbalseInicial:
              this.objetoValidar.idObservacionXElemento,
            idParametroXEmbalse: this.objetoValidar.idParametroXElemento,
            activo: this.objetoValidar.activo,
            descripcion: this.objetoValidar.descripcion,
            estacion: this.objetoValidar.estacion,
            estadoObservacion: this.objetoValidar.estadoObservacion,
            fecha: this.objetoValidar.fecha,
            fechaCargue: this.objetoValidar.fechaCargue,
            fechaCreacion: this.objetoValidar.fechaCreacion,
            fechaEstado: this.objetoValidar.fechaEstado,
            fechaModificacion: this.objetoValidar.fechaModificacion,
            frecuencia: this.objetoValidar.frecuencia,
            idEstacion: this.objetoValidar.idEstacion,
            idFlagObservacion: this.objetoValidar.idFlagObservacion,
            idParametro: this.objetoValidar.idParametro,
            idTipoOrigenObservacion: this.objetoValidar.idTipoOrigenObservacion,
            origen: this.objetoValidar.origen,
            tipoOrigenObservacion: this.objetoValidar.tipoOrigenObservacion,
            usuarioCargue: this.objetoValidar.usuarioCargue,
            usuarioCreacion: this.objetoValidar.usuarioCreacion,
            usuarioEstado: this.objetoValidar.usuarioEstado,
            usuarioModificacion: this.objetoValidar.usuarioModificacion,
            valor: this.objetoValidar.valor,
            idEstadoObservacion: estado,
            idCriterioCalidad: this.criterioCalidadSeleccionado,
            observacioneCalidad: this.observacionesCalidad,
          };

          this.serviciosObservacionesEmbalsesService
            .actualizar(elementoActualizar)
            .subscribe((Response) => { });
          this.filtrar(this.elemento);
          // this.idNewEstadoObservacion = 0
          this.observacionesCalidad = '';
          break;
        }
        case '3': {
          //  Pozos

          let elementoActualizar: any = {
            idObservacionXPozoInicial:
              this.objetoValidar.idObservacionXElemento,
            idParametroXPozo: this.objetoValidar.idParametroXElemento,
            activo: this.objetoValidar.activo,
            descripcion: this.objetoValidar.descripcion,
            estacion: this.objetoValidar.estacion,
            estadoObservacion: this.objetoValidar.estadoObservacion,
            fecha: this.objetoValidar.fecha,
            fechaCargue: this.objetoValidar.fechaCargue,
            fechaCreacion: this.objetoValidar.fechaCreacion,
            fechaEstado: this.objetoValidar.fechaEstado,
            fechaModificacion: this.objetoValidar.fechaModificacion,
            frecuencia: this.objetoValidar.frecuencia,
            idEstacion: this.objetoValidar.idEstacion,
            idFlagObservacion: this.objetoValidar.idFlagObservacion,
            idParametro: this.objetoValidar.idParametro,
            idTipoOrigenObservacion: this.objetoValidar.idTipoOrigenObservacion,
            origen: this.objetoValidar.origen,
            tipoOrigenObservacion: this.objetoValidar.tipoOrigenObservacion,
            usuarioCargue: this.objetoValidar.usuarioCargue,
            usuarioCreacion: this.objetoValidar.usuarioCreacion,
            usuarioEstado: this.objetoValidar.usuarioEstado,
            usuarioModificacion: this.objetoValidar.usuarioModificacion,
            valor: this.objetoValidar.valor,
            idEstadoObservacion: estado,
            idCriterioCalidad: this.criterioCalidadSeleccionado,
            observacioneCalidad: this.observacionesCalidad,
          };

          // console.log('Guardando Validacion', elementoActualizar);
          this.serviciosObservacionesPozosService
            .actualizar(elementoActualizar)
            .subscribe((Response) => {
              this.filtrar(this.elemento);
              // this.idNewEstadoObservacion = 0
              this.observacionesCalidad = '';
            });
          break;
        }
        default: {
          // console.log('this.objetoValidaro', this.objetoValidar);
        }
      }
      this.ModalCalidad.nativeElement.click();
    }
  }

  lista(listaSelect: any) {
    // debugger
    if (listaSelect.length >= 2) {
      this.listaDeElementos = listaSelect;
    }
  }

  validarParametro(parametro: any) {
    for (let index = 0; index < this.listParametroXElemento.length; index++) {
      // Validar Estacion
      if (
        // validar parametro
        this.listParametroXElemento[index] == parametro
      ) {
        this.toast.fire({
          icon: 'info',
          title: 'El parametro ya se encuentra agregado',
        });

        return false;
      }
    }

    if (parametro == '') {
      return false;
    }
    if (this.listParametroXElemento.length >= 10) {
      this.toast.fire({
        icon: 'info',
        title: 'Ya cuenta con 10 Parametros Agregados',
      });

      return false;
    }

    return true;
  }
  validarElemeto(elemento: any) {
    for (let index = 0; index < this.listaBusqueda.length; index++) {
      // Validar Estacion
      switch (this.elemento) {
        case '1': {
          if (
            // validar parametro
            this.listaBusqueda[index].idEstacion == elemento.idEstacion
          ) {
            this.toast.fire({
              icon: 'info',
              title: 'La Estacion ya se encuentra agregado',
            });

            return false;
          }
          break;
        }
        case '2': {
          // Embalses

          if (
            // validar parametro
            this.listaBusqueda[index].idEmbalse == elemento.idEmbalse
          ) {
            this.toast.fire({
              icon: 'info',
              title: 'El Embalse ya se encuentra agregado',
            });

            return false;
          }

          break;
        }
        case '3': {
          // Pozos

          if (
            // validar parametro
            this.listaBusqueda[index].idPozo == elemento.idPozo
          ) {
            this.toast.fire({
              icon: 'info',
              title: 'El Pozo ya se encuentra agregado',
            });

            return false;
          }

          break;
        }
        default: {
          console.log('elemento', elemento);
        }
      }
    }

    if (this.listaBusqueda.length >= 10) {
      this.toast.fire({
        icon: 'info',
        title: 'Ya cuenta con 10 elementos Agregados',
      });

      return false;
    }

    return true;
  }

  consultarConfiguracionP(any: any) {

    var id = this.formularioFiltros.value.idParametroConfig;

    if (id) {
      this.serviciosParametrosService.obtenerConfigPorId(id).subscribe(
        (response) => {
          this.listarConfiguracionP = response;
          console.log(this.listarConfiguracionP[0]);
          if (!this.listarConfiguracionP[0]) {
            this.toast.fire({
              icon: 'error',
              title: 'El parametro debe ser configurado!',
            });

          } else {



            this.serviciosParametrosService.obtenerPorId(id).subscribe(
              (response) => {

                if (!response) {
                  this.toast.fire({
                    icon: 'error',
                    title: 'El parametro debe ser configurado!',
                  });


                } else {



                };
                // console.log(response);
                this.listarParametro = response;

                this.idfrecuencia = this.listarParametro.idPeriodo;

                this.serviciosParametrosService
                  .obtenerPorIdCodigo(this.listarParametro.codigoOrigen)
                  .subscribe((response) => {
                    this.listParametroOrigen = response;
                    this.parametroO = this.listParametroOrigen.descripcion

                    this.formularioFiltros.get('idElemento')?.enable();
                    this.formularioFiltros.get('codigoEstacionEaab')?.enable();
                    this.formularioFiltros.get('CodigoIDEAM')?.enable();


                    switch (this.listarParametro.idPeriodo) {
                      case 154: {

                        this.frecuencia = "Mensual"
                        break;
                      }
                      case 155: {

                        this.frecuencia = "Anual"
                        break;
                      } case 145: {

                        this.frecuencia = "Segendos"
                        break;
                      } case 152: {

                        this.frecuencia = "Dia"
                        break;
                      } case 151: {

                        this.frecuencia = "Hora"
                        break;
                      } case 145: {

                        this.frecuencia = "Miutos"
                        break;
                      } case 682: {

                        this.frecuencia = "10 minutos "
                        break;
                      } case 683: {

                        this.frecuencia = "5 minutos "
                        break;
                      }


                      default: {

                        break;
                      }
                    }

                  });
              }
            );
            // console.log(response);

            switch (this.listarConfiguracionP[0]['idOperacion']) {
              case 907: {

                this.operacion = "MIN"
                break;
              }
              case 908: {

                this.operacion = "COUNT"
                break;
              } case 906: {

                this.operacion = "MAX"
                break;
              } case 909: {

                this.operacion = "AVG"
                break;
              } case 965: {

                this.operacion = "SUM"
                break;
              }
              default: {

                break;
              }
            }

          }


        }

      );

    }

  }
  obtener() {
    this.serviciosParametrosService
      .validaObervacionesId(this.id)
      .subscribe((response) => {
        this.listValidaObervacion = response;

        console.log(this.listValidaObervacion);
        for (let i = 0; i < this.listValidaObervacion.length; i++) {




          if (this.listValidaObervacion[i]['resultado'] == 1) {
            this.listValidaObervacion[i]['estado'] =
              '<a><em class="fas fa-circle fa-2x semaforoVerde"></em></a>';
          } else {

            this.listValidaObervacion[i]['estado'] =
              '<a><em class="fas fa-circle fa-2x semaforoRojo"></em></a>';
          }

          this.listValidaObervacion = this.listValidaObervacion;

        }

      });

  }
  obetenerFechaFin(e: any) {



    if (this.idfrecuencia == 151 || this.idfrecuencia == 146 || this.idfrecuencia == 145 || this.idfrecuencia == 683 || this.idfrecuencia == 682) {
      this.fechaFinal = "";
      const dateInicio = this.formularioFiltros.value.fechaInicio;
      var minuto1 = dateInicio.slice(14, 16);
      var hora1 = dateInicio.slice(11, 13);
      var dia1 = dateInicio.slice(8, 10);
      var mes1 = dateInicio.slice(5, 7);
      var ano3 = dateInicio.slice(0, 4);
      var finstring = parseFloat(dia1)
      var diamas = finstring + 1;
      var fechaFinal: string = ano3 + '-' + mes1 + '-' + diamas + 'T' + hora1 + ":" + minuto1 + ':00.000';
      this.fechaFinal = fechaFinal
      this.formularioFiltros.value.fechaFin = this.fechaFinal;




    } else {
      this.toast.fire({
        icon: 'error',
        title:
          'Debe selecionar fejca actual !',
      });

    }
  }



}
