import { CommonService } from '../../services/common.service';
import { FormBuilder} from '@angular/forms';
import { MapsAPILoader,AgmMap } from '@agm/core';
import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';
import { LabelType } from '@angular-slider/ngx-slider';
import { Router } from '@angular/router';
import { IndexPageService } from '../../services/index-page.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
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
  public city_name:any='';
  public category:any={};
  public chattarpur:any;
  public chattarpur_length:number=0;
  public dropdownList: any = [];  
  private selectedItems:any=[];
  private amenityArray:any = [];
  public filteredOptions!: Observable<any[]>;

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
    city:['Delhi'],
    locality:[''],
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
  
  /* Sale feature Commented */
  /* options_sales: Options = {
    step:5000,
    floor: 500000,
    ceil: 50000000,
    translate: (value: number, label: LabelType): string => {
      return '₹' + value.toLocaleString('en');
    }
  }; */
  /* Sale feature Commented */
  

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
    this.productcategory();
    this.selectedItems = new Array<string>();
    this.filteredOptions = this.searchForm.controls.locality.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );
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
        this.city_name=this.property.data['0'].city;
        this.product_length=this.property.data['0'].city_count;
        this.chattarpur=this.property.Chattarpur_data.city;
        this.chattarpur_length=this.property.Chattarpur_data.chattarpur_count;
      }, err => { 
        let Message =err.error.message;
        this.toastr.error(Message, 'Something Error', {
          timeOut: 3000,
        });
      }
     );
  }
  // location_fetch():void{
  //   this.toastr.info('Only For Delhi Location','', {
  //     timeOut: 2000,
  //     positionClass: 'toast-bottom-right',
  //   });
  // }
  // fetch productcategory advance tab
  productcategory(){
    this.CommonService.getproductcategory({ param: null }).subscribe(
      response => {
        this.category=response;
      }, err => { 
      }
    );
  } 
  get_locality(value:any){
    if(value.length>2){
      this.CommonService.get_common_area_data(value).subscribe(
        response => {
          let data:any=response;
          this.dropdownList=[];
          if(data.data[0].length>0){
            for (let i = 0; i < data.data[0].length; i++) {
              this.dropdownList = this.dropdownList?.concat({ item_id: data.data[0][i].locality_id, item_text: data.data[0][i].locality});
            }
            this.filteredOptions = this.searchForm.controls.locality.valueChanges
              .pipe(
                startWith(''),
                map((value) => this._filter(value))
              );
              }if(data.data[1].length>0){
                for (let i = 1; i < data.data[1].length; i++) {
                  this.dropdownList = this.dropdownList?.concat({ item_id: data.data[1][i].sub_locality_id, item_text: data.data[1][i].sub_locality});
                }
                this.filteredOptions = this.searchForm.controls.locality.valueChanges
                  .pipe(
                    startWith(''),
                    map((value) => this._filter(value))
                  );
          }
        }, err => {   
        }
      );
    }else{
      this.dropdownList=[]; 
      this.filteredOptions = this.searchForm.controls.locality.valueChanges
      .pipe(
        startWith(''),
        map((value) => this._filter(value))
      );
    }
  }

  private _filter(value: any): string[] {
    if (value.item_text) {
      const filterValue = value.item_text.toLowerCase();
      return this.dropdownList?.filter((option: any) => option.item_text.toLowerCase().includes(filterValue));
    }
    else {
      const filterValue = value.toLowerCase();
      return this.dropdownList?.filter((option: any) => option.item_text.toLowerCase().includes(filterValue));
    }
  }
  
  // searching city name property 
  property_search(){
    this.router.navigate(['/product-listing'],{queryParams:{'cities':'Delhi'}})
  }
   // searching locality name property 
  property_search_locality(){
    this.router.navigate(['/product-listing'],{queryParams:{'locality':'Chattarpur'}})
  }
  navigate(): void{
    if(this.searchForm.value.locality.length<3){
      this.searchForm.patchValue({locality:''});
    }
    let data:any=this.searchForm.value;
    this.router.navigate(['/product-listing'],{queryParams:{'city':data.city,'locality':data.locality,'type':data.type,'search_type':data.search_type,'minimum':data.sliderControl[0],'maximum':data.sliderControl[1]}});
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

  /*buyyer_price_fun(){
    this.searchForm.value.sliderControl[0] = 500000;
    this.searchForm.value.sliderControl[1] = 50000000;
    this.searchForm.controls['search_type'].setValue('sales');
    this.rent_range_slider=false;
    this.buyyer_range_slider=true;
  }*/
  
  displayFn(value?: any) {
    return value ? this.dropdownList.find((option: any) => option.item_id === value.item_id).item_text : undefined;
  }
}
