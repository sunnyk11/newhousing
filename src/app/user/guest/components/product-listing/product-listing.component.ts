import { ProductListingPageService } from '../../services/product-listing-page.service';
import { CommonService } from '../../services/common.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder} from '@angular/forms';
import { MapsAPILoader,AgmMap } from '@agm/core';
import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';
import { LabelType } from '@angular-slider/ngx-slider';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { ClipboardService } from 'ngx-clipboard'

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
  public  year:any='';
  public search_amenties:any=[];
  public rent_range_slider:boolean= false;
  public buyyer_range_slider:boolean= false;
  public range_slider:boolean= true;
  public unique_amentites:any;
  public  selectedItems:any=[];
  public siteURL=environment.siteURL;
  public data:any;
  public amenties_convert:any;
  public search_type:any;
  public minimum:any;
  public maximum:any;
  shareableurl: any;

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
    search_type: ['Select Availability'],
    build_name: [''],
    type: [''],
    location: [''],
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
    private router:Router,
    private _clipboardService: ClipboardService
    ) {
      this.route.queryParams.subscribe((params) => {
        if(params.data != null){
          this.data=JSON.parse(atob(params.data));
          this.search_type= this.data.search_type;
          this.minimum=this.data.sliderControl[0];
          this.maximum=this.data.sliderControl[1];
            if(params.amenties.length>0){  
              console.log(params.amenties);          
            this.amenties_convert=atob(params.amenties);  
            this.search_amenties=this.amenties_convert.split(',');
            }
         }
      });
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

    if(this.search_type != null){
       this.property_type_check_url();
    }
    if(this.search_amenties.length>0){
      for (var i = 0; i < this.search_amenties.length; i++){
        this.search_amenties_convert.push(parseInt(this.search_amenties[i]));
      }
      this.amenityArray=this.search_amenties_convert;
    }
    if(this.minimum != null && this.maximum){
      this.searchForm.value.sliderControl['0']=Number(this.data.sliderControl[0]);
      this.searchForm.value.sliderControl['1']=Number(this.data.sliderControl[1]);
      this.searchForm.patchValue({
        build_name:this.data.build_name,
        area_unit:this.data.area_unit,
        bedrooms:this.data.bedrooms,
        bathrooms:this.data.bathrooms,
        search_type:this.data.search_type,
        type:this.data.type,
        location:this.data.location,
        years:this.data.years,
      });
      this.onsearch();
    }else{
      this.searchForm.value.sliderControl[0] = 5000;
      this.searchForm.value.sliderControl[1] = 50000000;
      this.onsearch();
    }
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
  onsearch(): void{  
    let param={data:this.searchForm.value,amenities:this.amenityArray}
    this.ProductListingPageService.product_details(param).subscribe(
      response => {
        this.property=response;
        this.property_length=this.property.data.length;
        this.showLoadingIndicator = false;
      }
    );
    this.closePopup();
  } 
  
  navigate(): void{
    let data:any= this.searchForm.value;
    let url='product-listing?data=';
    this.shareableurl=environment.siteURL+url+btoa(JSON.stringify(data))+'&amenties='+btoa(this.amenityArray);
    console.log(this.shareableurl);
    this._clipboardService.copy(this.shareableurl);
    // document.execCommand('copy');
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
    if(this.searchForm.value.search_type=='Select Availability'){ 
      this.searchForm.value.sliderControl[0] = 5000;
      this.searchForm.value.sliderControl[1] = 50000000; 
      this.rent_range_slider=false;
      this.buyyer_range_slider=false;
      this.range_slider=true;
    }   
  }  
  property_type_check_url():void{
    if(this.data.search_type=='rent'){ 
      this.rent_range_slider=true;
      this.buyyer_range_slider=false;
      this.range_slider=false;
    }
    if(this.data.search_type=='sales'){ 
      this.rent_range_slider=false;
      this.buyyer_range_slider=true;
      this.range_slider=false;
    }  
  }
  reset_Search():void{
    window.location.href=this.siteURL+"product-listing"; 
  }
}
