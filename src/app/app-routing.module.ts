import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GuardContentComponent } from './guard-content/guard-content.component';
import { GridComponent } from './grid/grid.component';
import { AuthGuard } from './auth.guard';
import { AuthComponent } from './auth/auth.component';
import { LoginGuard } from './login.guard';


const routes: Routes = [
  {
    path: '',
    component: GridComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'list',
    component: GridComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'guard',
    component: GuardContentComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'guard/:id',
    component: GuardContentComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'guard-boss',
    component: GuardContentComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'guard-boss/:id',
    component: GuardContentComponent,
    canActivate: [AuthGuard],
  },
  { path: 'auth',  canActivate: [LoginGuard],component: AuthComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
