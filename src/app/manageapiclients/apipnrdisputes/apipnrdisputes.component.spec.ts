import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApipnrdisputesComponent } from './apipnrdisputes.component';

describe('ApipnrdisputesComponent', () => {
  let component: ApipnrdisputesComponent;
  let fixture: ComponentFixture<ApipnrdisputesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApipnrdisputesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApipnrdisputesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
