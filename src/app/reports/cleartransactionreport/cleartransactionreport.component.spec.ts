import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CleartransactionreportComponent } from './cleartransactionreport.component';

describe('CleartransactionreportComponent', () => {
  let component: CleartransactionreportComponent;
  let fixture: ComponentFixture<CleartransactionreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CleartransactionreportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CleartransactionreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
