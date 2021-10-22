import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GuestRoutingModule } from './guest-routing.module';
import { MasterComponent } from './components/master/master.component';
import { IndexComponent } from './components/index/index.component';
import { UserSharedModule } from '../user-shared/user-shared.module';


@NgModule({
  declarations: [
    MasterComponent,
    IndexComponent,
  ],
  imports: [
    CommonModule,
    GuestRoutingModule,
    UserSharedModule,
  ],
})
export class GuestModule { }
