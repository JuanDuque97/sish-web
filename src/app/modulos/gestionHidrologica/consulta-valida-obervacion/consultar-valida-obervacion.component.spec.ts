import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DataTablesModule } from 'angular-datatables';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { ConsultarValidacionObervacionComponent } from './consultar-valida-obervacion.component';
import { ServiciosDominiosValoresService } from '../../configuracion/dominios/servicios-dominios-valores.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ConsultarValidacionObervacionComponent', () => {
  let component: ConsultarValidacionObervacionComponent;
  let fixture: ComponentFixture<ConsultarValidacionObervacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule ,
        DataTablesModule,
        HttpClientTestingModule,
        TranslateModule.forRoot(),
      ],
      providers: [ServiciosDominiosValoresService],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ConsultarValidacionObervacionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultarValidacionObervacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('obtener Tipo Parametros', () => {
    const serviciosDominiosValoresService =
      fixture.debugElement.injector.get<ServiciosDominiosValoresService>(
        ServiciosDominiosValoresService as any
      );
    spyOn(
      serviciosDominiosValoresService,
      'obtenerValorDominio'
    ).and.returnValue(
      of([
        {
          idDominioValor: 1,
          idDominio: 1,
          activo: 'string',
          dominioValor: 'string',
          fechaCreacion: 'string',
          fechaModificacion: 'string',
          usuarioCreacion: 'string',
          usuarioModificacion: 'string',
        },
      ])
    );

    component.obtener(); 
    expect(component.datosFilter.length).toEqual(1);
  });

  it('Accion registro tipo parametro', () => {
    const e = {
      accion: 'permisos',
      registro: {
        idDominioValor: 1,
        idDominio: 1,
        activo: 'S',
        dominioValor: 'string',
        fechaCreacion: 'string',
        fechaModificacion: 'string',
        usuarioCreacion: 'string',
        usuarioModificacion: 'string',
      },
    };
    // spyOn(component, 'accionRegistro');
    component.accionRegistro(e);
    expect(component.accionRegistro).toBeTruthy();
  });
});
