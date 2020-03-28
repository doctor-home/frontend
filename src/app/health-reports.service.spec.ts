import { TestBed } from '@angular/core/testing';

import { HealthReportsService } from './health-reports.service';

describe('HealthReportsService', () => {
  let service: HealthReportsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HealthReportsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
