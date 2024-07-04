import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { dominiosEnum } from 'src/app/modelo/enum/dominios-enum';
import { capasEnum, capasEnumDatos } from 'src/app/modelo/enum/capas-enum';
import { ServiciosEstacionesService } from '../servicios-estaciones.service';
import { ServiciosDominiosValoresService } from '../../../configuracion/dominios/servicios-dominios-valores.service';
import Swal from 'sweetalert2';
import { estados } from '../../../../common/utils/constantes';
import { ServiciosGeograficosService } from 'src/app/common/mapa/servicios-geograficos.service';
import { ServiciosCapasService } from '../../../configuracion/capas/servicios-capas.service';

@Component({
  selector: 'app-guardar-estaciones',
  templateUrl: './guardar-estaciones.component.html',
})
export class GuardarEstacionesComponent implements OnInit {
  // Variables Globales
  public formularioEstaciones!: FormGroup;
  public id: string = '0';
  public ac: string = 'c';
  private visualizar: boolean = false;
  public tipoCoordenadaSelect: any;
  private tempIdDepartamento: number = 0;
  public departamentoSelected: any;

  // Set our map properties
  mapCenter = [-73.9, 4.4];
  basemapType = 'topo';
  mapZoomLevel = 9;

  // Listas de parametros
  public listaCategorias = [];
  public listaTecnologias = [];
  public listaTipoEstacion = [];
  public listaEntidad = [];
  public listaEstado = [];
  public listaZonaOperativa: [];
  public listaDepartamentos: [];
  public listaMunicipios: [];
  public listaAreaHidrografica: [];
  public listaZonaHidrografica: [];
  public listaSubzonaHidrografica: [];
  public listaNivelSubsiguiente: [];
  public listaCuenca: [];
  public listaSubcuenca: [];
  public listaMicrocuenca: [];
  public listaTipoCoordenada: [];
  public listaCorriente: [];

  public isDisabled = false;

  capas: any[] = [];

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

  /**Propiedades del formulario */
  get codigoEstacionIdeam() {
    return this.formularioEstaciones.get('codigoEstacionIdeam');
  }
  get codigoEstacionEaab() {
    return this.formularioEstaciones.get('codigoEstacionEaab');
  }
  get estacion() {
    return this.formularioEstaciones.get('estacion');
  }
  get idCategoria() {
    return this.formularioEstaciones.get('idCategoria');
  }
  get idTecnologia() {
    return this.formularioEstaciones.get('idTecnologia');
  }
  // get idTipoEstacion() {
  //   return this.formularioEstaciones.get('idTipoEstacion');
  // }
  get idEntidad() {
    return this.formularioEstaciones.get('idEntidad');
  }
  get idEstado() {
    return this.formularioEstaciones.get('idEstado');
  }
  get fechaInstalacion() {
    return this.formularioEstaciones.get('fechaInstalacion');
  }
  get altitud() {
    return this.formularioEstaciones.get('altitud');
  }
  get corriente() {
    return this.formularioEstaciones.get('corriente');
  }
  get zonaOperativaEaab() {
    return this.formularioEstaciones.get('zonaOperativaEaab');
  }
  get areaHidrografica() {
    return this.formularioEstaciones.get('idAreaHidrografica');
  }
  get zonaHidrografica() {
    return this.formularioEstaciones.get('idZonaHidrografica');
  }
  get subZonaHidrografica() {
    return this.formularioEstaciones.get('idSubZonaHidrografica');
  }
  get cuenca() {
    return this.formularioEstaciones.get('idCuenca');
  }
  get subcuenca() {
    return this.formularioEstaciones.get('idSubCuenca');
  }
  get microCuenca() {
    return this.formularioEstaciones.get('idMicroCuenca');
  }
  get latitud() {
    return this.formularioEstaciones.get('latitud');
  }
  get longitud() {
    return this.formularioEstaciones.get('longitud');
  }
  
  get este() {
    return this.formularioEstaciones.get('este');
  }
  get norte() {
    return this.formularioEstaciones.get('norte');
  }
  get idMunicipio() {
    return this.formularioEstaciones.get('idMunicipio');
  }
  get idDepartamento() {
    return this.formularioEstaciones.get('idDepartamento');
  }

