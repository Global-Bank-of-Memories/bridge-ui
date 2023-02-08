import { TestBed } from '@angular/core/testing';

import { GbmGoogleAnalyticsService } from './google-analytics.service';

describe('GbmGoogleAnalyticsService', () => {
	let service: GbmGoogleAnalyticsService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(GbmGoogleAnalyticsService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
