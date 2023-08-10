import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl,UntypedFormGroup, Validators } from '@angular/forms';
import { InternalUsersService } from '../../services/internal-users.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { RolesService } from '../../services/roles.service';
import { ToastrService } from 'ngx-toastr';
import { Pagination } from 'src/app/user/components/models/pagination.model';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserEmailUpdateComponent } from '../../modals/user-email-update/user-email-update.component';
import { UserMobileUpdateComponent } from '../../modals/user-mobile-update/user-mobile-update.component';


@Component({
  selector: 'app-view-internal-users',
  templateUrl: './view-internal-users.component.html',
  styleUrls: ['./view-internal-users.component.css']
})
export class ViewInternalUsersComponent implements OnInit {

  @ViewChild('closeEditModal')modalClose:any;
  @ViewChild('closeDeleteModal')DeletemodalClose:any;

  public user_response: any;
  public user_details: any;
  public edit_user_details: any;
  public dropdownSettings: IDropdownSettings;
  public response: any;
  public roles_response: any;
  public group_response: any;
  public dropdownList: any = [];
  public EditUserForm: any;
  public EditUsergroup: any;
  private user_id: any;
  public user_name:any;
  public delete_user_details: any;
  public submitted: boolean = false;
  public showLoadingIndicator: boolean = false;
  public user_list_length:any;
  
  public Pagination_data: Pagination;
UserForm = new UntypedFormGroup({
  userName: new UntypedFormControl('', Validators.required),
  user_id:new UntypedFormControl('', Validators.required),
  email: new UntypedFormControl('', [Validators.required, Validators.email]),
  other_mobile_number: new UntypedFormControl('',[Validators.required, Validators.minLength(10), Validators.maxLength(10)])
});

