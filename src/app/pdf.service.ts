import { Injectable } from '@angular/core';
import * as jsPDF from 'jspdf'
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { URLS } from '../assets/config'

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor(private http: HttpClient) {
  }

  header: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })
  download(data: any,boss:boolean) {
    return this.http.post(URLS.report, {
      "template": {
        "name": boss ? "/Quota/Invoice" : "/Quota-Guard/Invoice"
      },
      "data": data
    }, { headers: this.header, responseType: 'blob' })

  };

  fetchSaleOffice() {

  }
}


