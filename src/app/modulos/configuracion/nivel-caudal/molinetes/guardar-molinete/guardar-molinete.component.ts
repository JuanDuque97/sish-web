import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { estados } from 'src/app/common/utils/constantes';
import { dominiosEnum } from 'src/app/modelo/enum/dominios-enum';
import Swal from 'sweetalert2';
import { ServiciosDominiosValoresService } from '../../../dominios/servicios-dominios-valores.service';
import { ServiciosMolineteService } from '../servicios-molinetes.service';
import {
  IarchivoMolinete,
  Ihelice,
} from '../../../../../modelo/configuracion/molinete';
import { async, Observable } from 'rxjs';

@Component({
  selector: 'app-guardar-molinete',
  templateUrl: './guardar-molinete.component.html',
})
export class GuardarMolineteComponent implements OnInit {
  @ViewChild('ModalMolinete', { static: false }) ModalMolinete: ElementRef;

  public id: string = '0';
  public ac: string = 'c';
  public formularioMolinete: FormGroup;
  public formularioHelice: FormGroup;
  public listaTipoMolinete: [];
  public listaPeriodos: [];
  public listaHelices: Ihelice[] = [];
  public previsualizacion: string = '';
  public certificado: string = '';
  public ArchivoCargado: string = 'Examinar';
  public imagenCargada: string = 'Examinar';
  public TipoMolinete: number = 0;
  public editar: boolean = false;
  public openModal: boolean = true;
  public idImagen: number;
  public idCertificado: number;
  idlista: number;
  ngForm2 = FormGroup;
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

  get idTipoMolinete() {
    return this.formularioMolinete.get('idTipoMolinete');
  }
  get serie() {
    return this.formularioMolinete.get('serie');
  }
  get marca() {
    return this.formularioMolinete.get('marca');
  }

  get descripcion() {
    return this.formularioMolinete.get('descripcion');
  }
  get fechaCalibracion() {
    return this.formularioHelice.get('fechaUltimaCalibracion');
  }
  get fechaAdquisicion() {
    return this.formularioMolinete.get('fechaAdquisicion');
  }

  // Helices
  get serieHelice() {
    return this.formularioHelice.get('serieHelice');
  }
  get constanteM() {
    return this.formularioHelice.get('constanteM');
  }
  get constanteB() {
    return this.formularioHelice.get('constanteB');
  }
  get numeroRevolucionesMin() {
    return this.formularioHelice.get('numeroRevolucionesMin');
  }
  get numeroRevolucionesMax() {
    return this.formularioHelice.get('numeroRevolucionesMax');
  }
  get velocidadExpresadaMin() {
    return this.formularioHelice.get('velocidadExpresadaMin');
  }
  get velocidadExpresadaMax() {
    return this.formularioHelice.get('velocidadExpresadaMax');
  }

  constructor(
    private formBuilder: FormBuilder,
    private sanitizer: DomSanitizer,
    private serviciosDominiosValoresService: ServiciosDominiosValoresService,
    private serviciosMolineteService: ServiciosMolineteService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.crearFormulario();

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

    this.id = this.route.snapshot.paramMap.get('id')!;
    this.ac = this.route.snapshot.paramMap.get('ac')!;

    // Cargar Listas
    this.serviciosDominiosValoresService
    .obtenerValoresPorIdDominio(dominiosEnum.tipoMolinete)
    .subscribe((response) => {
      this.listaTipoMolinete = response;
    });
      
    this.serviciosDominiosValoresService
      .obtenerValoresPorIdDominio(dominiosEnum.FrecuenciasCalibracion)
      .subscribe((response) => {
        this.listaPeriodos = response;
      });

    if (this.id != '0') {
      this.obtenerMolinete();
    }
  }

  private obtenerMolinete() {
    let idParam: number = +this.id;
    this.serviciosMolineteService
      .obtenerPorId(idParam)
      .subscribe((response) => {
        console.log('llego molinete', response);
        this.formularioMolinete.setValue(response);

        if (response.idTipoMolinete == 505 || response.idTipoMolinete == 506) {
          this.serviciosMolineteService
            .obtenerHelicePorId(idParam)
            .subscribe((response) => {
              console.log('llegaron Helices', response);

              let objetohelice: any = [];

              for (let index = 0; index < response.length; index++) {
                const element = response[index];

                objetohelice.push({
                  idHelice: response[index].idHelice,
                  idMolinete: response[index].idMolinete,
                  molinete: response[index].molinete,
                  serieHelice: response[index].serieHelice,
                  fechaUltimaCalibracion: response[
                    index
                  ].fechaUltimaCalibracion.slice(0, -19),
                  observaciones: response[index].observaciones,
                  constanteM: response[index].constanteM,
                  constanteB: response[index].constanteB,
                  numeroRevolucionesMin: response[index].numeroRevolucionesMin,
                  numeroRevolucionesMax: response[index].numeroRevolucionesMax,
                  velocidadExpresadaMin: response[index].velocidadExpresadaMin,
                  velocidadExpresadaMax: response[index].velocidadExpresadaMax,
                  idPeriodoSugeridoCalibracion:
                    response[index].idPeriodoSugeridoCalibracion,
                  idImagen: response[index].idImagen,
                  imagen: response[index].imagen,
                  descripcionImagen: response[index].descripcionImagen,
                  idTipoArchivoImagen: response[index].idTipoArchivoImagen,
                  certificadoUltimaCalibracion:
                    response[index].certificadoUltimaCalibracion,
                  idCertificadoUltimaCalibracion: response[index].idCertificadoUltimaCalibracion,
                  descripcionCertificadoUltimaCalibracion:
                    response[index].descripcionCertificadoUltimaCalibracion,
                  idTipoArchivoCertificado:
                    response[index].idTipoArchivoCertificado,

                  flagMigracion: response[index].flagMigracion,
                  activo: estados.activo,
                });

                this.listaHelices = objetohelice;
              }

              // console.log('lista',this.listaHelices)
            });
        }
      });

    if (this.ac == 'V') {
      this.formularioMolinete.disable();
    }
  }

