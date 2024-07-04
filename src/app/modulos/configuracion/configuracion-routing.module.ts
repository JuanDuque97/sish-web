import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConfiguracionComponent } from './configuracion.component';
import { ConsultarEjemploComponent } from './ejemplo/consultar-ejemplo/consultar-ejemplo.component';
import { GuardarEjemploComponent } from './ejemplo/guardar-ejemplo/guardar-ejemplo.component';
import { ConsultarDominiosComponent } from './dominios/consultar-dominios/consultar-dominios.component';
import { GuardarDominiosComponent } from './dominios/guardar-dominios/guardar-dominios.component';
import { ConsultarEstacionesComponent } from '../elementos/estaciones/consultar-estaciones/consultar-estaciones.component';
import { ConsultarParametrosComponent } from '../parametros/consultar-parametros/consultar-parametros.component';
import { ConsultarRolesComponent } from '../seguridad/roles/consultar-roles/consultar-roles.component';
import { GuardarParametrosComponent } from '../parametros/guardar-parametros/guardar-parametros.component';
import { GuardarRolesComponent } from '../seguridad/roles/guardar-roles/guardar-roles.component';
import { ParametrosEstacionComponent } from '../elementos/estaciones/parametros-estacion/parametros-estacion.component';
import { PermisosRolComponent } from '../seguridad/roles/permisos-rol/permisos-rol.component';
import { ConsultarPermisosComponent } from '../seguridad/permisos/consultar-permisos/consultar-permisos.component';
import { GuardarPermisosComponent } from '../seguridad/permisos/guardar-permisos/guardar-permisos.component';
import { GuardarEstacionesComponent } from '../elementos/estaciones/guardar-estaciones/guardar-estaciones.component';
import { ConsultarConfiguradosComponent } from './tipo-archivos/configurados/consultar-configurados/consultar-configurados.component';
import { GuardarConfiguradosComponent } from './tipo-archivos/configurados/guardar-configurados/guardar-configurados.component';
import { ConsultarTiposParametroComponent } from './tipos-Parametros/consultar-tipos-parametro/consultar-tipos-parametro.component';
import { GuardarTiposParametroComponent } from './tipos-Parametros/guardar-tipos-parametro/guardar-tipos-parametro.component';
import { ConsultarEmbalsesComponent } from '../elementos/embalses/consultar-embalses/consultar-embalses.component';
import { GuardarEmbalsesComponent } from '../elementos/embalses/guardar-embalses/guardar-embalses.component';
import { ConsultarPozosComponent } from '../elementos/pozos/consultar-pozos/consultar-pozos.component';
import { GuardarPozosComponent } from '../elementos/pozos/guardar-pozos/guardar-pozos.component';
import { ParametrosEmbalseComponent } from '../elementos/embalses/parametros-embalse/parametros-embalse.component';
import { ParametrosPozosComponent } from '../elementos/pozos/parametros-pozos/parametros-pozos.component';
import { ConsultarCapasComponent } from './capas/consultar-capas/consultar-capas.component';
import { GuardarCapasComponent } from './capas/guardar-capas/guardar-capas.component';
import { GuardarColumnasComponent } from './tipo-archivos/columnas/guardar-columnas/guardar-columnas.component';
import { GuardarCamposComponent } from './tipo-archivos/campos/guardar-campos/guardar-campos.component';
import { ConsultarObservacionesComponent } from '../observaciones/consultar-observaciones/consultar-observaciones.component';
import { GuardarObsercacionesComponent } from '../observaciones/guardar-obsercaciones/guardar-obsercaciones.component';
import { ConsultarCamposComponent } from './tipo-archivos/campos/consultar-campos/consultar-campos.component';
import { ConsultarColumnasComponent } from './tipo-archivos/columnas/consultar-columnas/consultar-columnas.component';
import { ConsultarAforoComponent } from './nivel-caudal/aforo/consultar-aforo/consultar-aforo.component';
import { GuardarAforoComponent } from './nivel-caudal/aforo/guardar-aforo/guardar-aforo.component';
import { ConsultarMolineteComponent } from './nivel-caudal/molinetes/consultar-molinete/consultar-molinete.component';
import { GuardarMolineteComponent } from './nivel-caudal/molinetes/guardar-molinete/guardar-molinete.component';
import { GestionTablasComponent } from './nivel-caudal/aforo/gestion-tablas/gestion-tablas.component';
import { GestionRegresionComponent } from './nivel-caudal/aforo/gestion-regresion/gestion-regresion.component';
import { GestionCaudalComponent } from './nivel-caudal/aforo/gestion-caudal/gestion-caudal.component';
import { ConsultarReportesComponent } from '../gestionReportes/consultar-reportes/consultar-reportes.component';
import { GuardarReportesComponent } from '../gestionReportes/guardar-reportes/guardar-reportes.component';
import { ConsultarCirteriosComponent } from '../gestionHidrologica/cirterios/consultar-cirterios/consultar-cirterios.component';
import { GuardarCirteriosComponent } from '../gestionHidrologica/cirterios/guardar-cirterios/guardar-cirterios.component';
import { ConsultarAlertasComponent } from '../gestionHidrologica/consultar-alertas/consultar-alertas.component';
import { ConsultarInventarioDatosComponent } from '../gestionHidrologica/consultar-inventario-datos/consultar-inventario-datos.component';
import { VerAforoComponent } from './nivel-caudal/aforo/gestion-tablas/var-aforo.component';
import { ValidarAforoComponent } from './nivel-caudal/aforo/validar-aforo/validar-aforo.component';
import { CalcularAforoComponent } from './nivel-caudal/aforo/calcular-aforo/calcular-aforo.component';
import { ConsultarValidacionObervacionComponent } from '../gestionHidrologica/consulta-valida-obervacion/consultar-valida-obervacion.component';
import { GestionAgregacionComponent } from '../observaciones/gestión-agregacion/gestion-agregacion.component';
import { ConsultarReportesPozoComponent } from '../gestionReportes/consultar-datos-reportes/reporte-pozo/consultar-datos-reportes-pozo.component';
import { ConfuguracionParametroComponent } from '../observaciones/configuracion-parametros/configuracion-parametro.component';
import { ConsultarDatosReporteEstacionComponent } from '../gestionReportes/consultar-datos-reportes/reporte-estacion/consultar-datos-reportes-estacion.component';
import { ConsultarReportesEmbalseComponent } from '../gestionReportes/consultar-datos-reportes/reporte-embalse/consultar-datos-reportes-embalse.component';
import { ReportesEstaticosComponent } from 'src/app/modulos/gestionReportes/reportes-estaticos/reportes-estaticos.component';
import { CaudalesAforadosComponent } from 'src/app/modulos/gestionReportes/reportes-estaticos/caudales-aforados/caudales-aforados.component';
import { ReporteFuentesSuperficialesComponent } from 'src/app/modulos/gestionReportes/reportes-estaticos/fuentes-superficiales/fuentes-superficiales.component';
import { ReportePrecipitacionComponent } from 'src/app/modulos/gestionReportes/reportes-estaticos/precipitacion/precipitacion.component';
import { CurvaDuracionComponent } from 'src/app/modulos/configuracion/nivel-caudal/aforo/curva-duracion/curva-duracion.component';
import { CurvaDuracionAjusteComponent } from './nivel-caudal/aforo/curva-duracion-ajuste/curva-duracion-ajuste.component';
import { ConsultaIdfsComponent } from 'src/app/modulos/IDFs/consultar-idfs/consultar-idfs.component';
import { IdfsComponent } from 'src/app/modulos/IDFs/idfs/idfs.component';
import { ReporteNivelesComponent } from '../gestionReportes/reportes-estaticos/Niveles/niveles.component';




