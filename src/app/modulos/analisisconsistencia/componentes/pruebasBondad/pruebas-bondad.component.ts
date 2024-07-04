import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MetodosGlobales } from 'src/app/common/utils/metodos-globales';
import { dominiosEnum } from 'src/app/modelo/enum/dominios-enum';
import { Observable } from 'rxjs';
import { capasEnum } from 'src/app/modelo/enum/capas-enum';
import { ServiciosGeograficosService } from 'src/app/common/mapa/servicios-geograficos.service';
import { ServiciosParametrosService } from 'src/app/modulos/parametros/servicios-parametros.service';
import { ServiciosEstacionesService } from 'src/app/modulos/elementos/estaciones/servicios-estaciones.service';
import { ServiciosDominiosValoresService } from 'src/app/modulos/configuracion/dominios/servicios-dominios-valores.service';
import { ServiciosObservacionesEstacionService } from '../servicios-observaciones-estacion.service';
import { ServiciosParametrosEstacionesService } from 'src/app/modulos/elementos/estaciones/servicios-parametros-estaciones.service';
import { ServiciosCapasService } from 'src/app/modulos/configuracion/capas/servicios-capas.service';
import { IPruebasBondad } from 'src/app/modelo/configuracion/pruebasBondad';
import { IPruebaBondadGeneralRequest, IPruebaBondadGeneralResponse, IVCramerRequest, IVCramerResponse, limiteSuperior, IResultadoPrueba } from 'src/app/modelo/observaciones/valorObservacion';

import Swal from 'sweetalert2';

import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexTitleSubtitle,
  ApexXAxis,
  ApexFill
} from "ng-apexcharts";
import { async } from '@angular/core/testing';
import { callbackify } from 'util';
import { IParametrosCFrecuencias } from 'src/app/modelo/configuracion/estacion';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  title: ApexTitleSubtitle;
  annotations: ApexAnnotations;
};

var chiSquaredTest = require('chi-squared-test');
const ChiSqTest = require('chi-sq-test');

@Component({
  selector: 'app-pruebas-bondad',
  templateUrl: './pruebas-bondad.component.html'
})

export class PruebasBondadComponent implements OnInit {
  
  @ViewChild('chart') chart: ChartComponent = {} as ChartComponent;

  @ViewChild('ModalReporte', { static: false }) ModalReporte: ElementRef;

  public chiEquation : any[] = ['x^2=\\sum [\\frac{(f_o-f_e)^2}{f_e}]']
  public kolmogorovEquation : any[] = ['D_N = Máx I P_e-P_o I ']
  public cramerEquation : any[] = ['V = \\sqrt{ \\frac{x^2}{n.(k-1)}}']

  public formularioConsulta!: FormGroup;
  public chartOptions: Partial<any> = {} as Partial<any>;
  Desviacion:any;
  public verFechas = false;
  public datosFilter = [] as any;
  public departamentoSelected: any = '';
  public periodo: number = 0;
  public listaElemento: any = [];
  public listaElementos: any = [];
  public listaCodigoEAAB: any = [];
  public listaCodigoIDEAM: any = [];
  public fechainicio: string;
  public Fechafin: string;
  public nombreParametro: string;
  public nombreEstacion: string;
  public listaCodigoEAABAgregar: any[] = [];
  public listaCodigoIDEAMAgregar: any[] = [];
  public listaAreaHidrografica = [];
  public listaZonaHidrografica = [];
  public listaElementoAgregar: any[] = [];
  public listaSubzonaHidrografica: [];
  public listaCuenca = [];
  public listaMicrocuenca = [];
  public promedio:any;
  public listaEntidad = [];
  public listaItemsElementos: any = [];
  public listParametro: any[] = [];
  public listaFrecuencia: any[] = [];
  public listaSubcuenca = [];
  public fechaMes: number;
  public tempIdDepartamento: number = 0;
  public listaMunicipios = [];
  public idTipoElemento: any;
  public idElemento: string = '0';
  public estacion: any = [];
  public listaDepartamentos = [];
  public parametro: any = '';
  public idfrecuencia: any = '';
  public idPruebaBondad: number;
  public miCodigos: number;
  public listaresultados = [] as any;
  public fechaActualMensual: string;
  public fechaActualHora: string;
  public fecha: string;
  public fechaAno: number;
  public fechaFinal: string;
  public fechaAnoFin: number;
  public fechaMesFin: string;
  public fechaActual: string;
  public aprobada: boolean = false;
  public reprobada: boolean = false;
  public resultadoDevil: boolean = false;
  public resultadoFuerte: boolean = false;
  public resultadoModerado: boolean = false;
  public esKolmogorov: boolean = false;
  public esChi2: boolean = false;
  public esVCramer: boolean = false;
  public idReduccion: any;
  public idDistribucion: string;
  public informacion: string;
  public miNombreEstaciones: any;
  public miNombreFrecuencia: any;
  public miNombreParametro: any;
  public valorEsperados: any[] = [];
  public valoresObservados: any[] = [];
  public valoresSuperiores: any[] = [];
  public frecuenciaObservada: any[] = [];
  public intervalo: any[] = [];
  public valorEstadistico: any[] = [];
  public totalEstadistico: any[] = [];
  public estadistico: number;
  public valorRaiz: any[] = [];
  public relativa: any[] = [];
  public foro: any[] = [];
  public fora_fera: any[] = [];

  public fera: any[] = [];

  public limiteSuperior: any[] = [];
  public idAlgoritmos: number;
  public resultado: any;
  public formulaAprobado: string;
  public formulaReprobado: any;
  public texto1: string;
  public texto2: string;
  public texto3: string;
  public texto4: string;
  public texto5: string;
  public formulaCramer: string;
  public valorSignificancia: number;
  public idOperacion: number;
  public listaPrueba: any[] = [];

  //fechas
  public listAnos: any = [
    { id: 0, text: 'Seleccione' },
    { id: 2018, text: '2018' },
    { id: 2019, text: '2019' },
    { id: 2020, text: '2020' },
    { id: 2021, text: '2021' },
    { id: 2022, text: '2022' },
    { id: 2023, text: '2023' },
    { id: 2024, text: '2024' },
    { id: 2025, text: '2025' },
    { id: 2026, text: '2026' },
    { id: 2027, text: '2027' },
    { id: 2028, text: '2028' },
  ];

  columnas = [
    { title: 'Fecha', data: 'fechaCalculada' },
    { title: 'Valor observado', data: 'valorEsperado' }
  ];

  public listaReduccion: any[] = [
    {
      id: 0.01,
      text: '1%',
      disabled: false,
    }, {
      id: 0.02,
      text: '2%',
      disabled: false,
    }, {
      id: 0.05,
      text: '5%',
      disabled: false,
    }, {
      id: 0.1,
      text: '10%',
      disabled: false,
    }
  ];

  public listaFuncionDis: any[] = [
    {
      id: 'chi',
      text: 'Chi Cuadrado',
      codigo: 1,
      disabled: false,
    }, {
      id: 'exponential',
      text: 'Exponencial',
      codigo: 2,
      disabled: false,
    }, {
      id: 'gamma',
      text: 'Gama',
      codigo: 3,
      disabled: false,
    }, {
      id: 'lognormal',
      text: 'Log-Normal',
      codigo: 4,
      disabled: false,
    }, {
      id: 'normal',
      text: 'Normal',
      codigo: 5,
      disabled: false,
    }, {
      id: 'pareto-type1',
      text: 'Pareto',
      codigo: 6,
      disabled: false,
    }, {
      id: 'uniform',
      text: 'Uniforme',
      codigo: 7,
      disabled: false,
    }
  ];
  
  
 LimiteSuperior: any;

  constructor(
    private serviciosParametrosService: ServiciosParametrosService,
    private formBuilder: FormBuilder,
    private serviciosCapasService: ServiciosCapasService,
    private serviciosEstacionesService: ServiciosEstacionesService,
    private serviciosDominiosValoresService: ServiciosDominiosValoresService,
    private serviciosGeograficosService: ServiciosGeograficosService,
    private serviciosObservacionesEstacionService: ServiciosObservacionesEstacionService,
    private sercioparametrosestacion: ServiciosParametrosEstacionesService,
  ) {
    // Esto es intencional
  }

