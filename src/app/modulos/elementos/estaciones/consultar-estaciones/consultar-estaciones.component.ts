import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { accionesTablasEnum } from 'src/app/modelo/enum/acciones-tablas-enum';
import { IEstacion } from 'src/app/modelo/configuracion/estacion';
import { ServiciosEstacionesService } from '../servicios-estaciones.service';
import { ServiciosQRService } from '../../qr.elemento.service.spec';

import { DataTableDirective } from 'angular-datatables';
import { estados } from 'src/app/common/utils/constantes';
import { capasEnum, capasEnumDatos } from 'src/app/modelo/enum/capas-enum';
import { ServiciosCapasService } from '../../../configuracion/capas/servicios-capas.service';

import { Router } from '@angular/router';
import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { printDiv } from './print-div';
import { MetodosGlobales } from 'src/app/common/utils/metodos-globales';
import { local } from 'd3';

// import { printDiv } from './print-div';

@Component({
  selector: 'app-consultar-estaciones',
  templateUrl: './consultar-estaciones.component.html',
})
export class ConsultarEstacionesComponent implements OnInit {

    public formularioQR!: FormGroup;

  constructor(
    private ServiciosEstacionesService: ServiciosEstacionesService,
    private serviciosCapasService: ServiciosCapasService,
    private  serviciosQRService:ServiciosQRService,
    private router: Router,
    private formBuilder: FormBuilder,


  ) {
    // Esto es intencional
  }
  get idcodigo() {
    return this.formularioQR.get('idcodigo')
  }
  get idtipoElemento() {
    return this.formularioQR.get('idtipoElemento')
  }
  get elemento() {
    return this.formularioQR.get('elemento')
  }




  
  capas: any[] = [];
  // Set our map properties
  mapCenter = [-73.9, 4.4];
  basemapType = 'topo';
  mapZoomLevel = 9;
  // See app.component.html
  mapLoadedEvent(status: Event) {
    console.log('The map loaded: ' + status);
  }

  @ViewChild(DataTableDirective, { static: false })
  dtOptions: any = {};
  datatableElement!: DataTableDirective;


// Datos para QR
  @ViewChild('ModalMolinete', { static: false }) ModalMolinete: ElementRef;
  @ViewChild('ModalMolinete', { static: false }) ModalQr: ElementRef;

  tipoElementoQR =NgxQrcodeElementTypes.URL
  valorQR =  environment.urlMovil
  errorQR = NgxQrcodeErrorCorrectionLevels.HIGH
  CodigoIdeam:string
  CodigoEaab:string
  Estacion:string

  idTipoElemento="Estación" 
  idElementoN:string 
  idElemento:number 
  codigo:string
   nombreElemento:string
  tipoElemento:string
  bloquear = false





  rutaGeneral = 'configuracion/estaciones/C/0';
  rutaConsulta = 'configuracion/estaciones/V/';
  rutaEdicion = 'configuracion/estaciones/E/';
 


  datosFilter = [] as any;
  datosOriginal = [] as any;

  botonesGenerales = [
    {
      text: 'Activar Todos',
      action: 'Activacion',
      enabled: this.validarPermiso('ActualizarEstacion'), 
    },
    {
      text: 'Inactivar todos',
      action: 'Inactivar', 
      enabled: this.validarPermiso('ActualizarEstacion'), 
    },
  ];

  listaDeElementos: any = []; 

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

