import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MasterComponent } from './components/master/master.component';
// import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { ListpropertyComponent } from './components/listproperty/listproperty.component';
import { ListpropertyRentComponent } from './components/listproperty-rent/listproperty-rent.component';
import { UpdatepropertyRentComponent } from './components/updateproperty-rent/updateproperty-rent.component';
import { MyPlansComponent } from './components/my-plans/my-plans.component';

import { MyPropertiesComponent } from './components/my-properties/my-properties.component';
// import { ListpropertySalesComponent } from './components/listproperty-sales/listproperty-sales.component';
import { UpdatepropertySalesComponent } from './components/updateproperty-sales/updateproperty-sales.component';
import { PaymentSummaryComponent } from './components/payment-summary/payment-summary.component';
import { InvoiceComponent } from './components/invoice/invoice.component';
import { PlanApplyComponent } from './components/plan-apply/plan-apply.component';
import { VerifyMobileGuard } from './guards/verify-mobile.guard';
import { LocalServiceComponent } from './components/local-service/local-service.component';
import { VerifyMobileComponent } from '../guest/components/verify-mobile/verify-mobile.component';
// import { NotfoundComponentComponent } from '../components/notfound-component/notfound-component.component';
import { ProfileComponent } from '../guest/components/profile/profile.component';

const routes: Routes = [
  {
    path: "",
    component: MasterComponent,
    children: [
      { path: "my-plans", component: MyPlansComponent, canActivate: [AuthGuard] },
      { path: "", component:ProfileComponent,canActivate: [AuthGuard] },
      { path: "list-property", component: ListpropertyComponent,canActivate: [AuthGuard]},
      { path: "my-properties", component: MyPropertiesComponent,canActivate: [AuthGuard]},
      { path: "list-property-rent", component: ListpropertyRentComponent,canActivate: [AuthGuard, VerifyMobileGuard]},
      /* Sale feature Commented */
      // { path: "list-property-sales", component: ListpropertySalesComponent,canActivate: [AuthGuard, VerifyMobileGuard]},
      /* Sale feature Commented */
      { path: "update-property-rent", component: UpdatepropertyRentComponent,canActivate: [AuthGuard]},
      { path: "payment-summary", component: PaymentSummaryComponent,canActivate: [AuthGuard]},
      { path: "invoice", component: InvoiceComponent,canActivate: [AuthGuard]},
      { path: "plan-apply", component: PlanApplyComponent,canActivate: [AuthGuard]},
      { path: "update-property-sales", component: UpdatepropertySalesComponent,canActivate: [AuthGuard]},
      /* { path: "services-list", component: ServiceListComponent,canActivate: [AuthGuard]},
      { path: "update-services", component: UpdateServicesComponent,canActivate: [AuthGuard]}, */
      { path: "local-services", component: LocalServiceComponent,canActivate: [AuthGuard]},
      { path: "verify-details", component: VerifyMobileComponent, canActivate: [AuthGuard] },
      // {path: '**', component: NotfoundComponentComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BackendRoutingModule { }
