import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApicancelticketsComponent } from './apicanceltickets.component';

describe('ApicancelticketsComponent', () => {
  let component: ApicancelticketsComponent;
  let fixture: ComponentFixture<ApicancelticketsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApicancelticketsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApicancelticketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
