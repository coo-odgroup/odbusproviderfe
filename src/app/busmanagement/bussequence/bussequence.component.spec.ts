import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BussequenceComponent } from './bussequence.component';

describe('BussequenceComponent', () => {
  let component: BussequenceComponent;
  let fixture: ComponentFixture<BussequenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BussequenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BussequenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
