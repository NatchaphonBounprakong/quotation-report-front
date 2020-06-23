import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.less']
})
export class MainNavComponent implements OnInit {


  private loginSub: Subscription;
  isAuthenticated = false;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor( private router: Router,private breakpointObserver: BreakpointObserver, private service: AuthService) {
    this.loginSub = this.service.isLogin.subscribe(
      o => {
        if (o) {
          this.isAuthenticated = true;
        }
        else {
          this.isAuthenticated = false;
        }
      }
    );

  }
  ngOnInit(): void {

  }

  onLogout() {
    if(confirm("ต้องการออกจากระบบ?")){
      this.service.logout();
      this.router.navigate(['/auth']);
    }

  }

}