  ngOnInit(): void {
  
  
    this.construirFormulario();
    
    this.obtenerElementos(466, () => {
      this.cargarDatos(() => {
        this.cargarAreaHidrografica(() => {
          this.cargarZonaHidrografica(() => {
            this.cargarSubZonaHidrografica(() => {
              this.cargarCuenca(() => {
                this.cargarSubcuenca();
              });
            });
          });
        });
      });
    });
    
    this.onChanges();

    //fechas
    var fecha = new Date(); //Fecha actual
    var mes: any = fecha.getMonth() + 1; //obteniendo mes
    var dia: any = fecha.getDate(); //obteniendo dia
    var ano: any = fecha.getFullYear();

    if (dia < 10) {
      dia = '0' + dia; //agrega cero si el menor de 10
    }
    if (mes < 10) {
      mes = '0' + mes;
    }

    this.fechaActual = ano + '-' + mes + '-' + dia;
  }

  regresar(){
    location.reload();
  }

  assertNullAndUndefined(value: any): boolean {
    if (null == value || undefined == value) {
      return false;
    }

    return true;
  }

  actualizarFrecuencia(event: any) {
    if (!this.assertNullAndUndefined(event) || 0 == event.length) {
      return;
    }

    let parametros = this.listParametro.filter(param => {
      return param.id === parseInt(event);
    });

    if (!this.assertNullAndUndefined(parametros) || parametros.length < 1) {
      return;
    }

    let miParametro = parametros[0];

    let frecuencias = this.listaFrecuencia.filter(frecuencia => {
      return miParametro.idPeriodo === frecuencia.id;
    });

    if (!this.assertNullAndUndefined(frecuencias) || frecuencias.length < 1) {
      return;
    }

    this.idfrecuencia = frecuencias[0].id;

    console.log('-- ------------------------------------------------------');
    console.log('Parametro seleccionado: ' + JSON.stringify(miParametro));
    console.log('Frecuencia seleccionada: ' + JSON.stringify(frecuencias[0]));
    console.log('-- ------------------------------------------------------');
  }

  cargarDatos( callback : Function) {
    Swal.fire({
      title: 'Cargando parámetros, departamentos, entidades y periodos...',
      html: 'Por favor espere',
      timer: 42000, 
      timerProgressBar: true, 
      allowOutsideClick: false,
      didOpen: async() => {
        Swal.showLoading();

        // Parámetros
        this.serviciosParametrosService.pametroOrigen().subscribe((response) => {
          this.listParametro = response;

          // Departamentos
          this.serviciosGeograficosService.obtenerDepartamentos().subscribe((response) => {
              this.listaDepartamentos = response;

              // entidad
              this.serviciosDominiosValoresService.obtenerValoresPorIdDominio(dominiosEnum.Entidad).subscribe((response) => {
                  this.listaEntidad = response;

                  // Tipo Elemento
                  this.serviciosDominiosValoresService.obtenerValoresPorIdDominio(dominiosEnum.TipoElemento).subscribe((response) => {
                      this.listaElementos = response;

                      // frecuencia
                      this.serviciosDominiosValoresService.obtenerTotalValoresPorIdDominio(dominiosEnum.Periodos).subscribe((response) => {
                          this.listaFrecuencia = response;

                          Swal.close();
                          callback();
                        });
                    });
                });
            });
        });
      }, 
      willClose: async() => {
        Swal.hideLoading();
      }
    });
  }

  onChanges(): void {
    this.areaHidrografica?.valueChanges.subscribe((val) => {
      this.cargarZonaHidrografica(() => {});
    });

    this.zonaHidrografica?.valueChanges.subscribe((val) => {
      this.cargarSubZonaHidrografica(() => {});
    });

    this.subZonaHidrografica?.valueChanges.subscribe((val) => {
      this.cargarCuenca(() => {});
    });

    this.cuenca?.valueChanges.subscribe((val) => {
      this.cargarSubcuenca();
    });

    this.subcuenca?.valueChanges.subscribe((val) => {
      this.cargarMicroCuenca();
    });
  }

  cargarAreaHidrografica(callback : Function) {
    Swal.fire({
      title: 'Cargando áreas hidrográficas...', 
      html: 'Por favor espere.', 
      timer: 42000, 
      timerProgressBar: true, 
      allowOutsideClick: false, 
      didOpen: async() => {
        Swal.showLoading();
        
        this.serviciosCapasService.obtenerPorId(capasEnum.SubZonaHidrografica).subscribe((response) => {
          this.serviciosGeograficosService.consultarDatosCapa(response.urlConsulta,'1=1','CODAH,NOMBAH',true,'NOMBAH').then((response: any) => {
            let datos = response.features.map((f: any) => f.attributes).map((zh: any) => {
              return { id: zh.CODAH, text: zh.NOMBAH };
            });

            this.listaAreaHidrografica = datos;

            Swal.close();
            callback();
          });
      });
      }, 
      willClose: async() => {
        Swal.hideLoading();
      }
    });
  }

  cargarZonaHidrografica(callback : Function) {
    if ( !this.assertNullAndUndefined(this.areaHidrografica) || !this.assertNullAndUndefined(this.areaHidrografica?.value) ) {
      return;
    }

    Swal.fire({
      title: 'Cargando Zonas hidrográficas...', 
      html: 'Por favor espere.', 
      timer: 42000, 
      timerProgressBar: true, 
      allowOutsideClick: false, 
      didOpen: async() => {
        Swal.showLoading();

        this.serviciosCapasService.obtenerPorId(capasEnum.SubZonaHidrografica).subscribe((response) => {  
          this.serviciosGeograficosService.consultarDatosCapa(response.urlConsulta, 'CODAH=' + this.areaHidrografica?.value, 'CODZH,NOMBZH', true, 'NOMBZH').then((response: any) => {
            let datos = response.features.map((f: any) => f.attributes).map((zh: any) => {
              return { id: zh.CODZH, text: zh.NOMBZH };
            });
            
            this.listaZonaHidrografica = datos;

            Swal.close();
            callback();
          });
        });
      }, 
      willClose: async() => {
        Swal.hideLoading();
      }
    });
  }

  cargarSubZonaHidrografica(callback : Function) {
    if ( !this.assertNullAndUndefined(this.zonaHidrografica) || !this.assertNullAndUndefined(this.zonaHidrografica?.value) ) {
      return;
    }

    Swal.fire({
      title: 'Cargando Sub-zonas hidrográficas...', 
      html: 'Por favor espere.', 
      timer: 42000, 
      timerProgressBar: true, 
      allowOutsideClick: false, 
      didOpen: async() => {
        Swal.showLoading();

        this.serviciosCapasService.obtenerPorId(capasEnum.SubZonaHidrografica).subscribe((response) => {
          this.serviciosGeograficosService.consultarDatosCapa(response.urlConsulta, 'CODZH=' + this.zonaHidrografica?.value, 'CODSZH,NOMBSZH', true, 'NOMBSZH').then((response: any) => {
              let datos = response.features.map((f: any) => f.attributes).map((zh: any) => {
                return { id: zh.CODSZH, text: zh.CODSZH + '-' + zh.NOMBSZH };
              });
              
              this.listaSubzonaHidrografica = datos;

              Swal.close();
              callback();
            });
        });
      }, 
      willClose: async() => {
        Swal.hideLoading();
      }
    });      
  }

  cargarCuenca(callback : Function) {
    if ( !this.assertNullAndUndefined(this.subZonaHidrografica) || !this.assertNullAndUndefined(this.subZonaHidrografica?.value) ) {
      return;
    }

    Swal.fire({
      title: 'Cargando cuencas...', 
      html: 'Por favor espere.', 
      timer: 42000, 
      timerProgressBar: true, 
      allowOutsideClick: false, 
      didOpen: async() => {
        Swal.showLoading();

        this.serviciosCapasService.obtenerPorId(capasEnum.Cuenca).subscribe((response) => {
          this.serviciosGeograficosService.consultarDatosCapa(response.urlConsulta, 'CODSZH=' + this.subZonaHidrografica?.value, 'CODCH,NOMBCH', true, 'NOMBCH').then((response: any) => {
            let datos = response.features.map((f: any) => f.attributes).map((zh: any) => {
              return { id: zh.CODCH, text: zh.NOMBCH };
            });
            
            this.listaCuenca = datos;

            Swal.close();
            callback();
          });
        });
      }, 
      willClose: async() => {
        Swal.hideLoading();
      }
    });
  }

