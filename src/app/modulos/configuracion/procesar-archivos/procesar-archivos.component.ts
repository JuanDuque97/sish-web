import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ProcesarArchivosService } from './servicios/procesar-archivos.sercevice';
@Component({
  selector: 'app-procesar-archivos',
  templateUrl: './procesar-archivos.component.html'
})
export class ProcesarArchivosComponent implements OnInit {
  public fmrCargueArchivo: FormGroup;
 
  constructor(private formBuilder:FormBuilder, private procesarArchivosService: ProcesarArchivosService) { }

  ngOnInit(): void {
    
  }
 

}
