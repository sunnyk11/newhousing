import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { GuestModule } from './guest/guest.module';
import { BackendModule } from './backend/backend.module';

//custom  imports

//custom  imports

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    GuestModule,
    BackendModule
    
  ],
  exports: []
  
})
export class UserModule { }
