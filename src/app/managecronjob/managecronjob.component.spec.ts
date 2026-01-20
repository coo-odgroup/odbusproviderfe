import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagecronjobComponent } from './managecronjob.component';

describe('ManagecronjobComponent', () => {
  let component: ManagecronjobComponent;
  let fixture: ComponentFixture<ManagecronjobComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagecronjobComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagecronjobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
