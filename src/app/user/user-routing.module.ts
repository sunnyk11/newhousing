import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: "agent", loadChildren: ()=> import('./backend/backend.module').then(m => m.BackendModule)  },
  { path: "admin", loadChildren: ()=> import('../admin/admin.module').then(m => m.AdminModule)  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
