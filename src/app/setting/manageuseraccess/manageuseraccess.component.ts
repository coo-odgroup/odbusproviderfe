import { Component, OnInit } from '@angular/core';
import {
  ManageuseraccessService,
  AccessUser,
  AccessPermission,
  AccessOperator,
  AccessAssignableUser,
  AccessBus,
  AccessRoute,
} from '../../services/manageuseraccess.service';
import { NotificationService } from '../../services/notification.service';

type RouteStatus = 'Active' | 'Inactive';
interface UserAccessRow {
  id: number;
  userId: number;
  userName: string;
  clientId: string;
  email: string;
  permissionIds: number[];
  permissionNames: string[];
  status: 'Active' | 'Inactive';
  updatedAt: string;
  demo?: boolean;
}

interface SavedBusAssignment {
  id: number;
  bus_operator_id: number;
  operator_name: string;
  role_type: number;
  role_name: string;
  user_id: number;
  user_name: string;
  client_id: string;
  bus_id: number;
  bus_name: string;
  bus_number: string;
  route_access: number;
  access_mode: number;
  access_mode_label: string;
  valid_from: string;
  valid_until: string;
  status: number;
  status_label: string;
  created_at: string;
  updated_at: string;
  route_count: number;
  routes: {
    ticket_price_id: number;
    source_id: number;
    source_name: string;
    destination_id: number;
    destination_name: string;
    route_status: number;
  }[];
}

interface AccessForm {
  fromDate: string;
  toDate: string;
  operatorId: string;
  userType: string;
  userId: string;
  busId: string;
  routeIds: number[];
  allRoutes: boolean;
}

@Component({
  selector: 'app-manageuseraccess',
  templateUrl: './manageuseraccess.component.html',
  styleUrls: ['./manageuseraccess.component.scss'],
})
export class ManageuseraccessComponent implements OnInit {
  users: AccessUser[] = [];
  permissions: AccessPermission[] = [];

  selectedUserId: number | null = null;
  selectedPermissionIds: number[] = [];
  loadingUsers = false;
  loadingPermissions = false;
  loadingUserAccess = false;
  saving = false;
  showAccessForm = false;
  routeStatuses: { [routeId: number]: RouteStatus } = {};
  editingRouteId: number | null = null;
  searchText = '';
  filterSearch = '';
  filterUserId = '';
  filterStatus = '';
  pageSize = 10;
  currentPage = 1;
  savedAssignments: SavedBusAssignment[] = [];
  loadingAssignments = false;
  viewingAssignment: SavedBusAssignment | null = null;
  viewingAccess: UserAccessRow | null = null;
  operators: AccessOperator[] = [];
  accessAssignableUsers: AccessAssignableUser[] = [];
  accessBuses: AccessBus[] = [];
  loadingOperators = false;
  loadingAssignableUsers = false;
  loadingBuses = false;
  accessRoutes: AccessRoute[] = [];
  filterOperatorId = '';
  filterUserType = '';
  filterFromDate = '';
  filterToDate = '';
  filterUsers: AccessAssignableUser[] = [];
  loadingFilterUsers = false;
  loadingRoutes = false;
  editingAccessId: number | null = null;
  accessForm: AccessForm = this.getEmptyAccessForm();

  private getEmptyAccessForm(): AccessForm {
    return {
      fromDate: '',
      toDate: '',
      operatorId: '',
      userType: '',
      userId: '',
      busId: '',
      routeIds: [],
      allRoutes: false,
    };
  }

  // Demo mode is enabled only when the API does not return real data.
  private demoUsers: AccessUser[] = [
    { id: 9001, name: 'Rahul Sharma', client_id: 'USR001' } as AccessUser,
    { id: 9002, name: 'Priya Das', client_id: 'USR002' } as AccessUser,
    { id: 9003, name: 'Amit Kumar', client_id: 'USR003' } as AccessUser,
    { id: 9004, name: 'Sneha Patel', client_id: 'USR004' } as AccessUser,
  ];

  private demoPermissions: AccessPermission[] = [
    {
      id: 1,
      name: 'View Dashboard',
      key: 'dashboard.view',
      description: 'Access the main dashboard',
    } as AccessPermission,
    {
      id: 2,
      name: 'Manage Users',
      key: 'users.manage',
      description: 'Create and manage user accounts',
    } as AccessPermission,
    {
      id: 3,
      name: 'Manage Bookings',
      key: 'bookings.manage',
      description: 'View and manage bookings',
    } as AccessPermission,
    {
      id: 4,
      name: 'Manage Notifications',
      key: 'notifications.manage',
      description: 'Create and manage notification campaigns',
    } as AccessPermission,
    {
      id: 5,
      name: 'View Reports',
      key: 'reports.view',
      description: 'Access reports and analytics',
    } as AccessPermission,
    {
      id: 6,
      name: 'Manage Settings',
      key: 'settings.manage',
      description: 'Update system settings',
    } as AccessPermission,
  ];

