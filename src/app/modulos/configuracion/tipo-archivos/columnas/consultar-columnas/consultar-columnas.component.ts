import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { accionesTablasEnum } from 'src/app/modelo/enum/acciones-tablas-enum';
import { IArchivoColumna } from 'src/app/modelo/tipoArchivos/archivoColumna';
import Swal from 'sweetalert2';
import { ServiciosArchivoColumnas } from '../../servicios-archivo-columnas.service';

@Component({
  selector: 'app-consultar-columnas',
  templateUrl: './consultar-columnas.component.html',
})
export class ConsultarColumnasComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router, 
    private serviciosArchivoColumnas: ServiciosArchivoColumnas
  ) {}

  public id: string = '';
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

  rutaGeneral: string;
  rutaConsulta: string;
  rutaEdicion: string;
  rutacancelar: string;

  datosFilter = [] as any;
  datosCampos = [] as any;
  columnas = [
    {
      title: 'idTipoArchivoColumna',
      data: 'idTipoArchivoColumna',
      visible: false,
    },
    {
      title: 'idTipoArchivoConfigurado',
      data: 'idTipoArchivoConfigurado',
      visible: false,
    },
    { title: 'idTipoDato', data: 'idTipoDato', visible: false },
    { title: 'idTipoContenido', data: 'idTipoContenido', visible: false },

    {
      title: 'Tipo Dato',
      data: 'tipoDato',
      visible: true,
      class: 'text-center',
      filter: true,
      filterValue: '',
      tipo: 'seleccion',
    },
    {
      title: 'Tipo Archivo Columna',
      data: 'tipoArchivoColumna',
      visible: true,
      class: 'text-center',
      filter: true,
      filterValue: '',
      tipo: 'seleccion',
    },
    {
      title: 'Tipo Contenido',
      data: 'tipoContenido',
      visible: true,
      class: 'text-center',
      filter: true,
      filterValue: '',
      tipo: 'seleccion',
    },
    {
      title: 'Tipo Archivo Configurado',
      data: 'tipoArchivoConfigurado',
      visible: true,
      class: 'text-center',
      filter: true,
      filterValue: '',
      tipo: 'seleccion',
    },
    {
      title: 'Numero Columna',
      data: 'numeroColumna',
      visible: true,
      class: 'text-center',
      filter: true,
      filterValueMin: '',
      filterValueMax: '',
      tipo: 'rangoNumero',
    },
    {
      title: 'Formato Origen',
      data: 'formatoOrigen',
      visible: true,
      class: 'text-center',
      filter: true,
      filterValue: '',
      tipo: 'seleccion',
    },
    {
      title: 'Formato Destino',
      data: 'formatoDestino',
      visible: true,
      class: 'text-center',
      filter: true,
      filterValue: '',
      tipo: 'seleccion',
    },
    {
      title: 'Posicion Inicial',
      data: 'posicionInicial',
      visible: true,
      class: 'text-center',
      filter: true,
      filterValue: '',
      tipo: 'seleccion',
    },
    {
      title: 'Posicion Final',
      data: 'posicionFinal',
      visible: true,
      class: 'text-center',
      filter: true,
      filterValue: '',
      tipo: 'seleccion',
    },
    {
      title: 'Separador',
      data: 'separador',
      visible: true,
      class: 'text-center',
      filter: true,
      filterValue: '',
      tipo: 'seleccion',
    },
  ];

  botonesGenerales = [
    {
      text: 'Cancelar',
      action: 'Cancelar',
    },
  ];

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.obtenerValores(parseInt(this.id));

    this.rutaGeneral =
      'configuracion/tipoarchivos/columnas/' + this.id + '/C/0';
    this.rutaConsulta =
      'configuracion/tipoarchivos/columnas/' + this.id + '/V/';
    this.rutaEdicion = 'configuracion/tipoarchivos/columnas/' + this.id + '/E/';
    this.rutacancelar = '/configuracion/tipoarchivos/configurados/V/' + this.id;
  }

  accionGeneral(e: any) {
    this.router.navigate([
      '/configuracion/tipoarchivos/configurados/V/' + this.id,
    ]);
  }

  accionRegistroColumnas(e: any) {
    switch (e.accion) {
      case accionesTablasEnum.Eliminar: {
        let archivoColumna: IArchivoColumna = e.registro;
        this.eliminar(archivoColumna.idTipoArchivoColumna);
        //statements;
        break;
      }
    }
  }

  eliminar(id: number) {
    this.serviciosArchivoColumnas.eliminar(id).subscribe((response) => {
      this.toast.fire({
        icon: 'success',
        title: 'La columna  a sido eliminado  exitosamente!',
      });
      this.obtenerValores(parseInt(this.id));
    });
  }

  public obtenerValores(idArchivo: number) {

    this.serviciosArchivoColumnas
      .obtenerDTO(idArchivo)
      .subscribe((response) => {
        this.datosFilter = response;
      });
  }
}
