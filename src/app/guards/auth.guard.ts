import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { ServiciosAutenticacionService } from '../common/autenticacion/servicios-autenticacion.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private auth: ServiciosAutenticacionService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.auth.estaAutenticado()) {
      return true;
    } else {
      // console.log('lo sentimos debes logearte'); 
      this.router.navigateByUrl('/inicio');
      return false;
    }
  }
}
