import { Component, OnInit,ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UserListService } from '../../services/user-list.service';
import { Pagination } from 'src/app/user/components/models/pagination.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserInternalService } from '../../services/user-internal.service';
import { Router,ActivatedRoute } from '@angular/router';
import { JwtService } from 'src/app/user/services/jwt.service';
import { RolesService } from '../../services/roles.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ByuserByinternalComponent } from '../../modals/byuser-byinternal/byuser-byinternal.component';

@Component({
  selector: 'app-user-list-internal',
  templateUrl: './user-list-internal.component.html',
  styleUrls: ['./user-list-internal.component.css']
})
export class UserListInternalComponent implements OnInit {
  
  @ViewChild('closeDeleteModal')DeletemodalClose:any;
  public user_list:any;
  public user_list_length:any;
  public isSignUpFailed:boolean=false;
  
  public Pagination_data: Pagination;
  public submitted:boolean=false;
  public mobile_search:boolean=false;
  public email_search:boolean=true;
  public user_details_fetch:any;
  public delete_user_details: any;
  public user_name:any;
  public permissions_response: any;
  public access_create_userbyinternal:boolean=false;
  public access_view_userByinternal:boolean=false;
  public access_update_userByinternal:boolean=false;
  public access_delete_userByinternal:boolean=false;
  private user_id: any;
  private user_type: any;
  public roles_response: any;
  public response: any;
  

  public p:number=0;
  public errorMessage:any;
  public showLoadingIndicator:boolean=false;
  searching_form = new FormGroup({
    searchtype: new FormControl('email', Validators.required),
    email: new FormControl('',[Validators.required, Validators.email]),
    mobile: new FormControl('1234567890', Validators.required)
  });
  
  UserForm = new FormGroup({
    userName: new FormControl('', Validators.required),
    gender: new FormControl('', Validators.required),
    UserType:new FormControl('', Validators.required),
    user_id:new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    other_mobile_number: new FormControl('',[Validators.required, Validators.minLength(10), Validators.maxLength(10)])
  });

  constructor(private toastr: ToastrService,
    private UserListService:UserListService,
    private jwtService: JwtService,
    private rolesService: RolesService,
    private router: Router,
    private modalService: NgbModal,
    private UserInternalService:UserInternalService,) {
      this.UserInternalService.user_details_on().subscribe(
        message => {
          if (message == 'true') {
            this.get_userlist();
          }
        });
      this.Pagination_data = new Pagination();  
     }

  ngOnInit(): void {
    this.get_userlist();
    this.get_user_permissions();
  }
  
  get f() {
    return this.searching_form.controls;
  }
  get g() {
    return this.UserForm.controls;
  }
  refresh_data(){
    this.email_search = true;
    this.mobile_search=false;
    this.searching_form.patchValue({
      email:'',
      mobile:'1234567890'
    });
    this.get_userlist();
  }
  onchage_mehtod(event:any){
    if (event == 'email') {
      this.email_search = true;
      this.mobile_search=false;
      this.searching_form.patchValue({
        email:'',
        mobile:'1234567890'
      });
    } else {
      this.email_search = false;
      this.mobile_search=true;
      this.searching_form.patchValue({
        email:'xyz@gmail.com',
        mobile:''
      });
    }

  }
  
  on_search(){
    if(this.searching_form.invalid){
      this.submitted = true;
      }else{
        this.showLoadingIndicator= true;
        this.UserListService.get_search_user(this.searching_form.value).then(
        Pagination_data => {
          this.user_list=Pagination_data;
          //console.log(this.user_reviews);
          this.user_list_length=this.user_list.data.data.length;
          this.showLoadingIndicator=false;
        }, err => {
        }
      );
      }
    }
    
  onUpdateSubmit(){
    this.submitted = true;
    if (this.UserForm.invalid) {
      this.showLoadingIndicator = false;
      return;
    }else{   
      // console.log(this.UserForm.value);
            
      this.UserInternalService.create_user(this.UserForm.value).subscribe(
        response => {
          this.showLoadingIndicator = false;
          // console.log(response);
          // this.UserForm.reset();
          this.toastr.success('Successfully created User');
          this.router.navigate(['/admin/user-list-internal']);
        },
        err => {
          this.showLoadingIndicator = false;
          this.errorMessage = err.error;
          this.isSignUpFailed = true;
           if(this.errorMessage.errors.email){
            this.toastr.error('The Email Address has already been taken.');
          }else if(this.errorMessage.errors.other_mobile_number){
            this.toastr.error('The Mobile Number has already been taken.');
          }else{
            this.toastr.error(this.errorMessage.message);
          }
          }
      );
       }
  }
  // fetch user details 
  get_userlist(){
    this.showLoadingIndicator= true;
    this.UserInternalService.get_userlist_byinternal().then(
      Pagination_data => {
        this.user_list=Pagination_data;
        this.user_list_length=this.user_list.data.total;
        this.showLoadingIndicator= false;
      }, err => {
      }
    );
  }
  get_userlist1(){
    // this.showLoadingIndicator= true;
    this.UserInternalService.get_userlist_byinternal().then(
      Pagination_data => {
        this.user_list=Pagination_data;
        this.user_list_length=this.user_list.data.total;
        this.showLoadingIndicator= false;
      }, err => {
      }
    );
  }
  
