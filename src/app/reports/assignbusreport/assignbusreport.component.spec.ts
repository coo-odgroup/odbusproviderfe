import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignbusreportComponent } from './assignbusreport.component';

describe('AssignbusreportComponent', () => {
  let component: AssignbusreportComponent;
  let fixture: ComponentFixture<AssignbusreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignbusreportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignbusreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