const routes: Routes = [
  {
    path: '',
    component: ConfiguracionComponent,
    children: [
      { path: 'ejemplo', component: ConsultarEjemploComponent },
      { path: 'ejemplo/:id', component: GuardarEjemploComponent },
      { path: 'dominios', component: ConsultarDominiosComponent },
      { path: 'dominios/:ac/:id', component: GuardarDominiosComponent },
      { path: 'estaciones', component: ConsultarEstacionesComponent },
      { path: 'estaciones/:ac/:id', component: GuardarEstacionesComponent },
      { path: 'parametrosEstacion/:id', component: ParametrosEstacionComponent },

      { path: 'parametros', component: ConsultarParametrosComponent },
      { path: 'parametros/:ac/:id', component: GuardarParametrosComponent },

      { path: 'parametros/tipoParametros', component: ConsultarTiposParametroComponent },
      { path: 'parametros/tipo/Parametros/:id', component: GuardarTiposParametroComponent },

      { path: 'embalses', component: ConsultarEmbalsesComponent },
      { path: 'embalses/:ac/:id', component: GuardarEmbalsesComponent },
      { path: 'ParametrosEmbalses/:id', component: ParametrosEmbalseComponent },
      { path: 'pozos', component: ConsultarPozosComponent  },
      { path: 'pozos/:ac/:id', component:  GuardarPozosComponent },
      { path: 'ParametrosPozos/:id', component:  ParametrosPozosComponent },
      { path: 'capas', component: ConsultarCapasComponent},
      { path: 'capas/:ac/:id', component: GuardarCapasComponent},
      { path: 'seguridad/roles', component: ConsultarRolesComponent },
      { path: 'seguridad/roles/:id', component: GuardarRolesComponent },
      { path: 'seguridad/roles/permisos/:id', component: PermisosRolComponent },
      { path: 'seguridad/permisos', component: ConsultarPermisosComponent },
      { path: 'seguridad/permisos/:id', component: GuardarPermisosComponent },
      { path: 'tipoarchivos/configurados', component: ConsultarConfiguradosComponent },
      { path: 'tipoarchivos/configurados/:ac/:id', component: GuardarConfiguradosComponent },
      { path: 'tipoarchivos/columnas/:ta/:ac/:id', component: GuardarColumnasComponent },
      { path: 'tipoarchivos/columnas/:id', component: ConsultarColumnasComponent },


      { path: 'tipoarchivos/Campos/:ta/:ac/:id', component: GuardarCamposComponent },
      { path: 'tipoarchivos/Campos/:id', component: ConsultarCamposComponent },

      { path: 'gestionObservaciones', component: ConsultarObservacionesComponent },
      { path: 'gestionObservaciones/:te/:ac/:id', component: GuardarObsercacionesComponent },

      { path: 'gestionAforo', component: ConsultarAforoComponent },
      { path: 'gestionAforo/:ac/:id', component: GuardarAforoComponent },
      { path: 'gestionAforo/E/:id', component: GuardarAforoComponent },

      { path: 'gestionMolinete', component: ConsultarMolineteComponent },
      { path: 'gestionMolinete/:ac/:id', component: GuardarMolineteComponent },

      { path: 'gestionReportes', component: ConsultarReportesComponent },
      { path: 'gestionReportes/:ac/:id', component: GuardarReportesComponent },

      { path: 'gestionCriterios', component: ConsultarCirteriosComponent },
      { path: 'gestionCriterios/:ac/:id', component: GuardarCirteriosComponent },
      { path: 'gestionAlertas', component: ConsultarAlertasComponent, },
      { path: 'gestionInventario', component: ConsultarInventarioDatosComponent, },
      { path: 'gestionTablas', component: GestionTablasComponent },
      { path: 'gestionTablas', component: GestionTablasComponent },
      { path: 'calcularRegresecion', component: GestionRegresionComponent },
      { path: 'calcularRegresecion/:id', component: GestionRegresionComponent },
      { path: 'gestionCaudal', component: GestionCaudalComponent },
      { path: 'verAforoCaudal', component: VerAforoComponent },
      { path: 'verAforoCaudal/:ac/:id', component: VerAforoComponent },
      { path: 'verAforoCaudal/E/:id', component: VerAforoComponent },
      { path: 'validarAforo', component: ValidarAforoComponent },
      { path: 'validarAforo/E/:id', component: ValidarAforoComponent },
      { path: 'calcularAforo/', component: CalcularAforoComponent },
      { path: 'calcularAforo/E/:id', component: CalcularAforoComponent },
      { path: 'gestionAlertas/:id', component: ConsultarValidacionObervacionComponent },
      { path: 'gestionAgregacion', component: GestionAgregacionComponent },
      { path: 'configuracionParametro', component: ConfuguracionParametroComponent },
      { path: 'configuracionParametro/E/:id', component: ConfuguracionParametroComponent },
      { path: 'reporte/pozo', component: ConsultarReportesPozoComponent },
      { path: 'reporte/embalse', component: ConsultarReportesEmbalseComponent },
      { path: 'reporte/estacion/:idEstructura/:fechaInicio/:fechaFin', component: ConsultarDatosReporteEstacionComponent },
      { path: 'reporte/embalse/:idEstructura/:fechaInicio/:fechaFin', component: ConsultarReportesEmbalseComponent },
      { path: 'reporte/pozo/:idEstructura/:fechaInicio/:fechaFin', component: ConsultarReportesPozoComponent },
      { path: 'reportesEstaticos', component: ReportesEstaticosComponent },
      { path: 'reporte/caudalesAforados/:fechaInicio/:fechaFin/:idEstaciones', component: CaudalesAforadosComponent },
      { path: 'reporte/fuentesSuperficiales/:ano/:idEstacion', component: ReporteFuentesSuperficialesComponent },
      { path: 'reporte/precipitacion/:fechaInicio/:fechaFin/:codigoNesplu/:idEstaciones', component: ReportePrecipitacionComponent },
      { path: 'reporte/niveles/:fechaInicio/:fechaFin/:codigoNesplu/:idEstaciones', component: ReporteNivelesComponent },
      { path: 'curvaDuracion', component: CurvaDuracionComponent },
      { path: 'curvaDuracionAjuste', component: CurvaDuracionAjusteComponent },
      { path: 'consultarIdfs', component: ConsultaIdfsComponent },
      { path: 'idfs', component: IdfsComponent },


    ],
  },
];

export const routing: ModuleWithProviders<any> = RouterModule.forChild(routes);
