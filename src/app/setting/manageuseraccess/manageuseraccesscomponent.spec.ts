
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ManageuseraccessComponent } from './manageuseraccess.component';
import { ManageuseraccessService } from '../../services/manageuseraccess.service';
import { NotificationService } from '../../services/notification.service';

describe('ManageuseraccessComponent', () => {
  let component: ManageuseraccessComponent;
  let fixture: ComponentFixture<ManageuseraccessComponent>;

  const accessServiceMock = {
    getUsers: () => of({ status: 1, message: 'OK', data: [] }),
    getPermissions: () => of({ status: 1, message: 'OK', data: [] }),
    getUserPermissions: () => of({ status: 1, message: 'OK', data: [] }),
    saveUserPermissions: () => of({ status: 1, message: 'Saved', data: [] })
  };

  const notificationServiceMock = {
    notify: jasmine.createSpy('notify')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageuseraccessComponent],
      imports: [FormsModule, HttpClientTestingModule],
      providers: [
        {
          provide: ManageuseraccessService,
          useValue: accessServiceMock
        },
        {
          provide: NotificationService,
          useValue: notificationServiceMock
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ManageuseraccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initially have no selected user', () => {
    expect(component.selectedUserId).toBeNull();
  });
});
