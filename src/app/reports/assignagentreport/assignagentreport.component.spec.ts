import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignagentreportComponent } from './assignagentreport.component';

describe('AssignagentreportComponent', () => {
  let component: AssignagentreportComponent;
  let fixture: ComponentFixture<AssignagentreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignagentreportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignagentreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
