import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { dominiosEnum } from 'src/app/modelo/enum/dominios-enum';
import Swal from 'sweetalert2';
import { ServiciosDominiosValoresService } from '../../configuracion/dominios/servicios-dominios-valores.service';
import { ServiciosParametrosService } from '../servicios-parametros.service';
import { estadosVector } from 'src/app/common/utils/constantes';

@Component({
  selector: 'app-guardar-parametros',
  templateUrl: './guardar-parametros.component.html',
})


export class GuardarParametrosComponent implements OnInit {
  // Variables Glovales
  public formularioParametros!: FormGroup;
  public id: string = '0';
  public ac: string = 'c';
  origen = 1;
  tipoSelected: any;
  public listParametro: any[] = [];
  public listParametroOrgin: any[] = [];
  public listEstados = estadosVector;
  public listTipos:any = [];
  parametro1 :any;
  public listMetodos = [];
  public listUnidadesMedidad = [];
  public listVariables = [];
  public listPeriodos = [];
  public listaCategorias = [];
  bloquear: boolean = false;

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
  get codigo() {
    return this.formularioParametros.get('codigo');
  }
  get codigoOrigen() {
    return this.formularioParametros.get('codigoOrigen');
  }
  get parametro() {
    return this.formularioParametros.get('idVariable');
  }
  get idUnidadMedida() {
    return this.formularioParametros.get('idUnidadMedida');
  }
  get idParametro() {
    return this.formularioParametros.get('idParametro');
  }
  get idTipoParametro() {
    return this.formularioParametros.get('idTipoParametro');
  }
  get idMetodo() {
    return this.formularioParametros.get('idMetodo');
  }
  get activo() {
    return this.formularioParametros.get('activo');
  }
  get idCategoria() {
    return this.formularioParametros.get('idCategoria');
  }
  get descripcion() {
    return this.formularioParametros.get('descripcion');
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private serviciosParametrosService: ServiciosParametrosService,
    private serviciosDominiosValoresService: ServiciosDominiosValoresService
  ) {
    // Esto es intencional
  }

  // Listas

  ngOnInit(): void { 

    this.serviciosParametrosService
    .obtenerValoresOrigen()
    .subscribe((response) => {
      this.listParametro = response;
    });


    this.construirFormulario();
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.ac = this.route.snapshot.paramMap.get('ac')!;
    //  Llamado de las Listas
    if (this.ac != 'C') {
      // Tipos
      this.serviciosDominiosValoresService
        .obtenerValoresPorIdDominio(dominiosEnum.TipoParametros)
        .subscribe((response) => {
          this.listTipos = response;
        });

           // Categoria
      this.serviciosDominiosValoresService
      .obtenerValoresPorIdDominio(dominiosEnum.CategoriasEstacion)
      .subscribe((response) => {
        this.listaCategorias = response;
      });

             // Periodos
      this.serviciosDominiosValoresService
      .obtenerValoresPorIdDominio(dominiosEnum.Periodos)
      .subscribe((response) => {
        this.listPeriodos = response;
      });
  

      // Unidades De medida
      this.serviciosDominiosValoresService
        .obtenerValoresPorIdDominio(dominiosEnum.UnidadesMedida)
        .subscribe((response) => {
          this.listUnidadesMedidad = response;
        });

      this.serviciosDominiosValoresService
        .obtenerValoresPorIdDominio(dominiosEnum.Variables)
        .subscribe((response) => {
          this.listVariables = response;
        });
    } else {
      // Tipos
      this.serviciosDominiosValoresService
        .obtenerValoresActivosPorIdDominio(dominiosEnum.TipoParametros)
        .subscribe((response) => {
          this.listTipos = response;
        });
          // Categoria
      this.serviciosDominiosValoresService
      .obtenerValoresActivosPorIdDominio(dominiosEnum.CategoriasEstacion)
      .subscribe((response) => {
        this.listaCategorias = response;
      });
      // Periodos
      this.serviciosDominiosValoresService
        .obtenerValoresActivosPorIdDominio(dominiosEnum.Periodos)
        .subscribe((response) => {
          this.listPeriodos = response;
        });

      // Unidades De medida
      this.serviciosDominiosValoresService
        .obtenerValoresActivosPorIdDominio(dominiosEnum.UnidadesMedida)
        .subscribe((response) => {
          this.listUnidadesMedidad = response;
        });
      // variables
      this.serviciosDominiosValoresService
        .obtenerValoresActivosPorIdDominio(dominiosEnum.Variables)
        .subscribe((response) => {
          this.listVariables = response;
        });
    }

    if (this.id != '0') {
      let idParam: number = +this.id;
      this.serviciosParametrosService
        .obtenerPorId(idParam)
        .subscribe((response) => { 
          this.formularioParametros.setValue(response);
        });
        
        this.bloquear = true;   
      if (this.ac == 'V') {
        this.formularioParametros.disable();
      }
    }
  }

