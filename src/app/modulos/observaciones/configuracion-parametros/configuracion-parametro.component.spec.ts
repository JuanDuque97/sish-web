import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfuguracionParametroComponent } from './configuracion-parametro.component';

describe('ConfuguracionParametroComponent', () => {
  let component: ConfuguracionParametroComponent;
  let fixture: ComponentFixture<ConfuguracionParametroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfuguracionParametroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfuguracionParametroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
