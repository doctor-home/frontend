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
				lastReport: {
					date: '2020-03-28T13:42:34Z',
					hearthBeat: 86,
					oxygenation: 97,
					breathingRate: 12,
					dayUnderInspection: 6,
				},
			},
			{
				name: 'Jean-Jacques Martin',
				patientID: 'jj',
				phone: '+33 79 123 45 67',
				MLTriage: 'emergency',
				language: 'fr',
				treated: true,
				lastReport: {
					date: '2020-03-28T13:42:34Z',
					hearthBeat: 96,
					oxygenation: 90,
					breathingRate: 44,
					dayUnderInspection: 2,
				},
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
