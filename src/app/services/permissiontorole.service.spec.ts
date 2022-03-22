import { TestBed } from '@angular/core/testing';

import { PermissiontoroleService } from './permissiontorole.service';

describe('PermissiontoroleService', () => {
  let service: PermissiontoroleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PermissiontoroleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
