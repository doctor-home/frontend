import { Component, OnInit } from '@angular/core';
import { Patient } from '../core/patient.model';
import { PatientsService } from '../core/patients.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import * as libphonenumber from 'google-libphonenumber';

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
				console.log(e);
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

	public patient: Patient = new Patient('','','',null,'','',false,0);


	public nameCtrl : FormControl;
	public phoneCtrl : FormControl;
	public languageCtrl : FormControl;
	private idCtrl : FormControl;
	public patientForm: FormGroup;



	constructor(private patientsService: PatientsService,
				private route: ActivatedRoute,
				fb: FormBuilder) {
		this.nameCtrl = fb.control('',
								  [Validators.required]);
		this.phoneCtrl = fb.control('',[
			Validators.required,
			PhoneValidator.validCountryPhone()
		]);
		this.languageCtrl = fb.control('',[
			Validators.required,
			Validators.pattern('fr|de|en|it'),
		]);
		this.idCtrl = fb.control('');
		this.patientForm = fb.group({
			name: this.nameCtrl,
			phone: this.phoneCtrl,
			id: this.idCtrl,
			language: this.languageCtrl,
		});

	}

	ngOnInit(): void {
		this.route.paramMap.subscribe( (params:  ParamMap) => {
			const id = params.get('patientId:');
			if ( id != null ) {
				this.patientsService.getPatient(id).subscribe(patient => {
					this.patient = patient
					this.nameCtrl.setValue(patient.Name);
					this.idCtrl.setValue(patient.PatientID);
					this.phoneCtrl.setValue(patient.Phone);
					this.languageCtrl.setValue(patient.Language);
				});
			}
		});
	}

	register(): void {

	}
}
