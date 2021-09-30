import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MastersettingComponent } from './mastersetting.component';

describe('MastersettingComponent', () => {
  let component: MastersettingComponent;
  let fixture: ComponentFixture<MastersettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MastersettingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MastersettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
