import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { estados } from 'src/app/common/utils/constantes';
import { dominiosEnum } from 'src/app/modelo/enum/dominios-enum';
import Swal from 'sweetalert2';
import { ServiciosDominiosValoresService } from '../../../configuracion/dominios/servicios-dominios-valores.service';
import { ServiciosPozosService } from '../servicios-pozos.service';
import { ServiciosEmbalcesService } from '../../embalses/servicios-embalses.service';
import { ServiciosCapasService } from '../../../configuracion/capas/servicios-capas.service';
import { capasEnum, capasEnumDatos } from 'src/app/modelo/enum/capas-enum';
import { ServiciosGeograficosService } from 'src/app/common/mapa/servicios-geograficos.service';
import { activo } from '../../../../modelo/enum/cargue-archivo-enum';
import { IPozos } from '../../../../modelo/configuracion/pozo';

@Component({
  selector: 'app-guardar-pozos',
  templateUrl: './guardar-pozos.component.html',
})
export class GuardarPozosComponent implements OnInit {
  public formularioPozo!: FormGroup;
  public id: string = '0';
  public ac: string = 'c';
  public listZonaEAAB = [];
  public listTipoPozo = [];
  public listCategoriaPozo = [];
  public listCondicionPozo = [];
  public geograficas = false;
  public planas = false;
  public listEntidades = [];
  public listaMunicipios = [];
  public listaDepartamentos = [];
  private tempIdDepartamento: number = 0;
  public listaAreaHidrografica = [];
  public listaZonaHidrografica = [];
  public listasubZonaHidrografica = [];
  public listanivel = [];
  public listaCuenca = [];
  public listaMicrocuenca = [];
  public listaSubcuenca = [];
  public departamentoSelected: any;
  public tipoCoordenadaSelect: any;
  public listaTipoCoordenada: [];

