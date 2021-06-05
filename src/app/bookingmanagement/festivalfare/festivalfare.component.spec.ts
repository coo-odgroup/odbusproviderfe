import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FestivalfareComponent } from './festivalfare.component';

describe('FestivalfareComponent', () => {
  let component: FestivalfareComponent;
  let fixture: ComponentFixture<FestivalfareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FestivalfareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FestivalfareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