  columnas = [
    {
      title: 'ID',
      data: 'idEstacion',
      visible: false,
    },

    {
      title: ' Código estación IDEAM',
      data: 'codigoEstacionIdeam',
      filter: true,
      filterValue: '',
      tipo: 'texto',
    },
    {
      title: 'Código estación  EAAB ',
      data: 'codigoEstacionEaab',
      filter: false, 
    },
    {
      title: 'Estación',
      data: 'estacion',
      filter: true,
      filterValue: '',
      tipo: 'seleccion',
    },
    {
      title: 'Categoría',
      data: 'categoria',
      filter: true,
      filterValue: '',
      tipo: 'seleccion',
    },
    {
      title: 'Tecnología',
      data: 'tecnologia',
      visible: false,
      filter: true,
      filterValue: '',
      tipo: 'seleccion',
    },
    {
      title: 'Tipo coordenadas',
      data: 'tipoCoordenadas',
       
    },
    {
      title: 'Tipo estación',
      data: 'tipoEstacion',
      visible: false,
    },
    {
      title: 'Fecha estado',
      data: 'fechaEstado',
      visible: false,
      filter: true,
      filterValueMin: '',
      filterValueMax: '',
      tipo: 'rangoFecha',
    },
    {
      title: 'Corriente',
      data: 'corriente',
      visible: false,
    },
    { title: 'Estado', data: 'estado',  filter: true,
    filterValue: '',
    tipo: 'seleccion',  },
    {
      title: 'Fecha instalación',
      data: 'fechaInstalacion',
      visible: true,
      filter: true,
      filterValueMin: '',
      filterValueMax: '',
      tipo: 'rangoFecha',
    },
    {
      title: 'Entidad',
      data: 'entidad',
      filter: true,
      filterValue: '',
      tipo: 'texto',
    },
    {
      title: 'Altitud (m.s.n.m)',
      data: 'altitud',
      filter: true,
      filterValueMin: '',
      filterValueMax: '',
      tipo: 'rangoNumero',
    },
    {
      title: 'Activo',
      data: 'activo',
      class: 'text-center',
      visible: false,
      filter: true,
      filterValue: '',
      tipo: 'seleccion',
    },
    {
      title: 'Cuenca',
      data: 'cuenca',
      class: 'text-center',
      filter: true,
      filterValue: '',
      tipo: 'seleccion',
    },
    {
      title: 'Área hidrográfica',
      data: 'areaHidrografica',
      filter: true,
      filterValue: '',
      tipo: 'texto',
    },
    {
      title: 'Micro cuenca',
      data: 'microCuenca',
      filter: true,
      visible: false,
      filterValue: '',
      tipo: 'texto',
    },
    {
      title: 'Sub cuenca',
      data: 'subCuenca',
      visible: false, 
    },
    {
      title: 'Zona hidrográfica',
      data: 'zonaHidrografica',
      filter: true,
      filterValue: '',
      tipo: 'texto',
    },
    {
      title: 'Zona operativa EAAB',
      data: 'zonaOperativaEaab',
      filter: true,
      filterValue: '',
      tipo: 'texto',
    },
    {
      title: 'Nivel sub-siguiente',
      data: 'nivelSubSiguiente',
      visible: false,
       
    },
    {
      title: 'Sub zona hidrografica',
      data: 'subZonaHidrografica',
       visible: false, 
    },
    {
      title: 'Municipio',
      data: 'municipio',
      filter: true,
      filterValue: '',
      tipo: 'seleccion',
    },
    {
      title: 'Departamento',
      data: 'departamento', 
      visible: false,
      filter: true,
      filterValue: '',
      tipo: 'seleccion',
    },

    { title: 'latitud', data: 'latitud', visible: false },
    { title: 'longitud', data: 'longitud', visible: false },
    { title: 'norte', data: 'norte', visible: false },
    { title: 'este', data: 'este', visible: false },
    { title: 'usuarioCreacion', data: 'usuarioCreacion', visible: false },
    { title: 'usuarioEstado', data: 'usuarioEstado', visible: false },
    {
      title: 'usuarioModificacion',
      data: 'usuarioModificacion',
      visible: false,
    },
    { title: 'idCategoria', data: 'idCategoria', visible: false },
    { title: 'idCorriente', data: 'idCorriente', visible: false },
    { title: 'idCuenca', data: 'idCuenca', visible: false },
    { title: 'idDepartamento', data: 'idDepartamento', visible: false },
    { title: 'idEntidad', data: 'idEntidad', visible: false },
    { title: 'idEstado', data: 'idEstado', visible: false },
    { title: 'idMicroCuenca', data: 'idMicroCuenca', visible: false },
    { title: 'idMunicipio', data: 'idMunicipio', visible: false },
    { title: 'idSubCuenca', data: 'idSubCuenca', visible: false },
    {
      title: 'idSubZonaHidrografica',
      data: 'idSubZonaHidrografica',
      visible: false,
    },
    { title: 'idTecnologia', data: 'idTecnologia', visible: false },
    { title: 'idTipoCoordenadas', data: 'idTipoCoordenadas', visible: false },
    { title: 'idTipoEstacion', data: 'idTipoEstacion', visible: false },
    { title: 'idZonaHidrografica', data: 'idZonaHidrografica', visible: false },
    { title: 'fechaModificacion', data: 'fechaModificacion', visible: false },
    { title: 'idAreaHidrografica', data: 'idAreaHidrografica', visible: false },
    { title: 'fechaCreacion', data: 'fechaCreacion', visible: false },
  ];

