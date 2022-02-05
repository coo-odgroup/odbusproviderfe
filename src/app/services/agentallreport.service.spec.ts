import { TestBed } from '@angular/core/testing';

import { AgentallreportService } from './agentallreport.service';

describe('AgentallreportService', () => {
  let service: AgentallreportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgentallreportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
