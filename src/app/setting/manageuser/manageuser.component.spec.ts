import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ManageuserComponent } from './manageuser.component';

describe('ManageuserComponent', () => {
  let component: ManageuserComponent;
  let fixture: ComponentFixture<ManageuserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageuserComponent],
      imports: [FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ManageuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display five dummy users', () => {
    expect(component.dummyUsers.length).toBe(5);
  });
});