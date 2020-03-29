import { Component, OnInit, Input, AfterContentChecked } from '@angular/core';
import { Patient } from '../core/patient.model';
import { HealthReport } from '../core/health-report.model';
import { HealthReportsService } from '../health-reports.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable,throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

@Component({
	selector: 'dah-patient-details',
	templateUrl: './patient-details.component.html',
	styleUrls: ['./patient-details.component.css']
})

export class PatientDetailsComponent implements OnInit , AfterContentChecked{
	private bffPOSTURL = environment.bffEndpoint + '/outbound-call';
	private bffECHOURL = environment.bffEndpoint + '/echo';
	@Input() patient: Patient;

	public reports : HealthReport[] = null;

	private needPull: boolean = true;

	public isCollapsed = true;

	public status: string = '';
	public error: string = '';

	constructor(private reportService: HealthReportsService,
				private http: HttpClient) {
	}

	ngOnInit(): void {
	}

	ngAfterContentChecked(): void {
		if ( this.needPull == true ) {
			this.needPull = false;
			this.reportService.getForPatient(this.patient.ID).subscribe(item => {
				this.reports = item;
			});
		}
	}

	async ddelay(ms: number) {
		await new Promise(resolve => setTimeout(()=>resolve(), ms)).then(()=>console.log("fired"));
	}

	call() {
		if ( this.patient == null ) {
			return;
		}
		this.status = 'Calling ' + this.patient.Name;
		this.error = '';

		this.http.post(this.bffPOSTURL,{
			'from': '+1 404 666 8654',
			'to': this.patient.Phone,
			'patientID': this.patient.ID,
			'webhook': this.bffECHOURL,
		}).subscribe(
			(resp)=> {
				this.ddelay(100000).then(any => {
					this.status = '';
				});
			},
			(resp) => {
				this.error = 'Could not call ' + this.patient.Name + '!';
				this.status = '';
			});
	}
}