  botones = [
    {
      class: 'sish-boton-azul',
      title: ' Crear QR',
      action: 'ingresar',
      icon: 'fas fa-qrcode', 
      enabled: this.validarPermiso('ActualizarEstacion'),

    },
    {
      class: 'sish-boton-azul',
      title: 'parámetros',
      action: 'parametros',
      icon: 'fas fa-tasks',
      enabled: this.validarPermiso('ActualizarEstacion'),
    },
    {
      class: 'sish-boton-rojo',
      title: ' Mostrar Codigo QR',
      action: 'AbrirQR',
      icon: 'fas fa-qrcode', 
      enabled: this.validarPermiso('ConsultarEstacion'),
    },
  
  
  ];




  ngOnInit(): void {

    this.construirFormulario();
    this.cargarCapas();

    this.obtenerEstaciones();
  }

  imprimir(){  
    printDiv('qrconten');   

  }

   construirFormulario() {

    this.formularioQR = this.formBuilder.group({
      idtipoElemento: ['', [Validators.required]],
      idcodigo: ['',[Validators.required]],
      elemento: ['',[Validators.email]],
    })
  }


  async cargarCapas() { 
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
      .obtenerPorId(capasEnum.Estaciones)
      .subscribe((response) => {
        // console.log('cargarCapas', response.urlVisualizar);
        this.capas.push({
          url: response.urlVisualizar,
          id: capasEnumDatos(capasEnum.Estaciones).id,
          visible: true,
          titulo: capasEnumDatos(capasEnum.Estaciones).titulo,
        });
      }); 

      // console.log('capaz',this.capas)
  }

  obtenerEstaciones() {
    this.ServiciosEstacionesService.obtenerEstaciones().subscribe(
      (response) => {
        this.datosFilter = response;
        console.log('llego estacion ',response)
        this.datosOriginal = response;
      }
    );
  }

  accionRegistro(e: any) {
    switch (e.accion) {
      case accionesTablasEnum.Activar: {
        let estacion: IEstacion = e.registro;
        estacion.activo = estados.activo;
        this.actualizar(estacion);
        // statements;
        break;
      }
      case accionesTablasEnum.Inactivar: {
        let estacion: IEstacion = e.registro;
        estacion.activo = estados.inactivo;
        this.actualizar(estacion);
        break;
      }
      case accionesTablasEnum.Eliminar: {
        //statements;
        break;
      }
      case 'parametros': {
        let estacion: IEstacion = e.registro;
        this.router.navigate([
          'configuracion/parametrosEstacion/' + estacion.idEstacion,
        ]);
        //statements;
        break;
      }
      case 'AbrirQR': { 
        
        this.CodigoIdeam  =e.registro.codigoEstacionIdeam  
        this.CodigoEaab   =e.registro.codigoEstacionEaab
        this.Estacion =e.registro.estacion 
        this.valorQR =  this.valorQR + e.registro.idEstacion   
        console.log(this.valorQR);
        this.ModalMolinete.nativeElement.click(); 
        //statements;
        break;
      }

      case 'ingresar': { 
        this.idElementoN = e.registro.estacion  
        this.idElemento = e.registro.estacion  
        this.tipoElemento = "Estación" 
        this.valorQR =   e.registro.idEstacion   
        let div: any = document.getElementById(`validarBtn`);
        div.click();
        //statements;
        break;
      }
      default: {
        //         break;
      }
    }
  }

