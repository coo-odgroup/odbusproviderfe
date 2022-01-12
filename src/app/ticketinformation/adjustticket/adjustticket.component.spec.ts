import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdjustticketComponent } from './adjustticket.component';

describe('AdjustticketComponent', () => {
  let component: AdjustticketComponent;
  let fixture: ComponentFixture<AdjustticketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdjustticketComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdjustticketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
