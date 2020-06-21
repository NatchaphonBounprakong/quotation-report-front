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
  download(data: any) {
    this.http.post(URLS.report, {
      "template": {
        "name": "/Quota/Invoice"
      },
      "data": data
    }, { headers: this.header, responseType: 'blob' }).subscribe(o => {

      var blob = new Blob([o], { type: 'application/pdf' });
      saveAs(blob, 'Quotation' + data.no + '.pdf');

    })

  };

  fetchSaleOffice() {

  }
}


