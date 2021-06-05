import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscancellationComponent } from './buscancellation.component';

describe('BuscancellationComponent', () => {
  let component: BuscancellationComponent;
  let fixture: ComponentFixture<BuscancellationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuscancellationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuscancellationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
