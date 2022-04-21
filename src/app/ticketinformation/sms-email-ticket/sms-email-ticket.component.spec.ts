import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsEmailTicketComponent } from './sms-email-ticket.component';

describe('SmsEmailTicketComponent', () => {
  let component: SmsEmailTicketComponent;
  let fixture: ComponentFixture<SmsEmailTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmsEmailTicketComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmsEmailTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
