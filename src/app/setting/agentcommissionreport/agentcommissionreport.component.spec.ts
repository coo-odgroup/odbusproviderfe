import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentcommissionreportComponent } from './agentcommissionreport.component';

describe('AgentcommissionreportComponent', () => {
  let component: AgentcommissionreportComponent;
  let fixture: ComponentFixture<AgentcommissionreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgentcommissionreportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentcommissionreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
