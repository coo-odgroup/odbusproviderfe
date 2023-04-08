import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FailedticketadjustComponent } from './failedticketadjust.component';

describe('FailedticketadjustComponent', () => {
  let component: FailedticketadjustComponent;
  let fixture: ComponentFixture<FailedticketadjustComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FailedticketadjustComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FailedticketadjustComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
