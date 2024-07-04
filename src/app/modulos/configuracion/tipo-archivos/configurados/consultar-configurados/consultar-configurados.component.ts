import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { estados } from 'src/app/common/utils/constantes';
import { MetodosGlobales } from 'src/app/common/utils/metodos-globales';
import { accionesTablasEnum } from 'src/app/modelo/enum/acciones-tablas-enum';
import { IArchivosConfigurados } from 'src/app/modelo/tipoArchivos/archivosConfigurados';
import { ServiciosArchivoConfigurado } from '../servicios-archivo-configurado.service';

@Component({
  selector: 'app-consultar-configurados',
  templateUrl: './consultar-configurados.component.html',
})
export class ConsultarConfiguradosComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtOptions: any = {};
  datatableElement!: DataTableDirective;

  rutaGeneral = 'configuracion/tipoarchivos/configurados/C/0';
  rutaConsulta = 'configuracion/tipoarchivos/configurados/V/';
  rutaEdicion = 'configuracion/tipoarchivos/configurados/E/';

  datosFilter = [] as any;
  columnas = [
    {
      title: 'Tipo Archivo Configurado',
      data: 'tipoArchivoConfigurado', 
      filterValue: '', 
      filter: true, 
      tipo: 'seleccion',
    },
    {
      title: 'Separador',
      data: 'separador', 
      filterValue: '',
      tipo: 'texto',
    },
    {
      title: 'calificador Texto',
      data: 'calificadorTexto', 
      filterValue: '',
      tipo: 'texto',
    },
 
    {
      title: 'Contiene Encabezado',
      data: 'contieneEncabezado', 
      filterValue: '',
      tipo: 'texto',
    },
    {
      title: 'Contiene Resumen',
      data: 'contieneResumen', 
      filterValue: '',
      tipo: 'texto',
    },
    {
      title: 'Separador Decimal',
      data: 'separadorDecimal', 
      filterValue: '',
      tipo: 'texto',
    },
    {
      title: 'Intervalo Frecuencia Temporal',
      data: 'intervaloFrecuenciaTemporal', 
      filterValue: '',
      tipo: 'texto',
    },

    {
      title: 'Activo',
      data: 'activo',
    },

    {
      title: 'fechaCreacion',
      data: 'fechaCreacion',
      visible: false,
      filterValue: '',
      tipo: 'texto',
    },
    {
      title: 'fechaModificacion',
      data: 'fechaModificacion',
      visible: false,
      filterValue: '',
      tipo: 'texto',
    },
    {
      title: 'usuarioCreacion',
      data: 'usuarioCreacion',
      visible: false,
      filterValue: '',
      tipo: 'texto',
    },
    {
      title: 'usuarioModificacion',
      data: 'usuarioModificacion',
      visible: false,
      filterValue: '',
      tipo: 'texto',
    },
    {
      title: 'fechaEstado',
      data: 'fechaEstado',
      visible: false,
      filterValue: '',
      tipo: 'texto',
    },
    {
      title: 'usuario Estado',
      data: 'usuarioEstado', 
      filterValue: '',
      tipo: 'texto',
    },
    {
      title: 'ID Tipo Archivo Configurado',
      data: 'idTipoArchivoConfigurado',
      visible: false,
      
    },
 
    {
      title: 'ID Tipo Fraccionamiento',
      data: 'idTipoFraccionamiento',
      filter: true,
      filterValueMin: '',
      filterValueMax: '',
      tipo: 'rangoNumero',
    },
    {
      title: 'ID Ubicación Datos',
      data: 'idUbicacionDatos',
      filter: true,
      filterValueMin: '',
      filterValueMax: '',
      tipo: 'rangoNumero',
    },
    
    {
      title: 'idFrecuenciaTemporal',
      data: 'idFrecuenciaTemporal',
      visible: false,
      filterValue: '',
      tipo: 'texto',
    },
   

    {
      title: 'idTipoCodificacion',
      data: 'idTipoCodificacion',
      visible: false,
      filterValue: '',
      tipo: 'texto',
    },

  ];

  constructor(
    private serviciosArchivoConfigurado: ServiciosArchivoConfigurado
  ) {}

  ngOnInit(): void {
    this.obtener();
  }

  obtener() {
    this.serviciosArchivoConfigurado.obtenerDTO().subscribe((response) => {
      this.datosFilter = response;
      console.log('llegaron permisos', response);
    });
  }
  accionRegistro(e: any) {
    switch (e.accion) {
      case accionesTablasEnum.Activar: {
        let archivosConfigurados: IArchivosConfigurados = e.registro;
        archivosConfigurados.activo = estados.activo;
        this.actualizar(archivosConfigurados);
        //statements;
        break;
      }
      case accionesTablasEnum.Inactivar: {
        let archivosConfigurados: IArchivosConfigurados = e.registro;
        archivosConfigurados.activo = estados.inactivo;
        this.actualizar(archivosConfigurados);
        break;
      }
      case accionesTablasEnum.Eliminar: {
        //statements;
        break;
      }
      default: {
        //statements;
        break;
      }
    }
  }

  actualizar(archivosConfigurados: IArchivosConfigurados) {
    this.serviciosArchivoConfigurado
      .actualizar(archivosConfigurados)
      .subscribe((response) => {
        console.log(response);
        this.obtener();
      });
  }

  // Validacion de permisos
  public validarPermiso(permiso: any): boolean {
    return MetodosGlobales.validarPermiso(permiso);
  }
}
