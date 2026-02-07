import { TestBed } from '@angular/core/testing';

import { DisplayinfoService } from './displayinfo.service';

describe('DisplayinfoService', () => {
  let service: DisplayinfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DisplayinfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
