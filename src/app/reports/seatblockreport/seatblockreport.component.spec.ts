import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeatblockreportComponent } from './seatblockreport.component';

describe('SeatblockreportComponent', () => {
  let component: SeatblockreportComponent;
  let fixture: ComponentFixture<SeatblockreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeatblockreportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeatblockreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
