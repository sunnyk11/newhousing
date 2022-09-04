import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MasterComponent } from './components/master/master.component';
import { AuthGuard } from './guards/auth.guard';
import { ViewPlansComponent } from './components/view-plans/view-plans.component';
import { AddPlanComponent } from './components/add-plan/add-plan.component';
import { CreateUserComponent } from './components/create-user/create-user.component';
import { CreateRoleComponent } from './components/create-role/create-role.component';
import { ViewRoleComponent } from './components/view-role/view-role.component';
import { PermissionGuard } from './guards/permission.guard';
import { UserReviewsComponent } from './components/user-reviews/user-reviews.component';
import { UserBankDetailsComponent } from './components/user-bank-details/user-bank-details.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { ServicesUserListComponent } from './components/services-user-list/services-user-list.component';
import { CreateServicesUserComponent } from './components/create-services-user/create-services-user.component';
import { UpdateServicesUserComponent } from './components/update-services-user/update-services-user.component';	
import { ServiceListComponent } from './components/service-list/service-list.component';		
import { UpdateServicesComponent } from './components/update-services/update-services.component';		
import { CreateBlogPostComponent } from './components/create-blog-post/create-blog-post.component';
import { ViewBlogPostsComponent } from './components/view-blog-posts/view-blog-posts.component';			
import { BlogSinglePostComponent } from './components/blog-single-post/blog-single-post.component';	
import { ViewInternalUsersComponent } from './components/view-internal-users/view-internal-users.component';															
import { DataExportComponent } from './components/data-export/data-export.component';
import { OfferBannerComponent } from './components/offer-banner/offer-banner.component';
import { VisitUserFeedbackComponent } from './components/visit-user-feedback/visit-user-feedback.component';
import { CreateUserInternalComponent} from './components/create-user-internal/create-user-internal.component';
import {UserListInternalComponent} from './components/user-list-internal/user-list-internal.component';
import { PropertyListComponent } from './components/property-list/property-list.component';
import { InvoiceDetailsComponent } from './components/invoice-details/invoice-details.component';
import { PropertyRentSlipComponent } from './components/property-rent-slip/property-rent-slip.component';
import { PaymentUserComponent } from './components/payment-user/payment-user.component';
import { PaymentUserListComponent } from './components/payment-user-list/payment-user-list.component';
import { ProductPreviewComponent } from './components/product-preview/product-preview.component';
import { StateListComponent } from './components/state-list/state-list.component';
import { DistrictListComponent } from './components/district-list/district-list.component';
import { LocalityListComponent } from './components/locality-list/locality-list.component';
import { UpdateLocalityComponent } from './components/update-locality/update-locality.component'; 
import { SubLocalityListComponent } from './components/sub-locality-list/sub-locality-list.component';
import { UpdateSubLocalityComponent } from './components/update-sub-locality/update-sub-locality.component';
import { AreaGroupComponent } from './components/area-group/area-group.component';
import { AddAreaGroupComponent } from './components/add-area-group/add-area-group.component';
import { UpdateAreaGroupComponent } from './components/update-area-group/update-area-group.component';
import { BookInvoiceComponent } from './components/book-invoice/book-invoice.component';
import { NotfoundComponentComponent } from '../user/components/notfound-component/notfound-component.component';