  cargarSubcuenca() {
    if ( !this.assertNullAndUndefined(this.cuenca) || !this.assertNullAndUndefined(this.cuenca?.value) ) {
      return;
    }

    Swal.fire({
      title: 'Cargando sub-cuencas...', 
      html: 'Por favor espere.', 
      timer: 42000, 
      timerProgressBar: true, 
      allowOutsideClick: false, 
      didOpen: async() => {
        Swal.showLoading();

        this.serviciosCapasService.obtenerPorId(capasEnum.Subcuenca).subscribe((response) => {
          this.serviciosGeograficosService.consultarDatosCapa(response.urlConsulta, 'CODCH=' + this.cuenca?.value, 'CODSCH,NOMSCH', true, 'NOMSCH').then((response: any) => {
            let datos = response.features.map((f: any) => f.attributes).map((zh: any) => {
              return { id: zh.CODSCH, text: zh.NOMSCH };
            });
            
            this.listaSubcuenca = datos;

            Swal.close();
          });
        });
      }, 
      willClose: async() => {
        Swal.hideLoading();
      }
    });
  }

  cargarMicroCuenca() {
    if ( !this.assertNullAndUndefined(this.subcuenca) || !this.assertNullAndUndefined(this.subcuenca?.value) ) {
      return;
    }

    Swal.fire({
      title: 'Cargando microcuencas...', 
      html: 'Por favor espere.', 
      timer: 42000, 
      timerProgressBar: true, 
      allowOutsideClick: false, 
      didOpen: async() => {
        Swal.showLoading();

        this.serviciosCapasService.obtenerPorId(capasEnum.Microcuenca).subscribe((response) => {
          this.serviciosGeograficosService.consultarDatosCapa(response.urlConsulta, 'CODSCH=' + this.subcuenca?.value, 'CODMC,NOMBMC', true, 'NOMBMC').then((response: any) => {
            let datos = response.features.map((f: any) => f.attributes).map((zh: any) => {
              return { id: zh.CODMC, text: zh.NOMBMC };
            });
            
            this.listaMicrocuenca = datos;

            Swal.close();
          });
        });
      }, 
      willClose: async() => {
        Swal.hideLoading();
      }
    });
  }

  get areaHidrografica() {
    return this.formularioConsulta.get('idAreaHidrografica');
  }
  get zonaHidrografica() {
    return this.formularioConsulta.get('idZonaHidrografica');
  }
  get subZonaHidrografica() {
    return this.formularioConsulta.get('idSubZonaHidrografica');
  }
  get cuenca() {
    return this.formularioConsulta.get('idCuenca');
  }
  get subcuenca() {
    return this.formularioConsulta.get('idSubCuenca');
  }
  get microCuenca() {
    return this.formularioConsulta.get('idMicroCuenca');
  }
  get fechaInicio() {
    return this.formularioConsulta.get('fechaInicio');
  }
  get fechaInicio1() {
    return this.formularioConsulta.get('fechaInicio1');
  }
  get fechaFin() {
    return this.formularioConsulta.get('fechaFin');
  }
  get fechaFin1() {
    return this.formularioConsulta.get('fechaFin1');
  }
  get idParametro() {
    return this.formularioConsulta.get('idParametro');
  }
  get idParametroAgregar() {
    return this.formularioConsulta.get('idParametroAgregar');
  }
  get idCodigoEAABAgregar() {
    return this.formularioConsulta.get('idCodigoEAABAgregar');
  }
  get idCodigoIDEAMAgregar() {
    return this.formularioConsulta.get('idCodigoIDEAMAgregar');
  }
  get idCodigoIDEAM() {
    return this.formularioConsulta.get('idCodigoIDEAM');
  }
  get idCodigoEAAB() {
    return this.formularioConsulta.get('idCodigoEAAB');
  }
  get frecuencia() {
    return this.formularioConsulta.get('frecuencia');
  }
  get frecuenciaAgregar() {
    return this.formularioConsulta.get('frecuenciaAgregar');
  }
  get fcIdReduccion() {
    return this.formularioConsulta.get('idReduccionFC');
  }
  get fcIdDistribucion() {
    return this.formularioConsulta.get('idDistribucionFC');
  }

  private construirFormulario() {
    this.formularioConsulta = this.formBuilder.group({
      idElemento: ['', [Validators.required]],
      idElementoAgregar: [''],
      idCodigoIDEAM: [''],
      idCodigoEAAB: [''],
      idCodigoIDEAMAgregar: [''],
      idCodigoEAABAgregar: [''],
      nombreCorriente: [''],
      idDepartamento: [''],
      idAreaHidrografica: [],
      idZonaHidrografica: [],
      idSubZonaHidrografica: [],
      idCuenca: [],
      idSubCuenca: [],
      idMunicipio: [''],
      areaHidrografica: [''],
      zonaHidrografica: [''],
      subZonaHidrografica: [''],
      cuenca: [''],
      subCuenca: [''],
      microcuenca: [''],
      tipo: [''],
      aforador: [''],

      idtipoAforo: [''],
      fechaInicio: [''],
      idReduccionFC: ['', [Validators.required]],
      fechaFin: [''],
      idEntidad: [''],
      frecuencia: [''],
      idParametro: ['', [Validators.required]],
      idDistribucionFC: [''],
    });
  }

  //cancelar el modal 
  onCancelarModal() {
    let myForm: any = document.getElementById('modalForm');
    myForm.reset();
  }

  obtenerElementos(even: any, callback : Function) {
    if ( !this.assertNullAndUndefined(even) ) {
      return;
    }

    this.idTipoElemento = even;
    this.listaElemento = [];
    this.listaCodigoEAAB = [];
    this.listaCodigoIDEAM = [];

    switch (even) {
      case 466: {
        Swal.fire({
          title: 'Cargando información...',
          html: 'Por favor espere',
          timerProgressBar: true,
          timer: 42000,
          didOpen: async () => {
            Swal.showLoading();
            
            this.serviciosEstacionesService.obtenerEstaciones().subscribe((response) => {
                this.listaCodigoEAAB = response.filter((element => element.codigoEstacionEaab != null)).map((elemento: any) => ({
                  id: elemento.idEstacion,
                  text: elemento.codigoEstacionEaab,
                  disabled: elemento.activo == 'S' ? false : true,
                }));

                this.listaCodigoIDEAM = response.filter((element => element.codigoEstacionIdeam != null)).map((elemento: any) => ({
                  id: elemento.idEstacion,
                  text: elemento.codigoEstacionIdeam,
                  disabled: elemento.activo == 'S' ? false : true,
                }));

                this.listaElemento = response.map((elemento: any) => ({
                  id: elemento.idEstacion,
                  text: elemento.estacion,
                  disabled: elemento.activo == 'S' ? false : true,
                }));

                Swal.close();
                callback();
              });
          },
          willClose: async () => {
            Swal.hideLoading();
          }
        }
        );
        break;
      }

      default: {
        break;
      }
    }
  }



 centile(mean:any, SD:any, val:any)
{
   var  z = (val-mean)/SD;
   var ans = this.NORMSDIST(z);
    return ans;
}

 erf(x:any)
{
    //A&S formula 7.1.26
  
  var ans = 0;
    var a1 = 0.254829592;
    var a2 = -0.284496736;
    var a3 = 1.421413741;
    var a4 = -1.453152027;
    var a5 = 1.061405429;
    var p = 0.3275911;
    x = Math.abs(x);
    var t = 1 / (1 + p * x);
    //Horner's method, takes O(n) operations for nth order polynomial
    ans = 1 - ((((((a5 * t + a4) * t) + a3) * t + a2) * t) + a1) * t * Math.exp(-1 * x * x);
    return ans; 
}

 NORMSDIST(z:any)
{
    var ans = 0;
    var sign = 1;
    if (z < 0) sign = -1;
    ans = 0.5 * (1.0 + sign * this.erf(Math.abs(z)/Math.sqrt(2)));
    return ans;
}


