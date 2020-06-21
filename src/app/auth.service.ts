import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { URLS } from '../assets/config'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLogin = new BehaviorSubject<boolean>(false);
  user: any
  logined: boolean;
  constructor(private http: HttpClient, private router: Router) { }

  private url: string = URLS.api;

  autoLogin() {
    var json = localStorage.getItem('quotauser')
    if (json !== null) {
      let user = JSON.parse(json);
      let expriry = user.expire_date.toString().match(/\d+/);
      let expriryDate = new Date(+expriry[0])
      var today = new Date().getDate();
      var exDay = expriryDate.getDate();
      if (new Date() > expriryDate) {
        localStorage.removeItem("quotauser");
        this.logined = false;
        this.isLogin.next(false);
        this.router.navigate(['/auth'])
      }
      else {
        this.user = user;
        this.logined = true;
        this.isLogin.next(true);
        this.router.navigate(['/list'])
      }
    }
    else {
      this.logined = false;
      this.isLogin.next(false);
      this.router.navigate(['/auth'])
    }
  }

  login(id: string, password: string) {
    return this.http
      .post<any>(
        this.url + 'auth/login',
        {
          id: id,
          password: password,
        }
      ).pipe(
        tap(response => {
          if (response.status) {
            this.user = response.result
            localStorage.setItem('quotauser', JSON.stringify(response.result))
            this.logined = true;
            this.isLogin.next(true);
          }
          else {
            this.logined = false;
            this.isLogin.next(false);
          }
        })
      )
  }

  logout() {
    localStorage.removeItem("quotauser");
    this.logined = false;
    this.isLogin.next(false);
  }




}
