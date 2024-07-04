import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { trim } from 'lodash';
import { estados } from 'src/app/common/utils/constantes';
import { IParametrosCriterio } from 'src/app/modelo/configuracion/criterioValidacion';
import { IDominioValor } from 'src/app/modelo/configuracion/dominioValor';
import { accionesTablasEnum } from 'src/app/modelo/enum/acciones-tablas-enum';
import { dominiosEnum } from 'src/app/modelo/enum/dominios-enum';
import { ServiciosDominiosValoresService } from 'src/app/modulos/configuracion/dominios/servicios-dominios-valores.service';
import { ServiciosDominiosService } from 'src/app/modulos/configuracion/dominios/servicios-dominios.service';
import { ServiciosEmbalcesService } from 'src/app/modulos/elementos/embalses/servicios-embalses.service';
import { ServiciosParametrosEmbalseService } from 'src/app/modulos/elementos/embalses/servicios-parametros-embalse.service';
import { ServiciosEstacionesService } from 'src/app/modulos/elementos/estaciones/servicios-estaciones.service';
import { ServiciosPozosService } from 'src/app/modulos/elementos/pozos/servicios-pozos.service';
import Swal from 'sweetalert2';
import { ServiciosCriteriosAceptacion } from '../servicios-gestion-criterios.service';
import { ServiciosParametrosCriterio } from '../servicios-parametros-criterio.service';
import { ServiciosvalorParametroXCriterio } from '../servicios-ValoresParametros-criterio.service';

@Component({
  selector: 'app-guardar-cirterios',
  templateUrl: './guardar-cirterios.component.html',
})
export class GuardarCirteriosComponent implements OnInit {

  public listaParaemtros: any[] = [];
  public formularioCriterios!: FormGroup;
  public formularioValores!: FormGroup;
  public id: string = '0';
  public ac: string = 'c';
  public idcriterio: number = 0;
  public codigoid: number = 0;

  public idValoresCalidad: number = 0;
  public NuevoValor: string;
  public criterio: string;
  public parametro: string;
  public idParametroXCriterio: number;
  bloquear: boolean = false;
  public listaparametros: any[] = [];
  public listaElementos: any[] = [];
  public listaRelacion: any[] = [];
  public listaparametrosSelect: any[] = [];
  public eliminar: boolean = true
  public ActivarElementos: boolean = false

  @ViewChild('ModalValores', { static: false }) ModalValores: ElementRef;
  @ViewChild('ModalValores3', { static: false }) ModalValores3: ElementRef;
  @ViewChild('ModalValores4', { static: true }) ModalValores4: ElementRef;

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
  get nombre() {
    return this.formularioCriterios.get('nombre');
  }
  get codigo() {
    return this.formularioCriterios.get('codigo');
  }
  get descripcion() {
    return this.formularioCriterios.get('descripcion');
  }

