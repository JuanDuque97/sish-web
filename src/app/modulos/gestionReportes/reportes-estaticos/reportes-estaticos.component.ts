import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ServiciosGestionReportes } from '../servicios-gestion-reportes.service';
import { ServiciosEstacionesService } from 'src/app/modulos/elementos/estaciones/servicios-estaciones.service';
import { MetodosGlobales } from 'src/app/common/utils/metodos-globales';
import Swal from 'sweetalert2';
import { IFiltrosEstacion } from 'src/app/modelo/configuracion/estacion';

@Component({
  selector: 'app-reportes-estaticos',
  templateUrl: './reportes-estaticos.component.html'
})

export class ReportesEstaticosComponent implements OnInit, AfterContentChecked {

  formGroupR1: FormGroup;
  formGroupR2: FormGroup;
  formGroupR3: FormGroup;
  formGroupR4: FormGroup;

  fechaFinal: Date;
  fechaInicio: Date;
  fechaActual: Date = new Date();
  nesplu:any;
  idEstacion: any = '';
  idAno: any;
  idMes: any;
  codigo:number;
  listaEstacionesDisponibles: any[] = [];
  listaEstacionesAgregadas: any[] = [];
  listaAnos: any[] = [];
  listaMeses: any[] = [
    {
      id: 1,
      text: 'Enero',
      disabled: false,
    },
    {
      id: 2,
      text: 'Febrero',
      disabled: false,
    },
    {
      id: 3,
      text: 'Marzo',
      disabled: false,
    },
    {
      id: 4,
      text: 'Abril',
      disabled: false,
    },
    {
      id: 5,
      text: 'Mayo',
      disabled: false,
    },
    {
      id: 6,
      text: 'Junio',
      disabled: false,
    },
    {
      id: 7,
      text: 'Julio',
      disabled: false,
    },
    {
      id: 8,
      text: 'Agosto',
      disabled: false,
    },
    {
      id: 9,
      text: 'Septiembre',
      disabled: false,
    }, {
      id: 10,
      text: 'Octubre',
      disabled: false,
    },
    {
      id: 11,
      text: 'Noviembre',
      disabled: false,
    },
    {
      id: 12,
      text: 'Diciembre',
      disabled: false,
    },
  ];

  columnas = [
    { title: 'id', data: 'reporteId', class: 'text-center', visible: false },
    { title: 'Nombre reporte', data: 'nombre', class: 'text-center' },
  ];

  datosFilter = [
    { reporteId: 1, nombre: 'Reporte Caudales Aforados' },
    { reporteId: 2, nombre: 'Reporte Fuentes Superficiales' },
    { reporteId: 3, nombre: 'Reporte Niveles' },
    { reporteId: 4, nombre: 'Reporte Precipitación' },

  ];

  botones = [
    {
      class: 'sish-boton-azul',
      title: 'Generar Reporte',
      action: 'generar',
      icon: 'fa fa-download',
      enabled: this.validarPermiso('ConsultarReporte')
    },
  ];

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

  @ViewChild('modalR1', { static: false }) modalR1: ElementRef;
  @ViewChild('modalR2', { static: false }) modalR2: ElementRef;
  @ViewChild('modalR3', { static: false }) modalR3: ElementRef;
  @ViewChild('modalR4', { static: false }) modalR4: ElementRef;

  constructor(
    private serviciosReporte: ServiciosGestionReportes,
    private serviciosEstacion: ServiciosEstacionesService,
    private formBuilder: FormBuilder,
    private router: Router,
    private cdRef: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.construirFormulario();
    this.cargarDatos();
  }

  /*
  ngAfterViewInit() {
    this.cdRef.detectChanges();
  }
  */

  ngAfterContentChecked(): void {
    this.cdRef.detectChanges();
  }

