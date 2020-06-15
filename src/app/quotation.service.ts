import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class QuotationService {

  private url: string = "https://localhost:44362/";

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

}
