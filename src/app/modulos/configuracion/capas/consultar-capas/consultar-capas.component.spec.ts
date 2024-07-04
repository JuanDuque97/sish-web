import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { DataTablesModule } from 'angular-datatables';
import { of } from 'rxjs';
import { ServiciosCapasService } from '../servicios-capas.service';

import { ConsultarCapasComponent } from './consultar-capas.component';

describe('ConsultarCapasComponent', () => {
  let component: ConsultarCapasComponent;
  let fixture: ComponentFixture<ConsultarCapasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        DataTablesModule,
        HttpClientTestingModule,
        TranslateModule.forRoot(),
      ],
      declarations: [ConsultarCapasComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultarCapasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('obtener Capas', () => {
    const serviciosDominiosService =
      fixture.debugElement.injector.get<ServiciosCapasService>(
        ServiciosCapasService as any
      );
    spyOn(serviciosDominiosService, 'obtener').and.returnValue(
      of([
        {
          capa: 'string',
          fechaCreacion: 'string',
          fechaModificacion: 'string',
          idCapa: 1,
          identificador: 'string',
          nombreServicio: 'string',
          urlActualizar: 'string',
          urlBorrar: 'string',
          urlConsulta: 'string',
          urlCrear: 'string',
          urlVisualizar: 'string',
          usuarioCreacion: 'string',
          usuarioModificacion: 'string',
        },
      ])
    );
    component.ngOnInit();
    expect(component.datosFilter.length).toEqual(1);
  });
});
