import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialsliderComponent } from './specialslider.component';

describe('SpecialsliderComponent', () => {
  let component: SpecialsliderComponent;
  let fixture: ComponentFixture<SpecialsliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpecialsliderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialsliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
