import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PushnotificationsComponent } from './pushnotifications.component';

describe('PushnotificationsComponent', () => {
  let component: PushnotificationsComponent;
  let fixture: ComponentFixture<PushnotificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PushnotificationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PushnotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
