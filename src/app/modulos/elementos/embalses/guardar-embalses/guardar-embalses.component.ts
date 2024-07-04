import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiciosGeograficosService } from 'src/app/common/mapa/servicios-geograficos.service';
import { estados } from 'src/app/common/utils/constantes';
import { capasEnum, capasEnumDatos } from 'src/app/modelo/enum/capas-enum';
import { dominiosEnum } from 'src/app/modelo/enum/dominios-enum';
import Swal from 'sweetalert2';
import { ServiciosCapasService } from '../../../configuracion/capas/servicios-capas.service';
import { ServiciosDominiosValoresService } from '../../../configuracion/dominios/servicios-dominios-valores.service';
import { ServiciosEmbalcesService } from '../servicios-embalses.service';

@Component({
  selector: 'app-guardar-embalses',
  templateUrl: './guardar-embalses.component.html',
})
export class GuardarEmbalsesComponent implements OnInit {
  public formularioEmbalse!: FormGroup;
  public id: string = '0';
  public ac: string = 'c';
  public listEntidades = [];
  public listZonaEAAB = [];
  public listaMunicipios = [];
  public listaDepartamentos = [];
  private tempIdDepartamento: number = 0;
  public listaAreaHidrografica = [];
  public listaZonaHidrografica = [];
  public listasubZonaHidrografica = [];
  public listanivel = [];
  public listaSubcuenca = [];
  public listaCuenca = [];
  public listaMicrocuenca = [];
  public departamentoSelected: any;
  public tipoCoordenadaSelect: any; 

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

 
  
  capas: any[] = [];
  // Set our map properties
  mapCenter = [-73.9, 4.4];
  basemapType = 'topo';
  mapZoomLevel = 9;
  
  /**Propiedades del formulario */
  

  get idEmbalse() {
    return this.formularioEmbalse.get('idEmbalse');
  }
  get embalse() {
    return this.formularioEmbalse.get('embalse');
  }
  get idEntidad() {
    return this.formularioEmbalse.get('idEntidad');
  }
  get zonaOperativaEaab() {
    return this.formularioEmbalse.get('zonaOperativaEaab');
  }
  get fechaInicioOperacion() {
    return this.formularioEmbalse.get('fechaInicioOperacion');
  }
  get volumenTotal() {
    return this.formularioEmbalse.get('volumenTotal');
  }
  get elevacion() {
    return this.formularioEmbalse.get('elevacion');
  }
  get volumenUtil() {
    return this.formularioEmbalse.get('volumenUtil');
  }
  get volumenMuerto() {
    return this.formularioEmbalse.get('volumenMuerto');
  }
  get longitudCresta() {
    return this.formularioEmbalse.get('longitudCresta');
  }
  get anchoCresta() {
    return this.formularioEmbalse.get('anchoCresta');
  }
  get alturaPresa() {
    return this.formularioEmbalse.get('alturaPresa');
  }

 

  get areaHidrografica() {
    return this.formularioEmbalse.get('idAreaHidrografica');
  }
  get zonaHidrografica() {
    return this.formularioEmbalse.get('idZonaHidrografica');
  }
  get subZonaHidrografica() {
    return this.formularioEmbalse.get('idSubZonaHidrografica');
  }
  get cuenca() {
    return this.formularioEmbalse.get('idCuenca');
  }
  get subcuenca() {
    return this.formularioEmbalse.get('idSubCuenca');
  }
  get microcuenca() {
    return this.formularioEmbalse.get('idMicroCuenca');
  }
 
  get este() {
    return this.formularioEmbalse.get('este');
  }
  get norte() {
    return this.formularioEmbalse.get('norte');
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private serviciosEmbalcesService: ServiciosEmbalcesService,
    private serviciosGeograficosService :ServiciosGeograficosService,
    private serviciosDominiosValoresService: ServiciosDominiosValoresService,
    private serviciosCapasService: ServiciosCapasService
  ) {}

