import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { map,mergeMap } from 'rxjs/operators';

import { Clinician,ClinicianAdapter }  from '@models/clinician.model';


@Injectable({
	providedIn: 'root'
})
export class AuthService {
	private currentClinicianSubject: BehaviorSubject<Clinician>;
	public currentClinician: Observable<Clinician>;
	private jwt: string;

	constructor(private http: HttpClient,
				private adapter: ClinicianAdapter) {
		this.currentClinicianSubject = new BehaviorSubject<Clinician>(JSON.parse(localStorage.getItem('currentClinician')));
        this.currentClinician = this.currentClinicianSubject.asObservable();
	}

	public get currentClinicianValue(): Clinician {
		return this.currentClinicianSubject.value;
	}

	login(username: string, password: string): Observable<Clinician> {
		this.logout();
		return this.http.post(environment.apiEndpoint + '/api/dah/auth/login',
							  { 'username': username,
								'password': password })
			.pipe(
				mergeMap( (resp) => {
					this.jwt = resp['token'];
					const headers = new HttpHeaders({ Authorization: 'Bearer '+ this.jwt});
					return this.http.get(environment.apiEndpoint + '/api/dah/v0/clinicians/current/',
										 {headers: headers});
				}),
				map( (item) => {
					let clinician = this.adapter.adapt(item);
					clinician.AuthData = this.jwt;
					localStorage.setItem('currentClinician',JSON.stringify(clinician));
					this.currentClinicianSubject.next(clinician);
					return clinician;
				}));
	}

	logout() {
		localStorage.removeItem('currentClinician');
		this.jwt = '';
		this.currentClinicianSubject.next(null);
	}
}