  cargarEstaciones(tipoReporte: number, callback: Function) {
    this.listaEstacionesDisponibles = [];

    Swal.fire({
      title: 'Cargando datos...',
      html: 'Por favor espere.',
      allowOutsideClick: false,
      showConfirmButton: false,
      timer: 42000,
      timerProgressBar: true,
      didOpen: async () => {
        Swal.showLoading();

        let request: IFiltrosEstacion = {
          codigoParametros: [],
        };

        switch (tipoReporte) {

          // Reporte Caudales Aforados
          case 1:
            this.serviciosEstacion.obtenerEstaciones().subscribe((response) => {
              let records: any[] = [];

              response.forEach(estacion => {
                let record = {
                  id: estacion.idEstacion,
                  text: estacion.estacion,
                  disabled: false,
                  codigoEAAB: estacion.codigoEstacionEaab,
                  codigoIDEAM: estacion.codigoEstacionIdeam,
                };

                records.push(record);
              });

              this.listaEstacionesDisponibles = records;
              Swal.close();

              callback();
            });
            break;

          // Reporte Fuentes Superficiales
          case 2:
            request.codigoParametros.push(102);

            this.serviciosEstacion.obtenerEstacionesPorCodigoParametros(request).subscribe((response) => {
              let records: any[] = [];

              response.forEach(estacion => {
                let record = {
                  id: estacion.idEstacion,
                  text: estacion.estacion,
                  disabled: false,
                  codigoEAAB: estacion.codigoEstacionEaab,
                  codigoIDEAM: estacion.codigoEstacionIdeam,
                };

                records.push(record);
              });

              this.listaEstacionesDisponibles = records;
              Swal.close();

              callback();
            });
            break;

          // Reporte Niveles y Precipitacion
          case 3:
            request.codigoParametros.push(120);
            request.codigoParametros.push(101);

            request = {
              codigoParametros: [120, 101],
            };

            this.serviciosEstacion.obtenerEstacionesPorCodigoParametros(request).subscribe((response) => {
              let records: any[] = [];

              response.forEach(estacion => {
                let record = {
                  id: estacion.idEstacion,
                  text: estacion.estacion,
                  disabled: false,
                  codigoEAAB: estacion.codigoEstacionEaab,
                  codigoIDEAM: estacion.codigoEstacionIdeam
                };

                records.push(record);
              });

              this.listaEstacionesDisponibles = records;
              Swal.close();

              callback();
            });

            break;
          case 4:
            request.codigoParametros.push(120);
            request.codigoParametros.push(101);

            request = {
              codigoParametros: [120, 101],
            };

            this.serviciosEstacion.obtenerEstacionesPorCodigoParametros(request).subscribe((response) => {
              let records: any[] = [];

              response.forEach(estacion => {
                let record = {
                  id: estacion.idEstacion,
                  text: estacion.estacion,
                  disabled: false,
                  codigoEAAB: estacion.codigoEstacionEaab,
                  codigoIDEAM: estacion.codigoEstacionIdeam,
                };

                records.push(record);
              });

              this.listaEstacionesDisponibles = records;
              Swal.close();

              callback();
            });

            break;

          default:
            break;
        }
      },
      willClose: async () => {
        Swal.hideLoading();
      }
    });
  }

  cargarDatos() {
    if (0 == this.listaAnos.length) {
      let year = this.fechaActual.getFullYear();
      for (let ano = year; ano >= 1900; ano--) {
        let item = {
          text: ano,
          id: ano,
          disabled: false,
        };

        this.listaAnos.push(item);
      }
    }

    this.listaEstacionesAgregadas = [];
    this.listaEstacionesDisponibles = [];
  }

  private construirFormulario() {
    this.formGroupR1 = this.formBuilder.group({
      r1AnoCB: ['', Validators.required],
      r1EstacionesCB: [''],
    });

    this.formGroupR2 = this.formBuilder.group({
      r2AnoCB: ['', Validators.required],
      r2EstacionesCB: ['']
    });

    this.formGroupR3 = this.formBuilder.group({
      r3AnoCB: ['', Validators.required],
      r3MesCB: ['', Validators.required],
      r3EstacionesCB: [''],
      r3Codigo: [''],
      nesplu: [''],
    });

    this.formGroupR4 = this.formBuilder.group({
      r4AnoCB: ['', Validators.required],
      r4MesCB: ['', Validators.required],
      r4EstacionesCB: [''],
      r4Codigo: [''],
      nesplu: [''],
    });
  }

  get r1AnoFC() {
    return this.formGroupR1.get('r1AnoCB');
  }

  get r1EstacionesCB() {
    return this.formGroupR1.get('r1EstacionesCB');
  }

  get r2AnoFC() {
    return this.formGroupR2.get('r2AnoCB');
  }

  get r2EstacionesCB() {
    return this.formGroupR2.get('r2EstacionesCB');
  }

  get r3AnoFC() {
    return this.formGroupR3.get('r3AnoCB');
  }

