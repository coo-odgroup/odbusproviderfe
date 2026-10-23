import { Component, OnInit } from '@angular/core';
import {
  ManageuserService,
  OperatorOption,
  RoleOption,
  StateOption,
} from '../../services/manageuser.service';
import { NotificationService } from '../../services/notification.service';

interface ManageUser {
  id: number;
  name: string;
  username: string;
  email: string;
  mobile: string;
  role: string;
  roleId?: number;
  operator?: string;
  operatorId?: number;
  client?: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
  address?: string;
  street?: string;
  city?: string;
  pincode?: string;
  state_id?: number | null;
}

@Component({
  selector: 'app-manageuser',
  templateUrl: './manageuser.component.html',
  styleUrls: ['./manageuser.component.scss'],
})
export class ManageuserComponent implements OnInit {
  constructor(
    private manageuserService: ManageuserService,
    private notificationService: NotificationService,
  ) {}
  updatingStatusId: number | null = null;

  showAddUser = false;
  searchText = '';
  selectedUser: ManageUser | null = null;
  editingUserId: number | null = null;
  operators: OperatorOption[] = [];
  roles: RoleOption[] = [];
  pageSize = 10;
  currentPage = 1;
  showDemoModal = false;
  demoModalType: 'address' | 'bus' | 'route' = 'address';
  demoSelectedUser: ManageUser | null = null;
  savingUser = false;
  selectedRoleId: number | null = null;
  loadingOperators = false;
  loadingRoles = false;
  newUser: Partial<ManageUser> = this.getEmptyUser();
  users: ManageUser[] = [];
  loadingUsers = false;
  activeActionMenuId: number | null = null;
  selectedClientId = '';
  selectedOperatorId = '';
  selectedStatus = '';
  searchInput = '';
  clientIdInput = '';
  operatorIdInput = '';
  statusInput = '';
  addressForm = {
    address: '',
    street: '',
    city: '',
    pincode: '',
    state_id: null as number | null,
  };
  savingAddress = false;

  states: StateOption[] = [];
  loadingStates = false;

  addressLine1 = '';
  addressLine2 = '';
  city = '';
  pinCode = '';
  selectedStateId: number | null = null;

  ngOnInit(): void {
    this.loadOperators();
    this.loadRoles();
    this.loadUsers();
    this.loadStates();
  }

  loadOperators(): void {
    this.loadingOperators = true;

    this.manageuserService.getBusOperators().subscribe({
      next: (response) => {
        this.operators = response.status === 1 ? response.data || [] : [];
        this.loadingOperators = false;
      },
      error: (error) => {
        console.error('Failed to load operators:', error);
        this.loadingOperators = false;
      },
    });
  }

  loadRoles(): void {
    this.loadingRoles = true;

    this.manageuserService.getRoles().subscribe({
      next: (response) => {
        this.roles = response.status === 1 ? response.data || [] : [];
        this.loadingRoles = false;
      },
      error: (error) => {
        console.error('Failed to load roles:', error);
        this.loadingRoles = false;
      },
    });
  }

  onOperatorChange(operatorId: number | string): void {
    const id = operatorId === '' ? null : Number(operatorId);
    const operator = this.operators.find((item) => item.id === id);

    this.newUser.operatorId = operator?.id;
    this.newUser.operator = operator?.organisation_name || '';
  }

  get clientIds(): string[] {
    return Array.from(
      new Set(
        this.users
          .map((user) => user.client || '')
          .filter((clientId) => clientId.trim() !== ''),
      ),
    ).sort();
  }

  onRoleChange(roleId: number | string | null): void {
    const id = roleId === null || roleId === '' ? null : Number(roleId);
    const role = this.roles.find((item) => item.id === id);

    this.selectedRoleId = id;
    this.newUser.roleId = role?.id;
    this.newUser.role = role?.name || '';
    this.newUser.client = role ? this.generateClientId(role.name) : '';
  }

