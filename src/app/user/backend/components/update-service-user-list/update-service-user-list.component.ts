import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { LocalServiceProviderService } from '../../services/local-service-provider.service';
import { ToastrService } from 'ngx-toastr';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { FormControl,FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-update-service-user-list',
  templateUrl: './update-service-user-list.component.html',
  styleUrls: ['./update-service-user-list.component.css']
})
export class UpdateServiceUserListComponent implements OnInit {
  
  public user_id:any=null;
  public showLoadingIndicator:boolean=true;
  // dropdownSettings!: IDropdownSettings;
  public submitted: boolean = false;
  public local_area_data:any={};
  public area_service_data:any={};
  public dropdownList:any=[]; 
  public  selectedItems:any=[];
  public  selected_sublocality:any=[];
  dropDownForm!: FormGroup;
  dropdownSettings:IDropdownSettings={};
  dropdownSettings1:IDropdownSettings={};
  dropdownSettings_locality:IDropdownSettings={};
  service_id:number=0;
  public state_data:any={};
  public district_data:any={};
  public locality_data:any={};
  public dropdown_locality:any=[];
  public dropdown_sublocality:any=[];
  public locality:any;
  public form_locality_id:any;
  public  selected_locality:any=[];

  
  Service_form = new FormGroup({
    id: new FormControl('', Validators.required),
    user_id: new FormControl('', Validators.required),
    user: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    district: new FormControl('', Validators.required),
    locality: new FormControl('', Validators.required),
    sub_locality: new FormControl('', Validators.required),
    contact: new FormControl('', Validators.required),
    service: new FormControl('', Validators.required)
  });

  constructor(
    private route:ActivatedRoute,
    private router:Router,
    private LocalServiceProviderService:LocalServiceProviderService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private CommonService:CommonService
    ) {
    this.route.queryParams.subscribe((params) => {
      if(params.id.length>0){
        this.user_id = params.id;
        this.showLoadingIndicator =true;
        this.user_details(this.user_id);
      }else{
        this.redirect_to_service_user();
      }
    });
  }

  ngOnInit(): void {
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'service_id',
      textField: 'service_name',
      enableCheckAll: false,
      itemsShowLimit: 4,
      allowSearchFilter: true,
      noDataAvailablePlaceholderText: "Service not availabale ",
      maxHeight: 250
    }; 
    
    this.dropdownSettings1= {
      singleSelection: false,
      idField: 'sub_locality_id',
      textField: 'sub_locality_text',
      enableCheckAll: true,
      itemsShowLimit: 1,
      allowSearchFilter: true,
      noDataAvailablePlaceholderText: "Sub-locality not availabale ",
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
    this.get_locality();
    this.area_service();
    
  }
  user_details(id:any){
    this.showLoadingIndicator =true;
    let param = { user_id: id }
    this.LocalServiceProviderService.sevice_user_get_id(param).subscribe(
      response => {
        let data:any=response;
        console.log(data);
        if(data.data == null){
          this.redirect_to_service_user();
        }else{
          console.log(data.data.user_locality[0]?.area_locality?.locality);
            this.Service_form.patchValue({
            id:data.data.id,
            user_id:data.data.user_id,
            user: data.data.user_name,
            contact: data.data.contact,
            city:data.data.user_state[0].state_id,
            district:data.data.user_district[0].district_id,
            // locality:data.data.user_locality[0]?.area_locality?.locality,
          });
           if(data.data.user_service.length>0){
            for (let i = 0; i < data.data.user_service.length; i++) {      
              this.selectedItems =this.selectedItems.concat({service_id: data.data.user_service[i].service_id, service_name: data.data.user_service[i].service.service_name});
            }
            console.log(this.selectedItems);
          }  
          if(data.data.user_locality.length>0){
            this.selected_locality =this.selected_locality.concat({locality_id: data.data.user_locality[0].locality_id, locality_text: data.data.user_locality[0].area_locality.locality});     
              this.Service_form.patchValue({
                  locality: this.selected_locality
                }); 
          } 
          if(data.data.user_sublocality.length>0){
            for (let i = 0; i < data.data.user_sublocality.length; i++) {    
              let sub_locality_value=Number(data.data.user_sublocality[i].sub_locality_id);  
              this.selected_sublocality =this.selected_sublocality.concat({sub_locality_id: sub_locality_value, sub_locality_text: data.data.user_sublocality[i].area_sub_locality.sub_locality});
            }
          } 
          this.Service_form.patchValue({
            service: this.selectedItems,
            sub_locality: this.selected_sublocality
          });  
          this.onchange_locality1(this.Service_form.value.locality[0]);
       } 
      });
      this.showLoadingIndicator =false;
  }
  
