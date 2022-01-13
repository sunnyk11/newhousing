import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RolesService } from '../../services/roles.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-role',
  templateUrl: './create-role.component.html',
  styleUrls: ['./create-role.component.css']
})
export class CreateRoleComponent implements OnInit {

  public submitted: boolean = false;
  public permissions_data: any;
  public arrayItems:any;
  public RoleForm: any;

  constructor(private fb: FormBuilder,
    private rolesService: RolesService,
    private toastr: ToastrService) {
      this.RoleForm = this.fb.group({
        roleName: ['', Validators.required],
        roleDesc: [''],
        permissionsArray: this.fb.group([])
      });
     }

  ngOnInit(): void {
    
    this.get_permissions();
  }

  get g() {
    return this.RoleForm.controls;
  }

  get f() {
    return this.RoleForm.controls.permissionsArray;
  }


  get_permissions() {
    this.rolesService.getPermissions({ param:null }).subscribe(
      response => {
        console.log(response);
        this.permissions_data = response;
        const group: any = {};
        this.permissions_data.data.forEach((obj:any,index:any) => {
          //group[obj.permission_name] = new FormControl(false);
          this.f.addControl(obj.permission_name, new FormControl(false));
        });
        console.log(group);
      },
      err => {
        console.log(err);
      }
    );
  }

  onSubmit() {
    this.submitted = true;
    if (this.RoleForm.invalid) {
      return;
    }
    console.log(this.RoleForm);
    console.log(this.f);
    this.rolesService.createRole(this.RoleForm.value).subscribe(
      response => {
        console.log(response);
        this.toastr.success('Successfully created Role');
      },
      err => {
        console.log(err);
      }
    );
    this.RoleForm.reset();
  }

}
