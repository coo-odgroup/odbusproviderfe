import { Component, OnInit } from '@angular/core';
import {
  NgbModal,
  NgbModalRef,
  NgbModalConfig,
} from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { Constants } from 'src/app/constant/constant';
import { NotificationService } from '../../services/notification.service';
import { VendorService } from '../../services/vendor.service';

@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.scss'],
})
export class VendorComponent implements OnInit {
  modalReference!: NgbModalRef;

  vendors: any[] = [];
  allVendors: any[] = [];
  activeVendorSection: string = 'details';
  activeEditVendorSection: string = 'details';

  searchText: string = '';
  selectedGst: string = '';
  selectedStatus: string = '';
  selectedVendor: any = null;

  states: any[] = [];
  activeVendorMenu: number | null = null;

  // Pagination
  pageSize: number = 10;
  currentPage: number = 1;
  totalRecords: number = 0;
  totalPages: number = 1;

  vendorForm: any = {
    company_name: '',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    has_gst: 0,
    rate_limit_per_minute: null,
    sandbox: true,
    production: true,
  };

  // Edit Vendor form
  editVendorForm: any = {
    id: null,
    vendor_code: '',
    company_name: '',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    has_gst: 0,
    rate_limit_per_minute: null,
    sandbox: false,
    production: false,
  };

  vendorAddress: any = {
    address: '',
    street: '',
    landmark: '',
    city: '',
    pincode: '',
    state: '',
  };

  editVendorAddress: any = {
    address: '',
    street: '',
    landmark: '',
    city: '',
    pincode: '',
    state: '',
  };

  credentials: any[] = [];

  credentialSandboxSelected: boolean = false;
  credentialProductionSelected: boolean = false;
  credentialSandboxDisabled: boolean = false;
  credentialProductionDisabled: boolean = false;
  selectedCredentialEnvironment: string = '';
  credentialForm: any = {
    client_id: '',
    client_secret: '',
  };

  credentialDrafts: any = {
    sandbox: {
      vendor_environment_id: null,
      client_id: '',
      client_secret: '',
    },
    production: {
      vendor_environment_id: null,
      client_id: '',
      client_secret: '',
    },
  };

  constructor(
    private modalService: NgbModal,
    config: NgbModalConfig,
    private vendorService: VendorService,
    private spinner: NgxSpinnerService,
    private notificationService: NotificationService,
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {
    this.getVendors();
    this.getStates();
  }

  OpenModal(content: any): void {
    this.modalReference = this.modalService.open(content, {
      scrollable: true,
      size: 'xl',
      windowClass: 'vendor-modal',
      centered: true,
    });
  }

  closeModal(): void {
    if (this.modalReference) {
      this.modalReference.close();
    }
  }

  getVendors(): void {
    this.spinner.show();

    this.vendorService.getVendors().subscribe({
      next: (res: any) => {
        this.spinner.hide();

        if (res && res.status == 1) {
          this.allVendors = res.data || [];

          // Reset page when loading fresh data
          this.currentPage = 1;

          this.applyVendorFilters();
        } else {
          this.allVendors = [];
          this.vendors = [];
          this.totalRecords = 0;
          this.totalPages = 1;

          this.notificationService.addToast({
            title: Constants.ErrorTitle,
            msg: res.message || 'Unable to load vendors',
            type: Constants.ErrorType,
          });
        }
      },

      error: (error) => {
        this.spinner.hide();

        console.error('Get Vendors Error:', error);

        this.allVendors = [];
        this.vendors = [];
        this.totalRecords = 0;
        this.totalPages = 1;

        this.notificationService.addToast({
          title: Constants.ErrorTitle,
          msg:
            error && error.error && error.error.message
              ? error.error.message
              : 'Unable to load vendors',
          type: Constants.ErrorType,
        });
      },
    });
  }

  getStates(): void {
    this.vendorService.getStates().subscribe({
      next: (res: any) => {
        if (res && res.status == 1) {
          this.states = res.data || [];
        } else {
          this.states = [];
        }
      },

      error: (error) => {
        console.error('Get States Error:', error);

        this.states = [];
      },
    });
  }
  applyVendorFilters(): void {
    let filteredData = [...this.allVendors];

    // SEARCH
    const search = this.searchText.trim().toLowerCase();

    if (search) {
      filteredData = filteredData.filter((vendor: any) => {
        return (
          String(vendor.vendor_code || '')
            .toLowerCase()
            .includes(search) ||
          String(vendor.company_name || '')
            .toLowerCase()
            .includes(search) ||
          String(vendor.contact_name || '')
            .toLowerCase()
            .includes(search) ||
          String(vendor.contact_email || '')
            .toLowerCase()
            .includes(search) ||
          String(vendor.contact_phone || '')
            .toLowerCase()
            .includes(search) ||
          String(vendor.rate_limit_per_minute || '')
            .toLowerCase()
            .includes(search) ||
          (search === 'yes' && Number(vendor.has_gst) === 1) ||
          (search === 'gst' && Number(vendor.has_gst) === 1) ||
          (search === 'no' && Number(vendor.has_gst) === 0) ||
          (search === 'active' && Number(vendor.status) === 1) ||
          (search === 'inactive' && Number(vendor.status) === 0)
        );
      });
    }

    // GST FILTER
    if (this.selectedGst !== '') {
      filteredData = filteredData.filter(
        (vendor: any) => Number(vendor.has_gst) === Number(this.selectedGst),
      );
    }

    // STATUS FILTER
    if (this.selectedStatus !== '') {
      filteredData = filteredData.filter(
        (vendor: any) => Number(vendor.status) === Number(this.selectedStatus),
      );
    }

    // TOTAL RECORDS
    this.totalRecords = filteredData.length;

    // TOTAL PAGES
    this.totalPages = Math.ceil(this.totalRecords / this.pageSize) || 1;

    // Safety if current page becomes invalid
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }

    if (this.currentPage < 1) {
      this.currentPage = 1;
    }

    // PAGINATION
    const startIndex = (this.currentPage - 1) * this.pageSize;

    const endIndex = startIndex + this.pageSize;

    this.vendors = filteredData.slice(startIndex, endIndex);
  }