  capas: any[] = [];
  // Set our map properties
  mapCenter = [-73.9, 4.4];
  basemapType = 'topo';
  mapZoomLevel = 9;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private serviciosPozosService: ServiciosPozosService,
    private serviciosDominiosValoresService: ServiciosDominiosValoresService,
    private serviciosCapasService: ServiciosCapasService,
    private serviciosGeograficosService: ServiciosGeograficosService
  ) {}


  get zonaOperativaEaab() {
    return this.formularioPozo.get('zonaOperativaEaab');
  }
  get fechaInicioOperacion() {
    return this.formularioPozo.get('fechaInicioOperacion');
  }
  get cotaBoca() {
    return this.formularioPozo.get('cotaBoca');
  }
  get cotaMedidor() {
    return this.formularioPozo.get('cotaMedidor');
  }
  get profundidad() {
    return this.formularioPozo.get('profundidad');
  }
  get idTipoPozo() {
    return this.formularioPozo.get('idTipoPozo');
  }
  get idCategoria() {
    return this.formularioPozo.get('idCategoria');
  }
  get idCondicion() {
    return this.formularioPozo.get('idCondicion');
  }
 

  get areaHidrografica() {
    return this.formularioPozo.get('idAreaHidrografica');
  }
  get zonaHidrografica() {
    return this.formularioPozo.get('idZonaHidrografica');
  }
  get subZonaHidrografica() {
    return this.formularioPozo.get('idSubZonaHidrografica');
  }
  get cuenca() {
    return this.formularioPozo.get('idCuenca');
  }
  get subcuenca() {
    return this.formularioPozo.get('idSubCuenca');
  }

  get microCuenca() {
    return this.formularioPozo.get('idMicroCuenca');
  }
  get latitud() {
    return this.formularioPozo.get('latitud');
  }
  get longitud() {
    return this.formularioPozo.get('longitud');
  }
  get pozo() {
    return this.formularioPozo.get('pozo');
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

  ngOnInit(): void {
    this.construirFormulario();
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.ac = this.route.snapshot.paramMap.get('ac')!;
    this.cargarCapas();

    if (this.ac != 'C') {
      // Departamentos
      this.serviciosPozosService
        .obtenerDepartamentos()
        .subscribe((response) => {
          this.listaDepartamentos = response;
        });
      this.serviciosDominiosValoresService
        .obtenerValoresPorIdDominio(dominiosEnum.ZonaOperativaEAAB)
        .subscribe((response) => {
          this.listZonaEAAB = response;
        });
      this.serviciosDominiosValoresService
        .obtenerValoresPorIdDominio(dominiosEnum.CategoriaPozo)
        .subscribe((response) => {
          this.listCategoriaPozo = response;
        });
      this.serviciosDominiosValoresService
        .obtenerValoresPorIdDominio(dominiosEnum.TipoPozo)
        .subscribe((response) => {
          this.listTipoPozo = response;
        });
      this.serviciosDominiosValoresService
        .obtenerValoresPorIdDominio(dominiosEnum.CondicionPozo)
        .subscribe((response) => {
          this.listCondicionPozo = response;
        });
      // Tipo Coordenadas
      this.serviciosDominiosValoresService
        .obtenerValoresPorIdDominio(dominiosEnum.TipoCoordenadas)
        .subscribe((response) => {
          this.listaTipoCoordenada = response;
        });
    } else {
      // Departamentos
      this.serviciosPozosService
        .obtenerDepartamentos()
        .subscribe((response) => {
          this.listaDepartamentos = response;
        });
      this.serviciosDominiosValoresService
        .obtenerValoresActivosPorIdDominio(dominiosEnum.ZonaOperativaEAAB)
        .subscribe((response) => {
          this.listZonaEAAB = response;
        });
      this.serviciosDominiosValoresService
        .obtenerValoresActivosPorIdDominio(dominiosEnum.TipoPozo)
        .subscribe((response) => {
          this.listTipoPozo = response;
        });
      this.serviciosDominiosValoresService
        .obtenerValoresActivosPorIdDominio(dominiosEnum.CategoriaPozo)
        .subscribe((response) => {
          this.listCategoriaPozo = response;
        });
      this.serviciosDominiosValoresService
        .obtenerValoresActivosPorIdDominio(dominiosEnum.CondicionPozo)
        .subscribe((response) => {
          this.listCondicionPozo = response;
        });
      // Tipo Coordenadas
      this.serviciosDominiosValoresService
        .obtenerValoresActivosPorIdDominio(dominiosEnum.TipoCoordenadas)
        .subscribe((response) => {
          this.listaTipoCoordenada = response;
        });
    }
    if (this.id != '0') {

      let idParam: number = +this.id;
      this.serviciosPozosService.obtenerPorId(idParam).subscribe((response:IPozos) => {
        // console.log('llegaron pozos', response);
        // Obtener idDepartamento de acuerdo al municipio
        this.serviciosGeograficosService
          .obtenerMunicipioPorId(response.idMunicipio)
          .subscribe((responseMunicipio) => {
            response.idDepartamento = responseMunicipio.idDepartamento;
            this.cargarMunicipiosPorDepartamento();
            // console.log('llegaron pozoz', response);


            var pozo: IPozos = response

            this.formularioPozo.setValue(pozo);
          });
      });

      if (this.ac == 'V') {
        this.formularioPozo.disable();
      }
    }
    // -----------
    this.cargarAreaHidrografica();
    this.onChanges();
  }

  cargarCapas() {
    this.serviciosCapasService
    .obtenerPorId(capasEnum.Pozos)
    .subscribe((response) => {
      // console.log('cargarCapas', response.urlVisualizar);
      this.capas.push({
        url: response.urlVisualizar,
        id: capasEnumDatos(capasEnum.Pozos).id,
        visible: true,
        titulo: capasEnumDatos(capasEnum.Pozos).titulo,
      });
    }); 

    
    // console.log('cargarCapas');
    this.serviciosCapasService
      .obtenerPorId(capasEnum.Zonificacion)
      .subscribe((response) => {
        // console.log('cargarCapas', response.urlVisualizar);
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
        // console.log('cargarCapas', response.urlVisualizar);
        this.capas.push({
          url: response.urlVisualizar,
          id: capasEnumDatos(capasEnum.Departamentos).id,
          visible: true,
          titulo: capasEnumDatos(capasEnum.Departamentos).titulo,
        });
      });  
  }

  private construirFormulario() {
    this.formularioPozo = this.formBuilder.group({
      idPozo: [''],
      pozo: ['', [Validators.required]],
      fechaInicioOperacion: ['', [Validators.required]],
      cotaBoca: ['', [Validators.required]],
      cotaMedidor: ['', [Validators.required]],
      profundidad: ['', [Validators.required]],
      idTipoPozo: ['', [Validators.required]],
      idCategoria: ['', [Validators.required]],
      idCondicion: ['', [Validators.required]],
      activo: [estados.activo],  
      fechaCreacion: [''],
      fechaEstado: [''],
      fechaModificacion: [''],
      idMunicipio: [''], 
      nivelSubsiguiente: [''], 
      usuarioCreacion: [''],
      usuarioEstado: [''],
      usuarioModificacion: [''], 
      zonaOperativaEaab: [''],
      idDepartamento: [''],
      idTipoCoordenada: [''],
      latitud: [''],
      longitud: [''], 
      norte: [''],
      este: [''],



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
      microcuenca: [''],
      // Datos fuera del formulario
      tipoPozo: [''],
      categoria: [''],
      condicion: [''], 

    });
  }

  guardar() {
    this.AsignarNombres()
    try {
      if (this.formularioPozo.valid) {
        if (this.id === '0') {
          this.serviciosPozosService
            .crear(this.formularioPozo.value)
            .subscribe((response) => {
              this.toast.fire({
                icon: 'success',
                title: 'Pozo ' + response.pozo + ', creado exitosamente!',
              });
              this.router.navigate(['/configuracion/pozos']);
            });
        } else {
          this.formularioPozo.value.activo = estados.activo  
          this.serviciosPozosService
            .actualizar(this.formularioPozo.value)
            .subscribe((response) => {
              this.toast.fire({
                icon: 'success',
                title: 'Pozo ' + response.pozo + ', actualizado exitosamente!',
              });
              this.router.navigate(['/configuracion/pozos']);
            });
        }
      }
    } catch (error) {
      console.error(error);
    }
  }


  AsignarNombres() {
    let CuencaName: any = this.listaCuenca.find(
      (cuenca) => cuenca['id'] == this.formularioPozo.value.idCuenca
    );

    let AreaName: any = this.listaAreaHidrografica.find(
      (cuenca) =>
        cuenca['id'] == this.formularioPozo.value.idAreaHidrografica
    );

    let ZonaName: any = this.listaZonaHidrografica.find(
      (cuenca) =>
        cuenca['id'] == this.formularioPozo.value.idZonaHidrografica
    );

    let subZonaName: any = this.listasubZonaHidrografica.find(
      (cuenca) =>
        cuenca['id'] == this.formularioPozo.value.idSubZonaHidrografica
    );

    let subCuencaName: any = this.listaSubcuenca.find(
      (cuenca) => cuenca['id'] == this.formularioPozo.value.idSubCuenca
    );

    let MicroCuencaName: any = this.listaMicrocuenca.find(
      (cuenca) => cuenca['id'] == this.formularioPozo.value.idMicroCuenca
    );

    if (MicroCuencaName != undefined || null) {
      this.formularioPozo.value.microCuenca = MicroCuencaName['text'];
    }
    if (CuencaName != undefined || null) {
      this.formularioPozo.value.cuenca = CuencaName['text'];
    }
    if (AreaName != undefined || null) {
      this.formularioPozo.value.areaHidrografica = AreaName['text'];
    }
    if (ZonaName != undefined || null) {
      this.formularioPozo.value.zonaHidrografica = ZonaName['text'];
    }
    if (subZonaName != undefined || null) {
      this.formularioPozo.value.subZonaHidrografica = subZonaName['text'];
    }
    if (subCuencaName != undefined || null) {
      this.formularioPozo.value.subCuenca = subCuencaName['text'];
    }
  }

  private cargarMunicipiosPorDepartamento() {
    this.serviciosPozosService
      .obtenerMunicipiosPorIdDepartamento(this.tempIdDepartamento)
      .subscribe((response) => {
        this.listaMunicipios = response;
      });
  }
  cambioDepartamento(departamentoSelected: any) {
    // console.log('llego', departamentoSelected);
    if (departamentoSelected != undefined && departamentoSelected != '') {
      this.tempIdDepartamento = departamentoSelected;
      this.cargarMunicipiosPorDepartamento();
    }
  }
  mapLoadedEvent(status: Event) {
    console.log('The map loaded: ' + status);
  }

  seleccionMapa(e: any) {
    // TO-DO
    // console.log('seleccion respuesta', e);
    this.latitud?.setValue(e.ubicacion.latitude);
    this.longitud?.setValue(e.ubicacion.longitude);
    // this.norte?.setValue(e.ubicacion.y);
    // this.este?.setValue(e.ubicacion.x);

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
    // this.subcuenca?.setValue(codsch);
    this.microCuenca?.setValue(codmch);
  }

  onChanges(): void {
    if (this.formularioPozo) {
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
                return { id: zh.CODAH, text:zh.CODAH+ '-'+ zh.NOMBAH };
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
                  return { id: zh.CODZH, text: zh.CODZH+ '-'+ zh.NOMBZH };
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
                  return { id: zh.CODSZH, text:zh.CODSZH +'-'+ zh.NOMBSZH };
                });
              // console.log('serviciosCapasService OK', datos);
              this.listasubZonaHidrografica = datos;
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
                  return { id: zh.CODCH, text: zh.CODCH +'-'+zh.NOMBCH };
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
                  return { id: zh.CODSCH, text: zh.CODSCH +'-'+ zh.NOMSCH };
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
                  return { id: zh.CODMC, text: zh.CODMC +'-'+ zh.NOMBMC };
                });
              // console.log('serviciosCapasService OK', datos);
              this.listaMicrocuenca = datos;
            });
        });
    }
  }

  clickMapa(event: any) {
    console.log('Evento click recibido', event);
  }
}
