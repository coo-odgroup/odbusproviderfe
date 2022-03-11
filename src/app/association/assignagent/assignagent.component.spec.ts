import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignagentComponent } from './assignagent.component';

describe('AssignagentComponent', () => {
  let component: AssignagentComponent;
  let fixture: ComponentFixture<AssignagentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignagentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignagentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