  demoAccessList: UserAccessRow[] = [
    {
      id: 1,
      userId: 9001,
      userName: 'Rahul Sharma',
      clientId: 'USR001',
      email: 'rahul.demo@example.com',
      permissionIds: [1, 2, 3],
      permissionNames: ['View Dashboard', 'Manage Users', 'Manage Bookings'],
      status: 'Active',
      updatedAt: '2026-10-20',
      demo: true,
    },
    {
      id: 2,
      userId: 9002,
      userName: 'Priya Das',
      clientId: 'USR002',
      email: 'priya.demo@example.com',
      permissionIds: [1, 4, 5],
      permissionNames: [
        'View Dashboard',
        'Manage Notifications',
        'View Reports',
      ],
      status: 'Active',
      updatedAt: '2026-10-19',
      demo: true,
    },
    {
      id: 3,
      userId: 9003,
      userName: 'Amit Kumar',
      clientId: 'USR003',
      email: 'amit.demo@example.com',
      permissionIds: [1, 5],
      permissionNames: ['View Dashboard', 'View Reports'],
      status: 'Inactive',
      updatedAt: '2026-10-17',
      demo: true,
    },
    {
      id: 4,
      userId: 9004,
      userName: 'Sneha Patel',
      clientId: 'USR004',
      email: 'sneha.demo@example.com',
      permissionIds: [1, 2, 4, 6],
      permissionNames: [
        'View Dashboard',
        'Manage Users',
        'Manage Notifications',
        'Manage Settings',
      ],
      status: 'Active',
      updatedAt: '2026-10-15',
      demo: true,
    },
  ];

  // Demo records are shown until a real listing API is connected.
  accessList: UserAccessRow[] = [...this.demoAccessList];

  private demoMode = true;

  constructor(
    private accessService: ManageuseraccessService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadPermissions();
    this.loadOperators();
    this.loadSavedAssignments();
  }

  get filteredPermissions(): AccessPermission[] {
    const search = this.searchText.trim().toLowerCase();

    if (!search) {
      return this.permissions;
    }

    return this.permissions.filter((permission) =>
      [permission.name, permission.key, permission.description || ''].some(
        (value) => String(value).toLowerCase().includes(search),
      ),
    );
  }

  get filteredAccessList(): UserAccessRow[] {
    const search = this.filterSearch.trim().toLowerCase();

    return this.accessList.filter((item) => {
      const matchesSearch =
        !search ||
        [
          item.userName,
          item.clientId,
          item.email,
          ...item.permissionNames,
        ].some((value) => String(value).toLowerCase().includes(search));

      const matchesUser =
        !this.filterUserId || String(item.userId) === this.filterUserId;

      const matchesStatus =
        !this.filterStatus || item.status === this.filterStatus;

      return matchesSearch && matchesUser && matchesStatus;
    });
  }

  get effectivePageSize(): number {
    return this.pageSize === 0
      ? Math.max(this.filteredAccessList.length, 1)
      : this.pageSize;
  }

  get totalPages(): number {
    return Math.max(
      1,
      Math.ceil(this.filteredAccessList.length / this.effectivePageSize),
    );
  }

  get paginatedAccessList(): UserAccessRow[] {
    const rows = this.filteredAccessList;

    if (this.pageSize === 0) {
      return rows;
    }

    const start = (this.currentPage - 1) * this.pageSize;

    return rows.slice(start, start + this.pageSize);
  }

  get startRecord(): number {
    return this.filteredAccessList.length === 0
      ? 0
      : (this.currentPage - 1) * this.effectivePageSize + 1;
  }

  get endRecord(): number {
    return Math.min(
      this.currentPage * this.effectivePageSize,
      this.filteredAccessList.length,
    );
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }

  get filterUserOptions(): number[] {
    const ids = this.accessList.map((item) => item.userId);

    return ids.filter((id, index) => ids.indexOf(id) === index);
  }

  get allPermissionsSelected(): boolean {
    return (
      this.permissions.length > 0 &&
      this.permissions.every((permission) =>
        this.isPermissionSelected(permission.id),
      )
    );
  }

  getAccessUserName(userId: number): string {
    const user = this.users.find((item) => Number(item.id) === userId);

    if (user) {
      return user.name;
    }

    const demo = this.demoUsers.find((item) => Number(item.id) === userId);

    return demo ? demo.name : 'User ' + userId;
  }

