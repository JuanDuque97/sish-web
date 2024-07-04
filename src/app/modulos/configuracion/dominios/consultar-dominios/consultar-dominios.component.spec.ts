import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { DataTablesModule } from 'angular-datatables';
import { ServiciosDominiosService } from '../servicios-dominios.service';
import { of } from 'rxjs';
import { ConsultarDominiosComponent } from './consultar-dominios.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
describe('ConsultarDominiosComponent', () => {
  let component: ConsultarDominiosComponent;
  let fixture: ComponentFixture<ConsultarDominiosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
        imports: [
          RouterTestingModule,
          DataTablesModule,
          HttpClientTestingModule,
          TranslateModule.forRoot()
        ],
      declarations: [ ConsultarDominiosComponent ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultarDominiosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

 it ('obtener Dominios' ,() =>{
  const serviciosDominiosService =
      fixture.debugElement.injector.get<ServiciosDominiosService>(
        ServiciosDominiosService as any
      );
    spyOn(serviciosDominiosService, 'obtener').and.returnValue(
      of([
        {
          id: 1,
          dominio: 'string',
          descripcion: 'string',
          fechaCreacion: 'string',
          fechaModificacion: 'string',
          usuarioCreacion:'string',
          usuarioModificacion: 'string'
        },
      ])
    );
    component.ngOnInit();
    expect(component.datosFilter.length).toEqual(1);
 }
 
 );

 it('Actualizar Dominios', () => {
  const serviciosDominiosService =
    fixture.debugElement.injector.get<ServiciosDominiosService>(
      ServiciosDominiosService as any
    );
  spyOn(serviciosDominiosService, 'actualizar').and.returnValue(
    of({
      id: 1,
      dominio: 'string',
      descripcion: 'string',
      fechaCreacion: 'string',
      fechaModificacion: 'string',
      usuarioCreacion:'string',
      usuarioModificacion: 'string'
    })
  );

  const Dominio = {
    id: 1,
    dominio: 'string',
    descripcion: 'string',
    fechaCreacion: 'string',
    fechaModificacion: 'string',
    usuarioCreacion:'string',
    usuarioModificacion: 'string'
  }; 
  component.actualizar(Dominio);
  expect(component.actualizar.length).toEqual(1);
  // console.log('se actualizo',component.actualizar.length)
});

});
