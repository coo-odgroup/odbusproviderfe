import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerfareComponent } from './ownerfare.component';

describe('OwnerfareComponent', () => {
  let component: OwnerfareComponent;
  let fixture: ComponentFixture<OwnerfareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OwnerfareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnerfareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
