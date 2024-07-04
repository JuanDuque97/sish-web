import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdfsComponent } from './idfs.component';

describe('IdfsComponent', () => {
  let component: IdfsComponent;
  let fixture: ComponentFixture<IdfsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IdfsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IdfsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
