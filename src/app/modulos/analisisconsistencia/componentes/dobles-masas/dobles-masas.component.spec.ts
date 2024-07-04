import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoblesMasasComponent } from './dobles-masas.component';

describe('DoblesMasasComponent', () => {
  let component: DoblesMasasComponent;
  let fixture: ComponentFixture<DoblesMasasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DoblesMasasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DoblesMasasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
