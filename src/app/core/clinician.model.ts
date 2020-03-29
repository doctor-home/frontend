import { Injectable } from '@angular/core';
import { Adapter } from './adapter';
import { Patient, PatientAdapter }  from './patient.model';

export class Clinician {
	constructor (public ID: string,
				 public Name: string,
				 public Patients: Patient[],
				 public Username: string,
				 public Password: string,
				 public AuthData: string) {
	}
}

@Injectable({
    providedIn: 'root'
})

export class ClinicianAdapter implements Adapter<Clinician> {
	constructor(private patientAdapter: PatientAdapter) {}

	adapt(item: any): Clinician {
		let patients: Patient[] = [];
		if ( item.patients ) {
			for ( let p of item.patients ) {
				patients.push(this.patientAdapter.adapt(p));
			}
		}

		return new Clinician(item.clinicianID,
							 item.name,
							 patients,
							 item.username,
							 item.password,
							 '');
	}


}
