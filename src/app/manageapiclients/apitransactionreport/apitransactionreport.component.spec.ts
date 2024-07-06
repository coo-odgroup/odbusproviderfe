import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApitransactionreportComponent } from './apitransactionreport.component';

describe('ApitransactionreportComponent', () => {
  let component: ApitransactionreportComponent;
  let fixture: ComponentFixture<ApitransactionreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApitransactionreportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApitransactionreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
