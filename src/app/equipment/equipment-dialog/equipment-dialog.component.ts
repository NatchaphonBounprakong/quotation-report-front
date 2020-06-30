import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Component({
  selector: 'app-equipment-dialog',
  templateUrl: './equipment-dialog.component.html',
  styleUrls: ['./equipment-dialog.component.less']
})
export class EquipmentDialogComponent implements OnInit {

  //name: ''
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  horizontalPosition2: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(public dialogRef: MatDialogRef<EquipmentDialogComponent>, private _notiSnackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any) {


  }

  ngOnInit(): void {

  }

  openNotiSnackBar(message: string) {
    this._notiSnackbar.open(message, "", {
      duration: 3000,
      panelClass: ['yellow-snackbar'],
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }


  onOkClick(): void {
    if (this.data.name === "" || this.data.name === null || this.data.name === undefined) {
      this.openNotiSnackBar("กรุณาใส่ชื่ออุปกรณ์")
    } else {
      this.dialogRef.close(this.data);
    }

  }

  onNoClick(): void {
    this.dialogRef.close();
  }



}
