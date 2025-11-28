import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomercancelrefundComponent } from './customercancelrefund.component';

describe('CustomercancelrefundComponent', () => {
  let component: CustomercancelrefundComponent;
  let fixture: ComponentFixture<CustomercancelrefundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomercancelrefundComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomercancelrefundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
