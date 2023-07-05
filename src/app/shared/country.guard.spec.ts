import { TestBed } from '@angular/core/testing';

import { CountryGuard } from './country.guard';

describe('CountryGuard', () => {
  let guard: CountryGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CountryGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
