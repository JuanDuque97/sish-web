import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { dominiosEnum } from 'src/app/modelo/enum/dominios-enum';
import Swal from 'sweetalert2';
import { ServiciosDominiosValoresService } from '../../../dominios/servicios-dominios-valores.service';
import { ServiciosArchivoConfigurado } from '../servicios-archivo-configurado.service';
import {
  ConfirmacionVector,
  estados,
} from '../../../../../common/utils/constantes'; 

@Component({
  selector: 'app-guardar-configurados',
  templateUrl: './guardar-configurados.component.html',
})
export class GuardarConfiguradosComponent implements OnInit {
  public formularioArchivoConfigurados!: FormGroup;
  public id: string = '0';
  public ac: string = 'c';
  public listTipoArchivo: [];
  public listTipoFraccionamiento: [];
  public listUbicacionDatos: [];
  public listTipoCodificacion: [];
  public listfrecuencias: [];
  public listEstados = ConfirmacionVector;


  rutaGeneralCampos: string;
  rutaConsultaCampos: string;
  rutaEdicionCampos: string;

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
  get tipoArchivoConfigurado() {
    return this.formularioArchivoConfigurados.get('tipoArchivoConfigurado');
  }
  get idTipoArchivo() {
    return this.formularioArchivoConfigurados.get('idTipoArchivo');
  }
  get idTipoFraccionamiento() {
    return this.formularioArchivoConfigurados.get('idTipoFraccionamiento');
  }
  get separador() {
    return this.formularioArchivoConfigurados.get('separador');
  }
  get calificadorTexto() {
    return this.formularioArchivoConfigurados.get('calificadorTexto');
  }
  get contieneEncabezado() {
    return this.formularioArchivoConfigurados.get('contieneEncabezado');
  }
  get contieneResumen() {
    return this.formularioArchivoConfigurados.get('contieneResumen');
  }
  get separadorDecimal() {
    return this.formularioArchivoConfigurados.get('separadorDecimal');
  }
  get intervaloFrecuenciaTemporal() {
    return this.formularioArchivoConfigurados.get(
      'intervaloFrecuenciaTemporal'
    );
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private serviciosDominiosValoresService: ServiciosDominiosValoresService,
    private serviciosArchivoConfigurado: ServiciosArchivoConfigurado, 
  ) {}
  ngOnInit(): void {
    this.construirFormulario();
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.ac = this.route.snapshot.paramMap.get('ac')!;

    if (this.ac != 'C') {
      //  Tipo Archivo
      this.serviciosDominiosValoresService
        .obtenerValoresPorIdDominio(dominiosEnum.TipoArchivo)
        .subscribe((response) => {
          this.listTipoArchivo = response;
        });

      // Tipo Fraccionamiento
      this.serviciosDominiosValoresService
        .obtenerValoresPorIdDominio(dominiosEnum.TipoFraccionamientoArchvios)
        .subscribe((response) => {
          this.listTipoFraccionamiento = response;
        });

      this.serviciosDominiosValoresService
        .obtenerValoresPorIdDominio(dominiosEnum.UbicacionDatos)
        .subscribe((response) => {
          this.listUbicacionDatos = response;
        });

      this.serviciosDominiosValoresService
        .obtenerValoresPorIdDominio(dominiosEnum.CodificacíonDatos)
        .subscribe((response) => {
          this.listTipoCodificacion = response;
        });
      this.serviciosDominiosValoresService
        .obtenerValoresPorIdDominio(dominiosEnum.FrecuenciasTemporales)
        .subscribe((response) => {
          this.listfrecuencias = response;
        });
    } else {
      //  Tipo Archivo
      this.serviciosDominiosValoresService
        .obtenerValoresActivosPorIdDominio(dominiosEnum.TipoArchivo)
        .subscribe((response) => {
          this.listTipoArchivo = response;
        });

      // Tipo Fraccionamiento
      this.serviciosDominiosValoresService
        .obtenerValoresActivosPorIdDominio(
          dominiosEnum.TipoFraccionamientoArchvios
        )
        .subscribe((response) => {
          this.listTipoFraccionamiento = response;
        });

      this.serviciosDominiosValoresService
        .obtenerValoresActivosPorIdDominio(dominiosEnum.UbicacionDatos)
        .subscribe((response) => {
          this.listUbicacionDatos = response;
        });

      this.serviciosDominiosValoresService
        .obtenerValoresActivosPorIdDominio(dominiosEnum.CodificacíonDatos)
        .subscribe((response) => {
          this.listTipoCodificacion = response;
        });
      this.serviciosDominiosValoresService
        .obtenerValoresActivosPorIdDominio(dominiosEnum.FrecuenciasTemporales)
        .subscribe((response) => {
          this.listfrecuencias = response;
        });
    }

    if (this.id != '0') {
      let idArchivo: number = +this.id;
      this.serviciosArchivoConfigurado
        .obtenerPorId(idArchivo)
        .subscribe((response) => {
          this.formularioArchivoConfigurados.setValue(response);
        });
 
      if (this.ac == 'V') {
        this.formularioArchivoConfigurados.disable();
      }
    }
    
  }

  private construirFormulario() {
    this.formularioArchivoConfigurados = this.formBuilder.group({
      idTipoArchivoConfigurado: [''],
      tipoArchivoConfigurado: ['', [Validators.required]],
      idTipoArchivo: ['', [Validators.required]],
      idTipoFraccionamiento: ['', [Validators.required]],
      idUbicacionDatos: [''],
      separador: ['', [Validators.required]],
      calificadorTexto: ['', [Validators.required]],
      contieneEncabezado: ['', [Validators.required]],
      contieneResumen: ['', [Validators.required]],
      separadorDecimal: ['', [Validators.required]],
      idFrecuenciaTemporal: [''],
      intervaloFrecuenciaTemporal: ['', [Validators.required]],
      idTipoCodificacion: [''],
      activo: [estados.activo],
      fechaCreacion: [''],
      fechaEstado: [''],
      fechaModificacion: [''],
      usuarioCreacion: [''],
      usuarioEstado: [''],
      usuarioModificacion: [''],
    });
  }

  guardar() { 
    try {
      if (this.formularioArchivoConfigurados.valid) {
        if (this.id === '0') {
          this.serviciosArchivoConfigurado
            .crear(this.formularioArchivoConfigurados.value)
            .subscribe((response) => {
              this.toast.fire({
                icon: 'success',
                title:
                  'Archivo ' +
                  response.tipoarchivoconfigurado +
                  ', creado exitosamente!',
              });
              this.router.navigate([
                '/configuracion/tipoarchivos/configurados',
              ]);
            });
        } else {
          this.serviciosArchivoConfigurado
            .actualizar(this.formularioArchivoConfigurados.value)
            .subscribe((response) => {
              this.toast.fire({
                icon: 'success',
                title:
                  'Archivo ' +
                  response.tipoarchivoconfigurado +
                  ', actualizado exitosamente!',
              });
              this.router.navigate([
                '/configuracion/tipoarchivos/configurados',
              ]);
            });
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  
  
}
