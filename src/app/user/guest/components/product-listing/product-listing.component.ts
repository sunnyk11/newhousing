import { ProductListingPageService } from '../../services/product-listing-page.service';
import { CommonService } from '../../services/common.service';
import { FormBuilder} from '@angular/forms';
import { MapsAPILoader,AgmMap } from '@agm/core';
import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';
import { LabelType } from '@angular-slider/ngx-slider';
import { environment } from 'src/environments/environment';
import { Router,ActivatedRoute } from '@angular/router';
import { JwtService } from 'src/app/user/services/jwt.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-listing',
  templateUrl: './product-listing.component.html',
  styleUrls: ['./product-listing.component.css']
})
export class ProductListingComponent implements OnInit {

  public displayStyle = "none";
  public amenties:any={};
  public property:any={};
  public showLoadingIndicator:boolean= false;
  public  year:any='';
  public search_amenties:any=[];
  public rent_range_slider:boolean= false;
  public buyyer_range_slider:boolean= false;
  public range_slider:boolean= true;
  public unique_amentites:any;
  public selectedItems:any=[];
  public siteURL=environment.siteURL;
  public data:any;
  public search_type:any;
  public minimum:any;
  public maximum:any;
  public e:any;
  public p:any;
  public ftpstring=environment.ftpURL;
  public product_copm:any={};
  public product_length:number=0;
  public propertyresultlength:boolean=false;
  
  private amenityArray:any = [];
  private search_amenties_convert: any=[];

  @ViewChild("searching")
  searchElementRef!: ElementRef;
  @ViewChild(AgmMap, { static: true })
  public agmMap!: AgmMap;
  zoom!: number;
  location:any;
  geoCoder:any;
  latCus=78.89;
  longCus=76.897;

  searchForm = this.formBuilder.group({
    bathrooms: [''],
    bedrooms: [''],
    years: [''],
    area_unit: [''],
    search_type: ['all'],
    build_name: [''],
    type: [''],
    location: [''],
    city:[''],
    property_status:['all'],
    sliderControl: [[]]
  });

  
  options: Options = {
    step:10000,
    floor: 5000,
    ceil: 50000000,
    translate: (value: number, label: LabelType): string => {
      return '₹' + value.toLocaleString('en');
    },
  };
  options_rent: Options = {
    step:1000,
    floor: 5000,
    ceil: 500000,
    translate: (value: number, label: LabelType): string => {
      return '₹' + value.toLocaleString('en');
    },
  };

  /* Sale feature Commented */
  /*options_sales: Options = {
    step:5000,
    floor: 500000,
    ceil: 50000000,
    translate: (value: number, label: LabelType): string => {
      return '₹' + value.toLocaleString('en');
    }
  }; */
  /* Sale feature Commented */

  constructor(
    private ProductListingPageService: ProductListingPageService,
    private CommonService: CommonService,
    private route:ActivatedRoute,
    private formBuilder: FormBuilder,
    private mapsAPILoader: MapsAPILoader,
    private ngZone:NgZone,
    private jwtService: JwtService,
    private toastr: ToastrService,
    private router:Router
    ) {
      this.param_query_check();     
     }

