import { Injectable } from '@angular/core';
import { Adapter } from './adapter';

import { HealthReport, HealthReportAdapter } from './health-report.model';

export class Patient {
	readonly PatientID: string;
	public Name: string;
	public Phone: string;
	readonly LastReport: HealthReport;
	readonly MLTriage: string;
	public Language: string;
	public Treated: boolean;
	public DaysUnderInspection: number;

	constructor(id: string,
				name: string,
				phone: string,
				lastReport: HealthReport,
				MLTriage: string,
				language: string,
				treated: boolean,
				daysUnderInspection: number) {
		this.PatientID = id;
		this.Name = name;
		this.Phone = phone;
		this.LastReport = lastReport;
		this.MLTriage = MLTriage;
		this.Language = language;
		this.Treated = treated;
		this.DaysUnderInspection = daysUnderInspection;
	}


}


@Injectable({
    providedIn: 'root'
})

export class PatientAdapter implements Adapter<Patient> {
	constructor(private reportAdapter: HealthReportAdapter) {}

	adapt(item: any): Patient {
		let lastReport: HealthReport = null;
		if ( item.lastReport) {
			lastReport = this.reportAdapter.adapt(item.lastReport);
		}
		return new Patient(item.patientID,
						   item.name,
						   item.phone,
						   lastReport,
						   item.MLTriage,
						   item.language,
						   item.treated,
						   item.daysUnderInspection);
	}


}