  ngOnInit(): void {
    this.construirFormulario();
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.ac = this.route.snapshot.paramMap.get('ac')!;

    this.cargarCapas();


    // Departamentos
    this.serviciosGeograficosService
      .obtenerDepartamentos()
      .subscribe((response) => {
        this.listaDepartamentos = response;
      });

    

    if (this.ac != 'C') {
      // entidades
      this.serviciosDominiosValoresService
        .obtenerValoresPorIdDominio(dominiosEnum.Entidad)
        .subscribe((response) => {
          this.listEntidades = response;
        });
      this.serviciosDominiosValoresService
        .obtenerValoresPorIdDominio(dominiosEnum.ZonaOperativaEAAB)
        .subscribe((response) => {
          this.listZonaEAAB = response;
        });
    } else {
      // entidades
      this.serviciosDominiosValoresService
        .obtenerValoresActivosPorIdDominio(dominiosEnum.Entidad)
        .subscribe((response) => {
          this.listEntidades = response;
          // console.log('llegaron C', response);
        });
      this.serviciosDominiosValoresService
        .obtenerValoresActivosPorIdDominio(dominiosEnum.ZonaOperativaEAAB)
        .subscribe((response) => {
          this.listZonaEAAB = response;
          // console.log('ZonaOperativaEAAB C', response);
        });
    }
    if (this.id != '0') {
      let idParam: number = +this.id;

      this.serviciosEmbalcesService
        .obtenerPorId(idParam)
        .subscribe((response) => { 
          this.serviciosGeograficosService
          .obtenerMunicipioPorId(response.idMunicipio)
          .subscribe((responseMunicipio) => {
            response.idDepartamento = responseMunicipio.idDepartamento;
            this.cargarMunicipiosPorDepartamento();
            
            // console.log('llego embalse',response)
            this.formularioEmbalse.setValue(response);
          });

        });

      if (this.ac == 'V') {
        this.formularioEmbalse.disable();
      }
    }
    this.cargarAreaHidrografica();
    this.onChanges();

  }

  private construirFormulario() {
    this.formularioEmbalse = this.formBuilder.group({
      idEmbalse: [''],
    
      embalse: ['', [Validators.required]],
      idEntidad: ['', [Validators.required]],
      zonaOperativaEaab: ['', [Validators.required]],
      elevacion: ['', [Validators.required]],
      volumenTotal: ['', [Validators.required]],
      volumenUtil: ['', [Validators.required]],
      volumenMuerto: ['', [Validators.required]],
      longitudCresta: ['', [Validators.required]],
      anchoCresta: ['', [Validators.required]],
      alturaPresa: ['', [Validators.required]],
      fechaInicioOperacion: ['', [Validators.required]],

      activo: [estados.activo],
      fechaCreacion: [''],
      fechaModificacion: [''], 
      fechaEstado: [''],
      usuarioCreacion: [''],
      usuarioModificacion: [''],
      usuarioEstado: [''],  
      idMunicipio: [''], 
      nivelSubSiguiente: [''], 
      idDepartamento:[''],  

      idCuenca: [''],
      idAreaHidrografica: [''],
      idZonaHidrografica: [''],
      idSubZonaHidrografica: [''],
      idSubCuenca: [''],
      idMicroCuenca: [''],
      cuenca: [''],
      areaHidrografica: [''],
      zonaHidrografica:[''],
      subZonaHidrografica: [''],
      subCuenca: [''],
      microcuenca: [''],

      
      entidad: [''],

      
      
    });
  }

