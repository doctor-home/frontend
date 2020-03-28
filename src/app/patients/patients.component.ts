import { Component, OnInit, Input, Output, EventEmitter, Directive, ViewChildren, QueryList } from '@angular/core';
import { Patient } from '../core/patient.model';
import { PatientsService } from '../core/patients.service';

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
	styleUrls: ['./patients.component.css']
})

export class PatientsComponent implements OnInit {
	public patients: Patient[];
	public sortedPatients : Patient[];

	@ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

	constructor(private patientsService: PatientsService) { }

	ngOnInit(): void {

		this.patients = [];
		this.patientsService.list().subscribe( (list) => {
			this.patients = list;
			this.sortedPatients = this.patients;
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
		}
	}

}
