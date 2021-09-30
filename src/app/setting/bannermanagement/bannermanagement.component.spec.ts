import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannermanagementComponent } from './bannermanagement.component';

describe('BannermanagementComponent', () => {
  let component: BannermanagementComponent;
  let fixture: ComponentFixture<BannermanagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BannermanagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BannermanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
