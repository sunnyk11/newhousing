import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { GuestModule } from './guest/guest.module';
import { BackendModule } from './backend/backend.module';
import { NotfoundComponentComponent } from './components/notfound-component/notfound-component.component';

//custom  imports

//custom  imports

@NgModule({
  declarations: [
  
    NotfoundComponentComponent
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
