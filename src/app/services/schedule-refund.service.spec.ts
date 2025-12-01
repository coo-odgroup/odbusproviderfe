import { TestBed } from '@angular/core/testing';

import { ScheduleRefundService } from './schedule-refund.service';

describe('ScheduleRefundService', () => {
  let service: ScheduleRefundService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScheduleRefundService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
