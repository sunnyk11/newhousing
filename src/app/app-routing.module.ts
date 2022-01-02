import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
const routes: Routes = [
  { path: "", loadChildren: ()=> import('./user/user.module').then(m => m.UserModule)  },
  { path: "admin", loadChildren: ()=> import('./admin/admin.module').then(m => m.AdminModule)  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'top'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
