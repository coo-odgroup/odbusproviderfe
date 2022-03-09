import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatorcancelreportComponent } from './operatorcancelreport.component';

describe('OperatorcancelreportComponent', () => {
  let component: OperatorcancelreportComponent;
  let fixture: ComponentFixture<OperatorcancelreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OperatorcancelreportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OperatorcancelreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
