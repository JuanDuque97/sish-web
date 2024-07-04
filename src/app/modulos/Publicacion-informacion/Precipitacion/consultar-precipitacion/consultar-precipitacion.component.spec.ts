import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultarPrecipitacionComponent } from './consultar-precipitacion.component';

describe('ConsultarPrecipitacionComponent', () => {
  let component: ConsultarPrecipitacionComponent;
  let fixture: ComponentFixture<ConsultarPrecipitacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultarPrecipitacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultarPrecipitacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
