import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//custom componenent imports
import { MasterComponent } from './components/master/master.component';
import { IndexComponent } from './components/index/index.component';
import { AboutComponent } from './components/about/about.component';
import { ContactComponent } from './components/contact/contact.component';

//custom component imports

const routes: Routes = [
    {
      path: "",
      component: MasterComponent,
      children: [
        { path: "", component:IndexComponent },
        { path: "about", component:AboutComponent },
        { path: "contact", component:ContactComponent }

      ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GuestRoutingModule { }
