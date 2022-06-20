import { TestBed } from '@angular/core/testing';

import { ApipnrdisputesService } from './apipnrdisputes.service';

describe('ApipnrdisputesService', () => {
  let service: ApipnrdisputesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApipnrdisputesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
