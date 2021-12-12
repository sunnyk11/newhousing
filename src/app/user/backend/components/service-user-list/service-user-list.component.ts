import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LocalServiceProviderService } from '../../services/local-service-provider.service';
import { ToastrService } from 'ngx-toastr';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-service-user-list',
  templateUrl: './service-user-list.component.html',
  styleUrls: ['./service-user-list.component.css']
})
export class ServiceUserListComponent implements OnInit {
  
  public submitted: boolean = false;
  public showLoadingIndicator: boolean =false;
  public p:number=0;
  public area_service_data:any;
  public local_area_data:any;
  public dropdownList:any=[];
  public search_data:any={};
  dropdownSettings!: IDropdownSettings;
  
  selectedItems = [];

  Service_form = new FormGroup({
    user: new FormControl('', Validators.required),
    Area: new FormControl('', Validators.required),
    LocalArea: new FormControl('', Validators.required),
    contact: new FormControl('', Validators.required),
    service: new FormControl('', Validators.required)
  });

  constructor(
    private LocalServiceProviderService:LocalServiceProviderService,
    private toastr: ToastrService
    ) { }

  ngOnInit(): void {    
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'service_id',
      textField: 'service_name',
      enableCheckAll: false,
      itemsShowLimit: 3,
      allowSearchFilter: true,
      noDataAvailablePlaceholderText: "Service not availabale ",
      maxHeight: 250
    };
    this.getservice_user();
  }
  getservice_user(){
    this.showLoadingIndicator = true;
    this.LocalServiceProviderService.getservice_user({ param: null }).pipe().subscribe(
      response=> {
        console.log(response);
        this.search_data=response;
        this.showLoadingIndicator = false;
      },
      err => {
       this.showLoadingIndicator = false;
      }
    )

  }
  onSubmit():void{
    if(this.Service_form.invalid){
      this.submitted = true;
      }else{
        let param={data:this.Service_form.value}
        this.LocalServiceProviderService.service_user_create(param).subscribe(
          response => {
            let data:any=response;
            this.showLoadingIndicator = false;
            this.Service_form.patchValue({
              service:'',
              user:'',
              Area:'',
              LocalArea:'',
              contact:'' 

            });
            this.getservice_user();
            this.toastr.success('User  Create Successfully');
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
  
  onchange_local_area(id: any) {
      let param = { id: id }
      this.LocalServiceProviderService.get_service_id(param).subscribe(
        response => {
          let data:any= response;
          if(data.data.length>0){
            this.area_service();
          }
          this.area_service_data=response;
          this.Service_form.patchValue({
            service:'',
          });
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
        this.Service_form.patchValue({
          LocalArea:'',
        });
        this.Service_form.patchValue({
          service:'',
        });
      },
      err => {
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
  delete_service_user(user_id:any){
    this.showLoadingIndicator = true;
    let param = { user_id: user_id}
    this.LocalServiceProviderService.delete_service_user(param).pipe().subscribe(
      response=> {
        this.showLoadingIndicator =false;;
        let data:any=response;
        let Message =data.message;
        this.toastr.error(Message, 'User', {
          timeOut: 3000,
        });
        this.getservice_user();
      },
      err => {
       this.showLoadingIndicator = false;
      }
    )
  }
}
