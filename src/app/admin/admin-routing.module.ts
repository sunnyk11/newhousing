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
import { ServicesUserListComponent } from './components/services-user-list/services-user-list.component';
import { CreateServicesUserComponent } from './components/create-services-user/create-services-user.component';
import { UpdateServicesUserComponent } from './components/update-services-user/update-services-user.component';	
import { ServiceListComponent } from './components/service-list/service-list.component';		
import { UpdateServicesComponent } from './components/update-services/update-services.component';		
import { CreateBlogPostComponent } from './components/create-blog-post/create-blog-post.component';
import { ViewBlogPostsComponent } from './components/view-blog-posts/view-blog-posts.component';			
import { BlogSinglePostComponent } from './components/blog-single-post/blog-single-post.component';																		 

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
      { path: 'user-bank-details', component: UserBankDetailsComponent, canActivate: [AuthGuard, PermissionGuard], data: {
        permission: ['access_bank_details']
      } },
      { path: 'user-list', component: UserListComponent, canActivate: [AuthGuard, PermissionGuard],  data: {
        permission: ['access_all_users']
      }},
      { path: 'user-reviews', component: UserReviewsComponent, canActivate: [AuthGuard, PermissionGuard], data: {
        permission: ['access_reviews']
      }},
      { path: 'services-user-list', component: ServicesUserListComponent, canActivate: [AuthGuard, PermissionGuard], data: {
        permission: ['access_local_area_service_provider']
      } },
      { path: 'create-services-user', component: CreateServicesUserComponent, canActivate: [AuthGuard, PermissionGuard], data: {
        permission: ['access_local_area_service_provider']
      } },
      { path: 'update-services-user', component: UpdateServicesUserComponent, canActivate: [AuthGuard, PermissionGuard], data: {
        permission: ['access_local_area_service_provider']
      } },
      { path: 'services-list', component: ServiceListComponent, canActivate: [AuthGuard, PermissionGuard], data: {
        permission: ['access_local_area_service_provider']
      } },
      { path: 'update-services', component: UpdateServicesComponent, canActivate: [AuthGuard, PermissionGuard], data: {
        permission: ['access_local_area_service_provider']
      } },
      { path: 'create-blog-post', component: CreateBlogPostComponent, canActivate: [AuthGuard, PermissionGuard], data: {
        permission: ['access_manage_blog']
      } },
      { path: 'view-blog-posts', component: ViewBlogPostsComponent, canActivate: [AuthGuard, PermissionGuard], data: {
        permission: ['access_manage_blog']
      } },
      { path: 'admin-blog-single-post/:slug', component: BlogSinglePostComponent, canActivate: [AuthGuard, PermissionGuard], data: {
        permission: ['access_manage_blog']
      } },
      { path: 'edit-blog-post/:slug', component: CreateBlogPostComponent, canActivate: [AuthGuard, PermissionGuard], data: {
        permission: ['access_manage_blog']
      } }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
