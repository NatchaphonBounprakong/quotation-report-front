import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { QuotationService } from '../quotation.service';
import { Subject, forkJoin, Observable } from 'rxjs';
import { MatAccordion } from '@angular/material/expansion';
import { FormControl } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { MasterService } from '../master.service';
import { startWith, map } from 'rxjs/operators';
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
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  date = new Date();
  startDate = new FormControl(new Date(this.date.getFullYear(), this.date.getMonth(), 1))
  endDate = new FormControl(new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0))
  constructor(private router: Router, private service: QuotationService, private masterService: MasterService) { }

  panelOpenState = false;

  @ViewChild('NO') NO: ElementRef;
  @ViewChild('CUSTOMER') CUSTOMER: ElementRef;
  @ViewChild('CUSTOMER_CONTACT') CUSTOMER_CONTACT: ElementRef;
  @ViewChild('START_DATE') START_DATE: ElementRef;
  @ViewChild('END_DATE') END_DATE: ElementRef;
  @ViewChild('EMPLOYEE_NAME') EMPLOYEE_NAME: ElementRef;
  loading = false

  filterCustomerContact: any[] = []
  customerContact: any[] = []
  customerSelected = null;
  customerContactSelected = null;
  customers: any[] = []

  onCustomerChange() {
    this.filterCustomerContact = this.customerContact.filter(o => o.CUSTOMER_ID === this.customerSelected);
  }

  ngAfterViewInit(): void {
    this.dtOptions = {
      order: [],
      pagingType: 'full_numbers',
      responsive: true,
      scrollX: true,
      language: {
        search: "ค้นหาด่วน"
      },

    };


    let filter: filter = {
      create_date_to: this.END_DATE.nativeElement.value,
      create_date_from: this.START_DATE.nativeElement.value,
      create_by: '',
      customer: '',
      customer_contact: '',
      no: ''
    }

    let payload = JSON.stringify(filter)
    this.loading = true;
    this.service.getListQuotation(payload).subscribe(o => {
      if (o.status) {
        this.quotaions = o.result;
        this.dtTrigger.next();
        this.loading = false;
      } else {
        this.loading = false;
      }

    })
  }

  ngOnInit(): void {
    this.onFetchMasterData()

  }

  onNavigateGuard(id: any) {
    this.router.navigate(['/guard/' + id]);
  }

  onSearch() {
    let filter: filter = {
      create_date_to: this.END_DATE.nativeElement.value,
      create_date_from: this.START_DATE.nativeElement.value,
      create_by: this.EMPLOYEE_NAME === null ? '' : this.EMPLOYEE_NAME.nativeElement.value,
      customer: this.CUSTOMER.nativeElement.value,
      customer_contact: this.CUSTOMER_CONTACT.nativeElement.value,
      no: this.NO.nativeElement.value,
    }
    this.loading = true;
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

      this.loading = false;
    })
  }

  myControl = new FormControl();
  filteredOptions: Observable<string[]>;


  myControl2 = new FormControl();
  filteredOptions2: Observable<string[]>;

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.customers.filter(option => option.NAME.toLowerCase().indexOf(filterValue) === 0);
  }

  private _filter2(value: string): string[] {
    const filterValue = value.toLowerCase();

    var x =this.customerContact.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
    return x
  }


  onFetchMasterData() {

    this.loading = true;
    forkJoin([this.masterService.fetchCustomers(), this.masterService.fetchCustomerContact()]).subscribe(results => {

      if (results[0].status) {
        this.customers = results[0].result.filter(o => o.CUSTOMER_CONTACT.length > 0);
      }
      else {

      }

      if (results[1].status) {
        this.customerContact = results[1].result.map(o=>o.NAME).filter((v, i, a) => a.indexOf(v) === i) ;
      }
      else {
      }

      this.filteredOptions = this.myControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value))
      );

      this.filteredOptions2 = this.myControl2.valueChanges.pipe(
        startWith(''),
        map(o => this._filter2(o))
      );

      this.loading = false;
    })
  }
}