  toggleAccessForm(): void {
    this.showAccessForm = !this.showAccessForm;

    if (!this.showAccessForm) {
      this.resetForm();
    }
  }

  loadUsers(): void {
    this.loadingUsers = true;

    this.accessService.getUsers().subscribe({
      next: (response) => {
        this.loadingUsers = false;

        if (
          response.status === 1 &&
          Array.isArray(response.data) &&
          response.data.length > 0
        ) {
          this.users = response.data;
        } else {
          this.users = [...this.demoUsers];
        }
      },
      error: (error) => {
        this.loadingUsers = false;
        console.error('Failed to load users:', error);

        this.users = [...this.demoUsers];
      },
    });
  }

  loadPermissions(): void {
    this.loadingPermissions = true;

    this.accessService.getPermissions().subscribe({
      next: (response) => {
        this.loadingPermissions = false;

        if (
          response.status === 1 &&
          Array.isArray(response.data) &&
          response.data.length > 0
        ) {
          this.permissions = response.data;
          this.demoMode = false;
        } else {
          this.permissions = [...this.demoPermissions];
          this.demoMode = true;
        }
      },
      error: (error) => {
        this.loadingPermissions = false;
        console.error('Failed to load permissions:', error);

        this.permissions = [...this.demoPermissions];
        this.demoMode = true;
      },
    });
  }

  loadOperators(): void {
    this.loadingOperators = true;

    this.accessService.getOperators().subscribe({
      next: (response) => {
        this.loadingOperators = false;

        if (
          (response.status === 1 || response.status === true) &&
          Array.isArray(response.data)
        ) {
          this.operators = response.data;
        } else {
          this.operators = [];
          this.notificationService.notify(
            response.message || 'Unable to load operators.',
            'Error',
          );
        }
      },
      error: (error) => {
        this.loadingOperators = false;
        this.operators = [];

        console.error('Failed to load operators:', error);

        this.notificationService.notify(
          error.error && error.error.message
            ? error.error.message
            : 'Failed to load operators.',
          'Error',
        );
      },
    });
  }

  onAccessOperatorChange(value: string): void {
    this.accessForm.operatorId = value;
    this.accessForm.userId = '';
    this.accessForm.busId = '';
    this.accessForm.routeIds = [];
    this.accessForm.allRoutes = false;
    this.loadingRoutes = false;
    this.routeStatuses = {};
    this.editingRouteId = null;
    this.accessAssignableUsers = [];
    this.accessBuses = [];
    this.accessRoutes = [];

    if (!value) {
      return;
    }

    const operatorId = Number(value);

    // Load buses belonging to the selected operator.
    this.loadingBuses = true;

    this.accessService.getOperatorBuses(operatorId).subscribe({
      next: (response) => {
        this.loadingBuses = false;

        this.accessBuses =
          (response.status === 1 || response.status === true) &&
          Array.isArray(response.data)
            ? response.data
            : [];
      },
      error: (error) => {
        this.loadingBuses = false;
        this.accessBuses = [];
        console.error('Failed to load buses:', error);

        this.notificationService.notify(
          'Failed to load buses for the selected operator.',
          'Error',
        );
      },
    });

    // Load users if a user type has already been selected.
    if (this.accessForm.userType) {
      this.loadAssignableUsers(operatorId, Number(this.accessForm.userType));
    }
  }

  onAccessUserTypeChange(value: string): void {
    this.accessForm.userType = value;
    this.accessForm.userId = '';
    this.accessAssignableUsers = [];

    if (!this.accessForm.operatorId || !value) {
      return;
    }

    this.loadAssignableUsers(Number(this.accessForm.operatorId), Number(value));
  }

  private loadAssignableUsers(operatorId: number, userType: number): void {
    this.loadingAssignableUsers = true;

    this.accessService.getAssignableUsers(operatorId, userType).subscribe({
      next: (response) => {
        this.loadingAssignableUsers = false;

        this.accessAssignableUsers =
          (response.status === 1 || response.status === true) &&
          Array.isArray(response.data)
            ? response.data
            : [];

        if (this.accessAssignableUsers.length === 0) {
          this.notificationService.notify(
            'No users found for this operator and user type.',
            'Error',
          );
        }
      },
      error: (error) => {
        this.loadingAssignableUsers = false;
        this.accessAssignableUsers = [];

        console.error('Failed to load assignable users:', error);

        this.notificationService.notify(
          'Failed to load users for the selected operator and user type.',
          'Error',
        );
      },
    });
  }

