import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MasterComponent } from './components/master/master.component';
import { AuthGuard } from './guards/auth.guard';
import { ViewPlansComponent } from './components/view-plans/view-plans.component';
import { AddPlanComponent } from './components/add-plan/add-plan.component';
import { UserReviewsComponent } from './components/user-reviews/user-reviews.component';
import { UserBankDetailsComponent } from './components/user-bank-details/user-bank-details.component';
import { UserListComponent } from './components/user-list/user-list.component';
const routes: Routes = [
  {
    path: '', component: MasterComponent,
    children: [
      { path: "login", component: LoginComponent },
      { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
      { path: 'view-plans', component: ViewPlansComponent, canActivate: [AuthGuard] },
      { path: 'add-plan', component: AddPlanComponent, canActivate: [AuthGuard] },
      { path: 'user-bank-details', component: UserBankDetailsComponent, canActivate: [AuthGuard] },
      { path: 'user-list', component: UserListComponent, canActivate: [AuthGuard] },
      { path: 'user-reviews', component: UserReviewsComponent, canActivate: [AuthGuard] }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
