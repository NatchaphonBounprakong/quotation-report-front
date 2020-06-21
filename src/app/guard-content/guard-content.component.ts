import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MasterService } from '../master.service';
import { quotationPaylod } from '../interface/master.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { QuotationService } from '../quotation.service';
import { PdfService } from '../pdf.service';
import { AuthService } from '../auth.service';

interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-guard-content',
  templateUrl: './guard-content.component.html',
  styleUrls: ['./guard-content.component.less']
})
export class GuardContentComponent implements OnInit, AfterViewInit {

  equipments: any[] = []
  customers: any[] = []
  customerContact: any[] = []
  filterCustomerContact: any[] = []
  saleOffice: any[] = []
  filterEquipments: any[] = []
  fakeNotes: string[] = [""]
  notes: string[] = [""]

  id: number
  type: number
  isBoss: boolean;
  isEditMode: boolean = false;
  quotation: any = null;
  disable: boolean = false


  customerSelected = null;
  customerContactSelected = null;
  officeSelected = null;

  error: boolean = false;
  errorList: any[]

  @ViewChild('BOSS_RATE') BOSS_RATE: ElementRef;
  @ViewChild('BOSS_SHIFT_1') BOSS_SHIFT_1: ElementRef;
  @ViewChild('BOSS_SHIFT_2') BOSS_SHIFT_2: ElementRef;
  @ViewChild('GUARD_MAN_RATE') GUARD_MAN_RATE: ElementRef;
  @ViewChild('GUARD_MAN_SHIFT_1') GUARD_MAN_SHIFT_1: ElementRef;
  @ViewChild('GUARD_MAN_SHIFT_2') GUARD_MAN_SHIFT_2: ElementRef;
  @ViewChild('GUARD_WOMAN_RATE') GUARD_WOMAN_RATE: ElementRef;
  @ViewChild('GUARD_WOMAN_SHIFT_1') GUARD_WOMAN_SHIFT_1: ElementRef;
  @ViewChild('GUARD_WOMAN_SHIFT_2') GUARD_WOMAN_SHIFT_2: ElementRef;
  @ViewChild('BAIL_RATE') BAIL_RATE: ElementRef;
  @ViewChild('CREATE_DATE') CREATE_DATE: ElementRef;
  @ViewChild('NO') NO: ElementRef;


  constructor(private masterService: MasterService, private quotationService: QuotationService,private authService:AuthService, private route: ActivatedRoute, private router: Router, private pdfService: PdfService) { }

  ngAfterViewInit(): void {


    let route = this.router.url
    if (route.indexOf('guard-boss') > -1) {
      this.isBoss = true;
    }


    this.route.paramMap.subscribe(paramMap => {

      if (paramMap.get('id') !== null && paramMap.get('id') !== "") {
        this.id = +paramMap.get('id')
        this.isEditMode = true;
        this.quotationService.getQuotation(this.id).subscribe(data => {
          if (data.status) {
            this.quotation = data.result
            this.setData()
          }
          else {

          }
        })
      }
    })

  }

  onDownloadPdf() {
    this.quotationService.getQuotationForReport(this.id).subscribe(o => {
      if (o.status) {
        this.pdfService.download(o.result)
      }
    })
    //
  }

  ngOnInit(): void {
    this.onFetchMasterData();
  }

  setData() {
    this.customerSelected = this.customerContact.filter(o => o.AUTO_ID === this.quotation.CONTACT_ID)[0].CUSTOMER_ID
    this.onCustomerChange();
    this.customerContactSelected = this.quotation.CONTACT_ID
    this.officeSelected = this.quotation.SALE_OFFICE_ID
    this.id = this.quotation.AUTO_ID
    this.filterEquipments = [];
    this.quotation.EQUIPMENT_ID.forEach(element => {
      this.filterEquipments.push({ AUTO_ID: element })
    });
    this.fakeNotes = this.quotation.NOTE
    this.notes = this.quotation.NOTE

    this.BOSS_RATE ? this.BOSS_RATE.nativeElement.value = this.quotation.BOSS_RATE : null
    this.BOSS_SHIFT_1 ? this.BOSS_SHIFT_1.nativeElement.value = this.quotation.BOSS_SHIFT_1 : null
    this.BOSS_SHIFT_2 ? this.BOSS_SHIFT_2.nativeElement.value = this.quotation.BOSS_SHIFT_2 : null

    this.GUARD_MAN_RATE.nativeElement.value = this.quotation.GUARD_MAN_RATE
    this.GUARD_MAN_SHIFT_1.nativeElement.value = this.quotation.GUARD_MAN_SHIFT_1
    this.GUARD_MAN_SHIFT_2.nativeElement.value = this.quotation.GUARD_MAN_SHIFT_2
    this.GUARD_WOMAN_RATE.nativeElement.value = this.quotation.GUARD_WOMAN_RATE
    this.GUARD_WOMAN_SHIFT_1.nativeElement.value = this.quotation.GUARD_WOMAN_SHIFT_1
    this.GUARD_WOMAN_SHIFT_2.nativeElement.value = this.quotation.GUARD_WOMAN_SHIFT_2
    this.BAIL_RATE.nativeElement.value = this.quotation.BAIL_RATE
    this.NO.nativeElement.value = this.quotation.NO
    if (this.quotation.CREATE_DATE) {

      if (this.quotation.CREATE_DATE.indexOf("Date(") > -1) {
        var dateNum = +this.quotation.CREATE_DATE.match(/\d+/)[0];
        var date = new Date(dateNum);
        this.CREATE_DATE.nativeElement.value = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear()
      }

    }

    if (this.quotation.NO !== "" && this.quotation.NO !== null) {
      this.disable = true
    }
    else{
      this.disable = false
    }




  }

