import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeatblockComponent } from './seatblock.component';

describe('SeatblockComponent', () => {
  let component: SeatblockComponent;
  let fixture: ComponentFixture<SeatblockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeatblockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeatblockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
