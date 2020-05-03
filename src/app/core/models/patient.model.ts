import { Injectable } from '@angular/core';
import { Adapter } from './adapter';

import { HealthReport, HealthReportAdapter } from './health-report.model';

export interface PatientJSON {
    patientID: string,
    name: string,
	phone: string,
	age: number,
	fitness: number,
	city: string,
	preconditions: string,
	language: string,
	under_observation: boolean,
}

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
				public Fitness: number,
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
		if ( item.patientSummary && item.patientSummary.lastReport ) {
			lastReport = this.reportAdapter.adapt(item.patientSummary.lastReport);
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
						   item.fitness,
						   lastReport);
	}


}
