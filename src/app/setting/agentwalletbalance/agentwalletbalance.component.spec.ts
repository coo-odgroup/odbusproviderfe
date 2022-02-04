import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentwalletbalanceComponent } from './agentwalletbalance.component';

describe('AgentwalletbalanceComponent', () => {
  let component: AgentwalletbalanceComponent;
  let fixture: ComponentFixture<AgentwalletbalanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgentwalletbalanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentwalletbalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