  get idTipoCoordenadas() {
    return this.formularioEstaciones.get('idTipoCoordenadas');
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private serviciosEstacionesService: ServiciosEstacionesService,
    private serviciosDominiosValoresService: ServiciosDominiosValoresService,
    private serviciosGeograficosService: ServiciosGeograficosService,
    private serviciosCapasService: ServiciosCapasService
  ) {
    // Esto es intencional
  }

  ngOnInit(): void {


 
 var ValidCoordinates = [
  "-23, 25",
  "4, -3",
  "24.53525235, 23.45235",
  "04, -23.234235",
 "1, 1,2",
  "43.91343345, 143"
];


console.log( this.isValidCoordinates(ValidCoordinates[4]) );   

    this.id = this.route.snapshot.paramMap.get('id')!;
    this.ac = this.route.snapshot.paramMap.get('ac')!;

    this.cargarCapas();

    if (this.ac != 'C') {
      // Categoria
      this.serviciosDominiosValoresService
        .obtenerValoresPorIdDominio(dominiosEnum.CategoriasEstacion)
        .subscribe((response) => {
          this.listaCategorias = response;
        });
      // Tecnologia
      this.serviciosDominiosValoresService
        .obtenerValoresPorIdDominio(dominiosEnum.TecnologiasEstacion)
        .subscribe((response) => {
          this.listaTecnologias = response;
        });
      // Tipo Estacion
      this.serviciosDominiosValoresService
        .obtenerValoresPorIdDominio(dominiosEnum.TipoEstacion)
        .subscribe((response) => {
          this.listaTipoEstacion = response;
        });
      // Entidad
      this.serviciosDominiosValoresService
        .obtenerValoresPorIdDominio(dominiosEnum.Entidad)
        .subscribe((response) => {
          this.listaEntidad = response;
        });
      // Estado
      this.serviciosDominiosValoresService
        .obtenerValoresPorIdDominio(dominiosEnum.EstadoEstacion)
        .subscribe((response) => {
          this.listaEstado = response;
        });
      // Zona Operativa
      this.serviciosDominiosValoresService
        .obtenerValoresPorIdDominio(dominiosEnum.ZonaOperativaEAAB)
        .subscribe((response) => {
          this.listaZonaOperativa = response;
        });
      // Departamentos
      this.serviciosGeograficosService
        .obtenerDepartamentos()
        .subscribe((response) => {
          this.listaDepartamentos = response;
        });

      // Tipo Coordenadas
      this.serviciosDominiosValoresService
        .obtenerValoresActivosPorIdDominio(dominiosEnum.TipoCoordenadas)
        .subscribe((response) => {
          this.listaTipoCoordenada = response;
        });
      // tipoCorriente
      this.serviciosDominiosValoresService
        .obtenerValoresActivosPorIdDominio(dominiosEnum.TipoCorriente)
        .subscribe((response) => {
          this.listaCorriente = response;
        });
    } else {
      // Categoria
      this.serviciosDominiosValoresService
        .obtenerValoresActivosPorIdDominio(dominiosEnum.CategoriasEstacion)
        .subscribe((response) => {
          this.listaCategorias = response;
        });
      // Tecnologia
      this.serviciosDominiosValoresService
        .obtenerValoresActivosPorIdDominio(dominiosEnum.TecnologiasEstacion)
        .subscribe((response) => {
          this.listaTecnologias = response;
        });
      // Tipo Estacion
      this.serviciosDominiosValoresService
        .obtenerValoresActivosPorIdDominio(dominiosEnum.TipoEstacion)
        .subscribe((response) => {
          this.listaTipoEstacion = response;
        });
      // Entidad
      this.serviciosDominiosValoresService
        .obtenerValoresActivosPorIdDominio(dominiosEnum.Entidad)
        .subscribe((response) => {
          this.listaEntidad = response;
        });
      // Estado
      this.serviciosDominiosValoresService
        .obtenerValoresActivosPorIdDominio(dominiosEnum.EstadoEstacion)
        .subscribe((response) => {
          this.listaEstado = response;
        });
      // Zona Operativa
      this.serviciosDominiosValoresService
        .obtenerValoresActivosPorIdDominio(dominiosEnum.ZonaOperativaEAAB)
        .subscribe((response) => {
          this.listaZonaOperativa = response;
        });
      // Departamentos
      this.serviciosGeograficosService
        .obtenerDepartamentos()
        .subscribe((response) => {
          this.listaDepartamentos = response;
        });

      // Tipo Coordenadas
      this.serviciosDominiosValoresService
        .obtenerValoresActivosPorIdDominio(dominiosEnum.TipoCoordenadas)
        .subscribe((response) => {
          this.listaTipoCoordenada = response;
        });
      // tipoCorriente
      this.serviciosDominiosValoresService
        .obtenerValoresActivosPorIdDominio(dominiosEnum.TipoCorriente)
        .subscribe((response) => {
          this.listaCorriente = response;
        });
    }

    // Obtener Registro
    if (this.id != '0') {
      let idParam: number = +this.id;
      this.isDisabled = true;
      this.serviciosEstacionesService
        .obtenerPorId(idParam)
        .subscribe((response) => {
          // Obtener idDepartamento de acuerdo al municipio
          this.serviciosGeograficosService
            .obtenerMunicipioPorId(response.idMunicipio)
            .subscribe((responseMunicipio) => {
              response.idDepartamento = responseMunicipio.idDepartamento;
              this.cargarMunicipiosPorDepartamento();
              console.log('llego estacion ', response);
              this.formularioEstaciones.setValue(response);
            });
        });
    }

    this.construirFormulario();

    if (this.ac == 'V') {
      this.formularioEstaciones.disable();
    }
    //--------------------

    this.cargarAreaHidrografica();
    this.onChanges();
  }

