import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentsliderComponent } from './agentslider.component';

describe('AgentsliderComponent', () => {
  let component: AgentsliderComponent;
  let fixture: ComponentFixture<AgentsliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgentsliderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentsliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
