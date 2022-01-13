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
import { UserReviewsComponent } from './components/user-reviews/user-reviews.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { UserBankDetailsComponent } from './components/user-bank-details/user-bank-details.component';
import { UserPaytmVerifyComponent } from './modals/user-paytm-verify/user-paytm-verify.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BankHistoryComponent } from './modals/bank-history/bank-history.component';
import { UserListComponent } from './components/user-list/user-list.component';

@NgModule({
  declarations: [
    LoginComponent,
    DashboardComponent,
    MasterComponent,
    SidenavComponent,
    HeaderComponent,
    ViewPlansComponent,
    AddPlanComponent,
    UserReviewsComponent,
    UserBankDetailsComponent,
    UserPaytmVerifyComponent,
    BankHistoryComponent,
    UserListComponent
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
    NgxPaginationModule,
    NgbModule,
    FlexLayoutModule
  ]
})
export class AdminModule { }