  private construirFormulario() {
    this.formularioParametros = this.formBuilder.group({
      idParametro: [''],
      idVariable: ['', [Validators.required]],
      codigo: ['', [Validators.required]],
      codigoOrigen: [''],
      descripcion: [''],
      idUnidadMedida: ['', [Validators.required]],
      idTipoParametro: ['', [Validators.required]],
      idMetodo: ['', [Validators.required]],
      idCategoria: ['', [Validators.required]],
      activo: [''],
      fechaCreacion: [''],
      fechaModificacion: [''],
      fechaEstado: [''],
      usuarioCreacion: [''],
      usuarioModificacion: [''],
      usuarioEstado: [''], 
      idPeriodo: [''], 
    });
  }

  guardar() {
    try {
      const fecha = new Date();
      this.formularioParametros.value.codigoOrigen = this.parametro1 ;
      if (this.formularioParametros.valid) {
        if (this.id === '0') {
          this.serviciosParametrosService
            .crear(this.formularioParametros.value)
            .subscribe((response) => {
              if(response == null){
                console.log(response);
                this.toast.fire({
                  icon: 'error',
                  title:
                    'El codigo ingresado ya esta registrado!',
                });
                this.router.navigate(['/configuracion/parametros']);

              }else{

              console.log(response);
              
              this.toast.fire({
                icon: 'success',
                title:
                  'Parámetro ' + response.codigo + ', creado exitosamente!',
              });
              this.router.navigate(['/configuracion/parametros']);
            }


            });
        } else {
             if(this.formularioParametros.value.codigoOrigen == undefined){

    

                    this.serviciosParametrosService
                  .actualizarOrigen(this.formularioParametros.value)
                  .subscribe((response) => {
                    this.toast.fire({
                      icon: 'success',
                      title:
                        'Parámetro ' +
                        response.codigo +
                        ', actualizado exitosamente!',
                    });
                    this.router.navigate(['/configuracion/parametros']);
                  });


             }else{

                this.serviciosParametrosService
                  .actualizar(this.formularioParametros.value)
                  .subscribe((response) => {
                    this.toast.fire({
                      icon: 'success',
                      title:
                        'Parámetro ' +
                        response.codigo +
                        ', actualizado exitosamente!',
                    });
                    this.router.navigate(['/configuracion/parametros']);
                  });

            
             }
          
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
  patametroOrigen(){
    this.origen =  1;
  }
  patametroAgregado(){

    this.origen =  2;
  }

  
  tipoModelo(tipoSelected: any) { 
// console.log ('llego modelo ',tipoSelected)

    if (tipoSelected != undefined && tipoSelected != '') {
      this.serviciosDominiosValoresService
        .obtenerListadoMetodoxTipo(tipoSelected)
        .subscribe((response) => {
          this.listMetodos = response; 
        });
    }
  }
}
