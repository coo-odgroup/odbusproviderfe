import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminchangepasswordComponent } from './adminchangepassword.component';

describe('AdminchangepasswordComponent', () => {
  let component: AdminchangepasswordComponent;
  let fixture: ComponentFixture<AdminchangepasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminchangepasswordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminchangepasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
