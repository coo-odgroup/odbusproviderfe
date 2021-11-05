import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentcomissionComponent } from './agentcomission.component';

describe('AgentcomissionComponent', () => {
  let component: AgentcomissionComponent;
  let fixture: ComponentFixture<AgentcomissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgentcomissionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentcomissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
