import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { Constants } from 'src/app/constant/constant';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotificationService } from '../../services/notification.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-agentfaq',
  templateUrl: './agentfaq.component.html',
  styleUrls: ['./agentfaq.component.scss'],
})
export class AgentfaqComponent implements OnInit {
  public form: FormGroup;
  public searchForm: FormGroup;
  modalReference: NgbModalRef;
  public ModalHeading: string = 'Add Agent FAQ';
  public ModalBtn: string = 'Save';
  public isSubmit: boolean = false;

  faqs: any[] = [];
  categoryTypes: any[] = [];
  categories: any[] = [];
  pagination: any = {};

  all: any = {
    count: 0,
    total: 0,
  };

  path = Constants.BASE_URL + '/';
  editId: any = null;

  constructor(
    private spinner: NgxSpinnerService,
    private http: HttpClient,
    private notificationService: NotificationService,
    private fb: FormBuilder,
    private modalService: NgbModal,
  ) {}

  ngOnInit(): void {
    this.form = this.createForm();

    this.searchForm = this.fb.group({
      category_type: [''],
      category_id: [''],
      faq_search: [''],
      rows_number: ['10'],
    });

    this.getCategoryTypes();
    this.getAll();
  }

  createForm(): FormGroup {
    return this.fb.group({
      id: [null],
      category_type: ['', Validators.required],
      category_id: ['', Validators.required],
      faq_name: ['', Validators.required],
      question: ['', Validators.required],
      answer: ['', Validators.required],
    });
  }

  private getLoggedInUserId(): number | null {
    const sessionUserId = sessionStorage.getItem('USERID');
    const localUserId = localStorage.getItem('USERID');
    const userRecords = localStorage.getItem('USERRECORDS');
    let raw: any = sessionUserId || localUserId;
    if (!raw && userRecords) {
      try {
        const user = JSON.parse(userRecords);

        raw = user && user.id ? user.id : null;
      } catch (e) {
        raw = null;
      }
    }

    const id = Number(raw);

    return id > 0 ? id : null;
  }

  getCategoryTypes(): void {
    this.http.get(this.path + 'getAgentFaqCategoryTypes').subscribe(
      (response: any) => {
        console.log('FAQ category types response:', response);

        if (response && response.status === true) {
          this.categoryTypes = response.data || [];
        } else {
          this.categoryTypes = [];
        }
      },

      (error) => {
        console.error('Get FAQ category types error:', error);

        this.categoryTypes = [];
      },
    );
  }

  onCategoryTypeChange(event: any): void {
    const type = event.target.value;

    console.log('Selected Category Type:', type);

    this.form.patchValue({
      category_type: type,
      category_id: null,
    });

    this.form.get('category_type').markAsTouched();
    this.form.get('category_id').markAsUntouched();

    this.categories = [];

    if (!type) {
      return;
    }

    this.getCategoriesByType(type);
  }

  onCategoryChange(event: any): void {
    const categoryId = event.target.value;

    console.log('Selected Category ID:', categoryId);

    this.form.get('category_id').setValue(categoryId);
    this.form.get('category_id').markAsTouched();

    console.log('Category control value:', this.form.get('category_id').value);
  }

  getCategoriesByType(type: any): void {
    this.http
      .get(
        this.path + 'getAgentFaqCategoriesByType/' + encodeURIComponent(type),
      )
      .subscribe(
        (response: any) => {
          console.log('FAQ categories response:', response);

          if (response && response.status === true) {
            this.categories = response.data || [];
          } else {
            this.categories = [];
          }
        },

        (error) => {
          console.error('Get FAQ categories error:', error);

          this.categories = [];
        },
      );
  }

  openAddModal(content: any): void {
    this.editId = null;
    this.ModalHeading = 'Add Agent FAQ';
    this.ModalBtn = 'Save';
    this.form = this.createForm();
    this.categories = [];
    this.modalReference = this.modalService.open(content, {
      size: 'xl',
      centered: true,
      backdrop: 'static',
    });
  }

