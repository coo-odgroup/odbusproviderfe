import { TestBed } from '@angular/core/testing';

import { TicketfareslabService } from './ticketfareslab.service';

describe('TicketfareslabService', () => {
  let service: TicketfareslabService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TicketfareslabService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
