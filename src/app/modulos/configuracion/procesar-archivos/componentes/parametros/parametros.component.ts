import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IArchivoDTO } from 'src/app/modelo/configuracion/archivo';
import { activo } from 'src/app/modelo/enum/cargue-archivo-enum';
import { ProcesarArchivosService } from '../../servicios/procesar-archivos.sercevice';

@Component({
  selector: 'app-parametros',
  templateUrl: './parametros.component.html'
})
export class ParametrosComponent implements OnInit {
  @Input() informacionArchivo:IArchivoDTO;
  public fmrArchivo: FormGroup;
  public id:any;
  public pozo:any;
  public estacion:any;
  public embalse:any;
  
  constructor(private formBuilder:FormBuilder,  private route: ActivatedRoute, private serviceProcesarArchivo:ProcesarArchivosService) { 
    
    this.construirFormulario();
  }

  ngOnInit(): void {
   
   
  }

  ngOnChanges(changes: SimpleChanges){
    this.fmrArchivo.controls['ctrArchivo'].setValue(this.informacionArchivo.archivo);
    this.fmrArchivo.controls['ctrTipoArchivoConfigurado'].setValue(this.informacionArchivo.idTipoArchivoConfigurado);
    this.fmrArchivo.controls['ctrFechaProceso'].setValue(this.informacionArchivo.fechaProceso);
    
    this.pozo=this.informacionArchivo.pozo;
    this.estacion = this.informacionArchivo.estacion;
    this.embalse = this.informacionArchivo.embalse;
    this.fmrArchivo.controls['ctrEmbalse'].setValue(this.embalse);
    this.fmrArchivo.controls['ctrPozo'].setValue(this.pozo);
    this.fmrArchivo.controls['ctrEstacion'].setValue(this.estacion);
    this.fmrArchivo.controls['ctrActivo'].setValue(this.informacionArchivo.activo ==activo.Si ? 'Si':'No');
  }

  construirFormulario(){
    this.fmrArchivo = this.formBuilder.group({
      idArchivo: 0,
      ctrArchivo: [''],
      ctrTipoArchivoConfigurado:[''],
      ctrFechaProceso:[''],
      ctrEmbalse:[''],
      ctrPozo: [null],
      ctrEstacion:[null],
      ctrActivo: ['']
    });
  }

}
