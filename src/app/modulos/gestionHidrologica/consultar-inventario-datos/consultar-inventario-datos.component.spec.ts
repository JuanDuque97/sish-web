import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultarInventarioDatosComponent } from './consultar-inventario-datos.component';

describe('ConsultarInventarioDatosComponent', () => {
  let component: ConsultarInventarioDatosComponent;
  let fixture: ComponentFixture<ConsultarInventarioDatosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultarInventarioDatosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultarInventarioDatosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
