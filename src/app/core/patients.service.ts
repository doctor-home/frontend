import { Injectable } from '@angular/core';
import { Patient,PatientAdapter } from './patient.model' ;
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
	providedIn: 'root'
})

export class PatientsService {

	private stubData = new Observable(subscribers => {
		subscribers.next([
			{
				name: 'John Doe',
				patientID: 'john1',
				phone: '+41 79 123 45 67',
				MLTriage: 'good',
				language: 'en',
				treated: false,
			},
			{
				name: 'Anna Smith',
				patientID: 'anna2',
				phone: '+41 79 321 45 46',
				MLTriage: 'emergency',
				language: 'en',
				treated: false,
			}
		]);
	});

	constructor(private patientAdapter: PatientAdapter) {
	}

	list() : Observable<Patient[]> {
		return  this.stubData.pipe(
			map(item => {
				let items = item as any[];
				let res: Patient[] = [];
				for ( let i of items) {
					res.push(this.patientAdapter.adapt(i));
				}
				return res;
			}));
	}
}
