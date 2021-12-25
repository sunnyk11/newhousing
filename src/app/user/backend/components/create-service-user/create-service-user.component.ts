import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LocalServiceProviderService } from '../../services/local-service-provider.service';
import { ToastrService } from 'ngx-toastr';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { CommonService } from '../../services/common.service';
import { Observable } from 'rxjs';
import { Router,ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-create-service-user',
    templateUrl: './create-service-user.component.html',
    styleUrls: ['./create-service-user.component.css']
  })
export class CreateServiceUserComponent implements OnInit {

 
  
  public submitted: boolean = false;
  public showLoadingIndicator: boolean =false;
  public p:number=0;
  public area_service_data:any;
  public local_area_data:any;
  public dropdownList:any=[];
  public dropdown_sublocality:any=[];
  public dropdown_locality:any=[];
  public search_data:any={};
  public state_data:any={};
  public district_data:any={};
  public locality_data:any={};
  dropdownSettings!: IDropdownSettings;
  dropdownSettings_sub_locality!: IDropdownSettings;
  dropdownSettings_locality!: IDropdownSettings;
  public filtered_locality!: Observable<any[]>;
  
  selectedItems = [];

  Service_form = new FormGroup({
    user: new FormControl('', Validators.required),
    city: new FormControl('1', Validators.required),
    district: new FormControl('', Validators.required),
    locality: new FormControl('', Validators.required),
    sub_locality: new FormControl('', Validators.required),
    contact: new FormControl('', Validators.required),
    service: new FormControl('', Validators.required)
  });

  constructor(
    private LocalServiceProviderService:LocalServiceProviderService,
    private toastr: ToastrService,
    private router:Router,
    private CommonService:CommonService
    ) { }

  ngOnInit(): void {    
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'service_id',
      textField: 'service_name',
      enableCheckAll: false,
      itemsShowLimit: 2,
      allowSearchFilter: true,
      noDataAvailablePlaceholderText: "Service not Availabale ",
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
      singleSelection: false,
      idField: 'sub_locality_id',
      textField: 'sub_locality_text',
      enableCheckAll: true,
      itemsShowLimit: 1,
      allowSearchFilter: true,
      closeDropDownOnSelection:true,
      noDataAvailablePlaceholderText: "Sub Locality not Availabale",
      maxHeight: 250,
    };
    this.get_locality();
    this.area_service();
  }
  onSubmit():void{
    if(this.Service_form.invalid){
      this.submitted = true;
      }else{
        console.log(this.Service_form.value);
        let param={data:this.Service_form.value}
        this.LocalServiceProviderService.service_user_create(param).subscribe(
          response => {
            let data:any=response;
            this.showLoadingIndicator = false;
            this.toastr.success('User  Create Successfully');
            this.router.navigate(['/agent/services-user-list']); 
          },
          err => {
            this.showLoadingIndicator = false;
            let errorMessage:any = err.error.errors;
            this.toastr.error(errorMessage, 'Something Error', {
              timeOut: 3000,
            });
          }
        );
      }
  }
  get f() {
    return this.Service_form.controls;
  }
  
  get_state(){
    this.showLoadingIndicator = true;
    this.CommonService.get_state({ param: null }).pipe().subscribe(
      response=> {
        console.log(response);
        this.state_data=response;
        this.showLoadingIndicator = false;
      },
      err => {
       this.showLoadingIndicator = false;
      }
    )
  }
  onchange_state(id:any){
    let param = { id: id }
    this.CommonService.get_district_byid(param).subscribe(
      response => {
        console.log(response);
        this.district_data=[];
        this.dropdown_locality=[];
        this.dropdown_sublocality=[];
        this.Service_form.patchValue({locality:''});
        this.Service_form.patchValue({sub_locality:''});
        this.district_data=response;
      },
      err => {
      }
    );
  }
  get_locality() {
    this.CommonService.get_locality({ param: null }).subscribe(
      response => {
        let data:any=response;
        console.log(data);
        if(data.data.length<1){
          this.dropdown_sublocality=[];
          this.Service_form.patchValue({sub_locality:''});
        }else{
          for (let i = 1; i < data.data.length; i++) {
            this.dropdown_locality = this.dropdown_locality.concat({locality_id: data.data[i].locality_id, locality_text:  data.data[i].locality}); 
          }
        }
      },
      (err: any) => {
      }
    );
  }
  onchange_locality(id: any) { 
    let param = { Locality_id:id.locality_id}
    this.CommonService.get_sub_locality(param).subscribe(
      response => {
        let data:any=response;
        console.log(data);
        this.dropdown_sublocality=[];
        this.Service_form.patchValue({sub_locality:''});
        if(data.data.length<1){
          this.dropdown_sublocality=[];
          this.Service_form.patchValue({
            sub_locality:'',
            district_id:''
          });
        }else{
          this.Service_form.patchValue({
            district:data.district.district.district_id
          });
          for (let i = 1; i < data.data.length; i++) {
            this.dropdown_sublocality = this.dropdown_sublocality?.concat({ sub_locality_id: data.data[i].sub_locality_id, sub_locality_text: data.data[i].sub_locality});
          }
          }
      }
    );
  }
  
  // fetch area service
  area_service():void{
    this.showLoadingIndicator = true;
    this.LocalServiceProviderService.getarea_service({ param: null }).pipe().subscribe(
      response => {
        let data:any=response;
        console.log(data);
        this.area_service_data=response;
        this.dropdownList=[];
        for (let i = 0; i < data.data.length; i++) {
          this.dropdownList = this.dropdownList.concat({service_id: data.data[i].service_id, service_name: data.data[i].service_name});
          this.showLoadingIndicator = false;
        }
        this.showLoadingIndicator = false;
      },
      err => {
       this.showLoadingIndicator = false;
      }
    )
  }
  
  // fetch local area 
  local_area():void{
    this.showLoadingIndicator = true;
    this.LocalServiceProviderService.getlocalArea({ param: null }).pipe().subscribe(
      response=> {
        let data:any=response;
        this.local_area_data=response;
        this.showLoadingIndicator = false;
      },
      err => {
       this.showLoadingIndicator = false;
      }
    )
  }
  keyPressNumbers(event: { which: any; keyCode: any; preventDefault: () => void; }) {
    var charCode = (event.which) ? event.which : event.keyCode;
    // Only Numbers 0-9
    if ((charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }
  displayFn(value?: any) {
    return value ? this.dropdown_locality.find((option: any) => option.locality_id === value.locality_id).locality: undefined;
  }

}

