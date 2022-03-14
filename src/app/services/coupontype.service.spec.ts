import { TestBed } from '@angular/core/testing';

import { CoupontypeService } from './coupontype.service';

describe('CoupontypeService', () => {
  let service: CoupontypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoupontypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
