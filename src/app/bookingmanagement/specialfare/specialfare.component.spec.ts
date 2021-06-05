import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialfareComponent } from './specialfare.component';

describe('SpecialfareComponent', () => {
  let component: SpecialfareComponent;
  let fixture: ComponentFixture<SpecialfareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecialfareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialfareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