  // fetch area service
  area_service():void{
    this.showLoadingIndicator = true;
    this.LocalServiceProviderService.getarea_service({ param: null }).pipe().subscribe(
      response => {
        let data:any=response;
        this.area_service_data=response;
        this.dropdownList=[];
        for (let i = 0; i < data.data.length; i++) {
          this.dropdownList = this.dropdownList.concat({service_id: data.data[i].service_id, service_name: data.data[i].service_name});
          this.showLoadingIndicator = false;       
        }
      },
      err => {
       this.showLoadingIndicator = false;
      }
    )
  }
  
  get f() {
    return this.Service_form.controls;
  }
  onSubmit(){
    if(this.Service_form.invalid){
      this.submitted = true;
      }else{
        let param={data:this.Service_form.value}
        this.LocalServiceProviderService.service_user_update(param).subscribe(
          response => {
            let data:any=response;
            this.showLoadingIndicator = false;
            this.toastr.success('User Successfully Updated');
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
  
  
  get_locality() {
    this.CommonService.get_locality({ param: null }).subscribe(
      response => {
        let data:any=response;
        console.log(data);
        if(data.data.length<1){
          this.dropdown_sublocality=[];
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
    console.log(id);
    let param = { Locality_id:id.locality_id}
    this.CommonService.get_sub_locality(param).subscribe(
      response => {
        let data:any=response;
        console.log(data);
        this.dropdown_sublocality=[];
        this.Service_form.patchValue({
          sub_locality:'',
          district:''
        });
        if(data.data.length<1){
          this.dropdown_sublocality=[];
          this.Service_form.patchValue({
            sub_locality:'',
            district:''
          });
        }else{
          this.Service_form.patchValue({
            district:data.district.district.district_id
          });
          for (let i = 1; i < data.data.length; i++) {
            this.dropdown_sublocality = this.dropdown_sublocality?.concat({sub_locality_id: data.data[i].sub_locality_id,sub_locality_text: data.data[i].sub_locality});
          }
        }
      }
    );
  }
 
  onchange_locality1(id: any) {
    console.log(id);
    let param = { Locality_id:id.locality_id}
    this.CommonService.get_sub_locality(param).subscribe(
      response => {
        let data:any=response;
        // console.log(data);
        // console.log(this.Service_form.value);
        if(data.data.length<1){
          this.dropdown_sublocality=[];
          this.Service_form.patchValue({
            sub_locality:'',
            district:''
          });
        }else{
          this.Service_form.patchValue({
            district:data.district.district.district_id,
            sub_locality:this.selected_sublocality
          });
          for (let i = 1; i < data.data.length; i++) {
            this.dropdown_sublocality = this.dropdown_sublocality?.concat({sub_locality_id: data.data[i].sub_locality_id,sub_locality_text: data.data[i].sub_locality});
          }
          console.log(this.dropdown_sublocality);
          console.log(this.Service_form.value.sub_locality);
        }
      }
    );
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
  
  redirect_to_service_user(): void {
    this.router.navigate(['/agent/services-user-list'])
  }


}
