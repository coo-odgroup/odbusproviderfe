import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeatopenComponent } from './seatopen.component';

describe('SeatopenComponent', () => {
  let component: SeatopenComponent;
  let fixture: ComponentFixture<SeatopenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeatopenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeatopenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
