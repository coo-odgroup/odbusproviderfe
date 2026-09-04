import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { Constants } from 'src/app/constant/constant';
import { NotificationService } from '../../services/notification.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-agentfaq',
  templateUrl: './agentfaq.component.html',
  styleUrls: ['./agentfaq.component.scss'],
})


export class AgentfaqComponent implements OnInit {
  public addForm: FormGroup;
  public editForm: FormGroup;
  public searchForm: FormGroup;
  public modalReference: NgbModalRef = null;
  public faqs: any[] = [];
  public categoryTypes: any[] = [];
  public addCategories: any[] = [];
  public editCategories: any[] = [];
  r;
  public filterCategories: any[] = [];
  public pagination: any = {};
  public editId: number = null;
  public modalHeading: string = 'Add Agent FAQ';
  public modalButton: string = 'Save';
  public isSubmit: boolean = false;
  public path = Constants.BASE_URL + '/';
  public fileName = 'Agent-FAQ.xlsx';
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    this.createAddForm();
    this.createEditForm();
    this.createSearchForm();
    this.loadCategoryTypes();
    this.loadFaqs();
  }

  private createAddForm(): void {
    this.addForm = this.fb.group({
      id: [null],
      category_type: ['', Validators.required],
      category_id: ['', Validators.required],
      faq_name: ['', Validators.required],
      question: ['', Validators.required],
      answer: ['', Validators.required],
    });
  }

  private createEditForm(): void {
    this.editForm = this.fb.group({
      id: [null],

      category_type: ['', Validators.required],
      category_id: ['', Validators.required],
      faq_name: ['', Validators.required],
      question: ['', Validators.required],
      answer: ['', Validators.required],
    });
  }

  private createSearchForm(): void {
    this.searchForm = this.fb.group({
      category_type: [''],
      category_id: [''],
      faq_search: [''],
      rows_number: ['10'],
    });
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

  private loadCategoryTypes(): void {
    this.http.post(this.path + 'getAgentFaqCategoryTypes', {}).subscribe(
      (response: any) => {
        if (response && response.status === true) {
          this.categoryTypes = response.data || [];
        } else {
          this.categoryTypes = [];
        }
      },

      (error) => {
        console.error('Category types error:', error);
        this.categoryTypes = [];
      },
    );
  }
  private getCategoriesByType(
    type: any,
    target: 'add' | 'edit' | 'filter',
  ): void {
    if (!type) {
      if (target === 'add') {
        this.addCategories = [];
      }

      if (target === 'edit') {
        this.editCategories = [];
      }

      if (target === 'filter') {
        this.filterCategories = [];
      }

      return;
    }

    this.http
      .post(this.path + 'getAgentFaqCategoriesByType', {
        type: type,
      })
      .subscribe(
        (response: any) => {
          const categories =
            response && response.status === true ? response.data || [] : [];

          if (target === 'add') {
            this.addCategories = categories;
          }

          if (target === 'edit') {
            this.editCategories = categories;
          }

          if (target === 'filter') {
            this.filterCategories = categories;
          }
        },

        (error) => {
          console.error('Categories error:', error);

          if (target === 'add') {
            this.addCategories = [];
          }

          if (target === 'edit') {
            this.editCategories = [];
          }

          if (target === 'filter') {
            this.filterCategories = [];
          }
        },
      );
  }

  onAddCategoryTypeChange(event: any): void {
    const type = event.target.value;

    this.addForm.patchValue({
      category_type: type,

      category_id: '',
    });

    this.addCategories = [];

    if (!type) {
      return;
    }

    this.getCategoriesByType(type, 'add');
  }
  onAddCategoryChange(event: any): void {
    this.addForm.patchValue({
      category_id: event.target.value,
    });
  }

  openAddModal(content: any): void {
    this.editId = null;
    this.modalHeading = 'Add Agent FAQ';
    this.modalButton = 'Save';
    this.addForm.reset({
      id: null,

      category_type: '',

      category_id: '',

      faq_name: '',

      question: '',

      answer: '',
    });

    this.addCategories = [];

    this.modalReference = this.modalService.open(content, {
      size: 'xl',
      centered: true,
      backdrop: 'static',
    });
  }

  // =========================================================
  // SAVE / ADD FAQ
  // =========================================================

  saveFaq(): void {
    this.isSubmit = true;

    // Make sure Angular sees the current values
    this.addForm.updateValueAndValidity();

    if (this.addForm.invalid) {
      this.addForm.markAllAsTouched();

      return;
    }

    const data = this.addForm.value;

    const userId = this.getLoggedInUserId();

    const payload = {
      type_id: Number(data.category_type),

      category_id: Number(data.category_id),

      faq_name: data.faq_name,

      question: data.question,

      answer: data.answer,

      status: 1,

      created_by: userId,
    };

    this.spinner.show();

    this.http.post(this.path + 'addAgentFaq', payload).subscribe(
      (response: any) => {
        this.spinner.hide();

        if (response && response.status === true) {
          this.notificationService.addToast({
            title: Constants.SuccessTitle,

            msg: response.message || 'Agent FAQ added successfully',

            type: Constants.SuccessType,
          });

          this.modalService.dismissAll();

          this.resetAddForm();

          this.loadFaqs();
        } else {
          this.notificationService.addToast({
            title: Constants.ErrorTitle,

            msg: response.message || 'Unable to add Agent FAQ',

            type: Constants.ErrorType,
          });
        }
      },

      (error) => {
        this.spinner.hide();

        console.error('Add FAQ error:', error);

        this.notificationService.addToast({
          title: Constants.ErrorTitle,

          msg:
            error && error.error && error.error.message
              ? error.error.message
              : 'Unable to add Agent FAQ',

          type: Constants.ErrorType,
        });
      },
    );
  }

  // =========================================================
  // RESET ADD FORM
  // =========================================================

  private resetAddForm(): void {
    this.addForm.reset({
      id: null,

      category_type: '',

      category_id: '',

      faq_name: '',

      question: '',

      answer: '',
    });

    this.addCategories = [];

    this.isSubmit = false;
  }

  // =========================================================
  // EDIT FAQ
  // =========================================================

  editFaq(id: any, content: any): void {
    const faqId = Number(id);

    if (!faqId) {
      this.notificationService.addToast({
        title: Constants.ErrorTitle,

        msg: 'Invalid FAQ ID',

        type: Constants.ErrorType,
      });

      return;
    }

    this.spinner.show();

    // -------------------------------------------------------
    // IMPORTANT:
    // Reset ONLY edit form.
    // Add form is never touched.
    // -------------------------------------------------------

    this.editForm.reset({
      id: null,

      category_type: '',

      category_id: '',

      faq_name: '',

      question: '',

      answer: '',
    });

    this.editCategories = [];

    // -------------------------------------------------------
    // GET FAQ
    // -------------------------------------------------------

    this.http.post(this.path + 'getAgentFaq/' + faqId, {}).subscribe(
      (response: any) => {
        if (!response || response.status !== true || !response.data) {
          this.spinner.hide();

          this.notificationService.addToast({
            title: Constants.ErrorTitle,

            msg:
              response && response.message
                ? response.message
                : 'Unable to load Agent FAQ',

            type: Constants.ErrorType,
          });

          return;
        }

        const faq = response.data;

        console.log('EDIT FAQ DATA:', faq);

        this.editId = Number(faq.id);

        // ---------------------------------------------------
        // PUT ALL DATABASE VALUES INTO EDIT FORM
        // ---------------------------------------------------

        this.editForm.patchValue({
          id: faq.id,

          category_type: String(faq.type_id),

          category_id: String(faq.category_id),

          faq_name: faq.faq_name || '',

          question: faq.question || '',

          answer: faq.answer || '',
        });

        console.log('EDIT FORM AFTER PATCH:', this.editForm.value);

        // ---------------------------------------------------
        // LOAD EDIT CATEGORIES
        // ---------------------------------------------------

        this.http
          .post(
            this.path + 'getAgentFaqCategoriesByType',

            {
              type: faq.type_id,
            },
          )
          .subscribe(
            (categoryResponse: any) => {
              if (categoryResponse && categoryResponse.status === true) {
                this.editCategories = categoryResponse.data || [];
              } else {
                this.editCategories = [];
              }

              // Re-apply category after list arrives
              this.editForm.patchValue({
                category_id: String(faq.category_id),
              });

              this.editForm.updateValueAndValidity();

              console.log('FINAL EDIT FORM:', this.editForm.value);

              this.openEditModal(content);
            },

            (categoryError) => {
              console.error('Edit categories error:', categoryError);

              // Even if categories fail,
              // keep FAQ data in form.
              this.editCategories = [];

              this.editForm.patchValue({
                category_id: String(faq.category_id),
              });

              this.editForm.updateValueAndValidity();

              this.openEditModal(content);
            },
          );
      },

      (error) => {
        this.spinner.hide();

        console.error('Get FAQ error:', error);

        this.notificationService.addToast({
          title: Constants.ErrorTitle,

          msg:
            error && error.error && error.error.message
              ? error.error.message
              : 'Unable to load Agent FAQ',

          type: Constants.ErrorType,
        });
      },
    );
  }

  // =========================================================
  // OPEN EDIT MODAL
  // =========================================================

  private openEditModal(content: any): void {
    this.modalHeading = 'Edit Agent FAQ';

    this.modalButton = 'Update';

    this.isSubmit = false;

    this.spinner.hide();

    this.modalReference = this.modalService.open(content, {
      size: 'xl',
      centered: true,
      backdrop: 'static',
    });
  }

  // =========================================================
  // EDIT - CATEGORY TYPE CHANGE
  // =========================================================

  onEditCategoryTypeChange(event: any): void {
    const type = event.target.value;

    this.editForm.patchValue({
      category_type: type,

      category_id: '',
    });

    this.editCategories = [];

    if (!type) {
      return;
    }

    this.getCategoriesByType(type, 'edit');
  }

  // =========================================================
  // EDIT - CATEGORY CHANGE
  // =========================================================

  onEditCategoryChange(event: any): void {
    this.editForm.patchValue({
      category_id: event.target.value,
    });
  }

  // =========================================================
  // UPDATE FAQ
  // =========================================================

  updateFaq(): void {
    this.isSubmit = true;

    this.editForm.updateValueAndValidity();

    console.log('UPDATE FORM:', this.editForm.value);

    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();

      return;
    }

    if (!this.editId) {
      this.notificationService.addToast({
        title: Constants.ErrorTitle,

        msg: 'Invalid FAQ ID',

        type: Constants.ErrorType,
      });

      return;
    }

    const data = this.editForm.value;

    const userId = this.getLoggedInUserId();

    const payload = {
      type_id: Number(data.category_type),

      category_id: Number(data.category_id),

      faq_name: data.faq_name,

      question: data.question,

      answer: data.answer,

      status: 1,

      updated_by: userId,
    };

    console.log('UPDATE PAYLOAD:', payload);

    this.spinner.show();

    this.http
      .post(
        this.path + 'updateAgentFaq/' + this.editId,

        payload,
      )
      .subscribe(
        (response: any) => {
          this.spinner.hide();

          if (response && response.status === true) {
            this.notificationService.addToast({
              title: Constants.SuccessTitle,

              msg: response.message || 'Agent FAQ updated successfully',

              type: Constants.SuccessType,
            });

            this.modalService.dismissAll();

            this.editId = null;

            this.editForm.reset({
              id: null,

              category_type: '',

              category_id: '',

              faq_name: '',

              question: '',

              answer: '',
            });

            this.editCategories = [];

            this.isSubmit = false;

            this.loadFaqs();
          } else {
            this.notificationService.addToast({
              title: Constants.ErrorTitle,

              msg: response.message || 'Unable to update Agent FAQ',

              type: Constants.ErrorType,
            });
          }
        },

        (error) => {
          this.spinner.hide();

          console.error('Update FAQ error:', error);

          this.notificationService.addToast({
            title: Constants.ErrorTitle,

            msg:
              error && error.error && error.error.message
                ? error.error.message
                : 'Unable to update Agent FAQ',

            type: Constants.ErrorType,
          });
        },
      );
  }

  // =========================================================
  // LOAD FAQ LIST
  // =========================================================

  loadFaqs(pageUrl: string = ''): void {
    this.spinner.show();

    const payload = {
      category_type: this.searchForm.get('category_type').value,

      category_id: this.searchForm.get('category_id').value,

      faq_search: this.searchForm.get('faq_search').value,

      rows_number: this.searchForm.get('rows_number').value,
    };

    const request = pageUrl
      ? this.http.post(pageUrl, payload)
      : this.http.post(this.path + 'getAgentFaqs', payload);

    request.subscribe(
      (response: any) => {
        this.spinner.hide();

        if (response && response.status === true) {
          this.faqs =
            response.data && response.data.data ? response.data.data : [];

          this.pagination = response.data || {};
        } else {
          this.faqs = [];

          this.pagination = {};
        }
      },

      (error) => {
        this.spinner.hide();

        console.error('Load FAQ list error:', error);

        this.faqs = [];

        this.pagination = {};
      },
    );
  }

  // =========================================================
  // SEARCH
  // =========================================================

  search(): void {
    this.loadFaqs();
  }

  // =========================================================
  // RESET FILTERS
  // =========================================================

  resetFilters(): void {
    this.searchForm.reset({
      category_type: '',

      category_id: '',

      faq_search: '',

      rows_number: '10',
    });

    this.filterCategories = [];

    this.loadFaqs();
  }

  // =========================================================
  // FILTER TYPE CHANGE
  // =========================================================

  onFilterCategoryTypeChange(event: any): void {
    const type = event.target.value;

    this.searchForm.patchValue({
      category_type: type,

      category_id: '',
    });

    this.filterCategories = [];

    if (!type) {
      this.search();

      return;
    }

    this.getCategoriesByType(type, 'filter');

    this.search();
  }

  // =========================================================
  // FILTER CATEGORY CHANGE
  // =========================================================

  onFilterCategoryChange(event: any): void {
    this.searchForm.patchValue({
      category_id: event.target.value,
    });

    this.search();
  }

  // =========================================================
  // SEARCH TEXT
  // =========================================================

  onSearchInput(event: any): void {
    this.searchForm.patchValue({
      faq_search: event.target.value,
    });
  }

  // =========================================================
  // ROW COUNT
  // =========================================================

  onRowsChange(event: any): void {
    this.searchForm.patchValue({
      rows_number: event.target.value,
    });

    this.loadFaqs();
  }

  // =========================================================
  // STATUS
  // =========================================================

  changeStatus(faq: any): void {
    if (!faq || !faq.id) {
      return;
    }

    const userId = this.getLoggedInUserId();

    this.http
      .post(
        this.path + 'changeAgentFaqStatus/' + faq.id,

        {
          updated_by: userId,
        },
      )
      .subscribe(
        (response: any) => {
          if (response && response.status === true) {
            faq.status = Number(response.data.status);

            this.notificationService.addToast({
              title: Constants.SuccessTitle,

              msg: response.message || 'FAQ status changed successfully',

              type: Constants.SuccessType,
            });
          } else {
            this.notificationService.addToast({
              title: Constants.ErrorTitle,

              msg: response.message || 'Unable to change FAQ status',

              type: Constants.ErrorType,
            });
          }
        },

        (error) => {
          console.error('Status change error:', error);

          this.notificationService.addToast({
            title: Constants.ErrorTitle,

            msg:
              error && error.error && error.error.message
                ? error.error.message
                : 'Unable to change FAQ status',

            type: Constants.ErrorType,
          });
        },
      );
  }

  // =========================================================
  // PAGINATION
  // =========================================================

  goToPage(url: string): void {
    if (!url) {
      return;
    }

    this.loadFaqs(url);
  }

  // =========================================================
  // PAGINATION LABEL
  // =========================================================

  page(label: string): string {
    if (!label) {
      return '';
    }

    return label.replace('&laquo;', '«').replace('&raquo;', '»');
  }

  // =========================================================
  // REFRESH
  // =========================================================

  refresh(): void {
    this.resetFilters();
  }

  // =========================================================
  // EXPORT EXCEL
  // =========================================================

  exportexcel(): void {
    const element = document.getElementById('faq-table');

    if (!element) {
      return;
    }

    const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    const workbook: XLSX.WorkBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Agent FAQ');

    XLSX.writeFile(workbook, this.fileName);
  }
}
