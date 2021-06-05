import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusscheduleComponent } from './busschedule.component';

describe('BusscheduleComponent', () => {
  let component: BusscheduleComponent;
  let fixture: ComponentFixture<BusscheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusscheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusscheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
