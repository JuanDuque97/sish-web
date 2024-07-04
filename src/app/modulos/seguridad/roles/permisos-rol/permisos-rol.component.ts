import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { ServiciosRolesService } from '../servicios-roles.service';
import { ServiciosPermisosRolesService } from '../servicios-permisos-roles.service';
import { ServiciosPermisos } from '../../permisos/servicios-permisos.service';
import { IPermisoXRol } from 'src/app/modelo/seguridad/rol';
import { accionesTablasEnum } from 'src/app/modelo/enum/acciones-tablas-enum';

@Component({
  selector: 'app-permisos-rol',
  templateUrl: './permisos-rol.component.html',
})

export class PermisosRolComponent implements OnInit {
  public id: string = '0';
  public formularioRol!: FormGroup;
  public formularioPermisos!: FormGroup;
  public listpermisos: any[];
  datosFilter = [] as any;

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
      data: 'idPermiso',
      visible: false,
      filterValueMin: '',
      filterValueMax: '',
      tipo: 'rangoNumero',
    },
    {
      title: 'Permiso',
      data: 'permiso',
      class: 'text-center',
      filter: true,
      filterValue: '',
      tipo: 'texto',
    },
    {
      title: 'Descripción',
      data: 'descripcionPermiso',
      class: 'text-center',
      filter: true,
      filterValue: '',
      tipo: 'texto',
    },
    {
      title: 'Estado',
      data: 'activoPermiso',
      class: 'text-center',
      filter: true,
      filterValue: '',
      tipo: 'seleccion',
    },
  ];

  botonesGenerales = [
    {
      text: 'Agregar Permiso',
      action: 'agregarValor',
    },
  ];

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private serviciosRolesService: ServiciosRolesService,
    private serviciosPermisosRolesService: ServiciosPermisosRolesService,
    private serviciosPermisos: ServiciosPermisos
  ) {}

  ngOnInit(): void {
    this.construirFormulario();

    this.id = this.route.snapshot.paramMap.get('id')!;

    if (this.id != '0') {
      let idRol: number = +this.id;

      Swal.fire({
        title: 'Cargando información...',
        html: 'Por favor espere',
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: async () => {
          Swal.showLoading();

          this.serviciosRolesService.obtenerPorId(idRol).subscribe((response) => {
            this.formularioRol.setValue(response);
            this.formularioRol.disable();
            Swal.close();

            this.obtenerListaPermiso(+this.id, () => {
              this.obtenerListaPermisosXrol(() => {});  
            });
          });
        }, 
        willClose: async () => {
          Swal.hideLoading();
        }
      });
    }
  }

  accionGeneral(e: any) {
    this.agregarValor();
  }

  accionRegistro(e: any) {
    switch (e.accion) {
      case accionesTablasEnum.Eliminar: {
        let permisoXRol: IPermisoXRol = e.registro;
        this.eliminar(permisoXRol.idPermisoXRol);
        break;
      }
    }
  }

  private construirFormulario() {
    this.formularioRol = this.formBuilder.group({
      idRol: [''],
      rol: [''],
      descripcion: [''],
      activo: [''],
      fechaCreacion: [''],
      fechaModificacion: [''],
      fechaEstado: [''],
      usuarioCreacion: [''],
      usuarioModificacion: [''],
      usuarioEstado: [''],
    });
  }

  public obtenerListaPermisosXrol(callback : Function) {
    let idRol: number = +this.id;

    Swal.fire({
      title: 'Cargando información...',
      html: 'Por favor espere',
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: async () => {
        Swal.showLoading();

        this.serviciosPermisosRolesService.obtenerListaPermisosXRolId(idRol).subscribe((response) => {
          this.datosFilter = response;

          this.datosFilter.forEach( (dato : any) => {
            dato.activoPermiso = dato.activoPermiso==='S' ? 'Sí' : 'No';
          });

          Swal.close();
          callback();
        });
      }, 
      willClose: async () => {
        Swal.hideLoading();
      }
    });
  }

  obtenerListaPermiso(idRol : number, callback : Function) {
    Swal.fire({
      title: 'Cargando información...',
      html: 'Por favor espere',
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: async () => {
        Swal.showLoading();

        this.serviciosPermisos.obtenerPermisosFaltantes(idRol).subscribe((responde) => {
        //this.serviciosPermisos.obtenerListaPermisos().subscribe((responde) => {
          this.listpermisos = responde;

          Swal.close();
          callback();
        });
      }, 
      willClose: async () => {
        Swal.hideLoading();
      }
    });
  }

  agregarValor() {
    Swal.fire({
      customClass: {
        confirmButton: 'sish-boton-confirmar',
        cancelButton: 'sish-boton-cancelar',
        input: 'sish-popup-input',
        title: 'sish-titulo-formulario',
      },
      buttonsStyling: false,
      title: 'Nuevo Permiso',
      input: 'select',
      inputOptions: this.listpermisos,
      showCancelButton: true,
      inputPlaceholder: 'seleccione un permiso...',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.agregarPermiso(result);
      }
    });
  }

  eliminar(id: number) {
    Swal.fire({
      title: 'Cargando información...',
      html: 'Por favor espere',
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: async () => {
        Swal.showLoading();

        this.serviciosPermisosRolesService.eliminar(id).subscribe((response) => {
          this.toast.fire({
            icon: 'success',
            title: 'El Permiso a sido eliminado exitosamente!',
          });

          Swal.close();
          this.obtenerListaPermiso(+this.id, () => {
            this.obtenerListaPermisosXrol(() => {});
          });
        });
      },
      willClose: async () => {
        Swal.hideLoading();
      }
    });
  }

  public agregarPermiso(result: any) {
    const permisoXRol: IPermisoXRol = {
      idPermisoXRol: 0,
      idPermiso: result.value,
      idRol: parseInt(this.id),
    };

    Swal.fire({
      title: 'Cargando información...',
      html: 'Por favor espere',
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: async () => {
        Swal.showLoading();

        this.serviciosPermisosRolesService.crear(permisoXRol).subscribe((response) => {
          this.toast.fire({
            icon: 'success',
            title: 'El Parámetro fue agregado creado exitosamente!',
          });

          Swal.close();
          this.obtenerListaPermiso(+this.id, () => {
            this.obtenerListaPermisosXrol(() => {});  
          });
      });

      }, 
      willClose: async () => {
        Swal.hideLoading();
      }
    });
  }
}
