import { Injectable } from '@angular/core';
import { Adapter } from './adapter';

import { HealthReport, HealthReportAdapter } from './health-report.model';

export class Patient {

	constructor(public ID: string,
				public Name: string,
				public Phone: string,
				public Age: number,
				public City: string,
				public Preconditions: string,
				public Language: string,
				public UnderObservation: boolean,
				public DaysUnderInspection: number,
				public LastReport: HealthReport) {
	}

}

@Injectable({
    providedIn: 'root'
})

export class PatientAdapter implements Adapter<Patient> {
	constructor(private reportAdapter: HealthReportAdapter) {}

	adapt(item: any): Patient {
		let lastReport: HealthReport = null;
		if ( item.summary && item.summary.lastReport ) {
			lastReport = this.reportAdapter.adapt(item.summary.lastReport);
		}
		return new Patient(item.patientID,
						   item.name,
						   item.phone,
						   item.age,
						   item.city,
						   item.preconditions,
						   item.language,
						   item.under_observation,
						   item.daysUnderInspection,
						   lastReport);
	}


}
