import { Component, OnInit } from '@angular/core';
import { AuthService } from '@services/auth.service';

@Component({
	selector: 'dah-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit {

	isMenuCollapsed: boolean
	isLogged: boolean

	constructor(private authService: AuthService) {
		this.isMenuCollapsed = true;
	}

	ngOnInit(): void {
		this.authService.currentClinician.subscribe((clinician) => {
			this.isLogged = clinician != null;
		});
	}

	logout(): void {
		this.authService.logout();
	}

}
