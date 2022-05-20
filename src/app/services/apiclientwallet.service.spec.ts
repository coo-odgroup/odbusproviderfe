import { TestBed } from '@angular/core/testing';

import { ApiclientwalletService } from './apiclientwallet.service';

describe('ApiclientwalletService', () => {
  let service: ApiclientwalletService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiclientwalletService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