  ngOnInit(): void {  
    this.mapsAPILoader.load().then(() => {
      this.geoCoder = new google.maps.Geocoder();
    });
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(
        this.searchElementRef.nativeElement
      );
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();
          this.location = place.formatted_address;
          this.zoom = 15;
          this.searchForm.controls['location'].setValue(this.location);
        });
      });
    });
    this.getAmenities();
    this.selectedItems = new Array<string>();
  }
  // fetch amenties advance tab
  getAmenities(){
    this.CommonService.getAmenities({ param: null }).subscribe(
      response => {
        this.amenties=response;
      }
    );
  }
  openPopup(){
    this.displayStyle = "block";
  }  
  closePopup() {
    this.displayStyle = "none";
  }
  
  param_query_check(){
    this.route.queryParams.subscribe((params) => {
      if(params.minimum != null && params.maximum != null){
        this.searchForm.patchValue({
          build_name:params.name,
          area_unit:params.area_unit,
          bedrooms:params.bedrooms,
          bathrooms:params.bathrooms,
          search_type:params.search_type,
          type:params.type,
          location:params.location,
          years:params.years,
          city:params.city,
          sliderControl:[Number(params.minimum),Number(params.maximum)]
        });
        this.search_type=params.search_type;
          if(params.amenties != null){  
          this.search_amenties=params.amenties;      
              if(this.search_amenties.length>0){
                for (var i = 0; i < this.search_amenties.length; i++){
                  this.search_amenties_convert.push(parseInt(this.search_amenties[i]));
                }
                this.amenityArray=this.search_amenties_convert;
              }
          }
        this.property_type_check_url();
        this.onsearch();
       }else if(params.category != null){
        this.searchForm.controls['type'].setValue(params.category);         
        this.searchForm.value.sliderControl[0] = 5000;
        this.searchForm.value.sliderControl[1] = 50000000;    
        this.onsearch();
       }else if(params.cities != null){
        this.searchForm.controls['city'].setValue(params.cities);         
        this.searchForm.value.sliderControl[0] = 5000;
        this.searchForm.value.sliderControl[1] = 50000000;
        this.onsearch();
       }
       else{
        this.searchForm.value.sliderControl[0] = 5000;
        this.searchForm.value.sliderControl[1] = 50000000;
        this.onsearch();
       }
    });
  }
  onsearch(): void{  
    this.showLoadingIndicator =true;
    this.propertyresultlength=false;
    this.product_length=0;
    let param={data:this.searchForm.value,amenities:this.amenityArray}
    if(this.jwtService.getToken()){
      this.ProductListingPageService.login_product_details(param).subscribe(
        response => {
          let data:any=response;
          this.property=response;
          this.product_length=data.data.length;
          if(data.data.length < 1){
            this.propertyresultlength = true;
          }
          this.showLoadingIndicator = false;
        }, err => {
        }
      );

    }else{
      this.ProductListingPageService.product_details(param).subscribe(
        response => {
          let data:any=response;
          this.property=response;
          this.product_length=data.data.length;
          if(data.data.length < 1){
            this.propertyresultlength = true;
          }
          this.showLoadingIndicator = false;
        }, err => { 
          this.showLoadingIndicator = false;
        }
      );
    }
    this.wishlist_refresh();
    this.pro_comp_refresh();
    this.closePopup();
  } 
   
  navigate(): void{
    let data:any=this.searchForm.value;
    this.product_length=0;
    this.router.navigate(['/product-listing'],{queryParams:{'name':data.build_name,'city':data.city,'type':data.type,'search_type':data.search_type,'area_unit':data.area_unit,'years':data.years,'bedrooms':data.bedrooms,'bathrooms':data.bathrooms,'minimum':data.sliderControl[0],'maximum':data.sliderControl[1],'location':data.location,amenties:this.amenityArray}});
  } 
  onchangeAmenties(e:any,id:any){
    if(e.target.checked){
      this.search_amenties_convert.push(id);
      const expected = new Set();
      const unique = this.search_amenties_convert.filter((item: any) => !expected.has(JSON.stringify(item)) ? expected.add(JSON.stringify(item)) : true);
      this.unique_amentites=unique;
      this.amenityArray=this.unique_amentites;
    }else{
      const index: number = this.search_amenties_convert.indexOf(id);
      if (index !== -1) {
        this.search_amenties_convert.splice(index, 1);
        this.amenityArray=this.search_amenties_convert;
      }
    }
  }  
  property_status(){
    this.onsearch();
  }
  property_type():void{
    if(this.searchForm.value.search_type=='rent'){ 
      this.searchForm.value.sliderControl[0] = 5000;
      this.searchForm.value.sliderControl[1] = 500000;
      this.searchForm.controls['search_type'].setValue('rent');
      this.rent_range_slider=true;
      this.buyyer_range_slider=false;
      this.range_slider=false;
    }
    if(this.searchForm.value.search_type=='sales'){ 
      this.searchForm.value.sliderControl[0] = 500000;
      this.searchForm.value.sliderControl[1] = 50000000;
      this.searchForm.controls['search_type'].setValue('sales');
      this.rent_range_slider=false;
      this.buyyer_range_slider=true;
      this.range_slider=false;
    }
    if(this.searchForm.value.search_type=='all'){ 
      this.searchForm.value.sliderControl[0] = 5000;
      this.searchForm.value.sliderControl[1] = 50000000; 
      this.rent_range_slider=false;
      this.buyyer_range_slider=false;
      this.range_slider=true;
    }   
  }  
  property_type_check_url():void{
    if(this.search_type == 'rent'){ 
      this.rent_range_slider=true;
      this.buyyer_range_slider=false;
      this.range_slider=false;
    }
    if(this.search_type == 'sales'){ 
      this.rent_range_slider=false;
      this.buyyer_range_slider=true;
      this.range_slider=false;
    }  
    if(this.search_type=='all'){ 
      this.rent_range_slider=false;
      this.buyyer_range_slider=false;
      this.range_slider=true;
    } 
  }
  reset_Search():void{
    this.searchForm.setValue({
      bathrooms: '',
      bedrooms: '',
      years: '',
      area_unit:'',
      search_type: 'all',
      build_name: '',
      type: '',
      location: '',
      city:'',
      property_status:'all',
      sliderControl: [5000,50000000]
    });    
    this.search_amenties=[];
    this.amenityArray=[];
    this.product_length=0;
    this.router.navigate(['/product-listing']);
    this.property_type();
    this.onsearch();
  }
  
  
  // property compare
  product_comp(id:number){
    let param={id:id}
    if(this.jwtService.getToken()){
      this.CommonService.product_comp({param}).subscribe(
      response => {
        this.product_copm=response;
        this.product_length=0;
        this.onsearch();
        if(this.product_copm.data.length>4){
          this.toastr.info('Compare are the Full...!!!', 'Property', {
            timeOut: 3000,
          });
        }else{
          this.toastr.success('Added To compare Successfully', 'Property', {
            timeOut: 3000,
          });
        }
      }, err => { 
        this.showLoadingIndicator = false;
        let Message =err.error.message;
        this.toastr.error(Message, 'Something Error', {
          timeOut: 3000,
        });
      }
     );
    }else{
      this.redirect_to_login();
    }
  }
  // wishlist add 
  wishlist_added(id: number){
    let param={id:id}
    if(this.jwtService.getToken()){
      this.CommonService.wishlist_addd({param}).subscribe(
      response => {
        this.product_length=0;
        this.onsearch();
      }, err => { 
        this.showLoadingIndicator = false;
        let Message =err.error.message;
        this.toastr.error(Message, 'Something Error', {
          timeOut: 3000,
        });
      }
     );
    }
    else{
      this.redirect_to_login();
    }
  }
  // wishlist delete
  wishlist_remove(id: number){
    let param={id:id}
    if(this.jwtService.getToken()){
      this.CommonService.wishlist_remove({param}).subscribe(
      response => {
        this.product_length=0;
        this.onsearch();
      }, err => { 
        this.showLoadingIndicator = false;
        let Message =err.error.message;
        this.toastr.error(Message, 'Something Error', {
          timeOut: 3000,
        });
      }
     );
    }else{
      this.redirect_to_login();
    }
  }
  
   // pricre convert functionalty
   Price_convert(num: number) {
    if (num >= 1000000000) {
       return (num / 1000000000).toFixed(2).replace(/\.0$/, '') + 'G';
    }
    if (num >= 10000000) {
      return (num / 10000000).toFixed(2).replace(/\.0$/, '') + 'Crore';
    }
    if (num >= 100000) {
      return (num / 100000).toFixed(2).replace(/\.0$/, '') + 'Lac';
    }
    if (num >= 1000) {
      this.e=num;
      var t = (this.e = this.e ? this.e.toString() : "").substring(this.e.length - 3)
      , n = this.e.substring(0, this.e.length - 3);
    return "" !== n && (t = "," + t),
      n.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + t
    }
    return num;
  }
  
  sub_navigate(id:number,name:string,city:string){
    this.product_length=0;
    this.router.navigate(['/product-details'],{queryParams:{'id':id,'name':name,'city':city}})
  }
  
  redirect_to_login(): void {
    this.router.navigate(['/login'])
  }
  
  // wishlist refreh functionalty 
  wishlist_refresh(){
    this.CommonService.emit<string>('true');
  } 
  // product comapre refresh function 
  pro_comp_refresh(){
    this.CommonService.pro_comp_emit<string>('true');
  } 
  // carosule image
  customOptions: OwlOptions = {
   loop: true,
   mouseDrag: false,
   touchDrag: false,
   pullDrag: false,
   dots: false,
   navSpeed: 700,
   navText: ['<span class="outer_slider"><i class="flaticon-left-arrow-1 left"></i></span> ', '<span class="outer_slider"><i class="flaticon-right-arrow right"></i></span>'],
   responsive: {
     0: {
       items: 1
     },
     400: {
       items: 1
     },
     740: {
       items: 1
     },
     940: {
       items: 1
     },
     1050: {
       items: 1
     }
   },
   nav: true
 }
}
