import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllapiclientComponent } from './allapiclient.component';

describe('AllapiclientComponent', () => {
  let component: AllapiclientComponent;
  let fixture: ComponentFixture<AllapiclientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllapiclientComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllapiclientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
