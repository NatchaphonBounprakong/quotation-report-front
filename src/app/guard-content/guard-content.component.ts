import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { MasterService } from '../master.service';
import { quotationPaylod } from '../interface/master.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { QuotationService } from '../quotation.service';
import { PdfService } from '../pdf.service';
import { AuthService } from '../auth.service';
import { forkJoin, Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { saveAs } from 'file-saver';
import { startWith, map } from 'rxjs/operators';
import {
  MatSnackBar, MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { ErrorSnackComponent } from '../error-snack/error-snack.component';

interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-guard-content',
  templateUrl: './guard-content.component.html',
  styleUrls: ['./guard-content.component.less']
})
export class GuardContentComponent implements OnInit, AfterViewInit, OnDestroy {

  equipments: any[] = []
  customers: any[] = []
  customerContact: any[] = []
  filterCustomerContact: any[] = []
  saleOffice: any[] = []
  filterEquipments: any[] = []
  fakeNotes: string[] = [""]
  notes: string[] = [""]
  equipmentAvailable: any[]
  id: number
  type: number
  isBoss: boolean;
  isEditMode: boolean = false;
  quotation: any = null;
  disable: boolean = false
  date = null;
  customerSelected = null;
  customerContactSelected = null;
  officeSelected = null;
  error: boolean = false;
  errorList: any[]

  loading: boolean = false;
  loadingButton: boolean = false;
  avalibleEquipment: Observable<any>;
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
  @ViewChild('CUSTOMER_CONTACT') CUSTOMER_CONTACT: ElementRef;
  @ViewChild('CUSTOMER_CONTACT_PHONE') CUSTOMER_CONTACT_PHONE: ElementRef;
  @ViewChild('CUSTOMER') CUSTOMER: ElementRef;

  term = new FormControl();
  last: string

  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  horizontalPosition2: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(private masterService: MasterService, private quotationService: QuotationService, private authService: AuthService, private route: ActivatedRoute, private router: Router, private pdfService: PdfService, private _snackBar: MatSnackBar, private _notiSnackbar: MatSnackBar, private _errorSneakBar: MatSnackBar) {
    this.last = quotationService.last;
  }

