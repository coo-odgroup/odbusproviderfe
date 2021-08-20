import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtraseatopenreportComponent } from './extraseatopenreport.component';

describe('ExtraseatopenreportComponent', () => {
  let component: ExtraseatopenreportComponent;
  let fixture: ComponentFixture<ExtraseatopenreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExtraseatopenreportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtraseatopenreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
