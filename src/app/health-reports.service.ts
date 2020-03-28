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
			},
			{
				date: '2020-03-27T14:21:45Z',
				hearthBeat: 67,
				oxygenation: 96,
				breathingRate: 12,
			},
			{
				date: '2020-03-27T18:22:15Z',
				hearthBeat: 75,
				oxygenation: 98,
				breathingRate: 13,
			},
			{
				date: '2020-03-28T08:12:13Z',
				hearthBeat: 79,
				oxygenation: 95,
				breathingRate: 12,
			},
			{
				date: '2020-03-28T14:46:13Z',
				hearthBeat: 79,
				oxygenation: 94,
				breathingRate: 18,
			},
			{
				date: '2020-03-28T19:46:13Z',
				hearthBeat: 79,
				oxygenation: 98,
				breathingRate: 18,
			},
			{
				date: '2020-03-29T10:05:56Z',
				hearthBeat: 79,
				oxygenation: 93,
				breathingRate: 25,
			},
			{
				date: '2020-03-29T13:05:56Z',
				hearthBeat: 86,
				oxygenation: 92,
				breathingRate: 29,
			},
			{
				date: '2020-03-29T18:05:56Z',
				hearthBeat: 98,
				oxygenation: 90,
				breathingRate: 30,
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
