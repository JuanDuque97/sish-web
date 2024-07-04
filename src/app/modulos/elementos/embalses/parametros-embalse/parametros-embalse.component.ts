import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { accionesTablasEnum } from 'src/app/modelo/enum/acciones-tablas-enum';
import Swal from 'sweetalert2';
import {IParametrosEmbalse} from '../../../../modelo/configuracion/embalce';
import { ServiciosEmbalcesService } from '../servicios-embalses.service';
import { ServiciosParametrosEmbalseService } from '../servicios-parametros-embalse.service';
import { ServiciosParametrosService } from '../../../parametros/servicios-parametros.service';
import { MetodosGlobales } from 'src/app/common/utils/metodos-globales';
import { Select2OptionData } from 'ng-select2';
import { boolean, string } from 'mathjs';

@Component({
  selector: 'app-parametros-embalse',
  templateUrl: './parametros-embalse.component.html',
})

export class ParametrosEmbalseComponent implements OnInit {
  public id: string = '0';
  public formularioEmbalse!: FormGroup;
  public listaparametros: any[] = [];
  public mostrar = false;
  public datosParametros: Array<Select2OptionData> = [];
  datosFilter = [] as any;

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

  columnas = [
    {
      title: 'ID',
      data: 'idParametroXEmbalse',
      visible: false,
    },
    {
      title: 'Tipo parámetro',
      data: 'tipoParametro',
      class: 'text-center',
    },
    {
      title: 'Descripción',
      data: 'descripcionParametro',
      class: 'text-center',
    },
    {
      title: 'Activo',
      data: 'activo',
      class: 'text-center',
    },
  ];

  botonesGenerales = [
    {
      text: 'Agregar parámetro  ',
      action: 'agregarValor',
      enabled: this.validarPermiso('CrearParametroXEmbalse'),
    },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private serviciosEmbalcesService: ServiciosEmbalcesService,
    private serviciosParametrosEmbalseService: ServiciosParametrosEmbalseService,
    private serviciosParametrosService: ServiciosParametrosService
  ) {}

  ngOnInit(): void {
    this.construirFormulario();
    this.obtenerListaPermiso();
    this.id = this.route.snapshot.paramMap.get('id')!;
    let idembalse: number = +this.id;
    this.obtenerListaParametrosXEmbalse(idembalse);
    if (this.id != '0') {
      this.serviciosEmbalcesService
        .obtenerPorId(idembalse)
        .subscribe((response) => {
          console.log('llegaron embalses',response)
          this.formularioEmbalse.setValue(response);
          this.formularioEmbalse.disable();
        });
      this.bloquear = true;
    }
  }

  private construirFormulario() {
    this.formularioEmbalse = this.formBuilder.group({
      idEmbalse: [''],
      embalse: [''],
      idEntidad: [''],
      zonaOperativaEaab: [''],
      elevacion: [''],
      volumenTotal: [''],
      volumenUtil: [''],
      volumenMuerto: [''],
      longitudCresta: [''],
      anchoCresta: [''],
      alturaPresa: [''],
      fechaInicioOperacion: [''],

      activo: [''],
      fechaCreacion: [''],
      fechaModificacion: [''],
      fechaEstado: [''],
      usuarioCreacion: [''],
      usuarioModificacion: [''],
      usuarioEstado: [''],

      areaHidrografica: [''],
      cuenca: [''],
      idMunicipio: [''],
      subCuenca: [''],
      microcuenca: [''],
      nivelSubSiguiente: [''],
      subZonaHidrografica: [''],
      zonaHidrografica: [''],
    });
  }
  accionGeneral(e: any) {
    this.agregarValor();
  }

  accionRegistro(e: any) {
    switch (e.accion) {
      case accionesTablasEnum.Eliminar: {
        let parametrosEmbalse: IParametrosEmbalse = e.registro;
        this.eliminar(parametrosEmbalse.idParametroXEmbalse);
        //statements;

        break;
      }
    }
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
      inputOptions: this.listaparametros,
      showCancelButton: true,
      inputPlaceholder: 'seleccione un permiso...',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.agregarParametro(result);
      }
    });
  }
 
  obtenerListaPermiso() {
    this.serviciosParametrosEmbalseService
      .obtenerListaParametros()
      .subscribe((responde) => {
        console.log('llego parametros',responde)
        this.listaparametros = responde;
      });
  }

  public obtenerListaParametrosXEmbalse(id: number) {
    console.log('enviando', this.id);
    this.serviciosParametrosEmbalseService
      .obtenerListaParametrosXEmbalse(id)
      .subscribe((response) => {
        this.datosFilter = response;
        for (let index = 0; index <   this.datosFilter.length; index++) {
          
          var text   =  this.datosFilter[index]['descripcionParametro']
          var text1 = text.split('-');
           var parametro = text1[0]+'-'+text1[1].toLowerCase();

           this.datosFilter[index]['descripcionParametro'] = parametro;


           console.log(  this.datosFilter[index]['descripcionParametro']   );

        }
      });
  }

  public agregarParametro(result: any) {

    console.log('llego parametro',result)

    const parametrosEmbalse: IParametrosEmbalse = {
      idEmbalse: parseInt(this.id),
      idParametro: parseInt(result.value),
      idParametroXEmbalse: 0,
    };
    this.serviciosParametrosEmbalseService
      .crear(parametrosEmbalse)
      .subscribe((response) => {
        console.log('se agrego', response);
        this.toast.fire({
          icon: 'success',
          title: 'El Parámetro  fue agregado   creado exitosamente!',
        });
        this.obtenerListaParametrosXEmbalse(parseInt(this.id));
      });
  }
  eliminar(id: number) {
    this.serviciosParametrosEmbalseService
      .eliminar(id)
      .subscribe((response) => {
        this.toast.fire({
          icon: 'success',
          title: 'El Parámetro a sido eliminado  exitosamente!',
        });

        this.obtenerListaParametrosXEmbalse(parseInt(this.id));
      });
  }

  validarPermiso(permiso: any): boolean {
    return MetodosGlobales.validarPermiso(permiso);
  }
}
