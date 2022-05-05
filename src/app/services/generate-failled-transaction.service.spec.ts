import { TestBed } from '@angular/core/testing';

import { GenerateFailledTransactionService } from './generate-failled-transaction.service';

describe('GenerateFailledTransactionService', () => {
  let service: GenerateFailledTransactionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenerateFailledTransactionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
