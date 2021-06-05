import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusamenitiesComponent } from './busamenities.component';

describe('BusamenitiesComponent', () => {
  let component: BusamenitiesComponent;
  let fixture: ComponentFixture<BusamenitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusamenitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusamenitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
