import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelreportComponent } from './cancelreport.component';

describe('CancelreportComponent', () => {
  let component: CancelreportComponent;
  let fixture: ComponentFixture<CancelreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CancelreportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
