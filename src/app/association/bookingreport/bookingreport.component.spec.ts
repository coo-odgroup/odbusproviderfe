import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingreportComponent } from './bookingreport.component';

describe('BookingreportComponent', () => {
  let component: BookingreportComponent;
  let fixture: ComponentFixture<BookingreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookingreportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
