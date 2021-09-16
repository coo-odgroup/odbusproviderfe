import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerpaymentComponent } from './ownerpayment.component';

describe('OwnerpaymentComponent', () => {
  let component: OwnerpaymentComponent;
  let fixture: ComponentFixture<OwnerpaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OwnerpaymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnerpaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