  private construirFormulario() {
    this.formularioEstaciones = this.formBuilder.group({
      idEstacion: [''],
      codigoEstacionIdeam: ['', [Validators.required]],
      estacion: ['', [Validators.required]],
      idCategoria: ['', [Validators.required]],
      idTecnologia: ['', [Validators.required]],
      idTipoEstacion: [11],
      idEntidad: ['', [Validators.required]],
      idEstado: ['', [Validators.required]],
      fechaInstalacion: ['', [Validators.required]],
      altitud: [''],
      idCorriente: [''],
      zonaOperativaEaab: [''],
      fechaCreacion: [''],
      fechaModificacion: [''],
      usuarioCreacion: [''],
      usuarioModificacion: [''],

      codigoEstacionEaab: [
        { value: '', disabled: this.isDisabled },
        [Validators.required],
      ],
      idMunicipio: ['', [Validators.required]],
      nivelSubSiguiente: [''],
      idTipoCoordenadas: ['',[Validators.required]],
      latitud: [''],
      longitud: [''],
      norte: [''],
      este: [''],
      fechaEstado: [''],
      usuarioEstado: [''],
      activo: [estados.activo],
      // valores que no están en l aestacion
      idCuenca: [''],
      cuenca: [''],
      idAreaHidrografica: [''],
      areaHidrografica: [''],
      idZonaHidrografica: [''],
      zonaHidrografica: [''],
      idSubZonaHidrografica: [''],
      subZonaHidrografica: [''],
      idSubCuenca: [''],
      subCuenca: [''],
      idMicroCuenca: [''],
      microCuenca: [''],
      categoria: [''],
      tecnologia: [''],
      tipoEstacion: [''],
      entidad: [''],
      estado: [''],

      idDepartamento: ['', [Validators.required]],
    });
  }

  convertirCoordenadasPlanasAGeograficas(norte: number, este: number) : number[] {
    let result : number[] = [];

    // Latitud
    result[0] = este;

    // Longitud
    result[1] = norte;

    return result;
  }

