import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GuardContentComponent } from './guard-content/guard-content.component';


const routes: Routes = [
  {
    path: '',
    component: GuardContentComponent
  },
  {
    path: 'guard',
    component: GuardContentComponent
  },
  {
    path: 'guard/:id',
    component: GuardContentComponent
  },
  {
    path: 'guard-boss',
    component: GuardContentComponent
  },
  {
    path: 'guard-boss/:id',
    component: GuardContentComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
