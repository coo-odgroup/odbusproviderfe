import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardingdropingComponent } from './boardingdroping.component';

describe('BoardingdropingComponent', () => {
  let component: BoardingdropingComponent;
  let fixture: ComponentFixture<BoardingdropingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoardingdropingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardingdropingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
