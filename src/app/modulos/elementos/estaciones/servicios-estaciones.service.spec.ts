import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ServiciosEstacionesService } from './servicios-estaciones.service';

describe('ServiciosEstacionesService', () => {
  let service: ServiciosEstacionesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
    });
    service = TestBed.inject(ServiciosEstacionesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
