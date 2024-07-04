import { ComponentFixture, TestBed, waitForAsync  } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { MenuIzquierdoComponent } from './menu-izquierdo.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';


describe('MenuIzquierdoComponent', () => {
  let component: MenuIzquierdoComponent;
  let fixture: ComponentFixture<MenuIzquierdoComponent>;

  beforeEach(waitForAsync(() => {
     TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes([])
      ],
      declarations: [ MenuIzquierdoComponent],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuIzquierdoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});
