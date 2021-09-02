import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FailedtransactionreportComponent } from './failedtransactionreport.component';

describe('FailedtransactionreportComponent', () => {
  let component: FailedtransactionreportComponent;
  let fixture: ComponentFixture<FailedtransactionreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FailedtransactionreportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FailedtransactionreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
