import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuardarCirteriosComponent } from './guardar-cirterios.component';

describe('GuardarCirteriosComponent', () => {
  let component: GuardarCirteriosComponent;
  let fixture: ComponentFixture<GuardarCirteriosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GuardarCirteriosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GuardarCirteriosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
