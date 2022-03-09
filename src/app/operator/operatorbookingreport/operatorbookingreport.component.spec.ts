import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatorbookingreportComponent } from './operatorbookingreport.component';

describe('OperatorbookingreportComponent', () => {
  let component: OperatorbookingreportComponent;
  let fixture: ComponentFixture<OperatorbookingreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OperatorbookingreportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OperatorbookingreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
