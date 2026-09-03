import { TestBed } from '@angular/core/testing';

import { AgentfaqService } from './agentfaq.service';

describe('AgentfaqService', () => {
  let service: AgentfaqService;

  beforeEach(() => {
    TestBed.configureTestingModule({});

    service = TestBed.inject(AgentfaqService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