  onAccessBusChange(value: string): void {
    this.accessForm.busId = value;
    this.accessForm.routeIds = [];
    this.accessForm.allRoutes = false;
    this.accessRoutes = [];

    if (!value) {
      this.loadingRoutes = false;
      return;
    }

    this.loadingRoutes = true;

    this.accessService.getBusRoutes(Number(value)).subscribe({
      next: (response) => {
        this.loadingRoutes = false;

        if (
          (response.status === true || response.status === 1) &&
          Array.isArray(response.data)
        ) {
          this.accessRoutes = response.data;

          const updatedStatuses = { ...this.routeStatuses };

          this.accessRoutes.forEach((route) => {
            const id = Number(route.id);

            if (updatedStatuses[id] === undefined) {
              updatedStatuses[id] = 'Active';
            }
          });

          this.routeStatuses = updatedStatuses;
          this.editingRouteId = null;
        } else {
          this.accessRoutes = [];
          this.notificationService.notify(
            response.message || 'Unable to load routes for this bus.',
            'Error',
          );
        }
      },
      error: (error) => {
        this.loadingRoutes = false;
        this.accessRoutes = [];

        console.error('Failed to load bus routes:', error);

        this.notificationService.notify(
          error.error?.message || 'Failed to load routes for this bus.',
          'Error',
        );
      },
    });
  }

  onAccessUserChange(value: string): void {
    this.accessForm.userId = value;
  }

  resetAccessForm(): void {
    this.accessForm = this.getEmptyAccessForm();

    this.accessAssignableUsers = [];
    this.accessBuses = [];
    this.accessRoutes = [];

    this.routeStatuses = {};
    this.editingRouteId = null;
    this.loadingRoutes = false;

    this.editingAccessId = null;
  }

  onUserChange(userId: number | string | null): void {
    this.selectedUserId =
      userId === null || userId === '' ? null : Number(userId);

    this.selectedPermissionIds = [];

    if (this.selectedUserId === null) {
      return;
    }

    const existing = this.accessList.find(
      (item) => item.userId === this.selectedUserId,
    );

    if (this.demoMode || (existing && existing.demo)) {
      this.selectedPermissionIds = existing ? [...existing.permissionIds] : [];

      return;
    }

    this.loadingUserAccess = true;

    this.accessService.getUserPermissions(this.selectedUserId).subscribe({
      next: (response) => {
        this.loadingUserAccess = false;

        if (response.status === 1 && Array.isArray(response.data)) {
          this.selectedPermissionIds = response.data.map(Number);
        } else {
          this.notificationService.notify(
            response.message || 'Unable to load user permissions.',
            'Error',
          );
        }
      },
      error: (error) => {
        this.loadingUserAccess = false;
        console.error('Failed to load user permissions:', error);

        this.notificationService.notify(
          error.error?.message || 'Unable to load user permissions.',
          'Error',
        );
      },
    });
  }

  onSearchChange(value: string): void {
    this.searchText = value;
  }

  isPermissionSelected(permissionId: number): boolean {
    return this.selectedPermissionIds.includes(Number(permissionId));
  }

  togglePermission(permissionId: number, checked: boolean): void {
    const id = Number(permissionId);

    if (checked) {
      if (!this.selectedPermissionIds.includes(id)) {
        this.selectedPermissionIds = [...this.selectedPermissionIds, id];
      }
    } else {
      this.selectedPermissionIds = this.selectedPermissionIds.filter(
        (item) => item !== id,
      );
    }
  }

  selectAllPermissions(checked: boolean): void {
    this.selectedPermissionIds = checked
      ? this.permissions.map((permission) => Number(permission.id))
      : [];
  }

  clearPermissionSearch(): void {
    this.searchText = '';
  }

  resetForm(): void {
    this.selectedUserId = null;
    this.selectedPermissionIds = [];
    this.searchText = '';
  }

