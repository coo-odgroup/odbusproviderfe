import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusseatfarereportComponent } from './busseatfarereport.component';

describe('BusseatfarereportComponent', () => {
  let component: BusseatfarereportComponent;
  let fixture: ComponentFixture<BusseatfarereportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusseatfarereportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BusseatfarereportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
