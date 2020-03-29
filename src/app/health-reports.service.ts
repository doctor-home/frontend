import { Injectable } from '@angular/core';
import { HealthReport,HealthReportAdapter } from './core/health-report.model' ;
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})

export class HealthReportsService {

	private baseURL = environment.apiEndpoint + '/api/dah/v0';


	constructor(private reportAdapter: HealthReportAdapter,
				private http: HttpClient) {
	}

	getForPatient(patientID: string) : Observable<HealthReport[]> {
		return this.http.get(this.baseURL + '/patients/' + patientID + '/health-reports').pipe(
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
