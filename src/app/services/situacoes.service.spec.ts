import { TestBed } from '@angular/core/testing';

import { SituacoesService } from './situacoes.service';

describe('SituacoesService', () => {
  let service: SituacoesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SituacoesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
