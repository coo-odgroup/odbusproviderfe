import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignoperatorreportComponent } from './assignoperatorreport.component';

describe('AssignoperatorreportComponent', () => {
  let component: AssignoperatorreportComponent;
  let fixture: ComponentFixture<AssignoperatorreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignoperatorreportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignoperatorreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
