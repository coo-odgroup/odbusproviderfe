import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeatingtypeComponent } from './seatingtype.component';

describe('SeatingtypeComponent', () => {
  let component: SeatingtypeComponent;
  let fixture: ComponentFixture<SeatingtypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeatingtypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeatingtypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
