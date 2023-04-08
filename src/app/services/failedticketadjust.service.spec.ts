import { TestBed } from '@angular/core/testing';

import { FailedticketadjustService } from './failedticketadjust.service';

describe('FailedticketadjustService', () => {
  let service: FailedticketadjustService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FailedticketadjustService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
