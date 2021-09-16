import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerpaymentreportComponent } from './ownerpaymentreport.component';

describe('OwnerpaymentreportComponent', () => {
  let component: OwnerpaymentreportComponent;
  let fixture: ComponentFixture<OwnerpaymentreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OwnerpaymentreportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnerpaymentreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
