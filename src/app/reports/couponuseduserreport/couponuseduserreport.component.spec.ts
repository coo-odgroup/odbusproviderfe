import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CouponuseduserreportComponent } from './couponuseduserreport.component';

describe('CouponuseduserreportComponent', () => {
  let component: CouponuseduserreportComponent;
  let fixture: ComponentFixture<CouponuseduserreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CouponuseduserreportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CouponuseduserreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
