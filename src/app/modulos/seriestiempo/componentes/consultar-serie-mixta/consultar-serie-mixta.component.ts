import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LegendPosition } from '@swimlane/ngx-charts';
import { ServiciosGeograficosService } from 'src/app/common/mapa/servicios-geograficos.service';
import { estados } from 'src/app/common/utils/constantes';
import { accionesTablasEnum } from 'src/app/modelo/enum/acciones-tablas-enum';
import { capasEnum, capasEnumDatos } from 'src/app/modelo/enum/capas-enum';
import { dominiosEnum } from 'src/app/modelo/enum/dominios-enum';
import { ServiciosEmbalcesService } from 'src/app/modulos/elementos/embalses/servicios-embalses.service';
import { ServiciosEstacionesService } from 'src/app/modulos/elementos/estaciones/servicios-estaciones.service';
import { ServiciosPozosService } from 'src/app/modulos/elementos/pozos/servicios-pozos.service';
import { ServiciosObservacionesEmbalsesService } from 'src/app/modulos/observaciones/servicios-observaciones-embalses.service';
import { ServiciosObservacionesEstacionService } from 'src/app/modulos/observaciones/servicios-observaciones-estacion.service';
import { ServiciosObservacionesPozosService } from 'src/app/modulos/observaciones/servicios-observaciones-pozos.service';
import { ServiciosParametrosService } from 'src/app/modulos/parametros/servicios-parametros.service';
import { ServiciosSerieTiempoService } from 'src/app/modulos/seriestiempo/servicios/servicios-serie-tiempo.service';
import Swal from 'sweetalert2';
import { ServiciosCapasService } from '../../../configuracion/capas/servicios-capas.service';
import { ServiciosDominiosValoresService } from '../../../configuracion/dominios/servicios-dominios-valores.service';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-consultar-serie-mixta',
  templateUrl: './consultar-serie-mixta.component.html'
})
export class ConsultarSerieMixtaComponent implements OnInit {

  public formularioFiltros!: FormGroup;

  // Mapa
  datatableElement: DataTableDirective | undefined;
  capas = [
    {
      url: 'http://apps.diegopedroza.co:11030/arcgis/rest/services/sish/departamentos/MapServer/0',
      id: 'departamentos',
      visible: true,
      titulo: 'Departamentos',
    },
    {
      url: 'http://apps.diegopedroza.co:11030/arcgis/rest/services/sish/zonificacion/MapServer/0',
      id: 'zonificacion',
      visible: true,
      titulo: 'Zonificación',
    },
    {
      url: 'http://apps.diegopedroza.co:11030/arcgis/rest/services/sish/estaciones/MapServer/0',
      id: 'estaciones',
      visible: true,
      titulo: 'Estaciones',
    },
  ];
  // Set our map properties
  mapCenter = [-73.9, 4.4];
  basemapType = 'topo';
  mapZoomLevel = 9;

