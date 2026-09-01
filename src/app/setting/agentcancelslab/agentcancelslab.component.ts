import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Constants } from 'src/app/constant/constant';

@Component({
  selector: 'app-agentcancelslab',
  templateUrl: './agentcancelslab.component.html',
  styleUrls: ['./agentcancelslab.component.scss'],
})
export class AgentCancelSlabComponent implements OnInit {
  searchForm: FormGroup;
  slabForm: FormGroup;

  slabs: any[] = [];
  pagination: any = {};
  groupedSlabs: any[] = [];

  all: any = {
    count: 0,
    total: 0,
  };

  path = Constants.BASE_URL + '/';

  ModalHeading = 'Add Agent Cancellation Slab';
  ModalBtn = 'Save';

  editId: any = null;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    /*
     * SEARCH FORM
     */
    this.searchForm = this.fb.group({
      slab_name: [''],
      from_date: [''],
      to_date: [''],
      status: [''],
      per_page: ['10'],
    });

    /*
     * ADD / EDIT FORM
     *
     * These names MUST match the HTML formControlName values.
     */
    this.slabForm = this.fb.group({
      slab_name: ['', Validators.required],
      is_default: [false],
      from_date: ['', Validators.required],
      to_date: ['', Validators.required],
      commission_rows: this.fb.array([this.createCancelRow()]),
    });

    this.slabForm
      .get('is_default')
      ?.valueChanges.subscribe((isDefault: boolean) => {
        const fromDate = this.slabForm.get('from_date');
        const toDate = this.slabForm.get('to_date');

        if (isDefault) {
          // Default slab does not need dates
          fromDate?.clearValidators();
          toDate?.clearValidators();

          fromDate?.setValue(null);
          toDate?.setValue(null);

          fromDate?.disable();
          toDate?.disable();
        } else {
          // Non-default slab requires dates
          fromDate?.enable();
          toDate?.enable();

          fromDate?.setValidators([Validators.required]);
          toDate?.setValidators([Validators.required]);
        }

        fromDate?.updateValueAndValidity();
        toDate?.updateValueAndValidity();
      });