  validate(): boolean {
    this.errorList = [];
    if (!this.officeSelected || this.officeSelected === "" || this.officeSelected === null) {
      this.errorList.push("เลือกสาขาที่ออกใบเสนอราคา")
    }
    if (!this.CREATE_DATE.nativeElement.value || this.CREATE_DATE.nativeElement.value === "") {
      this.errorList.push("ใส่วันที่")
    }
    if (!this.customerSelected || this.customerSelected === "" || this.customerSelected === null) {
      this.errorList.push("เลือกบริษัท/ชื่อลูกค้า")
    }
    if (!this.customerContactSelected || this.customerContactSelected === "" || this.customerContactSelected === null) {
      this.errorList.push("เลือกชื่อผู้ติดต่อ")
    }


    if (this.errorList.length > 0) {
      this.error = true;
      return false;
    }
    else {
      this.error = false;
      return true;
    }
  }

  onSave(isCopy: boolean = false) {
    if (this.validate()) {
      if (confirm("ต้องการบันทึกข้อมูลใช่หรือไม่?")) {
        let quotation: quotationPaylod = {
          AUTO_ID: this.isEditMode ? this.id : 0,
          NO: "",
          EQUIPMENT_ID: this.filterEquipments.map(o => o.AUTO_ID),
          NOTE: this.notes,
          TYPE: this.isEditMode ? this.type : this.isBoss ? 2 : 1,
          BOSS_RATE: this.BOSS_RATE ? +this.BOSS_RATE.nativeElement.value : 0,
          BOSS_SHIFT_1: +this.BOSS_SHIFT_1 ? +this.BOSS_SHIFT_1.nativeElement.value : 0,
          BOSS_SHIFT_2: +this.BOSS_SHIFT_2 ? +this.BOSS_SHIFT_2.nativeElement.value : 0,
          GUARD_MAN_RATE: +this.GUARD_MAN_RATE.nativeElement.value,
          GUARD_MAN_SHIFT_1: +this.GUARD_MAN_SHIFT_1.nativeElement.value,
          GUARD_MAN_SHIFT_2: +this.GUARD_MAN_SHIFT_2.nativeElement.value,
          GUARD_WOMAN_RATE: +this.GUARD_WOMAN_RATE.nativeElement.value,
          GUARD_WOMAN_SHIFT_1: +this.GUARD_WOMAN_SHIFT_1.nativeElement.value,
          GUARD_WOMAN_SHIFT_2: +this.GUARD_WOMAN_SHIFT_2.nativeElement.value,
          BAIL_RATE: +this.BAIL_RATE.nativeElement.value,
          CREATE_DATE: this.CREATE_DATE.nativeElement.value,
          CONTACT_ID: this.customerContactSelected,
          SALE_OFFICE_ID: this.officeSelected,
          EMPLOYEE_ID:this.authService.user.id,
        }
        let payload = JSON.stringify(quotation);
        if (this.isEditMode) {
          if (isCopy) {
            quotation.AUTO_ID = 0,
              quotation.TYPE = this.isBoss ? 2 : 1,
              this.quotationService.saveQuotation(payload).subscribe(o => {
                if (o.status) {
                  !this.isBoss ? this.router.navigate(["guard", o.result]) : this.router.navigate(["guard-boss", o.result]);
                  alert("บันทึกข้อมูลเรียบร้อย");
                }
                else {
                  alert("ไม่สามารถบันทึกข้อมูลได้กรุณาลองใหม่ ภายหลัง Message:" + o.message);
                }
              }
              );
          }
          else {
            this.quotationService.editQuotation(payload).subscribe(o => {
              if (o.status) {
                !this.isBoss ? this.router.navigate(["guard", o.result]) : this.router.navigate(["guard-boss", o.result]);
                alert("บันทึกข้อมูลเรียบร้อย");
              }
              else {
                alert("ไม่สามารถบันทึกข้อมูลได้กรุณาลองใหม่ ภายหลัง Message:" + o.message);
              }
            });
          }
        }
        else {
          this.quotationService.saveQuotation(payload).subscribe(o => {
            if (o.status) {
              !this.isBoss ? this.router.navigate(["guard", o.result]) : this.router.navigate(["guard-boss", o.result]);
              alert("บันทึกข้อมูลเรียบร้อย");
            }
            else {
              alert("ไม่สามารถบันทึกข้อมูลได้กรุณาลองใหม่ ภายหลัง Message:" + o.message);
            }
          }
          );
        }

      }
    }

  }

