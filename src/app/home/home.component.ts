import { Component, OnInit } from '@angular/core';
import { Clinician } from '../core/clinician.model';
import { AuthService } from '../auth.service';

@Component({
	selector: 'dah-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
	clinician: Clinician;
	constructor(private authService: AuthService) {
	}

	ngOnInit(): void {
		this.authService.currentClinician.subscribe((clinician) => {
			this.clinician = clinician;
		});
	}

}
