import { Component, OnInit,ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AreaListService } from '../../services/area-list.service';
import { Pagination } from 'src/app/user/components/models/pagination.model';

@Component({
  selector: 'app-state-list',
  templateUrl: './state-list.component.html',
  styleUrls: ['./state-list.component.css']
})
export class StateListComponent implements OnInit {
 
  public submitted: boolean = false;
  public showLoadingIndicator: boolean =false;
  public state_data:any={};
  public p:number=0;
  public state_length:number=0;
  public Pagination_data: Pagination;
  public details:any;
  public disabled:boolean=false;
  public update_submitted:boolean=false;

  State_form = new FormGroup({
    state_name:  new FormControl('', Validators.required),
    status: new FormControl('', Validators.required),
  });
  update_State_form= new FormGroup({
    state_id: new FormControl('', Validators.required),
    state_name:new FormControl('', Validators.required),
    status: new FormControl('', Validators.required)
  });

  constructor(private AreaListService:AreaListService,
    private toastr: ToastrService) { 
      this.Pagination_data = new Pagination();
    }

  ngOnInit(): void {
    this.get_data();
  }
  nosubmit(){
    this.toastr.error('At Least One Filed Select');
  }
  

  onSubmit(){
    if(this.State_form.invalid){
      this.submitted = true;
    }else{
      this.AreaListService.state_create(this.State_form.value).subscribe(
        response => {
          let data:any=response;
          this.showLoadingIndicator = false;
          this.State_form.patchValue({
            state_name:"",
            status:''
          });
          this.get_data();
          this.toastr.success('State Create Successfully');
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
  // fetch services  
  get_data(){
    this.showLoadingIndicator= true;
    this.AreaListService.get_state().then(
      Pagination_data => {
        this.state_data=Pagination_data;
        this.state_length=this.state_data.data.total;
        this.showLoadingIndicator=false;
      }, err => {
      }
    );
  }

  gotoPage(link_url: any) {
    this.showLoadingIndicator = true;
    this.AreaListService.getpagination(link_url).then(Pagination_data => {
      this.showLoadingIndicator= false;
      this.state_data=Pagination_data;
      // this.user_list_length=this.user_list.data.data.length;
    });
  }

  get f() {
    return this.State_form.controls;
  }

  delete_area(id:any){
    this.showLoadingIndicator = true;
    let param = { state_id: id}
    this.AreaListService.delete_area(param).pipe().subscribe(
      response=> {
        this.showLoadingIndicator =false;;
        let data:any=response;
        let Message =data.message;
        this.toastr.error(Message, 'state', {
          timeOut: 3000,
        });
        this.get_data();
      },
      err => {
       this.showLoadingIndicator = false;
      }
    )
  }
  
  state_status_changes(id:any){
    let param = { state_id: id}
    this.AreaListService.state_status_changes(param).subscribe(
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
    return this.update_State_form.controls;
  }
  
  
  Onupdate_data(){
    if(this.update_State_form.invalid){
      this.update_submitted = true;
    }else{
      this.AreaListService.state_update(this.update_State_form.value).subscribe(
        response => {
          this.showLoadingIndicator = false;
          this.update_State_form.patchValue({
            state_name:"",
            state_id:"",
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
    this.update_State_form.patchValue({
      state_id:data.state_id,
      state_name:data.state,
      status:data.status,
    });
  }
  
  delete_popup(data: any) {
    this.details = data;
  }

}
