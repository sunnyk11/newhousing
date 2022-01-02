import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
RouterModule

import { GuestFooterComponent } from '../components/guest-footer/guest-footer.component';
import { GuestHeaderComponent } from '../components/guest-header/guest-header.component';
import { RouterModule } from '@angular/router';
import { AgentHeaderComponent } from '../components/agent-header/agent-header.component';
import { AgentFooterComponent } from '../components/agent-footer/agent-footer.component';
import { AgentSidenavComponent } from '../components/agent-sidenav/agent-sidenav.component';
import { SidenavListComponent } from '../components/sidenav-list/sidenav-list.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
  declarations: [
    GuestHeaderComponent,
    GuestFooterComponent,
    AgentHeaderComponent,
    AgentFooterComponent,
    AgentSidenavComponent,
    SidenavListComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    FlexLayoutModule,
    MatMenuModule,
    MatButtonModule,
    MatBadgeModule,
    NgbModule,
    MatTabsModule
  ],
  exports: [
    GuestHeaderComponent,
    GuestFooterComponent,
    AgentHeaderComponent,
    AgentFooterComponent,
    AgentSidenavComponent,
    SidenavListComponent,
    MatSidenavModule,
    MatIconModule,
    NgbModule,
    MatTabsModule
  ]
})
export class UserSharedModule { }
