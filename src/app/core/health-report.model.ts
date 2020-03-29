import { Injectable } from '@angular/core';
import { Adapter } from './adapter';

export class HealthReport {

	constructor(public Date: Date,
				public HearthBeat: number,
				public Oxygenation: number,
				public BreathingRate: number,
				public Temperature: number,
				public Triage: string) {
	}
}


@Injectable({
    providedIn: 'root'
})

export class HealthReportAdapter implements Adapter<HealthReport> {
	static triageConversion(value: number): string {
		switch(value) {
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
				return '<unknown>';
		}
	}

	adapt(item: any): HealthReport {
		return new HealthReport(new Date(item.timestamp),
								item.hearthBeat,
								item.oxygenation,
								item.breathingRate,
								item.temperature,
								HealthReportAdapter.triageConversion(item.ML_Triage));
	}
}
