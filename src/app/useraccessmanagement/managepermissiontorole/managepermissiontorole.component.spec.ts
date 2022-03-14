import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagepermissiontoroleComponent } from './managepermissiontorole.component';

describe('ManagepermissiontoroleComponent', () => {
  let component: ManagepermissiontoroleComponent;
  let fixture: ComponentFixture<ManagepermissiontoroleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagepermissiontoroleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagepermissiontoroleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
