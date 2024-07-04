import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PruebasBondadComponent } from './pruebas-bondad.component';

describe('ConsultarSerieMixtaComponent', () => {
  let component: PruebasBondadComponent;
  let fixture: ComponentFixture<PruebasBondadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PruebasBondadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PruebasBondadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
