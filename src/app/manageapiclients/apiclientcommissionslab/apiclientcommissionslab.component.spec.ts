import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiclientcommissionslabComponent } from './apiclientcommissionslab.component';

describe('ApiclientcommissionslabComponent', () => {
  let component: ApiclientcommissionslabComponent;
  let fixture: ComponentFixture<ApiclientcommissionslabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApiclientcommissionslabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiclientcommissionslabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