const routes: Routes = [
  {
    path: '', component: MasterComponent,
    children: [
      { path: "", component: LoginComponent },
      { path: "login", component: LoginComponent },
      { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
      { path: 'view-plans', component: ViewPlansComponent, canActivate: [AuthGuard, PermissionGuard], data: {
        permission: ['access_manage_plans']
      } },
      { path: 'add-plan', component: AddPlanComponent, canActivate: [AuthGuard, PermissionGuard], data: {
        permission: ['access_manage_plans']
      } },
      { path: 'create-user', component: CreateUserComponent, canActivate: [AuthGuard, PermissionGuard], data: {
        permission: ['access_user_creator']
      } },
      { path: 'create-role', component: CreateRoleComponent, canActivate: [AuthGuard, PermissionGuard], data: {
        permission: ['access_manage_roles']
      } },
      { path: 'view-role', component: ViewRoleComponent, canActivate: [AuthGuard, PermissionGuard], data: {
        permission: ['access_manage_roles']
      } },
      { path: 'user-bank-details', component: UserBankDetailsComponent, canActivate: [AuthGuard, PermissionGuard], data: {
        permission: ['access_bank_details']
      } },
      { path: 'user-list', component: UserListComponent, canActivate: [AuthGuard, PermissionGuard],  data: {
        permission: ['access_all_users']
      }},
      { path: 'user-reviews', component: UserReviewsComponent, canActivate: [AuthGuard, PermissionGuard], data: {
        permission: ['access_reviews']
      }},
      { path: 'services-user-list', component: ServicesUserListComponent, canActivate: [AuthGuard, PermissionGuard], data: {
        permission: ['access_local_area_service_provider']
      } },
      { path: 'create-services-user', component: CreateServicesUserComponent, canActivate: [AuthGuard, PermissionGuard], data: {
        permission: ['access_local_area_service_provider']
      } },
      { path: 'update-services-user', component: UpdateServicesUserComponent, canActivate: [AuthGuard, PermissionGuard], data: {
        permission: ['access_local_area_service_provider']
      } },
      { path: 'services-list', component: ServiceListComponent, canActivate: [AuthGuard, PermissionGuard], data: {
        permission: ['access_local_area_service_provider']
      } },
      { path: 'update-services', component: UpdateServicesComponent, canActivate: [AuthGuard, PermissionGuard], data: {
        permission: ['access_local_area_service_provider']
      } },
      { path: 'create-blog-post', component: CreateBlogPostComponent, canActivate: [AuthGuard, PermissionGuard], data: {
        permission: ['access_manage_blog']
      } },
      { path: 'view-blog-posts', component: ViewBlogPostsComponent, canActivate: [AuthGuard, PermissionGuard], data: {
        permission: ['access_manage_blog']
      } },
      { path: 'admin-blog-single-post/:slug', component: BlogSinglePostComponent, canActivate: [AuthGuard, PermissionGuard], data: {
        permission: ['access_manage_blog']
      } },
      { path: 'edit-blog-post/:slug', component: CreateBlogPostComponent, canActivate: [AuthGuard, PermissionGuard], data: {
        permission: ['access_manage_blog']
      } },
      { path: 'view-internal-user', component: ViewInternalUsersComponent, canActivate: [AuthGuard, PermissionGuard], data: {
        permission: ['access_user_creator']
      } },
      { path: 'data-export', component: DataExportComponent, canActivate: [AuthGuard, PermissionGuard],data: {
        permission: ['data_export']
      }},
      
      { path: 'visit-user-feedback', component: VisitUserFeedbackComponent, canActivate: [AuthGuard, PermissionGuard],data: {
        permission: ['visit_user_feedback']
      }},
      
      { path: 'create-user-internal', component: CreateUserInternalComponent, canActivate: [AuthGuard, PermissionGuard],data: {
        permission: ['access_create_userbyinternal']
      }},
      
      { path: 'user-list-internal', component: UserListInternalComponent, canActivate: [AuthGuard, PermissionGuard],data: {
        permission: ['access_view_userByinternal']
      }},
      { path: 'offer-banner', component: OfferBannerComponent, canActivate: [AuthGuard, PermissionGuard],data: {
        permission: ['access_web_Banner']
      }},
      { path: 'property-list', component: PropertyListComponent, canActivate: [AuthGuard, PermissionGuard],data: {
        permission: ['property_access']
      }},
      { path: 'product-preview', component: ProductPreviewComponent, canActivate: [AuthGuard, PermissionGuard],data: {
        permission: ['property_preview']
      }},

      { path: 'invoice', component: InvoiceDetailsComponent, canActivate: [AuthGuard, PermissionGuard],data: {
        permission: ['property_access']
      }},
      { path: 'book-invoice', component: BookInvoiceComponent, canActivate: [AuthGuard, PermissionGuard],data: {
        permission: ['property_access']
      }},
      { path: 'rent-slip', component: PropertyRentSlipComponent, canActivate: [AuthGuard, PermissionGuard],data: {
        permission: ['property_access']
      }},
      { path: 'payment-user', component: PaymentUserComponent, canActivate: [AuthGuard, PermissionGuard],data: {
        permission: ['access_bank_details']
      }},
      { path: 'payment-user-list', component: PaymentUserListComponent, canActivate: [AuthGuard, PermissionGuard],data: {
        permission: ['access_bank_details']
      }},   
      { path: 'state-list', component: StateListComponent, canActivate: [AuthGuard, PermissionGuard],data: {
        permission: ['access_locality_area']
      }}, 
      { path: 'district-list', component: DistrictListComponent, canActivate: [AuthGuard, PermissionGuard],data: {
        permission: ['access_locality_area']
      }}, 
      { path: 'locality-list', component: LocalityListComponent, canActivate: [AuthGuard, PermissionGuard],data: {
        permission: ['access_locality_area']
      }}, 
      { path: 'update-locality', component: UpdateLocalityComponent, canActivate: [AuthGuard, PermissionGuard],data: {
        permission: ['access_locality_area']
      }}, 
      { path: 'sub-locality-list', component: SubLocalityListComponent, canActivate: [AuthGuard, PermissionGuard],data: {
        permission: ['access_locality_area']
      }}, 
      { path: 'update-sub-locality', component: UpdateSubLocalityComponent, canActivate: [AuthGuard, PermissionGuard],data: {
        permission: ['access_locality_area']
      }}, 
      { path: 'area-group-list', component: AreaGroupComponent, canActivate: [AuthGuard, PermissionGuard],data: {
        permission: ['access_area_group']
      }},  
      { path: 'add-area-group', component: AddAreaGroupComponent, canActivate: [AuthGuard, PermissionGuard],data: {
        permission: ['access_area_group']
      }},
      { path: 'update-area-group', component: UpdateAreaGroupComponent, canActivate: [AuthGuard, PermissionGuard],data: {
        permission: ['access_area_group']
      }}, 
      
      {path: '**', component: NotfoundComponentComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
