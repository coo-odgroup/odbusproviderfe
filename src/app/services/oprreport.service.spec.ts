import { TestBed } from '@angular/core/testing';

import { OprreportService } from './oprreport.service';

describe('OprreportService', () => {
  let service: OprreportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OprreportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
