import { Component, OnInit, Input, Output, EventEmitter, Directive, ViewChildren, QueryList, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Patient } from '../core/patient.model';
import { Clinician } from '../core/clinician.model';
import { PatientsService } from '../core/patients.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AuthService } from '../auth.service';

export type SortColumn = keyof Patient | 'LastReportDate'| 'LastReportHearthRate' | 'LastReportOxygenation' | '';
export type SortDirection = 'asc' | 'desc' | '';
const rotate: {[key: string]: SortDirection} = { 'asc': 'desc', 'desc': '', '': 'asc' };
const compare = (v1: string, v2: string) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

export interface SortEvent {
	column: SortColumn;
	direction: SortDirection;
}

@Directive({
	selector: 'th[sortable]',
	host: {
		'[class.asc]': 'direction === "asc"',
		'[class.desc]': 'direction === "desc"',
		'(click)': 'rotate()'
	}
})

export class NgbdSortableHeader {
	@Input() sortable: SortColumn = '';
	@Input() direction: SortDirection = '';
	@Output() sort = new EventEmitter<SortEvent>();

	rotate() {
		this.direction = rotate[this.direction];
		this.sort.emit({column: this.sortable, direction: this.direction});
	}
}

@Component({
	selector: 'dah-patients',
	templateUrl: './patients.component.html',
	styleUrls: ['./patients.component.css'],
	providers: [ DecimalPipe ]
})

export class PatientsComponent implements OnInit {
	public clinician: Clinician;

	public patients: Patient[];
	public sortedPatients : Patient[];
	public isCollapsed: {[key: string] :boolean} = {};
	filteredPatients$ : Observable<Patient[]>;

	filter = new FormControl('');

	@ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

	constructor(private patientsService: PatientsService,
				private authService: AuthService,
				private pipe: DecimalPipe) {
	}

	ngOnInit(): void {
		this.patients = [];
		this.sortedPatients = [];
		this.filteredPatients$ = this.filter.valueChanges.pipe(
			startWith(''),
			map(text => this.search(text, this.pipe))
		);

		this.authService.currentClinician.subscribe(
			(clinician) => {
				this.clinician = clinician;
				if ( !clinician ) {
					this.patients = [];
					this.sortedPatients = [];
					this.isCollapsed = {};
					this.filter.setValue(this.filter.value);
					return;
				}
				this.patientsService.listUntreated(clinician.ID).subscribe( (list) => {
					this.patients = list;
					for ( let p of list ) {
						this.isCollapsed[p.ID] = true;
					}
					this.sortedPatients = this.patients;
					this.filter.setValue(this.filter.value);
				});
			});
	}

	search(text: string, pipe: PipeTransform): Patient[] {
		return this.sortedPatients.filter(patient => {
			const term = text.toLowerCase();
			return patient?.Name.toLowerCase().includes(term) || patient.LastReport?.Triage?.toLowerCase().includes(term);
		});
	}

	onSort({column, direction}: SortEvent) {

		// resetting other headers
		this.headers.forEach(header => {
			if (header.sortable !== column) {
				header.direction = '';
			}
		});
		// sorting entries
		if (direction === '' || column === '') {
			this.sortedPatients = this.patients;
		} else {
			this.sortedPatients = [...this.patients].sort((a, b) => {
				let res = 0;
				if ( column == "LastReportDate"
					|| column == "LastReportOxygenation"
					|| column == "LastReportHearthRate" ) {
					if ( a.LastReport == null ) {
						if ( b.LastReport == null ) {
							res = 0;
						} else {
							res = 1;
						}
					} else {
						if ( b.LastReport == null ) {
							res = -1;
						} else {
							let reportColumn = `Date`;
							res = compare(`${a['LastReport'][reportColumn]}`,`$b['LastReport'][reportColumn]`);
						}
					}
				} else {
					res = compare(`${a[column]}`, `${b[column]}`);
				}
				return direction === 'asc' ? res : -res;
			});
			this.filter.setValue(this.filter.value);
		}
	}


}
