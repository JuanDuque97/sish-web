import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultarCirteriosComponent } from './consultar-cirterios.component';

describe('ConsultarCirteriosComponent', () => {
  let component: ConsultarCirteriosComponent;
  let fixture: ComponentFixture<ConsultarCirteriosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultarCirteriosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultarCirteriosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
