import { Directive, Input, Optional, HostBinding } from '@angular/core';
import { ControlContainer } from '@angular/forms';

@Directive({
  selector: 'label[controlName]',
})
export class LabelControl {
  @Input()
    controlName!: string;

  constructor(@Optional() private parent: ControlContainer) {}

  @HostBinding('textContent')
  get controlValue() {
      let cn = this.controlName === null ? '' : this.controlName;
      let ctrl = this.parent.control === null ? '' : this.parent.control as any;
      return this.parent && cn && ctrl ? ctrl.get(cn).value : '';
   
  }
}
