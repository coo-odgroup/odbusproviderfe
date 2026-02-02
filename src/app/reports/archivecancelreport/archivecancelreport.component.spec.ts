import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletereportComponent } from './completereport.component';

describe('CompletereportComponent', () => {
  let component: CompletereportComponent;
  let fixture: ComponentFixture<CompletereportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompletereportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompletereportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
