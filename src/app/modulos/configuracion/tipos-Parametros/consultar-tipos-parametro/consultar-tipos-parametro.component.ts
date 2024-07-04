import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { MetodosGlobales } from 'src/app/common/utils/metodos-globales';
import { IDominioValor } from 'src/app/modelo/configuracion/dominioValor';
import { ServiciosDominiosValoresService } from '../../dominios/servicios-dominios-valores.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-consultar-tipos-parametro',
  templateUrl: './consultar-tipos-parametro.component.html',
})
export class ConsultarTiposParametroComponent implements OnInit {

  @ViewChild(DataTableDirective, { static: false })
  rutaGeneral = 'configuracion/dominios/C/0';
  rutaConsulta = 'configuracion/dominios/V/';
  rutaEdicion = 'configuracion/dominios/E/';

  datosFilter = [] as any;

  datatableElement: DataTableDirective | undefined;

  dtOptions: any = {};
  columnas = [
    {
      title: 'ID',
      data: 'idDominioValor',
      visible: false,
      filterValueMin: '',
      filterValueMax: '',
      tipo: 'rangoNumero',
    },
    {
      title: 'Dominio valor',
      data: 'dominioValor',
      filter: true,
      filterValue: '',
      tipo: 'texto',
    }
  ];


  botones = [
    {
      class: 'sish-boton-azul',
      title: 'Permisos',
      action: 'permisos',
      icon: 'fas fa-tasks',
      enabled: this.validarPermiso('ConsultarMetodoXTipoParametro')
    },
  ];

  accionRegistro(e: any) {
    switch (e.accion) {

      case 'permisos': {

        let dominioValor: IDominioValor = e.registro;
        this.router.navigate([
          'configuracion/parametros/tipo/Parametros/' + dominioValor.idDominioValor
          ,]);



        // statements;
        break;
      }

      default: {
        break;
      }
    }
  }


  constructor(
    private router: Router,
    private serviciosDominiosValoresService: ServiciosDominiosValoresService
  ) { }


  ngOnInit(): void {
    this.obtener();
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
        this.serviciosDominiosValoresService.obtenerValorDominio(41).subscribe(
          (Response) => {
            this.datosFilter = Response
            Swal.close();
          });
      },
      willClose: async () => {
        Swal.hideLoading();
      }
    });
  }



  // Validacion de permisos 
  public validarPermiso(permiso: any): boolean {
    return MetodosGlobales.validarPermiso(permiso);
  }

}
