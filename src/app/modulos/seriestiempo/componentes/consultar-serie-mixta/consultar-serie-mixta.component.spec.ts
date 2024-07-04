import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultarSerieMixtaComponent } from './consultar-serie-mixta.component';

describe('ConsultarSerieMixtaComponent', () => {
  let component: ConsultarSerieMixtaComponent;
  let fixture: ComponentFixture<ConsultarSerieMixtaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultarSerieMixtaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultarSerieMixtaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
