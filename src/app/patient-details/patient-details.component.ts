import { Component, OnInit, Input, AfterContentChecked } from '@angular/core';
import { Patient } from '../core/patient.model';
import { HealthReport } from '../core/health-report.model';
import { HealthReportsService } from '../health-reports.service';

@Component({
	selector: 'dah-patient-details',
	templateUrl: './patient-details.component.html',
	styleUrls: ['./patient-details.component.css']
})

export class PatientDetailsComponent implements OnInit , AfterContentChecked{
	@Input() patient: Patient;

	public reports : HealthReport[] = null;

	private needPull: boolean = true;

	public isCollapsed = true;

	constructor(private reportService: HealthReportsService) {
	}

	ngOnInit(): void {
	}

	ngAfterContentChecked(): void {
		if ( this.needPull == true ) {
			this.needPull = false;
			this.reportService.getForPatient(this.patient.ID).subscribe(item => {
				console.log(item);
				this.reports = item;
			});
		}
	}


}
