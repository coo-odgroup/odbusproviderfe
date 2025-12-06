import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopRouteComponent } from './top-route.component';

describe('TopRouteComponent', () => {
  let component: TopRouteComponent;
  let fixture: ComponentFixture<TopRouteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopRouteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
