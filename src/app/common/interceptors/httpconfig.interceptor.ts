import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpResponse,
    HttpHandler,
    HttpEvent
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token: string = sessionStorage.getItem('token') || "";

        if (token) {
            request = request.clone({ headers: request.headers.set('AuthorizationSish', 'Bearer ' + token) });
        }

        if (!request.headers.has('Content-Type')) {
            request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
        }

        request = request.clone({ headers: request.headers.set('Accept', 'application/json') });
        //request = request.clone({ headers: request.headers.set('AuthorizationSish', 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJtYXJpYXJlc3RyZXBvNzdAZ21haWwuY29tIiwiYXV0aCI6IkNvbnN1bHRhckRvbWluaW8sRWRpdGFyUm9sZXMiLCJleHAiOjE2Mzg4MzY2ODZ9.bcplmq4SnWDwVOMs0RhgDVqVnPIh5Ie7tQhZZWh8FO94_DGqaqz0Sf1cPcvYepCZkSj-ab7sZ5yNo80X-mndnA ') });
        return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
                // //
                // // Este código solo se usa para debug local en ambiente de desarrollo
                // if (event instanceof HttpResponse) {
                // }
                return event;
            }));
    }
}
