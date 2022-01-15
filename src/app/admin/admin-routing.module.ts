import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MasterComponent } from './components/master/master.component';
import { AuthGuard } from './guards/auth.guard';
import { ViewPlansComponent } from './components/view-plans/view-plans.component';
import { AddPlanComponent } from './components/add-plan/add-plan.component';
import { CreateUserComponent } from './components/create-user/create-user.component';
import { CreateRoleComponent } from './components/create-role/create-role.component';
import { ViewRoleComponent } from './components/view-role/view-role.component';
import { PermissionGuard } from './guards/permission.guard';
import { UserReviewsComponent } from './components/user-reviews/user-reviews.component';
import { UserBankDetailsComponent } from './components/user-bank-details/user-bank-details.component';
import { UserListComponent } from './components/user-list/user-list.component';
const routes: Routes = [
  {
    path: '', component: MasterComponent,
    children: [
      { path: "login", component: LoginComponent },
      { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
      { path: 'view-plans', component: ViewPlansComponent, canActivate: [AuthGuard, PermissionGuard], data: {
        permission: ['access_manage_plans']
      } },
      { path: 'add-plan', component: AddPlanComponent, canActivate: [AuthGuard, PermissionGuard], data: {
        permission: ['access_manage_plans']
      } },
      { path: 'create-user', component: CreateUserComponent, canActivate: [AuthGuard, PermissionGuard], data: {
        permission: ['access_user_creator']
      } },
      { path: 'create-role', component: CreateRoleComponent, canActivate: [AuthGuard, PermissionGuard], data: {
        permission: ['access_manage_roles']
      } },
      { path: 'view-role', component: ViewRoleComponent, canActivate: [AuthGuard, PermissionGuard], data: {
        permission: ['access_manage_roles']
      } },
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
