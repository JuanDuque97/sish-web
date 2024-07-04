import { Router } from '@angular/router';
import { SweetAlertOptions } from 'sweetalert2';

export class LanguageTable {
  public static spanish_datatables = {
    processing: 'Procesando...',
    search: 'Buscar:',
    lengthMenu: 'Mostrar _MENU_ elementos',
    info: 'Mostrando desde _START_ al _END_ de _TOTAL_ elementos',
    infoEmpty: 'Mostrando ningún elemento.',
    infoFiltered: '(filtrado _MAX_ elementos total)',
    infoPostFix: '',
    loadingRecords: 'Cargando registros...',
    zeroRecords: 'No se encontraron registros',
    emptyTable: 'No hay datos disponibles en la tabla',
    paginate: {
      first: 'Primero',
      previous: 'Anterior',
      next: 'Siguiente',
      last: 'Último',
    },
    aria: {
      sortAscending: ': Activar para ordenar la tabla en orden ascendente',
      sortDescending: ': Activar para ordenar la tabla en orden descendente',
    },
    buttons: {
      copy: 'Copiar',
      print: 'Imprimir',
      colvis: 'Ver columnas',
    },
  };
}

export class OptionsTable {
  public static options(
    router: Router,
    ruta: string,
    filtro: boolean = true,
    verFiltro: boolean = true,
    verColumnas: boolean = true,
    copiar: boolean = true,
    imprimir: boolean = true,
    excel: boolean = true,
    crear: boolean = true,
    accionGeneral: any,
    botonesGenerales: Array<any> = []
  ): any {
    let btnFilters = {
      text: 'Filtros',
      key: '2',
      action: (e: any, dt: any, node: any, config: any) => {
        filtro = !filtro;
        cambio(filtro);
      },
    };
    let btnColumns = 'colvis';
    let btnCopy = 'copy';
    let btnPrint = {
      extend: 'print',
      exportOptions: {
          columns: ':visible'
      }
    };
    let btnExcel = {
      extend: 'excel',
      exportOptions: {
          columns: ':visible'
      }
    };
    let btnCreate = {
      text: 'Crear',
      key: '1',
      action: (e: any, dt: any, node: any, config: any) => {
        router.navigate([ruta]);
      },
    };


    let generales = botonesGenerales.map((btn:any)=>{
      return {
        text: btn.text,
        enabled: null!=btn.enabled && undefined!=btn.enabled ? btn.enabled : true,
        key: '1',
        action: (e: any, dt: any, node: any, config: any) => {
          accionGeneral.emit(btn.action);
        }
      }
    });

    let op = {
      language: LanguageTable.spanish_datatables,
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [15, 25, 50],
      processing: true,
      dom: 'Bftlirpk',
      verFiltro: filtro,
      buttons: [] as any,
    };

    if (verFiltro) op.buttons.push(btnFilters);
    if (verColumnas) op.buttons.push(btnColumns);
    if (copiar) op.buttons.push(btnCopy);
    if (imprimir) op.buttons.push(btnPrint);
    if (excel) op.buttons.push(btnExcel);
    if (crear) op.buttons.push(btnCreate);

    op.buttons.push([...generales]);

    let cambio = (f: boolean) => {
      op.verFiltro = f;
    };
    return op;
  }
}

export class BootstrapButtonsTable {
  public static bootstrap_buttons_mixin = {
    customClass: {
      confirmButton: 'sish-boton-confirmar',
      cancelButton: 'sish-boton-cancelar',
    },
    buttonsStyling: false,
  };

  public static bootstrap_buttons_eliminar: SweetAlertOptions = {
    title: 'Está seguro de eliminar el registro?',
    text: 'Esta acción no se podrá revertir!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Confirmar',
    cancelButtonText: 'Cancelar',
  };

  public static bootstrap_buttons_activar: SweetAlertOptions = {
    title: 'Está seguro de activar el registro?',
    text: 'Esta acción no se podrá revertir!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Confirmar',
    cancelButtonText: 'Cancelar',
  };

  public static bootstrap_buttons_inactivar: SweetAlertOptions = {
    title: 'Está seguro de inactivar el registro?',
    text: 'Esta acción no se podrá revertir!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Confirmar',
    cancelButtonText: 'Cancelar',
  };
}
