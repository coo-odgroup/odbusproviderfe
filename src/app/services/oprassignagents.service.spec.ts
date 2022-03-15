import { TestBed } from '@angular/core/testing';

import { OprassignagentsService } from './oprassignagents.service';

describe('OprassignagentsService', () => {
  let service: OprassignagentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OprassignagentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