  validarZonaCobertura(longitud : number, latitud : number) : boolean {
    // Validar coordenadas para saber si están dentro de la zona solicitada...
    let latitudBogota : number = 4.87003;
    let longitudBogota : number = -74.25596;

    console.info("-- --------------------------------");
    console.info("-- --------------------------------");
    console.info("--> Longitud Bogota: " + longitudBogota);
    console.info("--> Latitud Bogota: " + latitudBogota);
    console.info("-- --------------------------------");
    console.info("--> Longitud ingresada: " + longitud);
    console.info("--> Latitud ingresada: " + latitud);
    console.info("-- --------------------------------");

    return longitud >=longitudBogota && latitud<=latitudBogota;
  }

  validarCoordenadas() : boolean {
    let tipoCoordenada :number = +this.formularioEstaciones.value.idTipoCoordenadas;
    let longitud :number = +this.formularioEstaciones.value.longitud;
    let latitud :number = +this.formularioEstaciones.value.latitud;
    let norte :number = +this.formularioEstaciones.value.norte;
    let este :number = +this.formularioEstaciones.value.este;

    if ( !tipoCoordenada ) {
      return false;
    }

    switch( tipoCoordenada ) {
      // Coordenadas planas;
      case 191:
        if ( !norte || !este ) {
          return false;
        }
        break;

      // Coordenadas Geograficas
      case 192:
        if ( !latitud || !longitud ) {
          return false;
        }

        break;

      default:
        return false;
    }

    console.log('TipoCoordenada: ' + tipoCoordenada);
    console.log('Latitud: ' + latitud);
    console.log('Longitud: ' + longitud);
    console.log('Norte: ' + norte);
    console.log('Este: ' + este);

    //Conversion de coordenadas planas a Geograficas.
    // Calcular Longitud y Latitud a partir de Norte y Este.
    if ( tipoCoordenada == 191 ) {
      let geoArreglo : number[];
      geoArreglo = this.convertirCoordenadasPlanasAGeograficas(norte, este);

      if ( !(geoArreglo && geoArreglo.length>1) ) {
        console.error("No fue posible convertir las coordenadas planas: Norte: [" + norte + "], Sur: [" + este + "]");
        return false;
      }

      latitud = geoArreglo[0];
      longitud = geoArreglo[1];
    }

    return this.validarZonaCobertura(longitud, latitud);
  }

  guardar() {
    var cordenadas:any = this.formularioEstaciones.value.longitud+','+this.formularioEstaciones.value.latitud;

 
    var ValidCoordinates = [
      cordenadas
    ];
      var vali = this.isValidCoordinates(ValidCoordinates[0]) 
        
      
      if(this.tipoCoordenadaSelect == 192 ) {


        if( vali == false  ){

          this.toast.fire({
              icon: 'error',
              title:
                'Las cordenadas son incorrectas!',
            });

            }else{
              this.AsignarNombres();
              // console.log('guardando...',this.formularioEstaciones.value)
              try {
                if (this.formularioEstaciones.valid) {
                  if (this.id === '0') {
                    this.serviciosEstacionesService
                      .crear(this.formularioEstaciones.value)
                      .subscribe((response) => {
                        this.toast.fire({
                          icon: 'success',
                          title:
                            'Estación ' + response.estacion + ', creada exitosamente!',
                        });
                        this.router.navigate(['/configuracion/estaciones']);
                      });
                  } else {  
                    this.formularioEstaciones.value.codigoEstacionEaab = this.codigoEstacionEaab?.value;
                    this.serviciosEstacionesService
                      .actualizar(this.formularioEstaciones.value)
                      .subscribe((response) => {
                        this.toast.fire({
                          icon: 'success',
                          title:
                            'Estación ' +
                            response.estacion +
                            ', actualizada exitosamente!',
                        });
                        this.router.navigate(['/configuracion/estaciones']);
                      });
                  }
                }
              } catch (error) {
                console.error(error);
              }

          
            }



    
        }


     if(this.tipoCoordenadaSelect == 191 ) {


          if( vali == false  ){
  
            this.toast.fire({
                icon: 'error',
                title:
                  'Las cordenadas son incorrectas!',
              });
  
              }else{
                this.AsignarNombres();
                // console.log('guardando...',this.formularioEstaciones.value)
                try {
                  if (this.formularioEstaciones.valid) {
                    if (this.id === '0') {
                      this.serviciosEstacionesService
                        .crear(this.formularioEstaciones.value)
                        .subscribe((response) => {
                          this.toast.fire({
                            icon: 'success',
                            title:
                              'Estación ' + response.estacion + ', creada exitosamente!',
                          });
                          this.router.navigate(['/configuracion/estaciones']);
                        });
                    } else {  
                      this.formularioEstaciones.value.codigoEstacionEaab = this.codigoEstacionEaab?.value;
                      this.serviciosEstacionesService
                        .actualizar(this.formularioEstaciones.value)
                        .subscribe((response) => {
                          this.toast.fire({
                            icon: 'success',
                            title:
                              'Estación ' +
                              response.estacion +
                              ', actualizada exitosamente!',
                          });
                          this.router.navigate(['/configuracion/estaciones']);
                        });
                    }
                  }
                } catch (error) {
                  console.error(error);
                }
  
            
              }
  
  
  
      
        }
   

   


  }