  // =========================================================
  // CHANGE PAGE
  // =========================================================

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;
    }

    this.currentPage = page;

    this.applyVendorFilters();
  }

  // =========================================================
  // CHANGE PAGE SIZE
  // =========================================================

  changePageSize(): void {
    this.currentPage = 1;

    this.applyVendorFilters();
  }

  // =========================================================
  // GET PAGE NUMBERS
  // =========================================================

  getPageNumbers(): number[] {
    const pages: number[] = [];

    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }

    return pages;
  }

  toggleVendorMenu(vendorId: number, event: Event): void {
    event.stopPropagation();

    if (this.activeVendorMenu === vendorId) {
      this.activeVendorMenu = null;
    } else {
      this.activeVendorMenu = vendorId;
    }
  }

openVendorCredentials(vendor: any, content: any): void {
  this.activeVendorMenu = null;
  this.selectedVendor = vendor;

  this.resetCredentialForm();

  this.getVendorCredentials(vendor.id);

  this.modalReference = this.modalService.open(content, {
    scrollable: true,
    size: 'xl',
    windowClass: 'vendor-credentials-modal',
    centered: true
  });
}

  getVendorCredentials(vendorId: number): void {
    this.vendorService.getVendorCredentials(vendorId).subscribe({
      next: (res: any) => {
        if (res && res.status == 1) {
          this.credentials = res.data || [];

          /*
           * Existing Sandbox credential
           */
          const sandbox = this.credentials.find(
            (item: any) => item.environment === 'sandbox',
          );

          if (sandbox) {
            this.credentialSandboxSelected = true;
            this.credentialSandboxDisabled = true;

            this.credentialDrafts.sandbox = {
              vendor_environment_id: sandbox.vendor_environment_id,

              client_id: sandbox.client_id,

              client_secret: sandbox.client_secret,
            };
          }

          /*
           * Existing Production credential
           */
          const production = this.credentials.find(
            (item: any) => item.environment === 'production',
          );

          if (production) {
            this.credentialProductionSelected = true;
            this.credentialProductionDisabled = true;

            this.credentialDrafts.production = {
              vendor_environment_id: production.vendor_environment_id,

              client_id: production.client_id,

              client_secret: production.client_secret,
            };
          }

          /*
           * If sandbox exists but production doesn't,
           * show production as the next environment.
           */
          if (!sandbox && production) {
            this.selectedCredentialEnvironment = 'sandbox';
          } else if (sandbox && !production) {
            this.selectedCredentialEnvironment = 'production';
          } else if (!sandbox && !production) {
            this.selectedCredentialEnvironment = '';
          } else {
            this.selectedCredentialEnvironment = '';
          }

          this.loadSelectedCredentialFields();
        } else {
          this.credentials = [];
        }
      },

      error: (error) => {
        console.error('Get Vendor Credentials Error:', error);

        this.credentials = [];
      },
    });
  }

  onCredentialEnvironmentChange(environment: string, checked: boolean): void {
    /*
     * Existing credential:
     * checkbox is disabled, so this normally won't run.
     */
    if (environment === 'sandbox' && this.credentialSandboxDisabled) {
      return;
    }

    if (environment === 'production' && this.credentialProductionDisabled) {
      return;
    }

    if (!checked) {
      if (environment === 'sandbox') {
        this.credentialSandboxSelected = false;

        this.credentialDrafts.sandbox = {
          vendor_environment_id: null,
          client_id: '',
          client_secret: '',
        };
      } else {
        this.credentialProductionSelected = false;

        this.credentialDrafts.production = {
          vendor_environment_id: null,
          client_id: '',
          client_secret: '',
        };
      }

      this.loadSelectedCredentialFields();

      return;
    }

    this.selectedCredentialEnvironment = environment;

    this.generateCredential(environment);
  }

  generateCredential(environment: string): void {
    if (!this.selectedVendor || !this.selectedVendor.id) {
      return;
    }

    this.spinner.show();

    this.vendorService
      .generateVendorCredential(this.selectedVendor.id, environment)
      .subscribe({
        next: (res: any) => {
          this.spinner.hide();

          if (res && res.status == 1 && res.data) {
            const data = res.data;

            this.credentialDrafts[environment] = {
              vendor_environment_id: data.vendor_environment_id,

              client_id: data.client_id,

              client_secret: data.client_secret,
            };

            /*
             * If backend says it already exists,
             * permanently disable the checkbox.
             */
            if (data.exists === true) {
              if (environment === 'sandbox') {
                this.credentialSandboxSelected = true;
                this.credentialSandboxDisabled = true;
              } else {
                this.credentialProductionSelected = true;
                this.credentialProductionDisabled = true;
              }
            }

            this.selectedCredentialEnvironment = environment;

            this.loadSelectedCredentialFields();
          } else {
            this.notificationService.addToast({
              title: Constants.ErrorTitle,
              msg: res.message || 'Unable to generate credential',
              type: Constants.ErrorType,
            });
          }
        },

        error: (error) => {
          this.spinner.hide();

          console.error('Generate Credential Error:', error);

          this.notificationService.addToast({
            title: Constants.ErrorTitle,
            msg:
              error && error.error && error.error.message
                ? error.error.message
                : 'Unable to generate credential',
            type: Constants.ErrorType,
          });
        },
      });
  }

  loadSelectedCredentialFields(): void {
    if (!this.selectedCredentialEnvironment) {
      this.credentialForm = {
        client_id: '',
        client_secret: '',
      };

      return;
    }

    const credential =
      this.credentialDrafts[this.selectedCredentialEnvironment];

    if (!credential) {
      return;
    }

    this.credentialForm = {
      client_id: credential.client_id || '',

      client_secret: credential.client_secret || '',
    };
  }

  saveVendorCredentials(): void {
    if (!this.selectedVendor || !this.selectedVendor.id) {
      return;
    }

    const credentials: any[] = [];

    /*
     * Sandbox
     */
    if (this.credentialSandboxSelected && !this.credentialSandboxDisabled) {
      const sandbox = this.credentialDrafts.sandbox;

      if (
        !sandbox.vendor_environment_id ||
        !sandbox.client_id ||
        !sandbox.client_secret
      ) {
        this.notificationService.addToast({
          title: Constants.ErrorTitle,
          msg: 'Sandbox credential is not generated properly',
          type: Constants.ErrorType,
        });

        return;
      }

      credentials.push({
        environment: 'sandbox',
        vendor_environment_id: sandbox.vendor_environment_id,
        client_id: sandbox.client_id,
        client_secret: sandbox.client_secret,
      });
    }

    /*
     * Production
     */
    if (
      this.credentialProductionSelected &&
      !this.credentialProductionDisabled
    ) {
      const production = this.credentialDrafts.production;

      if (
        !production.vendor_environment_id ||
        !production.client_id ||
        !production.client_secret
      ) {
        this.notificationService.addToast({
          title: Constants.ErrorTitle,
          msg: 'Production credential is not generated properly',
          type: Constants.ErrorType,
        });

        return;
      }

      credentials.push({
        environment: 'production',
        vendor_environment_id: production.vendor_environment_id,
        client_id: production.client_id,
        client_secret: production.client_secret,
      });
    }

    /*
     * Nothing new to save.
     */
    if (credentials.length === 0) {
      this.notificationService.addToast({
        title: Constants.ErrorTitle,
        msg: 'Please select a new environment credential',
        type: Constants.ErrorType,
      });

      return;
    }

    this.spinner.show();

    this.vendorService
      .saveVendorCredentials(this.selectedVendor.id, credentials)
      .subscribe({
        next: (res: any) => {
          this.spinner.hide();

          if (res && res.status == 1) {
            this.notificationService.addToast({
              title: Constants.SuccessTitle,
              msg: res.message || 'Vendor credentials saved successfully',
              type: Constants.SuccessType,
            });

            /*
             * Reload from DB.
             *
             * This will:
             * - show the saved row
             * - disable its checkbox
             * - prevent another credential generation
             */
            this.getVendorCredentials(this.selectedVendor.id);
          } else {
            this.notificationService.addToast({
              title: Constants.ErrorTitle,
              msg: res.message || 'Unable to save vendor credentials',
              type: Constants.ErrorType,
            });
          }
        },

        error: (error) => {
          this.spinner.hide();

          console.error('Save Vendor Credentials Error:', error);

          this.notificationService.addToast({
            title: Constants.ErrorTitle,
            msg:
              error && error.error && error.error.message
                ? error.error.message
                : 'Unable to save vendor credentials',
            type: Constants.ErrorType,
          });
        },
      });
  }

  toggleEnvironmentStatus(credential: any): void {
    if (!this.selectedVendor) {
      return;
    }

    const newStatus = Number(credential.environment_status) === 1 ? 0 : 1;

    this.spinner.show();

    this.vendorService
      .changeVendorEnvironmentStatus(
        this.selectedVendor.id,
        credential.environment,
        newStatus,
      )
      .subscribe({
        next: (res: any) => {
          this.spinner.hide();

          if (res && res.status == 1) {
            credential.environment_status = newStatus;

            this.notificationService.addToast({
              title: Constants.SuccessTitle,
              msg: res.message || 'Environment status updated successfully',
              type: Constants.SuccessType,
            });
          } else {
            this.notificationService.addToast({
              title: Constants.ErrorTitle,
              msg: res.message || 'Unable to update environment status',
              type: Constants.ErrorType,
            });
          }
        },

        error: (error) => {
          this.spinner.hide();

          console.error('Environment Status Error:', error);

          this.notificationService.addToast({
            title: Constants.ErrorTitle,
            msg:
              error && error.error && error.error.message
                ? error.error.message
                : 'Unable to update environment status',
            type: Constants.ErrorType,
          });
        },
      });
  }

  resetCredentialForm(): void {
    this.credentials = [];

    this.credentialSandboxSelected = false;
    this.credentialProductionSelected = false;

    this.credentialSandboxDisabled = false;
    this.credentialProductionDisabled = false;

    this.selectedCredentialEnvironment = '';

    this.credentialForm = {
      client_id: '',
      client_secret: '',
    };

    this.credentialDrafts = {
      sandbox: {
        vendor_environment_id: null,
        client_id: '',
        client_secret: '',
      },

      production: {
        vendor_environment_id: null,
        client_id: '',
        client_secret: '',
      },
    };
  }

  openVendorIps(vendor: any, content: any): void {
    this.activeVendorMenu = null;

    this.selectedVendor = vendor;

    this.modalService.open(content, {
      scrollable: true,
      size: 'xl',
      windowClass: 'vendor-modal',
    });
  }

  openVendorAppLimits(vendor: any, content: any): void {
    this.activeVendorMenu = null;

    this.selectedVendor = vendor;

    this.modalService.open(content, {
      scrollable: true,
      size: 'xl',
      windowClass: 'vendor-modal',
    });
  }

  openVendorScope(vendor: any, content: any): void {
    this.activeVendorMenu = null;

    this.selectedVendor = vendor;

    this.modalService.open(content, {
      scrollable: true,
      size: 'xl',
      windowClass: 'vendor-modal',
    });
  }

  clearVendorFilters(): void {
    this.searchText = '';
    this.selectedGst = '';
    this.selectedStatus = '';

    this.currentPage = 1;

    this.applyVendorFilters();
  }

  resetVendorForm(): void {
    this.vendorForm = {
      company_name: '',
      contact_name: '',
      contact_email: '',
      contact_phone: '',
      has_gst: 0,
      rate_limit_per_minute: null,
      sandbox: true,
      production: true,
    };

    this.vendorAddress = {
      address: '',
      street: '',
      landmark: '',
      city: '',
      pincode: '',
      state: '',
    };
  }

  private getLoggedInUserId(): number | null {
    const sessionUserId = sessionStorage.getItem('USERID');
    const localUserId = localStorage.getItem('USERID');
    const userRecords = localStorage.getItem('USERRECORDS');

    let rawId: any = sessionUserId || localUserId;

    if (!rawId && userRecords) {
      try {
        const user = JSON.parse(userRecords);

        if (user && user.id) {
          rawId = user.id;
        }
      } catch (error) {
        rawId = null;
      }
    }

    const userId = Number(rawId);

    return userId > 0 ? userId : null;
  }

  addVendor(): void {
    if (
      !this.vendorForm.company_name ||
      !this.vendorForm.contact_name ||
      !this.vendorForm.contact_email ||
      !this.vendorForm.contact_phone ||
      !this.vendorForm.rate_limit_per_minute ||
      !this.vendorAddress.address ||
      !this.vendorAddress.city ||
      !this.vendorAddress.pincode ||
      !this.vendorAddress.state
    ) {
      this.notificationService.addToast({
        title: Constants.ErrorTitle,
        msg: 'Please fill all required fields',
        type: Constants.ErrorType,
      });

      return;
    }

    // At least one environment required
    if (!this.vendorForm.sandbox && !this.vendorForm.production) {
      this.notificationService.addToast({
        title: Constants.ErrorTitle,
        msg: 'Please select at least one API environment',
        type: Constants.ErrorType,
      });

      return;
    }

    const userId = this.getLoggedInUserId();

    if (!userId) {
      this.notificationService.addToast({
        title: Constants.ErrorTitle,
        msg: 'Unable to identify logged-in user',
        type: Constants.ErrorType,
      });

      return;
    }

    const data = {
      company_name: this.vendorForm.company_name,
      contact_name: this.vendorForm.contact_name,
      contact_email: this.vendorForm.contact_email,
      contact_phone: this.vendorForm.contact_phone,
      has_gst: this.vendorForm.has_gst ? 1 : 0,
      rate_limit_per_minute: this.vendorForm.rate_limit_per_minute,

      address: this.vendorAddress.address,
      street: this.vendorAddress.street,
      landmark: this.vendorAddress.landmark,
      city: this.vendorAddress.city,
      pincode: this.vendorAddress.pincode,
      state: this.vendorAddress.state,

      sandbox: 1,
      production: 1,

      created_by: userId,
      updated_by: userId,
    };

    console.log('ADD VENDOR PAYLOAD:', data);

    this.spinner.show();

    this.vendorService.addVendor(data).subscribe({
      next: (res: any) => {
        this.spinner.hide();

        if (res && res.status == 1) {
          this.notificationService.addToast({
            title: Constants.SuccessTitle,
            msg: res.message || 'Vendor added successfully',
            type: Constants.SuccessType,
          });

          this.closeModal();
          this.resetVendorForm();
          this.getVendors();
        } else {
          this.notificationService.addToast({
            title: Constants.ErrorTitle,
            msg: res.message || 'Unable to add vendor',
            type: Constants.ErrorType,
          });
        }
      },

      error: (error) => {
        this.spinner.hide();

        console.error('Add Vendor Error:', error);

        this.notificationService.addToast({
          title: Constants.ErrorTitle,
          msg:
            error && error.error && error.error.message
              ? error.error.message
              : 'Unable to add vendor',
          type: Constants.ErrorType,
        });
      },
    });
  }

  editVendor(id: number, content: any): void {
    if (!id) {
      this.notificationService.addToast({
        title: Constants.ErrorTitle,
        msg: 'Invalid Vendor ID',
        type: Constants.ErrorType,
      });

      return;
    }

    this.spinner.show();

    this.vendorService.getVendor(id).subscribe({
      next: (res: any) => {
        this.spinner.hide();

        if (res && res.status == 1 && res.data) {
          const vendor = res.data.vendor || res.data;
          const address = res.data.address || null;
          const environments = res.data.environments || [];

          this.selectedVendor = vendor;

          // =====================================================
          // VENDOR DETAILS
          // =====================================================

          this.editVendorForm = {
            id: vendor.id,

            vendor_code: vendor.vendor_code || '',

            company_name: vendor.company_name || '',

            contact_name: vendor.contact_name || '',

            contact_email: vendor.contact_email || '',

            contact_phone: vendor.contact_phone || '',

            has_gst: Number(vendor.has_gst) === 1 ? 1 : 0,

            rate_limit_per_minute: vendor.rate_limit_per_minute || null,

            // API Environment
            sandbox: environments.some(
              (env: any) =>
                String(env.environment).toLowerCase() === 'sandbox' &&
                Number(env.status) === 1,
            ),

            production: environments.some(
              (env: any) =>
                String(env.environment).toLowerCase() === 'production' &&
                Number(env.status) === 1,
            ),
          };

          // =====================================================
          // VENDOR ADDRESS
          // =====================================================

          this.editVendorAddress = {
            address: address && address.address != null ? address.address : '',

            street: address && address.street != null ? address.street : '',

            landmark:
              address && address.landmark != null ? address.landmark : '',

            city: address && address.city != null ? address.city : '',

            pincode: address && address.pincode != null ? address.pincode : '',

            state:
              address && address.state != null ? Number(address.state) : '',
          };

          // =====================================================
          // DEBUG
          // =====================================================

          console.log('Vendor:', vendor);

          console.log('Saved Vendor Address:', address);

          console.log('Edit Vendor Address:', this.editVendorAddress);

          console.log('Environment:', environments);

          // Open modal after data is assigned
          this.OpenModal(content);
        } else {
          this.notificationService.addToast({
            title: Constants.ErrorTitle,
            msg: res.message || 'Unable to load vendor',
            type: Constants.ErrorType,
          });
        }
      },

      error: (error) => {
        this.spinner.hide();

        console.error('Get Vendor Error:', error);

        this.notificationService.addToast({
          title: Constants.ErrorTitle,
          msg:
            error && error.error && error.error.message
              ? error.error.message
              : 'Unable to load vendor',
          type: Constants.ErrorType,
        });
      },
    });
  }
  updateVendor(): void {
    if (!this.editVendorForm.id) {
      this.notificationService.addToast({
        title: Constants.ErrorTitle,
        msg: 'Invalid Vendor ID',
        type: Constants.ErrorType,
      });

      return;
    }

    if (
      !this.editVendorForm.company_name ||
      !this.editVendorForm.contact_name ||
      !this.editVendorForm.contact_email ||
      !this.editVendorForm.contact_phone ||
      !this.editVendorForm.rate_limit_per_minute
    ) {
      this.notificationService.addToast({
        title: Constants.ErrorTitle,
        msg: 'Please fill all required fields',
        type: Constants.ErrorType,
      });

      return;
    }

    // Validate address
    if (
      !this.editVendorAddress.address ||
      !this.editVendorAddress.city ||
      !this.editVendorAddress.pincode ||
      !this.editVendorAddress.state
    ) {
      this.notificationService.addToast({
        title: Constants.ErrorTitle,
        msg: 'Please fill all required address fields',
        type: Constants.ErrorType,
      });

      return;
    }

    const userId = this.getLoggedInUserId();

    const data = {
      company_name: this.editVendorForm.company_name,
      contact_name: this.editVendorForm.contact_name,
      contact_email: this.editVendorForm.contact_email,
      contact_phone: this.editVendorForm.contact_phone,
      has_gst: this.editVendorForm.has_gst ? 1 : 0,
      rate_limit_per_minute: this.editVendorForm.rate_limit_per_minute,

      // Vendor Address
      address: this.editVendorAddress.address,
      street: this.editVendorAddress.street,
      landmark: this.editVendorAddress.landmark,
      city: this.editVendorAddress.city,
      pincode: this.editVendorAddress.pincode,
      state: this.editVendorAddress.state,

      // Updated user
      updated_by: userId,
    };

    console.log('Update Vendor Data:', data);

    this.spinner.show();

    this.vendorService.updateVendor(this.editVendorForm.id, data).subscribe({
      next: (res: any) => {
        this.spinner.hide();

        if (res && res.status == 1) {
          this.notificationService.addToast({
            title: Constants.SuccessTitle,
            msg: res.message || 'Vendor updated successfully',
            type: Constants.SuccessType,
          });

          this.closeModal();

          this.getVendors();
        } else {
          this.notificationService.addToast({
            title: Constants.ErrorTitle,
            msg: res.message || 'Unable to update vendor',
            type: Constants.ErrorType,
          });
        }
      },

      error: (error) => {
        this.spinner.hide();

        console.error('Update Vendor Error:', error);

        this.notificationService.addToast({
          title: Constants.ErrorTitle,
          msg:
            error && error.error && error.error.message
              ? error.error.message
              : 'Unable to update vendor',
          type: Constants.ErrorType,
        });
      },
    });
  }

  toggleVendorSection(section: string): void {
    if (this.activeVendorSection === section) {
      this.activeVendorSection = '';
    } else {
      this.activeVendorSection = section;
    }
  }

  toggleEditVendorSection(section: string): void {
    if (this.activeEditVendorSection === section) {
      this.activeEditVendorSection = '';
    } else {
      this.activeEditVendorSection = section;
    }
  }

  // =========================================================
  // CHANGE STATUS
  // =========================================================

  changeVendorStatus(vendor: any): void {
    if (!vendor || !vendor.id) {
      return;
    }

    this.spinner.show();

    this.vendorService.changeVendorStatus(vendor.id).subscribe({
      next: (res: any) => {
        this.spinner.hide();

        if (res && res.status == 1) {
          vendor.status = Number(res.data.status);

          vendor.activated_at = res.data.activated_at;

          vendor.suspended_at = res.data.suspended_at;

          this.notificationService.addToast({
            title: Constants.SuccessTitle,
            msg: res.message || 'Vendor status changed successfully',
            type: Constants.SuccessType,
          });
        } else {
          this.notificationService.addToast({
            title: Constants.ErrorTitle,
            msg: res.message || 'Unable to change vendor status',
            type: Constants.ErrorType,
          });
        }
      },

      error: (error) => {
        this.spinner.hide();

        console.error('Vendor Status Error:', error);

        this.notificationService.addToast({
          title: Constants.ErrorTitle,
          msg:
            error && error.error && error.error.message
              ? error.error.message
              : 'Unable to change vendor status',
          type: Constants.ErrorType,
        });
      },
    });
  }

  // =========================================================
  // GST
  // =========================================================

  toggleAddGst(event: any): void {
    this.vendorForm.has_gst = event.target.checked ? 1 : 0;
  }

  toggleEditGst(event: any): void {
    this.editVendorForm.has_gst = event.target.checked ? 1 : 0;
  }

  exportCredential(environment: string): void {
    const credential = this.credentials.find(
      (item: any) => item.environment === environment,
    );

    if (!credential) {
      this.notificationService.addToast({
        title: Constants.ErrorTitle,
        msg: 'Credential not found',
        type: Constants.ErrorType,
      });

      return;
    }

    const csvRows: string[] = [];

    // Vendor Name
    const vendorName = this.selectedVendor?.company_name || 'Vendor';

    csvRows.push(`"Vendor Name","${String(vendorName).replace(/"/g, '""')}"`);

    // Blank line
    csvRows.push('');

    // CSV Header
    csvRows.push(
      ['Environment', 'Client ID', 'Client Secret', 'Status'].join(','),
    );

    // CSV Data
    const row = [
      credential.environment === 'sandbox' ? 'Sandbox' : 'Production',

      credential.client_id,

      credential.client_secret,

      Number(credential.environment_status) === 1 ? 'Active' : 'Inactive',
    ];

    csvRows.push(
      row
        .map((value: any) => {
          const text = value == null ? '' : String(value);

          return `"${text.replace(/"/g, '""')}"`;
        })
        .join(','),
    );

    const csvContent = csvRows.join('\r\n');

    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;',
    });

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');

    link.href = url;

    link.download = `${vendorName}_${environment}_vendor_credentials.csv`;

    link.click();

    window.URL.revokeObjectURL(url);
  }
}
