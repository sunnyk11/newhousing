import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MasterComponent } from './components/master/master.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { ListpropertyComponent } from './components/listproperty/listproperty.component';
import { ListpropertyRentComponent } from './components/listproperty-rent/listproperty-rent.component';
import { UpdatepropertyRentComponent } from './components/updateproperty-rent/updateproperty-rent.component';
import { MyPropertiesComponent } from './components/my-properties/my-properties.component';
const routes: Routes = [
  {
    path: "",
    component: MasterComponent,
    children: [
      { path: "", component:DashboardComponent,canActivate: [AuthGuard] },
      { path: "list-property", component: ListpropertyComponent,canActivate: [AuthGuard]},
      { path: "update-property-rent", component: UpdatepropertyRentComponent,canActivate: [AuthGuard]},
      { path: "my-properties", component: MyPropertiesComponent,canActivate: [AuthGuard]},
      { path: "list-property-rent", component: ListpropertyRentComponent,canActivate: [AuthGuard]}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BackendRoutingModule { }