  actualizar(estacion: IEstacion) {
    this.ServiciosEstacionesService.actualizar(estacion).subscribe(
      (response) => {
        // console.log(response);
        this.obtenerEstaciones();
      }
    );
  }
  accionGeneral(e: any) {
    switch (e) {
      case 'Activacion': {
        if (this.listaDeElementos.length >= 2) {
          // console.log('Activacion general', e);
          Swal.fire({
            title:
              'Cambiando estado de ' +
              this.listaDeElementos.length +
              ' elementos ',
            html: 'Por favor espere',
            timer: 2000,
            timerProgressBar: true,
            didOpen: () => {
              Swal.showLoading();
              for (
                let index = 0;
                index < this.listaDeElementos.length;
                index++
              ) {
                const element: IEstacion = this.listaDeElementos[index];
                element.activo = estados.activo;
                this.ServiciosEstacionesService
                  .actualizar(element)
                  .subscribe((response) => {});
              }
            },
            willClose: () => {
              this.toast.fire({
                icon: 'success',
                title:
                  'Se Activaron ' +
                  this.listaDeElementos.length +
                  ' Elementos',
              });
              this.listaDeElementos = [];
              this.obtenerEstaciones(); 
              // console.log('lista', this.listaDeElementos);
            },
          }).then((result) => {});
        } else {
          this.toast.fire({
            icon: 'info',
            title: 'Debe tener seleccionado almenos Dos elementos',
          });
        }

        break;
      }
      case 'Inactivar': {
        if (this.listaDeElementos.length >= 2) {
          Swal.fire({
            title:
              'Cambiando estado de ' +
              this.listaDeElementos.length +
              ' elementos ',
            html: 'Por favor espere',
            timer: 2000,
            timerProgressBar: true,
            didOpen: () => {
              Swal.showLoading();
              for (
                let index = 0;
                index < this.listaDeElementos.length;
                index++
              ) {
                const element: IEstacion = this.listaDeElementos[index];
                element.activo = estados.inactivo;
                this.ServiciosEstacionesService
                  .actualizar(element)
                  .subscribe((response) => {});
              }
            },
            willClose: () => {
              this.toast.fire({
                icon: 'success',
                title:
                  'Se Inactivaron ' +
                  this.listaDeElementos.length +
                  ' Elementos',
              });

              this.listaDeElementos = [];
              this.obtenerEstaciones();
            },
          }).then((result) => {});
        } else {
          this.toast.fire({
            icon: 'info',
            title: 'Debe tener seleccionado almenos Dos elementos',
          });
        }

        break;
      }

      default:
        break;
    }
 
  }

  lista(listaSelect: any) {
    // debugger
    if (listaSelect.length >= 2) {
      this.listaDeElementos = listaSelect;
    }
  }

  clickMapa(event: any) {
    // console.log('llego evento', event);
    let valores =
      event.data
        .filter(
          (f: any) => f.idCapa === capasEnumDatos(capasEnum.Estaciones).id
        )
        ?.map((d: any) => d.atributos?.CODIGO_INTERNO_SISH)[0] ?? '';
    if (valores) {
      this.datosFilter = this.datosOriginal.filter(
        (f: any) => f.idEstacion === valores
      );
    } else {
      this.datosFilter = this.datosOriginal;
    }
  }


  crearCodigo(){

      alert(this.valorQR);
      var listaresgistro:any ={
        idElemento: this.valorQR,
        idTipoElemento: 466,
        codigo: this.codigo
      }
      console.log(listaresgistro);
      this.serviciosQRService
      .crear(listaresgistro)
      .subscribe((response) => {
        this.toast.fire({
          icon: 'success',
          title:
            'Codígo guardado' + response.codigo + ', creada exitosamente!',
        });

        location.reload;


       
      });

  
  }

  seleccionMapa(event: any) {
    let seleccion = event.seleccion
      .map((s: any) =>
        s.filter(
          (r: any) => r.idCapa === capasEnumDatos(capasEnum.Estaciones).id
        )
      )
      .filter((v: any) => v.length > 0)[0];
    let valores =
      seleccion?.map((d: any) => d.atributos?.CODIGO_INTERNO_SISH) ?? [];
    if (valores) {
      this.datosFilter = this.datosOriginal.filter(
        (f: any) => valores.indexOf(f.idEstacion) > -1
      );
    } else {
      this.datosFilter = this.datosOriginal;
    }
  }

  validarPermiso(permiso : string) : boolean {
    return MetodosGlobales.validarPermiso(permiso);
  }
}
