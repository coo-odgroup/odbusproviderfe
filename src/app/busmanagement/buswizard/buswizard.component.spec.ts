import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuswizardComponent } from './buswizard.component';

describe('BuswizardComponent', () => {
  let component: BuswizardComponent;
  let fixture: ComponentFixture<BuswizardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuswizardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuswizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
