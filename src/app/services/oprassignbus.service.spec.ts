import { TestBed } from '@angular/core/testing';

import { OprassignbusService } from './oprassignbus.service';

describe('OprassignbusService', () => {
  let service: OprassignbusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OprassignbusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
