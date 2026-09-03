import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../constant/constant';

@Injectable({
  providedIn: 'root',
})
export class AgentfaqService {
  constructor(private http: HttpClient) {}

  getAllData(data: any, page: number = 1) {
    return this.http.post(
      Constants.BASE_URL + '/agent-faq/list?page=' + page,
      data,
    );
  }

  getFaqTypes() {
    return this.http.post(
      Constants.BASE_URL + '/agent-faq/types',
      {}
    );
  }

  getFaqCategories(type: any) {
    return this.http.post(
      Constants.BASE_URL + '/agent-faq/categories',
      {
        type: type,
      }
    );
  }

  create(data: any) {
    return this.http.post(
      Constants.BASE_URL + '/agent-faq/create',
      data
    );
  }

  getById(id: any) {
    return this.http.post(
      Constants.BASE_URL + '/agent-faq/' + id,
      {}
    );
  }

  update(id: any, data: any) {
    return this.http.post(
      Constants.BASE_URL + '/agent-faq/update/' + id,
      data
    );
  }

  changeStatus(id: any) {
    return this.http.post(
      Constants.BASE_URL + '/agent-faq/status/' + id,
      {}
    );
  }
}