  obtener() {
    this.fechainicio = this.formularioConsulta.value.fechaInicio;
    this.Fechafin = this.formularioConsulta.value.fechaFin;

    if ( this.esChi2 &&
      (null == this.idReduccion || undefined == this.idReduccion || this.idReduccion.length <= 0) ) {
      return;
    }

    if (this.esKolmogorov &&
      (null == this.idDistribucion || undefined == this.idDistribucion || this.idDistribucion.length <= 0)) {
      return;
    }

    if ( ((this.esVCramer &&
      (null == this.idReduccion || undefined == this.idReduccion || this.idReduccion.length <= 0))) || 
      
      (this.esVCramer &&
      (null == this.idDistribucion || undefined == this.idDistribucion || this.idDistribucion.length <= 0)) ) {
      return;
    }

    //2023-01
    if ( null!=this.fechainicio && undefined!=this.fechainicio ) {
      let fechaInicioHypeCounter = 0;
      for ( let index=0; index<this.fechainicio.length; index++ ) {
        if ( this.fechainicio.charAt(index) === '-' ) {
          fechaInicioHypeCounter++;
        }
      }

      if ( fechaInicioHypeCounter != 2 ) {
        this.fechainicio += '-01';
      }
    }

    if ( null!=this.Fechafin && undefined!=this.Fechafin ) {
      let fechaFinHypeCounter = 0;
      for ( let index=0; index<this.Fechafin.length; index++ ) {
        if ( this.Fechafin.charAt(index) === '-' ) {
          fechaFinHypeCounter++;
        }
      }

      if ( fechaFinHypeCounter!=2  && this.Fechafin.includes('-') ) {
        let fechaTokens = this.Fechafin.split('-');
        if ( null!=fechaTokens && undefined!=fechaTokens && fechaTokens.length>=2 ) {
          let year = fechaTokens[0];
          let month = fechaTokens[1];

          let fecha = new Date(parseInt(year), parseInt(month)-1, 0);
          this.Fechafin += '-' + fecha.getDate();
        }
      }
    }

    switch (this.idPruebaBondad) {
      case 1:
        // Chi2
        Swal.fire({
          title: 'Cargando información...',
          html: 'Por favor espere',
          timerProgressBar: true,
          timer: 42000,
          didOpen: async () => {
            Swal.showLoading();

            console.log('-- -----------------------------');
            console.log('fechaInicio: ' + this.fechainicio);
            console.log('fechaFin: ' + this.Fechafin);
            console.log('idParametro: ' + this.parametro);
            console.log('idEstacion: ' + this.idElemento);
            console.log('Estacion: ' + this.estacion);
            console.log('-- -----------------------------');

            if (null == this.fechaInicio || undefined == this.fechainicio ||
              null == this.fechaFin || undefined == this.Fechafin ||
              null == this.idParametro || undefined == this.parametro ||
              null == this.idElemento || undefined == this.idElemento
            ) {
              Swal.close();
              alert('Datos solicitados NO validos');
              console.error('Datos solicitados NO validos');
              return;
            }

            // para sacar el promedio
            this.idOperacion = 909;

            //datos del parametro

            let miParametroId: any = this.parametro;
            let misParametros = this.listParametro.filter(param => {
              return parseInt(param.id) === parseInt(miParametroId);
            });

            if (undefined == misParametros || null == misParametros || 0 == misParametros.length) {
              console.error("Parametro no valido con ID: " + this.parametro);
              Swal.close();
              return;
            }

            let miCodigo = misParametros[0].codigo;

            this.miNombreParametro = misParametros[0].text

            if (undefined == miCodigo || null == miCodigo) {
              console.error("Parametro no valido con codigo: " + miCodigo);
              Swal.close();
              return;
            }

            //datos de la estacion
            let miEstacionId: any = this.idElemento;
            let misEstaciones = this.listaElemento.filter((param: { id: string; }) => {
              return parseInt(param.id) === parseInt(miEstacionId);
            });

            if (undefined == misEstaciones || null == misEstaciones || 0 == misEstaciones.length) {
              console.error("Estaciones no valido con ID: " + this.idElemento);
              Swal.close();
              return;
            }

            let miNombreEstaciones = misEstaciones[0].text

            //datos de la frecuencia
            let miFrecuenciaId: any = this.idfrecuencia;
            let misFrecuencias = this.listaFrecuencia.filter((param: { id: string }) => {
              return parseInt(param.id) === parseInt(miFrecuenciaId);
            })

            if (undefined == misFrecuencias || null == misFrecuencias || 0 == misFrecuencias.length) {
              console.error("Estaciones no valido con ID: " + this.idfrecuencia);
              Swal.close();
              return;
            }

            let miNombreFrecuencia = misFrecuencias[0].text

            //2023-01
            if ( null!=this.fechainicio && undefined!=this.fechainicio ) {
              let fechaInicioHypeCounter = 0;
              for ( let index=0; index<this.fechainicio.length; index++ ) {
                if ( this.fechainicio.charAt(index) === '-' ) {
                  fechaInicioHypeCounter++;
                }
              }

              if ( fechaInicioHypeCounter != 2 ) {
                this.fechainicio += '-01';
              }
            }

            if ( null!=this.Fechafin && undefined!=this.Fechafin ) {
              let fechaFinHypeCounter = 0;
              for ( let index=0; index<this.Fechafin.length; index++ ) {
                if ( this.Fechafin.charAt(index) === '-' ) {
                  fechaFinHypeCounter++;
                }
              }

              if ( fechaFinHypeCounter!=2  && this.Fechafin.includes('-') ) {
                let fechaTokens = this.Fechafin.split('-');
                if ( null!=fechaTokens && undefined!=fechaTokens && fechaTokens.length>=2 ) {
                  let year = fechaTokens[0];
                  let month = fechaTokens[1];
    
                  let fecha = new Date(parseInt(year), parseInt(month)-1, 0);
                  this.Fechafin += '-' + fecha.getDate();
                }
              }
            }

            let reques: IPruebaBondadGeneralRequest = {
              fechaInicio: this.fechainicio,
              fechaFin: this.Fechafin,
              //idParametro: this.parametro,
              codigo: parseInt(miCodigo),
              idElemento: this.idElemento,
              idFrecuencia: this.idfrecuencia,
              idOperacion: this.idOperacion,

            };

            this.miCodigos = parseInt(miCodigo);
            this.listaresultados.push(reques)

            console.log('-- -----------------------------');
            console.log('fechaInicio: ' + this.fechainicio);
            console.log('fechaFin: ' + this.Fechafin);
            console.log('idParametro: ' + [this.parametro]);
            console.log('codigoParametro: ' + miCodigo);
            console.log('idEstacion: ' + this.idElemento);
            console.log('idFrecuencia: ' + this.idfrecuencia);
            console.log('idOperacion: ' + this.idOperacion);
            console.log('Descripcion de parametro: ' + this.miNombreParametro);
            console.log('Descripcion de parametro: ' + miNombreFrecuencia);
            console.log('Estacion : ' + miNombreEstaciones);
            console.log('reduccion :' + this.idReduccion);
            console.log('-- -----------------------------');

            //promedio

            this.serviciosObservacionesEstacionService.obtenerValorPruebaBondad(reques)
              .subscribe((response: IResultadoPrueba[]) => {
                this.datosFilter = response;

                let fechasPrueba: any[] = response.map(observ => {
                  return observ.fechaCalculada;
                });

                this.valorEsperados = response.map(observ => {
                  return observ.valorEsperado;
                });

                this.serviciosObservacionesEstacionService.obtenerValorListas(reques)
                  .subscribe((response: IPruebaBondadGeneralResponse[]) => {

                    this.intervalo = response.map(observ => {
                      return observ.intervalo;
                    });

                    this.frecuenciaObservada = response.map(observ => {
                      return observ.frecuenciaObservada;
                    });;

                    this.valorEstadistico = response.map(observ => {
                      return observ.estadistico;
                    })

                    this.totalEstadistico = this.valorEstadistico.reduce((a, b) => a + b, 0)

                    console.log("-----------------------------------------")
                    console.log("el valor estadistico es:", this.totalEstadistico)
                    console.log("-----------------------------------------")

                  });

                  this.chartOptions = {
                    series: [
                      {
                        name: 'La fecha es: ' + fechasPrueba[0] + ' con un promedio de ',
                        data: this.valorEsperados,
                      }
                    ],
                    chart: {
                      height: 450,
                      type: "bar"
                    },
                    plotOptions: {
                      bar: {
                        columnWidth: "50%",
                        endingShape: "rounded"
                      }
                    },
                    dataLabels: {
                      enabled: false
                    },
                    xaxis: {
                      labels: {
                        rotate: -40
                      },
                      categories: fechasPrueba,
                      tickPlacement: "on",

                    },
                    yaxis: {
                      title: {
                        text: "m m"
                      }
                    },
                    title: {
                      text: this.miNombreParametro + ' con una frecuencia ' + miNombreFrecuencia,
                      offsetY: 10,
                      align: "center",
                      style: {
                        color: "#444"
                      }
                    }
                  };

                  //chi cuadrado implementacion
                  console.log('-- ------------------------------');
                  console.log('Resultados  Chi Cuadrado');
                  console.log('valor observado', this.valoresObservados);
                  console.log('Valor esperado', this.valorEsperados);
                  console.log('Fecha', fechasPrueba);
                  console.log('-- ------------------------------');

                  //let reduction = 1;
                  let reduction = this.valoresObservados.length - 1;
                  console.log('Reduccion', reduction);
                  
                  this.valorSignificancia = this.idReduccion / 100
                  console.log('Valor de Significancia: ', this.valorSignificancia);

                  let result = chiSquaredTest(this.valoresObservados, this.valorEsperados, reduction);
                  this.resultado = result.probability;

                  console.log('-- ------------------------------');
                  console.log('Resultados  Chi Cuadrado', result);
                  console.log('-- ------------------------------');
                  /*
                  const testres1 = ChiSqTest.gof(this.valoresObservados, this.valorEsperados, reduction);
                  console.log('-- ------------------------------');
                  console.log('Resultados  Chi Cuadrado 2.0', testres1);
                  console.log('-- ------------------------------');
                  */
                  this.miNombreEstaciones = miNombreEstaciones
                 
                  this.aprobada = this.resultado < this.valorSignificancia;
                  this.reprobada = this.resultado > this.valorSignificancia;

                  this.valoresObservados = this.valoresObservados
                  this.valorEsperados = this.valorEsperados

                  for (let  i = 0; i <   this.datosFilter.length; i++) {
                    this.datosFilter[i].promedio =  this.datosFilter[i].promedio.toFixed(3);
                  }
                  
                  for (let  i = 0; i <   this.datosFilter.length; i++) {
                    this.datosFilter[i].valorEsperado =  this.datosFilter[i].valorEsperado.toFixed(3);
                  }

                  console.log('Chi2 Probabilidad: ' + this.resultado);
                  
                  this.formulaReprobado = 'X²p > X²c'
                  this.formulaAprobado = 'X²p < X²c'
                  this.texto1 = 'X²= Estadistico de prueba (Chi Cuadrado).'
                  this.texto2 = 'fo= Frecuencia observada.Es el valor encontrado en el campo es decir, el numero de veces que se observo determinado nivel de la variable categoria.'
                  this.texto3 = 'fe = Frecuencia experada. Es el que se esperaba obtener en la investigacion, se calcula multiplicando el total de la columna por el total del renglon de la tabla de cotingencia y el resultado se obtiene entre el tamaño de la muestra "n".'
                  this.informacion = 'Chi Cuadrado'

                  console.log('esta es la informacion', this.informacion)

                  let todo: any = {
                    fechaPrueba: fechasPrueba,
                    descripcion: this.miNombreParametro,
                    estacion: this.miNombreEstaciones,
                    todos: this.resultado,
                    fechaFi: this.Fechafin,
                    fechaIn: this.fechainicio,
                    reduccion: this.idReduccion,
                    valorSignificancia: this.valorSignificancia,
                    informacion: this.informacion,
                    formulaAprobado: this.formulaAprobado,
                    formulaReprobado: this.formulaReprobado,
                    texto1: this.texto1,
                    texto2: this.texto2,
                    texto3: this.texto3,
                  }

                  this.listaPrueba.push(todo);
                  this.idAlgoritmos = 1027;

                  Swal.close();
                }
              );
          },
          willClose: async () => {
            Swal.hideLoading();
          }
        }
        );
        break;

      case 2: {
        // Kolmogorov
        Swal.fire({
          title: 'Cargando información...',
          html: 'Por favor espere',
          timerProgressBar: true,
          timer: 42000,
          didOpen: async () => {
            Swal.showLoading();
  
            let miParametroId: any = this.parametro;
            let misParametros = this.listParametro.filter(param => {
              return parseInt(param.id) === parseInt(miParametroId);
            });

            if (undefined == misParametros || null == misParametros || 0 == misParametros.length) {
              console.error("Parametro no valido con ID: " + this.parametro);
              Swal.close();
              return;
            }

            let miCodigo = misParametros[0].codigo;

            this.miNombreParametro = misParametros[0].text

            if (undefined == miCodigo || null == miCodigo) {
              console.error("Parametro no valido con codigo: " + miCodigo);
              Swal.close();
              return;
            }



            //datos de la estacion
            let miEstacionId: any = this.idElemento;
            let misEstaciones = this.listaElemento.filter((param: { id: string; }) => {
              return parseInt(param.id) === parseInt(miEstacionId);
            });

            if (undefined == misEstaciones || null == misEstaciones || 0 == misEstaciones.length) {
              console.error("Estaciones no valido con ID: " + this.idElemento);
              Swal.close();
              return;
            }

            let miNombreEstaciones = misEstaciones[0].text

            //datos de la frecuencia
            let miFrecuenciaId: any = this.idfrecuencia;
            let misFrecuencias = this.listaFrecuencia.filter((param: { id: string }) => {
              return parseInt(param.id) === parseInt(miFrecuenciaId);
            })

            if (undefined == misFrecuencias || null == misFrecuencias || 0 == misFrecuencias.length) {
              console.error("Estaciones no valido con ID: " + this.idfrecuencia);
              Swal.close();
              return;
            }

            let miNombreFrecuencia = misFrecuencias[0].text

            //2023-01
            if ( null!=this.fechainicio && undefined!=this.fechainicio ) {
              let fechaInicioHypeCounter = 0;
              for ( let index=0; index<this.fechainicio.length; index++ ) {
                if ( this.fechainicio.charAt(index) === '-' ) {
                  fechaInicioHypeCounter++;
                }
              }

              if ( fechaInicioHypeCounter != 2 ) {
                this.fechainicio += '-01';
              }
            }




            if ( null!=this.Fechafin && undefined!=this.Fechafin ) {
              let fechaFinHypeCounter = 0;
              for ( let index=0; index<this.Fechafin.length; index++ ) {
                if ( this.Fechafin.charAt(index) === '-' ) {
                  fechaFinHypeCounter++;
                }
              }

              if ( fechaFinHypeCounter!=2  && this.Fechafin.includes('-') ) {
                let fechaTokens = this.Fechafin.split('-');
                if ( null!=fechaTokens && undefined!=fechaTokens && fechaTokens.length>=2 ) {
                  let year = fechaTokens[0];
                  let month = fechaTokens[1];
    
                  let fecha = new Date(parseInt(year), parseInt(month)-1, 0);
                  this.Fechafin += '-' + fecha.getDate();
                }
              }
            }

            let reques: IPruebaBondadGeneralRequest = {
              fechaInicio: this.fechainicio,
              fechaFin: this.Fechafin,
              //idParametro: this.parametro,
              codigo: parseInt(miCodigo),
              idElemento: this.idElemento,
              idFrecuencia: this.idfrecuencia,
              idOperacion: this.idOperacion,

            };

            this.miCodigos = parseInt(miCodigo);
            this.listaresultados.push(reques)

            console.log('-- -----------------------------');
            console.log('fechaInicio: ' + this.fechainicio);
            console.log('fechaFin: ' + this.Fechafin);
            console.log('idParametro: ' + [this.parametro]);
            console.log('codigoParametro: ' + miCodigo);
            console.log('idEstacion: ' + this.idElemento);
            console.log('idFrecuencia: ' + this.idfrecuencia);
            console.log('idOperacion: ' + this.idOperacion);
            console.log('Descripcion de parametro: ' + this.miNombreParametro);
            console.log('Descripcion de parametro: ' + miNombreFrecuencia);
            console.log('Estacion : ' + miNombreEstaciones);
            console.log('reduccion :' + this.idReduccion);
            console.log('-- -----------------------------');

            this.serviciosObservacionesEstacionService.obtenerValorMax(reques)
            .subscribe((response: IPruebaBondadGeneralResponse[]) => {
              let valorMax: any[] = response.map(observ => {
                let valorMax = observ.valorMaximo;
                return valorMax;
              });
            });

          this.serviciosObservacionesEstacionService.obtenerValorMin(reques)
            .subscribe((response: IPruebaBondadGeneralResponse[]) => {
              let valorMin: any[] = response.map(observ => {
                let valorMin = observ.valorMinimo;
                return valorMin;
              });
            });

          this.serviciosObservacionesEstacionService.obtenerValorRango(reques)
            .subscribe((response: IPruebaBondadGeneralResponse[]) => {
              let valorRango: any[] = response.map(observ => {
                let valorRango = observ.valorRango;
                return valorRango;
              });
            });


          this.serviciosObservacionesEstacionService.obtenerValorCantidad(reques)
            .subscribe((response: IPruebaBondadGeneralResponse[]) => {
              let valorCantidad: any[] = response.map(observ => {
                let valorCantidad = observ.valorCantidad;
                return valorCantidad;
              });
            });

          this.serviciosObservacionesEstacionService.obtenerValorRaiz(reques)
            .subscribe((response: IPruebaBondadGeneralResponse[]) => {
              let valorRaiz: any[] = response.map(observ => {
                let valorRaiz = observ.valorRaiz;
                return valorRaiz; 
              });
            });

          this.serviciosObservacionesEstacionService.obtenerValorIntervalo(reques)
            .subscribe((response: IPruebaBondadGeneralResponse[]) => {
              let valorTamanoIntervalo: any[] = response.map(observ => {
                let valorTamanoIntervalo = observ.valorTamanoIntervalo;
                return valorTamanoIntervalo;
              });
            });

            this.serviciosObservacionesEstacionService.obtenerValorDesviacion(reques)
            .subscribe((response) => {

              this.Desviacion =response;
              let ValorDesviacion: any[] = response.map(observ => {
                let ValorDesviacion = observ.valorDesviacion;
                return ValorDesviacion;
              });
            });


            this.serviciosGeograficosService
            .obtenerMunicipiosPorIdDepartamento(this.tempIdDepartamento)
            .subscribe((response) => {
              this.frecuenciaObservada  = response;
            });


            this.serviciosObservacionesEstacionService.obtenerValorListas(reques)
            .subscribe((response: IPruebaBondadGeneralResponse[]) => {

              let intervalo: any[] = response.map(observ => {
                let intervalo = observ.intervalo;
                return intervalo;
              });

              let LimiteInferior = response.map(observ => {
                let LimiteInferior = observ.LimiteInferior;
                return LimiteInferior;
              });

              this.valoresSuperiores = response.map(observ => {
                let valoresPrueba = observ.limiteSuperior;
                return valoresPrueba;

              });

             

              this.frecuenciaObservada = response.map(observ => {
                let frecuenciaObservada = observ.frecuenciaObservada;
                return frecuenciaObservada;

              });

          

              const array =  this.frecuenciaObservada
                let sum = 0;

                for (let i = 0; i < array.length; i++) {
                    sum += array[i];
                }
                console.log(sum);


                
                this.relativa  = response.map(observ => {
                  let relativa = observ.frecuenciaObservada/sum;
                  return relativa;
  
                });
                
           

              console.log('-- ------------------------------');
              console.log('valor limite superior: ', this.frecuenciaObservada);
              console.log('-- ------------------------------');

              let request: limiteSuperior = {
                limiteSuperior: this.valoresSuperiores
              };
  
              this.serviciosObservacionesEstacionService.obtenerFrecuenciaObservada(request)
              .subscribe((response: IPruebaBondadGeneralResponse[]) => {
                let frecuenciaObservada: any[] = response.map(observ => {
                  let frecuenciaObservada = observ.frecuenciaObservada;
                  return frecuenciaObservada;
                });
              });

            });



         

            


            //promedio

            this.serviciosObservacionesEstacionService.obtenerValorPrueba(reques)
              .subscribe((response : IPruebaBondadGeneralResponse[]) => {
                this.datosFilter = response;

                var datosFilter  = response.map(observ => {
                  let relativa = observ.valorEsperado
                  return relativa;
  
                });
                
                let sum = 0;

                for (let i = 0; i < datosFilter.length; i++) {
                    sum += datosFilter[i];
                }

                this.promedio = sum/datosFilter.length;

                console.log( this.promedio);

                for (let i = 0; i <  this.relativa.length; i++) {
                 
                  var foro;
                  if(i == 0){
                     foro =  this.relativa[i];
                     this.foro.push(foro);

                     //Desivicion
                    

                  }else{
                      foro =  this.relativa[i] + this.relativa[i-1] 
                      this.foro.push(foro);

                  }

                  
                  var SD:any = this.Desviacion;
                  //media 
                   var mean:any =  this.promedio;
                   var myval = this.valoresSuperiores[i];
                   console.log(55,SD,mean,myval);
                   var answer = this.centile(mean, SD, myval);
                   
                  console.log(answer);
                  console.log(foro);

                   this.fera.push(answer);   

                   var fora_fera = foro  - answer

                   this.fora_fera.push(fora_fera);

                

                

                }

                console.log(55, this.fora_fera); 

                 
                const numeros =  this.fora_fera;

                let max = 0;
                let menos = 0;
                
                for ( let numero of numeros ) {
                
              
                  if (max < numero)
                    max = numero;
                }

                for ( let numero of numeros ) {
                
                  if (menos > numero)
                  menos = numero;
                }
                
                this.resultado =max;

                this.resultadoModerado = 0.2 < this.idReduccion || this.idReduccion <= 0.6;

                this.formulaReprobado = menos+' -  '+max


            


                let fechasPrueba: any[] = response.map(observ => {
                  let fechas = observ.fechaCalculada;
                  return fechas;
                });

                let promedios: number[] = response.map(observ => {
                  let promedio = observ.promedio;
                  return promedio;
                });

                this.valoresObservados = response.map(observ => {
                  let valoresObservadosPrueba = observ.valorObservado;
                  return valoresObservadosPrueba;

                });

                this.valorEsperados= response.map(observ => {
                  let valoresEsperadosPrueba = observ.valorEsperado;
                  return valoresEsperadosPrueba;
                });

                  this.chartOptions = {
                    series: [
                      {
                        name: 'La fecha es: ' + fechasPrueba[0] + ' con un promedio de ',
                        data: this.frecuenciaObservada,
                      }
                    ],
                    chart: {
                      height: 450,
                      type: "bar"
                    },
                    plotOptions: {
                      bar: {
                        columnWidth: "50%",
                        endingShape: "rounded"
                      }
                    },
                    dataLabels: {
                      enabled: false
                    },
                    xaxis: {
                      labels: {
                        rotate: -40
                      },
                      categories: this.LimiteSuperior,
                      tickPlacement: "on",

                    },
                    yaxis: {
                      title: {
                        text: "m m"
                      }
                    },
                    title: {
                      text: this.miNombreParametro + ' con una frecuencia ' + miNombreFrecuencia,
                      offsetY: 10,
                      align: "center",
                      style: {
                        color: "#444"
                      }
                    }
                  };

                  //chi cuadrado implementacion
                  console.log('-- ------------------------------');
                  console.log('Resultados  Chi Cuadrado');
                  console.log('valor observado', this.valoresObservados);
                  console.log('Valor esperado', this.valorEsperados);
                  console.log('Promedio', promedios);
                  console.log('Fecha', fechasPrueba);
                  console.log('-- ------------------------------');

                  //let reduction = 1;
                  let reduction = this.valoresObservados.length - 1;
                  console.log('Reduccion', reduction);
                  //Kolmogorov implementacion

                  console.log('-- ------------------------------');
                  console.log('Resultados KOLMOGOROV');
                  console.log( 33, this.frecuenciaObservada );


                  console.log('-- ------------------------------');

                  this.valoresObservados = this.valoresObservados

                  console.log('Ejecutando Kolmogorov...');

                  let resultado;
                  let alpha = this.idReduccion / 100;

          

                 

                  this.aprobada = this.resultado > this.idReduccion;
                  this.reprobada = this.resultado < this.idReduccion;
                  this.formulaAprobado = 'Dn > K-S'
                  this.formulaReprobado = 'Dn < K-S'
                  this.texto1 = 'a: Valor de significancia.'
                  this.texto2 = 'N: numero de datos de la serie.'
                  this.texto3 = 'K-S: Valor critico (tabla).'
                  this.texto4 = 'Dn: Desviacion maxima adsoluta.'
                  this.informacion = 'Kolmogorov'

                  let todo: any = {
                    fechaPrueba: fechasPrueba,
                    descripcion: this.miNombreParametro,
                    estacion: this.miNombreEstaciones,
                    fechaFi: this.Fechafin,
                    fechaIn: this.fechainicio,
                    reduccion: this.idReduccion,
                    informacion: this.informacion,
                    todos: this.resultado,
                    texto1: this.texto1,
                    texto2: this.texto2,
                    texto3: this.texto3,
                    texto4: this.texto4,
                    texto5: this.texto5,
                    distribucion: this.idDistribucion
                  }

                  this.listaPrueba.push(todo);
                  this.idAlgoritmos = 1028

                  for (let  i = 0; i <   this.datosFilter.length; i++) {
                    this.datosFilter[i].promedio =  this.datosFilter[i].promedio.toFixed(3);
                  }
                  
                  for (let  i = 0; i <   this.datosFilter.length; i++) {
                    this.datosFilter[i].valorEsperado =  this.datosFilter[i].valorEsperado.toFixed(3);
                  }

                  Swal.close();
                }
              );
          },
          willClose: async () => {
            Swal.hideLoading();
          }
        }
        );
        break;
      }
      case 3: {
        //v de cramer
        Swal.fire({
          title: 'Cargando información...',
          html: 'Por favor espere',
          timerProgressBar: true,
          timer: 42000,
          showConfirmButton: false,
          allowOutsideClick: false,
          didOpen: async () => {
            Swal.showLoading();

            if (null == this.fechaInicio || undefined == this.fechainicio ||
              null == this.fechaFin || undefined == this.Fechafin ||
              null == this.idParametro || undefined == this.parametro ||
              null == this.idElemento || undefined == this.idElemento
            ) {
              console.error('Datos solicitados NO validos');
              Swal.close();
              return;
            }

            // para sacar el promedio
            this.idOperacion = 909;

            //datos del parametro
            let miParametroId: any = this.parametro;
            let misParametros = this.listParametro.filter(param => {
              return parseInt(param.id) === parseInt(miParametroId);
            });

            if (undefined == misParametros || null == misParametros || 0 == misParametros.length) {
              console.error("Parametro no valido con ID: " + this.parametro);
              Swal.close();
              return;
            }

            let miCodigo = misParametros[0].codigo;
            this.miNombreParametro = misParametros[0].text

            if (undefined == miCodigo || null == miCodigo) {
              console.error("Parametro no valido con codigo: " + miCodigo);
              Swal.close();
              return;
            }

            //datos de la estacion
            let miEstacionId: any = this.idElemento;
            let misEstaciones = this.listaElemento.filter((param: { id: string; }) => {
              return parseInt(param.id) === parseInt(miEstacionId);
            });

            if (undefined == misEstaciones || null == misEstaciones || 0 == misEstaciones.length) {
              console.error("Estaciones no valido con ID: " + this.idElemento);
              Swal.close();
              return;
            }

            this.miNombreEstaciones = misEstaciones[0].text

            //datos de la frecuencia
            let miFrecuenciaId: any = this.idfrecuencia;
            let misFrecuencias = this.listaFrecuencia.filter((param: { id: string }) => {
              return parseInt(param.id) === parseInt(miFrecuenciaId);
            });

            if (undefined == misFrecuencias || null == misFrecuencias || 0 == misFrecuencias.length) {
              console.error("Estaciones no valido con ID: " + this.idfrecuencia);
              Swal.close();
              return;
            }

            let miNombreFrecuencia = misFrecuencias[0].text

            

            let reques: any = {
              fechaInicio: this.fechainicio,
              fechaFin: this.Fechafin,
              //idParametro: this.parametro,
              codigo: parseInt(miCodigo),
              idElemento: this.idElemento,
              idFrecuencia: this.idfrecuencia,
              idOperacion: this.idOperacion,
            };

            this.miCodigos = parseInt(miCodigo);
            this.listaresultados.push(reques)

            console.log('-- -----------------------------');
            console.log('fechaInicio: ' + this.fechainicio);
            console.log('fechaFin: ' + this.Fechafin);
            console.log('idParametro: ' + [this.parametro]);
            console.log('codigoParametro: ' + miCodigo);
            console.log('idEstacion: ' + this.idElemento);
            console.log('idFrecuencia: ' + this.idfrecuencia);
            console.log('idOperacion: ' + this.idOperacion);
            console.log('Descripcion de parametro: ' + this.miNombreParametro);
            console.log('Descripcion de parametro: ' + miNombreFrecuencia);
            console.log('Estacion : ' + this.miNombreEstaciones);
            console.log('reduccion :' + this.idReduccion);
            console.log('-- -----------------------------');

            // Invocacion servicio que trae valores promedios, observados y esperados...
            this.serviciosObservacionesEstacionService.obtenerValorPrueba(reques)
            .subscribe((response : IPruebaBondadGeneralResponse[]) => {
              this.datosFilter = response;

              let fechasPrueba: any[] = response.map(observ => {
                let fechas = observ.fechaCalculada;
                return fechas;
              });

              let promedios: number[] = response.map(observ => {
                let promedio = observ.promedio;
                return promedio;
              });

              let valoresObservados = response.map(observ => {
                let valoresObservadosPrueba = observ.valorObservado;
                return valoresObservadosPrueba;

              });

              let valoresEsperados= response.map(observ => {
                let valoresEsperadosPrueba = observ.valorEsperado;
                return valoresEsperadosPrueba;
              });

                this.chartOptions = {
                  series: [
                    {
                      name: 'La fecha es: ' + fechasPrueba[0] + ' con un promedio de ',
                      data: promedios,
                    }
                  ],
                  chart: {
                    height: 450,
                    type: "bar"
                  },
                  plotOptions: {
                    bar: {
                      columnWidth: "50%",
                      endingShape: "rounded"
                    }
                  },
                  dataLabels: {
                    enabled: false
                  },
                  xaxis: {
                    labels: {
                      rotate: -40
                    },
                    categories: fechasPrueba,
                    tickPlacement: "on",

                  },
                  yaxis: {
                    title: {
                      text: "m m"
                    }
                  },
                  title: {
                    text: this.miNombreParametro + ' con una frecuencia ' + miNombreFrecuencia,
                    offsetY: 10,
                    align: "center",
                    style: {
                      color: "#444"
                    }
                  }
                };

                //chi cuadrado implementacion
                console.log('-- ------------------------------');
                console.log('Resultados  Chi Cuadrado');
                console.log('valor observado', this.valoresObservados);
                console.log('Valor esperado', this.valorEsperados);
                console.log('Promedio', promedios);
                console.log('Fecha', fechasPrueba);
                console.log('-- ------------------------------');

                //let reduction = 1;
                let reduction = this.valoresObservados.length - 1;
                console.log('Reduccion', reduction);

                let codigoDist = -1;
                let valores = this.listaFuncionDis;
                let mValores = valores.filter((value) => {
                  return value.id == this.idDistribucion;
                });

                if ( null!=mValores && undefined!=mValores && mValores.length>0 ) {
                  codigoDist = mValores[0].codigo;
                }

                let pruebaRequest : IVCramerRequest = {
                  valoresEsperados: valoresEsperados,
                  valoresObservados: valoresObservados,
                  promedios: promedios,
                  nivelSignificancia: this.idReduccion,
                  codigoFuncionDistribucion: codigoDist,
                };

           


                // Invocacion servicio que realiza el calculo de la prueba de VCramer...
                this.serviciosObservacionesEstacionService.obtenerValorPruebaCramer(pruebaRequest)
                  .subscribe((response : IVCramerResponse) => {
                    this.resultado = response.resultado;

                    console.log('-- ------------------------------');
                    console.log('Resultados V Cramer', this.resultado);
                    console.log('-- ------------------------------');

                    this.resultadoDevil = this.idReduccion <= 0.2;
                    this.resultadoModerado = 0.2 < this.idReduccion || this.idReduccion <= 0.6;
                    this.resultadoFuerte = this.idReduccion > 0.6 ;

                    this.formulaAprobado = 'ES ≤ 0.2'
                    this.formulaReprobado = '0.2 ≤ ES ≤ 0.6'
                    this.formulaCramer = 'ES ≥ 0.6'
                    this.texto1 = 'X²= Ji cuadrado'
                    this.texto2 = 'n = numero de datos de la serie'
                    this.texto3 = 'ES = Tamaño de efecto'

                    this.informacion = 'V Cramer'

                    let todo: any = {
                      fechaPrueba: fechasPrueba,
                      descripcion: this.miNombreParametro,
                      estacion: this.miNombreEstaciones,
                      todos: '',
                      fechaFi: this.Fechafin,
                      fechaIn: this.fechainicio,
                      reduccion: this.idReduccion,
                      informacion: this.informacion,
                      formulaAprobado: this.formulaAprobado,
                      formulaReprobado: this.formulaReprobado,
                      texto1: this.texto1,
                      texto2: this.texto2,
                      texto3: this.texto3,
                    }

                    this.listaPrueba.push(todo);
                    this.idAlgoritmos = 1029;

                    Swal.close();
                  });
                }
              );
          },
          willClose: async () => {
            Swal.hideLoading();
          }
        });
        break;
      }
    }
  }

