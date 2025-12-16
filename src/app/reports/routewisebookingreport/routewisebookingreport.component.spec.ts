import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteWiseBookingreport } from './routewisebookingreport.component';


describe('CompletereportComponent', () => {
  let component: RouteWiseBookingreport;
  let fixture: ComponentFixture<RouteWiseBookingreport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RouteWiseBookingreport ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RouteWiseBookingreport);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
