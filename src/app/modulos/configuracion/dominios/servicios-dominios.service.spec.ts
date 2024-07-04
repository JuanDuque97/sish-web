import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ServiciosDominiosService } from './servicios-dominios.service';

describe('ServiciosDominiosService', () => {
  let service: ServiciosDominiosService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ]
    });
    service = TestBed.inject(ServiciosDominiosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
