import { TestBed } from '@angular/core/testing';

import { AdjustticketService } from './adjustticket.service';

describe('AdjustticketService', () => {
  let service: AdjustticketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdjustticketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
