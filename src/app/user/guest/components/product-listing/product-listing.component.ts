import { ProductListingPageService } from '../../services/product-listing-page.service';
import { CommonService } from '../../services/common.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder} from '@angular/forms';
import { MapsAPILoader,AgmMap } from '@agm/core';
import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';
import { LabelType } from '@angular-slider/ngx-slider';

@Component({
  selector: 'app-product-listing',
  templateUrl: './product-listing.component.html',
  styleUrls: ['./product-listing.component.css']
})
export class ProductListingComponent implements OnInit {

  public displayStyle = "none";
  public amenties:any={};
  public property:any={};
  public property_length:number=0;
  public showLoadingIndicator:boolean= false;
  public build:string=' ';
  public area_unit:string=' ';
  public bedrooms:string=' ';
  public bathrooms:string=' ';
  public search:string=' ';
  public type:string=' ';
  public search_location:string=' ';
  public minimum:number=0;
  public maximumm:number=0;
  public year:any=' ';
  public search_amenties:any;
  public selectedItems:any=[];
  public amenityArray:any = [];
  public rent_range_slider:boolean= false;
  public buyyer_range_slider:boolean= false;
  public range_slider:boolean= true;

  @ViewChild("search")
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
    search_type: ['Select Availability'],
    build_name: [''],
    type: [''],
    location: [''],
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
  options_sales: Options = {
    step:5000,
    floor: 500000,
    ceil: 50000000,
    translate: (value: number, label: LabelType): string => {
      return '₹' + value.toLocaleString('en');
    }
  };

  constructor(
    private ProductListingPageService: ProductListingPageService,
    private CommonService: CommonService,
    private route:ActivatedRoute,
    private formBuilder: FormBuilder,
    private mapsAPILoader: MapsAPILoader,
    private ngZone:NgZone,
    ) {
      this.route.queryParams.subscribe((params) => {
          this.build=params.name;
          this.bedrooms=params.bedroom;
          this.bathrooms=params.bathroom;
          this.search=params.search;
          this.type=params.type;
          this.year=params.year;
          this.search_location=params.location;
          this.area_unit=params.area;
          this.minimum=params.minimum;
          this.maximumm=params.maximum;
          this.search_amenties=params.amenties;
      });
     }

  ngOnInit(): void {
    if(this.search){
       this.property_type_check_url();
    }
    if(this.minimum != null && this.maximumm !=null){
      this.searchForm.value.sliderControl[0]=this.minimum;
      this.searchForm.value.sliderControl[1]=this.maximumm;
      this.searchForm.patchValue({
        build_name:this.build,
        area_unit:this.area_unit,
        bedrooms:this.bedrooms,
        bathrooms:this.bathrooms,
        search_type:this.search,
        type:this.type,
        location:this.search_location,
      });
    }else{
      this.searchForm.value.sliderControl[0] = 5000;
      this.searchForm.value.sliderControl[1] = 50000000;
    }
    
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
    this.getProperty_listing(); 
    this.selectedItems = new Array<string>();
  }
  // fetch amenties advance tab
  getAmenities(){
    this.CommonService.getAmenities({ param: null }).subscribe(
      response => {
        console.log(response);
        this.amenties=response;
      }
    );
  }
  // fetch feature property 
  getProperty_listing(){
    this.showLoadingIndicator = true;
    this.ProductListingPageService.getProperty_listing({ param: null }).subscribe(
    response => {
      this.property=response;
      this.property_length=this.property.data.length;
      this.showLoadingIndicator = false;
    }
   );
  }
  openPopup(){
    this.displayStyle = "block";
  }  
  closePopup() {
    this.displayStyle = "none";
  }
  
  search_rent(): void{
    console.log(this.searchForm.value);
    console.log(this.amenityArray);
   }  
   
  onchangeAmenties(e:any,id:string){
    if(e.target.checked){
      this.selectedItems.push(id);
    }else{
      this.selectedItems= this.selectedItems.filter((m: string)=>m!=id);
    }
    this.amenityArray=this.selectedItems;
    console.log(this.amenityArray);
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
    if(this.searchForm.value.search_type=='Select Availability'){ 
      this.searchForm.value.sliderControl[0] = 5000;
      this.searchForm.value.sliderControl[1] = 50000000; 
      this.rent_range_slider=false;
      this.buyyer_range_slider=false;
      this.range_slider=true;
    }   
  }  
  property_type_check_url():void{
    if(this.search=='rent'){ 
      this.rent_range_slider=true;
      this.buyyer_range_slider=false;
      this.range_slider=false;
    }
    if(this.search=='sales'){ 
      this.rent_range_slider=false;
      this.buyyer_range_slider=true;
      this.range_slider=false;
    }  
  }
 
  reset_Search():void{
    this.searchForm.reset({
      bathrooms: [''],
      bedrooms: [''],
      years: [''],
      area_unit: [''],
      search_type: [''],
      build_name: [''],
      type: [''],
      location: [''],
      sliderControl: [[]]
    });
    
  }
}
