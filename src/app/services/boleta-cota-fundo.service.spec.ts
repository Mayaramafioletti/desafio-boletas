import { TestBed } from '@angular/core/testing';

import { BoletaCotaFundoService } from './boleta-cota-fundo.service';

describe('BoletaCotaFundoService', () => {
  let service: BoletaCotaFundoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BoletaCotaFundoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
