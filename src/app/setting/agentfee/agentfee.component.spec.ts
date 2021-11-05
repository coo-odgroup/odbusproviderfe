import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentfeeComponent } from './agentfee.component';

describe('AgentfeeComponent', () => {
  let component: AgentfeeComponent;
  let fixture: ComponentFixture<AgentfeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgentfeeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentfeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
