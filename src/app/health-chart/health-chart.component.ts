import { Component, OnInit, Input } from '@angular/core';
import { HealthReport } from '../core/health-report.model';
import { ChartDataSets, ChartType, ChartOptions, ChartPoint } from 'chart.js';

@Component({
	selector: 'dah-health-chart',
	templateUrl: './health-chart.component.html',
	styleUrls: ['./health-chart.component.css']
})
export class HealthChartComponent implements OnInit {

	public scatterChartOptions: ChartOptions = {
		responsive: true,
		scales: {
			xAxes: [
				{
					scaleLabel: {
						display: true,
						labelString: 'Time(h)',
					},
					display: true,
				}
			],
			yAxes: [
				{
					type: 'linear',
					display: true,
					position: 'right',
					id: 'y-oxygenation',
					gridLines: { drawOnChartArea: false},
					scaleLabel:{display: true,labelString: 'Oxygenation (%)'},
				},
				{
					type: 'linear',
					display: true,
					position: 'left',
					id: 'y-pulse',
					scaleLabel:{display: true,labelString: 'Pulse (BPM)'},
				}
			]
		}
	};

	public scatterChartData: ChartDataSets[] = [
		{
			label: 'Pulse',
			borderColor: '#ff7f0e',
			backgroundColor: '#ff7f0e77',
			fill: true,
			showLine: true,
			//			lineTension: 0,
			data: [
				{ x: 0, y: 65 },
				{ x: 3, y: 68 },
				{ x: 6, y: 87 },
				{ x: 9, y: 83 },
			],
			yAxisID: 'y-pulse'
		},
		{
			label: 'Oxygenation',
			borderColor: '#1f77b4',
			backgroundColor: '#1f77b477',
			fill: true,
			showLine: true,
			//lineTension: 0,
			data: [
				{x:0,y:90},
				{x:1,y:90.3},
				{x:3,y:99.8},
				{x:6,y:91.2},
				{x:9,y:90.8}
			],
			yAxisID: 'y-oxygenation'
		},
	];

	public scatterChartType: ChartType = 'scatter';


	@Input()
	set reports(value: HealthReport[]) {
		if (value == null || value.length == 0 ) {
			this.scatterChartData[0].data = [];
			this.scatterChartData[1].data = [];
			return;
		}
		let start: Date = value[0].Date
		let pulseData = [];
		let oxygenationData = [];

		for ( let r of value ) {
			let curTime = (r.Date.getTime() - start.getTime()) / 36e5;
			pulseData.push({x:curTime, y: r.HearthBeat});
			oxygenationData.push({x:curTime, y: r.Oxygenation});
		}
		this.scatterChartData[0].data = pulseData;
		this.scatterChartData[1].data = oxygenationData;

	}

	constructor() { }

	ngOnInit(): void {
	}

}
