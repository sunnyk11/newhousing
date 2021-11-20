import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
RouterModule

import { GuestFooterComponent } from '../components/guest-footer/guest-footer.component';
import { GuestHeaderComponent } from '../components/guest-header/guest-header.component';
import { RouterModule } from '@angular/router';
import { AgentHeaderComponent } from '../components/agent-header/agent-header.component';
import { AgentFooterComponent } from '../components/agent-footer/agent-footer.component';


@NgModule({
  declarations: [
    GuestHeaderComponent,
    GuestFooterComponent,
    AgentHeaderComponent,
    AgentFooterComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    GuestHeaderComponent,
    GuestFooterComponent,
    AgentHeaderComponent,
    AgentFooterComponent
  ]
})
export class UserSharedModule { }
