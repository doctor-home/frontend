import { Injectable } from '@angular/core';
import { Adapter } from './adapter';

export class HealthReport {

	constructor(public Date: Date,
				public HearthBeat: number,
				public Oxygenation: number,
				public BreathingRate: number,
				public DaysUnderInspection: number) {
	}
}


@Injectable({
    providedIn: 'root'
})

export class HealthReportAdapter implements Adapter<HealthReport> {

	adapt(item: any): HealthReport {
		return new HealthReport(item.date,
								item.hearthBeat,
								item.oxygenation,
								item.breathingRate,
								item.dayInderInspection);
	}
}