  private crearFormulario() {
    this.formularioMolinete = this.formBuilder.group({
      idMolinete: [''],
      idTipoMolinete: ['', Validators.required],
      serie: ['', Validators.required],
      marca: ['', Validators.required],
      fechaAdquisicion:  ['', Validators.required],
      descripcion: ['', Validators.required],
      // fechaUltimaCalibracion: ['', Validators.required],
      activo: [estados.activo],
      fechaCreacion: [''],
      idImagen: [''],
      fechaEstado: [''],
      fechaModificacion: [''],
      usuarioCreacion: [''],
      usuarioEstado: [''],
      usuarioModificacion: [''],
      identificacionMolinete: [''],
    });

    this.formularioHelice = this.formBuilder.group({
      idHelice: [],
      idMolinete: [''],
      molinete: [''],
      serieHelice: ['', Validators.required],
      fechaUltimaCalibracion: ['', Validators.required],
      observaciones: [''],
      constanteM: ['', Validators.required],
      constanteB: ['', Validators.required],
      numeroRevolucionesMin: ['', Validators.required],
      numeroRevolucionesMax: ['', Validators.required],
      velocidadExpresadaMin: ['', Validators.required],
      velocidadExpresadaMax: ['', Validators.required],
      idPeriodoSugeridoCalibracion: [''],
      idImagen: [''],
      imagen: [''],
      activo: [estados.activo],
      descripcionImagen: [''],
      idTipoArchivoImagen: [1],
      certificadoUltimaCalibracion: [''],
      idCertificadoUltimaCalibracion: [''],
      descripcionCertificadoUltimaCalibracion: [''],
      idTipoArchivoCertificado: [2],

      flagMigracion: [''],

      // flagCreacion: [''],
      // flagDelete: [''],
    });
  }
  guardar() {
    try {
      if (this.formularioMolinete.valid) {
        if (this.id === '0') {
          if (this.validarDatos()) {
            Swal.fire({
              title: 'Guardando...',
              html: 'Por favor espere',
              timer: 5000,
              timerProgressBar: true,
              didOpen: () => {
                Swal.showLoading();

                this.serviciosMolineteService
                  .crear(this.formularioMolinete.value)
                  .subscribe((response) => {
                    console.log('respuesta', response);

                    if (this.TipoMolinete == 505 || this.TipoMolinete == 506) {
                      for (
                        let index = 0;
                        index < this.listaHelices.length;
                        index++
                      ) {
                        this.listaHelices[index].idMolinete =
                          response.idMolinete;
                      }

                      console.log('guardando ', this.listaHelices);

                      this.serviciosMolineteService
                        .crearHelice(this.listaHelices)
                        .subscribe((response) => {
                          console.log('llego', response);
                          Swal.close();
                        });
                    } else {
                      Swal.close();
                    }
                  });
              },
              willClose: () => {
                this.toast.fire({
                  icon: 'success',
                  title: 'Se Creo el molinete  ',
                });

                this.router.navigate(['/configuracion/gestionMolinete']);
              },
            }).then((result) => {});
          } else {
            this.toast.fire({
              icon: 'info',
              title: 'Debe Ingresar almenos una Helice ',
            });
          }
        } else {
          if (this.validarDatos()) {
            Swal.fire({
              title: 'Actualizando...',
              html: 'Por favor espere',
              timer: 5000,
              timerProgressBar: true,
              didOpen: () => {
                Swal.showLoading();
                let lisActualizar: any = [];
                var lisCrear: any = [];
                this.serviciosMolineteService
                  .actualizar(this.formularioMolinete.value)
                  .subscribe((response) => {
                    // console.log('respuesta', response);
                    if (this.TipoMolinete == 505 || this.TipoMolinete == 506) {
                      for (
                        let index = 0;
                        index < this.listaHelices.length;
                        index++
                      ) {
                        this.listaHelices[index].idMolinete =
                          response.idMolinete;

                        if (this.listaHelices[index].idHelice == null) {
                          lisCrear.push(this.listaHelices[index]);
                        } else {
                          lisActualizar.push(this.listaHelices[index]);
                        }
                      }

                      // console.log('llego Helice Actualizada', lisActualizar);

                      if (lisCrear.length > 0) {
                        this.serviciosMolineteService
                          .crearHelice(lisCrear)
                          .subscribe((response) => {
                            //
                            console.log('llego Helice crear', response);
                          });
                      }

                      console.log('lista actualizar',lisActualizar)
                      this.serviciosMolineteService
                        .actualizarHelice(lisActualizar)
                        .subscribe((response) => {
                          console.log('llego Helice Actualizo', response);
                        });
                    }
                  });
              },
              willClose: () => {
                this.toast.fire({
                  icon: 'success',
                  title: 'Se Actualizo el molinete ',
                });

                 this.router.navigate(['/configuracion/gestionMolinete']);
              },
            }).then((result) => {});
          } else {
            this.toast.fire({
              icon: 'info',
              title: 'Debe Ingresar almenos una Helice ',
            });
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  public capturar(event: any, tipo: number): any {
    const archivoCapturado = event.target.files[0];

    console.log('event archivo', event.target);

    // this.previsualizacion = event.target.files[0];

    if (tipo == 1) {
      this.imagenCargada = event.target.files[0].name;
      this.extraerBase64(archivoCapturado).then((imagen: any) => {
        this.previsualizacion = imagen.base;
        // console.log(imagen);
      });
    } else {
      this.ArchivoCargado = event.target.files[0].name;
      this.extraerBase64(archivoCapturado).then((imagen: any) => {
        this.certificado = imagen.base;
        // console.log(imagen);
      });
    }
  }

  validarDatos(): any {
    if (this.TipoMolinete == 505 || this.TipoMolinete == 506) {
      if (this.listaHelices.length < 1) {
        return false;
      }
    }
    return true;
  }

  agregarlista() {
    // console.log('lista actual', this.formularioHelice.value);

    if (this.formularioHelice.valid) {
      if (this.editar) {
        this.editar = false;
        this.formularioHelice.value.imagen = this.previsualizacion;
        this.formularioHelice.value.descripcionImagen = this.imagenCargada;
        this.formularioHelice.value.certificadoUltimaCalibracion =
          this.certificado;
        this.formularioHelice.value.descripcionCertificadoUltimaCalibracion =
          this.ArchivoCargado;
        this.formularioHelice.value.activo = estados.activo;

        this.listaHelices[this.idlista] = this.formularioHelice.value;
        this.ModalMolinete.nativeElement.click();
        this.formularioHelice.reset();
        this.previsualizacion = '';
        this.imagenCargada = 'Examinar';
        this.certificado = '';
        this.ArchivoCargado = 'Examinar';
      } else {
        this.formularioHelice.value.imagen = this.previsualizacion;
        this.formularioHelice.value.descripcionImagen = this.imagenCargada;
        this.formularioHelice.value.certificadoUltimaCalibracion =
          this.certificado;
        this.formularioHelice.value.descripcionCertificadoUltimaCalibracion =
          this.ArchivoCargado;
        this.formularioHelice.value.idTipoArchivoImagen = 1;
        this.formularioHelice.value.idTipoArchivoCertificado = 2;
        this.formularioHelice.value.activo = estados.activo;
        this.listaHelices.push(this.formularioHelice.value);
        this.formularioHelice.reset();
        this.previsualizacion = '';
        this.imagenCargada = 'Examinar';
        this.certificado = '';
        this.ArchivoCargado = 'Examinar';

        this.ModalMolinete.nativeElement.click();
      }
    }
    // console.log('lista actual', this.listaHelices);
  }

  eliminarLista(id: any) {
    var i = this.listaHelices.indexOf(id);

    if (i !== -1) {
      this.listaHelices.splice(i, 1);
    }
  }

  cambiarEstado(id: any) {
    var i = this.listaHelices.indexOf(id);
    console.log('se Cambiando ', this.listaHelices[i]);
    if (this.listaHelices[i].activo == estados.activo) {
      this.listaHelices[i].activo = estados.inactivo;
    } else {
      this.listaHelices[i].activo = estados.activo;
    }
  }

  EditarLista(id: any) {
    // console.log('id', id);
    var i = this.listaHelices.indexOf(id);
    this.idlista = i;
    this.listaHelices[i].idTipoArchivoImagen = 1;
    this.listaHelices[i].idTipoArchivoCertificado = 2;
    this.formularioHelice.setValue(this.listaHelices[i]);
    this.previsualizacion = this.listaHelices[i].imagen;
    this.imagenCargada = this.listaHelices[i].descripcionImagen;
    this.ArchivoCargado =
      this.listaHelices[i].descripcionCertificadoUltimaCalibracion;

    // console.log('asigno', this.formularioHelice.value);
    this.editar = true;
  }

  extraerBase64 = async ($event: any) =>
    new Promise((resolve, reject) => {
      try {
        const unsafeImg = window.URL.createObjectURL($event);
        const image = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);
        const reader = new FileReader();
        reader.readAsDataURL($event);
        reader.onload = () => {
          resolve({
            base: reader.result,
          });
        };
        reader.onerror = (error) => {
          resolve({
            base: null,
          });
        };
      } catch (error) {
        resolve({
          base: null,
        });
      }
    });
}
