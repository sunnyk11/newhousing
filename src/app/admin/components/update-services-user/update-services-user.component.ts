import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { LocalServiceProviderService } from 'src/app/user/backend/services/local-service-provider.service';
import { ToastrService } from 'ngx-toastr';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { FormControl,FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/user/backend/services/common.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-update-services-user',
  templateUrl: './update-services-user.component.html',
  styleUrls: ['./update-services-user.component.css']
})
export class UpdateServicesUserComponent implements OnInit {

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
  public dropdown_service:any=[];
  public dropdown_sublocality:any=[];
  public locality:any;
  public form_locality_id:any;
  public  selected_locality:any=[];
  public filteredOptions!: Observable<any[]>;

  Service_form = new FormGroup({
    id: new FormControl('', Validators.required),
    user_id: new FormControl('', Validators.required),
    user: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    district: new FormControl('', Validators.required),
    locality: new FormControl('', Validators.required),
    locality_data: new FormControl('', Validators.required),
    sub_locality: new FormControl('', Validators.required),
    contact: new FormControl('', Validators.required),
    service: new FormControl('', Validators.required)
  });



  constructor(private route:ActivatedRoute,
    private router:Router,
    private LocalServiceProviderService:LocalServiceProviderService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private CommonService:CommonService) { 
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
    this.area_service();
    this.filteredOptions = this.Service_form.controls.locality_data.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );
  }

  change_selected_locality(data:any){
    this.Service_form.patchValue({locality:data.locality_id});
    let param = { Locality_id:data.locality_id}
    this.CommonService.get_sub_locality(param).subscribe(
      response => {
        let data:any=response;
        this.dropdown_sublocality=[];
        this.Service_form.patchValue({sub_locality:''});
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
            this.dropdown_sublocality = this.dropdown_sublocality?.concat({ sub_locality_id: data.data[i].sub_locality_id, sub_locality_text: data.data[i].sub_locality});
          }
        }
      }
    );
  }

  change_selected_locality1(data:any){
    this.Service_form.patchValue({locality:data['0'].locality_id});
    let param = { Locality_id:data['0'].locality_id}
    this.CommonService.get_sub_locality(param).subscribe(
      response => {
        let data:any=response;
        this.dropdown_sublocality=[];
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
            this.dropdown_sublocality = this.dropdown_sublocality?.concat({ sub_locality_id: data.data[i].sub_locality_id, sub_locality_text: data.data[i].sub_locality});
          }
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
              this.dropdownList = this.dropdownList?.concat({ locality_id: data.data[0][i].locality_id, locality_text: data.data[0][i].locality});
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
    if (value.locality_text) {
      const filterValue = value.locality_text.toLowerCase();
      return this.dropdownList?.filter((option: any) => option.locality_text.toLowerCase().includes(filterValue));
    }
    else {
      const filterValue = value.toLowerCase();
      return this.dropdownList?.filter((option: any) => option.locality_text.toLowerCase().includes(filterValue));
    }
  }

  user_details(id:any){
    this.showLoadingIndicator =true;
    let param = { user_id: id }
    this.LocalServiceProviderService.sevice_user_get_id(param).subscribe(
      response => {
        let data:any=response;
        if(data.data == null){
          this.redirect_to_service_user();
        }else{
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
          }  
          if(data.data.user_locality.length>0){
            this.selected_locality =this.selected_locality.concat({locality_id: data.data.user_locality[0].locality_id, locality_text: data.data.user_locality[0].area_locality.locality});     
              this.Service_form.patchValue({
                locality_data: data.data.user_locality[0].area_locality.locality,
                  locality: data.data.user_locality[0].locality_id
                }); 
                this.change_selected_locality1(this.selected_locality);
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
            this.router.navigate(['/admin/services-user-list']);   
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

  onchange_locality(id: any) {
    let param = { Locality_id:id.locality_id}
    this.CommonService.get_sub_locality(param).subscribe(
      response => {
        let data:any=response;
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
