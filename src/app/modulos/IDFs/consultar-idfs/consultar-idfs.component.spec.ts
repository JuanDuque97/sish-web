import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaIdfsComponent } from './consultar-idfs.component';

describe('ConsultaIdfsComponent', () => {
  let component: ConsultaIdfsComponent;
  let fixture: ComponentFixture<ConsultaIdfsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultaIdfsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaIdfsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
