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
			case 0:
				return 'good';
			case 1:
				return 'emergency';
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
