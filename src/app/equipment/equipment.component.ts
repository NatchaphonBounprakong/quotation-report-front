import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit, ContentChild } from '@angular/core';
import { MasterService } from '../master.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject, forkJoin } from 'rxjs';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EquipmentDialogComponent } from './equipment-dialog/equipment-dialog.component';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.less']
})
export class EquipmentComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(DataTableDirective, { static: false }) table: DataTableDirective

  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  horizontalPosition2: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  loading = false
  equipments = []
  datatableElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();
  dtOptions: DataTables.Settings = {};

  constructor(private masterService: MasterService, public dialog: MatDialog,private _snackBar: MatSnackBar,private _notiSnackbar: MatSnackBar,) { }

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

  ngAfterViewInit(): void {
    this.datatableElement = this.table

    this.dtOptions = {
      order: [],
      pagingType: 'full_numbers',
      responsive: true,
      scrollX: true,
      language: {
        search: "ค้นหาด่วน"
      },
      columns: [
        { "width": "5%" },
        { "width": "5%" },
        { "width": "70%" },
        { "width": "20%" },
      ]

    };

    this.datatableElement.dtOptions = this.dtOptions;
    this.onFetchMasterData()
    console.log(this.datatableElement)

  }

  ngOnInit(): void {

  }

  onEdit(id) {
    let equipment = this.equipments.filter(o => o.AUTO_ID === id);
    let dialogRef = this.dialog.open(EquipmentDialogComponent, {
      width: '350px',
      data: { id: id, name: equipment[0].NAME, type: equipment[0].TYPE === 1 ? "1" : "2" }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      //this.loading = true;

      if (result !== null && result !== undefined) {
        this.openSnackBar("กำลังบันทึกข้อมูล","กรุณารอซักครู่")
        this.masterService.manageEquipment(JSON.stringify(result)).subscribe(o => {
          if (o.status) {
            this.onReload()
            this.openNotiSnackBar("บันทึกข้อมูลเรียบร้อย")
          }
          //this.loading = false;
        })
      }
      else {
        //this.loading = false;
      }
    });
  }

  onDelete(id) {
    if (confirm("ต้องการลบอุปกรณ์ใช่หรือไม่")) {
      //this.loading = true;

      this.masterService.deleteEquipment(id).subscribe(o => {
        this.openSnackBar("กำลังบันทึกข้อมูล","กรุณารอซักครู่")
        if (o.status) {

          this.onReload()
          //this.loading = false;
          this.openNotiSnackBar("บันทึกข้อมูลเรียบร้อย")
        } else {
          //this.loading = false;
        }
        //this.loading = false;
      })
    }
  }

  onAdd() {

    let dialogRef = this.dialog.open(EquipmentDialogComponent, {
      width: '350px',
      data: { id: 0, name: '', type: "1" }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result !== null && result !== undefined) {
        //this.loading = true;
        this.openSnackBar("กำลังบันทึกข้อมูล","กรุณารอซักครู่")
        this.masterService.manageEquipment(JSON.stringify(result)).subscribe(o => {
          if (o.status) {
            this.onReload()
            this.openNotiSnackBar("บันทึกข้อมูลเรียบร้อย")
          }
          //this.loading = false;
        })
      } else {
        //this.loading = false;
      }
    });
  }

  onReload() {
    this.loading = true;
    this.masterService.fetchEquipment().subscribe(o => {
      if (o.status) {

        this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
          // Destroy the table first
          dtInstance.destroy();
          this.equipments = o.result;
          // Call the dtTrigger to rerender again
          this.dtTrigger.next();

        });
        this.loading = false;
      }
    })

  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  onFetchMasterData() {

    this.loading = true;
    this.masterService.fetchEquipment().subscribe(o => {
      if (o.status) {
        this.equipments = o.result;
        this.dtTrigger.next();

      }
      this.loading = false;
    })
  }
}