  private generateClientId(roleName: string): string {
    const role = roleName.trim().toUpperCase();

    if (role === 'SUPER ADMIN') {
      return '';
    }

    const prefixes: { [key: string]: string } = {
      AGENT: 'AGN',
      CONDUCTOR: 'CON',
      MANAGER: 'MAN',
      OPERATOR: 'OPR',
      ASSOCIATION: 'ASC',
      'API USER': 'API',
      ADMIN: 'ADM',
    };

    const prefix = prefixes[role] || 'USR';
    const digits = Math.floor(1000000 + Math.random() * 9000000);

    return prefix + digits;
  }

  private getEmptyUser(): Partial<ManageUser> {
    return {
      name: '',
      email: '',
      mobile: '',
      role: '',
      roleId: undefined,
      operator: '',
      operatorId: undefined,
      client: '',
      status: 'Active',
    };
  }

  loadUsers(): void {
    this.loadingUsers = true;

    this.manageuserService.getUsers().subscribe({
      next: (response) => {
        this.loadingUsers = false;

        if (response.status !== 1 || !Array.isArray(response.data)) {
          this.users = [];
          this.notificationService.notify(
            response.message || 'Unable to load users.',
            'Error',
          );
          return;
        }

        this.users = response.data.map((user: any) => ({
          id: Number(user.id),
          name: user.name || '',
          username: user.client_id || '',
          email: user.email || '',
          mobile: user.phone || '',
          role: user.role_name || user.user_type || '',
          roleId: user.role_id ? Number(user.role_id) : undefined,
          operator: user.organisation_name || '',
          operatorId: user.bus_operator_id
            ? Number(user.bus_operator_id)
            : undefined,
          client: user.client_id || '',
          status: Number(user.status) === 1 ? 'Active' : 'Inactive',
          createdAt: user.created_at || '',

          // Map saved address data
          address: user.address || '',
          street: user.street || '',
          city: user.city || '',
          pincode: user.pincode || '',
          state_id: user.state_id != null ? Number(user.state_id) : null,
        }));
      },
      error: (error) => {
        this.loadingUsers = false;
        this.users = [];

        console.error('Failed to load users:', error);

        this.notificationService.notify(
          error.error?.message || 'Unable to load users.',
          'Error',
        );
      },
    });
  }

  get filteredUsers(): ManageUser[] {
    const search = this.searchText.toLowerCase().trim();

    return this.users.filter((user) => {
      // Search across multiple fields
      const matchesSearch =
        !search ||
        [user.name, user.email, user.mobile, user.client].some((value) =>
          String(value || '')
            .toLowerCase()
            .includes(search),
        );

      // Exact Client ID filter
      const matchesClient =
        !this.selectedClientId || user.client === this.selectedClientId;

      // Operator filter
      const matchesOperator =
        !this.selectedOperatorId ||
        String(user.operatorId ?? '') === this.selectedOperatorId;

      // Status filter
      const matchesStatus =
        !this.selectedStatus || user.status === this.selectedStatus;

      return matchesSearch && matchesClient && matchesOperator && matchesStatus;
    });
  }

  getActiveCount(): number {
    return this.users.filter((user) => user.status === 'Active').length;
  }

  getInactiveCount(): number {
    return this.users.filter((user) => user.status === 'Inactive').length;
  }

  viewUser(user: ManageUser): void {
    this.selectedUser = user;
  }

  editUser(user: ManageUser): void {
    this.editingUserId = user.id;

    this.newUser = {
      ...user,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
      status: user.status,
    };

    this.selectedRoleId = user.roleId ?? null;
    this.showAddUser = true;
  }

  cancelForm(): void {
    this.newUser = this.getEmptyUser();
    this.selectedRoleId = null;
    this.editingUserId = null;
    this.showAddUser = false;
  }

