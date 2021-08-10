import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingseizedComponent } from './bookingseized.component';

describe('BookingseizedComponent', () => {
  let component: BookingseizedComponent;
  let fixture: ComponentFixture<BookingseizedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookingseizedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingseizedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
