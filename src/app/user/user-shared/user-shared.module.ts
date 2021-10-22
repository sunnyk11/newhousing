import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GuestFooterComponent } from '../components/guest-footer/guest-footer.component';
import { GuestHeaderComponent } from '../components/guest-header/guest-header.component';


@NgModule({
  declarations: [
    GuestHeaderComponent,
    GuestFooterComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    GuestHeaderComponent,
    GuestFooterComponent
  ]
})
export class UserSharedModule { }
