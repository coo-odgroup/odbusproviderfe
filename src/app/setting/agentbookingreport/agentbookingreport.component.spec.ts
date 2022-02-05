import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentbookingreportComponent } from './agentbookingreport.component';

describe('AgentbookingreportComponent', () => {
  let component: AgentbookingreportComponent;
  let fixture: ComponentFixture<AgentbookingreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgentbookingreportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentbookingreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
