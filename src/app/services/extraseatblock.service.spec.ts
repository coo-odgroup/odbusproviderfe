import { TestBed } from '@angular/core/testing';

import { ExtraseatblockService } from './extraseatblock.service';

describe('ExtraseatblockService', () => {
  let service: ExtraseatblockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExtraseatblockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