  AsignarNombres() {
    let CuencaName: any = this.listaCuenca.find(
      (cuenca) => cuenca['id'] == this.formularioEstaciones.value.idCuenca
    );

    let AreaName: any = this.listaAreaHidrografica.find(
      (cuenca) =>
        cuenca['id'] == this.formularioEstaciones.value.idAreaHidrografica
    );

    let ZonaName: any = this.listaZonaHidrografica.find(
      (cuenca) =>
        cuenca['id'] == this.formularioEstaciones.value.idZonaHidrografica
    );

    let subZonaName: any = this.listaSubzonaHidrografica.find(
      (cuenca) =>
        cuenca['id'] == this.formularioEstaciones.value.idSubZonaHidrografica
    );

    let subCuencaName: any = this.listaSubcuenca.find(
      (cuenca) => cuenca['id'] == this.formularioEstaciones.value.idSubCuenca
    );

    let MicroCuencaName: any = this.listaMicrocuenca.find(
      (cuenca) => cuenca['id'] == this.formularioEstaciones.value.idMicroCuenca
    );

    if (MicroCuencaName != undefined || null) {
      this.formularioEstaciones.value.microCuenca = MicroCuencaName['text'];
    }
    if (CuencaName != undefined || null) {
      this.formularioEstaciones.value.cuenca = CuencaName['text'];
    }
    if (AreaName != undefined || null) {
      this.formularioEstaciones.value.areaHidrografica = AreaName['text'];
    }
    if (ZonaName != undefined || null) {
      this.formularioEstaciones.value.zonaHidrografica = ZonaName['text'];
    }
    if (subZonaName != undefined || null) {
      this.formularioEstaciones.value.subZonaHidrografica = subZonaName['text'];
    }
    if (subCuencaName != undefined || null) {
      this.formularioEstaciones.value.subCuenca = subCuencaName['text'];
    }
  }

  mapLoadedEvent(status: Event) {
    console.log('The map loaded: ' + status);
  }

  seleccionMapa(e: any) {
    // // TO-DO
    // console.log('seleccion respuesta ', e);
    this.latitud?.setValue(e.ubicacion.latitude);
    this.longitud?.setValue(e.ubicacion.longitude);
    this.norte?.setValue(e.ubicacion.y);
    this.este?.setValue(e.ubicacion.x);

    let features = e.seleccion.flat(1);

    let _cuenca = features.filter(
      (c: any) => c.idCapa === capasEnumDatos(capasEnum.Cuenca).id
    )[0].atributos;
    let _subcuenca = features.filter(
      (c: any) => c.idCapa === capasEnumDatos(capasEnum.Subcuenca).id
    )[0].atributos;
    let _microcuenca = features.filter(
      (c: any) => c.idCapa === capasEnumDatos(capasEnum.Microcuenca).id
    )[0]?.atributos;
    let codah = _cuenca.CODAH ?? '';
    let codzh = _cuenca.CODZH ?? '';
    let codszh = _cuenca.CODSZH ?? '';
    let codch = _cuenca.CODCH ?? '';
    let codsch = _subcuenca.CODSCH ?? '';
    let codmch = _microcuenca.CODMC ?? '';
    this.areaHidrografica?.setValue(codah);
    this.zonaHidrografica?.setValue(codzh);
    this.subZonaHidrografica?.setValue(codszh);
    this.cuenca?.setValue(codch);
    this.subcuenca?.setValue(codsch);
    this.microCuenca?.setValue(codmch);
  }