  private cargarMunicipiosPorDepartamento() {
    this.serviciosGeograficosService
      .obtenerMunicipiosPorIdDepartamento(this.tempIdDepartamento)
      .subscribe((response) => {
        this.listaMunicipios = response;
      });
  }

  cambioDepartamento(departamentoSelected: any) {
    if ( !this.assertNullAndUndefined(departamentoSelected) || departamentoSelected.length<=0 ) {
      return;
    }

    this.tempIdDepartamento = departamentoSelected;
    this.cargarMunicipiosPorDepartamento();
  }

  perriodoBigente() {
    this.periodo = 1;
    this.verFechas = false;

  }
  establecerRngo() {
    this.periodo = 2;
    this.verFechas = true;
  }

  // Validacion de permisos 
  public validarPermiso(permiso: any): boolean {
    return MetodosGlobales.validarPermiso(permiso);
  }



  agregarElemento() {
    if (this.listaItemsElementos.length < 5) {
      let obsCorrelacion = new Observable((observer) => {
        console.log(observer);
        var seleccionTemporal: any = {
          id: this.listaCodigoIDEAMAgregar.filter(filtro => filtro.id == this.formularioConsulta.get('idElementoAgregar')?.value)[0].text,
          codigoIDEAM: this.listaCodigoIDEAMAgregar.filter(filtro => filtro.id == this.formularioConsulta.get('idCodigoIDEAMAgregar')?.value)[0].text,
          codigoEAAB: this.listaCodigoEAABAgregar.filter(filtro => filtro.id == this.formularioConsulta.get('idCodigoEAABAgregar')?.value)[0].text,
          nombreElemento: this.listaElementoAgregar.filter(filtro => filtro.id == this.formularioConsulta.get('idElementoAgregar')?.value)[0].text,
          idElemento: this.formularioConsulta.get('idElementoAgregar')?.value,
          idCodigoEAAB: this.formularioConsulta.get('idCodigoEAABAgregar')?.value,
          idCodigoIDEAM: this.formularioConsulta.get('idCodigoIDEAMAgregar')?.value,
        }
        this.listaItemsElementos.push(seleccionTemporal);
        // this.datosFilterElementos = this.listaItemsElementos;

      });
      obsCorrelacion.subscribe();
    } else {
      Swal.fire(
        'Serie Mixta',
        'No se pueden incluir mas de 5 elementos ',
        'error'
      );
    }

  }

