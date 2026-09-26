import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorSeatblockComponent } from './vendor-seatblock.component';

describe('VendorSeatblockComponent', () => {
  let component: VendorSeatblockComponent;
  let fixture: ComponentFixture<VendorSeatblockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorSeatblockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorSeatblockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
