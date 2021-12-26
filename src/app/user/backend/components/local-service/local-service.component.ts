import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LocalServiceProviderService } from '../../services/local-service-provider.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { CommonService } from '../../services/common.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-local-service',
  templateUrl: './local-service.component.html',
  styleUrls: ['./local-service.component.css']
})
export class LocalServiceComponent implements OnInit {

  public showLoadingIndicator: boolean =false;
  public ftpstring=environment.ftpURL;
  public search_data:any={};
  public p:number=0;
  public d:number=0;
  public result:any;
  public star_rating: number=0;
  public rating_data: any;
  public area_service_data:any;
  public review_details: any;
  public UserDeatils:any;
  public review_data:any;
  public state_data:any={};
  public locality_data:any={};
  public district_data:any={};
  public dropdown_service:any=[];
  public dropdown_sublocality:any=[];
  public dropdownList:any=[]; 
  public disabled:boolean=true;
  dropdownSettings_sub_locality!: IDropdownSettings;
  dropdownSettings_locality!: IDropdownSettings;
  dropdownSettings!: IDropdownSettings;
  public filteredOptions!: Observable<any[]>;
  
  
  Service_form = new FormGroup({
    locality: new FormControl('', Validators.required),
    locality_data: new FormControl('', Validators.required),
    sub_locality: new FormControl('', Validators.required),
    service: new FormControl('', Validators.required)
  });
  review_form = new FormGroup({
    stars: new FormControl('', Validators.required),
    user_id:new FormControl('', Validators.required),
    content: new FormControl('', Validators.required),
    s_user_id: new FormControl('', Validators.required)
  });
  

  constructor(
    private LocalServiceProviderService:LocalServiceProviderService,
    private toastr: ToastrService,
    private CommonService:CommonService
  ) { }

