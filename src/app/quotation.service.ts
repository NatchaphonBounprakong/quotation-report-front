import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {URLS} from '../assets/config'
@Injectable({
  providedIn: 'root'
})
export class QuotationService {

  private url: string = URLS.api

  last:string

  constructor(private http: HttpClient) {
	}

  saveQuotation(payload:string) {
		return this.http.post<any>(this.url + "quotation/saveQuotaion",{payload:payload})
  }

  editQuotation(payload:string) {
		return this.http.post<any>(this.url + "quotation/editQuotaion",{payload:payload})
  }

  getQuotation(id:number) {
		return this.http.post<any>(this.url + "quotation/getQuotation",{id:id})
  }

  generateNo(id:number) {
		return this.http.post<any>(this.url + "quotation/generateNo",{id:id})
  }

  getListQuotation(payload:string) {
		return this.http.post<any>(this.url + "quotation/getListQuotation",{payload:payload})
  }

  getQuotationForReport(id:number) {
		return this.http.post<any>(this.url + "quotation/getQuotationForReport",{id:id})
	}

}
