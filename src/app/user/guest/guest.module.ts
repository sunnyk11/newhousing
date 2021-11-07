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
import { ProductListingDetailsComponent } from './components/product-listing-details/product-listing-details.component';
import { ProductPageComponent } from './components/product-page/product-page.component';
import { RecentlyViewedProductComponent } from './components/recently-viewed-product/recently-viewed-product.component';
import { AgmCoreModule } from '@agm/core';
import { NgImageSliderModule } from 'ng-image-slider';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { AmenitiesactivePipe } from './pipes/amenitiesactive.pipe';
import { ClipboardModule } from 'ngx-clipboard';
import { SubscriptionPlansComponent } from './components/subscription-plans/subscription-plans.component';
import { LoginComponent } from './components/login/login.component';
import { LogoutComponent } from './components/logout/logout.component';

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
    ProductListingDetailsComponent,
    ProductPageComponent,
    RecentlyViewedProductComponent,
    AmenitiesactivePipe,
    SubscriptionPlansComponent,
    LoginComponent,
    LogoutComponent,
  ],
  imports: [
    CommonModule,
    CarouselModule,
    GuestRoutingModule,
    UserSharedModule,
    NgxPaginationModule,
    NgxSliderModule,
    FormsModule,
    ReactiveFormsModule,
    AgmCoreModule.forRoot({  
      apiKey: 'AIzaSyC2S5kHeGYkW9cL4d7_uxfauTBfQEtN4HA', libraries: ['places']
    }),
    NgImageSliderModule,
    ClipboardModule, 
    NgxSliderModule,
    FormsModule,
    ReactiveFormsModule
  ],
})
export class GuestModule { }
