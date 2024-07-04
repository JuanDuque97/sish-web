import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { estadosVector } from 'src/app/common/utils/constantes';
import { dominiosEnum } from 'src/app/modelo/enum/dominios-enum';
import { ServiciosDominiosValoresService } from '../../configuracion/dominios/servicios-dominios-valores.service';
import { ServiciosEmbalcesService } from '../../elementos/embalses/servicios-embalses.service';
import { ServiciosEstacionesService } from '../../elementos/estaciones/servicios-estaciones.service';
import { ServiciosPozosService } from '../../elementos/pozos/servicios-pozos.service';
import { ServiciosParametrosService } from '../../parametros/servicios-parametros.service';
import { camposPozos, camposEmbalses } from './nombreCampos';
import { ServiciosGestionReportes } from '../servicios-gestion-reportes.service';
import { camposEstaciones, camposOBservaciones, camposParametros,} from './nombreCampos';
import Swal from 'sweetalert2';
import { reporteEstructura } from '../../../modelo/configuracion/reporte';

@Component({
  selector: 'app-guardar-reportes',
  templateUrl: './guardar-reportes.component.html',
})
export class GuardarReportesComponent implements OnInit {
  public formularioReporte!: FormGroup;
  public id: string = '0';
  public ac: string = '0';
  public listtipoReporte: [];
  public listPeriodo: [];
  public listEntidad: [];
  public listElementos: any[] = [];
  public listParametros: any[] = [];
  public bloqueo: boolean= false;

  public listAgregadas: any[] = [];

  public listElemento: any[];
  public listaTipoElementos: any[];
  public listCamposElemento: any;
  public listCamposObservaciones: any;
  public listCamposParametros: any;
  public listEstructura: any = [];

  public listEstados = estadosVector;

  public elemento: string;

  public estructura: string = '';

