import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ProcesarArchivosService } from './procesar-archivos.sercevice';

describe('ProcesarArchivosService', () => {
  let service: ProcesarArchivosService; 
  beforeEach(() => {
  TestBed.configureTestingModule({
    imports: [ HttpClientTestingModule ]
  });
  service = TestBed.inject(ProcesarArchivosService);
});

it('should be created', () => {
  expect(service).toBeTruthy();
});
});
