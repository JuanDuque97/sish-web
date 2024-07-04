import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { accionesTablasEnum } from 'src/app/modelo/enum/acciones-tablas-enum';
import { IArchivoCampo } from 'src/app/modelo/tipoArchivos/archivoCampos';
import { IArchivoColumna } from 'src/app/modelo/tipoArchivos/archivoColumna';
import Swal from 'sweetalert2';
import { ServiciosArchivoCampos } from '../../servicios-archivo-campos.service';

@Component({
  selector: 'app-consultar-campos',
  templateUrl: './consultar-campos.component.html',
})
export class ConsultarCamposComponent implements OnInit {
 
  public id: string = '';

  rutaGeneralCampos  :string; 
rutaConsultaCampos  :string;
rutaEdicionCampos    :string; 

  constructor(private serviciosArchivoCampos: ServiciosArchivoCampos,
    private route: ActivatedRoute, 
    private router: Router,
    ) {} 
      

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

  datosCampos = [] as any;
   Campos = [
    {
      title: 'idParametro',
      data: 'idParametro',
      visible: false,
      class: 'text-center',
    },
    {
      title: 'idTipoArchivoConfigurado',
      data: 'idTipoArchivoConfigurado',
      visible: false,
      class: 'text-center',
    },
    {
      title: 'idTipoArchivoColumna',
      data: 'idTipoArchivoColumna',
      visible: false,
      class: 'text-center',
    },
    {
      title: 'idTipoArchivoCampo',
      data: 'idTipoArchivoCampo',
      visible: false,
      class: 'text-center',
    },
    {
      title: 'idTipoArchivoColumnaPropiedad',
      data: 'idTipoArchivoColumnaPropiedad',
      visible: false,
      class: 'text-center',
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
      title: 'Tipo Archivo Columna',
      data: 'tipoArchivoColumna',
      visible: true,
      class: 'text-center',
      filter: true,
      filterValue: '',
      tipo: 'seleccion',
    },
    {
      title: 'Codigo Propiedad',
      data: 'codigoPropiedad',
      visible: true,
      class: 'text-center',
      filter: true,
      filterValue: '',
      tipo: 'seleccion',
    },
    {
      title: 'Campo Relacionado',
      data: 'campoRelacionado',
      visible: true,
      class: 'text-center',
      filter: true,
      filterValue: '',
      tipo: 'seleccion',
    },
    {
      title: 'Descripcion',
      data: 'descripcion',
      visible: true,
      class: 'text-center',
      filter: true,
      filterValue: '',
      tipo: 'texto',
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

   this.rutaGeneralCampos = 'configuracion/tipoarchivos/Campos/'+this.id+'/C/0';
   this.rutaConsultaCampos = 'configuracion/tipoarchivos/Campos/'+ this.id+'/V/';
   this.rutaEdicionCampos =  'configuracion/tipoarchivos/Campos/'+ this.id+'/E/'; 
// console.log('consultar campos',this.id)

  }


  accionGeneral(e: any) {
    this.router.navigate(['/configuracion/tipoarchivos/configurados/V/' + this.id]);
  }
  
  accionRegistro(e: any) {
    switch (e.accion) {
      case accionesTablasEnum.Eliminar: {
        let archivoCampo: IArchivoCampo = e.registro;
        this.eliminar(archivoCampo.idTipoArchivoCampo);
        //statements;
        break;
      }
    }
  }

  eliminar(id: number) { 
    console.log('eliminando campos')
    this.serviciosArchivoCampos.eliminar(id).subscribe((response) => {
      this.toast.fire({
        icon: 'success',
        title: 'El campo a sido eliminado  exitosamente!',
      });
      this.obtenerValores(parseInt(this.id));
    });
  }

  public obtenerValores(idArchivo: number) {
    this.serviciosArchivoCampos.obtenerDTO(idArchivo).subscribe((response) => {
      this.datosCampos = response;  
    });
  }
}
