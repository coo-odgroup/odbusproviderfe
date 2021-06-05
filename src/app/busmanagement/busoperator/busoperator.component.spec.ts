import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusoperatorComponent } from './busoperator.component';

describe('BusoperatorComponent', () => {
  let component: BusoperatorComponent;
  let fixture: ComponentFixture<BusoperatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusoperatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusoperatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
