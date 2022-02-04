import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OuragentComponent } from './ouragent.component';

describe('OuragentComponent', () => {
  let component: OuragentComponent;
  let fixture: ComponentFixture<OuragentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OuragentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OuragentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
