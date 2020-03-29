import { Injectable } from '@angular/core';
import { Patient,PatientAdapter } from './patient.model' ;
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
	providedIn: 'root'
})

export class PatientsService {
	private baseURL = environment.apiEndpoint + '/api/dah/v0';

	constructor(private patientAdapter: PatientAdapter,
				private http: HttpClient) {
	}

	listUntreated(clinicianID: string) : Observable<Patient[]> {
		return this.http.get(this.baseURL + '/clinician/' + clinicianID + '/untreatedpatients').pipe(
			map(item => {
				let items = item as any[];
				let res: Patient[] = [];
				for ( let i of items) {
					res.push(this.patientAdapter.adapt(i));
				}
				return res;
			}));
	}

	getPatient(patientID: string): Observable<Patient> {
		return this.http.get(this.baseURL + '/patients/' + patientID).pipe(
			map( item => {
				return this.patientAdapter.adapt(item);
			}));
	}
}