  obtenerListaParametros(id: any) {
    if ( null==id || undefined==id || id.length<=0 || id<=0 ) {
      return;
    }

    let obtenerListaParametrosEstacion : IParametrosCFrecuencias = {
      idEstacion: id,
      idPeriodos: [] = [151, 152, 154], 
    };

    console.log('-- ------------------');
    console.log("ID de estacion: " + id);
    console.log('-- ------------------');

    this.sercioparametrosestacion.obtenerListaParametrosPorFrecuencias(obtenerListaParametrosEstacion).subscribe((response) => {
      this.listParametro = response.map((elemento: any) => ({
        id: elemento.idParametro,
        text: elemento.descripcion,
        codigo: elemento.codigo,
        idPeriodo: elemento.idPeriodo,
      }));
    });

    /*
    this.sercioparametrosestacion.obtenerListaParametros(id).subscribe((response) => {
        this.listParametro = response.map((elemento: any) => ({
          id: elemento.idParametro,
          text: elemento.descripcionParametro,
          codigo: elemento.codigo,
          idPeriodo: elemento.idPeriodo,
        }));
      });
      */
  }

  modoLectura() {
    this.nombreParametro = this.listParametro.filter(filtro => filtro.id == this.formularioConsulta.get('idParametro')?.value)[0].text;
    this.nombreEstacion = this.listaElementoAgregar.filter(filtro => filtro.id == this.formularioConsulta.get('idElemento')?.value)[0].text;

  }


