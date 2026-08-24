import { TestBed } from '@angular/core/testing';

import { NotificationLogsService } from './notification-logs.service';

describe('NotificationLogsService', () => {
  let service: NotificationLogsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationLogsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
