import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { DataTablesModule } from 'angular-datatables';
import { NgSelect2Module } from 'ng-select2';
import { of } from 'rxjs';
import { ServiciosEmbalcesService } from 'src/app/modulos/elementos/embalses/servicios-embalses.service';
import Swal from 'sweetalert2';
import { ServiciosDominiosValoresService } from '../../../dominios/servicios-dominios-valores.service';
import { ServiciosMolineteService } from '../servicios-molinetes.service';

import { GuardarMolineteComponent } from './guardar-molinete.component';

describe('GuardarMolineteComponent', () => {
  let component: GuardarMolineteComponent;
  let fixture: ComponentFixture<GuardarMolineteComponent>;

  const formBuilder: FormBuilder = new FormBuilder();
  const fb = jasmine.createSpyObj('FormBuilder', ['group']);
  const formGroup = new FormGroup({
    identityVerificationDocumentTypeId: new FormControl('formularioMolinete'),
  });

  (<jasmine.Spy>fb.group).and.returnValue(formGroup);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
        NgSelect2Module,
      ],
      providers: [
        ServiciosEmbalcesService,
        ServiciosDominiosValoresService,
        {
          provide: ActivatedRoute,
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
      declarations: [GuardarMolineteComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GuardarMolineteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should obtencion dominios', () => {
    const serviciosDominiosValoresService =
      fixture.debugElement.injector.get<ServiciosDominiosValoresService>(
        ServiciosDominiosValoresService as any
      );
    spyOn(
      serviciosDominiosValoresService,
      'obtenerValoresPorIdDominio'
    ).and.returnValue(
      of([
        {
          id: 1,
          text: 'Prueba',
          disabled: false,
        },
      ])
    );

    expect(component.idTipoMolinete).toEqual(
      component.formularioMolinete.controls['idTipoMolinete']
    );
    expect(component.serie).toEqual(
      component.formularioMolinete.controls['serie']
    );
    expect(component.marca).toEqual(
      component.formularioMolinete.controls['marca']
    );

    expect(component.descripcion).toEqual(
      component.formularioMolinete.controls['descripcion']
    );
    expect(component.fechaCalibracion).toEqual(
      component.formularioMolinete.controls['fechaUltimaCalibracion']
    );

    component.ngOnInit();

    expect(component).toBeTruthy();
  });

  it('obtenerMolinete', () => {
    component.id = '1';

    const serviciosMolineteService =
      fixture.debugElement.injector.get<ServiciosMolineteService>(
        ServiciosMolineteService as any
      );

    spyOn(serviciosMolineteService, 'obtenerPorId').and.returnValue(
      of({
        activo: 'string',
        descripcion: 'string',
        fechaAdquisicion: 'string',
        fechaCreacion: 'string',
        fechaEstado: 'string',
        fechaModificacion: 'string',
        fechaUltimaCalibracion: 'string',
        idMolinete: 1,
        idPeriodoSugeridoCalibracion: 1,
        idTipoMolinete: 505,
        imagen: 'string',
        marca: 'string',
        serie: 'string',
        usuarioCreacion: 'string',
        usuarioEstado: 'string',
        usuarioModificacion: 'string',
        identificacionMolinete: 'string',
      })
    );

    spyOn(serviciosMolineteService, 'obtenerHelicePorId').and.returnValue(
      of({
        constanteB: 1,
        constanteM: 1,
        idHelice: 1,
        idMolinete: 1,
        numeroRevolucionesMax: 1,
        numeroRevolucionesMin: 1,
        observaciones: 'string',
        serieHelice: 'string',
        velocidadExpresadaMax: 1,
        velocidadExpresadaMin: 1,
      })
    );
    expect(component).toBeTruthy();
  });

  it('guardar Molinete', () => {
    component.TipoMolinete = 505;
    component.listaHelices = [
      {
        activo: "String",
        constanteB: 1,
        constanteM: 1,
        idHelice: 1,
        idMolinete: 1,
        numeroRevolucionesMax: 1,
        numeroRevolucionesMin: 1,
        observaciones: "String",
        serieHelice: "String",
        velocidadExpresadaMax: 1,
        velocidadExpresadaMin: 1,
        idImagen: 1,
        idCertificadoUltimaCalibracion: 1,
        flagMigracion: "String",
        idPeriodoSugeridoCalibracion: 1,
        fechaUltimaCalibracion: "String",
        imagen: "String",
        molinete: "String",
        descripcionImagen: "String",
        idTipoArchivoImagen: 1,
        certificadoUltimaCalibracion: "String",
        descripcionCertificadoUltimaCalibracion: "String",
        idTipoArchivoCertificado: 1,
      },
      {
        activo: "String",
        constanteB: 1,
        constanteM: 1,
        idHelice: 1,
        idMolinete: 1,
        numeroRevolucionesMax: 1,
        numeroRevolucionesMin: 1,
        observaciones: "String",
        serieHelice: "String",
        velocidadExpresadaMax: 1,
        velocidadExpresadaMin: 1,
        idImagen: 1,
        idCertificadoUltimaCalibracion: 1,
        flagMigracion: "String",
        idPeriodoSugeridoCalibracion: 1,
        fechaUltimaCalibracion: "String",
        imagen: "String",
        molinete: "String",
        descripcionImagen: "String",
        idTipoArchivoImagen: 1,
        certificadoUltimaCalibracion: "String",
        descripcionCertificadoUltimaCalibracion: "String",
        idTipoArchivoCertificado: 1,
      },
    ];
    const serviciosMolineteService =
      fixture.debugElement.injector.get<ServiciosMolineteService>(
        ServiciosMolineteService as any
      );

    spyOn(serviciosMolineteService, 'crear').and.returnValue(
      of({
        activo: 'string',
        descripcion: 'string',
        fechaAdquisicion: 'string',
        fechaCreacion: 'string',
        fechaEstado: 'string',
        fechaModificacion: 'string',
        fechaUltimaCalibracion: 'string',
        idMolinete: 12,
        idPeriodoSugeridoCalibracion: 1,
        idTipoMolinete: 505,
        idImagen: 1,
        idCertificadoUltimaCalibracion: 1,
        marca: 'string',
        serie: 'string',
        usuarioCreacion: 'string',
        usuarioEstado: 'string',
        usuarioModificacion: 'string',
        identificacionMolinete: 'string',
      })
    );
    spyOn(serviciosMolineteService, 'crearHelice').and.returnValue(
      of([
        {
          activo: "String",
          constanteB: 1,
          constanteM: 1,
          idHelice: 1,
          idMolinete: 1,
          numeroRevolucionesMax: 1,
          numeroRevolucionesMin: 1,
          observaciones: "String",
          serieHelice: "String",
          velocidadExpresadaMax: 1,
          velocidadExpresadaMin: 1,
          idImagen: 1,
          idCertificadoUltimaCalibracion: 1,
          flagMigracion: "String",
          idPeriodoSugeridoCalibracion: 1,
          fechaUltimaCalibracion: "String",
          imagen: "String",
          molinete: "String",
          descripcionImagen: "String",
          idTipoArchivoImagen: 1,
          certificadoUltimaCalibracion: "String",
          descripcionCertificadoUltimaCalibracion: "String",
          idTipoArchivoCertificado: 1,
        },
      ])
    );

    spyOn(serviciosMolineteService, 'crearArchivo').and.returnValue(
      of({
        archivo: 'archivo',
        descripcion: 'img.jpg',
        idArchivo: 1,
        idTipoArchivo: 1,
      })
    );

    component.previsualizacion = 'archivo';
    component.imagenCargada = 'img.jpg';

    component.id = '0';

    component.formularioMolinete.controls['idTipoMolinete'].setValue(1);
    component.formularioMolinete.controls['serie'].setValue('Ser01');
    component.formularioMolinete.controls['marca'].setValue('Moli01');
    component.formularioMolinete.controls['descripcion'].setValue('Prueba');
    component.formularioMolinete.controls['fechaUltimaCalibracion'].setValue(
      '01/02/1999'
    );

    // console.log('componente formularioMolinete',component.formularioMolinete)

    component.guardar();
    expect(Swal.isVisible()).toBeTruthy();
    Swal.clickConfirm();
    setTimeout(() => {
      expect(component.guardar).toHaveBeenCalled();
    });
  });

  it('Actualizar Molinete', () => {
    component.TipoMolinete = 505;
    component.listaHelices = [
      {
        activo: "String",
        constanteB: 1,
        constanteM: 1,
        idHelice: 1,
        idMolinete: 1,
        numeroRevolucionesMax: 1,
        numeroRevolucionesMin: 1,
        observaciones: "String",
        serieHelice: "String",
        velocidadExpresadaMax: 1,
        velocidadExpresadaMin: 1,
        idImagen: 1,
        idCertificadoUltimaCalibracion: 1,
        flagMigracion: "String",
        idPeriodoSugeridoCalibracion: 1,
        fechaUltimaCalibracion: "String",
        imagen: "String",
        molinete: "String",
        descripcionImagen: "String",
        idTipoArchivoImagen: 1,
        certificadoUltimaCalibracion: "String",
        descripcionCertificadoUltimaCalibracion: "String",
        idTipoArchivoCertificado: 1,
      },
      {
        activo: "String",
        constanteB: 1,
        constanteM: 1,
        idHelice: 1,
        idMolinete: 1,
        numeroRevolucionesMax: 1,
        numeroRevolucionesMin: 1,
        observaciones: "String",
        serieHelice: "String",
        velocidadExpresadaMax: 1,
        velocidadExpresadaMin: 1,
        idImagen: 1,
        idCertificadoUltimaCalibracion: 1,
        flagMigracion: "String",
        idPeriodoSugeridoCalibracion: 1,
        fechaUltimaCalibracion: "String",
        imagen: "String",
        molinete: "String",
        descripcionImagen: "String",
        idTipoArchivoImagen: 1,
        certificadoUltimaCalibracion: "String",
        descripcionCertificadoUltimaCalibracion: "String",
        idTipoArchivoCertificado: 1,
      },
    ];
    const serviciosMolineteService =
      fixture.debugElement.injector.get<ServiciosMolineteService>(
        ServiciosMolineteService as any
      );

    spyOn(serviciosMolineteService, 'actualizar').and.returnValue(
      of({
        activo: 'string',
        descripcion: 'string',
        fechaAdquisicion: 'string',
        fechaCreacion: 'string',
        fechaEstado: 'string',
        fechaModificacion: 'string',
        fechaUltimaCalibracion: 'string',
        idMolinete: 12,
        idPeriodoSugeridoCalibracion: 1,
        idTipoMolinete: 505,
        idImagen: 1,
        idCertificadoUltimaCalibracion: 1,
        marca: 'string',
        serie: 'string',
        usuarioCreacion: 'string',
        usuarioEstado: 'string',
        usuarioModificacion: 'string',
        identificacionMolinete: 'string',
      })
    );
    spyOn(serviciosMolineteService, 'eliminarHelicePorId').and.returnValue(
      of([
        {
          constanteB: 1,
          constanteM: 1,
          idHelice: 1,
          idMolinete: 1,
          numeroRevolucionesMax: 1,
          numeroRevolucionesMin: 1,
          observaciones: 'string',
          serieHelice: 'string',
          velocidadExpresadaMax: 1,
          velocidadExpresadaMin: 1,
        },
      ])
    );
    spyOn(serviciosMolineteService, 'crearHelice').and.returnValue(
      of([
        {
          activo: "String",
          constanteB: 1,
          constanteM: 1,
          idHelice: 1,
          idMolinete: 1,
          numeroRevolucionesMax: 1,
          numeroRevolucionesMin: 1,
          observaciones: "String",
          serieHelice: "String",
          velocidadExpresadaMax: 1,
          velocidadExpresadaMin: 1,
          idImagen: 1,
          idCertificadoUltimaCalibracion: 1,
          flagMigracion: "String",
          idPeriodoSugeridoCalibracion: 1,
          fechaUltimaCalibracion: "String",
          imagen: "String",
          molinete: "String",
          descripcionImagen: "String",
          idTipoArchivoImagen: 1,
          certificadoUltimaCalibracion: "String",
          descripcionCertificadoUltimaCalibracion: "String",
          idTipoArchivoCertificado: 1,
        },
      ])
    );

    spyOn(serviciosMolineteService, 'actualizarArchivo').and.returnValue(
      of({
        archivo: 'archivo',
        descripcion: 'img.jpg',
        idArchivo: 1,
        idTipoArchivo: 1,
      })
    );

    component.previsualizacion = 'archivo2';
    component.imagenCargada = 'img.jpg';

    component.id = '10';

    component.formularioMolinete.controls['idTipoMolinete'].setValue(1);
    component.formularioMolinete.controls['serie'].setValue('Ser01');
    component.formularioMolinete.controls['marca'].setValue('Moli01');
    component.formularioMolinete.controls['descripcion'].setValue('Prueba');
    component.formularioMolinete.controls['fechaUltimaCalibracion'].setValue(
      '01/02/1999'
    );

    component.guardar();
    expect(Swal.isVisible()).toBeTruthy();
    Swal.clickConfirm();
    setTimeout(() => {
      expect(component.guardar).toHaveBeenCalled();
    });

    // expect(component.ngOnInit).toHaveBeenCalled();
    // spyOn(component, 'guardar');
    // component.guardar();
    // expect(component.guardar).toBeTruthy();
  });

  it('agregarlista Molinete Invalid', () => {
    component.formularioHelice.controls['serieHelice'].setValue(12);
    component.formularioHelice.controls['constanteM'].setValue(12);
    component.formularioHelice.controls['constanteB'].setValue(12);
    component.formularioHelice.controls['numeroRevolucionesMin'].setValue(12);
    component.formularioHelice.controls['numeroRevolucionesMax'].setValue(12);
    component.formularioHelice.controls['velocidadExpresadaMin'].setValue(12);
    component.formularioHelice.controls['velocidadExpresadaMax'].setValue(12);
    component.editar = false;
    //  spyOn (component,'agregarlista')
    component.agregarlista();
    expect(component.listaHelices.length).toEqual(1);
  });
  it('agregarlista Molinete', () => {
    component.formularioHelice.controls['serieHelice'].setValue('Serie01');
    component.formularioHelice.controls['constanteM'].setValue(1);
    component.formularioHelice.controls['constanteB'].setValue(2);
    component.formularioHelice.controls['numeroRevolucionesMin'].setValue(2);
    component.formularioHelice.controls['numeroRevolucionesMax'].setValue(12);
    component.formularioHelice.controls['velocidadExpresadaMin'].setValue(1);
    component.formularioHelice.controls['velocidadExpresadaMax'].setValue(12);
    component.formularioHelice.controls['observaciones'].setValue('Prueba');
    component.editar = true;

    component.idlista = 1;

    component.listaHelices = [
      {
        activo: "String",
        constanteB: 1,
        constanteM: 1,
        idHelice: 1,
        idMolinete: 1,
        numeroRevolucionesMax: 1,
        numeroRevolucionesMin: 1,
        observaciones: "String",
        serieHelice: "String",
        velocidadExpresadaMax: 1,
        velocidadExpresadaMin: 1,
        idImagen: 1,
        idCertificadoUltimaCalibracion: 1,
        flagMigracion: "String",
        idPeriodoSugeridoCalibracion: 1,
        fechaUltimaCalibracion: "String",
        imagen: "String",
        molinete: "String",
        descripcionImagen: "String",
        idTipoArchivoImagen: 1,
        certificadoUltimaCalibracion: "String",
        descripcionCertificadoUltimaCalibracion: "String",
        idTipoArchivoCertificado: 1,
      },
      {
        activo: "String",
        constanteB: 1,
        constanteM: 1,
        idHelice: 1,
        idMolinete: 1,
        numeroRevolucionesMax: 1,
        numeroRevolucionesMin: 1,
        observaciones: "String",
        serieHelice: "String",
        velocidadExpresadaMax: 1,
        velocidadExpresadaMin: 1,
        idImagen: 1,
        idCertificadoUltimaCalibracion: 1,
        flagMigracion: "String",
        idPeriodoSugeridoCalibracion: 1,
        fechaUltimaCalibracion: "String",
        imagen: "String",
        molinete: "String",
        descripcionImagen: "String",
        idTipoArchivoImagen: 1,
        certificadoUltimaCalibracion: "String",
        descripcionCertificadoUltimaCalibracion: "String",
        idTipoArchivoCertificado: 1
      }
    ];

    component.agregarlista();

    expect(component.listaHelices.length).toEqual(2);
  });

  it('eliminarLista', () => { 
    component.listaHelices = [
      {
        "idHelice": 1,
        "idMolinete": 1,
        "serieHelice": "Ser03Pruebas",
        "observaciones": "rte",
        "constanteM": 0.02,
        "constanteB": 0.01,
        "numeroRevolucionesMin": 0.02,
        "numeroRevolucionesMax": 0.01,
        "velocidadExpresadaMin": 0.04,
        "velocidadExpresadaMax": 10.03, 
        "idImagen":1,
        "idCertificadoUltimaCalibracion":1,
        "imagen": "string",
      "descripcionImagen":'string', 
      "idTipoArchivoImagen":1 ,  
      "idTipoArchivoCertificado":1,


      activo: "String",
      
      flagMigracion: "String",
      idPeriodoSugeridoCalibracion: 1,
      fechaUltimaCalibracion: "String",
     
      molinete: "String",
       
      certificadoUltimaCalibracion: "String",
      descripcionCertificadoUltimaCalibracion: "String",
       


    },
    {
      "idHelice": 2,
      "idMolinete": 3,
      "serieHelice": "Ser01Pruebas",
      "observaciones": "test",
      "constanteM": 0.03,
      "constanteB": 0.03,
      "numeroRevolucionesMin": 0.02,
      "numeroRevolucionesMax": 0.01,
      "velocidadExpresadaMin": 0.04,
      "velocidadExpresadaMax": 10.03, 
      "idImagen":1,
      "idCertificadoUltimaCalibracion":1,
      "imagen": "string",
    "descripcionImagen":'string', 
    "idTipoArchivoImagen":1 ,
    
    activo: "String",
      
    flagMigracion: "String",
    idPeriodoSugeridoCalibracion: 1,
    fechaUltimaCalibracion: "String",
   
    molinete: "String",
     
    certificadoUltimaCalibracion: "String",
    descripcionCertificadoUltimaCalibracion: "String",
   
    "idTipoArchivoCertificado":1

      
      
  }
    ]; 

    const elimindado: any = {
      idHelice: 2,
      idMolinete: 3,
      serieHelice: "Ser01Pruebas",
      observaciones: "test",
      constanteM: 0.03,
      constanteB: 0.03,
      numeroRevolucionesMin: 0.01,
      numeroRevolucionesMax: 0.01,
      velocidadExpresadaMin: 0.02,
      velocidadExpresadaMax: 0.01,
    };

    component.eliminarLista(elimindado);
    console.log('lista eliminada', component.listaHelices);
    expect(component.listaHelices.length).toEqual(2);
  });
  // it('EditarLista', () => { 
  //   component.listaHelices = [
  //     {
  //       "idHelice": 1,
  //       "idMolinete": 1,
  //       "serieHelice": "Ser03Pruebas",
  //       "observaciones": "rte",
  //       "constanteM": 0.02,
  //       "constanteB": 0.01,
  //       "numeroRevolucionesMin": 0.02,
  //       "numeroRevolucionesMax": 0.01,
  //       "velocidadExpresadaMin": 0.04,
  //       "velocidadExpresadaMax": 10.03, 
  //   },
  //   {
  //     "idHelice": 2,
  //     "idMolinete": 3,
  //     "serieHelice": "Ser01Pruebas",
  //     "observaciones": "test",
  //     "constanteM": 0.03,
  //     "constanteB": 0.03,
  //     "numeroRevolucionesMin": 0.01,
  //     "numeroRevolucionesMax": 0.01,
  //     "velocidadExpresadaMin": 0.02,
  //     "velocidadExpresadaMax": 0.01,
      
  // }
  //   ];  
  //   const editar: any = {
  //     "idHelice": 1,
  //     "idMolinete": 1,
  //     "serieHelice": "Ser03Pruebas",
  //     "observaciones": "rte",
  //     "constanteM": 0.02,
  //     "constanteB": 0.01,
  //     "numeroRevolucionesMin": 0.02,
  //     "numeroRevolucionesMax": 0.01,
  //     "velocidadExpresadaMin": 0.04,
  //     "velocidadExpresadaMax": 10.03, 
  //   }; 
  //   component.EditarLista(editar);  
  //   component.formularioHelice.controls['idHelice'].setValue(1);
  //   expect(component.editar).toEqual(true);
  // });

// it('capturar',()=>{

// const tipo =1 

// var even:any = {
//   targe:{
//     files: [  {name: 'descarga.jpeg', size: 2967 }]  
//   }
// }

// component.capturar(even ,tipo)
// expect(component.imagenCargada ).toEqual('descarga.jpeg')

// })

});