  saveAccess(): void {
    const form = this.accessForm;

    if (!form.fromDate || !form.toDate) {
      this.notificationService.notify(
        'Please select the validity dates.',
        'Error',
      );
      return;
    }

    if (form.toDate < form.fromDate) {
      this.notificationService.notify(
        'To Date must be on or after From Date.',
        'Error',
      );
      return;
    }

    if (!form.operatorId || !form.userType || !form.userId || !form.busId) {
      this.notificationService.notify(
        'Please select the operator, user type, user, and bus.',
        'Error',
      );
      return;
    }

    if (!form.routeIds.length) {
      this.notificationService.notify(
        'Please select at least one bus route.',
        'Error',
      );
      return;
    }

    const routeStatuses: {
      [routeId: number]: 'Active' | 'Inactive';
    } = {};

    form.routeIds.forEach((routeId) => {
      routeStatuses[routeId] = this.getRouteStatus(routeId);
    });

    this.saving = true;

    this.accessService
      .saveUserBusAccess({
        operator_id: Number(form.operatorId),
        user_type: Number(form.userType),
        user_id: Number(form.userId),
        bus_id: Number(form.busId),
        from_date: form.fromDate,
        to_date: form.toDate,
        route_ids: [...form.routeIds],
        route_statuses: routeStatuses,
      })
      .subscribe({
        next: (response) => {
          this.saving = false;

          if (response.status !== true && response.status !== 1) {
            this.notificationService.notify(
              response.message || 'Unable to save user access.',
              'Error',
            );
            return;
          }

          this.notificationService.notify(
            response.message || 'User access saved successfully.',
            'Success',
          );

          this.showAccessForm = false;
          this.resetAccessForm();
        },
        error: (error) => {
          this.saving = false;

          console.error('Failed to save user bus access:', error);

          this.notificationService.notify(
            error.error?.message || 'Unable to save user access.',
            'Error',
          );
        },
      });
  }

  private saveDemoAccess(user: AccessUser): void {
    this.upsertAccessRow(user);
    this.notificationService.notify(
      'Demo access updated locally. No database changes were made.',
      'Success',
    );
    this.showAccessForm = false;
    this.resetForm();
  }

  private upsertAccessRow(user: AccessUser): void {
    const permissionIds = [...this.selectedPermissionIds];
    const permissionNames = this.permissions
      .filter((permission) => permissionIds.includes(Number(permission.id)))
      .map((permission) => permission.name);

    const existingIndex = this.accessList.findIndex(
      (item) => item.userId === Number(user.id),
    );

    const row: UserAccessRow = {
      id:
        existingIndex >= 0
          ? this.accessList[existingIndex].id
          : Math.max(0, ...this.accessList.map((item) => item.id)) + 1,
      userId: Number(user.id),
      userName: user.name,
      clientId: String(user.client_id || user.id),
      email: this.getUserEmail(user),
      permissionIds,
      permissionNames,
      status: 'Active',
      updatedAt: new Date().toISOString().slice(0, 10),
      demo: this.demoMode,
    };

    if (existingIndex >= 0) {
      this.accessList = this.accessList.map((item, index) =>
        index === existingIndex ? row : item,
      );
    } else {
      this.accessList = [row, ...this.accessList];
    }

    this.currentPage = 1;
  }

  private getUserEmail(user: AccessUser): string {
    const item = user as AccessUser & { email?: string };

    return item.email || '—';
  }

  applyFilters(): void {
    this.currentPage = 1;
  }

  resetFilters(): void {
    this.filterSearch = '';
    this.filterUserId = '';
    this.filterStatus = '';
    this.pageSize = 10;
    this.currentPage = 1;
  }

