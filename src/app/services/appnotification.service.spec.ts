import { TestBed } from '@angular/core/testing';

import { AppnotificationService } from './appnotification.service';

describe('AppnotificationService', () => {
  let service: AppnotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppnotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
