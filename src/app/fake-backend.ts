import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

import { Clinician } from './core/clinician.model';
import { Patient } from './core/patient.model';
import { HealthReport } from './core/health-report.model';

const users: Clinician[] = [new Clinician('johndoe1', 'John Doe',[],'test','test','')];

const patients: Patient[] = [
	new Patient('johndoe1',
				'John Doe',
				'+41 79 123 45 67',
				65,
				'Hamburg',
				'Diabete Type II',
				'en',
				true,
				3,
				new HealthReport(new Date('2020-03-28T13:42:34Z'),
								 86,
								 97,
								 12,
								 37.8,
								 'good')),
	new Patient('jeanjacques1',
				'Jean-Jacques Martin',
				'+33 79 123 45 67',
				70,
				'Avignon',
				'',
				'fr',
				true,
				6,
				new HealthReport(new Date('2020-03-27T13:42:34Z'),
								 96,
								 90,
								 44,
								 38.3,
								 'emergency')),
	new Patient('annasmith2',
				'Anna Smith',
				'+44 79 321 45 46',
				58,
				'Sion',
				'',
				'en',
				false,
				1,
				null)
];

const reports: HealthReport[] = [

];


@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;

        // wrap in delayed observable to simulate server api call
        return of(null)
            .pipe(mergeMap(handleRoute))
            .pipe(materialize()) // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
            .pipe(delay(500))
            .pipe(dematerialize());

        function handleRoute() {
            switch (true) {
                case url.endsWith('/api/dah/v0/clinician/current') && method === 'GET':
                    return authenticate();
				case url.endsWith('/api/dah/v0/clinician/johndoe1/patients') && method === 'GET':
					return getPatients(false);
				case url.endsWith('/api/dah/v0/clinician/johndoe1/untreatedpatients') && method === 'GET':
					return getPatients(true);
				case url.indexOf('/api/dah/v0/patients') != -1 && method == 'GET':
					if ( url.endsWith('/health-reports') ) {
						return next.handle(request);
					} else {
						const splitted = url.split('/');
						return getPatient(splitted[splitted.length-1]);
					}
                default:
                    // pass through any requests not handled above
                    return next.handle(request);
            }
        }

        // route functions
        function authenticate() {
			const auth = headers.get('Authorization')
			if ( auth == null ) {
				return error('Username or password is not provided');
			}
			const fields = atob(auth.replace('Basic ','')).split(":",2);
			if ( fields.length != 2 ) {
				return error('Invalid auth token');
			}

            const user = users.find(x => x.Username === fields[0] && x.Password === fields[1]);
            if ( user == null) {
				return error('Username or password is incorrect');
			}
            return ok({
                clinicianID: user.ID,
                username: user.Username,
                name: user.Name,
            });
        }

		function reportToJson(r: HealthReport) {
			return {
				timestamp: r.Date,
				hearthBeat: r.HearthBeat,
				oxygenation: r.Oxygenation,
				temperature: r.Temperature,
				breathingRate: r.BreathingRate,
				ML_Triage: r.Triage == 'good' ? 1 : 5,
			};
		}

		function patientToJson(p: Patient) {
			let res = {
				patientID: p.ID,
				name: p.Name,
				phone: p.Phone,
				age: p.Age,
				city: p.City,
				language: p.Language,
				preconditions: p.Preconditions,
				daysUnderInspection: p.DaysUnderInspection,
				under_observation: p.UnderObservation,
			};

			if ( p.LastReport != null ) {
				const report = reportToJson(p.LastReport);
				res['summary'] = {
					lastReport: report,
				}
			}
			return res;
		}

		function getPatients(onlyObserved: boolean) {
			let res = [];
			for ( let p of patients ) {
				const pp = patientToJson(p);
				res.push(pp);
			}
			if ( onlyObserved == true ) {
				return ok([res[0],res[1]]);
			}
			return ok(res);
		}

		function getPatient(patientID: string) {
            const p = patients.find(x => x.ID === patientID);
			if ( !p ) {
				return error('Not found');
			}
			const pp = patientToJson(p);
			return ok(pp);
		}

        // helper functions
        function ok(body?) {
            return of(new HttpResponse({ status: 200, body }))
        }

        function error(message) {
            return throwError({ error: { message } });
        }

        function unauthorized() {
            return throwError({ status: 401, error: { message: 'Unauthorised' } });
        }

        function isLoggedIn() {
            return headers.get('Authorization') === `Basic ${window.btoa('test:test')}`;
        }
    }
}

export let fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};
