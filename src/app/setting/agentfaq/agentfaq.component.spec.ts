import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentfaqComponent } from './agentfaq.component';

describe('AgentfaqComponent', () => {
  let component: AgentfaqComponent;
  let fixture: ComponentFixture<AgentfaqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AgentfaqComponent]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentfaqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});