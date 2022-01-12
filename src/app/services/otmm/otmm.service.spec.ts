import { TestBed } from '@angular/core/testing';

import { OtmmService } from './otmm.service';

describe('OtmmService', () => {
  let service: OtmmService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OtmmService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