  addDummyUser(): void {
    const name = (this.newUser.name || '').trim();
    const email = (this.newUser.email || '').trim();
    const mobile = (this.newUser.mobile || '').trim();

    if (!name || !email || !mobile) {
      this.notificationService.notify(
        'Please enter name, email and mobile number.',
        'Error',
      );
      return;
    }

    if (!this.newUser.roleId) {
      this.notificationService.notify('Please select a role.', 'Error');
      return;
    }

    const payload = {
      bus_operator_id: this.newUser.operatorId ?? null,
      name,
      email,
      client_id: this.newUser.client || null,
      phone: mobile,
      role_id: this.newUser.roleId,
      user_type: (this.newUser.role || '').trim().toUpperCase(),
    };

    this.savingUser = true;

    this.manageuserService.createUser(payload).subscribe({
      next: (response) => {
        this.savingUser = false;

        if (response.status !== 1) {
          this.notificationService.notify(
            response.message || 'Unable to save user.',
            'Error',
          );
          return;
        }

        this.notificationService.notify(
          response.message || 'User saved successfully.',
          'Success',
        );

        this.cancelForm();
      },

      error: (error) => {
        this.savingUser = false;

        console.error('User creation failed:', error);

        const validationErrors = error.error?.errors;

        if (validationErrors) {
          Object.keys(validationErrors).forEach((field) => {
            const messages = validationErrors[field];

            if (Array.isArray(messages)) {
              messages.forEach((message: string) => {
                this.notificationService.notify(message, 'Error');
              });
            }
          });

          return;
        }

        this.notificationService.notify(
          error.error?.message || 'Unable to save user. Please try again.',
          'Error',
        );
      },
    });
  }

  toggleUserStatus(user: ManageUser): void {
    if (this.updatingStatusId !== null) {
      return;
    }

    const newStatus = user.status === 'Active' ? 0 : 1;
    const newStatusLabel = newStatus === 1 ? 'Active' : 'Inactive';

    this.updatingStatusId = user.id;

    this.manageuserService
      .toggleUserStatus({
        id: user.id,
        status: newStatus,
      })
      .subscribe({
        next: (response) => {
          this.updatingStatusId = null;

          if (response.status !== 1) {
            this.notificationService.notify(
              response.message || 'Unable to update user status.',
              'Error',
            );
            return;
          }

          // Update the displayed row only after the API succeeds.
          user.status = newStatusLabel;

          this.notificationService.notify(
            response.message || 'User status updated successfully.',
            'Success',
          );
        },
        error: (error) => {
          this.updatingStatusId = null;

          console.error('User status update failed:', error);

          this.notificationService.notify(
            error.error?.message || 'Unable to update user status.',
            'Error',
          );
        },
      });
  }

  applyFilters(): void {
    this.searchText = this.searchInput.trim();
    this.selectedClientId = this.clientIdInput;
    this.selectedOperatorId = this.operatorIdInput;
    this.selectedStatus = this.statusInput;
    this.currentPage = 1;
  }

  resetFilters(): void {
    this.searchInput = '';
    this.clientIdInput = '';
    this.operatorIdInput = '';
    this.statusInput = '';

    this.searchText = '';
    this.selectedClientId = '';
    this.selectedOperatorId = '';
    this.selectedStatus = '';

    this.currentPage = 1;
  }

  onPageSizeChange(size: number): void {
    this.pageSize = Number(size);
    this.currentPage = 1;
  }

