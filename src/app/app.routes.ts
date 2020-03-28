import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PatientsComponent } from './patients/patients.component';
import { OrganizationsComponent } from './organizations/organizations.component';


export const ROUTES: Routes = [
	{ path: '', component: HomeComponent },
	{ path: 'patients', component: PatientsComponent },
	{ path: 'organizations', component: OrganizationsComponent }
];
