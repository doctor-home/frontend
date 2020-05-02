import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';


import { RouterModule } from '@angular/router';
import { ROUTES } from './app.routes';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { PatientsComponent, NgbdSortableHeader } from './patients/patients.component';
import { OrganizationsComponent } from './organizations/organizations.component';
import { PatientDetailsComponent } from './patient-details/patient-details.component';
import { HealthChartComponent } from './health-chart/health-chart.component';
import { PatientEditorComponent } from './patient-editor/patient-editor.component';
import { LoginComponent } from './login/login.component';

import { AuthInterceptor }  from '@interceptors/auth.interceptor';


@NgModule({
	declarations: [
		AppComponent,
		NavbarComponent,
		HomeComponent,
		PatientsComponent,
		NgbdSortableHeader,
		OrganizationsComponent,
		PatientDetailsComponent,
		HealthChartComponent,
		PatientEditorComponent,
		LoginComponent
	],
	imports: [
		RouterModule.forRoot(ROUTES),
		NgbModule,
		BrowserModule,
		FormsModule,
		ReactiveFormsModule,
		ChartsModule,
		HttpClientModule,
	],
	providers: [
		{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
	],
	bootstrap: [AppComponent]
})

export class AppModule { }
