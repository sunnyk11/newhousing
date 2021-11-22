import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MasterComponent } from './components/master/master.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ListpropertyComponent } from './components/listproperty/listproperty.component';
import { ListpropertyRentComponent } from './components/listproperty-rent/listproperty-rent.component';
import { UpdatepropertyRentComponent } from './components/updateproperty-rent/updateproperty-rent.component';

const routes: Routes = [
  {
    path: "",
    component: MasterComponent,
    children: [
      { path: "", component:DashboardComponent },
      { path: "list-property", component: ListpropertyComponent},
      { path: "update-property-rent", component: UpdatepropertyRentComponent},
      { path: "list-property-rent", component: ListpropertyRentComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BackendRoutingModule { }
