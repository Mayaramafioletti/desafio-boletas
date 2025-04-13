import { TestBed } from '@angular/core/testing';

import { FundosService } from './fundos.service';

describe('FundosService', () => {
  let service: FundosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FundosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
