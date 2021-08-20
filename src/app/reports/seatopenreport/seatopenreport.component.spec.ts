import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeatopenreportComponent } from './seatopenreport.component';

describe('SeatopenreportComponent', () => {
  let component: SeatopenreportComponent;
  let fixture: ComponentFixture<SeatopenreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeatopenreportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeatopenreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
