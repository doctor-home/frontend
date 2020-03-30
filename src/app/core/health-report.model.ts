import { Injectable } from '@angular/core';
import { Adapter } from './adapter';

export class HealthReport {

	constructor(public Date: Date,
				public HearthBeat: number,
				public Oxygenation: number,
				public BreathingRate: number,
				public Temperature: number,
				public Triage: number) {
	}

	triageDisplayLevel(): string {
		switch(this.Triage) {
			case 1:
				return '';
			case 2:
				return '';
			case 3:
				return 'table-warning';
			case 4:
				return 'table-warning';
			case 5:
				return 'table-danger';
			default:
				return '';
		}

	}

	triageDescription(): string {
		switch(this.Triage) {
			case 1:
				return 'non urgent';
			case 2:
				return 'standard'
			case 3:
				return 'urgent'
			case 4:
				return 'critical';
			case 5:
				return 'immediate assistance';
			default:
				return 'standard';
		}
	}

}


@Injectable({
    providedIn: 'root'
})

export class HealthReportAdapter implements Adapter<HealthReport> {

	adapt(item: any): HealthReport {
		return new HealthReport(new Date(item.timestamp),
								item.heartBeat,
								item.oxygenation,
								item.breathingRate,
								item.temperature,
								item.ML_Triage);
	}
}
