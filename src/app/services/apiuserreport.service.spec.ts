import { TestBed } from '@angular/core/testing';

import { ApiuserreportService } from './apiuserreport.service';

describe('ApiuserreportService', () => {
  let service: ApiuserreportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiuserreportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
