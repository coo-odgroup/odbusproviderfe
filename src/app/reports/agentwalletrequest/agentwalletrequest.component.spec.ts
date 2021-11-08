import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentwalletrequestComponent } from './agentwalletrequest.component';

describe('AgentwalletrequestComponent', () => {
  let component: AgentwalletrequestComponent;
  let fixture: ComponentFixture<AgentwalletrequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgentwalletrequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentwalletrequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
