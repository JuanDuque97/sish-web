import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import Swal from 'sweetalert2';
import { accionesTablasEnum } from 'src/app/modelo/enum/acciones-tablas-enum';

import { estados } from 'src/app/common/utils/constantes';
import { MetodosGlobales } from 'src/app/common/utils/metodos-globales';
import { IDominio } from 'src/app/modelo/configuracion/dominio';
import { dominiosEnum } from 'src/app/modelo/enum/dominios-enum';
import { ServiciosDominiosValoresService } from '../../configuracion/dominios/servicios-dominios-valores.service';
import { ServiciosDominiosService } from '../../configuracion/dominios/servicios-dominios.service';
import { ServiciosEmbalcesService } from '../../elementos/embalses/servicios-embalses.service';
import { ServiciosEstacionesService } from '../../elementos/estaciones/servicios-estaciones.service';
import { ServiciosPozosService } from '../../elementos/pozos/servicios-pozos.service';
import { ServiciosObservacionesEmbalsesService } from '../servicios-observaciones-embalses.service';
import { ServiciosObservacionesEstacionService } from '../servicios-observaciones-estacion.service';
import { ServiciosObservacionesPozosService } from '../servicios-observaciones-pozos.service';
import { ServiciosParametrosService } from 'src/app/modulos/parametros/servicios-parametros.service';




@Component({
  selector: 'app-configuracion-parametros-datos',
  templateUrl: './configuracion-parametro.component.html'
})
export class ConfuguracionParametroComponent implements OnInit {
  public formularioConsulta!: FormGroup;
  @ViewChild(DataTableDirective, { static: false })
  rutaGeneral = 'configuracion/dominios/C/0';
  rutaConsulta = 'configuracion/dominios/V/';
  rutaEdicion = 'configuracion/configuracionParametro/E/';
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
  public listaElemento: any =
    [{
      id: 909,
      text: 'PROMEDIO',
      disabled: false
    },
    {
      id: 906,
      text: 'MAXIMO',
      disabled: false
    }, {
      id: 907,
      text: 'MINIMO',
      disabled: false
    }, {
      id: 908,
      text: 'CANTIDAD',
      disabled: false
    }, {
      id: 965,
      text: 'SUMA',
      disabled: false
    }

    ];
  public listaParametros: any = [];
  public listaCodigoEAAB: any = [];
  public listaCodigoIDEAM: any = [];
  public editarlista: any = [];
  public fechaMes: number;
  public id: string = '0';
  public ac: string = 'c';
  public te: string = '0';



  datatableElement: DataTableDirective | undefined;

  dtOptions: any = {};
  columnas = [
    { title: 'id', data: 'id' },
    { title: 'Parámetro', data: 'parametro' },
    { title: 'Operación', data: 'operacion' }
  ];
  public listarConfiguracionP: any = [];
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private serviciosDominiosService: ServiciosDominiosService,
    private serviciosEstacionesService: ServiciosEstacionesService,
    private serviciosDominiosValoresService: ServiciosDominiosValoresService,
    private serviciosEmbalcesService: ServiciosEmbalcesService,
    private serviciosPozosService: ServiciosPozosService,
    private serviciosParametrosService: ServiciosParametrosService,
    private route: ActivatedRoute,
    private serviciosObservacionesEstacionService: ServiciosObservacionesEstacionService,
    private serviciosObservacionesPozosService: ServiciosObservacionesPozosService,
    private serviciosObservacionesEmbalsesService: ServiciosObservacionesEmbalsesService
  ) {
    // Esto es intencional
  }

  vector: Array<number> = Array(50);

  ngOnInit(): void {
    this.construirFormulario();
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.ac = this.route.snapshot.paramMap.get('ac')!;
    this.te = this.route.snapshot.paramMap.get('te')!;


    this.obtener();

    this.serviciosParametrosService.obtenerOrgine().subscribe(
      (response) => {
        // console.log(response);
        this.listaParametros = response;
      }
    );


    if (this.id) {
      this.serviciosParametrosService
        .obtenerPorIdElemento(this.id)
        .subscribe((Response) => {

          this.editarlista = Response;
          this.formularioConsulta.setValue(this.editarlista[0]);
        });
    }

  }

  obtener() {
    Swal.fire({
      title: 'Cargando...',
      html: 'Por favor espere.',
      timer: 42000,
      timerProgressBar: true,
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: async () => {
        Swal.showLoading();
        this.serviciosParametrosService
          .obtenerParametroXOperaciones()
          .subscribe((Response) => {
            this.datosFilter = Response;
            Swal.close();
          });
      },
      willClose: async () => {
        Swal.hideLoading();
      }
    });
  }

  get idOperacion() {
    return this.formularioConsulta.get('idOperacion');
  }
  get idParametro() {
    return this.formularioConsulta.get('idParametro');
  }

  private construirFormulario() {
    this.formularioConsulta = this.formBuilder.group({
      idParametro: [''],
      idOperacion: [''],


    });
  }




  guardarOp() {

    if (this.formularioConsulta.valid) {

      this.serviciosParametrosService
        .crearParametroXOperaciones(this.formularioConsulta.value)
        .subscribe((Response) => {
          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer)
              toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
          })

          Toast.fire({
            icon: 'info',
            title: 'El parametro fue configurado con exito',
          })

          this.serviciosParametrosService
            .obtenerParametroXOperaciones()
            .subscribe((Response) => {
              this.datosFilter = Response;
            });

        });

    }
  }


  consultarConfiguracionP(any: any) {

    var id = this.formularioConsulta.value.idParametro;

    if (id) {
      this.serviciosParametrosService.obtenerConfigPorId(id).subscribe(
        (response) => {
          this.listarConfiguracionP = response;
          console.log(this.listarConfiguracionP[0]);
          if (!this.listarConfiguracionP[0]) {
            this.toast.fire({
              icon: 'info',
              title: 'Seleciona una Operación!',
            });

          } else {

            this.toast.fire({
              icon: 'error',
              title: 'El parámetro ya esta configurado, debes eliminar 0 modificar el ya creado!',
            });


          }


        }

      );

    }

  }
  // Validacion de permisos 
  public validarPermiso(permiso: any): boolean {
    return MetodosGlobales.validarPermiso(permiso);
  }

  accionRegistroColumnas(e: any) {
    switch (e.accion) {
      case accionesTablasEnum.Eliminar: {
        var listaFinal = this.datosFilter;

        this.serviciosParametrosService
          .eliminarParametroXOperacion(e.registro.id)
          .subscribe((Response) => {
            var cars = listaFinal.filter(function (car: any) {
              return car.id !== e.registro.id;
            });
            this.datosFilter = [];
            this.datosFilter = cars;
          });


      }


    }
  }
}
