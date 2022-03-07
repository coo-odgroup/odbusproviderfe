import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignbusComponent } from './assignbus.component';

describe('AssignbusComponent', () => {
  let component: AssignbusComponent;
  let fixture: ComponentFixture<AssignbusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignbusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignbusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
