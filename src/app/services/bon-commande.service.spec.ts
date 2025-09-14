import { TestBed } from '@angular/core/testing';

import { BonCommandeService } from './bon-commande.service';

describe('BonCommandeService', () => {
  let service: BonCommandeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BonCommandeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
