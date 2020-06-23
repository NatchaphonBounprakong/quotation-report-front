import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.less']
})
export class AuthComponent implements OnInit {
  @ViewChild('ID') ID: ElementRef;
  @ViewChild('PASSWORD') PASSWORD: ElementRef;
  loading = false
  loadingButton=false;
  constructor(private router: Router, private service: AuthService) { }

  ngOnInit(): void {

  }

  onLogin() {
    this.loading = true
    this.service.login(this.ID.nativeElement.value, this.PASSWORD.nativeElement.value)
    .subscribe(o=>{
      if(o.status){
        this.router.navigate(['/list']);
      }
      this.loading = false
    })
  }

  onLogout() {
    this.loading = true
    this.service.logout();
    this.loading = false
    this.router.navigate(['/auth']);
  }

}
