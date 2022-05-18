import { TestBed } from '@angular/core/testing';

import { ApiuserserviceService } from './apiuserservice.service';

describe('ApiuserserviceService', () => {
  let service: ApiuserserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiuserserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
