import { Component, OnInit, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { Constants } from 'src/app/constant/constant';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-agentcommission-slab',
  templateUrl: './agentcommission-slab.component.html',
  styleUrls: ['./agentcommission-slab.component.scss'],
})
export class AgentCommissionSlabComponent implements OnInit {
  searchForm: FormGroup;
  slabs: any[] = [];

  slabForm: FormGroup;
  agents: any[] = [];
  filteredAgents: any[] = [];

  agentSearch = '';

  agentDropdownOpen = false;

  pagination: any = {};

  all: any = {
    count: 0,
    total: 0,
  };

  path = Constants.BASE_URL + '/';

  ModalHeading = 'Add Agent Commission Slab';
  ModalBtn = 'Save';

  editId: any = null;
  deleteId: any = null;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private http: HttpClient,
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      slabName: [''],
      isDefault: [''],
      fromDate: [''],
      toDate: [''],
      status: [''],
      per_page: [10],
    });

    this.slabForm = this.fb.group({
      slab_name: ['', Validators.required],
      is_default: [false],
      agent_assigned: [false],
      agent_ids: [[]],
      commissionRows: this.fb.array([this.createCommissionRow()]),

      from_date: [''],
      to_date: [''],
    });

    this.getAll();
    this.getAgents();
  }

  onDefaultChange(event: any): void {
    const isDefault = event.target.checked;

    const agentAssignedControl = this.slabForm.get('agent_assigned');
    const agentIdsControl = this.slabForm.get('agent_ids');

    if (isDefault) {
      // Default slab cannot be assigned to agents
      agentAssignedControl?.setValue(false);
      agentAssignedControl?.disable();

      agentIdsControl?.setValue([]);
      agentIdsControl?.disable();
    } else {
      // Enable agent assignment
      agentAssignedControl?.enable();
      agentIdsControl?.enable();
    }
  }

  onAgentAssignedChange(event: any): void {
    const agentAssigned = event.target.checked;

    const defaultControl = this.slabForm.get('is_default');
    const agentIdsControl = this.slabForm.get('agent_ids');

    if (agentAssigned) {
      // Cannot be default and assigned to agents
      defaultControl?.setValue(false);
      defaultControl?.disable();

      agentIdsControl?.enable();
    } else {
      defaultControl?.enable();
    }
  }
  resetFilters(): void {
    this.searchForm.patchValue({
      slabName: '',
      isDefault: '',
      fromDate: '',
      toDate: '',
      status: '',
      per_page: 10,
    });

    this.getAll();
  }

  getAll(url?: string): void {
    const requestUrl = url || this.path + 'getAgentCommissionSlabs';

    const params = {
      slab_name: this.searchForm.get('slabName')?.value || '',
      is_default: this.searchForm.get('isDefault')?.value || '',
      from_date: this.searchForm.get('fromDate')?.value || '',
      to_date: this.searchForm.get('toDate')?.value || '',
      status: this.searchForm.get('status')?.value || '',
      per_page: this.searchForm.get('per_page')?.value || 10,
    };

    this.http.post(requestUrl, params).subscribe(
      (response: any) => {
        if (response && response.status === true) {
          const result = response.data;
          const rawSlabs = result.data || [];

          /*
           * GROUP COMMISSION ROWS BY SLAB ID
           */
          const grouped: any = {};

          rawSlabs.forEach((row: any) => {
            const slabId = row.slab_id || row.id;

            if (!grouped[slabId]) {
              /*
               * Get dates from top level first.
               * If not available, get them from the
               * first assigned agent.
               */
              const firstAgent =
                Array.isArray(row.agents) && row.agents.length > 0
                  ? row.agents[0]
                  : null;

              grouped[slabId] = {
                id: row.slab_id || row.id,
                slab_name: row.slab_name,
                is_default: Number(row.is_default || 0),
                status: Number(row.status || 0),
                created_at: row.created_at,
                created_by: row.created_by,
                created_by_name: row.created_by_name,

                updated_at: row.updated_at,
                updated_by: row.updated_by,
                updated_by_name: row.updated_by_name,
                agent_assigned: Number(row.agent_assigned || 0),
                agent_ids: row.agent_ids || [],
                from_date:
                  row.from_date || (firstAgent ? firstAgent.from_date : null),
                to_date:
                  row.to_date || (firstAgent ? firstAgent.to_date : null),
                agents: row.agents || [],
                commission_rows: [],
              };
            }

            /*
             * Add commission row
             */
            grouped[slabId].commission_rows.push({
              id: row.commission_id || row.id,
              min_fare: row.min_fare ?? row.range_from,
              max_fare: row.max_fare ?? row.range_to,
              total_comm: row.total_comm,
              odbus_comm: row.odbus_comm,
              agent_comm: row.agent_comm,
            });
          });

          /*
           * Convert object back to array
           */
          this.slabs = Object.values(grouped);
          console.log('FILTER PARAMS:', params);
          console.log('GROUPED SLABS:', this.slabs);

          /*
           * Pagination
           */
          this.pagination = result;
          this.all.count = this.slabs.length;
          this.all.total = result.total || this.slabs.length;
        } else {
          this.slabs = [];
          this.pagination = {};
          this.all.count = 0;
          this.all.total = 0;
        }
      },

      (error) => {
        console.error('Error loading commission slabs:', error);
        this.slabs = [];
        this.pagination = {};
        this.all.count = 0;
        this.all.total = 0;
      },
    );
  }

  get commissionRows(): FormArray {
    if (!this.slabForm) {
      return this.fb.array([]);
    }

    return this.slabForm.get('commissionRows') as FormArray;
  }

  createCommissionRow(): FormGroup {
    return this.fb.group({
      min_fare: ['', [Validators.required, Validators.min(0)]],
      max_fare: ['', [Validators.required, Validators.min(0)]],
      total_comm: ['', [Validators.required, Validators.min(0)]],
      odbus_comm: ['', [Validators.required, Validators.min(0)]],
      agent_comm: ['', [Validators.required, Validators.min(0)]],
    });
  }

  addCommissionRow(): void {
    this.commissionRows.push(this.createCommissionRow());
  }

  removeCommissionRow(index: number): void {
    // Never remove the first row
    if (index === 0) {
      return;
    }

    this.commissionRows.removeAt(index);
  }

  // =========================================================
  // RESET FORM
  // =========================================================

  ResetAttributes(): void {
    this.editId = null;

    this.ModalHeading = 'Add Agent Commission Slab';
    this.ModalBtn = 'Save';

    this.agentDropdownOpen = false;
    this.agentSearch = '';

    const defaultControl = this.slabForm.get('is_default');

    const agentAssignedControl = this.slabForm.get('agent_assigned');

    const agentIdsControl = this.slabForm.get('agent_ids');

    // Enable everything
    defaultControl?.enable();
    agentAssignedControl?.enable();
    agentIdsControl?.enable();

    // Clear commission rows
    while (this.commissionRows.length > 0) {
      this.commissionRows.removeAt(0);
    }

    // Always keep one row
    this.commissionRows.push(this.createCommissionRow());

    // Reset main form
    this.slabForm.reset({
      slab_name: '',
      is_default: false,
      agent_assigned: false,
      agent_ids: [],
      from_date: '',
      to_date: '',
    });

    // Reset search
    this.agentSearch = '';
    this.agentDropdownOpen = false;
  }
  // =========================================================
  // OPEN MODAL
  // =========================================================

  OpenModal(content: any): void {
    this.ResetAttributes();

    this.modalService.open(content, {
      size: 'xl',

      centered: true,

      backdrop: 'static',

      windowClass: 'agent-commission-modal',
    });
  }

  // =========================================================
  // AGENT SEARCH
  // =========================================================

  getFilteredAgents(): any[] {
    const agents = Array.isArray(this.agents) ? this.agents : [];

    const search = (this.agentSearch || '').trim().toLowerCase();

    if (!search) {
      return agents;
    }

    return agents.filter((agent: any) => {
      const name = String(agent.name || '').toLowerCase();
      const id = String(agent.id || '').toLowerCase();

      return name.includes(search) || id.includes(search);
    });
  }

  // =========================================================
  // CHECK AGENT SELECTED
  // =========================================================

  isAgentSelected(agentId: any): boolean {
    const selectedAgents = this.slabForm.get('agent_ids')?.value || [];

    return selectedAgents.some((id: any) => String(id) === String(agentId));
  }

  // =========================================================
  // SELECT / DESELECT AGENT
  // =========================================================

  toggleAgent(agent: any): void {
    const control = this.slabForm.get('agent_ids');

    if (!control) {
      return;
    }

    let selectedAgents: any[] = control.value || [];

    if (this.isAgentSelected(agent.id)) {
      selectedAgents = selectedAgents.filter(
        (id: any) => String(id) !== String(agent.id),
      );
    } else {
      selectedAgents = [...selectedAgents, agent.id];
    }

    control.setValue(selectedAgents);

    control.markAsTouched();
  }

  // =========================================================
  // GET SELECTED AGENTS
  // =========================================================

  getSelectedAgents(): any[] {
    const selectedIds = this.slabForm.get('agent_ids')?.value || [];

    return this.agents.filter((agent: any) =>
      selectedIds.some((id: any) => String(id) === String(agent.id)),
    );
  }

  // =========================================================
  // REMOVE ONE AGENT
  // =========================================================

  removeAgent(agentId: any): void {
    const control = this.slabForm.get('agent_ids');

    if (!control) {
      return;
    }

    const selectedAgents = control.value || [];

    control.setValue(
      selectedAgents.filter((id: any) => String(id) !== String(agentId)),
    );

    control.markAsTouched();
  }

  // =========================================================
  // CLEAR ALL AGENTS
  // =========================================================

  clearAgents(): void {
    this.slabForm.get('agent_ids')?.setValue([]);
  }

  // =========================================================
  // CLOSE DROPDOWN WHEN CLICKING OUTSIDE
  // =========================================================

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    if (!target.closest('.agent-dropdown-container')) {
      this.agentDropdownOpen = false;
    }
  }

  // =========================================================
  // OPEN / CLOSE AGENT DROPDOWN
  // =========================================================

  toggleAgentDropdown(event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }

    this.agentDropdownOpen = !this.agentDropdownOpen;
  }

  // =========================================================
  // CLOSE DROPDOWN
  // =========================================================

  closeAgentDropdown(): void {
    this.agentDropdownOpen = false;
  }

  // =========================================================
  // EDIT
  // =========================================================

  editSlab(index: number, content: any): void {
    const slab = this.slabs[index];

    if (!slab) {
      return;
    }

    console.log('EDIT SLAB:', slab);

    // =========================================
    // RESET FORM FIRST
    // =========================================
    this.ResetAttributes();

    // =========================================
    // EDIT MODE
    // =========================================
    this.editId = slab.id;

    this.ModalHeading = 'Edit Agent Commission Slab';
    this.ModalBtn = 'Update';

    // =========================================
    // AGENT IDS
    // =========================================
    let agentIds: number[] = [];

    if (Array.isArray(slab.agent_ids) && slab.agent_ids.length > 0) {
      agentIds = slab.agent_ids.map((id: any) => Number(id));
    } else if (Array.isArray(slab.agents)) {
      agentIds = slab.agents.map((agent: any) => Number(agent.agent_id));
    }

    // =========================================
    // AGENT ASSIGNED
    // =========================================
    const agentAssigned =
      Number(slab.agent_assigned || 0) === 1 || agentIds.length > 0;

    // =========================================
    // MAIN FORM FIELDS
    // =========================================
    this.slabForm.patchValue({
      slab_name: slab.slab_name || '',

      is_default: Number(slab.is_default || 0) === 1,

      agent_assigned: agentAssigned,

      agent_ids: agentIds,

      from_date: slab.from_date || '',

      to_date: slab.to_date || '',
    });

    // =========================================
    // COMMISSION ROWS
    // =========================================

    // Remove existing rows
    while (this.commissionRows.length > 0) {
      this.commissionRows.removeAt(0);
    }

    // Get all commission rows
    const commissionRows = Array.isArray(slab.commission_rows)
      ? slab.commission_rows
      : [];

    // Add each saved commission row
    commissionRows.forEach((row: any) => {
      this.commissionRows.push(
        this.fb.group({
          min_fare: [
            row.min_fare ?? row.range_from ?? '',
            [Validators.required, Validators.min(0)],
          ],

          max_fare: [
            row.max_fare ?? row.range_to ?? '',
            [Validators.required, Validators.min(0)],
          ],

          total_comm: [
            row.total_comm ?? '',
            [Validators.required, Validators.min(0)],
          ],

          odbus_comm: [
            row.odbus_comm ?? '',
            [Validators.required, Validators.min(0)],
          ],

          agent_comm: [
            row.agent_comm ?? '',
            [Validators.required, Validators.min(0)],
          ],
        }),
      );
    });

    // Safety: always keep one commission row
    if (this.commissionRows.length === 0) {
      this.commissionRows.push(this.createCommissionRow());
    }

    // =========================================
    // ENABLE / DISABLE CONTROLS
    // =========================================

    const defaultControl = this.slabForm.get('is_default');

    const agentAssignedControl = this.slabForm.get('agent_assigned');

    const agentIdsControl = this.slabForm.get('agent_ids');

    defaultControl?.enable();
    agentAssignedControl?.enable();
    agentIdsControl?.enable();

    if (Number(slab.is_default || 0) === 1) {
      agentAssignedControl?.setValue(false);
      agentAssignedControl?.disable();

      agentIdsControl?.setValue([]);
      agentIdsControl?.disable();
    } else if (agentAssigned) {
      defaultControl?.setValue(false);
      defaultControl?.disable();

      agentIdsControl?.enable();
    }

    // =========================================
    // OPEN MODAL
    // =========================================
    this.modalService.open(content, {
      size: 'xl',
      centered: true,
      backdrop: 'static',
      windowClass: 'agent-commission-modal',
    });
  }
  addSlab(): void {
    const isDefault = this.slabForm.get('is_default')?.value;

    const agentAssigned = this.slabForm.get('agent_assigned')?.value;

    const agentIds = this.slabForm.get('agent_ids')?.value || [];

    if (agentAssigned && agentIds.length === 0) {
      alert('Please select at least one agent.');
      return;
    }

    if (this.slabForm.invalid) {
      this.slabForm.markAllAsTouched();
      return;
    }

    const userId = Number(sessionStorage.getItem('USERID'));

    console.log('Logged-in User ID:', userId);

    if (!userId || isNaN(userId)) {
      alert('Logged-in user ID not found.');
      console.error('USERID not found in sessionStorage');
      return;
    }

    const data = {
      slab_name: this.slabForm.get('slab_name')?.value,
      is_default: this.slabForm.get('is_default')?.value ? 1 : 0,
      agent_assigned: this.slabForm.get('agent_assigned')?.value ? 1 : 0,
      agent_ids: this.getSelectedAgents().map((agent: any) => Number(agent.id)),
      commission_rows: this.commissionRows.value,
      from_date: this.slabForm.get('from_date')?.value || null,
      to_date: this.slabForm.get('to_date')?.value || null,
      created_by: userId,
    };

    console.log('Logged-in User ID:', userId);
    console.log('DATA TO API:', data);
    console.log('DATA TO API:', data);
    console.log('DATA TO API:', data);

    if (this.editId) {
      this.http
        .post(this.path + 'updateAgentCommissionSlab/' + this.editId, data)
        .subscribe(
          (response: any) => {
            if (response.status === true) {
              alert(response.message);

              this.getAll();

              this.modalService.dismissAll();

              this.ResetAttributes();
            } else {
              alert(response.message || 'Unable to update slab');
            }
          },
          (error) => {
            console.error('Update error:', error);

            alert(
              error.error?.message || 'Unable to update Agent Commission Slab',
            );
          },
        );
    } else {
      this.http.post(this.path + 'addAgentCommissionSlab', data).subscribe(
        (response: any) => {
          if (response.status === true) {
            alert(response.message);

            this.getAll();

            this.modalService.dismissAll();

            this.ResetAttributes();
          } else {
            alert(response.message || 'Unable to add slab');
          }
        },
        (error) => {
          console.log('Add error:', error);
          console.log('STATUS:', error.status);
          console.log('ERROR BODY:', error.error);
          console.log('VALIDATION ERRORS:', error.error?.errors);

          alert(error.error?.message || 'Unable to add Agent Commission Slab');
        },
      );
    }
  }

  openConfirmDialog(content: any, index: number): void {
    if (this.slabs[index]) {
      this.deleteId = this.slabs[index].id;
    }

    this.modalService.open(content, {
      centered: true,
    });
  }

  deleteRecord(): void {
    if (!this.deleteId) {
      return;
    }

    console.log('Delete Agent Commission Slab:', this.deleteId);

    this.deleteId = null;
  }

  changeStatus(event: any, id: any): void {
    console.log('Change status:', id);
  }

  // =========================================================
  // DEFAULT
  // =========================================================

  changeDefault(slab: any): void {
    console.log('Change default:', slab.id, slab.is_default);
  }

  // =========================================================
  // REFRESH
  // =========================================================

  refresh(): void {
    this.searchForm.reset({
      searchBy: '',

      status: '',

      per_page: '10',
    });

    this.getAll();

    this.getAgents();
  }

  page(label: string): string {
    if (!label) {
      return '';
    }

    return label.replace('&laquo;', '«').replace('&raquo;', '»');
  }

  changeSlabStatus(slab: any): void {
    const newStatus = slab.status == 1 ? 0 : 1;

    this.http
      .post(
        Constants.BASE_URL + '/changeAgentCommissionSlabStatus/' + slab.id,
        {
          status: newStatus,
        },
      )
      .subscribe(
        (response: any) => {
          if (response.status) {
            // Update UI only after DB update succeeds
            slab.status = newStatus;

            this.notificationService.addToast({
              type: 'success',
              title: 'Success',
              content:
                response.message ||
                (newStatus == 1
                  ? 'Slab activated successfully'
                  : 'Slab deactivated successfully'),
              timeout: 3000,
            });
          } else {
            this.notificationService.addToast({
              type: 'error',
              title: 'Error',
              content: response.message || 'Unable to change slab status',
              timeout: 3000,
            });
          }
        },
        (error) => {
          this.notificationService.addToast({
            type: 'error',
            title: 'Error',
            content: error.error?.message || 'Unable to change slab status',
            timeout: 3000,
          });
        },
      );
  }

  getAgents(): void {
    this.http.post(this.path + 'getAgentCommissionSlabAgents', {}).subscribe(
      (response: any) => {
        console.log('FULL AGENT API RESPONSE:', response);
        console.log('AGENT API DATA:', response?.data);
        console.log('IS ARRAY:', Array.isArray(response?.data));

        if (response && response.status === true) {
          this.agents = Array.isArray(response.data) ? response.data : [];

          console.log('FINAL AGENTS ARRAY:', this.agents);
          console.log('AGENT COUNT:', this.agents.length);
        } else {
          this.agents = [];
        }
      },

      (error) => {
        console.error('Error loading agents:', error);
        this.agents = [];
      },
    );
  }

  createSlab(payload: any): void {
    this.http.post(this.path + 'agent-commission-slabs', payload).subscribe(
      (response: any) => {
        console.log('Create response:', response);

        if (response && response.status === true) {
          alert(
            response.message || 'Agent Commission Slab created successfully',
          );

          this.getAll();

          this.slabForm.reset({
            slab_name: '',
            agent_ids: [],
            min_fare: '',
            max_fare: '',
            total_comm: '',
            odbus_comm: '',
            agent_comm: '',
            is_default: false,
            from_date: '',
            to_date: '',
          });

          this.agentDropdownOpen = false;
          this.agentSearch = '';

          // Close currently opened modal
          this.modalService.dismissAll();

          this.editId = null;
          this.ModalHeading = 'Add Agent Commission Slab';
          this.ModalBtn = 'Save';
        } else {
          alert(response.message || 'Unable to create slab');
        }
      },
      (error) => {
        console.error('Create slab error:', error);

        alert(
          error?.error?.message ||
            'Something went wrong while creating Agent Commission Slab',
        );
      },
    );
  }

  updateSlab(payload: any): void {
    this.http
      .put(this.path + 'agent-commission-slabs/' + this.editId, payload)
      .subscribe(
        (response: any) => {
          console.log('Update response:', response);

          if (response && response.status === true) {
            alert(
              response.message || 'Agent Commission Slab updated successfully',
            );

            this.getAll();

            this.modalService.dismissAll();

            this.editId = null;
            this.ModalHeading = 'Add Agent Commission Slab';
            this.ModalBtn = 'Save';

            this.slabForm.reset({
              slab_name: '',
              agent_ids: [],
              min_fare: '',
              max_fare: '',
              total_comm: '',
              odbus_comm: '',
              agent_comm: '',
              is_default: false,
              from_date: '',
              to_date: '',
            });

            this.agentDropdownOpen = false;
            this.agentSearch = '';
          } else {
            alert(response.message || 'Unable to update slab');
          }
        },
        (error) => {
          console.error('Update slab error:', error);

          alert(
            error?.error?.message ||
              'Something went wrong while updating Agent Commission Slab',
          );
        },
      );
  }

  trackByAgentId(index: number, agent: any): any {
    return agent.id;
  }
}
