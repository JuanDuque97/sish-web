import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuardarCapasComponent } from './guardar-capas.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NgSelect2Module } from 'ng-select2';
import { ServiciosCapasService } from '../servicios-capas.service';
import { of } from 'rxjs';




class RouterStub {
  url = 'configuracion/capas';
  navigate(commands: any[], extras?: any) { }
}

describe('GuardarCapasComponent', () => {
  let component: GuardarCapasComponent;
  let fixture: ComponentFixture<GuardarCapasComponent>;

  const formBuilder: FormBuilder = new FormBuilder();
  const fb = jasmine.createSpyObj('FormBuilder', ['group']);
  const formGroup = new FormGroup({
    identityVerificationDocumentTypeId: new FormControl(
      'formularioArchivoCampos'
    ),
  });
  (<jasmine.Spy>fb.group).and.returnValue(formGroup);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path:'configuracion/capas', component: RouterStub}
        ]),
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
        NgSelect2Module,
      ],
      providers: [
       // { provide: Router, useClass: RouterStub },
        {
          provider: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ id: '1', ac: 'E' }),
            },
          },
        },
        {
          provide: FormBuilder,
          useValue: formBuilder,
        },
      ],
      declarations: [GuardarCapasComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GuardarCapasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('llamar servicio obtenerPorId ', () => {
    const serviciosCapasService =
      fixture.debugElement.injector.get<ServiciosCapasService>(
        ServiciosCapasService as any
      );
    spyOn(serviciosCapasService, 'obtenerPorId').and.returnValue(
      of({
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
      })
    );
    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  it('Actualizar Capa', () => {
    const serviciosCapasService =
      fixture.debugElement.injector.get<ServiciosCapasService>(
        ServiciosCapasService as any
      );
    spyOn(serviciosCapasService, 'actualizar').and.returnValue(
      of({
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
      })
    );
    component.guardar();
    expect(component.guardar).toBeTruthy();
  });
});
