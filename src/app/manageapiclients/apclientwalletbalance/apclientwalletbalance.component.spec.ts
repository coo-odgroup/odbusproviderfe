import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApclientwalletbalanceComponent } from './apclientwalletbalance.component';

describe('ApclientwalletbalanceComponent', () => {
  let component: ApclientwalletbalanceComponent;
  let fixture: ComponentFixture<ApclientwalletbalanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApclientwalletbalanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApclientwalletbalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
