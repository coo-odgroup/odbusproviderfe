  import { ComponentFixture, TestBed } from '@angular/core/testing';

  import { CampaignnotificationsComponent } from './campaignnotifications.component';

  describe('CampaignnotificationsComponent', () => {
    let component: CampaignnotificationsComponent;
    let fixture: ComponentFixture<CampaignnotificationsComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [ CampaignnotificationsComponent ]
      })
      .compileComponents();
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(CampaignnotificationsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });
