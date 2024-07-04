import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { dominiosEnum } from 'src/app/modelo/enum/dominios-enum';
import Swal from 'sweetalert2';
import { ServiciosDominiosValoresService } from '../../../dominios/servicios-dominios-valores.service';
import { ServiciosArchivoColumnas } from '../../servicios-archivo-columnas.service';

@Component({
  selector: 'app-guardar-columnas',
  templateUrl: './guardar-columnas.component.html',
})
export class GuardarColumnasComponent implements OnInit {
  public formularioArchivoColumnas!: FormGroup;
  public id: string = '0';
  public ac: string = 'c';
  public ta: string = '0';
  public rutacancelar = '';
  public listTipoDato: [];
  public listTipoContenido: [];

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
    private serviciosDominiosValoresService: ServiciosDominiosValoresService,
    private serviciosArchivoColumnas :ServiciosArchivoColumnas
  ) {}


  get formatoDestino(){return this.formularioArchivoColumnas.get('formatoDestino')};
  get formatoOrigen(){return this.formularioArchivoColumnas.get('formatoOrigen')};
  get idTipoContenido(){return this.formularioArchivoColumnas.get('idTipoContenido')};
  get idTipoDato(){return this.formularioArchivoColumnas.get('idTipoDato')};
  get numeroColumna(){return this.formularioArchivoColumnas.get('numeroColumna')};
  get posicionFinal(){return this.formularioArchivoColumnas.get('posicionFinal')};
  get posicionInicial(){return this.formularioArchivoColumnas.get('posicionInicial')};
  get separador(){return this.formularioArchivoColumnas.get('separador')};
  get tipoArchivosColumna(){return this.formularioArchivoColumnas.get('tipoArchivosColumna')};


  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.ac = this.route.snapshot.paramMap.get('ac')!;
    this.ta = this.route.snapshot.paramMap.get('ta')!;
    this.construirFormulario();

this.rutacancelar ='/configuracion/tipoarchivos/configurados/V/'+this.ta;

    if (this.ac != 'C') {
      // Tipos
      this.serviciosDominiosValoresService
        .obtenerValoresPorIdDominio(dominiosEnum.TipoDato)
        .subscribe((response) => {
          this.listTipoDato = response;
        });

      this.serviciosDominiosValoresService
        .obtenerValoresPorIdDominio(dominiosEnum.TipoContenido)
        .subscribe((response) => {
          this.listTipoContenido = response;
        });
    } else {
      // Tipos
      this.serviciosDominiosValoresService
        .obtenerValoresActivosPorIdDominio(dominiosEnum.TipoDato)
        .subscribe((response) => {
          this.listTipoDato = response;
        });
      this.serviciosDominiosValoresService
        .obtenerValoresActivosPorIdDominio(dominiosEnum.TipoContenido)
        .subscribe((response) => {
          this.listTipoContenido = response;
        });
    }
    if (this.id != '0') {
      let idArchivo: number = +this.id;
      this.serviciosArchivoColumnas
        .obtenerPorId(idArchivo)
        .subscribe((response) => {
          this.formularioArchivoColumnas.setValue(response);
        });

     
      if (this.ac == 'V') {
        this.formularioArchivoColumnas.disable();
      }
    }


  }

  private construirFormulario() {
    this.formularioArchivoColumnas = this.formBuilder.group({
      idTipoArchivoConfigurado: [this.ta],
      idTipoArchivoColumna: [''],
      formatoDestino: ['',Validators.required],
      formatoOrigen: ['',Validators.required],
      idTipoContenido: ['',Validators.required],
      idTipoDato: ['',Validators.required],
      numeroColumna: ['',Validators.required],
      posicionFinal: [''],
      posicionInicial: [''],
      separador: [''],
      tipoArchivosColumna: ['',Validators.required],
    });
  }

  guardar() { 
    try {
      if (this.formularioArchivoColumnas.valid) {
        if (this.id === '0') {
          this.serviciosArchivoColumnas
            .crear(this.formularioArchivoColumnas.value)
            .subscribe((response) => { 
              this.toast.fire({
                icon: 'success',
                title:
                  'Columnas ' + response.tipoArchivosColumna + ', creado exitosamente!',
              });
              this.router.navigate([this.rutacancelar]);
            });
        } else {
          this.serviciosArchivoColumnas
            .actualizar(this.formularioArchivoColumnas.value)
            .subscribe((response) => {
              this.toast.fire({
                icon: 'success',
                title:
                  'la Columnas ' +
                  response.tipoArchivosColumna +
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
