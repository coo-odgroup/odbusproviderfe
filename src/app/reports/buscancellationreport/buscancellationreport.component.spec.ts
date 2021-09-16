import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscancellationreportComponent } from './buscancellationreport.component';

describe('BuscancellationreportComponent', () => {
  let component: BuscancellationreportComponent;
  let fixture: ComponentFixture<BuscancellationreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuscancellationreportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuscancellationreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
