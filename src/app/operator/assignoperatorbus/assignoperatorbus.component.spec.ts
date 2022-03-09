import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignoperatorbusComponent } from './assignoperatorbus.component';

describe('AssignoperatorbusComponent', () => {
  let component: AssignoperatorbusComponent;
  let fixture: ComponentFixture<AssignoperatorbusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignoperatorbusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignoperatorbusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
