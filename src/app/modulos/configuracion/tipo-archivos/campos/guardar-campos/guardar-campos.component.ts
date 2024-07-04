import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { dominiosEnum } from 'src/app/modelo/enum/dominios-enum';
import Swal from 'sweetalert2';
import { ServiciosDominiosValoresService } from '../../../dominios/servicios-dominios-valores.service';
import { ServiciosParametrosService } from '../../../../parametros/servicios-parametros.service';
import { ServiciosArchivoCampos } from '../../servicios-archivo-campos.service';
import { ServiciosArchivoColumnas } from '../../servicios-archivo-columnas.service';

@Component({
  selector: 'app-guardar-campos',
  templateUrl: './guardar-campos.component.html',
})
export class GuardarCamposComponent implements OnInit {
  public formularioArchivoCampos!: FormGroup;
  public id: string = '0';
  public ac: string = 'c';
  public ta: string = '0';
  public rutacancelar = '';

  public listparametro: any[] = [];

  public listTipoArchivoColumna: any[] = [];
  public listTipoColumnaPropiedad: any[] = [];

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
    private serviciosArchivoCampos: ServiciosArchivoCampos,
    private serviciosParametrosService: ServiciosParametrosService,
    private serviciosArchivoColumnas: ServiciosArchivoColumnas
  ) {}

  get campoRelacionado() {
    return this.formularioArchivoCampos.get('campoRelacionado');
  }
  get codigoPropiedad() {
    return this.formularioArchivoCampos.get('codigoPropiedad');
  }
  get idParametro() {
    return this.formularioArchivoCampos.get('idParametro');
  }
  get idTipoArchivoColumna() {
    return this.formularioArchivoCampos.get('idTipoArchivoColumna');
  }
  get idTipoArchivoColumnaPropiedad() {
    return this.formularioArchivoCampos.get('idTipoArchivoColumnaPropiedad');
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.ac = this.route.snapshot.paramMap.get('ac')!;
    this.ta = this.route.snapshot.paramMap.get('ta')!;
    let idArchivoConfigurado: number = +this.ta;
    this.construirFormulario();

    this.rutacancelar = '/configuracion/tipoarchivos/configurados/V/' + this.ta;

    //  lista de parametros
    this.serviciosParametrosService
      .obtenerValoresParametrosSelect2()
      .subscribe((response) => {
        this.listparametro = response;
      });

    this.serviciosArchivoColumnas
      .obtenerColumnasSelect2(idArchivoConfigurado)
      .subscribe((response) => {
        this.listTipoArchivoColumna = response;
      });

    this.serviciosArchivoColumnas
      .obtenerColumnasSelect2(idArchivoConfigurado)
      .subscribe((response) => {
        this.listTipoColumnaPropiedad = response;
      });

    if (this.id != '0') {
      let idArchivo: number = +this.id;
      this.serviciosArchivoCampos
        .obtenerPorId(idArchivo)
        .subscribe((response) => {
          
          this.formularioArchivoCampos.setValue(response);
        });

      if (this.ac == 'V') {
        this.formularioArchivoCampos.disable();
      }
    }
  }

  private construirFormulario() {
    this.formularioArchivoCampos = this.formBuilder.group({
      idTipoArchivoCampo: [''],
      idTipoArchivoConfigurado: [this.ta],
      campoRelacionado: ['', Validators.required],
      codigoPropiedad: ['', Validators.required],
      idParametro: ['', Validators.required],
      idTipoArchivoColumna: ['', Validators.required],
      idTipoArchivoColumnaPropiedad: ['', Validators.required],
    });
  }

  guardar() {
    try {
      if (this.formularioArchivoCampos.valid) {
        if (this.id === '0') {
          this.serviciosArchivoCampos
            .crear(this.formularioArchivoCampos.value)
            .subscribe((response) => {
              this.toast.fire({
                icon: 'success',
                title:
                  'El Campo ' +
                  response.campoRelacionado +
                  ', creado exitosamente!',
              });
              this.router.navigate([this.rutacancelar]);
            });
        } else {
          this.serviciosArchivoCampos
            .actualizar(this.formularioArchivoCampos.value)
            .subscribe((response) => {
              this.toast.fire({
                icon: 'success',
                title:
                  'El Campo ' +
                  response.campoRelacionado +
                  ', actualizado exitosamente!',
              });
              this.router.navigate([this.rutacancelar]);
            });
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
}
