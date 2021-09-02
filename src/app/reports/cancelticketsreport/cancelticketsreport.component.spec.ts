import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelticketsreportComponent } from './cancelticketsreport.component';

describe('CancelticketsreportComponent', () => {
  let component: CancelticketsreportComponent;
  let fixture: ComponentFixture<CancelticketsreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CancelticketsreportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelticketsreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