  constructor(
    private internalUserService: InternalUsersService,
    private rolesService: RolesService,
    private fb: UntypedFormBuilder,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private router: Router) {
      
      this.internalUserService.user_details_on().subscribe(
        message => {
          if (message == 'true') {
            this.get_userlist();
          }
        });
      this.Pagination_data = new Pagination();  
    this.EditUserForm = this.fb.group({
      EditRolesArray: this.fb.group([])
    });
    this.EditUsergroup = this.fb.group({
      EditgroupArray: this.fb.group([])
    });

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: false,
      maxHeight: 250
    };
  }

  ngOnInit(): void {
    this.showLoadingIndicator = true;
    this.get_userlist();
    
  }
  
  get_userlist(){
    this.internalUserService.getAllInternalUsers({ param: null }).subscribe(
      res => {
        this.user_response = res;
        console.log(this.user_response);
        this.user_list_length=this.user_response.total;
        this.showLoadingIndicator = false;
      },
      err => {
        // console.log(err);
        this.showLoadingIndicator = false;
      }
    );
  }
  gotoPage(link_url: any) {
    this.showLoadingIndicator = true;
    this.internalUserService.getpagination(link_url).then(Pagination_data => {
      this.showLoadingIndicator= false;
      this.user_response=Pagination_data;
      // this.user_list_length=this.user_list.data.data.length;
    });
  }

  get g() {
    return this.EditUserForm.controls.EditRolesArray;
  }
  
  get k() {
    return this.EditUsergroup.controls.EditgroupArray;
  }

  get f() {
    return this.UserForm.controls;
  } 
  getUserRoles(userId: any) {
    this.showLoadingIndicator = true;
    this.rolesService.getUserRoles(userId).subscribe(
      value => {
        // console.log(value);
        this.roles_response = value;
        this.roles_response.forEach((role:any) => {
          if(role.status == true) {
            if (this.g.controls[role.role_name]) {
              this.g.removeControl(role.role_name);
              this.g.addControl(role.role_name, new UntypedFormControl(true));
            }
            else {
              this.g.addControl(role.role_name, new UntypedFormControl(true));
            }
          }
          else {
            this.g.addControl(role.role_name, new UntypedFormControl(false));
          }
        })
        this.showLoadingIndicator = false;
      },
      err => {
        // console.log(err);
        this.showLoadingIndicator = false;
      }
    );
  }
  
  getUsergroup(userId: any) {
    this.showLoadingIndicator = true;
    this.rolesService.getUsergroup(userId).subscribe(
      res => {
        // console.log(res);
        this.group_response = res;
        this.group_response.forEach((group:any) => {
          if(group.status == true) {
            if (this.k.controls[group.group_name]) {
              this.k.removeControl(group.group_name);
              this.k.addControl(group.group_name, new UntypedFormControl(true));
            }
            else {
              this.k.addControl(group.group_name, new UntypedFormControl(true));
            }
          }
          else {
            this.k.addControl(group.group_name, new UntypedFormControl(false));
          }
        })
        this.showLoadingIndicator = false;
      },
      err => {
        // console.log(err);
        this.showLoadingIndicator = false;
      }
    );
  }

  viewDetails(user: any) {
    this.user_details = user;
    // console.log(this.user_details);
  }
  user_details_email(){
    const modalRef = this.modalService.open(UserEmailUpdateComponent,
      {
        scrollable: true,
        windowClass: 'myCustomModalClass',
        // keyboard: true,
        backdrop: 'static'
      });
    modalRef.componentInstance.data = this.UserForm.value;

  }
  
  
  user_details_phone(){
    const modalRef = this.modalService.open(UserMobileUpdateComponent,
      {
        scrollable: true,
        windowClass: 'myCustomModalClass',
        // keyboard: true,
        backdrop: 'static'
      });
    modalRef.componentInstance.data = this.UserForm.value;

  }
  
  
  keyPressNumbers1(event: { which: any; keyCode: any; preventDefault: () => void; }) {
    var charCode = (event.which) ? event.which : event.keyCode;
    event.preventDefault();
      return false;
    
  }
  
  onPaste(e:any) {
    e.preventDefault();
    return false;
  }

  editDetails(user: any) {
    this.EditUserForm.reset();
    this.EditUsergroup.reset();
    this.edit_user_details = user;
    this.user_id = this.edit_user_details.id;
    this.UserForm.patchValue({
      userName:this.edit_user_details.name,
      user_id:this.edit_user_details.id,
      email:this.edit_user_details.email,
      other_mobile_number:this.edit_user_details.other_mobile_number
    });
    
    if(this.edit_user_details.last_name !=null){
      this.UserForm.patchValue({
        userName:this.edit_user_details.name+ " "+ this.edit_user_details.last_name,
      });
      this.user_name=this.edit_user_details.name+ " "+ this.edit_user_details.last_name;
    }else{
      this.UserForm.patchValue({
      userName:this.edit_user_details.name,
    });
    this.user_name=this.edit_user_details.name;
    }
    this.getUserRoles(this.user_id);
    this.getUsergroup(this.user_id);
  }
  
  edit_user() {
    //console.log(user_id);
    this.showLoadingIndicator = true;
    this.internalUserService.edit_user_data( this.UserForm.value).subscribe(
      response => {
        //console.log(response);
        this.showLoadingIndicator = false;
        this.modalClose.nativeElement.click();
        this.toastr.success('Successfully updated User details');
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate([this.router.url]);
      },
      err => {
        console.log(err);
        this.showLoadingIndicator = false;
      }
    );
  }

  save_user(user_id: any) {
    //console.log(user_id);
    this.showLoadingIndicator = true;
    this.rolesService.editUserRoles(user_id, this.EditUserForm.value).subscribe(
      response => {
        //console.log(response);
        this.showLoadingIndicator = false;
        this.modalClose.nativeElement.click();
        this.toastr.success('Successfully updated User details');
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate([this.router.url]);
      },
      err => {
        console.log(err);
        this.showLoadingIndicator = false;
      }
    );
  }
  
  save_group(user_id: any) {
    //console.log(user_id);
    this.showLoadingIndicator = true;
    this.rolesService.editUsergroup(user_id, this.EditUsergroup.value).subscribe(
      response => {
        //console.log(response);
        this.showLoadingIndicator = false;
        this.modalClose.nativeElement.click();
        this.toastr.success('Successfully updated User details');
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate([this.router.url]);
      },
      err => {
        console.log(err);
        this.showLoadingIndicator = false;
      }
    );
  }

  deleteUser(user_details: any) {
    this.delete_user_details = user_details;
    //console.log(this.delete_user_details);
  }
  
  user_status_changes(id:any){
    let param = { user_id: id}
    this.internalUserService.user_status_changes(param).subscribe(
      response => {
        this.showLoadingIndicator =false;
        let data:any=response;
        this.toastr.success('Status Updated', 'User', {
          timeOut: 3000,
        });
        this.get_userlist();
      }
    );
  }

  delete_role(user_id: any) {
    this.showLoadingIndicator = true;
    //console.log(user_id);
    this.internalUserService.deleteInternalUser(user_id).subscribe(
      res => {
        //console.log(res);
        this.showLoadingIndicator = false;
        this.toastr.success('User successfully deleted');
        this.DeletemodalClose.nativeElement.click();
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate([this.router.url]);
      },
      err => {
        console.log(err);
        this.showLoadingIndicator = false;
      }
    );
  }
}
