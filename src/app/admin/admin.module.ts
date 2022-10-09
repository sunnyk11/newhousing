import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { LoginComponent } from './components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MasterComponent } from './components/master/master.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { MatListModule } from '@angular/material/list';
import { HeaderComponent } from './components/header/header.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ViewPlansComponent } from './components/view-plans/view-plans.component';
import { AddPlanComponent } from './components/add-plan/add-plan.component';
import { CreateUserComponent } from './components/create-user/create-user.component';
import { CreateRoleComponent } from './components/create-role/create-role.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ViewRoleComponent } from './components/view-role/view-role.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MatMenuModule } from '@angular/material/menu';
import { MatExpansionModule } from '@angular/material/expansion';
import { UserReviewsComponent } from './components/user-reviews/user-reviews.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { UserBankDetailsComponent } from './components/user-bank-details/user-bank-details.component';
import { UserPaytmVerifyComponent } from './modals/user-paytm-verify/user-paytm-verify.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BankHistoryComponent } from './modals/bank-history/bank-history.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { ServicesUserListComponent } from './components/services-user-list/services-user-list.component';
import { CreateServicesUserComponent } from './components/create-services-user/create-services-user.component';
import { UpdateServicesUserComponent } from './components/update-services-user/update-services-user.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ServiceListComponent } from './components/service-list/service-list.component';
import { UpdateServicesComponent } from './components/update-services/update-services.component';
import { CreateBlogPostComponent } from './components/create-blog-post/create-blog-post.component';
import { EditorModule } from '@tinymce/tinymce-angular';
import { ViewBlogPostsComponent } from './components/view-blog-posts/view-blog-posts.component';
import { BlogSinglePostComponent } from './components/blog-single-post/blog-single-post.component';
import { GuestModule } from '../user/guest/guest.module';
import { ViewInternalUsersComponent } from './components/view-internal-users/view-internal-users.component';
import { DataExportComponent } from './components/data-export/data-export.component';
import { VisitUserFeedbackComponent } from './components/visit-user-feedback/visit-user-feedback.component';
import { CreateUserInternalComponent } from './components/create-user-internal/create-user-internal.component';
import { UserListInternalComponent } from './components/user-list-internal/user-list-internal.component';
import { ByuserByinternalComponent } from './modals/byuser-byinternal/byuser-byinternal.component';
import { UserMobileUpdateComponent } from './modals/user-mobile-update/user-mobile-update.component';
import { UserEmailUpdateComponent } from './modals/user-email-update/user-email-update.component';
import { OfferBannerComponent } from './components/offer-banner/offer-banner.component';
import { PropertyListComponent } from './components/property-list/property-list.component';
import { InvoicePopupComponent } from './modals/invoice-popup/invoice-popup.component';
import { InvoiceDetailsComponent } from './components/invoice-details/invoice-details.component';
import { PropertyRentSlipComponent } from './components/property-rent-slip/property-rent-slip.component';
import { PaymentUserComponent } from './components/payment-user/payment-user.component';
import { PaymentUserListComponent } from './components/payment-user-list/payment-user-list.component';
import { NgImageSliderModule } from 'ng-image-slider';
import { AgmCoreModule } from '@agm/core';
import { ProductPreviewComponent } from './components/product-preview/product-preview.component';
import { TimezonePipe } from './pipes/timezone.pipe';
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
import { ListingPageHeadingComponent } from './components/listing-page-heading/listing-page-heading.component';
@NgModule({
  declarations: [
    LoginComponent,
    DashboardComponent,
    MasterComponent,
    SidenavComponent,
    HeaderComponent,
    ViewPlansComponent,
    AddPlanComponent,
    CreateUserComponent,
    CreateRoleComponent,
    ViewRoleComponent,
    UserReviewsComponent,
    UserBankDetailsComponent,
    UserPaytmVerifyComponent,
    BankHistoryComponent,
    UserListComponent,
    ServicesUserListComponent,
    CreateServicesUserComponent,
    UpdateServicesUserComponent,
    ServiceListComponent,
    UpdateServicesComponent,
    CreateBlogPostComponent,
    ViewBlogPostsComponent,
    BlogSinglePostComponent,
    ViewInternalUsersComponent,
    DataExportComponent,
    VisitUserFeedbackComponent,
    CreateUserInternalComponent,
    UserListInternalComponent,
    ByuserByinternalComponent,
    UserMobileUpdateComponent,
    UserEmailUpdateComponent,
    OfferBannerComponent,
    PropertyListComponent,
    InvoicePopupComponent,
    InvoiceDetailsComponent,
    PropertyRentSlipComponent,
    PaymentUserComponent,
    PaymentUserListComponent,
    ProductPreviewComponent,
    TimezonePipe,
    StateListComponent,
    DistrictListComponent,
    LocalityListComponent,
    UpdateLocalityComponent,
    SubLocalityListComponent,
    UpdateSubLocalityComponent,
    AreaGroupComponent,
    AddAreaGroupComponent,
    UpdateAreaGroupComponent,
    BookInvoiceComponent,
    ListingPageHeadingComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    FlexLayoutModule,
    MatCheckboxModule,
    NgMultiSelectDropDownModule,
    MatMenuModule,
    MatExpansionModule,
    NgxPaginationModule,
    NgbModule,
    MatAutocompleteModule,
    EditorModule,
    AgmCoreModule.forRoot({  
      apiKey: 'AIzaSyC2S5kHeGYkW9cL4d7_uxfauTBfQEtN4HA', libraries: ['places','drawing', 'geometry']
    }),  
    NgImageSliderModule,
    GuestModule
  ]
})
export class AdminModule { }
