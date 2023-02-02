import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlltransactionreportComponent } from './alltransactionreport.component';

describe('AlltransactionreportComponent', () => {
  let component: AlltransactionreportComponent;
  let fixture: ComponentFixture<AlltransactionreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlltransactionreportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlltransactionreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
