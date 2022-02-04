import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentfeedbackComponent } from './agentfeedback.component';

describe('AgentfeedbackComponent', () => {
  let component: AgentfeedbackComponent;
  let fixture: ComponentFixture<AgentfeedbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgentfeedbackComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentfeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
