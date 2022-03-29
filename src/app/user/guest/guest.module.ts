import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GuestRoutingModule } from './guest-routing.module';
import { MasterComponent } from './components/master/master.component';
import { IndexComponent } from './components/index/index.component';
import { UserSharedModule } from '../user-shared/user-shared.module';
import { ContactComponent } from './components/contact/contact.component';
import { AboutComponent } from './components/about/about.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { NgxPaginationModule } from 'ngx-pagination';
import { ArticalsComponent } from './components/articals/articals.component';
import { TestimonialComponent } from './components/testimonial/testimonial.component';
import { HomepagefeatureComponent } from './components/homepagefeature/homepagefeature.component';
import { ProductListingComponent } from './components/product-listing/product-listing.component';
import { ProductCategoryComponent } from './components/product-category/product-category.component';
import { FeaturedPropertyComponent } from './components/featured-property/featured-property.component';
import { ProductPageComponent } from './components/product-page/product-page.component';
import { RecentlyViewedProductComponent } from './components/recently-viewed-product/recently-viewed-product.component';
import { AgmCoreModule } from '@agm/core'; 
import { NgImageSliderModule } from 'ng-image-slider';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { AmenitiesactivePipe } from './pipes/amenitiesactive.pipe';
import { SubscriptionPlansComponent } from './components/subscription-plans/subscription-plans.component';
import { LoginComponent } from './components/login/login.component';
import { LogoutComponent } from './components/logout/logout.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';
import { CompareComponent } from './components/compare/compare.component';
import { SafeUrlPipe } from './pipes/safe-url.pipe';
import { ProPaymentSummaryComponent } from './components/pro-payment-summary/pro-payment-summary.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginCheckComponent } from './modals/login-check/login-check.component';
import { VerifyMobileComponent } from './components/verify-mobile/verify-mobile.component';
import { InvoiceComponent } from './components/invoice/invoice.component';
import { MobileCheckComponent } from './modals/mobile-check/mobile-check.component';
import { MyPropertiesComponent } from './components/my-properties/my-properties.component';
import { RealEstateAgentComponent } from './components/real-estate-agent/real-estate-agent.component';
import { TermsConditionsComponent } from './components/terms-conditions/terms-conditions.component';
import { IpDisclaimerComponent } from './components/ip-disclaimer/ip-disclaimer.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { RegisterComponent } from './components/register/register.component';
import { PaymentSummaryComponent } from './components/payment-summary/payment-summary.component';
import { FixAppointmentComponent } from './modals/fix-appointment/fix-appointment.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { BlogSinglePostComponent } from './components/blog-single-post/blog-single-post.component';
import { RenderHtmlPipe } from './pipes/render-html.pipe';
import { BlogComponent } from './components/blog/blog.component';
import { TruncateTextPipe } from './pipes/truncate-text.pipe';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { BankDetailsModalComponent } from './modals/bank-details-modal/bank-details-modal.component';
import { UserReviewModalComponent } from './modals/user-review-modal/user-review-modal.component';
import { NgxStarRatingModule } from 'ngx-star-rating';
import { ClipboardModule } from 'ngx-clipboard';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { WhyChooseUsComponent } from './components/why-choose-us/why-choose-us.component';
import { FaqComponent } from './components/faq/faq.component';
import { ProductPreviewComponent } from './components/product-preview/product-preview.component';
import { TimezonePipe } from './pipes/timezone.pipe';
import { SignupComponent } from './components/signup/signup.component';
@NgModule({
  declarations: [
    MasterComponent,
    IndexComponent,
    ContactComponent,
    AboutComponent,
    ArticalsComponent,
    TestimonialComponent,
    HomepagefeatureComponent,
    ProductListingComponent,
    ProductCategoryComponent,
    FeaturedPropertyComponent,
    ProductPageComponent,
    RecentlyViewedProductComponent,
    AmenitiesactivePipe,
    SubscriptionPlansComponent,
    LoginComponent,
    LogoutComponent,
    WishlistComponent,
    CompareComponent,
    SafeUrlPipe,
    ProPaymentSummaryComponent,
    LoginCheckComponent,
    VerifyMobileComponent,
    InvoiceComponent,
    MobileCheckComponent,
    MyPropertiesComponent,
    RealEstateAgentComponent,
    TermsConditionsComponent,
    IpDisclaimerComponent,
    PrivacyPolicyComponent,
    RegisterComponent,
    PaymentSummaryComponent,
    FixAppointmentComponent,
    ProfileComponent,
    ResetPasswordComponent,
    BlogSinglePostComponent,
    RenderHtmlPipe,
    BlogComponent,
    TruncateTextPipe,
    BankDetailsModalComponent,
    UserReviewModalComponent,
    WhyChooseUsComponent,
    FaqComponent,
    ProductPreviewComponent,
    TimezonePipe,
    SignupComponent,
  ],
  imports: [
    CommonModule,
    CarouselModule,
    GuestRoutingModule,
    UserSharedModule,
    NgxPaginationModule,
    NgxSliderModule,
    FormsModule,
    ClipboardModule,
    ReactiveFormsModule,
    AgmCoreModule.forRoot({  
      apiKey: 'AIzaSyC2S5kHeGYkW9cL4d7_uxfauTBfQEtN4HA', libraries: ['places','drawing', 'geometry']
    }),  
    NgImageSliderModule,
    NgbModule,
    MatAutocompleteModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgxStarRatingModule
  ],
  exports: [
    RenderHtmlPipe
  ]
})
export class GuestModule { }
