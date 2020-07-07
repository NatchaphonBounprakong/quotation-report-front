import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
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
  create_by: string,
  office: string
}
@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.less']
})

export class GridComponent implements OnInit, AfterViewInit,OnDestroy {
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  quotaions = []
  saleOffice = []

  @ViewChild(MatAccordion) accordion: MatAccordion;
  @ViewChild(DataTableDirective, { static: false })

  dtElement: DataTableDirective;
  date = new Date();
  startDate = new FormControl(new Date(this.date.getFullYear(), this.date.getMonth(), 1))
  endDate = new FormControl(new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0))
  panelOpenState = false;

  @ViewChild('NO') NO: ElementRef;
  @ViewChild('CUSTOMER') CUSTOMER: ElementRef;
  @ViewChild('CUSTOMER_CONTACT') CUSTOMER_CONTACT: ElementRef;
  @ViewChild('START_DATE') START_DATE: ElementRef;
  @ViewChild('END_DATE') END_DATE: ElementRef;
  loading = false

  filterCustomerContact: any[] = []
  customerContact: any[] = []
  customerSelected = null;
  customerContactSelected = null;
  customers: any[] = []
  officeSelected = null;

  constructor(private router: Router, private service: QuotationService, private masterService: MasterService) { }

  onCustomerChange() {
    this.filterCustomerContact = this.customerContact.filter(o => o.CUSTOMER_ID === this.customerSelected);
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
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
      no: '',
      office: ''
    }

    let payload = JSON.stringify(filter)
    this.loading = true;
    this.service.getListQuotation(payload).subscribe(o => {
      if (o.status) {
        this.quotaions = o.result;
        this.dtTrigger.next();
        this.loading = false;
        this.service.last = o.message
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

  onReset() {
    this.CUSTOMER.nativeElement.value = ''
    this.CUSTOMER_CONTACT.nativeElement.value = ''
    this.NO.nativeElement.value = ''
    this.officeSelected = "เลือกทั้งหมด"
    this.startDate = new FormControl(new Date(this.date.getFullYear(), this.date.getMonth(), 1))
    this.endDate = new FormControl(new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0))
    this.onSearch()
  }

  onSearch() {
    let filter: filter = {
      create_date_to: this.END_DATE.nativeElement.value,
      create_date_from: this.START_DATE.nativeElement.value,
      create_by: '',
      customer: this.CUSTOMER.nativeElement.value,
      customer_contact: this.CUSTOMER_CONTACT.nativeElement.value,
      no: this.NO.nativeElement.value,
      office: this.officeSelected === "เลือกทั้งหมด" ? '' : this.officeSelected
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


  onFetchMasterData() {

    this.loading = true;
    forkJoin([this.masterService.fetchSaleOffice()]).subscribe(results => {



      if (results[0].status) {
        this.saleOffice = results[0].result;
        this.saleOffice.splice(0, 0, { NAME: 'เลือกทั้งหมด' });
        this.officeSelected = "เลือกทั้งหมด"
      }
      else {
      }



      this.loading = false;
    })
  }
}
