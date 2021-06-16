import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusgalleryComponent } from './busgallery.component';

describe('BusgalleryComponent', () => {
  let component: BusgalleryComponent;
  let fixture: ComponentFixture<BusgalleryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusgalleryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusgalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
