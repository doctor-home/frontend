import { Component, OnInit } from '@angular/core';
import { Patient } from '@models/patient.model';
import { Clinician } from '@models/clinician.model';
import { PatientsService } from '@services/patients.service';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import * as libphonenumber from 'google-libphonenumber';

import { AuthService } from '@services/auth.service';

export class PhoneValidator {
	static validCountryPhone = (): ValidatorFn => {
		return (phoneControl: AbstractControl): {[key: string]:boolean} => {
			try {
				const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();
				const phoneNumber = '' + phoneControl.value + '';
				const pNumber = phoneUtil.parseAndKeepRawInput(phoneNumber, '');
				const isValidNumber = phoneUtil.isValidNumber(pNumber);

				if (isValidNumber) {
					return undefined;
				}
			} catch (e) {
				return {
					invalidCountryPhone: true
				};
			}

			return {
				invalidCountryPhone: true
			};
		}
	};
}

@Component({
	selector: 'dah-patient-editor',
	templateUrl: './patient-editor.component.html',
	styleUrls: ['./patient-editor.component.css']
})

export class PatientEditorComponent implements OnInit {

	public patient: Patient = new Patient('','','',0,'','','',true,0, 0,null);


	public nameCtrl : FormControl;
	public phoneCtrl : FormControl;
	public languageCtrl : FormControl;
	private idCtrl : FormControl;
	public ageCtrl : FormControl;
	public cityCtrl : FormControl;
	public preconditionsCtrl : FormControl;
	public fitnessCtrl : FormControl;


	public patientForm: FormGroup;

	public clinician: Clinician;

	error: string = '';
	constructor(private patientsService: PatientsService,
				private route: ActivatedRoute,
				private router: Router,
				private http: HttpClient,
				fb: FormBuilder,
				private authService: AuthService) {
		this.nameCtrl = fb.control('',
								  [Validators.required]);
		this.phoneCtrl = fb.control('',[
			Validators.required,
			PhoneValidator.validCountryPhone()
		]);
		this.languageCtrl = fb.control('',[
			Validators.required,
			Validators.pattern('French|German|English|Italian|Dutch'),
		]);
		this.idCtrl = fb.control('');
		this.ageCtrl = fb.control('',
								  [Validators.required,
								   Validators.min(0),
								   Validators.max(140)]);
		this.cityCtrl = fb.control('',
								   [Validators.required]);
		this.preconditionsCtrl = fb.control('');

		this.fitnessCtrl = fb.control('');

		this.patientForm = fb.group({
			name: this.nameCtrl,
			phone: this.phoneCtrl,
			id: this.idCtrl,
			language: this.languageCtrl,
			age: this.ageCtrl,
			city: this.cityCtrl,
			fitness: this.fitnessCtrl,
			preconditions: this.preconditionsCtrl,
		});


	}

	ngOnInit(): void {

		this.authService.currentClinician.subscribe((clinician) => {
			this.clinician = clinician;
		});


		this.route.paramMap.subscribe( (params:  ParamMap) => {
			const id = params.get('patientId:');
			if ( id != null ) {
				this.patientsService.getPatient(id).subscribe(patient => {
					this.patient = patient
					this.nameCtrl.setValue(patient.Name);
					this.idCtrl.setValue(patient.ID);
					this.phoneCtrl.setValue(patient.Phone);
					this.languageCtrl.setValue(patient.Language);
					this.ageCtrl.setValue(patient.Age);
					this.cityCtrl.setValue(patient.City);
					this.preconditionsCtrl.setValue(patient.Preconditions);
					this.fitnessCtrl.setValue(patient.Fitness);
				});
			}
		});
	}

	register(): void {

		this.patientsService.push(new Patient(
			this.idCtrl.value,
			this.nameCtrl.value,
			this.phoneCtrl.value,
			this.ageCtrl.value,
			this.cityCtrl.value,
			this.preconditionsCtrl.value,
			this.languageCtrl.value,
			true,
			0,
			this.fitnessCtrl.value,
			null))
			.subscribe((ok) => {
				console.log( "couou");
				this.router.navigate(["/patients"]);
			});
	}
}
