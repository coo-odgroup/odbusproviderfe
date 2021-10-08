import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactreportComponent } from './contactreport.component';

describe('ContactreportComponent', () => {
  let component: ContactreportComponent;
  let fixture: ComponentFixture<ContactreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactreportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
