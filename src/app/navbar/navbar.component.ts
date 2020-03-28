import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'dah-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit {

	isMenuCollapsed: boolean

	constructor() {
		this.isMenuCollapsed = true;
	}

	ngOnInit(): void {
	}

}
