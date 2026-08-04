import { TestBed } from '@angular/core/testing';

import { CampaignnotificationService } from './campaignnotification.service';

describe('CampaignnotificationService', () => {
  let service: CampaignnotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CampaignnotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
