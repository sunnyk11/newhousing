import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { InternalUsersService } from '../../services/internal-users.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { RolesService } from '../../services/roles.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

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
  public dropdownList: any = [];
  public EditUserForm: any;
  private user_id: any;
  public delete_user_details: any;
  public showLoadingIndicator: boolean = false;

  constructor(private internalUserService: InternalUsersService,
    private rolesService: RolesService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router) {
    this.EditUserForm = this.fb.group({
      EditRolesArray: this.fb.group([])
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
    this.internalUserService.getAllInternalUsers({ param: null }).subscribe(
      res => {
        //console.log(res);
        this.showLoadingIndicator = false;
        this.user_response = res;
      },
      err => {
        console.log(err);
        this.showLoadingIndicator = false;
      }
    );
  }

  get g() {
    return this.EditUserForm.controls.EditRolesArray;
  }

  getUserRoles(userId: any) {
    this.showLoadingIndicator = true;
    this.rolesService.getUserRoles(userId).subscribe(
      res => {
        //console.log(res);
        this.roles_response = res;
        this.roles_response.forEach((role:any) => {
          if(role.status == true) {
            if (this.g.controls[role.role_name]) {
              this.g.removeControl(role.role_name);
              this.g.addControl(role.role_name, new FormControl(true));
            }
            else {
              this.g.addControl(role.role_name, new FormControl(true));
            }
          }
          else {
            this.g.addControl(role.role_name, new FormControl(false));
          }
        })
        this.showLoadingIndicator = false;
      },
      err => {
        console.log(err);
        this.showLoadingIndicator = false;
      }
    );
  }

  viewDetails(user: any) {
    this.user_details = user;
  }

  editDetails(user: any) {
    this.EditUserForm.reset();
    this.edit_user_details = user;
    this.user_id = this.edit_user_details.id;
    this.getUserRoles(this.user_id);
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

  deleteUser(user_details: any) {
    this.delete_user_details = user_details;
    //console.log(this.delete_user_details);
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
