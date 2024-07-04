import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { estadosVector } from 'src/app/common/utils/constantes';
import Swal from 'sweetalert2';
import { ServiciosPermisos } from '../servicios-permisos.service';

@Component({
  selector: 'app-guardar-permisos',
  templateUrl: './guardar-permisos.component.html',
})

export class GuardarPermisosComponent implements OnInit {

  // Variables globales
  public formularioPermiso!: FormGroup;

  public id: string = '0';

  public estados = estadosVector;

  private toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
  });

  // Propiedades del Formulario
  get roles() {
    return this.formularioPermiso.get('roles');
  }
  get permiso() {
    return this.formularioPermiso.get('permiso');
  }
  get descripcion() {
    return this.formularioPermiso.get('descripcion');
  }
  get activo() {
    return this.formularioPermiso.get('activo');
  }
  get fechaCreacion() {
    return this.formularioPermiso.get('fechaCreacion');
  }
  get fechaModificacion() {
    return this.formularioPermiso.get('fechaModificacion');
  }
  get fechaEstado() {
    return this.formularioPermiso.get('fechaEstado');
  }
  get usuarioCreacion() {
    return this.formularioPermiso.get('usuarioCreacion');
  }
  get usuarioModificacion() {
    return this.formularioPermiso.get('usuarioModificacion');
  }
  get usuarioEstado() {
    return this.formularioPermiso.get('usuarioEstado');
  }

  // Constructor
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private serviciosPermisosService: ServiciosPermisos,
  ) {

  }

  // Handler for onInit event...
  ngOnInit(): void {
    this.construirFormulario();

    this.id = this.route.snapshot.paramMap.get('id')!;

    if ( this.id != '0' ) {
      this.cargarDatos();
    }
  }

  private cargarDatos() {
    Swal.fire({
      title: 'Cargando información...',
      html: 'Por favor espere',
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: async () => {
        Swal.showLoading();

        let idParam: number = +this.id;
        this.serviciosPermisosService.obtenerDTOPorId(idParam).subscribe((response) => {
          this.formularioPermiso.setValue(response);

          Swal.close();
        });
      }, 
      willClose: async => {
        Swal.hideLoading();
      }
    });
  }

  private construirFormulario() {
    this.formularioPermiso = this.formBuilder.group({
      idPermiso: new FormControl(''),
      permiso: new FormControl('', [Validators.required]),
      descripcion: new FormControl('', [Validators.required]),
      activo: new FormControl('', [Validators.required]),
      fechaCreacion: new FormControl(''),
      fechaModificacion: new FormControl(''),
      fechaEstado: new FormControl(''),
      usuarioCreacion: new FormControl(''),
      usuarioModificacion: new FormControl(''),
      usuarioEstado: new FormControl(''),
    });
  }

  public guardar() {
    if ( !this.formularioPermiso.valid ) {
      return;
    }

    Swal.fire({
      title: 'Guardando...',
      html: 'Por favor espere',
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: async() => {
        Swal.showLoading();

        try {
          if (this.id === '0') {
            this.serviciosPermisosService.crear(this.formularioPermiso.value).subscribe((response) => {
                this.toast.fire({
                  icon: 'success',
                  title: 'Permiso ' + response.permiso + ', creado exitosamente!',
                });
                Swal.close();
                this.router.navigate(['/configuracion/seguridad/permisos']);
              });
          } else {
            this.serviciosPermisosService.actualizar(this.formularioPermiso.value).subscribe((response) => {
                this.toast.fire({
                  icon: 'success',
                  title: 'Permiso ' + response.permiso + ', actualizado exitosamente!',
                });
                Swal.close();
                this.router.navigate(['/configuracion/seguridad/permisos']);
              });
          }
        } catch (error) {
          Swal.close();
          console.error(error);
        }
      }, 
      willClose: async() => {
        Swal.hideLoading();
      }
    });    
  }
}