  get paginatedUsers(): ManageUser[] {
    const filtered = this.filteredUsers;

    if (this.pageSize === 0) {
      return filtered;
    }

    const startIndex = (this.currentPage - 1) * this.pageSize;

    return filtered.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages(): number {
    if (this.pageSize === 0) {
      return 1;
    }

    return Math.max(1, Math.ceil(this.filteredUsers.length / this.pageSize));
  }

  exportUsersCsv(): void {
    const exportData = this.filteredUsers;

    if (!exportData.length) {
      this.notificationService.notify('No users available to export.', 'Error');
      return;
    }

    const headers = [
      'ID',
      'Client ID',
      'Name',
      'Email',
      'Mobile',
      'Role',
      'Operator',
      'Status',
      'Created Date',
    ];

    const escapeCsv = (value: any): string => {
      let text = String(value ?? '');

      // Prevent spreadsheet formula injection.
      if (/^[\s]*[=+\-@]/.test(text)) {
        text = "'" + text;
      }

      return '"' + text.replace(/"/g, '""') + '"';
    };

    const rows = exportData.map((user) => [
      user.id,
      user.client || '',
      user.name,
      user.email,
      user.mobile,
      user.role,
      user.operator || '',
      user.status,
      user.createdAt,
    ]);

    const csvContent = [
      headers.map(escapeCsv).join(','),
      ...rows.map((row) => row.map(escapeCsv).join(',')),
    ].join('\r\n');

    const blob = new Blob(['\uFEFF' + csvContent], {
      type: 'text/csv;charset=utf-8;',
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download =
      'manage-users-' + new Date().toISOString().slice(0, 10) + '.csv';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    this.notificationService.notify('Users exported successfully.', 'Success');
  }

  toggleActionMenu(userId: number, event: MouseEvent): void {
    event.stopPropagation();

    this.activeActionMenuId =
      this.activeActionMenuId === userId ? null : userId;
  }

  openDemoModal(user: ManageUser, type: 'address' | 'bus' | 'route'): void {
    this.demoSelectedUser = user;
    this.demoModalType = type;
    this.activeActionMenuId = null;

    if (type === 'address') {
      this.addressLine1 = user.address || '';
      this.addressLine2 = user.street || '';
      this.city = user.city || '';
      this.pinCode = user.pincode || '';

      this.addressForm = {
        address: user.address || '',
        street: user.street || '',
        city: user.city || '',
        pincode: user.pincode || '',
        state_id: user.state_id != null ? Number(user.state_id) : null,
      };
    }

    this.showDemoModal = true;
  }

  closeDemoModal(): void {
    this.showDemoModal = false;
    this.demoSelectedUser = null;
  }

  loadStates(): void {
    this.loadingStates = true;

    this.manageuserService.getStates().subscribe({
      next: (states: StateOption[]) => {
        this.states = states || [];
        this.loadingStates = false;

        // Restore the selected state when the address modal is open
        if (this.showDemoModal && this.demoSelectedUser) {
          const savedStateId = this.demoSelectedUser.state_id;

          this.addressForm.state_id =
            savedStateId != null &&
            this.states.some((s) => Number(s.id) === Number(savedStateId))
              ? Number(savedStateId)
              : null;
        }

        console.log('States loaded:', this.states);
      },
      error: (error) => {
        console.error('Failed to load states:', error);
        this.states = [];
        this.loadingStates = false;

        this.notificationService.notify('Unable to load states.', 'Error');
      },
    });
  }

  get startRecord(): number {
    if (this.filteredUsers.length === 0) {
      return 0;
    }

    return this.pageSize === 0 ? 1 : (this.currentPage - 1) * this.pageSize + 1;
  }

  get endRecord(): number {
    if (this.pageSize === 0) {
      return this.filteredUsers.length;
    }

    return Math.min(
      this.currentPage * this.pageSize,
      this.filteredUsers.length,
    );
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }

  previousPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  goToPage(page: number): void {
    this.currentPage = Math.max(1, Math.min(page, this.totalPages));
  }

  saveUserAddress(): void {
    if (!this.demoSelectedUser) {
      return;
    }

    const payload = {
      id: this.demoSelectedUser.id,
      address: this.addressLine1.trim(),
      street: this.addressLine2.trim(),
      city: this.city.trim(),
      pincode: this.pinCode.trim(),
      state_id: this.addressForm.state_id,
    };

    if (!payload.state_id) {
      this.notificationService.notify('Please select a state.', 'Error');
      return;
    }

    this.savingAddress = true;

    this.manageuserService.saveUserAddress(payload).subscribe({
      next: (response) => {
        this.savingAddress = false;

        if (response.status !== 1) {
          this.notificationService.notify(
            response.message || 'Unable to save address.',
            'Error',
          );
          return;
        }

        this.notificationService.notify(
          response.message || 'Address saved successfully.',
          'Success',
        );

        this.closeDemoModal();
        this.loadUsers();
      },
      error: (error) => {
        this.savingAddress = false;
        this.notificationService.notify(
          error.error?.message || 'Unable to save address.',
          'Error',
        );
      },
    });
  }
}
