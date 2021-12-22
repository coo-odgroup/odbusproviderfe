import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtraseablockComponent } from './extraseablock.component';

describe('ExtraseablockComponent', () => {
  let component: ExtraseablockComponent;
  let fixture: ComponentFixture<ExtraseablockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExtraseablockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtraseablockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
