import { TestBed } from '@angular/core/testing';

import { AssignbusService } from './assignbus.service';

describe('AssignbusService', () => {
  let service: AssignbusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssignbusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
