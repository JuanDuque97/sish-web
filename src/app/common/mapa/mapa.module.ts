import { NgModule, CUSTOM_ELEMENTS_SCHEMA,  } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { EsriMapComponent } from './mapa.component';

@NgModule({
  declarations: [
    EsriMapComponent,
    ],
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule, 
    ],
   exports:[EsriMapComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MapaModule { }
