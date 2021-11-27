import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BackendRoutingModule } from './backend-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MasterComponent } from './components/master/master.component';
import { UserSharedModule } from '../user-shared/user-shared.module';
import { ListpropertyRentComponent } from './components/listproperty-rent/listproperty-rent.component';
import { ListpropertyComponent } from './components/listproperty/listproperty.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import {MatDividerModule} from '@angular/material/divider';
import { AgmCoreModule } from '@agm/core';
import {MatSliderModule} from '@angular/material/slider';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { NgxPaginationModule } from 'ngx-pagination';
import { UpdatepropertyRentComponent } from './components/updateproperty-rent/updateproperty-rent.component';
import { MyPropertiesComponent } from './components/my-properties/my-properties.component';

@NgModule({
  declarations: [
    DashboardComponent,
    MasterComponent,
    ListpropertyRentComponent,
    ListpropertyComponent,
    UpdatepropertyRentComponent,
    MyPropertiesComponent
  ],
  imports: [
    CommonModule,
    BackendRoutingModule,
    UserSharedModule,
    MatStepperModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    NgxSliderModule,
    AgmCoreModule.forRoot({  
      apiKey: 'AIzaSyC2S5kHeGYkW9cL4d7_uxfauTBfQEtN4HA', libraries: ['places']
    }),
    MatSliderModule
  ]
})
export class BackendModule { }
