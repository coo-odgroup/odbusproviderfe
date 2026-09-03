import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../constant/constant';

@Injectable({
  providedIn: 'root',
})
export class AgentfaqService {
  constructor(private http: HttpClient) {}

  /**
   * Get Agent FAQ List
   */
  getAllData(data: any, page: number = 1) {
    return this.http.post(
      Constants.BASE_URL + '/agent-faq/list?page=' + page,
      data,
    );
  }

  /**
   * Get FAQ Types
   */
  getFaqTypes() {
    return this.http.get(Constants.BASE_URL + '/agent-faq/types');
  }

  /**
   * Get FAQ Categories based on Type
   */
  getFaqCategories(type: any) {
    return this.http.post(Constants.BASE_URL + '/agent-faq/categories', {
      type: type,
    });
  }

  /**
   * Add FAQ
   */
  create(data: any) {
    return this.http.post(Constants.BASE_URL + '/agent-faq/create', data);
  }

  /**
   * Get FAQ by ID
   */
  getById(id: any) {
    return this.http.get(Constants.BASE_URL + '/agent-faq/' + id);
  }

  /**
   * Update FAQ
   */
  update(id: any, data: any) {
    return this.http.post(Constants.BASE_URL + '/agent-faq/update/' + id, data);
  }

  /**
   * Change FAQ Status
   */
  changeStatus(id: any) {
    return this.http.post(Constants.BASE_URL + '/agent-faq/status/' + id, {});
  }
}
