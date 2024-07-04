import { ModuleWithProviders } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';
import { PageNotFoundComponent } from './pagenotfound/pagenotfound.component'; 
import { AuthGuard } from './guards/auth.guard';
import { NavbarComponent } from './common/layout/navbar/navbar.component';
import { AppComponent } from './app.component';

const routes: Routes = [
  { path: '', redirectTo: '/inicio', pathMatch: 'full' },
  { path: 'inicio', component: InicioComponent  }, 
  {
    path: 'configuracion',
    loadChildren: () =>
      import('src/app/modulos/configuracion/configuracion.module').then(
        (m) => m.ConfiguracionModule
      ), canActivate:[AuthGuard]
  },
  {
    path: 'procesararchivos',
    loadChildren: () => import('./modulos/configuracion/procesar-archivos/procesar-archivos.module').then(m=> m.ProcesarArchivosModule),canActivate:[AuthGuard]
  },
  {
    path: 'aforo',
    loadChildren: () => import('./modulos/configuracion/nivel-caudal/nivel-caudal.module').then(m=> m.NivelCaudalModule),canActivate:[AuthGuard]
  },
  
  {
    path: 'publicacion',
    loadChildren: () => import('./modulos/Publicacion-informacion/publicacion-Informacion.module').then(m=> m.PublicacionInformacionModule)
  },

  { path: '**', component: PageNotFoundComponent },
];

export const routing: ModuleWithProviders<any> = RouterModule.forRoot(routes, {
  preloadingStrategy: PreloadAllModules,
  // useHash: true
});