  clickMapa(e: any) {
    // TO-DO
    console.log('respuesta click', e);
  }

  cargarCapas() {
    console.log('cargarCapas');
    this.serviciosCapasService
      .obtenerPorId(capasEnum.Zonificacion)
      .subscribe((response) => {
        console.log('cargarCapas', response.urlVisualizar);
        this.capas.push({
          url: response.urlVisualizar,
          id: capasEnumDatos(capasEnum.Zonificacion).id,
          visible: true,
          titulo: capasEnumDatos(capasEnum.Zonificacion).titulo,
        });
      });

    this.serviciosCapasService
      .obtenerPorId(capasEnum.Departamentos)
      .subscribe((response) => {
        console.log('cargarCapas', response.urlVisualizar);
        this.capas.push({
          url: response.urlVisualizar,
          id: capasEnumDatos(capasEnum.Departamentos).id,
          visible: true,
          titulo: capasEnumDatos(capasEnum.Departamentos).titulo,
        });
      });

    this.serviciosCapasService
      .obtenerPorId(capasEnum.Estaciones)
      .subscribe((response) => {
        console.log('cargarCapas', response.urlVisualizar);
        this.capas.push({
          url: response.urlVisualizar,
          id: capasEnumDatos(capasEnum.Estaciones).id,
          visible: true,
          titulo: capasEnumDatos(capasEnum.Estaciones).titulo,
        });
      });

    console.log('capas cargadas', this.capas);
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

  onChanges(): void {
    if (this.formularioEstaciones) {
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
                return { id: zh.CODAH, text: zh.CODAH + '-' + zh.NOMBAH };
              });
            this.listaAreaHidrografica = datos;
            // console.log('listaAreaHidrografica', datos);
          });
      });
  }

  cargarZonaHidrografica() {
    // console.log('Area hidrográfica', this.areaHidrografica?.value);
    if (this.areaHidrografica?.value) {
      this.serviciosCapasService
        .obtenerPorId(capasEnum.SubZonaHidrografica)
        // .obtenerPorId(capasEnum.Zonificacion)
        .subscribe((response) => {
          // console.log('llegaron parametros', response);
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
                  return { id: zh.CODZH, text: zh.CODZH + '-' + zh.NOMBZH };
                });
              // console.log('serviciosCapasService OK', datos);
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
                  return { id: zh.CODSZH, text: zh.CODSZH + '-' + zh.NOMBSZH };
                });
              // console.log('serviciosCapasService OK', datos);
              this.listaSubzonaHidrografica = datos;
              // console.log('lista zona OK', this.listaSubzonaHidrografica);
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
                  return { id: zh.CODCH, text: zh.CODCH + '-' + zh.NOMBCH };
                });
              // console.log('serviciosCapasService OK', datos);
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
                  return { id: zh.CODSCH, text: zh.CODSCH + '-' + zh.NOMSCH };
                });
              // console.log('serviciosCapasService OK', datos);
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
                  return { id: zh.CODMC, text: zh.CODMC + '-' + zh.NOMBMC };
                });
              // console.log('serviciosCapasService OK', datos);
              this.listaMicrocuenca = datos;
            });
        });
    }
  }



  isValidCoordinates(coordinates:any){
    var args = coordinates.split(",");
  
    var lat = /^(-?[1-8]?\d(?:\.\d{1,18})?|90(?:\.0{1,18})?)$/;
    var lon = /^(-?(?:1[0-7]|[1-9])?\d(?:\.\d{1,18})?|180(?:\.0{1,18})?)$/;
    
    console.log("'" + args[0] + "', '" +  args[1] + "'");
  
    if(lat.test(args[0].trim()) == true && lon.test(args[1].trim()) == true){ 
      return true;
    } else{
      return false;
    }
  }


}