  selectedEstaciones?: any;
  selectedEstacionesEliminada?: any;
  //PARA ACTIVAR LOS BOTONES
  buttonDisabled: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private serviciosEstacionesService: ServiciosEstacionesService,
    private serviciosParametrosService: ServiciosParametrosService,
    private serviciosDominiosValoresService: ServiciosDominiosValoresService,
    private serviciosPozosService: ServiciosPozosService,
    private serviciosEmbalcesService: ServiciosEmbalcesService,
    private serviciosGestionReportes: ServiciosGestionReportes
  ) {}

  get codReporte() {
    return this.formularioReporte.get('codReporte');
  }
  get nombreReporte() {
    return this.formularioReporte.get('nombreReporte');
  }
  get idtipoReporte() {
    return this.formularioReporte.get('idtipoReporte');
  }
  // get activo() {
  //   return this.formularioReporte.get('activo');
  // }
  get EntidadSolicita() {
    return this.formularioReporte.get('EntidadSolicita');
  }
  get idPeriodo() {
    return this.formularioReporte.get('idPeriodo');
  }
  get fechaentrega() {
    return this.formularioReporte.get('fechaentrega');
  }
  get descripcion() {
    return this.formularioReporte.get('descripcion');
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

    Swal.fire({
      title: 'Cargando...',
      html: 'Por favor espere',
      showConfirmButton: false,
      allowOutsideClick: false,
      didOpen:()=>{
        Swal.showLoading();
        this.serviciosDominiosValoresService
        .obtenerValoresPorIdDominio(dominiosEnum.TipoReporte)
        .subscribe((response) => {
        this.listtipoReporte = response;
        Swal.close();
      });
      },
      willClose:()=>{
        Swal.hideLoading();
      }
    });

   Swal.fire({
    title: 'Cargando...',
    html: 'Por favor espere',
    showConfirmButton: false,
    allowOutsideClick: false,
    didOpen:()=>{
      Swal.showLoading();
      this.serviciosDominiosValoresService
      .obtenerValoresPorIdDominio(dominiosEnum.PeriodoReporte)
      .subscribe((response) => {
      this.listPeriodo = response;
      Swal.close();
    });
    },
    willClose:()=>{
      Swal.hideLoading();
    }
   });

   Swal.fire({
    title: 'Cargando...',
    html: 'Por favor espere',
    showConfirmButton: false,
    allowOutsideClick: false,
    didOpen:()=>{
      Swal.showLoading();
      this.serviciosDominiosValoresService
      .obtenerValoresPorIdDominio(dominiosEnum.TipoElemento)
      .subscribe((response) => {
      this.listaTipoElementos = response;
      Swal.close();
    });
    },
    willClose:()=>{
      Swal.hideLoading();

    }
   });


    if (this.id != '0') {
      Swal.fire({
        title: 'Cargando Datos Elementos...',
        html: 'Por favor espere',
        showConfirmButton: false,
        allowOutsideClick: false,
        didOpen:()=>{
          Swal.showLoading();


          let idParam: number = +this.id;

          this.obtenerReporte(idParam, () => {
            Swal.close();
          });
          this.bloqueo = true

          if (this.ac == 'V') {
            //desactivar formulario y botones
            this.formularioReporte.disable();
            this.buttonDisabled=true;
          }

        }, willClose: async() => {
          Swal.hideLoading();
        }
      });
    }
  }

  private construirFormulario() {
    this.formularioReporte = this.formBuilder.group({
      idEstructura: [''],
      codReporte: ['', Validators.required],
      nombreReporte: ['', Validators.required],
      idtipoReporte: ['', Validators.required],
      activo: [''],
      EntidadSolicita: ['', Validators.required],
      idPeriodo: ['', Validators.required],
      fechaentrega: ['', Validators.required],
      descripcion: ['', Validators.required],
      idTipoElemento: ['', Validators.required],

      listElemento: [],
      listParametros: [],
      estructura: [''],

      fechaCreacion: [''],
      fechaModificacion: [''],
      usuarioCreacion: [''],
      usuarioModificacion: [''],
    });
  }

  obtenerReporte(id: number, callback : Function) {
    this.serviciosGestionReportes.obtenerPorId(id).subscribe((response) => {
      let objetoRespons:reporteEstructura = {
        idEstructura: response.idEstructura,
        codReporte: response.codReporte,
        nombreReporte: response.nombreReporte,
        idtipoReporte: response.idtipoReporte,
        activo: response.activo,
        EntidadSolicita: response.EntidadSolicita,
        idPeriodo: response.idPeriodo,
        fechaentrega: response.fechaentrega,
        descripcion: response.descripcion,
        idTipoElemento: response.idTipoElemento,
        listElemento: response.listElemento,
        listParametros: response.listParametros,
        estructura: response.estructura,
        fechaCreacion: response.fechaCreacion,
        fechaModificacion: response.fechaModificacion,
        usuarioCreacion: response.usuarioCreacion,
        usuarioModificacion: response.usuarioModificacion,
      };

      this.formularioReporte.setValue(objetoRespons); 
      this.listElementos = response.listElemento;
      this.listParametros = response.listParametros;

      if ( null!=response.estructura && undefined!=response.estructura && 
          response.estructura.length>0 && response.estructura.includes(',') ) {
        let obtEstructura = response.estructura.split(',');
        obtEstructura.pop();
        obtEstructura.forEach((element) => {
          this.listEstructura.push({ id: element });
        });
      }

      callback();
    });
  }

  guardar() {
    this.listEstructura.forEach((element: any) => {
      this.estructura += element.id + ',';
    });
    this.formularioReporte.value.estructura = this.estructura;
    this.formularioReporte.value.listElemento = this.listElementos;
    this.formularioReporte.value.listParametros = this.listParametros;

    let listasValidas = this.listElementos.length>0 && this.listParametros.length>0 && this.estructura.length>0;

    if (this.formularioReporte.valid && listasValidas) {
      if (this.id === '0') { 
          Swal.fire({
            title: 'Guardando...',
            html: 'Por favor espere',
            showConfirmButton: false,
            allowOutsideClick: false,
            timer: 420000,
            timerProgressBar: true,
            didOpen: async () => {
              Swal.showLoading();

              let request = this.formularioReporte.value;
              request.activo = 'S';

              this.serviciosGestionReportes
              .crear(request)
              .subscribe((response) => {
                Swal.close();
              
                this.toast.fire({
                  icon: 'success',
                  title: 'Reporte Creado ',
                
                });

                setTimeout(() => {
                  this.router.navigate(['/configuracion/gestionReportes']);
                }, 1000);
              });
            },
            willClose: async() => {
              Swal.hideLoading();
            },
          });
  
      } else { 
        Swal.fire({
          title: 'Actualizando...',
          html: 'Por favor espere',
          showConfirmButton: false,
          allowOutsideClick: false,
          timer: 420000,
          timerProgressBar: true,
          didOpen: () => {
            Swal.showLoading();

            let request = this.formularioReporte.value;
            request.activo = 'S';

            this.serviciosGestionReportes
            .actualizar(request)
            .subscribe((response) => {
              console.log('Reporte Actualizado', response);
              Swal.close();

              this.toast.fire({
                icon: 'success',
                title: 'Reporte Actualizado ',
              });

              setTimeout(() => {
                this.router.navigate(['/configuracion/gestionReportes']);
              }, 1000);

            });
          },
          willClose: () => {
            Swal.hideLoading();

          },
        }).then((result) => {});

        
      }
    }
  }

  obtenerEstaciones() {
    this.listAgregadas = [];
    this.listElemento = [];

    Swal.fire({
      title: 'Cargando estaciones...', 
      html: 'Por favor espere.', 
      allowOutsideClick: false, 
      showConfirmButton: false,
      timer: 42000, 
      timerProgressBar: true,
      didOpen: async() => {
        Swal.showLoading();

        this.serviciosEstacionesService
          .obtenerEstaciones()
          .subscribe((response) => {
          // console.log('estaciones', response);
          var Array: any = [];
          response.forEach(function (element, index, array) {
            if (element.activo == 'S') {
              Array.push(element);
            }
          });

          this.listElemento = Array.map((elemento: any) => ({
            id: elemento.idEstacion,
            text: elemento.estacion,
            disabled: elemento.activo == 'S' ? false : true,
          }));

          Swal.close();
        });
      }, 
      willClose: async() => {
        Swal.hideLoading();
      }
    });
  }

  obtenerPozos() {
    this.listAgregadas = [];
    this.listElemento = [];

    Swal.fire({
      title: 'Cargando pozos...', 
      html: 'Por favor espere.', 
      allowOutsideClick: false, 
      showConfirmButton: false,
      timer: 42000, 
      timerProgressBar: true,
      didOpen: async() => {
        Swal.showLoading();

        this.serviciosPozosService.obtenerPozosDTO().subscribe((response) => {
          //  console.log('POZOS', response);
          var Array: any = [];
          response.forEach(function (element, index, array) {
            if (element.activo == 'S') {
              Array.push(element);
            }
          });
    
          this.listElemento = Array.map((elemento: any) => ({
            id: elemento.idPozo,
            text: elemento.pozo,
            disabled: elemento.activo == 'S' ? false : true,
          }));

          Swal.close();
        });
      },
      willClose: async() => {
        Swal.hideLoading();
      }
    });    
  }

  obtenerembalses() {
    this.listAgregadas = [];
    this.listElemento = [];

    Swal.fire({
      title: 'Cargando embalses...', 
      html: 'Por favor espere.', 
      allowOutsideClick: false, 
      showConfirmButton: false,
      timer: 42000, 
      timerProgressBar: true,
      didOpen: async() => {
        Swal.showLoading();

        this.serviciosEmbalcesService
        .obtenerEembalsesDTO()
        .subscribe((response) => {
          //  console.log('Embalses', response);
          var Array: any = [];
          response.forEach(function (element, index, array) {
            if (element.activo == 'S') {
              Array.push(element);
            }
          });
  
          this.listElemento = Array.map((elemento: any) => ({
            id: elemento.idEmbalse,
            text: elemento.embalse,
            disabled: elemento.activo == 'S' ? false : true,
          }));

          Swal.close();
        });
      }, 
      willClose: async() => {
        Swal.hideLoading();
      }
    });   
  }

  obtenerElementosPorTipo() {
    let codigo = 0;

    if ( this.elemento === 'Estaciones' ) {
      codigo = 466;
    } else if ( this.elemento === 'Embalses' ) {
      codigo = 467;
    } else if ( this.elemento === 'Pozos' ) {
      codigo = 468;
    }

    if ( 0 === codigo ) {
      return;
    }

    switch (codigo) {
      case 468:
        // pozos
        this.listCamposElemento = camposPozos;
        this.elemento = 'Pozos';
        this.obtenerPozos();
        break;

      case 466:
        // estaciones
        this.listCamposElemento = camposEstaciones;
        this.elemento = 'Estaciones';
        this.obtenerEstaciones();
        break;

      case 467:
        // embalses
        this.listCamposElemento = camposEmbalses;
        this.elemento = 'Embalses';
        this.obtenerembalses();
        break;
      }
  
      this.listCamposObservaciones = camposOBservaciones;
      this.listCamposParametros = camposParametros;
  }

  obtenerElementos(event: any) {

    if ( null==event || undefined==event || 0==event.length ) {
      return;
    }

      this.listEstructura = [];
      this.listParametros = [];
      this.listElementos = [];
      let elemento: number = parseInt(event);
      switch (elemento) {
        case 468:
          // pozos
          this.listCamposElemento = camposPozos;
          this.elemento = 'Pozos';
          this.obtenerPozos();
          
          break;
        case 466:
          // estaciones
          this.listCamposElemento = camposEstaciones;
          this.elemento = 'Estaciones';
          this.obtenerEstaciones();
  
          break;
        case 467:
          // embalses
          this.listCamposElemento = camposEmbalses;
          this.elemento = 'Embalses';
          this.obtenerembalses();
          break;
      }
  
      this.listCamposObservaciones = camposOBservaciones;
      this.listCamposParametros = camposParametros;
    }

  obtenerParametros() {
    this.listAgregadas = [];
    this.listElemento = [];

    Swal.fire({
      title: 'Cargando parámetros...', 
      html: 'Por favor espere.', 
      allowOutsideClick: false, 
      showConfirmButton: false,
      timer: 42000, 
      timerProgressBar: true,
      didOpen: async() => {
        Swal.showLoading();

        this.serviciosParametrosService
        .obtenerValoresParametrosSelect2()
        .subscribe((response) => {
          this.listElemento = response;
          Swal.close();
        });
      }, 
      willClose: async() => {
        Swal.hideLoading();
      }
    });
  }

  ordenEstructura(elemento: any): void {
    this.listEstructura.push(elemento);
    console.log('listEstructura', this.listEstructura);
  }

  EliminarEstructura(id: any): void {
    if ( this.ac === 'V' ) {
      return;
    }

    // this.selectedEstaciones = Estacion;
    var i = this.listEstructura.indexOf(id);
    if (i !== -1) {
      this.listEstructura.splice(i, 1);
    }
  }

  EliminarTodaestructura(): void {
    this.listEstructura = [];
  }

  onSelect(elemento: any): void {
    // this.selectedEstaciones = Estacion;
    this.listAgregadas.push(elemento);
    var i = this.listElemento.indexOf(elemento);
    if (i !== -1) {
      this.listElemento.splice(i, 1);
    }
  }

  eliminarLista(id: any) {
    this.listElemento.push(id);
    var i = this.listAgregadas.indexOf(id);
    if (i !== -1) {
      this.listAgregadas.splice(i, 1);
    }
  }

  eliminarTodas() {
    this.listAgregadas.forEach((element) => {
      this.listElemento.push(element);
    });

    this.listAgregadas = [];
  }

  AgregarTodas() {
    this.listAgregadas = this.listElemento;
    this.listElemento = [];
  }

  guardarEstaciones() {
    this.listElementos = [];
    this.listElementos = this.listAgregadas;
  }

  guardarParametros() {
    this.listParametros = [];
    this.listParametros = this.listAgregadas;

    console.log('lista de estaciones', this.listElementos);
  }
}
