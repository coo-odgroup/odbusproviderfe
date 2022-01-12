import { TestBed } from '@angular/core/testing';

import { AdmincancelticketService } from './admincancelticket.service';

describe('AdmincancelticketService', () => {
  let service: AdmincancelticketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdmincancelticketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
