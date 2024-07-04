import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { ServiciosAutenticacionService } from '../../autenticacion/servicios-autenticacion.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit {
  listaIdiomas: string[] = [];
  actual: string = 'es';
   visible:Boolean 

  constructor(public translateService: TranslateService,
    private auth: ServiciosAutenticacionService, 
    private router: Router) {
    this.listaIdiomas = translateService.getLangs();
  }

  ngOnInit(): void {
    // Esto es intencional    
    this.visible =  this.auth.estaAutenticado();  
  }

  salir() { 
    this.auth.logout();
    this.router.navigateByUrl('/inicio'); 
    setTimeout(() => {
      window.location.reload();
    }, 500);
  }

  public cambiarLenguaje(idioma: string) {
    // console.log(this.actual, idioma);
    this.translateService.use(idioma);
    this.actual = idioma;
  }
}
