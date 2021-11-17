import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BackendRoutingModule } from './backend-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MasterComponent } from './components/master/master.component';
import { UserSharedModule } from '../user-shared/user-shared.module';


@NgModule({
  declarations: [
    DashboardComponent,
    MasterComponent
  ],
  imports: [
    CommonModule,
    BackendRoutingModule,
    UserSharedModule
  ]
})
export class BackendModule { }
