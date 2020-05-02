import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Clinician,ClinicianAdapter }  from '@models/clinician.model';


@Injectable({
	providedIn: 'root'
})
export class AuthService {
	private currentClinicianSubject: BehaviorSubject<Clinician>;
	public currentClinician: Observable<Clinician>;

	constructor(private http: HttpClient,
				private adapter: ClinicianAdapter) {
		this.currentClinicianSubject = new BehaviorSubject<Clinician>(JSON.parse(localStorage.getItem('currentClinician')));
        this.currentClinician = this.currentClinicianSubject.asObservable();
	}

	public get currentClinicianValue(): Clinician {
		return this.currentClinicianSubject.value;
	}

	login(username: string, password: string): Observable<Clinician> {
		const headers = new HttpHeaders({Authorization: 'Basic '+btoa(username+':'+password)});
		return this.http.get(environment.apiEndpoint + '/api/dah/v0/clinician/current',
							 {headers: headers}).pipe(map((item) => {
								 let clinician = this.adapter.adapt(item);
								 clinician.AuthData = btoa(username + ':' + password );
								 localStorage.setItem('currentClinician', JSON.stringify(clinician));
								 this.currentClinicianSubject.next(clinician);
								 return clinician;
							 }));
	}

	logout() {
		localStorage.removeItem('currentClinician');
		this.currentClinicianSubject.next(null);
	}

}
