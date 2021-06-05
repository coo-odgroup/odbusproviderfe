import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeatfareComponent } from './seatfare.component';

describe('SeatfareComponent', () => {
  let component: SeatfareComponent;
  let fixture: ComponentFixture<SeatfareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeatfareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeatfareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
