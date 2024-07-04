import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerarSerieMixtaComponent } from './generar-serie-mixta.component';

describe('GenerarSerieMixtaComponent', () => {
  let component: GenerarSerieMixtaComponent;
  let fixture: ComponentFixture<GenerarSerieMixtaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerarSerieMixtaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerarSerieMixtaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
