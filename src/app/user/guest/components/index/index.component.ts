import { CommonService } from '../../services/common.service';
import { FormBuilder} from '@angular/forms';
import { Component, OnInit} from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';
import { LabelType } from '@angular-slider/ngx-slider';
import { Router } from '@angular/router';
import { GtmserviceService } from '../../services/gtmservice.service';
import { IndexPageService } from '../../services/index-page.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { map, startWith } from 'rxjs/operators';
import { UserLogsService } from '../../services/user-logs.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { environment } from 'src/environments/environment';
import { JwtService } from 'src/app/user/services/jwt.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserVisitPopupComponent } from '../../modals/user-visit-popup/user-visit-popup.component';
// import { BankDetailsModalComponent } from '../../modals/bank-details-modal/bank-details-modal.component';

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
  public product_length1:number=0;
  public toll_free=environment.toll_free;
  public city_name:any='';
  public city_name1:any='';
  public category:any={};
  public chattarpur:any;
  public chattarpur_length:number=0;
  public dropdownList: any = [];  
  private selectedItems:any=[];
  private amenityArray:any = [];
  public filteredOptions!: Observable<any[]>;
  public returnUrl:any;
  public isReadMore: boolean = true;

  searchForm = this.formBuilder.group({
    bathrooms: [''],
    bedrooms: [''],
    years: [''],
    area_unit: [''],
    search_type: ['rent'],
    build_name: [''],
    type: [''],
    location: [''],
    locality_data:[''],
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
  

  constructor(private titleService: Title,
    private CommonService:CommonService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private gtmService: GtmserviceService,
    private indexPageService: IndexPageService,
    private toastr: ToastrService,
    private jwtService: JwtService,
    private UserLogsService:UserLogsService,
    private router:Router
  ) { }

  ngOnInit(): void {this.titleService.setTitle('Home');
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
    
    if(this.jwtService.getToken()){
      this.returnUrl = this.router.url;
      this.jwtService.saveReturnURL(this.returnUrl);
    }else{
      setTimeout(() => {
        this.visit_user();
      }, 300000);

    }
    
  }
  visit_user(){
    let ip_address:any = this.UserLogsService.getIpAddress();
    let param={ip_address:ip_address}
    this.UserLogsService.user_feedback_details(param).subscribe(
      response => {
        let data:any=response;
        if(data.data.length<1){
          // this.openModal_feedback();
        }
      }, err => { 
        let Message =err.error.message;
      }
    );

  }
  
  // openModal_feedback() {
  //   const modalRef = this.modalService.open(UserVisitPopupComponent,
  //     {
  //       scrollable: true,
  //       windowClass: 'myCustomModalClass',
  //       // keyboard: false,
  //        backdrop: 'static'
  //     });
  //  modalRef.result.then((result) => {
  //     //console.log(result);
  //   }, (reason) => {
  //   });
  // }
  showText() {
    this.isReadMore = !this.isReadMore;
  }
  // fetch amenties advance tab
  getAmenities(){
    this.CommonService.getAmenities({ param: null }).subscribe(
      response => {
        this.amenties=response;
      }, err => { 
        let Message =err.error.message;
      }
    );
  }
  
  sendDataToGTM()  {
       
    const encodedUrl = this.router.url.toString().replace(/ /g, '%20');
    const finalUrl = encodedUrl.toString().replace(/&/g, '%26');    
    const data = {
      event: 'dataLayer',
      data: {
        delhi: {
          "No_Of_Properties": this.product_length
        },
        vasant_kunj: {
          "No_of_Properties": this.product_length
        },
        chattarpur: {
          "No_of_Properties": this.chattarpur_length
        }

      },
      action: 'Onload Action',
      label: 'Find Property',
      page_name:'Home Find Property',
      page_url:finalUrl,
      site_type:this.UserLogsService.getDeviceInfo(),
      // Additional data properties as needed
    };

    this.gtmService.pushToDataLayer(data);
    console.log(data);
  }
  // fetch  property data 
  get_property(){
    this.indexPageService.get_Property({ param: null }).subscribe(
      response => {
        // console.log(response);
        this.property=response;
        if(this.property.data.length>0){
          this.city_name=this.property.data['0'].city;
          this.product_length=this.property.data['0'].city_count;
        }else{
          this.city_name='Delhi';
          this.product_length=0;
        }
        if(this.property.Vasant_data.length>0){
          this.city_name1=this.property.Vasant_data['0'].city;
          this.product_length1=this.property.Vasant_data['0'].Vasant_count;
        }else{
          this.city_name1='VASANT KUNJ';
          this.product_length1=0;
        }
        if(this.property.Chattarpur_data.length>0){
          this.chattarpur=this.property.Chattarpur_data['0'].city;
          this.chattarpur_length=this.property.Chattarpur_data['0'].chattarpur_count;
        }else{
          this.chattarpur='Chattarpur';
          this.chattarpur_length=0;
        }
        this.sendDataToGTM();
      }, err => { 
        let Message =err.error.message;
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
          if(data?.data[0]?.length>0){
            for (let i = 0; i < data.data[0].length; i++) {
              this.dropdownList = this.dropdownList?.concat({ item_id: data.data[0][i].locality_id, item_text: data.data[0][i].locality});
            }
            this.filteredOptions = this.searchForm.controls.locality.valueChanges
              .pipe(
                startWith(''),
                map((value) => this._filter(value))
              );
              }if(data?.data[1]?.length>0){
                for (let i = 0; i < data.data[1].length; i++) {
                  this.dropdownList = this.dropdownList?.concat({ item_id: data.data[1][i].sub_locality_id, item_text: data.data[1][i].sub_locality});
                }
                this.filteredOptions = this.searchForm.controls.locality.valueChanges
                  .pipe(
                    startWith(''),
                    map((value) => this._filter(value))
                  );    
          }
          if(this.dropdownList.length>0){
            this.searchForm.patchValue({locality:this.dropdownList[0].item_text});
          }else{
            this.dropdownList=[];
            this.searchForm.patchValue({locality:''});
          }
        }, err => {   
        }
      );
    }else{
      this.dropdownList=[];
      this.searchForm.patchValue({locality:''});
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
   // searching locality name property 
   property_search_locality1(){
    this.router.navigate(['/product-listing'],{queryParams:{'locality':'Vasant Kunj'}})
  }
  selected_locality(data:any){
    this.searchForm.patchValue({locality:data});
  }
  navigate(): void{
    let data:any=this.searchForm.value;
    this.router.navigate(['/product-listing'],{queryParams:{'city':data.city,'locality':data.locality,'search_type':data.search_type}});
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

  customOptions: OwlOptions = {
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    autoplay: true,
    dots: true,
    navSpeed: 700,
    navText: ['&#8249', '&#8250;'],
    responsive: {
      0: {
        items: 1,
        loop: true 
      },
      480: {
        items: 1,
        loop: true
      },
      667: {
        items: 1,
        loop: true
      },
      1024: {
        items: 1,
        loop: true
      }
    },
    nav: true
  }

  alphaNumberOnly (e:any) {  // Accept only alpha numerics, not special characters 
    var regex = new RegExp("^[a-zA-Z0-9 ]+$");
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (regex.test(str)) {
        return true;
    }
    e.preventDefault();
    return false;
  }

  onPaste(e:any) {
    e.preventDefault();
    return false;
  }
}
