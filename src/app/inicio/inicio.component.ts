import { Component, OnInit } from '@angular/core';
import { PermisosService } from './permisosEAAB';


@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html'
})
export class InicioComponent implements OnInit {
  constructor(
    private permisosService: PermisosService
  ) {
    // Esto es intencional
  }

  ngOnInit(): void {




    // Esto es intencional
  }


}
