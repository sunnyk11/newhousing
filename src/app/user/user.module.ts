import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { GuestModule } from './guest/guest.module';

//custom  imports

//custom  imports

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    GuestModule,
    
  ],
  
})
export class UserModule { }