  obtenerPruebasBondad(even: any) {
    console.log(even)
    this.idPruebaBondad = parseInt(even);
    //this.idDistribucion = '';

    switch (this.idPruebaBondad) {

      // Chi Cuadrado
      case 1:
        this.esKolmogorov = false;
        this.idDistribucion = '';
        this.esChi2 = true;
        this.esVCramer = false;
        break


      // Kolmogorov
      case 2:
        this.esKolmogorov = true;
        this.esChi2 = false;
        this.esVCramer = false;
        break;


      // V Cramer
      case 3:
        this.esKolmogorov = false;
        this.idDistribucion = '';
        this.esChi2 = false;
        this.esVCramer = true;
        break;

      // Opcion NO valida...
      default:
        break;
    }
  }

  AsignarNombres() {
    let CuencaName: any = this.listaCuenca.find(
      (cuenca) => cuenca['id'] == this.formularioConsulta.value.idCuenca
    );

    let AreaName: any = this.listaAreaHidrografica.find(
      (cuenca) =>
        cuenca['id'] == this.formularioConsulta.value.idAreaHidrografica
    );

    let ZonaName: any = this.listaZonaHidrografica.find(
      (cuenca) =>
        cuenca['id'] == this.formularioConsulta.value.idZonaHidrografica
    );

    let subZonaName: any = this.listaSubzonaHidrografica.find(
      (cuenca) =>
        cuenca['id'] == this.formularioConsulta.value.idSubZonaHidrografica
    );

    let subCuencaName: any = this.listaSubcuenca.find(
      (cuenca) => cuenca['id'] == this.formularioConsulta.value.idSubCuenca
    );

    let MicroCuencaName: any = this.listaMicrocuenca.find(
      (cuenca) => cuenca['id'] == this.formularioConsulta.value.idMicroCuenca
    );

    if (MicroCuencaName != undefined || null) {
      this.formularioConsulta.value.microCuenca = MicroCuencaName['text'];
    }
    if (CuencaName != undefined || null) {
      this.formularioConsulta.value.cuenca = CuencaName['text'];
    }
    if (AreaName != undefined || null) {
      this.formularioConsulta.value.areaHidrografica = AreaName['text'];
    }
    if (ZonaName != undefined || null) {
      this.formularioConsulta.value.zonaHidrografica = ZonaName['text'];
    }
    if (subZonaName != undefined || null) {
      this.formularioConsulta.value.subZonaHidrografica = subZonaName['text'];
    }
    if (subCuencaName != undefined || null) {
      this.formularioConsulta.value.subCuenca = subCuencaName['text'];
    }
  }

