import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ServiciosParametrosService } from './servicios-parametros.service';

describe('ServiciosParametrosService', () => {
  let service: ServiciosParametrosService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ]
    });
    service = TestBed.inject(ServiciosParametrosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  })
});
