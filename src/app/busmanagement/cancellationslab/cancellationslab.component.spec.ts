import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancellationslabComponent } from './cancellationslab.component';

describe('CancellationslabComponent', () => {
  let component: CancellationslabComponent;
  let fixture: ComponentFixture<CancellationslabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancellationslabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancellationslabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
