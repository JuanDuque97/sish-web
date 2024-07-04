import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CONFIG } from 'src/app/common/utils/constantes';
import { HandlerExceptions } from 'src/app/common/utils/handlerexception'; 
import { IQrElemento} from 'src/app/modelo/configuracion/qrElemento'; 
import Swal from 'sweetalert2';
@Injectable({
  providedIn: 'root'
})
export class ServiciosQRService {
  private toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
  });
  constructor(private http: HttpClient) {
    // Esto es intencional
  }

  crear(qrElemento: IQrElemento): Observable<IQrElemento> {
    return this.http.post<IQrElemento>(CONFIG.WS_END_POINT + 'qrElemento/crear', qrElemento).pipe(
      catchError((e) => {
     
          HandlerExceptions.validarExcepcionesHTTP(e);
         
          return throwError(e);
      
      })
    );
    
  }





}
