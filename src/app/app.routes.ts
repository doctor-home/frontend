import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PatientsComponent } from './patients/patients.component';
import { OrganizationsComponent } from './organizations/organizations.component';
import { PatientEditorComponent } from './patient-editor/patient-editor.component';


export const ROUTES: Routes = [
	{ path: '', component: HomeComponent },
	{ path: 'patients', component: PatientsComponent },
	{ path: 'organizations', component: OrganizationsComponent },
	{ path: 'patients/new', component: PatientEditorComponent },
	{ path: 'patients/:patientId:', component: PatientEditorComponent }
];
