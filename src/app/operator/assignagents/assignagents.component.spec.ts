import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignagentsComponent } from './assignagents.component';

describe('AssignagentsComponent', () => {
  let component: AssignagentsComponent;
  let fixture: ComponentFixture<AssignagentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignagentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignagentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
