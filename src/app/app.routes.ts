import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PatientsComponent } from './patients/patients.component';
import { OrganizationsComponent } from './organizations/organizations.component';
import { PatientEditorComponent } from './patient-editor/patient-editor.component';
import { LoginComponent } from './login/login.component';

import { AuthGuard } from '@guards/auth.guard';

export const ROUTES: Routes = [
	{ path: '', component: HomeComponent },
	{ path: 'login', component: LoginComponent },
	{ path: 'patients', component: PatientsComponent, canActivate: [AuthGuard] },
	{ path: 'organizations', component: OrganizationsComponent, canActivate: [AuthGuard] },
	{ path: 'patients/new', component: PatientEditorComponent,canActivate: [AuthGuard] },
	{ path: 'patients/:patientId:', component: PatientEditorComponent, canActivate: [AuthGuard] }
];
