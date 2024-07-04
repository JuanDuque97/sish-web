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
import { ServiciosRolesService } from '../servicios-roles.service';

@Component({
  selector: 'app-guardar-roles',
  templateUrl: './guardar-roles.component.html',
})

export class GuardarRolesComponent implements OnInit {

  // Variables Globales
  public formularioRol!: FormGroup;

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
    },
  });

  // Propiedades del Formulario
  get rol() {
    return this.formularioRol.get('rol');
  }
  get descripcion() {
    return this.formularioRol.get('descripcion');
  }
  get activo() {
    return this.formularioRol.get('activo');
  }
  get fechaCreacion() {
    return this.formularioRol.get('fechaCreacion');
  }
  get fechaModificacion() {
    return this.formularioRol.get('fechaModificacion');
  }
  get fechaEstado() {
    return this.formularioRol.get('fechaEstado');
  }
  get usuarioCreacion() {
    return this.formularioRol.get('usuarioCreacion');
  }
  get usuarioModificacion() {
    return this.formularioRol.get('usuarioModificacion');
  }
  get usuarioEstado() {
    return this.formularioRol.get('usuarioEstado');
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private serviciosRolesService: ServiciosRolesService,
  ) {

  }

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
        this.serviciosRolesService.obtenerPorId(idParam).subscribe((response) => {
          this.formularioRol.setValue(response);

          Swal.close();
        });
      }, 
      willClose: async() => {
        Swal.hideLoading();
      }
    });
  }

  private construirFormulario() {
    this.formularioRol = this.formBuilder.group({
      idRol: new FormControl(''),
      rol: new FormControl('', [Validators.required]),
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
    if ( !this.formularioRol.valid ) {
      return;
    }

    Swal.fire({
      title: 'Guardando...',
      html: 'Por favor espere',
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: async () => {
        Swal.showLoading();

        try {
          if (this.id === '0') {
            this.serviciosRolesService.crear(this.formularioRol.value).subscribe((response) => {
                this.toast.fire({
                  icon: 'success',
                  title: 'Rol ' + response.rol + ', creado exitosamente!',
                });
                Swal.close();

                this.router.navigate(['/configuracion/seguridad/roles']);
              });
          } else {
            this.serviciosRolesService.actualizar(this.formularioRol.value).subscribe((response) => {
                this.toast.fire({
                  icon: 'success',
                  title: 'Rol ' + response.rol + ', actualizado exitosamente!',
                });
                Swal.close();

                this.router.navigate(['/configuracion/seguridad/roles']);
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
