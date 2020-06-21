import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { QuotationService } from '../quotation.service';
import { Subject } from 'rxjs';
import { MatAccordion } from '@angular/material/expansion';
import { FormControl } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
interface filter {
  no: string,
  customer: string,
  customer_contact: string,
  create_date_to: string,
  create_date_from: string,
  create_by: string
}
@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.less']
})

export class GridComponent implements OnInit, AfterViewInit {
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  quotaions = []

  @ViewChild(MatAccordion) accordion: MatAccordion;
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  date = new Date();
  startDate = new FormControl(new Date(this.date.getFullYear(), this.date.getMonth(), 1))
  endDate = new FormControl(new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0))
  constructor(private router: Router, private service: QuotationService) { }

  panelOpenState = false;

  @ViewChild('NO') NO: ElementRef;
  @ViewChild('CUSTOMER') CUSTOMER: ElementRef;
  @ViewChild('CUSTOMER_CONTACT') CUSTOMER_CONTACT: ElementRef;
  @ViewChild('START_DATE') START_DATE: ElementRef;
  @ViewChild('END_DATE') END_DATE: ElementRef;
  @ViewChild('EMPLOYEE_NAME') EMPLOYEE_NAME: ElementRef;


  ngAfterViewInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      responsive: true,
      scrollX: true,
      language: {
        search: "ค้นหาด่วน"
      }
    };


    let filter: filter = {
      create_date_to: this.END_DATE.nativeElement.value,
      create_date_from: this.START_DATE.nativeElement.value,
      create_by:'',
      customer:'',
      customer_contact:'',
      no:''
    }

    let payload = JSON.stringify(filter)

    this.service.getListQuotation(payload).subscribe(o => {
      if (o.status) {
        this.quotaions = o.result;
        this.dtTrigger.next();
      }
    })
  }

  ngOnInit(): void {

  }

  onNavigateGuard(id: any) {
    this.router.navigate(['/guard/' + id]);
  }

  onSearch() {
    let filter: filter = {
      create_date_to: this.END_DATE.nativeElement.value,
      create_date_from: this.START_DATE.nativeElement.value,
      create_by:this.EMPLOYEE_NAME.nativeElement.value,
      customer:this.CUSTOMER.nativeElement.value,
      customer_contact:this.CUSTOMER_CONTACT.nativeElement.value,
      no:this.NO.nativeElement.value,
    }
    let payload = JSON.stringify(filter)
    this.service.getListQuotation(payload).subscribe(o => {
      if (o.status) {

        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          // Destroy the table first
          dtInstance.destroy();
          this.quotaions = o.result;
          // Call the dtTrigger to rerender again
          this.dtTrigger.next();
        });
      }
    })
  }
}
