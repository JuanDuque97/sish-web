import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuardarReportesComponent } from './guardar-reportes.component';

describe('GuardarReportesComponent', () => {
  let component: GuardarReportesComponent;
  let fixture: ComponentFixture<GuardarReportesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GuardarReportesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GuardarReportesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
