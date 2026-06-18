import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleterefundComponent } from './completerefund.component';

describe('CompleterefundComponent', () => {
  let component: CompleterefundComponent;
  let fixture: ComponentFixture<CompleterefundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompleterefundComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompleterefundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
