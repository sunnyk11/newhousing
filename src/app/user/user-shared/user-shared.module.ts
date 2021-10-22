import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
RouterModule

import { GuestFooterComponent } from '../components/guest-footer/guest-footer.component';
import { GuestHeaderComponent } from '../components/guest-header/guest-header.component';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    GuestHeaderComponent,
    GuestFooterComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    GuestHeaderComponent,
    GuestFooterComponent
  ]
})
export class UserSharedModule { }
