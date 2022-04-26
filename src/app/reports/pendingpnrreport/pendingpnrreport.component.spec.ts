import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingpnrreportComponent } from './pendingpnrreport.component';

describe('PendingpnrreportComponent', () => {
  let component: PendingpnrreportComponent;
  let fixture: ComponentFixture<PendingpnrreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendingpnrreportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingpnrreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
