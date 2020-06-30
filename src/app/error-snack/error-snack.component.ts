import { Component, OnInit, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-error-snack',
  templateUrl: './error-snack.component.html',
  styleUrls: ['./error-snack.component.less']
})
export class ErrorSnackComponent implements OnInit {

  errorData
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {
    //this.errorData = data
  }

  ngOnInit(): void {
    this.errorData = this.data
  }

}
