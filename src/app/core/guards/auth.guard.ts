import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from '@services/auth.service';

@Injectable({
	providedIn: 'root'
})
export class AuthGuard implements CanActivate {

	constructor(private router: Router,
				private authService: AuthService) {
	}

	canActivate(next: ActivatedRouteSnapshot,
				state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

		const currentClinician = this.authService.currentClinicianValue;
		if ( currentClinician ) {
			return true;
		}

		this.router.navigate(['/login'], {queryParams: { returnUrl: state.url }});
		return false;
  }

}
