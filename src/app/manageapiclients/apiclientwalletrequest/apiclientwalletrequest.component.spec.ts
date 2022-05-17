import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiclientwalletrequestComponent } from './apiclientwalletrequest.component';

describe('ApiclientwalletrequestComponent', () => {
  let component: ApiclientwalletrequestComponent;
  let fixture: ComponentFixture<ApiclientwalletrequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApiclientwalletrequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiclientwalletrequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
