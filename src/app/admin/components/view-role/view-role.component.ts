import { Component, OnInit, ViewChild } from '@angular/core';
import { RolesService } from '../../services/roles.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-role',
  templateUrl: './view-role.component.html',
  styleUrls: ['./view-role.component.css']
})
export class ViewRoleComponent implements OnInit {

  @ViewChild('closeEditModal')modalClose:any;
  @ViewChild('closeDeleteModal')DeletemodalClose:any;

  public roles_response: any;
  public response: any;
  public permissions_response: any;
  public role_permissions_response: any;
  public edit_role_permissions_response: any;
  public role_details: any;
  public edit_role_details: any;
  public delete_role_details: any;
  public permissions_data: any;
  public RoleForm: any;
  public EditRoleForm: any;

  constructor(private rolesService: RolesService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router) {
    this.RoleForm = this.fb.group({
      permissionsArray: this.fb.group([])
    });

    this.EditRoleForm = this.fb.group({
      EditPermissionsArray: this.fb.group([])
    });
  }

  ngOnInit(): void {
    this.getRoles();
  }

  get f() {
    return this.RoleForm.controls.permissionsArray;
  }

  get g() {
    return this.EditRoleForm.controls.EditPermissionsArray;
  }

  getRoles() {
    this.rolesService.getRoles({ param: null }).subscribe(
      response => {
        console.log(response);
        this.response = response;
        this.roles_response = this.response.roles;
        console.log(this.roles_response);
        // this.permissions_response.forEach((permission:any) => {
        //   console.log(permission);
        //   this.f.addControl(permission.permission_name, new FormControl(false));
        // });
      },
      err => {
        console.log(err);
      }
    );
  }

  moreDetails(role_details: any) {
    this.RoleForm.reset();
    console.log(role_details);
    this.role_details = role_details;
    this.rolesService.getRolePermissions(this.role_details.id).subscribe(
      response => {
        console.log(response);
        this.role_permissions_response = response;
        this.role_permissions_response.forEach((permission: any) => {
          if (permission.status == true) {
            if (this.f.controls[permission.permission_name]) {
              this.f.removeControl(permission.permission_name);
              this.f.addControl(permission.permission_name, new FormControl({ value: true, disabled: true }));
            }
            else {
              this.f.addControl(permission.permission_name, new FormControl({ value: true, disabled: true }));
            }
          }
          else {
            this.f.addControl(permission.permission_name, new FormControl({ value: false, disabled: true }));
          }
        })
      },
      err => {
        console.log(err);
      }
    );
    console.log(this.RoleForm);
  }

  editDetails(role_details: any) {
    this.EditRoleForm.reset();
    console.log(role_details);
    this.edit_role_details = role_details;
    this.rolesService.getRolePermissions(this.edit_role_details.id).subscribe(
      response => {
        console.log(response);
        this.edit_role_permissions_response = response;
        this.edit_role_permissions_response.forEach((permission: any) => {
          if (permission.status == true) {
            if (this.g.controls[permission.permission_name]) {
              this.g.removeControl(permission.permission_name);
              this.g.addControl(permission.permission_name, new FormControl(true));
            }
            else {
              this.g.addControl(permission.permission_name, new FormControl(true));
            }
          }
          else {
            this.g.addControl(permission.permission_name, new FormControl(false));
          }
        })
      },
      err => {
        console.log(err);
      }
    );
  }

  save_role(role_id: any) {
    console.log(role_id);
    console.log(this.EditRoleForm);
    this.rolesService.editRole(role_id, this.EditRoleForm.value).subscribe(
      response => {
        console.log(response);
        this.modalClose.nativeElement.click();
        this.toastr.success('Successfully updated Role details');
      },
      err => {
        console.log(err);
      }
    );
  }

  deleteRole(role_details: any) {
    this.delete_role_details = role_details;
  }

  delete_role(role_id: any) {
    this.rolesService.deleteRole(role_id).subscribe(
      response => {
        console.log(response);
        this.toastr.success('Role successfully deleted');
        this.DeletemodalClose.nativeElement.click();
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate([this.router.url]);
      },
      err => {
        console.log(err);
      }
    );
  }

}
