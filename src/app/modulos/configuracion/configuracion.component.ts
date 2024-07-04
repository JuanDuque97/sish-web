import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html'

})


export class ConfiguracionComponent implements OnInit {
  @Output() listaIdiomas = new EventEmitter 

  langs: string[] = [];

  constructor( private trasnlate:TranslateService){
    this.trasnlate.setDefaultLang('es');
    this.trasnlate.addLangs(['en','es']);
    this.trasnlate.use('es'); 
    this.langs =  this.trasnlate.getLangs();
  }

  ngOnInit(): void {
    // Esto es intencional
    this.listaIdiomas.emit( this.langs)
  }
  changeLang(lang:string){
this.trasnlate.use(lang);
  }

}