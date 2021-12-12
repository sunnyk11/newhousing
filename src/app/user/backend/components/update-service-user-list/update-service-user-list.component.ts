import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { LocalServiceProviderService } from '../../services/local-service-provider.service';
import { ToastrService } from 'ngx-toastr';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { FormControl,FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  dropDownForm!: FormGroup;
  dropdownSettings:IDropdownSettings={};
  service_id:number=0;

  
  Service_form = new FormGroup({
    id: new FormControl('', Validators.required),
    user_id: new FormControl('', Validators.required),
    user: new FormControl('', Validators.required),
    Area: new FormControl('', Validators.required),
    LocalArea: new FormControl('', Validators.required),
    contact: new FormControl('', Validators.required),
    service: new FormControl('', Validators.required)
  });

  constructor(
    private route:ActivatedRoute,
    private router:Router,
    private LocalServiceProviderService:LocalServiceProviderService,
    private fb: FormBuilder,
    private toastr: ToastrService
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
  }
  user_details(user_id:any){
    this.showLoadingIndicator =true;
    let param = { user_id: user_id }
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
            Area: 470,
            LocalArea: data.data.local_area_user.area_user.loc_area_id,
            contact: data.data.contact,
            service: data.data.map_longitude,
          });
          if(data.data.user_service.length>0){
            for (let i = 0; i < data.data.user_service.length; i++) {      
              this.selectedItems =this.selectedItems.concat({service_id: data.data.user_service[i].service_id, service_name: data.data.user_service[i].service.service_name});
            }
          } 
          this.Service_form.patchValue({
            service: this.selectedItems
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
  
  onchange_local_area(id: any) {
      let param = { id: id }
      this.LocalServiceProviderService.get_service_id(param).subscribe(
        response => {
          this.area_service_data=response;
        },
        err => {
        }
    );
  } 
  onchange_area(id: any) {
    let param = { id: id }
    this.LocalServiceProviderService.get_localareaby_id(param).subscribe(
      response => {
        this.local_area_data=response;
        this.area_service();
      },
      err => {
      }
    );
  }
  
  redirect_to_service_user(): void {
    this.router.navigate(['/agent/services-user-list'])
  }

}
