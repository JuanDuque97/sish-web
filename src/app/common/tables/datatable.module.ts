import { NgModule, CUSTOM_ELEMENTS_SCHEMA,  } from '@angular/core';
import { DatatableComponent } from 'src/app/common/tables/datatable.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';

@NgModule({
  declarations: [
    DatatableComponent,
    ],
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      DataTablesModule,
    ],
   exports:[DatatableComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DataTableModule { }
