import { TestBed } from '@angular/core/testing';

import { AssocassignbusService } from './assocassignbus.service';

describe('AssocassignbusService', () => {
  let service: AssocassignbusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssocassignbusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