  //
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private serviciosCriteriosAceptacion: ServiciosCriteriosAceptacion,
    private serviciosEstacionesService: ServiciosEstacionesService,
    private serviciosEmbalcesService: ServiciosEmbalcesService,
    private serviciosPozosService: ServiciosPozosService,
    private serviciosParametrosCriterio: ServiciosParametrosCriterio,
    private serviciosDominiosValoresService: ServiciosDominiosValoresService,
    private serviciosvalorParametroXCriterio: ServiciosvalorParametroXCriterio
  ) {
    // Esto es intencional`
  }

  datosFilter = [] as any;
  // columbas de la tabla
  columnas = [
    {
      title: 'ID',
      data: 'idParametroXCriterio',
      visible: false,
    },
    {
      title: 'Tipo Parámetro',
      data: 'tipoParametro',
      class: 'text-center',
    },
    {
      title: 'Descripción',
      data: 'descripcionParametro',
      class: 'text-center',
    },
  ];

  botones = [
    {
      class: 'sish-boton-azul',
      title: 'Valores',
      action: 'valores',
      icon: 'fas fa-tasks',
    },
  ];
  botonesGenerales:any = [];
  ngOnInit(): void {

this.botonesGenerales = [
  {
    text: 'Agregar Parámetro',
    action: 'agregarValor',
  },
]

    this.construirFormulario();
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.ac = this.route.snapshot.paramMap.get('ac')!;
// llamada de elementos
    this.obtenerElementos(this.id);

    this.serviciosParametrosCriterio
      .obtenerListaParametros()
      .subscribe((responde) => {
        // console.log('llego parametros',responde)
        this.listaparametros = responde;

      });
    this.serviciosParametrosCriterio
      .obtenerListaParametrosSelect2()
      .subscribe((responde) => {

        this.listaparametrosSelect = responde;

      });

      this.serviciosDominiosValoresService
      .obtenerValoresPorIdDominio(dominiosEnum.TipoRelacion)
      .subscribe((response) => {
        this.listaRelacion = response;
        // console.log('llego frecuencia', this.listaFrecuencia);
      });


    if (this.id != '0') {
      let idParam: number = +this.id;
      this.bloquear = true;

      this.serviciosCriteriosAceptacion
        .obtenerPorId(idParam)
        .subscribe((response) => {

          this.formularioCriterios.setValue(response);
          this.idcriterio = parseInt(this.id);
          this.obtenerValores(this.idcriterio);
        });



      if (this.ac != 'E') {
        this.formularioCriterios.disable();

      }
      if (this.ac == 'V') {
        this.botonesGenerales = []
        this.botones = []
        this.eliminar = false
      }


    }
  }
  // Construccion de los formularios
  private construirFormulario() {
    this.formularioCriterios = this.formBuilder.group({
      idCriterio: [''],
      codigo: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
    });

    this.formularioValores = this.formBuilder.group({
      idValoresCalidad:  [''],
      idParametroXCriterio:  [''],
      valor1:  [''],
      valor2:  [''],
      valor3:  [''],
      fechaVigencia: [''],
      fechaCreacion:  ['']
    });
  }



  // guardar  dominio
  public guardar() {
    try {
      if (this.formularioCriterios.valid) {
        if (this.id === '0') {
          this.serviciosCriteriosAceptacion
            .crear(this.formularioCriterios.value)
            .subscribe((response) => {
              this.toast.fire({
                icon: 'success',
                title:
                  'El Criterio ' + response.nombre + ', Creado exitosamente!',
              });
              this.router.navigate(['/configuracion/gestionCriterios']);
            });
        } else {
          this.serviciosCriteriosAceptacion
            .actualizar(this.formularioCriterios.value)
            .subscribe((response) => {
              this.toast.fire({
                icon: 'success',
                title:
                  'El Criterio  ' +
                  response.nombre +
                  ',se Actualizado Exitosamente!',
              });
              this.router.navigate(['/configuracion/gestionCriterios']);
            });
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
  public guardarValores() {

    try {
      if (this.formularioValores.valid) {
        if (this.idValoresCalidad === 0) {

          this.formularioValores.value.idParametroXCriterio  = this.idParametroXCriterio
          this.formularioValores.value.fechaCreacion  = new Date()
          this.serviciosvalorParametroXCriterio
            .crear(this.formularioValores.value)
            .subscribe((response) => {
              this.toast.fire({
                icon: 'success',
                title:
                  'Los valores fueron Creados exitosamente!',
              });

            });
        } else {
          this.serviciosvalorParametroXCriterio
            .actualizar(this.formularioValores.value)
            .subscribe((response) => {

              this.toast.fire({
                icon: 'success',
                title:
                  'Los valores fueron Actualizados exitosamente!',
              });


            });
        }

        this.formularioValores.reset();

      }
    } catch (error) {
      console.error(error);
    }
  }
  public guardarValoresValidacion() {

      try {
        if (this.formularioValores.valid) {
          if (this.idValoresCalidad === 0) {

            this.formularioValores.value.idParametroXCriterio  = this.idParametroXCriterio
            this.formularioValores.value.fechaCreacion  = new Date()
            this.serviciosvalorParametroXCriterio
              .crear(this.formularioValores.value)
              .subscribe((response) => {
                this.toast.fire({
                  icon: 'success',
                  title:
                    'Los valores fueron Creados exitosamente!',
                });

              });
          } else {
            this.serviciosvalorParametroXCriterio
              .actualizar(this.formularioValores.value)
              .subscribe((response) => {

                this.toast.fire({
                  icon: 'success',
                  title:
                    'Los valores fueron Actualizados exitosamente!',
                });


              });
          }

          this.formularioValores.reset();

        }
      } catch (error) {
        console.error(error);
      }
    }
  public guardarValoresNumeroB() {

    try {
      if (this.formularioValores.valid) {
        if (this.idValoresCalidad === 0) {

          this.formularioValores.value.idParametroXCriterio  = this.idParametroXCriterio
          this.formularioValores.value.fechaCreacion  = new Date()
          this.serviciosvalorParametroXCriterio
            .crear(this.formularioValores.value)
            .subscribe((response) => {
              this.toast.fire({
                icon: 'success',
                title:
                  'Los valores fueron Creados exitosamente!',
              });

            });
        } else {
          this.serviciosvalorParametroXCriterio
            .actualizar(this.formularioValores.value)
            .subscribe((response) => {

              this.toast.fire({
                icon: 'success',
                title:
                  'Los valores fueron Actualizados exitosamente!',
              });


            });
        }

        this.formularioValores.reset();

      }
    } catch (error) {
      console.error(error);
    }
  }
  //  obtener lista valores dominio
  public obtenerValores(iddominio: number) {
    this.serviciosParametrosCriterio
      .obtenerListaParametrosXCriterio(iddominio)
      .subscribe((response) => {
        this.datosFilter = response;
      });
  }

  // agregar valor dominio a la lista

  agregarValor() {
    Swal.fire({
      customClass: {
        confirmButton: 'sish-boton-confirmar',
        cancelButton: 'sish-boton-cancelar',
        input: 'sish-popup-input',
        title: 'sish-titulo-formulario',
      },
      buttonsStyling: false,
      title: 'Nuevo Parámetro',
      input: 'select',
      inputOptions: this.listaparametros,
      showCancelButton: true,
      inputPlaceholder: 'seleccione un parametro...',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.agregarParametro(result);
      }
    });
  }

  public agregarParametro(result: any) {

    const parametrosCriterios: IParametrosCriterio = {
      idCriterio: this.codigoid,
      idParametro: parseInt(result.value),
      idParametroXCriterio: 0,
    };
 console.log('llego parametro',result.value)

 if (result.value != "") {
  this.serviciosParametrosCriterio
  .crear(parametrosCriterios)
  .subscribe((response) => {
    console.log('se agrego', response);
    this.toast.fire({
      icon: 'success',
      title: 'El Parámetro  fue agregado   creado exitosamente!',
    });

    this.obtenerValores(parseInt(this.id));
    // this.obtenerListaParametrosXEmbalse(parseInt(this.id));
  });
 }else{
  this.toast.fire({
    icon: 'info',
    title: 'Debe Seleccionar un Parámetro!',
  });

 }

  }

  // actividades de la tabla

  accionGeneral(e: any) {
    console.log('accion', e);
    this.agregarValor();
  }

  accionRegistro(e: any) {
    switch (e.accion) {
      case accionesTablasEnum.Activar: {
        //statements;
        break;
      }
      case accionesTablasEnum.Inactivar: {
        break;
      }
      case 'valores': {

        this.criterio = e.registro.criterio;
        this.parametro = e.registro.descripcionParametro;
        this.idParametroXCriterio = e.registro.idParametroXCriterio;

        if (this.codigoid == 104) {
          let div: any = document.getElementById(`idbtn`);
          div.click();

          this.serviciosvalorParametroXCriterio.obtenerListaParametrosXCriterio(this.idParametroXCriterio).subscribe(
            response =>{
              // console.log('llegaron valores',response)
              if (response != null) {
                this.idValoresCalidad = response.idValoresCalidad
                this.formularioValores.setValue(response);
              } else{
                this.formularioValores.reset();
              }
            }
          )
        }


        if (this.codigoid  == 201) {
          let div: any = document.getElementById(`idbtn3`);
          div.click();


          this.serviciosvalorParametroXCriterio.obtenerListaParametrosXCriterio(this.idParametroXCriterio).subscribe(
            response =>{
              // console.log('llegaron valores',response)
              if (response != null) {
                this.idValoresCalidad = response.idValoresCalidad
                this.formularioValores.setValue(response);
              } else{
                this.formularioValores.reset();
              }
            }
          )

        }


        if (this.codigoid  == 202) {
          let div: any = document.getElementById(`idbtn4`);
          div.click();


          this.serviciosvalorParametroXCriterio.obtenerListaParametrosXCriterio(this.idParametroXCriterio).subscribe(
            response =>{
              // console.log('llegaron valores',response)
              if (response != null) {
                this.idValoresCalidad = response.idValoresCalidad
                this.formularioValores.setValue(response);
              } else{
                this.formularioValores.reset();
              }
            }
          )
        }




        break;
      }
      case accionesTablasEnum.Eliminar: {
      // console.log('accion',e.registro)
        //statements;
        var eliminar = e.registro.idParametroXCriterio;
        this.idParametroXCriterio = e.registro.idParametroXCriterio;

        this.serviciosvalorParametroXCriterio.obtenerListaParametrosXCriterio(this.idParametroXCriterio).subscribe(
          response =>{
            if (response != null) {
              this.serviciosvalorParametroXCriterio
              .eliminar(eliminar)
              .subscribe((response) => {

                this.serviciosParametrosCriterio
                .eliminar(eliminar)
                .subscribe((response) => {
                  // console.log('se Elimini', response);
                  this.toast.fire({
                    icon: 'info',
                    title: 'El Parámetro  fue Eliminado  exitosamente!',
                  });

                  this.obtenerValores(parseInt(this.id));
                  // this.obtenerListaParametrosXEmbalse(parseInt(this.id));
                });

              });
            }  else{

              this.serviciosParametrosCriterio
              .eliminar(eliminar)
              .subscribe((response) => {
                // console.log('se agrego', response);
                this.toast.fire({
                  icon: 'info',
                  title: 'El Parámetro  fue Eliminado  exitosamente!',
                });

                this.obtenerValores(parseInt(this.id));
                // this.obtenerListaParametrosXEmbalse(parseInt(this.id));
              });


            }
          }
        );
        break;
      }

      default: {
        //statements;
        break;
      }
    }
  }

  obtenerElementos(even: any) {
    this.listaElementos = [];
    switch (even) {
      case '142': {
        // Estaciones
        this.ActivarElementos = true
        this.serviciosEstacionesService
          .obtenerEstaciones()
          .subscribe((response) => {
            this.listaElementos = response.map((elemento: any) => ({
              id: elemento.idEstacion,
              text: elemento.estacion,
              disabled: elemento.activo == 'S' ? false : true,
            }));
          });
        break;
      }
      case '182': {
        // Embalses
        this.ActivarElementos = true
        this.serviciosEmbalcesService
          .obtenerEembalsesDTO()
          .subscribe((response) => {
            // console.log('llegaron embalses', response);

            this.listaElementos = response.map((elemento: any) => ({
              id: elemento.idEmbalse,
              text: elemento.embalse,
              disabled: elemento.activo == 'S' ? false : true,
            }));
          });
        break;
      }
      case '181': {
        // pozos
        this.ActivarElementos = true
        this.serviciosPozosService.obtenerPozosDTO().subscribe((response) => {
          // console.log('llegaron pozoz', response);
          this.listaElementos = response.map((elemento: any) => ({
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
}