  get r3MesCB() {
    return this.formGroupR3.get('r3MesCB');
  }

  get r3EstacionesCB() {
    return this.formGroupR3.get('r3EstacionesCB');
  }

  get r3Codigo() {
    return this.formGroupR3.get('r3Codigo');
  }

  get r4Codigo() {
    return this.formGroupR3.get('r4Codigo');
  }

  get r3nesplu() {
    return this.formGroupR3.get('nesplu');
  }

  get r4nesplu() {
    return this.formGroupR4.get('nesplu');
  }


  get r4AnoFC() {
    return this.formGroupR4.get('r4AnoCB');
  }

  get r4MesCB() {
    return this.formGroupR4.get('r4MesCB');
  }

  get r4EstacionesCB() {
    return this.formGroupR4.get('r4EstacionesCB');
  }

  accionRegistro(e: any) {
    let registro = e.registro;

    switch (e.accion) {
      case 'generar':
        this.mostrarParametros(registro);
        break;

      default:
        alert('En construcción...' + JSON.stringify(e) + ', Registro: ' + JSON.stringify(e.registro));
        break;
    }
  }

  mostrarParametros(reporte: any) {
    if (null == reporte || undefined == reporte) {
      console.error('Mostrar parametros: El reporte solicitado NO es valido.');
      return;
    }

    let reporteId = reporte.reporteId;

    switch (reporteId) {
      // Reporte Caudales Aforados
      case 1:
        this.cargarEstaciones(1, () => {
          this.mostrarParametrosCaudalesAforados();
        });

        break;

      // Reporte Fuentes Superficiales
      case 2:
        this.cargarEstaciones(2, () => {
          this.mostrarParametrosFuentesSuperficiales();
        });

        break;

      // Reporte Precipitación y Niveles.
      case 3:
        this.cargarEstaciones(3, () => {
          this.mostrarParametrosPrecipitacion();
        });

        break;
      case 4:
        this.cargarEstaciones(4, () => {
          this.mostrarParametrosPrecipitacionPrecipitacion();
        });

        break;

      default:
        console.error('El reporte solicitado NO es valido. ' + reporteId);
        break;
    }
  }

  mostrarParametrosCaudalesAforados() {
    this.modalR1.nativeElement.click();
  }

  mostrarParametrosFuentesSuperficiales() {
    this.modalR2.nativeElement.click();
  }

  mostrarParametrosPrecipitacion() {
    this.modalR3.nativeElement.click();
  }
  mostrarParametrosPrecipitacionPrecipitacion() {
    this.modalR4.nativeElement.click();
  }

  onCancelarModalR1() {
    let myForm: any = document.getElementById('formR1');
    myForm.reset();

    myForm = document.getElementById('formR2');
    myForm.reset();

    myForm = document.getElementById('formR3');
    myForm.reset();

    myForm = document.getElementById('formR4');
    myForm.reset();

    this.cargarDatos();
  }

  validarFechas(event: any) {
    //alert('validarFechas en construcción...');
  }

  assertNullAndUndefined(value: any): boolean {
    if (null == value || undefined == value) {
      return false;
    }

    return true;
  }

  // Reporte Caudales Aforados...
  onNavegarR1(event: any) {
    /*
    if ( !this.formGroupR1.valid ) {
      return;
    }
    */

    let anoSTR: string = this.formGroupR1.get('r1AnoCB')?.value;

    if (!this.assertNullAndUndefined(anoSTR) ||
      0 == anoSTR.length) {
      console.error('R1 Año reporte no valido: ' + anoSTR);
      return;
    }

    if (!(this.listaEstacionesAgregadas.length >= 1 && this.listaEstacionesAgregadas.length <= 15)) {
      console.error('El reporte de Caudales Aforados permite entre [1-15] estaciones.');

      this.toast.fire({
        title: 'Error',
        text: 'El reporte de Caudales Aforados SOLO permite máximo 15 estaciones.',
        icon: 'error'
      });
      return;
    }

    let ids = '';
    this.listaEstacionesAgregadas.forEach(estacion => {
      ids += estacion.id + ';';
    });

    let miIDEstaciones = ids.substring(0, ids.length - 1);
    this.modalR1.nativeElement.click();

    let fechaInicioSTR = '' + anoSTR + '-01-01 00:00:00';
    let fechaFinSTR = '' + anoSTR + '-12-31 23:59:59';

    this.router.navigate(['/configuracion/reporte/caudalesAforados/' +
      '[' + fechaInicioSTR + ']/' +
      '[' + fechaFinSTR + ']/' +
      miIDEstaciones]);
  }