  gotoPage(link_url: any) {
    this.showLoadingIndicator = true;
    this.UserInternalService.getpagination(link_url).then(Pagination_data => {
      this.showLoadingIndicator= false;
      this.user_list=Pagination_data;
      // this.user_list_length=this.user_list.data.data.length;
    });
  } 
    user_status_changes(id:any){
    let param = { user_id: id}
    this.UserInternalService.user_status_changes(param).subscribe(
      response => {
        this.showLoadingIndicator =false;
        let data:any=response;
        this.toastr.success('Status Updated', 'User', {
          timeOut: 3000,
        });
        this.get_userlist1();
      }
    );
  }
  viewDetails(user:any){
    console.log(user);
    this.user_name='';
    this.user_details_fetch='';
    this.user_details_fetch=user;
    this.UserForm.reset();
    this.UserForm.patchValue({
      gender:this.user_details_fetch.gender,
      UserType:this.user_details_fetch.usertype,
      email:this.user_details_fetch.email,
      other_mobile_number:this.user_details_fetch.other_mobile_number
    });
    if(this.user_details_fetch.last_name !=null){
      this.UserForm.patchValue({
        userName:this.user_details_fetch.name+ " "+ this.user_details_fetch.last_name,
      });
      this.user_name=this.user_details_fetch.name+ " "+ this.user_details_fetch.last_name;
    }else{
      this.UserForm.patchValue({
      userName:this.user_details_fetch.name,
    });
    this.user_name=this.user_details_fetch.name;
    }

  }
  
  get_user_permissions() {
      
      this.access_create_userbyinternal=false;
      this.access_view_userByinternal=false;
      this.access_update_userByinternal=false;
      this.access_delete_userByinternal=false;

    this.user_id = this.jwtService.getAdminId();
    //console.log(this.user_id);
    this.user_type = this.jwtService.getUserType();
    if(this.user_type == 11) {
      this.access_create_userbyinternal=true;
      this.access_view_userByinternal=true;
      this.access_update_userByinternal=true;
      this.access_delete_userByinternal=true;

    }
    else if(this.user_id) {
      this.rolesService.getUserPermissions(this.user_id).subscribe(
        response => {
          this.response = response;
          this.permissions_response = this.response.permissions;
          this.roles_response = this.response.roles.roles;        
          
          this.access_create_userbyinternal = this.permissions_response.includes('access_create_userbyinternal');
          this.access_view_userByinternal = this.permissions_response.includes('access_view_userByinternal');
          this.access_update_userByinternal = this.permissions_response.includes('access_update_userByinternal');
          this.access_delete_userByinternal = this.permissions_response.includes('access_delete_userByinternal');
  
        },
        err => {
          // console.log(err);
        }
      );
    }
  }
  editDetails(user: any) {
    const modalRef = this.modalService.open(ByuserByinternalComponent,
      {
        scrollable: true,
        windowClass: 'myCustomModalClass',
        // keyboard: false,
        backdrop: 'static'
      });
    
    modalRef.componentInstance.data = user;
    
  }
  // editDetails1(user: any) {
  //   console.log(user);
  //   this.user_name='';
  //   this.user_details_fetch='';
  //   this.user_details_fetch=user;
  //   this.UserForm.reset();
  //   this.UserForm.patchValue({
  //     gender:this.user_details_fetch.gender,
  //     UserType:this.user_details_fetch.usertype,
  //     email:this.user_details_fetch.email,
  //     user_id:this.user_details_fetch.id,
  //     other_mobile_number:this.user_details_fetch.other_mobile_number
  //   });
  //   if(this.user_details_fetch.last_name !=null){
  //     this.UserForm.patchValue({
  //       userName:this.user_details_fetch.name+ " "+this.user_details_fetch.last_name,
  //     });
  //     this.user_name=this.user_details_fetch.name+" "+ this.user_details_fetch.last_name;

  //   }else{
  //     this.UserForm.patchValue({
  //     userName:this.user_details_fetch.name,
  //   });
  //   this.user_name=this.user_details_fetch.name;
  //   }
  // }
  
  deleteUser_popup(user_details: any) {
    this.delete_user_details = user_details;
    if(this.delete_user_details.last_name !=null){
      this.user_name=this.delete_user_details.name + " "+ this.delete_user_details.last_name;
    }else{
    this.user_name=this.delete_user_details.name;
    }
  }
  
  delete_user(id:any){
    this.showLoadingIndicator =true;
    let param = { user_id: id}
    this.UserInternalService.delete_user(param).subscribe(
      response => {
        let data:any=response;
        this.get_userlist();
        this.toastr.error('Delete Successfully', 'User details', {
          timeOut: 3000,
        });
        
        this.DeletemodalClose.nativeElement.click();
        this.showLoadingIndicator =false;
      }
    );
  }
  
  onPaste(e:any) {
    e.preventDefault();
    return false;
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

}
