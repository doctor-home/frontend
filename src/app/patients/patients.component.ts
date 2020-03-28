import { Component, OnInit } from '@angular/core';
import { Patient } from '../core/patient.model';
import { PatientsService } from '../core/patients.service';


@Component({
	selector: 'dah-patients',
	templateUrl: './patients.component.html',
	styleUrls: ['./patients.component.css']
})

export class PatientsComponent implements OnInit {
	private patients: Patient[];


	constructor(private patientsService: PatientsService) { }

	ngOnInit(): void {

		this.patients = [];
		this.patientsService.list().subscribe( (list) => {
			this.patients = list;
		});

	}

}
