import { Component, OnInit } from '@angular/core';
import {FormBuilder,FormGroup,Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { estados } from 'src/app/common/utils/constantes';
import { ServiciosDominiosValoresService } from '../servicios-dominios-valores.service';
import { ServiciosDominiosService } from '../servicios-dominios.service';
import { accionesTablasEnum } from 'src/app/modelo/enum/acciones-tablas-enum';
import { IDominioValor } from 'src/app/modelo/configuracion/dominioValor';
import { MetodosGlobales } from 'src/app/common/utils/metodos-globales';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-guardar-dominios',
  templateUrl: './guardar-dominios.component.html',
})

export class GuardarDominiosComponent implements OnInit {
  public formularioDominio!: FormGroup;
  public formularioValoresDominio!: FormGroup;
  public id: string = '0';
  public ac: string = 'c';
  public idominio: number = 0;
  public NuevoValor: string;

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
  get dominio() {
    return this.formularioDominio.get('dominio');
  }
  get descripcion() {
    return this.formularioDominio.get('descripcion');
  }
  get fechaCreacion() {
    return this.formularioDominio.get('fechaCreacion');
  }
  get fechaModificacion() {
    return this.formularioDominio.get('fechaModificacion');
  }
  get usuarioCreacion() {
    return this.formularioDominio.get('usuarioCreacion');
  }
  get usuarioModificacion() {
    return this.formularioDominio.get('usuarioModificacion');
  }

  // Propiedades valores dominio
  get dominioValor() {
    return this.formularioValoresDominio.get('dominioValor');
  }
  get valorfechaCreacion() {
    return this.formularioValoresDominio.get('fechaCreacion');
  }
  get valorfechaModificacion() {
    return this.formularioValoresDominio.get('fechaModificacion');
  }
  get valorusuarioCreacion() {
    return this.formularioValoresDominio.get('usuarioCreacion');
  }
  get valorusuarioModificacion() {
    return this.formularioValoresDominio.get('usuarioModificacion');
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private serviciosDominiosService: ServiciosDominiosService,
    private serviciosDominiosValoresService: ServiciosDominiosValoresService
  ) {
    // Esto es intencional`
  }

  datosFilter = [] as any;

  // columbas de la tabla
  columnas = [
    {
      title: 'ID',
      data: 'idDominioValor',
      visible: false,
    },
    {
      title: 'Valor',
      data: 'dominioValor',
      class: 'text-center',
    },
    {
      title: 'Estado',
      data: 'activo',
      class: 'text-center',
    },
    {
      title: 'Creado',
      data: 'fechaCreacion',
      class: 'text-center',
      visible: false,
    },
    {
      title: 'Modificado',
      data: 'fechaModificacion',
      class: 'text-center',
      visible: false,
    },
    {
      title: 'fecha estado',
      data: 'fechaEstado',
      class: 'text-center',
      visible: false,
    },
    {
      title: 'fecha estado',
      data: 'idDominio',
      class: 'text-center',
      visible: false,
    },
  ];

  botonesGenerales =
    [
      {
        text: 'Agregar Valor',
        action: 'agregarValor',
        enabled: this.validarPermiso('CrearValorDominio'),
      }
    ];

  ngOnInit(): void {
    this.construirFormulario();

    this.id = this.route.snapshot.paramMap.get('id')!;
    this.ac = this.route.snapshot.paramMap.get('ac')!;
    if (this.id != '0') {
      let idParam: number = +this.id;
      this.serviciosDominiosService
        .obtenerPorId(idParam)
        .subscribe((response) => {
          this.formularioDominio.setValue(response);
          this.idominio = parseInt(this.id);
          this.obtenerValores(this.idominio);
        });
      if (this.ac != 'E') {
        this.formularioDominio.disable();
      }
    }
  }

  // Construccion de los formularios
  private construirFormulario() {
    this.formularioDominio = this.formBuilder.group({
      idDominio: [''],
      dominio: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      fechaCreacion: [''],
      fechaModificacion: [''],
      usuarioCreacion: [''],
      usuarioModificacion: [''],
    });

    this.formularioValoresDominio = this.formBuilder.group({
      idDominioValor: [''],
      idDominio: [''],
      activo: [estados.activo],
      dominioValor: ['', [Validators.required]],
      fechaCreacion: [''],
      fechaModificacion: [''],
      usuarioCreacion: [''],
      usuarioModificacion: [''],
    });
  }

  // guardar  dominio
  public guardar() {
    this.serviciosDominiosService
      .actualizar(this.formularioDominio.value)
      .subscribe((response) => {
        this.toast.fire({
          icon: 'success',
          title:
            'Dominio ' +
            this.formularioDominio.controls['dominio'].value +
            ', Actualizado exitosamente!',

        });
        this.router.navigate(['/configuracion/dominios']);
      });
  }

  //  obtener lista valores dominio
  public obtenerValores(iddominio: number) {
    this.serviciosDominiosValoresService
      .obtenerValorDominio(iddominio)
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
        title: 'sish-titulo-formulario'
      },
      buttonsStyling: false,
      title: 'Nuevo valor',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off',
      },
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        if (result.value != '') {
          this.crearValor(result);
        } else {
          this.toast.fire({
            icon: 'info',
            title:
              'Valor dominio No puede ser nulo',
          });

        }

      }
    });
  }

  // actividades de la tabla
  accionRegistro(e: any) {
    switch (e.accion) {
      case accionesTablasEnum.Activar: {
        let valorDominio: IDominioValor = e.registro;
        valorDominio.activo = estados.activo;
        this.actualizar(valorDominio);
        //statements;
        break;
      }
      case accionesTablasEnum.Inactivar: {
        let valorDominio: IDominioValor = e.registro;
        valorDominio.activo = estados.inactivo;
        if (this.validarReglas()) {
          this.actualizar(valorDominio);
        } else {
          this.toast.fire({
            icon: 'info',
            title:
              'El  dominio debe contar con almenos un valor activo',
          });
        }
        break;
      }
      default: {
        //statements;
        break;
      }
    }
  }

  accionGeneral(e: any) {
    this.agregarValor();
  }

  //Crea un nuevo valor
  crearValor(result: any) {
    const dominioValor: IDominioValor = {
      idDominio: this.idominio,
      activo: estados.activo,
      dominioValor: result.value,
      idDominioValor: 0,
      fechaCreacion: '',
      fechaModificacion: '',
      usuarioCreacion: '',
      usuarioModificacion: ''
    }

    this.serviciosDominiosValoresService
      .crear(dominioValor)
      .subscribe((response) => {
        this.toast.fire({
          icon: 'success',
          title:
            'Valor dominio ' +
            response.dominioValor +
            ', creado exitosamente!',
        });
        this.obtenerValores(this.idominio);
      });
  }

  // actualizar valor dominio
  actualizar(valorDominio: IDominioValor) {
    this.serviciosDominiosValoresService
      .actualizar(valorDominio)
      .subscribe((response) => {
        this.obtenerValores(this.idominio);
      });
  }

  validarReglas() {
    let cantidadInactivos = 0

    for (let index = 0; index < this.datosFilter.length; index++) {
      const element = this.datosFilter[index];

      if (this.datosFilter[index].activo == "N") {
        cantidadInactivos++
      }

    }

    console.log('cantidad inactivos', cantidadInactivos)
    console.log('cantidad data', this.datosFilter.length)

    if (cantidadInactivos == this.datosFilter.length) {
      return false
    }

    return true;
  }

  // Validacion de permisos 
  public validarPermiso(permiso: any): boolean {
    return MetodosGlobales.validarPermiso(permiso);
  }
}
