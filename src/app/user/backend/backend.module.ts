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
import { MatInputModule} from '@angular/material/input';
import { MatIconModule} from '@angular/material/icon';
import { MatButtonModule} from '@angular/material/button';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule} from '@angular/material/divider';
import { AgmCoreModule } from '@agm/core';
import { MatSliderModule} from '@angular/material/slider';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { NgxPaginationModule } from 'ngx-pagination';
import { UpdatepropertyRentComponent } from './components/updateproperty-rent/updateproperty-rent.component';
import { MyPlansComponent } from './components/my-plans/my-plans.component';
import { MyPropertiesComponent } from './components/my-properties/my-properties.component';
import { ListpropertySalesComponent } from './components/listproperty-sales/listproperty-sales.component';
import { UpdatepropertySalesComponent } from './components/updateproperty-sales/updateproperty-sales.component';
import { PropertyCreditModalComponent } from './components/property-credit-modal/property-credit-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ModalComponent } from './components/modal/modal.component';
import { MatExpansionModule} from '@angular/material/expansion';
import { MatBadgeModule} from '@angular/material/badge';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { PaymentSummaryComponent } from './components/payment-summary/payment-summary.component';
import { InvoiceComponent } from './components/invoice/invoice.component';
import { PlanApplyComponent } from './components/plan-apply/plan-apply.component';
import { LocalServiceComponent } from './components/local-service/local-service.component';
import { GetAveragePipe } from './pipes/get-average.pipe';
import { GetPercentagePipe } from './pipes/get-percentage.pipe';
import { ProgressBarModule } from 'angular-progress-bar';
import { NgxStarRatingModule } from 'ngx-star-rating';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ConfirmationmodalComponent } from './modals/confirmationmodal/confirmationmodal.component';
import { RentSlipComponent } from './components/rent-slip/rent-slip.component';
import { TimezonePipe } from './pipes/timezone.pipe';
@NgModule({
  declarations: [
    DashboardComponent,
    MasterComponent,
    ListpropertyRentComponent,
    ListpropertyComponent,
    UpdatepropertyRentComponent,
    MyPlansComponent,
    MyPropertiesComponent,
    ListpropertySalesComponent,
    UpdatepropertySalesComponent,
    PropertyCreditModalComponent,
    ModalComponent,
    PaymentSummaryComponent,
    InvoiceComponent,
    PlanApplyComponent,
    LocalServiceComponent,
    GetAveragePipe,
    GetPercentagePipe,
    ConfirmationmodalComponent,
    RentSlipComponent,
    TimezonePipe
  ],
  imports: [
    ProgressBarModule,
    CommonModule,
    BackendRoutingModule,
    UserSharedModule,
    MatStepperModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    NgxSliderModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatOptionModule,
    MatRadioModule,
    MatSelectModule,
    MatBadgeModule,
    MatExpansionModule,
    NgMultiSelectDropDownModule.forRoot(),
    AgmCoreModule.forRoot({  
      apiKey: 'AIzaSyC2S5kHeGYkW9cL4d7_uxfauTBfQEtN4HA', libraries: ['places']
    }),
    MatSliderModule,
    NgxStarRatingModule
  ]
})
export class BackendModule { }
