import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ServiciosParametrosService } from '../../../parametros/servicios-parametros.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiciosParametrosEstacionesService } from '../servicios-parametros-estaciones.service';
import Swal from 'sweetalert2';
import { IParametrosEstaciones } from '../../../../modelo/configuracion/estacion';
import { ServiciosEstacionesService } from '../servicios-estaciones.service';
import { accionesTablasEnum } from 'src/app/modelo/enum/acciones-tablas-enum';
import { MetodosGlobales } from 'src/app/common/utils/metodos-globales';

@Component({
  selector: 'app-parametros-estacion',
  templateUrl: './parametros-estacion.component.html',
})
export class ParametrosEstacionComponent implements OnInit {
  public formularioEstacion!: FormGroup;
  public id: string = '0';
  public NuevoValor: string;
  public objEstacion: any | undefined = { estacion: '', codigoEstacion: '' };

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private serviciosParametrosService: ServiciosParametrosService,
    private sercioparametrosestacion: ServiciosParametrosEstacionesService,
    private servicioestaciones: ServiciosEstacionesService
  ) {}

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

  public listParametros: any[] = [];

  columnas = [
    {
      title: 'ID',
      data: 'idParametroXEstacion',
      visible: false,
    },

   
  
    {
      title: 'Estación',
      data: 'estacion',
    },
  
    {
      title: 'id Parámetro',
      data: 'idParametro',
    },
    {
      title: 'Descripción',
      data: 'descripcionParametro',
    },
  
  
  ];

  botonesGenerales = [
    {
      text: 'Agregar Parámetro  ',
      action: 'agregarValor',
      enabled: this.validarPermiso('CrearParametroXEstacion'), 
    },
  ];
  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.construirFormulario();
   
    this.obtenerListaParametrosEstacion();

    if (this.id != '0') {
      let idEsta: number = +this.id;
      this.servicioestaciones.obtenerPorId(idEsta).subscribe((response) => {
        console.log('estacion',response.idCategoria)
        this.objEstacion = response;
        this.obtenerListaParametros(response.idCategoria);
      });
    }


  }

  // listado de parametros creados en  el menu Parametros
  obtenerListaParametros(id:number) {


    this.sercioparametrosestacion
      .obtenerPorIdCriterioDTO(id)
      .subscribe((response) => {
        console.log(response);
        
        this.listParametros = response;
      });
  }

  obtenerListaParametrosEstacion() {
    this.sercioparametrosestacion
      .obtenerListaParametros(parseInt(this.id))
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

  private construirFormulario() {
    this.formularioEstacion = this.formBuilder.group({
      idEstacion: [''],
      idEstado: [''],
      altitud: [''],
      areaHidrografica: [''],
      codigoEstacionEaab: [''],
      codigoEstacionIdeam: [''],
      corriente: [''],
      cuenca: [''],
      estacion: [''],
      este: [''],
      fechaCreacion: [''],
      fechaInstalacion: [''],
      fechaModificacion: [''],
      idCategoria: [''],
      idEntidad: [''],
      idMunicipio: [''],
      idTecnologia: [''],
      idTipoCoordenadas: [''],
      idTipoEstacion: [''],
      latitud: [''],
      microCuenca: [''],
      nivelSubSiguiente: [''],
      norte: [''],
      subZonaHidrografica: [''],
      usuarioCreacion: [''],
      usuarioModificacion: [''],
      zonaHidrografica: [''],
      zonaOperativaEaab: [''],
    });
  }

  accionGeneral(e: any) {
    this.agregarValor();
  }

  accionRegistro(e: any) {
    switch (e.accion) {
      case accionesTablasEnum.Eliminar: {
        let parametrosEstacion: IParametrosEstaciones = e.registro;
        this.eliminar(parametrosEstacion.idParametroXEstacion);
        //statements;
        break;
      }
    }
  }

  eliminar(id: number) {
    console.log('Eliminando', id);

    this.sercioparametrosestacion.eliminar(id).subscribe((response) => {
      
      this.toast.fire({
        icon: 'success',
        title: 'El Parámetro a sido eliminado  exitosamente!',
      });

      this.obtenerListaParametrosEstacion();
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
      title: 'Nuevo valor',
      input: 'select',
      inputOptions: this.listParametros,
      showCancelButton: true,
      inputPlaceholder: 'seleccione un parametro...',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.crearValor(result);
      }
    });
  }

  crearValor(result: any) {
    const parametroEstacion: IParametrosEstaciones = {
      idParametroXEstacion: 0,
      idParametro: result.value,
      idEstacion: parseInt(this.id),
    };

    this.sercioparametrosestacion
      .crear(parametroEstacion)
      .subscribe((response) => {
        this.toast.fire({
          icon: 'success',
          title: 'El Parámetro  fue agregado   creado exitosamente!',
        });
        this.obtenerListaParametrosEstacion();
      });
  }

  validarPermiso(permiso : string) : boolean {
    return MetodosGlobales.validarPermiso(permiso);
  }
}