  // See app.component.html
  mapLoadedEvent(status: Event) {
    console.log('The map loaded: ' + status);
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
    },
  });
  public Mecanismo:string;
  public listaMunicipios = [];
  public listaDepartamentos = [];
  public departamentoSelected: any;
  private tempIdDepartamento: number = 0;
  datosOriginal = [] as any;
  public listZonaEAAB = [];
  public listTipoPozo = [];
  public listCategoriaPozo = [];
  public listCondicionPozo = [];
  public geograficas = false;
  public planas = false;
  public listEntidades = [];
  public listaAreaHidrografica = [];
  public listaZonaHidrografica = [];
  public listasubZonaHidrografica = [];
  public listanivel = [];
  public listaCuenca = [];
  public listaMicrocuenca = [];
  public listaEntidad = [];
  public listParametro: any[] = [];
  public listaFrecuencia = [];
  public listaSubcuenca = [];
  public listaBusqueda: any[] = [];
  public elemento: number = 0;
  public periodo: number = 0;
  public parametro: number;
  public listaCodigoEAAB: any = [];
  public listaCodigoIDEAM: any = [];
  public abscisa:number;
  public profundidadTotal :number;
  public VMV:number;
  public velocidadMedia:number;
  public area:number;
  public caudalparcial:number;
  public listaPerido:any=[];
  public listaCorrelacion:any=[];


  rutaGeneral = 'configuracion/gestionAforo/C/0';
  rutaEdicion = 'configuracion/gestionAforo/E/';
  rutaConsulta = 'configuracion/gestionAforo/V/';

  datosFilterEstaciones = [] as any;
  datosFilterEmbalses = [] as any;
  datosFilterPozos = [] as any;
  datosFilter = [] as any;
  datosSerieAnio = [] as any;
  datosSerieMes = [] as any;
  listParametroXElemento = [] as any;
  listaElementos = [] as any;
  listaTipoAforo = [] as any;
  listaElemento = [] as any;
  listAforos = [] as any;

  public idTipoElemento: any;
  public idElemento: string = '0';

  columnas = [
    
    {
      title: 'ID',
      data: 'idSerieMixta',
      visible: false, 
      filterValueMin: '',
      filterValueMax: '',
      tipo: 'rangoNumero',
    },
    {
      title: 'idTipoElemento',
      data: 'idTipoElemento',
      class: 'text-center',
      visible: false,
    },
    {
      title: 'Elemento',
      data: 'elemento',
      class: 'text-center',
      visible: true,
    },
    {
      title: 'Código EAAB',
      data: 'codigoEAAB',
      class: 'text-center',
      visible: true,
    },
    {
      title: 'Código IDEAM',
      data: 'codigoIDEAM',
      class: 'text-center',
      visible: true,
    },
    {
      title: 'Nombre Parámetro',
      data: 'parametro',
      class: 'text-center',
      visible: true,
    },
    {
      title: 'Año',
      data: 'anio',
      class: 'text-center',
      visible: true,
    },
    {
      title: 'Mes',
      data: 'mes',
      class: 'text-center',
      visible: true,
    },
    {
      title: 'Minimo',
      data: 'minimo',
      class: 'text-center',
      visible: true,
    },
    
    {
      title: 'Maximo',
      data: 'maximo',
      class: 'text-center',
      visible: true,
    },
    {
      title: 'Promedio',
      data: 'promedio',
      class: 'text-center',
      visible: true,
    },
    {
      title: 'Estado',
      data: 'estado',
      class: 'text-center',
      visible: true,
    }    
  ];

  botones = [
    {
      class: 'sish-boton-azul',
      title: 'agregar',
      action: 'agregar',
      icon: 'fas fa-tasks',
    },
    {
      class: 'sish-boton-azul',
      title: 'Calcular Aforo',
      action: 'calcular',
      icon: 'fas fa-tasks',
    },
    
  ];

  botonesGenerales = [
    {
      text: 'Activar Todos',
      action: 'Activacion',
    },
    {
      text: 'Inactivar todos',
      action: 'Inactivar',
    },
  ];

  // graficos
  multi: any = [
    {
      name: 'Germany',
      series: [
        {
          name: '1990',
          value: 62000000,
        },
        {
          name: '2010',
          value: 73000000,
        },
        {
          name: '2011',
          value: 89400000,
        },
      ],
    },

    {
      name: 'USA',
      series: [
        {
          name: '1990',
          value: 250000000,
        },
        {
          name: '2010',
          value: 309000000,
        },
        {
          name: '2011',
          value: 311000000,
        },
      ],
    },

    {
      name: 'France',
      series: [
        {
          name: '1990',
          value: 58000000,
        },
        {
          name: '2010',
          value: 50000020,
        },
        {
          name: '2011',
          value: 58000000,
        },
      ],
    },
    {
      name: 'UK',
      series: [
        {
          name: '1990',
          value: 57000000,
        },
        {
          name: '2010',
          value: 62000000,
        },
      ],
    },
  ];

  view: [number, number] = [700, 300];

  // options
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Year';
  yAxisLabel: string = 'Population';
  timeline: boolean = true;


  colorScheme: any = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5'],
  };
  constructor(private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private serviciosGeograficosService: ServiciosGeograficosService,
    private serviciosDominiosValoresService: ServiciosDominiosValoresService,
    private serviciosParametrosService: ServiciosParametrosService,
    private serviciosEmbalcesService: ServiciosEmbalcesService,
    private serviciosPozosService: ServiciosPozosService,
    private serviciosEstacionesService: ServiciosEstacionesService,
    private serviciosCapasService: ServiciosCapasService,
    private serviciosObservacionesEstacionService: ServiciosObservacionesEstacionService,
    private serviciosObservacionesPozosService: ServiciosObservacionesPozosService,
    private serviciosObservacionesEmbalsesService: ServiciosObservacionesEmbalsesService,
    private serviciosSerieTiempoService: ServiciosSerieTiempoService) { }

    ngAfterViewInit(){
      this.serviciosDominiosValoresService
      .obtenerValoresPorIdDominio(dominiosEnum.TipoElemento)
      .subscribe((response) => {
        this.listaElementos = response;
        // console.log('llego frecuencia', this.listaFrecuencia);
      });

    this.serviciosDominiosValoresService
      .obtenerValoresPorIdDominio(dominiosEnum.TipoAforos)
      .subscribe((response) => {
        this.listaTipoAforo = response;
      });

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

      // frecuencia
      this.serviciosDominiosValoresService
      .obtenerTotalValoresPorIdDominio(dominiosEnum.Periodos)
      .subscribe((response) =>{
        this.listaFrecuencia = response;
      })

    // -----------
    this.construirFormulario();
    }
  ngOnInit(): void {

    this.serviciosDominiosValoresService
      .obtenerValoresPorIdDominio(dominiosEnum.TipoElemento)
      .subscribe((response) => {
        this.listaElementos = response;
        // console.log('llego frecuencia', this.listaFrecuencia);
      });

    this.serviciosDominiosValoresService
      .obtenerValoresPorIdDominio(dominiosEnum.TipoAforos)
      .subscribe((response) => {
        this.listaTipoAforo = response;
      });

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

      // frecuencia
      this.serviciosDominiosValoresService
      .obtenerTotalValoresPorIdDominio(dominiosEnum.Periodos)
      .subscribe((response) =>{
        this.listaFrecuencia = response;
      })

    // -----------
    this.construirFormulario();

    this.datosFilter = [
      {
        idSerieMixta:1,
        idTipoElemento:1,
        elemento:'Estaciones',
        codigoIDEAM: '3506718',
        codigoEAAB:'L-043',
        parametro:'VOLUMENES MEDIOS MENSUALES',
        anio:'2022',
        mes:'Junio',
        minimo:'1',
        maximo:'100',
        promedio:'89',
        estado:'Validado'
      },
      {
        idSerieMixta:1,
        idTipoElemento:1,
        elemento:'Estaciones',
        codigoIDEAM: '2120810',
        codigoEAAB:'PA-022',
        parametro:'VOLUMENES MEDIOS MENSUALES',
        anio:'2022',
        mes:'Febrero',
        minimo:'1',
        maximo:'100',
        promedio:'90',
        estado:'Validado'
      },
      {
        idSerieMixta:1,
        idTipoElemento:1,
        elemento:'Estaciones',
        codigoIDEAM: '2120524',
        codigoEAAB:'PA-022',
        parametro:'VOLUMENES MEDIOS MENSUALES',
        anio:'2022',
        mes:'Mayo',
        minimo:'1',
        maximo:'100',
        promedio:'60',
        estado:'Validado'
      },
      {
        idSerieMixta:1,
        idTipoElemento:1,
        elemento:'Estaciones',
        codigoIDEAM: '2120949',
        codigoEAAB:'L-051',
        parametro:'VOLUMENES MEDIOS MENSUALES',
        anio:'2022',
        mes:'Junio',
        minimo:'1',
        maximo:'100',
        promedio:'76',
        estado:'Validado'
      },
      {
        idSerieMixta:1,
        idTipoElemento:1,
        elemento:'Estaciones',
        codigoIDEAM: '2120524',
        codigoEAAB:'MA-011',
        parametro:'VOLUMENES MEDIOS MENSUALES',
        anio:'2022',
        mes:'Abril',
        minimo:'1',
        maximo:'100',
        promedio:'89',
        estado:'Validado'
      },
      {
        idSerieMixta:1,
        idTipoElemento:1,
        elemento:'Estaciones',
        codigoIDEAM: '2120524',
        codigoEAAB:'MA-011',
        parametro:'VOLUMENES MEDIOS MENSUALES',
        anio:'2022',
        mes:'Marzo',
        minimo:'1',
        maximo:'100',
        promedio:'52',
        estado:'Validado'
      },
      {
        idSerieMixta:1,
        idTipoElemento:1,
        elemento:'Estaciones',
        codigoIDEAM: '2120524',
        codigoEAAB:'MA-011',
        parametro:'VOLUMENES MEDIOS MENSUALES',
        anio:'2022',
        mes:'Junio',
        minimo:'1',
        maximo:'100',
        promedio:'89',
        estado:'Validado'
      }
    ];
  }

  accionRegistro(e: any) {
    switch (e.accion) {
      case accionesTablasEnum.Eliminar: {
        this.datosFilter = [
          {
            idSerieMixta:1,
            idTipoElemento:1,
            elemento:'Estaciones',
            codigoIDEAM: '3506718',
            codigoEAAB:'L-043',
            parametro:'VOLUMENES MEDIOS MENSUALES',
            anio:'2022',
            mes:'Junio',
            minimo:'1',
            maximo:'100',
            promedio:'89',
            estado:'Validado'
          },
          {
            idSerieMixta:1,
            idTipoElemento:1,
            elemento:'Estaciones',
            codigoIDEAM: '2120810',
            codigoEAAB:'PA-022',
            parametro:'VOLUMENES MEDIOS MENSUALES',
            anio:'2022',
            mes:'Febrero',
            minimo:'1',
            maximo:'100',
            promedio:'90',
            estado:'Validado'
          },
          {
            idSerieMixta:1,
            idTipoElemento:1,
            elemento:'Estaciones',
            codigoIDEAM: '2120524',
            codigoEAAB:'PA-022',
            parametro:'VOLUMENES MEDIOS MENSUALES',
            anio:'2022',
            mes:'Mayo',
            minimo:'1',
            maximo:'100',
            promedio:'60',
            estado:'Validado'
          },
          {
            idSerieMixta:1,
            idTipoElemento:1,
            elemento:'Estaciones',
            codigoIDEAM: '2120949',
            codigoEAAB:'L-051',
            parametro:'VOLUMENES MEDIOS MENSUALES',
            anio:'2022',
            mes:'Junio',
            minimo:'1',
            maximo:'100',
            promedio:'76',
            estado:'Validado'
          },
          {
            idSerieMixta:1,
            idTipoElemento:1,
            elemento:'Estaciones',
            codigoIDEAM: '2120524',
            codigoEAAB:'MA-011',
            parametro:'VOLUMENES MEDIOS MENSUALES',
            anio:'2022',
            mes:'Abril',
            minimo:'1',
            maximo:'100',
            promedio:'89',
            estado:'Validado'
          },
          {
            idSerieMixta:1,
            idTipoElemento:1,
            elemento:'Estaciones',
            codigoIDEAM: '2120524',
            codigoEAAB:'MA-011',
            parametro:'VOLUMENES MEDIOS MENSUALES',
            anio:'2022',
            mes:'Marzo',
            minimo:'1',
            maximo:'100',
            promedio:'52',
            estado:'Validado'
          }
          
        ];
        break;
      }
      case accionesTablasEnum.Inactivar: {
        let elemento: any = e.registro;
        elemento.activo = estados.inactivo;
        this.actualizar(elemento);
        break;
      }
      case accionesTablasEnum.Editar: {
        let elemento: any = e.registro;
        elemento.activo = estados.inactivo;
        
        break;
      }

      default: {
        //statements;
        break;
      }
    }
  }

  get areaHidrografica() {
    return this.formularioFiltros?.get('areaHidrografica');
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
  get microcuenca() {
    return this.formularioFiltros.get('microCuenca');
  }

  get fechaInicio() {
    return this.formularioFiltros.get('fechaInicio');
  }
  get fechaFin() {
    return this.formularioFiltros.get('fechaFin');
  }

  private construirFormulario() {
    this.Mecanismo = '469';
    this.formularioFiltros = this.formBuilder.group({
      idTipoElemento: [''],
      idElemento: [''],
      codigoIDEAM:[''],
      nombreCorriente: [''],
      idDepartamento: [''],
      idMunicipio: [''],
      areaHidrografica: [''],
      zonaHidrografica: [''],
      subZonaHidrografica: [''],
      cuenca: [''],
      subCuenca: [''],
      microcuenca: [''],
      tipo: [''],
      idAforo: [''],
      aforador: [''],
      idtipoAforo: [''],
      fechaInicio: [''],
      fechaFin: [''],
      idEntidad: [''],
      frecuencia:[''],
    });
  }

  agregarCorrelacion(){

    var seleccionTemporal:any={
      idParametro: this.formularioFiltros.get('idParametro')?.value,
      frecuencia: this.formularioFiltros.get('frecuencia')?.value,
    }
    this.listaCorrelacion.push(seleccionTemporal);
    console.log(this.listaCorrelacion);

  } 

  agregarElemento(){
    var seleccionElemento:any={
      idParametro: this.formularioFiltros.get('idParametro')?.value,
      frecuencia: this.formularioFiltros.get('frecuencia')?.value,
    }
    this.listaElemento.push(seleccionElemento);
    console.log(this.listaCorrelacion);
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
            this.listaElemento = response.map((elemento: any) => ({
              id: elemento.idEstacion,
              text: elemento.estacion,
              disabled: elemento.activo == 'S' ? false : true,
            }));

            this.listaCodigoEAAB = response.map((elemento: any) => ({
              id: elemento.idEstacion,
              text: elemento.codigoEstacionEaab,
              disabled: elemento.activo == 'S' ? false : true,
            }));

            this.listaCodigoIDEAM = response.map((elemento: any) => ({
              id: elemento.idEstacion,
              text: elemento.codigoEstacionIdeam,
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

  filtrar(elemento: any) {
    var objetoBusqueda: any;

    try {
      if (this.formularioFiltros.valid) {
        switch (elemento) {
          case '466': {
            this.formularioFiltros.value.listaElementos =
              this.listaBusqueda.map((elemento: any) => elemento.idEstacion);
            this.formularioFiltros.value.listParametros =
              this.listParametroXElemento;

            objetoBusqueda = this.formularioFiltros.value;
            objetoBusqueda.tipoElemento = elemento;

            break;
          }
          case '467': {
            // Embalses
            this.formularioFiltros.value.listaElementos =
              this.listaBusqueda.map((elemento: any) => elemento.idEmbalse);
            this.formularioFiltros.value.listParametros =
              this.listParametroXElemento;
            objetoBusqueda = this.formularioFiltros.value;
            objetoBusqueda.tipoElemento = elemento;
            break;
          }
          case '468': {
            // Pozos
            this.formularioFiltros.value.listaElementos =
              this.listaBusqueda.map((elemento: any) => elemento.idPozo);
            this.formularioFiltros.value.listParametros =
              this.listParametroXElemento;
            objetoBusqueda = this.formularioFiltros.value;
            objetoBusqueda.tipoElemento = elemento;
            break;
          }
          default: {
            console.log('elemento', elemento);
          }
        }
      }

      this.serviciosSerieTiempoService
        .obtenerDTO(objetoBusqueda)
        .subscribe((response) => {
          console.log('llegando consulta', response);
          this.datosFilter = response;
        });
    } catch (error) {
      console.error(error);
    }
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
    this.serviciosEstacionesService
      .obtenerEstaciones()
      .subscribe((response) => {
        this.datosFilterEstaciones = response;
      });
  }
  obtenerEmbalses() {
    this.serviciosEmbalcesService
      .obtenerEembalsesDTO()
      .subscribe((response) => {
        this.datosFilterEmbalses = response;
      });
  }
  obtenerPozos() {
    this.serviciosPozosService.obtenerPozosDTO().subscribe((response) => {
      this.datosFilterPozos = response;
    });
  }

  actualizar(elemento: any) {
    this.serviciosSerieTiempoService
      .actualizarElemento(elemento)
      .subscribe((response) => {
        this.filtrar(this.elemento);
        console.log('se actualizo', response);
      });
  }

  onChanges(): void {
    if (this.formularioFiltros) {
      this.areaHidrografica?.valueChanges.subscribe((val) => {
        this.cargarZonaHidrografica();
      });
      this.zonaHidrografica?.valueChanges.subscribe((val) => {
        this.cargarSubZonaHidrografica();
      });
      this.subZonaHidrografica?.valueChanges.subscribe((val) => {
        this.cargarCuenca();
      });
      this.cuenca?.valueChanges.subscribe((val) => {
        this.cargarSubcuenca();
      });
      this.subcuenca?.valueChanges.subscribe((val) => {
        this.cargarMicroCuenca();
      });
    }
  }
 
  cargarAreaHidrografica() {
    this.serviciosCapasService
      // .obtenerPorId(capasEnum.Zonificacion)
      .obtenerPorId(capasEnum.SubZonaHidrografica)
      .subscribe((response) => {
        this.serviciosGeograficosService
          .consultarDatosCapa(
            response.urlConsulta,
            '1=1',
            'CODAH,NOMBAH',
            true,
            'NOMBAH'
          )
          .then((response: any) => {
            let datos = response.features
              .map((f: any) => f.attributes)
              .map((zh: any) => {
                return { id: zh.CODAH, text: zh.NOMBAH };
              });
            this.listaAreaHidrografica = datos;
            console.log('listaAreaHidrografica', datos);
          });
      });
  }

  cargarZonaHidrografica() {
    console.log('Area hidrográfica', this.areaHidrografica?.value);
    if (this.areaHidrografica?.value) {
      this.serviciosCapasService
        .obtenerPorId(capasEnum.SubZonaHidrografica)
        // .obtenerPorId(capasEnum.Zonificacion)
        .subscribe((response) => {
          console.log('llegaron parametros', response);
          this.serviciosGeograficosService
            .consultarDatosCapa(
              response.urlConsulta,
              'CODAH=' + this.areaHidrografica?.value,
              'CODZH,NOMBZH',
              true,
              'NOMBZH'
            )
            .then((response: any) => {
              let datos = response.features
                .map((f: any) => f.attributes)
                .map((zh: any) => {
                  return { id: zh.CODZH, text: zh.NOMBZH };
                });
              console.log('serviciosCapasService OK', datos);
              this.listaZonaHidrografica = datos;
            });
        });
    }
  }

  cargarSubZonaHidrografica() {
    if (this.zonaHidrografica?.value) {
      this.serviciosCapasService
        .obtenerPorId(capasEnum.SubZonaHidrografica)
        .subscribe((response) => {
          this.serviciosGeograficosService
            .consultarDatosCapa(
              response.urlConsulta,
              'CODZH=' + this.zonaHidrografica?.value,
              // '1=1',
              // '*',
              'CODSZH,NOMBSZH',
              true,
              'NOMBSZH'
              // ''
            )
            .then((response: any) => {
              let datos = response.features
                .map((f: any) => f.attributes)
                .map((zh: any) => {
                  return { id: zh.CODSZH, text: zh.NOMBSZH };
                });
              console.log('serviciosCapasService OK', datos);
              this.listasubZonaHidrografica = datos;
            });
        });
    }
  }

  cargarCuenca() {
    if (this.subZonaHidrografica?.value) {
      this.serviciosCapasService
        .obtenerPorId(capasEnum.Cuenca)
        .subscribe((response) => {
          this.serviciosGeograficosService
            .consultarDatosCapa(
              response.urlConsulta,
              'CODSZH=' + this.subZonaHidrografica?.value,
              // '1=1',
              // '*',
              'CODCH,NOMBCH',
              true,
              'NOMBCH'
              // ''
            )
            .then((response: any) => {
              let datos = response.features
                .map((f: any) => f.attributes)
                .map((zh: any) => {
                  return { id: zh.CODCH, text: zh.NOMBCH };
                });
              console.log('serviciosCapasService OK', datos);
              this.listaCuenca = datos;
            });
        });
    }
  }
  cargarSubcuenca() {
    if (this.cuenca?.value) {
      this.serviciosCapasService
        .obtenerPorId(capasEnum.Subcuenca)
        .subscribe((response) => {
          this.serviciosGeograficosService
            .consultarDatosCapa(
              response.urlConsulta,
              'CODCH=' + this.cuenca?.value,
              // '1=1',
              // '*',
              'CODSCH,NOMSCH',
              true,
              'NOMSCH'
              // ''
            )
            .then((response: any) => {
              let datos = response.features
                .map((f: any) => f.attributes)
                .map((zh: any) => {
                  return { id: zh.CODSCH, text: zh.NOMSCH };
                });
              console.log('serviciosCapasService OK', datos);
              this.listaSubcuenca = datos;
            });
        });
    }
  }
  cargarMicroCuenca() {
    if (this.subcuenca?.value) {
      this.serviciosCapasService
        .obtenerPorId(capasEnum.Microcuenca)
        .subscribe((response) => {
          this.serviciosGeograficosService
            .consultarDatosCapa(
              response.urlConsulta,
              'CODSCH=' + this.subcuenca?.value,
              // '1=1',
              // '*',
              'CODMC,NOMBMC',
              true,
              'NOMBMC'
              // ''
            )
            .then((response: any) => {
              let datos = response.features
                .map((f: any) => f.attributes)
                .map((zh: any) => {
                  return { id: zh.CODMC, text: zh.NOMBMC };
                });
              console.log('serviciosCapasService OK', datos);
              this.listaMicrocuenca = datos;
            });
        });
    }
  }

}
