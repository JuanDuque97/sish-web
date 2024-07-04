import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Select2OptionData } from 'ng-select2';

@Component({
  selector: 'app-modal-select',
  templateUrl: './modal-select.component.html',
  styleUrls: ['./modal-select.component.scss']
})
export class ModelSelectComponent implements OnInit, OnChanges {
  @Input() mostrar: boolean;
  @Input() titulo: string;
  @Input() datos: Array<Select2OptionData> = [];
  @Output() clickAceprtar: EventEmitter<any> = new EventEmitter();
  @Output() clickCancelar: EventEmitter<any> = new EventEmitter();
  public clase = "'modal fade show'";
  public datosLista: Array<Select2OptionData> = [];
  public valor: any
  constructor() {
    console.log('ModelSelectComponent', this.mostrar, this.datos)
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log('ModelSelectComponent ngOnChanges', changes.datos)
    this.datosLista = changes.datos?.currentValue
    this.clase = changes.mostrar?.currentValue ? "'modal fade'" : "'modal fade show'";
  }

  ngOnInit(): void {

  }
  onClickAceptar() {
    console.log("onClickAceptar", this.valor)
    this.clickAceprtar.emit({ value: this.valor });
    this.clase = 'modal fade show'
  }
  onClickCancelar() {
    this.clickCancelar.emit();
    this.clase = 'modal fade show'
  }
  onSelectChanged(data: any): void {
    this.valor = data

  }
}
