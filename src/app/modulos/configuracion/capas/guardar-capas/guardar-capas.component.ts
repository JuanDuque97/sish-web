import { Component, OnInit } from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ServiciosCapasService } from '../servicios-capas.service';
import { capasEnum } from '../../../../modelo/enum/capas-enum';
@Component({
  selector: 'app-guardar-capas',
  templateUrl: './guardar-capas.component.html',
})


export class GuardarCapasComponent implements OnInit {
  public formularioCapas!: FormGroup;
  public id: string = '0';
  public ac: string = 'C';

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
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private serviciosCapasService: ServiciosCapasService
  ) { }

  ngOnInit(): void {
 


    this.construirFormulario();
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.ac = this.route.snapshot.paramMap.get('ac')!; 

    if (this.id != '0') {
      let idPCapa: number = +this.id;
      this.serviciosCapasService.obtenerPorId(idPCapa).subscribe((response) => { 
        this.formularioCapas.setValue(response);
      });

      if (this.ac == 'V') {
        this.formularioCapas.disable();
      }
    }
  }

  private construirFormulario() {
    this.formularioCapas = this.formBuilder.group({
      capa: [''],
      fechaCreacion: [''],
      fechaModificacion: [''],
      idCapa: [''],
      identificador: [''],
      nombreServicio: [''],
      urlActualizar: [''],
      urlBorrar: [''],
      urlConsulta: [''],
      urlCrear: [''],
      urlVisualizar: [''],
      usuarioCreacion: [''],
      usuarioModificacion: [''],
    });
  }

  guardar() {
    try {
      if (this.formularioCapas.valid) {
        if (this.id === '0') {
          // this.serviciosCapasService
          //   .crear(this.formularioParametros.value)
          //   .subscribe((response) => {
          //     this.toast.fire({
          //       icon: 'success',
          //       title:
          //         'la Capa ' + response.Capa + ', creado exitosamente!',
          //     });
          //     this.router.navigate(['/configuracion/capas']);
          //   });
        } else {
          this.serviciosCapasService
            .actualizar(this.formularioCapas.value)
            .subscribe((response) => {
              this.toast.fire({
                icon: 'success',
                title:
                  'la Capa ' +
                  response.capa +
                  ', actualizado exitosamente!',
              });
              this.router.navigate(['/configuracion/capas']);
            });
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
}
