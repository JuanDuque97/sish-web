import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { ModelSelectComponent } from './modal-select.component';
import { Select2OptionData } from 'ng-select2';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DataTablesModule } from 'angular-datatables';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ModelSelectComponent', () => {
  let component: ModelSelectComponent;
  let fixture: ComponentFixture<ModelSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        DataTablesModule,
        HttpClientTestingModule, 
        TranslateModule.forRoot(),
      ],
      declarations: [ ModelSelectComponent ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
