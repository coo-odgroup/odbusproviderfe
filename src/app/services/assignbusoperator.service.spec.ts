import { TestBed } from '@angular/core/testing';

import { AssignbusoperatorService } from './assignbusoperator.service';

describe('AssignbusoperatorService', () => {
  let service: AssignbusoperatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssignbusoperatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
