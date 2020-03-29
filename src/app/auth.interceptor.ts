import { Injectable } from '@angular/core';
import {
	HttpRequest,
	HttpHandler,
	HttpEvent,
	HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

import {  AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

	constructor(private authService: AuthService) {}

	intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
		const currentClinician = this.authService.currentClinicianValue;
		if ( currentClinician && currentClinician.AuthData ) {
			request = request.clone({
				setHeaders: {
					Authorization: 'Basic ' + currentClinician.AuthData
				}
			});
		}

		return next.handle(request);
	}

}