  ngOnInit(): void {
    this.onFetchMasterData();

  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {

  }



  onLoadQuota() {

    this.loading = false;
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
          this.loading = false;
        })
      } else {
        this.date = new FormControl(new Date())
      }
    })

  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
    });
  }

  openNotiSnackBar(message: string) {
    this._notiSnackbar.open(message, "", {
      duration: 3000,
      panelClass: ['green-snackbar'],
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  openErrorSnackBar(data) {
    this._errorSneakBar.openFromComponent(ErrorSnackComponent, {
      duration: 5000,
      verticalPosition: 'top',
      horizontalPosition: this.horizontalPosition,
      data: data,
      panelClass: ['yellow-snackbar'],
    });
  }

  clossSnackBar() {
    this._snackBar.dismiss();
  }

  onDownloadPdf() {
    this.loadingButton = true;
    this.openSnackBar("กำลังดาวน์โหลด pdf", "กรุณารอซักครู่")
    this.quotationService.getQuotationForReport(this.id).subscribe(o => {
      if (o.status) {
        this.pdfService.download(o.result, this.isBoss).subscribe(k => {
          this.loadingButton = false;
          var blob = new Blob([k], { type: 'application/pdf' });
          saveAs(blob, 'Quotation' + o.result.no + '.pdf');
          //alert("ดาวน์โหลดใบเสนอราคาเรียบร้อย");
          this.openNotiSnackBar("ดาวน์โหลดใบเสนอราคาเรียบร้อย");
          //this.clossSnackBar();
        })
      }

    })
  }





  isSelected(equip) {
    return this.filterEquipments.includes(equip);
  }

  setData() {
    //this.customerSelected = this.customerContact.filter(o => o.AUTO_ID === this.quotation.CONTACT_ID)[0].CUSTOMER_ID
    //this.onCustomerChange();
    this.CUSTOMER.nativeElement.value = this.quotation.CUSTOMER
    this.CUSTOMER_CONTACT.nativeElement.value = this.quotation.CUSTOMER_CONTACT
    this.CUSTOMER_CONTACT_PHONE.nativeElement.value = this.quotation.CUSTOMER_CONTACT_PHONE
    this.customerContactSelected = this.quotation.CONTACT_ID
    this.officeSelected = this.quotation.SALE_OFFICE_ID
    this.id = this.quotation.AUTO_ID
    this.isBoss = this.quotation.TYPE === 2 ? true : false
    this.type = this.quotation.TYPE
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
    if (this.quotation.NO) {
      this.NO.nativeElement.value = this.quotation.NO
    }


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
    else {
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
    if (!this.CUSTOMER || this.CUSTOMER.nativeElement.value === "" || this.CUSTOMER.nativeElement.value === null) {
      this.errorList.push("ใส่บริษัท/ชื่อลูกค้า")
    }
    if (!this.CUSTOMER_CONTACT || this.CUSTOMER_CONTACT.nativeElement.value === "" || this.CUSTOMER_CONTACT.nativeElement.value === null) {
      this.errorList.push("ใส่ชื่อผู้ติดต่อ")
    }
    if (!this.CUSTOMER_CONTACT_PHONE || this.CUSTOMER_CONTACT_PHONE.nativeElement.value === "" || this.CUSTOMER_CONTACT_PHONE.nativeElement.value === null) {
      this.errorList.push("ใส่เบอร์โทรผู้ติดต่อ")
    }

    let bali = this.BAIL_RATE.nativeElement.value;
    if (bali === "" || bali === null || bali === 0 || bali === "0") {
      this.errorList.push("ใส่วงเงินประกัน")
    }



    if (this.isBoss) {
      if (this.BOSS_RATE.nativeElement.value === "" || this.BOSS_RATE.nativeElement.value === null || this.BOSS_RATE.nativeElement.value === 0 || this.BOSS_RATE.nativeElement.value === "0") {
        this.errorList.push("ใส่ราคาหัวหน้า รปภ.")
      } else {
        let boss1 = this.BOSS_SHIFT_1.nativeElement.value;
        let boss2 = this.BOSS_SHIFT_2.nativeElement.value;
        if ((boss1 === "" || boss1 === null || boss1 === 0 || boss1 === "0") && (boss2 === "" || boss2 === null || boss2 === 0 || boss2 === "0")) {
          this.errorList.push("ใส่จำนวนหัวหน้า รปภ.")
        }
        let manRate = this.GUARD_MAN_RATE.nativeElement.value
        let womanRate = this.GUARD_WOMAN_RATE.nativeElement.value
        let man1 = this.GUARD_MAN_SHIFT_1.nativeElement.value;
        let man2 = this.GUARD_MAN_SHIFT_2.nativeElement.value;
        let woman1 = this.GUARD_WOMAN_SHIFT_1.nativeElement.value;
        let woman2 = this.GUARD_WOMAN_SHIFT_2.nativeElement.value;

        if (manRate !== "" && manRate !== null && manRate !== 0 && manRate !== "0") {
          if ((man1 === "" || man1 === null || man1 === 0 || man1 === "0") && (man2 === "" || man2 === null || man2 === 0 || man2 === "0")) {
            this.errorList.push("ใส่จำนวน รปภ. ชาย")
          }
        }

        if (womanRate !== "" && womanRate !== null && womanRate !== 0 && womanRate !== "0") {
          if ((woman1 === "" || woman1 === null || woman1 === 0 || woman1 === "0") && (woman2 === "" || woman2 === null || woman2 === 0 || woman2 === "0")) {
            this.errorList.push("ใส่จำนวน รปภ. หญิง")
          }
        }

        if ((man1 !== "" && man1 !== null && man1 !== 0 && man1 !== "0") || (man2 !== "" && man2 !== null && man2 !== 0 && man2 !== "0")) {
          if (manRate === "" || manRate === null || manRate === 0 || manRate === "0") {
            this.errorList.push("ใส่ราคา รปภ. ชาย")
          }
        }

        if ((woman1 !== "" && woman1 !== null && woman1 !== 0 && woman1 !== "0") || (woman2 !== "" && woman2 !== null && woman2 !== 0 && woman2 !== "0")) {

          if (womanRate === "" || womanRate === null || womanRate === 0 || womanRate === "0") {
            this.errorList.push("ใส่ราคา รปภ. หญิง")
          }
        }


      }
    } else {
      let manRate = this.GUARD_MAN_RATE.nativeElement.value
      let womanRate = this.GUARD_WOMAN_RATE.nativeElement.value
      if ((manRate === "" || manRate === null || manRate === 0 || manRate === "0") && (womanRate === "" || womanRate === null || womanRate === 0 || womanRate === "0")) {
        this.errorList.push("ใส่ราคา รปภ. ชายหรือหญิง")
      } else {
        let man1 = this.GUARD_MAN_SHIFT_1.nativeElement.value;
        let man2 = this.GUARD_MAN_SHIFT_2.nativeElement.value;
        let woman1 = this.GUARD_WOMAN_SHIFT_1.nativeElement.value;
        let woman2 = this.GUARD_WOMAN_SHIFT_2.nativeElement.value;

        if (manRate !== "" && manRate !== null && manRate !== 0 && manRate !== "0") {
          if ((man1 === "" || man1 === null || man1 === 0 || man1 === "0") && (man2 === "" || man2 === null || man2 === 0 || man2 === "0")) {
            this.errorList.push("ใส่จำนวน รปภ. ชาย")
          }
        }

        if (womanRate !== "" && womanRate !== null && womanRate !== 0 && womanRate !== "0") {
          if ((woman1 === "" || woman1 === null || woman1 === 0 || woman1 === "0") && (woman2 === "" || woman2 === null || woman2 === 0 || woman2 === "0")) {
            this.errorList.push("ใส่จำนวน รปภ. หญิง")
          }
        }

        if ((man1 !== "" && man1 !== null && man1 !== 0 && man1 !== "0") || (man2 !== "" && man2 !== null && man2 !== 0 && man2 !== "0")) {
          if (manRate === "" || manRate === null || manRate === 0 || manRate === "0") {
            this.errorList.push("ใส่ราคา รปภ. ชาย")
          }
        }

        if ((woman1 !== "" && woman1 !== null && woman1 !== 0 && woman1 !== "0") || (woman2 !== "" && woman2 !== null && woman2 !== 0 && woman2 !== "0")) {

          if (womanRate === "" || womanRate === null || womanRate === 0 || womanRate === "0") {
            this.errorList.push("ใส่ราคา รปภ. หญิง")
          }
        }

      }


    }




    if (this.errorList.length > 0) {
      //const element = document.querySelector('#scrollId');
      //element.scrollIntoView();
      //let allError = this.errorList.join(",");
      this.openErrorSnackBar(this.errorList)

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
        //this.loading = true;
        this.openSnackBar("กำลังบันทึกข้อมูล", "กรุณารอซักครู่")
        this.disable = true;
        let quotation: quotationPaylod = {
          AUTO_ID: this.isEditMode ? this.id : 0,
          NO: "",
          EQUIPMENT_ID: this.filterEquipments.filter(o => o.AUTO_ID !== 0).map(o => o.AUTO_ID),
          NOTE: this.notes.filter(o => o !== ""),
          TYPE: this.isEditMode ? this.type : this.isBoss ? 2 : 1,
          BOSS_RATE: this.BOSS_RATE ? +this.BOSS_RATE.nativeElement.value : 0,
          BOSS_SHIFT_1: this.BOSS_SHIFT_1 ? +this.BOSS_SHIFT_1.nativeElement.value : 0,
          BOSS_SHIFT_2: this.BOSS_SHIFT_2 ? +this.BOSS_SHIFT_2.nativeElement.value : 0,
          GUARD_MAN_RATE: +this.GUARD_MAN_RATE.nativeElement.value,
          GUARD_MAN_SHIFT_1: +this.GUARD_MAN_SHIFT_1.nativeElement.value,
          GUARD_MAN_SHIFT_2: +this.GUARD_MAN_SHIFT_2.nativeElement.value,
          GUARD_WOMAN_RATE: +this.GUARD_WOMAN_RATE.nativeElement.value,
          GUARD_WOMAN_SHIFT_1: +this.GUARD_WOMAN_SHIFT_1.nativeElement.value,
          GUARD_WOMAN_SHIFT_2: +this.GUARD_WOMAN_SHIFT_2.nativeElement.value,
          BAIL_RATE: +this.BAIL_RATE.nativeElement.value,
          CREATE_DATE: this.CREATE_DATE.nativeElement.value,
          CONTACT_ID: 1,
          SALE_OFFICE_ID: this.officeSelected,
          EMPLOYEE_ID: this.authService.user.id,
          CUSTOMER: this.CUSTOMER.nativeElement.value,
          CUSTOMER_CONTACT: this.CUSTOMER_CONTACT.nativeElement.value,
          CUSTOMER_CONTACT_PHONE: this.CUSTOMER_CONTACT_PHONE.nativeElement.value,
        }

        let payload = JSON.stringify(quotation);

        if (this.isEditMode) {
          if (isCopy) {
            quotation.AUTO_ID = 0,
              quotation.TYPE = this.isBoss ? 2 : 1,
              this.quotationService.saveQuotation(payload).subscribe(o => {
                if (o.status) {
                  this.openNotiSnackBar("บันทึกข้อมูลเรียบร้อย");
                  !this.isBoss ? this.router.navigate(["guard", o.result]) : this.router.navigate(["guard-boss", o.result]);
                  this.NO.nativeElement.value = this.last

                }
                else {
                  alert("ไม่สามารถบันทึกข้อมูลได้กรุณาลองใหม่ ภายหลัง Message:" + o.message);
                }

                //this.clossSnackBar()
                this.disable = false;
              }
              );
          }
          else {
            this.quotationService.editQuotation(payload).subscribe(o => {
              if (o.status) {
                this.openNotiSnackBar("บันทึกข้อมูลเรียบร้อย");
                this.quotationService.getQuotation(+o.result).subscribe(data => {
                  if (data.status) {
                    this.quotation = data.result
                    this.setData()

                  }
                  else {

                  }
                  this.loading = false;
                })

              }
              else {
                alert("ไม่สามารถบันทึกข้อมูลได้กรุณาลองใหม่ ภายหลัง Message:" + o.message);
              }
              //this.clossSnackBar()
              this.disable = false;
            });
          }
        }
        else {
          this.quotationService.saveQuotation(payload).subscribe(o => {
            if (o.status) {
              this.openNotiSnackBar("บันทึกข้อมูลเรียบร้อย");
              !this.isBoss ? this.router.navigate(["guard", o.result]) : this.router.navigate(["guard-boss", o.result]);
            }
            else {
              alert("ไม่สามารถบันทึกข้อมูลได้กรุณาลองใหม่ ภายหลัง Message:" + o.message);
            }

            //this.clossSnackBar()
            this.disable = false;
          }
          );
        }

      }
      else {
        //this.clossSnackBar()
        this.disable = false;
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
      this.disable = true;
      this.openSnackBar("กำลังบันทึกข้อมูล", "กรุณารอซักครู่")
      this.quotationService.generateNo(this.id).subscribe(o => {
        if (o.status) {
          this.NO.nativeElement.value = o.result
          this.id = +o.message
          this.disable = true
          this.openNotiSnackBar("ออกใบเสนอราคาเรียบร้อย")
          this.onDownloadPdf()
        }
        //this.disable = false;
      })
    }
  }

  onBack() {
    this.router.navigate(['list'])
  }

  trackByFn(i: number) {
    return i;
  }
  onFetchMasterData() {

    this.loading = true;
    forkJoin([this.masterService.fetchEquipment(), this.masterService.fetchSaleOffice()]).subscribe(results => {
      if (results[0].status) {
        this.equipments = results[0].result;
        if (!this.isEditMode) {
          this.filterEquipments = this.equipments.filter(o => o.TYPE === 1);

        }
      }
      else {

      }


      if (results[1].status) {
        this.saleOffice = results[1].result;
      }
      else {
      }

      this.loading = false;
    }, err => { }, () => {
      this.onLoadQuota()
    });
  }


}
