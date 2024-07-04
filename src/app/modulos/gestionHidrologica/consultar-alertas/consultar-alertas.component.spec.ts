import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultarAlertasComponent } from './consultar-alertas.component';

describe('ConsultarAlertasComponent', () => {
  let component: ConsultarAlertasComponent;
  let fixture: ComponentFixture<ConsultarAlertasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultarAlertasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultarAlertasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
