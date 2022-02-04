import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentalltransactionComponent } from './agentalltransaction.component';

describe('AgentalltransactionComponent', () => {
  let component: AgentalltransactionComponent;
  let fixture: ComponentFixture<AgentalltransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgentalltransactionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentalltransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
