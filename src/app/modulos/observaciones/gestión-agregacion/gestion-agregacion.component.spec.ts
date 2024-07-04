import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionAgregacionComponent } from './gestion-agregacion.component';

describe('GestionAgregacionComponent', () => {
  let component: GestionAgregacionComponent;
  let fixture: ComponentFixture<GestionAgregacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionAgregacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionAgregacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
