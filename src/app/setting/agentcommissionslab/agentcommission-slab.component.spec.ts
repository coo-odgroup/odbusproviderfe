import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentCommissionSlabComponent } from './agentcommission-slab.component';

describe('AgentCommissionSlabComponent', () => {

  let component: AgentCommissionSlabComponent;
  let fixture: ComponentFixture<AgentCommissionSlabComponent>;

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      declarations: [
        AgentCommissionSlabComponent
      ]
    })
    .compileComponents();

  });

  beforeEach(() => {

    fixture = TestBed.createComponent(
      AgentCommissionSlabComponent
    );

    component = fixture.componentInstance;

    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});