  onRemoveEquipment(i) {

    this.filterEquipments.splice(i, 1);


  }

  onCustomerChange() {
    this.filterCustomerContact = this.customerContact.filter(o => o.CUSTOMER_ID === this.customerSelected);
  }


  onAddEquipment() {

    this.filterEquipments.push({ AUTO_ID: 0, NAME: "", TYPE: 2 })
  }

  onAddNote() {
    let noteLength = this.fakeNotes.length;
    this.fakeNotes[noteLength] = ""
    this.notes[noteLength] = ""
  }

  onNoteChange($event, i) {
    this.fakeNotes[i] = $event.target.value;
    this.notes[i] = $event.target.value;
  }

  onGenerateNo() {
    if (confirm("ต้องการออกใบเสนอราคาหรือไม่? *จะไม่สามารถแก้ไขข้อมูลได้อีก")) {
      this.quotationService.generateNo(this.id).subscribe(o => {
        if (o.status) {
          this.NO.nativeElement.value = o.result
          this.disable = true
          alert("บันทึกข้อมูลเรียบร้อย");
          this.pdfService.download(o.message);
        }
      })
    }
  }

  onBack() {
    this.router.navigate(['list'])
  }

  trackByFn(i: number) {
    return i;
  }

  testFunc() {

    let quotation: quotationPaylod = {
      AUTO_ID: 0,
      NO: "",
      EQUIPMENT_ID: this.filterEquipments.map(o => o.AUTO_ID),
      NOTE: this.notes,
      TYPE: this.isBoss ? 2 : 1,
      BOSS_RATE: this.BOSS_RATE ? +this.BOSS_RATE.nativeElement.value : 0,
      BOSS_SHIFT_1: +this.BOSS_SHIFT_1 ? +this.BOSS_SHIFT_1.nativeElement.value : 0,
      BOSS_SHIFT_2: +this.BOSS_SHIFT_2 ? +this.BOSS_SHIFT_2.nativeElement.value : 0,
      GUARD_MAN_RATE: +this.GUARD_MAN_RATE.nativeElement.value,
      GUARD_MAN_SHIFT_1: +this.GUARD_MAN_SHIFT_1.nativeElement.value,
      GUARD_MAN_SHIFT_2: +this.GUARD_MAN_SHIFT_2.nativeElement.value,
      GUARD_WOMAN_RATE: +this.GUARD_WOMAN_RATE.nativeElement.value,
      GUARD_WOMAN_SHIFT_1: +this.GUARD_WOMAN_SHIFT_1.nativeElement.value,
      GUARD_WOMAN_SHIFT_2: +this.GUARD_WOMAN_SHIFT_2.nativeElement.value,
      BAIL_RATE: +this.BAIL_RATE.nativeElement.value,
      CREATE_DATE: this.CREATE_DATE.nativeElement.value,
      CONTACT_ID: this.customerContactSelected,
      SALE_OFFICE_ID: this.officeSelected
    }

    console.log(quotation);

  }

  onFetchMasterData() {
    this.masterService.fetchEquipment().subscribe(data => {
      if (data.status) {
        this.equipments = data.result;
        if (!this.isEditMode) {
          this.filterEquipments = this.equipments.filter(o => o.TYPE === 1);
          console.log(this.filterEquipments)
        }
      }
      else {

      }

    })
    this.masterService.fetchCustomers().subscribe(data => {
      if (data.status) {
        this.customers = data.result.filter(o => o.CUSTOMER_CONTACT.length > 0);
      }
      else {

      }
    })
    this.masterService.fetchCustomerContact().subscribe(data => {
      if (data.status) {
        this.customerContact = data.result;
      }
      else {

      }
    })
    this.masterService.fetchSaleOffice().subscribe(data => {
      if (data.status) {
        this.saleOffice = data.result;
      }
      else {

      }
    })
  }

}