  saveFaq(): void {
    console.log('========== SAVE ==========');

    console.log('category_type:', this.form.get('category_type').value);

    console.log('category_id:', this.form.get('category_id').value);

    console.log('faq_name:', this.form.get('faq_name').value);

    console.log('question:', this.form.get('question').value);

    console.log('answer:', this.form.get('answer').value);

    console.log('FORM VALID:', this.form.valid);

    console.log('FORM:', this.form.value);

    if (this.form.invalid) {
      this.form.markAllAsTouched();

      Object.keys(this.form.controls).forEach((key) => {
        const control = this.form.get(key);

        console.log(key, 'value:', control.value, 'errors:', control.errors);
      });

      return;
    }

    console.log('FORM VALID - ADDING FAQ');

    this.spinner.show();

    const data = this.form.value;
    const userId = this.getLoggedInUserId();

    const payload: any = {
      type_id: Number(data.category_type),
      category_id: Number(data.category_id),
      faq_name: data.faq_name,
      question: data.question,
      answer: data.answer,
      status: 1,
      created_by: userId,
      updated_by: userId,
    };

    console.log('PAYLOAD:', payload);

    this.http.post(this.path + 'addAgentFaq', payload).subscribe(
      (response: any) => {
        this.spinner.hide();

        console.log('Add FAQ response:', response);

        if (response && response.status === true) {
          this.notificationService.addToast({
            title: Constants.SuccessTitle,
            msg: response.message || 'Agent FAQ added successfully',
            type: Constants.SuccessType,
          });

          this.modalService.dismissAll();

          this.ResetAttributes();

          this.getAll();
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

        console.error('Add Agent FAQ error:', error);

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

  editFaq(id: any, content: any): void {
    this.spinner.show();
    this.editId = Number(id);
    this.ModalHeading = 'Edit Agent FAQ';
    this.ModalBtn = 'Update';
    this.http.get(this.path + 'getAgentFaq/' + id).subscribe(
      (response: any) => {
        this.spinner.hide();

        console.log('Edit FAQ response:', response);

        if (response && response.status === true) {
          const data = response.data;

          /*
           * First load categories
           * belonging to this type.
           */
          this.getCategoriesByType(data.category_type);

          /*
           * Patch form
           */
          this.form = this.fb.group({
            id: [data.id],
            category_type: [data.category_type, Validators.required],
            category_id: [data.category_id, Validators.required],
            faq_name: [data.faq_name, Validators.required],
            question: [data.question, Validators.required],
            answer: [data.answer, Validators.required],
            status: [Number(data.status)],
          });

          /*
           * Open modal only after
           * data is prepared.
           */
          this.modalReference = this.modalService.open(content, {
            size: 'xl',
            centered: true,
            backdrop: 'static',
          });
        } else {
          alert(response.message || 'Unable to load Agent FAQ');
        }
      },

      (error) => {
        this.spinner.hide();

        console.error('Get Agent FAQ error:', error);

        alert(
          error && error.error && error.error.message
            ? error.error.message
            : 'Unable to load Agent FAQ',
        );
      },
    );
  }

  ResetAttributes(): void {
    this.editId = null;
    this.form = this.createForm();
    this.categories = [];
    this.ModalHeading = 'Add Agent FAQ';
    this.ModalBtn = 'Save';
  }

  onAnswerInput(event: any): void {
    const value = event.target.value;

    console.log('ANSWER INPUT:', value);

    this.form.get('answer').setValue(value);
    this.form.get('answer').updateValueAndValidity();

    console.log('ANSWER CONTROL:', this.form.get('answer').value);
  }

  getAll(pageurl: string = ''): void {
    this.spinner.show();

    const data = {
      category_type: this.searchForm.get('category_type').value,
      category_id: this.searchForm.get('category_id').value,
      faq_search: this.searchForm.get('faq_search').value,
      rows_number: this.searchForm.get('rows_number').value,
    };

    const request = pageurl
      ? this.http.post(pageurl, data)
      : this.http.post(this.path + 'getAgentFaqs', data);

    request.subscribe(
      (response: any) => {
        console.log('FAQ list response:', response);

        if (response && response.status === true) {
          this.faqs =
            response.data && response.data.data ? response.data.data : [];

          this.pagination = response.data || {};

          this.all = response;
        } else {
          this.faqs = [];
        }

        this.spinner.hide();
      },

      (error) => {
        this.spinner.hide();

        console.error('Get Agent FAQ error:', error);

        this.faqs = [];
      },
    );
  }

  search(): void {
    this.getAll();
  }

  resetFilters(): void {
    this.searchForm.reset({
      category_type: '',

      category_id: '',

      faq_search: '',

      rows_number: '10',
    });

    this.getAll();
  }

  onFaqSearchInput(event: any): void {
    const value = event.target.value;

    this.searchForm.get('faq_search').setValue(value);
  }

  onRowsChange(event: any): void {
    const value = event.target.value;

    this.searchForm.get('rows_number').setValue(value);

    this.search();
  }

  onFilterCategoryTypeChange(event: any): void {
    const type = event.target.value;

    this.searchForm.get('category_id').setValue('');

    if (!type) {
      this.search();

      return;
    }

    this.http
      .get(
        this.path + 'getAgentFaqCategoriesByType/' + encodeURIComponent(type),
      )
      .subscribe(
        (response: any) => {
          if (response && response.status === true) {
            this.categories = response.data || [];
          } else {
            this.categories = [];
          }

          this.search();
        },

        (error) => {
          console.error('Filter category error:', error);

          this.categories = [];

          this.search();
        },
      );
  }

  onFilterCategoryChange(event: any): void {
    this.searchForm.get('category_id').setValue(event.target.value);

    this.search();
  }

  changeStatus(faq: any): void {
    console.log('========== CHANGE FAQ STATUS ==========');
    console.log('FAQ ID:', faq.id);
    console.log('CURRENT STATUS:', faq.status);

    const userId = this.getLoggedInUserId();

    this.http
      .post(this.path + 'changeAgentFaqStatus/' + faq.id, {
        updated_by: userId,
      })
      .subscribe(
        (response: any) => {
          console.log('FAQ STATUS RESPONSE:', response);

          if (response && response.status === true) {
            // Update the current row immediately
            faq.status = Number(response.data.status);

            console.log('NEW STATUS:', faq.status);

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
          console.error('Change FAQ status error:', error);

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

  goToPage(url: string): void {
    if (url) {
      this.getAll(url);
    }
  }

  page(label: string): string {
    if (!label) {
      return '';
    }

    return label.replace('&laquo;', '«').replace('&raquo;', '»');
  }

  refresh(): void {
    this.resetFilters();
  }

  fileName = 'Agent-FAQ.csv';

  exportexcel(): void {
    const element = document.getElementById('print-section');

    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, 'Agent FAQ');

    XLSX.writeFile(wb, this.fileName);
  }
}
