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
  download(data: any, boss: boolean) {
    let name = ""
    if (boss) {
      name = "/Quota/Invoice"
    } else {
      let man = data.guard_man_amount1 + data.guard_man_amount2;
      let woman = data.guard_woman_amount1 + data.guard_woman_amount2;
      if (man > 0 && woman > 0){
        name ="/Quota-Guard/Invoice"
      } else if (man > 0 && woman === 0){
        name ="/Quota-Guard-Man/Invoice"
      }
      else if (woman > 0 && man === 0){
        name ="/Quota-Guard-Woman/Invoice"
      }
    }

    return this.http.post(URLS.report, {
      "template": {
        "name": name
      },
      "data": data
    }, { headers: this.header, responseType: 'blob' })

  };

  fetchSaleOffice() {

  }
}