  ngOnInit(): void {
    this.dropdownSettings = {
      singleSelection: true,
      idField: 'service_id',
      textField: 'service_name',
      enableCheckAll: false,
      itemsShowLimit: 4,
      allowSearchFilter: true,
      closeDropDownOnSelection:true,
      noDataAvailablePlaceholderText: "Service not availabale ",
      maxHeight: 250
    };     
    this.dropdownSettings_locality = {
      singleSelection: true,
      idField: 'locality_id',
      textField: 'locality_text',
      enableCheckAll: false,
      itemsShowLimit: 1, 
      allowSearchFilter: true,
      closeDropDownOnSelection:true,
      noDataAvailablePlaceholderText: "Locality not Availabale",
      maxHeight: 250,
      clearSearchFilter:true,
      showSelectedItemsAtTop:true,
    };    
    this.dropdownSettings_sub_locality = {
      singleSelection: true,
      idField: 'sub_locality_id',
      textField: 'sub_locality_text',
      enableCheckAll: false,
      itemsShowLimit: 1,
      allowSearchFilter: true,
      closeDropDownOnSelection:true,
      noDataAvailablePlaceholderText: "Sub Locality not Availabale",
      maxHeight: 250,
    };
    this.on_search();
    this.area_service();
    this.filteredOptions = this.Service_form.controls.locality_data.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );
  }
  
  selected_locality(data:any){
    this.disabled=true;
    this.Service_form.patchValue({locality:data.item_id});
    let param = { Locality_id:data.item_id}
    this.CommonService.get_sub_locality(param).subscribe(
      response => {
        let data:any=response;
        this.dropdown_sublocality=[];
        this.Service_form.patchValue({sub_locality:''});
        if(data.data.length<1){
          this.dropdown_sublocality=[];
          this.Service_form.patchValue({
            sub_locality:''
          });
        }else{
          for (let i = 1; i < data.data.length; i++) {
            this.dropdown_sublocality = this.dropdown_sublocality?.concat({ sub_locality_id: data.data[i].sub_locality_id, sub_locality_text: data.data[i].sub_locality});
          }
          this.disabled=false;
        }
      }
    );
    
  }
  get_locality(value:any){
    if(value.length>2){
      this.CommonService.get_search_locality(value).subscribe(
        response => {
          let data:any=response;
          this.dropdownList=[];
          if(data?.data[0]?.length>0){
            for (let i = 0; i < data.data[0].length; i++) {
              this.dropdownList = this.dropdownList?.concat({ item_id: data.data[0][i].locality_id, item_text: data.data[0][i].locality});
            }
            this.filteredOptions = this.Service_form.controls.locality_data.valueChanges
              .pipe(
                startWith(''),
                map((value) => this._filter(value))
              );
          }else{
            this.dropdownList=[];
            this.dropdown_sublocality=[];
            this.Service_form.patchValue({locality:'',sub_locality:''});
          }
         
        }, err => {   
        }
      );
    }else{
      this.dropdownList=[];
      this.dropdown_sublocality=[];
      this.Service_form.patchValue({locality:'',sub_locality:''});
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
  
  // get_state(){
  //   this.showLoadingIndicator = true;
  //   this.CommonService.get_state({ param: null }).pipe().subscribe(
  //     response=> {
  //       console.log(response);
  //       this.state_data=response;
  //       this.showLoadingIndicator = false;
  //     },
  //     err => {
  //      this.showLoadingIndicator = false;
  //     }
  //   )
  // }
  
  // onchange_state(id:any){
  //   let param = { id: id }
  //   this.CommonService.get_district_byid(param).subscribe(
  //     response => {
  //       console.log(response);
  //       this.district_data=[];
  //       this.dropdown_locality=[];
  //       this.dropdown_sublocality=[];
  //       this.Service_form.patchValue({district:''});
  //       this.Service_form.patchValue({locality:''});
  //       this.Service_form.patchValue({sub_locality:''});
  //       this.district_data=response;
  //     },
  //     err => {
  //     }
  //   );
  // }
  // onchange_district(id:any){
  //   let param = { id: id }
  //   this.CommonService.get_locality_byid(param).subscribe(
  //     response => {
  //       console.log(response);
  //       this.locality_data=response;
  //       this.dropdown_locality=[];
  //       this.dropdown_sublocality=[];
  //       this.Service_form.patchValue({locality:''});
  //       this.Service_form.patchValue({sub_locality:''});
  //       let data:any =response;
  //       for (let i = 1; i < data.data.length; i++) {
  //         this.dropdown_locality = this.dropdown_locality?.concat({ locality_id: data.data[i].locality_id, locality: data.data[i].locality});
  //       }
  //     },
  //     err => {
  //     }
  //   );
  // }
  
  on_search(){
    if(this.Service_form.value.sub_locality.length>0){
      this.Service_form.value.sub_locality=this.Service_form.value.sub_locality[0].sub_locality_id;
    }
    if(this.Service_form.value.service.length>0){
      this.Service_form.value.service=this.Service_form.value.service[0].service_id;
    }
    this.showLoadingIndicator = true;
    this.LocalServiceProviderService.searching_area(this.Service_form.value).subscribe(
      response => {
        this.search_data = response;
        this.showLoadingIndicator = false;
      },
      err => {
        this.showLoadingIndicator = false;
      }
    );
  } 
  
  submit_review():void{
    let param={data:this.review_form.value}
    if (this.review_form.value.stars) {
      if(this.review_form.value.content){
        this.LocalServiceProviderService.service_user_reviews(param).subscribe(
          response => {
            let data:any=response;
            this.showLoadingIndicator = false;
            this.toastr.success('Successfuly Reviews For Service');
            this.user_details(data.data);
          },
          err => {
            this.showLoadingIndicator = false;
            let errorMessage:any = err.error.errors;
            this.toastr.error(errorMessage, 'Something Error', {
              timeOut: 3000,
            });
          }
        );
      }else{
        this.toastr.error("Please Enter Review description.");
      }
    }else{
      this.toastr.error("Please Select Stars Rating.");
    }

  }
  // fetch area service
  // area_service():void{
  //   this.showLoadingIndicator = true;
  //   this.LocalServiceProviderService.getarea_service({ param: null }).pipe().subscribe(
  //     response => {
  //       console.log(response);
  //       this.area_service_data=response;
  //       this.showLoadingIndicator = false;
  //     },
  //     err => {
  //      this.showLoadingIndicator = false;
  //     }
  //   )
  // }
  
  area_service():void{
    this.showLoadingIndicator = true;
    this.LocalServiceProviderService.getarea_service({ param: null }).pipe().subscribe(
      response => {
        let data:any=response;
        this.area_service_data=response;
        this.dropdown_service=[];
        for (let i = 0; i < data.data.length; i++) {
          this.dropdown_service = this.dropdown_service.concat({service_id: data.data[i].service_id, service_name: data.data[i].service_name});
          this.showLoadingIndicator = false;       
        }
      },
      err => {
       this.showLoadingIndicator = false;
      }
    )
  }
  // user details fetch 
  user_details(id:any):void{
    let param = { user_id: id }
    this.review_form.reset();
    this.LocalServiceProviderService.getarea_user_details(param).pipe().subscribe(
      response => {
        let data:any=response;
        this.UserDeatils=data.user_data;
        
        this.review_details= data.avg_reviews;
        this.review_data= data.review_data;
        
        this.showLoadingIndicator = false; 
        this.review_form.patchValue({
          s_user_id:data.user_data.user_id,
        });
        if(data.user_review != null){
          this.review_form.patchValue({
            s_user_id:data.user_review.s_user_id,
            content:data.user_review.content,
            user_id:data.user_review.user_id,
            stars:data.user_review.stars,
          });
        }
        this.on_search();
      },
      err => {
       this.showLoadingIndicator = false;
      }
    )
  } 
  rating_details(stars:any,service_id:any){
    let param = { star:stars,service_id: service_id }
    this.star_rating=stars;
    this.LocalServiceProviderService.star_ratingbyId(param).pipe().subscribe(
      (data: any) => {
        this.rating_data= data.rating_data;
      },
      err => {
       this.showLoadingIndicator = false;
      }
    )
  }
  // get_locality() {
  //   this.CommonService.get_locality({ param: null }).subscribe(
  //     response => {
  //       let data:any=response;
  //       console.log(data);
  //       if(data.data.length<1){
  //         this.dropdown_sublocality=[];
  //         this.Service_form.patchValue({sub_locality:''});
  //       }else{
  //         for (let i = 1; i < data.data.length; i++) {
  //           this.dropdown_locality = this.dropdown_locality.concat({locality_id: data.data[i].locality_id, locality_text:  data.data[i].locality}); 
  //         }
  //       }
  //     },
  //     (err: any) => {
  //     }
  //   );
  // }
  onchange_locality(id: any) {
    if(id.locality_id>0){
    let param = { Locality_id:id.locality_id}
    this.CommonService.get_sub_locality(param).subscribe(
      response => {
        let data:any=response;
        this.dropdown_sublocality=[];
        this.Service_form.patchValue({sub_locality:''});
        if(data.data.length<1){
          this.dropdown_sublocality=[];
          this.Service_form.patchValue({
            sub_locality:''
          });
        }else{
          for (let i = 1; i < data.data.length; i++) {
            this.dropdown_sublocality = this.dropdown_sublocality?.concat({ sub_locality_id: data.data[i].sub_locality_id, sub_locality_text: data.data[i].sub_locality});
          }
          }
      }
    );      
    }else{
      this.dropdown_sublocality=[];
      this.Service_form.patchValue({
        locality:'',
        sub_locality:''
      });
    }
  }
  onItemDeSelect(value:any){
    this.dropdown_sublocality=[];
    this.Service_form.patchValue({
      locality:'',
      sub_locality:''
    });
  }
  
  onchange_sublocality(id: any) {
    if(id.length>0){     
    }else{
      this.dropdown_sublocality=[];
      this.Service_form.patchValue({
        sub_locality:''
      });
    }
  }
  
  onchange_services(id: any) {
    if(id.length>0){     
    }else{
      this.dropdown_sublocality=[];
      this.Service_form.patchValue({
        service:''
      });
    }
  }

}
function id(id: any) {
  throw new Error('Function not implemented.');
}

