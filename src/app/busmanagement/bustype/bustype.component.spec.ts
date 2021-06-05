import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BustypeComponent } from './bustype.component';

describe('BustypeComponent', () => {
  let component: BustypeComponent;
  let fixture: ComponentFixture<BustypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BustypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BustypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