    /*
     * LOAD DATA
     */
    this.getAll();
  }

  /*
   * CREATE ONE CANCEL RANGE ROW
   *
   * DB:
   * range_from
   * range_to
   * total_deduct
   * odus_deduct
   * agent_deduct
   */
  createCancelRow(): FormGroup {
    return this.fb.group({
      min_fare: ['', [Validators.required, Validators.min(0)]],
      max_fare: ['', [Validators.required, Validators.min(0)]],

      total_deduct: ['', [Validators.required, Validators.min(0)]],
      odus_deduct: ['', [Validators.required, Validators.min(0)]],
      agent_deduct: ['', [Validators.required, Validators.min(0)]],
    });
  }

  /*
   * FORM ARRAY GETTER
   */
  get commissionRows(): FormArray {
    return this.slabForm.get('commission_rows') as FormArray;
  }

  /*
   * ADD RANGE ROW
   */
  addCommissionRow(): void {
    this.commissionRows.push(this.createCancelRow());
  }

  /*
   * REMOVE RANGE ROW
   */
  removeCommissionRow(index: number): void {
    if (this.commissionRows.length > 1) {
      this.commissionRows.removeAt(index);
    }
  }

  /*
   * GET ALL CANCEL SLABS
   */
  getAll(url?: string): void {
    const requestUrl = url || this.path + 'getAgentCancelSlabs';

    let params = new HttpParams()
      .set('slab_name', this.searchForm.get('slab_name')?.value || '')
      .set('from_date', this.searchForm.get('from_date')?.value || '')
      .set('to_date', this.searchForm.get('to_date')?.value || '')
      .set('status', this.searchForm.get('status')?.value || '')
      .set('per_page', this.searchForm.get('per_page')?.value || '10');

    this.http.get(requestUrl, { params: params }).subscribe(
      (response: any) => {
        console.log('Agent Cancel Slabs Response:', response);

        if (response && response.status === true) {
          const result = response.data;

          this.slabs = result?.data || [];

          // Convert API rows into slab groups
          this.groupSlabs();

          this.pagination = result || {};

          this.all.count = this.groupedSlabs.length;
          this.all.total = result?.total || this.groupedSlabs.length;
        } else {
          this.slabs = [];
          this.groupedSlabs = [];

          this.pagination = {};

          this.all.count = 0;
          this.all.total = 0;
        }
      },

      (error) => {
        console.error('Error loading Agent Cancel Slabs:', error);

        this.slabs = [];
        this.pagination = {};

        this.all.count = 0;
        this.all.total = 0;
      },
    );
  }

  /*
   * RESET ADD/EDIT FORM
   */
  ResetAttributes(): void {
    this.editId = null;

    this.ModalHeading = 'Add Agent Cancellation Slab';
    this.ModalBtn = 'Save';

    this.slabForm.patchValue({
      slab_name: '',
      is_default: false,
      from_date: '',
      to_date: '',
    });

    // Make sure dates are enabled after reset
    this.slabForm.get('from_date')?.enable();
    this.slabForm.get('to_date')?.enable();

    this.slabForm.get('from_date')?.setValidators([Validators.required]);

    this.slabForm.get('to_date')?.setValidators([Validators.required]);

    this.slabForm.get('from_date')?.updateValueAndValidity();
    this.slabForm.get('to_date')?.updateValueAndValidity();

    while (this.commissionRows.length > 0) {
      this.commissionRows.removeAt(0);
    }
    this.commissionRows.push(this.createCancelRow());
    this.slabForm.markAsPristine();
    this.slabForm.markAsUntouched();
  }

  /*
   * OPEN ADD MODAL
   */
  OpenModal(content: any): void {
    this.ResetAttributes();
    this.modalService.open(content, {
      size: 'xl',
      centered: true,
      backdrop: 'static',
    });
  }

  /*
   * ADD CANCEL SLAB
   */

  
  addSlab(): void {
  

    
    if (this.slabForm.invalid) {
      this.slabForm.markAllAsTouched();
      return;
    }

    const formValue = this.slabForm.getRawValue();

    /*
     * Get logged-in user ID from JWT
     */
    const userId = this.getLoggedInUserId();

    console.log('Logged-in User ID:', userId);

    if (!userId || userId <= 0) {
      alert('User ID not found. Please login again.');
      return;
    }

    /*
     * Prepare payload
     */
    const payload = {
      slab_name: formValue.slab_name,
      is_default: formValue.is_default ? 1 : 0,

      /*
       * If default is selected, dates are not required.
       * Send null instead of empty string.
       */
      from_date: formValue.is_default ? null : formValue.from_date,
      to_date: formValue.is_default ? null : formValue.to_date,

      commission_rows: formValue.commission_rows,

      created_by: userId,
    };

    console.log('Agent Cancel Slab Payload:', JSON.stringify(payload, null, 2));

    /*
     * UPDATE
     */
    if (this.editId) {
      this.http
        .post(this.path + 'updateAgentCancelSlab/' + this.editId, payload)
        .subscribe(
          (response: any) => {
            console.log('Update Cancel Slab:', response);

            if (response && response.status === true) {
              this.modalService.dismissAll();
              this.getAll();
            }
          },
          (error) => {
            console.error('Update Agent Cancel Slab Error:', error);
            console.error('Backend Response:', error.error);
          },
        );

      return;
    }

    /*
     * ADD
     */
    this.http.post(this.path + 'addAgentCancelSlab', payload).subscribe(
      (response: any) => {
        console.log('Add Cancel Slab:', response);

        if (response && response.status === true) {
          this.modalService.dismissAll();
          this.getAll();
        }
      },
      (error) => {
        console.error('Add Agent Cancel Slab Error:', error);
        console.error('Backend Response:', error.error);

        if (error.error && error.error.errors) {
          console.error('Validation Errors:', error.error.errors);
        }
      },
    );
  }

  getLoggedInUserId(): number | null {
    const token = localStorage.getItem('AuthAccessToken');

    if (!token) {
      return null;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));

      console.log('JWT Payload:', payload);

      // Change these according to your actual JWT payload
      const userId =
        payload.user_id ||
        payload.userid ||
        payload.userId ||
        payload.id ||
        payload.sub;

      return userId ? Number(userId) : null;
    } catch (e) {
      console.error('Unable to decode AuthAccessToken:', e);
      return null;
    }
  }
  /*
   * EDIT CANCEL SLAB
   */
  editSlab(id: any, content: any): void {
    this.editId = id;

    this.ModalHeading = 'Edit Agent Cancellation Slab';

    this.ModalBtn = 'Update';

    this.http.get(this.path + 'getAgentCancelSlab/' + id).subscribe(
      (response: any) => {
        console.log('Edit Cancel Slab Response:', response);

        if (response && response.status === true) {
          const data = response.data;
          while (this.commissionRows.length > 0) {
            this.commissionRows.removeAt(0);
          }

          this.slabForm.patchValue({
            slab_name: '',
            is_default: false,
            from_date: '',
            to_date: '',
          });

          if (data.rows && data.rows.length > 0) {
            data.rows.forEach((row: any) => {
              this.commissionRows.push(
                this.fb.group({
                  min_fare: [
                    row.min_fare,
                    [Validators.required, Validators.min(0)],
                  ],

                  max_fare: [
                    row.max_fare,
                    [Validators.required, Validators.min(0)],
                  ],

                  total_deduct: [
                    row.total_deduct,
                    [Validators.required, Validators.min(0)],
                  ],

                  odus_deduct: [
                    row.odus_deduct,
                    [Validators.required, Validators.min(0)],
                  ],

                  agent_deduct: [
                    row.agent_deduct,
                    [Validators.required, Validators.min(0)],
                  ],
                }),
              );
            });
          } else {
            this.commissionRows.push(this.createCancelRow());
          }

          /*
           * Open modal only after data is prepared
           */
          this.modalService.open(content, {
            size: 'xl',
            centered: true,
            backdrop: 'static',
          });
        }
      },

      (error) => {
        console.error('Get Agent Cancel Slab Error:', error);
      },
    );
  }

  /*
   * REFRESH
   */
  refresh(): void {
    this.getAll();
  }

  /*
   * RESET SEARCH
   */
  ResetSearch(): void {
    this.searchForm.reset({
      slab_name: '',
      from_date: '',
      to_date: '',
      status: '',
      per_page: '10',
    });

    this.getAll();
  }

  page(label: string): string {
    if (!label) {
      return '';
    }

    return label.replace('&laquo;', '«').replace('&raquo;', '»');
  }

  changeStatus(slabId: number, currentStatus: number): void {
    const newStatus = Number(currentStatus) === 1 ? 0 : 1;

    console.log('Changing slab status:', {
      slabId: slabId,
      currentStatus: currentStatus,
      newStatus: newStatus,
    });

    this.http
      .post(this.path + 'updateAgentCancelSlabStatus/' + slabId, {
        status: newStatus,
      })
      .subscribe(
        (response: any) => {
          console.log('Status Update Response:', response);

          if (response && response.status === true) {
            // Immediately update UI
            const slab = this.slabs.find(
              (item: any) => Number(item.slab_id) === Number(slabId),
            );

            if (slab) {
              slab.status = newStatus;
            }
          } else {
            console.error('Status update failed:', response);
          }
        },
        (error) => {
          console.error('Change Status Error:', error);
          console.error('Backend Response:', error.error);
        },
      );
  }

  groupSlabs(): void {
    const grouped: any = {};

    this.slabs.forEach((row: any) => {
      const slabId = row.slab_id;

      if (!grouped[slabId]) {
        grouped[slabId] = {
          id: slabId,
          slab_name: row.slab_name,
          from_date: row.from_date,
          to_date: row.to_date,
          is_default: row.is_default,
          status: row.slab_status,
          created_by: row.created_by,
          updated_at: row.updated_at,
          rows: [],
        };
      }

      grouped[slabId].rows.push({
        cancellation_id: row.cancellation_id,
        min_fare: row.range_from,
        max_fare: row.range_to,
        total_deduct: row.total_deduct,
        odus_deduct: row.odus_deduct,
        agent_deduct: row.agent_deduct,
      });
    });

    this.groupedSlabs = Object.values(grouped);
  }
}