  // Reporte Fuentes Superficiales...
  onNavegarR2(event: any) {
    if (!this.formGroupR2.valid) {
      return;
    }

    let anoSTR: string = this.formGroupR2.get('r2AnoCB')?.value;

    if (!this.assertNullAndUndefined(anoSTR) ||
      0 == anoSTR.length) {
      console.error('R2 Año reporte no valido: ' + anoSTR);
      return;
    }

    if (this.listaEstacionesAgregadas.length != 1) {
      console.error('El reporte de Fuentes Superficiales permite solo 1 estación.');

      this.toast.fire({
        titleText: 'Error',
        html: 'El reporte de Fuentes Superficiales SOLO permite 1 sola estación.',
        icon: 'error'
      });
      return;
    }

    let miIDEstaciones = this.listaEstacionesAgregadas[0].id;
    this.modalR2.nativeElement.click();

    this.router.navigate(['/configuracion/reporte/fuentesSuperficiales/'
      + anoSTR + '/' +
      miIDEstaciones
    ]);
  }

  // Niveles y Precipitación.
  onNavegarR3(event: any) {

    let Nesplu = this.formGroupR3.get('r3Codigo')?.value;
    let anoSTR: string = this.formGroupR3.get('r3AnoCB')?.value;
    let mesSTR: string = this.formGroupR3.get('r3MesCB')?.value;

    if (!this.assertNullAndUndefined(anoSTR) ||
      0 == anoSTR.length) {
      console.error('R3 Año reporte no valido: ' + anoSTR);
      return;
    }

    if (!(this.listaEstacionesAgregadas.length >= 1 && this.listaEstacionesAgregadas.length <= 15)) {
      console.error('El reporte de Niveles y Precipitación solo acepta una sola estación...');

      this.toast.fire({
        title: 'Error',
        text: 'El reporte de Niveles y Precipitación SOLO permite máximo 15 estaciones.',
        icon: 'error'
      });
      return;
    }

    let ids = '';
    let idsCodigo = '';
    this.listaEstacionesAgregadas.forEach(estacion => {
      ids += estacion.id + ';';
      idsCodigo  += estacion.nesplu + ';';
    });

    let miIDEstaciones = ids.substring(0, ids.length - 1);
    this.modalR3.nativeElement.click();

    let fechaInicioSTR = '' + anoSTR + '-' + mesSTR + '-01 00:00:00';
    let fechaFinSTR = '' + anoSTR + '-' + mesSTR + '-31 23:59:59';
    let codigoNesplu = idsCodigo.substring(0, idsCodigo.length - 1);

    this.router.navigate(['/configuracion/reporte/niveles/' +
      '[' + fechaInicioSTR + ']/' +
      '[' + fechaFinSTR + ']/' +
      codigoNesplu + '/' +
      miIDEstaciones
    ]);
  }

  // Niveles 
  onNavegarR4(event: any) {

   

    let anoSTR: string = this.formGroupR4.get('r4AnoCB')?.value;
    let mesSTR: string = this.formGroupR4.get('r4MesCB')?.value;



    if (!(this.listaEstacionesAgregadas.length >= 1 && this.listaEstacionesAgregadas.length <= 15)) {
      console.error('El reporte de Precipitación solo acepta una sola estación...');

      this.toast.fire({
        title: 'Error',
        text: 'El reporte de Precipitación SOLO permite máximo 15 estaciones.',
        icon: 'error'
      });
      return;
    }

    let ids = '';
    let idsCodigo = '';
    this.listaEstacionesAgregadas.forEach(estacion => {
      ids += estacion.id + ';';
      idsCodigo  += estacion.nesplu + ';';
    });

    let miIDEstaciones = ids.substring(0, ids.length - 1);
    let codigoNesplu = idsCodigo.substring(0, idsCodigo.length - 1);
    this.modalR4.nativeElement.click();

    let fechaInicioSTR = '' + anoSTR + '-' + mesSTR + '-01 00:00:00';
    let fechaFinSTR = '' + anoSTR + '-' + mesSTR + '-31 23:59:59';

    this.router.navigate(['/configuracion/reporte/precipitacion/' +
      '[' + fechaInicioSTR + ']/' +
      '[' + fechaFinSTR + ']/' +
      codigoNesplu + '/' +
      miIDEstaciones
    ]);
  }
  

