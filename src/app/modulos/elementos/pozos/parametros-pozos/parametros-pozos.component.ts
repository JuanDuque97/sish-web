import { Component, OnInit } from '@angular/core'; 
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { accionesTablasEnum } from 'src/app/modelo/enum/acciones-tablas-enum';
import Swal from 'sweetalert2'; 
import { MetodosGlobales } from 'src/app/common/utils/metodos-globales';
import { ServiciosParametrosPozosService } from '../servicios-parametros-pozos.service';
import { IParametrosPozos } from '../../../../modelo/configuracion/pozo';
import { ServiciosPozosService } from '../servicios-pozos.service';

@Component({
  selector: 'app-parametros-pozos',
  templateUrl: './parametros-pozos.component.html'
})

export class ParametrosPozosComponent implements OnInit {
  public id: string = '0';
  public formularioPozo!: FormGroup; 
  public listparametros: any[];
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
 

  columnas = [
   
    {
      title: 'ID',
      data: 'idParametroXPozo',
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
      text: 'Agregar parámetro',
      action: 'agregarValor',
      enabled: this.validarPermiso('CrearParametroXPozo'),
    },
  ]; 

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private serviciosPozosService: ServiciosPozosService,
    private serviciosParametrosPozosService: ServiciosParametrosPozosService
  ) { }

  ngOnInit(): void {
    this.construirFormulario();
    this.obtenerListaPermiso();
    this.id = this.route.snapshot.paramMap.get('id')!;
    let idpozo: number = +this.id;
    this.obtenerListaParametrosXpozo(idpozo);
    if (this.id != '0') {
      this.serviciosPozosService.obtenerPorId(idpozo).subscribe((response) => {
        
        this.formularioPozo.setValue(response);
        this.formularioPozo.disable();
      }); 
    }
  }

  private construirFormulario() {
    this.formularioPozo = this.formBuilder.group({
      idPozo: [''],
      pozo:  [''],
      fechaInicioOperacion:  [''],
      cotaBoca:  [''],
      cotaMedidor:  [''],
      profundidad:  [''],
      idTipoPozo:  [''],
      idCategoria:  [''],
      idCondicion:  [''],
      activo: [''],
      areaHidrografica: [''],
      cuenca: [''],
      fechaCreacion: [''],
      fechaEstado: [''],
      fechaModificacion: [''],
      idMunicipio: [''],
      microcuenca: [''],
      nivelSubsiguiente: [''],
      subZonaHidrografica: [''],
      usuarioCreacion: [''],
      usuarioEstado: [''],
      usuarioModificacion: [''],
      zonaHidrografica: [''],
      zonaOperativaEaab: [''],
      idTipoCoordenada: [''],
      latitud: [''],
      longitud: [''],
    });
  }
  accionGeneral(e: any) {
    this.agregarValor();
  }
  
  accionRegistro(e: any) {
    switch (e.accion) {
      case accionesTablasEnum.Eliminar: {
        let parametrosPozos: IParametrosPozos = e.registro; 
        this.eliminar(parametrosPozos.idParametroXPozo);
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
      title: 'Nuevo Parámetro',
      input: 'select',
      inputOptions: this.listparametros,
      showCancelButton: true,
      inputPlaceholder: 'seleccione un Parámetro...',
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
    this.serviciosParametrosPozosService.obtenerListaParametros().subscribe((responde) => {
      this.listparametros = responde; 
    });
  }

  public obtenerListaParametrosXpozo( idpozo:number) {
   
    console.log('llego',idpozo)
    
    this.serviciosParametrosPozosService
      .obtenerListaParametrosXPozo(idpozo)
      .subscribe((response) => { 

        console.log('llegaron',response)
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
    const parametrosPozos: IParametrosPozos = {
      idPozo: parseInt(this.id),
      idParametro:   parseInt(result.value),
      idParametroXPozo: 0,
    };
    this.serviciosParametrosPozosService
      .crear(parametrosPozos)
      .subscribe((response) => {
        console.log('se agrego',response)
        this.toast.fire({
          icon: 'success',
          title: 'El Parámetro  fue agregado   creado exitosamente!',
        });
        
      this.obtenerListaParametrosXpozo( parseInt(this.id));
      });
  }

  eliminar(id: number) {
    this.serviciosParametrosPozosService.eliminar(id).subscribe((response) => {
      this.toast.fire({
        icon: 'success',
        title: 'El Parámetro a sido eliminado  exitosamente!',
      });

      this.obtenerListaParametrosXpozo( parseInt(this.id));
    });
  }

  validarPermiso(permiso: any): boolean {
    return MetodosGlobales.validarPermiso(permiso);
  }
}
