import { TestBed } from '@angular/core/testing';

import { UowService } from './uow.service';

describe('UowService', () => {
  let service: UowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
