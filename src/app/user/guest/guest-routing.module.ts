import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//custom componenent imports
import { MasterComponent } from './components/master/master.component';
import { IndexComponent } from './components/index/index.component';
//custom component imports

const routes: Routes = [
    {
      path: "",
      component: MasterComponent,
      children: [
        { path: "", component:IndexComponent }
      ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GuestRoutingModule { }
