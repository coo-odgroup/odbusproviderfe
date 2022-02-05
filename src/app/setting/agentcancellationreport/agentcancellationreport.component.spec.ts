import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentcancellationreportComponent } from './agentcancellationreport.component';

describe('AgentcancellationreportComponent', () => {
  let component: AgentcancellationreportComponent;
  let fixture: ComponentFixture<AgentcancellationreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgentcancellationreportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentcancellationreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
