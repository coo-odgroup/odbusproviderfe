import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeosettingComponent } from './seosetting.component';

describe('SeosettingComponent', () => {
  let component: SeosettingComponent;
  let fixture: ComponentFixture<SeosettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeosettingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeosettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
