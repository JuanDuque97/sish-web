import { HttpErrorResponse } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import Swal from 'sweetalert2';


export class HandlerExceptions {
    static validarExcepcionesHTTP(e: HttpErrorResponse): Observable<any> {
        console.log("validar", e)
        if (e.status != 200) {
           Swal.fire('Ups!', e.error.errors ? e.error.errors.map((err:any) => err+'<br/>').join('') : e.error.detail, 'error');
        }        
        return throwError(e);
    }
}