  obtenerParametro(idParametro: any) {
    let parametros = this.listParametro.filter(param => {
      return parseInt(param.idParametro) === parseInt(idParametro);

    });
    console.log('esta es mi lista parametros', this.listParametro)

    if (null != parametros && undefined != parametros && parametros.length > 0) {
      return parametros[0];
    }
    return null;
  }

  guadarPruebasBondad() {
    Swal.fire({
      title: 'Desea guardar la prueba de bondad?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Guardar',
    }).then((result) => {
      if (result.isConfirmed) {



        console.log("estos son los datos: ")
        console.log("estos son los datos: ", this.idAlgoritmos)
        console.log("estos son los datos: ", parseInt(this.idReduccion))
        console.log("estos son los datos: ", this.resultado)
        console.log("estos son los datos: ", this.miCodigos)
        console.log("estos son mis datos", this.idElemento)
        console.log("estos son los datos: ", this.fechainicio)
        console.log("estos son los datos: ", this.Fechafin)

        let pruebasBondad: IPruebasBondad = {
          idAlgoritmo: this.idAlgoritmos,
          nivelSignificancia: parseInt(this.idReduccion),
          resultadoAlgoritmo: this.resultado,
          idParametro: this.miCodigos,
          idEstacion: parseInt(this.idElemento),
          fechaInicial: this.fechainicio,
          fechaFinal: this.Fechafin,
          activo: 'S',
        }
        this.serviciosObservacionesEstacionService
          .crearPruebasBondad(pruebasBondad)
          .subscribe((response) => {
            Swal.fire({
              title: '¡se guardo correctamente! ',
              icon: 'info',
              showCancelButton: false,
            }).then((result) => {
              if (result.isConfirmed) {
              }
            });

          });

      }
    });
  }

  onDistribucionChange(event: any) {
    if (null == event || undefined == event || event.length <= 0) {
      return;
    }

    this.idDistribucion = event;
  }
}
