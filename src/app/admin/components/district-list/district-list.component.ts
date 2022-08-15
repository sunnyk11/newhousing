import { Component, OnInit,ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AreaListService } from '../../services/area-list.service';
import { Pagination } from 'src/app/user/components/models/pagination.model';

@Component({
  selector: 'app-district-list',
  templateUrl: './district-list.component.html',
  styleUrls: ['./district-list.component.css']
})
export class DistrictListComponent implements OnInit {


  public submitted: boolean = false;
  public showLoadingIndicator: boolean =false;
  public state_data:any={};
  public p:number=0;
  public district_length:number=0;
  public district_data:any={};
  public Pagination_data: Pagination;
  public details:any;
  public disabled:boolean=false;
  public update_submitted:boolean=false;

  district_form = new FormGroup({
    state:  new FormControl('', Validators.required),
    district:  new FormControl('', Validators.required),
    status: new FormControl('', Validators.required),
  });
  update_district_form= new FormGroup({
    state: new FormControl('', Validators.required),
    district_id:new FormControl('', Validators.required),
    district:new FormControl('', Validators.required),
    status: new FormControl('', Validators.required)
  });

  constructor(private AreaListService:AreaListService,
    private toastr: ToastrService) { 
      this.Pagination_data = new Pagination();
    }

  ngOnInit(): void {
    this.get_data();
    this.get_state_data();
  }
  nosubmit(){
    this.toastr.error('At Least One Filed Select');
  }
  

  onSubmit(){
    if(this.district_form.invalid){
      this.submitted = true;
    }else{
      this.AreaListService.district_create(this.district_form.value).subscribe(
        response => {
          let data:any=response;
          this.showLoadingIndicator = false;
          this.district_form.patchValue({
            district:"",
            statu:''
          });
          this.get_data();
          this.toastr.success('District Create Successfully');
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
  get_state_data(){
    this.showLoadingIndicator= true;
    this.AreaListService.get_state_data().subscribe(
      response => {
        this.state_data=response;
      }, err => {
      }
    );
  }  
   get_data(){
    this.showLoadingIndicator= true;
    this.AreaListService.get_district().then(
      Pagination_data => {
        this.district_data=Pagination_data;
        this.district_length=this.district_data.data.total;
        this.showLoadingIndicator=false;
      }, err => {
      }
    );
  }

  gotoPage(link_url: any) {
    this.showLoadingIndicator = true;
    this.AreaListService.getpagination(link_url).then(Pagination_data => {
      this.showLoadingIndicator= false;
      this.district_data=Pagination_data;
      // this.user_list_length=this.user_list.data.data.length;
    });
  }

  get f() {
    return this.district_form.controls;
  }

  delete_district(id:any){
    this.showLoadingIndicator = true;
    let param = { district_id: id}
    this.AreaListService.delete_district(param).pipe().subscribe(
      response=> {
        this.showLoadingIndicator =false;;
        let data:any=response;
        let Message =data.message;
        this.toastr.error(Message, 'District', {
          timeOut: 3000,
        });
        this.get_data();
      },
      err => {
       this.showLoadingIndicator = false;
      }
    )
  }
  
  district_status_changes(id:any){
    let param = { district_id: id}
    this.AreaListService.district_status_changes(param).subscribe(
      response => {
        this.showLoadingIndicator =false;
        let data:any=response;
        this.toastr.success('Status Updated', 'State', {
          timeOut: 3000,
        });
        this.get_data();
      }
    );
  }
  
  
  get g() {
    return this.update_district_form.controls;
  }
  
  
  Onupdate_data(){
    if(this.update_district_form.invalid){
      this.update_submitted = true;
    }else{
      this.AreaListService.district_update(this.update_district_form.value).subscribe(
        response => {
          this.showLoadingIndicator = false;
          this.update_district_form.patchValue({
            district:"",
            state:"",
            district_id:"",
            status:''
          });
          this.get_data();
          this.toastr.success('State Updated');
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
  viewDetails(data: any) {
    this.details=data;
    this.update_district_form.patchValue({
      state:data.state_id,
      district:data.district,
      district_id:data.district_id,
      status:data.status,
    });
  }
  
  delete_popup(data: any) {
    this.details = data;
  }

}

