import { CommonService } from '../../services/common.service';
import { FormBuilder} from '@angular/forms';
import { MapsAPILoader,AgmMap } from '@agm/core';
import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';
import { LabelType } from '@angular-slider/ngx-slider';
import { Router } from '@angular/router';
import { IndexPageService } from '../../services/index-page.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  public amenties:any={};
  public rent_range_slider:boolean= true;
  public buyyer_range_slider:boolean= false;
  public property:any={};
  public product_length:number=0;
  public city_name:any=' ';

  
  private selectedItems:any=[];
  private amenityArray:any = [];

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
    search_type: ['rent'],
    build_name: [''],
    type: [''],
    location: [''],
    city:[''],
    sliderControl: [[]]
  });
  
  options: Options = {
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
    private CommonService:CommonService,
    private formBuilder: FormBuilder,
    private mapsAPILoader: MapsAPILoader,
    private indexPageService: IndexPageService,
    private ngZone:NgZone,
    private toastr: ToastrService,
    private router:Router
  ) { }

  ngOnInit(): void {
    this.searchForm.value.sliderControl[0] = 5000;
    this.searchForm.value.sliderControl[1] = 500000;
    this.getAmenities();
    this.get_property();
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
    this.selectedItems = new Array<string>();
  }
  // fetch amenties advance tab
  getAmenities(){
    this.CommonService.getAmenities({ param: null }).subscribe(
      response => {
        this.amenties=response;
      }, err => { 
        let Message =err.error.message;
        this.toastr.error(Message, 'Something Error', {
          timeOut: 3000,
        });
      }
    );
  }
  // fetch  property data 
  get_property(){
    this.indexPageService.get_Property({ param: null }).subscribe(
      response => {
        this.property=response;
        console.log(response);
        this.city_name=this.property.data['0'].city;
        this.product_length=this.property.data['0'].city_count;
      }, err => { 
        let Message =err.error.message;
        this.toastr.error(Message, 'Something Error', {
          timeOut: 3000,
        });
      }
     );
  }
  location_fetch():void{
    this.toastr.info('Only For Delhi Location','', {
      timeOut: 2000,
      positionClass: 'toast-bottom-right',
    });
  }
  
  // searching city name property 
  property_search(city:string){
    this.router.navigate(['/product-listing'],{queryParams:{'city':city}})
  }
  navigate(): void{
    let data:any=this.searchForm.value;
    this.router.navigate(['/product-listing'],{queryParams:{'name':data.build_name,'city':data.city,'type':data.type,'search_type':data.search_type,'area_unit':data.area_unit,'years':data.years,'bedrooms':data.bedrooms,'bathrooms':data.bathrooms,'minimum':data.sliderControl[0],'maximum':data.sliderControl[1],'location':data.location,amenties:this.amenityArray}});
  }  
  onchangeAmenties(e:any,id:string){
    if(e.target.checked){
      this.selectedItems.push(id);
    }else{
      this.selectedItems= this.selectedItems.filter((m: string)=>m!=id);
    }
    this.amenityArray=this.selectedItems;
  }
  
  rent_price_fun(){
    this.searchForm.value.sliderControl[0] = 5000;
    this.searchForm.value.sliderControl[1] = 500000;
    this.searchForm.controls['search_type'].setValue('rent');
    this.rent_range_slider=true;
    this.buyyer_range_slider=false;
  }
  buyyer_price_fun(){
    this.searchForm.value.sliderControl[0] = 500000;
    this.searchForm.value.sliderControl[1] = 50000000;
    this.searchForm.controls['search_type'].setValue('sales');
    this.rent_range_slider=false;
    this.buyyer_range_slider=true;
  }
  
}
