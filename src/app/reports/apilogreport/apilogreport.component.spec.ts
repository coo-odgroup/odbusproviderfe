import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApilogreportComponent } from './apilogreport.component';

describe('ApilogreportComponent', () => {
  let component: ApilogreportComponent;
  let fixture: ComponentFixture<ApilogreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApilogreportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApilogreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
