import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketfareslabComponent } from './ticketfareslab.component';

describe('TicketfareslabComponent', () => {
  let component: TicketfareslabComponent;
  let fixture: ComponentFixture<TicketfareslabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TicketfareslabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketfareslabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
