import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';

@NgModule({
	declarations: [
		AppComponent,
		NavbarComponent
	],
	imports: [
		NgbModule,
		BrowserModule
	],
	providers: [],
	bootstrap: [AppComponent]
})

export class AppModule { }
