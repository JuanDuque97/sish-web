import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MetodosGlobales } from 'src/app/common/utils/metodos-globales';
import { IMetodoTipoParametro } from 'src/app/modelo/configuracion/parametro';
import { accionesTablasEnum } from 'src/app/modelo/enum/acciones-tablas-enum';
import { dominiosEnum } from 'src/app/modelo/enum/dominios-enum';
import Swal from 'sweetalert2';
import { ServiciosDominiosValoresService } from '../../dominios/servicios-dominios-valores.service';
import { ServiciosMetodoXtipoParametroService } from '../servicios-MetodoXtipoParametro.service';

@Component({
  selector: 'app-guardar-tipos-parametro',
  templateUrl: './guardar-tipos-parametro.component.html',
})
export class GuardarTiposParametroComponent implements OnInit {
  public formularioRol!: FormGroup;
  public id: string = '0'; 
public listMetodos: any[] = [];
public tipoParametro:string;

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
  dtOptions: any = {};
  datosFilter = [] as any;
  columnas = [
    {
      title: 'ID',
      data: 'idMetodo',
      visible: false,
      filterValueMin: '',
      filterValueMax: '',
      tipo: 'rangoNumero',
    },
    {
      title: 'Método',
      data: 'metodo',
      filter: true,
      filterValue: '',
      tipo: 'texto',
    },
  ];
  botonesGenerales = [
    {
      text: 'Crear',
      action: 'Crear',
      enabled: this.validarPermiso('CrearMetodoXTipoParametro'),
    },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private serviciosMetodoXtipoParametroService: ServiciosMetodoXtipoParametroService,
    private serviciosDominiosValoresService: ServiciosDominiosValoresService, 

  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.obtenerLista();

    if (this.id != '0') {
  
      let idParam: number = +this.id;
      this.serviciosDominiosValoresService
        .obtenerPorId(idParam)
        .subscribe((response) => {
          this.tipoParametro = response.dominioValor 
        }); 


         
    }

  }

  

  accionRegistro(e: any) {
    switch (e.accion) {
      case accionesTablasEnum.Eliminar: {
        console.log('Eliminar');
        let metodoTipoParametro: IMetodoTipoParametro = e.registro;

        this.eliminar(metodoTipoParametro);

        //statements;
        break;
      }
    }
  }

  accionGeneral(e: any) {
    this.agregarValor();
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
      inputOptions:  this.listMetodos,
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
    const metodoXtipoParametro: IMetodoTipoParametro = { 

      tipoParametro :'',
      metodo:'',
      idTipoParametro: parseInt(this.id),
      idMetodo:result.value,
      idMetodoXTipoParametro:0,

    };

    console.log('enviando',metodoXtipoParametro)

    this.serviciosMetodoXtipoParametroService
      .crear(metodoXtipoParametro)
      .subscribe((response) => {
        this.toast.fire({
          icon: 'success',
          title: 'El Metodo fue agregado exitosamente!',
        });
        this.obtenerLista();
      });
  }

  obtenerLista() {
    let idMetodo: number = +this.id; 
    this.serviciosMetodoXtipoParametroService
      .obtenertipoParametros(idMetodo)
      .subscribe((responde) => {
        console.log('datos', responde);

        this.datosFilter = responde;
      }); 
this.obtenerMetodos();

    }

obtenerMetodos(){
  
  this.serviciosDominiosValoresService
  .obtenerValoresActivosPorIdDominio(dominiosEnum.Metodos)
  .subscribe((response) => { 
    console.log('llego',response)
     for (let index = 0; index < response.length; index++) { 
      this.listMetodos.push(
        {
          [response[index].id] : response[index].text 
         }
      )
     }
  });
}

  eliminar(metodoTipoParametro: IMetodoTipoParametro) { 
    this.serviciosMetodoXtipoParametroService
      .eliminaripoParametros(metodoTipoParametro.idMetodoXTipoParametro)
      .subscribe((responde) => {
        console.log('datos', responde);
        this.obtenerLista();
      });
  }

  // Validacion de permisos
  public validarPermiso(permiso: any): boolean {
    return MetodosGlobales.validarPermiso(permiso);
  }
}
