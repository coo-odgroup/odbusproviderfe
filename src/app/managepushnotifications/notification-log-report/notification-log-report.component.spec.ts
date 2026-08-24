import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationLogReportComponent } from './notification-log-report.component';

describe('NotificationLogReportComponent', () => {
  let component: NotificationLogReportComponent;
  let fixture: ComponentFixture<NotificationLogReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotificationLogReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationLogReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
