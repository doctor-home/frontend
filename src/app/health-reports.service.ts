import { Injectable } from '@angular/core';
import { HealthReport,HealthReportAdapter } from './core/health-report.model' ;
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})

export class HealthReportsService {
	private stubData = new Observable(subscribers => {
		subscribers.next([
			{
				date: '2020-03-27T09:32:34Z',
				hearthBeat: 65,
				oxygenation: 97,
				breathingRate: 12,
				dayUnderInspection: 1,
			},
			{
				date: '2020-03-27T14:21:45Z',
				hearthBeat: 67,
				oxygenation: 96,
				breathingRate: 12,
				dayUnderInspection: 1,
			},
			{
				date: '2020-03-27T14:21:45Z',
				hearthBeat: 67,
				oxygenation: 96,
				breathingRate: 12,
				dayUnderInspection: 1,
			},
		]);
	});

	constructor(private reportAdapter: HealthReportAdapter) {
	}

	getForPatient(patientID: string) : Observable<HealthReport[]> {
		return this.stubData.pipe(
			map(item => {
				let items = item as any[];
				let res : HealthReport[] = [];
				for ( let i of items) {
					res.push(this.reportAdapter.adapt(i));
				}
				return res;
			}));
	}
}