  onPageSizeChange(value: string | number): void {
    this.pageSize = Number(value);
    this.currentPage = 1;
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  editAccess(item: UserAccessRow): void {
    this.showAccessForm = true;
    this.selectedUserId = item.userId;
    this.selectedPermissionIds = [...item.permissionIds];
    this.searchText = '';

    if (!this.users.some((user) => Number(user.id) === item.userId)) {
      this.users = [
        ...this.users,
        {
          id: item.userId,
          name: item.userName,
          client_id: item.clientId,
        } as AccessUser,
      ];
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  viewAccess(item: UserAccessRow): void {
    this.viewingAccess = item;
  }

  getInitials(name: string): string {
    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('');
  }

  exportAccessCsv(): void {
    const rows = this.filteredAccessList;

    if (rows.length === 0) {
      this.notificationService.notify(
        'No records available to export.',
        'Error',
      );
      return;
    }

    const headers = [
      'User',
      'Client ID',
      'Email',
      'Permissions',
      'Permission Count',
      'Status',
      'Last Updated',
    ];

    const escapeCsv = (value: unknown): string =>
      '"' + String(value ?? '').replace(/"/g, '""') + '"';

    const csv = [
      headers.map(escapeCsv).join(','),
      ...rows.map((item) =>
        [
          item.userName,
          item.clientId,
          item.email,
          item.permissionNames.join('; '),
          item.permissionNames.length,
          item.status,
          item.updatedAt,
        ]
          .map(escapeCsv)
          .join(','),
      ),
    ].join('\r\n');

    const blob = new Blob(['\uFEFF' + csv], {
      type: 'text/csv;charset=utf-8;',
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');

    anchor.href = url;
    anchor.download = 'user-access-list.csv';
    anchor.click();

    URL.revokeObjectURL(url);
  }

  get allRoutesSelected(): boolean {
    return (
      this.accessRoutes.length > 0 &&
      this.accessRoutes.every((route) =>
        this.accessForm.routeIds.includes(Number(route.id)),
      )
    );
  }

  get someRoutesSelected(): boolean {
    return this.accessForm.routeIds.length > 0 && !this.allRoutesSelected;
  }

  isRouteSelected(routeId: number): boolean {
    return this.accessForm.routeIds.includes(Number(routeId));
  }

  toggleRoute(routeId: number, checked: boolean): void {
    const id = Number(routeId);

    if (checked) {
      if (!this.accessForm.routeIds.includes(id)) {
        this.accessForm.routeIds = [...this.accessForm.routeIds, id];
      }
    } else {
      this.accessForm.routeIds = this.accessForm.routeIds.filter(
        (route) => route !== id,
      );
    }

    this.accessForm.allRoutes = this.allRoutesSelected;
  }

  toggleAllRoutes(checked: boolean): void {
    this.accessForm.routeIds = checked
      ? this.accessRoutes.map((route) => Number(route.id))
      : [];

    this.accessForm.allRoutes = checked;
  }

  onAccessRouteChange(routeId: string): void {
    // Optional compatibility if this method is used elsewhere.
    this.accessForm.routeIds = routeId ? [Number(routeId)] : [];
    this.accessForm.allRoutes = this.allRoutesSelected;
  }

  getRouteStatus(routeId: number): RouteStatus {
    return this.routeStatuses[Number(routeId)] || 'Active';
  }

  setRouteStatus(routeId: number, status: RouteStatus): void {
    this.routeStatuses = {
      ...this.routeStatuses,
      [Number(routeId)]: status,
    };
  }

  setAllRouteStatuses(status: RouteStatus): void {
    const updated = { ...this.routeStatuses };

    this.accessRoutes.forEach((route) => {
      updated[Number(route.id)] = status;
    });

    this.routeStatuses = updated;
  }

  get activeRouteCount(): number {
    return this.accessRoutes.filter(
      (route) => this.getRouteStatus(route.id) === 'Active',
    ).length;
  }

  get inactiveRouteCount(): number {
    return this.accessRoutes.filter(
      (route) => this.getRouteStatus(route.id) === 'Inactive',
    ).length;
  }

  editRoute(routeId: number): void {
    this.editingRouteId = Number(routeId);

    const element = document.getElementById('route-row-' + Number(routeId));

    element?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    });
  }

  loadSavedAssignments(): void {
    this.loadingAssignments = true;

    this.accessService
      .getUserBusAccessList({
        search: this.filterSearch,
        status:
          this.filterStatus === 'Active'
            ? '1'
            : this.filterStatus === 'Inactive'
              ? '0'
              : '',
        user_id: this.filterUserId ? Number(this.filterUserId) : undefined,
      })
      .subscribe({
        next: (response) => {
          this.loadingAssignments = false;

          this.savedAssignments =
            (response.status === true || response.status === 1) &&
            Array.isArray(response.data)
              ? response.data
              : [];

          this.currentPage = 1;
        },
        error: (error) => {
          this.loadingAssignments = false;
          this.savedAssignments = [];

          console.error('Failed to load saved assignments:', error);

          this.notificationService.notify(
            error.error?.message || 'Unable to load saved assignments.',
            'Error',
          );
        },
      });
  }

  getAssignmentStatus(status: number): string {
    return Number(status) === 1 ? 'Active' : 'Inactive';
  }

  toggleAssignmentStatus(item: SavedBusAssignment): void {
    const newStatus: 0 | 1 = Number(item.status) === 1 ? 0 : 1;

    this.accessService
      .updateUserBusAssignmentStatus(item.id, newStatus)
      .subscribe({
        next: (response) => {
          if (response.status !== true && response.status !== 1) {
            this.notificationService.notify(
              response.message || 'Unable to update assignment status.',
              'Error',
            );
            return;
          }

          item.status = newStatus;
          item.status_label = newStatus === 1 ? 'Active' : 'Inactive';

          this.notificationService.notify(
            `Assignment ${item.status_label.toLowerCase()} successfully.`,
            'Success',
          );
        },
        error: (error) => {
          console.error('Assignment status update failed:', error);

          this.notificationService.notify(
            error.error?.message || 'Unable to update assignment status.',
            'Error',
          );
        },
      });
  }

  viewAssignment(item: SavedBusAssignment): void {
    this.viewingAssignment = item;
  }

  editAssignment(item: SavedBusAssignment): void {
    this.editingAccessId = Number(item.id);
    this.showAccessForm = true;

    // Clear old edit state before loading this assignment.
    this.accessAssignableUsers = [];
    this.accessBuses = [];
    this.accessRoutes = [];
    this.routeStatuses = {};
    this.editingRouteId = null;

    // Restore basic saved values.
    this.accessForm = {
      fromDate: item.valid_from ? item.valid_from.substring(0, 10) : '',
      toDate: item.valid_until ? item.valid_until.substring(0, 10) : '',
      operatorId: String(item.bus_operator_id),
      userType: String(item.role_type),
      userId: String(item.user_id),
      busId: String(item.bus_id),
      routeIds: [],
      allRoutes: Number(item.route_access) === 1,
    };

    // Routes saved against this assignment.
    const savedRoutes = Array.isArray(item.routes) ? item.routes : [];

    const selectedRouteIds = savedRoutes
      .filter((route) => Number(route.route_status) === 1)
      .map((route) => Number(route.ticket_price_id));

    // Only active saved routes are checked.
    this.accessForm.routeIds = selectedRouteIds;

    // Preserve each saved route's active/inactive status.
    savedRoutes.forEach((route) => {
      this.routeStatuses[Number(route.ticket_price_id)] =
        Number(route.route_status) === 1 ? 'Active' : 'Inactive';
    });

    const operatorId = Number(item.bus_operator_id);
    const userType = Number(item.role_type);
    const userId = Number(item.user_id);
    const busId = Number(item.bus_id);

    // Load users for this operator and role.
    this.loadingAssignableUsers = true;

    this.accessService.getAssignableUsers(operatorId, userType).subscribe({
      next: (response) => {
        this.accessAssignableUsers =
          (response.status === true || response.status === 1) &&
          Array.isArray(response.data)
            ? response.data
            : [];

        // Restore the selected user after options load.
        this.accessForm.userId = String(userId);
        this.loadingAssignableUsers = false;
      },
      error: (error) => {
        console.error('Unable to load users for editing:', error);
        this.loadingAssignableUsers = false;
        this.notificationService.notify(
          'Unable to load users for this assignment.',
          'Error',
        );
      },
    });

    // Load buses for this operator.
    this.loadingBuses = true;

    this.accessService.getOperatorBuses(operatorId).subscribe({
      next: (response) => {
        this.accessBuses =
          (response.status === true || response.status === 1) &&
          Array.isArray(response.data)
            ? response.data
            : [];

        // Restore the selected bus after options load.
        this.accessForm.busId = String(busId);
        this.loadingBuses = false;
      },
      error: (error) => {
        console.error('Unable to load buses for editing:', error);
        this.loadingBuses = false;
        this.notificationService.notify(
          'Unable to load buses for this assignment.',
          'Error',
        );
      },
    });

    // Load routes for the saved bus and restore statuses/selections.
    this.loadingRoutes = true;

    this.accessService.getBusRoutes(busId).subscribe({
      next: (response) => {
        const routes =
          (response.status === true || response.status === 1) &&
          Array.isArray(response.data)
            ? response.data
            : [];

        this.accessRoutes = routes;

        // Use saved route statuses; default new/unmatched routes to Active.
        const statuses: { [routeId: number]: RouteStatus } = {};

        routes.forEach((route) => {
          const routeId = Number(route.id);
          const saved = savedRoutes.find(
            (item) => Number(item.ticket_price_id) === routeId,
          );

          statuses[routeId] = saved
            ? Number(saved.route_status) === 1
              ? 'Active'
              : 'Inactive'
            : 'Active';
        });

        this.routeStatuses = statuses;

        // Check only routes that were saved as Active.
        this.accessForm.routeIds = savedRoutes
          .filter((route) => Number(route.route_status) === 1)
          .map((route) => Number(route.ticket_price_id))
          .filter((id) => routes.some((route) => Number(route.id) === id));

        this.accessForm.allRoutes =
          routes.length > 0 &&
          routes.every((route) =>
            this.accessForm.routeIds.includes(Number(route.id)),
          );

        this.loadingRoutes = false;
      },
      error: (error) => {
        console.error('Unable to load routes for editing:', error);
        this.loadingRoutes = false;
        this.notificationService.notify(
          'Unable to load routes for this assignment.',
          'Error',
        );
      },
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onFilterOperatorChange(): void {
    this.filterUserId = '';
    this.filterUsers = [];

    if (this.filterOperatorId && this.filterUserType) {
      this.loadFilterUsers();
    }
  }

  onFilterUserTypeChange(): void {
    this.filterUserId = '';
    this.filterUsers = [];

    if (this.filterOperatorId && this.filterUserType) {
      this.loadFilterUsers();
    }
  }

  loadFilterUsers(): void {
    const operatorId = Number(this.filterOperatorId);
    const userType = Number(this.filterUserType);

    if (!operatorId || !userType) {
      this.filterUsers = [];
      return;
    }

    this.loadingFilterUsers = true;

    this.accessService.getAssignableUsers(operatorId, userType).subscribe({
      next: (response) => {
        this.filterUsers =
          response.status === true || response.status === 1
            ? response.data || []
            : [];

        this.loadingFilterUsers = false;
      },
      error: (error) => {
        console.error('Unable to load filter users:', error);
        this.filterUsers = [];
        this.loadingFilterUsers = false;
      },
    });
  }

  applyAssignmentFilters(): void {
    this.currentPage = 1;
    this.loadSavedAssignments();
  }

  resetAssignmentFilters(): void {
    this.filterSearch = '';
    this.filterOperatorId = '';
    this.filterUserType = '';
    this.filterUserId = '';
    this.filterStatus = '';
    this.filterFromDate = '';
    this.filterToDate = '';

    this.filterUsers = [];
    this.currentPage = 1;
    this.pageSize = 10;

    this.loadSavedAssignments();
  }

  onAssignmentPageSizeChange(): void {
    this.currentPage = 1;
  }

  get filteredSavedAssignments(): SavedBusAssignment[] {
    const search = this.filterSearch.trim().toLowerCase();

    return this.savedAssignments.filter((item) => {
      const matchesSearch =
        !search ||
        (item.operator_name || '').toLowerCase().includes(search) ||
        (item.user_name || '').toLowerCase().includes(search) ||
        (item.client_id || '').toLowerCase().includes(search) ||
        (item.bus_name || '').toLowerCase().includes(search) ||
        (item.bus_number || '').toLowerCase().includes(search);

      const matchesOperator =
        !this.filterOperatorId ||
        Number(item.bus_operator_id) === Number(this.filterOperatorId);

      const matchesUserType =
        !this.filterUserType ||
        Number(item.role_type) === Number(this.filterUserType);

      const matchesUser =
        !this.filterUserId ||
        Number(item.user_id) === Number(this.filterUserId);

      const matchesStatus =
        !this.filterStatus ||
        (this.filterStatus === 'Active'
          ? Number(item.status) === 1
          : Number(item.status) === 0);

      const validFrom = item.valid_from ? item.valid_from.substring(0, 10) : '';

      const validUntil = item.valid_until
        ? item.valid_until.substring(0, 10)
        : '';

      const matchesFromDate =
        !this.filterFromDate ||
        (!!validFrom && validFrom >= this.filterFromDate);

      const matchesToDate =
        !this.filterToDate || (!!validUntil && validUntil <= this.filterToDate);

      return (
        matchesSearch &&
        matchesOperator &&
        matchesUserType &&
        matchesUser &&
        matchesStatus &&
        matchesFromDate &&
        matchesToDate
      );
    });
  }

  get paginatedSavedAssignments(): SavedBusAssignment[] {
    const rows = this.filteredSavedAssignments;

    const start = (this.currentPage - 1) * this.pageSize;

    return rows.slice(start, start + this.pageSize);
  }

  get assignmentTotalPages(): number {
    return Math.max(
      1,
      Math.ceil(this.filteredSavedAssignments.length / this.pageSize),
    );
  }

  get assignmentStartRecord(): number {
    return this.filteredSavedAssignments.length
      ? (this.currentPage - 1) * this.pageSize + 1
      : 0;
  }

  get assignmentEndRecord(): number {
    return Math.min(
      this.currentPage * this.pageSize,
      this.filteredSavedAssignments.length,
    );
  }

  get assignmentPageNumbers(): number[] {
    return Array.from(
      { length: this.assignmentTotalPages },
      (_, index) => index + 1,
    );
  }

  goToAssignmentPage(page: number): void {
    if (page >= 1 && page <= this.assignmentTotalPages) {
      this.currentPage = page;
    }
  }

  isBusUnavailable(busId: number | string): boolean {
    const roleType = Number(this.accessForm.userType);
    const bus = Number(busId);

    // Agents can share buses.
    if (roleType !== 7 && roleType !== 8) {
      return false;
    }

    // When editing, exclude the current assignment.
    return this.savedAssignments.some(
      (assignment) =>
        Number(assignment.bus_id) === bus &&
        Number(assignment.role_type) === roleType &&
        Number(assignment.status) === 1 &&
        Number(assignment.id) !== Number(this.editingAccessId),
    );
  }

  getBusUnavailableReason(busId: number | string): string {
    const roleType = Number(this.accessForm.userType);

    if (!this.isBusUnavailable(busId)) {
      return '';
    }

    return roleType === 7
      ? 'A conductor is already assigned to this bus'
      : 'A manager is already assigned to this bus';
  }
  
}