  guardar() {
     
    this.AsignarNombres()
    // console.log('guardando...',this.formularioEmbalse.value)
    try {
      if (this.formularioEmbalse.valid) {
        if (this.id === '0') {
          this.serviciosEmbalcesService
            .crear(this.formularioEmbalse.value)
            .subscribe((response) => {
              this.toast.fire({
                icon: 'success',
                title:
                  'Embalses ' + response.embalse + ', creado exitosamente!',
              });
              this.router.navigate(['/configuracion/embalses']);
            });
        } else {
          this.serviciosEmbalcesService
            .actualizar(this.formularioEmbalse.value)
            .subscribe((response) => {
              this.toast.fire({
                icon: 'success',
                title:
                  'Embalses ' +
                  response.embalse +
                  ', actualizado exitosamente!',
              });
              this.router.navigate(['/configuracion/embalses']);
            });
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  AsignarNombres() { 
    let CuencaName: any = this.listaCuenca.find(
      (cuenca) => cuenca['id'] == this.formularioEmbalse.value.idCuenca
    );

    let AreaName: any = this.listaAreaHidrografica.find(
      (cuenca) =>
        cuenca['id'] == this.formularioEmbalse.value.idAreaHidrografica
    );

    let ZonaName: any = this.listaZonaHidrografica.find(
      (cuenca) =>
        cuenca['id'] == this.formularioEmbalse.value.idZonaHidrografica
    );

    let subZonaName: any = this.listasubZonaHidrografica.find(
      (cuenca) =>
        cuenca['id'] == this.formularioEmbalse.value.idSubZonaHidrografica
    );

    let subCuencaName: any = this.listaSubcuenca.find(
      (cuenca) => cuenca['id'] == this.formularioEmbalse.value.idSubCuenca
    );

    let MicroCuencaName: any = this.listaMicrocuenca.find(
      (cuenca) => cuenca['id'] == this.formularioEmbalse.value.idMicroCuenca
    );

    if (MicroCuencaName != undefined || null) {
      this.formularioEmbalse.value.microCuenca = MicroCuencaName['text'];
    }
    if (CuencaName != undefined || null) {
      this.formularioEmbalse.value.cuenca = CuencaName['text'];
    }
    if (AreaName != undefined || null) {
      this.formularioEmbalse.value.areaHidrografica = AreaName['text'];
    }
    if (ZonaName != undefined || null) {
      this.formularioEmbalse.value.zonaHidrografica = ZonaName['text'];
    }
    if (subZonaName != undefined || null) {
      this.formularioEmbalse.value.subZonaHidrografica = subZonaName['text'];
    }
    if (subCuencaName != undefined || null) {
      this.formularioEmbalse.value.subCuenca = subCuencaName['text'];
    }
  }
  
  
  mapLoadedEvent(status: Event) {
    // console.log('The map loaded: ' + status);
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

  clickMapa(event: any) {
    // console.log('Evento click recibido', event);
  }
  cargarCapas() {
    
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

      this.serviciosCapasService
      .obtenerPorId(capasEnum.Embalses)
      .subscribe((response) => {
        // console.log('cargarCapas', response.urlVisualizar);
        this.capas.push({
          url: response.urlVisualizar,
          id: capasEnumDatos(capasEnum.Embalses).id,
          visible: true,
          titulo: capasEnumDatos(capasEnum.Embalses).titulo,
        });
      }); 
  }
  seleccionMapa(e:any) {
    // TO-DO
    // console.log('seleccion respuesta', e);
    // this.latitud?.setValue(e.ubicacion.latitude);
    // this.longitud?.setValue(e.ubicacion.longitude);
    this.norte?.setValue(e.ubicacion.y);
    this.este?.setValue(e.ubicacion.x);

    let features = e.seleccion.flat(1);

    let _cuenca = features.filter((c:any)=>c.idCapa === capasEnumDatos(capasEnum.Cuenca).id)[0].atributos; 
    let _subcuenca = features.filter((c:any)=>c.idCapa === capasEnumDatos(capasEnum.Subcuenca).id)[0].atributos; 
    let _microcuenca = features.filter((c:any)=>c.idCapa === capasEnumDatos(capasEnum.Microcuenca).id)[0]?.atributos; 
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
    this.microcuenca?.setValue(codmch);
    
  }
  onChanges(): void {
    if (this.formularioEmbalse) {
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
              .map(
                (f: any) => f.attributes 
              )
              
              .map((zh: any) => { 
                
                return { id: zh.CODAH, text: zh.CODAH+ '-'+ zh.NOMBAH };
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
                  return { id: zh.CODZH, text: zh.CODZH +'-'+ zh.NOMBZH };
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
                  return { id: zh.CODCH, text:zh.CODCH +'-'+ zh.NOMBCH };
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
                  return { id: zh.CODSCH, text: zh.CODSCH +'-'+zh.NOMSCH };
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
                  return { id: zh.CODMC, text:zh.CODMC +'-'+ zh.NOMBMC };
                });
              // console.log('serviciosCapasService OK', datos);
              this.listaMicrocuenca = datos;
            });
        });
    }
  }

}
