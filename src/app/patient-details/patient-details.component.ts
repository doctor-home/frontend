import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { Patient } from '../core/patient.model';
import { HealthReport } from '../core/health-report.model';
import { HealthReportsService } from '../health-reports.service';

@Component({
	selector: 'dah-patient-details',
	templateUrl: './patient-details.component.html',
	styleUrls: ['./patient-details.component.css']
})

export class PatientDetailsComponent implements OnInit , AfterViewInit{
	@Input() patient: Patient;

	public reports : HealthReport[] = null;

	public isCollapsed = true;

	constructor(private reportService: HealthReportsService) {
	}

	ngOnInit(): void {
	}

	ngAfterViewInit(): void {
		if ( this.reports == null ) {
			console.log('Fetching reports for ' + this.patient.Name);
			this.reportService.getForPatient(this.patient.PatientID).subscribe(item => {
				this.reports = item;
			});
		}
	}


}
