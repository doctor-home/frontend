import { Component } from '@angular/core';
import * as Feather from 'feather-icons';

@Component({
	selector: 'dah-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})

export class AppComponent {
	title = 'doctor-at-home';
	ngAfterViewInit() {
		Feather.replace();
	}
}
