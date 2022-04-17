import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { LoginComponent } from './components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MasterComponent } from './components/master/master.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { MatListModule } from '@angular/material/list';
import { HeaderComponent } from './components/header/header.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ViewPlansComponent } from './components/view-plans/view-plans.component';
import { AddPlanComponent } from './components/add-plan/add-plan.component';
import { CreateUserComponent } from './components/create-user/create-user.component';
import { CreateRoleComponent } from './components/create-role/create-role.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ViewRoleComponent } from './components/view-role/view-role.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MatMenuModule } from '@angular/material/menu';
import { MatExpansionModule } from '@angular/material/expansion';
import { UserReviewsComponent } from './components/user-reviews/user-reviews.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { UserBankDetailsComponent } from './components/user-bank-details/user-bank-details.component';
import { UserPaytmVerifyComponent } from './modals/user-paytm-verify/user-paytm-verify.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BankHistoryComponent } from './modals/bank-history/bank-history.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { ServicesUserListComponent } from './components/services-user-list/services-user-list.component';
import { CreateServicesUserComponent } from './components/create-services-user/create-services-user.component';
import { UpdateServicesUserComponent } from './components/update-services-user/update-services-user.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ServiceListComponent } from './components/service-list/service-list.component';
import { UpdateServicesComponent } from './components/update-services/update-services.component';
import { CreateBlogPostComponent } from './components/create-blog-post/create-blog-post.component';
import { EditorModule } from '@tinymce/tinymce-angular';
import { ViewBlogPostsComponent } from './components/view-blog-posts/view-blog-posts.component';
import { BlogSinglePostComponent } from './components/blog-single-post/blog-single-post.component';
import { GuestModule } from '../user/guest/guest.module';
import { ViewInternalUsersComponent } from './components/view-internal-users/view-internal-users.component';
import { DataExportComponent } from './components/data-export/data-export.component';

@NgModule({
  declarations: [
    LoginComponent,
    DashboardComponent,
    MasterComponent,
    SidenavComponent,
    HeaderComponent,
    ViewPlansComponent,
    AddPlanComponent,
    CreateUserComponent,
    CreateRoleComponent,
    ViewRoleComponent,
    UserReviewsComponent,
    UserBankDetailsComponent,
    UserPaytmVerifyComponent,
    BankHistoryComponent,
    UserListComponent,
    ServicesUserListComponent,
    CreateServicesUserComponent,
    UpdateServicesUserComponent,
    ServiceListComponent,
    UpdateServicesComponent,
    CreateBlogPostComponent,
    ViewBlogPostsComponent,
    BlogSinglePostComponent,
    ViewInternalUsersComponent,
    DataExportComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    FlexLayoutModule,
    MatCheckboxModule,
    NgMultiSelectDropDownModule,
    MatMenuModule,
    MatExpansionModule,
    NgxPaginationModule,
    NgbModule,
    MatAutocompleteModule,
    EditorModule,
    GuestModule
  ]
})
export class AdminModule { }