  ordenEstructura(estacion: any) {
    alert('En Construcción...');
  }

  onEstacionesCBChange(idEstacion: string) {

     
        


    //this.cdRef.detectChanges();

    if (!this.assertNullAndUndefined(idEstacion) || 0 == idEstacion.length) {
      return;
    }

    // 1. Se busca el ID en la lista de agregadas, para descartar su adición.
    let estaciones = this.listaEstacionesAgregadas.filter(estacion => {
      return estacion.id === parseInt(idEstacion);
    });

    if (this.assertNullAndUndefined(estaciones) && estaciones.length > 0) {
      return;
    }

    // 2. Se obtiene la estación que se desea agregar...
    estaciones = this.listaEstacionesDisponibles.filter(estacion => {
      return estacion.id === parseInt(idEstacion);
    });

    if (!this.assertNullAndUndefined(estaciones) || estaciones.length < 1) {
      return;
    }

    let estacion = estaciones[0];

    // 3. Se elimina la estación de la lista de disponibles.
    let index = this.listaEstacionesDisponibles.indexOf(estacion);
    if (index == -1) {
      return;
    }

    let nuevasEstaciones = [];
    for (let i = 0; i < this.listaEstacionesDisponibles.length; i++) {
      if (index === i) {
        continue;
      }

      let divsucursal: any = document.getElementById(`codigoNesplu`);
      divsucursal.click();
      


      nuevasEstaciones.push(this.listaEstacionesDisponibles[i]);
    }

    this.listaEstacionesDisponibles = [];
    this.listaEstacionesDisponibles = [...nuevasEstaciones];

    // 4. Se agrega la estación solicitada a la lista de agregadas.
    this.listaEstacionesAgregadas.push(estacion);
  }

  eliminarEstacionAgregada(idEstacion: string) {
    if (!this.assertNullAndUndefined(idEstacion) || 0 == idEstacion.length) {
      return;
    }

    // 1. Se busca el ID en la lista de disponibles, para descartar su adición.
    let estaciones = this.listaEstacionesDisponibles.filter(estacion => {
      return estacion.id === parseInt(idEstacion);
    });

    if (this.assertNullAndUndefined(estaciones) && estaciones.length > 0) {
      return;
    }

    // 2. Se obtiene la estación que se desea agregar...
    estaciones = this.listaEstacionesAgregadas.filter(estacion => {
      return estacion.id === parseInt(idEstacion);
    });

    if (!this.assertNullAndUndefined(estaciones) || estaciones.length < 1) {
      return;
    }

    let estacion = estaciones[0];

    // 3. Se elimina la estación de la lista de agregadas.
    let index = this.listaEstacionesAgregadas.indexOf(estacion);
    if (index == -1) {
      return;
    }

    let nuevasEstaciones = [];
    for (let i = 0; i < this.listaEstacionesAgregadas.length; i++) {
      if (index === i) {
        continue;
      }

      nuevasEstaciones.push(this.listaEstacionesAgregadas[i]);
    }

    this.listaEstacionesAgregadas = [];
    this.listaEstacionesAgregadas = [...nuevasEstaciones];

    // 4. Se agrega la estación solicitada a la lista de disponibles.
    this.listaEstacionesDisponibles.push(estacion);

    //this.cdRef.detectChanges();
  }

  // Validacion de permisos 
  public validarPermiso(permiso: any): boolean {
    return MetodosGlobales.validarPermiso(permiso);
  }

 

  cerrarModal(){
    let divsucursal: any = document.getElementById(`cerrarModal`);
    divsucursal.click();

    let divsucursal1: any = document.getElementById(`cerrar`);
    divsucursal1.click();
  }



  agregarcodigoPrecipitacion(){

    var index = this.listaEstacionesAgregadas.length -1;
    this.cerrarModal();
    this.listaEstacionesAgregadas[index].nesplu = this.formGroupR4.value.r4Codigo
     this.nesplu= "";



  }


  agregarcodigoNiveles(){

    var index = this.listaEstacionesAgregadas.length -1;


    this.cerrarModal();

    this.listaEstacionesAgregadas[index].nesplu = this.formGroupR3.value.r3Codigo


   this.nesplu= "";
    
  }



}
