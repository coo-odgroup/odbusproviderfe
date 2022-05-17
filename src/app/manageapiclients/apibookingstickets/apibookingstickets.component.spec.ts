import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApibookingsticketsComponent } from './apibookingstickets.component';

describe('ApibookingsticketsComponent', () => {
  let component: ApibookingsticketsComponent;
  let fixture: ComponentFixture<ApibookingsticketsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApibookingsticketsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApibookingsticketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
