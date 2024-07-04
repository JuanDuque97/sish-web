import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
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
import { of } from 'rxjs';
import Swal from 'sweetalert2'; 
import { ServiciosPermisos } from '../permisos/servicios-permisos.service';
import { PermisosRolComponent } from './permisos-rol/permisos-rol.component';
import { ServiciosPermisosRolesService } from './servicios-permisos-roles.service';
import { ServiciosRolesService } from './servicios-roles.service';

describe('PermisosRolComponent', () => {
  let component: PermisosRolComponent;
  let fixture: ComponentFixture<PermisosRolComponent>;
  const fb = jasmine.createSpyObj('FormBuilder', ['group']);
  const formGroup = new FormGroup({
    identityVerificationDocumentTypeId: new FormControl('formularioRol'),
    addressVerificationDocumentTypeId: new FormControl('test!'),
  });
  (<jasmine.Spy>fb.group).and.returnValue(formGroup);
  const formBuilder: FormBuilder = new FormBuilder();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        ServiciosRolesService,
        ServiciosPermisosRolesService,
        ServiciosPermisos,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ id: '1' }),
            },
          },
        },
        {
          provide: FormBuilder,
          useValue: formBuilder,
        },
      ],
      declarations: [PermisosRolComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PermisosRolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
