import { TestBed } from '@angular/core/testing';

import { AssociationreportService } from './associationreport.service';

describe('AssociationreportService', () => {
  let service: AssociationreportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssociationreportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
