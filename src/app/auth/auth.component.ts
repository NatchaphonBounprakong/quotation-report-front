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

  constructor(private router: Router, private service: AuthService) { }

  ngOnInit(): void {

  }

  onLogin() {
    this.service.login(this.ID.nativeElement.value, this.PASSWORD.nativeElement.value)
    .subscribe(o=>{
      if(o.status){
        this.router.navigate(['/list']);
      }
    })
  }

  onLogout() {
    this.service.logout();
    this.router.navigate(['/auth']);
  }

}
