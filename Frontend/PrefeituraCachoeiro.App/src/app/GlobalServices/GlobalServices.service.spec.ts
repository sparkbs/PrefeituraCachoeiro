/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { GlobalServicesService } from './GlobalServices.service';

describe('Service: GlobalServices', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GlobalServicesService]
    });
  });

  it('should ...', inject([GlobalServicesService], (service: GlobalServicesService) => {
    expect(service).toBeTruthy();
  }));
});
