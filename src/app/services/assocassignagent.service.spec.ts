import { TestBed } from '@angular/core/testing';

import { AssocassignagentService } from './assocassignagent.service';

describe('AssocassignagentService', () => {
  let service: AssocassignagentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssocassignagentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
